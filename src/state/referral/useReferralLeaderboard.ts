import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import type { ReferralLeaderboardQuery, ReferralLeaderboardQueryVariables } from "@/generated/gql/pintostalk/graphql";
import { ReferralLeaderboardDocument } from "@/generated/gql/pintostalk/graphql";
import { useLatestBlock } from "@/hooks/useLatestBlock";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import { stringEq } from "@/utils/string";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";

/**
 * Type aliases for codegen generated types
 */
export type FarmersLeaderboardResponse = ReferralLeaderboardQuery;
export type FarmersLeaderboardVariables = ReferralLeaderboardQueryVariables;
export type Farmer = ReferralLeaderboardQuery["farmers"][0];

/**
 * Pagination settings configuration for farmers leaderboard using the paginateSubgraph utility.
 * Implements robust pagination that prevents duplicate or missing entries during data updates.
 */
export const farmersLeaderboardPaginationSettings: PaginationSettings<
  Farmer,
  FarmersLeaderboardResponse,
  "farmers",
  FarmersLeaderboardVariables
> = {
  /** Primary property name in the GraphQL response containing the array of farmers */
  primaryPropertyName: "farmers",
  /** Field used to identify unique farmers */
  idField: "id",
  /**
   * Function to generate variables for the next page of results
   * @param lastFarmer - The last farmer from the current page
   * @param prevVars - Variables used for the previous query
   * @returns Variables for next page or undefined to terminate pagination
   */
  nextVars: (lastFarmer: Farmer, prevVars: FarmersLeaderboardVariables) => {
    // If we have fewer than 1000 results, terminate pagination
    if (!lastFarmer) {
      return undefined;
    }
    // Continue pagination with next skip value
    return {
      ...prevVars,
      skip: prevVars.skip + 1000,
    };
  },
};

/**
 * Processed leaderboard entry for display in the UI
 */
export interface LeaderboardEntry {
  /** Farmer's wallet address */
  address: string;
  /** Total pods earned from referrals as a TokenValue */
  podsEarned: TokenValue;
  /** Number of successful referrals made */
  totalSuccessfulReferrals: number;
  /** Rank position in the leaderboard (1-based) */
  rank: number;
}

/**
 * Stable select function to transform farmers data to leaderboard entries
 * Extracted outside the hook to maintain stable reference and prevent unnecessary re-renders
 */
const selectLeaderboardEntries = (farmers: Farmer[]): LeaderboardEntry[] => {
  // Transform farmers to leaderboard entries with proper ranking
  return farmers.map((farmer, index) => ({
    address: farmer.id,
    podsEarned: TokenValue.fromBlockchain(farmer.totalReferralRewardPodsReceived, PODS.decimals),
    totalSuccessfulReferrals: farmer.refereeCount,
    rank: index + 1, // Rank based on sorted order from subgraph
  }));
};

export interface UseReferralLeaderboardReturn {
  data: LeaderboardEntry[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  userRank: number | null;
}

/**
 * Hook for fetching referral leaderboard data using codegen generated query
 */
export function useReferralLeaderboard(): UseReferralLeaderboardReturn {
  const chainId = useChainId();
  const { address: userAddress } = useAccount();
  const { data: latestBlock } = useLatestBlock();

  // Use block height for pagination consistency but not in query key
  // This prevents unnecessary refetches while maintaining data consistency
  const blockHeight = latestBlock?.number ? Number(latestBlock.number) : null;

  const query = useQuery({
    queryKey: ["referralLeaderboard", chainId.toString()],
    queryFn: async () => {
      const initialVars: FarmersLeaderboardVariables = {
        first: 1000,
        skip: 0,
      };

      // Include block parameter for pagination session consistency when available
      if (blockHeight) {
        initialVars.block = { number: blockHeight };
      }

      // Execute pagination query
      return paginateSubgraph(
        farmersLeaderboardPaginationSettings,
        subgraphs[chainId].beanstalk,
        ReferralLeaderboardDocument,
        initialVars,
      );
    },
    select: selectLeaderboardEntries,
    enabled: !!chainId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Calculate user's rank in the leaderboard
  const userRank = (() => {
    // If user is not connected, return null
    if (!userAddress) {
      return null;
    }

    // If data is not loaded yet, return null
    if (!query.data) {
      return null;
    }

    // Find user's address in the leaderboard (case-insensitive comparison)
    const userIndex = query.data.findIndex((entry) => stringEq(entry.address, userAddress));

    // If user is not found in the leaderboard, return null
    if (userIndex === -1) {
      return null;
    }

    // Return 1-based rank (index + 1)
    return userIndex + 1;
  })();

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    userRank,
  };
}
