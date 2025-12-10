import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useReferralLeaderboard } from "@/state/referral";
import { formatter, truncateHex } from "@/utils/format";
import { useState } from "react";

export default function ReferralLeaderboard() {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 25;
  const { data, isLoading, hasNextPage } = useReferralLeaderboard(rowsPerPage, currentPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            {data?.map((entry) => (
              <TableRow key={entry.address} className="h-[4.5rem] bg-white hover:bg-pinto-green-1/50">
                <TableCell className="pinto-sm p-4">{entry.rank}</TableCell>
                <TableCell className="pinto-sm px-4">{truncateHex(entry.address, 6, 4)}</TableCell>
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
                  <div className="opacity-70">{entry.totalSuccessfulReferrals}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {(currentPage > 0 || hasNextPage) && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 0}>
            Previous
          </Button>
          <div className="text-xs">Page {currentPage + 1}</div>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!hasNextPage}>
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
