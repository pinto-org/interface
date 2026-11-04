// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import CompactSeasonalLineChart from "@/components/charts/CompactSeasonalLineChart";
import type { UseSeasonalResult } from "@/utils/types";

vi.mock("@/constants/subgraph", () => ({ SG_FETCH_DISABLED: false }));
vi.mock("@/components/LoadingSpinner.tsx", () => ({ default: () => <span>spinner</span> }));
vi.mock("@/components/charts/MultiAxisLineChart", () => ({
  default: ({ datasets }: any) => <div data-testid="chart">{JSON.stringify(datasets.map((row: any) => row.values))}</div>,
}));
let root: Root, container: HTMLDivElement;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  root = createRoot(container);
});
afterEach(() => act(() => root.unmount()));
const point = (season: number, value: number) => ({ season, value, timestamp: new Date(season * 3600_000) });
const render = (results: UseSeasonalResult[], noData = false) => act(() => root.render(
  <CompactSeasonalLineChart titles={["Bonus"]} size="small" activeTab={0} onChangeTab={() => {}}
    useSeasonalResult={results} valueFormatter={[(v) => `Value ${v}`]} noData={noData} />,
));
const result = (data: UseSeasonalResult["data"], isLoading = false, isError = false) => ({ data, isLoading, isError });

test("initial loading transitions to an error, never an infinite spinner", () => {
  render([result(undefined, true)]);
  expect(container.querySelector('[role="status"]')).not.toBeNull();
  render([result(undefined, false, true)]);
  expect(container.textContent).toContain("Historical data unavailable");
  expect(container.textContent).not.toContain("spinner");
  expect(container.querySelector('[data-testid="chart"]')).toBeNull();
});
test("empty successful data is not still loading", () => {
  render([result([])]);
  expect(container.textContent).toContain("Insufficient data");
  expect(container.textContent).not.toContain("spinner");
});
test("zero is valid and same-length current Season updates refresh values and graph", () => {
  render([result([point(1, 1), point(2, 0)])]);
  expect(container.textContent).toContain("Value 0");
  render([result([point(1, 1), point(2, 4)])]);
  expect(container.textContent).toContain("Value 4");
  expect(container.querySelector('[data-testid="chart"]')?.textContent).toBe("[[1,4]]");
});
test("failed refresh and disabled fetching do not leave an apparently current chart", () => {
  const data = [point(1, 1), point(2, 2)];
  render([result(data)]);
  render([result(data, false, true)]);
  expect(container.querySelector('[data-testid="chart"]')).toBeNull();
  expect(container.textContent).not.toContain("Value 2");
  render([result(data)], true);
  expect(container.textContent).toContain("Unable to load");
  expect(container.querySelector('[data-testid="chart"]')).toBeNull();
});
test("range changes and unavailable ranges clear the previous data", () => {
  render([result([point(1, 10), point(2, 20)])]);
  render([result([point(3, 30), point(4, 40)])]);
  expect(container.querySelector('[data-testid="chart"]')?.textContent).toBe("[[30,40]]");
  render([result(undefined)]);
  expect(container.textContent).not.toContain("Value 40");
});
test("alignment does not mutate cached inputs and clips unequal ranges correctly", () => {
  const first = Object.freeze([point(1, 1), point(2, 2), point(3, 3)]);
  const second = Object.freeze([point(1, 10), point(2, 20)]);
  render([result(first as any), result(second as any)]);
  expect(container.querySelector('[data-testid="chart"]')?.textContent).toBe("[[1,2],[10,20]]");
  expect(first.map((p) => p.season)).toEqual([1, 2, 3]);
});
