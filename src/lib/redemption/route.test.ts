import { Clipboard } from "@/classes/Clipboard";
import { autoConvertABI } from "@/constants/abi/autoConvertABI";
import { PIPELINE_ADDRESS } from "@/constants/address";
import { type Address, decodeFunctionData, encodeFunctionData, parseAbi } from "viem";
import { describe, expect, it, vi } from "vitest";
import {
  ALLOWANCE_HOLDER,
  type RedemptionRoute,
  assertRouteFresh,
  buildRoute,
  partitionSelection,
  quoteRoute,
  routeABI,
  splitByReserves,
  validateRoutedSwap,
} from "./route";

const a = (n: number) => `0x${n.toString(16).padStart(40, "0")}` as Address;
const holderABI = parseAbi([
  "function exec(address operator,address token,uint256 amount,address target,bytes data) payable returns(bytes)",
]);
function rawQuote() {
  return {
    liquidityAvailable: true,
    sellToken: a(3),
    buyToken: a(4),
    sellAmount: "1000",
    buyAmount: "2000",
    minBuyAmount: "1990",
    allowanceTarget: ALLOWANCE_HOLDER,
    issues: { allowance: { spender: ALLOWANCE_HOLDER }, invalidSourcesPassed: [], simulationIncomplete: true },
    transaction: {
      to: ALLOWANCE_HOLDER,
      value: "0",
      data: encodeFunctionData({ abi: holderABI, functionName: "exec", args: [a(9), a(3), 1000n, a(9), "0x12345678"] }),
    },
    route: { fills: [{ source: "Uniswap_V3" }] },
  };
}
function routeFixture(): RedemptionRoute {
  return {
    chainId: 8453,
    account: a(1),
    diamond: a(2),
    buyToken: a(4),
    fetchedAt: Date.now(),
    deadline: 1000n,
    expected: 2100n,
    minimum: 2089n,
    legs: [
      {
        snapshot: {
          account: a(1),
          diamond: a(2),
          well: a(5),
          pinto: a(6),
          kind: "pinto",
          blockNumber: 100n,
          timestamp: 880n,
          supported: true,
          enabled: true,
          threshold: 10n,
          referenceWell: a(5),
          outputToken: a(3),
          deposits: [],
        },
        selection: { stems: [-2n], amounts: [100n], amount: 100n },
        output: 1000n,
        minimum: 995n,
        swap: validateRoutedSwap(rawQuote(), a(3), a(4), 1000n, 50),
      },
      {
        snapshot: {
          account: a(1),
          diamond: a(2),
          well: a(7),
          pinto: a(6),
          kind: "pinto",
          blockNumber: 100n,
          timestamp: 880n,
          supported: true,
          enabled: true,
          threshold: 10n,
          referenceWell: a(5),
          outputToken: a(4),
          deposits: [],
        },
        selection: { stems: [-2n, -1n], amounts: [50n, 50n], amount: 100n },
        output: 100n,
        minimum: 99n,
      },
    ],
  };
}
describe("reserve allocation and crates", () => {
  it("conserves integer amounts across unequal pools, including the remainder", () => {
    expect(splitByReserves(101n, [1n, 2n, 3n])).toEqual([16n, 33n, 52n]);
    for (let n = 6n; n < 1000n; n += 7n) expect(splitByReserves(n, [1n, 2n, 3n]).reduce((a, b) => a + b, 0n)).toBe(n);
  });
  it("rejects dust and missing liquidity instead of dropping a pool", () => {
    expect(() => splitByReserves(1n, [1n, 2n])).toThrow();
    expect(() => splitByReserves(100n, [0n, 2n])).toThrow();
  });
  it("partitions partial deposits without double spending or rounding loss", () => {
    expect(partitionSelection({ stems: [-3n, -2n], amounts: [60n, 41n], amount: 101n }, [16n, 33n, 52n])).toEqual([
      { stems: [-3n], amounts: [16n], amount: 16n },
      { stems: [-3n], amounts: [33n], amount: 33n },
      { stems: [-3n, -2n], amounts: [11n, 41n], amount: 52n },
    ]);
    expect(() => partitionSelection({ stems: [1n], amounts: [10n], amount: 10n }, [11n])).toThrow();
  });
});
describe("0x validation", () => {
  it("preserves intermediate hops and split shares for display without changing execution calldata", () => {
    const q = rawQuote();
    const withHops = {
      ...q,
      route: {
        fills: [
          { from: a(3), to: a(7), source: "Uniswap_V3", proportionBps: "6000" },
          { from: a(3), to: a(7), source: "Aerodrome", proportionBps: "4000" },
          { from: a(7), to: a(4), source: "Uniswap_V3", proportionBps: "10000" },
        ],
        tokens: [{ address: a(7), symbol: "WETH" }],
      },
    };
    const parsed = validateRoutedSwap(withHops, a(3), a(4), 1000n, 50);
    expect(parsed.fills).toHaveLength(3);
    expect(parsed.fills?.map((fill) => fill.proportionBps)).toEqual([6000, 4000, 10000]);
    expect(parsed.fills?.[0].toSymbol).toBe("WETH");
    expect(parsed.data).toBe(q.transaction.data);
    expect(parsed.sources).toEqual(["Uniswap_V3", "Aerodrome"]);
  });
  it("accepts a Pipeline quote with expected insufficient-balance simulation issues", () => {
    expect(validateRoutedSwap(rawQuote(), a(3), a(4), 1000n, 50).minimum).toBe(1990n);
  });
  it.each([
    "liquidity",
    "sellToken",
    "buyToken",
    "sellAmount",
    "minimum",
    "target",
    "spender",
    "value",
    "calldata",
    "sources",
  ])("rejects an unsafe %s", (field) => {
    const q = rawQuote();
    if (field === "liquidity") q.liquidityAvailable = false;
    if (field === "sellToken") q.sellToken = a(8);
    if (field === "buyToken") q.buyToken = a(8);
    if (field === "sellAmount") q.sellAmount = "1001";
    if (field === "minimum") q.minBuyAmount = "1989";
    if (field === "target") q.transaction.to = a(8);
    if (field === "spender") q.issues.allowance.spender = a(8);
    if (field === "value") q.transaction.value = "1";
    if (field === "calldata") q.transaction.data = "0x1234";
    if (field === "sources") q.issues.invalidSourcesPassed = ["invalid"] as never[];
    expect(() => validateRoutedSwap(q, a(3), a(4), 1000n, 50)).toThrow();
  });
  it("rejects calldata selling another token or amount", () => {
    const q = rawQuote();
    q.transaction.data = encodeFunctionData({
      abi: holderABI,
      functionName: "exec",
      args: [a(9), a(8), 1000n, a(9), "0x12345678"],
    });
    expect(() => validateRoutedSwap(q, a(3), a(4), 1000n, 50)).toThrow();
  });
});
describe("atomic withdrawal encoding", () => {
  it("withdraws into internal balance and transfers precisely the returned amount to Pipeline", () => {
    const route = routeFixture(),
      calls = buildRoute(route);
    const withdrawal = decodeFunctionData({ abi: autoConvertABI, data: calls[1].callData });
    expect(withdrawal.functionName).toBe("swapPintoDeposits");
    expect(withdrawal.args).toEqual([a(5), [-2n], [100n], 995n, 1000n, 1]);
    expect(decodeFunctionData({ abi: routeABI, data: calls[2].callData }).args).toEqual([
      a(3),
      PIPELINE_ADDRESS,
      0n,
      1,
      0,
    ]);
    expect(calls[2].clipboard).toBe(Clipboard.encodeSlot(1, 0, 2));
    expect(calls[5].clipboard).toBe(Clipboard.encodeSlot(4, 0, 2));
  });
  it("bypasses 0x for direct output, clears allowances and checks final output plus zero residual input", () => {
    const calls = buildRoute(routeFixture());
    expect(calls).toHaveLength(7);
    const execution = decodeFunctionData({ abi: routeABI, data: calls[3].callData });
    if (execution.functionName !== "advancedPipe") throw new Error("wrong encoding");
    expect(execution.args[0][2].target).toBe(ALLOWANCE_HOLDER);
    const erc = parseAbi(["function approve(address,uint256)"]);
    expect(decodeFunctionData({ abi: erc, data: execution.args[0][3].callData }).args).toEqual([ALLOWANCE_HOLDER, 0n]);
    expect(execution.args[0][5].clipboard).toBe(Clipboard.encodeSlot(4, 0, 1));
    const settlement = decodeFunctionData({ abi: routeABI, data: calls[6].callData });
    if (settlement.functionName !== "advancedPipe") throw new Error("wrong encoding");
    expect(decodeFunctionData({ abi: routeABI, data: settlement.args[0][1].callData }).args).toEqual([0n, 2089n]);
    expect(settlement.args[0][1].clipboard).toBe(Clipboard.encodeSlot(0, 0, 0));
  });
  it("rejects expired quotes at build time even if the button timer is delayed", () => {
    const route = routeFixture();
    route.fetchedAt -= 60_000;
    expect(() => buildRoute(route)).toThrow(/expired/);
    expect(() => assertRouteFresh(routeFixture(), Date.now() - 1000)).toThrow(/expired/);
  });
  it("supports LP paired-token withdrawals through the same pipeline", () => {
    const route = routeFixture();
    route.legs[0].snapshot.kind = "lp-paired";
    expect(decodeFunctionData({ abi: autoConvertABI, data: buildRoute(route)[1].callData }).functionName).toBe(
      "redeemDepositsToPairedToken",
    );
  });
});
