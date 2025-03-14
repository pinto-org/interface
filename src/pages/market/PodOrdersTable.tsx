import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import FrameAnimator from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { PODS } from "@/constants/internalTokens";
import usePodOrders from "@/state/market/usePodOrders";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function PodOrdersTable() {
  const { id: selectedOrder } = useParams();
  const BEAN = useTokenData().mainToken;
  const podOrdersQuery = usePodOrders();
  const podOrders = podOrdersQuery.data?.podOrders;

  const filteredOrders: NonNullable<ReturnType<typeof usePodOrders>["data"]>["podOrders"] = [];
  if (podOrders) {
    for (const order of podOrders) {
      const amount = TokenValue.fromBlockchain(order.beanAmount, BEAN.decimals);
      const amountFilled = TokenValue.fromBlockchain(order.beanAmountFilled, BEAN.decimals);
      const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod, BEAN.decimals);
      const remainingPods = amount.sub(amountFilled).div(pricePerPod);
      if (remainingPods.gt(1)) {
        filteredOrders.push(order);
      }
    }
  }

  const rowsPerPage = 5000;
  const totalRows = filteredOrders?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  const navigate = useNavigate();
  const navigateTo = useCallback(
    (id: string) => {
      navigate(`/market/pods/sell/${id}`);
    },
    [navigate],
  );

  useEffect(() => {
    // Navigate to the page containing the selection
    if (podOrders) {
      const dataIndex = podOrders.findIndex((order) => {
        return selectedOrder === order.id;
      });
      const pageNum = 1 + Math.floor((dataIndex + 1) / rowsPerPage);
      setCurrentPage(pageNum);
    }
  }, [selectedOrder, podOrders]);

  return (
    <Card className="h-fit w-full bg-transparent border-none">
      <CardHeader>
        <div className="flex space-x-2">
          <p className="pinto-body-light text-pinto-light">The current list of Pod Orders</p>
          {podOrdersQuery.isFetching && <FrameAnimator className="-mt-5 -mb-12" size={80} />}
        </div>
      </CardHeader>
      {podOrdersQuery.isLoaded && (
        <CardContent>
          <Table noOverflow>
            <>
              <TableHeader>
                <TableRow noHoverMute className="bg-gradient-light z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
                  <TableHead className="w-[200px]">Created At</TableHead>
                  <TableHead className="">Amount</TableHead>
                  <TableHead className="">Place In Line</TableHead>
                  <TableHead className="">Fill %</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 && (
                  <TableRow key="Empty">
                    <TableCell colSpan={5}>There are currently no open Pod Orders</TableCell>
                  </TableRow>
                )}
                {filteredOrders.map((order, i) => {
                  const dateOptions: Intl.DateTimeFormatOptions = {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    // second: "2-digit",
                    hourCycle: "h24",
                  };
                  const createdAt = new Date(Number(order.createdAt) * 1000);
                  const amount = TokenValue.fromBlockchain(order.beanAmount, BEAN.decimals);
                  const amountFilled = TokenValue.fromBlockchain(order.beanAmountFilled, BEAN.decimals);
                  const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod, BEAN.decimals);
                  const remainingPods = amount.sub(amountFilled).div(pricePerPod);
                  const fillPct = amountFilled.div(amount).mul(100);
                  if (i >= newestEventOnPage && i <= oldestEventOnPage)
                    return (
                      <TableRow
                        key={order.id}
                        className={`hover:cursor-pointer ${selectedOrder === order.id ? "bg-pinto-green-1 hover:bg-pinto-green-1" : ""}`}
                        noHoverMute
                        onClick={() => navigateTo(`${order.id}`)}
                      >
                        <TableCell className="font-medium">
                          {createdAt.toLocaleString(undefined, dateOptions)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt={"pod icon"} />
                            {remainingPods.toHuman("short")}
                          </div>
                        </TableCell>
                        <TableCell>
                          0 - {TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals).toHuman("short")}
                        </TableCell>
                        <TableCell>{`${fillPct?.toHuman("short")}%`}</TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <IconImage
                              src={pintoIcon}
                              size={4}
                              className="scale-110 mr-[0.375rem]"
                              alt={"pinto icon"}
                            />
                            <p className="w-8 text-left">
                              {formatter.number(pricePerPod.toNumber(), { minDecimals: 2, maxDecimals: 2 })}
                            </p>
                          </div>
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
