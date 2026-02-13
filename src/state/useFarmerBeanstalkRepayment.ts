import { TokenValue } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { BARN_PAYBACK_ADDRESS, SILO_PAYBACK_ADDRESS, ZERO_ADDRESS } from "@/constants/address";
import { BSFERT, PODS } from "@/constants/internalTokens";
import { defaultQuerySettings } from "@/constants/query";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Plot } from "@/utils/types";
import { useCallback, useMemo } from "react";
import { toHex } from "viem";
import { useAccount, useReadContracts } from "wagmi";

/**
 * Interface for silo payback data
 */
interface SiloPaybackData {
  balance: TokenValue; // getBalanceCombined(account) - total urBDV balance
  earned: TokenValue; // earned(account) - earned but unclaimed
  totalDistributed: TokenValue; // totalDistributed() - total distributed
  totalReceived: TokenValue; // totalReceived() - total received
}

/**
 * Interface for pods data from repayment field (fieldId=1)
 */
interface PodsData {
  plots: Plot[];
  totalPods: TokenValue;
}

/**
 * Interface for fertilizer data
 */
interface FertilizerData {
  balance: TokenValue; // Total bsFERT balance
  fertilized: TokenValue; // balanceOfFertilized(account, ids)
  unfertilized: TokenValue; // balanceOfUnfertilized(account, ids)
  fertilizerIds: bigint[]; // Fertilizer IDs owned by the user
}

/**
 * Interface for the complete farmer Beanstalk repayment data
 */
export interface FarmerBeanstalkRepaymentData {
  silo: SiloPaybackData;
  pods: PodsData;
  fertilizer: FertilizerData;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

// Token decimals for urBDV (same as BEAN - 6 decimals)
const URBDV_DECIMALS = 6;

/**
 * Hook for fetching farmer-specific Beanstalk repayment data
 *
 * This hook fetches:
 * - Silo payback data from Silo_Payback contract (earned, balance, totalDistributed, totalReceived)
 * - Pods data from repayment field (fieldId=1) - from on-chain
 * - Fertilizer data from Barn_Payback contract (fertilized, unfertilized balances)
 *
 * @returns FarmerBeanstalkRepaymentData with all farmer obligations data
 */
export function useFarmerBeanstalkRepayment(): FarmerBeanstalkRepaymentData {
  const account = useAccount();
  const protocolAddress = useProtocolAddress();
  const farmerAddress = account.address ?? ZERO_ADDRESS;

  // Query for pods data from repayment field (fieldId=1)
  // These are the only functions that exist in the protocol
  const podsQuery = useReadContracts({
    contracts: [
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getPlotsFromAccount",
        args: [farmerAddress, 1n], // fieldId=1 for repayment field
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "balanceOfPods",
        args: [farmerAddress, 1n], // fieldId=1 for repayment field
      },
    ],
    allowFailure: true,
    query: {
      // Always fetch - will use ZERO_ADDRESS if wallet not connected
      ...defaultQuerySettings, // 20 minutes staleTime
    },
  });

  // Query for Barn Payback (bsFERT) data from Barn_Payback contract
  // balanceOfFertilized and balanceOfUnfertilized require fertilizer IDs.
  // We pass empty arrays initially; these will return 0 until IDs are populated.
  const fertilizerIds: bigint[] = [];

  const fertilizerQuery = useReadContracts({
    contracts: [
      {
        address: BARN_PAYBACK_ADDRESS,
        abi: abiSnippets.barnPayback,
        functionName: "balanceOfFertilized",
        args: [farmerAddress, fertilizerIds],
      },
      {
        address: BARN_PAYBACK_ADDRESS,
        abi: abiSnippets.barnPayback,
        functionName: "balanceOfUnfertilized",
        args: [farmerAddress, fertilizerIds],
      },
    ],
    allowFailure: true,
    query: {
      ...defaultQuerySettings,
    },
  });

  // Query for Silo Payback data from Silo_Payback contract
  const siloQuery = useReadContracts({
    contracts: [
      {
        address: SILO_PAYBACK_ADDRESS,
        abi: abiSnippets.siloPayback,
        functionName: "earned",
        args: [farmerAddress],
      },
      {
        address: SILO_PAYBACK_ADDRESS,
        abi: abiSnippets.siloPayback,
        functionName: "getBalanceCombined",
        args: [farmerAddress],
      },
      {
        address: SILO_PAYBACK_ADDRESS,
        abi: abiSnippets.siloPayback,
        functionName: "totalDistributed",
      },
      {
        address: SILO_PAYBACK_ADDRESS,
        abi: abiSnippets.siloPayback,
        functionName: "totalReceived",
      },
    ],
    allowFailure: true,
    query: {
      ...defaultQuerySettings,
    },
  });

  // Process Silo Payback data — defaults to ZERO on error
  const siloData = useMemo((): SiloPaybackData => {
    if (siloQuery.isError) {
      return {
        balance: TokenValue.ZERO,
        earned: TokenValue.ZERO,
        totalDistributed: TokenValue.ZERO,
        totalReceived: TokenValue.ZERO,
      };
    }

    const earnedResult = siloQuery.data?.[0]?.result;
    const balanceResult = siloQuery.data?.[1]?.result;
    const totalDistributedResult = siloQuery.data?.[2]?.result;
    const totalReceivedResult = siloQuery.data?.[3]?.result;

    return {
      balance: TokenValue.fromBlockchain(balanceResult ?? 0n, URBDV_DECIMALS),
      earned: TokenValue.fromBlockchain(earnedResult ?? 0n, URBDV_DECIMALS),
      totalDistributed: TokenValue.fromBlockchain(totalDistributedResult ?? 0n, URBDV_DECIMALS),
      totalReceived: TokenValue.fromBlockchain(totalReceivedResult ?? 0n, URBDV_DECIMALS),
    };
  }, [siloQuery.data, siloQuery.isError]);

  // Process pods data — defaults to ZERO on error
  const podsData = useMemo((): PodsData => {
    if (podsQuery.isError) {
      return {
        plots: [],
        totalPods: TokenValue.ZERO,
      };
    }

    const plotsResult = podsQuery.data?.[0]?.result as readonly { index: bigint; pods: bigint }[] | undefined;
    const totalPodsResult = podsQuery.data?.[1]?.result;

    const plots: Plot[] = (plotsResult ?? []).map((plotData) => {
      const index = TokenValue.fromBigInt(plotData.index, PODS.decimals);
      const pods = TokenValue.fromBigInt(plotData.pods, PODS.decimals);

      return {
        id: index.toHuman(),
        idHex: toHex(`${plotData.index}${plotData.pods}`),
        index,
        pods,
        harvestedPods: TokenValue.ZERO,
        harvestablePods: TokenValue.ZERO,
        unharvestablePods: pods,
      };
    });

    return {
      plots,
      totalPods: TokenValue.fromBlockchain(totalPodsResult ?? 0n, PODS.decimals),
    };
  }, [podsQuery.data, podsQuery.isError]);

  // Process Barn Payback (bsFERT) data — defaults to ZERO on error
  const fertilizerData = useMemo((): FertilizerData => {
    if (fertilizerQuery.isError) {
      return {
        balance: TokenValue.ZERO,
        fertilized: TokenValue.ZERO,
        unfertilized: TokenValue.ZERO,
        fertilizerIds,
      };
    }

    const fertilizedResult = fertilizerQuery.data?.[0]?.result;
    const unfertilizedResult = fertilizerQuery.data?.[1]?.result;

    const fertilized = TokenValue.fromBlockchain(fertilizedResult ?? 0n, BSFERT.decimals);
    const unfertilized = TokenValue.fromBlockchain(unfertilizedResult ?? 0n, BSFERT.decimals);
    // Total balance is the sum of fertilized + unfertilized
    const balance = fertilized.add(unfertilized);

    return {
      balance,
      fertilized,
      unfertilized,
      fertilizerIds,
    };
  }, [fertilizerQuery.data, fertilizerQuery.isError, fertilizerIds]);

  // Refetch all queries
  const refetch = useCallback(async () => {
    await Promise.all([siloQuery.refetch(), podsQuery.refetch(), fertilizerQuery.refetch()]);
  }, [siloQuery.refetch, podsQuery.refetch, fertilizerQuery.refetch]);

  // Loading and error states from all queries
  const isLoading = siloQuery.isLoading || podsQuery.isLoading || fertilizerQuery.isLoading;
  const isError = siloQuery.isError || podsQuery.isError || fertilizerQuery.isError;

  return useMemo(
    () => ({
      silo: siloData,
      pods: podsData,
      fertilizer: fertilizerData,
      isLoading,
      isError,
      refetch,
    }),
    [siloData, podsData, fertilizerData, isLoading, isError, refetch],
  );
}
