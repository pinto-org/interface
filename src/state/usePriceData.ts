import { TV, TokenValue } from "@/classes/TokenValue";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";
import { abiSnippets } from "@/constants/abiSnippets";
import { defaultQuerySettings, defaultQuerySettingsFast } from "@/constants/query";
import { MAIN_TOKEN } from "@/constants/tokens";
import { beanstalkAbi, beanstalkPriceAddress, useReadBeanstalkPrice_Price } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useChainConstant } from "@/utils/chain";
import { getTokenIndex } from "@/utils/token";
import { FailableUseContractsResult, Token } from "@/utils/types";
import { AddressLookup, Lookup } from "@/utils/types.generic";
import { useCallback, useMemo } from "react";
import { Address, ReadContractReturnType } from "viem";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
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

type MinViablePoolReturnType = Omit<
  ReadContractReturnType<typeof diamondPriceABI, "getWell", [Address]>,
  "beanLiquidity" | "nonBeanLiquidity"
>;

/**
 * Transforms pool data from the price contract into a PoolData object
 * These structs returned from are the same struct (struct P.Pool).
 * - diamondPrice.price().ps[number]
 * - diamondPrice.getWell($address)
 */
const useSelectWellPriceData = () => {
  const mainToken = useChainConstant(MAIN_TOKEN);
  const tokenMap = useTokenMap();

  return useCallback(
    (result: MinViablePoolReturnType | FailableUseContractsResult<MinViablePoolReturnType>[number]) => {
      let data: MinViablePoolReturnType | undefined = undefined;

      if ("error" in result || ("status" in result && result.status !== "success")) {
        return data;
      } else {
        data = "result" in result ? result.result : result;
      }

      const pool = tokenMap[getTokenIndex(data.pool)];
      const tokens = data.tokens.map((token) => tokenMap[getTokenIndex(token)]);
      const balances = tokens.map((token, index) => TokenValue.fromBigInt(data.balances[index], token?.decimals ?? 0));

      return {
        pool,
        tokens,
        balances,
        deltaB: TokenValue.fromBigInt(data.deltaB, mainToken.decimals),
        lpBdv: TokenValue.fromBigInt(data.lpBdv, mainToken.decimals),
        price: TokenValue.fromBigInt(data.price, PRICE_DECIMALS),
        liquidity: TokenValue.fromBigInt(data.liquidity, PRICE_DECIMALS),
        lpUsd: TokenValue.fromBigInt(data.lpUsd, PRICE_DECIMALS),
      };
    },
    [tokenMap, mainToken],
  );
};

/**
 * Returns the price data for the de-whitelisted wells.
 *
 * PriceContract().price().ps doesn't include non-whitelisted wells,
 * so we need to get the price data for the de-whitelisted wells from the
 * getWell function separately.
 */
const useDeWhitelistedWellsPriceQuery = () => {
  const { deWhitelistedTokens } = useTokenData();
  const chainId = useChainId();
  const priceAddress = beanstalkPriceAddress[chainId];

  return useReadContracts({
    contracts: deWhitelistedTokens.map((token) => ({
      address: priceAddress,
      abi: diamondPriceABI,
      functionName: "getWell" as const,
      args: [token.address] as const,
    })),
    query: {
      ...settings.query,
    },
  });
};

const selectTwaDeltaBQuery = (data: bigint) => TokenValue.fromBlockchain(data, 6);

export function useTwaDeltaBQuery() {
  const diamond = useProtocolAddress();

  return useReadContract({
    address: diamond,
    abi: beanstalkAbi,
    functionName: "totalDeltaB",
    query: {
      ...defaultQuerySettings,
      select: selectTwaDeltaBQuery,
    },
  });
}

export function useTwaDeltaBLPQuery() {
  const diamond = useProtocolAddress();
  const tokenData = useTokenData();

  const handleSelect = useCallback(
    (data: FailableUseContractsResult<bigint>) => {
      return tokenData.lpTokens.reduce<AddressLookup<TokenValue>>((prev, curr, i) => {
        const tokenIndex = getTokenIndex(curr);

        const result = data[i];
        if (result.result || result.result === 0n) {
          const deltaB = TokenValue.fromBigInt(result.result, 6);
          prev[tokenIndex] = deltaB;
        }

        return prev;
      }, {});
    },
    [tokenData.lpTokens],
  );

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
      select: handleSelect,
    },
  });
}

export function useInstantTWATokenPricesQuery() {
  const tokenData = useTokenData();
  const tokensToFetch = useMemo(
    () => tokenData.preferredTokens.filter((token) => !token.isMain),
    [tokenData.preferredTokens],
  );
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

  const deWhitelistedWellsQuery = useDeWhitelistedWellsPriceQuery();

  const selectWellPriceData = useSelectWellPriceData();

  const priceResults = useMemo(() => {
    const pools: PoolData[] = [];

    if (price?.ps && deWhitelistedWellsQuery.data) {
      const combined = [...price.ps, ...deWhitelistedWellsQuery.data];
      for (const wellPriceData of combined) {
        const poolData = selectWellPriceData(wellPriceData);
        if (poolData && poolData.pool) {
          pools.push(poolData);
        }
      }
    }

    // Sort pools by whitelisted status first, then by liquidity
    pools.sort((a, b) => {
      if (a.pool.isWhitelisted && !b.pool.isWhitelisted) return -1;
      else if (!a.pool.isWhitelisted && b.pool.isWhitelisted) return 1;
      return Number(b.liquidity.sub(a.liquidity).toNumber());
    });

    const output = {
      deltaB: TokenValue.fromBlockchain(price?.deltaB || 0n, 6),
      liquidity: TokenValue.fromBlockchain(price?.liquidity || 0n, 4),
      price: TokenValue.fromBlockchain(price?.price || 0n, 6),
      pools: pools,
    };

    return output;
  }, [price, deWhitelistedWellsQuery.data, selectWellPriceData]);

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
    price?.price,
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
    return Promise.all([
      priceQuery.refetch(),
      result.refetch(),
      xChangeRate.refetch(),
      deWhitelistedWellsQuery.refetch(),
    ]);
  }, [priceQuery.refetch, result.refetch, xChangeRate.refetch, deWhitelistedWellsQuery.refetch]);

  const isLoading =
    priceQuery.isLoading || result.isLoading || deWhitelistedWellsQuery.isLoading || xChangeRate.isLoading;

  const queryKeys = useMemo(() => {
    return [priceQuery.queryKey, result.queryKey, xChangeRate.queryKey, deWhitelistedWellsQuery.queryKey];
  }, [priceQuery.queryKey, result.queryKey, xChangeRate.queryKey, deWhitelistedWellsQuery.queryKey]);

  return useMemo(() => {
    return {
      loading: isLoading,
      ...priceResults,
      tokenPrices,
      queryKeys,
      refetch,
    };
  }, [priceResults, tokenPrices, queryKeys, isLoading, refetch]);
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
