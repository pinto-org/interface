import { TV, TokenValue } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { defaultQuerySettings, defaultQuerySettingsFast } from "@/constants/query";
import { beanstalkAbi, useReadBeanstalkPrice_Price } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { getTokenIndex } from "@/utils/token";
import { FailableUseContractsResult, Token } from "@/utils/types";
import { AddressLookup, Lookup } from "@/utils/types.generic";
import { useCallback, useMemo } from "react";
import { Address } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import { useCreamSiloWrappedTokenExchangeRate } from "./use3PSiloWrappedTokenData";
import { useSiloWrappedTokenExchangeRateQuery } from "./useSiloWrappedTokenData";
import useTokenData from "./useTokenData";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  },
};

const PRICE_DECIMALS = 6;

export interface BasePoolData<T extends Token | Address, V extends TokenValue | bigint> {
  pool: T;
  tokens: T[];
  balances: V[];
  price: V;
  liquidity: V;
  deltaB: V;
  lpUsd: V;
  lpBdv: V;
}

export type PoolData = BasePoolData<Token, TokenValue>;

export function usePriceQuery() {
  return useReadBeanstalkPrice_Price(settings);
}

export function useTwaDeltaBQuery() {
  const diamond = useProtocolAddress();
  return useReadContract({
    address: diamond,
    abi: beanstalkAbi,
    functionName: "totalDeltaB",
    query: {
      ...defaultQuerySettings,
      select: (data) => TokenValue.fromBlockchain(data, 6),
    },
  });
}

export function useTwaDeltaBLPQuery() {
  const diamond = useProtocolAddress();
  const tokenData = useTokenData();

  return useReadContracts({
    contracts: tokenData.lpTokens.map((token) => {
      return {
        functionName: "poolDeltaBNoCap",
        abi: abiSnippets.pool.poolDeltaBNoCap,
        address: diamond,
        args: [token.address],
      };
    }),
    query: {
      ...defaultQuerySettingsFast,
      select: (data) =>
        tokenData.lpTokens.reduce<AddressLookup<TokenValue>>((prev, curr, i) => {
          const tokenIndex = getTokenIndex(curr);

          const result = data[i];
          if (result.result || result.result === 0n) {
            const deltaB = TokenValue.fromBigInt(result.result, 6);
            prev[tokenIndex] = deltaB;
          }

          return prev;
        }, {}),
    },
  });
}

export function useInstantTWATokenPricesQuery() {
  const tokenData = useTokenData();
  const tokensToFetch = tokenData.preferredTokens.filter((token) => !token.isMain);
  const protocolAddress = useProtocolAddress();

  const selectPriceData = useCallback(
    (data: FailableUseContractsResult<bigint>) => {
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
    [tokensToFetch],
  );

  return useReadContracts({
    contracts: tokensToFetch.flatMap((token) => {
      const instantPriceCall = {
        address: protocolAddress,
        abi: abiSnippets.price.getTokenUsdPrice,
        functionName: "getTokenUsdPrice",
        args: [token.address],
      };
      const twaPriceCall = {
        address: protocolAddress,
        abi: abiSnippets.price.getTokenUsdTwap,
        functionName: "getTokenUsdTwap",
        args: [token.address, 3600n],
      };
      return [instantPriceCall, twaPriceCall];
    }),
    query: {
      ...settings.query,
      select: selectPriceData,
    },
  });
}

export function usePriceData() {
  const tokenData = useTokenData();
  const nativeToken = tokenData.nativeToken;
  const wrappedNativeToken = tokenData.wrappedNativeToken;
  const siloWrappedToken3p = tokenData.siloWrappedToken3p;

  const priceQuery = usePriceQuery();
  const price = priceQuery.data;

  const result = useInstantTWATokenPricesQuery();

  const xChangeRate = useSiloWrappedTokenExchangeRateQuery();
  const creamExchangeRate = useCreamSiloWrappedTokenExchangeRate();

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

    const mainTokenPrice = TokenValue.fromBlockchain(price?.price || 0n, tokenData.mainToken.decimals);

    map.set(tokenData.mainToken, {
      instant: mainTokenPrice,
      twa: TokenValue.ZERO,
    });

    map.set(tokenData.siloWrappedToken, {
      instant: mainTokenPrice.mul(xChangeRate.data ?? TV.ZERO).reDecimal(6),
      twa: TokenValue.ZERO,
    });

    map.set(siloWrappedToken3p, {
      instant: mainTokenPrice
        .mul(xChangeRate.data ?? TV.ZERO)
        .mul(creamExchangeRate.data ?? TV.ZERO)
        .reDecimal(6),
      twa: TokenValue.ZERO,
    });

    for (const pool of priceResults.pools) {
      map.set(pool.pool, {
        instant: pool.lpUsd,
        twa: TokenValue.ZERO,
      });
    }

    return map;
  }, [
    result?.data,
    price,
    wrappedNativeToken,
    nativeToken,
    siloWrappedToken3p,
    tokenData.mainToken,
    tokenData.siloWrappedToken,
    priceResults.pools,
    xChangeRate.data,
    creamExchangeRate.data,
  ]);

  const refetch = useCallback(async () => {
    return Promise.all([priceQuery.refetch(), result.refetch(), xChangeRate.refetch()]);
  }, [priceQuery.refetch, result.refetch, xChangeRate.refetch]);

  return useMemo(() => {
    return {
      loading: priceQuery.isLoading,
      ...priceResults,
      tokenPrices,
      queryKeys: [priceQuery.queryKey, result.queryKey, xChangeRate.queryKey],
      refetch,
    };
  }, [
    priceResults,
    tokenPrices,
    priceQuery.queryKey,
    result.queryKey,
    xChangeRate.queryKey,
    priceQuery.isLoading,
    refetch,
  ]);
}

export function selectPoolsToPoolsMap(pools: PoolData[]) {
  return pools.reduce<Lookup<PoolData>>((acc, curr) => {
    const poolIndex = getTokenIndex(curr.pool ?? "");
    if (poolIndex) {
      acc[poolIndex] = curr;
    }
    return acc;
  }, {});
}
