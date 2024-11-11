import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { Address } from "viem";
import { useReadContract } from "wagmi";

/**
 * Returns the overall convert capacity of the protocol.
 * @param enabled - Whether to enable the query. Defaults to true.
 */
export const useOverallConvertCapacity = (enabled?: boolean) => {
  const diamondAddress = useProtocolAddress();

  const { data = 0n, ...query } = useReadContract({
    address: diamondAddress,
    abi: abi,
    functionName: "getOverallConvertCapacity",
    query: {
      enabled: enabled ?? true,
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 20, // 20 seconds
    },
  });

  return { data, ...query };
};

/**
 * Returns the convert capacity of a specific well.
 * @param well - The address of the well.
 * @param enabled - Whether to enable the query. Defaults to true.
 */
export const useWellConvertCapacity = (well: Address, enabled?: boolean) => {
  const diamondAddress = useProtocolAddress();

  const { data = 0n, ...query } = useReadContract({
    address: diamondAddress,
    abi: abi,
    functionName: "getWellConvertCapacity",
    args: [well],
    query: {
      enabled: enabled ?? true,
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 20, // 20 seconds
    },
  });

  return { data, ...query };
};

const abi = [
  {
    inputs: [],
    name: "getOverallConvertCapacity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "well",
        type: "address",
      },
    ],
    name: "getWellConvertCapacity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
