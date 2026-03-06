import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { encodeFunctionData } from "viem";

export interface CancelPodListingParams {
  fieldId: bigint;
  index: TokenValue;
}

/**
 * Encodes a batch cancel pod listing transaction
 * @param params Array of listing parameters to cancel
 * @returns Encoded function data for batchCancelPodListing
 */
export default function batchCancelPodListing(params: CancelPodListingParams[]): `0x${string}` {
  const args = params.map((p) => ({
    fieldId: p.fieldId,
    index: p.index.toBigInt(),
  }));

  return encodeFunctionData({
    abi: diamondABI,
    functionName: "batchCancelPodListing",
    args: [args],
  });
}
