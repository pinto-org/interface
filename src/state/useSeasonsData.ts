import { TokenValue } from "@/classes/TokenValue";
import { PODS, STALK } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import {
  BasinAdvancedChartDocument,
  BasinAdvancedChartQuery,
  BeanstalkHourlySnapshot,
} from "@/generated/gql/exchange/graphql";
import { BeanAdvancedChartDocument, BeanAdvancedChartQuery, Season as BeanSeason } from "@/generated/gql/pinto/graphql";
import {
  BeanstalkAdvancedChartDocument,
  BeanstalkAdvancedChartQuery,
  Season as BeanstalkSeason,
} from "@/generated/gql/pintostalk/graphql";
import { PaginationSettings, paginateMultiQuerySubgraph, paginateSubgraph } from "@/utils/paginateSubgraph";
import { Duration } from "luxon";
import { useCallback, useMemo } from "react";
import { useChainId } from "wagmi";
import { APYWindow, useSeasonalAPYs } from "./seasonal/queries/useSeasonalAPY";
import useSeasonalInflowSnapshots from "./seasonal/queries/useSeasonalInflowSnapshots";
import useSeasonalQueries, {
  SeasonalQueryVars,
  useMultiSeasonalQueries,
} from "./seasonal/queries/useSeasonalInternalQueries";
import {
  SMPChartType,
  useMarketPerformanceCalc,
  useSeasonalMarketPerformanceData,
} from "./seasonal/queries/useSeasonalMarketPerformance";
import useSeasonalTractorSnapshots from "./seasonal/queries/useSeasonalTractorSnapshots";
import useTokenData from "./useTokenData";

export interface SeasonsTableData {
  season: number;
  timestamp: number;
  caseId: number;
  sunriseBlock: number;
  beanToMaxLpGpPerBdvRatio: number;
  deltaBeanToMaxLpGpPerBdvRatio: number;
  blocksToSoldOutSoil: string;
  deltaBeans: TokenValue;
  instDeltaB: TokenValue;
  instPrice: TokenValue;
  issuedSoil: TokenValue;
  cultivationFactor: TokenValue;
  cultivationTemperature: TokenValue;
  l2sr: TokenValue;
  podRate: TokenValue;
  price: TokenValue;
  raining: boolean;
  rewardBeans: TokenValue;
  deltaSownBeans: TokenValue;
  sownBeans: TokenValue;
  temperature: number;
  deltaTemperature: number;
  twaDeltaB: TokenValue;
  twaPrice: TokenValue;
  deltaPodDemand: TokenValue;
  crosses: number;
  marketCap: number;
  supply: TokenValue;
  supplyInPegLP: TokenValue;
  realRateOfReturn: TokenValue;
  unharvestablePods: TokenValue;
  harvestedPods: TokenValue;
  numberOfSows: number;
  numberOfSowers: number;
  stalk: TokenValue;
  cumulativeVolumeNet: number;
  cumulativeBuyVolumeUSD: number;
  cumulativeSellVolumeUSD: number;
  cumulativeVolumeUSD: number;
  deltaVolumeNet: number;
  deltaBuyVolumeUSD: number;
  deltaSellVolumeUSD: number;
  deltaVolumeUSD: number;
  cumulativeConvertVolumeNet: number;
  cumulativeConvertUpVolumeUSD: number;
  cumulativeConvertDownVolumeUSD: number;
  cumulativeConvertVolumeUSD: number;
  cumulativeConvertNeutralTransferVolumeUSD: number;
  deltaConvertVolumeNet: number;
  deltaConvertUpVolumeUSD: number;
  deltaConvertDownVolumeUSD: number;
  deltaConvertVolumeUSD: number;
  deltaConvertNeutralTransferVolumeUSD: number;
  liquidityUSD: number;
  deltaLiquidityUSD: number;
  pinto30d: number;
  pinto7d: number;
  pinto24h: number;
  tractorSownPinto: TokenValue;
  tractorPodsMinted: TokenValue;
  tractorSowingQueue: TokenValue;
  tractorMaxSeasonalSow: TokenValue;
  tractorCumulativeTips: TokenValue;
  tractorMaxActiveTip: TokenValue;
  tractorExecutions: number;
  tractorPublishers: number;
  inflowAllCumulativeNet: number;
  inflowAllCumulativeIn: number;
  inflowAllCumulativeOut: number;
  inflowAllCumulativeVolume: number;
  inflowAllDeltaNet: number;
  inflowAllDeltaIn: number;
  inflowAllDeltaOut: number;
  inflowAllDeltaVolume: number;
  inflowSiloCumulativeNet: number;
  inflowSiloCumulativeIn: number;
  inflowSiloCumulativeOut: number;
  inflowSiloCumulativeVolume: number;
  inflowSiloDeltaNet: number;
  inflowSiloDeltaIn: number;
  inflowSiloDeltaOut: number;
  inflowSiloDeltaVolume: number;
  inflowFieldCumulativeNet: number;
  inflowFieldCumulativeIn: number;
  inflowFieldCumulativeOut: number;
  inflowFieldCumulativeVolume: number;
  inflowFieldDeltaNet: number;
  inflowFieldDeltaIn: number;
  inflowFieldDeltaOut: number;
  inflowFieldDeltaVolume: number;
  marketPriceWeth: number;
  marketPriceCbeth: number;
  marketPriceCbbtc: number;
  marketPriceWsol: number;
  marketCumulativeNonPintoUsd: number;
  marketCumulativeWethUsd: number;
  marketCumulativeCbethUsd: number;
  marketCumulativeCbbtcUsd: number;
  marketCumulativeWsolUsd: number;
  marketSeasonalNonPintoUsd: number;
  marketSeasonalWethUsd: number;
  marketSeasonalCbethUsd: number;
  marketSeasonalCbbtcUsd: number;
  marketSeasonalWsolUsd: number;
  marketCumulativeNonPintoPercent: number;
  marketCumulativeWethPercent: number;
  marketCumulativeCbethPercent: number;
  marketCumulativeCbbtcPercent: number;
  marketCumulativeWsolPercent: number;
  marketSeasonalNonPintoPercent: number;
  marketSeasonalWethPercent: number;
  marketSeasonalCbethPercent: number;
  marketSeasonalCbbtcPercent: number;
  marketSeasonalWsolPercent: number;
}

const marketStartSeasonToSymbolMappingUsd = {
  marketCumulativeNonPintoUsd: "NET",
  marketCumulativeWethUsd: "WETH",
  marketCumulativeCbethUsd: "cbETH",
  marketCumulativeCbbtcUsd: "cbBTC",
  marketCumulativeWsolUsd: "WSOL",
};

const marketStartSeasonToSymbolMappingPercent = {
  marketCumulativeNonPintoPercent: "NET",
  marketCumulativeWethPercent: "WETH",
  marketCumulativeCbethPercent: "cbETH",
  marketCumulativeCbbtcPercent: "cbBTC",
  marketCumulativeWsolPercent: "WSOL",
};

const stalkPaginateSettings: PaginationSettings<
  BeanstalkSeason,
  BeanstalkAdvancedChartQuery,
  "seasons",
  SeasonalQueryVars
> = {
  primaryPropertyName: "seasons",
  idField: "id",
  nextVars: (value1000: BeanstalkSeason, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        to: Number(value1000.season),
      };
    }
  },
};

const beanPaginateSettings: PaginationSettings<BeanSeason, BeanAdvancedChartQuery, "seasons", SeasonalQueryVars> = {
  primaryPropertyName: "seasons",
  idField: "id",
  nextVars: (value1000: BeanSeason, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        to: Number(value1000.beanHourlySnapshot.season.season),
      };
    }
  },
  orderBy: "desc",
};

const basinPaginateSettings: PaginationSettings<
  BeanstalkHourlySnapshot,
  BasinAdvancedChartQuery,
  "beanstalkHourlySnapshots",
  SeasonalQueryVars
> = {
  primaryPropertyName: "beanstalkHourlySnapshots",
  idField: "id",
  nextVars: (value1000: BeanstalkHourlySnapshot, prevVars: SeasonalQueryVars) => {
    if (value1000) {
      return {
        ...prevVars,
        to: Number(value1000.season.season),
      };
    }
  },
  orderBy: "desc",
};

export default function useSeasonsData(
  fromSeason: number,
  toSeason: number,
  {
    // If true, syncs subgraph snapshot seasons with api snapshot seasons. In practice this means all datapoints
    // are formatted to indicate the value at the start of the season, not anything during the season.
    seasonSync = false,
    // Controls whether each of these datapoints are fetched from their respective sources
    beanstalkData = true,
    beanData = true,
    basinData = true,
    apyData = true,
    tractorData = true,
    inflowData = true,
    marketPerformanceData = true,
    marketPerformanceStartSeasons = {} as Record<string, number>,
  } = {},
) {
  const chainId = useChainId();
  const tokenData = useTokenData();
  const syncOffset = seasonSync ? 1 : 0;

  const stalkQueryFnFactory = useCallback(
    (vars: SeasonalQueryVars) => async () => {
      return paginateMultiQuerySubgraph(
        stalkPaginateSettings,
        subgraphs[chainId].beanstalk,
        BeanstalkAdvancedChartDocument,
        vars,
      );
    },
    [chainId],
  );

  const beanQueryFnFactory = useCallback(
    (vars: SeasonalQueryVars) => async () => {
      return paginateSubgraph(beanPaginateSettings, subgraphs[chainId].bean, BeanAdvancedChartDocument, vars);
    },
    [chainId],
  );

  const basinQueryFnFactory = useCallback(
    (vars: SeasonalQueryVars) => async () => {
      return paginateSubgraph(basinPaginateSettings, subgraphs[chainId].basin, BasinAdvancedChartDocument, vars);
    },
    [chainId],
  );

  const useStalkQuery = useMultiSeasonalQueries("all_seasonsTableStalk", {
    fromSeason: fromSeason - syncOffset,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: stalkQueryFnFactory as any, // TODO: better type support
    currentQueryFnFactory: stalkQueryFnFactory as any, // TODO: better type support
    resultTimestamp: (entry) => {
      return new Date(Number(entry.timestamp) * 1000);
    },
    convertResult: (entry: any) => {
      return entry;
    },
    orderBy: "desc",
    enabled: beanstalkData,
  }) as any;

  const useBeanQuery = useSeasonalQueries("all_seasonsTableBean", {
    fromSeason: fromSeason - syncOffset,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: beanQueryFnFactory,
    currentQueryFnFactory: beanQueryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.timestamp) * 1000);
    },
    convertResult: (entry: any) => {
      return entry;
    },
    orderBy: "desc",
    enabled: beanData,
  });

  const useBasinQuery = useSeasonalQueries("all_seasonsTableBasin", {
    fromSeason: fromSeason - syncOffset,
    toSeason,
    queryVars: {},
    historicalQueryFnFactory: basinQueryFnFactory,
    currentQueryFnFactory: basinQueryFnFactory,
    resultTimestamp: (entry) => {
      return new Date(Number(entry.createdTimestamp) * 1000);
    },
    convertResult: (entry: any) => {
      return entry;
    },
    orderBy: "desc",
    enabled: basinData,
  });

  const useAPYQuery = useSeasonalAPYs(tokenData.mainToken.address, fromSeason, toSeason, { enabled: apyData });

  const useTractorQuery = useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (e: any) => e, {
    orderBy: "desc",
    enabled: tractorData,
  });

  const useInflowQuery = useSeasonalInflowSnapshots(fromSeason, toSeason, (e: any) => e, {
    orderBy: "desc",
    enabled: inflowData,
  });

  const useMarketPerformanceQuery = useSeasonalMarketPerformanceData(fromSeason - syncOffset, toSeason, {
    enabled: marketPerformanceData,
  });

  // Determines what season to begin the cumulative charts at
  const [startSeasonsUsd, startSeasonsPercent] = useMemo(() => {
    const startSeasonsUsd: Record<string, number> = {};
    const startSeasonsPercent: Record<string, number> = {};
    for (const property in marketPerformanceStartSeasons) {
      const season = marketPerformanceStartSeasons[property];
      if (property in marketStartSeasonToSymbolMappingUsd) {
        startSeasonsUsd[marketStartSeasonToSymbolMappingUsd[property]] = season - syncOffset;
      } else if (property in marketStartSeasonToSymbolMappingPercent) {
        startSeasonsPercent[marketStartSeasonToSymbolMappingPercent[property]] = season - syncOffset;
      } else {
        console.warn(`Unknown property provided: ${property}`);
      }
    }
    return [startSeasonsUsd, startSeasonsPercent];
  }, [marketPerformanceStartSeasons, syncOffset]);

  const marketPrices = useMarketPerformanceCalc(useMarketPerformanceQuery.data, SMPChartType.TOKEN_PRICES);
  const marketUsdCumulative = useMarketPerformanceCalc(
    useMarketPerformanceQuery.data,
    SMPChartType.USD_CUMULATIVE,
    startSeasonsUsd,
  );
  const marketUsdSeasonal = useMarketPerformanceCalc(useMarketPerformanceQuery.data, SMPChartType.USD_SEASONAL);
  const marketPercentCumulative = useMarketPerformanceCalc(
    useMarketPerformanceQuery.data,
    SMPChartType.PERCENT_CUMULATIVE,
    startSeasonsPercent,
  );
  const marketPercentSeasonal = useMarketPerformanceCalc(useMarketPerformanceQuery.data, SMPChartType.PERCENT_SEASONAL);

  const transformedData = useMemo(() => {
    if (
      (beanstalkData && Object.keys(useStalkQuery.data || {}).length === 0) ||
      (beanData && (useBeanQuery.data?.length ?? 0) === 0) ||
      (basinData && (useBasinQuery.data?.length ?? 0) === 0) ||
      (apyData && Object.keys(useAPYQuery.data || {}).length === 0) ||
      (tractorData && (useTractorQuery.data?.length ?? 0) === 0) ||
      (inflowData && (useInflowQuery.data?.length ?? 0) === 0) ||
      (marketPerformanceData && (useMarketPerformanceQuery.data?.length ?? 0) === 0)
    ) {
      return [];
    }
    const stalkResults = useStalkQuery?.data || { fieldHourlySnapshots: [], siloHourlySnapshots: [], stalkSeasons: [] };
    const beanResults = useBeanQuery?.data || ([] as any);
    const basinResults = useBasinQuery?.data || ([] as any);
    const {
      [APYWindow.MONTHLY]: apy30d,
      [APYWindow.WEEKLY]: apy7d,
      [APYWindow.DAILY]: apy24h,
    } = useAPYQuery?.data || {};
    const tractorSnapshots = useTractorQuery?.data || ([] as any);
    const inflowSnapshots = useInflowQuery?.data || ([] as any);
    const marketPerformanceResults = useMarketPerformanceQuery?.data || ([] as any);

    let maxLength = Math.max(
      beanResults.length - syncOffset,
      stalkResults.fieldHourlySnapshots.length - syncOffset,
      basinResults.length - syncOffset,
      apy24h?.length || 0,
      tractorSnapshots.length,
      inflowSnapshots.length,
      marketPerformanceResults.length - syncOffset,
    );

    // Special length handling for market performance data which has variable starting seasons
    if (Object.keys(marketPerformanceStartSeasons).length > 0) {
      const minPerfStartSeason = Math.min(...Object.values(startSeasonsUsd), ...Object.values(startSeasonsPercent));
      maxLength = Math.max(maxLength, toSeason - minPerfStartSeason + 1 - syncOffset);
    }

    const transformedData: SeasonsTableData[] = [];
    for (let idx = 0; idx < maxLength; ++idx) {
      const allData: Partial<SeasonsTableData> = {};
      const countSubgraphSeasons = stalkResults.seasons.length;

      // Subgraph data optionally has a +1 season offset applied to the datapoints, such that
      // the result indicates the value at the start rather than end of the season.
      if (beanstalkData && idx + syncOffset < countSubgraphSeasons) {
        const currFieldHourlySnapshots = stalkResults.fieldHourlySnapshots[idx + syncOffset];
        const currSiloHourlySnapshots = stalkResults.siloHourlySnapshots[idx + syncOffset];
        const currStalkSeasons = stalkResults.seasons[idx + syncOffset];
        const timeSown = currFieldHourlySnapshots.blocksToSoldOutSoil
          ? Duration.fromMillis(currFieldHourlySnapshots.blocksToSoldOutSoil * 2 * 1000).toFormat("mm:ss")
          : "-";

        allData.caseId = Number(currFieldHourlySnapshots.caseId || 0);
        allData.blocksToSoldOutSoil = timeSown ?? "0";
        allData.issuedSoil = TokenValue.fromBlockchain(
          currFieldHourlySnapshots.issuedSoil,
          tokenData.mainToken.decimals,
        );
        allData.podRate = TokenValue.fromHuman(currFieldHourlySnapshots.podRate || 0n, 18).mul(100);
        allData.sownBeans = TokenValue.fromBlockchain(currFieldHourlySnapshots.sownBeans, tokenData.mainToken.decimals);
        allData.deltaSownBeans = TokenValue.fromBlockchain(
          currFieldHourlySnapshots.deltaSownBeans,
          tokenData.mainToken.decimals,
        );
        allData.temperature = TokenValue.fromHuman(currFieldHourlySnapshots.temperature, 1).toNumber();
        allData.deltaTemperature = TokenValue.fromHuman(currFieldHourlySnapshots.deltaTemperature, 1).toNumber();
        allData.beanToMaxLpGpPerBdvRatio = currSiloHourlySnapshots.beanToMaxLpGpPerBdvRatio;
        allData.deltaBeanToMaxLpGpPerBdvRatio = TokenValue.fromHuman(
          currSiloHourlySnapshots.deltaBeanToMaxLpGpPerBdvRatio,
          18,
        ).toNumber();
        allData.deltaBeans = TokenValue.fromBlockchain(currStalkSeasons.deltaBeans, tokenData.mainToken.decimals);
        allData.price = TokenValue.fromHuman(currStalkSeasons.price, 4);
        allData.raining = currStalkSeasons.raining;
        allData.rewardBeans = TokenValue.fromHuman(currStalkSeasons.rewardBeans, 2);
        allData.deltaPodDemand = TokenValue.fromBlockchain(currFieldHourlySnapshots.deltaPodDemand, 18);
        allData.realRateOfReturn = TokenValue.fromHuman(currFieldHourlySnapshots.realRateOfReturn || 0n, 18).mul(100);
        allData.unharvestablePods = TokenValue.fromBlockchain(
          currFieldHourlySnapshots.unharvestablePods || 0n,
          PODS.decimals,
        );
        allData.harvestedPods = TokenValue.fromBlockchain(currFieldHourlySnapshots.harvestedPods || 0n, PODS.decimals);
        allData.numberOfSowers = currFieldHourlySnapshots.numberOfSowers;
        allData.numberOfSows = currFieldHourlySnapshots.numberOfSows;
        allData.stalk = TokenValue.fromBlockchain(currSiloHourlySnapshots.stalk || 0n, STALK.decimals);

        if (currFieldHourlySnapshots.cultivationFactor !== null) {
          allData.cultivationFactor = TokenValue.fromHuman(currFieldHourlySnapshots.cultivationFactor, 2);
        }
        if (currFieldHourlySnapshots.cultivationTemperature !== null) {
          allData.cultivationTemperature = TokenValue.fromHuman(currFieldHourlySnapshots.cultivationTemperature, 2);
        }

        if (!allData.season) {
          const season = stalkResults.seasons[idx];
          allData.season = season.season;
          allData.timestamp = Number(season.createdAt || 0);
          allData.sunriseBlock = Number(season.sunriseBlock || 0);
        }
      }

      if (beanData && idx + syncOffset < countSubgraphSeasons) {
        const beanHourly = beanResults[idx + syncOffset].beanHourlySnapshot;
        allData.crosses = beanHourly.crosses;
        allData.marketCap = Number(beanHourly.marketCap);
        allData.supply = TokenValue.fromBlockchain(beanHourly.supply, tokenData.mainToken.decimals);
        allData.supplyInPegLP = TokenValue.fromBlockchain(beanHourly.supply, tokenData.mainToken.decimals);
        allData.instDeltaB = TokenValue.fromHuman(beanHourly.instDeltaB, tokenData.mainToken.decimals);
        allData.instPrice = TokenValue.fromHuman(beanHourly.instPrice, tokenData.mainToken.decimals);
        allData.l2sr = TokenValue.fromHuman(beanHourly.l2sr * 100, 2);
        allData.twaDeltaB = TokenValue.fromHuman(beanHourly.twaDeltaB, 2);
        allData.twaPrice = TokenValue.fromHuman(beanHourly.twaPrice, 4);

        if (!allData.season) {
          const season = beanResults[idx].season;
          allData.season = season.season;
          allData.timestamp = Number(season.timestamp || 0);
        }
      }

      if (basinData && idx + syncOffset < countSubgraphSeasons) {
        const currBasinSeason = basinResults[idx + syncOffset];
        allData.cumulativeVolumeNet =
          Number(currBasinSeason.cumulativeBuyVolumeUSD) - Number(currBasinSeason.cumulativeSellVolumeUSD);
        allData.cumulativeBuyVolumeUSD = Number(currBasinSeason.cumulativeBuyVolumeUSD);
        allData.cumulativeSellVolumeUSD = Number(currBasinSeason.cumulativeSellVolumeUSD);
        allData.cumulativeVolumeUSD = Number(currBasinSeason.cumulativeTradeVolumeUSD);
        allData.deltaVolumeNet = Number(currBasinSeason.deltaBuyVolumeUSD) - Number(currBasinSeason.deltaSellVolumeUSD);
        allData.deltaBuyVolumeUSD = Number(currBasinSeason.deltaBuyVolumeUSD);
        allData.deltaSellVolumeUSD = Number(currBasinSeason.deltaSellVolumeUSD);
        allData.deltaVolumeUSD = Number(currBasinSeason.deltaTradeVolumeUSD);
        allData.cumulativeConvertVolumeNet =
          Number(currBasinSeason.cumulativeConvertUpVolumeUSD) - Number(currBasinSeason.cumulativeConvertDownVolumeUSD);
        allData.cumulativeConvertUpVolumeUSD = Number(currBasinSeason.cumulativeConvertUpVolumeUSD);
        allData.cumulativeConvertDownVolumeUSD = Number(currBasinSeason.cumulativeConvertDownVolumeUSD);
        allData.cumulativeConvertVolumeUSD = Number(currBasinSeason.cumulativeConvertVolumeUSD);
        allData.cumulativeConvertNeutralTransferVolumeUSD = Number(
          currBasinSeason.cumulativeConvertNeutralTransferVolumeUSD,
        );
        allData.deltaConvertVolumeNet =
          Number(currBasinSeason.deltaConvertUpVolumeUSD) - Number(currBasinSeason.deltaConvertDownVolumeUSD);
        allData.deltaConvertUpVolumeUSD = Number(currBasinSeason.deltaConvertUpVolumeUSD);
        allData.deltaConvertDownVolumeUSD = Number(currBasinSeason.deltaConvertDownVolumeUSD);
        allData.deltaConvertVolumeUSD = Number(currBasinSeason.deltaConvertVolumeUSD);
        allData.deltaConvertNeutralTransferVolumeUSD = Number(currBasinSeason.deltaConvertNeutralTransferVolumeUSD);
        allData.liquidityUSD = Number(currBasinSeason.totalLiquidityUSD);
        allData.deltaLiquidityUSD = Number(currBasinSeason.deltaLiquidityUSD);

        if (!allData.season) {
          const season = basinResults[idx].season;
          allData.season = season.season;
          allData.timestamp = Number(season.createdTimestamp);
        }
      }

      if (apyData) {
        allData.pinto30d = apy30d?.[idx]?.value || 0;
        allData.pinto7d = apy7d?.[idx]?.value || 0;
        allData.pinto24h = apy24h?.[idx]?.value || 0;

        if (!allData.season) {
          allData.season = apy24h?.[idx]?.season;
          allData.timestamp = apy24h?.[idx]?.timestamp ? apy24h[idx].timestamp.getTime() / 1000 : undefined;
        }
      }

      if (tractorData) {
        // Ensure tractor api response is fully caught up/in sync
        if (!allData.season || tractorSnapshots[idx]?.season === allData.season) {
          allData.tractorSownPinto = TokenValue.fromBlockchain(
            tractorSnapshots[idx]?.totalPintoSown || 0n,
            PODS.decimals,
          );
          allData.tractorPodsMinted = TokenValue.fromBlockchain(
            tractorSnapshots[idx]?.totalPodsMinted || 0n,
            PODS.decimals,
          );
          allData.tractorSowingQueue = TokenValue.fromBlockchain(
            tractorSnapshots[idx]?.totalCascadeFundedBelowTemp || 0n,
            PODS.decimals,
          );
          allData.tractorMaxSeasonalSow = TokenValue.fromBlockchain(
            tractorSnapshots[idx]?.maxSowThisSeason || 0n,
            PODS.decimals,
          );
          allData.tractorCumulativeTips = TokenValue.fromBlockchain(
            tractorSnapshots[idx]?.totalTipsPaid || 0n,
            PODS.decimals,
          );
          allData.tractorMaxActiveTip = TokenValue.fromBlockchain(
            tractorSnapshots[idx]?.currentMaxTip || 0n,
            PODS.decimals,
          );
          allData.tractorExecutions = tractorSnapshots[idx]?.totalExecutions || 0;
          allData.tractorPublishers = tractorSnapshots[idx]?.uniquePublishers || 0;

          if (!allData.season) {
            allData.season = tractorSnapshots[idx]?.season;
            allData.timestamp = new Date(tractorSnapshots[idx]?.snapshotTimestamp).getTime() / 1000;
          }
        }
      }

      if (inflowData) {
        // Ensure api response is fully caught up/in sync
        const currInflow = inflowSnapshots[idx];
        if (currInflow && (!allData.season || currInflow.season === allData.season)) {
          allData.inflowAllCumulativeNet = currInflow.all.cumulative.net;
          allData.inflowAllCumulativeIn = currInflow.all.cumulative.in;
          allData.inflowAllCumulativeOut = currInflow.all.cumulative.out;
          allData.inflowAllCumulativeVolume = currInflow.all.cumulative.volume;
          allData.inflowAllDeltaNet = currInflow.all.delta.net;
          allData.inflowAllDeltaIn = currInflow.all.delta.in;
          allData.inflowAllDeltaOut = currInflow.all.delta.out;
          allData.inflowAllDeltaVolume = currInflow.all.delta.volume;
          allData.inflowSiloCumulativeNet = currInflow.silo.cumulative.net;
          allData.inflowSiloCumulativeIn = currInflow.silo.cumulative.in;
          allData.inflowSiloCumulativeOut = currInflow.silo.cumulative.out;
          allData.inflowSiloCumulativeVolume = currInflow.silo.cumulative.volume;
          allData.inflowSiloDeltaNet = currInflow.silo.delta.net;
          allData.inflowSiloDeltaIn = currInflow.silo.delta.in;
          allData.inflowSiloDeltaOut = currInflow.silo.delta.out;
          allData.inflowSiloDeltaVolume = currInflow.silo.delta.volume;
          allData.inflowFieldCumulativeNet = currInflow.field.cumulative.net;
          allData.inflowFieldCumulativeIn = currInflow.field.cumulative.in;
          allData.inflowFieldCumulativeOut = currInflow.field.cumulative.out;
          allData.inflowFieldCumulativeVolume = currInflow.field.cumulative.volume;
          allData.inflowFieldDeltaNet = currInflow.field.delta.net;
          allData.inflowFieldDeltaIn = currInflow.field.delta.in;
          allData.inflowFieldDeltaOut = currInflow.field.delta.out;
          allData.inflowFieldDeltaVolume = currInflow.field.delta.volume;

          if (!allData.season) {
            allData.season = currInflow.season;
            allData.timestamp = new Date(currInflow.snapshotTimestamp).getTime() / 1000;
          }
        }
      }

      if (marketPerformanceData && idx + syncOffset < countSubgraphSeasons) {
        allData.marketPriceWeth = marketPrices.WETH[marketPrices.WETH.length - 1 - idx - syncOffset].value;
        allData.marketPriceCbeth = marketPrices.cbETH[marketPrices.cbETH.length - 1 - idx - syncOffset].value;
        allData.marketPriceCbbtc = marketPrices.cbBTC[marketPrices.cbBTC.length - 1 - idx - syncOffset].value;
        allData.marketPriceWsol = marketPrices.WSOL[marketPrices.WSOL.length - 1 - idx - syncOffset].value;
        allData.marketCumulativeNonPintoUsd =
          marketUsdCumulative.NET?.[marketUsdCumulative.NET.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeWethUsd =
          marketUsdCumulative.WETH?.[marketUsdCumulative.WETH.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeCbethUsd =
          marketUsdCumulative.cbETH?.[marketUsdCumulative.cbETH.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeCbbtcUsd =
          marketUsdCumulative.cbBTC?.[marketUsdCumulative.cbBTC.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeWsolUsd =
          marketUsdCumulative.WSOL?.[marketUsdCumulative.WSOL.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalNonPintoUsd =
          marketUsdSeasonal.NET[marketUsdSeasonal.NET.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalWethUsd =
          marketUsdSeasonal.WETH[marketUsdSeasonal.WETH.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalCbethUsd =
          marketUsdSeasonal.cbETH[marketUsdSeasonal.cbETH.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalCbbtcUsd =
          marketUsdSeasonal.cbBTC[marketUsdSeasonal.cbBTC.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalWsolUsd =
          marketUsdSeasonal.WSOL[marketUsdSeasonal.WSOL.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeNonPintoPercent =
          marketPercentCumulative.NET?.[marketPercentCumulative.NET.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeWethPercent =
          marketPercentCumulative.WETH?.[marketPercentCumulative.WETH.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeCbethPercent =
          marketPercentCumulative.cbETH?.[marketPercentCumulative.cbETH.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeCbbtcPercent =
          marketPercentCumulative.cbBTC?.[marketPercentCumulative.cbBTC.length - 1 - idx - syncOffset]?.value;
        allData.marketCumulativeWsolPercent =
          marketPercentCumulative.WSOL?.[marketPercentCumulative.WSOL.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalNonPintoPercent =
          marketPercentSeasonal.NET[marketPercentSeasonal.NET.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalWethPercent =
          marketPercentSeasonal.WETH[marketPercentSeasonal.WETH.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalCbethPercent =
          marketPercentSeasonal.cbETH[marketPercentSeasonal.cbETH.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalCbbtcPercent =
          marketPercentSeasonal.cbBTC[marketPercentSeasonal.cbBTC.length - 1 - idx - syncOffset]?.value;
        allData.marketSeasonalWsolPercent =
          marketPercentSeasonal.WSOL[marketPercentSeasonal.WSOL.length - 1 - idx - syncOffset]?.value;

        if (!allData.season) {
          const season = marketPerformanceResults[marketPerformanceResults.length - 1 - idx].season;
          allData.season = season.season;
          allData.timestamp = Number(season.createdTimestamp);
        }
      }
      transformedData.push(allData as SeasonsTableData);
    }
    return transformedData;
  }, [
    useBeanQuery.data,
    useStalkQuery.data,
    useBasinQuery.data,
    useAPYQuery.data,
    useTractorQuery.data,
    useInflowQuery.data,
    useMarketPerformanceQuery.data,
    tokenData.mainToken.decimals,
    seasonSync,
    beanstalkData,
    beanData,
    basinData,
    apyData,
    tractorData,
    inflowData,
    marketPerformanceData,
    marketPerformanceStartSeasons,
    toSeason,
  ]);

  return {
    isFetching: useBeanQuery.isLoading || useStalkQuery.isLoading,
    data: transformedData,
  };
}
