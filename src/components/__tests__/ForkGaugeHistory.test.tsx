// @vitest-environment jsdom
import { expect, test, vi, afterEach } from "vitest";
import { TV } from "@/classes/TokenValue";
import useForkGaugeHistory from "../../../scripts/qa/useForkGaugeHistory";
const state = vi.hoisted(() => ({ chainId: 1337, options: undefined as any }));
vi.mock("wagmi", () => ({ useChainId: () => state.chainId }));
vi.mock("@tanstack/react-query", () => ({ useQuery: (options: any) => {
  state.options = options;
  return { isError: false, isLoading: false };
} }));
afterEach(() => { state.chainId = 1337; vi.unstubAllGlobals(); });
const configure = (from = 100, to = 102) => useForkGaugeHistory(from, to, (row, timestamp) => ({
  season: row.season, timestamp, value: TV.fromBlockchain(row.g2BonusStalkPerBdv, 10).toNumber(),
}));
test("filters only observed Seasons, preserves exact block time and correct Stalk units", () => {
  configure(101, 102);
  const data = state.options.select({ source: "local-fork-observations", rows: [
    { season: 100, createdAt: "1000", g2BonusStalkPerBdv: "1000000000" },
    { season: 102, createdAt: "8200", g2BonusStalkPerBdv: "1921539874" },
  ] });
  expect(data).toEqual([{ season: 102, timestamp: new Date(8200_000), value: 0.1921539874 }]);
});
test("fork hook refuses nonlocal chain and cannot fall through to live subgraph", () => {
  state.chainId = 8453;
  expect(configure().isError).toBe(true);
  expect(state.options.enabled).toBe(false);
});
test("endpoint errors become query errors; requests have a bounded deadline", async () => {
  const fetcher = vi.fn(async (..._args: any[]) => ({ ok: false }));
  vi.stubGlobal("fetch", fetcher);
  configure();
  await expect(state.options.queryFn({ signal: new AbortController().signal })).rejects.toThrow("unavailable");
  expect(fetcher.mock.calls[0][0]).toBe("/__qa/gauge-history");
  expect(fetcher.mock.calls[0][1].signal).toBeDefined();
});
test("rejects a response from a different source", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ source: "production", rows: [] }) })));
  configure();
  await expect(state.options.queryFn({ signal: new AbortController().signal })).rejects.toThrow("Invalid fork history");
});
