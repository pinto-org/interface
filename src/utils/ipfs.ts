// IPFS Gateway configurations with fallbacks
const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://dweb.link/ipfs/",
] as const;

// Convert IPFS URL to HTTP gateway URL
export const convertIpfsUrl = (ipfsUrl: string, gatewayIndex = 0): string => {
  if (!ipfsUrl) return "";

  // Handle different IPFS URL formats
  if (ipfsUrl.startsWith("ipfs://")) {
    const hash = ipfsUrl.replace("ipfs://", "");
    return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
  }

  if (ipfsUrl.startsWith("Qm") || ipfsUrl.startsWith("baf")) {
    return `${IPFS_GATEWAYS[gatewayIndex]}${ipfsUrl}`;
  }

  // Already an HTTP URL
  if (ipfsUrl.startsWith("http")) {
    return ipfsUrl;
  }

  return ipfsUrl;
};

// Fetch with multiple gateway fallbacks
export const fetchWithFallback = async (ipfsUrl: string): Promise<Response> => {
  let lastError: Error | null = null;

  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    try {
      const url = convertIpfsUrl(ipfsUrl, i);
      const response = await fetch(url, {
        headers: {
          Accept: "application/json, image/*",
        },
      });

      if (response.ok) {
        return response;
      }

      lastError = new Error(`Gateway ${i} failed with status: ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      console.warn(`IPFS Gateway ${i} failed:`, error);
    }
  }

  throw lastError || new Error("All IPFS gateways failed");
};

// NFT Metadata interface
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
}

// Fetch and parse NFT metadata
export const fetchNFTMetadata = async (tokenURI: string): Promise<NFTMetadata> => {
  if (!tokenURI) {
    throw new Error("Token URI is required");
  }

  try {
    const response = await fetchWithFallback(tokenURI);
    const metadata: NFTMetadata = await response.json();

    // Validate required fields
    if (!metadata.name || !metadata.image) {
      throw new Error("Invalid metadata: missing required fields");
    }

    return metadata;
  } catch (error) {
    console.error("Failed to fetch NFT metadata:", error);
    throw error;
  }
};

// Get optimized image URL (convert IPFS if needed)
export const getOptimizedImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";

  return convertIpfsUrl(imageUrl);
};
