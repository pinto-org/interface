import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useReferralLeaderboard } from "@/state/useReferralLeaderboard";
import { formatter, truncateHex } from "@/utils/format";
import { useState } from "react";

export default function ReferralLeaderboard() {
  const { data, isLoading, error, refetch } = useReferralLeaderboard();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  // Calculate pagination values
  const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 0;
  const newestEntryOnPage = (currentPage - 1) * rowsPerPage;
  const oldestEntryOnPage = Math.min(currentPage * rowsPerPage, data?.length ?? 0);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current page data
  const currentPageData = data?.slice(newestEntryOnPage, oldestEntryOnPage);

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="pinto-h3 sm:pinto-h2 mb-4">Referral Leaderboard</div>
        <div className="flex items-center justify-center h-64">
          <FrameAnimator size={80} />
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="pinto-h3 sm:pinto-h2 mb-4">Referral Leaderboard</div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="pinto-body text-pinto-light">Failed to load leaderboard data. Please try again.</div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="pinto-h3 sm:pinto-h2 mb-4">Referral Leaderboard</div>
        <div className="relative max-h-[min(37.5rem,50vh)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-pinto-gray-1 z-2">
              <TableRow className="hover:bg-pinto-gray-1 h-14">
                <TableHead className="text-black font-[400] text-[1rem] w-[5rem] p-4">No.</TableHead>
                <TableHead className="text-black font-[400] text-[1rem] w-[12.5rem] px-4">Name</TableHead>
                <TableHead className="text-black text-right font-[400] text-[1rem] w-[9.375rem]">Pods Earned</TableHead>
                <TableHead className="text-black text-right font-[400] text-[1rem] w-[12.5rem]">
                  Total Pinto Sown
                </TableHead>
                <TableHead className="text-black text-right font-[400] text-[1rem] w-[6.25rem] p-4">
                  Referrals
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-white hover:bg-white">
                <TableCell colSpan={5}>
                  <div className="flex flex-row h-48 w-full items-center justify-center text-pinto-gray-4 font-[400] text-[1rem]">
                    No referral activity yet. Be the first to earn referral rewards!
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  // Main table with data
  return (
    <Card className="p-4 sm:p-6">
      <div className="pinto-h3 sm:pinto-h2 mb-4">Referral Leaderboard</div>
      <div className="relative max-h-[min(37.5rem,50vh)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-pinto-gray-1 z-2">
            <TableRow className="hover:bg-pinto-gray-1 h-14">
              <TableHead className="text-black font-[400] text-[1rem] w-[5rem] p-4">No.</TableHead>
              <TableHead className="text-black font-[400] text-[1rem] w-[12.5rem] px-4">Name</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[9.375rem]">Pods Earned</TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[12.5rem]">
                Total Pinto Sown
              </TableHead>
              <TableHead className="text-black text-right font-[400] text-[1rem] w-[6.25rem] p-4">Referrals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData?.map((entry) => (
              <TableRow key={entry.farmer} className="h-[4.5rem] bg-white hover:bg-pinto-green-1/50">
                <TableCell className="pinto-sm p-4">{entry.rank}</TableCell>
                <TableCell className="pinto-sm px-4">{truncateHex(entry.farmer, 6, 4)}</TableCell>
                <TableCell className="pinto-sm text-right">
                  <div className="flex flex-row gap-1 items-center justify-end">
                    <IconImage src={podIcon} size={4} className="scale-110" />
                    <div className="opacity-70">{formatter.noDec(entry.podsEarned)}</div>
                  </div>
                </TableCell>
                <TableCell className="pinto-sm text-right">
                  <div className="flex flex-row gap-1 items-center justify-end">
                    <IconImage src={pintoIcon} size={4} className="scale-110" />
                    <div className="opacity-70">{formatter.twoDec(entry.totalPintoSown)}</div>
                  </div>
                </TableCell>
                <TableCell className="pinto-sm text-right p-4">
                  <div className="opacity-70">{entry.refereeCount}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <div className="text-xs">
            {currentPage} of {totalPages}
          </div>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
