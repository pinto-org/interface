import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { BeanSeasonalPriceDocument } from "@/generated/gql/graphql";

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
      return request(subgraphs[chainId].bean, BeanSeasonalPriceDocument, variables);
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
