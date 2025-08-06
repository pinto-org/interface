import { LineChartData } from "@/components/charts/LineChart";
import { addWeeks, startOfWeek } from "date-fns";

export interface TimeSeriesDataPoint {
  timestamp: number; // Unix timestamp in milliseconds
  values: number[]; // Array of values for multiple series
}

export interface FillMissingWeeksOptions {
  /**
   * Strategy for filling missing weeks
   * - 'forward': Use the last known values (default)
   * - 'zero': Fill with zeros
   */
  fillStrategy?: "forward" | "zero";

  /**
   * What day of the week should be considered the start of the week
   * 0 = Sunday, 1 = Monday, etc.
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Maximum number of weeks to fill (prevents infinite series)
   */
  maxWeeksToFill?: number;

  /**
   * Whether to extend the series to the current time if the last data point is old
   */
  extendToCurrentTime?: boolean;
}

/**
 * Fill missing weeks in a time series dataset with forward-fill or zero-fill strategy
 *
 * This function creates a complete weekly timeline and fills gaps where no data exists.
 * It's designed to handle the common scenario where chart data has gaps during periods
 * of no activity, making it appear as if values dropped to zero when they should
 * remain constant.
 *
 * @param data - Array of time series data points with timestamp and values
 * @param options - Configuration options for filling behavior
 * @returns New array with all weeks filled in
 */
export function fillMissingWeeksInTimeSeries(
  data: TimeSeriesDataPoint[],
  options: FillMissingWeeksOptions = {},
): TimeSeriesDataPoint[] {
  const {
    fillStrategy = "forward",
    weekStartsOn = 1, // Monday
    maxWeeksToFill = 200, // ~4 years max
    extendToCurrentTime = false,
  } = options;

  console.log(`[fillMissingWeeksInTimeSeries] Processing ${data.length} data points with strategy: ${fillStrategy}`);

  // Handle empty data
  if (!data || data.length === 0) {
    console.log(`[fillMissingWeeksInTimeSeries] Empty data, returning empty array`);
    return [];
  }

  // Validate data structure
  const isValidData = data.every(
    (point) =>
      point &&
      typeof point.timestamp === "number" &&
      Array.isArray(point.values) &&
      point.values.every((v) => typeof v === "number" && !Number.isNaN(v)),
  );

  if (!isValidData) {
    console.warn(`[fillMissingWeeksInTimeSeries] Invalid data structure, returning original data`);
    return [...data];
  }

  // Sort data by timestamp (in case it's not already sorted)
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

  // Determine the time range
  const firstTimestamp = sortedData[0].timestamp;
  const lastTimestamp = sortedData[sortedData.length - 1].timestamp;
  const currentTimestamp = extendToCurrentTime ? Date.now() : lastTimestamp;

  // Calculate week boundaries
  const firstWeekStart = startOfWeek(new Date(firstTimestamp), { weekStartsOn });
  const lastWeekStart = startOfWeek(new Date(currentTimestamp), { weekStartsOn });

  console.log(
    `[fillMissingWeeksInTimeSeries] Time range: ${new Date(firstTimestamp).toISOString()} to ${new Date(currentTimestamp).toISOString()}`,
  );
  console.log(
    `[fillMissingWeeksInTimeSeries] Week boundaries: ${firstWeekStart.toISOString()} to ${lastWeekStart.toISOString()}`,
  );

  // Generate all weekly timestamps
  const weeklyTimestamps: number[] = [];
  let currentWeekStart = firstWeekStart;
  let weekCount = 0;

  while (currentWeekStart <= lastWeekStart && weekCount < maxWeeksToFill) {
    weeklyTimestamps.push(currentWeekStart.getTime());
    currentWeekStart = addWeeks(currentWeekStart, 1);
    weekCount++;
  }

  if (weekCount >= maxWeeksToFill) {
    console.warn(`[fillMissingWeeksInTimeSeries] Hit maximum weeks limit (${maxWeeksToFill}), truncating series`);
  }

  console.log(`[fillMissingWeeksInTimeSeries] Generated ${weeklyTimestamps.length} weekly timestamps`);

  // Create a map for quick lookup of existing data
  const dataMap = new Map<number, TimeSeriesDataPoint>();

  // Map each data point to its corresponding week start
  sortedData.forEach((point) => {
    const weekStart = startOfWeek(new Date(point.timestamp), { weekStartsOn });
    const weekStartTimestamp = weekStart.getTime();

    // If multiple data points exist in the same week, use the latest one
    const existing = dataMap.get(weekStartTimestamp);
    if (!existing || point.timestamp > existing.timestamp) {
      dataMap.set(weekStartTimestamp, {
        timestamp: weekStartTimestamp, // Normalize to week start
        values: [...point.values], // Copy the values array
      });
    }
  });

  console.log(
    `[fillMissingWeeksInTimeSeries] Mapped ${dataMap.size} unique weeks from ${sortedData.length} data points`,
  );

  // Fill in missing weeks
  const filledData: TimeSeriesDataPoint[] = [];
  let lastKnownValues: number[] | null = null;

  // Determine series count from first data point
  const seriesCount = sortedData[0].values.length;

  for (const weekTimestamp of weeklyTimestamps) {
    const existingData = dataMap.get(weekTimestamp);

    if (existingData) {
      // Use actual data and update last known values
      filledData.push(existingData);
      lastKnownValues = [...existingData.values];
    } else {
      // Fill missing week
      let fillValues: number[];

      if (fillStrategy === "forward" && lastKnownValues) {
        // Forward fill with last known values
        fillValues = [...lastKnownValues];
      } else {
        // Zero fill or no previous values to forward fill
        fillValues = new Array(seriesCount).fill(0);
      }

      filledData.push({
        timestamp: weekTimestamp,
        values: fillValues,
      });
    }
  }

  console.log(
    `[fillMissingWeeksInTimeSeries] Filled data has ${filledData.length} points (added ${filledData.length - dataMap.size} missing weeks)`,
  );

  return filledData;
}

/**
 * Helper function to convert LineChartData format to TimeSeriesDataPoint format
 */
export function lineChartDataToTimeSeries(data: LineChartData[]): TimeSeriesDataPoint[] {
  return data.map((point) => ({
    timestamp: point.timestamp,
    values: [...point.values],
  }));
}

/**
 * Helper function to convert TimeSeriesDataPoint format back to LineChartData format
 */
export function timeSeriesToLineChartData(data: TimeSeriesDataPoint[]): LineChartData[] {
  return data.map((point) => ({
    timestamp: point.timestamp,
    values: [...point.values],
  }));
}

/**
 * Convenience function that works directly with LineChartData format
 */
export function fillMissingWeeksInLineChartData(
  data: LineChartData[],
  options: FillMissingWeeksOptions = {},
): LineChartData[] {
  const timeSeriesData = lineChartDataToTimeSeries(data);
  const filledTimeSeriesData = fillMissingWeeksInTimeSeries(timeSeriesData, options);
  return timeSeriesToLineChartData(filledTimeSeriesData);
}
