import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { FarmToMode } from "@/utils/types";
import { Address, encodeFunctionData } from "viem";

export interface CreatePodListingParams {
  lister: Address;
  fieldId: bigint;
  index: TokenValue;
  start: TokenValue;
  podAmount: TokenValue;
  pricePerPod: TokenValue;
  maxHarvestableIndex: TokenValue;
  minFillAmount: TokenValue;
  mode: FarmToMode;
}

/**
 * Encodes a batch create pod listing transaction
 * @param listings Array of listing parameters to create
 * @returns Encoded function data for batchCreatePodListing
 */
export default function batchCreatePodListing(listings: CreatePodListingParams[]): `0x${string}` {
  const args = listings.map((l) => ({
    lister: l.lister,
    fieldId: l.fieldId,
    index: l.index.toBigInt(),
    start: l.start.toBigInt(),
    podAmount: l.podAmount.toBigInt(),
    pricePerPod: Number(l.pricePerPod.toBigInt()), // uint24 expects number
    maxHarvestableIndex: l.maxHarvestableIndex.toBigInt(),
    minFillAmount: l.minFillAmount.toBigInt(),
    mode: Number(l.mode),
  }));

  return encodeFunctionData({
    abi: diamondABI,
    functionName: "batchCreatePodListing",
    args: [args],
  });
}
