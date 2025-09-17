import { TV } from "@/classes/TokenValue";
import { Address } from "viem";

export type RequisitionType = "sowBlueprintv0" | "convertUpBlueprint" | "unknown";

export type TractorBlueprintType = "sow" | "convertUp";

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
  requisitionType: RequisitionType;
  decodedData: T | null;
}

// Re-export for backwards compatability
export type RequisitionEvent<T extends {} = {}> = TractorRequisitionEvent<T>;

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

export interface Blueprint {
  publisher: Address;
  data: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[] | readonly `0x${string}`[];
  maxNonce: bigint;
  startTime: bigint;
  endTime: bigint;
}

export interface Requisition {
  blueprint: Blueprint;
  blueprintHash: `0x${string}`;
  signature?: `0x${string}`;
}

// Types based on ConvertUpBlueprintv0.sol contract

/**
 * How low stalk deposits are processed.
 * See LibSiloHelpers.Mode for more details (protocol)
 *
 * - USE (0): Use low stalk deposit.
 * - OMIT (1): Omit low stalk deposit.
 * - USE_LAST (2): Use low stalk deposit last.
 */
export enum LowStalkDepositsMode {
  USE = 0,
  OMIT = 1,
  USE_LAST = 2,
}

/**
 * @notice Filter parameters for deposits
 * @param maxGrownStalkPerBdv The maximum amount of grown stalk allowed to be used for the withdrawal, per bdv
 * @param minStem The minimum stem value to consider for withdrawal. Stems smaller than this are considered "high stalk" deposits and cannot be used.
 * @param excludeGerminatingDeposits Whether to exclude germinating deposits
 * @param excludeBean Whether to exclude beans
 * @param lowStalkDeposits how low stalk deposits are processed. USE (0), OMIT (1), USE_LAST (2).
 * @param lowGrownStalkPerBdv amount of grown stalk per bdv such that the deposit considered a "low stalk" deposit.
 * @param maxStem The maximum stem value to consider for withdrawal. Stems larger than this are considered "low stalk" deposits.
 * @dev lowStalkDeposits needed a way to handle low stalk deposits last for the convert bonus.
 */
export interface WithdrawalPlanFilterParams {
  maxGrownStalkPerBdv: bigint;
  minStem: bigint;
  excludeGerminatingDeposits: boolean;
  excludeBean: boolean;
  lowStalkDeposits: LowStalkDepositsMode;
  lowGrownStalkPerBdv: bigint;
  maxStem: bigint;
}
