import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import { TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { queryKeys } from "@/state/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

/**
 * Interface for TractorExecution event data extracted from OperatorReward events
 */
export interface TractorExecutionEvent {
  blockNumber: bigint;
  transactionHash: string;
  args: {
    operator: string;
    publisher: string;
    token: string;
    amount: bigint; // Tip amount in wei (int256 from contract)
  };
}

/**
 * Result interface for the hook
 */
export interface UseTractorExecutionEventsResult {
  data: TractorExecutionEvent[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * This hook queries the last 60 days of OperatorReward events from the TractorHelpers contract
 * and extracts tip amounts to calculate average operator tips.
 *
 * @param options - Optional configuration
 * @param options.enabled - Whether the query should run (default: true)
 * @returns Object containing event data, loading state, and error state
 */
export function useTractorExecutionEvents(options?: { enabled?: boolean }): UseTractorExecutionEventsResult {
  const publicClient = usePublicClient();
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: queryKeys.tractor.tractorExecutionEvents,
    queryFn: async () => {
      if (!publicClient) {
        throw new Error("Public client not available");
      }

      // Get the latest block
      const latestBlock = await publicClient.getBlock({ blockTag: "latest" });
      const currentBlockNumber = latestBlock.number;

      // Calculate block range for last 60 days
      // 60 days = 2 months, so we use TIME_TO_BLOCKS.month * 2
      const lookbackBlocks = TIME_TO_BLOCKS.month * 2n;
      const fromBlock = currentBlockNumber > lookbackBlocks ? currentBlockNumber - lookbackBlocks : 0n;

      console.debug("[useTractorExecutionEvents] Fetching events", {
        fromBlock: fromBlock.toString(),
        toBlock: currentBlockNumber.toString(),
        lookbackBlocks: lookbackBlocks.toString(),
      });

      // Fetch OperatorReward events from TractorHelpers contract
      const events = await publicClient.getContractEvents({
        address: TRACTOR_HELPERS_ADDRESS,
        abi: tractorHelpersABI,
        eventName: "OperatorReward",
        fromBlock,
        toBlock: "latest",
      });

      console.debug("[useTractorExecutionEvents] Fetched events", {
        count: events.length,
      });

      // Transform events to our interface format
      const transformedEvents: TractorExecutionEvent[] = events
        .map((event) => {
          const { args, blockNumber, transactionHash } = event;

          // Only include events with positive tip amounts
          if (!args || typeof args.amount !== "bigint" || args.amount <= 0n) {
            return null;
          }

          return {
            blockNumber: blockNumber,
            transactionHash: transactionHash,
            args: {
              operator: args.operator as string,
              publisher: args.publisher as string,
              token: args.token as string,
              amount: args.amount,
            },
          };
        })
        .filter((event): event is TractorExecutionEvent => event !== null);

      return transformedEvents;
    },
    enabled: enabled && !!publicClient,
    staleTime: 10 * 60 * 1000, // 10 minutes cache as specified in requirements
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
