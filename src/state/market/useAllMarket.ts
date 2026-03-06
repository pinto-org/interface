import { subgraphs } from "@/constants/subgraph";
import { AllMarketActivityDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useQueryKeys } from "../useQueryKeys";
import { useMarketEntities } from "./useMarketEntities";

export function useAllMarket(podMarketplaceId?: string) {
  const chainId = useChainId();

  const { allMarket: queryKey } = useQueryKeys({ chainId });

  const marketQueryKey = useMemo(() => [...queryKey, { podMarketplaceId }], [queryKey, podMarketplaceId]);

  const { data, isFetching } = useQuery({
    queryKey: marketQueryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, AllMarketActivityDocument, {
        listings_createdAt_gt: 0,
        orders_createdAt_gt: 0,
        fill_createdAt_gt: 0,
        first: 1000,
        listings_podMarketplace: podMarketplaceId ?? "0",
        orders_podMarketplace: podMarketplaceId ?? "0",
      }),
  });

  return useMarketEntities(data, isFetching, marketQueryKey);
}
