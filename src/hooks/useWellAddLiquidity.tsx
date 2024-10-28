import { Abi, Address } from "viem";
import BASIN_WELL_ABI from "@/constants/abi/BasinWell.json";
import { TokenValue } from "@/classes/TokenValue";
import { useReadContract } from "wagmi";
import { Token } from "@/utils/types";
import { PoolData } from "@/state/usePriceData";

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
    abi: BASIN_WELL_ABI as Abi,
    address: well?.pool.address || "0x",
    functionName: "getAddLiquidityOut",
    args: [amounts],
    query: querySettings,
  });
  const outputTV = TokenValue.fromBlockchain(estimate?.data || 0n, well?.pool.decimals || 0);
  // const outputSlippage = mode === "exactInput" ? outputTV.subSlippage(slippage || 0) : outputTV.addSlippage(slippage || 0);

  return {
    amountOut: outputTV,
    isLoading: estimate.isLoading,
  };
}
