import { abiSnippets } from "@/constants/abiSnippets";
import { imageCache, imageToDataUrl, metadataCache } from "@/utils/imageCache";
import { type NFTMetadata, fetchNFTMetadata, loadNFTImageUrl } from "@/utils/ipfs";
import Bottleneck from "bottleneck";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

// Grid cards mount together; keep gateway requests bounded across all cards.
const imageLoader = new Bottleneck({ maxConcurrent: 4 });

interface UseNFTImageResult {
  imageUrl: string | null;
  metadata: NFTMetadata | null;
  loading: boolean;
  error: string | null;
}

export const useNFTImage = (contractAddress: string, tokenId: number): UseNFTImageResult => {
  const [state, setState] = useState<UseNFTImageResult>({ imageUrl: null, metadata: null, loading: true, error: null });
  const enabled = !!contractAddress && tokenId > 0;
  const {
    data: tokenURI,
    error: contractError,
    isPending,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abiSnippets.erc721Enum,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
    query: { enabled },
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setState({
      imageUrl: null,
      metadata: null,
      loading: enabled && !contractError && (isPending || !!tokenURI),
      error: contractError?.message ?? null,
    });
    if (!enabled || !tokenURI || contractError) return () => controller.abort();

    const load = async () => {
      signal.throwIfAborted();
      setState({ imageUrl: null, metadata: null, loading: true, error: null });
      const cacheKey = `${contractAddress.toLowerCase()}_${tokenId}`;
      const cachedImage = await imageCache.get(cacheKey);
      const cachedMetadata = metadataCache.get(cacheKey) as NFTMetadata | null;
      signal.throwIfAborted();
      if (cachedImage && cachedMetadata) {
        setState({ imageUrl: cachedImage, metadata: cachedMetadata, loading: false, error: null });
        return;
      }
      if (cachedImage) setState({ imageUrl: cachedImage, metadata: cachedMetadata, loading: false, error: null });
      try {
        await imageLoader.schedule(async () => {
          signal.throwIfAborted();
          const metadata = cachedMetadata ?? (await fetchNFTMetadata(tokenURI, signal));
          metadataCache.set(cacheKey, metadata);
          const imageUrl = cachedImage ?? (await loadNFTImageUrl(metadata.image, signal));
          signal.throwIfAborted();
          setState({ imageUrl, metadata, loading: false, error: null });
          if (!cachedImage) {
            // Caching is optional and must never hide a successfully loaded image.
            try {
              const data = await imageToDataUrl(imageUrl, signal);
              signal.throwIfAborted();
              await imageCache.set(cacheKey, imageUrl, data);
            } catch {
              // Artwork is already displayed; CORS/storage failures only skip caching.
            }
          }
        });
      } catch (error) {
        if (signal.aborted) return;
        if (cachedImage) setState({ imageUrl: cachedImage, metadata: cachedMetadata, loading: false, error: null });
        else
          setState({
            imageUrl: null,
            metadata: null,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load NFT data",
          });
      }
    };
    void load().catch((error) => {
      if (!signal.aborted)
        setState({
          imageUrl: null,
          metadata: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load NFT data",
        });
    });
    return () => controller.abort();
  }, [tokenURI, contractError, contractAddress, tokenId, enabled, isPending]);

  return state;
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
              const cacheKey = `${contractAddress.toLowerCase()}_${tokenId}`;
              const cachedImageUrl = await imageCache.get(cacheKey);
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
