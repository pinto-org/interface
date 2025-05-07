import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { PINTO } from "@/constants/tokens";
import { useReadFarmer_GetPlotsFromAccount } from "@/generated/contractHooks";
import { FarmerPlotsDocument, FarmerPlotsQuery } from "@/generated/gql/pintostalk/graphql";
import { Plot } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useCallback, useMemo } from "react";
import { toHex } from "viem";
import { useAccount, useChainId } from "wagmi";
import { useHarvestableIndex } from "./useFieldData";
import { useQueryKeys } from "./useQueryKeys";

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

  const { farmerField: queryKey } = useQueryKeys({ account: account.address });

  const plotsSGQuery = useQuery({
    queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerPlotsDocument, {
        account: account.address?.toString().toLowerCase() ?? "",
      }),
    enabled: !!account.address,
    select: (response) => {
      return {
        plots: parsePlotsFromSG(response),
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

  const isLoading = plotsSGQuery.isLoading || plotsQuery.isLoading;

  return useMemo(() => {
    return {
      isLoading,
      plots: combinedPlotsData,
      totalPods: plotsQueryData?.totalPods ?? TokenValue.ZERO,
      totalUnharvestablePods: plotsQueryData?.totalUnharvestablePods ?? TokenValue.ZERO,
      totalHarvestablePods: plotsQueryData?.totalHarvestablePods ?? TokenValue.ZERO,
      queryKeys: [queryKey, plotsQuery.queryKey],
      refetch,
    };
  }, [combinedPlotsData, plotsQuery.queryKey, plotsQueryData, queryKey, refetch, isLoading]);
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
      idHex: toHex(`${plotData.index}${plotData.pods}`),
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
      idHex: toHex(`${plot.index}${plot.pods}`),
      index: TokenValue.fromBlockchain(plot.index, PODS.decimals),
      isListed: !!plot.listing,
      pods: TokenValue.fromBlockchain(plot.pods, PODS.decimals),
      season: Number(plot.season),
      source: plot.source,
      sourceHash: plot.sourceHash,
      preTransferSource: plot.preTransferSource ?? null,
      preTransferOwner: plot.preTransferOwner?.id ?? null,
      updatedAt: Number(plot.updatedAt),
      updatedAtBlock: Number(plot.updatedAtBlock),
    };
    plots.push(output);
  }

  return plots;
};
