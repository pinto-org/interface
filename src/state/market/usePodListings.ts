import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { PINTO } from "@/constants/tokens";
import { AllPodListingsDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useHarvestableIndex } from "../useFieldData";
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

  // Filter out listings that cannot be purchased (pricePerPod * remainingAmount < minFillAmount)
  const filteredData = useMemo(() => {
    if (!podListings.data?.podListings) {
      return podListings.data;
    }

    const filtered = podListings.data.podListings.filter((listing) => {
      const pricePerPod = TokenValue.fromBlockchain(listing.pricePerPod, PINTO.decimals);
      const remainingAmount = TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals);
      const minFillAmount = TokenValue.fromBlockchain(listing.minFillAmount, PINTO.decimals);

      // Calculate total value: pricePerPod * remainingAmount
      const totalValue = pricePerPod.mul(remainingAmount);

      // Keep only listings where totalValue >= minFillAmount
      return totalValue.gte(minFillAmount);
    });

    return {
      ...podListings.data,
      podListings: filtered,
    };
  }, [podListings.data]);

  return {
    data: filteredData,
    isLoaded: !!podListings.data,
    isFetching: podListings.isFetching,
    queryKey: queryKey,
  };
}
