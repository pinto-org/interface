import { YAxisRangeConfig } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";

/**
 * Utility function to calculate better y-axis ranges for temperature data
 * Ensures reasonable buffer that shows oscillation without being excessive
 */
export const calculateTemperatureYAxisRanges = (
  data: Array<{ value: number }> | undefined,
): {
  [TimeTab.Week]?: YAxisRangeConfig;
  [TimeTab.Month]?: YAxisRangeConfig;
  [TimeTab.AllTime]?: YAxisRangeConfig;
} => {
  if (!data || data.length === 0) return {};

  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  // For temperature graphs, ensure a reasonable buffer that shows oscillation without being excessive
  // Use a percentage-based approach with a more conservative minimum
  const bufferPercentage = Math.max(range * 0.3, range + 2); // 30% of range or add 2pp to range, whichever is larger
  const percentageBuffer = Math.min(bufferPercentage, minValue * 0.005); // But cap it at 0.5% of the actual value

  const bufferMin = Math.max(0, minValue - percentageBuffer);
  const bufferMax = maxValue + percentageBuffer;

  const rangeConfig: YAxisRangeConfig = {
    min: bufferMin,
    max: bufferMax,
  };

  return {
    [TimeTab.Week]: rangeConfig,
    [TimeTab.Month]: rangeConfig,
    [TimeTab.AllTime]: rangeConfig,
  };
};

/**
 * Utility function to calculate y-axis minimum for silo value charts
 * Sets minimum to 5% below lowest point or 0 if that would be negative
 */
export const calculateSiloValueYAxisMin = (values: number[]): number => {
  if (!values || values.length === 0) return 0;

  const minValue = Math.min(...values);
  const belowMin = minValue * 0.95; // 5% below means multiply by 0.95

  if (belowMin < 1) {
    return 0;
  }
  return belowMin;
};
