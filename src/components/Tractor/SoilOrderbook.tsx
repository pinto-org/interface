import { TokenValue } from "@/classes/TokenValue";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
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
import { formatter } from "@/utils/format";
import { getChainToken } from "@/utils/token";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePublicClient } from "wagmi";
import { useChainId } from "wagmi";
import LoadingSpinner from "../LoadingSpinner";
import ReviewTractorOrderDialog, { ExecutionData } from "../ReviewTractorOrderDialog";
import { Plow } from "./Plow";

const BASESCAN_URL = "https://basescan.org/address/";

// Shared logic for loading and displaying the orderbook data
export function SoilOrderbookContent() {
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
      );

      console.log("Got orderbook data:", {
        dataCount: orderbookData.length,
        isMounted: isMounted.current,
      });

      // Get approximate timestamps
      const dataWithTimestamps = getApproximateTimestamps(orderbookData);
      console.log("Added timestamps to data");

      // Sort by temperature
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
  }, [protocolAddress, publicClient, latestBlockInfo, getApproximateTimestamps]);

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow className="border-b-0">
            <TableHead className="py-2 px-0 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Temperature
            </TableHead>
            <TableHead className="py-2 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Max Podline Length
            </TableHead>
            <TableHead className="py-2 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Total Soil Order Size
            </TableHead>
            <TableHead className="py-2 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Available Pinto
            </TableHead>
            <TableHead className="py-2 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Max per Season
            </TableHead>
            <TableHead className="py-2 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Blueprint Hash
            </TableHead>
            <TableHead className="py-2 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Publisher
            </TableHead>
            <TableHead className="py-2 font-antarctica font-light text-[#9C9C9C] text-base leading-[110%]">
              Created at
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requisitions.map((req, index) => {
            let decodedData: SowBlueprintData | null = null;
            try {
              decodedData = decodeSowTractorData(req.requisition.blueprint.data);
            } catch (error) {
              console.error("Failed to decode data for requisition:", error);
            }

            // Get temperature
            const temperature = decodedData ? parseFloat(decodedData.minTempAsString) : 0;

            // Get max pod line length
            const maxPodLineLength = decodedData
              ? parseInt(decodedData.maxPodlineLengthAsString).toLocaleString()
              : "Unknown";

            // Total order size
            const totalSize = decodedData
              ? formatter.number(TokenValue.fromBlockchain(decodedData.sowAmounts.totalAmountToSow, 6))
              : "Unknown";

            // Available Pinto
            const availablePinto = formatter.number(req.currentlySowable);

            return (
              <TableRow
                key={index}
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
                      ? formatter.number(
                          TokenValue.fromHuman(decodedData.sowAmounts.maxAmountToSowPerSeasonAsString, 6),
                        )
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
          })}
          {requisitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="p-2 text-center text-gray-500">
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

// Original standalone component
export function SoilOrderbook() {
  return <SoilOrderbookContent />;
}

// Dialog version of the component
interface SoilOrderbookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SoilOrderbookDialog({ open, onOpenChange }: SoilOrderbookDialogProps) {
  const [activeTab, setActiveTab] = useState<"view" | "execute">("view");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-sm bg-black/30" />
        <DialogContent className="max-w-7xl w-[95vw] bg-gray-50 border border-gray-200">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-antarctica font-bold">Tractor</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <div className="flex gap-4 border-b pinto-sm">
              <button
                type="button"
                className={`pb-2 font-antarctica ${activeTab === "view" ? "border-b-2 border-green-600 font-medium" : "border-b-2 border-transparent text-pinto-gray-4"}`}
                onClick={() => setActiveTab("view")}
              >
                View Soil Orders
              </button>
              <button
                type="button"
                className={`pb-2 font-antarctica ${activeTab === "execute" ? "border-b-2 border-green-600 font-medium" : "border-b-2 border-transparent text-pinto-gray-4"}`}
                onClick={() => setActiveTab("execute")}
              >
                Execute Soil Orders
              </button>
            </div>

            <div className="pt-6">{activeTab === "view" ? <SoilOrderbookContent /> : <Plow />}</div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
