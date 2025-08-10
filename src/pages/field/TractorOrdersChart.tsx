import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import LoadingSpinner from "@/components/LoadingSpinner";
import TextSkeleton from "@/components/TextSkeleton";
import BarChart from "@/components/charts/BarChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OrderbookEntry, decodeSowTractorData } from "@/lib/Tractor/utils";
import { useTractorSowOrderbook } from "@/state/tractor/useTractorSowOrders";
import { formatter, numberAbbr } from "@/utils/format";
import { useDebounceValue } from "@/utils/useDebounce";
import { cn, exists } from "@/utils/utils";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ChartData } from "chart.js";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TractorOrdersChartProps = {
  className?: string;
  variant?: "default" | "explorer";
};

type ViewMode = "temperature" | "tip";

interface ProcessedOrderData {
  key: string;
  label: string;
  value: number;
  totalAmount: TokenValue;
  orderCount: number;
  orders: OrderbookEntry[];
}

const TractorOrdersChart = React.memo(({ className, variant = "default" }: TractorOrdersChartProps) => {
  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>("temperature");
  const [selectedTemperature, setSelectedTemperature] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Data fetching
  const { data: orders, ...ordersQuery } = useTractorSowOrderbook({
    select: useCallback((data: OrderbookEntry[] | undefined) => {
      console.log("[TractorOrdersChart] Raw orders data:", data);
      if (!data?.length) return [];

      // Filter to only pending orders
      // Show all orders for debugging - will filter based on actual data structure
      const pendingOrders = data.filter((order) => {
        console.log("[TractorOrdersChart] Order properties:", {
          isComplete: order.isComplete,
          isCancelled: order.isCancelled,
          pintosLeftToSow: order.pintosLeftToSow?.toHuman(),
        });
        // For now, show all orders to debug the issue
        return true; // !order.isComplete && !order.isCancelled;
      });
      console.log("[TractorOrdersChart] Filtered pending orders:", pendingOrders);
      return pendingOrders;
    }, []),
  });

  // Process orders into chart data
  const processedData = useMemo(() => {
    console.log("[TractorOrdersChart] Processing orders:", orders?.length || 0, "orders");
    if (!orders?.length) return [];

    if (viewMode === "temperature") {
      const result = processOrdersByTemperature(orders);
      console.log("[TractorOrdersChart] Processed temperature data:", result);
      return result;
    } else {
      // Filter orders by selected temperature if in tip view
      const filteredOrders =
        selectedTemperature !== null
          ? orders.filter((order) => {
              const decodedData = decodeSowTractorData(order.requisition.blueprint.data);
              if (!decodedData?.minTempAsString) return false;
              const orderTemp = parseFloat(decodedData.minTempAsString);
              return Math.abs(orderTemp - selectedTemperature) < 0.01; // Handle floating point precision
            })
          : orders;

      const result = processOrdersByTip(filteredOrders);
      console.log("[TractorOrdersChart] Processed tip data:", result);
      return result;
    }
  }, [orders, viewMode, selectedTemperature]);

  // Transform processed data to chart format
  const chartData = useMemo(() => {
    console.log(
      "[TractorOrdersChart] Transforming data:",
      processedData,
      "useLinearXAxis:",
      viewMode === "temperature",
    );

    if (!processedData?.length) {
      console.log("[TractorOrdersChart] No data, setting empty chart");
      return { labels: [], datasets: [] };
    } else {
      // Always use traditional categorical format for bar charts
      // Chart.js bar charts work better with simple data arrays and labels
      const labels = processedData.map((d) => d.label);
      const datasetData = processedData.map((d) => parseFloat(d.totalAmount.toHuman()));
      console.log("[TractorOrdersChart] Chart data - labels:", labels, "data:", datasetData);

      return {
        labels,
        datasets: [
          {
            data: datasetData,
            label: "",
            backgroundColor: "rgba(56, 127, 92, 0.5)",
            borderColor: "rgba(56, 127, 92, 0.6)",
            hoverBackgroundColor: "rgba(56, 127, 92, 0.8)",
            hoverBorderColor: "rgba(56, 127, 92, 1)",
          },
        ],
      };
    }
  }, [processedData]);

  // Loading state
  const isLoading = ordersQuery.isLoading || !orders;

  // Debounced active index
  const debouncedActiveIndex = useDebounceValue(activeIndex, 10);

  // Get summary data for display
  const summary = exists(debouncedActiveIndex) ? processedData[debouncedActiveIndex] : null;
  const overallSummary = processedData.reduce(
    (acc, data) => ({
      totalAmount: acc.totalAmount.add(data.totalAmount),
      totalOrders: acc.totalOrders + data.orderCount,
    }),
    { totalAmount: TokenValue.ZERO, totalOrders: 0 },
  );

  // Display values
  const displayValue = summary?.value ?? (processedData.length > 0 ? "All" : 0);
  const displayAmount = summary?.totalAmount ?? overallSummary.totalAmount;
  const displayCount = summary?.orderCount ?? overallSummary.totalOrders;

  // Handle bar clicks for view switching
  const handleBarClick = useCallback(
    (index: number | undefined) => {
      if (viewMode === "temperature" && index !== undefined && processedData[index]) {
        const selectedData = processedData[index];
        setSelectedTemperature(selectedData.value as number);
        setViewMode("tip");
        setActiveIndex(undefined);
      }
    },
    [viewMode, processedData],
  );

  // Handle back navigation
  const handleBackClick = useCallback(() => {
    setViewMode("temperature");
    setSelectedTemperature(null);
    setActiveIndex(undefined);
  }, []);

  // Handle error state
  if (ordersQuery.error) {
    return (
      <Card className={cn("overflow-hidden", variant === "explorer" && "border-none bg-transparent")}>
        <Col className="gap-4 items-center justify-center h-[250px] sm:h-[435px] px-4">
          <div className="pinto-h4 text-pinto-red-2">Error Loading Tractor Orders</div>
          <Button variant="outline" onClick={() => ordersQuery.refetch()} disabled={ordersQuery.isRefetching}>
            {ordersQuery.isRefetching ? "Retrying..." : "Retry"}
          </Button>
        </Col>
      </Card>
    );
  }

  // Handle no data state
  if (!isLoading && (!orders?.length || !processedData.length)) {
    return (
      <Card className={cn("overflow-hidden", variant === "explorer" && "border-none bg-transparent")}>
        <Col className="gap-0">
          <Row className="w-full justify-between pt-4 px-4 sm:pt-6 sm:px-6 gap-2">
            <Col className="gap-1">
              <div
                className={cn(
                  "pinto-sm sm:pinto-body",
                  variant === "explorer" && "sm:pinto-body text-pinto-light sm:text-pinto-light",
                )}
              >
                Pending Tractor Orders
              </div>
            </Col>
          </Row>
          <Col className="gap-4 items-center justify-center h-[200px] sm:h-[350px] px-4">
            <div className="pinto-body text-pinto-gray-4 text-center">No pending Tractor Orders found</div>
            <div className="pinto-sm text-pinto-gray-3 text-center">
              Tractor Orders will appear here when farmers set up automated sowing strategies
            </div>
          </Col>
        </Col>
      </Card>
    );
  }

  // Handle special case where tip view has no data for selected temperature
  if (viewMode === "tip" && !isLoading && processedData.length === 0 && selectedTemperature !== null) {
    return (
      <Card className={cn("overflow-hidden", variant === "explorer" && "border-none bg-transparent")}>
        <Col className="gap-0">
          <Row className="w-full justify-between pt-4 px-4 sm:pt-6 sm:px-6 gap-2">
            <Col className="gap-1">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleBackClick} className="p-1 h-6 w-6 rounded-full">
                  <ArrowLeftIcon className="h-3 w-3" />
                </Button>
                <div
                  className={cn(
                    "pinto-sm sm:pinto-body",
                    variant === "explorer" && "sm:pinto-body text-pinto-light sm:text-pinto-light",
                  )}
                >
                  Orders at {selectedTemperature.toFixed(2)}% by Tip
                </div>
              </div>
            </Col>
          </Row>
          <Col className="gap-4 items-center justify-center h-[200px] sm:h-[350px] px-4">
            <div className="pinto-body text-pinto-gray-4 text-center">
              No orders found at {selectedTemperature.toFixed(2)}% temperature
            </div>
            <Button variant="outline" onClick={handleBackClick}>
              Back to Temperature View
            </Button>
          </Col>
        </Col>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", variant === "explorer" && "border-none bg-transparent")}>
      <Col className="gap-0">
        <Row className="w-full justify-between pt-4 px-4 sm:pt-6 sm:px-6 gap-2">
          <Col className="gap-1">
            <div className="flex items-center gap-2">
              {viewMode === "tip" && (
                <Button variant="ghost" size="sm" onClick={handleBackClick} className="p-1 h-6 w-6 rounded-full">
                  <ArrowLeftIcon className="h-3 w-3" />
                </Button>
              )}
              <div
                className={cn(
                  "pinto-sm sm:pinto-body",
                  variant === "explorer" && "sm:pinto-body text-pinto-light sm:text-pinto-light",
                )}
              >
                {viewMode === "temperature"
                  ? "Pending Tractor Orders by Temperature"
                  : selectedTemperature !== null
                    ? `Orders at ${selectedTemperature.toFixed(2)}% by Tip`
                    : "Pending Tractor Orders by Tip"}
              </div>
            </div>

            <Col className={cn("gap-1 pb-4 sm:pb-4", variant === "explorer" && "h-[85px]")}>
              <TextSkeleton loading={isLoading} height="body" desktopHeight="h3" className="w-32">
                <div
                  className={cn(
                    "pinto-body sm:pinto-h3",
                    variant === "explorer" && "text-pinto-green-3 sm:text-pinto-green-3",
                  )}
                >
                  {formatter.number(displayAmount)} PINTO
                </div>
              </TextSkeleton>
              <TextSkeleton loading={isLoading} height="sm" className="w-56">
                <div
                  className={cn(
                    "pinto-sm",
                    variant === "explorer" && "pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light",
                  )}
                >
                  {displayCount} order{displayCount !== 1 ? "s" : ""}
                  {viewMode === "temperature"
                    ? " grouped by temperature"
                    : selectedTemperature !== null
                      ? ` at ${selectedTemperature.toFixed(2)}% temperature`
                      : " grouped by tip amount"}
                </div>
              </TextSkeleton>
            </Col>
          </Col>
        </Row>
        <Col
          className={cn(
            "h-[250px] sm:h-[435px] w-full px-2 sm:px-4 pb-2 sm:pb-4",
            variant === "explorer" && "h-[300px] sm:h-[300px] mt-1",
            className,
          )}
        >
          <div className="mx-2 h-full">
            <InteractiveBarChart
              data={chartData}
              isLoading={isLoading}
              onMouseOver={setActiveIndex}
              onClick={viewMode === "temperature" ? handleBarClick : undefined}
              yLabelFormatter={formatY}
              xLabelFormatter={viewMode === "temperature" ? formatTemperatureX : formatTipX}
            />
          </div>
        </Col>
      </Col>
    </Card>
  );
});

export default TractorOrdersChart;

// ================================================================================
// *                                 HELPERS                                      *
// ================================================================================

const processOrdersByTemperature = (orders: OrderbookEntry[]): ProcessedOrderData[] => {
  console.log("[processOrdersByTemperature] Processing", orders.length, "orders");
  const groupedData = new Map<number, { totalAmount: TokenValue; orders: OrderbookEntry[] }>();

  for (const order of orders) {
    const decodedData = decodeSowTractorData(order.requisition.blueprint.data);
    console.log("[processOrdersByTemperature] Decoded data for order:", decodedData);

    if (!decodedData?.minTempAsString) {
      console.log("[processOrdersByTemperature] No minTempAsString found, skipping order");
      continue;
    }

    // minTempAsString is already in percentage format (e.g., "613.75" for 613.75%)
    const temperature = parseFloat(decodedData.minTempAsString);
    // Use currentlySowable which represents the actual amount that can be sown right now
    const amount = order.currentlySowable || TokenValue.ZERO;

    console.log("[processOrdersByTemperature] Temperature:", temperature, "% Amount:", amount.toHuman());

    if (!groupedData.has(temperature)) {
      groupedData.set(temperature, { totalAmount: TokenValue.ZERO, orders: [] });
    }

    const group = groupedData.get(temperature);
    if (!group) continue;
    group.totalAmount = group.totalAmount.add(amount);
    group.orders.push(order);
  }

  // Convert to sorted array
  const result = Array.from(groupedData.entries())
    .map(([temperature, data]) => ({
      key: temperature.toString(),
      label: `${temperature.toFixed(2)}%`, // Temperature is already in percentage format
      value: temperature,
      totalAmount: data.totalAmount,
      orderCount: data.orders.length,
      orders: data.orders,
    }))
    .sort((a, b) => a.value - b.value);

  console.log("[processOrdersByTemperature] Final processed data:", result);
  return result;
};

const processOrdersByTip = (orders: OrderbookEntry[]): ProcessedOrderData[] => {
  const groupedData = new Map<string, { totalAmount: TokenValue; orders: OrderbookEntry[]; tipValue: TokenValue }>();

  for (const order of orders) {
    const decodedData = decodeSowTractorData(order.requisition.blueprint.data);
    if (!decodedData?.operatorParams?.operatorTipAmountAsString) continue;

    const tipAmount = TokenValue.fromHuman(decodedData.operatorParams.operatorTipAmountAsString, 6);
    const tipKey = tipAmount.toHuman();
    // Use currentlySowable which represents the actual amount that can be sown right now
    const orderAmount = order.currentlySowable || TokenValue.ZERO;

    if (!groupedData.has(tipKey)) {
      groupedData.set(tipKey, { totalAmount: TokenValue.ZERO, orders: [], tipValue: tipAmount });
    }

    const group = groupedData.get(tipKey);
    if (!group) continue;
    group.totalAmount = group.totalAmount.add(orderAmount);
    group.orders.push(order);
  }

  // Convert to sorted array
  return Array.from(groupedData.entries())
    .map(([tipKey, data]) => ({
      key: tipKey,
      label: `${formatter.number(data.tipValue)} PINTO`,
      value: parseFloat(data.tipValue.toHuman()),
      totalAmount: data.totalAmount,
      orderCount: data.orders.length,
      orders: data.orders,
    }))
    .sort((a, b) => a.value - b.value);
};

// Formatting functions
const formatY = (value: number | string) => {
  const asNum = typeof value === "number" ? value : Number(value);
  return formatter.number(TokenValue.fromHuman(asNum.toString(), 6));
};

const formatTemperatureX = (value: number | string) => {
  // Temperature is already in percentage format (e.g., 613.75 for 613.75%)
  const asNum = typeof value === "number" ? value : Number(value);
  return `${asNum.toFixed(1)}%`;
};

const formatTipX = (value: number | string) => {
  const asNum = typeof value === "number" ? value : Number(value);
  return formatter.number(TokenValue.fromHuman(asNum.toString(), 6));
};

// Enhanced BarChart wrapper with click handling using DOM events
const InteractiveBarChart = React.memo(
  ({
    data,
    isLoading,
    onMouseOver,
    onClick,
    yLabelFormatter,
    xLabelFormatter,
  }: {
    data: ChartData<"bar">;
    isLoading?: boolean;
    onMouseOver?: (index: number | undefined) => void;
    onClick?: (index: number | undefined) => void;
    yLabelFormatter?: (value: number | string) => string;
    xLabelFormatter?: (value: number | string) => string;
  }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [currentHoverIndex, setCurrentHoverIndex] = useState<number | undefined>(undefined);

    // Handle mouse over with enhanced logic
    const handleMouseOver = useCallback(
      (index: number | undefined) => {
        setCurrentHoverIndex(index);
        onMouseOver?.(index);
      },
      [onMouseOver],
    );

    // Handle click on the chart container
    const handleClick = useCallback(() => {
      if (onClick && currentHoverIndex !== undefined) {
        onClick(currentHoverIndex);
      }
    }, [onClick, currentHoverIndex]);

    // Add click event listener to the chart container
    useEffect(() => {
      const element = chartRef.current;
      if (element && onClick) {
        element.addEventListener("click", handleClick);
        element.style.cursor = currentHoverIndex !== undefined ? "pointer" : "default";

        return () => {
          element.removeEventListener("click", handleClick);
        };
      }
    }, [handleClick, onClick, currentHoverIndex]);

    return (
      <div ref={chartRef} className="h-full w-full">
        <BarChart
          data={data}
          isLoading={isLoading}
          onMouseOver={handleMouseOver}
          yLabelFormatter={yLabelFormatter}
          xLabelFormatter={xLabelFormatter}
        />
      </div>
    );
  },
);
