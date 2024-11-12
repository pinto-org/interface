import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalPriceDocument, BeanSeasonalPriceQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";
import { SeasonalChartData } from "@/components/charts/SeasonalChart";

export default function useSeasonalPrice(fromSeason: number, toSeason: number): UseQueryResult<SeasonalChartData[]> {
  // const currentSeason = useSunData().current; // TODO(ss): put this back eventually
  const currentSeason = 25942;
  const chainId = useChainId();

  const variables = {
    from: fromSeason,
    to: toSeason,
  };

  return useQuery({
    queryKey: ["seasonalPrices", { chainId: chainId, season: currentSeason, variables }],
    queryFn: async () => {
      // TEMP for testing loading/error state (TODO(ss): remove)
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
      // TODO(ss): this part can be put in a shared utility
      return data.map((r) => {
        const season = Number(r.season);
        if (season !== currentSeason) {
          // For previous seasons, the presented data is upon the season's completion,
          // add 1 hour to created timestamp.
          const snapshotCreatedDate = new Date(Number(r.timestamp) * 1000);
          const snapshotEndDate = new Date(snapshotCreatedDate.getTime() + 60 * 60 * 1000);
          return {
            season,
            value: Number(r.price),
            timestamp: snapshotEndDate,
          };
        } else {
          return {
            season,
            value: Number(r.price),
            timestamp: new Date(),
          };
        }
      });
    },
    enabled: !!variables.to,
    staleTime: Infinity,
    retry: 1,
    retryDelay: 2000,
  });
}
