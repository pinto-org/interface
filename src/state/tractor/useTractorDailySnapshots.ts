import { subgraphs } from "@/constants/subgraph";
import {
  OrderDirection,
  TractorDailySnapshotOrderBy,
  TractorDailySnapshotsDocument,
  TractorDailySnapshotsQuery,
} from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useChainId } from "wagmi";

export interface TractorDailySnapshot {
  season: number;
  deltaTotalExecutions: number;
  deltaTotalPosBeanTips: number; // Converted from BigInt string to number
  createdAt: number; // Converted from BigInt string to number (timestamp)
}

export interface UseTractorDailySnapshotsResult {
  data: TractorDailySnapshot[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook to fetch tractor daily snapshots from the subgraph.
 *
 * This hook queries the last N days of tractor execution data, including:
 * - Number of executions per day (deltaTotalExecutions)
 * - Total tips paid per day (deltaTotalPosBeanTips)
 * - Season and timestamp information
 *
 * The data is used to calculate average operator tips for the Tractor system.
 *
 * @param days - Number of days of historical data to fetch (default: 60)
 * @param options - Query options including enabled flag
 * @returns Query result with data, loading, and error states
 */
export default function useTractorDailySnapshots(
  days: number = 60,
  options?: { enabled?: boolean },
): UseTractorDailySnapshotsResult {
  const chainId = useChainId();
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: ["tractorDailySnapshots", chainId, days],
    queryFn: async (): Promise<TractorDailySnapshotsQuery> => {
      return request(subgraphs[chainId].beanstalk, TractorDailySnapshotsDocument, {
        first: days,
        orderBy: TractorDailySnapshotOrderBy.season,
        orderDirection: OrderDirection.desc,
      });
    },
    select: (data): TractorDailySnapshot[] => {
      if (!data?.tractorDailySnapshots) return [];

      return data.tractorDailySnapshots.map((snapshot) => ({
        season: snapshot.season,
        deltaTotalExecutions: snapshot.deltaTotalExecutions,
        // Convert BigInt string to number (Pinto has 6 decimals)
        deltaTotalPosBeanTips: Number(snapshot.deltaTotalPosBeanTips) / 1e6,
        // Convert BigInt timestamp to number
        createdAt: Number(snapshot.createdAt),
      }));
    },
    enabled: enabled && days > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
