import { ZeroXQuoteV2Parameters, ZeroXQuoteV2Response } from "@/lib/matcha/types";
import { resolveChainId } from "@/utils/chain";
import { stringEq, stringToNumber } from "@/utils/string";
import { exists } from "@/utils/utils";

import { TV } from "@/classes/TokenValue";
import { ZERO_ADDRESS_HEX } from "@/constants/address";
import { getChainTokenMap, getTokenIndex } from "@/utils/token";

type RequestParams = Omit<RequestInit, "headers" | "method">;

const endpoint = import.meta.env.VITE_ROUTER_ENDPOINT ?? "";

const endpointSlug = "swap/allowance-holder/quote";

const routerEndpoint = endpoint ? `${endpoint}/${endpointSlug}` : undefined;

export class ZeroX {
  /**
   * Fetches quotes from the 0x API
   *
   * @param args - a single request or an array of requests
   * @param requestInit - optional request init params
   * @returns
   */
  static async quote<T extends ZeroXQuoteV2Parameters = ZeroXQuoteV2Parameters>(
    args: T | T[],
    requestInit?: RequestParams,
  ): Promise<ZeroXQuoteV2Response[]> {
    if (!routerEndpoint) {
      throw new Error("ERROR: Router endpoint is not set");
    }

    const fetchArgs = Array.isArray(args) ? args : [args];

    const requests = fetchArgs.map((params) => {
      if (!params.buyToken && !params.sellToken) {
        throw new Error("buyToken and sellToken and required");
      }

      if (!params.sellAmount) {
        throw new Error("sellAmount is required");
      }

      const urlParams = new URLSearchParams(ZeroX.generateQuoteParams(params) as unknown as Record<string, string>);

      return () => ZeroX.send0xRequest(urlParams, requestInit);
    });

    return Promise.all(requests.map((r) => r()));
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
      }),
    };

    const url = `${routerEndpoint}/?${urlParams.toString()}`;

    return fetch(url, options).then((r) => r.json()) as Promise<ZeroXQuoteV2Response>;
  }

  /**
   * Generate the params for the 0x API
   * @throws if required params are missing
   *
   * @returns the params for the 0x API
   */
  static generateQuoteParams<T extends ZeroXQuoteV2Parameters = ZeroXQuoteV2Parameters>(
    params: T,
  ): ZeroXQuoteV2Parameters {
    if (!ZeroX.isValidQuoteParams(params)) {
      throw new Error("ERROR: Invalid quote params");
    }

    const quoteParams: ZeroXQuoteV2Parameters = {
      chainId: resolveChainId(params.chainId),
      buyToken: params.buyToken,
      sellToken: params.sellToken,
      sellAmount: params.sellAmount,
      taker: params.taker,
      txOrigin: params.txOrigin ?? undefined,
      swapFeeRecipient: params.swapFeeRecipient ?? undefined,
      swapFeeBps: params.swapFeeBps ?? undefined,
      tradeSurplusRecipient: params.tradeSurplusRecipient ?? undefined,
      gasPrice: params.gasPrice,
      slippageBps: params.slippageBps ?? 10, // default 0.1% slippage
      excludedSources: params.excludedSources,
      sellEntireBalance: params.sellEntireBalance ?? false,
    };

    Object.keys(quoteParams).forEach((_key) => {
      const key = _key as keyof ZeroXQuoteV2Parameters;
      if (!exists(quoteParams[key]) || quoteParams[key] === "") {
        delete quoteParams[key];
      }
    });

    return quoteParams;
  }

  static isValidQuoteParams(params: ZeroXQuoteV2Parameters) {
    const tokenMap = getChainTokenMap(params.chainId);
    const sellTokenToken = tokenMap[getTokenIndex(params.sellToken)];

    if (!sellTokenToken) {
      return false;
    }

    const sellAmount = TV.fromHuman(params.sellAmount, sellTokenToken?.decimals);

    if (
      !params.chainId ||
      !params.buyToken ||
      !params.sellToken ||
      !sellAmount.gt(0) ||
      stringEq(params.buyToken, ZERO_ADDRESS_HEX) ||
      stringEq(params.sellToken, ZERO_ADDRESS_HEX)
    ) {
      return false;
    }

    return true;
  }

  static slippageToSlippageBps(slippage: number | string) {
    return stringToNumber(slippage.toString()) * 100;
  }
}
