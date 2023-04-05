import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const getMxState = (connection: Connection) => {
  const bytesString = bs58.decode(process.env.NEXT_PUBLIC_CM_UPDATE_AUTHORITY!);
  const KP = Keypair.fromSecretKey(bytesString);
  const METAPLEX = Metaplex.make(connection).use(keypairIdentity(KP));
  return { METAPLEX, KP };
};

export default getMxState;
