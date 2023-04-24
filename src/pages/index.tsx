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
  getAllUserStakeInfo,
  getUserInfo,
} from "@/utils/getPda";
import {
  createRedeemIx,
  createStakeIx,
  createUnstakeIx,
  getNftStakingProgram,
  signAndSendTx,
} from "@/utils/createIx";
import { IdlAccounts, Program, ProgramAccount } from "@project-serum/anchor";
import { setupMintCollection } from "@/utils/initMint";
import Image from "next/image";
import { Demo, IDL } from "@/utils/idl/demo";
import {
  JsonMetadata,
  Metadata,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";

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
          new PublicKey("81MRLWNW25VrFiUw7usFDwB2cR87kMqzVLXS1xE4YtU6")
        );
        const allUserStakeInfo = await getAllUserStakeInfo(
          program,
          wallet.publicKey
        );
        setNftStakingProgram(program);
        const userInfo = await getUserInfo(program, wallet.publicKey);
        setUserInfo(userInfo);
        setAllUserStakeInfo(allUserStakeInfo);
        const eligibleMint = await getAllMintOwnedByUser(
          program.provider.connection,
          wallet.publicKey
        );
        setMintInWallet(eligibleMint);
      })();
    }
  }, [wallet]);

  // Allow user to select a mint and stake

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
      const allUserStakeInfo = await getAllUserStakeInfo(
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
      const userInfo = await getUserInfo(nftStakingProgram, wallet.publicKey);
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
      const allUserStakeInfo = await getAllUserStakeInfo(
        nftStakingProgram,
        wallet.publicKey
      );
      setAllUserStakeInfo(allUserStakeInfo);
      const eligibleMint = await getAllMintOwnedByUser(
        nftStakingProgram.provider.connection,
        wallet.publicKey
      );
      setMintInWallet(eligibleMint);
      const userInfo = await getUserInfo(nftStakingProgram, wallet.publicKey);
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
                  Object.keys(
                    userStakeInfo.pdaInfo.account.stakeState
                  ).includes("stake") && (
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
