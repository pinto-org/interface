import { TV } from "@/classes/TokenValue";
import { Address } from "viem";

// First, export the requisition type as a standalone type for reuse
export type RequisitionType = "sowBlueprintv0" | "convertUpBlueprint" | "unknown";

export interface CreateTractorDataReturnType {
  data: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  rawCall: `0x${string}`;
  depositOptimizationCalls?: `0x${string}`[];
}

export interface RequisitionData {
  blueprint: {
    publisher: `0x${string}`;
    data: `0x${string}`;
    operatorPasteInstrs: readonly `0x${string}`[];
    maxNonce: bigint;
    startTime: bigint;
    endTime: bigint;
  };
  blueprintHash: `0x${string}`;
  signature: `0x${string}`;
}

export interface TractorRequisitionEvent<T extends {} = {}> {
  requisition: RequisitionData;
  blockNumber: number;
  timestamp?: number;
  isCancelled?: boolean;
  requisitionType: "sowBlueprintv0" | "unknown";
  decodedData: T | null;
}

export interface TractorRequisitionData {
  blueprint: {
    publisher: `0x${string}`;
    data: `0x${string}`;
    operatorPasteInstrs: readonly `0x${string}`[];
    maxNonce: bigint;
    startTime: bigint;
    endTime: bigint;
  };
  blueprintHash: `0x${string}`;
  signature: `0x${string}`;
}

export interface OperatorParams<Numeric extends TV | bigint = bigint> {
  whitelistedOperators: Address[];
  tipAddress: Address;
  operatorTipAmount: Numeric;
}

// Add this type definition after the OrderbookEntryWithProcessingData interface
export interface WithdrawalPlan {
  sourceTokens: readonly `0x${string}`[];
  stems: readonly (readonly bigint[])[];
  amounts: readonly (readonly bigint[])[];
  availableBeans: readonly bigint[];
  totalAvailableBeans: bigint;
}

export type TractorBlueprintType = "sow" | "convertUp";

export interface Blueprint {
  publisher: Address;
  data: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  maxNonce: bigint;
  startTime: bigint;
  endTime: bigint;
}

export interface Requisition {
  blueprint: Blueprint;
  blueprintHash: `0x${string}`;
  signature?: `0x${string}`;
}
