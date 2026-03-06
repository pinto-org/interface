import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import FrameAnimator from "@/components/LoadingSpinner";
import { MarketPaginationControls } from "@/components/MarketPaginationControls";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import IconImage from "@/components/ui/IconImage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { PODS } from "@/constants/internalTokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { MyPodOrdersQuery } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import useMyPodOrders from "@/state/market/useMyPodOrders";
import { useQueryKeys } from "@/state/useQueryKeys";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export type MarketplacePodOrder = MyPodOrdersQuery["podOrders"][number];

export interface MyOrdersTableProps {
  /** Connected wallet address */
  address: string | undefined;
  /** IDs of selected orders */
  selectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function MyOrdersTable({ address, selectedIds = [], onSelectionChange }: MyOrdersTableProps) {
  const { orders = [], isLoading } = useMyPodOrders({ account: address });
  const BEAN = useTokenData().mainToken;

  const rowsPerPage = 12;
  const totalRows = orders?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const newestEventOnPage = rowsPerPage * currentPage - rowsPerPage;
  const oldestEventOnPage = rowsPerPage * currentPage - 1;

  // Selection is enabled when onSelectionChange callback is provided
  const selectable = !!onSelectionChange;

  // Immediate cancellation state
  const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());

  const diamondAddress = useProtocolAddress();
  const queryClient = useQueryClient();
  const { allPodOrders, allMarket, farmerMarket } = useQueryKeys({
    account: address,
  });

  const onCancelSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: allPodOrders });
    queryClient.invalidateQueries({ queryKey: allMarket });
    queryClient.invalidateQueries({ queryKey: farmerMarket });
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [queryClient, allPodOrders, allMarket, farmerMarket, onSelectionChange]);

  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Order(s) cancelled successfully",
    errorMessage: "Failed to cancel order(s)",
    successCallback: onCancelSuccess,
  });

  // Handle immediate single cancel
  const handleCancelImmediate = useCallback(
    async (order: MarketplacePodOrder) => {
      if (!address) {
        toast.error("Wallet not connected");
        return;
      }

      setSubmitting(true);
      setCancellingIds((prev) => new Set(prev).add(order.id));

      try {
        trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_ORDER_CANCEL, {
          order_count: 1,
          is_batch: false,
          destination_mode: "wallet",
        });

        const maxPlaceInLine = TokenValue.fromBlockchain(order.maxPlaceInLine.toString(), PODS.decimals);
        const pricePerPod = TokenValue.fromBlockchain(order.pricePerPod.toString(), BEAN.decimals);
        const minFillAmount = TokenValue.fromBlockchain(order.minFillAmount.toString(), PODS.decimals);

        await writeWithEstimateGas({
          address: diamondAddress,
          abi: beanstalkAbi,
          functionName: "cancelPodOrder",
          args: [
            {
              orderer: address,
              fieldId: 0n,
              pricePerPod,
              maxPlaceInLine,
              minFillAmount,
            },
            Number(FarmToMode.EXTERNAL),
          ],
        });
      } finally {
        setSubmitting(false);
        setCancellingIds((prev) => {
          const next = new Set(prev);
          next.delete(order.id);
          return next;
        });
      }
    },
    [address, BEAN.decimals, diamondAddress, writeWithEstimateGas, setSubmitting],
  );

  // Handle immediate bulk cancel
  const handleBulkCancelImmediate = useCallback(async () => {
    if (!address) {
      toast.error("Wallet not connected");
      return;
    }

    const ordersToCancel = orders?.filter((o) => selectedIds.includes(o.id)) || [];
    const ownedOrders = ordersToCancel.filter((o) => o.farmer.id.toLowerCase() === address.toLowerCase());

    if (ownedOrders.length === 0) {
      toast.error("No owned orders to cancel");
      return;
    }

    setSubmitting(true);

    try {
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.POD_ORDER_CANCEL, {
        order_count: ownedOrders.length,
        is_batch: true,
        destination_mode: "wallet",
      });

      const batchArgs = ownedOrders.map((order) => ({
        orderer: address,
        fieldId: 0n,
        pricePerPod: TokenValue.fromBlockchain(order.pricePerPod.toString(), BEAN.decimals),
        maxPlaceInLine: TokenValue.fromBlockchain(order.maxPlaceInLine.toString(), PODS.decimals),
        minFillAmount: TokenValue.fromBlockchain(order.minFillAmount.toString(), PODS.decimals),
      }));

      await writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "batchCancelPodOrder",
        args: [batchArgs, Number(FarmToMode.EXTERNAL)],
      });
    } catch (error) {
      console.error("Batch cancel failed:", error);
    } finally {
      setSubmitting(false);
    }
  }, [address, orders, selectedIds, BEAN.decimals, diamondAddress, writeWithEstimateGas, setSubmitting]);

  // Compute visible orders on current page for select all logic
  const visibleOrders = orders?.slice(newestEventOnPage, oldestEventOnPage + 1) || [];
  const visibleIds = visibleOrders.map((o) => o.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.includes(id)) && !allVisibleSelected;

  // Handle "Select All" checkbox for visible orders on current page
  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      if (!onSelectionChange) return;
      if (checked) {
        const newSelection = [...selectedIds];
        for (const id of visibleIds) {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        }
        onSelectionChange(newSelection);
      } else {
        onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)));
      }
    },
    [selectedIds, visibleIds, onSelectionChange],
  );

  // Handle checkbox change for a single row
  const handleCheckboxChange = useCallback(
    (orderId: string, checked: boolean) => {
      if (!onSelectionChange) return;
      if (checked) {
        onSelectionChange([...selectedIds, orderId]);
      } else {
        onSelectionChange(selectedIds.filter((id) => id !== orderId));
      }
    },
    [selectedIds, onSelectionChange],
  );

  return (
    <Card className="h-fit w-full bg-transparent border-none">
      <CardHeader>
        <div className="flex space-x-2">
          <p className="pinto-body-light text-pinto-light">Your active Pod Orders</p>
          {isLoading && <FrameAnimator className="-mt-5 -mb-12" size={80} />}
        </div>
      </CardHeader>
      <CardContent>
        {selectable && selectedIds.length > 0 && (
          <div className="flex items-center mb-3">
            <button
              type="button"
              className="text-pinto-gray-5 hover:text-pinto-green-4 hover:underline underline-offset-4 font-normal transition-colors cursor-pointer pinto-body disabled:opacity-50"
              onClick={handleBulkCancelImmediate}
              disabled={submitting}
            >
              Cancel {selectedIds.length} Order{selectedIds.length !== 1 ? "s" : ""}
            </button>
          </div>
        )}
        <Table noOverflow>
          <>
            <TableHeader>
              <TableRow noHoverMute className="bg-gradient-light z-[1] [&>*]:text-pinto-gray-4 sticky -top-[1px]">
                {selectable && (
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected}
                      onCheckedChange={(checked) => handleSelectAllChange(checked === true)}
                      aria-label="Select all visible orders"
                    />
                  </TableHead>
                )}
                <TableHead className="w-[140px]">Created At</TableHead>
                <TableHead className="w-[110px]">Amount</TableHead>
                <TableHead className="w-[150px]">Place In Line</TableHead>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead className="w-[100px]">Fill %</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!orders || orders.length === 0) && !isLoading && (
                <TableRow key="Empty">
                  <TableCell colSpan={selectable ? 7 : 6}>You have no active orders</TableCell>
                </TableRow>
              )}
              {orders?.map((order, i) => {
                const dateOptions: Intl.DateTimeFormatOptions = {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
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
                    <TableRow key={order.id} noHoverMute>
                      {selectable && (
                        <TableCell className="w-[40px]">
                          <Checkbox
                            checked={selectedIds.includes(order.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(order.id, checked === true)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select order ${order.id}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{createdAt.toLocaleString(undefined, dateOptions)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IconImage src={podIcon} size={4} className="scale-110 mr-[0.375rem]" alt={"pod icon"} />
                          {remainingPods.toHuman("short")}
                        </div>
                      </TableCell>
                      <TableCell>
                        0 - {TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals).toHuman("short")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IconImage src={pintoIcon} size={4} className="scale-110 mr-[0.375rem]" alt={"pinto icon"} />
                          {formatter.number(pricePerPod.toNumber(), { minDecimals: 2, maxDecimals: 2 })}
                        </div>
                      </TableCell>
                      <TableCell>{`${fillPct?.toHuman("short")}%`}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          className="text-pinto-gray-5 hover:text-pinto-green-4 hover:underline underline-offset-4 font-normal transition-colors cursor-pointer pinto-sm disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelImmediate(order);
                          }}
                          disabled={submitting || cancellingIds.has(order.id)}
                        >
                          {cancellingIds.has(order.id) ? "Cancelling..." : "Cancel"}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
              })}
            </TableBody>
          </>
        </Table>
        {totalPages > 1 && (
          <MarketPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalRows}
            itemsPerPage={rowsPerPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
