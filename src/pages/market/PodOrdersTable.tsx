import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import usePodOrders from "@/state/usePodOrders";
import { useNavigate } from "react-router-dom";
import useTokenData from "@/state/useTokenData";
import { PODS } from "@/constants/internalTokens";

export function PodOrdersTable() {

  const BEAN = useTokenData().mainToken;
  const podOrders = usePodOrders().data?.podOrders;

  const filteredOrders = [];
  if (podOrders) {
    for (let order of podOrders) {
        const amount = TokenValue.fromBlockchain(order.beanAmount, BEAN.decimals);
        const amountFilled = TokenValue.fromBlockchain(order.beanAmountFilled, BEAN.decimals);
        const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod, BEAN.decimals);
        const remainingPods = (amount.sub(amountFilled)).div(pricePerPod);
        if (remainingPods.gt(1)) {
            filteredOrders.push(order);
        };
    };
  };
 
  const rowsPerPage = 10;
  const totalRows = filteredOrders?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  const navigate = useNavigate();

  function navigateTo(id: string) {
    navigate(`/podmarket/sell/${id}`)
  };

    return (
<Card className="h-fit w-full">
    <CardHeader>
      <CardTitle>Pod Orders</CardTitle>
      <CardDescription>The current list of pod purchase orders</CardDescription>
    </CardHeader>
    <CardContent>
    <Table>
  <TableHeader>
    <TableRow className="hover:bg-white">
      <TableHead className="w-[200px] transition-colors hover:bg-muted/50">Created At</TableHead>
      <TableHead className="transition-colors hover:bg-muted/50">Order</TableHead>
      <TableHead className="transition-colors hover:bg-muted/50">Place In Line</TableHead>
      <TableHead className="transition-colors hover:bg-muted/50">Price</TableHead>
      <TableHead className="text-right w-[120px] transition-colors hover:bg-muted/50">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredOrders?.map((order, i) => {
      const id = order.id.substring(0, 8);
      const dateOptions: Intl.DateTimeFormatOptions = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h24"
      };
      const createdAt = new Date(Number(order.createdAt) * 1000)
      const amount = TokenValue.fromBlockchain(order.beanAmount, BEAN.decimals);
      const amountFilled = TokenValue.fromBlockchain(order.beanAmountFilled, BEAN.decimals);
      const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod, BEAN.decimals);
      const remainingPods = (amount.sub(amountFilled)).div(pricePerPod);
      if (i >= newestEventOnPage && i <= oldestEventOnPage)
        return (
          <TableRow className="hover:cursor-pointer" onClick={() => navigateTo(`${order.id}?view=orders`)}>
              <TableCell className="font-medium">{createdAt.toLocaleString(undefined, dateOptions)}</TableCell>
              <TableCell>{id}</TableCell>
              <TableCell>0 - {TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals).toHuman("short")}</TableCell>
              <TableCell>{pricePerPod.toHuman()}</TableCell>
              <TableCell className="text-right">{remainingPods.toHuman("short")} PODS</TableCell>
          </TableRow>
        )
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
    )
}