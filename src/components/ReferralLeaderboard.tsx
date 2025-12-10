import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
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
                <TableHead className="w-[9.375rem]">Total Pinto Sown</TableHead>
                <TableHead className="text-right w-[6.25rem]">Referrals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow noHoverMute>
                <TableCell colSpan={5}>
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
          {isLoading && <FrameAnimator className="-mt-5 -mb-12" size={80} />}
        </div>
        <p className="pinto-body-light text-pinto-light">Top referrers ranked by Pods earned</p>
      </CardHeader>
      <CardContent className="p-0">
        <Table noOverflow>
          <TableHeader>
            <TableRow noHoverMute className="z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
              <TableHead className="w-[5rem]">No.</TableHead>
              <TableHead className="w-[12.5rem]">Address</TableHead>
              <TableHead className="w-[9.375rem]">Pods Earned</TableHead>
              <TableHead className="w-[9.375rem]">Total Pinto Sown</TableHead>
              <TableHead className="text-right w-[6.25rem]">Referrals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((entry) => (
              <TableRow key={entry.address} noHoverMute>
                <TableCell className="font-medium">{entry.rank}</TableCell>
                <TableCell>{truncateHex(entry.address, 6, 4)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt="pod icon" />
                    {formatter.noDec(entry.podsEarned)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <IconImage src={pintoIcon} size={4} className="scale-110 mr-[0.375rem]" alt="pinto icon" />
                    {formatter.twoDec(entry.totalPintoSown)}
                  </div>
                </TableCell>
                <TableCell className="text-right">{entry.totalSuccessfulReferrals}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination controls */}
        {(currentPage > 0 || hasNextPage) && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 0}>
              Previous
            </Button>
            <div className="text-xs">{`Page ${currentPage + 1}`}</div>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!hasNextPage}>
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
