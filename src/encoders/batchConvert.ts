import { diamondABI } from "@/constants/abi/diamondABI";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData } from "viem";

/**
 * Parameters for a single convert operation within a batch.
 * Each entry represents one deposit group to combine via same-token convert.
 */
export interface BatchConvertParams {
  /** Encoded conversion parameters (from calculateConvertData) */
  convertData: HashString;
  /** Deposit stems to convert (int96[]) */
  stems: bigint[];
  /** Amounts per deposit to convert (uint256[]) */
  amounts: bigint[];
  /** Grown stalk slippage tolerance (int256). Use 0n for same-token combines. */
  grownStalkSlippage: bigint;
}

/**
 * Encodes a batch convert transaction that combines multiple convert operations
 * into a single on-chain call. Used for deposit combine/sort optimization.
 * @param params Array of convert parameters (one per deposit group)
 * @returns Encoded function data for batchConvert
 */
export default function batchConvert(params: BatchConvertParams[]): `0x${string}` {
  const args = params.map((p) => ({
    convertData: p.convertData,
    stems: p.stems,
    amounts: p.amounts,
    grownStalkSlippage: p.grownStalkSlippage,
  }));

  return encodeFunctionData({
    abi: diamondABI,
    functionName: "batchConvert",
    args: [args],
  });
}
