import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount, useChainId } from "wagmi";
import { FarmerPlotsDocument } from "@/generated/gql/graphql";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "./useTokenData";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { Listing, Order, Plot } from "@/utils/types";

export function useFarmerField() {
  const chainId = useChainId();
  const account = useAccount();
  const BEAN = useTokenData().mainToken;

  const queryKey = ["farmerField", { chainId: chainId, variables: [account.address?.toString().toLowerCase()] }];

  const { data: data, refetch: refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerPlotsDocument, {
        account: account.address?.toString().toLowerCase() ?? "",
      }),
    enabled: !!account.address,
  });

  const plots: Plot[] = [];
  const orders: Order[] = [];
  const listings: Listing[] = [];

  if (data && data.farmer) {
    data.farmer.plots.forEach((plot) => {
      const output: Plot = {
        beansPerPod: TokenValue.fromBlockchain(plot.beansPerPod, BEAN.decimals),
        createdAt: Number(plot.createdAt),
        creationHash: plot.creationHash,
        fullyHarvested: plot.fullyHarvested,
        harvestablePods: TokenValue.fromBlockchain(plot.harvestablePods, PODS.decimals),
        harvestedPods: TokenValue.fromBlockchain(plot.harvestedPods, PODS.decimals),
        id: plot.id,
        index: TokenValue.fromBlockchain(plot.index, PODS.decimals),
        listing: String(plot.listing),
        pods: TokenValue.fromBlockchain(plot.pods, PODS.decimals),
        season: Number(plot.season),
        source: plot.source,
        sourceHash: plot.sourceHash,
        updatedAt: Number(plot.updatedAt),
        updatedAtBlock: Number(plot.updatedAtBlock),
      };
      plots.push(output);
    });

    data.farmer.orders.forEach((order) => {
      const output: Order = {
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
      orders.push(output);
    });

    data.farmer.listings.forEach((listing) => {
      const output: Listing = {
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
      listings.push(output);
    });
  }

  const totalPods: TokenValue = !plots ? TokenValue.ZERO : plots.reduce((total: TokenValue, plot) => total.add(plot.pods), TokenValue.ZERO);

  return { plots: plots, orders: orders, listings: listings, totalPods: totalPods, queryKey: queryKey, refetch: refetch };
}
