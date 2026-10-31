import type { RedemptionSnapshot } from "@/utils/siloRedemption";
import { type Address, type Client, encodeFunctionData, parseAbi } from "viem";
import { beforeEach, expect, it, vi } from "vitest";
import { ALLOWANCE_HOLDER, quoteRoute, readRoutePools, revalidateRoute } from "./route";
const mocks = vi.hoisted(() => ({ snapshot: vi.fn(), quote: vi.fn(), read: vi.fn(), block: vi.fn() }));
vi.mock("@/utils/siloRedemption", async (original) => ({
  ...(await original<object>()),
  readRedemptionSnapshot: mocks.snapshot,
  quoteRedemption: mocks.quote,
}));
vi.mock("viem/actions", () => ({ readContract: mocks.read, getBlock: mocks.block }));
vi.mock("@/constants/endpoints", () => ({ API_SERVICES: { router: "https://quote.example" } }));
const a = (n: number) => `0x${n.toString(16).padStart(40, "0")}` as Address;
const client = {} as Client;
const snapshot = (well = a(5), output = a(3)): RedemptionSnapshot => ({
  account: a(1),
  diamond: a(2),
  well,
  pinto: a(6),
  kind: "pinto",
  blockNumber: 100n,
  timestamp: 1000n,
  supported: true,
  enabled: true,
  threshold: 5n,
  referenceWell: a(5),
  outputToken: output,
  deposits: [{ stem: -1n, amount: 1000n, bdv: 1000n, available: 1000n, eligible: true }],
});
const pools = () => [
  { snapshot: snapshot(), weight: 1n },
  { snapshot: snapshot(a(7), a(4)), weight: 1n },
];
beforeEach(() => {
  vi.restoreAllMocks();
  mocks.snapshot
    .mockReset()
    .mockImplementation(async (_client, req) => snapshot(req.well, req.well === a(7) ? a(4) : a(3)));
  mocks.quote.mockReset().mockResolvedValue(1000n);
  mocks.read.mockReset().mockResolvedValue([100n, 200n]);
  mocks.block.mockReset().mockResolvedValue({ number: 100n });
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        liquidityAvailable: true,
        sellToken: a(3),
        buyToken: a(4),
        sellAmount: "1000",
        buyAmount: "2000",
        minBuyAmount: "1995",
        allowanceTarget: ALLOWANCE_HOLDER,
        issues: { invalidSourcesPassed: [], allowance: null },
        transaction: {
          to: ALLOWANCE_HOLDER,
          value: "0",
          data: encodeFunctionData({
            abi: parseAbi([
              "function exec(address operator,address token,uint256 amount,address target,bytes data) returns(bytes)",
            ]),
            functionName: "exec",
            args: [a(9), a(3), 1000n, a(9), "0x12345678"],
          }),
        },
      }),
    })),
  );
});
it("pins every pool and reserve read to one block", async () => {
  await readRoutePools(client, { account: a(1), diamond: a(2), pinto: a(6), wells: [a(5), a(7)], kind: "pinto" });
  expect(mocks.snapshot.mock.calls.every((c) => c[2] === 100n)).toBe(true);
  expect(mocks.read.mock.calls.every((c) => c[1].blockNumber === 100n)).toBe(true);
});
it("quotes each allocation once, bypasses direct USDC, and uses the wallet txOrigin", async () => {
  const route = await quoteRoute(client, pools(), 100n, a(4), 1337, 50);
  expect(route.legs.map((l) => l.selection.amount)).toEqual([50n, 50n]);
  expect(route.expected).toBe(3000n);
  expect(route.minimum).toBe(2992n);
  expect(fetch).toHaveBeenCalledOnce();
  const url = new URL(vi.mocked(fetch).mock.calls[0][0] as string);
  expect(url.searchParams.get("txOrigin")).toBe(a(1));
  expect(url.searchParams.get("sellEntireBalance")).toBe("true");
  expect(url.searchParams.get("excludedSources")).toBe("Pinto");
  expect(url.searchParams.get("chainId")).toBe("8453");
});
it("fails the entire plan when a downstream quote fails", async () => {
  vi.mocked(fetch).mockResolvedValue({ ok: false, status: 429 } as Response);
  await expect(quoteRoute(client, pools(), 100n, a(4), 8453, 50)).rejects.toThrow(/rate limit/);
});
it("rejects inconsistent eligibility and mixed-block snapshots", async () => {
  const changed = pools();
  changed[1].snapshot.blockNumber++;
  await expect(quoteRoute(client, changed, 100n, a(4), 8453, 50)).rejects.toThrow(/eligibility/);
  changed[1].snapshot.blockNumber--;
  changed[1].snapshot.deposits[0].eligible = false;
  await expect(quoteRoute(client, changed, 100n, a(4), 8453, 50)).rejects.toThrow();
});
it("checks total consumption of a shared deposit, not just individual pool shares", async () => {
  const route = await quoteRoute(client, pools(), 100n, a(4), 8453, 50);
  mocks.snapshot.mockImplementation(async (_client, req) => {
    const s = snapshot(req.well, req.well === a(7) ? a(4) : a(3));
    s.deposits[0].available = 75n;
    return s;
  });
  await expect(revalidateRoute(client, route)).rejects.toThrow(/deposits changed/);
});
it.each(["output", "disabled", "deadline", "minimum"])("revalidation rejects changed %s", async (change) => {
  const route = await quoteRoute(client, pools(), 100n, a(4), 8453, 50);
  mocks.snapshot.mockImplementation(async (_client, req) => {
    const s = snapshot(req.well, req.well === a(7) ? a(4) : a(3));
    if (change === "output") s.outputToken = a(8);
    if (change === "disabled") s.enabled = false;
    if (change === "deadline") s.timestamp = 1120n;
    return s;
  });
  if (change === "minimum") mocks.quote.mockResolvedValue(1n);
  await expect(revalidateRoute(client, route)).rejects.toThrow();
});
it("withdraws LP directly as Pinto and revalidates the same redemption kind", async () => {
  const lp = { ...snapshot(a(5), a(6)), kind: "lp" as const };
  mocks.snapshot.mockImplementation(async (_client, req) => ({ ...lp, kind: req.kind }));
  const route = await quoteRoute(client, [{ snapshot: lp, weight: 1n }], 100n, a(6), 1337, 50);
  expect(route.legs[0].swap).toBeUndefined();
  expect(route.expected).toBe(1000n);
  expect(fetch).not.toHaveBeenCalled();
  await revalidateRoute(client, route);
  expect(mocks.snapshot.mock.calls.at(-1)?.[1].kind).toBe("lp");
});
it("still rejects routing Pinto back into Pinto", async () => {
  await expect(quoteRoute(client, pools(), 100n, a(6), 1337, 50)).rejects.toThrow("non-Pinto");
});
