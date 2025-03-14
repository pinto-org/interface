import useFarmerBalances, { FarmerBalance } from "@/state/useFarmerBalances";
import { usePriceData } from "@/state/usePriceData";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { Lookup } from "@/utils/types.generic";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export type USDExtendedFarmerBalances = {
  token: Token;
  balance: FarmerBalance;
  usd: FarmerBalance;
};

export default function useUSDExtendedFarmerBalances() {
  const farmerBalanceData = useFarmerBalances();
  const balances = farmerBalanceData.balances;
  const loading = farmerBalanceData.isLoading;
  const { tokenPrices, loading: priceLoading } = usePriceData();

  const usdExtendedBalances = useMemo(() => {
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

  return {
    loading: isLoading || priceLoading,
    data: usdExtendedBalances,
  };
}
