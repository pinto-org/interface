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
import { useCallback, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { useHarvestableIndex } from "./useFieldData";

export function useFarmerPlotsQuery() {
  const account = useAccount();

  const plotsQuery = useReadFarmer_GetPlotsFromAccount({
    args: [account.address ?? ZERO_ADDRESS, 0n],
    query: {
      enabled: !!account.address,
      staleTime: 1000 * 60 * 20, // 20 minutes, in milliseconds
      refetchInterval: 1000 * 60 * 20, // 20 minutes, in milliseconds
    },
  });

  return plotsQuery;
}

export function useFarmerField() {
  const chainId = useChainId();
  const account = useAccount();
  const harvestableIndex = useHarvestableIndex();

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

  const plotsQuery = useFarmerPlotsQuery();

  const plotsQueryData = useMemo(() => {
    if (plotsQuery.data?.length && harvestableIndex) {
      return parsePlotsFromChain(plotsQuery.data, harvestableIndex);
    }

    return {
      plots: [],
      totalPods: TokenValue.ZERO,
      totalUnharvestablePods: TokenValue.ZERO,
      totalHarvestablePods: TokenValue.ZERO,
    };
  }, [plotsQuery, harvestableIndex]);

  const combinedPlotsData = useMemo(() => {
    const plotsChain = plotsQueryData?.plots ?? [];
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
  }, [plotsQueryData, plotsSGQuery.data?.plots]);

  const refetch = useCallback(async () => {
    return Promise.all([plotsSGQuery.refetch(), plotsQuery.refetch()]);
  }, [plotsSGQuery.refetch, plotsQuery.refetch]);

  return useMemo(() => {
    return {
      plots: combinedPlotsData,
      orders: plotsSGQuery.data?.orders ?? [],
      listings: plotsSGQuery.data?.listings ?? [],
      totalPods: plotsQueryData?.totalPods ?? TokenValue.ZERO,
      totalUnharvestablePods: plotsQueryData?.totalUnharvestablePods ?? TokenValue.ZERO,
      totalHarvestablePods: plotsQueryData?.totalHarvestablePods ?? TokenValue.ZERO,
      queryKeys: [queryKey, plotsQuery.queryKey],
      refetch,
    };
  }, [
    combinedPlotsData,
    plotsSGQuery.data?.orders,
    plotsQuery.queryKey,
    plotsSGQuery.data?.listings,
    plotsQueryData,
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
  let totalUnharvestablePods: TokenValue = TokenValue.ZERO;
  let totalHarvestablePods: TokenValue = TokenValue.ZERO;

  response.forEach((plotData) => {
    const startIndex = TokenValue.fromBigInt(plotData.index, PODS.decimals);
    const plot = TokenValue.fromBigInt(plotData.pods, PODS.decimals);

    let pods: TokenValue;
    let harvestablePods: TokenValue;
    let unharvestablePods: TokenValue;

    // Fully harvestable
    if (startIndex.add(plot).lte(harvestableIndex)) {
      pods = plot;
      harvestablePods = plot;
      unharvestablePods = TokenValue.ZERO;
    }

    // Partially harvestable
    else if (startIndex.lt(harvestableIndex)) {
      const partialAmount = harvestableIndex.sub(startIndex);

      pods = plot.sub(partialAmount);
      harvestablePods = partialAmount;
      unharvestablePods = plot.sub(partialAmount);
    }

    // Unharvestable
    else {
      pods = plot;
      harvestablePods = TokenValue.ZERO;
      unharvestablePods = plot;
    }

    totalPods = totalPods.add(pods);
    totalUnharvestablePods = totalUnharvestablePods.add(unharvestablePods);
    totalHarvestablePods = totalHarvestablePods.add(harvestablePods);

    const output: Plot = {
      harvestedPods: TokenValue.ZERO,
      harvestablePods, // harvestable pods
      unharvestablePods, // unharvestable pods
      pods, // total pods (harvestable + unharvestable)
      index: startIndex,
      id: startIndex.toHuman(),
    };
    plots.push(output);
  });

  return { plots, totalPods, totalUnharvestablePods, totalHarvestablePods };
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
