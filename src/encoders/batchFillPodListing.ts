import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { Address, encodeFunctionData } from "viem";

export interface FillPodListingParams {
  podListing: {
    lister: Address;
    fieldId: bigint;
    index: TokenValue;
    start: TokenValue;
    podAmount: TokenValue;
    pricePerPod: TokenValue;
    maxHarvestableIndex: TokenValue;
    minFillAmount: TokenValue;
    mode: FarmToMode;
  };
  beanAmount: TokenValue;
  mode: FarmFromMode;
}

/**
 * Encodes a batch fill pod listing transaction
 * @param params Array of fill listing parameters
 * @returns Encoded function data for batchFillPodListing
 */
export default function batchFillPodListing(params: FillPodListingParams[]): `0x${string}` {
  const args = params.map((p) => ({
    podListing: {
      lister: p.podListing.lister,
      fieldId: p.podListing.fieldId,
      index: p.podListing.index.toBigInt(),
      start: p.podListing.start.toBigInt(),
      podAmount: p.podListing.podAmount.toBigInt(),
      pricePerPod: Number(p.podListing.pricePerPod.toBigInt()), // uint24
      maxHarvestableIndex: p.podListing.maxHarvestableIndex.toBigInt(),
      minFillAmount: p.podListing.minFillAmount.toBigInt(),
      mode: Number(p.podListing.mode),
    },
    beanAmount: p.beanAmount.toBigInt(),
    mode: Number(p.mode),
  }));

  return encodeFunctionData({
    abi: diamondABI,
    functionName: "batchFillPodListing",
    args: [args],
  });
}
