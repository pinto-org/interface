import { TV } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { HashString, Prettify } from "@/utils/types.generic";

// ================================================================================
// BASE TRACTOR API TYPES
// ================================================================================

export type BaseTractorAPIResponse<T = unknown> = {
  lastUpdated: number;
  totalRecords: number;
} & T;

export type TractorAPISowOrderType = "SOW_V0";

export type TractorAPIConvertOrderType = "CONVERT_UP_V0";

export type TractorAPIOrderType = TractorAPISowOrderType | TractorAPIConvertOrderType;

// ================================================================================
// TRACTOR API ORDER TYPES
// ================================================================================

export type TractorAPIOrdersResponse<OrderType extends TractorAPIOrderType = TractorAPIOrderType> =
  BaseTractorAPIResponse<{
    orders: Prettify<TractorAPIOrder<OrderType>>[];
  }>;

interface TractorAPIOrdersExecutionInfo {
  executionCount: number;
  latestExecution: string | null;
}

interface TractorAPISowOrderBlueprint {
  blueprintHash: HashString;
  pintoSownCounter: string;
  lastExecutedSeason: number;
  orderComplete: boolean;
  amountFunded: string;
  cascadeAmountFunded: string;
  sourceTokenIndices: string[];
  totalAmountToSow: string;
  minAmountToSowPerSeason: string;
  maxAmountToSowPerSeason: string;
  minTemp: string;
  maxPodlineLength: string;
  maxGrownStalkPerBdv: string;
  runBlocksAfterSunrise: string;
  slippageRatio: string;
}

interface TractorAPIConvertUpBlueprint {
  blueprintHash: HashString;
  amountFunded: string;
  cascadeAmountFunded: string;
  beansLeftToConvert: string;
  capAmountToBonusCapacity: boolean;
  grownStalkPerBdvBonusBid: string;
  lastExecutedTimestamp: string;
  lowStalkDeposits: "USE_LAST" | "USE" | "OMIT";
  maxBeansConvertPerExecution: string;
  maxGrownStalkPerBdv: string;
  maxGrownStalkPerBdvPenalty: string;
  minPriceToConvertUp: string;
  maxPriceToConvertUp: string;
  minBeansConvertPerExecution: string;
  minConvertBonusCapacity: string;
  minTimeBetweenConverts: string;
  orderComplete: boolean;
  seedDifference: string;
  slippageRatio: string;
  sourceTokenIndicies: number[];
  totalBeanAmountToConvert: string;
}

type OrderBlueprintTypeLookup = {
  SOW_V0: TractorAPISowOrderBlueprint;
  CONVERT_UP_V0: TractorAPIConvertUpBlueprint;
};

export interface TractorAPIOrder<OrderType extends TractorAPIOrderType = TractorAPIOrderType> {
  blueprintHash: HashString;
  orderType: OrderType;
  publisher: HashString;
  data: HashString;
  operatorPasteInstrs: HashString[];
  maxNonce: string;
  startTime: string;
  endTime: string;
  signature: HashString;
  publishedTimestamp: string;
  publishedBlock: number;
  beanTip: string;
  cancelled: boolean;
  blueprintData: Prettify<OrderBlueprintTypeLookup[OrderType]>;
  executionStats: TractorAPIOrdersExecutionInfo;
}

// ================================================================================
// TRACTOR API ORDER TYPES
// ================================================================================

export interface TractorAPIResponseExecution<Blueprint> {
  id: number;
  blueprintHash: HashString;
  nonce: string;
  operator: HashString;
  gasCostUsd: number;
  tipUsd: number;
  executedTimestamp: string;
  executedBlock: number;
  executedTxn: HashString;
  orderInfo: TractorAPIExecutionOrderInfo;
  blueprintData: Blueprint;
}

export interface TractorAPIExecutionOrderInfo {
  orderType: TractorAPIOrderType;
  publisher: HashString;
}

export interface TractorAPIExecutionResponse<Blueprint> extends BaseTractorAPIResponse {
  executions: Prettify<TractorAPIResponseExecution<Blueprint>>[];
}

interface TractorAPIExecutionSowBlueprint<Value extends string | TV = TV> {
  id: number;
  blueprintHash: HashString;
  index: Value;
  beans: Value;
  pods: Value;
  placeInLine: Value;
  usedTokens: HashString[];
  usedGrownStalkPerBdv: Value;
}

interface TractorAPIExecutionConvertUpBlueprint<
  Value extends string | TV = TV,
  Price extends number | TV = TV,
  TokenIsh extends HashString | Token = Token,
> {
  id: number;
  blueprintHash: HashString;
  usedTokens: TokenIsh[];
  tokenFromAmounts: Value[];
  tokenToAmounts: Value[];
  beanPriceBefore: Price;
  beanPriceAfter: Price;
  beansConverted: Value;
  gsBonusBdv: Value;
  gsBonusStalk: Value;
  gsPenaltyStalk: Value;
  gsPenaltyBdv: Value;
}

export type TractorAPIExecutionSowOrderItem<Value extends string | TV = TV> = Prettify<
  TractorAPIResponseExecution<TractorAPIExecutionSowBlueprint<Value>>
>;

export type TractorAPIExecutionConvertUpOrderItem<
  Value extends string | TV = TV,
  Price extends number | TV = TV,
  TokenIsh extends HashString | Token = Token,
> = Prettify<TractorAPIResponseExecution<TractorAPIExecutionConvertUpBlueprint<Value, Price, TokenIsh>>>;

export interface TractorAPIExecutionSegregatedResponse<
  Value extends string | TV = TV,
  Price extends number | TV = TV,
  TokenIsh extends HashString | Token = Token,
> extends BaseTractorAPIResponse {
  sowBlueprintV0: TractorAPIExecutionSowOrderItem<Value>[];
  convertUpBlueprintV0: TractorAPIExecutionConvertUpOrderItem<Value, Price, TokenIsh>[];
  unknown: TractorAPIResponseExecution<any>[];
}
