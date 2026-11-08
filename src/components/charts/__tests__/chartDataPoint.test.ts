import type { UTCTimestamp } from "lightweight-charts";
import { describe, expect, it } from "vitest";
import { getChartDataPoint } from "../chartDataPoint";

const prices = [
  { time: 1793412057 as UTCTimestamp, value: 0.032, customValues: { season: 17027 } },
  { time: 1793415657 as UTCTimestamp, value: 0.033, customValues: { season: 17028 } },
];

describe("chart legend with unavailable series", () => {
  it.each(["first", "last"] as const)(
    "keeps %s values under their own labels when the first series is empty",
    (mode) => {
      const point = getChartDataPoint([[], prices, []], 3, mode);
      expect(point?.value).toEqual([undefined, mode === "first" ? 0.032 : 0.033, undefined]);
      expect(point?.season).toBe(mode === "first" ? 17027 : 17028);
    },
  );
  it("does not invent a data point when every series is unavailable", () => {
    expect(getChartDataPoint([[], []], 2, "last")).toBeUndefined();
  });
});
