import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { PODS } from "@/constants/internalTokens";
import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { queryKeys } from "@/state/queryKeys";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useSeason } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { MinimumViableBlock } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Address, PublicClient } from "viem";
import { usePublicClient } from "wagmi";
import { FieldSowEventItem } from "./types";

interface UseFieldSowEventsOptions {
  amount?: number;
  order?: "asc" | "desc";
}

const DEFAULT_OPTIONS: UseFieldSowEventsOptions = {
  amount: 100,
  order: "desc",
} as const;

type FieldSowEventsQueryResult = {
  data: Awaited<ReturnType<typeof getSowEvents>> | undefined;
  latestBlock: MinimumViableBlock<bigint> | undefined;
};

export default function useFieldSowEvents(options?: UseFieldSowEventsOptions) {
  // Hooks
  const diamond = useProtocolAddress();
  const client = usePublicClient();

  // State
  const harvestableIndex = useHarvestableIndex();
  const season = useSeason();

  // Options
  const amount = options?.amount ?? DEFAULT_OPTIONS.amount;
  const order = options?.order ?? DEFAULT_OPTIONS.order;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only rerender when object properties that are not referentially equal change
  const handleSelectFieldSowEvents = useCallback(
    (args: FieldSowEventsQueryResult | undefined) => {
      if (!args?.data || !args?.latestBlock || season <= 0 || harvestableIndex.lte(0)) {
        return;
      }

      return selectFieldSowEvents(args.data, args.latestBlock, season, harvestableIndex, { amount, order });
    },
    [season, harvestableIndex.blockchainString, amount, order],
  );

  return useQuery({
    queryKey: queryKeys.events.fieldSowEvents,
    queryFn: async () => {
      if (!client) return;
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      const data = await getSowEvents(client, diamond, latestBlock);
      return { data, latestBlock };
    },
    select: handleSelectFieldSowEvents,
    ...defaultQuerySettingsMedium,
  });
}

// ────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────────

const getSowEvents = async (pubclient: PublicClient, diamond: Address, block: MinimumViableBlock<bigint>) => {
  const fromBlock = block.number > TIME_TO_BLOCKS.month ? block.number - TIME_TO_BLOCKS.month : 0n;

  return pubclient.getContractEvents({
    address: diamond,
    abi: diamondABI,
    eventName: "Sow",
    fromBlock: fromBlock,
    toBlock: "latest",
  });
};

const selectFieldSowEvents = (
  events: Awaited<ReturnType<typeof getSowEvents>> | undefined,
  block: MinimumViableBlock<bigint> | undefined,
  currentSeason: number,
  harvestableIndex: TV,
  options: UseFieldSowEventsOptions,
) => {
  if (!events?.length || !block || currentSeason <= 0 || harvestableIndex.lte(0)) {
    return;
  }

  const { amount, order } = options;

  const latestBlockNumber = Number(block.number);
  const latestBlockTimestamp = Number(block.timestamp);

  const orderedEvents = order === "desc" ? [...events].reverse() : events;
  const limitedEvents = orderedEvents.slice(0, amount);

  const items: FieldSowEventItem[] = [];

  for (let index = 0; index < limitedEvents.length; index++) {
    const event = limitedEvents[index];
    const { args, blockNumber, transactionHash } = event;

    // From the ABI, Sow event has: account, fieldId, index, beans, pods
    const account = args.account || "0x0000000000000000000000000000000000000000";
    const fieldId = args.fieldId || BigInt(0);
    const podIndex = args.index || BigInt(0);
    const beans = args.beans || BigInt(0); // PINTO amount in beans
    const pods = args.pods || BigInt(0);

    // Calculate timestamp using block number difference and 2-second block time
    // Base has 2 second blocks
    const blockDiff = latestBlockNumber - Number(blockNumber);
    const timestamp = latestBlockTimestamp - blockDiff * 2;

    // Estimate the actual season based on block number
    const estimatedSeason = estimateSeasonFromBlock(Number(blockNumber), latestBlockNumber, currentSeason);

    // Convert the podIndex to a TokenValue
    const podIndexTV = TV.fromBlockchain(podIndex, PODS.decimals);

    // Get the harvestable index for calculating the place in line
    const harvestableIndexValue = harvestableIndex || TV.ZERO;

    // Calculate the actual place in line by subtracting the harvestable index
    const actualPlaceInLine = podIndexTV.sub(harvestableIndexValue);

    // Format the place in line for display
    const placeInLine = formatter.number(Math.max(0, Number(actualPlaceInLine.toHuman())));

    // Calculate temperature from the ratio of pods to beans
    // This represents the bonus percentage (pods/beans - 100%)
    const beanAmount = TV.fromBlockchain(beans.toString(), 6);
    const podAmount = TV.fromBlockchain(pods.toString(), 6);
    const rawTemperature = beanAmount.gt(0) ? Math.round(podAmount.div(beanAmount).mul(100).toNumber()) : 0;

    // Subtract 100% to get the bonus percentage
    const temperature = Math.max(0, rawTemperature - 100);

    // Add to activity items in sequence
    items.push({
      id: `${transactionHash}-${index}`,
      timestamp,
      season: estimatedSeason,
      type: "sow",
      amount: beanAmount,
      pods: podAmount,
      temperature, // Calculated temperature percentage
      placeInLine,
      address: account as string,
      txHash: transactionHash,
    });
  }

  return items;
};

/**
 * Estimates the season number for a transaction based on its block number
 * Using the knowledge that a new season starts each hour and blocks are ~2 seconds each
 */
const estimateSeasonFromBlock = (
  eventBlockNumber: number,
  latestBlockNumber: number,
  currentSeason: number | undefined,
): number | null => {
  // Return null if we don't have valid inputs yet
  if (!latestBlockNumber || !currentSeason) return null;

  // On Base, blocks are approximately 2 seconds each
  // 1 hour = 3600 seconds = ~1800 blocks per season
  const BLOCKS_PER_SEASON = 1800;

  // Calculate block difference from the latest block
  const blockDifference = latestBlockNumber - eventBlockNumber;

  // Calculate how many seasons ago this was
  const seasonsAgo = Math.floor(blockDifference / BLOCKS_PER_SEASON);

  // Calculate the estimated season (ensure it's at least 1)
  const estimatedSeason = currentSeason - seasonsAgo;
  return estimatedSeason > 0 ? estimatedSeason : null;
};
