import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { PoolData } from "@/state/usePriceData";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Abi, encodeFunctionData, maxUint256 } from "viem";

export default function wellRemoveLiquidity(
  well: PoolData,
  amountIn: TokenValue,
  minAmountsOut: TokenValue[],
  recipient: HashString,
  clipboard?: HashString,
): AdvancedPipeCall {
  const data = encodeFunctionData({
    abi: basinWellABI as Abi,
    functionName: "removeLiquidity",
    args: [amountIn.toBigInt(), minAmountsOut.map((amt) => amt.toBigInt()), recipient, maxUint256],
  });

  return {
    target: well.pool.address,
    callData: data,
    clipboard: clipboard ?? Clipboard.encode([]),
  };
}

export function wellRemoveLiquidityOneToken(
  well: PoolData,
  amountIn: TokenValue,
  tokenOut: Token,
  minAmountOut: TokenValue,
  recipient: HashString,
  clipboard?: HashString,
): AdvancedPipeCall {
  const data = encodeFunctionData({
    abi: basinWellABI,
    functionName: "removeLiquidityOneToken",
    args: [amountIn.toBigInt(), tokenOut.address, minAmountOut.toBigInt(), recipient, maxUint256],
  });

  return {
    target: well.pool.address,
    callData: data,
    clipboard: clipboard ?? Clipboard.encode([]),
  };
}
