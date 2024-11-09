import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalPriceDocument, BeanSeasonalPriceQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { SeasonalChartData } from "@/components/charts/SeasonalChart";

export default function useSeasonalPrice(fromSeason: number, toSeason: number): UseQueryResult<SeasonalChartData[]> {
  const currentSeason = useSunData().current;
  // const chainId = useChainId(); // TODO(ss): put this back eventually
  const chainId = 1337;

  const variables = {
    from: fromSeason,
    to: toSeason,
  };

  // TODO(ss): Potential improvement if a larger result is available, no need to query a smaller (i.e. all -> month)
  return useQuery({
    queryKey: ["seasonalPrices", { chainId: chainId, season: currentSeason, variables }],
    queryFn: async () => {
      // TEMP for testing loading/error state
      if (variables.from === 0) {
        throw new Error("errro");
      }
      await new Promise((res) => setTimeout(res, 70));
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
  });
}
