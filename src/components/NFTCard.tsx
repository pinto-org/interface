import FrameAnimator from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import { getCollectionName } from "@/constants/collections";
import { useNFTImage } from "@/hooks/useNFTImage";
import { type MouseEvent, useRef, useState } from "react";

interface NFTCardProps {
  contractAddress: string;
  tokenId: number;
  onClick: () => void;
  showOwned?: boolean;
  isOwned?: boolean;
}

export const NFTCard = ({ contractAddress, tokenId, onClick, showOwned = false, isOwned = false }: NFTCardProps) => {
  const { imageUrl, metadata, loading, error } = useNFTImage(contractAddress, tokenId);
  const [transform, setTransform] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const startMousePos = useRef<{ x: number; y: number } | null>(null);
  const cardSize = useRef<{ width: number; height: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      startMousePos.current = { x: e.clientX, y: e.clientY };
      cardSize.current = { width: rect.width, height: rect.height };
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!startMousePos.current || !cardSize.current) return;

    // debounce with RAF
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!startMousePos.current || !cardSize.current) return;

      const deltaX = e.clientX - startMousePos.current.x;
      const deltaY = e.clientY - startMousePos.current.y;

      // Normalize to -1 to 1 range based on card size
      const normalizedX = deltaX / (cardSize.current.width / 2);
      const normalizedY = deltaY / (cardSize.current.height / 2);

      // Clamp to reasonable range
      const clampedX = Math.max(-1.2, Math.min(1.2, normalizedX));
      const clampedY = Math.max(-1.2, Math.min(1.2, normalizedY));

      const rotateX = clampedY * -15;
      const rotateY = clampedX * 15;

      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`);
    });
  };

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startMousePos.current = null;
    cardSize.current = null;
    setTransform("");
  };

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden hover:shadow-lg transition-all duration-500 ease-out relative"
      style={{
        transform: transform,
        transformStyle: "preserve-3d",
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ownership badge */}
      {showOwned && isOwned && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-pinto-green-1 text-pinto-green-3 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full z-10">
          Owned
        </div>
      )}

      <CardContent className="p-0">
        {/* NFT Image */}
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <FrameAnimator size={32} />
            </div>
          )}

          {error && (
            <div className="text-gray-400 text-center p-2">
              <div className="text-xs sm:pinto-sm">Failed to load</div>
              <div className="text-xs">#{tokenId}</div>
            </div>
          )}

          {imageUrl && !loading && !error && (
            <img
              src={imageUrl}
              alt={metadata?.name || `NFT #${tokenId}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = "none";
                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = "flex";
                }
              }}
            />
          )}

          {!imageUrl && !loading && !error && (
            <div className="text-gray-400 text-xs sm:pinto-sm">
              {getCollectionName(contractAddress)} #{tokenId}
            </div>
          )}

          {/* Hidden fallback placeholder */}
          <div
            className="absolute inset-0 bg-gray-100 items-center justify-center text-gray-400 text-xs sm:pinto-sm"
            style={{ display: "none" }}
          >
            {getCollectionName(contractAddress)} #{tokenId}
          </div>
        </div>

        {/* NFT Info */}
        <div className="p-2 sm:p-3">
          <div className="text-xs sm:pinto-xs font-medium mb-1">#{tokenId}</div>
        </div>
      </CardContent>
    </Card>
  );
};
