import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { useQueryKeys } from "./useQueryKeys";

/**
 * Referral stats for a specific user
 */
export interface ReferralStats {
  /** Total Pods earned from referrals */
  totalPodsEarned: TokenValue;
  /** Total successful referrals (referee count) */
  totalReferrals: number;
  /** User's rank in the leaderboard (1-indexed, undefined if not ranked) */
  rank: number | undefined;
  /** Total Pods created by referrals */
  totalPodsCreated: TokenValue;
  /** Total Pinto sown by referrals */
  totalPintoSown: TokenValue;
}

/**
 * Return type for the useReferralStats hook
 */
export interface UseReferralStatsReturn {
  /** Referral stats for the connected user */
  stats: ReferralStats | undefined;
  /** True while initial data is loading */
  isLoading: boolean;
  /** True when data has been loaded at least once */
  isLoaded: boolean;
  /** Error object if the query failed */
  error: Error | null;
  /** Function to manually refetch the data */
  refetch: () => Promise<void>;
}

/**
 * GraphQL query response types
 */
interface FarmerStatsResponse {
  farmer: {
    id: string;
    refereeCount: number;
    totalReferralRewardPodsReceived: string;
  } | null;
}

interface ReferralPlotsResponse {
  plots: Array<{
    id: string;
    pods: string;
    index: string;
  }>;
}

interface LeaderboardResponse {
  farmers: Array<{
    id: string;
    totalReferralRewardPodsReceived: string;
  }>;
}

/**
 * GraphQL query for fetching a specific farmer's referral data
 */
const FARMER_STATS_QUERY = gql`
  query FarmerStats($farmer: ID!) {
    farmer(id: $farmer) {
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
 * GraphQL query for fetching leaderboard to calculate rank
 */
const LEADERBOARD_QUERY = gql`
  query Leaderboard($first: Int = 1000, $skip: Int = 0) {
    farmers(
      first: $first
      skip: $skip
      orderBy: totalReferralRewardPodsReceived
      orderDirection: desc
      where: { totalReferralRewardPodsReceived_gt: "0" }
    ) {
      id
      totalReferralRewardPodsReceived
    }
  }
`;

/**
 * Custom React hook to fetch referral stats for the connected user
 *
 * This hook fetches the user's referral data including pods earned, referee count,
 * rank in leaderboard, and total pinto sown by referees.
 *
 * @returns {UseReferralStatsReturn} User's referral stats and query state
 *
 * @example
 * ```tsx
 * function StatsComponent() {
 *   const { stats, isLoading } = useReferralStats();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <p>Pods Earned: {stats?.totalPodsEarned.toHuman()}</p>
 *       <p>Referrals: {stats?.totalReferrals}</p>
 *       <p>Rank: {stats?.rank ?? 'Unranked'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useReferralStats(): UseReferralStatsReturn {
  const { address } = useAccount();
  const chainId = useChainId();
  const { referralLeaderboard: queryKey } = useQueryKeys({});

  const query = useQuery({
    queryKey: [...queryKey, address],
    queryFn: async () => {
      if (!address) return null;

      const farmerAddress = address.toLowerCase();

      // Fetch farmer's stats
      const farmerResponse = await request<FarmerStatsResponse>(subgraphs[chainId].beanstalk, FARMER_STATS_QUERY, {
        farmer: farmerAddress,
      });

      // If farmer has no referral data, return zeros
      if (!farmerResponse.farmer || farmerResponse.farmer.totalReferralRewardPodsReceived === "0") {
        return {
          totalPodsEarned: TokenValue.ZERO,
          totalReferrals: 0,
          rank: undefined,
          totalPodsCreated: TokenValue.ZERO,
          totalPintoSown: TokenValue.ZERO,
        };
      }

      // Fetch referral plots to calculate total pinto sown
      const plotsResponse = await request<ReferralPlotsResponse>(subgraphs[chainId].beanstalk, REFERRAL_PLOTS_QUERY, {
        farmer: farmerAddress,
        first: 1000,
        skip: 0,
      });

      // Calculate total pinto sown from plots
      const totalPintoSown = plotsResponse.plots.reduce((sum, plot) => {
        const plotPods = TokenValue.fromBlockchain(plot.pods, PODS.decimals);
        return sum.add(plotPods);
      }, TokenValue.ZERO);

      // Fetch leaderboard to calculate rank
      const leaderboardResponse = await request<LeaderboardResponse>(subgraphs[chainId].beanstalk, LEADERBOARD_QUERY, {
        first: 1000,
        skip: 0,
      });

      // Find user's rank
      const rank = leaderboardResponse.farmers.findIndex((f) => f.id.toLowerCase() === farmerAddress);

      // Convert blockchain values to TokenValue
      const totalPodsEarned = TokenValue.fromBlockchain(
        farmerResponse.farmer.totalReferralRewardPodsReceived,
        PODS.decimals,
      );

      return {
        totalPodsEarned,
        totalReferrals: farmerResponse.farmer.refereeCount,
        rank: rank >= 0 ? rank + 1 : undefined, // 1-indexed
        totalPodsCreated: totalPintoSown, // Pods created = Pinto sown (1:1 ratio)
        totalPintoSown,
      };
    },
    enabled: !!chainId && !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  const refetch = async () => {
    await query.refetch();
  };

  return useMemo(
    () => ({
      stats: query.data ?? undefined,
      isLoading: query.isLoading,
      isLoaded: query.isSuccess,
      error: query.error,
      refetch,
    }),
    [query.data, query.isLoading, query.isSuccess, query.error, refetch],
  );
}
