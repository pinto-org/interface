import { TokenValue } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { BARN_PAYBACK_ADDRESS, SILO_PAYBACK_ADDRESS } from "@/constants/address";
import { PODS, SPROUTS, URBDV } from "@/constants/internalTokens";
import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useCallback, useMemo } from "react";
import { useReadContracts } from "wagmi";

/**
 * ABI snippets for Field contract global functions
 */
const fieldGlobalAbi = [
  {
    inputs: [{ internalType: "uint256", name: "fieldId", type: "uint256" }],
    name: "totalPods",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Interface for the global Beanstalk statistics data
 */
export interface BeanstalkGlobalStatsData {
  totalUrBdvDistributed: TokenValue;
  totalPodsInRepaymentField: TokenValue;
  totalUnfertilizedSprouts: TokenValue;
  totalPintoPaidOut: TokenValue;
  siloRemaining: TokenValue;
  barnRemaining: TokenValue;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

// Field ID for the Beanstalk repayment field
const BEANSTALK_REPAYMENT_FIELD_ID = 1n;

/**
 * Hook for fetching global Beanstalk repayment statistics
 *
 * This hook fetches protocol-wide statistics:
 * - Silo Payback: siloRemaining() and totalDistributed() from Silo_Payback contract
 * - Total pods in the repayment field (fieldId=1)
 * - Barn Payback: barnRemaining() from Barn_Payback contract
 * - Total Pinto paid out to holders (TODO: calculated total)
 *
 * Uses a 5-minute stale time for more frequent updates of global stats
 *
 * @returns BeanstalkGlobalStatsData with all global statistics
 */
export function useBeanstalkGlobalStats(): BeanstalkGlobalStatsData {
  const protocolAddress = useProtocolAddress();

  // Query for available global statistics (only totalPods exists in protocol)
  const globalQuery = useReadContracts({
    contracts: [
      {
        address: protocolAddress,
        abi: fieldGlobalAbi,
        functionName: "totalPods",
        args: [BEANSTALK_REPAYMENT_FIELD_ID],
      },
      // Silo Payback global stats
      {
        address: SILO_PAYBACK_ADDRESS,
        abi: abiSnippets.siloPayback,
        functionName: "siloRemaining",
      },
      {
        address: SILO_PAYBACK_ADDRESS,
        abi: abiSnippets.siloPayback,
        functionName: "totalDistributed",
      },
      // Barn Payback global stats
      {
        address: BARN_PAYBACK_ADDRESS,
        abi: abiSnippets.barnPayback,
        functionName: "barnRemaining",
      },
    ],
    allowFailure: true,
    query: {
      ...defaultQuerySettingsMedium, // 5 minutes staleTime for global stats
    },
  });

  // Process global data — defaults to ZERO on error
  const globalData = useMemo(() => {
    if (globalQuery.isError) {
      return {
        totalUrBdvDistributed: TokenValue.ZERO,
        totalPodsInRepaymentField: TokenValue.ZERO,
        totalUnfertilizedSprouts: TokenValue.ZERO,
        totalPintoPaidOut: TokenValue.ZERO,
        siloRemaining: TokenValue.ZERO,
        barnRemaining: TokenValue.ZERO,
      };
    }

    const totalPodsInRepaymentField = globalQuery.data?.[0]?.result;
    const siloRemainingResult = globalQuery.data?.[1]?.result;
    const totalDistributedResult = globalQuery.data?.[2]?.result;
    const barnRemainingResult = globalQuery.data?.[3]?.result;

    return {
      totalUrBdvDistributed: TokenValue.fromBlockchain(totalDistributedResult ?? 0n, URBDV.decimals),
      totalPodsInRepaymentField: TokenValue.fromBlockchain(totalPodsInRepaymentField ?? 0n, PODS.decimals),
      totalUnfertilizedSprouts: TokenValue.fromBlockchain(barnRemainingResult ?? 0n, SPROUTS.decimals),
      totalPintoPaidOut: TokenValue.fromBlockchain(0n, URBDV.decimals),
      siloRemaining: TokenValue.fromBlockchain(siloRemainingResult ?? 0n, URBDV.decimals),
      barnRemaining: TokenValue.fromBlockchain(barnRemainingResult ?? 0n, SPROUTS.decimals),
    };
  }, [globalQuery.data, globalQuery.isError]);

  // Refetch function
  const refetch = useCallback(async () => {
    await globalQuery.refetch();
  }, [globalQuery.refetch]);

  return useMemo(
    () => ({
      ...globalData,
      isLoading: globalQuery.isLoading,
      isError: globalQuery.isError,
      refetch,
    }),
    [globalData, globalQuery.isLoading, globalQuery.isError, refetch],
  );
}
