import { subgraphs } from "@/constants/subgraph";
import {
  PINTO_CBBTC_TOKEN,
  PINTO_CBETH_TOKEN,
  PINTO_USDC_TOKEN,
  PINTO_WETH_TOKEN,
  PINTO_WSOL_TOKEN,
} from "@/constants/tokens";
import {
  BeanstalkSeasonalMarketPerformanceDocument,
  BeanstalkSeasonalMarketPerformanceQuery,
  MarketPerformanceSeasonal,
} from "@/generated/gql/pintostalk/graphql";
import { useLPTokenToNonPintoUnderlyingMap } from "@/hooks/pinto/useTokenMap";
import useTokenData from "@/state/useTokenData";
import { useChainConstant } from "@/utils/chain";
import { PaginationSettings, paginateSubgraph } from "@/utils/paginateSubgraph";
import {
  SeasonalMarketPerformanceChartData,
  UseSeasonalMarketPerformanceResult,
  UseSeasonalResult,
} from "@/utils/types";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useSeasonalPrice } from "../seasonalDataHooks";
import useSeasonalQueries, { SeasonalQueryVars } from "./useSeasonalInternalQueries";

export enum SMPChartType {
  USD_SEASONAL = 0,
  PERCENT_SEASONAL = 1,
  USD_CUMULATIVE = 2,
  PERCENT_CUMULATIVE = 3,
  TOKEN_PRICES = 4,
}

// To be accessed as CHART_FIELDS[SMPChartType % 2]
const CHART_FIELDS = [
  ["usdChange", "totalUsdChange"],
  ["percentChange", "totalPercentChange"],
];

const accumulateUsd = (prev: number, curr: number): number => {
  return prev + curr;
};
const accumulatePercent = (prev: number, curr: number): number => {
  return (prev + 1) * (curr + 1) - 1;
};

// Manually accumulate values to allow for arbitrary starting point; subgraph cumulative values are since deployment
const accumulator = (chartType: SMPChartType): ((prev: number, curr: number) => number) => {
  if (chartType === SMPChartType.USD_CUMULATIVE) {
    return accumulateUsd;
  } else {
    return accumulatePercent;
  }
};

const paginateSettings: PaginationSettings<
  MarketPerformanceSeasonal,
  BeanstalkSeasonalMarketPerformanceQuery,
  "marketPerformanceSeasonals",
  SeasonalQueryVars
> = {
  primaryPropertyName: "marketPerformanceSeasonals",
  idField: "id",
  nextVars: (value1000: MarketPerformanceSeasonal, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        from: Number(value1000.season),
      };
    }
  },
};

export function useSeasonalMarketPerformanceData(
  fromSeason: number,
  toSeason: number,
  { enabled = true } = {},
): UseSeasonalResult<MarketPerformanceSeasonal[]> {
  const chainId = useChainId();

  const queryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return await paginateSubgraph(
      paginateSettings,
      subgraphs[chainId].beanstalk,
      BeanstalkSeasonalMarketPerformanceDocument,
      vars,
    );
  };

  const result = useSeasonalQueries("BeanstalkSeasonalMarketPerformanceQuery", {
    fromSeason,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: queryFnFactory,
    currentQueryFnFactory: queryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.timestamp) * 1000);
    },
    // Return raw subgraph result for each season
    convertResult: (entry: any) => {
      return entry;
    },
    enabled,
  });
  return result as unknown as UseSeasonalResult<MarketPerformanceSeasonal[]>;
}

// Returns chart data for the given seasons data.
// Performs accumulations if a cumulative type, using the first available season as the reference point.
export function useMarketPerformanceCalc(
  seasonalData: MarketPerformanceSeasonal[] | undefined,
  chartType: SMPChartType,
  startSeasons: Record<string, number> = {},
): SeasonalMarketPerformanceChartData {
  const mainToken = useTokenData().mainToken;
  const lpToUnderlyingMap = useLPTokenToNonPintoUnderlyingMap();

  const responseData = useMemo(() => {
    const result: SeasonalMarketPerformanceChartData = {};
    if (seasonalData) {
      for (let i = 0; i < seasonalData.length; ++i) {
        const season = seasonalData[i];
        if (chartType !== SMPChartType.TOKEN_PRICES) {
          if (season.season <= (startSeasons.NET ?? 0)) {
            continue;
          }

          result.NET ??= [
            {
              season: season.season - 1,
              value: 0,
              timestamp: new Date((Number(season.timestamp) - 60 * 60) * 1000),
            },
          ];

          const value =
            chartType < SMPChartType.USD_CUMULATIVE
              ? Number(season[CHART_FIELDS[chartType % 2][1]])
              : accumulator(chartType)(
                  result.NET[result.NET.length - 1].value,
                  Number(season[CHART_FIELDS[chartType % 2][1]]),
                );
          result.NET.push({
            season: season.season,
            value,
            timestamp: new Date(Number(season.timestamp) * 1000),
          });
        }

        let tokenIdx = 0;
        for (const token of season.silo.allWhitelistedTokens) {
          // Skip Pinto token
          if (token === mainToken.address) {
            continue;
          }

          const underlyingToken = lpToUnderlyingMap[token];
          if (!underlyingToken) {
            continue;
          }

          const symbol = underlyingToken.symbol;
          if (season.season <= (startSeasons[symbol] ?? 0)) {
            continue;
          }

          if (chartType !== SMPChartType.TOKEN_PRICES) {
            result[symbol] ??= [
              {
                season: season.season - 1,
                value: 0,
                timestamp: new Date((Number(season.timestamp) - 60 * 60) * 1000),
              },
            ];
            const arr = result[symbol];

            const value =
              chartType < SMPChartType.USD_CUMULATIVE
                ? Number(season[CHART_FIELDS[chartType % 2][0]][tokenIdx])
                : accumulator(chartType)(
                    arr[arr.length - 1].value,
                    Number(season[CHART_FIELDS[chartType % 2][0]][tokenIdx]),
                  );
            arr.push({
              season: season.season,
              value,
              timestamp: new Date(Number(season.timestamp) * 1000),
            });
          } else {
            result[symbol] ??= [];
            result[symbol].push({
              season: season.season,
              // biome-ignore lint/style/noNonNullAssertion: can't be null given only valid=true is retrieved from sg.
              value: Number(season.thisSeasonTokenUsdPrices![tokenIdx]),
              timestamp: new Date(Number(season.timestamp) * 1000),
            });
          }
          ++tokenIdx;
        }
      }
    }
    return result;
  }, [seasonalData, chartType, startSeasons, mainToken.address, lpToUnderlyingMap]);
  return responseData;
}

export function useSeasonalMarketPerformance(
  fromSeason: number,
  toSeason: number,
  chartType: SMPChartType,
  { enabled = true } = {},
): UseSeasonalMarketPerformanceResult {
  // Price query is invalid before season 6
  const actualFromSeason = chartType === SMPChartType.TOKEN_PRICES ? Math.max(fromSeason, 6) : fromSeason;
  const result = useSeasonalMarketPerformanceData(actualFromSeason, toSeason, { enabled });

  const needsPrice = chartType === SMPChartType.TOKEN_PRICES;
  const pintoPriceResult = useSeasonalPrice(actualFromSeason, toSeason, enabled && needsPrice);
  const priceReady = !needsPrice || !!pintoPriceResult.data;

  // Expand results by token
  const sgData = result.data;
  const performanceData = useMarketPerformanceCalc(sgData, chartType);

  const finalData = useMemo(() => {
    if (!sgData || !priceReady || chartType !== SMPChartType.TOKEN_PRICES) {
      return performanceData;
    }

    // Copy performanceData to avoid mutating the original
    const dataWithPrices: SeasonalMarketPerformanceChartData = {};
    for (const [key, value] of Object.entries(performanceData)) {
      dataWithPrices[key] = [...value];
    }

    for (let i = 0; i < sgData.length; ++i) {
      const season = sgData[i];
      dataWithPrices.NET ??= [];
      dataWithPrices.NET.push({
        season: season.season,
        // Assumption is that the season numbers are lining up 1:1 between price/marketPerformance data
        // biome-ignore lint/style/noNonNullAssertion: can't be null given priceReady check
        value: pintoPriceResult.data![i].value,
        timestamp: new Date(Number(season.timestamp) * 1000),
      });
    }
    return dataWithPrices;
  }, [sgData, priceReady, chartType, performanceData, pintoPriceResult.data]);

  return {
    data: !!sgData ? finalData : undefined,
    isLoading: result.isLoading || (needsPrice && pintoPriceResult.isLoading),
    isError: result.isError || (needsPrice && pintoPriceResult.isError),
  };
}
