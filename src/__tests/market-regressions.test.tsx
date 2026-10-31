import { TokenValue } from "@/classes/TokenValue";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  marketplace: "0",
  beanstalk: false,
  repaymentIndex: 900_000_000n as bigint | undefined,
  queries: [] as any[],
  reads: [] as any[],
  clicks: [] as (() => void)[],
  navigate: vi.fn(),
  profit: undefined as any,
}));
vi.mock("wagmi", () => ({
  useChainId: () => 8453,
  useConfig: () => ({ chains: [] }),
  useReadContract: (options: any) => {
    state.reads.push(options);
    return { data: state.repaymentIndex };
  },
}));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({
  useProtocolAddress: () => "0x0000000000000000000000000000000000000001",
}));
vi.mock("@/state/useFieldData", () => ({ useHarvestableIndex: () => TokenValue.fromHuman(100, 6) }));
vi.mock("@/context/BeanstalkMarketContext", () => ({
  useBeanstalkMarket: () => ({
    isBeanstalkMarketplace: state.beanstalk,
    fieldId: state.beanstalk ? 1n : 0n,
    podMarketplaceId: state.marketplace,
  }),
}));
vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => {
    state.queries.push(options);
    return {
      data:
        options.queryKey[0] === "allPodListings"
          ? {
              podListings: [
                {
                  id: "listing-1",
                  createdAt: "0",
                  originalAmount: "10000000",
                  remainingAmount: "10000000",
                  amount: "10000000",
                  index: "1000000000",
                  pricePerPod: "1000000",
                  minFillAmount: "1000000",
                  maxHarvestableIndex: "2000000000",
                },
              ],
            }
          : {
              podOrders: [
                {
                  id: "order-1",
                  createdAt: "0",
                  beanAmount: "10000000",
                  beanAmountFilled: "0",
                  pricePerPod: "1000000",
                  maxPlaceInLine: "1000000000",
                },
              ],
            },
      isFetching: false,
    };
  },
}));
vi.mock("graphql-request", () => ({ default: async (_url: string, _doc: unknown, variables: unknown) => variables }));
vi.mock("react-router-dom", () => ({ useNavigate: () => state.navigate, useParams: () => ({}) }));
vi.mock("@/state/useTokenData", () => ({ default: () => ({ mainToken: { decimals: 6 }, nativeToken: {} }) }));
vi.mock("@/components/ui/Table", () => {
  const node = ({ children }: any) => createElement("div", null, children);
  return {
    Table: node,
    TableBody: node,
    TableCell: node,
    TableHead: node,
    TableHeader: node,
    TableRow: ({ onClick, children }: any) => {
      if (onClick) state.clicks.push(onClick);
      return createElement("div", null, children);
    },
  };
});
vi.mock("@/components/MarketPaginationControls", () => ({ MarketPaginationControls: () => null }));
vi.mock("@/components/LoadingSpinner", () => ({ default: () => null }));
vi.mock("@/components/ui/IconImage", () => ({ default: () => null }));
vi.mock("@/state/usePriceData", () => ({ usePriceData: () => ({ tokenPrices: new Map() }) }));
vi.mock("@/state/tractor/useTractorAutomateClaimOrders", () => ({
  useTractorAutomateClaimOrderbook: () => ({ data: [] }),
}));
vi.mock("@/lib/Tractor/claimOrder", () => ({
  getEnabledClaimOpLabels: vi.fn(),
  getEnabledClaimOps: vi.fn(),
  transformAutomateClaimRequisitionEvent: vi.fn(),
}));
vi.mock("@/components/Tractor/ExecuteOrdersTab", () => ({
  ExecuteOrdersTab: (props: any) => {
    state.profit = props.calculateProfit;
    return null;
  },
}));

import { AutomateClaimExecute } from "@/components/Tractor/AutomateClaim/AutomateClaimExecute";
import { PodListingsTable } from "@/pages/market/PodListingsTable";
import { PodOrdersTable } from "@/pages/market/PodOrdersTable";
import usePodListings from "@/state/market/usePodListings";
import usePodOrders from "@/state/market/usePodOrders";

function renderHook<T>(hook: () => T): T {
  let value: T | undefined;
  function Probe() {
    value = hook();
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  if (value === undefined) throw new Error("Hook did not return a value");
  return value;
}

beforeEach(() => {
  state.marketplace = "0";
  state.beanstalk = false;
  state.repaymentIndex = 900_000_000n;
  state.queries = [];
  state.reads = [];
  state.clicks = [];
  state.navigate.mockClear();
});

describe("market query isolation", () => {
  it("defaults listing and order requests to marketplace 0", async () => {
    renderHook(() => usePodListings());
    renderHook(() => usePodOrders());
    for (const query of state.queries) expect(await query.queryFn()).toMatchObject({ podMarketplace: "0" });
  });
  it("uses the selected field index for listing expiration and its cache key", async () => {
    renderHook(() => usePodListings("1"));
    const query = state.queries[0];
    expect(await query.queryFn()).toMatchObject({ maxHarvestableIndex: "900000000", podMarketplace: "1" });
    expect(query.queryKey).toContainEqual({ chainId: 8453, variables: ["900"] });
    expect(state.reads[0]).toMatchObject({ functionName: "getHarvestableIndex", args: [1n], query: { enabled: true } });
  });
  it("waits for field1 data without falling back to field0", () => {
    state.repaymentIndex = undefined;
    renderHook(() => usePodListings("1"));
    expect(state.queries[0].enabled).toBe(false);
  });
  it("permits a loaded zero harvestable index", () => {
    state.repaymentIndex = 0n;
    renderHook(() => usePodListings("1"));
    expect(state.queries[0].enabled).toBe(true);
  });
});

for (const [name, Component, parameter, id] of [
  ["listing", PodListingsTable, "listingId", "listing-1"],
  ["order", PodOrdersTable, "orderId", "order-1"],
] as const) {
  it.each([false, true])(`preserves market selection when opening a ${name} (beanstalk=%s)`, (beanstalk) => {
    state.beanstalk = beanstalk;
    state.marketplace = beanstalk ? "1" : "0";
    renderToStaticMarkup(createElement(Component));
    state.clicks[0]();
    const url = new URL(state.navigate.mock.calls[0][0], "https://example.test");
    expect(url.searchParams.get(parameter)).toBe(id);
    expect(url.searchParams.get("beanstalk")).toBe(beanstalk ? "true" : null);
  });
}

it("subtracts 30 cents gas from a one dollar operator tip", () => {
  renderToStaticMarkup(createElement(AutomateClaimExecute));
  const mainToken = {} as any;
  const nativeToken = {} as any;
  const prices = new Map([
    [mainToken, { instant: TokenValue.fromHuman(1, 6) }],
    [nativeToken, { instant: TokenValue.fromHuman(3000, 6) }],
  ]);
  expect(
    state.profit(
      { decodedData: { opParams: { baseOpParams: { operatorTipAmount: 1_000_000n } } } },
      100_000n,
      1_000_000_000n,
      mainToken,
      nativeToken,
      prices,
    ),
  ).toBeCloseTo(0.7);
});
