import { TV } from "@/classes/TokenValue";
import {
  SiloWrappedTokenUnwrapNode,
  SiloWrappedTokenWrapNode,
  WellSyncSwapNode,
  ZeroXSwapNode,
} from "@/lib/Swap/nodes/ERC20SwapNode";
import { NativeSwapNode } from "@/lib/Swap/nodes/NativeSwapNode";
import { SwapNode } from "@/lib/Swap/nodes/SwapNode";
import { BeanSwapNodeQuote } from "@/lib/Swap/swap-router";
import { usePriceData } from "@/state/usePriceData";
import { Token } from "@/utils/types";
import { exists } from "@/utils/utils";
import { useMemo } from "react";

export type SwapSummaryExchange = "pinto-exchange" | "0x" | "base" | "sPinto";

export interface BaseSwapSummary {
  sellToken: Token;
  buyToken: Token;
  amountOut: TV;
  amountIn: TV;
  usdOut: TV;
  usdIn: TV;
}

export interface SwapRouteSummary extends BaseSwapSummary {
  exchangeFee?: number;
  exchangeFeePct?: number;
  exchange: SwapSummaryExchange;
}

export interface SwapSummary {
  swap: {
    routes: SwapRouteSummary[];
    totalSlippage: number;
    exchanges: SwapSummaryExchange[];
  };
  addLiquidity?: {
    route: BaseSwapSummary;
    totalSlippage: number;
  };
  totalSlippage: number;
}

export default function useSwapSummary(quote: BeanSwapNodeQuote | undefined): SwapSummary | undefined {
  const { tokenPrices } = usePriceData();

  return useMemo(() => {
    if (!quote) return undefined;

    const routes: SwapRouteSummary[] = [];
    const sources: Set<SwapSummaryExchange> = new Set();
    let addLiquidityRoute: BaseSwapSummary | undefined = undefined;
    let addLiquiditySlippage: number | undefined = undefined;

    for (const node of quote.nodes) {
      const route = node2Route(node);
      sources.add(route.exchange);

      if (node instanceof WellSyncSwapNode) {
        addLiquidityRoute = route;
        addLiquiditySlippage = quote.usdIn.sub(quote.usdOut).div(quote.usdIn).mul(100).toNumber();
        routes.push(route);
      } else {
        if (node instanceof ZeroXSwapNode) {
          const fee = node.getFeeFromQuote();
          route.exchange = "0x";

          if (fee?.feeToken) {
            const feeTokenUSD = tokenPrices.get(fee.feeToken);
            if (feeTokenUSD) {
              const feeUSD = fee.fee.mul(feeTokenUSD.instant);
              const feePct = feeUSD.div(node.usdIn).mul(100).toNumber();
              route.exchangeFee = feeUSD.toNumber();
              route.exchangeFeePct = feePct;
            }
          }
        }

        if (route.exchange !== "base") {
          sources.add(route.exchange);
        }

        routes.push(route);
      }
    }

    const firstSwap = routes?.[0];
    const lastSwap = routes?.[routes.length - 1];

    const addLiquidity =
      exists(addLiquidityRoute) && exists(addLiquiditySlippage)
        ? {
            route: addLiquidityRoute,
            totalSlippage: addLiquiditySlippage,
          }
        : undefined;

    const totalSlippage = getSlippageUSD(quote.usdIn, quote.usdOut);

    const swap = {
      routes,
      totalSlippage: getSlippageUSD(firstSwap?.usdIn ?? TV.ZERO, lastSwap?.usdOut ?? TV.ZERO),
      exchanges: Array.from(sources),
    };

    return {
      swap,
      addLiquidity,
      totalSlippage,
    };
  }, [quote, tokenPrices]);
}

function node2Route(node: SwapNode): SwapRouteSummary {
  const route = {
    sellToken: node.sellToken,
    buyToken: node.buyToken,
    amountOut: node.buyAmount,
    amountIn: node.sellAmount,
    usdOut: node.usdOut,
    usdIn: node.usdIn,
    exchange: getExchangeFromNode(node),
  };

  return route;
}

function getExchangeFromNode(node: SwapNode): SwapSummaryExchange {
  if (node instanceof ZeroXSwapNode) return "0x";
  if (node instanceof NativeSwapNode) return "base";
  if (node instanceof SiloWrappedTokenWrapNode || node instanceof SiloWrappedTokenUnwrapNode) {
    return "sPinto";
  }
  return "pinto-exchange";
}

function getSlippageUSD(inUSD: TV, outUSD: TV): number {
  if (inUSD.isZero || outUSD.isZero) return 0;
  return inUSD.sub(outUSD).div(inUSD).mul(100).toNumber();
}
