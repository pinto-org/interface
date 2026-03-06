import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { FarmToMode } from "@/utils/types";
import { Address, encodeFunctionData } from "viem";

export interface CancelPodOrderParams {
  orderer: Address;
  fieldId: bigint;
  pricePerPod: TokenValue;
  maxPlaceInLine: TokenValue;
  minFillAmount: TokenValue;
}

/**
 * Encodes a batch cancel pod order transaction
 * @param orders Array of order parameters to cancel
 * @param mode The destination mode for returned tokens (INTERNAL or EXTERNAL)
 * @returns Encoded function data for batchCancelPodOrder
 */
export default function batchCancelPodOrder(orders: CancelPodOrderParams[], mode: FarmToMode): `0x${string}` {
  const args = orders.map((o) => ({
    orderer: o.orderer,
    fieldId: o.fieldId,
    pricePerPod: o.pricePerPod.toNumber(), // uint24 expects number, not bigint
    maxPlaceInLine: o.maxPlaceInLine.toBigInt(),
    minFillAmount: o.minFillAmount.toBigInt(),
  }));

  return encodeFunctionData({
    abi: diamondABI,
    functionName: "batchCancelPodOrder",
    args: [args, Number(mode)],
  });
}
