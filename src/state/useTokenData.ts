import { LP_TOKENS, MAIN_TOKEN, NATIVE_TOKEN, S_MAIN_TOKEN, WETH_TOKEN, tokens } from "@/constants/tokens";
import { useChainConstant, useResolvedChainId } from "@/utils/chain";
import { Token } from "@/utils/types";
import { useMemo } from "react";

export function useWhitelistedTokens() {
  const chainId = useResolvedChainId();

  return useMemo(() => {
    const mainToken = MAIN_TOKEN[chainId];
    const t = LP_TOKENS[chainId].filter((token) => token.isWhitelisted);

    return [mainToken, ...t];
  }, [chainId]);
}

export function useDeWhitelistedLPTokens() {
  const chainId = useResolvedChainId();

  return useMemo(() => {
    return LP_TOKENS[chainId].filter((token) => !token.isWhitelisted && token.isLP);
  }, [chainId]);
}

export function useMainToken() {
  return useChainConstant(MAIN_TOKEN);
}

export default function useTokenData() {
  const chainId = useResolvedChainId();

  const sMainToken = useChainConstant(S_MAIN_TOKEN);
  const mainToken = useChainConstant(MAIN_TOKEN);
  const nativeToken = useChainConstant(NATIVE_TOKEN);
  const wrappedNativeToken = useChainConstant(WETH_TOKEN);

  return useMemo(() => {
    const lpTokens: Token[] = [];
    const preferredTokens: Token[] = [];
    const whitelistedTokens: Token[] = [];
    const deWhitelistedTokens: Token[] = [];

    const siloWrappedToken3p = tokens[chainId].find((token) => token.is3PSiloWrapped) as Token;

    if (!siloWrappedToken3p) {
      throw new Error("3p wrapped native token not found");
    }

    for (const token of tokens[chainId]) {
      if (token.isLP) {
        lpTokens.push(token);
      }
      if (!token.isNative && !token.isLP) {
        preferredTokens.push(token);
      }
      if (token.isWhitelisted) {
        whitelistedTokens.push(token);
      }
      if (token.isLP && !token.isWhitelisted) {
        deWhitelistedTokens.push(token);
      }
    }

    return {
      mainToken,
      siloWrappedToken: sMainToken,
      siloWrappedToken3p,
      nativeToken,
      wrappedNativeToken,
      lpTokens,
      preferredTokens,
      whitelistedTokens,
      deWhitelistedTokens,
      mayBeWhitelistedTokens: [...whitelistedTokens, ...deWhitelistedTokens],
    };
  }, [chainId, sMainToken, mainToken, nativeToken, wrappedNativeToken]);
}
