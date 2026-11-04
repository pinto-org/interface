// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TV } from "@/classes/TokenValue";
import useMyPodListings from "@/state/market/useMyPodListings";
import useMyPodOrders from "@/state/market/useMyPodOrders";
const fixture = vi.hoisted(() => ({ queries: [] as any[], request: vi.fn() }));
vi.mock("wagmi", () => ({ useChainId: () => 1337 }));
vi.mock("@/constants/subgraph", () => ({ subgraphs: { 1337: { beanstalk: "https://example.invalid" } } }));
vi.mock("@/state/useFieldData", () => ({ useHarvestableIndex: () => TV.ONE }));
vi.mock("@tanstack/react-query", () => ({ useQuery: (query: any) => { fixture.queries.push(query); return {}; } }));
vi.mock("graphql-request", () => ({ default: (...args: unknown[]) => fixture.request(...args) }));
let root: Root, container: HTMLDivElement;
function Harness({ account }: { account?: string }) { useMyPodListings({ account }); useMyPodOrders({ account }); return null; }
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.queries = []; fixture.request.mockReset().mockResolvedValue({});
  container = document.createElement("div"); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
test("disconnected queries are disabled and cannot send undefined owners on a manual refetch", async () => {
  act(() => root.render(<Harness />));
  for (const query of fixture.queries) {
    expect(query.enabled).toBe(false);
    await expect(query.queryFn()).rejects.toThrow("account is required");
  }
  expect(fixture.request).not.toHaveBeenCalled();
});
test("connected market queries use the normalized definite owner", async () => {
  act(() => root.render(<Harness account="0xAbCd" />));
  for (const query of fixture.queries) { expect(query.enabled).toBe(true); await query.queryFn(); }
  expect(fixture.request).toHaveBeenCalledTimes(2);
  for (const call of fixture.request.mock.calls) expect(call[2].account).toBe("0xabcd");
});
