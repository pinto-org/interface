import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import { AllPodListingsDocument } from "@/generated/gql/graphql";
import request from "graphql-request";
import { useFieldData } from "./useFieldData";

export default function usePodListings() {

    const chainId = useChainId();
    const fieldData = useFieldData();

    const harvestableIndex = fieldData.harvestableIndex;
    const queryKey = ["allPodListings", { chainId: chainId, variables: [harvestableIndex.toHuman()] }]

    const podListings = useQuery({
        queryKey: queryKey,
        queryFn: async () =>
          request("https://graph.node.bean.money/subgraphs/name/beanstalk", AllPodListingsDocument, {
            maxHarvestableIndex: harvestableIndex.toBigInt().toString(),
            skip: 0
          }),
        enabled: harvestableIndex.gt(0),
      });

    return {
      data: podListings.data,
      queryKey: queryKey
    }

}