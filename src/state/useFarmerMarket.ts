import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount, useChainId } from "wagmi";
import { FarmerPodListingsDocument, FarmerPodOrdersDocument } from "@/generated/gql/graphql";
import { subgraphs } from "@/constants/subgraph";

export function useFarmerMarket() {
  const chainId = useChainId();
  const account = useAccount();

  const { data: listings } = useQuery({
    queryKey: ["farmerMarketListings", { chainId: chainId, variables: [account.address?.toString().toLowerCase()] }],
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerPodListingsDocument, {
        account: account.address!.toString().toLowerCase(),
        createdAt_gt: 0,
        first: 1000
      }),
    enabled: !!account.address,
  });

  const { data: orders } = useQuery({
    queryKey: ["farmerMarketOrders", { chainId: chainId, variables: [account.address?.toString().toLowerCase()] }],
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerPodOrdersDocument, {
        account: account.address!.toString().toLowerCase(),
        createdAt_gt: 0,
        first: 1000
      }),
    enabled: !!account.address,
  });

  const combined: any[] = []

  orders?.podOrders.forEach((order) => {
    const output = {
        type: "ORDER",
        ...order
    }
    combined.push(output)
  });

  listings?.podListings.forEach((listing) => {
    const output = {
        type: "LISTING",
        ...listing
    }
    combined.push(output)
  });

  const sorted = combined.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
  return sorted
}