import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { PINTO } from "@/constants/tokens";
import { useReadFarmer_GetPlotsFromAccount } from "@/generated/contractHooks";
import { FarmerPlotsDocument, FarmerPlotsQuery } from "@/generated/gql/graphql";
import { Listing, Order, Plot } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useCallback, useEffect, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { useFieldData } from "./useFieldData";

export function useFarmerField() {
  const chainId = useChainId();
  const account = useAccount();
  const harvestableIndex = useFieldData().harvestableIndex;

  const queryKey = useMemo(
    () => ["farmerField", { chainId: chainId, variables: [account.address?.toString().toLowerCase()] }],
    [chainId, account.address],
  );

  const plotsSGQuery = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerPlotsDocument, {
        account: account.address?.toString().toLowerCase() ?? "",
      }),
    enabled: !!account.address,
    select: (response) => {
      return {
        plots: parsePlotsFromSG(response),
        orders: parseOrders(response),
        listings: parseListings(response),
      };
    },
  });

  const plotsQuery = useReadFarmer_GetPlotsFromAccount({
    args: [account.address ?? ZERO_ADDRESS, 0n],
    query: {
      enabled: !!account.address && !!harvestableIndex,
      select: (response) => parsePlotsFromChain(response, harvestableIndex),
    },
  });

  const combinedPlotsData = useMemo(() => {
    const plotsChain = plotsQuery.data?.plots ?? [];
    const plotsSG = plotsSGQuery.data?.plots ?? [];

    const plots: Plot[] = [];

    const chainQueryPlots = Object.fromEntries(plotsChain.map((plot) => [plot.index.toHuman(), plot]));

    // if plot from SG exists in response from chain query, merge the two
    for (const sgPlot of plotsSG) {
      const plotIndex = sgPlot.index.toHuman();
      if (chainQueryPlots[plotIndex]) {
        plots.push({
          ...sgPlot,
          ...chainQueryPlots[plotIndex],
        });
        delete chainQueryPlots[plotIndex];
      }
    }

    // add remaining plots from chain query that don't exist in SG response
    for (const plot of Object.values(chainQueryPlots)) {
      plots.push(plot);
    }

    plots.sort((a, b) => a.index.sub(b.index).toNumber());

    return plots;
  }, [plotsQuery.data, plotsSGQuery.data?.plots]);

  const refetch = useCallback(async () => {
    return Promise.all([plotsSGQuery.refetch(), plotsQuery.refetch()]);
  }, [plotsSGQuery.refetch, plotsQuery.refetch]);

  return useMemo(() => {
    return {
      plots: combinedPlotsData,
      orders: plotsSGQuery.data?.orders ?? [],
      listings: plotsSGQuery.data?.listings ?? [],
      totalPods: plotsQuery.data?.totalPods ?? TokenValue.ZERO,
      queryKey: queryKey,
      refetch,
    };
  }, [
    combinedPlotsData,
    plotsSGQuery.data?.orders,
    plotsSGQuery.data?.listings,
    plotsQuery.data?.totalPods,
    queryKey,
    refetch,
  ]);
}

type PlotsResponse = {
  index: bigint;
  pods: bigint;
};

const parsePlotsFromChain = (response: readonly PlotsResponse[], harvestableIndex: TokenValue) => {
  const plots: Plot[] = [];

  let totalPods: TokenValue = TokenValue.ZERO;
  response.forEach((plotData) => {
    const startIndex = TokenValue.fromBigInt(plotData.index, PODS.decimals);
    const plot = TokenValue.fromBigInt(plotData.pods, PODS.decimals);

    let pods: TokenValue;
    let harvestablePods: TokenValue;
    let harvestedPods: TokenValue;

    // Fully harvestable
    if (startIndex.add(plot).lte(harvestableIndex)) {
      pods = TokenValue.ZERO;
      harvestablePods = plot;
      harvestedPods = TokenValue.ZERO;
    }

    // Partially harvestable
    else if (startIndex.lt(harvestableIndex)) {
      const partialAmount = harvestableIndex.sub(startIndex);

      pods = plot.sub(partialAmount);
      harvestablePods = partialAmount;
      harvestedPods = plot.sub(partialAmount);
    }

    // Unharvestable
    else {
      pods = plot;
      harvestablePods = TokenValue.ZERO;
      harvestedPods = plot;
    }

    totalPods = totalPods.add(pods);

    const output: Plot = {
      fullyHarvested: false,
      harvestedPods,
      harvestablePods,
      pods,
      index: startIndex,
      id: startIndex.toHuman(),
    };
    plots.push(output);
  });

  return { plots, totalPods };
};

const parsePlotsFromSG = (response: FarmerPlotsQuery) => {
  const plots: Plot[] = [];

  for (const plot of response.farmer?.plots ?? []) {
    const output: Plot = {
      beansPerPod: TokenValue.fromBlockchain(plot.beansPerPod, PINTO.decimals),
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
  }

  return plots;
};

// data.farmer.plots.forEach((plot) => {
//   const output: Plot = {
//     beansPerPod: TokenValue.fromBlockchain(plot.beansPerPod, BEAN.decimals),
//     createdAt: Number(plot.createdAt),
//     creationHash: plot.creationHash,
//     fullyHarvested: plot.fullyHarvested,
//     harvestablePods: TokenValue.fromBlockchain(plot.harvestablePods, PODS.decimals),
//     harvestedPods: TokenValue.fromBlockchain(plot.harvestedPods, PODS.decimals),
//     id: plot.id,
//     index: TokenValue.fromBlockchain(plot.index, PODS.decimals),
//     listing: String(plot.listing),
//     pods: TokenValue.fromBlockchain(plot.pods, PODS.decimals),
//     season: Number(plot.season),
//     source: plot.source,
//     sourceHash: plot.sourceHash,
//     updatedAt: Number(plot.updatedAt),
//     updatedAtBlock: Number(plot.updatedAtBlock),
//   };
//   plots.push(output);
// });

const parseListings = (response: FarmerPlotsQuery) => {
  const listings: Listing[] = [];

  for (const listing of response?.farmer?.listings ?? []) {
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
      pricePerPod: TokenValue.fromBlockchain(listing.pricePerPod, PINTO.decimals),
      pricingFunction: listing.pricingFunction,
      pricingType: listing.pricingType,
      remainingAmount: TokenValue.fromBlockchain(listing.remainingAmount, PODS.decimals),
      start: listing.start,
      status: listing.status,
      updatedAt: Number(listing.updatedAt),
    };
    listings.push(output);
  }

  return listings;
};

const parseOrders = (response: FarmerPlotsQuery) => {
  const orders: Order[] = [];

  for (const order of response.farmer?.orders ?? []) {
    const output: Order = {
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
    orders.push(output);
  }

  return orders;
};
