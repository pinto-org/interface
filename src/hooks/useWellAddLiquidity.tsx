import { TokenValue } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { PoolData } from "@/state/usePriceData";
import { Token } from "@/utils/types";
import { Abi, Address } from "viem";
import { useReadContract } from "wagmi";

export default function useWellAddLiquidity(
  well?: PoolData,
  tokenIn?: Token,
  /**
   * The amount of each token to add; MUST match the indexing of {Well.tokens}
   */
  amount?: TokenValue,
  slippage?: number,
  disabled?: boolean,
) {
  const querySettings = {
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 20, // 20 seconds, in milliseconds
    enabled: !disabled,
  };

  const amounts = well?.tokens.map((token) => (token.address === tokenIn?.address ? amount : TokenValue.ZERO));

  const estimate = useReadContract({
    abi: basinWellABI as Abi,
    address: well?.pool.address || "0x",
    functionName: "getAddLiquidityOut",
    args: [amounts],
    query: querySettings,
  });

  const outputTV = TokenValue.fromBlockchain((estimate?.data as bigint | undefined) || 0n, well?.pool.decimals || 0);
  // const outputSlippage = mode === "exactInput" ? outputTV.subSlippage(slippage || 0) : outputTV.addSlippage(slippage || 0);

  return {
    amountOut: outputTV,
    isLoading: estimate.isLoading,
  };
}
