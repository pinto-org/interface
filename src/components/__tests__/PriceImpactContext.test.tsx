// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TV } from "@/classes/TokenValue";
import usePriceImpactSummary, { calculatePriceImpact, useDeterminePriceImpact, PRICE_IMPACT_PREDICATE } from "@/hooks/wells/usePriceImpactSummary";

const fixture = vi.hoisted(() => ({ account: "0x0000000000000000000000000000000000000001", chain: 1337 }));
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: fixture.account }), useChainId: () => fixture.chain, useConfig: () => ({}),
}));
vi.mock("@/state/usePriceData", () => ({ usePriceData: () => ({ price: fixture.chain === 1337 ? TV.fromHuman("0.5", 6) : TV.ZERO }) }));
vi.mock("@/hooks/wells/wells", () => ({ useWells: () => ({}) }));
vi.mock("@/utils/chain", () => ({ useChainConstant: () => ({ address: "pinto" }), getOverrideAllowanceStateOverride: () => undefined }));
vi.mock("@/encoders/ecosystem/price", () => ({ default: () => "0x", decodePriceResult: () => undefined }));
vi.mock("@/encoders/advancedPipe", () => ({ decodeAdvancedPipeResult: () => [] }));
vi.mock("@/lib/farm/workflow", () => ({ AdvancedFarmWorkflow: class { add() {} }, AdvancedPipeWorkflow: class { add() {} } }));
let root: Root, container: HTMLDivElement, client: QueryClient, summary: ReturnType<typeof usePriceImpactSummary>;
function Harness() {
  summary = usePriceImpactSummary(undefined, undefined, undefined, true);
  const converted = useDeterminePriceImpact({ price: 510_000n, pools: {} } as any);
  return <output>{converted.priceImpactByWell.main.priceImpact ?? "unavailable"}</output>;
}
const render = () => act(() => root.render(<QueryClientProvider client={client}><Harness /></QueryClientProvider>));
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.account = "0x0000000000000000000000000000000000000001"; fixture.chain = 1337;
  client = new QueryClient(); container = document.createElement("div"); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); client.clear(); container.remove(); });
test("zero/missing opening price cannot crash while a positive output survives a chain switch", () => {
  render(); expect(container.textContent).toBe("-2");
  fixture.chain = 1338; render(); expect(container.textContent).toBe("unavailable");
  fixture.chain = 1337; render(); expect(container.textContent).toBe("-2");
  expect(calculatePriceImpact(TV.ZERO, TV.ONE)).toBeUndefined();
  expect(calculatePriceImpact(TV.ONE)).toBeUndefined();
  expect(calculatePriceImpact(TV.fromHuman("0.5", 6), TV.fromHuman("0.4", 6))).toBe(20);
});
test("price simulation caches are isolated by account and chain, and clear matches the actual keys", () => {
  render();
  fixture.account = "0x0000000000000000000000000000000000000002"; render();
  fixture.chain = 1338; render();
  const keys = client.getQueryCache().findAll({ queryKey: [PRICE_IMPACT_PREDICATE] }).map(q => q.queryKey);
  expect(keys).toHaveLength(3);
  expect(keys.map(key => (key[1] as any).chainId)).toEqual([1337, 1337, 1338]);
  act(() => summary.clear());
  expect(client.getQueryCache().findAll({ queryKey: [PRICE_IMPACT_PREDICATE] })).toHaveLength(0);
});
