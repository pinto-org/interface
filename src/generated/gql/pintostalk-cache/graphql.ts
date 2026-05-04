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

export type CachedBeanHourlySnapshot = {
  __typename?: 'CachedBeanHourlySnapshot';
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

export type CachedBeanstalkHourlySnapshot = {
  __typename?: 'CachedBeanstalkHourlySnapshot';
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

export type CachedFarmerBalanceHourlySnapshot = {
  __typename?: 'CachedFarmerBalanceHourlySnapshot';
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

export type CachedFieldHourlySnapshot = {
  __typename?: 'CachedFieldHourlySnapshot';
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

export type CachedGaugesInfoHourlySnapshot = {
  __typename?: 'CachedGaugesInfoHourlySnapshot';
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

export type CachedMarketPerformanceSeasonal = {
  __typename?: 'CachedMarketPerformanceSeasonal';
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

export type CachedPodMarketplaceHourlySnapshot = {
  __typename?: 'CachedPodMarketplaceHourlySnapshot';
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

export type CachedPoolHourlySnapshot = {
  __typename?: 'CachedPoolHourlySnapshot';
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

export type CachedSeason = {
  __typename?: 'CachedSeason';
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

export type CachedSiloAssetHourlySnapshot = {
  __typename?: 'CachedSiloAssetHourlySnapshot';
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

export type CachedSiloHourlySnapshot = {
  __typename?: 'CachedSiloHourlySnapshot';
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

export type CachedTokenHourlySnapshot = {
  __typename?: 'CachedTokenHourlySnapshot';
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

export type CachedTractorHourlySnapshot = {
  __typename?: 'CachedTractorHourlySnapshot';
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

export type CachedUnripeTokenHourlySnapshot = {
  __typename?: 'CachedUnripeTokenHourlySnapshot';
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

export type CachedWellHourlySnapshot = {
  __typename?: 'CachedWellHourlySnapshot';
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

export type CachedWhitelistTokenHourlySnapshot = {
  __typename?: 'CachedWhitelistTokenHourlySnapshot';
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

export type CachedWrappedDepositErc20HourlySnapshot = {
  __typename?: 'CachedWrappedDepositERC20HourlySnapshot';
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

export type Query = {
  __typename?: 'Query';
  cache_beanHourlySnapshots: Array<CachedBeanHourlySnapshot>;
  cache_beanstalkHourlySnapshots: Array<CachedBeanstalkHourlySnapshot>;
  cache_farmerBalanceHourlySnapshots: Array<CachedFarmerBalanceHourlySnapshot>;
  cache_fieldHourlySnapshots: Array<CachedFieldHourlySnapshot>;
  cache_gaugesInfoHourlySnapshots: Array<CachedGaugesInfoHourlySnapshot>;
  cache_marketPerformanceSeasonals: Array<CachedMarketPerformanceSeasonal>;
  cache_podMarketplaceHourlySnapshots: Array<CachedPodMarketplaceHourlySnapshot>;
  cache_poolHourlySnapshots: Array<CachedPoolHourlySnapshot>;
  cache_seasons: Array<CachedSeason>;
  cache_siloAssetHourlySnapshots: Array<CachedSiloAssetHourlySnapshot>;
  cache_siloHourlySnapshots: Array<CachedSiloHourlySnapshot>;
  cache_tokenHourlySnapshots: Array<CachedTokenHourlySnapshot>;
  cache_tractorHourlySnapshots: Array<CachedTractorHourlySnapshot>;
  cache_unripeTokenHourlySnapshots: Array<CachedUnripeTokenHourlySnapshot>;
  cache_wellHourlySnapshots: Array<CachedWellHourlySnapshot>;
  cache_whitelistTokenHourlySnapshots: Array<CachedWhitelistTokenHourlySnapshot>;
  cache_wrappedDepositERC20HourlySnapshots: Array<CachedWrappedDepositErc20HourlySnapshot>;
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

export type BeanstalkAdvancedChartQueryVariables = Exact<{
  seasonsWhere?: InputMaybe<Scalars['String']['input']>;
  seasonsOrderBy?: InputMaybe<Scalars['String']['input']>;
  seasonsOrderDirection?: InputMaybe<Scalars['String']['input']>;
  fieldWhere?: InputMaybe<Scalars['String']['input']>;
  fieldOrderBy?: InputMaybe<Scalars['String']['input']>;
  fieldOrderDirection?: InputMaybe<Scalars['String']['input']>;
  siloWhere?: InputMaybe<Scalars['String']['input']>;
  siloOrderBy?: InputMaybe<Scalars['String']['input']>;
  siloOrderDirection?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkAdvancedChartQuery = { __typename?: 'Query', seasons: Array<{ __typename?: 'CachedSeason', id: string, sunriseBlock: any, rewardBeans: any, price: any, deltaBeans: any, season: number, createdAt: any }>, fieldHourlySnapshots: Array<{ __typename?: 'CachedFieldHourlySnapshot', id: string, caseId?: any | null, issuedSoil: any, deltaSownBeans: any, sownBeans: any, blocksToSoldOutSoil?: any | null, podRate: any, temperature: any, deltaTemperature: any, season: number, harvestableIndex: any, harvestablePods: any, harvestedPods: any, numberOfSowers: number, numberOfSows: number, podIndex: any, realRateOfReturn: any, seasonBlock: any, soil: any, soilSoldOut: boolean, unharvestablePods: any }>, siloHourlySnapshots: Array<{ __typename?: 'CachedSiloHourlySnapshot', id: string, beanToMaxLpGpPerBdvRatio: any, season: number, stalk: any, caseId?: any | null }> };

export type BeanstalkSeasonsTableQueryVariables = Exact<{
  seasonsWhere?: InputMaybe<Scalars['String']['input']>;
  seasonsOrderBy?: InputMaybe<Scalars['String']['input']>;
  seasonsOrderDirection?: InputMaybe<Scalars['String']['input']>;
  fieldWhere?: InputMaybe<Scalars['String']['input']>;
  fieldOrderBy?: InputMaybe<Scalars['String']['input']>;
  fieldOrderDirection?: InputMaybe<Scalars['String']['input']>;
  siloWhere?: InputMaybe<Scalars['String']['input']>;
  siloOrderBy?: InputMaybe<Scalars['String']['input']>;
  siloOrderDirection?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkSeasonsTableQuery = { __typename?: 'Query', seasons: Array<{ __typename?: 'CachedSeason', id: string, sunriseBlock: any, rewardBeans: any, price: any, deltaBeans: any, season: number }>, fieldHourlySnapshots: Array<{ __typename?: 'CachedFieldHourlySnapshot', id: string, caseId?: any | null, issuedSoil: any, deltaSownBeans: any, sownBeans: any, blocksToSoldOutSoil?: any | null, podRate: any, temperature: any, deltaTemperature: any, season: number }>, siloHourlySnapshots: Array<{ __typename?: 'CachedSiloHourlySnapshot', id: string, beanToMaxLpGpPerBdvRatio: any, season: number }> };

export type FarmerSeasonalSiloQueryVariables = Exact<{
  where?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
}>;


export type FarmerSeasonalSiloQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'CachedSiloHourlySnapshot', id: string, season: number, createdAt: any, stalk: any, germinatingStalk: any, depositedBDV: any }> };

export type FarmerSeasonalSiloAssetTokenQueryVariables = Exact<{
  where?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
}>;


export type FarmerSeasonalSiloAssetTokenQuery = { __typename?: 'Query', siloAssetHourlySnapshots: Array<{ __typename?: 'CachedSiloAssetHourlySnapshot', id: string, season: number, depositedAmount: any, depositedBDV: any, deltaDepositedBDV: any, deltaDepositedAmount: any, createdAt: any }> };

export type BeanstalkSeasonalSiloActiveFarmersQueryVariables = Exact<{
  where?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkSeasonalSiloActiveFarmersQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'CachedSiloHourlySnapshot', id: string, season: number, activeFarmers: number }> };

export type BeanstalkSeasonalFieldQueryVariables = Exact<{
  where?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkSeasonalFieldQuery = { __typename?: 'Query', fieldHourlySnapshots: Array<{ __typename?: 'CachedFieldHourlySnapshot', id: string, season: number, podRate: any, temperature: any, podIndex: any, harvestableIndex: any, sownBeans: any, harvestedPods: any, issuedSoil: any, deltaSownBeans: any, createdAt: any }> };

export type BeanstalkSeasonalSiloQueryVariables = Exact<{
  where?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkSeasonalSiloQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'CachedSiloHourlySnapshot', id: string, season: number, stalk: any, grownStalkPerSeason: any, depositedBDV: any, createdAt: any }> };


export const BeanstalkAdvancedChartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkAdvancedChart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonsWhere"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldWhere"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siloWhere"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"seasons"},"name":{"kind":"Name","value":"cache_seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonsWhere"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sunriseBlock"}},{"kind":"Field","name":{"kind":"Name","value":"rewardBeans"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeans"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"fieldHourlySnapshots"},"name":{"kind":"Name","value":"cache_fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldWhere"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"blocksToSoldOutSoil"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"harvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"harvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSowers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSows"}},{"kind":"Field","name":{"kind":"Name","value":"podIndex"}},{"kind":"Field","name":{"kind":"Name","value":"realRateOfReturn"}},{"kind":"Field","name":{"kind":"Name","value":"seasonBlock"}},{"kind":"Field","name":{"kind":"Name","value":"soil"}},{"kind":"Field","name":{"kind":"Name","value":"soilSoldOut"}},{"kind":"Field","name":{"kind":"Name","value":"unharvestablePods"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"siloHourlySnapshots"},"name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siloWhere"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"beanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}}]}}]}}]} as unknown as DocumentNode<BeanstalkAdvancedChartQuery, BeanstalkAdvancedChartQueryVariables>;
export const BeanstalkSeasonsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonsWhere"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldWhere"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siloWhere"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"seasons"},"name":{"kind":"Name","value":"cache_seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonsWhere"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seasonsOrderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sunriseBlock"}},{"kind":"Field","name":{"kind":"Name","value":"rewardBeans"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeans"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"fieldHourlySnapshots"},"name":{"kind":"Name","value":"cache_fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldWhere"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldOrderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"blocksToSoldOutSoil"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"siloHourlySnapshots"},"name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siloWhere"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siloOrderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"beanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonsTableQuery, BeanstalkSeasonsTableQueryVariables>;
export const FarmerSeasonalSiloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerSeasonalSilo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"siloHourlySnapshots"},"name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"germinatingStalk"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}}]}}]}}]} as unknown as DocumentNode<FarmerSeasonalSiloQuery, FarmerSeasonalSiloQueryVariables>;
export const FarmerSeasonalSiloAssetTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerSeasonalSiloAssetToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"siloAssetHourlySnapshots"},"name":{"kind":"Name","value":"cache_siloAssetHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"depositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"deltaDepositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"deltaDepositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<FarmerSeasonalSiloAssetTokenQuery, FarmerSeasonalSiloAssetTokenQueryVariables>;
export const BeanstalkSeasonalSiloActiveFarmersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalSiloActiveFarmers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"siloHourlySnapshots"},"name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"activeFarmers"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalSiloActiveFarmersQuery, BeanstalkSeasonalSiloActiveFarmersQueryVariables>;
export const BeanstalkSeasonalFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"fieldHourlySnapshots"},"name":{"kind":"Name","value":"cache_fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"podIndex"}},{"kind":"Field","name":{"kind":"Name","value":"harvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalFieldQuery, BeanstalkSeasonalFieldQueryVariables>;
export const BeanstalkSeasonalSiloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalSilo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"siloHourlySnapshots"},"name":{"kind":"Name","value":"cache_siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"grownStalkPerSeason"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalSiloQuery, BeanstalkSeasonalSiloQueryVariables>;