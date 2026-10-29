import { TokenValue } from "@/classes/TokenValue";
import { maxUint256 } from "viem";

/** Execution-gas estimate only; Base L1 data/security fees are additional. */
export function tractorExecutionGasUSD(gas: bigint, gasPriceWei: bigint, ethUSD: TokenValue) {
  return TokenValue.fromBigInt(gas * gasPriceWei, 18)
    .mul(ethUSD)
    .toNumber();
}

export function convertUpOrderProgress(total: bigint, lastExecution: bigint, remaining: bigint) {
  const complete = remaining === maxUint256;
  return { complete, remaining: complete ? 0n : lastExecution === 0n ? total : remaining };
}

export function sowOrderProgress(total: bigint, remaining: bigint) {
  const complete = remaining === maxUint256;
  return { complete, remaining: complete ? 0n : remaining === 0n ? total : remaining };
}
