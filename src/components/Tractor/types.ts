import { TV } from "@/classes/TokenValue";
import { PublisherTractorExecution } from "@/lib/Tractor";
import { TractorTokenStrategyUnion } from "@/lib/Tractor/types";
import { TimeScaleSelect } from "./form/fields/sharedFields";

// Base interfaces for all tractor orders
export interface BaseTractorOrderData {
  operatorTip: string;
  type: "sow" | "convertUp";
}

// Sow-specific order data
export interface SowOrderData extends BaseTractorOrderData {
  type: "sow";
  totalAmount: string;
  temperature: string;
  maxPodLine: string;
  minSoil: string;
  tokenStrategy?: TractorTokenStrategyUnion;
  tokenSymbol?: string;
  morningAuction?: boolean;
}

// ConvertUp-specific order data
export interface ConvertUpOrderData extends BaseTractorOrderData {
  type: "convertUp";
  totalBeanAmountToConvert: string;
  minBeansConvertPerExecution: string;
  maxBeansConvertPerExecution: string;
  minTimeBetweenConverts: string;
  timeScale: TimeScaleSelect;
  minConvertBonusCapacity: string;
  maxGrownStalkPerBdv: string;
  grownStalkPerBdvBonusBid: string;
  maxPriceToConvertUp: string;
  minPriceToConvertUp: string;
  maxGrownStalkPerBdvPenalty: string;
  slippageRatio: string;
  seedDifference: string;
  lowStalkDeposits: number;
  sourceTokenIndices?: number[];
  tokenStrategy: TractorTokenStrategyUnion;
}

// Union type for all order data
export type TractorOrderData = SowOrderData | ConvertUpOrderData;

// Generic execution event interface
export interface BaseExecutionEvent {
  type: string;
  data: Record<string, any>;
}

// Sow-specific execution event
export interface SowExecutionEvent extends BaseExecutionEvent {
  type: "sow";
  data: {
    account: `0x${string}`;
    fieldId: bigint;
    index: TV;
    beans: TV;
    pods: TV;
  };
}

// ConvertUp-specific execution event
export interface ConvertUpExecutionEvent extends BaseExecutionEvent {
  type: "convertUp";
  data: {
    account: `0x${string}`;
    fromToken: `0x${string}`;
    toToken: `0x${string}`;
    fromAmount: bigint;
    toAmount: bigint;
    bdv: bigint;
  };
}

// Updated execution data interface
export interface ExecutionData {
  type: "sow" | "convertUp";
  blockNumber: number;
  operator: `0x${string}`;
  publisher: `0x${string}`;
  blueprintHash: `0x${string}`;
  transactionHash: `0x${string}`;
  timestamp?: number;
  event?: BaseExecutionEvent;
  // Legacy support for existing code
  sowEvent?: SowExecutionEvent["data"];
}

// Component prop interfaces
export interface TractorOrderVisualizationProps {
  orderData: TractorOrderData;
  className?: string;
}

export interface ExecutionHistoryProps {
  executionHistory: PublisherTractorExecution[];
  orderData: TractorOrderData;
}

// Order type configuration for registry
export interface OrderTypeConfig {
  visualization: React.ComponentType<TractorOrderVisualizationProps>;
  executionHistory: React.ComponentType<ExecutionHistoryProps>;
  title: string;
  description: (isViewOnly: boolean) => React.ReactNode;
}
