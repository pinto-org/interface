import { TV } from "@/classes/TokenValue";
import {
  ExtendedTractorTokenStrategy,
  LowStalkDepositsMode,
  TractorRequisitionEvent,
  TractorTokenStrategy,
  WithdrawalPlan,
} from "../core";

// ────────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Prepared ConvertUp arguments for form transformation
 */
export interface PreparedConvertUpArgs<Numeric extends TV | string = TV> {
  tokenStrategy: TractorTokenStrategy;
  totalBeanAmountToConvert: Numeric;
  minBeansConvertPerExecution: Numeric;
  maxBeansConvertPerExecution: Numeric;
  capAmountToBonusCapacity: boolean;
  minTimeBetweenConverts: Numeric;
  minConvertBonusCapacity: Numeric;
  maxGrownStalkPerBdv: Numeric;
  grownStalkPerBdvBonusBid: Numeric;
  maxPriceToConvertUp: Numeric;
  minPriceToConvertUp: Numeric;
  maxGrownStalkPerBdvPenalty: Numeric;
  slippageRatio: Numeric;
  operatorTip: Numeric;
  lowStalkDeposits: LowStalkDepositsMode;
  seedDifference: Numeric;
}

export interface ExtendedPreparedConvertUpArgs extends PreparedConvertUpArgs<TV> {
  tokenStrategy: ExtendedTractorTokenStrategy;
}

/**
 * Struct to hold convert up parameters for the Convert Up Blueprint.
 */
export interface ConvertUpParams<Numeric extends bigint | TV = bigint> {
  /**
   * Indices of source tokens to use for conversion
   */
  sourceTokenIndices: number[];
  /**
   * Total amount to convert in BDV terms
   */
  totalBeanAmountToConvert: Numeric;
  /**
   * Minimum BDV to convert per execution
   */
  minBeansConvertPerExecution: Numeric;
  /**
   * Maximum BDV to convert per execution
   */
  maxBeansConvertPerExecution: Numeric;
  /**
   * Whether to cap conversion amount to available bonus capacity
   */
  capAmountToBonusCapacity: boolean;
  /**
   * Minimum time (in seconds) between convert executions
   */
  minTimeBetweenConverts: Numeric;
  /**
   * Minimum capacity required for convert bonus
   */
  minConvertBonusCapacity: Numeric;
  /**
   * Maximum grown stalk per BDV to withdraw from deposits
   */
  maxGrownStalkPerBdv: Numeric;
  /**
   * Threshold for considering a deposit to have a good stalk-to-BDV ratio
   */
  grownStalkPerBdvBonusBid: Numeric;
  /**
   * Maximum price at which to convert up (for MEV resistance)
   */
  maxPriceToConvertUp: Numeric;
  /**
   * Minimum price at which to convert up (for range targeting)
   */
  minPriceToConvertUp: Numeric;
  /**
   * Maximum grown stalk per BDV penalty to accept
   */
  maxGrownStalkPerBdvPenalty: Numeric;
  /**
   * Slippage tolerance ratio for the conversion
   */
  slippageRatio: Numeric;
  /**
   * How low stalk deposits are processed.
   */
  lowStalkDeposits: LowStalkDepositsMode;
  /**
   * Difference between the seed of the source and the target token
   */
  seedDifference: Numeric;
}

export interface ConvertUpBlueprintStruct<Numeric extends TV | bigint = bigint> {
  convertUpParams: ConvertUpParams<Numeric>;
  opParams: {
    whitelistedOperators: readonly `0x${string}`[];
    tipAddress: `0x${string}`;
    operatorTipAmount: Numeric;
  };
}

export interface ConvertUpOrderbookEntry extends Omit<TractorRequisitionEvent, "decodedData"> {
  decodedData?: ConvertUpBlueprintStruct<TV>;
  orderInfo: {
    lastExecutedTimestamp: string | undefined;
    bdvLeftToConvert: TV;
  };
  withdrawalPlan?: WithdrawalPlan;
  totalAvailableBdv: TV;
  amountConvertibleNextExecution: TV;
  meetsConditions: {
    price: boolean;
    bonus: boolean;
    capacity: boolean;
  };
  isComplete?: boolean;
}
