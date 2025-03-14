import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import { AllPodOrdersDocument } from "@/generated/gql/graphql";
import request from "graphql-request";
import { subgraphs } from "@/constants/subgraph";
import { useQueryKeys } from "../useQueryKeys";

export default function usePodOrders() {
  const chainId = useChainId();

  const { allPodOrders: queryKey } = useQueryKeys({ chainId });

  const podOrders = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, AllPodOrdersDocument, {
        skip: 0,
      }),
  });

  return {
    data: podOrders.data,
    isLoaded: !!podOrders.data,
    isFetching: podOrders.isFetching,
    queryKey: queryKey,
  };
}
