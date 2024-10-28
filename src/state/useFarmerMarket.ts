import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount, useChainId } from "wagmi";
import { FarmerPodListingsDocument, FarmerPodOrdersDocument } from "@/generated/gql/graphql";
import { subgraphs } from "@/constants/subgraph";
import { Listing, Order } from "@/utils/types";
import { TokenValue } from "@/classes/TokenValue";
import { BEAN, PODS } from "@/constants/internalTokens";
import { useMemo } from "react";

export function useFarmerMarket() {
  const chainId = useChainId();
  const account = useAccount();

  const { data: listings } = useQuery({
    queryKey: ["farmerMarketListings", { chainId: chainId, variables: [account.address?.toString().toLowerCase()] }],
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerPodListingsDocument, {
        account: account.address?.toString().toLowerCase() ?? "",
        createdAt_gt: 0,
        first: 1000,
      }),
    enabled: !!account.address,
  });

  const { data: orders } = useQuery({
    queryKey: ["farmerMarketOrders", { chainId: chainId, variables: [account.address?.toString().toLowerCase()] }],
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerPodOrdersDocument, {
        account: account.address?.toString().toLowerCase() ?? "",
        createdAt_gt: 0,
        first: 1000,
      }),
    enabled: !!account.address,
  });

  return useMemo(() => {
    const combined: (Order | Listing)[] = [];

    orders?.podOrders.forEach((order) => {
      const output: Order = {
        type: "ORDER",
        beanAmount: TokenValue.fromBlockchain(order.beanAmount, BEAN.decimals),
        beanAmountFilled: TokenValue.fromBlockchain(order.beanAmountFilled, BEAN.decimals),
        createdAt: Number(order.createdAt),
        creationHash: order.creationHash,
        historyID: order.historyID,
        id: order.id,
        maxPlaceInLine: TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals),
        minFillAmount: TokenValue.fromBlockchain(order.minFillAmount, BEAN.decimals),
        podAmountFilled: TokenValue.fromBlockchain(order.podAmountFilled, PODS.decimals),
        pricePerPod: TokenValue.fromBlockchain(order.pricePerPod, BEAN.decimals),
        pricingFunction: order.pricingFunction,
        pricingType: order.pricingType,
        status: order.status,
        updatedAt: Number(order.updatedAt),
      };
      combined.push(output);
    });

    listings?.podListings.forEach((listing) => {
      const output: Listing = {
        type: "LISTING",
        amount: TokenValue.fromBlockchain(listing.amount, PODS.decimals),
        creationHash: listing.creationHash,
        createdAt: Number(listing.createdAt),
        filled: TokenValue.fromBlockchain(listing.filled, PODS.decimals),
        filledAmount: TokenValue.fromBlockchain(listing.filledAmount, PODS.decimals),
        historyID: listing.historyID,
        id: listing.id,
        index: TokenValue.fromBlockchain(listing.index, PODS.decimals),
        maxHarvestableIndex: TokenValue.fromBlockchain(listing.maxHarvestableIndex, PODS.decimals),
        minFillAmount: TokenValue.fromBlockchain(listing.minFillAmount, PODS.decimals),
        mode: listing.mode,
        originalAmount: TokenValue.fromBlockchain(listing.originalAmount, PODS.decimals),
        originalIndex: TokenValue.fromBlockchain(listing.originalIndex, PODS.decimals),
        pricePerPod: TokenValue.fromBlockchain(listing.pricePerPod, BEAN.decimals),
        pricingFunction: listing.pricingFunction,
        pricingType: listing.pricingType,
        remainingAmount: TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals),
        start: listing.start,
        status: listing.status,
        updatedAt: Number(listing.updatedAt),
      };
      combined.push(output);
    });

    const sorted = combined.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    return sorted;
  }, [listings, orders]);
}
