import { subgraphs } from "@/constants/subgraph";
import { AllMarketActivityDocument } from "@/generated/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useChainId } from "wagmi";
import { useQueryKeys } from "../useQueryKeys";
import { useMarketEntities } from "./useMarketEntities";

export function useAllMarket() {
  const chainId = useChainId();

  const { allMarket: queryKey } = useQueryKeys({ chainId });

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, AllMarketActivityDocument, {
        listings_createdAt_gt: 0,
        orders_createdAt_gt: 0,
        fill_createdAt_gt: 0,
        first: 1000,
      }),
  });

  return useMarketEntities(data, isFetching, queryKey);
}
