import { subgraphs } from "@/constants/subgraph";
import { FarmerMarketActivityDocument } from "@/generated/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useQueryKeys } from "../useQueryKeys";
import { useMarketEntities } from "./useMarketEntities";

export function useFarmerMarket(farmer: `0x${string}` | undefined) {
  const chainId = useChainId();

  const { farmerMarket: queryKey } = useQueryKeys({ chainId, account: farmer });

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerMarketActivityDocument, {
        // biome-ignore lint/style/noNonNullAssertion: guaranteed by `enabled` condition
        account: farmer!.toLowerCase(),
        listings_createdAt_gt: 0,
        orders_createdAt_gt: 0,
        fill_createdAt_gt: 0,
        first: 1000,
      }),
    enabled: !!farmer,
  });

  return useMarketEntities(data, isFetching, queryKey);
}
