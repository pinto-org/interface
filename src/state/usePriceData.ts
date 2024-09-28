import { useReadBeanstalkPrice_Price, useReadUsdOracle_GetEthUsdPrice, useReadUsdOracle_GetEthUsdTwap, useReadUsdOracle_GetWstethUsdPrice, useReadUsdOracle_GetWstethUsdTwap } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import useTokenData from "./useTokenData";
import { useReadContracts } from "wagmi";
import chainlinkOracleAbi from "@/constants/abi/ChainlinkOracle.json";
import { Abi } from "viem";

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
  const ethPrice = useReadUsdOracle_GetEthUsdPrice(settings).data;
  const ethPriceTwa = useReadUsdOracle_GetEthUsdTwap({args: [3600n], ...settings}).data;
  const wstEthPrice = useReadUsdOracle_GetWstethUsdPrice(settings).data;
  const wstEthPriceTwa = useReadUsdOracle_GetWstethUsdTwap({args: [3600n], ...settings}).data;
  const tokenData = useTokenData();
  const tokenPrices = new Map();

  for (const token of Array.from(tokenData.preferredTokens)) {
    if (!token.priceOracle || token.isMain || token.isWhitelisted) continue

    const oracle = useReadContracts({
      contracts: [
        {
          address: token.priceOracle,
          abi: chainlinkOracleAbi as Abi, 
          functionName: 'decimals'
        },
        {
          address: token.priceOracle,
          abi: chainlinkOracleAbi as Abi,
          functionName: 'latestRoundData'
        }
      ],
      ...settings
    }).data;

    tokenPrices.set(token, {
      instant: TokenValue.fromBlockchain(oracle ? oracle[1].result[1] : 0, oracle ? oracle[0].result : 0),
      twa: TokenValue.ZERO
    })
  };

  const eth = tokenData.nativeToken;
  const weth = tokenData.preferredTokens.find((token) => token.symbol === "WETH");
  const wstEth = tokenData.preferredTokens.find((token) => token.symbol === "WSTETH");
  tokenPrices.set(eth, {
    instant: TokenValue.fromBlockchain(ethPrice || 0n, 6),
    twa: TokenValue.fromBlockchain(ethPriceTwa || 0n, 6)
  });
  tokenPrices.set(weth, {
    instant: TokenValue.fromBlockchain(ethPrice || 0n, 6),
    twa: TokenValue.fromBlockchain(ethPriceTwa || 0n, 6)
  });
  tokenPrices.set(wstEth, {
    instant: TokenValue.fromBlockchain(wstEthPrice || 0n, 6),
    twa: TokenValue.fromBlockchain(wstEthPriceTwa || 0n, 6)
  });

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
    tokenPrices: tokenPrices
  };

  return output;
}
