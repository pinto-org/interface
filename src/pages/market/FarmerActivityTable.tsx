import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { useFarmerMarket } from "@/state/useFarmerMarket";
import { useFieldData } from "@/state/useFieldData";
import useTokenData from "@/state/useTokenData";
import { PODS } from "@/constants/internalTokens";

export function FarmerActivityTable() {
  const BEAN = useTokenData().mainToken;

  const farmerData = useFarmerMarket();
  const fieldData = useFieldData();

  const rowsPerPage = 10;
  const totalRows = farmerData?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Farmer Activity</CardTitle>
        <CardDescription>Your orders and listings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {/* <TableCaption>Earn yield and participate in protocol governance by depositing whitelisted assets</TableCaption> */}
          <TableHeader>
            <TableRow className="hover:bg-white">
              <TableHead className="w-[200px] transition-colors hover:bg-muted/50">Created At</TableHead>
              <TableHead className="w-[100px] transition-colors hover:bg-muted/50">Type</TableHead>
              <TableHead className="w-[120px] transition-colors hover:bg-muted/50">Amount</TableHead>
              <TableHead className="w-[150px] transition-colors hover:bg-muted/50">Place In Line</TableHead>
              <TableHead className="w-[100px] transition-colors hover:bg-muted/50">Price</TableHead>
              <TableHead className="w-[120px] transition-colors hover:bg-muted/50">Total</TableHead>
              <TableHead className="w-[120px] transition-colors hover:bg-muted/50">Fill %</TableHead>
              <TableHead className="w-[120px] transition-colors hover:bg-muted/50">Expires In</TableHead>
              <TableHead className="text-right w-[210px] transition-colors hover:bg-muted/50">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farmerData?.map((event, i) => {
              const dateOptions: Intl.DateTimeFormatOptions = {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h24",
              };
              let date;
              let type;
              let amount;
              let placeInLine;
              let price;
              let total;
              let fillPct;
              let expiresIn;
              let status;
              if (event.type === "ORDER") {
                const beanAmount = TokenValue.fromBlockchain(event.beanAmount, BEAN.decimals);
                const beanAmountFilled = TokenValue.fromBlockchain(event.beanAmountFilled, BEAN.decimals);
                const pricePerPod = TokenValue.fromBlockchain(event.pricePerPod, BEAN.decimals);
                const podAmount = beanAmount.div(pricePerPod);
                const remainingPods = beanAmount.sub(beanAmountFilled).div(pricePerPod);
                date = new Date(Number(event.createdAt) * 1000);
                type = event.type;
                amount = podAmount;
                placeInLine = TokenValue.fromBlockchain(event.maxPlaceInLine, PODS.decimals);
                price = TokenValue.fromBlockchain(event.pricePerPod, BEAN.decimals);
                total = beanAmount;
                fillPct = beanAmountFilled.div(beanAmount).mul(100);
                expiresIn = undefined;
                status = fillPct.gt(99) ? "FILLED" : event.status;
              } else if (event.type === "LISTING") {
                date = new Date(Number(event.createdAt) * 1000);
                type = event.type;
                amount = TokenValue.fromBlockchain(event.originalAmount, PODS.decimals);
                placeInLine = TokenValue.fromBlockchain(
                  event.status === "ACTIVE" ? event.index : event.originalIndex,
                  PODS.decimals,
                );
                price = TokenValue.fromBlockchain(event.pricePerPod, BEAN.decimals);
                total = amount.mul(price);
                fillPct = TokenValue.fromBlockchain(event.filled, PODS.decimals)
                  .div(TokenValue.fromBlockchain(event.originalAmount, PODS.decimals))
                  .mul(100);
                expiresIn =
                  fillPct.lt(99) && event.status === "ACTIVE"
                    ? TokenValue.fromBlockchain(event.maxHarvestableIndex, PODS.decimals).sub(
                        fieldData.harvestableIndex,
                      )
                    : undefined;
                status = fillPct.gt(99) ? "FILLED" : event.status;
              }
              if (i >= newestEventOnPage && i <= oldestEventOnPage)
                return (
                  <TableRow>
                    <TableCell className="font-medium">{date?.toLocaleString(undefined, dateOptions)}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>{amount?.toHuman("short")}</TableCell>
                    <TableCell>{`${event?.type === "ORDER" ? "0 - " : ""}${placeInLine?.toHuman("short")}`}</TableCell>
                    <TableCell>{price?.toHuman("short")}</TableCell>
                    <TableCell>{total?.toHuman("short")}</TableCell>
                    <TableCell>{`${fillPct?.toHuman("short")}%`}</TableCell>
                    <TableCell>{expiresIn ? expiresIn.toHuman("short") : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      {status === "CANCELLED_PARTIAL" ? "CANCELLED (PARTIAL)" : status}
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
