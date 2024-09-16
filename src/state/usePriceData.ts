import { Address } from "viem";
import { useReadBeanstalkPrice_Price } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import useTokenData from "./useTokenData";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

export interface PoolData {
  pool: Token,
  tokens: Token[],
  balances: TokenValue[],
  price: TokenValue,
  liquidity: TokenValue,
  deltaB: TokenValue,
  lpUsd: TokenValue,
  lpBdv: TokenValue
}

export function usePriceData() {
  
  const price = useReadBeanstalkPrice_Price(settings).data;
  const tokenData = useTokenData();

  const pools: PoolData[] = [];

  price?.ps.forEach((pool) => {

    const tokens: Token[] = [];
    const balances: TokenValue[] = [];

    pool.tokens.forEach((token) => {
      if (token.toLowerCase() === tokenData.mainToken!.address.toLowerCase()) {
        tokens.push(tokenData.mainToken!);
      } else if (tokenData.preferredTokens.length > 0) {
        const poolToken = tokenData.preferredTokens.find((poolToken) => token.toLowerCase() === poolToken.address.toLowerCase())
        if (poolToken) {
          tokens.push(poolToken);
        };
      };
    });

    pool.balances.forEach((balance, index) => {
      if (!tokens[index]) return
      const poolBalance = TokenValue.fromBlockchain(balance, tokens[index].decimals);
      balances.push(poolBalance);
    });

    const poolTokenInfo = tokenData.lpTokens.find((lpToken) => pool.pool.toLowerCase() === lpToken.address.toLowerCase())!

    const poolData = {
      pool: poolTokenInfo,
      tokens: tokens,
      balances: balances,
      price: TokenValue.fromBlockchain(pool.price, 6),
      liquidity: TokenValue.fromBlockchain(pool.liquidity, 6),
      deltaB: TokenValue.fromBlockchain(pool.deltaB, 6),
      lpUsd: TokenValue.fromBlockchain(pool.lpUsd, 6),
      lpBdv: TokenValue.fromBlockchain(pool.lpBdv, 6)
    }

    pools.push(poolData);
  });

  const output = {
    deltaB: TokenValue.fromBlockchain(price?.deltaB || 0n, 6),
    liquidity: TokenValue.fromBlockchain(price?.liquidity || 0n, 4),
    price: TokenValue.fromBlockchain(price?.price || 0n, 6),
    pools: pools.sort((a, b) => Number(b.liquidity.sub(a.liquidity).toHuman())),
  }

  return output;
}
