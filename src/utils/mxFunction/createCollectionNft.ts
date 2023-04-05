import { Connection } from "@solana/web3.js";
import React from "react";
import getMxState from "./getMxState";

const createCollectionNft = async (connection: Connection) => {
  const { METAPLEX, KP } = getMxState(connection);
  const { nft: collectionNft } = await METAPLEX.nfts().create({
    name: "QuickNode Demo NFT Collection",
    uri: "NFT_METADATA",
    sellerFeeBasisPoints: 0,
    isCollection: true,
    updateAuthority: KP,
  });

  console.log(
    `✅ - Minted Collection NFT: ${collectionNft.address.toString()}`
  );
  console.log(
    `     https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`
  );
};

export default createCollectionNft;
