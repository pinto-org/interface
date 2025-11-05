import { Button } from "@/components/ui/Button";
import { useCardFlipAnimation } from "@/hooks/useCardFlipAnimation";
import { useNFTImage } from "@/hooks/useNFTImage";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { CardBackDesign } from "./CardBackDesign";

interface NFTCardFlipRevealProps {
  contractAddress: string;
  tokenId: number;
  address: string | undefined;
  hasNFTs: boolean;
  onComplete?: () => void;
}

export function NFTCardFlipReveal({ contractAddress, tokenId, address, hasNFTs, onComplete }: NFTCardFlipRevealProps) {
  const { imageUrl, metadata, loading } = useNFTImage(contractAddress, tokenId);

  const {
    shouldShowAnimation,
    isScreenFading,
    isCardVisible,
    isFlipping,
    isShowingNFT,
    isComplete,
    triggerFlip,
    skipAnimation,
  } = useCardFlipAnimation(address, hasNFTs);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      onComplete?.();
    }
  }, [isComplete, onComplete]);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isCardVisible || isFlipping || isShowingNFT) return;

      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        triggerFlip();
      }

      if (event.code === "Escape") {
        event.preventDefault();
        skipAnimation();
      }
    };

    if (shouldShowAnimation) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [shouldShowAnimation, isCardVisible, isFlipping, isShowingNFT, triggerFlip, skipAnimation]);

  const handleCardClick = useCallback(() => {
    if (!isFlipping && !isShowingNFT && isCardVisible) {
      triggerFlip();
    }
  }, [isFlipping, isShowingNFT, isCardVisible, triggerFlip]);

  if (!shouldShowAnimation) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {(isScreenFading || isCardVisible) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div className="relative">
            {/* Card Container */}
            <AnimatePresence mode="wait">
              {isCardVisible && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    delay: 0.2,
                  }}
                  className="relative w-96 h-96 mx-auto"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Flip Container */}
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{
                      rotateY: isFlipping ? 1980 : isShowingNFT ? 180 : 0, // 5 full rotations then land on NFT
                    }}
                    transition={
                      isFlipping
                        ? {
                            duration: 5, // Total spin duration
                            // ease: [0.25, 0.46, 0.45, 0.94], // Fast start, very slow smooth end
                            // Alternative easing options to try:
                            ease: [0.17, 0.67, 0.15, 1], // More dramatic slowdown
                            // ease: [0.5, 0, 0.15, 1], // Very fast start, gradual slowdown
                            // ease: "easeOut", // Simple but effective
                          }
                        : isShowingNFT
                          ? {
                              duration: 0.0, // Immediate - no animation
                            }
                          : {
                              duration: 0.5, // Normal transition for cleanup
                              ease: "easeOut",
                            }
                    }
                  >
                    {/* Card Back */}
                    <motion.div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <CardBackDesign onClick={handleCardClick} isFlipping={isFlipping} />
                    </motion.div>

                    {/* Card Front (NFT) */}
                    <motion.div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                        {/* NFT Image */}
                        {imageUrl && !loading && (
                          <img
                            src={imageUrl}
                            alt={metadata?.name || `NFT #${tokenId}`}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Loading State */}
                        {loading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-gray-500 text-center">
                              <div className="animate-spin w-8 h-8 border-2 border-pinto-green-3 border-t-transparent rounded-full mx-auto mb-2" />
                              <div className="text-sm">Loading NFT...</div>
                            </div>
                          </div>
                        )}

                        {/* NFT Info Overlay */}
                        {imageUrl && metadata && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                          >
                            <h3 className="text-white font-medium text-lg mb-1">
                              {metadata.name || `NFT #${tokenId}`}
                            </h3>
                            <p className="text-white/80 text-sm">Your Pinto NFT</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Floating Particles During Flip */}
                  {isFlipping && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-pinto-green-3 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 100],
                            y: [0, (Math.random() - 0.5) * 100],
                          }}
                          transition={{
                            duration: 5,
                            delay: Math.random() * 1,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <AnimatePresence>
              {isCardVisible && !isFlipping && !isShowingNFT && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center"
                >
                  <div className="text-white/60 text-sm mb-4">
                    Press Enter, Space, or click the card to reveal your NFT
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              className="absolute top-4 right-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={skipAnimation}
                className="text-white/60 hover:text-white hover:bg-white/10 border-white/20"
              >
                Skip
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
