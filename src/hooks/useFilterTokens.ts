import { FarmerBalance } from "@/state/useFarmerBalances";
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { useMemo } from "react";

export default function useFilterTokens(balances: Map<Token, FarmerBalance>, mode: string, siloToken?: Token) {
  return useMemo(() => {
    const set = new Set<Token>();

    if (mode === "token" && !siloToken) {
      return {
        filterSet: set,
        filterPreferred: Array.from(set),
      };
    }

    [...balances.keys()].forEach((token) => {
      if (mode === "native") {
        if (token.isNative) {
          set.add(token);
        }
      } else if (mode === "lp") {
        if (token.isLP) {
          set.add(token);
        }
      } else if (mode === "token" && siloToken) {
        if (token.isLP && !tokensEqual(token, siloToken)) {
          set.add(token);
        }
      }
    });

    return {
      filterSet: set,
      filterPreferred: Array.from(set),
    };
  }, [balances, mode, siloToken]);
}
