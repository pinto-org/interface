// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import useTransaction, { type UseTransactionParams } from "@/hooks/useTransaction";
import { toast } from "sonner";

const fixture = vi.hoisted(() => ({
  chain: 1337,
  hash: undefined as string | undefined,
  receipt: {} as any,
  observer: {} as any,
}));
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: "0x0000000000000000000000000000000000000001" }),
  useChainId: () => fixture.chain,
  useConfig: () => ({}),
  useWriteContract: () => ({ writeContractAsync: vi.fn(), data: fixture.hash }),
  useWaitForTransactionReceipt: (options: any) => {
    fixture.observer = options;
    return fixture.receipt;
  },
}));
vi.mock("@/hooks/useClearAllowances", () => ({ default: () => vi.fn() }));
vi.mock("@/utils/chain", () => ({ getExplorerLink: () => "", getOverrideAllowanceStateOverride: () => undefined }));
vi.mock("@/utils/wagmi/chains", () => ({ getIsProdNetwork: (chain: number) => chain === 8453 }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), dismiss: vi.fn() } }));

let root: Root, container: HTMLDivElement;
const success = vi.fn(),
  failure = vi.fn();
let options: UseTransactionParams;
function Harness() {
  useTransaction(options);
  return null;
}
const render = () => act(() => root.render(<Harness />));
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.chain = 1337;
  fixture.hash = undefined;
  fixture.receipt = { isSuccess: false };
  success.mockReset();
  failure.mockReset();
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
  options = { confirmationChainId: 1337, successCallback: success, onError: failure };
  vi.spyOn(console, "error").mockImplementation(() => {});
  container = document.createElement("div");
  root = createRoot(container);
  render();
  fixture.hash = `0x${"11".repeat(32)}`;
  render();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

test("pinned confirmation chain survives a switch and retains its confirmation count", () => {
  fixture.chain = 8453;
  render();
  expect(fixture.observer.chainId).toBe(1337);
  expect(fixture.observer.confirmations).toBe(1);
});
test("default callers retain the currently selected confirmation chain", () => {
  options = {};
  fixture.chain = 8453;
  render();
  expect(fixture.observer.chainId).toBe(8453);
  expect(fixture.observer.confirmations).toBe(2);
});
test("receipt validation failure invokes error without success callback or success toast", () => {
  options.validateReceipt = () => {
    throw new Error("No matching execution");
  };
  fixture.receipt = { isSuccess: true, data: { transactionHash: fixture.hash, status: "success", logs: [] } };
  render();
  render();
  expect(failure).toHaveBeenCalledOnce();
  expect(success).not.toHaveBeenCalled();
  expect(toast.success).not.toHaveBeenCalled();
  expect(toast.error).toHaveBeenCalledOnce();
});
test("a validated speed-up replacement receipt succeeds exactly once", () => {
  options.validateReceipt = vi.fn();
  fixture.receipt = { isSuccess: true, data: { transactionHash: `0x${"22".repeat(32)}`, status: "success", logs: [] } };
  render();
  render();
  expect(options.validateReceipt).toHaveBeenCalledOnce();
  expect(success).toHaveBeenCalledOnce();
  expect(failure).not.toHaveBeenCalled();
  expect(toast.success).toHaveBeenCalledOnce();
});
