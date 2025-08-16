import openSeaLogo from "@/assets/misc/opensea-logo.svg";
import { NFTCard } from "@/components/NFTCard";
import { NFTCardFlipReveal } from "@/components/NFTCardFlipReveal";
import { NFTDetailModal } from "@/components/NFTDetailModal";
import { Button } from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { NFT_COLLECTION_1_CONTRACT } from "@/constants/address";
import { getCollectionName } from "@/constants/collections";
import { externalLinks } from "@/constants/links";
import { useCardFlipAnimation } from "@/hooks/useCardFlipAnimation";
import { type NFTData, type ViewMode, useNFTData } from "@/state/useNFTData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

type CollectionFilter = "all" | "genesis";

interface NFTsGridProps {
  nfts: NFTData[];
  viewMode: ViewMode;
  userNFTs: NFTData[];
  onNFTClick: (nft: NFTData) => void;
  hasNFTs?: boolean;
  hasSeenAnimation?: boolean;
  animationCompleted?: boolean;
  onAnimationComplete?: () => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="pinto-h3 mb-4 text-pinto-dark">No NFT Found</div>
        <div className="pinto-body text-pinto-light mb-6">You can purchase one from a NFT marketplace.</div>
        <Button
          asChild
          variant="outline"
          className="rounded-[0.75rem] font-medium inline-flex items-center gap-2 bg-[#0086FF] hover:bg-[#0074E0] hover:text-white text-white border-[#0086FF] hover:border-[#0074E0]"
        >
          <Link to={externalLinks.nftMarketplace} target="_blank" rel="noopener noreferrer" className="text-white">
            <img src={openSeaLogo} alt="OpenSea" className="w-5 h-5" />
            Visit OpenSea
          </Link>
        </Button>
      </div>
    </div>
  );
}

function NFTsGrid({
  nfts,
  viewMode,
  userNFTs,
  onNFTClick,
  hasNFTs,
  hasSeenAnimation,
  animationCompleted,
  onAnimationComplete,
}: NFTsGridProps) {
  let displayNFTs = [...nfts];

  console.log("🔍 NFTsGrid render - hasNFTs:", hasNFTs, "hasSeenAnimation:", hasSeenAnimation, "viewMode:", viewMode);
  console.log("🔍 Initial displayNFTs length:", displayNFTs.length);

  // Log IPFS data for displayed NFTs
  displayNFTs.forEach((nft) => {
    console.log("🔗 NFT #" + nft.id + " contract: " + nft.contractAddress + " - will load IPFS metadata");
  });

  // Temporary pop-in animation for cards - only when data is loaded and ready
  const shouldShowPopAnimation =
    hasNFTs && !hasSeenAnimation && !animationCompleted && viewMode === "owned" && nfts.length > 0;

  // Auto-complete animation after delay
  useEffect(() => {
    if (shouldShowPopAnimation && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete(); // Trigger completion
      }, 1000); // Complete after 1 second
      return () => clearTimeout(timer);
    }
  }, [shouldShowPopAnimation, onAnimationComplete]);

  // Hide NFTs from grid if user hasn't seen the reveal animation yet
  // if (hasNFTs && !hasSeenAnimation && !animationCompleted && viewMode === "owned") {
  //   console.log("🔍 Hiding NFTs because animation not seen yet");
  //   displayNFTs = [];
  // }

  // Temporarily limit to first NFT for owned view
  if (viewMode === "owned" && displayNFTs.length > 0) {
    displayNFTs = [displayNFTs[0]];
  }

  const isSingleCard = viewMode === "owned" && displayNFTs.length === 1;

  const gridCols = useMemo(
    () =>
      viewMode === "all"
        ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8"
        : isSingleCard
          ? "grid-cols-1 place-items-center"
          : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
    [viewMode, isSingleCard],
  );

  return (
    <div className={`grid ${gridCols} gap-2 sm:gap-4 ${isSingleCard ? "justify-center" : ""}`}>
      {displayNFTs.map((nft, index) => {
        const isOwned = viewMode === "all" && userNFTs.some((owned) => owned.id === nft.id);

        return (
          <div
            key={`${nft.contractAddress}-${nft.id}`}
            className={`
              ${isSingleCard ? "w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] max-w-[800px]" : ""}
              ${shouldShowPopAnimation ? "animate-pop-in" : ""}
            `}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <NFTCard
              contractAddress={nft.contractAddress}
              tokenId={nft.id}
              onClick={() => onNFTClick(nft)}
              showOwned={viewMode === "all"}
              isOwned={isOwned}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Collection() {
  const { address } = useAccount();
  const [activeFilter, setActiveFilter] = useState<CollectionFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("owned");
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const { userNFTs, allNFTs, displayNFTs, balance, totalSupply, loading, error } = useNFTData({
    contractAddress: NFT_COLLECTION_1_CONTRACT,
    viewMode,
  });

  // Check if user has NFTs and setup reveal animation
  const hasNFTs = balance && Number(balance) > 0;
  const firstNFT = userNFTs[0];

  const { shouldShowAnimation, hasSeenAnimation, resetAnimation } = useCardFlipAnimation(address, !!hasNFTs);

  // Debug: Log when hasSeenAnimation changes
  useEffect(() => {
    console.log("🔍 hasSeenAnimation changed to:", hasSeenAnimation);
  }, [hasSeenAnimation]);

  // Refresh all NFT data after animation completes
  const handleAnimationComplete = useCallback(() => {
    console.log("🎯 Animation complete callback triggered!");
    console.log("🎯 Current userNFTs length:", userNFTs.length);
    console.log("🎯 Current balance:", balance?.toString());
    console.log("🎯 Setting animationCompleted to true to force re-render");

    // Force re-render by updating local state
    setAnimationCompleted(true);
  }, [userNFTs.length, balance]);

  // Log wallet connection status
  console.log("Collection page - Connected address:", address);
  console.log("Collection page - Pinto NFTs contract:", NFT_COLLECTION_1_CONTRACT);

  const handleFilterToggle = (filter: CollectionFilter) => {
    setActiveFilter(activeFilter === filter ? "all" : filter);
  };

  const handleNFTClick = useCallback((nft: any) => {
    console.log("NFT clicked:", nft);
    setSelectedNFT(nft);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing the selected NFT to prevent text flicker during modal close animation
    setTimeout(() => {
      setSelectedNFT(null);
    }, 150);
  };

  const handleViewModeToggle = () => {
    const newMode = viewMode === "owned" ? "all" : "owned";
    setViewMode(newMode);
    console.log("View mode changed to:", newMode);
  };

  if (!address) {
    return (
      <PageContainer variant="xl">
        <div className="flex flex-col w-full mt-4 sm:mt-0">
          <div className="flex flex-col self-center w-full gap-4 mb-20 sm:mb-0 sm:gap-8">
            <div className="flex flex-col gap-y-3">
              {/* <div className="pinto-h2 sm:pinto-h1">My Pinto Beavers</div> */}
              {/* <div className="pinto-sm sm:pinto-body-light text-pinto-light">
                Connect your wallet to view your collection of Pinto Beavers.
              </div> */}
            </div>
            <Separator />
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <div className="pinto-h2 text-gray-500">Connect allet to view</div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full mt-4 sm:mt-0">
        <div className="flex flex-col self-center w-full gap-4 mb-20 sm:mb-0 sm:gap-8">
          <div className="flex flex-col gap-y-3">
            <div className="pinto-h2 sm:pinto-h1">
              {viewMode === "owned"
                ? /* "My Pinto Beavers" */ null
                : `${getCollectionName(NFT_COLLECTION_1_CONTRACT)}s Collection`}
            </div>
            <div className="pinto-sm sm:pinto-body-light text-pinto-light">
              {viewMode === "owned"
                ? /* "My Collection of Pinto Beaver NFTs" */ null
                : `Browse all ${getCollectionName(NFT_COLLECTION_1_CONTRACT)}s.`}
            </div>
          </div>
          {/*
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => handleFilterToggle("genesis")}
              className={`rounded-full font-medium px-6 py-2 ${
                activeFilter === "genesis"
                  ? "bg-pinto-green-1 text-pinto-green-3 border-pinto-green-3 hover:bg-pinto-green-1/90"
                  : "hover:bg-pinto-green-1/50 hover:text-pinto-gray-4"
              }`}
            >
              {getCollectionName(NFT_COLLECTION_1_CONTRACT)}s
            </Button>
            {viewMode === "owned" && (
              <Button
                variant="outline"
                onClick={() => handleFilterToggle("all")}
                className={`rounded-full font-medium px-6 py-2 ${
                  activeFilter === "all"
                    ? "bg-pinto-green-1 text-pinto-green-3 border-pinto-green-3 hover:bg-pinto-green-1/90"
                    : "hover:bg-pinto-green-1/50 hover:text-pinto-gray-4"
                }`}
              >
                All
              </Button>
            )}
          </div>
*/}
          {/* Toggle link above separator */}
          {/*}
          {activeFilter === "genesis" && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={handleViewModeToggle}
                className="text-pinto-green-4 hover:text-pinto-green-3 pinto-sm font-medium p-0 h-auto"
              >
                {viewMode === "owned" ? "View All in Collection" : "View My Collection"}
              </Button>
            </div>
          )}
            */}

          <Separator />

          <div className="mt-4">
            {loading ? (
              // Show nothing while loading to prevent flash
              <div />
            ) : displayNFTs.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <h1 className="pinto-h1 text-pinto-dark">There is nothing to see here.</h1>
              </div>
            ) : (
              <NFTsGrid
                nfts={displayNFTs}
                viewMode={viewMode}
                userNFTs={userNFTs}
                onNFTClick={handleNFTClick}
                hasNFTs={!!hasNFTs}
                hasSeenAnimation={hasSeenAnimation}
                animationCompleted={animationCompleted}
                onAnimationComplete={handleAnimationComplete}
              />
            )}
          </div>
        </div>
      </div>

      <NFTDetailModal isOpen={isModalOpen} onClose={handleCloseModal} selectedNFT={selectedNFT} />

      {/* NFT Card Flip Reveal Animation Overlay */}
      {/* {shouldShowAnimation && firstNFT && (
        <NFTCardFlipReveal
          contractAddress={firstNFT.contractAddress}
          tokenId={firstNFT.id}
          address={address}
          hasNFTs={!!hasNFTs}
          onComplete={handleAnimationComplete}
        />
      )} */}
    </PageContainer>
  );
}
