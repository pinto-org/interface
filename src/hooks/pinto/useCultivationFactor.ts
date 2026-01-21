import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { decodeAbiParameters } from "viem";
import { useReadContract } from "wagmi";

/**
 * Stable select function to transform gauge data into cultivation factor.
 * Extracted outside the hook to maintain a stable reference.
 */
const selectCultivationFactor = (data: `0x${string}`) => {
  // Decode first uint256 from bytes
  const [cultivationFactor] = decodeAbiParameters([{ type: "uint256" }], data);

  // Return as TokenValue with 18 decimals (standard Solidity precision)
  return TokenValue.fromBlockchain(cultivationFactor, 6);
};

/**
 * Hook to fetch the cultivation factor from the protocol's gauge data.
 *
 * The cultivation factor is retrieved by calling `getGaugeData(0)` on the diamond contract,
 * which returns bytes data. We decode the first uint256 from this data to get the cultivation factor.
 *
 * @returns The cultivation factor as a TokenValue with 18 decimals
 */
export const useCultivationFactor = () => {
  const protocolAddress = useProtocolAddress();

  return useReadContract({
    address: protocolAddress,
    abi: diamondABI,
    functionName: "getGaugeValue",
    args: [0], // gaugeId = 0
    query: {
      enabled: !!protocolAddress,
      select: selectCultivationFactor,
    },
  });
};
