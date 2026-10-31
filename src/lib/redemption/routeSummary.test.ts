import { TV } from "@/classes/TokenValue";
import type { Token } from "@/utils/types";
import { describe, expect, it } from "vitest";
import type { RedemptionRoute } from "./route";
import { redemptionRouteSummary } from "./routeSummary";

const metadata = { name: "Test token", chainId: 1337, logoURI: "" };
const pinto: Token = { ...metadata, address: "0x01", symbol: "PINTO", decimals: 6 };
const eth: Token = { ...metadata, address: "0x02", symbol: "WETH", decimals: 18 };
const usdc: Token = { ...metadata, address: "0x03", symbol: "USDC", decimals: 6 };
const tokens = [pinto, eth, usdc];
const prices = new Map(tokens.map((token, i) => [token, { instant: TV.fromHuman([1, 2000, 1][i], 6) }]));
const route = {
  expected: 90_000000n,
  legs: [
    {
      selection: { amount: 60_000000n },
      output: 30_000000000000000n,
      snapshot: { outputToken: eth.address },
      swap: { sellAmount: 30_000000000000000n, buyAmount: 55_000000n, sources: ["Uniswap_V3"] },
    },
    { selection: { amount: 40_000000n }, output: 35_000000n, snapshot: { outputToken: usdc.address } },
  ],
} as unknown as RedemptionRoute;

describe("withdrawal routing summary", () => {
  it("shows each fee-free leg and downstream swap with correct token decimals and sources", () => {
    const summary = redemptionRouteSummary(route, pinto, usdc, tokens, prices)!;
    expect(
      summary.swap.routes.map((row) => [row.sellToken.symbol, row.buyToken.symbol, row.amountOut.toHuman()]),
    ).toEqual([
      ["PINTO", "WETH", "0.03"],
      ["WETH", "USDC", "55"],
      ["PINTO", "USDC", "35"],
    ]);
    expect(summary.swap.exchanges).toEqual(["pinto-exchange", "0x"]);
    expect(summary.swap.routes[0].description).toContain("Fee-free exit");
    expect(summary.swap.routes[1].description).toBe("Uniswap_V3");
    expect(summary.swap.routes[0].usdOut?.toHuman()).toBe("60");
    // Total input is 100 and total output is 90, not first-leg input versus last-leg output.
    expect(summary.totalSlippage).toBe(10);
    expect(summary.swap.totalSlippage).toBe(10);
    expect(summary.valueBreakdown?.input?.toHuman()).toBe("100");
    expect(summary.valueBreakdown?.afterExit?.toHuman()).toBe("95");
    expect(summary.valueBreakdown?.output?.toHuman()).toBe("90");
  });
  it("does not manufacture zero dollar values or zero slippage when prices are unavailable", () => {
    const summary = redemptionRouteSummary(route, pinto, usdc, tokens, new Map())!;
    expect(summary.swap.routes).toHaveLength(3);
    expect(summary.swap.routes.every((row) => row.usdOut === undefined)).toBe(true);
    expect(summary.totalSlippage).toBeUndefined();
    expect(summary.valueBreakdown?.afterExit).toBeUndefined();
  });
  it("shows an LP-to-Pinto redemption without inventing a 0x swap", () => {
    const lp: Token = { ...metadata, address: "0x04", symbol: "PINTOUSDC", decimals: 18 };
    const direct = {
      expected: 2_000000n,
      legs: [{ selection: { amount: 10n ** 18n }, output: 2_000000n, snapshot: { outputToken: pinto.address } }],
    } as unknown as RedemptionRoute;
    const summary = redemptionRouteSummary(direct, lp, pinto, tokens, prices)!;
    expect(summary.swap.routes).toHaveLength(1);
    expect(summary.swap.routes[0].amountIn.toHuman()).toBe("1");
    expect(summary.swap.routes[0].amountOut.toHuman()).toBe("2");
    expect(summary.swap.exchanges).toEqual(["pinto-exchange"]);
    expect(summary.totalSlippage).toBeUndefined();
  });
});
