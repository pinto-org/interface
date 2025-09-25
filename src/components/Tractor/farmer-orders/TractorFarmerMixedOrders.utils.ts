import { TokenValue } from "@/classes/TokenValue";
import { SowBlueprintData, TractorRequisitionEvent } from "@/lib/Tractor";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { PublisherTractorExecution } from "@/lib/Tractor/utils";
import { getTokenNameByIndex } from "@/utils/token";
import {
  ConvertUpOrderData,
  MixedOrderFilters,
  MixedOrderSortBy,
  SowOrderData,
  UnifiedTractorOrder,
} from "./TractorFarmerMixedOrders.types";

// Transform Sow order to unified format
export function transformSowOrderToUnified(
  req: TractorRequisitionEvent<SowBlueprintData>,
  executions: PublisherTractorExecution[] = [],
): UnifiedTractorOrder {
  if (!req.decodedData) {
    throw new Error("Missing decoded data for Sow order");
  }

  const data = req.decodedData;
  const totalAmount = TokenValue.fromBlockchain(data.sowAmounts.totalAmountToSow, 6);

  // Calculate progress from executions
  const totalSown = executions.reduce((acc, exec) => {
    if (exec.sowEvent) {
      return acc.add(exec.sowEvent.beans);
    }
    return acc;
  }, TokenValue.ZERO);

  const percentComplete = totalAmount.gt(0) ? Math.min(Number(totalSown.div(totalAmount).mul(100).toHuman()), 100) : 0;

  const isComplete = percentComplete >= 100;

  // Determine strategy text
  let strategyText = "Unknown strategy";
  if (data.sourceTokenIndices.includes(255)) {
    strategyText = "Lowest Seeds";
  } else if (data.sourceTokenIndices.includes(254)) {
    strategyText = "Best Price";
  } else {
    strategyText = getTokenNameByIndex(data.sourceTokenIndices[0]) || "Specific Token";
  }

  const sowOrderData: SowOrderData = {
    type: "sow",
    totalAmount: totalAmount.toHuman(),
    amountSown: totalSown.toHuman(),
    percentComplete,
    temperature: data.minTempAsString,
    podLineLength: data.maxPodlineLengthAsString,
    minSoil: data.sowAmounts.minAmountToSowPerSeasonAsString,
    operatorTip: TokenValue.fromBlockchain(data.operatorParams.operatorTipAmount, 6).toHuman(),
    strategy: strategyText,
  };

  return {
    id: req.requisition.blueprintHash,
    type: "sow",
    timestamp: req.timestamp,
    blockNumber: req.blockNumber,
    publisher: req.requisition.blueprint.publisher,
    isCancelled: req.isCancelled,
    isComplete,
    orderData: sowOrderData,
    executions,
    requisition: req,
  };
}

// Transform ConvertUp order to unified format
export function transformConvertUpOrderToUnified(
  req: ConvertUpOrderbookEntry,
  executions: PublisherTractorExecution[] = [],
): UnifiedTractorOrder {
  if (!req.decodedData) {
    throw new Error("Missing decoded data for ConvertUp order");
  }

  const data = req.decodedData;
  const totalAmount = data.convertUpParams.totalBeanAmountToConvert;
  const bdvLeftToConvert = req.orderInfo.bdvLeftToConvert;

  // Calculate progress
  const convertedAmount = totalAmount.sub(bdvLeftToConvert);
  const percentComplete = totalAmount.gt(0)
    ? Math.min(Number(convertedAmount.div(totalAmount).mul(100).toHuman()), 100)
    : 0;

  const isComplete = percentComplete >= 100;

  // Determine strategy text
  let strategyText = "Unknown strategy";
  if (data.convertUpParams.sourceTokenIndices.includes(255)) {
    strategyText = "Lowest Seeds";
  } else if (data.convertUpParams.sourceTokenIndices.includes(254)) {
    strategyText = "Best Price";
  } else {
    strategyText = getTokenNameByIndex(data.convertUpParams.sourceTokenIndices[0]) || "Specific Token";
  }

  const convertUpOrderData: ConvertUpOrderData = {
    type: "convertUp",
    totalConvertBdv: totalAmount.toHuman(),
    convertedBdv: convertedAmount.toHuman(),
    percentComplete,
    minPriceRange: `$${data.convertUpParams.minPriceToConvertUp.toHuman()}`,
    maxPriceRange: `$${data.convertUpParams.maxPriceToConvertUp.toHuman()}`,
    bonusThreshold: data.convertUpParams.grownStalkPerBdvBonusBid.toHuman(),
    capacityRequirement: data.convertUpParams.minConvertBonusCapacity.toHuman(),
    operatorTip: data.opParams.operatorTipAmount.toHuman(),
    strategy: strategyText,
  };

  return {
    id: req.requisition.blueprintHash,
    type: "convertUp",
    timestamp: req.timestamp,
    blockNumber: req.blockNumber,
    publisher: req.requisition.blueprint.publisher,
    isCancelled: req.isCancelled,
    isComplete,
    orderData: convertUpOrderData,
    executions,
    requisition: req,
  };
}

// Sort unified orders
export function sortUnifiedOrders(orders: UnifiedTractorOrder[], sortBy: MixedOrderSortBy): UnifiedTractorOrder[] {
  const sortedOrders = [...orders];

  switch (sortBy) {
    case "newest":
      return sortedOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    case "oldest":
      return sortedOrders.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    case "type":
      return sortedOrders.sort((a, b) => a.type.localeCompare(b.type));

    case "operatorTip":
      return sortedOrders.sort((a, b) => {
        const aTip = Number(a.orderData.operatorTip);
        const bTip = Number(b.orderData.operatorTip);
        return bTip - aTip; // Highest tip first
      });

    case "percentComplete":
      return sortedOrders.sort((a, b) => a.orderData.percentComplete - b.orderData.percentComplete);

    case "publisher":
      return sortedOrders.sort((a, b) => a.publisher.localeCompare(b.publisher));

    default:
      return sortedOrders;
  }
}

// Filter unified orders
export function filterUnifiedOrders(orders: UnifiedTractorOrder[], filters: MixedOrderFilters): UnifiedTractorOrder[] {
  return orders.filter((order) => {
    // Filter by order type
    if (!filters.orderTypes.includes(order.type)) {
      return false;
    }

    // Filter by completion status
    if (!filters.showCompleted && order.isComplete) {
      return false;
    }

    // Filter by cancelled status
    if (!filters.showCancelled && order.isCancelled) {
      return false;
    }

    // Filter by publisher
    if (filters.publisherFilter && order.publisher !== filters.publisherFilter) {
      return false;
    }

    // Filter by minimum operator tip
    if (filters.minOperatorTip !== undefined) {
      const orderTip = Number(order.orderData.operatorTip);
      if (orderTip < filters.minOperatorTip) {
        return false;
      }
    }

    return true;
  });
}

// Format order summary for display
export function getOrderSummary(order: UnifiedTractorOrder): string {
  const typeLabel = order.type === "sow" ? "Sow" : "Convert Up";
  const amount =
    order.type === "sow"
      ? `${(order.orderData as SowOrderData).totalAmount} PINTO`
      : `${(order.orderData as ConvertUpOrderData).totalConvertBdv} PDV`;

  return `${typeLabel} • ${amount} • ${order.orderData.percentComplete.toFixed(0)}% complete`;
}

// Get order type badge info
export function getOrderTypeBadge(orderType: "sow" | "convertUp") {
  switch (orderType) {
    case "sow":
      return {
        label: "Sow",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "🌱",
      };
    case "convertUp":
      return {
        label: "Convert Up",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: "⬆️",
      };
  }
}
