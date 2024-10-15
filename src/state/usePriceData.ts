import { beanstalkAbi, beanstalkAddress, useReadBeanstalkPrice_Price } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import useTokenData from "./useTokenData";
import { useChainId, useReadContracts } from "wagmi";
import { Abi, Address } from "viem";

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
  
  const tokenData = useTokenData();
  const chainId = useChainId();
  const protocolAddress = beanstalkAddress[chainId as keyof typeof beanstalkAddress] as Address;
  const nativeToken = tokenData.nativeToken;
  const wrappedNativeToken = tokenData.wrappedNativeToken;
  const tokenPrices = new Map<Token, { instant: TokenValue, twa: TokenValue }>();
  const contractCalls: { address: `0x${string}`, abi: Abi, functionName: string, args: any }[] = []; 

  const tokensToFetch = tokenData.preferredTokens.filter((token) => !token.isMain);

  for (const token of tokensToFetch) {
    if (token.isMain) continue;
    const instantPriceCall = {
      address: protocolAddress,
      abi: beanstalkAbi,
      functionName: 'getTokenUsdPrice',
      args: [token.address]
    };
    const twaPriceCall = {
      address: protocolAddress,
      abi: beanstalkAbi,
      functionName: 'getTokenUsdTwap',
      args: [token.address, 3600n]
    };
    contractCalls.push(instantPriceCall);
    contractCalls.push(twaPriceCall);
  };

  const result = useReadContracts({
    contracts: contractCalls,
    ...settings
  });
  const tokenPriceData = result.data as Array<{ result: bigint, status: string }>

  const price = useReadBeanstalkPrice_Price(settings).data;

  if (tokenPriceData) {
    for (const [index, tokenPrice] of tokenPriceData.entries()) {
      const isOdd = (index % 2 === 1);
      const _token = tokensToFetch[Math.floor(index / 2)];
      if (!isOdd) {
        tokenPrices.set(_token, { 
          instant: TokenValue.fromBlockchain(tokenPrice.result ?? 0n, 6), 
          twa: TokenValue.fromBlockchain(0, 6) 
        })
      } else {
        const _priceData = tokenPrices.get(_token);
        const newPriceData = { 
          instant: _priceData ? _priceData.instant : TokenValue.fromBlockchain(0n, 6), 
          twa: TokenValue.fromBlockchain(tokenPrice.result ?? 0n, 6) 
        }
        tokenPrices.set(_token, newPriceData)
      }
    }
    const wrappedNativePrice = tokenPrices.get(wrappedNativeToken);
    tokenPrices.set(nativeToken, wrappedNativePrice ?? { instant: TokenValue.ZERO, twa: TokenValue.ZERO });

    tokenPrices.set(tokenData.mainToken, { instant: TokenValue.fromBlockchain(price?.price || 0n, tokenData.mainToken.decimals), twa: TokenValue.ZERO })
  }
  
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
