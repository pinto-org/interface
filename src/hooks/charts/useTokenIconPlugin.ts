import { Token } from "@/utils/types";
import { Plugin } from "chart.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface TokenDataEntry {
  token: Token;
  bdv: number;
}

// Global image cache to prevent reloading across component instances
const globalImageCache = new Map<string, HTMLImageElement>();

export const useTokenIconPlugin = (tokenDataArray: TokenDataEntry[]) => {
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [imagesLoading, setImagesLoading] = useState(true);

  // Track previous token symbols to avoid unnecessary reloading
  const previousTokenSymbols = useRef<string[]>([]);

  // Load images only when token array actually changes
  useEffect(() => {
    if (tokenDataArray.length === 0) {
      setImagesLoading(false);
      setLoadedImages(new Map());
      return;
    }

    const currentTokenSymbols = tokenDataArray.map((t) => t.token.symbol);

    // Check if tokens actually changed
    const tokensChanged =
      currentTokenSymbols.length !== previousTokenSymbols.current.length ||
      currentTokenSymbols.some((symbol, index) => symbol !== previousTokenSymbols.current[index]);

    if (!tokensChanged) {
      return; // No change in tokens, don't reload images
    }

    previousTokenSymbols.current = currentTokenSymbols;
    setImagesLoading(true);

    // Check global cache first
    const cachedImages = new Map<string, HTMLImageElement>();
    const tokensToLoad: TokenDataEntry[] = [];

    for (const tokenData of tokenDataArray) {
      const cachedImage = globalImageCache.get(tokenData.token.symbol);
      if (cachedImage) {
        cachedImages.set(tokenData.token.symbol, cachedImage);
      } else {
        tokensToLoad.push(tokenData);
      }
    }

    if (tokensToLoad.length === 0) {
      // All images are cached
      setLoadedImages(cachedImages);
      setImagesLoading(false);
      return;
    }

    // Load missing images
    const imagePromises = tokensToLoad.map((tokenData) => {
      return new Promise<{ token: string; image: HTMLImageElement }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          // Cache globally
          globalImageCache.set(tokenData.token.symbol, img);
          resolve({ token: tokenData.token.symbol, image: img });
        };
        img.onerror = () => reject(new Error(`Failed to load ${tokenData.token.symbol} icon`));
        img.src = tokenData.token.logoURI;
      });
    });

    Promise.allSettled(imagePromises).then((results) => {
      const newLoadedImages = new Map(cachedImages);

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          newLoadedImages.set(result.value.token, result.value.image);
        }
      });

      setLoadedImages(newLoadedImages);
      setImagesLoading(false);
    });
  }, [tokenDataArray]);

  // Stable plugin creation
  const tokenIconPlugin: Plugin<"bar"> = useMemo(
    () => ({
      id: "tokenIcons",
      afterDatasetsDraw: (chart) => {
        if (imagesLoading || loadedImages.size === 0) return;

        const { ctx, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;

        tokenDataArray.forEach((tokenData, index) => {
          const img = loadedImages.get(tokenData.token.symbol);
          if (!img) return;

          const x = xScale.getPixelForTick(index);
          const y = yScale.bottom + 30; // Position icons below x-axis labels
          const iconSize = 24; // Slightly bigger icons

          // Draw the preloaded image
          ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
        });
      },
    }),
    [tokenDataArray, loadedImages, imagesLoading],
  );

  return {
    tokenIconPlugin,
    imagesLoading,
  };
};
