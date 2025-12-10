import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
// TODO: Uncomment after subgraph is deployed and codegen is run
// import { ReferralLeaderboardDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useChainId } from "wagmi";
import useTokenData from "../useTokenData";

// TODO: Remove after codegen - temporary inline query
const ReferralLeaderboardDocument = gql`
  query ReferralLeaderboard($first: Int!, $skip: Int!) {
    referrerProfiles(
      first: $first
      skip: $skip
      orderBy: totalPodsEarned
      orderDirection: desc
    ) {
      id
      totalPodsEarned
      totalPintoSownFromReferrals
      totalSuccessfulReferrals
    }
  }
`;

interface ReferralLeaderboardResponse {
  referrerProfiles: Array<{
    id: string;
    totalPodsEarned: string;
    totalPintoSownFromReferrals: string;
    totalSuccessfulReferrals: number;
  }>;
}

export interface LeaderboardEntry {
  address: string;
  podsEarned: TokenValue;
  totalPintoSown: TokenValue;
  totalSuccessfulReferrals: number;
  rank: number;
}

export interface UseReferralLeaderboardReturn {
  data: LeaderboardEntry[];
  isLoading: boolean;
  hasNextPage: boolean;
}

export function useReferralLeaderboard(pageSize = 50, page = 0): UseReferralLeaderboardReturn {
  const chainId = useChainId();
  const tokenData = useTokenData();
  const skip = page * pageSize;

  const queryKey = ["referralLeaderboard", chainId.toString(), page.toString(), pageSize.toString()];

  const query = useQuery({
    queryKey,
    queryFn: async () =>
      request<ReferralLeaderboardResponse>(subgraphs[chainId].beanstalk, ReferralLeaderboardDocument, {
        first: pageSize,
        skip,
      }),
    select: (data) => {
      // Client-side rank calculation based on skip + index
      const entries: LeaderboardEntry[] = data.referrerProfiles.map((profile, index) => ({
        address: profile.id,
        podsEarned: TokenValue.fromBlockchain(profile.totalPodsEarned, PODS.decimals),
        totalPintoSown: TokenValue.fromBlockchain(profile.totalPintoSownFromReferrals, tokenData.mainToken.decimals),
        totalSuccessfulReferrals: profile.totalSuccessfulReferrals,
        rank: skip + index + 1,
      }));

      return entries;
    },
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    hasNextPage: query.data ? query.data.length === pageSize : false,
  };
}
