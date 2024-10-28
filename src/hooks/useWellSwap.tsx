import { Abi, Address } from "viem";
import BASIN_WELL_ABI from "@/constants/abi/BasinWell.json";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { useReadContract } from "wagmi";

export default function useWellSwap(
  amount?: TokenValue,
  tokenIn?: Token,
  tokenOut?: Token,
  wellAddress?: Address,
  slippage?: number,
  mode?: "exactInput" | "exactOutput",
  disabled?: boolean,
) {
  const querySettings = {
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 20, // 20 seconds, in milliseconds
    enabled: !disabled,
  };

  const estimate = useReadContract({
    abi: BASIN_WELL_ABI as Abi,
    address: wellAddress || "0x",
    functionName: mode === "exactInput" ? "getSwapOut" : "getSwapIn",
    args: [tokenIn?.address || "0x", tokenOut?.address || "0x", amount?.toBigInt() || 0n],
    query: querySettings,
  });
  const outputTV = TokenValue.fromBlockchain(estimate?.data || 0n, tokenOut?.decimals || 0);
  const outputSlippage =
    mode === "exactInput" ? outputTV.subSlippage(slippage || 0) : outputTV.addSlippage(slippage || 0);

  return {
    amountOut: outputTV,
    isLoading: estimate.isLoading,
  };
}
