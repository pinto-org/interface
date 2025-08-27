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
  totalConvertBdv: Numeric;
  minConvertBdvPerExecution: Numeric;
  maxConvertBdvPerExecution: Numeric;
  minTimeBetweenConverts: Numeric;
  minConvertBonusCapacity: Numeric;
  maxGrownStalkPerBdv: Numeric;
  minGrownStalkPerBdvBonus: Numeric;
  maxPriceToConvertUp: Numeric;
  minPriceToConvertUp: Numeric;
  maxGrownStalkPerBdvPenalty: Numeric;
  slippageRatio: Numeric;
  operatorTip: Numeric;
  lowStalkDeposits: LowStalkDepositsMode;
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
  totalConvertBdv: Numeric;
  /**
   * Minimum BDV to convert per execution
   */
  minConvertBdvPerExecution: Numeric;
  /**
   * Maximum BDV to convert per execution
   */
  maxConvertBdvPerExecution: Numeric;
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
  minGrownStalkPerBdvBonus: Numeric;
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
  currentlyConvertible: TV;
  amountConvertibleNextExecution: TV;
  meetsConditions: {
    price: boolean;
    bonus: boolean;
    capacity: boolean;
  };
  isComplete?: boolean;
}
