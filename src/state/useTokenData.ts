import { LP_TOKENS, MAIN_TOKEN, S_MAIN_TOKEN, tokens } from "@/constants/tokens";
import { useChainConstant, useResolvedChainId } from "@/utils/chain";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import { base } from "viem/chains";
import { useChainId } from "wagmi";

export function useWhitelistedTokens() {
  const chainId = useResolvedChainId();

  return useMemo(() => {
    const mainToken = MAIN_TOKEN[chainId];
    const t = LP_TOKENS[chainId];

    return [mainToken, ...t];
  }, [chainId]);
}

export default function useTokenData() {
  const chainId = useChainId();

  const sMainToken = useChainConstant(S_MAIN_TOKEN);

  const { mainToken, nativeToken, wrappedNativeToken, lpTokens, preferredTokens, siloWrappedToken3p } = useMemo(() => {
    const _lpTokens: Token[] = [];
    const _preferredTokens: Token[] = [];

    const _chainId = chainId === 41337 ? base.id : chainId === 1337 ? base.id : chainId;

    const _mainToken = tokens[_chainId].find((token) => token.isMain) as Token;
    const _nativeToken = tokens[_chainId].find((token) => token.isNative) as Token;
    const _wrappedNativeToken = tokens[_chainId].find((token) => token.isWrappedNative) as Token;
    const _3pWrappedNativeToken = tokens[_chainId].find((token) => token.is3PSiloWrapped) as Token;

    for (const token of tokens[_chainId]) {
      if (token.isLP) {
        _lpTokens.push(token);
      }
      if (!token.isNative && !token.isLP) {
        _preferredTokens.push(token);
      }
    }

    return {
      mainToken: _mainToken,
      nativeToken: _nativeToken,
      wrappedNativeToken: _wrappedNativeToken,
      siloWrappedToken3p: _3pWrappedNativeToken,
      lpTokens: _lpTokens,
      preferredTokens: _preferredTokens,
    };
  }, [chainId]);

  return useMemo(
    () => ({
      mainToken: mainToken,
      siloWrappedToken: sMainToken,
      siloWrappedToken3p: siloWrappedToken3p,
      nativeToken: nativeToken,
      wrappedNativeToken: wrappedNativeToken,
      lpTokens: lpTokens,
      preferredTokens: preferredTokens,
      whitelistedTokens: [mainToken, ...lpTokens],
    }),
    [sMainToken, mainToken, nativeToken, wrappedNativeToken, lpTokens, preferredTokens],
  );
}
