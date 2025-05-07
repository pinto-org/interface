import { TokenValue } from "@/classes/TokenValue";
import { PODS, STALK } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { BeanAdvancedChartDocument, BeanAdvancedChartQuery, Season as BeanSeason } from "@/generated/gql/pinto/graphql";
import {
  BeanstalkAdvancedChartDocument,
  BeanstalkAdvancedChartQuery,
  Season as BeanstalkSeason,
} from "@/generated/gql/pintostalk/graphql";
import { PaginationSettings, paginateMultiQuerySubgraph, paginateSubgraph } from "@/utils/paginateSubgraph";
import { Duration } from "luxon";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { APYWindow, useSeasonalAPYs } from "./seasonal/queries/useSeasonalAPY";
import useSeasonalQueries, {
  SeasonalQueryVars,
  useMultiSeasonalQueries,
} from "./seasonal/queries/useSeasonalInternalQueries";
import useSeasonalTractorSnapshots from "./seasonal/queries/useSeasonalTractorSnapshots";
import useTokenData from "./useTokenData";

export interface SeasonsTableData {
  season: number;
  timestamp: number;
  caseId: number;
  beanToMaxLpGpPerBdvRatio: number;
  deltaBeanToMaxLpGpPerBdvRatio: number;
  blocksToSoldOutSoil: string;
  deltaBeans: TokenValue;
  instDeltaB: TokenValue;
  instPrice: TokenValue;
  issuedSoil: TokenValue;
  cultivationFactor: TokenValue;
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
}

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

export default function useSeasonsDataChart(fromSeason: number, toSeason: number) {
  const chainId = useChainId();
  const tokenData = useTokenData();

  const stalkQueryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return paginateMultiQuerySubgraph(
      stalkPaginateSettings,
      subgraphs[chainId].beanstalk,
      BeanstalkAdvancedChartDocument,
      vars,
    );
  };

  const beanQueryFnFactory = (vars: SeasonalQueryVars) => async () => {
    return paginateSubgraph(beanPaginateSettings, subgraphs[chainId].bean, BeanAdvancedChartDocument, vars);
  };

  const useStalkQuery = useMultiSeasonalQueries("all_seasonsTableStalk", {
    fromSeason,
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
  }) as any;

  const useBeanQuery = useSeasonalQueries("all_seasonsTableBean", {
    fromSeason: fromSeason,
    toSeason: toSeason,
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
  });

  const useAPYQuery = useSeasonalAPYs(tokenData.mainToken.address, fromSeason, toSeason);

  const useTractorQuery = useSeasonalTractorSnapshots("SOW_V0", fromSeason, toSeason, (e: any) => e, "desc");

  const transformedData = useMemo(() => {
    if (
      Object.keys(useStalkQuery.data || {}).length === 0 ||
      Object.keys(useBeanQuery.data || {}).length === 0 ||
      Object.keys(useAPYQuery.data || {}).length === 0 ||
      Object.keys(useTractorQuery.data || {}).length === 0
    ) {
      return [];
    }
    const stalkResults = useStalkQuery.data;
    const beanResults = useBeanQuery?.data || ([] as any);
    const { fieldHourlySnapshots, siloHourlySnapshots, seasons: stalkSeasons } = stalkResults;
    const {
      [APYWindow.MONTHLY]: apy30d,
      [APYWindow.WEEKLY]: apy7d,
      [APYWindow.DAILY]: apy24h,
    } = useAPYQuery?.data || {};
    const tractorSnapshots = useTractorQuery?.data || ([] as any);

    const transformedData: SeasonsTableData[] = beanResults.reduce((acc: SeasonsTableData[], season, idx) => {
      const currFieldHourlySnapshots = fieldHourlySnapshots[idx];
      const currSiloHourlySnapshots = siloHourlySnapshots[idx];
      const currStalkSeasons = stalkSeasons[idx];
      const timeSown = currFieldHourlySnapshots.blocksToSoldOutSoil
        ? Duration.fromMillis(currFieldHourlySnapshots.blocksToSoldOutSoil * 2 * 1000).toFormat("mm:ss")
        : "-";
      const allData: Partial<SeasonsTableData> = {
        season: season.beanHourlySnapshot.season.season,
        caseId: Number(currFieldHourlySnapshots.caseId || 0),
        instDeltaB: TokenValue.fromHuman(season.beanHourlySnapshot.instDeltaB, tokenData.mainToken.decimals),
        instPrice: TokenValue.fromHuman(season.beanHourlySnapshot.instPrice, tokenData.mainToken.decimals),
        l2sr: TokenValue.fromHuman(season.beanHourlySnapshot.l2sr * 100, 2),
        twaDeltaB: TokenValue.fromHuman(season.beanHourlySnapshot.twaDeltaB, 2),
        twaPrice: TokenValue.fromHuman(season.beanHourlySnapshot.twaPrice, 4),
        blocksToSoldOutSoil: timeSown ?? "0",
        issuedSoil: TokenValue.fromBlockchain(currFieldHourlySnapshots.issuedSoil, tokenData.mainToken.decimals),
        podRate: TokenValue.fromHuman(currFieldHourlySnapshots.podRate || 0n, 18).mul(100),
        sownBeans: TokenValue.fromBlockchain(currFieldHourlySnapshots.sownBeans, tokenData.mainToken.decimals),
        deltaSownBeans: TokenValue.fromBlockchain(
          currFieldHourlySnapshots.deltaSownBeans,
          tokenData.mainToken.decimals,
        ),
        temperature: TokenValue.fromHuman(currFieldHourlySnapshots.temperature, 1).toNumber(),
        deltaTemperature: TokenValue.fromHuman(currFieldHourlySnapshots.deltaTemperature, 1).toNumber(),
        beanToMaxLpGpPerBdvRatio: currSiloHourlySnapshots.beanToMaxLpGpPerBdvRatio,
        deltaBeanToMaxLpGpPerBdvRatio: TokenValue.fromHuman(
          currSiloHourlySnapshots.deltaBeanToMaxLpGpPerBdvRatio,
          18,
        ).toNumber(),
        deltaBeans: TokenValue.fromBlockchain(currStalkSeasons.deltaBeans, tokenData.mainToken.decimals),
        price: TokenValue.fromHuman(currStalkSeasons.price, 4),
        raining: currStalkSeasons.raining,
        rewardBeans: TokenValue.fromHuman(currStalkSeasons.rewardBeans, 2),
        crosses: season.beanHourlySnapshot.crosses,
        marketCap: Number(season.beanHourlySnapshot.marketCap),
        supply: TokenValue.fromBlockchain(season.beanHourlySnapshot.supply, tokenData.mainToken.decimals),
        supplyInPegLP: TokenValue.fromBlockchain(season.beanHourlySnapshot.supply, tokenData.mainToken.decimals),
        deltaPodDemand: TokenValue.fromBlockchain(currFieldHourlySnapshots.deltaPodDemand, 18),
        realRateOfReturn: TokenValue.fromHuman(currFieldHourlySnapshots.realRateOfReturn || 0n, 18).mul(100),
        unharvestablePods: TokenValue.fromBlockchain(currFieldHourlySnapshots.unharvestablePods || 0n, PODS.decimals),
        harvestedPods: TokenValue.fromBlockchain(currFieldHourlySnapshots.harvestedPods || 0n, PODS.decimals),
        numberOfSowers: currFieldHourlySnapshots.numberOfSowers,
        numberOfSows: currFieldHourlySnapshots.numberOfSows,
        stalk: TokenValue.fromBlockchain(currSiloHourlySnapshots.stalk || 0n, STALK.decimals),
        pinto30d: apy30d?.[idx]?.value || 0,
        pinto7d: apy7d?.[idx]?.value || 0,
        pinto24h: apy24h?.[idx]?.value || 0,
        timestamp: Number(season.beanHourlySnapshot.season.timestamp || 0),
      };
      if (currFieldHourlySnapshots.cultivationFactor !== null) {
        allData.cultivationFactor = TokenValue.fromHuman(currFieldHourlySnapshots.cultivationFactor, 2);
      }
      // Ensure tractor api response is fully caught up/in sync
      if (tractorSnapshots[idx]?.season === allData.season) {
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
      }
      acc.push(allData as SeasonsTableData);
      return acc;
    }, [] as SeasonsTableData[]);
    return transformedData;
  }, [useBeanQuery.data, useStalkQuery.data, useAPYQuery.data, useTractorQuery.data, tokenData.mainToken.decimals]);

  return {
    isFetching: useBeanQuery.isLoading || useStalkQuery.isLoading,
    data: transformedData,
  };
}
