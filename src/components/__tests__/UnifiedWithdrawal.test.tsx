import { TokenValue } from "@/classes/TokenValue";
import UnifiedWithdrawal from "@/pages/silo/actions/UnifiedWithdrawal";
// @vitest-environment jsdom
import React, { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
const pinto = { address: "0x0000000000000000000000000000000000000001", symbol: "PINTO", decimals: 6, isMain: true };
const usdc = { ...pinto, address: "0x0000000000000000000000000000000000000002", symbol: "USDC", isMain: false };
vi.mock("@/state/useTokenData", () => ({ default: () => ({ preferredTokens: [pinto, usdc] }) }));
vi.mock("@/state/useFarmerSilo", () => ({
  useFarmerSilo: () => ({ deposits: new Map([[pinto, { amount: TokenValue.fromHuman("100", 6) }]]) }),
}));
vi.mock("@/pages/silo/actions/WithdrawAs", () => ({
  default: ({ token, outputs, onChange, disabled, estimated }: any) => (
    <>
      <select
        aria-label="Withdraw as"
        value={token.address}
        onChange={(e) => onChange(outputs.find((t: any) => t.address === e.target.value))}
        disabled={disabled}
      >
        {outputs.map((t: any) => (
          <option key={t.address} value={t.address}>
            {t.symbol}
          </option>
        ))}
      </select>
      <span>Estimate: {String(estimated)}</span>
    </>
  ),
}));
vi.mock("@/pages/silo/actions/Withdraw", () => ({
  default: ({ unified, onBusyChange }: any) => (
    <>
      <input value={unified.amount} onChange={(e) => unified.setAmount(e.target.value)} />
      {unified.output}
      <button onClick={() => onBusyChange(true)}>Submit same token</button>
    </>
  ),
}));
vi.mock("@/pages/silo/actions/RoutedRedemption", () => ({
  default: ({ unified }: any) => (
    <>
      <span>
        Routed {unified.amount} to {unified.outputToken.symbol}
      </span>
      <button onClick={() => unified.onOutputChange(pinto)}>Back to PINTO</button>
    </>
  ),
}));
let container: HTMLDivElement, root: Root;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<UnifiedWithdrawal siloToken={pinto as any} onBusyChange={() => {}} />));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
function amount(value: string) {
  act(() => {
    const input = container.querySelector("input")!;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
test("defaults to the deposited token with a 1:1 valid estimate", () => {
  expect(container.querySelector("select")!.value).toBe(pinto.address);
  amount("25");
  expect(container.textContent).toContain("Estimate: 25000000");
  amount("101");
  expect(container.textContent).toContain("Estimate: undefined");
});
test("switching output preserves the amount across same-token and routed withdrawals", () => {
  amount("25");
  act(() => {
    const select = container.querySelector("select")!;
    select.value = usdc.address;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(container.textContent).toContain("Routed 25 to USDC");
  act(() => container.querySelector("button")!.click());
  expect(container.querySelector("input")!.value).toBe("25");
  expect(container.querySelector("select")!.value).toBe(pinto.address);
});
test("the output cannot change during submission", () => {
  act(() => container.querySelector("button")!.click());
  expect(container.querySelector("select")!.disabled).toBe(true);
});
