import { subgraphs } from "@/constants/subgraph";
import { AllPodListingsDocument } from "@/generated/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useChainId } from "wagmi";
import { useHarvestableIndex } from "../useFieldData";
import { useMemo } from "react";
import { useQueryKeys } from "../useQueryKeys";

export default function usePodListings() {
  const chainId = useChainId();
  const harvestableIndex = useHarvestableIndex();

  const { allPodListings: queryKey } = useQueryKeys({ chainId, harvestableIndex });

  const podListings = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, AllPodListingsDocument, {
        maxHarvestableIndex: harvestableIndex.toBigInt().toString(),
        skip: 0,
      }),
    enabled: harvestableIndex.gt(0),
  });

  return {
    data: podListings.data,
    isLoaded: !!podListings.data,
    isFetching: podListings.isFetching,
    queryKey: queryKey,
  };
}
