import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import type { FarmerReferralQuery, FarmerReferralQueryVariables } from "@/generated/gql/pintostalk/graphql";
import { FarmerReferralDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount, useChainId } from "wagmi";

export interface FarmerReferralStats {
  /** Total referral reward pods earned */
  totalPodsEarned: TokenValue;
  /** Number of successful referrals */
  refereeCount: number;
  /** Farmer's wallet address */
  address: string;
}

export interface UseFarmerReferralDataReturn {
  data: FarmerReferralStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for fetching individual farmer's referral data using codegen generated query
 */
export function useFarmerReferralData(): UseFarmerReferralDataReturn {
  const { address } = useAccount();
  const chainId = useChainId();

  const query = useQuery({
    queryKey: ["farmerReferral", address, chainId],
    queryFn: async (): Promise<FarmerReferralQuery> => {
      if (!address) throw new Error("No wallet address");

      const variables: FarmerReferralQueryVariables = {
        id: address.toLowerCase(),
      };

      return request(subgraphs[chainId].beanstalk, FarmerReferralDocument, variables);
    },
    select: (data: FarmerReferralQuery): FarmerReferralStats | null => {
      if (!data.farmer) return null;

      return {
        totalPodsEarned: TokenValue.fromBlockchain(data.farmer.totalReferralRewardPodsReceived, PODS.decimals),
        refereeCount: data.farmer.refereeCount,
        address: data.farmer.id,
      };
    },
    enabled: !!address && !!chainId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
