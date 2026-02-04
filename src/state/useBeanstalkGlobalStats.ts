import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useCallback, useMemo } from "react";
import { useReadContracts } from "wagmi";

/**
 * ABI snippets for Silo Payback contract global functions
 */
const siloPaybackGlobalAbi = [
  {
    inputs: [],
    name: "totalUrBdvDistributed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPintoPaidOut",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

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
 * ABI snippets for Barn Payback contract global functions
 */
const barnPaybackGlobalAbi = [
  {
    inputs: [],
    name: "totalUnfertilizedSprouts",
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
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

// Token decimals for urBDV (same as BEAN - 6 decimals)
const URBDV_DECIMALS = 6;
// Token decimals for Pinto (6 decimals)
const PINTO_DECIMALS = 6;
// Token decimals for sprouts
const SPROUTS_DECIMALS = 6;

/**
 * Hook for fetching global Beanstalk repayment statistics
 *
 * This hook fetches protocol-wide statistics:
 * - Total urBDV distributed across all holders
 * - Total pods in the repayment field (fieldId=1)
 * - Total unfertilized sprouts
 * - Total Pinto paid out to holders
 *
 * Uses a 5-minute stale time for more frequent updates of global stats
 *
 * @returns BeanstalkGlobalStatsData with all global statistics
 */
export function useBeanstalkGlobalStats(): BeanstalkGlobalStatsData {
  const protocolAddress = useProtocolAddress();

  // Query for all global statistics
  const globalQuery = useReadContracts({
    contracts: [
      {
        address: protocolAddress,
        abi: siloPaybackGlobalAbi,
        functionName: "totalUrBdvDistributed",
        args: [],
      },
      {
        address: protocolAddress,
        abi: fieldGlobalAbi,
        functionName: "totalPods",
        args: [1n], // fieldId=1 for repayment field
      },
      {
        address: protocolAddress,
        abi: barnPaybackGlobalAbi,
        functionName: "totalUnfertilizedSprouts",
        args: [],
      },
      {
        address: protocolAddress,
        abi: siloPaybackGlobalAbi,
        functionName: "totalPintoPaidOut",
        args: [],
      },
    ],
    allowFailure: true,
    query: {
      ...defaultQuerySettingsMedium, // 5 minutes staleTime for global stats
    },
  });

  // Process global data
  const globalData = useMemo(() => {
    const totalUrBdvDistributed = globalQuery.data?.[0]?.result;
    const totalPodsInRepaymentField = globalQuery.data?.[1]?.result;
    const totalUnfertilizedSprouts = globalQuery.data?.[2]?.result;
    const totalPintoPaidOut = globalQuery.data?.[3]?.result;

    return {
      totalUrBdvDistributed: TokenValue.fromBlockchain(totalUrBdvDistributed ?? 0n, URBDV_DECIMALS),
      totalPodsInRepaymentField: TokenValue.fromBlockchain(totalPodsInRepaymentField ?? 0n, PODS.decimals),
      totalUnfertilizedSprouts: TokenValue.fromBlockchain(totalUnfertilizedSprouts ?? 0n, SPROUTS_DECIMALS),
      totalPintoPaidOut: TokenValue.fromBlockchain(totalPintoPaidOut ?? 0n, PINTO_DECIMALS),
    };
  }, [globalQuery.data]);

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
