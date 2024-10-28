import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useFieldData } from "@/state/useFieldData";
import usePodListings from "@/state/usePodListings";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import useTokenData from "@/state/useTokenData";
import { PODS } from "@/constants/internalTokens";

export function PodListingsTable() {
  const BEAN = useTokenData().mainToken;

  const podListings = usePodListings().data?.podListings;
  const fieldData = useFieldData();

  const rowsPerPage = 10;
  const totalRows = podListings?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  const navigate = useNavigate();

  function navigateTo(id: string) {
    navigate(`/podmarket/buy/${id}`);
  }

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Pod Listings</CardTitle>
        <CardDescription>The list of pods currently up for sale</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {/* <TableCaption>Earn yield and participate in protocol governance by depositing whitelisted assets</TableCaption> */}
          <TableHeader>
            <TableRow className="hover:bg-white">
              <TableHead className="w-[200px] transition-colors hover:bg-muted/50">Created At</TableHead>
              <TableHead className="w-[200px] transition-colors hover:bg-muted/50">Listing</TableHead>
              <TableHead className="w-[150px] transition-colors hover:bg-muted/50">Place In Line</TableHead>
              <TableHead className="w-[100px] transition-colors hover:bg-muted/50">Price</TableHead>
              <TableHead className="w-[110px] transition-colors hover:bg-muted/50">Amount</TableHead>
              <TableHead className="text-right w-[120px] transition-colors hover:bg-muted/50">Expires In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {podListings?.map((listing, i) => {
              const id = listing.id.substring(43);
              const dateOptions: Intl.DateTimeFormatOptions = {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h24",
              };
              const createdAt = new Date(Number(listing.createdAt) * 1000);
              if (i >= newestEventOnPage && i <= oldestEventOnPage)
                return (
                  <TableRow className="hover:cursor-pointer" onClick={() => navigateTo(listing.index.valueOf())}>
                    <TableCell className="font-medium">{createdAt.toLocaleString(undefined, dateOptions)}</TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>
                      {TokenValue.fromBlockchain(listing.index, PODS.decimals)
                        .sub(fieldData.harvestableIndex)
                        .toHuman("short")}
                    </TableCell>
                    <TableCell>{TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals).toHuman()}</TableCell>
                    <TableCell>{TokenValue.fromBlockchain(listing.amount, PODS.decimals).toHuman("short")}</TableCell>
                    <TableCell className="text-right">
                      {TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals)
                        .sub(fieldData.harvestableIndex)
                        .toHuman("short")}{" "}
                      PODS
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
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
    </Card>
  );
}
