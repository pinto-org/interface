import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col } from "@/components/Container";
import { SoilOrderbookDialog } from "@/components/Tractor/SoilOrderbook";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderbookEntry, SowBlueprintData, decodeSowTractorData } from "@/lib/Tractor/utils";
import useFieldSowEvents from "@/state/events/useFieldSowEvents";
import { useTractorSowOrderbook } from "@/state/tractor/useTractorSowOrders";
import { useTemperature } from "@/state/useFieldData";
import { useSeason } from "@/state/useSunData";
import React, { useState, useMemo, useCallback } from "react";

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

const FieldActivity = () => {
  const currentSeason = useSeason();
  const currentTemperature = useTemperature();
  const [hoveredAddress, setHoveredAddress] = useState<string | null>(null);
  const [showTractorOrdersDialog, setShowTractorOrdersDialog] = useState(false);

  const { data: tractorOrders, ...tractorSowOrderbookQuery } = useTractorSowOrderbook({
    select: useCallback(
      (data: OrderbookEntry[] | undefined) => {
        const orderbook = data ?? [];
        const currentTemp = currentTemperature.max?.toNumber() || 0;

        const filteredOrders = orderbook.filter((order) => {
          const predictedTemp = getPredictedSowTemperature(order, currentTemperature);
          // Only include orders with temperature requirements that could reasonably execute soon
          // Use the predicted temperature, which is now guaranteed to be at least the minimum
          return predictedTemp <= currentTemp + 1;
        });

        // Sort by predicted temperature (lowest to highest)
        return [...filteredOrders].sort((a, b) => {
          // We want to sort by lowest predicted temperature first
          return getPredictedSowTemperature(a, currentTemperature) - getPredictedSowTemperature(b, currentTemperature);
        });
      },
      [currentTemperature.max],
    ),
  });

  const { data: activities, isLoading: isActivitiesLoading } = useFieldSowEvents();

  const loadingTractorOrders = tractorSowOrderbookQuery.isLoading || !tractorOrders;
  const loadingActivity = isActivitiesLoading || !activities;

  const ordersWithSowableAmount = useMemo(
    () => tractorOrders?.filter((order) => order.amountSowableNextSeasonConsideringAvailableSoil.gt(0)),
    [tractorOrders],
  );

  // Render a loading skeleton for the entire table
  if (loadingActivity && loadingTractorOrders) {
    return <FieldActivitySkeleton />;
  }

  // Render if no data is available.
  if (!activities?.length && !tractorOrders?.length) {
    return <FieldActivityNoDataDisplay />;
  }

  return (
    <div className="w-full relative">
      {/* Tractor Orders Dialog */}
      <SoilOrderbookDialog open={showTractorOrdersDialog} onOpenChange={setShowTractorOrdersDialog} />
      {/*
       * Table
       */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <FieldActivityHeader />
          <tbody>
            {/* Tractor Orders Section */}
            {loadingTractorOrders ? (
              <tr>
                <td colSpan={9} className="px-2 py-2 text-xs font-light text-pinto-gray-4">
                  <Col className="items-center justify-center p-4">Loading Tractor orders...</Col>
                </td>
              </tr>
            ) : !!ordersWithSowableAmount ? (
              <>
                {ordersWithSowableAmount.map((order) => {
                  return (
                    <TractorOrderRow
                      key={`tractor-${order.requisition.blueprintHash}`}
                      order={order}
                      hoveredAddress={hoveredAddress}
                      currentSeason={currentSeason}
                      currentTemperature={currentTemperature}
                      setHoveredAddress={setHoveredAddress}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <td colSpan={9} className="px-2 pt-4 text-center text-xs font-light text-pinto-gray-4">
                  <Col className="items-center justify-center">No Tractor orders executable next Season</Col>
                </td>
              </>
            )}

            {/* Separator row between tractor orders and regular activity */}
            {!!activities?.length && !!tractorOrders?.length && (
              <tr>
                <td colSpan={9} className="border-b-2 border-pinto-gray-3/20 py-0" />
              </tr>
            )}
            {/**
             * See All Tractor Orders Row
             */}
            {!loadingTractorOrders && <SeeAllTractorOrdersRow setShowOrdersDialog={setShowTractorOrdersDialog} />}
            {/* Regular Activity Section */}
            {(activities ?? []).map((activity) => (
              <FieldActivityRow
                key={activity.id}
                activity={activity}
                hoveredAddress={hoveredAddress}
                setHoveredAddress={setHoveredAddress}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FieldActivity;

// ================================================================================
// *                                  COMPONENTS                                  *
// ================================================================================

// -------------------- TABLE --------------------

const SeeAllTractorOrdersRow = ({ setShowOrdersDialog }: { setShowOrdersDialog: (show: boolean) => void }) => {
  return (
    <tr className="border-b-2 border-pinto-gray-3/20">
      <td colSpan={9}>
        <div className="flex flex-col items-center justify-center w-full">
          <Button variant="hoverTextPrimary" onClick={() => setShowOrdersDialog(true)} noPadding className="text-sm">
            See all Tractor Orders
          </Button>
        </div>
      </td>
    </tr>
  );
};

const TractorOrderRow = React.memo(
  ({
    order,
    hoveredAddress,
    currentSeason,
    currentTemperature,
    setHoveredAddress,
  }: {
    order: OrderbookEntry;
    hoveredAddress: string | null;
    currentSeason: number | undefined;
    currentTemperature: { max: TokenValue };
    setHoveredAddress: (address: string | null) => void;
  }) => {
    const address = order.requisition.blueprint.publisher;
    const isHovered = hoveredAddress === address;

    return (
      <tr
        className={`tractor-order-row hover:bg-pinto-green-1 transition-colors ${isHovered ? "bg-pinto-green-1" : ""}`}
      >
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4">{formatSeason(Number(currentSeason) + 1)}</td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4">{new Date().toLocaleDateString()}</td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4">{estimateExecutionTime(order)}</td>
        <td
          className="px-2 py-1"
          onMouseEnter={() => setHoveredAddress(address)}
          onMouseLeave={() => setHoveredAddress(null)}
        >
          <a
            href={`https://basescan.org/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-light text-pinto-gray-4 underline ${isHovered ? "font-medium" : ""}`}
          >
            {formatAddress(address)}
          </a>
        </td>
        <td className="px-2 py-1 flex items-center">
          <span className="text-xs font-light text-pinto-gray-4 mr-2">
            <span className="text-xs" role="img" aria-label="Tractor">
              🚜
            </span>
          </span>
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4">
          {(() => {
            const predictedTemp = getPredictedSowTemperature(order, currentTemperature);
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
            <span className="text-xs font-light text-pinto-gray-4">
              {`${formatNumberWithCommas(parseFloat(order.amountSowableNextSeasonConsideringAvailableSoil.toHuman()).toFixed(2))}`}
            </span>
          </div>
        </td>
        <td className="px-2 py-1 text-right">
          <div className="flex items-center justify-end gap-1">
            <IconImage src={podIcon} alt="Pods" size={3} />
            <span className="text-xs font-light text-pinto-gray-4">
              {`${formatNumberWithCommas(parseFloat(estimateOrderPods(order, currentTemperature).toHuman()).toFixed(2))}`}
            </span>
          </div>
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-gray-4 text-right">
          {Math.round(order.estimatedPlaceInLine.toNumber()).toLocaleString()}
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if:
    // 1. The hoveredAddress matches this row's address
    // 2. The order data has changed
    return (
      prevProps.hoveredAddress !== nextProps.hoveredAddress &&
      prevProps.hoveredAddress !== prevProps.order.requisition.blueprint.publisher &&
      nextProps.hoveredAddress !== nextProps.order.requisition.blueprint.publisher &&
      prevProps.order === nextProps.order &&
      prevProps.currentSeason === nextProps.currentSeason &&
      prevProps.currentTemperature === nextProps.currentTemperature
    );
  },
);

const FieldActivityRow = React.memo(
  ({
    activity,
    hoveredAddress,
    setHoveredAddress,
  }: {
    activity: FieldActivityItem;
    hoveredAddress: string | null;
    setHoveredAddress: (address: string | null) => void;
  }) => {
    const isHovered = hoveredAddress === activity.address;

    return (
      <tr className={`hover:bg-pinto-green-1 transition-colors ${isHovered ? "bg-pinto-green-1" : ""}`}>
        <td className="px-2 py-1 text-xs font-light text-pinto-secondary">{formatSeason(activity.season)}</td>
        <td className="px-2 py-1 text-xs font-light text-pinto-secondary">{formatDate(activity.timestamp)}</td>
        <td className="px-2 py-1 text-xs font-light text-pinto-secondary">{formatTime(activity.timestamp)}</td>
        <td
          className="px-2 py-1"
          onMouseEnter={() => setHoveredAddress(activity.address)}
          onMouseLeave={() => setHoveredAddress(null)}
        >
          <a
            href={`https://basescan.org/address/${activity.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-light text-pinto-secondary underline`}
          >
            {formatAddress(activity.address)}
          </a>
        </td>
        <td className="px-2 py-1">
          <a
            href={`https://basescan.org/tx/${activity.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-light text-pinto-secondary underline"
          >
            {formatAddress(activity.txHash)}
          </a>
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-secondary">{activity.temperature.toFixed(2)}%</td>
        <td className="px-2 py-1 text-right">
          <div className="flex items-center justify-end gap-1">
            <IconImage src={pintoIcon} alt="PINTO" size={3} />
            <span className="text-xs font-light text-pinto-secondary">
              {`${formatNumberWithCommas(parseFloat(activity.amount.toHuman()).toFixed(2))}`}
            </span>
          </div>
        </td>
        <td className="px-2 py-1 text-right">
          <div className="flex items-center justify-end gap-1">
            <IconImage src={podIcon} alt="Pods" size={3} />
            <span className="text-xs font-light text-pinto-secondary">
              {`${formatNumberWithCommas(parseFloat(activity.pods.toHuman()).toFixed(2))}`}
            </span>
          </div>
        </td>
        <td className="px-2 py-1 text-xs font-light text-pinto-secondary text-right">
          {activity.placeInLine.split(".")[0]}
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if:
    // 1. The hoveredAddress matches this row's address
    // 2. The activity data has changed
    return (
      prevProps.hoveredAddress !== nextProps.hoveredAddress &&
      prevProps.hoveredAddress !== prevProps.activity.address &&
      nextProps.hoveredAddress !== nextProps.activity.address &&
      prevProps.activity === nextProps.activity
    );
  },
);

const FieldActivityHeader = () => (
  <thead>
    <tr className="border-b border-pinto-gray-3/20">
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Season</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Date</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Time</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Address</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4">Txn Hash</th>
      <th className="px-2 py-1 text-left text-xs font-light text-pinto-gray-4 min-w-[75px]">Temp</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Amount Sown</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Pods minted</th>
      <th className="px-2 py-1 text-right text-xs font-light text-pinto-gray-4">Place in Line</th>
    </tr>
  </thead>
);

// -------------------- SKELETON --------------------

const FieldActivitySkeleton = () => (
  <div className="w-full">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <FieldActivityHeader />
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
                <td className="px-2 py-1" align="right">
                  <Skeleton className="h-3 w-20" />
                </td>
                <td className="px-2 py-1" align="right">
                  <Skeleton className="h-3 w-20" />
                </td>
                <td className="px-2 py-1" align="right">
                  <Skeleton className="h-3 w-24" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);

// -------------------- NO DATA DISPLAY --------------------

const FieldActivityNoDataDisplay = () => (
  <div className="w-full p-8 flex flex-col items-center justify-center">
    <p className="text-sm text-pinto-gray-4 mb-2">No field activity found</p>
    <p className="text-xs text-pinto-gray-3">Activities like Sowing and Harvesting will appear here</p>
  </div>
);

// ================================================================================
// *                                    HELPERS                                   *
// ================================================================================

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
const getPredictedSowTemperature = (order: OrderbookEntry, currentTemperature: { max: TokenValue }): number => {
  // Get the minimum temperature from the order
  const minTemp = getOrderTemperature(order);

  const decodedData = getDecodedTractorData(order);
  if (decodedData && decodedData.runBlocksAfterSunriseAsString) {
    const runBlocks = parseInt(decodedData.runBlocksAfterSunriseAsString);
    if (runBlocks >= 300 && currentTemperature.max) {
      // After morning auction - use max of current temperature and minimum temperature
      const currentTemp = currentTemperature.max.toNumber();
      return Math.max(currentTemp, minTemp);
    }
  }
  // Otherwise use the minimum temperature from the order
  return minTemp;
};

// Helper function to estimate pods from an order
const estimateOrderPods = (order: OrderbookEntry, currentTemperature: { max: TokenValue }): TokenValue => {
  // Use the predicted temperature
  const temp = getPredictedSowTemperature(order, currentTemperature);

  // Calculate pods as PINTO amount * (1 + temperature/100)
  return order.amountSowableNextSeasonConsideringAvailableSoil.mul(1 + temp / 100);
};

// -------------------- FORMATTING --------------------

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
