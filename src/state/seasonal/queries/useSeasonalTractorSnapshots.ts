import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { API_SERVICES } from "@/constants/endpoints";
import { UseSeasonalResult } from "@/utils/types";
import { MayArray } from "@/utils/types.generic";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

// ==================== Base Tractor Snapshots ====================
export type BaseTractorSnapshot = {
  snapshotTimestamp: string;
  snapshotBlock: number;
  season: number;
  totalTipsPaid: string;
  currentMaxTip: string;
  totalExecutions: number;
  uniquePublishers: number;
};

type SowV0SnapshotBase = {
  totalPintoSown: string;
  totalPodsMinted: string;
  totalCascadeFundedBelowTemp: string;
  totalCascadeFundedAnyTemp: string;
  maxSowThisSeason: string;
};

type ConvertUpV0SnapshotBase = {
  totalBeansConverted: string;
  totalGsBonusStalk: string;
  totalGsBonusBdv: string;
  totalGsPenaltyStalk: string;
  totalGsPenaltyBdv: string;
  totalCascadeFunded: string;
  totalCascadeFundedExecutable: string;
};

// ==================== Full Snapshot Types ====================

export type SowV0Snapshot = BaseTractorSnapshot & SowV0SnapshotBase;

export type ConvertUpV0Snapshot = BaseTractorSnapshot & ConvertUpV0SnapshotBase;

export type AggregatedTractorSnapshot = BaseTractorSnapshot & SowV0Snapshot & ConvertUpV0Snapshot;

export type TractorSnapshotV2 = {
  SOW: SowV0Snapshot[];
  CONVERT_UP: ConvertUpV0Snapshot[];
};

type BaseTractorSnapshotResponse<T> = {
  lastUpdated: number;
  totalRecords: number;
  snapshots: T;
};

export type TractorSnapshotResponse = BaseTractorSnapshotResponse<SowV0Snapshot[]>;

export type TractorSnapshotV2Response = BaseTractorSnapshotResponse<TractorSnapshotV2>;

type TractorSnapshotOrderType = "SOW" | "CONVERT_UP";

const sortBySeasonAsc = (a: { season: number }, b: { season: number }) => a.season - b.season;
const sortBySeasonDesc = (a: { season: number }, b: { season: number }) => b.season - a.season;

export function useSeasonalTractorSnapshotsV2(
  orderTypes: MayArray<TractorSnapshotOrderType>,
  fromSeason: number,
  toSeason: number,
  selectFn: (entry: TractorSnapshotV2) => SeasonalChartData[],
  { orderBy = "asc", enabled = true } = {},
) {
  const select = useCallback(
    (data: TractorSnapshotV2Response) => {
      const sortFn = orderBy === "asc" ? sortBySeasonAsc : sortBySeasonDesc;
      return selectFn(data.snapshots).sort(sortFn);
    },
    [orderBy, selectFn],
  );

  const dataQuery = useQuery({
    queryKey: [
      "tractor",
      "snapshots",
      Array.isArray(orderTypes) ? orderTypes.join(",") : orderTypes,
      fromSeason,
      toSeason,
    ],
    queryFn: async (): Promise<TractorSnapshotV2Response> => {
      const res = await fetch(`${API_SERVICES.pinto}/tractor/v2/snapshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderTypes,
          betweenSeasons: [fromSeason, toSeason],
          limit: 50000,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const response = await res.json();
      return response;
    },
    select: select,
    staleTime: Infinity,
    gcTime: 20 * 60 * 1000,
    enabled: enabled && orderTypes && fromSeason >= 0 && toSeason > 0,
  });

  return {
    data: dataQuery.data,
    isLoading: dataQuery.isLoading,
    isError: dataQuery.isError,
  };
}

export default function useSeasonalTractorSnapshots(
  orderType: TractorSnapshotOrderType,
  fromSeason: number,
  toSeason: number,
  selectFn: (entry: SowV0Snapshot) => SeasonalChartData,
  { orderBy = "asc", enabled = true } = {},
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
    enabled: enabled && orderType && fromSeason >= 0 && toSeason > 0,
  });

  return {
    data: dataQuery.data,
    isLoading: dataQuery.isLoading,
    isError: dataQuery.isError,
  };
}
