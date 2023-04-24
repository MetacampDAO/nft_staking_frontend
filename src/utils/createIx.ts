import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Idl } from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { getProgramPdaAddress } from "./getPda";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Demo } from "./idl/demo";

export const getNftStakingProgram = (
  connection: Connection,
  wallet: AnchorWallet,
  idl: Idl,
  programId: PublicKey
) => {
  //instantiating program depends on the environment
  if (!idl) {
    console.log("IDL File Required");
  }
  if (!programId) {
    console.log("ProgramID Required");
  }

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  anchor.setProvider(provider);

  const nftStakingProgram = new anchor.Program<Demo>(
    idl as any,
    programId,
    provider
  );

  return nftStakingProgram;
};

export const createStakeIx = async (
  program: anchor.Program<Demo>,
  staker: PublicKey,
  nftMint: PublicKey
) => {
  const {
    userNftAccount,
    pdaNftAccount,
    metadataAddress,
    userStakeInfo,
    userInfo,
  } = await getProgramPdaAddress(program, staker, nftMint);

  const ix = await program.methods
    .stake()
    .accounts({
      userInfo: userInfo,
      stakingInfo: userStakeInfo,
      initializer: staker,
      userNftAccount: userNftAccount,
      pdaNftAccount: pdaNftAccount,
      nftMetadata: metadataAddress,
      mint: nftMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .instruction();

  return ix;
};

export const createRedeemIx = async (
  program: anchor.Program<Demo>,
  staker: PublicKey,
  nftMint: PublicKey
) => {
  const { pdaNftAccount, userInfo, userStakeInfo } = await getProgramPdaAddress(
    program,
    staker,
    nftMint
  );

  const ix = await program.methods
    .redeem()
    .accounts({
      userInfo: userInfo,
      stakingInfo: userStakeInfo,
      payer: staker,
      pdaNftAccount: pdaNftAccount,
      mint: nftMint,
    })
    .instruction();

  return ix;
};

export const createUnstakeIx = async (
  program: anchor.Program<Demo>,
  staker: PublicKey,
  nftMint: PublicKey
) => {
  const { userNftAccount, pdaNftAccount, userInfo, userStakeInfo } =
    await getProgramPdaAddress(program, staker, nftMint);

  const ix = await program.methods
    .unstake()
    .accounts({
      userInfo: userInfo,
      stakingInfo: userStakeInfo,
      initializer: staker,
      userNftAccount: userNftAccount,
      pdaNftAccount: pdaNftAccount,
      mint: nftMint,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  return ix;
};

export const signAndSendTx = async (
  connection: Connection,
  tx: Transaction,
  wallet: AnchorWallet
) => {
  tx.recentBlockhash = (
    await connection.getLatestBlockhash("singleGossip")
  ).blockhash;
  tx.feePayer = wallet.publicKey;
  const signedTx = await wallet.signTransaction(tx);
  const rawTransaction = signedTx.serialize();
  const txSig = await connection.sendRawTransaction(rawTransaction);

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: txSig,
  });

  return txSig;
};
