export const externalLinks = {
  announcingPinto:
    "https://mirror.xyz/0xEA13D1fB14934E41Ee7074198af8F089a6d956B5/V3m5m2h4Lx3Kq_Rwf4tyPXRpus_clTnkOyNxfYAwAsU",
  nftMarketplace: "https://opensea.io/collection/pinto-beaver-genesis",
};

/**
 * Generate OpenSea URL for a specific NFT token
 * @param contractAddress - The contract address of the NFT
 * @param tokenId - The token ID
 * @param chainName - The blockchain name (defaults to 'base' for Base network)
 * @returns The complete OpenSea URL for the specific token
 */
export const getOpenSeaTokenUrl = (contractAddress: string, tokenId: number, chainName: string = "base"): string => {
  return `https://opensea.io/assets/${chainName}/${contractAddress}/${tokenId}`;
};
