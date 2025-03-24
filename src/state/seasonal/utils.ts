import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { UseSeasonalResult } from "@/utils/types";
import { exists } from "@/utils/utils";
import { useMemo } from "react";

/**
 * Sort seasonal data array in ascending order if needed.
 */
function sortSeasonalDataAscendingIfNeeded(seasonData: SeasonalChartData[]) {
  if (!seasonData.length) return;
  if (seasonData[0].season > seasonData[seasonData.length - 1].season) {
    seasonData.sort((a, b) => a.season - b.season);
  }
}

/**
 * Deduplicate seasonal data array by season.
 */
function deduplicateSeasonalData(seasonData: SeasonalChartData[]) {
  if (!seasonData.length) return [];

  const set = new Set<number>();
  const result: SeasonalChartData[] = [];

  for (const datum of seasonData) {
    if (!set.has(datum.season)) {
      set.add(datum.season);
      result.push(datum);
    }
  }
  return result;
}

/**
 * Validate that a seasonal data array has no missing seasons.
 * @throws {Error} if the seasonal data array is missing seasons.
 */
function validateNoMissingSeasons(seasonData: SeasonalChartData[]) {
  const earliest = seasonData[0].season;
  const latest = seasonData[seasonData.length - 1].season;

  if (latest - earliest !== seasonData.length - 1) {
    throw new Error("seasonData is missing seasons");
  }

  return { earliest, latest };
}

/**
 * Combine two seasonal queries into a single array of seasonal chart data
 *
 * This function assumes that data1 and data2 are both:
 * - data sparsed such that there is a value for every season [earliest, latest]
 *
 * In the case where two queries have different season ranges,
 * the returned data will be truncated to the earliest and latest seasons where both queries have data.
 *
 * @throws {Error} if one of the queries is missing seasons.
 *
 * @returns {SeasonalChartData[]} the combined seasonal data in ascending order.
 */
export function mergeUseSeasonalQueriesResults(
  seasonData1: UseSeasonalResult["data"],
  seasonData2: UseSeasonalResult["data"],
  combine: (hourly1: number, hourly2: number) => number,
): UseSeasonalResult["data"] {
  // If either query is missing data, return empty
  if (!seasonData1?.length || !seasonData2?.length) {
    return [];
  }

  const data1 = deduplicateSeasonalData(seasonData1);
  const data2 = deduplicateSeasonalData(seasonData2);
  sortSeasonalDataAscendingIfNeeded(data1);
  sortSeasonalDataAscendingIfNeeded(data2);

  const s1 = validateNoMissingSeasons(data1);
  const s2 = validateNoMissingSeasons(data2);

  // Find the common season range
  const earliestCommonSeason = Math.max(s1.earliest, s2.earliest);
  const latestCommonSeason = Math.min(s1.latest, s2.latest);

  // If there's no overlap, return empty
  if (earliestCommonSeason > latestCommonSeason) {
    return [] as SeasonalChartData[];
  }

  const combined: SeasonalChartData[] = [];

  // Because each array is 'full' (no missing seasons in range),
  // we can locate each season's index directly via offset.
  const offset1 = data1[0].season;
  const offset2 = data2[0].season;

  for (let season = earliestCommonSeason; season <= latestCommonSeason; season++) {
    // Index of this season within each array
    const idx1 = season - offset1;
    const idx2 = season - offset2;

    const datum1 = data1[idx1];
    const datum2 = data2[idx2];

    if (!datum1 || !datum2 || datum1.season !== datum2.season) {
      continue;
    }

    // Combine the two data points into one
    combined.push({
      ...datum1,
      value: combine(datum1.value, datum2.value),
    });
  }

  return combined;
}

export function alignChartData(datasets: SeasonalChartData[][]): SeasonalChartData[][] | undefined {
  // Step 1: Determine global min and max season
  let minSeason = Infinity;
  let maxSeason = -Infinity;

  for (const dataset of datasets) {
    // If any dataset is empty, return undefined for that dataset
    if (dataset.length === 0) {
      return undefined;
    }
    // dataset is sorted, so:
    minSeason = Math.min(minSeason, dataset[0].season);
    maxSeason = Math.max(maxSeason, dataset[dataset.length - 1].season);
  }

  if (minSeason === Infinity || maxSeason === -Infinity) {
    return undefined;
  }

  // Step 2: Clip datasets to [minSeason, maxSeason] and remove season duplicates
  const alignedDatasets = datasets.map((dataset) => {
    const filtered: SeasonalChartData[] = [];
    const seen = new Set<number>();

    for (const point of dataset) {
      if (point.season < minSeason) continue;
      if (point.season > maxSeason) break;
      if (!seen.has(point.season)) {
        filtered.push(point);
        seen.add(point.season);
      }
      // If we've already seen the season, skip duplicates
    }

    return filtered;
  });

  return alignedDatasets;
}

export interface AlignedUseSeasonalResult {
  data: SeasonalChartData[][] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useNormalizeMayMultipleSeasonalData(results: UseSeasonalResult[]): AlignedUseSeasonalResult {
  const isLoading = Boolean(results.some((r) => r.isLoading));
  const isError = Boolean(results.some((r) => r.isError));

  const resultsData = useMemo(() => {
    if (results.length && results.every((result) => result.data !== undefined)) {
      return results.map(({ data }) => data) as SeasonalChartData[][];
    }
    return undefined;
  }, [results]);

  const data = useMemo(() => {
    if (!exists(resultsData)) return undefined;
    return alignChartData(resultsData);
  }, [resultsData]);

  return useMemo(
    () => ({
      data: data,
      isLoading: isLoading,
      isError: isError,
    }),
    [data, isLoading, isError],
  );
}
