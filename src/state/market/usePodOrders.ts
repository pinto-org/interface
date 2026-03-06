import { subgraphs } from "@/constants/subgraph";
import { AllPodOrdersDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useChainId } from "wagmi";
import { useQueryKeys } from "../useQueryKeys";

export default function usePodOrders(podMarketplaceId?: string) {
  const chainId = useChainId();

  const { allPodOrders: queryKey } = useQueryKeys({ chainId });

  const podOrders = useQuery({
    queryKey: [...queryKey, { podMarketplaceId }],
    queryFn: async () => {
      const variables: { skip: number; podMarketplace?: string } = { skip: 0 };
      if (podMarketplaceId) variables.podMarketplace = podMarketplaceId;
      return request(subgraphs[chainId].beanstalk, AllPodOrdersDocument, variables);
    },
  });

  return {
    data: podOrders.data,
    isLoaded: !!podOrders.data,
    isFetching: podOrders.isFetching,
    queryKey: queryKey,
  };
}
