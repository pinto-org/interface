import podIcon from "@/assets/protocol/Pod.png";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useReferralLeaderboard } from "@/state/referral";
import { formatter, truncateHex } from "@/utils/format";
import { cn } from "@/utils/utils";
import { useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";

/**
 * ReferralLeaderboard component displays a paginated table of top referrers ranked by Pods earned.
 *
 * Features:
 * - Client-side pagination with configurable rows per page
 * - Optimized re-rendering with memoized calculations and callbacks
 * - Comprehensive error handling with retry functionality
 * - Loading states for both initial load and pagination operations
 * - Empty state handling when no referral data exists
 * - Responsive design with mobile-friendly controls
 *
 * The component uses the useReferralLeaderboard hook which implements robust pagination
 * to prevent data inconsistencies during browsing sessions.
 */
export default function ReferralLeaderboard() {
  // Local state for client-side pagination
  const { address: walletAddress } = useAccount();
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const rowsPerPage = 25; // Number of entries to display per page

  // Fetch all leaderboard data using optimized hook
  const { data: allData, isLoading, error, refetch, userRank } = useReferralLeaderboard();

  // Memoized pagination calculations to prevent unnecessary re-renders
  const paginationState = useMemo(() => {
    const totalEntries = allData.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const currentPage = Math.floor(displayStartIndex / rowsPerPage) + 1;
    const endIndex = Math.min(displayStartIndex + rowsPerPage, totalEntries);
    const displayData = allData.slice(displayStartIndex, endIndex);

    // Determine if navigation buttons should be enabled
    const canGoNext = endIndex < totalEntries;
    const canGoPrevious = displayStartIndex > 0;

    return {
      displayData,
      currentPage,
      totalPages,
      totalEntries,
      canGoNext,
      canGoPrevious,
      startIndex: displayStartIndex,
      endIndex,
    };
  }, [allData, displayStartIndex, rowsPerPage]);

  // Memoized pagination handlers to prevent unnecessary re-renders
  const handleNextPage = useCallback(() => {
    if (paginationState.canGoNext && !isLoading && !isRetrying) {
      setDisplayStartIndex((prev) => prev + rowsPerPage);
    }
  }, [paginationState.canGoNext, isLoading, isRetrying, rowsPerPage]);

  const handlePreviousPage = useCallback(() => {
    if (paginationState.canGoPrevious && !isLoading && !isRetrying) {
      setDisplayStartIndex((prev) => Math.max(0, prev - rowsPerPage));
    }
  }, [paginationState.canGoPrevious, isLoading, isRetrying, rowsPerPage]);

  // Memoized retry handler for failed requests
  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  }, [refetch]);

  // Memoized error state classification to prevent unnecessary re-renders
  const errorState = useMemo(() => {
    if (!error) return null;

    const isNetworkError =
      error.message.includes("fetch") || error.message.includes("network") || error.message.includes("timeout");
    const isBlockHeightError = error.message.includes("block");

    return {
      isNetworkError,
      isBlockHeightError,
      message: isNetworkError
        ? "Network error occurred while loading referral data."
        : isBlockHeightError
          ? "Block height error occurred. Data may be temporarily unavailable."
          : "Failed to load referral data.",
      suggestion: isNetworkError ? "Please check your connection and try again." : "Please try again later.",
    };
  }, [error]);

  // Initial loading state (first page load)
  if (isLoading && allData.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <CardHeader className="p-0 pb-4">
          <div className="pinto-h3 sm:pinto-h2">Referral Leaderboard</div>
          <p className="pinto-body-light text-pinto-light">Top referrers ranked by Pods earned</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-64">
            <FrameAnimator size={80} />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state with retry functionality
  if (error && allData.length === 0 && errorState) {
    return (
      <Card className="p-4 sm:p-6">
        <CardHeader className="p-0 pb-4">
          <div className="pinto-h3 sm:pinto-h2">Referral Leaderboard</div>
          <p className="pinto-body-light text-pinto-light">Error loading leaderboard data</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center h-48 w-full text-pinto-gray-4 space-y-4">
            <div className="text-center">
              <div className="mb-2">{errorState.message}</div>
              <div className="text-sm text-pinto-gray-5">{errorState.suggestion}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRetry} disabled={isRetrying} className="min-w-[100px]">
              {isRetrying ? (
                <div className="flex items-center space-x-2">
                  <FrameAnimator size={16} />
                  <span>Retrying...</span>
                </div>
              ) : (
                "Retry"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!allData || allData.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <CardHeader className="p-0 pb-4">
          <div className="pinto-h3 sm:pinto-h2">Referral Leaderboard</div>
          <p className="pinto-body-light text-pinto-light">Top referrers ranked by Pods earned</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table noOverflow>
            <TableHeader>
              <TableRow noHoverMute className="z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
                <TableHead className="w-[5rem]">No.</TableHead>
                <TableHead className="w-[12.5rem]">Address</TableHead>
                <TableHead className="w-[9.375rem]">Pods Earned</TableHead>
                <TableHead className="text-right w-[6.25rem]">Referrals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow noHoverMute>
                <TableCell colSpan={4}>
                  <div className="flex flex-row h-48 w-full items-center justify-center text-pinto-gray-4">
                    No referral activity yet. Be the first to earn referral rewards!
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  // Main table with data
  return (
    <Card className="p-4 sm:p-6">
      <CardHeader className="p-0 pb-4">
        <div className="flex space-x-2 items-center">
          <div className="pinto-h3 sm:pinto-h2">Referral Leaderboard</div>
          {(isLoading || isRetrying) && <FrameAnimator className="-mt-5 -mb-12" size={80} />}
        </div>
        <p className="pinto-body-light text-pinto-light">Top referrers ranked by Pods earned</p>
        {error && allData.length > 0 && (
          <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded-md mt-2">
            <div className="flex items-center justify-between">
              <span>Warning: Some data may be outdated due to loading errors.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="ml-2 h-6 px-2 text-xs"
              >
                {isRetrying ? "Retrying..." : "Refresh"}
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table noOverflow>
          <TableHeader>
            <TableRow noHoverMute className="z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
              <TableHead className="w-[5rem]">No.</TableHead>
              <TableHead className="w-[12.5rem]">Address</TableHead>
              <TableHead className="w-[9.375rem]">Pods Earned</TableHead>
              <TableHead className="text-right w-[6.25rem]">Referrals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginationState.displayData?.map((entry) => (
              <TableRow key={entry.address} noHoverMute>
                <TableCell className="font-medium">{entry.rank}</TableCell>
                <TableCell
                  className={walletAddress?.toLowerCase() === entry.address.toLowerCase() ? "text-pinto-green" : ""}
                >
                  {truncateHex(entry.address, 6, 4)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt="pod icon" />
                    {formatter.noDec(entry.podsEarned)}
                  </div>
                </TableCell>
                <TableCell className="text-right">{entry.totalSuccessfulReferrals}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination controls matching MarketActivityTable.tsx */}
        {paginationState.totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!paginationState.canGoPrevious || isLoading || isRetrying}
            >
              Previous
            </Button>
            <div className="text-xs">{`${paginationState.currentPage} of ${paginationState.totalPages}`}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!paginationState.canGoNext || isLoading || isRetrying}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
