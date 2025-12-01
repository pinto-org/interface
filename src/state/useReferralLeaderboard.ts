import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useQueryKeys } from "./useQueryKeys";

/**
 * Represents a single entry in the referral leaderboard
 */
export interface LeaderboardEntry {
  /** Position in leaderboard (1-indexed) */
  rank: number;
  /** Ethereum address of the farmer */
  farmer: string;
  /** Total referral reward pods received */
  podsEarned: TokenValue;
  /** Total Pinto sown by all referees */
  totalPintoSown: TokenValue;
  /** Number of unique referees */
  refereeCount: number;
}

/**
 * Return type for the useReferralLeaderboard hook
 */
export interface UseReferralLeaderboardReturn {
  /** Leaderboard data sorted by pods earned (descending) */
  data: LeaderboardEntry[] | undefined;
  /** True while initial data is loading */
  isLoading: boolean;
  /** True when data has been loaded at least once */
  isLoaded: boolean;
  /** True while data is being fetched (including background refetches) */
  isFetching: boolean;
  /** Error object if the query failed */
  error: Error | null;
  /** Function to manually refetch the data */
  refetch: () => Promise<void>;
}

/**
 * GraphQL query response types
 */
interface ReferralLeaderboardResponse {
  farmers: Array<{
    id: string;
    refereeCount: number;
    totalReferralRewardPodsReceived: string;
  }>;
}

interface ReferralPlotsResponse {
  plots: Array<{
    id: string;
    pods: string;
    index: string;
  }>;
}

/**
 * GraphQL query for fetching farmers with referral data
 */
const REFERRAL_LEADERBOARD_QUERY = gql`
  query ReferralLeaderboard($first: Int = 1000, $skip: Int = 0) {
    farmers(
      first: $first
      skip: $skip
      orderBy: totalReferralRewardPodsReceived
      orderDirection: desc
      where: { totalReferralRewardPodsReceived_gt: "0" }
    ) {
      id
      refereeCount
      totalReferralRewardPodsReceived
    }
  }
`;

/**
 * GraphQL query for fetching referral plots for a specific farmer
 */
const REFERRAL_PLOTS_QUERY = gql`
  query ReferralPlots($farmer: String!, $first: Int = 1000, $skip: Int = 0) {
    plots(
      first: $first
      skip: $skip
      where: { farmer: $farmer, source: REFERRAL }
    ) {
      id
      pods
      index
    }
  }
`;

/**
 * Custom React hook to fetch and process referral leaderboard data from the subgraph
 *
 * This hook fetches farmers ordered by their referral reward pods and calculates
 * the total Pinto sown by their referees. The data is cached and automatically
 * refetched every 5 minutes.
 *
 * @returns {UseReferralLeaderboardReturn} Leaderboard data and query state
 *
 * @example
 * ```tsx
 * function LeaderboardComponent() {
 *   const { data, isLoading, error, refetch } = useReferralLeaderboard();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} onRetry={refetch} />;
 *
 *   return (
 *     <table>
 *       {data?.map(entry => (
 *         <tr key={entry.farmer}>
 *           <td>{entry.rank}</td>
 *           <td>{entry.farmer}</td>
 *           <td>{entry.podsEarned.toHuman()}</td>
 *         </tr>
 *       ))}
 *     </table>
 *   );
 * }
 * ```
 */
export function useReferralLeaderboard(): UseReferralLeaderboardReturn {
  const chainId = useChainId();
  const { referralLeaderboard: queryKey } = useQueryKeys({});

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Fetch farmers with referral data
      const farmersResponse = await request<ReferralLeaderboardResponse>(
        subgraphs[chainId].beanstalk,
        REFERRAL_LEADERBOARD_QUERY,
        { first: 1000, skip: 0 },
      );

      // Process each farmer and fetch their referral plots
      const leaderboardEntries: LeaderboardEntry[] = await Promise.all(
        farmersResponse.farmers.map(async (farmer, index) => {
          // Fetch plots with source="REFERRAL" for this farmer
          const plotsResponse = await request<ReferralPlotsResponse>(
            subgraphs[chainId].beanstalk,
            REFERRAL_PLOTS_QUERY,
            { farmer: farmer.id.toLowerCase(), first: 1000, skip: 0 },
          );

          // Aggregate total Pinto sown from all referral plots
          const totalPintoSown = plotsResponse.plots.reduce((sum, plot) => {
            const plotPods = TokenValue.fromBlockchain(plot.pods, PODS.decimals);
            return sum.add(plotPods);
          }, TokenValue.ZERO);

          // Convert blockchain values to TokenValue instances
          const podsEarned = TokenValue.fromBlockchain(farmer.totalReferralRewardPodsReceived, PODS.decimals);

          return {
            rank: index + 1, // 1-indexed ranking
            farmer: farmer.id,
            podsEarned,
            totalPintoSown,
            refereeCount: farmer.refereeCount,
          };
        }),
      );

      return leaderboardEntries;
    },
    enabled: !!chainId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  const refetch = async () => {
    await query.refetch();
  };

  return useMemo(
    () => ({
      data: query.data,
      isLoading: query.isLoading,
      isLoaded: query.isSuccess,
      isFetching: query.isFetching,
      error: query.error,
      refetch,
    }),
    [query.data, query.isLoading, query.isSuccess, query.isFetching, query.error, refetch],
  );
}
