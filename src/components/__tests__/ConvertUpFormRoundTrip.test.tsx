// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TV } from "@/classes/TokenValue";
import { defaultConvertOrderUpValues, transformConvertUpFormValues } from "@/components/Tractor/form/schema/convertUp.schema";
import ConvertUpOrderProvider, { useConvertUpOrderFormContext } from "@/components/Tractor/ConvertUp/ConvertUpTractorContext";

vi.mock("@/hooks/tractor/useGetTractorTokenStrategy", () => ({
  useGetTractorTokenStrategyWithBlueprint: () => ({ isLoading: false, getTokenStrategy: () => ({ type: "LOWEST_SEEDS" }) }),
}));
vi.mock("@/state/tractor/useTractorOperatorAverageTipPaid", () => ({ default: () => ({ data: undefined }) }));
let root: Root, container: HTMLDivElement, context: ReturnType<typeof useConvertUpOrderFormContext>;
function Harness() { context = useConvertUpOrderFormContext(); return null; }
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div"); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

test.each(["1", "-1", "0.000001"])("disabled seed toggle encodes zero regardless of retained %s", (seedDifference) => {
  const values = { ...defaultConvertOrderUpValues, seedDifferenceCheck: false, seedDifference };
  expect(transformConvertUpFormValues(values, 1337).seedDifference.tv.toBigInt()).toBe(0n);
  expect(transformConvertUpFormValues({ ...values, seedDifferenceCheck: true }, 1337).seedDifference.tv.toHuman()).toBe(seedDifference);
});
test.each([0n, 1n, -1_000_000n])("Modify preserves slippage and the actual seed constraint (%s)", (seed) => {
  const numeric = transformConvertUpFormValues({ ...defaultConvertOrderUpValues, slippageRatio: "0.1" }, 1337);
  const convertUpParams = Object.fromEntries(Object.entries(numeric).map(([key, value]) => [key, (value as any)?.tv ?? value]));
  convertUpParams.sourceTokenIndices = [0];
  convertUpParams.seedDifference = TV.fromBigInt(seed, 6);
  const existingOrder = { decodedData: { convertUpParams, opParams: { operatorTipAmount: TV.fromHuman("0.2", 6) } } };
  act(() => root.render(<ConvertUpOrderProvider mode="modify" existingOrder={existingOrder as any} onOpenChange={() => {}}><Harness /></ConvertUpOrderProvider>));
  const values = context.form.getValues();
  expect(values.slippageRatio).toBe("0.1");
  expect(values.seedDifferenceCheck).toBe(seed !== 0n);
  const encoded = transformConvertUpFormValues(values, 1337);
  expect(encoded.slippageRatio.tv.toBigInt()).toBe(1_000_000_000_000_000n);
  expect(encoded.seedDifference.tv.toBigInt()).toBe(seed);
});
test("canceling advanced edits restores form units and unchecked retained seed input", () => {
  act(() => root.render(<ConvertUpOrderProvider onOpenChange={() => {}}><Harness /></ConvertUpOrderProvider>));
  act(() => {
    context.form.setValue("slippageRatio", "0.1");
    context.form.setValue("seedDifference", "-2");
    context.form.setValue("seedDifferenceCheck", false);
    context.setDraftState(true);
  });
  expect(context.draftState.originalValues?.slippageRatio).toBe("0.1");
  expect(context.draftState.originalValues?.seedDifference).toBe("-2");
  act(() => { context.form.setValue("slippageRatio", "1"); context.form.reset(context.draftState.originalValues!); });
  const encoded = transformConvertUpFormValues(context.form.getValues(), 1337);
  expect(encoded.slippageRatio.tv.toBigInt()).toBe(1_000_000_000_000_000n);
  expect(encoded.seedDifference.tv.toBigInt()).toBe(0n);
});
