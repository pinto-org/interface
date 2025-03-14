import { TV } from "@/classes/TokenValue";
import { useIsWSOL, usePINTOWSOL, useWSOL } from "@/hooks/pinto/useTokenMap";
import { Token } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useAccount, useChainId, useConfig } from "wagmi";

import { MAIN_TOKEN } from "@/constants/tokens";
import { useChainConstant } from "@/utils/chain";
import { SwapOptions, SwapQuoter } from "../../lib/Swap/swap-router";

const useRouter = () => {
  const chainId = useChainId();
  const config = useConfig();

  return useMemo(() => {
    return new SwapQuoter(chainId, config);
  }, [chainId, config]);
};

const useSwapOptions = (tokenIn: Token, tokenOut: Token): SwapOptions => {
  const isWSOL = useIsWSOL();
  const wsol = useWSOL();
  const pintoWSOL = usePINTOWSOL();
  const mainToken = useChainConstant(MAIN_TOKEN);

  return useMemo(() => {
    const wsolIn = isWSOL(tokenIn);
    const wsolOut = isWSOL(tokenOut);

    // Route all NON_PINTO -> PINTOWSOL through PINTO.
    // Since we are routing through PINTO, we can use 0x since we are not swapping for WSOL.
    const lpRouteOverrides = new Map<Token, Token>();
    lpRouteOverrides.set(pintoWSOL, mainToken);

    // In the case where user is going from WSOL => NON_PINTOWSOL LP, add single sided PINTO liquidity.
    if (wsolIn && tokenOut.isLP) {
      lpRouteOverrides.set(tokenOut, mainToken);
    }

    return {
      directOnly: wsolIn || wsolOut,
      aggDisabled: wsolIn || wsolOut,
      disabledThruTokens: new Set([wsol]),
      lpRouteOverrides,
    };
  }, [tokenIn, tokenOut, isWSOL, wsol, mainToken, pintoWSOL]);
};

export type UseSwapParams = {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: TV;
  slippage: number;
  disabled?: boolean;
};

export const SWAP_QUERY_KEY_PREDICATE = ["pinto-swap-router"] as const;

export default function useSwap({ tokenIn, tokenOut, amountIn, slippage, disabled = false }: UseSwapParams) {
  const router = useRouter();
  const account = useAccount();

  const swapOptions = useSwapOptions(tokenIn, tokenOut);
  const queryClient = useQueryClient();

  const swapNodesQuery = useQuery({
    queryKey: [SWAP_QUERY_KEY_PREDICATE, tokenIn.address, tokenOut.address, amountIn, slippage],
    queryFn: async () => {
      const swapResult = await router.route(tokenIn, tokenOut, amountIn, slippage, swapOptions).catch((e) => {
        console.error("Error routing swap: ", e);
        throw e;
      });
      console.debug("\n--------[Swap/useSwap] Query: ", swapResult, "\n");
      return swapResult;
    },
    enabled: !!account && !!tokenIn && !!tokenOut && amountIn.gt(0) && !!slippage && !disabled,
  });

  const resetSwap = useCallback(() => {
    router.clear();
    queryClient.removeQueries({
      queryKey: [SWAP_QUERY_KEY_PREDICATE],
      exact: false,
      type: "all",
    });
  }, [queryClient, router]);

  return {
    ...swapNodesQuery,
    resetSwap,
  };
}
