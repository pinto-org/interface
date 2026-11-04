// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { hashFn } from "@wagmi/core/query";
import { TV } from "@/classes/TokenValue";
import { useTractorSowOrderbook } from "@/state/tractor/useTractorSowOrders";

const fixture = vi.hoisted(() => ({ queries: [] as any[], load: vi.fn(), block: vi.fn() }));
vi.mock("wagmi", () => ({
  useChainId: () => 1337,
  usePublicClient: () => ({ getBlock: fixture.block }),
}));
vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => {
    fixture.queries.push(options);
    return {};
  },
}));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({
  useProtocolAddress: () => "0x0000000000000000000000000000000000000001",
}));
vi.mock("@/state/useFieldData", () => ({ useTemperature: () => ({ max: TV.ONE }) }));
vi.mock("@/state/useSunData", () => ({ useSeason: () => 100 }));
vi.mock("@/lib/Tractor", () => ({ loadOrderbookData: (...args: unknown[]) => fixture.load(...args) }));

let root: Root, container: HTMLDivElement;
function Harness({ forecast }: { forecast: boolean }) {
  useTractorSowOrderbook({ chainOnly: true, includeSoilForecast: forecast });
  return null;
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.queries = [];
  fixture.load.mockReset().mockResolvedValue([]);
  fixture.block.mockReset().mockResolvedValue({ number: 1_000_000n, timestamp: 1_000_000n });
  container = document.createElement("div");
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

test("history-only and forecast queries have separate cache keys and forward their option to the loader", async () => {
  act(() => root.render(<Harness forecast={false} />));
  const historyQuery = fixture.queries.at(-1);
  await historyQuery.queryFn();
  expect(fixture.load.mock.calls[0][7]).toMatchObject({ includeSoilForecast: false, currentSeason: 100 });
  act(() => root.render(<Harness forecast />));
  const forecastQuery = fixture.queries.at(-1);
  await forecastQuery.queryFn();
  expect(fixture.load.mock.calls[1][7]).toMatchObject({ includeSoilForecast: true, currentSeason: 100 });
  expect(hashFn(historyQuery.queryKey)).not.toBe(hashFn(forecastQuery.queryKey));
});
