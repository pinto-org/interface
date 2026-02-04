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
 * NOTE: These functions don't exist in the protocol yet - will be indexed from subgraph later
 */
// const siloPaybackAbi = [
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "balanceOfUrBdv",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "earnedUrBdv",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "totalDistributedToAccount",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "totalReceivedByAccount",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
// ] as const;

/**
 * ABI snippets for Barn Payback contract functions
 * NOTE: These functions don't exist in the protocol yet - will be indexed from subgraph later
 */
// const barnPaybackAbi = [
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "balanceOfFertilizer",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "balanceOfSprouts",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "address", name: "account", type: "address" }],
//     name: "balanceOfFertilized",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "humidity",
//     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
//     stateMutability: "view",
//     type: "function",
//   },
// ] as const;

/**
 * Interface for silo payback data
 */
interface SiloPaybackData {
  balance: TokenValue;
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

/**
 * Hook for fetching farmer-specific Beanstalk repayment data
 *
 * This hook fetches:
 * - Silo payback data (TODO: from subgraph - urBDV balance)
 * - Pods data from repayment field (fieldId=1) - from on-chain
 * - Fertilizer data (TODO: from subgraph)
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

  // TODO: Silo payback data will come from subgraph
  // Functions don't exist in protocol: balanceOfUrBdv, earnedUrBdv, totalDistributedToAccount, totalReceivedByAccount
  const siloData = useMemo((): SiloPaybackData => {
    return {
      balance: TokenValue.fromBlockchain(0n, URBDV_DECIMALS),
    };
  }, []);

  // Process pods data - these functions exist in protocol
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

  // TODO: Fertilizer data will come from subgraph
  // Functions don't exist in protocol: balanceOfFertilizer, balanceOfSprouts, balanceOfFertilized
  // humidity() exists as getCurrentHumidity() but not needed for now
  const fertilizerData = useMemo((): FertilizerData => {
    return {
      balance: TokenValue.fromBlockchain(0n, FERTILIZER_DECIMALS),
    };
  }, []);

  // Refetch pods query (only one that works)
  const refetch = useCallback(async () => {
    await podsQuery.refetch();
  }, [podsQuery.refetch]);

  // Loading and error states only from pods query
  const isLoading = podsQuery.isLoading;
  const isError = podsQuery.isError;

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
