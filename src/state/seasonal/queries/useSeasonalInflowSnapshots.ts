import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { API_SERVICES } from "@/constants/endpoints";
import { UseSeasonalResult } from "@/utils/types";
import { Query, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

type CombinedInflowSnapshot = {
  snapshotTimestamp: string;
  snapshotBlock: number;
  season: number;
  all: InflowScope;
  silo: InflowScope;
  field: InflowScope;
};

type InflowScope = {
  cumulative: InflowBreakdown;
  delta: InflowBreakdown;
};

type InflowBreakdown = {
  net: number;
  in: number;
  out: number;
  volume: number;
};

type CombinedInflowSnapshotResponse = {
  lastUpdated: number;
  snapshots: CombinedInflowSnapshot[];
  totalRecords: number;
};

export default function useSeasonalInflowSnapshots(
  fromSeason: number,
  toSeason: number,
  selectFn: (entry: CombinedInflowSnapshot) => SeasonalChartData,
  { orderBy = "asc", enabled = true } = {},
): UseSeasonalResult {
  const refetchInterval = useCallback(
    (query: Query<CombinedInflowSnapshotResponse, Error, CombinedInflowSnapshotResponse, (string | number)[]>) => {
      // Refetch every 5 seconds if the response doesn't include data up to toSeason
      // Once the data includes toSeason, refetching stops
      const data = query.state.data;
      if (!data?.snapshots?.length) return false;
      const maxSeason = Math.max(...data.snapshots.map((s) => s.season));
      return maxSeason < toSeason ? 5000 : false;
    },
    [toSeason],
  );

  const dataQuery = useQuery({
    queryKey: ["inflows", "snapshots", fromSeason, toSeason],
    queryFn: async (): Promise<CombinedInflowSnapshotResponse> => {
      const res = await fetch(`${API_SERVICES.pinto}/inflows/combined`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betweenSeasons: [fromSeason, toSeason],
          limit: 50000,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    },
    select: (data) =>
      data.snapshots
        .sort((a, b) => (orderBy === "asc" ? a.season - b.season : b.season - a.season))
        .map((d) => selectFn(d)),
    staleTime: Infinity,
    gcTime: 20 * 60 * 1000,
    enabled: enabled && fromSeason >= 0 && toSeason > 0,
    refetchInterval,
  });

  return {
    data: dataQuery.data,
    isLoading: dataQuery.isLoading,
    isError: dataQuery.isError,
  };
}
