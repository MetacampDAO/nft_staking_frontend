import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import mintNftV3 from "@/utils/mxFunction/mintNftV3";
import {
  CTAButton,
  CTAContainer,
  CTAInfoContainer,
  HomeContainer,
  InfoDataContainer,
  MintInfoContainer,
  MintInfoData,
  MintInfoLeftContainer,
  MintInfosContainer,
  MintInfoTitle,
} from "@/styles/home";

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return (
    <HomeContainer>
      <CTAContainer>
        <CTAInfoContainer>
          <MintInfosContainer>
            <MintInfoLeftContainer>
              <MintInfoContainer>
                <MintInfoTitle>Remaining</MintInfoTitle>
                <MintInfoData>8</MintInfoData>
              </MintInfoContainer>
              <MintInfoContainer>
                <MintInfoTitle>Price</MintInfoTitle>
                <MintInfoData>@ 0.1</MintInfoData>
              </MintInfoContainer>
            </MintInfoLeftContainer>
            <MintInfoContainer>
              <InfoDataContainer>LIVE</InfoDataContainer>
            </MintInfoContainer>
          </MintInfosContainer>
          <CTAButton onClick={() => mintNftV3(connection, wallet)}>
            Mint
          </CTAButton>
        </CTAInfoContainer>
      </CTAContainer>
    </HomeContainer>
  );
}
