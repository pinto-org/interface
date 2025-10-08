import { NFTCard } from "@/components/NFTCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";

interface NFTData {
  id: number;
  contractAddress: string;
}

interface NFTCarouselProps {
  nfts: NFTData[];
  viewMode: string;
  userNFTs: NFTData[];
  onNFTClick: (nft: NFTData) => void;
}

export const NFTCarousel = ({ nfts, viewMode, userNFTs, onNFTClick }: NFTCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(() => (nfts.length > 0 ? Math.floor(Math.random() * nfts.length) : 0));
  const [jumpToValue, setJumpToValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Calculate opacity based on distance from active index
  const getOpacity = (index: number) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return 1; // Active card
    if (distance === 1) return 0.4; // Adjacent cards
    return 0.2; // Far cards
  };

  // Calculate scale based on distance from active index
  const getScale = (index: number) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return "scale(1)"; // Active card normal size
    if (distance === 1) return "scale(0.8)"; // Adjacent cards smaller
    return "scale(0.6)"; // Far cards much smaller
  };

  // Calculate z-index based on distance from active index
  const getZIndex = (index: number) => {
    const distance = Math.abs(index - activeIndex);
    return 50 - distance; // Active card has highest z-index, decreases with distance
  };

  // Handle navigation
  const goToNext = useCallback(() => {
    if (activeIndex < nfts.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, nfts.length]);

  const goToPrevious = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex]);

  // Handle input change with number validation and capping
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Only allow numbers
      if (value === "" || /^\d+$/.test(value)) {
        let numValue = parseInt(value);
        if (!Number.isNaN(numValue) && nfts.length > 0) {
          // Cap at max token ID
          const maxTokenId = Math.max(...nfts.map((nft) => nft.id));
          numValue = Math.min(numValue, maxTokenId);
        }
        setJumpToValue(Number.isNaN(numValue) ? value : numValue.toString());
      }
    },
    [nfts],
  );

  // Handle jump to specific token ID
  const handleJumpTo = useCallback(() => {
    const tokenId = parseInt(jumpToValue.trim());
    if (Number.isNaN(tokenId)) return;

    const targetIndex = nfts.findIndex((nft) => nft.id === tokenId);
    if (targetIndex !== -1) {
      setActiveIndex(targetIndex);
      setJumpToValue("");
    }
  }, [jumpToValue, nfts]);

  const handleJumpToKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleJumpTo();
      }
    },
    [handleJumpTo],
  );

  // Touch handlers for swipe functionality
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (nfts.length === 0) return null;

  return (
    <div className="relative">
      {/* Left Arrow */}
      {nfts.length > 1 && (
        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          disabled={activeIndex === 0}
          style={{
            top: "calc(50% - 2rem)", // Position above the NFT center
            zIndex: 100, // Higher than any card z-index
          }}
        >
          <ChevronLeftIcon className="w-6 h-6 text-pinto-dark" />
        </button>
      )}

      {/* Carousel Container */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex items-center justify-center"
          style={{ minHeight: "min(80vw, 60vh)" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {nfts.map((nft, index) => {
            const isOwned = viewMode === "all" && userNFTs.some((owned) => owned.id === nft.id);
            const distance = Math.abs(index - activeIndex);
            const isVisible = distance <= 2; // Only show cards within 2 positions of active

            if (!isVisible) return null;

            // Calculate position offset - closer spacing for overlap effect
            const offset = (index - activeIndex) * 120; // 120px spacing for overlap

            return (
              <div
                key={`${nft.contractAddress}-${nft.id}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="absolute flex-shrink-0 transition-all duration-500 ease-out cursor-pointer"
                style={{
                  opacity: getOpacity(index),
                  transform: `translateX(${offset}px) ${getScale(index)}`,
                  zIndex: getZIndex(index),
                  width: "min(80vw, 60vh)",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "center",
                  marginLeft: "calc(-1 * min(40vw, 30vh))", // Center the card
                  marginTop: "calc(-1 * min(40vw, 30vh))", // Center the card
                }}
                onClick={() => {
                  if (index === activeIndex) {
                    onNFTClick(nft);
                  } else {
                    setActiveIndex(index);
                  }
                }}
              >
                <NFTCard
                  contractAddress={nft.contractAddress}
                  tokenId={nft.id}
                  onClick={() => {}}
                  showOwned={viewMode === "all"}
                  isOwned={isOwned}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Arrow */}
      {nfts.length > 1 && (
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          disabled={activeIndex === nfts.length - 1}
          style={{
            top: "calc(50% - 2rem)", // Position above the NFT center
            zIndex: 100, // Higher than any card z-index
          }}
        >
          <ChevronRightIcon className="w-6 h-6 text-pinto-dark" />
        </button>
      )}

      {/* Jump to Token ID */}
      {/* <div className="flex items-center justify-center gap-2 mt-8">
        <span className="text-sm text-gray-400">Jump to</span>
        <input
          type="text"
          value={jumpToValue}
          onChange={handleInputChange}
          onKeyPress={handleJumpToKeyPress}
          placeholder="#"
          className="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-pinto-green-3 text-center"
        />
        <button
          type="button"
          onClick={handleJumpTo}
          className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded hover:border-pinto-green-3 hover:text-pinto-green-3 transition-colors"
        >
          Go
        </button>
      </div> */}

      {/* Dot Indicators */}
      {nfts.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {nfts.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex ? "bg-pinto-green-3 w-6 h-2" : "bg-gray-300 hover:bg-gray-400 w-2 h-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
