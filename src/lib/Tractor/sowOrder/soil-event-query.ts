import { TIME_TO_BLOCKS } from "@/constants/blocks";

export interface SoilEventQueryOptions {
  fromBlock: bigint;
  toBlock: "latest";
  args?: {
    season: number;
  };
}

export function getSoilEventQueryOptions(
  latestBlockNumber: bigint | null | undefined,
  currentSeason?: number,
): SoilEventQueryOptions {
  const hasCurrentSeason = typeof currentSeason === "number" && currentSeason > 0;
  const lookbackBlocks = hasCurrentSeason ? TIME_TO_BLOCKS.day : TIME_TO_BLOCKS.month;
  const safeLatestBlock = latestBlockNumber ?? 0n;
  const fromBlock = safeLatestBlock > lookbackBlocks ? safeLatestBlock - lookbackBlocks : 0n;

  if (hasCurrentSeason) {
    return {
      fromBlock,
      toBlock: "latest",
      args: {
        season: currentSeason,
      },
    };
  }

  return {
    fromBlock,
    toBlock: "latest",
  };
}
