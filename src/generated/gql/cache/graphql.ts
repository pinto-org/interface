/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
};

export type BeanHourlySnapshot = {
  __typename?: 'BeanHourlySnapshot';
  createdTimestamp: Scalars['BigInt']['output'];
  crosses: Scalars['Int']['output'];
  deltaCrosses: Scalars['Int']['output'];
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  deltaVolume: Scalars['BigInt']['output'];
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  instDeltaB: Scalars['BigDecimal']['output'];
  instPrice: Scalars['BigDecimal']['output'];
  l2sr: Scalars['BigDecimal']['output'];
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  lockedBeans: Scalars['BigInt']['output'];
  marketCap: Scalars['BigDecimal']['output'];
  seasonNumber: Scalars['Int']['output'];
  supply: Scalars['BigInt']['output'];
  supplyInPegLP: Scalars['BigDecimal']['output'];
  twaBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  twaDeltaB: Scalars['BigDecimal']['output'];
  twaLiquidityUSD: Scalars['BigDecimal']['output'];
  twaNonBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  twaPrice: Scalars['BigDecimal']['output'];
  volume: Scalars['BigInt']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type BeanstalkHourlySnapshot = {
  __typename?: 'BeanstalkHourlySnapshot';
  createdTimestamp: Scalars['BigInt']['output'];
  cumulativeBuyVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeConvertVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeSellVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  deltaBuyVolumeUSD: Scalars['BigDecimal']['output'];
  deltaConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  deltaConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  deltaConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  deltaConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  deltaConvertVolumeUSD: Scalars['BigDecimal']['output'];
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  deltaSellVolumeUSD: Scalars['BigDecimal']['output'];
  deltaTradeVolumeUSD: Scalars['BigDecimal']['output'];
  deltaTransferVolumeUSD: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  season: Scalars['Int']['output'];
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
};

export type FarmerBalanceHourlySnapshot = {
  __typename?: 'FarmerBalanceHourlySnapshot';
  createdTimestamp: Scalars['BigInt']['output'];
  deltaFarmBalance: Scalars['BigInt']['output'];
  deltaTotalBalance: Scalars['BigInt']['output'];
  deltaWalletBalance: Scalars['BigInt']['output'];
  farmBalance: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  seasonNumber: Scalars['Int']['output'];
  totalBalance: Scalars['BigInt']['output'];
  walletBalance: Scalars['BigInt']['output'];
};

export type FieldHourlySnapshot = {
  __typename?: 'FieldHourlySnapshot';
  blocksToSoldOutSoil?: Maybe<Scalars['BigInt']['output']>;
  caseId?: Maybe<Scalars['BigInt']['output']>;
  createdAt: Scalars['BigInt']['output'];
  cultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  cultivationTemperature?: Maybe<Scalars['BigDecimal']['output']>;
  deltaCultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  deltaCultivationTemperature?: Maybe<Scalars['BigDecimal']['output']>;
  deltaHarvestableIndex: Scalars['BigInt']['output'];
  deltaHarvestablePods: Scalars['BigInt']['output'];
  deltaHarvestedPods: Scalars['BigInt']['output'];
  deltaIssuedSoil: Scalars['BigInt']['output'];
  deltaNumberOfSowers: Scalars['Int']['output'];
  deltaNumberOfSows: Scalars['Int']['output'];
  deltaPodDemand: Scalars['BigInt']['output'];
  deltaPodIndex: Scalars['BigInt']['output'];
  deltaPodRate: Scalars['BigDecimal']['output'];
  deltaRealRateOfReturn: Scalars['BigDecimal']['output'];
  deltaSoil: Scalars['BigInt']['output'];
  deltaSownBeans: Scalars['BigInt']['output'];
  deltaTemperature: Scalars['BigDecimal']['output'];
  deltaUnharvestablePods: Scalars['BigInt']['output'];
  fieldId: Scalars['BigInt']['output'];
  harvestableIndex: Scalars['BigInt']['output'];
  harvestablePods: Scalars['BigInt']['output'];
  harvestedPods: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  issuedSoil: Scalars['BigInt']['output'];
  numberOfSowers: Scalars['Int']['output'];
  numberOfSows: Scalars['Int']['output'];
  podIndex: Scalars['BigInt']['output'];
  podRate: Scalars['BigDecimal']['output'];
  realRateOfReturn: Scalars['BigDecimal']['output'];
  season: Scalars['Int']['output'];
  seasonBlock: Scalars['BigInt']['output'];
  soil: Scalars['BigInt']['output'];
  soilSoldOut: Scalars['Boolean']['output'];
  sownBeans: Scalars['BigInt']['output'];
  temperature: Scalars['BigDecimal']['output'];
  unharvestablePods: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type GaugesInfoHourlySnapshot = {
  __typename?: 'GaugesInfoHourlySnapshot';
  createdAt: Scalars['BigInt']['output'];
  deltaG0CultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  deltaG0IsActive: Scalars['Boolean']['output'];
  deltaG1BlightFactor?: Maybe<Scalars['BigInt']['output']>;
  deltaG1ConvertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  deltaG1IsActive: Scalars['Boolean']['output'];
  deltaG2BdvConvertedThisSeason?: Maybe<Scalars['BigInt']['output']>;
  deltaG2BonusStalkPerBdv?: Maybe<Scalars['BigInt']['output']>;
  deltaG2IsActive: Scalars['Boolean']['output'];
  deltaG2MaxConvertCapacity?: Maybe<Scalars['BigInt']['output']>;
  deltaG2MaxTwaDeltaB?: Maybe<Scalars['BigInt']['output']>;
  g0CultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  g0IsActive: Scalars['Boolean']['output'];
  g1BlightFactor?: Maybe<Scalars['BigInt']['output']>;
  g1ConvertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  g1IsActive: Scalars['Boolean']['output'];
  g2BdvConvertedThisSeason?: Maybe<Scalars['BigInt']['output']>;
  g2BonusStalkPerBdv?: Maybe<Scalars['BigInt']['output']>;
  g2IsActive: Scalars['Boolean']['output'];
  g2MaxConvertCapacity?: Maybe<Scalars['BigInt']['output']>;
  g2MaxTwaDeltaB?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  season: Scalars['Int']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type MarketPerformanceSeasonal = {
  __typename?: 'MarketPerformanceSeasonal';
  cumulativePercentChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  cumulativeTotalPercentChange?: Maybe<Scalars['BigDecimal']['output']>;
  cumulativeTotalUsdChange?: Maybe<Scalars['BigDecimal']['output']>;
  cumulativeUsdChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  id: Scalars['ID']['output'];
  percentChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  prevSeasonTokenBalances: Array<Scalars['BigInt']['output']>;
  prevSeasonTokenUsdPrices: Array<Scalars['BigDecimal']['output']>;
  prevSeasonTokenUsdValues: Array<Scalars['BigDecimal']['output']>;
  prevSeasonTotalUsd: Scalars['BigDecimal']['output'];
  season: Scalars['Int']['output'];
  thisSeasonTokenUsdPrices?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  thisSeasonTokenUsdValues?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  thisSeasonTotalUsd?: Maybe<Scalars['BigDecimal']['output']>;
  timestamp?: Maybe<Scalars['BigInt']['output']>;
  totalPercentChange?: Maybe<Scalars['BigDecimal']['output']>;
  totalUsdChange?: Maybe<Scalars['BigDecimal']['output']>;
  usdChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  valid: Scalars['Boolean']['output'];
};

export type PodMarketplaceHourlySnapshot = {
  __typename?: 'PodMarketplaceHourlySnapshot';
  availableListedPods: Scalars['BigInt']['output'];
  availableOrderBeans: Scalars['BigInt']['output'];
  beanVolume: Scalars['BigInt']['output'];
  cancelledListedPods: Scalars['BigInt']['output'];
  cancelledOrderBeans: Scalars['BigInt']['output'];
  createdAt: Scalars['BigInt']['output'];
  deltaAvailableListedPods: Scalars['BigInt']['output'];
  deltaAvailableOrderBeans: Scalars['BigInt']['output'];
  deltaBeanVolume: Scalars['BigInt']['output'];
  deltaCancelledListedPods: Scalars['BigInt']['output'];
  deltaCancelledOrderBeans: Scalars['BigInt']['output'];
  deltaExpiredListedPods: Scalars['BigInt']['output'];
  deltaFilledListedPods: Scalars['BigInt']['output'];
  deltaFilledOrderBeans: Scalars['BigInt']['output'];
  deltaFilledOrderedPods: Scalars['BigInt']['output'];
  deltaListedPods: Scalars['BigInt']['output'];
  deltaOrderBeans: Scalars['BigInt']['output'];
  deltaPodVolume: Scalars['BigInt']['output'];
  expiredListedPods: Scalars['BigInt']['output'];
  filledListedPods: Scalars['BigInt']['output'];
  filledOrderBeans: Scalars['BigInt']['output'];
  filledOrderedPods: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  listedPods: Scalars['BigInt']['output'];
  orderBeans: Scalars['BigInt']['output'];
  podVolume: Scalars['BigInt']['output'];
  season: Scalars['Int']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type PoolHourlySnapshot = {
  __typename?: 'PoolHourlySnapshot';
  createdTimestamp: Scalars['BigInt']['output'];
  crosses: Scalars['Int']['output'];
  deltaCrosses: Scalars['Int']['output'];
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  deltaReserves: Array<Scalars['BigInt']['output']>;
  deltaVolume: Scalars['BigInt']['output'];
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  instDeltaB: Scalars['BigDecimal']['output'];
  instPrice: Scalars['BigDecimal']['output'];
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  reserves: Array<Scalars['BigInt']['output']>;
  seasonNumber: Scalars['Int']['output'];
  twaBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  twaDeltaB: Scalars['BigDecimal']['output'];
  twaLiquidityUSD: Scalars['BigDecimal']['output'];
  twaNonBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  twaPrice: Scalars['BigDecimal']['output'];
  twaReserves: Array<Scalars['BigInt']['output']>;
  twaToken2Price: Scalars['BigDecimal']['output'];
  volume: Scalars['BigInt']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type Query = {
  __typename?: 'Query';
  cache_beanHourlySnapshots: Array<BeanHourlySnapshot>;
  cache_beanstalkHourlySnapshots: Array<BeanstalkHourlySnapshot>;
  cache_farmerBalanceHourlySnapshots: Array<FarmerBalanceHourlySnapshot>;
  cache_fieldHourlySnapshots: Array<FieldHourlySnapshot>;
  cache_gaugesInfoHourlySnapshots: Array<GaugesInfoHourlySnapshot>;
  cache_marketPerformanceSeasonals: Array<MarketPerformanceSeasonal>;
  cache_podMarketplaceHourlySnapshots: Array<PodMarketplaceHourlySnapshot>;
  cache_poolHourlySnapshots: Array<PoolHourlySnapshot>;
  cache_seasons: Array<Season>;
  cache_siloAssetHourlySnapshots: Array<SiloAssetHourlySnapshot>;
  cache_siloHourlySnapshots: Array<SiloHourlySnapshot>;
  cache_tokenHourlySnapshots: Array<TokenHourlySnapshot>;
  cache_tractorHourlySnapshots: Array<TractorHourlySnapshot>;
  cache_unripeTokenHourlySnapshots: Array<UnripeTokenHourlySnapshot>;
  cache_wellHourlySnapshots: Array<WellHourlySnapshot>;
  cache_whitelistTokenHourlySnapshots: Array<WhitelistTokenHourlySnapshot>;
  cache_wrappedDepositERC20HourlySnapshots: Array<WrappedDepositErc20HourlySnapshot>;
};


export type QueryCacheBeanHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheBeanstalkHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheFarmerBalanceHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheFieldHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheGaugesInfoHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheMarketPerformanceSeasonalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCachePodMarketplaceHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCachePoolHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheSeasonsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheSiloAssetHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheSiloHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheTokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheTractorHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheUnripeTokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheWellHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheWhitelistTokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCacheWrappedDepositErc20HourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['String']['input']>;
};

export type Season = {
  __typename?: 'Season';
  beans: Scalars['BigInt']['output'];
  createdAt: Scalars['BigInt']['output'];
  deltaB: Scalars['BigInt']['output'];
  deltaBeans: Scalars['BigInt']['output'];
  floodFieldBeans: Scalars['BigInt']['output'];
  floodSiloBeans: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  incentiveBeans: Scalars['BigInt']['output'];
  marketCap: Scalars['BigDecimal']['output'];
  price: Scalars['BigDecimal']['output'];
  raining: Scalars['Boolean']['output'];
  rewardBeans: Scalars['BigInt']['output'];
  season: Scalars['Int']['output'];
  sunriseBlock: Scalars['BigInt']['output'];
  unmigratedL1Beans?: Maybe<Scalars['BigInt']['output']>;
};

export type SiloAssetHourlySnapshot = {
  __typename?: 'SiloAssetHourlySnapshot';
  createdAt: Scalars['BigInt']['output'];
  deltaDepositedAmount: Scalars['BigInt']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaWithdrawnAmount: Scalars['BigInt']['output'];
  depositedAmount: Scalars['BigInt']['output'];
  depositedBDV: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  season: Scalars['Int']['output'];
  updatedAt: Scalars['BigInt']['output'];
  withdrawnAmount: Scalars['BigInt']['output'];
};

export type SiloHourlySnapshot = {
  __typename?: 'SiloHourlySnapshot';
  activeFarmers: Scalars['Int']['output'];
  avgConvertDownPenalty: Scalars['BigDecimal']['output'];
  avgGrownStalkPerBdvPerSeason: Scalars['BigInt']['output'];
  beanMints: Scalars['BigInt']['output'];
  beanToMaxLpGpPerBdvRatio: Scalars['BigInt']['output'];
  bonusStalkConvertUp: Scalars['BigInt']['output'];
  caseId?: Maybe<Scalars['BigInt']['output']>;
  convertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  createdAt: Scalars['BigInt']['output'];
  cropRatio: Scalars['BigDecimal']['output'];
  deltaActiveFarmers: Scalars['Int']['output'];
  deltaAvgConvertDownPenalty: Scalars['BigDecimal']['output'];
  deltaAvgGrownStalkPerBdvPerSeason: Scalars['BigInt']['output'];
  deltaBeanMints: Scalars['BigInt']['output'];
  deltaBeanToMaxLpGpPerBdvRatio: Scalars['BigInt']['output'];
  deltaBonusStalkConvertUp: Scalars['BigInt']['output'];
  deltaConvertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  deltaCropRatio: Scalars['BigDecimal']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaGerminatingStalk: Scalars['BigInt']['output'];
  deltaGrownStalkPerSeason: Scalars['BigInt']['output'];
  deltaPenalizedStalkConvertDown: Scalars['BigInt']['output'];
  deltaPlantableStalk: Scalars['BigInt']['output'];
  deltaPlantedBeans: Scalars['BigInt']['output'];
  deltaRoots: Scalars['BigInt']['output'];
  deltaStalk: Scalars['BigInt']['output'];
  deltaTotalBdvConvertUp: Scalars['BigInt']['output'];
  deltaTotalBdvConvertUpBonus: Scalars['BigInt']['output'];
  deltaUnpenalizedStalkConvertDown: Scalars['BigInt']['output'];
  depositedBDV: Scalars['BigInt']['output'];
  germinatingStalk: Scalars['BigInt']['output'];
  grownStalkPerSeason: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  penalizedStalkConvertDown: Scalars['BigInt']['output'];
  plantableStalk: Scalars['BigInt']['output'];
  plantedBeans: Scalars['BigInt']['output'];
  roots: Scalars['BigInt']['output'];
  season: Scalars['Int']['output'];
  stalk: Scalars['BigInt']['output'];
  totalBdvConvertUp: Scalars['BigInt']['output'];
  totalBdvConvertUpBonus: Scalars['BigInt']['output'];
  unpenalizedStalkConvertDown: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type TokenHourlySnapshot = {
  __typename?: 'TokenHourlySnapshot';
  createdTimestamp: Scalars['BigInt']['output'];
  decimals: Scalars['BigInt']['output'];
  deltaFarmBalance: Scalars['BigInt']['output'];
  deltaLastPriceUSD: Scalars['BigDecimal']['output'];
  deltaPooledBalance: Scalars['BigInt']['output'];
  deltaSupply: Scalars['BigInt']['output'];
  deltaWalletBalance: Scalars['BigInt']['output'];
  farmBalance: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  lastPriceUSD: Scalars['BigDecimal']['output'];
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  name: Scalars['String']['output'];
  pooledBalance: Scalars['BigInt']['output'];
  seasonNumber: Scalars['Int']['output'];
  supply: Scalars['BigInt']['output'];
  walletBalance: Scalars['BigInt']['output'];
};

export type TractorHourlySnapshot = {
  __typename?: 'TractorHourlySnapshot';
  createdAt: Scalars['BigInt']['output'];
  deltaTotalExecutions: Scalars['Int']['output'];
  deltaTotalNegBeanTips: Scalars['BigInt']['output'];
  deltaTotalPosBeanTips: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  season: Scalars['Int']['output'];
  totalExecutions: Scalars['Int']['output'];
  totalNegBeanTips: Scalars['BigInt']['output'];
  totalPosBeanTips: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type UnripeTokenHourlySnapshot = {
  __typename?: 'UnripeTokenHourlySnapshot';
  amountUnderlyingOne: Scalars['BigInt']['output'];
  bdvUnderlyingOne: Scalars['BigInt']['output'];
  chopRate: Scalars['BigDecimal']['output'];
  choppableAmountOne: Scalars['BigInt']['output'];
  choppableBdvOne: Scalars['BigInt']['output'];
  createdAt: Scalars['BigInt']['output'];
  deltaAmountUnderlyingOne: Scalars['BigInt']['output'];
  deltaBdvUnderlyingOne: Scalars['BigInt']['output'];
  deltaChopRate: Scalars['BigDecimal']['output'];
  deltaChoppableAmountOne: Scalars['BigInt']['output'];
  deltaChoppableBdvOne: Scalars['BigInt']['output'];
  deltaRecapPercent: Scalars['BigDecimal']['output'];
  deltaTotalChoppedAmount: Scalars['BigInt']['output'];
  deltaTotalChoppedBdv: Scalars['BigInt']['output'];
  deltaTotalChoppedBdvReceived: Scalars['BigInt']['output'];
  deltaTotalUnderlying: Scalars['BigInt']['output'];
  deltaUnderlyingToken: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  recapPercent: Scalars['BigDecimal']['output'];
  season: Scalars['Int']['output'];
  totalChoppedAmount: Scalars['BigInt']['output'];
  totalChoppedBdv: Scalars['BigInt']['output'];
  totalChoppedBdvReceived: Scalars['BigInt']['output'];
  totalUnderlying: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type WellHourlySnapshot = {
  __typename?: 'WellHourlySnapshot';
  convertVolumeReserves: Array<Scalars['BigInt']['output']>;
  convertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  convertVolumeUSD: Scalars['BigDecimal']['output'];
  createdTimestamp: Scalars['BigInt']['output'];
  cumulativeBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  cumulativeTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  cumulativeTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  cumulativeTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  cumulativeTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  deltaBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  deltaConvertVolumeReserves: Array<Scalars['BigInt']['output']>;
  deltaConvertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  deltaConvertVolumeUSD: Scalars['BigDecimal']['output'];
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  deltaLpTokenSupply: Scalars['BigInt']['output'];
  deltaTokenRates: Array<Scalars['BigDecimal']['output']>;
  deltaTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  deltaTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  deltaTradeVolumeUSD: Scalars['BigDecimal']['output'];
  deltaTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  deltaTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  deltaTransferVolumeUSD: Scalars['BigDecimal']['output'];
  hour: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  lpTokenSupply: Scalars['BigInt']['output'];
  season: Scalars['Int']['output'];
  tokenRates: Array<Scalars['BigDecimal']['output']>;
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
};

export type WhitelistTokenHourlySnapshot = {
  __typename?: 'WhitelistTokenHourlySnapshot';
  bdv?: Maybe<Scalars['BigInt']['output']>;
  createdAt: Scalars['BigInt']['output'];
  deltaBdv?: Maybe<Scalars['BigInt']['output']>;
  deltaGaugePoints?: Maybe<Scalars['BigInt']['output']>;
  deltaIsGaugeEnabled: Scalars['Boolean']['output'];
  deltaMilestoneSeason: Scalars['Int']['output'];
  deltaOptimalPercentDepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  deltaStalkEarnedPerSeason: Scalars['BigInt']['output'];
  deltaStalkIssuedPerBdv: Scalars['BigInt']['output'];
  deltaStemTip: Scalars['BigInt']['output'];
  gaugePoints?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  isGaugeEnabled: Scalars['Boolean']['output'];
  milestoneSeason: Scalars['Int']['output'];
  optimalPercentDepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  season: Scalars['Int']['output'];
  selector: Scalars['Bytes']['output'];
  stalkEarnedPerSeason: Scalars['BigInt']['output'];
  stalkIssuedPerBdv: Scalars['BigInt']['output'];
  stemTip: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type WrappedDepositErc20HourlySnapshot = {
  __typename?: 'WrappedDepositERC20HourlySnapshot';
  apy7d?: Maybe<Scalars['BigDecimal']['output']>;
  apy24h?: Maybe<Scalars['BigDecimal']['output']>;
  apy30d?: Maybe<Scalars['BigDecimal']['output']>;
  apy90d?: Maybe<Scalars['BigDecimal']['output']>;
  createdAt: Scalars['BigInt']['output'];
  deltaRedeemRate: Scalars['BigInt']['output'];
  deltaSupply: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  redeemRate: Scalars['BigInt']['output'];
  season: Scalars['Int']['output'];
  supply: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export type CacheFarmerSeasonalSiloQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheFarmerSeasonalSiloQuery = { __typename?: 'Query', cache_siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, season: number, createdAt: any, plantedBeans: any, stalk: any, germinatingStalk: any, depositedBDV: any }> };

export type CacheFarmerSeasonalSiloAssetQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheFarmerSeasonalSiloAssetQuery = { __typename?: 'Query', cache_siloAssetHourlySnapshots: Array<{ __typename?: 'SiloAssetHourlySnapshot', id: string, season: number, depositedAmount: any, depositedBDV: any, deltaDepositedBDV: any, deltaDepositedAmount: any, createdAt: any }> };

export type CacheSeasonalBeanQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonalBeanQuery = { __typename?: 'Query', cache_beanHourlySnapshots: Array<{ __typename?: 'BeanHourlySnapshot', id: string, seasonNumber: number, supply: any, marketCap: any, instPrice: any, l2sr: any, liquidityUSD: any, twaPrice: any, twaDeltaB: any, instDeltaB: any, crosses: number, supplyInPegLP: any, createdTimestamp: any }> };

export type CacheSeasonalFieldQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonalFieldQuery = { __typename?: 'Query', cache_fieldHourlySnapshots: Array<{ __typename?: 'FieldHourlySnapshot', id: string, season: number, caseId?: any | null, issuedSoil: any, deltaSownBeans: any, sownBeans: any, deltaPodDemand: any, blocksToSoldOutSoil?: any | null, podRate: any, temperature: any, deltaTemperature: any, cultivationTemperature?: any | null, harvestableIndex: any, harvestablePods: any, harvestedPods: any, numberOfSowers: number, numberOfSows: number, podIndex: any, realRateOfReturn: any, seasonBlock: any, soil: any, soilSoldOut: boolean, unharvestablePods: any, createdAt: any }> };

export type CacheSeasonalGaugesInfoQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonalGaugesInfoQuery = { __typename?: 'Query', cache_gaugesInfoHourlySnapshots: Array<{ __typename?: 'GaugesInfoHourlySnapshot', id: string, season: number, g0CultivationFactor?: any | null, g1BlightFactor?: any | null, g1ConvertDownPenalty?: any | null, g2BdvConvertedThisSeason?: any | null, g2BonusStalkPerBdv?: any | null, g2MaxConvertCapacity?: any | null, createdAt: any }> };

export type CacheSeasonalMarketPerformanceQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonalMarketPerformanceQuery = { __typename?: 'Query', cache_marketPerformanceSeasonals: Array<{ __typename?: 'MarketPerformanceSeasonal', id: string, season: number, timestamp?: any | null, thisSeasonTokenUsdPrices?: Array<any> | null, usdChange?: Array<any> | null, percentChange?: Array<any> | null, totalUsdChange?: any | null, totalPercentChange?: any | null, cumulativeUsdChange?: Array<any> | null, cumulativePercentChange?: Array<any> | null, cumulativeTotalUsdChange?: any | null, cumulativeTotalPercentChange?: any | null }> };

export type CacheSeasonalSiloQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonalSiloQuery = { __typename?: 'Query', cache_siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, season: number, stalk: any, beanToMaxLpGpPerBdvRatio: any, deltaBeanToMaxLpGpPerBdvRatio: any, cropRatio: any, deltaCropRatio: any, avgGrownStalkPerBdvPerSeason: any, depositedBDV: any, germinatingStalk: any, createdAt: any }> };

export type CacheSeasonalSiloActiveFarmersQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonalSiloActiveFarmersQuery = { __typename?: 'Query', cache_siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, season: number, activeFarmers: number }> };

export type CacheSeasonalWrappedDepositQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonalWrappedDepositQuery = { __typename?: 'Query', cache_wrappedDepositERC20HourlySnapshots: Array<{ __typename?: 'WrappedDepositERC20HourlySnapshot', id: string, season: number, supply: any, redeemRate: any, apy24h?: any | null, apy7d?: any | null, apy30d?: any | null, apy90d?: any | null, createdAt: any }> };

export type CacheSeasonsQueryVariables = Exact<{
  where: Scalars['String']['input'];
  orderBy: Scalars['String']['input'];
  orderDirection: Scalars['String']['input'];
}>;


export type CacheSeasonsQuery = { __typename?: 'Query', cache_seasons: Array<{ __typename?: 'Season', id: string, season: number, sunriseBlock: any, rewardBeans: any, price: any, deltaBeans: any, raining: boolean, createdAt: any }> };


export const CacheFarmerSeasonalSiloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheFarmerSeasonalSilo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"plantedBeans"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"germinatingStalk"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}}]}}]}}]} as unknown as DocumentNode<CacheFarmerSeasonalSiloQuery, CacheFarmerSeasonalSiloQueryVariables>;
export const CacheFarmerSeasonalSiloAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheFarmerSeasonalSiloAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_siloAssetHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"depositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"deltaDepositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"deltaDepositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CacheFarmerSeasonalSiloAssetQuery, CacheFarmerSeasonalSiloAssetQueryVariables>;
export const CacheSeasonalBeanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasonalBean"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_beanHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seasonNumber"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"marketCap"}},{"kind":"Field","name":{"kind":"Name","value":"instPrice"}},{"kind":"Field","name":{"kind":"Name","value":"l2sr"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityUSD"}},{"kind":"Field","name":{"kind":"Name","value":"twaPrice"}},{"kind":"Field","name":{"kind":"Name","value":"twaDeltaB"}},{"kind":"Field","name":{"kind":"Name","value":"instDeltaB"}},{"kind":"Field","name":{"kind":"Name","value":"crosses"}},{"kind":"Field","name":{"kind":"Name","value":"supplyInPegLP"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonalBeanQuery, CacheSeasonalBeanQueryVariables>;
export const CacheSeasonalFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasonalField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"deltaPodDemand"}},{"kind":"Field","name":{"kind":"Name","value":"blocksToSoldOutSoil"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"cultivationTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"harvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"harvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSowers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSows"}},{"kind":"Field","name":{"kind":"Name","value":"podIndex"}},{"kind":"Field","name":{"kind":"Name","value":"realRateOfReturn"}},{"kind":"Field","name":{"kind":"Name","value":"seasonBlock"}},{"kind":"Field","name":{"kind":"Name","value":"soil"}},{"kind":"Field","name":{"kind":"Name","value":"soilSoldOut"}},{"kind":"Field","name":{"kind":"Name","value":"unharvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonalFieldQuery, CacheSeasonalFieldQueryVariables>;
export const CacheSeasonalGaugesInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasonalGaugesInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_gaugesInfoHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"g0CultivationFactor"}},{"kind":"Field","name":{"kind":"Name","value":"g1BlightFactor"}},{"kind":"Field","name":{"kind":"Name","value":"g1ConvertDownPenalty"}},{"kind":"Field","name":{"kind":"Name","value":"g2BdvConvertedThisSeason"}},{"kind":"Field","name":{"kind":"Name","value":"g2BonusStalkPerBdv"}},{"kind":"Field","name":{"kind":"Name","value":"g2MaxConvertCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonalGaugesInfoQuery, CacheSeasonalGaugesInfoQueryVariables>;
export const CacheSeasonalMarketPerformanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasonalMarketPerformance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_marketPerformanceSeasonals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"thisSeasonTokenUsdPrices"}},{"kind":"Field","name":{"kind":"Name","value":"usdChange"}},{"kind":"Field","name":{"kind":"Name","value":"percentChange"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsdChange"}},{"kind":"Field","name":{"kind":"Name","value":"totalPercentChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeUsdChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativePercentChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeTotalUsdChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeTotalPercentChange"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonalMarketPerformanceQuery, CacheSeasonalMarketPerformanceQueryVariables>;
export const CacheSeasonalSiloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasonalSilo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"beanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"cropRatio"}},{"kind":"Field","name":{"kind":"Name","value":"deltaCropRatio"}},{"kind":"Field","name":{"kind":"Name","value":"avgGrownStalkPerBdvPerSeason"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"germinatingStalk"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonalSiloQuery, CacheSeasonalSiloQueryVariables>;
export const CacheSeasonalSiloActiveFarmersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasonalSiloActiveFarmers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"activeFarmers"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonalSiloActiveFarmersQuery, CacheSeasonalSiloActiveFarmersQueryVariables>;
export const CacheSeasonalWrappedDepositDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasonalWrappedDeposit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_wrappedDepositERC20HourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"redeemRate"}},{"kind":"Field","name":{"kind":"Name","value":"apy24h"}},{"kind":"Field","name":{"kind":"Name","value":"apy7d"}},{"kind":"Field","name":{"kind":"Name","value":"apy30d"}},{"kind":"Field","name":{"kind":"Name","value":"apy90d"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonalWrappedDepositQuery, CacheSeasonalWrappedDepositQueryVariables>;
export const CacheSeasonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CacheSeasons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cache_seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"sunriseBlock"}},{"kind":"Field","name":{"kind":"Name","value":"rewardBeans"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeans"}},{"kind":"Field","name":{"kind":"Name","value":"raining"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CacheSeasonsQuery, CacheSeasonsQueryVariables>;