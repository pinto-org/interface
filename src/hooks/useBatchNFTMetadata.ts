import { metadataCache } from "@/utils/imageCache";
import { type NFTMetadata, fetchBatchMetadata } from "@/utils/ipfs";
import { useEffect, useState } from "react";

interface BatchMetadataResult {
  tokenId: number;
  metadata: NFTMetadata | null;
  error?: string;
}

interface UseBatchNFTMetadataResult {
  metadataMap: Record<number, NFTMetadata>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useBatchNFTMetadata = (baseHash: string, tokenIds: number[]): UseBatchNFTMetadataResult => {
  const [metadataMap, setMetadataMap] = useState<Record<number, NFTMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBatchMetadata = async () => {
    if (tokenIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedMetadata: Record<number, NFTMetadata> = {};
      const uncachedTokenIds: number[] = [];

      for (const tokenId of tokenIds) {
        const cacheKey = `${baseHash}_${tokenId}`;
        const cached = metadataCache.get(cacheKey);

        if (cached) {
          cachedMetadata[tokenId] = cached;
        } else {
          uncachedTokenIds.push(tokenId);
        }
      }

      // Set cached data immediately
      if (Object.keys(cachedMetadata).length > 0) {
        setMetadataMap(cachedMetadata);
      }

      // Fetch uncached metadata
      if (uncachedTokenIds.length > 0) {
        const results = await fetchBatchMetadata(baseHash, uncachedTokenIds);
        const newMetadata: Record<number, NFTMetadata> = {};
        const errors: string[] = [];

        for (const result of results) {
          if (result.metadata) {
            newMetadata[result.tokenId] = result.metadata;
            // Cache successful results
            const cacheKey = `${baseHash}_${result.tokenId}`;
            metadataCache.set(cacheKey, result.metadata);
          } else if (result.error) {
            errors.push(`Token ${result.tokenId}: ${result.error}`);
          }
        }

        // Combine cached and new metadata
        setMetadataMap((prev) => ({ ...prev, ...newMetadata }));

        // Set error if some failed
        if (errors.length > 0 && Object.keys(newMetadata).length === 0) {
          setError(errors.join("; "));
        }
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metadata");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatchMetadata();
  }, [baseHash, tokenIds.join(",")]);

  const refetch = () => {
    loadBatchMetadata();
  };

  return {
    metadataMap,
    loading,
    error,
    refetch,
  };
};
