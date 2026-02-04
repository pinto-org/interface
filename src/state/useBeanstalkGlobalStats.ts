import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useCallback, useMemo } from "react";
import { useReadContracts } from "wagmi";

/**
 * ABI snippets for Silo Payback contract global functions
 * NOTE: These functions don't exist in the protocol yet - will be indexed from subgraph later
 */
// const siloPaybackGlobalAbi = [
//   {
//     inputs: [],
//     name: "totalUrBdvDistributed",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "totalPintoPaidOut",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
// ] as const;

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
 * NOTE: This function doesn't exist in the protocol yet - will be indexed from subgraph later
 */
// const barnPaybackGlobalAbi = [
//   {
//     inputs: [],
//     name: "totalUnfertilizedSprouts",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
// ] as const;

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
// const PINTO_DECIMALS = 6;
// Token decimals for sprouts
const SPROUTS_DECIMALS = 6;

/**
 * Hook for fetching global Beanstalk repayment statistics
 *
 * This hook fetches protocol-wide statistics:
 * - Total urBDV distributed across all holders (TODO: from subgraph)
 * - Total pods in the repayment field (fieldId=1)
 * - Total unfertilized sprouts (TODO: from subgraph)
 * - Total Pinto paid out to holders (TODO: from subgraph)
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
        args: [1n], // fieldId=1 for repayment field
      },
      // TODO: These functions don't exist in the protocol yet
      // Will be indexed from subgraph later:
      // - totalUrBdvDistributed
      // - totalUnfertilizedSprouts
      // - totalPintoPaidOut
    ],
    allowFailure: true,
    query: {
      ...defaultQuerySettingsMedium, // 5 minutes staleTime for global stats
    },
  });

  // Process global data
  const globalData = useMemo(() => {
    const totalPodsInRepaymentField = globalQuery.data?.[0]?.result;

    return {
      // TODO: These will come from subgraph later
      totalUrBdvDistributed: TokenValue.fromBlockchain(0n, URBDV_DECIMALS),
      totalPodsInRepaymentField: TokenValue.fromBlockchain(totalPodsInRepaymentField ?? 0n, PODS.decimals),
      totalUnfertilizedSprouts: TokenValue.fromBlockchain(0n, SPROUTS_DECIMALS),
      totalPintoPaidOut: TokenValue.fromBlockchain(0n, URBDV_DECIMALS),
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
