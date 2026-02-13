import { TokenValue } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { BARN_PAYBACK_ADDRESS, SILO_PAYBACK_ADDRESS, ZERO_ADDRESS } from "@/constants/address";
import { BSFERT, PODS } from "@/constants/internalTokens";
import { defaultQuerySettings } from "@/constants/query";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useAllFertilizerIds } from "@/hooks/useAllFertilizerIds";
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
 * Fertilizer flow (4 phases):
 * 1. useAllFertilizerIds() — get all global fertilizer IDs from linked list
 * 2. multicall balanceOf(user, id) for each global ID
 * 3. filter IDs where balance > 0 (userOwnedIds)
 * 4. balanceOfFertilized + balanceOfUnfertilized for userOwnedIds
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
      {
        address: protocolAddress,
        abi: [
          {
            inputs: [{ name: "fieldId", type: "uint256" }],
            name: "getHarvestableIndex",
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
        ] as const,
        functionName: "getHarvestableIndex",
        args: [1n], // fieldId=1 for repayment field
      },
    ],
    allowFailure: true,
    query: {
      // Always fetch - will use ZERO_ADDRESS if wallet not connected
      ...defaultQuerySettings, // 20 minutes staleTime
    },
  });

  // --- Phase 1: Get all global fertilizer IDs from linked list ---
  const {
    fertilizerIds: allFertilizerIds,
    isLoading: fertIdsLoading,
    isError: fertIdsError,
    refetch: refetchFertIds,
  } = useAllFertilizerIds();

  // --- Phase 2: Multicall balanceOf(user, id) for each global ID ---
  const balanceChecksEnabled = allFertilizerIds.length > 0 && farmerAddress !== ZERO_ADDRESS;
  const balanceCheckContracts = useMemo(
    () =>
      allFertilizerIds.map((id) => ({
        address: BARN_PAYBACK_ADDRESS,
        abi: abiSnippets.barnPayback,
        functionName: "balanceOf" as const,
        args: [farmerAddress, id] as const,
      })),
    [allFertilizerIds, farmerAddress],
  );
  const balanceChecks = useReadContracts({
    contracts: balanceChecksEnabled ? balanceCheckContracts : [],
    allowFailure: true,
    query: {
      ...defaultQuerySettings,
      enabled: balanceChecksEnabled,
    },
  });

  // --- Phase 3: Filter IDs where balance > 0 ---
  const userOwnedIds = useMemo(() => {
    if (!balanceChecks.data) return [];
    return allFertilizerIds.filter((_, i) => {
      const result = balanceChecks.data?.[i];
      return result?.status === "success" && (result.result as bigint) > 0n;
    });
  }, [balanceChecks.data, allFertilizerIds]);

  // --- Phase 4: balanceOfFertilized + balanceOfUnfertilized for userOwnedIds ---
  const fertQueryEnabled = userOwnedIds.length > 0;
  const fertilizerQuery = useReadContracts({
    contracts: [
      {
        address: BARN_PAYBACK_ADDRESS,
        abi: abiSnippets.barnPayback,
        functionName: "balanceOfFertilized",
        args: [farmerAddress, userOwnedIds],
      },
      {
        address: BARN_PAYBACK_ADDRESS,
        abi: abiSnippets.barnPayback,
        functionName: "balanceOfUnfertilized",
        args: [farmerAddress, userOwnedIds],
      },
    ],
    allowFailure: true,
    query: {
      ...defaultQuerySettings,
      enabled: fertQueryEnabled,
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
    const harvestableIndexResult = podsQuery.data?.[2]?.result as bigint | undefined;

    const harvestableIndex = TokenValue.fromBigInt(harvestableIndexResult ?? 0n, PODS.decimals);

    const plots: Plot[] = (plotsResult ?? []).map((plotData) => {
      const index = TokenValue.fromBigInt(plotData.index, PODS.decimals);
      const pods = TokenValue.fromBigInt(plotData.pods, PODS.decimals);
      const endIndex = index.add(pods);

      let harvestablePods = TokenValue.ZERO;
      let unharvestablePods = pods;

      if (harvestableIndex.gt(index)) {
        if (harvestableIndex.gte(endIndex)) {
          harvestablePods = pods;
          unharvestablePods = TokenValue.ZERO;
        } else {
          harvestablePods = harvestableIndex.sub(index);
          unharvestablePods = pods.sub(harvestablePods);
        }
      }

      return {
        id: index.toHuman(),
        idHex: toHex(`${plotData.index}${plotData.pods}`),
        index,
        pods,
        harvestedPods: TokenValue.ZERO,
        harvestablePods,
        unharvestablePods,
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
        fertilizerIds: userOwnedIds,
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
      fertilizerIds: userOwnedIds,
    };
  }, [fertilizerQuery.data, fertilizerQuery.isError, userOwnedIds]);

  // Refetch all queries
  const refetch = useCallback(async () => {
    await Promise.all([
      siloQuery.refetch(),
      podsQuery.refetch(),
      refetchFertIds(),
      balanceChecks.refetch(),
      fertilizerQuery.refetch(),
    ]);
  }, [siloQuery.refetch, podsQuery.refetch, refetchFertIds, balanceChecks.refetch, fertilizerQuery.refetch]);

  // Loading and error states from all queries
  // Only count isError from queries that are actually enabled,
  // disabled queries can report isError spuriously
  const isLoading =
    siloQuery.isLoading ||
    podsQuery.isLoading ||
    fertIdsLoading ||
    (balanceChecksEnabled && balanceChecks.isLoading) ||
    (fertQueryEnabled && fertilizerQuery.isLoading);
  const isError =
    siloQuery.isError ||
    podsQuery.isError ||
    fertIdsError ||
    (balanceChecksEnabled && balanceChecks.isError) ||
    (fertQueryEnabled && fertilizerQuery.isError);
  (balanceChecksEnabled && balanceChecks.isError) || (fertQueryEnabled && fertilizerQuery.isError);

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
