import { FarmerBalance, useFarmerBalances } from "@/state/useFarmerBalances";
import { usePriceData } from "@/state/usePriceData";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { Lookup } from "@/utils/types.generic";
import { useMemo } from "react";

export type USDExtendedFarmerBalances = {
  token: Token;
  balance: FarmerBalance;
  usd: FarmerBalance;
};

export default function useUSDExtendedFarmerBalances() {
  const { balances } = useFarmerBalances();
  const { tokenPrices } = usePriceData();

  return useMemo(() => {
    const tokenMap: Lookup<USDExtendedFarmerBalances> = {};

    for (const [token, balance] of balances) {
      const prices = tokenPrices.get(token);
      if (!prices) continue;

      const usd: FarmerBalance = {
        internal: prices.instant.mul(balance.internal),
        external: prices.instant.mul(balance.external),
        total: prices.instant.mul(balance.total),
      };

      const tokenIndex = getTokenIndex(token);
      tokenMap[tokenIndex] = {
        token,
        balance,
        usd,
      };
    }

    return tokenMap;
  }, [balances, tokenPrices]);
}
