import {
  AccountMeta,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  getMxState,
  getRemainingAccountsByGuardType,
  mintV2Instruction,
} from "./mXStore";

const mintNftV3 = async (
  connection: Connection,
  minterWallet: WalletContextState
) => {
  const { METAPLEX } = getMxState(connection);
  const candyMachine = await METAPLEX.candyMachines().findByAddress({
    address: new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!),
  });

  if (!candyMachine || !minterWallet.publicKey) return null;

  if (!candyMachine.candyGuard)
    return Promise.reject(
      new Error(
        "This app only works with Candy Guards. Please setup your Guards through Sugar."
      )
    );

  const { guards } = candyMachine.candyGuard;

  /** Filter only enabled Guards */
  const enabledGuards =
    guards && Object.keys(guards).filter((guardKey) => guards[guardKey]);

  let remainingAccounts: AccountMeta[] = [];
  if (enabledGuards.length) {
    /** Map all Guards and grab their remaining accounts */
    enabledGuards.forEach((guard) => {
      const candyGuard = candyMachine.candyGuard?.guards[guard];

      if (!candyGuard) return null;
      const remaining = getRemainingAccountsByGuardType(candyGuard, guard);

      /** Push to the accounts array */
      if (remaining.length) {
        remainingAccounts.push(...remaining);
      }
    });
  }
  const mint = Keypair.generate();
  const { instructions } = await mintV2Instruction(
    candyMachine.candyGuard?.address,
    candyMachine.address,
    minterWallet.publicKey,
    minterWallet.publicKey,
    mint,
    connection,
    METAPLEX,
    remainingAccounts
  );

  const tx = new Transaction().add(...instructions);

  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const txid = await minterWallet.sendTransaction(tx, connection, {
    signers: [mint],
  });

  const latest = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latest.blockhash,
    lastValidBlockHeight: latest.lastValidBlockHeight,
    signature: txid,
  });
};

export default mintNftV3;
