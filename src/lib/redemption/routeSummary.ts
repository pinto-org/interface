import { TV } from "@/classes/TokenValue";
import type { SwapRoutingSummary } from "@/hooks/swap/useSwapSummary";
import { formatter } from "@/utils/format";
import type { Token } from "@/utils/types";
import type { RedemptionRoute } from "./route";

/** Adapt parallel fee-free exits and their downstream swaps to the shared routing UI. */
export function redemptionRouteSummary(
  route: RedemptionRoute,
  input: Token,
  output: Token,
  tokens: readonly Token[],
  prices: ReadonlyMap<Token, { instant: TV }>,
): SwapRoutingSummary | undefined {
  const lookup = (address: string) => tokens.find((token) => token.address.toLowerCase() === address.toLowerCase());
  const usd = (token: Token, amount: TV) => {
    const price = prices.get(token)?.instant;
    return price?.gt(0) ? price.mul(amount) : undefined;
  };
  const routes: SwapRoutingSummary["swap"]["routes"] = [];
  let totalIn = TV.ZERO;
  let afterExit: TV | undefined = TV.ZERO;
  for (const [index, leg] of route.legs.entries()) {
    const paired = lookup(leg.snapshot.outputToken);
    if (!paired) return undefined;
    const amountIn = TV.fromBlockchain(leg.selection.amount, input.decimals);
    const amountOut = TV.fromBlockchain(leg.output, paired.decimals);
    totalIn = totalIn.add(amountIn);
    const exitUsd = usd(paired, amountOut);
    afterExit = afterExit && exitUsd ? afterExit.add(exitUsd) : undefined;
    routes.push({
      sellToken: input,
      buyToken: paired,
      amountIn,
      amountOut,
      usdOut: usd(paired, amountOut),
      exchange: "pinto-exchange",
      exchangeFeePct: 0,
      description: `${formatter.xDec(amountIn, input.displayDecimals ?? 6)} ${input.symbol} · Fee-free exit`,
      step: `Pool ${index + 1} · Fee-free exit`,
    });
    if (leg.swap) {
      const swapped = TV.fromBlockchain(leg.swap.buyAmount, output.decimals);
      routes.push({
        sellToken: paired,
        buyToken: output,
        amountIn: TV.fromBlockchain(leg.swap.sellAmount, paired.decimals),
        amountOut: swapped,
        usdOut: usd(output, swapped),
        exchange: "0x",
        description: leg.swap.sources.join(", ") || undefined,
        step: `Pool ${index + 1} · 0x swap`,
        fills: leg.swap.fills?.map((fill) => ({
          from: lookup(fill.from)?.symbol ?? fill.fromSymbol ?? fill.from,
          to: lookup(fill.to)?.symbol ?? fill.toSymbol ?? fill.to,
          source: fill.source,
          proportionBps: fill.proportionBps,
        })),
      });
    }
  }
  // Parallel branches must be compared in aggregate; first/last rows are not the whole trade.
  const usdIn = usd(input, totalIn);
  const usdOut = usd(output, TV.fromBlockchain(route.expected, output.decimals));
  const totalSlippage = usdIn?.gt(0) && usdOut ? usdIn.sub(usdOut).div(usdIn).mul(100).toNumber() : undefined;
  return {
    swap: { routes, exchanges: [...new Set(routes.map((row) => row.exchange))], totalSlippage },
    totalSlippage,
    valueBreakdown: { input: usdIn, afterExit, output: usdOut },
  };
}
