import { TV } from "@/classes/TokenValue";
import { API_SERVICES } from "@/constants/endpoints";
import { HashString, Prettify } from "@/utils/types.generic";
import { safeJSONStringify } from "@/utils/utils";

// ────────────────────────────────────────────────────────────────────────────────
// Shared Interfaces & Functions
// ────────────────────────────────────────────────────────────────────────────────

export type BaseTractorAPIResponse<T = unknown> = {
  lastUpdated: number;
  totalRecords: number;
} & T;

export type TractorSowOrderType = "SOW_V0";

export type TractorConvertOrderType = "CONVERT_UP_V0";

export type TractorAPIOrderType = TractorSowOrderType | TractorConvertOrderType;

const MAX_LIMIT = 5_000;

const getTractorBaseURL = (isConvert?: boolean) => {
  const tractorUrl = import.meta.env.VITE_TRACTOR_CONVERT_URL;
  if (isConvert && tractorUrl) {
    return `http://api.${tractorUrl}`;
  }

  return API_SERVICES.pinto;
};

async function paginateTractorApiRequest<T extends BaseTractorAPIResponse>(
  asyncCallback: (body?: Record<string, unknown>) => Promise<T>,
  getReturnLength: (res: T) => number,
  requestBody: any,
) {
  const body = { ...requestBody, limit: MAX_LIMIT };

  try {
    const res = await asyncCallback(body);

    if (getReturnLength(res) < body.limit) {
      return [res];
    }

    const amountLeft = Math.ceil((res.totalRecords - body.limit) / body.limit);

    return Promise.all(
      Array.from({ length: amountLeft }, (_, i) => i + 1).map((skipAmount) =>
        asyncCallback({ ...body, skip: skipAmount }),
      ),
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

// ================================================================================
// TRACTOR API ORDER ENDPOINT
// ================================================================================

export interface TractorAPIOrderOptions<OrderType extends TractorAPIOrderType = TractorAPIOrderType> {
  orderType?: OrderType;
  cancelled?: boolean;
  publisher?: `0x${string}`;
  isConvert?: boolean;
}
const getOrders = async <OrderType extends TractorAPIOrderType>(_options?: TractorAPIOrderOptions<OrderType>) => {
  console.debug("[Tractor/tractorAPIFetchOrders] Fetching orders...");

  const { isConvert, ...options } = { ..._options };

  const baseURL = getTractorBaseURL(isConvert);

  try {
    const result = await paginateTractorApiRequest(
      (reqBody) =>
        fetch(`${baseURL}/tractor/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: safeJSONStringify(reqBody, undefined),
        }).then((res) => res.json() as Promise<TractorAPIOrdersResponse<OrderType>>),
      (res) => res.orders.length,
      { ...options, limit: MAX_LIMIT, skip: 0 },
    );

    const data = result.reduce<Prettify<TractorAPIOrdersResponse<OrderType>>>(
      (prev, curr) => {
        if (!prev.lastUpdated) prev.lastUpdated = curr.lastUpdated;
        if (!prev.totalRecords) prev.totalRecords = curr.totalRecords;
        prev.orders.push(...curr.orders);
        return prev;
      },
      { lastUpdated: 0, totalRecords: 0, orders: [] },
    );

    if (options.orderType === "CONVERT_UP_V0") {
      const set = new Set<string>();

      data.orders.forEach((order) => {
        const o = order as TractorAPIOrder<"CONVERT_UP_V0">;
        set.add(o.blueprintData.lowStalkDeposits);
      });

      console.log("set", set);
    }

    console.debug("[Tractor/tractorAPIFetchOrders] RESPONSE", data);

    return data;
  } catch (e) {
    console.error(e);
    return {
      lastUpdated: 0,
      totalRecords: 0,
      orders: [],
    };
  }
};

export type TractorAPIOrdersResponse<OrderType extends TractorAPIOrderType = TractorAPIOrderType> =
  BaseTractorAPIResponse<{
    orders: Prettify<TractorAPIOrder<OrderType>>[];
  }>;

export interface TractorAPIOrdersExecutionInfo {
  executionCount: number;
  latestExecution: string | null;
}

export interface TractorAPISowOrderBlueprint {
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

export interface TractorAPIConvertUpBlueprint {
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
  blueprintData: OrderBlueprintTypeLookup[OrderType];
  executionStats: TractorAPIOrdersExecutionInfo;
}

// ================================================================================
// TRACTOR API EXECUTION ENDPOINT
// ================================================================================

export interface TractorAPIExecutionsOptions {
  publisher?: `0x${string}`;
  isConvert?: boolean;
}
const tractorAPIFetchExecutions = async (_options?: TractorAPIExecutionsOptions) => {
  console.debug("[Tractor/tractorAPIFetchExecutions] Fetching executions...");

  const { isConvert, ...options } = { ..._options };

  const baseURL = getTractorBaseURL(isConvert);

  try {
    const results = await paginateTractorApiRequest(
      (requestBody: any) => {
        return fetch(`${baseURL}/tractor/executions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: safeJSONStringify(requestBody, undefined),
        }).then((res) => res.json() as Promise<TractorAPIExecutionResponse<unknown>>);
      },
      (res) => res.executions.length,
      { orderType: "KNOWN", ...options },
    );

    const data = results.reduce<TractorAPIExecutionResponse<unknown>>(
      (prev, curr) => {
        if (!prev.lastUpdated) prev.lastUpdated = curr.lastUpdated;
        if (!prev.totalRecords) prev.totalRecords = curr.totalRecords;
        prev.executions.push(...curr.executions);
        return prev;
      },
      { lastUpdated: 0, totalRecords: 0, executions: [] },
    );

    console.debug("[Tractor/tractorAPIFetchExecutions] RESPONSE", data);

    return data;
  } catch (e) {
    console.error("[Tractor/tractorAPIFetchExecutions] ERROR", e);
    return {
      lastUpdated: 0,
      totalRecords: 0,
      executions: [],
    };
  }
};

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

export interface TractorAPIExecutionResponse<Blueprint> {
  lastUpdated: number;
  totalRecords: number;
  executions: TractorAPIResponseExecution<Blueprint>[];
}

export interface TractorAPIExecutionSowBlueprint<Value extends string | TV = TV> {
  id: number;
  blueprintHash: HashString;
  index: Value;
  beans: Value;
  pods: Value;
  placeInLine: Value;
  usedTokens: HashString[];
  usedGrownStalkPerBdv: Value;
}

export type TractorAPIExecutionSowOrderItem<Value extends string | TV = TV> = Prettify<
  TractorAPIResponseExecution<TractorAPIExecutionSowBlueprint<Value>>
>;

// ────────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ────────────────────────────────────────────────────────────────────────────────

const TractorAPI = {
  getOrders,
  getExecutions: tractorAPIFetchExecutions,
} as const;

export default TractorAPI;
