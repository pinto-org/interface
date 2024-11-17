import { TokenValue } from "@/classes/TokenValue";
import { FarmerBalance, useFarmerBalances } from "@/state/useFarmerBalances";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { Lookup } from "@/utils/types.generic";
import { keyBy } from "lodash";
import { useMemo } from "react";
import { useAccount } from "wagmi";

type USDExtendedFarmerBalances = {
  token: Token;
  balance: FarmerBalance;
  usd: FarmerBalance;
}


export function useUSDExtendedFarmerBalances() {
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

export type PreferredTokenMode = 
  "highest" | // sort from highest to lowest USD value in descending order
  "lp-underlying" | // If an LP token, sort by [underlying token, ...other tokens in USD value, PINTO]
  "pinto"; // PINTO first, then sort by USD value in descending order

export interface UsePreferredTokenProps {
  /**
   * most preferred token
   */
  token?: Token;
}

// /**
//  * 
//  * @param token If provided, 
//  * @returns 
//  */
// export function usePreferredToken(token?: Token) {
//   const balances = useUSDExtendedFarmerBalances();

//   return useMemo(() => {
//     // sort by total USD value
//     const sorted = Object.values(balances).sort((a, b) => b.usd.total.sub(a.usd.total).toNumber());



    
//   }, [balances, primary, secondary]);
// }