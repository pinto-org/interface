import { imageCache, imageToDataUrl } from "@/utils/imageCache";
import { type NFTMetadata } from "@/utils/ipfs";
import { getOptimizedImageUrl } from "@/utils/ipfs";
import { useEffect, useState } from "react";
import { useBatchNFTMetadata } from "./useBatchNFTMetadata";

interface NFTImageData {
  tokenId: number;
  imageUrl: string | null;
  metadata: NFTMetadata | null;
  loading: boolean;
  error: string | null;
}

interface UsePaginatedNFTImagesResult {
  nftData: Record<number, NFTImageData>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePaginatedNFTImages = (baseHash: string, tokenIds: number[]): UsePaginatedNFTImagesResult => {
  const [nftData, setNftData] = useState<Record<number, NFTImageData>>({});
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});

  // Load metadata in batch
  const {
    metadataMap,
    loading: metadataLoading,
    error: metadataError,
    refetch: refetchMetadata,
  } = useBatchNFTMetadata(baseHash, tokenIds);

  // Initialize NFT data when metadata loads
  useEffect(() => {
    const newNftData: Record<number, NFTImageData> = {};

    for (const tokenId of tokenIds) {
      const metadata = metadataMap[tokenId];
      newNftData[tokenId] = {
        tokenId,
        imageUrl: null,
        metadata: metadata || null,
        loading: !!metadata, // Loading images if we have metadata
        error: metadata ? null : metadataError,
      };
    }

    setNftData(newNftData);
  }, [tokenIds, metadataMap, metadataError]);

  // Load images after metadata is available
  useEffect(() => {
    const loadImages = async () => {
      const tokensWithMetadata = tokenIds.filter((id) => metadataMap[id]);

      if (tokensWithMetadata.length === 0) return;

      // Process images in batches of 20 to avoid overwhelming IPFS gateways
      const batchSize = 20;

      for (let i = 0; i < tokensWithMetadata.length; i += batchSize) {
        const batch = tokensWithMetadata.slice(i, i + batchSize);

        // Load batch in parallel
        await Promise.allSettled(
          batch.map(async (tokenId) => {
            try {
              const metadata = metadataMap[tokenId];
              if (!metadata?.image) return;

              setImageLoadingStates((prev) => ({ ...prev, [tokenId]: true }));

              // Check cached image first
              const cachedImageUrl = await imageCache.get(tokenId);
              if (cachedImageUrl) {
                setNftData((prev) => ({
                  ...prev,
                  [tokenId]: {
                    ...prev[tokenId],
                    imageUrl: cachedImageUrl,
                    loading: false,
                  },
                }));
                setImageLoadingStates((prev) => ({ ...prev, [tokenId]: false }));
                return;
              }

              // Load original image
              const optimizedImageUrl = getOptimizedImageUrl(metadata.image);

              // Test if we can load the original image
              const testImage = new Image();
              testImage.crossOrigin = "anonymous";

              const canLoadOriginal = await new Promise<boolean>((resolve) => {
                testImage.onload = () => resolve(true);
                testImage.onerror = () => resolve(false);
                testImage.src = optimizedImageUrl;
              });

              if (canLoadOriginal) {
                setNftData((prev) => ({
                  ...prev,
                  [tokenId]: {
                    ...prev[tokenId],
                    imageUrl: optimizedImageUrl,
                    loading: false,
                  },
                }));

                // Cache the image for future use
                try {
                  const dataUrl = await imageToDataUrl(optimizedImageUrl);
                  await imageCache.set(tokenId, optimizedImageUrl, dataUrl);
                } catch (cacheError) {
                  // Silently ignore cache errors
                }
              } else {
                throw new Error("Cannot load image");
              }

              setImageLoadingStates((prev) => ({ ...prev, [tokenId]: false }));
            } catch (error) {
              setNftData((prev) => ({
                ...prev,
                [tokenId]: {
                  ...prev[tokenId],
                  imageUrl: null,
                  loading: false,
                  error: error instanceof Error ? error.message : "Failed to load image",
                },
              }));
              setImageLoadingStates((prev) => ({ ...prev, [tokenId]: false }));
            }
          }),
        );

        // Small delay between batches
        if (i + batchSize < tokensWithMetadata.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    };

    if (!metadataLoading && Object.keys(metadataMap).length > 0) {
      loadImages();
    }
  }, [tokenIds, metadataMap, metadataLoading]);

  const loading = metadataLoading || Object.values(imageLoadingStates).some(Boolean);
  const error = metadataError;

  const refetch = () => {
    refetchMetadata();
    // Reset image loading states
    setImageLoadingStates({});
  };

  return {
    nftData,
    loading,
    error,
    refetch,
  };
};
