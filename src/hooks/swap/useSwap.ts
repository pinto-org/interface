import { TV } from "@/classes/TokenValue";
import { useIsWSOL, usePINTOWSOL, useWSOL } from "@/hooks/pinto/useTokenMap";
import { Token } from "@/utils/types";
import { arrayify } from "@/utils/utils";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useAccount, useChainId, useConfig } from "wagmi";

import { defaultQuerySettingsQuote } from "@/constants/query";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useChainConstant } from "@/utils/chain";
import { tokensEqual } from "@/utils/token";
import { MayArray } from "@/utils/types.generic";
import { SwapOptions, SwapQuoter } from "../../lib/Swap/swap-router";

const useRouter = () => {
  const chainId = useChainId();
  const config = useConfig();

  return useMemo(() => {
    return new SwapQuoter(chainId, config);
  }, [chainId, config]);
};

const useGetSwapOptions = () => {
  const isWSOL = useIsWSOL();
  const wsol = useWSOL();
  const pintoWSOL = usePINTOWSOL();
  const mainToken = useChainConstant(MAIN_TOKEN);

  const getSwapOptions = useCallback(
    (tokenIn: Token, tokenOut: Token | undefined): SwapOptions => {
      const wsolIn = tokensEqual(tokenIn, wsol);
      const wsolOut = !!(tokenOut && tokensEqual(tokenOut, wsol));

      // Route all NON_PINTO -> PINTOWSOL through PINTO.
      // Since we are routing through PINTO, we can use 0x since we are not swapping for WSOL.
      const lpRouteOverrides = new Map<Token, Token>();
      lpRouteOverrides.set(pintoWSOL, mainToken);

      // In the case where user is going from WSOL => NON_PINTOWSOL LP, add single sided PINTO liquidity.
      if (wsolIn && tokenOut?.isLP) {
        lpRouteOverrides.set(tokenOut, mainToken);
      }

      return {
        directOnly: wsolIn || wsolOut,
        aggDisabled: wsolIn || wsolOut,
        disabledThruTokens: new Set([wsol]),
        lpRouteOverrides,
      };
    },
    [isWSOL, wsol, pintoWSOL, mainToken],
  );

  return getSwapOptions;
};

type UseSwapOptionsArgs = {
  tokenIn: Token;
  tokenOut: Token | undefined;
};

const useSwapOptions = (args: MayArray<UseSwapOptionsArgs>): SwapOptions[] => {
  const getSwapOptions = useGetSwapOptions();

  return useMemo(() => arrayify(args).map((arg) => getSwapOptions(arg.tokenIn, arg.tokenOut)), [getSwapOptions, args]);
};

export type UseSwapParams = {
  tokenIn: Token;
  tokenOut: Token | undefined;
  amountIn: TV;
  slippage: number;
  disabled?: boolean;
};

export const SWAP_QUERY_KEY_PREDICATE = ["pinto-swap-router"] as const;

const createSwapQueryKey = (args: UseSwapParams): QueryKey => {
  return [SWAP_QUERY_KEY_PREDICATE, args.tokenIn.address, args.tokenOut?.address ?? "", args.amountIn, args.slippage];
};

export default function useSwap({ tokenIn, tokenOut, amountIn, slippage, disabled = false }: UseSwapParams) {
  const router = useRouter();
  const account = useAccount();

  const swapOptions = useSwapOptions({ tokenIn, tokenOut });
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => [SWAP_QUERY_KEY_PREDICATE, createSwapQueryKey({ tokenIn, tokenOut, amountIn, slippage })],
    [tokenIn, tokenOut, amountIn, slippage],
  );

  const swapNodesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (swapOptions.length !== 1 || !tokenOut) return;

      const swapResult = await router.route(tokenIn, tokenOut, amountIn, slippage, swapOptions[0]).catch((e) => {
        console.error("Error routing swap: ", e);
        throw e;
      });
      console.debug("\n--------[Swap/useSwap] Query: ", swapResult, "\n");
      return swapResult;
    },
    enabled: !!account && !!tokenIn && !!tokenOut && amountIn.gt(0) && !!slippage && !disabled,
    ...defaultQuerySettingsQuote,
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

export interface IUseSwapMany {
  args: UseSwapParams[];
  disabled?: boolean;
}

export const useSwapMany = ({ args, disabled = false }: IUseSwapMany) => {
  const router = useRouter();

  const getSwapOptions = useGetSwapOptions();

  const account = useAccount();
  const queryClient = useQueryClient();

  const swapOptions = useMemo(
    () => args.map((arg) => getSwapOptions(arg.tokenIn, arg.tokenOut)),
    [args, getSwapOptions],
  );

  const hasSwapVars = args.every((arg) => !!arg.tokenIn && !!arg.tokenOut && arg.amountIn.gt(0) && !!arg.slippage);

  const queryKey = useMemo(() => [SWAP_QUERY_KEY_PREDICATE, ...args.map((arg) => createSwapQueryKey(arg))], [args]);

  const swapNodesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!args.length || !hasSwapVars) return;

      const swapResult = await Promise.all(
        args.map((arg, i) => {
          if (!arg.tokenOut) {
            // This should never happen
            throw new Error("Token out is required");
          }
          return router.route(arg.tokenIn, arg.tokenOut, arg.amountIn, arg.slippage, swapOptions[i]);
        }),
      ).catch((e) => {
        console.error("Error routing swap: ", e);
        throw e;
      });

      console.debug("\n--------[Swap/useSwap] Query: ", swapResult, "\n");
      return swapResult;
    },
    enabled: !!account && hasSwapVars && !disabled,
    ...defaultQuerySettingsQuote,
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
};
