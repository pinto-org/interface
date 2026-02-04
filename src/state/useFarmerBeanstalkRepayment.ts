import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { PODS } from "@/constants/internalTokens";
import { defaultQuerySettings } from "@/constants/query";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Plot } from "@/utils/types";
import { useCallback, useMemo } from "react";
import { toHex } from "viem";
import { useAccount, useReadContracts } from "wagmi";

/**
 * ABI snippets for Silo Payback contract functions
 * These are the functions needed to fetch urBDV token data for legacy Beanstalk holders
 */
const siloPaybackAbi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOfUrBdv",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "earnedUrBdv",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "totalDistributedToAccount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "totalReceivedByAccount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * ABI snippets for Barn Payback contract functions
 * These are the functions needed to fetch fertilizer and sprouts data
 */
const barnPaybackAbi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOfFertilizer",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOfSprouts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOfFertilized",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "humidity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Interface for silo payback data
 */
interface SiloPaybackData {
  balance: TokenValue;
  earned: TokenValue;
  totalDistributed: TokenValue;
  totalReceived: TokenValue;
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
  balance: TokenValue;
  sprouts: TokenValue;
  fertilized: TokenValue;
  humidity: TokenValue;
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
// Token decimals for fertilizer amounts
const FERTILIZER_DECIMALS = 6;
// Humidity is typically represented as a percentage with 2 decimal places
const HUMIDITY_DECIMALS = 2;

/**
 * Hook for fetching farmer-specific Beanstalk repayment data
 *
 * This hook fetches:
 * - Silo payback data (urBDV balance, earned, distributed, received)
 * - Pods data from repayment field (fieldId=1)
 * - Fertilizer data (balance, sprouts, fertilized, humidity)
 *
 * @returns FarmerBeanstalkRepaymentData with all farmer obligations data
 */
export function useFarmerBeanstalkRepayment(): FarmerBeanstalkRepaymentData {
  const account = useAccount();
  const protocolAddress = useProtocolAddress();
  const farmerAddress = account.address ?? ZERO_ADDRESS;

  // Query for silo payback data
  const siloQuery = useReadContracts({
    contracts: [
      {
        address: protocolAddress,
        abi: siloPaybackAbi,
        functionName: "balanceOfUrBdv",
        args: [farmerAddress],
      },
      {
        address: protocolAddress,
        abi: siloPaybackAbi,
        functionName: "earnedUrBdv",
        args: [farmerAddress],
      },
      {
        address: protocolAddress,
        abi: siloPaybackAbi,
        functionName: "totalDistributedToAccount",
        args: [farmerAddress],
      },
      {
        address: protocolAddress,
        abi: siloPaybackAbi,
        functionName: "totalReceivedByAccount",
        args: [farmerAddress],
      },
    ],
    allowFailure: true,
    query: {
      enabled: !!account.address,
      ...defaultQuerySettings, // 20 minutes staleTime
    },
  });

  // Query for pods data from repayment field (fieldId=1)
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
      enabled: !!account.address,
      ...defaultQuerySettings, // 20 minutes staleTime
    },
  });

  // Query for fertilizer data
  const fertilizerQuery = useReadContracts({
    contracts: [
      {
        address: protocolAddress,
        abi: barnPaybackAbi,
        functionName: "balanceOfFertilizer",
        args: [farmerAddress],
      },
      {
        address: protocolAddress,
        abi: barnPaybackAbi,
        functionName: "balanceOfSprouts",
        args: [farmerAddress],
      },
      {
        address: protocolAddress,
        abi: barnPaybackAbi,
        functionName: "balanceOfFertilized",
        args: [farmerAddress],
      },
      {
        address: protocolAddress,
        abi: barnPaybackAbi,
        functionName: "humidity",
        args: [],
      },
    ],
    allowFailure: true,
    query: {
      enabled: !!account.address,
      ...defaultQuerySettings, // 20 minutes staleTime
    },
  });

  // Process silo data
  const siloData = useMemo((): SiloPaybackData => {
    const balance = siloQuery.data?.[0]?.result;
    const earned = siloQuery.data?.[1]?.result;
    const totalDistributed = siloQuery.data?.[2]?.result;
    const totalReceived = siloQuery.data?.[3]?.result;

    return {
      balance: TokenValue.fromBlockchain(balance ?? 0n, URBDV_DECIMALS),
      earned: TokenValue.fromBlockchain(earned ?? 0n, URBDV_DECIMALS),
      totalDistributed: TokenValue.fromBlockchain(totalDistributed ?? 0n, URBDV_DECIMALS),
      totalReceived: TokenValue.fromBlockchain(totalReceived ?? 0n, URBDV_DECIMALS),
    };
  }, [siloQuery.data]);

  // Process pods data
  const podsData = useMemo((): PodsData => {
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
  }, [podsQuery.data]);

  // Process fertilizer data
  const fertilizerData = useMemo((): FertilizerData => {
    const balance = fertilizerQuery.data?.[0]?.result;
    const sprouts = fertilizerQuery.data?.[1]?.result;
    const fertilized = fertilizerQuery.data?.[2]?.result;
    const humidity = fertilizerQuery.data?.[3]?.result;

    return {
      balance: TokenValue.fromBlockchain(balance ?? 0n, FERTILIZER_DECIMALS),
      sprouts: TokenValue.fromBlockchain(sprouts ?? 0n, FERTILIZER_DECIMALS),
      fertilized: TokenValue.fromBlockchain(fertilized ?? 0n, FERTILIZER_DECIMALS),
      humidity: TokenValue.fromBlockchain(humidity ?? 0n, HUMIDITY_DECIMALS),
    };
  }, [fertilizerQuery.data]);

  // Refetch all queries
  const refetch = useCallback(async () => {
    await Promise.all([siloQuery.refetch(), podsQuery.refetch(), fertilizerQuery.refetch()]);
  }, [siloQuery.refetch, podsQuery.refetch, fertilizerQuery.refetch]);

  // Combined loading and error states
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
