import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { SeasonalChartData } from "@/components/charts/SeasonalChart";

export default function useSeasonalStalk(fromSeason: number, toSeason: number): UseQueryResult<SeasonalChartData[]> {
  const currentSeason = useSunData().current;
  const chainId = useChainId();

  const variables = {
    from: fromSeason,
    to: toSeason,
  };

  return useQuery({
    queryKey: ["seasonalSysStalk", { chainId: chainId, season: currentSeason, variables }],
    queryFn: async () => {
      const paginateSettings: PaginationSettings<
        BeanHourlySnapshot,
        BeanSeasonalPriceQuery,
        "beanHourlySnapshots",
        typeof variables
      > = {
        primaryPropertyName: "beanHourlySnapshots",
        idField: "id",
        nextVars: (
          value1000: Partial<Pick<BeanHourlySnapshot, keyof BeanHourlySnapshot>>,
          prevVars: typeof variables,
        ) => {
          if (value1000) {
            return {
              from: Number(value1000.season),
              to: prevVars.to,
            };
          }
        },
      };
      return await paginateSubgraph(subgraphs[chainId].bean, BeanSeasonalPriceDocument, variables, paginateSettings);
    },
    select: (data) => {
      return data.map((r) => ({
        season: Number(r.season),
        value: Number(r.price),
        timestamp: new Date(Number(r.timestamp) * 1000),
      }));
    },
    enabled: !!variables.to,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 2000,
  });
}
