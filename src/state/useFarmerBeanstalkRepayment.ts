import { TokenValue } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { BARN_PAYBACK_ADDRESS, SILO_PAYBACK_ADDRESS, ZERO_ADDRESS } from "@/constants/address";
import { BSFERT, PODS } from "@/constants/internalTokens";
import { defaultQuerySettings } from "@/constants/query";
import { PINTO } from "@/constants/tokens";
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
  harvestableIndex: TokenValue;
  podIndex: TokenValue;
}

/**
 * Per-ID fertilizer detail
 */
export interface FertilizerIdDetail {
  balance: bigint; // bsFERT balance for this ID
  sprouts: bigint; // unfertilized beans remaining (amount * max(0, id - currentBpf))
  humidity: number; // humidity percentage, e.g. 500 means 500%
}

/**
 * Interface for fertilizer data
 */
interface FertilizerData {
  balance: TokenValue; // Total bsFERT balance
  fertilized: TokenValue; // balanceOfFertilized(account, ids)
  unfertilized: TokenValue; // balanceOfUnfertilized(account, ids)
  fertilizerIds: bigint[]; // Fertilizer IDs owned by the user
  perIdData: Map<string, FertilizerIdDetail>; // Per-ID balance, sprouts, humidity
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
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "podIndex",
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
    fertData,
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

  // --- Phase 3: Filter IDs where balance > 0 and build per-ID balance map ---
  const { userOwnedIds, perIdBalances } = useMemo(() => {
    if (!balanceChecks.data) return { userOwnedIds: [] as bigint[], perIdBalances: new Map<string, bigint>() };
    const owned: bigint[] = [];
    const balances = new Map<string, bigint>();
    for (let i = 0; i < allFertilizerIds.length; i++) {
      const result = balanceChecks.data?.[i];
      if (result?.status === "success" && (result.result as bigint) > 0n) {
        const id = allFertilizerIds[i];
        owned.push(id);
        balances.set(id.toString(), result.result as bigint);
      }
    }
    return { userOwnedIds: owned, perIdBalances: balances };
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
        harvestableIndex: TokenValue.ZERO,
        podIndex: TokenValue.ZERO,
      };
    }

    const plotsResult = podsQuery.data?.[0]?.result as readonly { index: bigint; pods: bigint }[] | undefined;
    const totalPodsResult = podsQuery.data?.[1]?.result;
    const harvestableIndexResult = podsQuery.data?.[2]?.result as bigint | undefined;
    const podIndexResult = podsQuery.data?.[3]?.result as bigint | undefined;

    const harvestableIndex = TokenValue.fromBigInt(harvestableIndexResult ?? 0n, PODS.decimals);
    let podIndex = TokenValue.fromBigInt(podIndexResult ?? 0n, PODS.decimals);

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

    // If podIndex is 0 (e.g. beanstalk repayment field has no native pod index),
    // derive it from the last plot's end position
    if (podIndex.isZero && plots.length > 0) {
      const lastPlot = plots[plots.length - 1];
      podIndex = lastPlot.index.add(lastPlot.pods);
    }

    return {
      plots,
      totalPods: TokenValue.fromBlockchain(totalPodsResult ?? 0n, PODS.decimals),
      harvestableIndex,
      podIndex,
    };
  }, [podsQuery.data, podsQuery.isError]);

  // Process Barn Payback (bsFERT) data — defaults to ZERO on error
  const fertilizerData = useMemo((): FertilizerData => {
    // Build per-ID detail map with balance, sprouts, humidity
    const perIdData = new Map<string, FertilizerIdDetail>();
    const currentBpf = fertData?.bpf ?? 0n;

    for (const id of userOwnedIds) {
      const idStr = id.toString();
      const balance = perIdBalances.get(idStr) ?? 0n;
      // Sprouts (unfertilized beans) = balance * max(0, id - currentBpf)
      const remainingBpf = id > currentBpf ? id - currentBpf : 0n;
      const sprouts = balance * remainingBpf;
      // Humidity: fertId = endBpf = (1 + humidity/100) * 1e6
      // humidity% = (id / 1e6 - 1) * 100
      const humidity = (Number(id) / 1e6 - 1) * 100;
      perIdData.set(idStr, { balance, sprouts, humidity });
    }

    if (fertilizerQuery.isError) {
      return {
        balance: TokenValue.ZERO,
        fertilized: TokenValue.ZERO,
        unfertilized: TokenValue.ZERO,
        fertilizerIds: userOwnedIds,
        perIdData,
      };
    }

    const fertilizedResult = fertilizerQuery.data?.[0]?.result;
    const unfertilizedResult = fertilizerQuery.data?.[1]?.result;

    const fertilized = TokenValue.fromBlockchain(fertilizedResult ?? 0n, PINTO.decimals);
    const unfertilized = TokenValue.fromBlockchain(unfertilizedResult ?? 0n, PINTO.decimals);
    // Total balance is the sum of fertilized + unfertilized
    const balance = fertilized.add(unfertilized);

    return {
      balance,
      fertilized,
      unfertilized,
      fertilizerIds: userOwnedIds,
      perIdData,
    };
  }, [fertilizerQuery.data, fertilizerQuery.isError, userOwnedIds, perIdBalances, fertData]);

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
