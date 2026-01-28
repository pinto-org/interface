import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { FarmFromMode } from "@/utils/types";
import { Address, encodeFunctionData } from "viem";

export interface CreatePodOrderParams {
  orderer: Address;
  fieldId: bigint;
  pricePerPod: TokenValue;
  maxPlaceInLine: TokenValue;
  minFillAmount: TokenValue;
  beanAmount: TokenValue;
  mode: FarmFromMode;
}

/**
 * Encodes a batch create pod order transaction
 * @param orders Array of order parameters to create
 * @returns Encoded function data for batchCreatePodOrder
 */
export default function batchCreatePodOrder(orders: CreatePodOrderParams[]): `0x${string}` {
  const args = orders.map((o) => ({
    podOrder: {
      orderer: o.orderer,
      fieldId: o.fieldId,
      pricePerPod: Number(o.pricePerPod.toBigInt()), // uint24 expects number
      maxPlaceInLine: o.maxPlaceInLine.toBigInt(),
      minFillAmount: o.minFillAmount.toBigInt(),
    },
    beanAmount: o.beanAmount.toBigInt(),
    mode: Number(o.mode),
  }));

  return encodeFunctionData({
    abi: diamondABI,
    functionName: "batchCreatePodOrder",
    args: [args],
  });
}
