import { abiSnippets } from "@/constants/abiSnippets";
import { BARN_PAYBACK_ADDRESS } from "@/constants/address";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { PublicClient, parseAbiItem } from "viem";
import { usePublicClient, useReadContract } from "wagmi";

/**
 * Hook that fetches all active fertilizer IDs from the BarnPayback contract.
 *
 * Strategy:
 *   1. Call fert() → get fertFirst, fertLast, activeFertilizer
 *   2. If activeFertilizer == 0 && fertFirst == 0 → no fertilizers exist, bail out
 *   3. Collect unique IDs from TransferSingle/TransferBatch events on the BarnPayback contract
 */

const DEPLOYMENT_BLOCK = 42040733n;
const BARN_PAYBACK = BARN_PAYBACK_ADDRESS as `0x${string}`;

const transferSingleEvent = parseAbiItem(
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
);

const transferBatchEvent = parseAbiItem(
  "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
);

export interface FertData {
  fertilizedIndex: bigint;
  unfertilizedIndex: bigint;
  fertilizedPaidIndex: bigint;
  leftoverBeans: bigint;
  activeFertilizer: bigint;
  fertFirst: bigint;
  fertLast: bigint;
  bpf: bigint;
}

/** Fetch unique fertilizer IDs from event logs */
async function fetchFertilizerIds(publicClient: PublicClient): Promise<bigint[]> {
  const uniqueIds = new Set<bigint>();

  // Scan TransferSingle events
  const singleLogs = await publicClient.getLogs({
    address: BARN_PAYBACK,
    event: transferSingleEvent,
    fromBlock: DEPLOYMENT_BLOCK,
    toBlock: "latest",
  });

  for (const log of singleLogs) {
    if (log.args.id !== undefined) {
      uniqueIds.add(log.args.id);
    }
  }

  // Scan TransferBatch events
  const batchLogs = await publicClient.getLogs({
    address: BARN_PAYBACK,
    event: transferBatchEvent,
    fromBlock: DEPLOYMENT_BLOCK,
    toBlock: "latest",
  });

  for (const log of batchLogs) {
    if (log.args.ids) {
      for (const id of log.args.ids) {
        uniqueIds.add(id);
      }
    }
  }

  return Array.from(uniqueIds).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

export function useAllFertilizerIds() {
  const publicClient = usePublicClient();

  // Step 1: fert() call — get contract state
  const fertQuery = useReadContract({
    address: BARN_PAYBACK,
    abi: abiSnippets.barnPayback,
    functionName: "fert",
    query: {
      staleTime: 5 * 60 * 1000,
    },
  });

  // Parse fert() results
  const fertData = useMemo((): FertData | null => {
    if (!fertQuery.data) return null;
    const result = fertQuery.data as readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
    return {
      fertilizedIndex: result[0],
      unfertilizedIndex: result[1],
      fertilizedPaidIndex: result[2],
      leftoverBeans: result[3],
      activeFertilizer: result[4],
      fertFirst: result[5],
      fertLast: result[6],
      bpf: result[7],
    };
  }, [fertQuery.data]);

  const hasActiveFert = fertData ? !(fertData.activeFertilizer === 0n && fertData.fertFirst === 0n) : false;

  // Step 2: Scan event logs — cached via React Query (staleTime: 1 hour)
  const idsQuery = useQuery({
    queryKey: ["beanstalk", "fertilizerIds", "eventScan"],
    queryFn: () => fetchFertilizerIds(publicClient as PublicClient),
    enabled: !!publicClient && !!fertData && hasActiveFert,
    staleTime: 60 * 60 * 1000, // 1 hour — these IDs rarely change
    gcTime: 60 * 60 * 1000, // keep in cache 1 hour after last use
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const refetch = useCallback(async () => {
    await fertQuery.refetch();
    await idsQuery.refetch();
  }, [fertQuery, idsQuery]);

  // If no active fertilizer, return empty without error
  const fertIds = !hasActiveFert ? [] : idsQuery.data ?? [];

  return {
    fertilizerIds: fertIds,
    fertData,
    isLoading: fertQuery.isLoading || (hasActiveFert && idsQuery.isLoading),
    isError: fertQuery.isError || (hasActiveFert && idsQuery.isError),
    refetch,
  };
}
