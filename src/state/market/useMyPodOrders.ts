import { subgraphs } from "@/constants/subgraph";
import { MyPodOrdersDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useMemo } from "react";
import { useChainId } from "wagmi";

export interface UseMyPodOrdersProps {
  /** Connected wallet address to filter orders by */
  account: string | undefined;
}

/**
 * Fetches pod orders owned by the specified account.
 * Returns only active orders.
 */
export default function useMyPodOrders({ account }: UseMyPodOrdersProps) {
  const chainId = useChainId();

  const queryKey = useMemo(() => ["myPodOrders", { chainId, account: account?.toLowerCase() }], [chainId, account]);

  const query = useQuery({
    queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, MyPodOrdersDocument, {
        account: account?.toLowerCase(),
        first: 100,
        skip: 0,
      }),
    enabled: !!account,
  });

  return {
    data: query.data,
    orders: query.data?.podOrders,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isLoaded: !!query.data,
    queryKey,
  };
}
