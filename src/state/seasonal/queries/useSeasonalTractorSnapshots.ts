import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { API_SERVICES } from "@/constants/endpoints";
import { UseSeasonalResult } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

type SowV0Snapshot = {
  snapshotTimestamp: string;
  snapshotBlock: number;
  season: number;
  totalPintoSown: string;
  totalPodsMinted: string;
  totalCascadeFundedBelowTemp: string;
  totalCascadeFundedAnyTemp: string;
  maxSowThisSeason: string;
  totalTipsPaid: string;
  currentMaxTip: string;
  totalExecutions: number;
  uniquePublishers: number;
};

type TractorSnapshotResponse = {
  lastUpdated: number;
  snapshots: SowV0Snapshot[];
  totalRecords: number;
};

export default function useSeasonalTractorSnapshots(
  orderType: "SOW_V0",
  fromSeason: number,
  toSeason: number,
  selectFn: (entry: SowV0Snapshot) => SeasonalChartData,
  orderBy: "asc" | "desc" = "asc",
): UseSeasonalResult {
  const dataQuery = useQuery({
    queryKey: ["tractor", "snapshots", orderType, fromSeason, toSeason],
    queryFn: async (): Promise<TractorSnapshotResponse> => {
      const res = await fetch(`${API_SERVICES.pinto}/tractor/snapshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderType,
          betweenSeasons: [fromSeason, toSeason],
          limit: 25000,
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
    enabled: orderType && fromSeason >= 0 && toSeason > 0,
  });

  return {
    data: dataQuery.data,
    isLoading: dataQuery.isLoading,
    isError: dataQuery.isError,
  };
}
