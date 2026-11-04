// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TokenValue as TV } from "@/classes/TokenValue";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import TractorTokenStrategyDialog from "@/components/Tractor/TractorTokenStrategyDialog";

const state = vi.hoisted(() => ({
  tokens: [] as any[],
  deposits: new Map(),
  price: {} as any,
  quote: undefined as any,
}));
vi.mock("@/state/useTokenData", () => ({
  default: () => ({ whitelistedTokens: state.tokens, mainToken: state.tokens[0] }),
}));
vi.mock("@/state/useFarmerSilo", () => ({ useFarmerSilo: () => ({ deposits: state.deposits }) }));
vi.mock("@/state/usePriceData", () => ({ usePriceData: () => state.price }));
vi.mock("@/hooks/swap/useSwap", () => ({
  useSwapMany: () => ({ data: [{ buyAmount: state.quote }], isLoading: false }),
}));
vi.mock("@/lib/claim/depositUtils", () => ({ needsCombining: () => false }));
vi.mock("@/lib/Tractor", () => ({ tractorTokenStrategyUtil: { extractAddresses: () => [], isDynamic: () => false } }));
vi.mock("@/components/ui/Dialog", () => {
  const Wrapper = ({ children }: any) => <div>{children}</div>;
  return Object.fromEntries(
    [
      "Dialog",
      "DialogContent",
      "DialogDescription",
      "DialogHeader",
      "DialogOverlay",
      "DialogPortal",
      "DialogTitle",
    ].map((name) => [name, Wrapper]),
  );
});
vi.mock("@/components/Icons", () => ({ InfoOutlinedIcon: () => null }));
vi.mock("@/components/ui/IconImage", () => ({ default: () => null }));
const pinto = {
  address: "0x0000000000000000000000000000000000000001",
  symbol: "PINTO",
  decimals: 6,
  chainId: 1337,
  isLP: false,
};
const lp = {
  ...pinto,
  address: "0x0000000000000000000000000000000000000002",
  symbol: "PINTOLP",
  decimals: 18,
  isLP: true,
};
let root: Root, container: HTMLDivElement;
function Harness({ mode = "amount" }: { mode?: "amount" | "bdv" }) {
  const calculations = useSowOrderV0Calculations();
  return (
    <>
      <output>{JSON.stringify(calculations.tokenWithHighestValue)}</output>
      <TractorTokenStrategyDialog
        open
        selectedTokenStrategy={undefined}
        farmerDeposits={state.deposits}
        onOpenChange={() => {}}
        onTokenStrategySelected={() => {}}
        mode={mode}
        {...calculations}
      />
    </>
  );
}
function render(mode?: "amount" | "bdv") {
  act(() => root.render(<Harness mode={mode} />));
}
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  state.tokens = [pinto, lp];
  state.price = { price: TV.fromHuman("0.033", 6), loading: false };
  state.quote = TV.fromHuman("9.969837", 6);
  state.deposits = new Map([
    [pinto, { amount: TV.fromHuman("50", 6), depositBDV: TV.fromHuman("50", 6) }],
    [lp, { amount: TV.fromHuman("0.02", 18), depositBDV: TV.fromHuman("100", 6) }],
  ]);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

test("LP and Pinto balances are both marked in USD, not Pinto amounts with a dollar sign", () => {
  render();
  expect(container.textContent).toContain("$1.65");
  expect(container.textContent).toContain("$0.33");
  expect(container.textContent).not.toContain("$9.97");
});
test.each(["0.033", "2"])("default funding selection uses comparable Pinto quantities at price %s", (price) => {
  state.price.price = TV.fromHuman(price, 6);
  render();
  expect(container.querySelector("output")?.textContent).toContain(pinto.address);
  state.quote = TV.fromHuman("51", 6);
  render();
  expect(container.querySelector("output")?.textContent).toContain(lp.address);
});
test("missing LP quotes do not display a false zero-dollar balance or become a default source", () => {
  state.quote = undefined;
  render();
  expect(container.textContent).toContain("USD value unavailable");
  expect(container.textContent).not.toContain("$0.00");
  expect(container.querySelector("output")?.textContent).toContain(pinto.address);
});
test.each(["zero", "loading"])("%s price data does not invent a USD valuation", (condition) => {
  if (condition === "zero") state.price.price = TV.ZERO;
  else state.price.loading = true;
  render();
  expect(container.textContent?.match(/USD value unavailable/g)).toHaveLength(2);
  expect(container.textContent).not.toContain("$");
});
test("the Convert Up PDV display remains independent of USD price and withdrawal quotes", () => {
  state.quote = undefined;
  state.price.price = TV.ZERO;
  render("bdv");
  expect(container.textContent).not.toContain("USD value unavailable");
  expect(container.textContent).not.toContain("$");
  expect(container.textContent).toContain("100");
});
