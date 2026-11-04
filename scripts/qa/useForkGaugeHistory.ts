// Loaded only by the explicit QA Vite transform; never in the production entry.
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import type { GaugesInfoHourlySnapshot, SeasonalGaugesInfoQuery } from "@/generated/gql/pintostalk/graphql";
import type { ConvertEntryFn } from "@/state/seasonal/queries/useSeasonalInternalQueries";
import type { UseSeasonalResult } from "@/utils/types";

type History = { source: "local-fork-observations"; rows: SeasonalGaugesInfoQuery["gaugesInfoHourlySnapshots"] };

export default function useForkGaugeHistory(
  fromSeason: number,
  toSeason: number,
  convertResult: ConvertEntryFn<GaugesInfoHourlySnapshot>,
): UseSeasonalResult {
  const chainId = useChainId();
  const query = useQuery({
    queryKey: ["qa-fork-gauge-observations", chainId, toSeason],
    enabled: chainId === 1337 && toSeason > 0,
    queryFn: async ({ signal }): Promise<History> => {
      const response = await fetch("/__qa/gauge-history", { signal: AbortSignal.any([signal, AbortSignal.timeout(20_000)]) });
      if (!response.ok) throw new Error("Local fork gauge observations unavailable");
      const history = await response.json() as History;
      if (history.source !== "local-fork-observations" || !Array.isArray(history.rows)) throw new Error("Invalid fork history");
      return history;
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: 1,
    select: (history) => history.rows
      .filter((row) => row.season >= fromSeason && row.season <= toSeason)
      // The existing converter type describes the full entity, but consumers use
      // only this query's five fields (the same projection as the live subgraph).
      .map((row) => convertResult(row as GaugesInfoHourlySnapshot, new Date(Number(row.createdAt) * 1000))),
  });
  return { data: chainId === 1337 ? query.data : undefined, isLoading: query.isLoading, isError: query.isError || chainId !== 1337 };
}
