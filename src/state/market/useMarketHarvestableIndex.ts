import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { defaultQuerySettings } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useHarvestableIndex } from "@/state/useFieldData";
import { useReadContract } from "wagmi";

// The repayment field exposes the same read used by useFarmerBeanstalkRepayment.
// Fetch it independently so browsing the market does not require farmer data.
export function useMarketHarvestableIndex(podMarketplaceId = "0") {
  const pintoIndex = useHarvestableIndex();
  const address = useProtocolAddress();
  const isRepaymentField = podMarketplaceId === "1";
  const repaymentIndex = useReadContract({
    address,
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
    args: [1n],
    query: { ...defaultQuerySettings, enabled: isRepaymentField },
  });

  if (!isRepaymentField) return pintoIndex;
  return repaymentIndex.data === undefined
    ? TokenValue.NEGATIVE_ONE
    : TokenValue.fromBlockchain(repaymentIndex.data, PODS.decimals);
}
