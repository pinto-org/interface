import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { FarmToMode } from "@/utils/types";
import { Address, encodeFunctionData } from "viem";

export interface FillPodOrderParams {
  podOrder: {
    orderer: Address;
    fieldId: bigint;
    pricePerPod: TokenValue;
    maxPlaceInLine: TokenValue;
    minFillAmount: TokenValue;
  };
  index: TokenValue;
  start: TokenValue;
  amount: TokenValue;
  mode: FarmToMode;
}

/**
 * Encodes a batch fill pod order transaction
 * @param params Array of fill order parameters
 * @returns Encoded function data for batchFillPodOrder
 */
export default function batchFillPodOrder(params: FillPodOrderParams[]): `0x${string}` {
  const args = params.map((p) => ({
    podOrder: {
      orderer: p.podOrder.orderer,
      fieldId: p.podOrder.fieldId,
      pricePerPod: Number(p.podOrder.pricePerPod.toBigInt()), // uint24
      maxPlaceInLine: p.podOrder.maxPlaceInLine.toBigInt(),
      minFillAmount: p.podOrder.minFillAmount.toBigInt(),
    },
    index: p.index.toBigInt(),
    start: p.start.toBigInt(),
    amount: p.amount.toBigInt(),
    mode: Number(p.mode),
  }));

  return encodeFunctionData({
    abi: diamondABI,
    functionName: "batchFillPodOrder",
    args: [args],
  });
}
