import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { subgraphs } from "@/constants/subgraph";
import { useSunData } from "../useSunData";
import { useChainId } from "wagmi";
import { BeanSeasonalPriceDocument } from "@/generated/gql/graphql";

export default function useSeasonalPrice(fromSeason: number, toSeason: number | undefined) {
  const currentSeason = useSunData().current;
  const chainId = useChainId();

  const variables = {
    from: fromSeason,
    to: toSeason ?? currentSeason,
  };

  const query = useQuery({
    queryKey: ["seasonalPrices", { chainId: chainId, season: currentSeason, variables }],
    queryFn: async () => request(subgraphs[chainId].bean, BeanSeasonalPriceDocument, variables),
    select: (data) => {
      const results = data.beanHourlySnapshots;
      return results.map((r) => ({
        season: Number(r.season),
        price: Number(r.price),
        timestamp: new Date(r.timestamp),
      }));
    },
    enabled: !!variables.to,
    staleTime: Infinity,
  });

  return query.data ?? [];
}
