import { TokenValue } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { Token } from "@/utils/types";
import { Abi, Address } from "viem";
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
    abi: basinWellABI as Abi,
    address: wellAddress || "0x",
    functionName: mode === "exactInput" ? "getSwapOut" : "getSwapIn",
    args: [tokenIn?.address || "0x", tokenOut?.address || "0x", amount?.toBigInt() || 0n],
    query: querySettings,
  });
  const outputTV = TokenValue.fromBlockchain((estimate?.data as bigint | undefined) || 0n, tokenOut?.decimals || 0);
  const outputSlippage =
    mode === "exactInput" ? outputTV.subSlippage(slippage || 0) : outputTV.addSlippage(slippage || 0);

  return {
    amountOut: outputTV,
    isLoading: estimate.isLoading,
  };
}
