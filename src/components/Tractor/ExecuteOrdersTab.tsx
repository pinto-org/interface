import { TokenValue } from "@/classes/TokenValue";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { diamondABI } from "@/constants/abi/diamondABI";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useGasPrice } from "@/hooks/useGasPrice";
import useTransaction from "@/hooks/useTransaction";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient } from "wagmi";
import { Col } from "../Container";
import LoadingSpinner from "../LoadingSpinner";

// Generic types for different order types
export interface BaseOrderType {
  requisition: {
    blueprintHash: `0x${string}`;
    blueprint: {
      publisher: `0x${string}`;
      data: `0x${string}`;
      operatorPasteInstrs: readonly `0x${string}`[];
      maxNonce: bigint;
      startTime: bigint;
      endTime: bigint;
    };
    signature: `0x${string}`;
  };
  timestamp?: number;
  decodedData?: any;
  isCancelled?: boolean;
}

export interface ColumnConfig<T extends BaseOrderType> {
  header: string | React.ReactNode;
  accessor: (order: T) => React.ReactNode;
  className?: string;
}

export interface ExecuteOrdersTabProps<T extends BaseOrderType> {
  // Data and loading
  orders: T[];
  isLoading: boolean;

  // Table configuration
  columns: ColumnConfig<T>[];

  // Business logic functions
  filterOrders?: (orders: T[]) => T[];
  calculateProfit?: (
    order: T,
    gasEstimate: bigint,
    gasPrice: bigint | undefined,
    mainToken: Token,
    nativeToken: Token,
    tokenPrices: Map<Token, { instant: TokenValue; twa: TokenValue }>,
  ) => number;

  // Required for profit calculation
  mainToken?: Token;
  nativeToken?: Token;
  tokenPrices?: Map<Token, { instant: TokenValue; twa: TokenValue }>;

  // Additional customization
  emptyStateMessage?: string;
  instructionText?: string;
  onRowClick?: (order: T) => void;
  refetchOrders?: () => void;

  // Optional bottom content
  bottomContent?: React.ReactNode;
}

// Helper function to extract error message from error
const extractErrorMessage = (error: unknown): string => {
  if (!error) return "Unknown error";

  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      const message = error.message;

      const reasonPattern = /following reason:\s*(.*?)(?:\s*\n\s*Contract Call:|$)/s;
      const reasonMatch = message.match(reasonPattern);

      if (reasonMatch && reasonMatch[1]) {
        return reasonMatch[1].trim();
      }

      const simpleMatch = message.match(/execution reverted: (.+?)(?:\n|$)/);
      if (simpleMatch && simpleMatch[1]) {
        return simpleMatch[1].trim();
      }

      return message;
    }

    if ("reason" in error && typeof (error as any).reason === "string") {
      return (error as any).reason;
    }
  }

  return String(error);
};

export function ExecuteOrdersTab<T extends BaseOrderType>({
  orders,
  isLoading: ordersLoading,
  columns,
  filterOrders,
  calculateProfit,
  mainToken,
  nativeToken,
  tokenPrices,
  emptyStateMessage = "No active orders found",
  instructionText = "Select orders to simulate and execute for a tip.",
  onRowClick,
  refetchOrders,
  bottomContent,
}: ExecuteOrdersTabProps<T>) {
  const protocolAddress = useProtocolAddress();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: gasPrice } = useGasPrice();

  // State for gas estimates, simulations, and executions
  const [gasEstimates, setGasEstimates] = useState<Map<string, bigint>>(new Map());
  const [sortedOrders, setSortedOrders] = useState<T[]>([]);
  const [sortingEnabled, setSortingEnabled] = useState(false);
  const [hasExecutedOrder, setHasExecutedOrder] = useState(false);

  // Simulation state
  const [simulatingReq, setSimulatingReq] = useState<string | null>(null);
  const [failedSimulations, setFailedSimulations] = useState<Set<string>>(new Set());
  const [simulationErrors, setSimulationErrors] = useState<Map<string, string>>(new Map());
  const [successfulSimulations, setSuccessfulSimulations] = useState<Set<string>>(new Set());
  const [simulatingAll, setSimulatingAll] = useState(false);
  const [hasSimulatedAll, setHasSimulatedAll] = useState(false);

  // Execution state
  const [completedExecutions, setCompletedExecutions] = useState<Set<string>>(new Set());
  const [executingReq, setExecutingReq] = useState<string | null>(null);

  // Transaction handler
  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Execution successful",
    errorMessage: "Execution failed",
    successCallback: (receipt) => {
      if (!receipt?.transactionHash) return;
      setCompletedExecutions((prev) => new Set(prev).add(receipt.transactionHash));
      refetchOrders?.();
    },
  });

  // Filter orders based on provided logic
  const filteredOrders = useMemo(() => {
    if (!filterOrders) return orders;
    return filterOrders(orders);
  }, [orders, filterOrders]);

  // Helper function for profit calculation
  const calculateOrderProfit = useCallback(
    (order: T): number => {
      if (!calculateProfit || !mainToken || !nativeToken || !tokenPrices) return 0;

      const gas = gasEstimates.get(order.requisition.blueprintHash);
      if (!gas) return -Infinity;

      return calculateProfit(order, gas, gasPrice, mainToken, nativeToken, tokenPrices);
    },
    [calculateProfit, mainToken, nativeToken, tokenPrices, gasEstimates, gasPrice],
  );

  // Sort orders by profit when enabled
  useEffect(() => {
    if (!sortingEnabled || filteredOrders.length === 0 || successfulSimulations.size === 0) {
      setSortedOrders(filteredOrders);
      return;
    }

    const sorted = [...filteredOrders].sort((a, b) => {
      const aHash = a.requisition.blueprintHash;
      const bHash = b.requisition.blueprintHash;

      if (failedSimulations.has(aHash) && !failedSimulations.has(bHash)) return 1;
      if (!failedSimulations.has(aHash) && failedSimulations.has(bHash)) return -1;

      if (successfulSimulations.has(aHash) && successfulSimulations.has(bHash)) {
        return calculateOrderProfit(b) - calculateOrderProfit(a);
      }

      if (successfulSimulations.has(aHash)) return -1;
      if (successfulSimulations.has(bHash)) return 1;

      return 0;
    });

    setSortedOrders(sorted);
  }, [
    filteredOrders,
    successfulSimulations.size,
    failedSimulations.size,
    sortingEnabled,
    gasEstimates.size,
    !!gasPrice,
    calculateOrderProfit,
  ]);

  // Simulate all orders
  const handleSimulateAll = useCallback(async () => {
    if (!protocolAddress || !publicClient || simulatingAll) return;
    setSimulatingAll(true);
    setHasExecutedOrder(false);

    try {
      for (const order of filteredOrders) {
        setSimulatingReq(order.requisition.blueprintHash);

        // Clear previous states
        setFailedSimulations((prev) => {
          const next = new Set(prev);
          next.delete(order.requisition.blueprintHash);
          return next;
        });
        setSuccessfulSimulations((prev) => {
          const next = new Set(prev);
          next.delete(order.requisition.blueprintHash);
          return next;
        });
        setSimulationErrors((prev) => {
          const next = new Map(prev);
          next.delete(order.requisition.blueprintHash);
          return next;
        });

        try {
          await publicClient.simulateContract({
            address: protocolAddress,
            abi: diamondABI,
            functionName: "tractor",
            args: [
              {
                blueprint: order.requisition.blueprint,
                signature: order.requisition.signature,
                blueprintHash: order.requisition.blueprintHash,
              },
              "0x",
            ] as const,
          });

          const gasEstimate = await publicClient.estimateContractGas({
            address: protocolAddress,
            abi: diamondABI,
            functionName: "tractor",
            args: [
              {
                blueprint: order.requisition.blueprint,
                blueprintHash: order.requisition.blueprintHash,
                signature: order.requisition.signature,
              },
              "0x",
            ] as const,
          });

          setGasEstimates((prev) => {
            const next = new Map(prev);
            next.set(order.requisition.blueprintHash, gasEstimate);
            return next;
          });

          setSuccessfulSimulations((prev) => new Set(prev).add(order.requisition.blueprintHash));
        } catch (error) {
          setFailedSimulations((prev) => new Set(prev).add(order.requisition.blueprintHash));
          const errorMsg = extractErrorMessage(error);
          setSimulationErrors((prev) => {
            const next = new Map(prev);
            next.set(order.requisition.blueprintHash, errorMsg);
            return next;
          });
        }
        setSimulatingReq(null);
      }

      toast.success("Completed simulating all orders");
      setSortingEnabled(true);
      setHasSimulatedAll(true);
    } catch (error) {
      console.error("Failed during simulate all:", error);
      toast.error("Failed to simulate all orders");
    } finally {
      setSimulatingAll(false);
    }
  }, [protocolAddress, publicClient, filteredOrders, address]);

  // Simulate individual order
  const handleSimulate = useCallback(
    async (order: T) => {
      if (!protocolAddress || !publicClient) return;
      setSimulatingReq(order.requisition.blueprintHash);

      // Clear previous states
      setFailedSimulations((prev) => {
        const next = new Set(prev);
        next.delete(order.requisition.blueprintHash);
        return next;
      });
      setSuccessfulSimulations((prev) => {
        const next = new Set(prev);
        next.delete(order.requisition.blueprintHash);
        return next;
      });
      setSimulationErrors((prev) => {
        const next = new Map(prev);
        next.delete(order.requisition.blueprintHash);
        return next;
      });
      setGasEstimates((prev) => {
        const next = new Map(prev);
        next.delete(order.requisition.blueprintHash);
        return next;
      });

      try {
        await publicClient.simulateContract({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "tractor",
          args: [
            {
              blueprint: order.requisition.blueprint,
              blueprintHash: order.requisition.blueprintHash,
              signature: order.requisition.signature,
            },
            "0x",
          ] as const,
        });

        const gasEstimate = await publicClient.estimateContractGas({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "tractor",
          args: [
            {
              blueprint: order.requisition.blueprint,
              blueprintHash: order.requisition.blueprintHash,
              signature: order.requisition.signature,
            },
            "0x",
          ] as const,
        });

        setGasEstimates((prev) => {
          const next = new Map(prev);
          next.set(order.requisition.blueprintHash, gasEstimate);
          return next;
        });

        toast.success("Simulation successful");
        setSuccessfulSimulations((prev) => new Set(prev).add(order.requisition.blueprintHash));
      } catch (error) {
        toast.error(`Simulation failed: ${extractErrorMessage(error)}`);
        setFailedSimulations((prev) => new Set(prev).add(order.requisition.blueprintHash));

        const errorMsg = extractErrorMessage(error);
        setSimulationErrors((prev) => {
          const next = new Map(prev);
          next.set(order.requisition.blueprintHash, errorMsg);
          return next;
        });
      } finally {
        setSimulatingReq(null);
      }
    },
    [protocolAddress, publicClient, address],
  );

  // Execute order
  const handleExecute = useCallback(
    async (order: T) => {
      if (!protocolAddress) return;
      setExecutingReq(order.requisition.blueprintHash);
      setSubmitting(true);

      try {
        await writeWithEstimateGas({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "tractor",
          args: [
            {
              blueprint: order.requisition.blueprint,
              blueprintHash: order.requisition.blueprintHash,
              signature: order.requisition.signature,
            },
            "0x",
          ] as const,
        });
        setHasExecutedOrder(true);
      } catch (error) {
        console.error("Failed to execute order:", error);
      } finally {
        setExecutingReq(null);
        setSubmitting(false);
      }
    },
    [protocolAddress, writeWithEstimateGas, setSubmitting],
  );

  const { loading: isLoading, setLoading } = useDelayedLoading(500, true);
  useEffect(() => setLoading(ordersLoading), [ordersLoading, setLoading]);

  if (isLoading) {
    return (
      <Col className="items-center justify-center gap-2 py-4 min-h-72">
        <LoadingSpinner size={40} />
        <span>Loading orders...</span>
      </Col>
    );
  }

  return (
    <Col className="overflow-x-auto justify-between">
      <Table>
        <TableHeader className="table w-full table-fixed">
          <TableRow className="border-b border-pinto-gray-3/20">
            {columns.map((column, index) => (
              <TableHead key={index} className={cn("px-1.5", tableStyles.headerRow, column.className)}>
                {column.header}
              </TableHead>
            ))}
            <TableHead className={cn("px-1.5 min-w-[200px]", tableStyles.headerRow)}>
              <div className="flex flex-row justify-between items-start">
                <span>Simulate</span>
                <div className="text-xs text-pinto-gray-4 text-right">
                  {(() => {
                    if (!gasPrice) return "Loading gas price...";
                    return `Gas Price: ${(Number(gasPrice) / 1e9).toFixed(6)} gwei`;
                  })()}
                </div>
              </div>
            </TableHead>
            {successfulSimulations.size > 0 && calculateProfit && (
              <TableHead className={cn("px-1.5", tableStyles.headerRow)}>Estimated Profit</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBodyWrapper className={cn("[&_tr:first-child]:border-t [&_tr:last-child]:border-b", tableStyles.body)}>
          {sortedOrders.map((order, index) => (
            <TableRow
              key={`${order.requisition.blueprintHash}-${index}`}
              className={cn(
                "h-[2.75rem] bg-transparent items-center hover:bg-pinto-green-1 cursor-pointer transition-colors",
                tableStyles.bodyRow,
              )}
              noHoverMute
              onClick={() => onRowClick?.(order)}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={cn("px-1.5 py-1.5", column.className)}>
                  {column.accessor(order)}
                </TableCell>
              ))}
              <TableCell className="px-1.5 py-1.5">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (successfulSimulations.has(order.requisition.blueprintHash)) {
                        handleExecute(order);
                      } else {
                        handleSimulate(order);
                      }
                    }}
                    disabled={
                      simulatingReq === order.requisition.blueprintHash ||
                      failedSimulations.has(order.requisition.blueprintHash) ||
                      executingReq === order.requisition.blueprintHash ||
                      completedExecutions.has(order.requisition.blueprintHash) ||
                      (hasExecutedOrder && successfulSimulations.has(order.requisition.blueprintHash))
                    }
                    className={`
                      ${
                        successfulSimulations.has(order.requisition.blueprintHash) &&
                        !completedExecutions.has(order.requisition.blueprintHash) &&
                        !hasExecutedOrder
                          ? "bg-pinto-green-4 text-white hover:bg-pinto-green-5"
                          : completedExecutions.has(order.requisition.blueprintHash) ||
                              (hasExecutedOrder && successfulSimulations.has(order.requisition.blueprintHash))
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "text-pinto-gray-4 hover:text-pinto-gray-5"
                      } 
                      ${failedSimulations.has(order.requisition.blueprintHash) ? "opacity-50 cursor-not-allowed" : ""}
                      px-2 py-0 text-xs min-w-[80px]
                    `}
                  >
                    {simulatingReq === order.requisition.blueprintHash
                      ? "Simulating..."
                      : executingReq === order.requisition.blueprintHash
                        ? "Executing..."
                        : failedSimulations.has(order.requisition.blueprintHash)
                          ? "Reverted"
                          : completedExecutions.has(order.requisition.blueprintHash)
                            ? "Executed"
                            : hasExecutedOrder && successfulSimulations.has(order.requisition.blueprintHash)
                              ? "Resimulate"
                              : successfulSimulations.has(order.requisition.blueprintHash)
                                ? "Execute"
                                : "Simulate"}
                  </Button>
                  {successfulSimulations.has(order.requisition.blueprintHash) && (
                    <div
                      className="flex items-center text-pinto-gray-4 flex-1 min-w-0"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1 text-xs">
                        Est. Gas: {(() => {
                          const gas = gasEstimates.get(order.requisition.blueprintHash);
                          return gas ? formatter.number(gas.toString()) : "0";
                        })()}
                      </div>
                    </div>
                  )}
                  {failedSimulations.has(order.requisition.blueprintHash) &&
                    simulationErrors.get(order.requisition.blueprintHash) && (
                      <div
                        className="flex items-center text-pinto-red-4 flex-1 min-w-0"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <TooltipSimple
                          content={
                            <span className="font-light text-pinto-gray-3">
                              {simulationErrors.get(order.requisition.blueprintHash) || "Unknown error"}
                            </span>
                          }
                          variant="gray"
                        >
                          <div className="inline-flex items-center gap-1 text-xs text-pinto-red-4 max-w-full">
                            <InfoCircledIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{simulationErrors.get(order.requisition.blueprintHash)}</span>
                          </div>
                        </TooltipSimple>
                      </div>
                    )}
                </div>
              </TableCell>
              {successfulSimulations.size > 0 && calculateProfit && (
                <TableCell
                  className="px-1.5 text-sm text-right"
                  style={{ paddingTop: "0.375rem", paddingBottom: "0.375rem" }}
                >
                  {(() => {
                    if (!successfulSimulations.has(order.requisition.blueprintHash)) {
                      return "-";
                    }
                    const profit = calculateOrderProfit(order);
                    if (profit === -Infinity) return "-";

                    const isPositive = profit >= 0;
                    const color = isPositive ? "text-pinto-green-4" : "text-pinto-red-2";
                    const sign = isPositive ? "+" : "-";

                    return (
                      <span className={color}>
                        {isPositive ? `${sign}$${profit.toFixed(6)}` : `${sign}$${Math.abs(profit).toFixed(6)}`}
                      </span>
                    );
                  })()}
                </TableCell>
              )}
            </TableRow>
          ))}
          {sortedOrders.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1 + (successfulSimulations.size > 0 && calculateProfit ? 1 : 0)}
                className="px-1.5 text-center text-gray-500"
              >
                {emptyStateMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBodyWrapper>
      </Table>

      {/* Bottom section with instructions and Simulate All button */}
      <div className="mt-6 flex justify-between items-center">
        <div className="pinto-sm-light text-pinto-light">
          <div>{instructionText}</div>
          <div className="mt-1">
            Note that executing an order will likely affect the ability to execute another order.
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            rounded="full"
            className={`flex-1 ${
              simulatingAll || sortedOrders.length === 0
                ? "bg-pinto-gray-2 text-pinto-gray-4"
                : "bg-pinto-green-4 text-white"
            }`}
            disabled={simulatingAll || sortedOrders.length === 0}
            onClick={handleSimulateAll}
          >
            {simulatingAll ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                <span>Simulating All...</span>
              </div>
            ) : hasSimulatedAll ? (
              "Resimulate All"
            ) : (
              "Simulate all transactions"
            )}
          </Button>
        </div>
      </div>

      {/* Custom bottom content */}
      {bottomContent ? bottomContent : null}
    </Col>
  );
}

const tableStyles = {
  headerRow: clsx("text-left text-xs font-light text-pinto-gray-4 sticky top-0 z-10"),
  body: clsx("block max-h-[30rem] overflow-y-auto w-full"),
  bodyRow: clsx("table w-full table-fixed"),
} as const;

const MAX_HEIGHT_REM = 30;

const TableBodyWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [shouldFade, setShouldFade] = useState(false);
  const ref = useRef<HTMLTableSectionElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const hasMore = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      setShouldFade(hasMore);
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const fontSize = useGlobalFontSize();
  const height = ref.current?.clientHeight ?? 0;
  const enoughHeightForFade = height / fontSize > MAX_HEIGHT_REM - 1;
  const shouldShowFade = !height ? true : enoughHeightForFade && shouldFade;

  return (
    <div className="relative">
      <TableBody ref={ref} className={cn("block overflow-y-auto w-full", className)}>
        {children}
      </TableBody>
      {shouldShowFade && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent z-10" />
      )}
    </div>
  );
};

const BASE_FONT_SIZE = 16;

const useGlobalFontSize = () => {
  const [fontSize, setFontSize] = useState(0);

  useEffect(() => {
    const handleChange = () => {
      const el = window.getComputedStyle(document.documentElement);
      const fsValue = el.getPropertyValue("font-size");

      try {
        const fs = fsValue.split("px");
        setFontSize(Number(fs[0]));
      } catch (_) {
        setFontSize(BASE_FONT_SIZE);
      }
    };

    handleChange();
    window.addEventListener("resize", handleChange);
    return () => window.removeEventListener("resize", handleChange);
  }, []);

  return fontSize;
};
