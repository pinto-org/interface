import { Clipboard } from "@/classes/Clipboard";
import { TokenValue } from "@/classes/TokenValue";
import BASIN_WELL_ABI from "@/constants/abi/BasinWell.json";
import { PoolData } from "@/state/usePriceData";
import { AdvancedPipeCall } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { encodeFunctionData, maxUint256 } from "viem";

export default function wellRemoveLiquidity(
  well: PoolData,
  amountIn: TokenValue,
  minAmountsOut: TokenValue[],
  recipient: HashString,
  clipboard?: HashString,
): AdvancedPipeCall {
  const data = encodeFunctionData({
    abi: BASIN_WELL_ABI,
    functionName: "removeLiquidity",
    args: [amountIn.toBigInt(), minAmountsOut.map((amt) => amt.toBigInt()), recipient, maxUint256],
  });

  return {
    target: well.pool.address,
    callData: data,
    clipboard: clipboard ?? Clipboard.encode([]),
  };
}
