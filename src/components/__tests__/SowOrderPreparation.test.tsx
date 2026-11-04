// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useSowOrderV0State } from "@/components/Tractor/form/SowOrderV0Schema";

const fixture = vi.hoisted(() => ({
  account: "0x0000000000000000000000000000000000000001",
  diamond: "0x0000000000000000000000000000000000000002",
  pinto: "0x0000000000000000000000000000000000000003",
  encode: vi.fn(), quote: vi.fn(), client: { chain: { id: 1337 } },
}));
vi.mock("wagmi", () => ({ useAccount: () => ({ address: fixture.account }), usePublicClient: () => fixture.client }));
vi.mock("@/constants/tokens", () => ({ MAIN_TOKEN: {} }));
vi.mock("@/constants/address", () => ({ SILO_HELPERS_ADDRESS: "silo", TRACTOR_HELPERS_ADDRESS: "tractor" }));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({ useProtocolAddress: () => fixture.diamond }));
vi.mock("@/hooks/pinto/useTokenMap", () => ({ useTokenMap: () => ({}) }));
vi.mock("@/utils/chain", () => ({ useChainConstant: () => ({ address: fixture.pinto }) }));
vi.mock("@/utils/token", () => ({ getTokenIndex: () => "" }));
vi.mock("@/utils/referral", () => ({ decodeReferralAddress: () => undefined, isValidReferralCode: () => false }));
vi.mock("@/lib/Tractor", () => ({
  createSowTractorData: (...args: any[]) => fixture.encode(...args), createBlueprint: (x: any) => x,
  TRACTOR_TOKEN_STRATEGY_TYPES: ["LOWEST_SEEDS", "LOWEST_PRICE", "SPECIFIC_TOKEN", "MULTI_TOKENS"], tractorTokenStrategyUtil: {},
}));
vi.mock("@/lib/Tractor/sowOrder/sowCapacity", async (original) => ({
  ...(await original<typeof import("@/lib/Tractor/sowOrder/sowCapacity")>()),
  quoteSowCapacity: (...args: any[]) => fixture.quote(...args),
}));
let root: Root, container: HTMLDivElement, state: ReturnType<typeof useSowOrderV0State>;
function Harness() { state = useSowOrderV0State(); return null; }
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.quote.mockReset().mockResolvedValue({ pintos: 10_000_000n });
  fixture.encode.mockReset().mockResolvedValue({ data: "0x", operatorPasteInstrs: [], rawCall: "0x", depositOptimizationCalls: [] });
  container = document.createElement("div"); root = createRoot(container);
  act(() => root.render(<Harness />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
const form = { getValues: () => ({
  totalAmount: "1.234567", minSoil: "1.234567", maxPerSeason: "1.234567", operatorTip: "0.2", temperature: "4737",
  podLineLength: "86561197.4", morningAuction: false, selectedTokenStrategy: { type: "LOWEST_SEEDS" }, referralCode: "",
}) };
test.each([["Modify without optimization", undefined], ["New with optimization", new Map()]])(
  "%s preserves the required protocol address", async (_label, deposits) => {
    const success = vi.fn();
    await act(async () => { await state.handleCreateBlueprint(form as any, deposits as any, { onSuccess: success }); });
    expect(fixture.quote).toHaveBeenCalledOnce();
    expect(fixture.encode.mock.calls[0][0].protocolAddress).toBe(fixture.diamond);
    expect(fixture.encode.mock.calls[0][0].farmerDeposits).toBe(deposits);
    expect(success).toHaveBeenCalledOnce();
  },
);
test("Modify still requires a fresh sufficient funding quote", async () => {
  fixture.quote.mockResolvedValue({ pintos: 0n });
  const failure = vi.fn();
  await act(async () => { await state.handleCreateBlueprint(form as any, undefined, { onFailure: failure }); });
  expect(fixture.encode).not.toHaveBeenCalled();
  expect(failure).toHaveBeenCalledOnce();
});
