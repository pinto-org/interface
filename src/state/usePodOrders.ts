import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import { AllPodOrdersDocument } from "@/generated/gql/graphql";
import request from "graphql-request";

export default function usePodOrders() {

    const chainId = useChainId();
    const queryKey = ["allPodOrders", { chainId: chainId }];

    const podOrders = useQuery({
        queryKey: queryKey,
        queryFn: async () =>
          request("https://graph.node.bean.money/subgraphs/name/beanstalk", AllPodOrdersDocument, {
            skip: 0
          }),
      });

    return { 
      data: podOrders.data,
      queryKey: queryKey
    }

}