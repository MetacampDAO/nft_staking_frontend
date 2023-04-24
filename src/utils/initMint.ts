import {
  keypairIdentity,
  Metaplex,
  NftWithToken,
} from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create candy machine using sugar CLI
//! Assume CM created { CmId & CollectionID Provided }
// Mint via CM
// Stake NFT
// Redeem
// Unstake
// View points in UIs
export const setupMintCollection = async (
  connection: Connection,
  owner: PublicKey
) => {
  console.log("Creating collection ...");
  const staker = Keypair.generate();
  await connection.confirmTransaction(
    await connection.requestAirdrop(staker.publicKey, 1e9)
  );
  // Create collection NFT
  const collection = await createNft(connection, staker);
  console.log(`Collection ${collection.address} created`);

  console.log("Creating NFT ...");
  // Create NFT
  const nft = await createNft(connection, staker, owner);
  console.log(`NFT ${nft.address} created`);

  console.log("Adding and verifying Collection NFT to Mint NFT ... ");
  // Add and verify NFT to collection
  const signature = await addAndVerifyCollection(
    connection,
    staker,
    nft.address,
    collection.address
  );
  console.log(`Collection NFT added to Mint NFT ${signature}`);

  return { nftCollection: collection.address, nftMint: nft.address };
};

const createNft = async (
  connection: Connection,
  signer: Keypair,
  owner?: PublicKey
): Promise<NftWithToken> => {
  // Setup Metaplex bundlrStorage and signer
  const metaplex = Metaplex.make(connection).use(keypairIdentity(signer));

  const uri =
    "https://nftstorage.link/ipfs/bafkreihthebbs5f3k4pbl2yse3i6n5hweboqes2upf2ckip75qdelfl5ge";

  // Send tx to Solana and create NFT
  const data = await metaplex.nfts().create({
    uri: uri,
    name: "DEMO",
    sellerFeeBasisPoints: 100,
    symbol: "DMO",
    tokenOwner: owner || signer.publicKey,
    // maxSupply: null
  });
  console.log(`Token Mint: ${data.nft.address.toString()}`);

  console.log(
    `Explorer: https://explorer.solana.com/address/${data.nft.address.toString()}?cluster=devnet`
  );

  // console.log(`NFT: ${JSON.stringify(data, null, 2)}`)

  return data.nft;
};

const addAndVerifyCollection = async (
  connection: Connection,
  signer: Keypair,
  mintAddress: PublicKey,
  collection: PublicKey
) => {
  // Set up Metaplex with signer
  const metaplex = Metaplex.make(connection).use(keypairIdentity(signer));

  // Get "NftWithToken" type from mint address
  const nft = await metaplex.nfts().findByMint({ mintAddress });

  // Update metaplex data and add collection
  await metaplex.nfts().update({
    nftOrSft: nft,
    collection: collection,
  });

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  );

  console.log(
    `Waiting to verify collection ${collection} on mint ${mintAddress}... `
  );

  // verify collection by owner
  const { response } = await metaplex.nfts().verifyCollection({
    mintAddress: mintAddress,
    collectionMintAddress: collection,
    isSizedCollection: false,
  });

  console.log(
    `Verification: https://explorer.solana.com/signuature/${response.signature}?cluster=devnet`
  );

  return response.signature;
};

//! Function return all user mint account of given collection Id
const candyMachineState = async () => {};
