import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import TooltipSimple from "@/components/TooltipSimple";
import { SoilOrderbookDialog } from "@/components/Tractor/SoilOrderbook";
import IconImage from "@/components/ui/IconImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { OrderbookEntry, SowBlueprintData, decodeSowTractorData, loadOrderbookData } from "@/lib/Tractor/utils";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useTemperature } from "@/state/useFieldData";
import { useSeason } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { parseEther } from "viem";
import { usePublicClient } from "wagmi";

interface FieldActivityItem {
  id: string;
  timestamp: number; // Unix timestamp
  season: number | null;
  type: "sow" | "harvest" | "transfer" | "other";
  amount: TokenValue;
  pods: TokenValue;
  temperature: number;
  placeInLine: string;
  address: string;
  txHash: string;
}

/**
 * Estimates the season number for a transaction based on its block number
 * Using the knowledge that a new season starts each hour and blocks are ~2 seconds each
 */
const estimateSeasonFromBlock = (
  eventBlockNumber: number,
  latestBlockNumber: number,
  currentSeason: number | undefined,
): number | null => {
  // Return null if we don't have valid inputs yet
  if (!latestBlockNumber || !currentSeason) return null;

  // On Base, blocks are approximately 2 seconds each
  // 1 hour = 3600 seconds = ~1800 blocks per season
  const BLOCKS_PER_SEASON = 1800;

  // Calculate block difference from the latest block
  const blockDifference = latestBlockNumber - eventBlockNumber;

  // Calculate how many seasons ago this was
  const seasonsAgo = Math.floor(blockDifference / BLOCKS_PER_SEASON);

  // Calculate the estimated season (ensure it's at least 1)
  const estimatedSeason = currentSeason - seasonsAgo;
  return estimatedSeason > 0 ? estimatedSeason : null;
};

const FieldActivity: React.FC = () => {
  const publicClient = usePublicClient();
  const protocolAddress = useProtocolAddress();
  const [loading, setLoading] = React.useState(true);
  const [activities, setActivities] = React.useState<FieldActivityItem[]>([]);
  const [tractorOrders, setTractorOrders] = React.useState<OrderbookEntry[]>([]);
  const [loadingTractorOrders, setLoadingTractorOrders] = React.useState(true);
  const currentSeason = useSeason();
  const currentTemperature = useTemperature();
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null);
  const harvestableIndex = useHarvestableIndex();
  const [showTractorOrdersDialog, setShowTractorOrdersDialog] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tractorLinksRef = useRef<HTMLDivElement>(null);

  // Add a ref to store initial block data that won't trigger re-renders
  const initialBlockDataRef = useRef<{
    latestBlockNumber: number | null;
    latestBlockTimestamp: number | null;
  }>({
    latestBlockNumber: null,
    latestBlockTimestamp: null,
  });

  // Helper function to estimate temperature from an order
  const getOrderTemperature = (order: OrderbookEntry): number => {
    // Try to decode the data to get the temperature
    if (order.requisition && order.requisition.blueprint && order.requisition.blueprint.data) {
      const decodedData = decodeSowTractorData(order.requisition.blueprint.data);
      if (decodedData && decodedData.minTempAsString) {
        return parseFloat(decodedData.minTempAsString);
      }
    }
    // Default temperature if we can't decode
    return 0.0; // 0% is a reasonable default
  };

  // Helper function to get the decoded tractor data
  const getDecodedTractorData = (order: OrderbookEntry): SowBlueprintData | null => {
    if (order.requisition && order.requisition.blueprint && order.requisition.blueprint.data) {
      return decodeSowTractorData(order.requisition.blueprint.data);
    }
    return null;
  };

  // Helper function to estimate execution time based on runBlocksAfterSunrise
  const estimateExecutionTime = (order: OrderbookEntry): string => {
    const decodedData = getDecodedTractorData(order);

    if (decodedData && decodedData.runBlocksAfterSunriseAsString) {
      const runBlocks = parseInt(decodedData.runBlocksAfterSunriseAsString);

      // Estimate execution time as next hour + 2 seconds × runBlocksAfterSunrise
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(nextHour.getHours() + 1);
      nextHour.setMinutes(0);
      nextHour.setSeconds(0);
      nextHour.setMilliseconds(0);

      // Add delay based on runBlocksAfterSunrise (2 seconds per block)
      const estimatedTime = new Date(nextHour.getTime() + runBlocks * 2 * 1000);

      return estimatedTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }

    return "-"; // Fallback value if we can't estimate
  };

  // Helper function to get the predicted sow temperature
  const getPredictedSowTemperature = (order: OrderbookEntry): number => {
    // Get the minimum temperature from the order
    const minTemp = getOrderTemperature(order);

    const decodedData = getDecodedTractorData(order);
    if (decodedData && decodedData.runBlocksAfterSunriseAsString) {
      const runBlocks = parseInt(decodedData.runBlocksAfterSunriseAsString);
      if (runBlocks >= 300 && currentTemperature.scaled) {
        // After morning auction - use max of current temperature and minimum temperature
        const currentTemp = currentTemperature.scaled.toNumber();
        return Math.max(currentTemp, minTemp);
      }
    }
    // Otherwise use the minimum temperature from the order
    return minTemp;
  };

  // Helper function to estimate pods from an order
  const estimateOrderPods = (order: OrderbookEntry): TokenValue => {
    // Use the predicted temperature
    const temp = getPredictedSowTemperature(order);

    // Calculate pods as PINTO amount * (1 + temperature/100)
    return order.amountSowableNextSeason.mul(1 + temp / 100);
  };

  // Fetch tractor orders
  React.useEffect(() => {
    const fetchTractorOrders = async () => {
      if (!publicClient || !protocolAddress) return;

      try {
        setLoadingTractorOrders(true);

        // Get the current block
        const latestBlock = await publicClient.getBlock();
        const latestBlockInfo = {
          number: latestBlock.number,
          timestamp: latestBlock.timestamp,
        };

        // Fetch orderbook data
        const orderbook = await loadOrderbookData(
          undefined, // No specific address filter
          protocolAddress,
          publicClient,
          latestBlockInfo,
        );

        // Filter out orders with predicted temperatures greater than current temperature + 1%
        const currentTemp = currentTemperature.scaled?.toNumber() || 0;

        const filteredOrders = orderbook.filter((order) => {
          const predictedTemp = getPredictedSowTemperature(order);

          // Only include orders with temperature requirements that could reasonably execute soon
          // Use the predicted temperature, which is now guaranteed to be at least the minimum
          return predictedTemp <= currentTemp + 1;
        });

        // Sort by predicted temperature (lowest to highest)
        const sortedOrders = [...filteredOrders].sort((a, b) => {
          // We want to sort by lowest predicted temperature first
          return getPredictedSowTemperature(a) - getPredictedSowTemperature(b);
        });

        setTractorOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching tractor orders:", error);
      } finally {
        setLoadingTractorOrders(false);
      }
    };

    fetchTractorOrders();
  }, [publicClient, protocolAddress]);

  React.useEffect(() => {
    const fetchSowEvents = async () => {
      if (!publicClient || !protocolAddress) return;

      try {
        setLoading(true);

        // Get the current block number and timestamp
        const latestBlock = await publicClient.getBlock();
        const latestBlockNumber = Number(latestBlock.number);
        const latestBlockTimestamp = Number(latestBlock.timestamp);

        // Store the initial block data in the ref if not already set
        if (initialBlockDataRef.current.latestBlockNumber === null) {
          initialBlockDataRef.current = {
            latestBlockNumber,
            latestBlockTimestamp,
          };
        }

        // Use the stored initial values for all calculations
        const storedBlockNumber = initialBlockDataRef.current.latestBlockNumber || latestBlockNumber;
        const storedBlockTimestamp = initialBlockDataRef.current.latestBlockTimestamp || latestBlockTimestamp;

        // Calculate a fromBlock value for 30 days worth of blocks on Base
        // Base has a 2-second block time
        // 30 days = 30 * 24 * 60 * 60 = 2,592,000 seconds
        // At 2 seconds per block: 2,592,000 / 2 = 1,296,000 blocks
        const lookbackBlocks = 1_296_000n;
        const fromBlock = latestBlock.number > lookbackBlocks ? latestBlock.number - lookbackBlocks : 0n;

        // Fetch the most recent sow events
        const sowEvents = await publicClient.getContractEvents({
          address: protocolAddress,
          abi: diamondABI,
          eventName: "Sow", // Use the correct event name for sow events
          fromBlock,
          toBlock: "latest",
        });

        // Blockchain events typically come in chronological order (oldest first)
        // Reverse the array to get newest first
        const reversedEvents = [...sowEvents].reverse();

        // Limit to 100 events
        const limitedEvents = reversedEvents.slice(0, 100);

        // Process events one-at-a-time to ensure order-dependent calculations
        const activityItems: FieldActivityItem[] = [];

        for (let index = 0; index < limitedEvents.length; index++) {
          const event = limitedEvents[index];
          const { args, blockNumber, transactionHash } = event;

          // From the ABI, Sow event has: account, fieldId, index, beans, pods
          const account = args.account || "0x0000000000000000000000000000000000000000";
          const fieldId = args.fieldId || BigInt(0);
          const podIndex = args.index || BigInt(0);
          const beans = args.beans || BigInt(0); // PINTO amount in beans
          const pods = args.pods || BigInt(0);

          // Calculate timestamp using block number difference and 2-second block time
          // Base has 2 second blocks
          const blockDiff = storedBlockNumber - Number(blockNumber);
          const timestamp = storedBlockTimestamp - blockDiff * 2;

          // Estimate the actual season based on block number
          const estimatedSeason = estimateSeasonFromBlock(
            Number(blockNumber),
            storedBlockNumber,
            Number(currentSeason),
          );

          // Convert the podIndex to a TokenValue
          const podIndexTV = TokenValue.fromBlockchain(podIndex, 6);

          // Get the harvestable index for calculating the place in line
          const harvestableIndexValue = harvestableIndex || TokenValue.ZERO;

          // Calculate the actual place in line by subtracting the harvestable index
          const actualPlaceInLine = podIndexTV.sub(harvestableIndexValue);

          // Format the place in line for display
          const placeInLine = formatter.number(Math.max(0, Number(actualPlaceInLine.toHuman())));

          // Calculate temperature from the ratio of pods to beans
          // This represents the bonus percentage (pods/beans - 100%)
          const beanAmount = TokenValue.fromBlockchain(beans.toString(), 6);
          const podAmount = TokenValue.fromBlockchain(pods.toString(), 6);
          const rawTemperature = beanAmount.gt(0) ? Math.round(podAmount.div(beanAmount).mul(100).toNumber()) : 0;

          // Subtract 100% to get the bonus percentage
          const temperature = Math.max(0, rawTemperature - 100);

          // Add to activity items in sequence
          activityItems.push({
            id: `${transactionHash}-${index}`,
            timestamp,
            season: estimatedSeason,
            type: "sow",
            amount: beanAmount,
            pods: podAmount,
            temperature, // Calculated temperature percentage
            placeInLine,
            address: account as string,
            txHash: transactionHash,
          });
        }

        setActivities(activityItems);
      } catch (error) {
        console.error("Error fetching sow events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSowEvents();
  }, [publicClient, protocolAddress, currentSeason, harvestableIndex]);

  // Effect for creating the vertical bar
  useEffect(() => {
    if (loadingTractorOrders) {
      return;
    }

    // Remove any existing bars
    const existingBars = document.querySelectorAll(".vertical-tractor-bar");
    existingBars.forEach((bar) => bar.remove());

    // Wait for next render cycle to ensure rows are fully rendered
    setTimeout(() => {
      if (!tableContainerRef.current) return;

      // Get tractor order rows if they exist
      const rows = document.querySelectorAll(".tractor-order-row");

      let spanStartY: number;
      let totalHeight: number;

      if (rows.length > 0) {
        // If we have tractor order rows, use their position and height
        spanStartY = (rows[0] as HTMLElement).offsetTop;
        totalHeight = 0;

        rows.forEach((row) => {
          totalHeight += (row as HTMLElement).offsetHeight;
        });
      } else {
        // If no tractor orders, use the "No Tractor orders" row or the first available row
        const noOrdersRow = document.querySelector('tr td[colspan="9"]');
        if (noOrdersRow) {
          const rowElement = noOrdersRow.closest("tr") as HTMLElement;
          if (rowElement) {
            spanStartY = rowElement.offsetTop;
            totalHeight = rowElement.offsetHeight;
          } else {
            // Fallback position if no rows at all
            spanStartY = 100;
            totalHeight = 40;
          }
        } else {
          // Fallback position if no specific row found
          const firstRow = document.querySelector("tbody tr") as HTMLElement;
          if (firstRow) {
            spanStartY = firstRow.offsetTop;
            totalHeight = firstRow.offsetHeight;
          } else {
            // Default values if no rows found
            spanStartY = 100;
            totalHeight = 40;
          }
        }
      }

      // Create the vertical bar
      const bar = document.createElement("div");
      bar.className = "vertical-tractor-bar";
      bar.style.cssText = `
        position: absolute;
        right: -1rem;
        top: ${spanStartY}px;
        height: ${totalHeight}px;
        width: 1px;
        background-color: #D9D9D9; /* pinto-gray-2 color */
        z-index: 10;
        pointer-events: none;
      `;
      tableContainerRef.current.appendChild(bar);

      // Calculate the vertical center of the bar
      const centerY = spanStartY + totalHeight / 2;

      // Position the links container vertically centered
      if (tractorLinksRef.current) {
        const linksHeight = tractorLinksRef.current.offsetHeight;
        tractorLinksRef.current.style.top = `${centerY - linksHeight / 2}px`;
      }
    }, 100);

    // Cleanup
    return () => {
      const bars = document.querySelectorAll(".vertical-tractor-bar");
      bars.forEach((bar) => bar.remove());
    };
  }, [tractorOrders, loadingTractorOrders]);

  const formatType = (type: string) => {
    switch (type) {
      case "sow":
        return "Sow";
      case "harvest":
        return "Harvest";
      case "transfer":
        return "Transfer";
      default:
        return "Other";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-3)}`;
  };

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: number | string) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update the formatType function or add a new formatting function for seasons
  const formatSeason = (season: number | null): string => {
    return season !== null ? season.toString() : "-";
  };

  // Render a loading skeleton for the entire table
  if (loading && loadingTractorOrders) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Season</th>
                <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Date</th>
                <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Time</th>
                <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Address</th>
                <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Txn Hash</th>
                <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Temp</th>
                <th className="px-2 py-1 text-right text-xs font-antarctica font-light text-pinto-gray-4">
                  Amount Sown
                </th>
                <th className="px-2 py-1 text-right text-xs font-antarctica font-light text-pinto-gray-4">
                  Pods minted
                </th>
                <th className="px-2 py-1 text-right text-xs font-antarctica font-light text-pinto-gray-4">
                  Place in Line
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-12" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-24" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-20" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-28" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-28" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-14" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-20" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-20" />
                    </td>
                    <td className="px-2 py-1">
                      <Skeleton className="h-3 w-24" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activities.length === 0 && tractorOrders.length === 0) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center">
        <p className="text-sm text-pinto-gray-4 mb-2">No field activity found</p>
        <p className="text-xs text-pinto-gray-3">Activities like Sowing and Harvesting will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Add Tractor Orders label and link */}
      <div
        ref={tractorLinksRef}
        style={{ position: "absolute", right: "-18rem" }}
        className="flex flex-col items-start transition-all duration-300"
      >
        <span className="text-sm font-antarctica font-light text-pinto-dark mb-2">
          Tractor Soil Orders for next Season
        </span>
        <button
          type="button"
          onClick={() => setShowTractorOrdersDialog(true)}
          className="text-sm font-antarctica font-light text-pinto-green-4 hover:text-pinto-green-5 hover:underline text-left"
        >
          See all Tractor Orders
        </button>
      </div>

      {/* Tractor Orders Dialog */}
      <SoilOrderbookDialog open={showTractorOrdersDialog} onOpenChange={setShowTractorOrdersDialog} />

      <div className="overflow-x-auto" ref={tableContainerRef}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-pinto-gray-3/20">
              <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Season</th>
              <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Date</th>
              <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Time</th>
              <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Address</th>
              <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4">Txn Hash</th>
              <th className="px-2 py-1 text-left text-xs font-antarctica font-light text-pinto-gray-4 min-w-[75px]">
                Temp
              </th>
              <th className="px-2 py-1 text-right text-xs font-antarctica font-light text-pinto-gray-4">Amount Sown</th>
              <th className="px-2 py-1 text-right text-xs font-antarctica font-light text-pinto-gray-4">Pods minted</th>
              <th className="px-2 py-1 text-right text-xs font-antarctica font-light text-pinto-gray-4">
                Place in Line
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Tractor Orders Section */}
            {loadingTractorOrders ? (
              <tr>
                <td colSpan={9} className="px-2 py-2 text-center text-xs font-antarctica font-light text-pinto-gray-4">
                  Loading Tractor orders...
                </td>
              </tr>
            ) : tractorOrders.filter((order) => order.amountSowableNextSeason.gt(0)).length > 0 ? (
              <>
                {tractorOrders
                  .filter((order) => order.amountSowableNextSeason.gt(0)) // Filter out orders with 0 amountSowableNextSeason
                  .map((order, index) => {
                    const temp = getOrderTemperature(order);
                    return (
                      <tr
                        key={`tractor-${order.requisition.blueprintHash}`}
                        className={`tractor-order-row hover:bg-pinto-green-1 transition-colors ${hoveredAddress === order.requisition.blueprint.publisher ? "bg-pinto-green-1" : ""}`}
                      >
                        <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-gray-4">
                          {formatSeason(Number(currentSeason) + 1)}
                        </td>
                        <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-gray-4">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-gray-4">
                          {estimateExecutionTime(order)}
                        </td>
                        <td
                          className="px-2 py-1"
                          onMouseEnter={() => setHoveredAddress(order.requisition.blueprint.publisher)}
                          onMouseLeave={() => setHoveredAddress(null)}
                        >
                          <a
                            href={`https://basescan.org/address/${order.requisition.blueprint.publisher}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-antarctica font-light text-pinto-gray-4 underline ${hoveredAddress === order.requisition.blueprint.publisher ? "font-medium" : ""}`}
                          >
                            {formatAddress(order.requisition.blueprint.publisher)}
                          </a>
                        </td>
                        <td className="px-2 py-1 flex items-center">
                          <span className="text-xs font-antarctica font-light text-pinto-gray-4 mr-2">
                            <span className="text-xs" role="img" aria-label="Tractor">
                              🚜
                            </span>
                          </span>
                        </td>
                        <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-gray-4">
                          {(() => {
                            const predictedTemp = getPredictedSowTemperature(order);
                            const minTemp = getOrderTemperature(order);

                            // For consistency with our filtering, always show the minimum temperature
                            // with ≥ prefix for Morning Auction orders
                            const decodedData = getDecodedTractorData(order);
                            const runBlocks = decodedData?.runBlocksAfterSunriseAsString
                              ? parseInt(decodedData.runBlocksAfterSunriseAsString)
                              : 0;

                            if (runBlocks < 300) {
                              // Morning auction orders - show min temp
                              return `≥ ${minTemp.toFixed(2)}%`;
                            } else {
                              // After morning auction - show predicted temp (current temp)
                              return `${predictedTemp.toFixed(2)}%`;
                            }
                          })()}
                        </td>
                        <td className="px-2 py-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IconImage src={pintoIcon} alt="PINTO" size={3} />
                            <span className="text-xs font-antarctica font-light text-pinto-gray-4">
                              {`${formatNumberWithCommas(parseFloat(order.amountSowableNextSeason.toHuman()).toFixed(2))}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IconImage src={podIcon} alt="Pods" size={3} />
                            <span className="text-xs font-antarctica font-light text-pinto-gray-4">
                              {`${formatNumberWithCommas(parseFloat(estimateOrderPods(order).toHuman()).toFixed(2))}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-gray-4 text-right">
                          {Math.round(order.estimatedPlaceInLine.toNumber()).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </>
            ) : (
              <tr>
                <td colSpan={9} className="px-2 py-4 text-center text-xs font-antarctica font-light text-pinto-gray-4">
                  No Tractor orders executable next Season
                </td>
              </tr>
            )}

            {/* Separator row between tractor orders and regular activity */}
            {activities.length > 0 &&
              tractorOrders.filter((order) => order.amountSowableNextSeason.gt(0)).length > 0 && (
                <tr>
                  <td colSpan={9} className="border-b-2 border-pinto-gray-3/20 py-0" />
                </tr>
              )}

            {/* Regular Activity Section */}
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className={`hover:bg-pinto-green-1 transition-colors ${hoveredAddress === activity.address ? "bg-pinto-green-1" : ""}`}
              >
                <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-dark">
                  {formatSeason(activity.season)}
                </td>
                <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-dark">
                  {formatDate(activity.timestamp)}
                </td>
                <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-dark">
                  {formatTime(activity.timestamp)}
                </td>
                <td
                  className="px-2 py-1"
                  onMouseEnter={() => setHoveredAddress(activity.address)}
                  onMouseLeave={() => setHoveredAddress(null)}
                >
                  <a
                    href={`https://basescan.org/address/${activity.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs font-antarctica font-light text-pinto-dark underline ${hoveredAddress === activity.address ? "font-medium" : ""}`}
                  >
                    {formatAddress(activity.address)}
                  </a>
                </td>
                <td className="px-2 py-1">
                  <a
                    href={`https://basescan.org/tx/${activity.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-antarctica font-light text-pinto-dark underline"
                  >
                    {formatAddress(activity.txHash)}
                  </a>
                </td>
                <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-dark">
                  {activity.temperature.toFixed(2)}%
                </td>
                <td className="px-2 py-1 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <IconImage src={pintoIcon} alt="PINTO" size={3} />
                    <span className="text-xs font-antarctica font-light text-pinto-dark">
                      {`${formatNumberWithCommas(parseFloat(activity.amount.toHuman()).toFixed(2))}`}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <IconImage src={podIcon} alt="Pods" size={3} />
                    <span className="text-xs font-antarctica font-light text-pinto-dark">
                      {`${formatNumberWithCommas(parseFloat(activity.pods.toHuman()).toFixed(2))}`}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1 text-xs font-antarctica font-light text-pinto-dark text-right">
                  {activity.placeInLine.split(".")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FieldActivity;
