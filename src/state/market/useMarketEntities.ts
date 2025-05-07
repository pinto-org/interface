import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { PINTO } from "@/constants/tokens";
import { AllMarketActivityQuery } from "@/generated/gql/pintostalk/graphql";
import { Fill, Listing, Order } from "@/utils/types";
import { QueryKey } from "@tanstack/react-query";
import { useMemo } from "react";

export function useMarketEntities(data: AllMarketActivityQuery | undefined, isFetching: boolean, queryKey: QueryKey) {
  return useMemo(() => {
    const combined: (Listing | Order | Fill)[] = [];
    const isLoaded = !!data;

    if (isLoaded) {
      data.podListings.forEach((listing) => {
        const parsed: Listing = {
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
          originalPlaceInLine: TokenValue.fromBlockchain(listing.originalPlaceInLine, PODS.decimals),
          pricePerPod: TokenValue.fromBlockchain(listing.pricePerPod, PINTO.decimals),
          pricingFunction: listing.pricingFunction,
          pricingType: listing.pricingType,
          remainingAmount: TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals),
          fillPlaceInLine: listing.fill
            ? TokenValue.fromBlockchain(listing.fill.placeInLine, PODS.decimals)
            : undefined,
          start: listing.start,
          status: listing.status,
          updatedAt: Number(listing.updatedAt),
        };
        combined.push(parsed);
      });

      data.podOrders.forEach((order) => {
        const parsed: Order = {
          type: "ORDER",
          beanAmount: TokenValue.fromBlockchain(order.beanAmount, PINTO.decimals),
          beanAmountFilled: TokenValue.fromBlockchain(order.beanAmountFilled, PINTO.decimals),
          createdAt: Number(order.createdAt),
          creationHash: order.creationHash,
          historyID: order.historyID,
          id: order.id,
          maxPlaceInLine: TokenValue.fromBlockchain(order.maxPlaceInLine, PODS.decimals),
          minFillAmount: TokenValue.fromBlockchain(order.minFillAmount, PINTO.decimals),
          podAmountFilled: TokenValue.fromBlockchain(order.podAmountFilled, PODS.decimals),
          pricePerPod: TokenValue.fromBlockchain(order.pricePerPod, PINTO.decimals),
          pricingFunction: order.pricingFunction,
          pricingType: order.pricingType,
          status: order.status,
          updatedAt: Number(order.updatedAt),
        };
        combined.push(parsed);
      });

      data.podFills.forEach((fill) => {
        const parsed: Fill = {
          type: "FILL",
          id: fill.index,
          podAmount: TokenValue.fromBlockchain(fill.amount, PODS.decimals),
          beanAmountFilled: TokenValue.fromBlockchain(fill.costInBeans, PINTO.decimals),
          fromFarmer: fill.fromFarmer.id,
          toFarmer: fill.toFarmer.id,
          plotIndex: TokenValue.fromBlockchain(fill.index, PODS.decimals),
          plotPlaceInLine: TokenValue.fromBlockchain(fill.placeInLine, PODS.decimals),
          plotStart: Number(fill.start),
          listing: fill.listing
            ? {
                id: fill.listing.id,
                originalPodAmount: TokenValue.fromBlockchain(fill.listing.originalAmount, PODS.decimals),
              }
            : undefined,
          order: fill.order
            ? {
                id: fill.order.id,
                originalOrderBeans: TokenValue.fromBlockchain(fill.order.beanAmount, PINTO.decimals),
              }
            : undefined,
          createdAt: Number(fill.createdAt),
        };
        combined.push(parsed);
      });
    }

    const sorted = combined.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    return {
      data: sorted,
      isLoaded,
      isFetching: isFetching,
      queryKey,
    };
  }, [data, isFetching, queryKey]);
}
