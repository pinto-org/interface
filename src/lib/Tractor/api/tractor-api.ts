import { API_SERVICES } from "@/constants/endpoints";
import { HashString, Prettify } from "@/utils/types.generic";
import { safeJSONStringify } from "@/utils/utils";
import {
  BaseTractorAPIResponse,
  TractorAPIExecutionConvertUpOrderItem,
  TractorAPIExecutionResponse,
  TractorAPIExecutionSegregatedResponse,
  TractorAPIExecutionSowOrderItem,
  TractorAPIOrderType,
  TractorAPIOrdersResponse,
  TractorAPIResponseExecution,
} from "./tractor-api.types";

// ================================================================================
// TRACTOR API ORDER ENDPOINT
// ================================================================================

export interface TractorAPIOrderOptions<OrderType extends TractorAPIOrderType = TractorAPIOrderType> {
  orderType?: OrderType;
  cancelled?: boolean;
  publisher?: `0x${string}`;
  isConvert?: boolean; // TEMPORARY
}
const getOrders = async <OrderType extends TractorAPIOrderType>(_options?: TractorAPIOrderOptions<OrderType>) => {
  console.debug("[Tractor/tractorAPIFetchOrders] Fetching orders...");

  const { isConvert, ...options } = { ..._options };

  const baseURL = getTractorBaseURL(isConvert);

  try {
    // Fetch the results from the API
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

    // Reduce the results into a single response
    const data = result.reduce<Prettify<TractorAPIOrdersResponse<OrderType>>>(
      (prev, curr) => {
        prev.orders.push(...curr.orders);
        // lastUpdated and totalRecords only need to be set once.
        if (prev.orders.length) {
          return prev;
        }
        if (!prev.lastUpdated) prev.lastUpdated = curr.lastUpdated;
        if (!prev.totalRecords) prev.totalRecords = curr.totalRecords;
        return prev;
      },
      { lastUpdated: 0, totalRecords: 0, orders: [] },
    );

    console.debug("----- [Tractor/tractorAPIFetchOrders] RESPONSE:", data);

    return data;
  } catch (e) {
    // If there is an error, log to the console and return a default response
    console.error(e);
    return {
      lastUpdated: 0,
      totalRecords: 0,
      orders: [],
    };
  }
};

// ================================================================================
// TRACTOR API EXECUTION ENDPOINT
// ================================================================================

const EMPTY_SEGREGATED_RESPONSE: TractorAPIExecutionSegregatedResponse<string, number, HashString> = {
  sowBlueprintV0: [],
  convertUpBlueprintV0: [],
  unknown: [],
  lastUpdated: 0,
  totalRecords: 0,
};

const segregateExecutionsByBlueprintType = (
  result: TractorAPIExecutionResponse<unknown>,
): TractorAPIExecutionSegregatedResponse<string, number, HashString> => {
  const segregated = { ...EMPTY_SEGREGATED_RESPONSE };

  result.executions.forEach((record) => {
    if (isSowV0BlueprintExecution(record)) {
      segregated.sowBlueprintV0.push(record);
    } else if (isConvertUpBlueprintV0Execution(record)) {
      segregated.convertUpBlueprintV0.push(record);
    } else {
      segregated.unknown.push(record);
    }
  });

  return segregated;
};

const isSowV0BlueprintExecution = (
  result: TractorAPIResponseExecution<unknown>,
): result is TractorAPIExecutionSowOrderItem<string> => {
  return result.orderInfo.orderType === "SOW_V0";
};

const isConvertUpBlueprintV0Execution = (
  result: TractorAPIResponseExecution<unknown>,
): result is TractorAPIExecutionConvertUpOrderItem<string, number, HashString> => {
  return result.orderInfo.orderType === "CONVERT_UP_V0";
};

export interface TractorAPIExecutionsOptions {
  publisher?: `0x${string}`;
  isConvert?: boolean;
}
const tractorAPIFetchExecutions = async (
  _options?: TractorAPIExecutionsOptions,
): Promise<TractorAPIExecutionSegregatedResponse<string, number, HashString>> => {
  console.debug("[Tractor/tractorAPIFetchExecutions] Fetching executions...");

  const { isConvert, ...options } = { ..._options };

  const baseURL = getTractorBaseURL(isConvert);

  try {
    // Fetch the results from the API
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

    // Reduce the results into a single response
    const data = results.reduce<TractorAPIExecutionResponse<unknown>>(
      (prev, curr) => {
        if (!prev.lastUpdated) prev.lastUpdated = curr.lastUpdated;
        if (!prev.totalRecords) prev.totalRecords = curr.totalRecords;
        prev.executions.push(...curr.executions);
        return prev;
      },
      { lastUpdated: 0, totalRecords: 0, executions: [] },
    );

    const segregated = segregateExecutionsByBlueprintType(data);

    console.debug("----- [Tractor/tractorAPIFetchExecutions] RESPONSE:", segregated);
    // Return the data
    return segregated;
  } catch (e) {
    // If there is an error, log to the console and return a default response
    console.error(e);
    return { ...EMPTY_SEGREGATED_RESPONSE };
  }
};

// ────────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ────────────────────────────────────────────────────────────────────────────────

const TractorAPI = {
  getOrders,
  getExecutions: tractorAPIFetchExecutions,
} as const;

export default TractorAPI;

// ────────────────────────────────────────────────────────────────────────────────
// Shared Functions
// ────────────────────────────────────────────────────────────────────────────────

const MAX_LIMIT = 5_000;

const getTractorBaseURL = (isConvert?: boolean) => {
  const tractorUrl = import.meta.env.VITE_TRACTOR_CONVERT_URL;
  if (isConvert && tractorUrl) {
    return `http://api.${tractorUrl}`;
  }

  return API_SERVICES.pinto;
};

/**
 * Handles pagination for Tractor API requests that may return large datasets.
 *
 * The Tractor API has a maximum limit of 5000 records per request. This function
 * automatically fetches all available records by making multiple parallel requests
 * when the total number of records exceeds the limit.
 *
 * @template T - The response type, must extend BaseTractorAPIResponse
 * @param asyncCallback - Async function that performs the actual API request
 * @param getReturnLength - Function to extract the number of records from the response
 * @param requestBody - The request body to send with each API call
 * @returns Array of responses from all pagination requests, or empty array on error
 *
 * @example
 * ```typescript
 * const results = await paginateTractorApiRequest(
 *   (body) => fetch('/api/orders', { body }),
 *   (res) => res.orders.length,
 *   { orderType: 'SOW_V0' }
 * );
 * ```
 */
async function paginateTractorApiRequest<T extends BaseTractorAPIResponse>(
  asyncCallback: (body?: Record<string, unknown>) => Promise<T>,
  getReturnLength: (res: T) => number,
  requestBody: any,
) {
  // Create the body with the first limit of n records
  const body = { ...requestBody, limit: MAX_LIMIT };

  try {
    // Make the first request
    const res = await asyncCallback(body);

    // If the response has fewer records than the limit, return the response immediately
    if (getReturnLength(res) < body.limit) {
      return [res];
    }

    // Calculate the number of additional requests needed
    const amountLeft = Math.ceil((res.totalRecords - body.limit) / body.limit);

    // Make the additional requests
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
