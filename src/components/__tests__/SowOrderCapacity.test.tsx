// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import useSowOrderCapacity from "@/hooks/tractor/useSowOrderCapacity";

const state = vi.hoisted(() => ({
  account: "0x0000000000000000000000000000000000000001",
  chainId: 1337,
  quote: vi.fn(),
}));
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: state.account, chainId: state.chainId }),
  useChainId: () => state.chainId,
  usePublicClient: () => ({ chain: { id: 1337 } }),
}));
vi.mock("@/utils/chain", () => ({
  useChainConstant: () => ({ address: "0x0000000000000000000000000000000000000002" }),
}));
vi.mock("@/constants/tokens", () => ({ MAIN_TOKEN: {} }));
vi.mock("@/constants/address", () => ({ SILO_HELPERS_ADDRESS: "silo", TRACTOR_HELPERS_ADDRESS: "tractor" }));
vi.mock("@/hooks/pinto/useProtocolAddress", () => ({ useProtocolAddress: () => "diamond" }));
vi.mock("@/lib/Tractor/sowOrder/sowCapacity", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/Tractor/sowOrder/sowCapacity")>()),
  quoteSowCapacity: (...args: unknown[]) => state.quote(...args),
}));
const strategy = { type: "SPECIFIC_TOKEN" as const, addresses: ["0x0000000000000000000000000000000000000003"] };
let root: Root, container: HTMLDivElement, client: QueryClient;
function Harness({ total = "1", minimum = "1", tip = "0.2", enabled = true, selected = strategy }) {
  const capacity = useSowOrderCapacity(selected, total, minimum, tip, enabled);
  return (
    <>
      <button disabled={!capacity.canProceed}>Next</button>
      <output>{capacity.message}</output>
      <span>{capacity.maxAmount?.toHuman() ?? "unavailable"}</span>
    </>
  );
}
const render = (props: React.ComponentProps<typeof Harness> = {}) =>
  act(() =>
    root.render(
      <QueryClientProvider client={client}>
        <Harness {...props} />
      </QueryClientProvider>,
    ),
  );
const ready = () => !container.querySelector("button")!.disabled;
async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 15));
  });
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  state.account = "0x0000000000000000000000000000000000000001";
  state.chainId = 1337;
  state.quote.mockReset().mockResolvedValue({ pintos: 9_969_837n, blockNumber: 123n, sources: [] });
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  client.clear();
  container.remove();
});

test("valid Pinto capacity enables the form; tips and excessive amounts disable it", async () => {
  render();
  await settle();
  expect(ready()).toBe(true);
  expect(container.querySelector("span")!.textContent).toBe("9.769837");
  render({ total: "10", minimum: "10" });
  expect(ready()).toBe(false);
  render({ total: "9", minimum: "1" });
  expect(ready()).toBe(false); // nine tips
  render({ total: "9", minimum: "9" });
  expect(ready()).toBe(true);
});
test("a failed refresh cannot retain funding approval from cached success", async () => {
  render();
  await settle();
  expect(ready()).toBe(true);
  state.quote.mockRejectedValue(new Error("RPC unavailable"));
  await act(async () => {
    await client.refetchQueries();
  });
  await settle();
  expect(ready()).toBe(false);
  expect(container.textContent).toContain("Unable to quote");
  expect(container.querySelector("span")!.textContent).toBe("unavailable");
});
test("lowering an unaffordable tip restores funding approval", async () => {
  state.quote.mockResolvedValue({ pintos: 700_000n, blockNumber: 123n, sources: [] });
  render({ total: "0.5", minimum: "0.5", tip: "1" });
  await settle();
  expect(ready()).toBe(false);
  expect(container.querySelector("span")!.textContent).toBe("0");
  render({ total: "0.5", minimum: "0.5", tip: "0.2" });
  expect(ready()).toBe(true);
  expect(container.querySelector("span")!.textContent).toBe("0.5");
});
test("slider's default-minimum endpoint includes all execution tips", async () => {
  state.quote.mockResolvedValue({ pintos: 100_000_000n, blockNumber: 123n, sources: [] });
  render({ total: "96", minimum: "25", tip: "1" });
  await settle();
  expect(ready()).toBe(true);
  expect(container.querySelector("span")!.textContent).toBe("96");
  render({ total: "96.000001", minimum: "25", tip: "1" });
  expect(ready()).toBe(false);
});
test("account switches discard old capacity and late responses cannot approve the new account", async () => {
  let resolveOld!: (value: any) => void;
  state.quote.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveOld = resolve;
      }),
  );
  render();
  await settle();
  expect(ready()).toBe(false);
  state.account = "0x0000000000000000000000000000000000000004";
  state.quote.mockResolvedValue({ pintos: 0n, blockNumber: 123n, sources: [] });
  render();
  await settle();
  await act(async () => {
    resolveOld({ pintos: 1_000_000_000n, blockNumber: 123n, sources: [] });
  });
  await settle();
  expect(ready()).toBe(false);
  expect(container.textContent).toContain("No withdrawable Pinto");
});
test("unsupported networks and closed forms cannot use cached approval", async () => {
  render();
  await settle();
  expect(ready()).toBe(true);
  state.chainId = 1338;
  render();
  expect(ready()).toBe(false);
  expect(container.textContent).toContain("supported wallet");
  state.chainId = 1337;
  render({ enabled: false });
  expect(ready()).toBe(false);
});
test("a new source with no inventory cannot inherit the previous source's capacity", async () => {
  render();
  await settle();
  expect(ready()).toBe(true);
  state.quote.mockResolvedValue({ pintos: 0n, blockNumber: 123n, sources: [] });
  render({ selected: { ...strategy, addresses: ["0x0000000000000000000000000000000000000005"] } });
  expect(ready()).toBe(false);
  await settle();
  expect(ready()).toBe(false);
});
