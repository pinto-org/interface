import openSeaLogo from "@/assets/misc/opensea-logo.svg";
import { NFTCard } from "@/components/NFTCard";
import { NFTCardFlipReveal } from "@/components/NFTCardFlipReveal";
import { NFTCarousel } from "@/components/NFTCarousel";
import { NFTDetailModal } from "@/components/NFTDetailModal";
import { Button } from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { Switch } from "@/components/ui/Switch";
import { NFT_COLLECTION_1_CONTRACT } from "@/constants/address";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { getCollectionName } from "@/constants/collections";
import { externalLinks } from "@/constants/links";
import { useCardFlipAnimation } from "@/hooks/useCardFlipAnimation";
import { type NFTData, type ViewMode, useNFTData } from "@/state/useNFTData";
import { trackClick, trackSimpleEvent, withTracking } from "@/utils/analytics";
import { ChevronLeftIcon, ChevronRightIcon, GridIcon, StackIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

type CollectionFilter = "all" | "genesis";

// Hook to detect mobile screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <div className="pinto-sm text-pinto-light">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={withTracking(ANALYTICS_EVENTS.COLLECTION.PAGE_PREVIOUS_CLICK, () => onPageChange(currentPage - 1), {
            current_page: currentPage,
            total_pages: totalPages,
            total_items: totalItems,
          })}
          disabled={currentPage === 1}
          className="rounded-lg"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={withTracking(ANALYTICS_EVENTS.COLLECTION.PAGE_NUMBER_CLICK, () => onPageChange(pageNum), {
                  previous_page: currentPage,
                  new_page: pageNum,
                  total_pages: totalPages,
                  total_items: totalItems,
                })}
                className="w-10 h-10 rounded-lg"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={withTracking(ANALYTICS_EVENTS.COLLECTION.PAGE_NEXT_CLICK, () => onPageChange(currentPage + 1), {
            current_page: currentPage,
            total_pages: totalPages,
            total_items: totalItems,
          })}
          disabled={currentPage === totalPages}
          className="rounded-lg"
        >
          Next
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

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
        <div className="pinto-body text-pinto-light mb-6">You can purchase one from an NFT marketplace.</div>
        <Button
          asChild
          variant="outline"
          className="rounded-[0.75rem] font-medium inline-flex items-center gap-2 bg-[#0086FF] hover:bg-[#0074E0] hover:text-white text-white border-[#0086FF] hover:border-[#0074E0]"
        >
          <Link
            to={externalLinks.nftMarketplace}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
            onClick={trackClick(ANALYTICS_EVENTS.COLLECTION.OPENSEA_CLICK, {
              link_type: "external",
              link_url: externalLinks.nftMarketplace,
              context: "empty_state",
            })}
          >
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
  if (hasNFTs && !hasSeenAnimation && !animationCompleted && viewMode === "owned") {
    displayNFTs = [];
  }

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
              ${isSingleCard ? "w-[min(80vw,60vh)] sm:w-[min(60vw,60vh)] md:w-[min(50vw,60vh)] lg:w-[min(40vw,60vh)] xl:w-[min(30vw,60vh)] max-w-[min(800px,60vh)]" : ""}
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
  const isMobile = useIsMobile();
  const [activeFilter, setActiveFilter] = useState<CollectionFilter>("genesis");
  const [viewMode, setViewMode] = useState<ViewMode>("owned");
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridMode, setIsGridMode] = useState(() => {
    const saved = localStorage.getItem("nft-grid-mode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Dynamic items per page based on screen size
  const itemsPerPage = isMobile ? 20 : 50;

  // Reset current page when items per page changes (screen size change)
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Persist grid mode preference
  useEffect(() => {
    localStorage.setItem("nft-grid-mode", JSON.stringify(isGridMode));
  }, [isGridMode]);

  const { userNFTs, displayNFTs, balance, loading } = useNFTData({
    contractAddress: NFT_COLLECTION_1_CONTRACT,
    viewMode,
  });

  // Check if user has NFTs and setup reveal animation
  const hasNFTs = balance && Number(balance) > 0;
  const _firstNFT = userNFTs[0];

  const { hasSeenAnimation } = useCardFlipAnimation(address, !!hasNFTs);

  // Refresh all NFT data after animation completes
  const handleAnimationComplete = useCallback(() => {
    // Force re-render by updating local state
    setAnimationCompleted(true);
  }, []);

  const _handleFilterToggle = (filter: CollectionFilter) => {
    // Genesis filter is always active and cannot be toggled off
    if (filter === "genesis") {
      return;
    }
    setActiveFilter(activeFilter === filter ? "all" : filter);
  };

  const handleNFTClick = useCallback(
    (nft: NFTData) => {
      trackSimpleEvent(ANALYTICS_EVENTS.COLLECTION.NFT_CARD_CLICK, {
        nft_id: nft.id,
        view_mode: viewMode,
        display_mode: isGridMode ? "grid" : "carousel",
      });

      trackSimpleEvent(ANALYTICS_EVENTS.COLLECTION.NFT_DETAIL_MODAL_OPEN, {
        nft_id: nft.id,
        view_mode: viewMode,
        display_mode: isGridMode ? "grid" : "carousel",
      });

      setSelectedNFT(nft);
      setIsModalOpen(true);
    },
    [viewMode, userNFTs, isGridMode, displayNFTs.length],
  );

  const handleNFTNavigate = useCallback(
    (nft: NFTData) => {
      trackSimpleEvent(ANALYTICS_EVENTS.COLLECTION.NFT_MODAL_NAVIGATE, {
        nft_id: nft.id,
        view_mode: viewMode,
        display_mode: isGridMode ? "grid" : "carousel",
      });

      setSelectedNFT(nft);
    },
    [viewMode, isGridMode],
  );

  const handleCloseModal = () => {
    if (selectedNFT) {
      trackSimpleEvent(ANALYTICS_EVENTS.COLLECTION.NFT_MODAL_CLOSE, {
        nft_id: selectedNFT.id,
        view_mode: viewMode,
        display_mode: isGridMode ? "grid" : "carousel",
      });
    }

    setIsModalOpen(false);
    // Delay clearing the selected NFT to prevent text flicker during modal close animation
    setTimeout(() => {
      setSelectedNFT(null);
    }, 150);
  };

  const handleViewModeToggle = () => {
    const newMode = viewMode === "owned" ? "all" : "owned";

    trackSimpleEvent(ANALYTICS_EVENTS.COLLECTION.VIEW_MODE_TOGGLE, {
      previous_mode: viewMode,
      new_mode: newMode,
      user_nft_count: balance ? Number(balance) : 0,
    });

    setViewMode(newMode);
    setCurrentPage(1); // Reset to first page when switching modes
  };

  // Pagination logic
  const totalPages = Math.ceil(displayNFTs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNFTs = displayNFTs.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGridModeToggle = useCallback(
    (newGridMode: boolean) => {
      trackSimpleEvent(ANALYTICS_EVENTS.COLLECTION.GRID_MODE_TOGGLE, {
        previous_mode: isGridMode ? "grid" : "carousel",
        new_mode: newGridMode ? "grid" : "carousel",
        view_mode: viewMode,
      });

      setIsGridMode(newGridMode);
    },
    [isGridMode, viewMode, displayNFTs.length],
  );

  if (!address) {
    return (
      <PageContainer variant="xl">
        <div className="flex flex-col w-full mt-4 sm:mt-0">
          <div className="flex flex-col self-center w-full gap-4 mb-20 sm:mb-0 sm:gap-8">
            <div className="flex flex-col gap-y-3">
              <div className="pinto-h2 sm:pinto-h1">My Genesis Pinto Beavers</div>
            </div>
            <Separator />
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <div className="pinto-h2 text-gray-500">Connect Wallet to view</div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="xl">
      <div className="flex flex-col w-full mt-0">
        <div className="flex flex-col self-center w-full gap-2 mb-4 sm:mb-0 sm:gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end">
            <div className="pinto-h2 sm:pinto-h1">
              {viewMode === "owned"
                ? balance === 1
                  ? "My Genesis Pinto Beaver"
                  : "My Genesis Pinto Beavers"
                : `${getCollectionName(NFT_COLLECTION_1_CONTRACT)} Collection`}
            </div>
            <div className="flex items-center gap-4">
              {displayNFTs.length > 1 && (
                <div className="flex items-center gap-2">
                  <StackIcon className="w-4 h-4 text-pinto-light" />
                  <Switch checked={isGridMode} onCheckedChange={handleGridModeToggle} className="h-5 w-9" />
                  <GridIcon className="w-4 h-4 text-pinto-light" />
                </div>
              )}
              <Button
                variant="ghost"
                onClick={handleViewModeToggle}
                className="text-pinto-green-4 hover:text-pinto-green-3 hover:bg-transparent pinto-sm font-medium p-0 h-auto"
              >
                {viewMode === "owned" ? "View Entire Collection" : "View My Beavers"}
              </Button>
            </div>
          </div>
          {/* TODO: Uncomment this section once we have multiple NFT collections to choose from */}
          {/* Collection filter buttons - currently commented out since we only have one collection */}
          {/*
          <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => handleFilterToggle("genesis")}
              className="rounded-full font-medium px-6 py-2 bg-pinto-green-1 text-pinto-green-3 border-pinto-green-3 hover:bg-pinto-green-1/90 cursor-default"
            >
              {getCollectionName(NFT_COLLECTION_1_CONTRACT)}s
            </Button>
            {activeFilter === "genesis" && (
              <Button
                variant="ghost"
                onClick={handleViewModeToggle}
                className="text-pinto-green-4 hover:text-pinto-green-3 hover:bg-transparent pinto-sm font-medium p-0 h-auto"
              >
                {viewMode === "owned" ? "View All in Collection" : "View My Collection"}
              </Button>
            )}
          </div>
          */}

          <Separator />

          <div className="mt-2">
            {loading ? (
              // Show nothing while loading to prevent flash
              <div />
            ) : displayNFTs.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {isGridMode ? (
                  <NFTsGrid
                    nfts={paginatedNFTs}
                    viewMode={viewMode}
                    userNFTs={userNFTs}
                    onNFTClick={handleNFTClick}
                    hasNFTs={!!hasNFTs}
                    hasSeenAnimation={hasSeenAnimation}
                    animationCompleted={animationCompleted}
                    onAnimationComplete={handleAnimationComplete}
                  />
                ) : (
                  <NFTCarousel nfts={displayNFTs} viewMode={viewMode} userNFTs={userNFTs} onNFTClick={handleNFTClick} />
                )}

                {/* Centered Text Below NFTs - Always Visible */}
                <div className="text-center mt-16">
                  <p className="text-gray-500 max-w-4xl mx-auto pinto-body leading-relaxed px-4 italic">
                    And it came to pass, in the dry Seasons of yore, when the river was made thin and volatility crept
                    in, when the Farm was yearning for mints, that the Pinto Beavers did not depart. Whether tending
                    unto their crops in the Silo, Sowing in the Field, or dwelling in the quiet leisure of the Farm,
                    their steadfast faith and enterprise preserved the Pinto experiment, that it might endure.
                    <br />
                    Yea, the Farm remembers.
                  </p>
                </div>

                {isGridMode && viewMode === "all" && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={displayNFTs.length}
                    itemsPerPage={itemsPerPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <NFTDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedNFT={selectedNFT}
        nftCollection={displayNFTs}
        onNavigate={handleNFTNavigate}
        isGridMode={isGridMode}
      />

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
