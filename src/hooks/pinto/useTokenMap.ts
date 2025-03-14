import { LP_TOKENS, MAIN_TOKEN, PINTO_WSOL_TOKEN, WSOL_TOKEN, tokens } from "@/constants/tokens";
import { useResolvedChainId } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { keyBy } from "lodash";
import { useCallback, useMemo } from "react";
import { Address } from "viem";

export const useWSOL = () => {
  const chainId = useResolvedChainId();
  return useMemo(() => {
    return WSOL_TOKEN[chainId];
  }, [chainId]);
};

export const usePINTOWSOL = () => {
  const chainId = useResolvedChainId();
  return useMemo(() => {
    return PINTO_WSOL_TOKEN[chainId];
  }, [chainId]);
};

export const useIsWSOL = () => {
  const wsol = useWSOL();
  return useCallback((token: Token) => tokensEqual(token, wsol), [wsol]);
};

export function useTokenMap(): AddressMap<Token> {
  const chainId = useResolvedChainId();

  return useMemo(() => {
    return keyBy(tokens[chainId], (token) => getTokenIndex(token));
  }, [chainId]);
}

// keyBy = "lp2Underlying" => Map LP token to non-pinto underlying token
// keyBy = "underlying2LP" => Map non-pinto underlying token to LP token
export function useLPTokenToNonPintoUnderlyingMap(keyBy: "lp2Underlying" | "underlying2LP" = "lp2Underlying") {
  const chainId = useResolvedChainId();
  const tokenMap = useTokenMap();

  return useMemo(() => {
    return LP_TOKENS[chainId].reduce<AddressMap<Token>>((acc, curr) => {
      const tokens = curr.tokens;
      if (!validateLPTokenTokens(tokens, chainId)) return acc;

      const lpIndex = getTokenIndex(curr);

      const token0 = tokenMap[getTokenIndex(tokens[0])];
      const token1 = tokenMap[getTokenIndex(tokens[1])];

      if (keyBy === "lp2Underlying") {
        acc[lpIndex] = token0.isMain ? token1 : token0;
      } else {
        acc[getTokenIndex(token0.isMain ? token1 : token0)] = curr;
      }

      return acc;
    }, {});
  }, [chainId, tokenMap, keyBy]);
}

/**
 * Validate whether an LP token is valid.
 * - LP token must have 2 underlying tokens
 * - Underlying tokens must be unique
 * - Underlying tokens must include PINTO
 */
function validateLPTokenTokens(tokens: Address[] | undefined, chainId: number): tokens is Address[] {
  if (!tokens) throw new Error("LP token has no underlying tokens");
  if (tokens.length !== 2)
    throw new Error(
      `[validateLPToken]: LP token has invalid number of underlying tokens, expected 2 but got: ${tokens.join(", ")}`,
    );

  const mainToken = getTokenIndex(MAIN_TOKEN[chainId]);
  const index0 = getTokenIndex(tokens[0]);
  const index1 = getTokenIndex(tokens[1]);
  // if they are the same, throw an error
  if (stringEq(index0, index1)) throw new Error("LP token has duplicate underlying tokens");
  if (!stringEq(index0, mainToken) && !stringEq(index1, mainToken)) {
    throw new Error("Expected LP token to include PINTO");
  }

  return true;
}
