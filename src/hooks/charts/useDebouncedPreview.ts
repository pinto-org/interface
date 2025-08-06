import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseDebouncedPreviewProps {
  debounceMs?: number;
}

interface PreviewData {
  token?: Token;
  bdvGain?: TokenValue;
}

export const useDebouncedPreview = ({ debounceMs = 150 }: UseDebouncedPreviewProps = {}) => {
  const [debouncedPreview, setDebouncedPreview] = useState<PreviewData>({});
  const timeoutRef = useRef<NodeJS.Timeout>();
  const latestPreviewRef = useRef<PreviewData>({});

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePreview = useCallback(
    (token?: Token, bdvGain?: TokenValue) => {
      // Store the latest preview data
      latestPreviewRef.current = { token, bdvGain };

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        const { token: latestToken, bdvGain: latestBdvGain } = latestPreviewRef.current;

        // Only update if the values are different from current debounced state
        setDebouncedPreview((prev) => {
          const sameToken = prev.token?.symbol === latestToken?.symbol;
          const sameBDV =
            prev.bdvGain?.eq(latestBdvGain || TokenValue.ZERO) ??
            (latestBdvGain === undefined || latestBdvGain.eq(TokenValue.ZERO));

          if (sameToken && sameBDV) {
            return prev; // No change needed
          }

          return {
            token: latestToken,
            bdvGain: latestBdvGain,
          };
        });
      }, debounceMs);
    },
    [debounceMs],
  );

  // Immediate clear function for resetting preview
  const clearPreview = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    latestPreviewRef.current = {};
    setDebouncedPreview({});
  }, []);

  return {
    previewToken: debouncedPreview.token,
    previewBDVGain: debouncedPreview.bdvGain,
    updatePreview,
    clearPreview,
  };
};
