import { useEffect, useState } from "react";

export interface UseWalletImageReturn {
  imageError: boolean;
  retryAttempt: number;
  handleImageError: () => void;
}

/**
 * Hook for managing wallet/profile image loading with error handling and retry logic
 *
 * Features:
 * - Tracks image loading errors
 * - Implements single retry on error
 * - Resets state when image URL changes
 *
 * @param imageUrl - The URL of the image to load (can be string, null, or undefined)
 * @returns Image error state, retry attempt count, and error handler
 */
export function useWalletImage(imageUrl?: string | null): UseWalletImageReturn {
  const [imageError, setImageError] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Reset error state when image URL changes
  useEffect(() => {
    setImageError(false);
    setRetryAttempt(0);
  }, [imageUrl]);

  const handleImageError = () => {
    if (retryAttempt === 0) {
      // Try once more
      setRetryAttempt(1);
    } else {
      // Give up after one retry
      setImageError(true);
    }
  };

  return {
    imageError,
    retryAttempt,
    handleImageError,
  };
}
