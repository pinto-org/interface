import useLocalStorage from "@/hooks/useLocalStorage";
import { useCallback, useEffect, useState } from "react";

export interface CardFlipState {
  hasSeenAnimation: boolean;
  isScreenFading: boolean;
  isCardVisible: boolean;
  isFlipping: boolean;
  isComplete: boolean;
}

export interface UseCardFlipAnimationOptions {
  enabled?: boolean;
  flipDuration?: number;
  fadeDelay?: number;
}

export function useCardFlipAnimation(
  address: string | undefined,
  hasNFTs: boolean,
  options: UseCardFlipAnimationOptions = {},
) {
  const { enabled = true, flipDuration = 4500, fadeDelay = 500 } = options;

  // Create a unique key per wallet address to track animation state
  const storageKey = address ? `nft-card-flip-${address.toLowerCase()}` : "nft-card-flip-default";

  // Use localStorage to persist whether the user has seen the animation
  const [hasSeenAnimation, setHasSeenAnimation] = useLocalStorage(storageKey, false, {
    initializeIfEmpty: true,
  });

  // Local state for animation progress
  const [isScreenFading, setIsScreenFading] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isShowingNFT, setIsShowingNFT] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Determine if we should show the animation
  const shouldShowAnimation = enabled && hasNFTs && !hasSeenAnimation && !!address;

  // Start the entire reveal sequence
  const startReveal = useCallback(() => {
    if (!shouldShowAnimation) return;

    // Phase 1: Fade screen to dark
    setIsScreenFading(true);

    // Phase 2: Show card after fade completes
    setTimeout(() => {
      setIsCardVisible(true);
    }, fadeDelay);
  }, [shouldShowAnimation, fadeDelay]);

  // Trigger the card flip animation
  const triggerFlip = useCallback(() => {
    if (!isCardVisible || isFlipping) return;

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 Card flip triggered");
    }

    setIsFlipping(true);

    // Stop flipping after flip animation completes
    setTimeout(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("🎯 Flip complete, showing NFT");
      }
      setIsFlipping(false);
      setIsShowingNFT(true);
    }, flipDuration);

    // Complete animation after flip finishes + 2 second pause
    setTimeout(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("🎯 NFT display complete, finishing animation");
      }
      completeAnimation();
    }, flipDuration + 2000); // Add 2 seconds after flip completes
  }, [isCardVisible, isFlipping, flipDuration]);

  // Complete the animation and mark as seen
  const completeAnimation = useCallback(() => {
    setIsFlipping(false);
    setIsShowingNFT(false);
    setIsComplete(true);
    setHasSeenAnimation(true);

    // Clean up state after a short delay
    setTimeout(() => {
      setIsScreenFading(false);
      setIsCardVisible(false);
      setIsComplete(false);
    }, 500);
  }, [setHasSeenAnimation]);

  // Skip the entire animation (for accessibility)
  const skipAnimation = useCallback(() => {
    setIsScreenFading(false);
    setIsCardVisible(false);
    setIsFlipping(false);
    setIsShowingNFT(false);
    completeAnimation();
  }, [completeAnimation]);

  // Reset the animation (for testing/development)
  const resetAnimation = useCallback(() => {
    setHasSeenAnimation(false);
    setIsScreenFading(false);
    setIsCardVisible(false);
    setIsFlipping(false);
    setIsShowingNFT(false);
    setIsComplete(false);
  }, [setHasSeenAnimation]);

  // Auto-start sequence if conditions are met
  useEffect(() => {
    if (shouldShowAnimation && !isScreenFading && !isCardVisible && !isComplete) {
      // Small delay to ensure smooth mounting
      const timer = setTimeout(() => {
        startReveal();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldShowAnimation, isScreenFading, isCardVisible, isComplete, startReveal]);

  return {
    // State
    shouldShowAnimation,
    hasSeenAnimation,
    isScreenFading,
    isCardVisible,
    isFlipping,
    isShowingNFT,
    isComplete,

    // Actions
    startReveal,
    triggerFlip,
    skipAnimation,
    resetAnimation,
    completeAnimation,
  };
}
