import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
// TODO: Uncomment after subgraph is deployed and codegen is run
// import { UserReferralProfileDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useAccount, useChainId } from "wagmi";
import useTokenData from "../useTokenData";

// TODO: Remove after codegen - temporary inline query
const UserReferralProfileDocument = gql`
  query UserReferralProfile($account: Bytes!) {
    referrerProfile(id: $account) {
      id
      totalPodsEarned
      totalSuccessfulReferrals
      totalPodsCreatedFromReferrals
      totalPintoSownFromReferrals
      firstReferralTimestamp
      lastReferralTimestamp
    }
    globalReferralStats(id: "global") {
      totalReferrers
      totalReferralSows
    }
  }
`;

// Query to calculate rank by counting profiles with more pods
const RankCalculationDocument = gql`
  query RankCalculation($totalPodsEarned: BigInt!) {
    referrerProfiles(
      where: { totalPodsEarned_gt: $totalPodsEarned }
    ) {
      id
    }
  }
`;

interface UserReferralProfileResponse {
  referrerProfile: {
    id: string;
    totalPodsEarned: string;
    totalSuccessfulReferrals: number;
    totalPodsCreatedFromReferrals: string;
    totalPintoSownFromReferrals: string;
    firstReferralTimestamp: string;
    lastReferralTimestamp: string;
  } | null;
  globalReferralStats: {
    totalReferrers: number;
    totalReferralSows: number;
  } | null;
}

interface RankCalculationResponse {
  referrerProfiles: Array<{ id: string }>;
}

export interface UserReferralProfile {
  podDestinationAddress: string;
  totalPodsEarned: TokenValue;
  totalSuccessfulReferrals: number;
  rank: number;
  totalReferrers: number;
  rankDisplay: string;
  totalReferralSows: number;
  totalPodsCreatedFromReferrals: TokenValue;
  totalPintoSownFromReferrals: TokenValue;
  firstReferralDate: Date;
  lastReferralDate: Date;
}

export interface UseUserReferralProfileReturn {
  data: UserReferralProfile | null;
  isLoading: boolean;
  isError: boolean;
  queryKey: string[];
}

export function useUserReferralProfile(): UseUserReferralProfileReturn {
  const chainId = useChainId();
  const { address } = useAccount();
  const tokenData = useTokenData();

  const queryKey = ["userReferralProfile", chainId.toString(), address ?? ""];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // First, fetch user profile
      const profileData = await request<UserReferralProfileResponse>(
        subgraphs[chainId].beanstalk,
        UserReferralProfileDocument,
        { account: address?.toLowerCase() as `0x${string}` },
      );

      if (!profileData.referrerProfile) {
        return null;
      }

      // Client-side rank calculation: count profiles with more pods + 1
      let rank = 1;
      try {
        const rankData = await request<RankCalculationResponse>(subgraphs[chainId].beanstalk, RankCalculationDocument, {
          totalPodsEarned: profileData.referrerProfile.totalPodsEarned,
        });
        rank = rankData.referrerProfiles.length + 1;
      } catch (e) {
        console.warn("Failed to calculate rank:", e);
      }

      return {
        profile: profileData.referrerProfile,
        globalStats: profileData.globalReferralStats,
        rank,
      };
    },
    enabled: !!address,
    select: (data) => {
      if (!data) return null;

      const { profile, globalStats, rank } = data;
      const totalReferrers = globalStats?.totalReferrers || 0;

      return {
        podDestinationAddress: profile.id,
        totalPodsEarned: TokenValue.fromBlockchain(profile.totalPodsEarned, PODS.decimals),
        totalSuccessfulReferrals: profile.totalSuccessfulReferrals,
        rank,
        totalReferrers,
        rankDisplay: `#${rank}/${totalReferrers}`,
        totalReferralSows: globalStats?.totalReferralSows || 0,
        totalPodsCreatedFromReferrals: TokenValue.fromBlockchain(profile.totalPodsCreatedFromReferrals, PODS.decimals),
        totalPintoSownFromReferrals: TokenValue.fromBlockchain(
          profile.totalPintoSownFromReferrals,
          tokenData.mainToken.decimals,
        ),
        firstReferralDate: new Date(Number(profile.firstReferralTimestamp) * 1000),
        lastReferralDate: new Date(Number(profile.lastReferralTimestamp) * 1000),
      };
    },
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    queryKey,
  };
}
