// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { parseAbi } from "viem";
import useTransaction from "@/hooks/useTransaction";
import { useClaimRewards } from "@/hooks/useClaimRewards";

const fixture = vi.hoisted(() => ({ estimate: vi.fn(), write: vi.fn(), account: "0x0000000000000000000000000000000000000001" }));
vi.mock("@wagmi/core", () => ({ estimateGas: (...args: unknown[]) => fixture.estimate(...args) }));
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: fixture.account }), useChainId: () => 1337, useConfig: () => ({}),
  useWaitForTransactionReceipt: () => ({ isSuccess: false, isLoading: false }),
  useWriteContract: () => ({ writeContractAsync: fixture.write, isPending: false }),
}));
vi.mock("@/hooks/useClearAllowances", () => ({ default: () => vi.fn() }));
vi.mock("@/utils/chain", () => ({ getExplorerLink: () => "", getOverrideAllowanceStateOverride: () => undefined }));
vi.mock("@/utils/wagmi/chains", () => ({ getIsProdNetwork: () => false }));
vi.mock("sonner", () => ({ toast: { dismiss: vi.fn(), error: vi.fn(), loading: vi.fn(), success: vi.fn() } }));
vi.mock("@/generated/contractHooks", async () => {
  const { parseAbi } = await import("viem");
  return { beanstalkAddress: { 1337: "0x0000000000000000000000000000000000000002" }, beanstalkAbi: parseAbi([
    "function plant()", "function mowMultiple(address account, address[] tokens)", "function farm(bytes[] calls)",
  ]) };
});
vi.mock("@/state/useFarmerSilo", () => ({ useFarmerSilo: () => ({ deposits: new Map(), queryKeys: [] }) }));
vi.mock("@/state/useSiloData", () => ({ useSiloData: () => ({ queryKeys: [] }) }));
vi.mock("@/state/useSunData", () => ({ useSunData: () => ({ raining: false }), useInvalidateSun: () => vi.fn() }));
vi.mock("@/state/useTokenData", () => ({ default: () => ({ whitelistedTokens: [], mayBeWhitelistedTokens: [] }) }));
vi.mock("@/lib/claim/depositUtils", () => ({ generateCombineAndL2LCallData: () => [] }));
vi.mock("@/utils/analytics", () => ({ trackClick: () => vi.fn() }));
vi.mock("@tanstack/react-query", () => ({ useQueryClient: () => ({ invalidateQueries: vi.fn() }) }));
let root: Root, container: HTMLDivElement, transaction: ReturnType<typeof useTransaction>, claim: ReturnType<typeof useClaimRewards>;
function Harness() { transaction = useTransaction({}); claim = useClaimRewards(); return null; }
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.estimate.mockReset(); fixture.write.mockReset().mockResolvedValue("0x1234");
  vi.spyOn(console, "error").mockImplementation(() => {});
  container = document.createElement("div"); root = createRoot(container);
  act(() => root.render(<Harness />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); vi.restoreAllMocks(); });
const args = { address: "0x0000000000000000000000000000000000000002" as const, abi: parseAbi(["function run()"]), functionName: "run" };
test.each(["ordinary", "claim"])("%s never sends after a revert, RPC error or zero estimate", async (route) => {
  for (const result of [new Error("execution reverted"), new Error("RPC unavailable"), 0n]) {
    if (typeof result === "bigint") fixture.estimate.mockResolvedValue(result);
    else fixture.estimate.mockRejectedValue(result);
    await act(async () => {
      await expect(route === "claim" ? claim.submitClaimRewards() : transaction.writeWithEstimateGas(args)).rejects.toThrow();
    });
    expect(fixture.write).not.toHaveBeenCalled();
    expect(transaction.submitting).toBe(false);
    expect(claim.isSubmitting).toBe(false);
  }
});
test.each(["ordinary", "claim"])("%s sends after a valid estimate with the existing buffer", async (route) => {
  fixture.estimate.mockResolvedValue(100_000n);
  await act(async () => { await (route === "claim" ? claim.submitClaimRewards() : transaction.writeWithEstimateGas(args)); });
  expect(fixture.write).toHaveBeenCalledOnce();
  expect(fixture.write.mock.calls[0][0].gas).toBe(160_000n);
});
