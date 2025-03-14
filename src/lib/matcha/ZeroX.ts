import { Limiter } from "@/classes/Limiter";
import { ZeroExQuoteResponse } from "@/lib/matcha/types";
import { exists } from "@/utils/utils";
import { stringEq, stringToNumber } from "./../../utils/string";

import { ZERO_ADDRESS, ZERO_ADDRESS_HEX } from "@/constants/address";
import { PINTO, tokens } from "@/constants/tokens";
import { ZeroExAPI } from "./types";

const apiKey = import.meta.env.VITE_ZEROEX_API_KEY;

type RequestParams = Omit<RequestInit, "headers" | "method">;

const endpoint = "https://base.api.0x.org/swap/v1/quote";

export class ZeroX {
  /**
   * Fetches quotes from the 0x API
   *
   * @note Utilizes Bottleneck limiter to prevent rate limiting.
   * - In the case of a rate limit, it will retry until up to 3 times every 200ms.
   *
   * @param args - a single request or an array of requests
   * @param requestInit - optional request init params
   * @returns
   */
  static async quote<T extends ZeroExAPI = ZeroExAPI>(
    args: T | T[],
    requestInit?: RequestParams,
  ): Promise<ZeroExQuoteResponse[]> {
    if (!apiKey) {
      throw new Error("API key is not set");
    }

    const fetchArgs = Array.isArray(args) ? args : [args];

    const requests = fetchArgs.map((params) => {
      if (!params.buyToken && !params.sellToken) {
        throw new Error("buyToken and sellToken and required");
      }

      if (!params.sellAmount && !params.buyAmount) {
        throw new Error("sellAmount or buyAmount is required");
      }

      const urlParams = new URLSearchParams(ZeroX.generateQuoteParams(params) as unknown as Record<string, string>);

      return {
        id: ZeroX.generateRequestId(params),
        request: () => ZeroX.send0xRequest(urlParams, requestInit),
      };
    });

    return Limiter.fetchWithBottleneckLimiter<ZeroExQuoteResponse>(requests, { allowFailure: false });
  }

  private static async send0xRequest(
    urlParams: URLSearchParams,
    requestInit?: Omit<RequestInit, "headers" | "method">,
  ) {
    const options = {
      ...requestInit,
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "0x-api-key": apiKey,
      }),
    };

    const url = `${endpoint}?${urlParams.toString()}`;

    return fetch(url, options).then((r) => r.json()) as Promise<ZeroExQuoteResponse>;
  }

  private static generateRequestId<T extends ZeroExAPI = ZeroExAPI>(args: T) {
    const sellToken = args.sellToken || "";
    const buyToken = args.buyToken || "";
    const sellAmount = args.sellAmount || "0";
    const buyAmount = args.buyAmount || "0";
    const slippagePercentage = args.slippagePercentage || "0.01";
    const timestamp = new Date().getTime();

    return `0x-${sellToken}-${buyToken}-${sellAmount}-${buyAmount}-${slippagePercentage}-${timestamp}`;
  }

  /**
   * Generate the params for the 0x API
   * @throws if required params are missing
   *
   * @returns the params for the 0x API
   */
  static generateQuoteParams<T extends ZeroExAPI = ZeroExAPI>(params: T): ZeroExAPI {
    const quoteParams: ZeroExAPI = {
      sellToken: params.sellToken,
      buyToken: params.buyToken,
      sellAmount: params.sellAmount,
      buyAmount: params.buyAmount,
      slippagePercentage: params.slippagePercentage ?? "0.01",
      gasPrice: params.gasPrice,
      takerAddress: params.takerAddress,
      excludedSources: params.excludedSources,
      includedSources: params.includedSources,
      skipValidation: params.skipValidation ?? "true", // defaults to true b/c most of our swaps go through advFarm / pipeline calls
      feeRecipient: params.feeRecipient,
      buyTokenPercentageFee: params.buyTokenPercentageFee,
      priceImpactProtectionPercentage: params.priceImpactProtectionPercentage,
      feeRecipientTradeSurplus: params.feeRecipientTradeSurplus,
      shouldSellEntireBalance: params.shouldSellEntireBalance ?? "false",
    };

    Object.keys(quoteParams).forEach((_key) => {
      const key = _key as keyof typeof quoteParams;
      if (!exists(quoteParams[key]) || quoteParams[key] === "") {
        delete quoteParams[key];
      }
    });

    return quoteParams;
  }

  static isValidQuoteParams(params: ZeroExAPI) {
    const sellAmount = stringToNumber(params.sellAmount ?? "");
    const buyAmount = stringToNumber(params.buyAmount ?? "");

    if (
      !params.buyToken ||
      !params.sellToken ||
      (!sellAmount && !buyAmount) ||
      stringEq(params.buyToken, PINTO.address) ||
      stringEq(params.sellToken, PINTO.address) ||
      stringEq(params.buyToken, ZERO_ADDRESS_HEX) ||
      stringEq(params.sellToken, ZERO_ADDRESS_HEX)
    ) {
      return false;
    }

    return true;
  }
}
