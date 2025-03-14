import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PODS } from "@/constants/internalTokens";
import usePodListings from "@/state/market/usePodListings";
import { useHarvestableIndex } from "@/state/useFieldData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function PodListingsTable() {
  const { id: selectedListing } = useParams();
  const BEAN = useTokenData().mainToken;

  const podListingsQuery = usePodListings();
  const podListings = podListingsQuery.data?.podListings;
  const harvestableIndex = useHarvestableIndex();

  const rowsPerPage = 5000;
  const totalRows = podListings?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  const navigate = useNavigate();
  const navigateTo = useCallback(
    (id: string) => {
      navigate(`/market/pods/buy/${id}`);
    },
    [navigate],
  );

  useEffect(() => {
    // Navigate to the page containing the selection
    if (podListings) {
      const dataIndex = podListings.findIndex((listing) => {
        return selectedListing === listing.id.substring(43);
      });
      const pageNum = 1 + Math.floor((dataIndex + 1) / rowsPerPage);
      setCurrentPage(pageNum);
    }
  }, [selectedListing, podListings]);

  return (
    <Card className="h-fit w-full bg-transparent border-none">
      <CardHeader>
        <div className="flex space-x-2">
          <p className="pinto-body-light text-pinto-light">The list of Pods currently up for sale</p>
          {podListingsQuery.isFetching && <FrameAnimator className="-mt-5 -mb-12" size={80} />}
        </div>
      </CardHeader>
      {podListingsQuery.isLoaded && (
        <CardContent>
          <Table noOverflow>
            <>
              <TableHeader>
                <TableRow noHoverMute className="bg-gradient-light z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
                  <TableHead className="w-[140px]">Created At</TableHead>
                  <TableHead className="w-[110px]">Amount</TableHead>
                  <TableHead className="w-[150px]">Place In Line</TableHead>
                  <TableHead className="w-[100px]">Price</TableHead>
                  <TableHead className="w-[100px]">Fill %</TableHead>
                  <TableHead className="text-right w-[120px]">Expires In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!podListings?.length && (
                  <TableRow key="Empty">
                    <TableCell colSpan={6}>There are currently no open Pod Listings</TableCell>
                  </TableRow>
                )}
                {podListings?.map((listing, i) => {
                  const id = listing.id.substring(43);
                  const dateOptions: Intl.DateTimeFormatOptions = {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    // second: "2-digit",
                    hourCycle: "h24",
                  };
                  const createdAt = new Date(Number(listing.createdAt) * 1000);
                  const originalAmount = parseFloat(listing.originalAmount);
                  const remainingAmount = parseFloat(listing.remainingAmount);
                  const fillPct = (originalAmount - remainingAmount) / originalAmount;
                  if (i >= newestEventOnPage && i <= oldestEventOnPage)
                    return (
                      <TableRow
                        key={listing.id}
                        className={`hover:cursor-pointer ${selectedListing === id ? "bg-pinto-green-1 hover:bg-pinto-green-1" : ""}`}
                        noHoverMute
                        onClick={() => navigateTo(listing.index.valueOf())}
                      >
                        <TableCell className="font-medium">
                          {createdAt.toLocaleString(undefined, dateOptions)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt={"pod icon"} />
                            {TokenValue.fromBlockchain(listing.amount, PODS.decimals).toHuman("short")}
                          </div>
                        </TableCell>
                        <TableCell>
                          {TokenValue.fromBlockchain(listing.index, PODS.decimals)
                            .sub(harvestableIndex)
                            .toHuman("short")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IconImage
                              src={pintoIcon}
                              size={4}
                              className="scale-110 mr-[0.375rem]"
                              alt={"pinto icon"}
                            />
                            {TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals).toHuman()}
                          </div>
                        </TableCell>
                        <TableCell>{formatter.pct(fillPct * 100)}</TableCell>
                        <TableCell className="text-right">
                          {TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals)
                            .sub(harvestableIndex)
                            .toHuman("short")}{" "}
                          PODS
                        </TableCell>
                      </TableRow>
                    );
                })}
              </TableBody>
            </>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-xs">{`${currentPage} of ${totalPages}`}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
