import { tokens } from "@/constants/tokens";
import { useResolvedChainId } from "@/utils/chain";
import { getTokenIndex } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { keyBy } from "lodash";
import { useMemo } from "react";

export function useTokenMap(): AddressMap<Token> {
  const chainId = useResolvedChainId();

  return useMemo(() => {
    return keyBy(tokens[chainId], (token) => getTokenIndex(token));
  }, [chainId]);
}
