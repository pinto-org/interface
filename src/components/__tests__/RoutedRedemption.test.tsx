import RoutedRedemption from "@/pages/silo/actions/RoutedRedemption";
// @vitest-environment jsdom
import React, { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
const f = vi.hoisted(() => ({
  quote: vi.fn(),
  revalidate: vi.fn(),
  simulate: vi.fn(),
  estimate: vi.fn(),
  write: vi.fn(),
  account: {
    address: "0x0000000000000000000000000000000000000001",
    chainId: 1337,
    status: "connected",
    connector: { uid: "qa" },
  },
  accountChange: undefined as undefined | (() => void),
  warmingUp: false,
  pools: [{ snapshot: { deposits: [{ eligible: true, available: 1000000n }] } }],
}));
const pinto = { address: "0x0000000000000000000000000000000000000002", symbol: "PINTO", decimals: 6, isMain: true };
const usdc = { address: "0x0000000000000000000000000000000000000003", symbol: "USDC", decimals: 6 };
const baseAccount = { ...f.account };
vi.mock("@/components/ui/IconImage", () => ({ default: () => null }));
vi.mock("@/hooks/display/useIsMobile", () => ({ default: () => false }));
vi.mock("@/state/usePriceData", () => ({ usePriceData: () => ({ tokenPrices: new Map() }) }));
vi.mock("@/components/RoutingAndSlippageInfo", () => ({ default: () => <div>See Routing</div> }));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({
  useProtocolAddress: () => "0x0000000000000000000000000000000000000004",
}));
vi.mock("@/state/useTokenData", () => ({
  default: () => ({
    mainToken: pinto,
    preferredTokens: [pinto, usdc],
    lpTokens: [{ address: "0x0000000000000000000000000000000000000005", isWhitelisted: true }],
  }),
}));
vi.mock("wagmi", () => ({
  useAccount: () => f.account,
  useChainId: () => 1337,
  useConfig: () => ({ getClient: () => ({}) }),
}));
vi.mock("@wagmi/core", () => ({
  getAccount: () => f.account,
  watchAccount: (_: unknown, options: { onChange: () => void }) => {
    f.accountChange = options.onChange;
    return () => {};
  },
}));
vi.mock("@/hooks/useTransaction", () => ({
  default: () => ({ writeContractAsync: f.write, isConfirming: false, submitting: false }),
}));
vi.mock("@/state/useFarmerBalances", () => ({ useFarmerBalances: () => ({ queryKeys: [] }) }));
vi.mock("@/state/useFarmerSilo", () => ({ useFarmerSilo: () => ({ queryKeys: [] }) }));
vi.mock("@/state/useSunData", () => ({ useInvalidateSun: () => vi.fn() }));
vi.mock("@/utils/guardedWallet", () => ({ guardedWalletConnector: (connector: unknown) => connector }));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  useQuery: () => ({
    data: { pools: f.warmingUp ? [] : f.pools, warmingUp: f.warmingUp },
    refetch: async () => ({ data: { pools: f.warmingUp ? [] : f.pools, warmingUp: f.warmingUp } }),
    isError: false,
    isPending: false,
  }),
}));
vi.mock("viem/actions", () => ({ simulateContract: f.simulate, estimateContractGas: f.estimate }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));
vi.mock("@/lib/redemption/route", async (original) => ({
  ...(await original<object>()),
  quoteRoute: f.quote,
  revalidateRoute: f.revalidate,
  buildRoute: () => [],
}));
// These tests exercise transaction state; the amount/reward UI is verified separately.
vi.mock("@/pages/silo/actions/FeeFreeWithdrawalAmount", () => ({
  default: ({ amount, setAmount }: any) => <input value={amount} onChange={(e) => setAmount(e.target.value)} />,
}));
// Native inputs keep these interaction tests focused on transaction state, not Radix internals.
vi.mock("@/components/ui/Select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <span>{children}</span>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => null,
}));
let root: Root, container: HTMLDivElement;
const onBusy = vi.fn();
function render() {
  root.render(<RoutedRedemption siloToken={pinto as any} onBusyChange={onBusy} />);
}
function button(text: string) {
  return [...container.querySelectorAll("button")].find((b) => b.textContent === text)!;
}
async function review() {
  await act(async () => {
    const input = container.querySelector("input")!;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "0.5");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(async () => button("Get fresh route").click());
  expect(button("Withdraw to USDC").disabled).toBe(false);
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  f.account = { ...baseAccount };
  f.accountChange = undefined;
  f.warmingUp = false;
  f.simulate.mockReset().mockResolvedValue({});
  f.estimate.mockReset().mockResolvedValue(1_000_000n);
  f.revalidate.mockReset().mockResolvedValue(undefined);
  f.write.mockReset().mockResolvedValue("0x1234");
  f.quote.mockReset().mockImplementation(async () => ({
    account: f.account.address,
    chainId: 1337,
    diamond: "0x0000000000000000000000000000000000000004",
    buyToken: usdc.address,
    fetchedAt: Date.now(),
    expected: 1000000n,
    minimum: 990000n,
    legs: [],
  }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(render);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});
test("requires a reviewed quote and clears it when the amount changes", async () => {
  expect(button("Withdraw to USDC").disabled).toBe(true);
  await review();
  await act(async () => {
    const input = container.querySelector("input")!;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "0.6");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(button("Withdraw to USDC").disabled).toBe(true);
});
test("does not send if atomic simulation reverts and displays a concise recoverable error", async () => {
  await review();
  f.simulate.mockRejectedValue(new Error("large calldata dump"));
  await act(async () => button("Withdraw to USDC").click());
  expect(f.write).not.toHaveBeenCalled();
  expect(container.textContent).toContain("Get a fresh route or try a smaller amount");
  expect(container.textContent).not.toContain("large calldata dump");
});
test("clears the review when the wallet changes to an unsupported chain while the app retains its chain", async () => {
  await review();
  await act(async () => {
    f.account = { ...baseAccount, chainId: 1338 };
    render();
  });
  expect(container.textContent).not.toContain("Expected receipt");
  expect(container.textContent).toContain("Switch to Base");
  expect(button("Get fresh route").disabled).toBe(true);
  expect(button("Withdraw to USDC").disabled).toBe(true);
  await act(async () => {
    f.account = { ...baseAccount };
    render();
  });
  expect(button("Get fresh route").disabled).toBe(false);
  expect(button("Withdraw to USDC").disabled).toBe(true);
  expect(f.write).not.toHaveBeenCalled();
});
test("cancels on a wallet change during eligibility revalidation, including switching back", async () => {
  await review();
  let resume!: () => void;
  f.revalidate.mockImplementation(
    () =>
      new Promise<void>((r) => {
        resume = r;
      }),
  );
  await act(async () => button("Withdraw to USDC").click());
  await act(async () => {
    f.account = { ...baseAccount, address: "0x0000000000000000000000000000000000000099" };
    f.accountChange?.();
    f.account = { ...baseAccount };
    f.accountChange?.();
    resume();
  });
  expect(f.simulate).not.toHaveBeenCalled();
  expect(f.write).not.toHaveBeenCalled();
});
test("rejects a quote that expires while transaction preparation is in progress", async () => {
  vi.useFakeTimers();
  await review();
  f.revalidate.mockImplementation(async () => {
    vi.setSystemTime(Date.now() + 61_000);
  });
  await act(async () => button("Withdraw to USDC").click());
  expect(f.write).not.toHaveBeenCalled();
  expect(container.textContent).toContain("expired");
});
test("sends only after eligibility, simulation and gas checks pass", async () => {
  await review();
  await act(async () => button("Withdraw to USDC").click());
  expect(f.write).toHaveBeenCalledOnce();
  expect(f.write.mock.calls[0][0]).toMatchObject({ chainId: 1337, gas: 1_350_000n, functionName: "advancedFarm" });
});

function renderUnified(amount: string, token = usdc) {
  root.render(
    <RoutedRedemption
      siloToken={pinto as any}
      onBusyChange={onBusy}
      unified={{
        amount,
        setAmount: vi.fn(),
        outputToken: token as any,
        outputs: [pinto, token] as any,
        onOutputChange: vi.fn(),
      }}
    />,
  );
}
test("automatically quotes a selected output after typing stops, without a manual route button", async () => {
  vi.useFakeTimers();
  act(() => renderUnified("0.5"));
  expect(button("Get fresh route")).toBeUndefined();
  await act(async () => vi.advanceTimersByTimeAsync(600));
  expect(f.quote).toHaveBeenCalledOnce();
  expect(container.textContent).toContain("Estimated output1 USDC");
  expect(button("Withdraw to USDC").disabled).toBe(false);
});
test("keeps a unified simulation error visible until an explicit refresh without automatically replacing the review", async () => {
  vi.useFakeTimers();
  act(() => renderUnified("0.5"));
  await act(async () => vi.advanceTimersByTimeAsync(600));
  f.simulate.mockRejectedValue(new Error("simulation failed"));
  await act(async () => button("Withdraw to USDC").click());
  await act(async () => vi.advanceTimersByTimeAsync(1200));
  expect(f.write).not.toHaveBeenCalled();
  expect(f.quote).toHaveBeenCalledOnce();
  expect(container.textContent).toContain("Get a fresh route or try a smaller amount");
  await act(async () => button("Get fresh route").click());
  await act(async () => vi.advanceTimersByTimeAsync(1200));
  expect(f.quote).toHaveBeenCalledTimes(2);
  expect(container.textContent).not.toContain("Get a fresh route or try a smaller amount");
});
test("shows a concise wallet rejection without dumping transaction calldata into the mobile form", async () => {
  vi.useFakeTimers();
  act(() => renderUnified("0.5"));
  await act(async () => vi.advanceTimersByTimeAsync(600));
  f.write.mockRejectedValue(
    Object.assign(new Error("Request Arguments: data: 0xdeadbeef"), {
      shortMessage: "User rejected the request.",
    }),
  );
  await act(async () => button("Withdraw to USDC").click());
  await act(async () => vi.advanceTimersByTimeAsync(1200));
  expect(container.textContent).toContain("User rejected the request.");
  expect(container.textContent).not.toContain("0xdeadbeef");
  expect(f.quote).toHaveBeenCalledOnce();
});
test("does not quote amounts beyond eligibility or retain an old output estimate", async () => {
  vi.useFakeTimers();
  act(() => renderUnified("0.5"));
  await act(async () => vi.advanceTimersByTimeAsync(600));
  act(() => renderUnified("2"));
  await act(async () => vi.advanceTimersByTimeAsync(600));
  expect(f.quote).toHaveBeenCalledOnce();
  expect(container.textContent).toContain("Estimated output—");
  expect(button("Withdraw to USDC").disabled).toBe(true);
});
test("discards an in-flight estimate when the selected output changes", async () => {
  vi.useFakeTimers();
  let finish!: (value: any) => void;
  f.quote.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  act(() => renderUnified("0.5"));
  await act(async () => vi.advanceTimersByTimeAsync(600));
  const weth = { ...usdc, symbol: "WETH", address: "0x0000000000000000000000000000000000000099" };
  act(() => renderUnified("0.5", weth));
  await act(async () => finish({ fetchedAt: Date.now(), expected: 555n, minimum: 500n, legs: [] }));
  expect(container.textContent).not.toContain("0.000555");
  expect(button("Withdraw to WETH").disabled).toBe(true);
  expect(f.write).not.toHaveBeenCalled();
});

test("warm-up explains delayed opening, blocks quoting and recovers on refreshed readiness", async () => {
  vi.useFakeTimers();
  f.warmingUp = true;
  act(() => renderUnified("0.5"));
  await act(async () => vi.advanceTimersByTimeAsync(600));
  expect(container.textContent).toContain("Fee-free withdrawals are warming up");
  expect(container.textContent).not.toContain("No fee-exempt exit pools are enabled");
  expect(button("Withdraw to USDC").disabled).toBe(true);
  expect(f.quote).not.toHaveBeenCalled();
  expect(f.write).not.toHaveBeenCalled();
  f.warmingUp = false;
  act(() => renderUnified("0.5"));
  await act(async () => vi.advanceTimersByTimeAsync(600));
  expect(container.textContent).not.toContain("Fee-free withdrawals are warming up");
  expect(f.quote).toHaveBeenCalledOnce();
  expect(button("Withdraw to USDC").disabled).toBe(false);
});
