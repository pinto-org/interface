import { abiSnippets } from "@/constants/abiSnippets";
import { imageCache, imageToDataUrl, metadataCache } from "@/utils/imageCache";
import { type NFTMetadata, fetchNFTMetadata, getOptimizedImageUrl } from "@/utils/ipfs";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

interface UseNFTImageResult {
  imageUrl: string | null;
  metadata: NFTMetadata | null;
  loading: boolean;
  error: string | null;
}

export const useNFTImage = (contractAddress: string, tokenId: number): UseNFTImageResult => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query tokenURI from contract
  const { data: tokenURI, error: contractError } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abiSnippets.erc721Enum,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
    query: {
      enabled: !!contractAddress && tokenId > 0,
    },
  });

  useEffect(() => {
    const loadNFTImage = async () => {
      if (!tokenURI || contractError) {
        setLoading(false);
        setError(contractError?.message || "No token URI available");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const cacheKey = `${contractAddress}_${tokenId}`;

        // Check cached image first
        const cachedImageUrl = await imageCache.get(tokenId);
        if (cachedImageUrl) {
          setImageUrl(cachedImageUrl);

          // Still load metadata if not cached
          const cachedMetadata = metadataCache.get(cacheKey);
          if (cachedMetadata) {
            setMetadata(cachedMetadata);
            setLoading(false);
          }
        }

        // Fetch metadata from IPFS
        const nftMetadata = await fetchNFTMetadata(tokenURI);

        // Cache metadata
        metadataCache.set(cacheKey, nftMetadata);
        setMetadata(nftMetadata);

        if (nftMetadata.image) {
          const optimizedImageUrl = getOptimizedImageUrl(nftMetadata.image);

          // Try to load original high-quality image first
          try {
            // Test if we can load the original image directly
            const testImage = new Image();
            testImage.crossOrigin = "anonymous";

            const canLoadOriginal = await new Promise<boolean>((resolve) => {
              testImage.onload = () => resolve(true);
              testImage.onerror = () => resolve(false);
              testImage.src = optimizedImageUrl;
            });

            if (canLoadOriginal) {
              setImageUrl(optimizedImageUrl);

              // Also cache it for future fallback
              try {
                const dataUrl = await imageToDataUrl(optimizedImageUrl);
                await imageCache.set(tokenId, optimizedImageUrl, dataUrl);
              } catch (cacheError) {
                // Silently ignore cache errors
              }
            } else {
              throw new Error("Cannot load original image");
            }
          } catch (imageError) {
            // Fallback to cached version if available
            if (cachedImageUrl) {
              setImageUrl(cachedImageUrl);
            } else {
              setImageUrl(optimizedImageUrl); // Last resort - try direct URL anyway
            }
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load NFT data");
        setLoading(false);
      }
    };

    loadNFTImage();
  }, [tokenURI, contractError, contractAddress, tokenId]);

  return {
    imageUrl,
    metadata,
    loading,
    error,
  };
};

// Hook for batch loading multiple NFTs (for grid views)
export const useNFTImages = (contractAddress: string, tokenIds: number[]) => {
  const [results, setResults] = useState<Record<number, UseNFTImageResult>>({});
  const [globalLoading, setGlobalLoading] = useState(true);

  useEffect(() => {
    const loadAllImages = async () => {
      setGlobalLoading(true);
      const newResults: Record<number, UseNFTImageResult> = {};

      // Initialize all results
      tokenIds.forEach((tokenId) => {
        newResults[tokenId] = {
          imageUrl: null,
          metadata: null,
          loading: true,
          error: null,
        };
      });

      setResults(newResults);

      // Load images in batches to avoid overwhelming IPFS gateways
      const batchSize = 5;
      for (let i = 0; i < tokenIds.length; i += batchSize) {
        const batch = tokenIds.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (tokenId) => {
            try {
              // This is a simplified version - in practice you'd want to implement
              // the full loading logic here or use the individual hook
              const cacheKey = `${contractAddress}_${tokenId}`;
              const cachedImageUrl = await imageCache.get(tokenId);
              const cachedMetadata = metadataCache.get(cacheKey);

              newResults[tokenId] = {
                imageUrl: cachedImageUrl,
                metadata: cachedMetadata,
                loading: !cachedImageUrl || !cachedMetadata,
                error: null,
              };
            } catch (error) {
              newResults[tokenId] = {
                imageUrl: null,
                metadata: null,
                loading: false,
                error: error instanceof Error ? error.message : "Loading failed",
              };
            }
          }),
        );

        // Update results after each batch
        setResults({ ...newResults });

        // Small delay between batches
        if (i + batchSize < tokenIds.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setGlobalLoading(false);
    };

    if (tokenIds.length > 0) {
      loadAllImages();
    } else {
      setGlobalLoading(false);
    }
  }, [contractAddress, tokenIds]);

  return {
    results,
    loading: globalLoading,
  };
};
