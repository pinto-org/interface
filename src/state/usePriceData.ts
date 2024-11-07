import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi, beanstalkAddress, useReadBeanstalkPrice_Price } from "@/generated/contractHooks";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import { Abi, Address } from "viem";
import { useChainId, useReadContracts } from "wagmi";
import useTokenData from "./useTokenData";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

const PRICE_DECIMALS = 6;

export interface PoolData {
  pool: Token;
  tokens: Token[];
  balances: TokenValue[];
  price: TokenValue;
  liquidity: TokenValue;
  deltaB: TokenValue;
  lpUsd: TokenValue;
  lpBdv: TokenValue;
}

export function usePriceData() {
  const tokenData = useTokenData();
  const chainId = useChainId();
  const nativeToken = tokenData.nativeToken;
  const wrappedNativeToken = tokenData.wrappedNativeToken;

  const protocolAddress: Address = beanstalkAddress[chainId as keyof typeof beanstalkAddress];

  const tokensToFetch = tokenData.preferredTokens.filter((token) => !token.isMain);

  const contractCalls: { address: `0x${string}`; abi: Abi; functionName: string; args: any }[] = tokensToFetch.flatMap(
    (token) => {
      const instantPriceCall = {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getTokenUsdPrice",
        args: [token.address],
      };
      const twaPriceCall = {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getTokenUsdTwap",
        args: [token.address, 3600n],
      };
      return [instantPriceCall, twaPriceCall];
    },
  );

  const price = useReadBeanstalkPrice_Price(settings).data;

  const result = useReadContracts({
    contracts: contractCalls,
    query: {
      ...settings.query,
      select: (data) => {
        const priceMap = new Map<Token, { instant: TokenValue; twa: TokenValue }>();

        for (const [index, tokenPrice] of data.entries()) {
          const isOdd = index % 2 === 1;
          const _token = tokensToFetch[Math.floor(index / 2)];
          if (!isOdd && !tokenPrice.error) {
            priceMap.set(_token, {
              instant: TokenValue.fromBlockchain((tokenPrice.result as bigint) ?? 0n, PRICE_DECIMALS),
              twa: TokenValue.fromBlockchain(0, PRICE_DECIMALS),
            });
          } else if (isOdd && !tokenPrice.error) {
            const _priceData = priceMap.get(_token);
            const newPriceData = {
              instant: _priceData ? _priceData.instant : TokenValue.fromBlockchain(0n, PRICE_DECIMALS),
              twa: TokenValue.fromBlockchain((tokenPrice.result as bigint) ?? 0n, 6),
            };
            priceMap.set(_token, newPriceData);
          }
        }
        return priceMap;
      },
    },
  });

  const priceResults = useMemo(() => {
    const pools: PoolData[] = [];
    price?.ps.forEach((pool) => {
      const tokens: Token[] = [];
      const balances: TokenValue[] = [];

      pool.tokens.forEach((token) => {
        if (token.toLowerCase() === tokenData.mainToken?.address.toLowerCase()) {
          tokens.push(tokenData.mainToken);
        } else if (tokenData.preferredTokens.length > 0) {
          const poolToken = tokenData.preferredTokens.find(
            (poolToken) => token.toLowerCase() === poolToken.address.toLowerCase(),
          );
          if (poolToken) {
            tokens.push(poolToken);
          }
        }
      });

      pool.balances.forEach((balance, index) => {
        if (!tokens[index]) return;
        const poolBalance = TokenValue.fromBlockchain(balance, tokens[index].decimals);
        balances.push(poolBalance);
      });

      const poolTokenInfo = tokenData.lpTokens.find(
        (lpToken) => pool.pool.toLowerCase() === lpToken.address.toLowerCase(),
      );

      if (poolTokenInfo) {
        const poolData = {
          pool: poolTokenInfo,
          tokens: tokens,
          balances: balances,
          price: TokenValue.fromBlockchain(pool.price, 6),
          liquidity: TokenValue.fromBlockchain(pool.liquidity, 6),
          deltaB: TokenValue.fromBlockchain(pool.deltaB, 6),
          lpUsd: TokenValue.fromBlockchain(pool.lpUsd, 6),
          lpBdv: TokenValue.fromBlockchain(pool.lpBdv, 6),
        };

        pools.push(poolData);
      }
    });

    const output = {
      deltaB: TokenValue.fromBlockchain(price?.deltaB || 0n, 6),
      liquidity: TokenValue.fromBlockchain(price?.liquidity || 0n, 4),
      price: TokenValue.fromBlockchain(price?.price || 0n, 6),
      pools: pools.sort((a, b) => Number(b.liquidity.sub(a.liquidity).toHuman())),
    };
    return output;
  }, [price, tokenData.mainToken, tokenData.lpTokens, tokenData.preferredTokens]);

  const tokenPrices = useMemo(() => {
    const map = result?.data;
    if (!map) return new Map<Token, { instant: TokenValue; twa: TokenValue }>();

    const wrappedNativePrice = map.get(wrappedNativeToken);
    map.set(nativeToken, wrappedNativePrice ?? { instant: TokenValue.ZERO, twa: TokenValue.ZERO });

    map.set(tokenData.mainToken, {
      instant: TokenValue.fromBlockchain(price?.price || 0n, tokenData.mainToken.decimals),
      twa: TokenValue.ZERO,
    });

    for (const pool of priceResults.pools) {
      map.set(pool.pool, {
        instant: pool.lpUsd,
        twa: TokenValue.ZERO, // TODO: do we need twa?
      });
    }

    return map;
  }, [result?.data, price, wrappedNativeToken, nativeToken, tokenData.mainToken, priceResults.pools]);

  return useMemo(() => {
    return {
      ...priceResults,
      tokenPrices,
    };
  }, [priceResults, tokenPrices]);
}
