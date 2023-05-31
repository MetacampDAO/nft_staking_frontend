import * as anchor from "@project-serum/anchor";
import { Metaplex, PublicKey } from "@metaplex-foundation/js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Demo } from "./idl/demo";
import { Connection } from "@solana/web3.js";

export const getUserInfoData = async (
  program: anchor.Program<Demo>,
  userPubkey: PublicKey
) => {
  const [userInfo, _userInfoBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("user")),
      userPubkey.toBuffer(),
    ],
    program.programId
  );
  try {
    const userInfoData = await program.account.userInfo.fetch(userInfo);
    return userInfoData;
  } catch (error) {
    return null;
  }
};

export const getAllUserStakeNft = async (
  program: anchor.Program<Demo>,
  userPubkey: PublicKey
) => {
  const filter = [
    {
      memcmp: {
        offset: 8, //prepend for anchor's discriminator & tokenAccount
        bytes: userPubkey.toBase58(),
      },
    },
  ];
  const res = await program.account.userStakeInfo.all(filter);
  const metaplex = new Metaplex(program.provider.connection);
  const data = await Promise.all(
    res.map(async (item) => {
      const tokenInfo = await metaplex
        .nfts()
        .findByMint({ mintAddress: item.account.mint });
      return { pdaInfo: item, tokenInfo };
    })
  );

  return data;
};

const MINT1 = "E77GQLENiyjomuq15BVH2c7AHhhNFjQ8nagmQJQmuzyS";
const MINT2 = "CGhZc8ReBVGoCkbfPnsXYSqCWAcny1YU9aR2GW3MWaoG";
const COLLECTION_MINT = [MINT1, MINT2];

// UPDATE AMOUNT TO DISPLAY ONLY NON-DELEGATED
export const getAllMintOwnedByUser = async (
  connection: Connection,
  userPubkey: PublicKey
) => {
  const metaplex = new Metaplex(connection);
  const allTokeAccountByOwner = await metaplex
    .nfts()
    .findAllByOwner({ owner: userPubkey });

  const eligibleMints = allTokeAccountByOwner.filter((tokenAccount) =>
    COLLECTION_MINT.includes(tokenAccount.mintAddress.toString())
  );
  const data = await Promise.all(
    eligibleMints.map(
      async (item) =>
        await metaplex.nfts().findByMint({ mintAddress: item.mintAddress })
    )
  );
  return data;
};

export const getAllUserPda = async (
  program: anchor.Program<Demo>,
  staker: PublicKey,
  mint: PublicKey
) => {
  const [userStakeInfo, _userStakeInfoBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("stake_info")),
      staker.toBuffer(),
      mint.toBuffer(),
    ],
    program.programId
  );

  const userNftAccount = await getAssociatedTokenAddress(mint, staker);

  const pdaNftAccount = await getAssociatedTokenAddress(
    mint,
    userStakeInfo,
    true
  );

  const [userInfo, _userInfoBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("user")), staker.toBuffer()],
    program.programId
  );

  return {
    userNftAccount,
    pdaNftAccount,
    userStakeInfo,
    userInfo,
  };
};
