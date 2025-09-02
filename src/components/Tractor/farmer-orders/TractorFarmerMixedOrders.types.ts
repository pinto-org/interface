import { SowBlueprintData, TractorRequisitionEvent } from "@/lib/Tractor";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { PublisherTractorExecution } from "@/lib/Tractor/utils";
import { OrderType } from "./TractorFarmerOrderTypeRegistry";

// Unified order interface that can represent any order type
export interface UnifiedTractorOrder {
  // Common properties
  id: string; // Unique identifier (blueprint hash)
  type: OrderType;
  timestamp?: number;
  blockNumber: number;
  publisher: `0x${string}`;
  isCancelled?: boolean;
  isComplete?: boolean;

  // Order-specific data (discriminated union)
  orderData: SowOrderData | ConvertUpOrderData;

  // Executions
  executions?: PublisherTractorExecution[];

  // Raw data for dialogs
  requisition: ConvertUpOrderbookEntry | TractorRequisitionEvent<SowBlueprintData>;
}

// Sow-specific order data
export interface SowOrderData {
  type: "sow";
  totalAmount: string;
  amountSown: string;
  percentComplete: number;
  temperature: string;
  podLineLength: string;
  minSoil: string;
  operatorTip: string;
  strategy: string;
}

// ConvertUp-specific order data
export interface ConvertUpOrderData {
  type: "convertUp";
  totalConvertBdv: string;
  convertedBdv: string;
  percentComplete: number;
  minPriceRange: string;
  maxPriceRange: string;
  bonusThreshold: string;
  capacityRequirement: string;
  operatorTip: string;
  strategy: string;
}

// Type guards
export function isSowOrder(order: UnifiedTractorOrder): order is UnifiedTractorOrder & {
  orderData: SowOrderData;
  requisition: TractorRequisitionEvent<SowBlueprintData>;
} {
  return order.orderData.type === "sow" && order.requisition.requisitionType === "sowBlueprintv0";
}

export function isConvertUpOrder(
  order: UnifiedTractorOrder,
): order is UnifiedTractorOrder & { orderData: ConvertUpOrderData; requisition: ConvertUpOrderbookEntry } {
  return order.orderData.type === "convertUp" && order.requisition.requisitionType === "convertUpBlueprint";
}

// Sorting options for mixed orders
export type MixedOrderSortBy = "newest" | "oldest" | "type" | "operatorTip" | "percentComplete" | "publisher";

// Filtering options
export interface MixedOrderFilters {
  orderTypes: OrderType[];
  showCompleted: boolean;
  showCancelled: boolean;
  publisherFilter?: `0x${string}`;
  minOperatorTip?: number;
}
