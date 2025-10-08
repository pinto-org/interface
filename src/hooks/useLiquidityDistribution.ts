import { TokenValue } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { PINTO_WETH_TOKEN, PINTO_WSOL_TOKEN } from "@/constants/tokens";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { calculateLiquidityDistribution, formatLiquidityDistributionText } from "@/utils/liquidity";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import { base } from "viem/chains";
import { useReadContracts } from "wagmi";

export interface UseLiquidityDistributionResult {
  distribution: ReturnType<typeof calculateLiquidityDistribution> | null;
  formattedText: string;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch and calculate the liquidity distribution across different censorship risk categories
 *
 * This hook:
 * 1. Fetches pool data from the price feed
 * 2. Calculates USD values for each token in the pools
 * 3. Groups tokens by censorship risk (ETH, Circle/Coinbase, Wormhole)
 * 4. Returns percentage distribution and formatted text
 */
export function useLiquidityDistribution(): UseLiquidityDistributionResult {
  const priceData = usePriceData();
  const tokenData = useTokenData();

  // Directly call non-whitelisted pools to get their reserves
  const nonWhitelistedPoolsQuery = useReadContracts({
    contracts: [
      // PINTO/WETH pool
      {
        address: PINTO_WETH_TOKEN[base.id].address,
        abi: basinWellABI,
        functionName: "getReserves",
      },
      {
        address: PINTO_WETH_TOKEN[base.id].address,
        abi: basinWellABI,
        functionName: "tokens",
      },
      // PINTO/WSOL pool
      {
        address: PINTO_WSOL_TOKEN[base.id].address,
        abi: basinWellABI,
        functionName: "getReserves",
      },
      {
        address: PINTO_WSOL_TOKEN[base.id].address,
        abi: basinWellABI,
        functionName: "tokens",
      },
    ],
    query: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchInterval: 1000 * 60 * 3, // 3 minutes
    },
  });

  const result = useMemo(() => {
    // Return early if data is still loading
    if (priceData.loading || !priceData.pools.length || nonWhitelistedPoolsQuery.isLoading) {
      return {
        distribution: null,
        formattedText: "",
        loading: true,
        error: null,
      };
    }

    try {
      // Map to store token USD values for liquidity calculation
      const tokenUsdValues = new Map<Token, TokenValue>();

      // Process each pool to extract underlying token liquidity values
      for (const pool of priceData.pools) {
        // Each pool has tokens array and balances array
        if (pool.tokens && pool.balances && pool.tokens.length === pool.balances.length) {
          // For each token in the pool, calculate its USD value
          for (let i = 0; i < pool.tokens.length; i++) {
            const token = pool.tokens[i];
            const balance = pool.balances[i];

            // Skip PINTO tokens as they are not the underlying liquidity we want to measure
            if (token.symbol.toLowerCase() === "pinto") {
              continue;
            }

            // Get token price from the price data
            const tokenPrice = priceData.tokenPrices.get(token);

            if (tokenPrice && tokenPrice.instant) {
              const usdValue = tokenPrice.instant.mul(balance);

              // Add to existing value if token already exists in map
              const existingValue = tokenUsdValues.get(token) || TokenValue.ZERO;
              const newTotalValue = existingValue.add(usdValue);
              tokenUsdValues.set(token, newTotalValue);
            }
          }
        }
      }

      // Process non-whitelisted pools (PINTO/WETH and PINTO/WSOL)
      if (nonWhitelistedPoolsQuery.data && Array.isArray(nonWhitelistedPoolsQuery.data)) {
        const [wethReservesResult, wethTokensResult, wsolReservesResult, wsolTokensResult] =
          nonWhitelistedPoolsQuery.data;

        // Process PINTO/WETH pool
        if (
          wethReservesResult.result &&
          wethTokensResult.result &&
          !wethReservesResult.error &&
          !wethTokensResult.error
        ) {
          const wethReserves = wethReservesResult.result as bigint[];
          const wethTokenAddresses = wethTokensResult.result as string[];

          // Map token addresses to token objects and process reserves
          wethTokenAddresses.forEach((tokenAddress, index) => {
            if (index >= wethReserves.length) return;

            // Find the token object by address
            let token: Token | undefined;
            if (tokenAddress.toLowerCase() === tokenData.mainToken?.address.toLowerCase()) {
              token = tokenData.mainToken;
            } else {
              token = tokenData.preferredTokens.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase());
            }

            if (!token) {
              return;
            }

            // Skip PINTO tokens
            if (token.symbol.toLowerCase() === "pinto") {
              return;
            }

            const balance = TokenValue.fromBlockchain(wethReserves[index], token.decimals);
            const tokenPrice = priceData.tokenPrices.get(token);

            if (tokenPrice && tokenPrice.instant) {
              const usdValue = tokenPrice.instant.mul(balance);
              const existingValue = tokenUsdValues.get(token) || TokenValue.ZERO;
              const newTotalValue = existingValue.add(usdValue);
              tokenUsdValues.set(token, newTotalValue);
            }
          });
        }

        // Process PINTO/WSOL pool
        if (
          wsolReservesResult.result &&
          wsolTokensResult.result &&
          !wsolReservesResult.error &&
          !wsolTokensResult.error
        ) {
          const wsolReserves = wsolReservesResult.result as bigint[];
          const wsolTokenAddresses = wsolTokensResult.result as string[];

          // Map token addresses to token objects and process reserves
          wsolTokenAddresses.forEach((tokenAddress, index) => {
            if (index >= wsolReserves.length) return;

            // Find the token object by address
            let token: Token | undefined;
            if (tokenAddress.toLowerCase() === tokenData.mainToken?.address.toLowerCase()) {
              token = tokenData.mainToken;
            } else {
              token = tokenData.preferredTokens.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase());
            }

            if (!token) {
              return;
            }

            // Skip PINTO tokens
            if (token.symbol.toLowerCase() === "pinto") {
              return;
            }

            const balance = TokenValue.fromBlockchain(wsolReserves[index], token.decimals);
            const tokenPrice = priceData.tokenPrices.get(token);

            if (tokenPrice && tokenPrice.instant) {
              const usdValue = tokenPrice.instant.mul(balance);
              const existingValue = tokenUsdValues.get(token) || TokenValue.ZERO;
              const newTotalValue = existingValue.add(usdValue);
              tokenUsdValues.set(token, newTotalValue);
            }
          });
        }
      }

      // If no token values were calculated, return loading state
      if (tokenUsdValues.size === 0) {
        return {
          distribution: null,
          formattedText: "",
          loading: true,
          error: null,
        };
      }

      // Calculate the distribution
      const distribution = calculateLiquidityDistribution(tokenUsdValues);
      const formattedText = formatLiquidityDistributionText(distribution);

      return {
        distribution,
        formattedText,
        loading: false,
        error: null,
      };
    } catch (error) {
      console.error("Error calculating liquidity distribution:", error);
      return {
        distribution: null,
        formattedText: "",
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }, [priceData.loading, priceData.pools, priceData.tokenPrices]);

  return result;
}
