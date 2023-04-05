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
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { getMxState, verifyMint } from "@/utils/mxFunction/mXStore";

export default function Home() {
  const [candyMachine, setCandyMachine] = useState<any>(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    (async () => {
      const { METAPLEX } = getMxState(connection);
      const candyMachine = await METAPLEX.candyMachines().findByAddress({
        address: new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!),
      });

      setCandyMachine(candyMachine);
    })();
  }, []);

  return (
    <HomeContainer>
      <CTAContainer>
        <CTAInfoContainer>
          <MintInfosContainer>
            <MintInfoLeftContainer>
              <MintInfoContainer>
                <MintInfoTitle>Remaining</MintInfoTitle>
                <MintInfoData>
                  {candyMachine?.itemsRemaining.toNumber() ?? ""}
                </MintInfoData>
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
          {/* <CTAButton onClick={() => verifyMint(connection)}>Verify</CTAButton> */}
        </CTAInfoContainer>
      </CTAContainer>
    </HomeContainer>
  );
}
