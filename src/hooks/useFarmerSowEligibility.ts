import { TokenValue } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";

const MINIMUM_SOW_REQUIREMENT = TokenValue.fromHuman(1000, PINTO.decimals);

export interface FarmerSowEligibility {
  /** Total beans sown by farmer for referral eligibility */
  totalBeansSown: TokenValue;
  /** Whether farmer meets minimum sow requirement */
  meetsRequirement: boolean;
  /** Amount still needed to meet requirement */
  amountNeeded: TokenValue;
  /** Progress percentage (0-100) */
  progressPercentage: number;
  /** Loading state while fetching from contract */
  isLoading: boolean;
}

/**
 * Hook to check if farmer meets the minimum sow requirement for referrals.
 * Uses on-chain contract calls to check eligibility based on actual beans sown,
 * not pods earned (which include interest).
 *
 * Optimization: Only calls getBeansSownForReferral if user is NOT eligible (for progress display).
 * If user is already eligible, only makes one contract call (isValidReferrer).
 */
export function useFarmerSowEligibility(): FarmerSowEligibility {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();

  // FIRST: Check eligibility status
  const eligibilityQuery = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "isValidReferrer",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 60 * 5,
    },
  });

  // SECOND: Get beans sown (ONLY if not eligible, for progress display)
  const beansSownQuery = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "getBeansSownForReferral",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && eligibilityQuery.data === false,
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchInterval: 1000 * 60 * 2,
    },
  });

  // Transform uint256 to TokenValue
  const totalBeansSown = useMemo(() => {
    if (eligibilityQuery.data === true) {
      return MINIMUM_SOW_REQUIREMENT; // At least minimum if eligible
    }
    if (beansSownQuery.data) {
      return TokenValue.fromBlockchain(beansSownQuery.data, PINTO.decimals);
    }
    return TokenValue.ZERO;
  }, [eligibilityQuery.data, beansSownQuery.data]);

  // Calculate derived values
  const meetsRequirement = useMemo(() => {
    if (eligibilityQuery.data === true) return true;
    return totalBeansSown.gte(MINIMUM_SOW_REQUIREMENT);
  }, [eligibilityQuery.data, totalBeansSown]);

  const amountNeeded = useMemo(() => {
    if (meetsRequirement) return TokenValue.ZERO;
    return MINIMUM_SOW_REQUIREMENT.sub(totalBeansSown);
  }, [meetsRequirement, totalBeansSown]);

  const progressPercentage = useMemo(() => {
    if (meetsRequirement) return 100;
    const percentage = totalBeansSown.div(MINIMUM_SOW_REQUIREMENT).mul(TokenValue.fromHuman(100, 0));
    return Math.min(percentage.toNumber(), 99);
  }, [meetsRequirement, totalBeansSown]);

  // Combine loading states
  const isLoading = useMemo(() => {
    if (eligibilityQuery.isLoading) return true;
    if (eligibilityQuery.data === false && beansSownQuery.isLoading) return true;
    return false;
  }, [eligibilityQuery.isLoading, eligibilityQuery.data, beansSownQuery.isLoading]);

  return useMemo(
    () => ({
      totalBeansSown,
      meetsRequirement,
      amountNeeded,
      progressPercentage,
      isLoading,
    }),
    [totalBeansSown, meetsRequirement, amountNeeded, progressPercentage, isLoading],
  );
}
