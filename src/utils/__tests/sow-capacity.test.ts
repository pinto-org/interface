import { describe, expect, test, vi } from "vitest";
import {
  checkSowFunding,
  defaultSowAmounts,
  maxSowFundedAmount,
  parseSowPinto,
  quoteSowCapacity,
  SOW_FORM_MAX_GROWN_STALK,
  sowFundingRequired,
} from "@/lib/Tractor/sowOrder/sowCapacity";
import { maxUint256, type Address, type PublicClient } from "viem";

const pinto = "0x0000000000000000000000000000000000000001" as Address;
const lp = "0x0000000000000000000000000000000000000002" as Address;
const other = "0x0000000000000000000000000000000000000003" as Address;
const context = {
  account: other,
  diamond: other,
  pinto,
  siloHelpers: other,
  tractorHelpers: other,
  strategy: { type: "SPECIFIC_TOKEN" as const, addresses: [lp] },
};
function mockClient(
  amounts = new Map([
    [pinto, 2_000_000n],
    [lp, 18_000_000_000_000_000n],
  ]),
) {
  const readContract = vi.fn(async (request: any): Promise<any> => {
    expect(request.blockNumber).toBe(123n);
    if (request.functionName === "getWhitelistStatusAddresses") return [pinto, lp];
    if (request.functionName.startsWith("getTokensAscending"))
      return [
        [0, 1],
        [1n, 2n],
      ];
    if (request.functionName === "stemTipForToken") return 28_480_204_044n;
    if (request.functionName === "getDepositStemsAndAmountsToWithdraw") {
      expect(request.args[2]).toBe(maxUint256);
      expect(request.args[3]).toBe(28_480_204_044n - SOW_FORM_MAX_GROWN_STALK);
      return [[], [], amounts.get(request.args[1]) ?? 0n];
    }
    if (request.functionName === "getRemoveLiquidityOneTokenOut") {
      expect(request.address).toBe(lp);
      expect(request.args).toEqual([18_000_000_000_000_000n, pinto]);
      return 9_969_837n; // Fee-paying Well output, NOT the LP's ~$0.35 USD value.
    }
    throw new Error(`Unexpected ${request.functionName}`);
  });
  return { client: { getBlockNumber: async () => 123n, readContract } as unknown as PublicClient, readContract };
}

test("regression: 1 Pinto is fundable from LP quoting 9.969837 Pinto despite a sub-dollar USD value", async () => {
  const { client } = mockClient();
  const quote = await quoteSowCapacity(client, context);
  expect(quote.pintos).toBe(9_969_837n);
  expect(checkSowFunding(quote.pintos, "1", "1", "0.2")).toBe(true);
  expect(checkSowFunding(quote.pintos, "10", "10", "0.2")).toBe(false);
});

test("only selected deposits count: wallet balances and other token inventory cannot fund a specific source", async () => {
  const { client, readContract } = mockClient();
  expect((await quoteSowCapacity(client, context)).sources.map((x) => x.token)).toEqual([lp]);
  expect(readContract.mock.calls.some(([r]) => /balanceOf|getInternalBalance/.test(r.functionName))).toBe(false);
});

test("Pinto uses helper-provided unlocked inventory without pricing it in USD or invoking a Well", async () => {
  const { client, readContract } = mockClient(
    new Map([
      [pinto, 700_000n],
      [lp, 0n],
    ]),
  );
  const quote = await quoteSowCapacity(client, {
    ...context,
    strategy: { type: "SPECIFIC_TOKEN", addresses: [pinto] },
  });
  expect(quote.pintos).toBe(700_000n);
  expect(checkSowFunding(quote.pintos, "0.5", "0.5", "0.2")).toBe(true);
  expect(checkSowFunding(quote.pintos, "0.500001", "0.500001", "0.2")).toBe(false);
  expect(readContract.mock.calls.some(([r]) => r.functionName === "getRemoveLiquidityOneTokenOut")).toBe(false);
});

test.each(["LOWEST_PRICE", "LOWEST_SEEDS"] as const)(
  "%s sums the actual strategy's available sources in Pinto",
  async (type) => {
    const { client } = mockClient();
    expect((await quoteSowCapacity(client, { ...context, strategy: { type } })).pintos).toBe(11_969_837n);
  },
);

test("no deposits is zero, not unlimited capacity; no LP quote is needed for zero LP", async () => {
  const { client, readContract } = mockClient(new Map());
  expect((await quoteSowCapacity(client, context)).pintos).toBe(0n);
  expect(checkSowFunding(0n, "1", "1", "0.2")).toBe(false);
  expect(readContract.mock.calls.some(([r]) => r.functionName === "getRemoveLiquidityOneTokenOut")).toBe(false);
});

test("failed inventory or fee quote reads reject the entire result, never a partial sum", async () => {
  const { client, readContract } = mockClient();
  const original = readContract.getMockImplementation()!;
  readContract.mockImplementation(async (r) => {
    if (r.functionName === "getRemoveLiquidityOneTokenOut") throw new Error("unavailable");
    return original(r);
  });
  await expect(quoteSowCapacity(client, { ...context, strategy: { type: "LOWEST_SEEDS" } })).rejects.toThrow(
    "unavailable",
  );
  readContract.mockRejectedValue(new Error("RPC failed"));
  await expect(quoteSowCapacity(client, context)).rejects.toThrow("RPC failed");
});

test("invalid and unsupported source choices fail closed", async () => {
  const { client } = mockClient();
  for (const strategy of [
    { type: "SPECIFIC_TOKEN" as const, addresses: [] },
    { type: "SPECIFIC_TOKEN" as const, addresses: [other] },
    { type: "MULTI_TOKENS" as const, addresses: [pinto, lp] },
  ])
    await expect(quoteSowCapacity(client, { ...context, strategy })).rejects.toThrow();
});

describe("funding boundaries", () => {
  test("both forms' default amounts retain token precision at fractional slider endpoints", () => {
    const defaults = defaultSowAmounts("9.961");
    expect(defaults).toEqual({ minimum: "9.961", maximum: "9.961" });
    expect(checkSowFunding(10_161_000n, "9.961", defaults!.minimum, "0.2")).toBe(true);
    expect(defaultSowAmounts("0.000001")).toEqual({ minimum: "0.000001", maximum: "0.000001" });
    expect(defaultSowAmounts("100.000001")).toEqual({ minimum: "25", maximum: "100.000001" });
  });
  test("leading decimal amounts and tips match accepted form notation", () => {
    expect(parseSowPinto(".5")).toBe(500_000n);
    expect(checkSowFunding(700_000n, ".5", ".5", ".2")).toBe(true);
    expect(defaultSowAmounts(".5")).toEqual({ minimum: "0.5", maximum: "0.5" });
    expect(parseSowPinto(".0000001")).toBeUndefined();
  });
  test("slider maximum reserves every fill tip, including partial last fills", () => {
    expect(maxSowFundedAmount(100_000_000n, 25_000_000n, 1_000_000n)).toBe(96_000_000n);
    expect(maxSowFundedAmount(700_000n, 25_000_000n, 1_000_000n)).toBe(0n);
    expect(maxSowFundedAmount(700_000n, 25_000_000n, 200_000n)).toBe(500_000n);
    for (let capacity = 0n; capacity < 200n; capacity++) {
      for (const tip of [0n, 1n, 7n, 100n]) {
        const max = maxSowFundedAmount(capacity, 25n, tip);
        if (max > 0n) expect(sowFundingRequired(max, 25n, tip)).toBeLessThanOrEqual(capacity);
        expect(sowFundingRequired(max + 1n, 25n, tip)).toBeGreaterThan(capacity);
      }
    }
  });
  test("reserves tips for minimum-sized fills and rounds the fill count upward", () => {
    expect(sowFundingRequired(1_000_000n, 400_000n, 200_000n)).toBe(1_600_000n);
    expect(checkSowFunding(1_599_999n, "1", "0.4", "0.2")).toBe(false);
    expect(checkSowFunding(1_600_000n, "1", "0.4", "0.2")).toBe(true);
  });
  test("integer comparisons stay exact above JavaScript's safe integer range", () => {
    expect(checkSowFunding(9_007_199_254_740_993n, "9007199254.740992", "9007199254.740992", "0.000001")).toBe(true);
    expect(checkSowFunding(9_007_199_254_740_992n, "9007199254.740992", "9007199254.740992", "0.000001")).toBe(false);
  });
  test("empty, negative and overprecision inputs are not funding approval", () => {
    expect(parseSowPinto("1,234.567890")).toBe(1_234_567_890n);
    for (const value of ["", "-1", "NaN", "1.0000001", "1e6"]) expect(parseSowPinto(value)).toBeUndefined();
    expect(checkSowFunding(100n, "", "1", "0")).toBe(false);
    expect(checkSowFunding(100n, "1", "0", "0")).toBe(false);
  });
});
