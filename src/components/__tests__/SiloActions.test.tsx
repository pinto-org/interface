import SiloActions from "@/pages/silo/SiloActions";
import type { Token } from "@/utils/types";
// @vitest-environment jsdom
import React, { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
const f = vi.hoisted(() => ({
  tab: "deposit",
  hasDeposits: false,
  loading: false,
  belowTarget: false,
  changeTab: vi.fn(),
}));
vi.mock("@/hooks/useRouterTabs", () => ({ useParamsTabs: () => [f.tab, f.changeTab] }));
vi.mock("@/state/useFarmerSilo", () => ({
  useFarmerSilo: () => ({
    deposits: new Map([[token, { amount: { gt: () => f.hasDeposits } }]]),
    isLoading: f.loading,
  }),
}));
vi.mock("@/state/usePriceData", () => ({ usePriceData: () => ({ price: { lt: () => f.belowTarget } }) }));
vi.mock("@/utils/analytics", () => ({ trackSimpleEvent: vi.fn() }));
vi.mock("@/components/TooltipSimple", () => ({ default: ({ children }: React.PropsWithChildren) => <>{children}</> }));
vi.mock("@/pages/silo/actions/Deposit", () => ({ default: () => <div>Deposit form</div> }));
vi.mock("@/pages/silo/actions/UnifiedWithdrawal", () => ({
  default: ({ onBusyChange }: { onBusyChange: (busy: boolean) => void }) => (
    <button onClick={() => onBusyChange(true)}>Unified withdrawal form</button>
  ),
}));
vi.mock("@/pages/silo/actions/Convert", () => ({ default: () => null }));
vi.mock("@/pages/silo/actions/WrapToken", () => ({ default: () => null }));
vi.mock("@/pages/silo/actions/UnwrapToken", () => ({ default: () => null }));
const token: Token = {
  name: "Pinto",
  chainId: 1337,
  decimals: 6,
  logoURI: "",
  address: "0x0000000000000000000000000000000000000001",
  symbol: "PINTO",
  isMain: true,
  isWhitelisted: true,
};
let container: HTMLDivElement, root: Root;
beforeEach(() => {
  Object.assign(f, { tab: "deposit", hasDeposits: false, loading: false, belowTarget: false });
  f.changeTab.mockClear();
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
const render = () => act(() => root.render(<SiloActions token={token} />));
const tab = (name: string) =>
  [...container.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find((el) => el.textContent === name)!;
test("an empty position enables only Deposit", () => {
  f.tab = "redeem";
  render();
  expect(tab("Deposit").disabled).toBe(false);
  for (const name of ["Withdraw", "Convert"]) expect(tab(name).disabled).toBe(true);
  expect(tab("Fee-free exit")).toBeUndefined();
  expect(f.changeTab).toHaveBeenCalledWith("deposit");
});
test("one withdrawal flow remains available below target without method toggles", () => {
  f.hasDeposits = true;
  f.belowTarget = true;
  f.tab = "withdraw";
  render();
  expect(tab("Withdraw").disabled).toBe(false);
  expect(tab("Convert").disabled).toBe(true);
  expect(container.textContent).toContain("Unified withdrawal form");
  expect(container.querySelectorAll('[role="radio"]')).toHaveLength(0);
});
test("legacy exit links wait for deposits and resolve to the unified withdrawal", () => {
  f.hasDeposits = true;
  f.tab = "redeem";
  f.loading = true;
  render();
  expect(f.changeTab).not.toHaveBeenCalled();
  f.loading = false;
  render();
  expect(container.textContent).toContain("Unified withdrawal form");
  expect(f.changeTab).toHaveBeenCalledWith("withdraw");
});
test("depleting the position returns to Deposit", () => {
  f.hasDeposits = true;
  f.tab = "withdraw";
  render();
  f.hasDeposits = false;
  render();
  expect(f.changeTab).toHaveBeenCalledWith("deposit");
});
test("balance refresh cannot unmount a busy withdrawal or change tabs", () => {
  f.hasDeposits = true;
  f.tab = "withdraw";
  render();
  act(() =>
    [...container.querySelectorAll("button")].find((el) => el.textContent === "Unified withdrawal form")!.click(),
  );
  f.hasDeposits = false;
  render();
  act(() => tab("Deposit").click());
  expect(f.changeTab).not.toHaveBeenCalled();
  expect(container.textContent).toContain("Unified withdrawal form");
});
