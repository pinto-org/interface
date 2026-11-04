// @vitest-environment jsdom
import React, { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TV } from "@/classes/TokenValue";
import FieldActivity from "@/pages/field/FieldActivity";

const fixture = vi.hoisted(() => ({
  orders: { data: undefined as any[] | undefined, isLoading: true, isError: false },
  activity: { data: undefined as any[] | undefined, isLoading: true },
  dialogMounts: 0,
}));
vi.mock("@/state/tractor/useTractorSowOrders", () => ({ useTractorSowOrderbook: () => fixture.orders }));
vi.mock("@/state/events/useFieldSowEvents", () => ({ default: () => fixture.activity }));
vi.mock("@/state/useFieldData", () => ({ useTemperature: () => ({ max: TV.ONE }) }));
vi.mock("@/state/useSunData", () => ({ useSeason: () => 100 }));
vi.mock("@/lib/Tractor", () => ({ decodeSowTractorData: () => null, unwrapSowBlueprintData: () => null }));
vi.mock("@/components/Tractor/SoilOrderbook", () => ({
  SoilOrderbookDialog: ({ open }: { open: boolean }) => {
    useEffect(() => {
      fixture.dialogMounts++;
    }, []);
    return open ? <div role="dialog">Orders</div> : null;
  },
}));

let root: Root, container: HTMLDivElement;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  fixture.orders = { data: undefined, isLoading: true, isError: false };
  fixture.activity = { data: undefined, isLoading: true };
  fixture.dialogMounts = 0;
  container = document.createElement("div");
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
function openOrders() {
  const button = [...container.querySelectorAll("button")].find((x) => x.textContent === "See all Tractor Orders");
  expect(button).toBeDefined();
  expect(button?.disabled).toBe(false);
  act(() => button?.click());
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
}

test.each(["loading", "empty", "error"])("orderbook remains reachable with %s activity/forecast", (state) => {
  if (state === "empty") {
    fixture.orders = { data: [], isLoading: false, isError: false };
    fixture.activity = { data: [], isLoading: false };
  } else if (state === "error") {
    fixture.orders = { data: undefined, isLoading: false, isError: true };
    fixture.activity = { data: undefined, isLoading: false };
  }
  act(() => root.render(<FieldActivity />));
  openOrders();
});

test("an open orderbook is not unmounted when its background forecast becomes empty or reloads", () => {
  fixture.orders.data = [{ amountSowableNextSeasonConsideringAvailableSoil: TV.ZERO }];
  fixture.orders.isLoading = false;
  fixture.activity = { data: [], isLoading: false };
  act(() => root.render(<FieldActivity />));
  openOrders();
  fixture.orders.data = [];
  act(() => root.render(<FieldActivity />));
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  fixture.orders = { data: undefined, isLoading: true, isError: false };
  fixture.activity = { data: undefined, isLoading: true };
  act(() => root.render(<FieldActivity />));
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  expect(fixture.dialogMounts).toBe(1);
});
