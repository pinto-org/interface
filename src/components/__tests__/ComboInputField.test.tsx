import { TokenValue as TV } from "@/classes/TokenValue";
// @vitest-environment jsdom
import React, { act, useState } from "react";
import { type Root, createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { ComboInputField } from "../ComboInputField";

vi.mock("@/state/useFarmerBalances", () => ({ useFarmerBalances: () => ({ balances: new Map() }) }));
vi.mock("@/state/useFarmerSilo", () => ({ useFarmerSilo: () => ({ deposits: new Map() }) }));
vi.mock("@/state/usePriceData", () => ({ usePriceData: () => ({ tokenPrices: new Map() }) }));
vi.mock("@/state/useTokenData", () => ({ default: () => ({ mainToken: undefined }) }));
vi.mock("../PlotSelect", () => ({ default: () => null }));
vi.mock("../TokenSelectWithBalances", () => ({ default: () => null }));

const token: any = { address: "0x0000000000000000000000000000000000000001", decimals: 18, symbol: "LP" };
let root: Root;
let container: HTMLDivElement;
let setParent: (amount: string) => void;
function Harness({
  balance = "1",
  unclamped = false,
  minimum = "0",
  disabled = false,
  selectedToken = token,
  initialAmount = "0",
}) {
  const [amount, setAmount] = useState(initialAmount);
  const [error, setError] = useState(false);
  setParent = setAmount;
  return (
    <>
      <ComboInputField
        amount={amount}
        setAmount={setAmount}
        selectedToken={selectedToken}
        tokenAndBalanceMap={new Map([[selectedToken, TV.fromHuman(balance, 18)]])}
        customMinAmount={TV.fromHuman(minimum, 18)}
        disableClampMinOn0
        disableClamping={unclamped}
        disableInput={disabled}
        connectedAccount
        setError={setError}
      />
      <output data-testid="amount">{amount}</output>
      <output data-testid="error">{String(error)}</output>
    </>
  );
}
const parent = () => container.querySelector('[data-testid="amount"]')?.textContent;
const input = () => container.querySelector("input")!;
const render = (props: React.ComponentProps<typeof Harness> = {}) => act(() => root.render(<Harness {...props} />));
const type = (value: string) => act(() => Simulate.change(input(), { target: { value } } as any));
const settle = () => act(() => vi.advanceTimersByTime(1000));
beforeEach(() => {
  vi.useFakeTimers();
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

test("RPC balance loss and recovery cannot leave visible zero paired with a positive transaction amount", () => {
  render();
  type("0.001");
  settle();
  expect(parent()).toBe("0.001");
  render({ balance: "0", disabled: true });
  expect(input().value).toBe("0");
  expect(parent()).toBe("0");
  render();
  settle();
  expect(input().value).toBe("0");
  expect(parent()).toBe("0");
});

test("partial balance clamp is published immediately, without waiting for a keystroke", () => {
  render();
  type("0.5");
  settle();
  render({ balance: "0.25" });
  expect(input().value).toBe("0.25");
  expect(parent()).toBe("0.25");
  render();
  settle();
  expect(parent()).toBe("0.25");
});

test("a pending typing debounce cannot restore a pre-clamp amount", () => {
  render();
  type("0.5");
  render({ balance: "0" });
  settle();
  expect(input().value).toBe("0");
  expect(parent()).toBe("0");
});

test("unclamped withdrawal preserves the request, revalidates reduced balance, and clears the error on recovery", () => {
  render({ unclamped: true });
  type("0.001");
  settle();
  render({ unclamped: true, balance: "0" });
  expect(input().value).toBe("0.001");
  expect(parent()).toBe("0.001");
  expect(container.querySelector('[data-testid="error"]')?.textContent).toBe("true");
  render({ unclamped: true });
  expect(container.querySelector('[data-testid="error"]')?.textContent).toBe("false");
});

test("minimum adjustment synchronizes parent/display but never exceeds a failed balance", () => {
  render({ minimum: "0.1" });
  type("0.01");
  settle();
  settle();
  expect(input().value).toBe("0.1");
  expect(parent()).toBe("0.1");
  render({ minimum: "0.1", balance: "0" });
  settle();
  expect(input().value).toBe("0");
  expect(parent()).toBe("0");
});

test("external clear remains synchronized after a balance-driven clamp", () => {
  render();
  type("0.5");
  settle();
  render({ balance: "0.25" });
  act(() => setParent(""));
  settle();
  expect(input().value).toBe("");
  expect(parent()).toBe("");
});

test("changing tokens resets to zero instead of publishing the next token's maximum", () => {
  render({ balance: "200" });
  type("100");
  settle();
  render({ balance: "50", selectedToken: { ...token, address: "0x0000000000000000000000000000000000000002" } });
  settle();
  expect(input().value).toBe("0");
  expect(parent()).toBe("0");
});

test("mounting with an existing controlled amount keeps the displayed and submitted values", () => {
  render({ balance: "100000", initialAmount: "100000", unclamped: true });
  settle();
  expect(input().value).toBe("100000");
  expect(parent()).toBe("100000");
});

test("computed quote fields opt out of balance clamping and retain outputs larger than owned balance", () => {
  render({ disabled: true, unclamped: true, balance: "0" });
  act(() => setParent("10"));
  render({ disabled: true, unclamped: true, balance: "1" });
  settle();
  expect(input().value).toBe("10");
  expect(parent()).toBe("10");
});
