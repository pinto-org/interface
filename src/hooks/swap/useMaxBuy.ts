import { TV, TokenValue } from "@/classes/TokenValue";
import useTokenData from "@/state/useTokenData";
import { Token } from "@/utils/types";
import useSwap from "./useSwap";

export default function useMaxBuy(tokenIn: Token, slippage: number, mainTokenOut: TokenValue) {
  const mainToken = useTokenData().mainToken;
  const isMainToken = tokenIn.isMain;

  // TODO: Need to fix the direction of swap here
  const { data, ...query } = useSwap({
    tokenIn: mainToken,
    tokenOut: tokenIn,
    amountIn: isMainToken ? TV.ZERO : TV.fromHuman(Math.max(mainTokenOut.toNumber(), 0), 6),
    slippage,
    disabled: mainTokenOut.lte(0) || isMainToken,
  });

  const amount = tokenIn.isMain ? mainTokenOut : data?.buyAmount;

  return {
    data: amount,
    swap: data,
    ...query,
  };
}
