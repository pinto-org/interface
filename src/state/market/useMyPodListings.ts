import { subgraphs } from "@/constants/subgraph";
import { MyPodListingsDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useHarvestableIndex } from "../useFieldData";

export interface UseMyPodListingsProps {
  /** Connected wallet address to filter listings by */
  account: string | undefined;
}

/**
 * Fetches pod listings owned by the specified account.
 * Returns only active, non-expired listings with remaining amount > 0.10 pods.
 */
export default function useMyPodListings({ account }: UseMyPodListingsProps) {
  const chainId = useChainId();
  const harvestableIndex = useHarvestableIndex();

  const queryKey = useMemo(
    () => ["myPodListings", { chainId, account: account?.toLowerCase(), harvestableIndex: harvestableIndex.toHuman() }],
    [chainId, account, harvestableIndex],
  );

  const query = useQuery({
    queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, MyPodListingsDocument, {
        account: account?.toLowerCase(),
        maxHarvestableIndex: harvestableIndex.toBigInt().toString(),
        first: 100,
        skip: 0,
      }),
    enabled: !!account && harvestableIndex.gt(0),
  });

  return {
    data: query.data,
    listings: query.data?.podListings,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isLoaded: !!query.data,
    queryKey,
  };
}
