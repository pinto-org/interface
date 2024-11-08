import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
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

  const paginateSettings: PaginationSettings<BeanSeasonalPriceQuery, "beanHourlySnapshots", typeof variables> = {
    primaryPropertyName: "beanHourlySnapshots",
    paginateField: "season",
    paginateDirection: "asc",
    loopCallback: (
      value1000: Partial<Pick<BeanHourlySnapshot, keyof BeanHourlySnapshot>>,
      prevVars: typeof variables,
    ) => ({
      from: Number(value1000.season),
      to: prevVars.to,
    }),
  };

  // Ideally order direction can be removed from the generated graphql
  // Specify paginate field
  // Specify order asc/desc
  // Specify pagination callback (accepts 1000th entry and returns new variables)

  return useQuery({
    queryKey: ["seasonalPrices", { chainId: chainId, season: currentSeason, variables }],
    queryFn: async () => {
      // return request(subgraphs[chainId].bean, BeanSeasonalPriceDocument, variables);
      return paginateSubgraph(subgraphs[chainId].bean, BeanSeasonalPriceDocument, variables, paginateSettings);
    },
    select: (data) => {
      const results = data.beanHourlySnapshots;
      return results.map((r) => ({
        season: Number(r.season),
        price: Number(r.price),
        timestamp: new Date(Number(r.timestamp) * 1000),
      }));
    },
    enabled: !!variables.to,
    staleTime: Infinity,
  });
}
