import {
  SolPaymentGuardSettings,
  Option,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";
import bs58 from "bs58";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_SLOT_HASHES_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  ComputeBudgetProgram,
  AccountMeta,
} from "@solana/web3.js";
import { BN } from "bn.js";
import {
  AccountVersion,
  CandyMachine,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-candy-machine-core";
import {
  createMintV2Instruction,
  MintV2InstructionAccounts,
  MintV2InstructionArgs,
} from "@metaplex-foundation/mpl-candy-guard";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const CANDY_MACHINE_PROGRAM = PROGRAM_ID;
export const METAPLEX_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

/** To mint from the candy guard as a minter */
/** From: https://github.com/metaplex-foundation/mpl-candy-guard/blob/main/js/test/setup/txs-init.ts#L679  */
export const mintV2Instruction = async (
  candyGuard: PublicKey,
  candyMachine: PublicKey,
  minter: PublicKey,
  payer: PublicKey,
  mint: Keypair,
  connection: Connection,
  metaplex: Metaplex,
  remainingAccounts?: AccountMeta[] | null,
  mintArgs?: Uint8Array | null,
  label?: string | null
): Promise<{ instructions: TransactionInstruction[] }> => {
  // candy machine object
  const candyMachineObject = await CandyMachine.fromAccountAddress(
    connection,
    candyMachine
  );

  const nftMetadata = metaplex.nfts().pdas().metadata({ mint: mint.publicKey });
  const nftMasterEdition = metaplex
    .nfts()
    .pdas()
    .masterEdition({ mint: mint.publicKey });
  const nftTokenAccount = metaplex
    .tokens()
    .pdas()
    .associatedTokenAccount({ mint: mint.publicKey, owner: minter });

  const authorityPda = metaplex
    .candyMachines()
    .pdas()
    .authority({ candyMachine });

  const collectionMint = candyMachineObject.collectionMint;
  // retrieves the collection nft
  const collection = await metaplex
    .nfts()
    .findByMint({ mintAddress: collectionMint });
  // collection PDAs
  const collectionMetadata = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: collectionMint });
  const collectionMasterEdition = metaplex
    .nfts()
    .pdas()
    .masterEdition({ mint: collectionMint });

  const collectionDelegateRecord = metaplex
    .nfts()
    .pdas()
    .metadataDelegateRecord({
      mint: collectionMint,
      type: "CollectionV1",
      updateAuthority: collection.updateAuthorityAddress,
      delegate: authorityPda,
    });

  const accounts: MintV2InstructionAccounts = {
    candyGuard,
    candyMachineProgram: CANDY_MACHINE_PROGRAM,
    candyMachine,
    payer: payer,
    minter: minter,
    candyMachineAuthorityPda: authorityPda,
    nftMasterEdition: nftMasterEdition,
    nftMetadata,
    nftMint: mint.publicKey,
    nftMintAuthority: payer,
    token: nftTokenAccount,
    collectionUpdateAuthority: collection.updateAuthorityAddress,
    collectionDelegateRecord,
    collectionMasterEdition,
    collectionMetadata,
    collectionMint,
    tokenMetadataProgram: METAPLEX_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    splTokenProgram: TOKEN_PROGRAM_ID,
    splAtaProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    recentSlothashes: SYSVAR_SLOT_HASHES_PUBKEY,
  };

  if (candyMachineObject.version == AccountVersion.V2) {
    accounts.tokenRecord = metaplex
      .nfts()
      .pdas()
      .tokenRecord({ mint: mint.publicKey, token: nftTokenAccount });
  }

  if (!mintArgs) {
    mintArgs = new Uint8Array();
  }

  const args: MintV2InstructionArgs = {
    mintArgs,
    label: label ?? null,
  };

  const ixs: TransactionInstruction[] = [];

  const mintIx = createMintV2Instruction(accounts, args);
  // this test always initializes the mint, we we need to set the
  // account to be writable and a signer to avoid warnings
  for (let i = 0; i < mintIx.keys.length; i++) {
    if (mintIx.keys[i].pubkey.toBase58() === mint.publicKey.toBase58()) {
      mintIx.keys[i].isSigner = true;
      mintIx.keys[i].isWritable = true;
    }
  }

  if (remainingAccounts) {
    mintIx.keys.push(...remainingAccounts);
  }

  const data = Buffer.from(
    Uint8Array.of(
      0,
      ...new BN(600000).toArray("le", 4),
      ...new BN(0).toArray("le", 4)
    )
  );

  const additionalComputeIx: TransactionInstruction =
    new TransactionInstruction({
      keys: [],
      programId: ComputeBudgetProgram.programId,
      data,
    });

  ixs.push(additionalComputeIx);
  ixs.push(mintIx);

  return { instructions: ixs };
};

export const getMxState = (connection: Connection) => {
  const METAPLEX = Metaplex.make(connection);

  return { METAPLEX };
};

export const verifyMint = async (connection: Connection) => {
  const bytesString = bs58.decode(process.env.NEXT_PUBLIC_CM_UPDATE_AUTHORITY!);
  const KP = Keypair.fromSecretKey(bytesString);
  const METAPLEX = Metaplex.make(connection).use(keypairIdentity(KP));

  const nftMetadata = await METAPLEX.nfts().findByMint({
    mintAddress: new PublicKey("HAczgDq7orzn3zoW3KQuaNx1zR3eaycwK42ZF4iJGZLr"),
  });

  await METAPLEX.nfts().update({
    nftOrSft: nftMetadata,
    creators: [
      {
        address: new PublicKey("FfMRMUhPzmGafrCG4YopZQJrmjM6cY6XxgT5t6Wh5nfW"),
        share: 0,
      },
      {
        address: new PublicKey("Hoog9j2SyeJKha1jWBfba3qtx433zm45eiTn7nWwM4gm"),
        share: 100,
        authority: KP,
      },
    ],
  });

  return { METAPLEX };
};

export const getRemainingAccountsByGuardType = (
  guard: Option<SolPaymentGuardSettings | object>,
  guardType: string
) => {
  const remainingAccs: {
    [key: string]: () => AccountMeta[];
  } = {
    solPayment: () => {
      const solPaymentGuard = guard as SolPaymentGuardSettings;

      return [
        {
          pubkey: solPaymentGuard.destination,
          isSigner: false,
          isWritable: true,
        },
      ];
    },
  };

  if (!remainingAccs[guardType]) {
    console.warn(
      "Couldn't find remaining accounts for Guard " +
        guardType +
        ". This can most likely cause the mint tx to fail."
    );

    return [];
  }

  return remainingAccs[guardType]();
};
