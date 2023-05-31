import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  HeaderContainer,
  HeaderInfo,
  HeaderInfoContainer,
  HeaderTitle,
  HomeContainer,
  ImageButton,
  ImageCard,
  Vault,
  VaultContainer,
  VaultItems,
  VaultTitle,
} from "@/styles/home";
import { useEffect, useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAllMintOwnedByUser,
  getAllUserStakeNft,
  getUserInfoData,
} from "@/utils/getPda";
import {
  createRedeemIx,
  createStakeIx,
  createUnstakeIx,
  getNftStakingProgram,
  signAndSendTx,
} from "@/utils/createIx";
import { IdlAccounts, Program, ProgramAccount } from "@project-serum/anchor";
import Image from "next/image";
import { Demo, IDL } from "@/utils/idl/demo";
import { Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";

type UserStakeInfoStruct = IdlAccounts<Demo>["userStakeInfo"];
type UserInfoStruct = IdlAccounts<Demo>["userInfo"];
interface UserStakeInfoType {
  pdaInfo: ProgramAccount<UserStakeInfoStruct>;
  tokenInfo: Sft | SftWithToken | Nft | NftWithToken;
}

export default function Home() {
  const [mintInWallet, setMintInWallet] = useState<
    (Sft | SftWithToken | Nft | NftWithToken)[] | []
  >([]);
  const [nftStakingProgram, setNftStakingProgram] =
    useState<Program<Demo> | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoStruct | null>(null);
  const [allUserStakeInfo, setAllUserStakeInfo] = useState<
    UserStakeInfoType[] | null
  >(null);

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (wallet) {
      (async () => {
        const program = getNftStakingProgram(
          connection,
          wallet,
          IDL,
          new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!)
        );
        setNftStakingProgram(program);

        // GET ALL USER STAKE INFO
        const allUserStakeInfo = await getAllUserStakeNft(
          program,
          wallet.publicKey
        );
        setAllUserStakeInfo(allUserStakeInfo);

        // GET USER INFO
        const userInfo = await getUserInfoData(program, wallet.publicKey);
        setUserInfo(userInfo);

        // GET ALL ELIGIBLE MINT BY USER
        const eligibleMint = await getAllMintOwnedByUser(
          program.provider.connection,
          wallet.publicKey
        );
        setMintInWallet(eligibleMint);
      })();
    }
  }, [wallet]);

  const handleStake = async (mint: PublicKey) => {
    if (wallet && nftStakingProgram && mint) {
      const stakeIx = await createStakeIx(
        nftStakingProgram,
        wallet.publicKey,
        mint // Selected Mint
      );

      const tx = new Transaction();
      tx.add(stakeIx);
      const txSig = await signAndSendTx(connection, tx, wallet);
      console.log(`https://solscan.io/tx/${txSig}?cluster=devnet`);
      const allUserStakeInfo = await getAllUserStakeNft(
        nftStakingProgram,
        wallet.publicKey
      );
      setAllUserStakeInfo(allUserStakeInfo);
      const eligibleMint = await getAllMintOwnedByUser(
        nftStakingProgram.provider.connection,
        wallet.publicKey
      );
      setMintInWallet(eligibleMint);
    }
  };
  const handleRedeem = async (mint: PublicKey) => {
    if (wallet && nftStakingProgram && mint) {
      const stakeIx = await createRedeemIx(
        nftStakingProgram,
        wallet.publicKey,
        mint
      );

      const tx = new Transaction();
      tx.add(stakeIx);
      const txSig = await signAndSendTx(connection, tx, wallet);
      console.log(`https://solscan.io/tx/${txSig}?cluster=devnet`);
      const userInfo = await getUserInfoData(
        nftStakingProgram,
        wallet.publicKey
      );
      setUserInfo(userInfo);
    }
  };
  const handleUnstake = async (mint: PublicKey) => {
    if (wallet && nftStakingProgram && mint) {
      const stakeIx = await createUnstakeIx(
        nftStakingProgram,
        wallet.publicKey,
        mint
      );

      const tx = new Transaction();
      tx.add(stakeIx);
      const txSig = await signAndSendTx(connection, tx, wallet);
      console.log(`https://solscan.io/tx/${txSig}?cluster=devnet`);
      const allUserStakeInfo = await getAllUserStakeNft(
        nftStakingProgram,
        wallet.publicKey
      );
      setAllUserStakeInfo(allUserStakeInfo);
      const eligibleMint = await getAllMintOwnedByUser(
        nftStakingProgram.provider.connection,
        wallet.publicKey
      );
      setMintInWallet(eligibleMint);
      const userInfo = await getUserInfoData(
        nftStakingProgram,
        wallet.publicKey
      );
      setUserInfo(userInfo);
    }
  };

  return (
    <HomeContainer>
      <HeaderContainer>
        <HeaderInfoContainer>
          <HeaderTitle>NFT Staking Protocol</HeaderTitle>
          {userInfo && (
            <HeaderInfo>{`Total Rewards: ${userInfo.pointBalance}`}</HeaderInfo>
          )}
        </HeaderInfoContainer>
      </HeaderContainer>
      <VaultContainer>
        <Vault>
          <VaultTitle>Wallet</VaultTitle>
          <VaultItems>
            {mintInWallet &&
              mintInWallet.map((mintInfo, key) => (
                <ImageCard key={key}>
                  <Image
                    src={mintInfo.json?.image || ""}
                    alt={mintInfo.name}
                    width={240}
                    height={240}
                  />
                  <ImageButton
                    onClick={() => handleStake(mintInfo.mint.address)}
                  >
                    Stake
                  </ImageButton>
                </ImageCard>
              ))}
          </VaultItems>
        </Vault>
        <Vault>
          <VaultTitle>Vault</VaultTitle>
          <VaultItems>
            {allUserStakeInfo &&
              allUserStakeInfo.map(
                (userStakeInfo, key) =>
                  userStakeInfo.pdaInfo.account.stakeState === 1 && (
                    <ImageCard key={key}>
                      <Image
                        src={userStakeInfo.tokenInfo.json?.image || ""}
                        alt={userStakeInfo.tokenInfo.name}
                        width={240}
                        height={240}
                      />
                      <ImageButton
                        onClick={() =>
                          handleUnstake(userStakeInfo.pdaInfo.account.mint)
                        }
                      >
                        Unstake
                      </ImageButton>
                      <ImageButton
                        onClick={() =>
                          handleRedeem(userStakeInfo.pdaInfo.account.mint)
                        }
                      >
                        Redeem
                      </ImageButton>
                    </ImageCard>
                  )
              )}
          </VaultItems>
        </Vault>
      </VaultContainer>
    </HomeContainer>
  );
}
