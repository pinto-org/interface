import { useQuery } from "@tanstack/react-query";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { BeanHourlySnapshot, BeanSeasonalPriceDocument, BeanSeasonalPriceQuery } from "@/generated/gql/graphql";
import { paginateSubgraph, PaginationSettings } from "@/utils/paginateSubgraph";

export default function useSeasonalPrice(fromSeason: number, toSeason: number) {
  const currentSeason = useSunData().current;
  // const chainId = useChainId(); // TODO(ss): put this back eventually
  const chainId = 1337;

  const variables = {
    from: fromSeason,
    to: toSeason,
  };

  return useQuery({
    queryKey: ["seasonalPrices", { chainId: chainId, season: currentSeason, variables }],
    queryFn: async () => {
      const paginateSettings: PaginationSettings<
        BeanHourlySnapshot,
        BeanSeasonalPriceQuery,
        "beanHourlySnapshots",
        typeof variables
      > = {
        primaryPropertyName: "beanHourlySnapshots",
        idField: "id",
        paginateField: "season",
        paginateDirection: "asc",
        loopCallback: (
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
      return paginateSubgraph(subgraphs[chainId].bean, BeanSeasonalPriceDocument, variables, paginateSettings);
    },
    select: (data) => {
      return data.map((r) => ({
        season: Number(r.season),
        price: Number(r.price),
        timestamp: new Date(Number(r.timestamp) * 1000),
      }));
    },
    enabled: !!variables.to,
    staleTime: Infinity,
  });
}
