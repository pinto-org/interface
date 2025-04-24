import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Switch } from "@/components/ui/Switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { PINTO } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Blueprint } from "@/lib/Tractor/types";
import {
  OrderbookEntry,
  SowBlueprintData,
  decodeSowTractorData,
  getSowBlueprintDisplayData,
  loadOrderbookData,
} from "@/lib/Tractor/utils";
import { useTemperature } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { getChainToken } from "@/utils/token";
import { cn } from "@/utils/utils";
import { GearIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-separator";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { toast } from "sonner";
import { usePublicClient } from "wagmi";
import { useChainId } from "wagmi";
import LoadingSpinner from "../LoadingSpinner";
import ReviewTractorOrderDialog, { ExecutionData } from "../ReviewTractorOrderDialog";
import { Plow } from "./Plow";

const BASESCAN_URL = "https://basescan.org/address/";

// Define props interface for SoilOrderbookContent
interface SoilOrderbookContentProps {
  showZeroAvailable?: boolean;
  sortBy?: "temperature" | "tip";
  showAboveCurrentTemp?: boolean;
}

// Shared logic for loading and displaying the orderbook data
export function SoilOrderbookContent({
  showZeroAvailable = true,
  sortBy = "temperature",
  showAboveCurrentTemp = true,
}: SoilOrderbookContentProps) {
  const [requisitions, setRequisitions] = useState<OrderbookEntry[]>([]);
  const [latestBlockInfo, setLatestBlockInfo] = useState<{ number: number; timestamp: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderbookEntry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const protocolAddress = useProtocolAddress();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const isMounted = useRef(true);
  const loadAttempted = useRef(false);
  const temperature = useTemperature();

  console.log("SoilOrderbook render - Dependencies:", {
    protocolAddress,
    publicClient: !!publicClient,
    latestBlockInfo,
    isLoading,
    requisitionsCount: requisitions.length,
    loadAttempted: loadAttempted.current,
  });

  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    console.log("Setting up cleanup");
    return () => {
      console.log("Component unmounting, setting isMounted to false");
      isMounted.current = false;
    };
  }, []);

  // Get latest block info once when component loads
  useEffect(() => {
    const fetchLatestBlock = async () => {
      console.log("Fetching latest block...");
      if (!publicClient) {
        console.log("No publicClient available");
        return;
      }
      try {
        const latestBlock = await publicClient.getBlock();
        console.log("Got latest block:", {
          number: latestBlock.number,
          timestamp: latestBlock.timestamp,
        });

        const blockInfo = {
          number: Number(latestBlock.number),
          timestamp: Number(latestBlock.timestamp) * 1000,
        };
        setLatestBlockInfo(blockInfo);
        console.log("Updated latestBlockInfo:", blockInfo);
      } catch (error) {
        console.error("Failed to fetch latest block:", error);
      }
    };
    fetchLatestBlock();
  }, [publicClient]);

  const getApproximateTimestamps = useCallback(
    (events: OrderbookEntry[]) => {
      console.log("Calculating timestamps for events:", {
        eventCount: events.length,
        latestBlockInfo,
      });

      if (!latestBlockInfo || events.length === 0) return events;

      return events.map((event) => {
        const blockDiff = latestBlockInfo.number - event.blockNumber;
        const timestamp = latestBlockInfo.timestamp - blockDiff * 2000;
        return {
          ...event,
          timestamp,
        };
      });
    },
    [latestBlockInfo],
  );

  const loadAllRequisitions = useCallback(async () => {
    console.log("loadAllRequisitions called with state:", {
      isLoading,
      hasPublicClient: !!publicClient,
      hasProtocolAddress: !!protocolAddress,
      isMounted: isMounted.current,
      loadAttempted: loadAttempted.current,
    });

    if (isLoading || !publicClient || !protocolAddress) {
      console.log("Skipping load - conditions not met:", {
        isLoading,
        hasPublicClient: !!publicClient,
        hasProtocolAddress: !!protocolAddress,
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting to load orderbook data...");
      // Use the new loadOrderbookData function
      const orderbookData = await loadOrderbookData(
        undefined,
        protocolAddress,
        publicClient,
        latestBlockInfo
          ? {
              number: BigInt(latestBlockInfo.number),
              timestamp: BigInt(latestBlockInfo.timestamp / 1000),
            }
          : undefined,
        temperature?.max ? temperature.max.toNumber() : undefined,
      );

      console.log("Got orderbook data:", {
        dataCount: orderbookData.length,
        isMounted: isMounted.current,
      });

      // Get approximate timestamps
      const dataWithTimestamps = getApproximateTimestamps(orderbookData);
      console.log("Added timestamps to data");

      // Sort data by temperature by default
      const sortedData = dataWithTimestamps.sort((a, b) => {
        try {
          const dataA = decodeSowTractorData(a.requisition.blueprint.data);
          const dataB = decodeSowTractorData(b.requisition.blueprint.data);
          if (!dataA || !dataB) return 0;
          return parseFloat(dataA.minTempAsString) - parseFloat(dataB.minTempAsString);
        } catch (error) {
          console.error("Failed to decode data for requisition:", error);
          return 0;
        }
      });

      console.log("Setting requisitions state with sorted data");
      setRequisitions(sortedData);
      loadAttempted.current = true;
    } catch (error) {
      console.error("Failed to load soil orderbook:", error);
      toast.error("Failed to load soil orderbook");
    } finally {
      setIsLoading(false);
    }
  }, [protocolAddress, publicClient, latestBlockInfo, getApproximateTimestamps, temperature]);

  // Load requisitions once when component mounts and dependencies are ready
  useEffect(() => {
    console.log("Main effect running with state:", {
      protocolAddress,
      hasPublicClient: !!publicClient,
      latestBlockInfo,
      isLoading,
      isMounted: isMounted.current,
      loadAttempted: loadAttempted.current,
    });

    if (protocolAddress && publicClient && latestBlockInfo && !isLoading && !loadAttempted.current) {
      console.log("All dependencies ready, calling loadAllRequisitions");
      loadAllRequisitions();
    } else {
      console.log("Dependencies not ready or already attempted:", {
        hasProtocolAddress: !!protocolAddress,
        hasPublicClient: !!publicClient,
        hasLatestBlockInfo: !!latestBlockInfo,
        isLoading,
        loadAttempted: loadAttempted.current,
      });
    }
  }, [protocolAddress, publicClient, latestBlockInfo, loadAllRequisitions, isLoading]);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);

    // Format: MM/DD/YY hh:mmAM/PM
    return (
      date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      }) +
      " " +
      date
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(" ", "")
    );
  };

  const handleRowClick = (requisition: OrderbookEntry) => {
    setSelectedOrder(requisition);
    setViewDialogOpen(true);
  };

  // Generate order data for the review dialog from the requisition
  const getOrderDataForReview = () => {
    if (!selectedOrder) return null;

    try {
      const decodedData = decodeSowTractorData(selectedOrder.requisition.blueprint.data);
      if (!decodedData) return null;

      return {
        totalAmount: TokenValue.fromBlockchain(decodedData.sowAmounts.totalAmountToSow, 6).toHuman(),
        temperature: decodedData.minTempAsString,
        podLineLength: decodedData.maxPodlineLengthAsString,
        minSoil: decodedData.sowAmounts.minAmountToSowPerSeasonAsString,
        operatorTip: TokenValue.fromBlockchain(decodedData.operatorParams.operatorTipAmount, 6).toHuman(),
        tokenStrategy: "LOWEST_SEEDS" as const, // Default, adjust based on your data
      };
    } catch (error) {
      console.error("Failed to decode data for requisition:", error);
      return null;
    }
  };

  // Apply sorting for display and insert temperature indicator
  const getSortedRequisitions = () => {
    let sorted: OrderbookEntry[];
    if (sortBy === "temperature") {
      sorted = [...requisitions].sort((a, b) => {
        try {
          const dataA = decodeSowTractorData(a.requisition.blueprint.data);
          const dataB = decodeSowTractorData(b.requisition.blueprint.data);
          if (!dataA || !dataB) return 0;
          return parseFloat(dataA.minTempAsString) - parseFloat(dataB.minTempAsString);
        } catch (error) {
          console.error("Failed to decode data for requisition:", error);
          return 0;
        }
      });
    } else if (sortBy === "tip") {
      sorted = [...requisitions].sort((a, b) => {
        try {
          const dataA = decodeSowTractorData(a.requisition.blueprint.data);
          const dataB = decodeSowTractorData(b.requisition.blueprint.data);
          if (!dataA || !dataB) return 0;
          const tipA = BigInt(dataA.operatorParams.operatorTipAmount);
          const tipB = BigInt(dataB.operatorParams.operatorTipAmount);
          return tipB > tipA ? 1 : tipB < tipA ? -1 : 0; // Highest tip first
        } catch (error) {
          console.error("Failed to decode data for requisition:", error);
          return 0;
        }
      });
    } else {
      sorted = requisitions;
    }

    return sorted.filter((req) => {
      // Filter for zero available
      const hasAvailablePinto = showZeroAvailable || parseFloat(req.currentlySowable.toHuman()) > 0;

      // Filter for current temperature
      let matchesTemperatureFilter = true;
      if (!showAboveCurrentTemp) {
        try {
          const data = decodeSowTractorData(req.requisition.blueprint.data);
          if (data) {
            const reqTemp = parseFloat(data.minTempAsString);
            matchesTemperatureFilter = reqTemp < temperature.max.toNumber();
          }
        } catch (error) {
          console.error("Failed to decode data for temperature filtering:", error);
        }
      }

      return hasAvailablePinto && matchesTemperatureFilter;
    });
  };

  // Find where to place the temperature indicator row
  const getMaxTempPosition = (sortedReqs) => {
    if (sortBy !== "temperature" || !sortedReqs.length) return -1;

    // No need to multiply by 100, the temperature is already in percentage
    const maxTemp = temperature.max.toNumber();

    let insertIndex = 0;

    // Debug data about requisitions and their temperatures
    if (sortedReqs.length > 0) {
      sortedReqs.forEach((req, idx) => {
        try {
          const data = decodeSowTractorData(req.requisition.blueprint.data);
          if (data) {
            // Parse the percentage string to just get the number
            const tempValue = parseFloat(data.minTempAsString);
            console.log(`  ${idx}: Temperature ${tempValue}% (${data.minTempAsString})`);
          }
        } catch (error) {
          console.error(`Failed to decode data for requisition ${idx}:`, error);
        }
      });
    }

    // Insert at the position where the first requisition temperature is GREATER than max temperature
    while (
      insertIndex < sortedReqs.length &&
      parseFloat(decodeSowTractorData(sortedReqs[insertIndex].requisition.blueprint.data)?.minTempAsString || "0") <=
        maxTemp
    ) {
      insertIndex++;
    }

    return insertIndex;
  };

  const sortedRequisitions = getSortedRequisitions();
  const maxTempPosition = getMaxTempPosition(sortedRequisitions);

  // Calculate summary data for orders below current max temperature
  const calculateSummaryData = () => {
    let totalAvailablePinto = TokenValue.ZERO;
    let totalMaxPerSeason = TokenValue.ZERO;

    requisitions.forEach((req) => {
      try {
        const data = decodeSowTractorData(req.requisition.blueprint.data);
        if (data) {
          const reqTemp = parseFloat(data.minTempAsString);
          // Only include orders with temperature below current max
          if (reqTemp < temperature.max.toNumber()) {
            // Sum available Pinto
            totalAvailablePinto = totalAvailablePinto.add(req.currentlySowable);

            // Sum max per season
            if (data.sowAmounts.maxAmountToSowPerSeasonAsString) {
              const maxPerSeason = TokenValue.fromHuman(data.sowAmounts.maxAmountToSowPerSeasonAsString, 6);
              totalMaxPerSeason = totalMaxPerSeason.add(maxPerSeason);
            }
          }
        }
      } catch (error) {
        console.error("Failed to calculate summary data for requisition:", error);
      }
    });

    return {
      totalAvailablePinto,
      totalMaxPerSeason,
    };
  };

  const summaryData = calculateSummaryData();

  // Flag to enable/disable temperature indicator row - set to false to hide, true to show. We are awaiting design on this.
  const showTemperatureIndicator = false;

  // Helper function to render the temperature indicator row
  const renderTemperatureIndicatorRow = () => (
    <TableRow className="border-b-0">
      <TableCell className="py-1 px-0 text-pinto-green-4 border-b-0" colSpan={2}>
        ↑ {formatter.pct(temperature.max)} - Current Temp
      </TableCell>
      <TableCell className="py-1 border-b-0 text-pinto-green-4 justify-end text-right">Totals:</TableCell>
      <TableCell className="py-1 text-right border-b-0">
        <div className="flex items-center justify-start gap-1">
          <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
          <span className="text-pinto-green-4 font-medium">{formatter.number(summaryData.totalAvailablePinto)}</span>
        </div>
      </TableCell>
      <TableCell className="py-1 text-right border-b-0">
        <div className="flex items-center justify-start gap-1">
          <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
          <span className="text-pinto-green-4 font-medium">{formatter.number(summaryData.totalMaxPerSeason)}</span>
        </div>
      </TableCell>
      <TableCell className="py-1 border-b-0" colSpan={5} />
    </TableRow>
  );

  // Helper function to render a requisition row
  const renderRequisitionRow = (req, index) => {
    let decodedData: SowBlueprintData | null = null;
    try {
      decodedData = decodeSowTractorData(req.requisition.blueprint.data);
    } catch (error) {
      console.error("Failed to decode data for requisition:", error);
    }

    // Get temperature
    const temperature = decodedData ? parseFloat(decodedData.minTempAsString) : 0;

    // Get max pod line length
    const maxPodLineLength = decodedData ? parseInt(decodedData.maxPodlineLengthAsString).toLocaleString() : "Unknown";

    // Total order size
    const totalSize = decodedData
      ? formatter.number(TokenValue.fromBlockchain(decodedData.sowAmounts.totalAmountToSow, 6))
      : "Unknown";

    // Available Pinto
    const availablePinto = formatter.number(req.currentlySowable);

    return (
      <TableRow
        key={`req-${index}`}
        className="border-b border-gray-100 hover:bg-pinto-green-1 cursor-pointer transition-colors"
        noHoverMute
        onClick={() => handleRowClick(req)}
      >
        <TableCell className="py-2 px-0">≥ {temperature.toFixed(0)}%</TableCell>
        <TableCell className="py-2">≤ {maxPodLineLength}</TableCell>
        <TableCell className="py-2">
          <div className="flex items-center gap-1">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {totalSize}
          </div>
        </TableCell>
        <TableCell className="py-2">
          <div className="flex items-center gap-1">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {availablePinto}
          </div>
        </TableCell>
        <TableCell className="py-2">
          <div className="flex items-center gap-1">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {decodedData && decodedData.sowAmounts.maxAmountToSowPerSeasonAsString
              ? formatter.number(TokenValue.fromHuman(decodedData.sowAmounts.maxAmountToSowPerSeasonAsString, 6))
              : "Unknown"}
          </div>
        </TableCell>
        <TableCell className="py-2">
          {decodedData && decodedData.runBlocksAfterSunrise !== undefined ? (
            Number(decodedData.runBlocksAfterSunrise) < 300 ? (
              <span className="text-pinto-green-4 font-medium">Yes</span>
            ) : (
              <span className="text-pinto-gray-4">No</span>
            )
          ) : (
            "Unknown"
          )}
        </TableCell>
        <TableCell className="py-2">
          <div className="flex items-center gap-1">
            <IconImage src={PINTO.logoURI} alt="PINTO" size={4} />
            {decodedData && decodedData.operatorParams.operatorTipAmount
              ? formatter.number(TokenValue.fromBlockchain(decodedData.operatorParams.operatorTipAmount, 6), {
                  minDecimals: 2,
                  maxDecimals: 2,
                })
              : "Unknown"}
          </div>
        </TableCell>
        <TableCell className="py-2 text-pinto-dark">
          {`0x${req.requisition.blueprintHash.slice(2, 7)}...${req.requisition.blueprintHash.slice(-4)}`}
        </TableCell>
        <TableCell className="py-2">
          <a
            href={`${BASESCAN_URL}${req.requisition.blueprint.publisher}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pinto-dark underline hover:opacity-80"
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the link
          >
            {`0x${req.requisition.blueprint.publisher.slice(2, 7)}...${req.requisition.blueprint.publisher.slice(-4)}`}
          </a>
        </TableCell>
        <TableCell className="py-2">{formatDate(req.timestamp)}</TableCell>
      </TableRow>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow className="border-b-0">
            <TableHead className="py-2 px-0 font-light text-[#9C9C9C] text-base leading-[110%]">Temperature</TableHead>
            <TableHead className="py-2 font-light text-[#9C9C9C] text-base leading-[110%]">
              Max Podline Length
            </TableHead>
            <TableHead className="py-2 font-light text-[#9C9C9C] text-base leading-[110%]">
              Total Soil Order Size
            </TableHead>
            <TableHead className="py-2 font-light text-[#9C9C9C] text-base leading-[110%]">Available Pinto</TableHead>
            <TableHead className="py-2 font-light text-[#9C9C9C] text-base leading-[110%]">Max per Season</TableHead>
            <TableHead className="py-2 font-light text-[#9C9C9C] text-base leading-[110%]">Blueprint Hash</TableHead>
            <TableHead className="py-2 font-light text-[#9C9C9C] text-base leading-[110%]">Publisher</TableHead>
            <TableHead className="py-2 font-light text-[#9C9C9C] text-base leading-[110%]">Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRequisitions.map((req, index) => {
            // Insert the current max temperature indicator at the appropriate position
            if (sortBy === "temperature" && index === maxTempPosition) {
              return (
                <React.Fragment key="current-max-temp">
                  {/* Temperature indicator row - disabled when showTemperatureIndicator is false */}
                  {showTemperatureIndicator && renderTemperatureIndicatorRow()}
                  {renderRequisitionRow(req, index)}
                </React.Fragment>
              );
            }
            return renderRequisitionRow(req, index);
          })}
          {/* Temperature indicator row at the end - disabled when showTemperatureIndicator is false */}
          {sortBy === "temperature" &&
            maxTempPosition === sortedRequisitions.length &&
            showTemperatureIndicator &&
            renderTemperatureIndicatorRow()}
          {sortedRequisitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="p-2 text-center text-gray-500">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size={20} />
                    <span>Loading tractor orders...</span>
                  </div>
                ) : (
                  "No active requisitions found"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Review Tractor Order Dialog */}
      {selectedOrder && (
        <ReviewTractorOrderDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          orderData={
            getOrderDataForReview() || {
              totalAmount: "0",
              temperature: "0",
              podLineLength: "0",
              minSoil: "0",
              operatorTip: "0",
            }
          }
          encodedData={selectedOrder.requisition.blueprint.data}
          operatorPasteInstrs={Array.from(selectedOrder.requisition.blueprint.operatorPasteInstrs) as `0x${string}`[]}
          blueprint={
            {
              ...selectedOrder.requisition.blueprint,
              operatorPasteInstrs: Array.from(
                selectedOrder.requisition.blueprint.operatorPasteInstrs,
              ) as `0x${string}`[],
            } as Blueprint
          }
          isViewOnly={true}
          executionHistory={[]} // No execution history in the current data model
        />
      )}
    </div>
  );
}

// Dialog version of the component
interface SoilOrderbookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SoilOrderbookDialog({ open, onOpenChange }: SoilOrderbookDialogProps) {
  const [activeTab, setActiveTab] = useState<"view" | "execute">("view");
  const [showZeroAvailable, setShowZeroAvailable] = useState(true);
  const [sortBy, setSortBy] = useState<"temperature" | "tip">("temperature");
  const [showAboveCurrentTemp, setShowAboveCurrentTemp] = useState(true);

  // Small Label component with forced small text size
  const SmallLabel = (props: React.ComponentProps<typeof Label>) => (
    <Label {...props} style={{ fontSize: "1rem", lineHeight: "1rem" }} />
  );

  const sortOptions = [
    {
      id: "temperature",
      text: "Temperature",
    },
    {
      id: "tip",
      text: "Tip",
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-sm bg-black/30" />
        <DialogContent className="max-w-[90rem] w-[98vw] bg-gray-50 border border-gray-200 p-0">
          <DialogHeader className="pt-2">
            <DialogTitle className="text-xl font-bold">Tractor Soil Orders</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <div className="border-b">
              <div className="flex items-end justify-between">
                <div className="flex gap-4">
                  <button
                    type="button"
                    className={`pb-2 pt-1 ${activeTab === "view" ? "border-b-2 border-pinto-green-4 font-medium -mb-[2px]" : "border-b-2 border-transparent text-pinto-gray-4 -mb-[2px]"}`}
                    onClick={() => setActiveTab("view")}
                  >
                    View Soil Orders
                  </button>
                  <button
                    type="button"
                    className={`pb-2 pt-1 ${activeTab === "execute" ? "border-b-2 border-pinto-green-4 font-medium -mb-[2px]" : "border-b-2 border-transparent text-pinto-gray-4 -mb-[2px]"}`}
                    onClick={() => setActiveTab("execute")}
                  >
                    Execute Soil Orders
                  </button>
                </div>

                <div className="pb-2">
                  {activeTab === "view" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-full h-8"
                          aria-label="Table Settings"
                        >
                          <GearIcon className="h-5 w-5 text-pinto-gray-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <h3 className="text-xs font-medium mb-3" style={{ fontSize: "1rem", lineHeight: "1rem" }}>
                          Table Settings
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <SmallLabel htmlFor="show-zero-available">Show Zero Available Pinto</SmallLabel>
                            <Switch
                              id="show-zero-available"
                              checked={showZeroAvailable}
                              onCheckedChange={setShowZeroAvailable}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <SmallLabel htmlFor="show-above-temp">Show Orders Above Current Temp</SmallLabel>
                            <Switch
                              id="show-above-temp"
                              checked={showAboveCurrentTemp}
                              onCheckedChange={setShowAboveCurrentTemp}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <SmallLabel>Sort By</SmallLabel>
                            <div className="flex flex-row w-fit items-center">
                              {sortOptions.map((option, index) => (
                                <React.Fragment key={`dialog-${option.id}-${index}`}>
                                  <div
                                    className={cn(
                                      "flex flex-row items-center px-3 py-1.5 justify-center cursor-pointer",
                                      sortBy === option.id ? "bg-pinto-green-1" : "bg-pinto-gray-1",
                                      index === 0 ? "rounded-l-full" : "rounded-r-full",
                                      sortBy === option.id
                                        ? "border border-pinto-green-4"
                                        : "border border-pinto-gray-2",
                                      index === 0 ? "border-r-0" : "border-l-0",
                                    )}
                                    onClick={() => setSortBy(option.id)}
                                  >
                                    <div className="text-xs text-pinto-green-3">{option.text}</div>
                                  </div>
                                  {index < sortOptions.length - 1 && (
                                    <Separator
                                      orientation="vertical"
                                      className={cn(
                                        "bg-pinto-gray-2 w-[1px] h-[1.75rem]",
                                        sortBy && "bg-pinto-green-4",
                                      )}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </div>

            <div className="py-4">
              {activeTab === "view" ? (
                <SoilOrderbookContent
                  showZeroAvailable={showZeroAvailable}
                  sortBy={sortBy}
                  showAboveCurrentTemp={showAboveCurrentTemp}
                />
              ) : (
                <Plow />
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
