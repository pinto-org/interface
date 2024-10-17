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
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: any; output: any; }
  /**
   * A string representation of microseconds UNIX timestamp (16 digits)
   *
   */
  Timestamp: { input: any; output: any; }
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type Bean = {
  __typename?: 'Bean';
  /** Smart contract address of the Beanstalk this Bean is associated with */
  beanstalk: Scalars['String']['output'];
  /** Which chain this Bean is from */
  chain: Scalars['String']['output'];
  /** Detailed cross events during this snapshot */
  crossEvents: Array<BeanCross>;
  /** Cumulative number of crosses */
  crosses: Scalars['Int']['output'];
  /** Daily snapshot of Bean data */
  dailySnapshot: Array<BeanDailySnapshot>;
  /** Dewhitelisted pools that include this Bean */
  dewhitelistedPools: Array<Pool>;
  /** Hourly snapshot of Bean data */
  hourlySnapshot: Array<BeanHourlySnapshot>;
  /** Contract address of the Bean token */
  id: Scalars['Bytes']['output'];
  /** Last timestamp a cross was seen */
  lastCross: Scalars['BigInt']['output'];
  /** Last season seen from Beanstalk */
  lastSeason: Scalars['Int']['output'];
  /** Current liquidity in USD value */
  liquidityUSD: Scalars['BigDecimal']['output'];
  /** Amount of the supply which is considered Locked Beans (untradeable due to chop rate) */
  lockedBeans: Scalars['BigInt']['output'];
  /** Current market cap */
  marketCap: Scalars['BigDecimal']['output'];
  /** Pools that include this Bean */
  pools: Array<Pool>;
  /** Latest price seen */
  price: Scalars['BigDecimal']['output'];
  /** Current supply */
  supply: Scalars['BigInt']['output'];
  /** Percent of supply in LP used for peg maintenance */
  supplyInPegLP: Scalars['BigDecimal']['output'];
  /** Cumulative volume of beans traded */
  volume: Scalars['BigInt']['output'];
  /** Cumulative volume in USD value */
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type BeanCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanCross_Filter>;
};


export type BeanDailySnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanDailySnapshot_Filter>;
};


export type BeanDewhitelistedPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pool_Filter>;
};


export type BeanHourlySnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanHourlySnapshot_Filter>;
};


export type BeanPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pool_Filter>;
};

export type BeanCross = {
  __typename?: 'BeanCross';
  above: Scalars['Boolean']['output'];
  bean: Bean;
  blockNumber: Scalars['BigInt']['output'];
  dailySnapshot: BeanDailySnapshot;
  hourlySnapshot: BeanHourlySnapshot;
  id: Scalars['ID']['output'];
  price: Scalars['BigDecimal']['output'];
  timeSinceLastCross: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
};

export type BeanCross_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  above?: InputMaybe<Scalars['Boolean']['input']>;
  above_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  above_not?: InputMaybe<Scalars['Boolean']['input']>;
  above_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  and?: InputMaybe<Array<InputMaybe<BeanCross_Filter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  bean_?: InputMaybe<Bean_Filter>;
  bean_contains?: InputMaybe<Scalars['String']['input']>;
  bean_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_gt?: InputMaybe<Scalars['String']['input']>;
  bean_gte?: InputMaybe<Scalars['String']['input']>;
  bean_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_lt?: InputMaybe<Scalars['String']['input']>;
  bean_lte?: InputMaybe<Scalars['String']['input']>;
  bean_not?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailySnapshot?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_?: InputMaybe<BeanDailySnapshot_Filter>;
  dailySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dailySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dailySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_?: InputMaybe<BeanHourlySnapshot_Filter>;
  hourlySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<BeanCross_Filter>>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timeSinceLastCross?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timeSinceLastCross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_not?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum BeanCross_OrderBy {
  Above = 'above',
  Bean = 'bean',
  BeanBeanstalk = 'bean__beanstalk',
  BeanChain = 'bean__chain',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastSeason = 'bean__lastSeason',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanMarketCap = 'bean__marketCap',
  BeanPrice = 'bean__price',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  BlockNumber = 'blockNumber',
  DailySnapshot = 'dailySnapshot',
  DailySnapshotBlockNumber = 'dailySnapshot__blockNumber',
  DailySnapshotCrosses = 'dailySnapshot__crosses',
  DailySnapshotDeltaCrosses = 'dailySnapshot__deltaCrosses',
  DailySnapshotDeltaLiquidityUsd = 'dailySnapshot__deltaLiquidityUSD',
  DailySnapshotDeltaVolume = 'dailySnapshot__deltaVolume',
  DailySnapshotDeltaVolumeUsd = 'dailySnapshot__deltaVolumeUSD',
  DailySnapshotId = 'dailySnapshot__id',
  DailySnapshotInstantaneousDeltaB = 'dailySnapshot__instantaneousDeltaB',
  DailySnapshotLiquidityUsd = 'dailySnapshot__liquidityUSD',
  DailySnapshotLockedBeans = 'dailySnapshot__lockedBeans',
  DailySnapshotMarketCap = 'dailySnapshot__marketCap',
  DailySnapshotPrice = 'dailySnapshot__price',
  DailySnapshotSeason = 'dailySnapshot__season',
  DailySnapshotSupply = 'dailySnapshot__supply',
  DailySnapshotSupplyInPegLp = 'dailySnapshot__supplyInPegLP',
  DailySnapshotTimestamp = 'dailySnapshot__timestamp',
  DailySnapshotTwaDeltaB = 'dailySnapshot__twaDeltaB',
  DailySnapshotTwaPrice = 'dailySnapshot__twaPrice',
  DailySnapshotVolume = 'dailySnapshot__volume',
  DailySnapshotVolumeUsd = 'dailySnapshot__volumeUSD',
  HourlySnapshot = 'hourlySnapshot',
  HourlySnapshotBlockNumber = 'hourlySnapshot__blockNumber',
  HourlySnapshotCrosses = 'hourlySnapshot__crosses',
  HourlySnapshotDeltaCrosses = 'hourlySnapshot__deltaCrosses',
  HourlySnapshotDeltaLiquidityUsd = 'hourlySnapshot__deltaLiquidityUSD',
  HourlySnapshotDeltaVolume = 'hourlySnapshot__deltaVolume',
  HourlySnapshotDeltaVolumeUsd = 'hourlySnapshot__deltaVolumeUSD',
  HourlySnapshotId = 'hourlySnapshot__id',
  HourlySnapshotInstantaneousDeltaB = 'hourlySnapshot__instantaneousDeltaB',
  HourlySnapshotLiquidityUsd = 'hourlySnapshot__liquidityUSD',
  HourlySnapshotLockedBeans = 'hourlySnapshot__lockedBeans',
  HourlySnapshotMarketCap = 'hourlySnapshot__marketCap',
  HourlySnapshotPrice = 'hourlySnapshot__price',
  HourlySnapshotSeason = 'hourlySnapshot__season',
  HourlySnapshotSupply = 'hourlySnapshot__supply',
  HourlySnapshotSupplyInPegLp = 'hourlySnapshot__supplyInPegLP',
  HourlySnapshotTimestamp = 'hourlySnapshot__timestamp',
  HourlySnapshotTwaDeltaB = 'hourlySnapshot__twaDeltaB',
  HourlySnapshotTwaPrice = 'hourlySnapshot__twaPrice',
  HourlySnapshotVolume = 'hourlySnapshot__volume',
  HourlySnapshotVolumeUsd = 'hourlySnapshot__volumeUSD',
  Id = 'id',
  Price = 'price',
  TimeSinceLastCross = 'timeSinceLastCross',
  Timestamp = 'timestamp'
}

export type BeanDailySnapshot = {
  __typename?: 'BeanDailySnapshot';
  bean: Bean;
  blockNumber: Scalars['BigInt']['output'];
  crossEvents: Array<BeanCross>;
  crosses: Scalars['Int']['output'];
  deltaCrosses: Scalars['Int']['output'];
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  deltaVolume: Scalars['BigInt']['output'];
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  /** Instantaneous deltaB across all whitelisted pools */
  instantaneousDeltaB: Scalars['BigInt']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  /** Amount of the supply which is considered Locked Beans (untradeable due to chop rate) */
  lockedBeans: Scalars['BigInt']['output'];
  marketCap: Scalars['BigDecimal']['output'];
  price: Scalars['BigDecimal']['output'];
  season: Scalars['Int']['output'];
  supply: Scalars['BigInt']['output'];
  /** Percent of supply in LP used for peg maintenance */
  supplyInPegLP: Scalars['BigDecimal']['output'];
  timestamp: Scalars['BigInt']['output'];
  /** Time-Weighted deltaB in whitelisted pools over the previous season */
  twaDeltaB: Scalars['BigInt']['output'];
  /** Time-Weighted price over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  volume: Scalars['BigInt']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type BeanDailySnapshotCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanCross_Filter>;
};

export type BeanDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeanDailySnapshot_Filter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  bean_?: InputMaybe<Bean_Filter>;
  bean_contains?: InputMaybe<Scalars['String']['input']>;
  bean_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_gt?: InputMaybe<Scalars['String']['input']>;
  bean_gte?: InputMaybe<Scalars['String']['input']>;
  bean_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_lt?: InputMaybe<Scalars['String']['input']>;
  bean_lte?: InputMaybe<Scalars['String']['input']>;
  bean_not?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<BeanCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaCrosses?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaCrosses_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  instantaneousDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  instantaneousDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lockedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lockedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  marketCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  marketCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<BeanDailySnapshot_Filter>>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supplyInPegLP?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  supplyInPegLP_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume?: InputMaybe<Scalars['BigInt']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum BeanDailySnapshot_OrderBy {
  Bean = 'bean',
  BeanBeanstalk = 'bean__beanstalk',
  BeanChain = 'bean__chain',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastSeason = 'bean__lastSeason',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanMarketCap = 'bean__marketCap',
  BeanPrice = 'bean__price',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  BlockNumber = 'blockNumber',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  InstantaneousDeltaB = 'instantaneousDeltaB',
  LiquidityUsd = 'liquidityUSD',
  LockedBeans = 'lockedBeans',
  MarketCap = 'marketCap',
  Price = 'price',
  Season = 'season',
  Supply = 'supply',
  SupplyInPegLp = 'supplyInPegLP',
  Timestamp = 'timestamp',
  TwaDeltaB = 'twaDeltaB',
  TwaPrice = 'twaPrice',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type BeanHourlySnapshot = {
  __typename?: 'BeanHourlySnapshot';
  /** Bean token address */
  bean: Bean;
  /** Block number this snapshot was updated */
  blockNumber: Scalars['BigInt']['output'];
  /** Detailed cross events during this snapshot */
  crossEvents: Array<BeanCross>;
  /** Cumulative number of crosses */
  crosses: Scalars['Int']['output'];
  /** Crosses occuring in this snapshot */
  deltaCrosses: Scalars['Int']['output'];
  /** Difference in liquidity for this snapshot */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Volume in BEAN for this snapshot */
  deltaVolume: Scalars['BigInt']['output'];
  /** Volume in USD for this snapshot */
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Token address}-{Season} */
  id: Scalars['ID']['output'];
  /** Instantaneous deltaB across all whitelisted pools */
  instantaneousDeltaB: Scalars['BigInt']['output'];
  /** Current liquidity in USD */
  liquidityUSD: Scalars['BigDecimal']['output'];
  /** Amount of the supply which is considered Locked Beans (untradeable due to chop rate) */
  lockedBeans: Scalars['BigInt']['output'];
  /** Current market cap */
  marketCap: Scalars['BigDecimal']['output'];
  /** Current USD price */
  price: Scalars['BigDecimal']['output'];
  /** Season associated with this snapshot */
  season: Scalars['Int']['output'];
  /** Current supply */
  supply: Scalars['BigInt']['output'];
  /** Percent of supply in LP used for peg maintenance */
  supplyInPegLP: Scalars['BigDecimal']['output'];
  /** Timestamp this snapshot was updated */
  timestamp: Scalars['BigInt']['output'];
  /** Time-Weighted deltaB in whitelisted pools over the previous season */
  twaDeltaB: Scalars['BigInt']['output'];
  /** Time-Weighted price over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  /** Cumulative volume in BEAN */
  volume: Scalars['BigInt']['output'];
  /** Cumulative volume in USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type BeanHourlySnapshotCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanCross_Filter>;
};

export type BeanHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeanHourlySnapshot_Filter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  bean_?: InputMaybe<Bean_Filter>;
  bean_contains?: InputMaybe<Scalars['String']['input']>;
  bean_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_gt?: InputMaybe<Scalars['String']['input']>;
  bean_gte?: InputMaybe<Scalars['String']['input']>;
  bean_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_lt?: InputMaybe<Scalars['String']['input']>;
  bean_lte?: InputMaybe<Scalars['String']['input']>;
  bean_not?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<BeanCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaCrosses?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaCrosses_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  instantaneousDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  instantaneousDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  instantaneousDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lockedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lockedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  marketCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  marketCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<BeanHourlySnapshot_Filter>>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supplyInPegLP?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  supplyInPegLP_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume?: InputMaybe<Scalars['BigInt']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum BeanHourlySnapshot_OrderBy {
  Bean = 'bean',
  BeanBeanstalk = 'bean__beanstalk',
  BeanChain = 'bean__chain',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastSeason = 'bean__lastSeason',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanMarketCap = 'bean__marketCap',
  BeanPrice = 'bean__price',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  BlockNumber = 'blockNumber',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  InstantaneousDeltaB = 'instantaneousDeltaB',
  LiquidityUsd = 'liquidityUSD',
  LockedBeans = 'lockedBeans',
  MarketCap = 'marketCap',
  Price = 'price',
  Season = 'season',
  Supply = 'supply',
  SupplyInPegLp = 'supplyInPegLP',
  Timestamp = 'timestamp',
  TwaDeltaB = 'twaDeltaB',
  TwaPrice = 'twaPrice',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type Bean_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Bean_Filter>>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_lt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_lte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  crossEvents_?: InputMaybe<BeanCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailySnapshot_?: InputMaybe<BeanDailySnapshot_Filter>;
  dewhitelistedPools?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_?: InputMaybe<Pool_Filter>;
  dewhitelistedPools_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlySnapshot_?: InputMaybe<BeanHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastCross?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastCross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastSeason?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lockedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lockedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  lockedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  marketCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  marketCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Bean_Filter>>>;
  pools?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_?: InputMaybe<Pool_Filter>;
  pools_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supplyInPegLP?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  supplyInPegLP_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  supplyInPegLP_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume?: InputMaybe<Scalars['BigInt']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Bean_OrderBy {
  Beanstalk = 'beanstalk',
  Chain = 'chain',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DailySnapshot = 'dailySnapshot',
  DewhitelistedPools = 'dewhitelistedPools',
  HourlySnapshot = 'hourlySnapshot',
  Id = 'id',
  LastCross = 'lastCross',
  LastSeason = 'lastSeason',
  LiquidityUsd = 'liquidityUSD',
  LockedBeans = 'lockedBeans',
  MarketCap = 'marketCap',
  Pools = 'pools',
  Price = 'price',
  Supply = 'supply',
  SupplyInPegLp = 'supplyInPegLP',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type Beanstalk = {
  __typename?: 'Beanstalk';
  /** Array of the addresses for all active farmers in the silo */
  activeFarmers: Array<Scalars['Bytes']['output']>;
  /** Array of the addresses for all farmers that had silo transfers and need stalk/roots updated */
  farmersToUpdate: Array<Scalars['Bytes']['output']>;
  /** Address of the fertilizer contract */
  fertilizer1155?: Maybe<Scalars['Bytes']['output']>;
  /** Field level data */
  field: Field;
  /** 'beanstalk' */
  id: Scalars['ID']['output'];
  /** Last season called */
  lastSeason: Scalars['Int']['output'];
  /** Season specific data */
  seasons: Array<Season>;
  /** Silo level data */
  silo: Silo;
  /** Bean token address of the protocol */
  token: Scalars['Bytes']['output'];
};


export type BeanstalkSeasonsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Season_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Season_Filter>;
};

export type Beanstalk_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeFarmers?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Beanstalk_Filter>>>;
  farmersToUpdate?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmersToUpdate_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmersToUpdate_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmersToUpdate_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmersToUpdate_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmersToUpdate_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  fertilizer1155?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_gt?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_gte?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  fertilizer1155_lt?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_lte?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_not?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fertilizer1155_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  field_?: InputMaybe<Field_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastSeason?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Beanstalk_Filter>>>;
  seasons_?: InputMaybe<Season_Filter>;
  silo_?: InputMaybe<Silo_Filter>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Beanstalk_OrderBy {
  ActiveFarmers = 'activeFarmers',
  FarmersToUpdate = 'farmersToUpdate',
  Fertilizer1155 = 'fertilizer1155',
  Field = 'field',
  FieldHarvestableIndex = 'field__harvestableIndex',
  FieldHarvestablePods = 'field__harvestablePods',
  FieldHarvestedPods = 'field__harvestedPods',
  FieldId = 'field__id',
  FieldLastDailySnapshotDay = 'field__lastDailySnapshotDay',
  FieldLastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  FieldNumberOfSowers = 'field__numberOfSowers',
  FieldNumberOfSows = 'field__numberOfSows',
  FieldPodIndex = 'field__podIndex',
  FieldPodRate = 'field__podRate',
  FieldRealRateOfReturn = 'field__realRateOfReturn',
  FieldSeason = 'field__season',
  FieldSoil = 'field__soil',
  FieldSownBeans = 'field__sownBeans',
  FieldTemperature = 'field__temperature',
  FieldUnharvestablePods = 'field__unharvestablePods',
  FieldUnmigratedL1Pods = 'field__unmigratedL1Pods',
  Id = 'id',
  LastSeason = 'lastSeason',
  Seasons = 'seasons',
  Silo = 'silo',
  SiloActiveFarmers = 'silo__activeFarmers',
  SiloBeanMints = 'silo__beanMints',
  SiloBeanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  SiloDepositedBdv = 'silo__depositedBDV',
  SiloGerminatingStalk = 'silo__germinatingStalk',
  SiloGrownStalkPerSeason = 'silo__grownStalkPerSeason',
  SiloId = 'silo__id',
  SiloLastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  SiloLastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  SiloPlantableStalk = 'silo__plantableStalk',
  SiloRoots = 'silo__roots',
  SiloStalk = 'silo__stalk',
  SiloUnmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  Token = 'token'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Chop = {
  __typename?: 'Chop';
  /** The block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** The effective chop rate for this chop */
  chopRate: Scalars['BigDecimal']['output'];
  /** Timestamp of this chop */
  createdAt: Scalars['BigInt']['output'];
  /** Account address */
  farmer: Farmer;
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** (chop|convert)-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Amount of underlying tokens `farmer` received */
  underlyingAmount: Scalars['BigInt']['output'];
  /** Amount of bdv `farmer` received */
  underlyingBdv: Scalars['BigInt']['output'];
  /** The underlying ERC20 token received by `farmer` as a result of this chop */
  underlyingToken: WhitelistTokenSetting;
  /** Unripe token amount which was chopped */
  unripeAmount: Scalars['BigInt']['output'];
  /** Bdv of the unripe tokens which were chopped */
  unripeBdv: Scalars['BigInt']['output'];
  /** The unripe token which was chopped */
  unripeToken: UnripeToken;
};

export type Chop_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Chop_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chopRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chopRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Chop_Filter>>>;
  underlyingAmount?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingBdv?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  underlyingBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingToken?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_?: InputMaybe<WhitelistTokenSetting_Filter>;
  underlyingToken_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_lt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_lte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeAmount?: InputMaybe<Scalars['BigInt']['input']>;
  unripeAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unripeAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unripeAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unripeAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unripeAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unripeAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  unripeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unripeBdv?: InputMaybe<Scalars['BigInt']['input']>;
  unripeBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unripeBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unripeBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unripeBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unripeBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unripeBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  unripeBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unripeToken?: InputMaybe<Scalars['String']['input']>;
  unripeToken_?: InputMaybe<UnripeToken_Filter>;
  unripeToken_contains?: InputMaybe<Scalars['String']['input']>;
  unripeToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_gt?: InputMaybe<Scalars['String']['input']>;
  unripeToken_gte?: InputMaybe<Scalars['String']['input']>;
  unripeToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unripeToken_lt?: InputMaybe<Scalars['String']['input']>;
  unripeToken_lte?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unripeToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Chop_OrderBy {
  BlockNumber = 'blockNumber',
  ChopRate = 'chopRate',
  CreatedAt = 'createdAt',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  Hash = 'hash',
  Id = 'id',
  UnderlyingAmount = 'underlyingAmount',
  UnderlyingBdv = 'underlyingBdv',
  UnderlyingToken = 'underlyingToken',
  UnderlyingTokenDecimals = 'underlyingToken__decimals',
  UnderlyingTokenGaugePoints = 'underlyingToken__gaugePoints',
  UnderlyingTokenId = 'underlyingToken__id',
  UnderlyingTokenIsGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  UnderlyingTokenLastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  UnderlyingTokenLastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  UnderlyingTokenMilestoneSeason = 'underlyingToken__milestoneSeason',
  UnderlyingTokenOptimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  UnderlyingTokenSelector = 'underlyingToken__selector',
  UnderlyingTokenStalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  UnderlyingTokenStalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  UnderlyingTokenUpdatedAt = 'underlyingToken__updatedAt',
  UnripeAmount = 'unripeAmount',
  UnripeBdv = 'unripeBdv',
  UnripeToken = 'unripeToken',
  UnripeTokenAmountUnderlyingOne = 'unripeToken__amountUnderlyingOne',
  UnripeTokenBdvUnderlyingOne = 'unripeToken__bdvUnderlyingOne',
  UnripeTokenChopRate = 'unripeToken__chopRate',
  UnripeTokenChoppableAmountOne = 'unripeToken__choppableAmountOne',
  UnripeTokenChoppableBdvOne = 'unripeToken__choppableBdvOne',
  UnripeTokenId = 'unripeToken__id',
  UnripeTokenLastDailySnapshotDay = 'unripeToken__lastDailySnapshotDay',
  UnripeTokenLastHourlySnapshotSeason = 'unripeToken__lastHourlySnapshotSeason',
  UnripeTokenRecapPercent = 'unripeToken__recapPercent',
  UnripeTokenTotalChoppedAmount = 'unripeToken__totalChoppedAmount',
  UnripeTokenTotalChoppedBdv = 'unripeToken__totalChoppedBdv',
  UnripeTokenTotalChoppedBdvReceived = 'unripeToken__totalChoppedBdvReceived',
  UnripeTokenTotalUnderlying = 'unripeToken__totalUnderlying'
}

export enum EmaWindow {
  Rolling_7Day = 'ROLLING_7_DAY',
  Rolling_24Hour = 'ROLLING_24_HOUR',
  Rolling_30Day = 'ROLLING_30_DAY'
}

export type Farmer = {
  __typename?: 'Farmer';
  deposits: Array<SiloDeposit>;
  fertilizers: Array<FertilizerBalance>;
  field?: Maybe<Field>;
  fills: Array<PodFill>;
  /** Address for the farmer */
  id: Scalars['Bytes']['output'];
  listings: Array<PodListing>;
  orders: Array<PodOrder>;
  plots: Array<Plot>;
  silo?: Maybe<Silo>;
  withdraws: Array<SiloWithdraw>;
};


export type FarmerDepositsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloDeposit_Filter>;
};


export type FarmerFertilizersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FertilizerBalance_Filter>;
};


export type FarmerFillsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFill_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodFill_Filter>;
};


export type FarmerListingsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListing_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodListing_Filter>;
};


export type FarmerOrdersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodOrder_Filter>;
};


export type FarmerPlotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Plot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Plot_Filter>;
};


export type FarmerWithdrawsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloWithdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloWithdraw_Filter>;
};

export type Farmer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Farmer_Filter>>>;
  deposits_?: InputMaybe<SiloDeposit_Filter>;
  fertilizers_?: InputMaybe<FertilizerBalance_Filter>;
  field_?: InputMaybe<Field_Filter>;
  fills_?: InputMaybe<PodFill_Filter>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  listings_?: InputMaybe<PodListing_Filter>;
  or?: InputMaybe<Array<InputMaybe<Farmer_Filter>>>;
  orders_?: InputMaybe<PodOrder_Filter>;
  plots_?: InputMaybe<Plot_Filter>;
  silo_?: InputMaybe<Silo_Filter>;
  withdraws_?: InputMaybe<SiloWithdraw_Filter>;
};

export enum Farmer_OrderBy {
  Deposits = 'deposits',
  Fertilizers = 'fertilizers',
  Field = 'field',
  FieldHarvestableIndex = 'field__harvestableIndex',
  FieldHarvestablePods = 'field__harvestablePods',
  FieldHarvestedPods = 'field__harvestedPods',
  FieldId = 'field__id',
  FieldLastDailySnapshotDay = 'field__lastDailySnapshotDay',
  FieldLastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  FieldNumberOfSowers = 'field__numberOfSowers',
  FieldNumberOfSows = 'field__numberOfSows',
  FieldPodIndex = 'field__podIndex',
  FieldPodRate = 'field__podRate',
  FieldRealRateOfReturn = 'field__realRateOfReturn',
  FieldSeason = 'field__season',
  FieldSoil = 'field__soil',
  FieldSownBeans = 'field__sownBeans',
  FieldTemperature = 'field__temperature',
  FieldUnharvestablePods = 'field__unharvestablePods',
  FieldUnmigratedL1Pods = 'field__unmigratedL1Pods',
  Fills = 'fills',
  Id = 'id',
  Listings = 'listings',
  Orders = 'orders',
  Plots = 'plots',
  Silo = 'silo',
  SiloActiveFarmers = 'silo__activeFarmers',
  SiloBeanMints = 'silo__beanMints',
  SiloBeanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  SiloDepositedBdv = 'silo__depositedBDV',
  SiloGerminatingStalk = 'silo__germinatingStalk',
  SiloGrownStalkPerSeason = 'silo__grownStalkPerSeason',
  SiloId = 'silo__id',
  SiloLastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  SiloLastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  SiloPlantableStalk = 'silo__plantableStalk',
  SiloRoots = 'silo__roots',
  SiloStalk = 'silo__stalk',
  SiloUnmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  Withdraws = 'withdraws'
}

export type Fertilizer = {
  __typename?: 'Fertilizer';
  /** 'beanstalk' */
  beanstalk: Scalars['String']['output'];
  /** Token address for fert */
  id: Scalars['Bytes']['output'];
  /** Total overall suppy of fert tokens */
  supply: Scalars['BigInt']['output'];
  tokens: Array<FertilizerToken>;
  /** Supply from L1 which has not been minted on L2 yet */
  unmigratedL1Supply?: Maybe<Scalars['BigInt']['output']>;
};


export type FertilizerTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FertilizerToken_Filter>;
};

export type FertilizerBalance = {
  __typename?: 'FertilizerBalance';
  /** Current balance of token */
  amount: Scalars['BigInt']['output'];
  farmer: Farmer;
  fertilizerToken: FertilizerToken;
  /** Fertilizer Token - Farmer address */
  id: Scalars['ID']['output'];
};

export type FertilizerBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<FertilizerBalance_Filter>>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_?: InputMaybe<FertilizerToken_Filter>;
  fertilizerToken_contains?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_gt?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_gte?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fertilizerToken_lt?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_lte?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_not?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fertilizerToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  fertilizerToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FertilizerBalance_Filter>>>;
};

export enum FertilizerBalance_OrderBy {
  Amount = 'amount',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  FertilizerToken = 'fertilizerToken',
  FertilizerTokenEndBpf = 'fertilizerToken__endBpf',
  FertilizerTokenHumidity = 'fertilizerToken__humidity',
  FertilizerTokenId = 'fertilizerToken__id',
  FertilizerTokenSeason = 'fertilizerToken__season',
  FertilizerTokenStartBpf = 'fertilizerToken__startBpf',
  FertilizerTokenSupply = 'fertilizerToken__supply',
  Id = 'id'
}

export type FertilizerToken = {
  __typename?: 'FertilizerToken';
  balances: Array<FertilizerBalance>;
  /** Ending BPF on creation */
  endBpf: Scalars['BigInt']['output'];
  fertilizer: Fertilizer;
  /** Humidity paid for this ID */
  humidity: Scalars['BigDecimal']['output'];
  /** Total BPF for purchase */
  id: Scalars['ID']['output'];
  /** Season created */
  season: Scalars['Int']['output'];
  /** Starting BPF on creation */
  startBpf: Scalars['BigInt']['output'];
  /** Total supply for this Humidity */
  supply: Scalars['BigInt']['output'];
};


export type FertilizerTokenBalancesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FertilizerBalance_Filter>;
};

export type FertilizerToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FertilizerToken_Filter>>>;
  balances_?: InputMaybe<FertilizerBalance_Filter>;
  endBpf?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBpf_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fertilizer?: InputMaybe<Scalars['String']['input']>;
  fertilizer_?: InputMaybe<Fertilizer_Filter>;
  fertilizer_contains?: InputMaybe<Scalars['String']['input']>;
  fertilizer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizer_ends_with?: InputMaybe<Scalars['String']['input']>;
  fertilizer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizer_gt?: InputMaybe<Scalars['String']['input']>;
  fertilizer_gte?: InputMaybe<Scalars['String']['input']>;
  fertilizer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fertilizer_lt?: InputMaybe<Scalars['String']['input']>;
  fertilizer_lte?: InputMaybe<Scalars['String']['input']>;
  fertilizer_not?: InputMaybe<Scalars['String']['input']>;
  fertilizer_not_contains?: InputMaybe<Scalars['String']['input']>;
  fertilizer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fertilizer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fertilizer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fertilizer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fertilizer_starts_with?: InputMaybe<Scalars['String']['input']>;
  fertilizer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  humidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  humidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FertilizerToken_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  startBpf?: InputMaybe<Scalars['BigInt']['input']>;
  startBpf_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startBpf_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startBpf_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startBpf_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startBpf_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startBpf_not?: InputMaybe<Scalars['BigInt']['input']>;
  startBpf_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FertilizerToken_OrderBy {
  Balances = 'balances',
  EndBpf = 'endBpf',
  Fertilizer = 'fertilizer',
  FertilizerBeanstalk = 'fertilizer__beanstalk',
  FertilizerId = 'fertilizer__id',
  FertilizerSupply = 'fertilizer__supply',
  FertilizerUnmigratedL1Supply = 'fertilizer__unmigratedL1Supply',
  Humidity = 'humidity',
  Id = 'id',
  Season = 'season',
  StartBpf = 'startBpf',
  Supply = 'supply'
}

export type FertilizerYield = {
  __typename?: 'FertilizerYield';
  /** Current Bean EMA */
  beansPerSeasonEMA: Scalars['BigDecimal']['output'];
  /** Block timestamp at creation */
  createdAt: Scalars['BigInt']['output'];
  /** BPF delta */
  deltaBpf: Scalars['BigDecimal']['output'];
  /** Bean EMA Window */
  emaWindow: EmaWindow;
  /** Current humidity */
  humidity: Scalars['BigDecimal']['output'];
  /** Season of data points */
  id: Scalars['ID']['output'];
  /** Current outstanding fert */
  outstandingFert: Scalars['BigInt']['output'];
  /** Current season */
  season: Scalars['Int']['output'];
  /** Simplified APY for new Fert */
  simpleAPY: Scalars['BigDecimal']['output'];
};

export type FertilizerYield_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FertilizerYield_Filter>>>;
  beansPerSeasonEMA?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beansPerSeasonEMA_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBpf?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBpf_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBpf_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBpf_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaBpf_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBpf_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBpf_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBpf_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  emaWindow?: InputMaybe<EmaWindow>;
  emaWindow_in?: InputMaybe<Array<EmaWindow>>;
  emaWindow_not?: InputMaybe<EmaWindow>;
  emaWindow_not_in?: InputMaybe<Array<EmaWindow>>;
  humidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  humidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  humidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FertilizerYield_Filter>>>;
  outstandingFert?: InputMaybe<Scalars['BigInt']['input']>;
  outstandingFert_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outstandingFert_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outstandingFert_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outstandingFert_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outstandingFert_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outstandingFert_not?: InputMaybe<Scalars['BigInt']['input']>;
  outstandingFert_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  simpleAPY?: InputMaybe<Scalars['BigDecimal']['input']>;
  simpleAPY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  simpleAPY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  simpleAPY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  simpleAPY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  simpleAPY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  simpleAPY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  simpleAPY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum FertilizerYield_OrderBy {
  BeansPerSeasonEma = 'beansPerSeasonEMA',
  CreatedAt = 'createdAt',
  DeltaBpf = 'deltaBpf',
  EmaWindow = 'emaWindow',
  Humidity = 'humidity',
  Id = 'id',
  OutstandingFert = 'outstandingFert',
  Season = 'season',
  SimpleApy = 'simpleAPY'
}

export type Fertilizer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Fertilizer_Filter>>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_lt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_lte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Fertilizer_Filter>>>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens_?: InputMaybe<FertilizerToken_Filter>;
  unmigratedL1Supply?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1Supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Fertilizer_OrderBy {
  Beanstalk = 'beanstalk',
  Id = 'id',
  Supply = 'supply',
  Tokens = 'tokens',
  UnmigratedL1Supply = 'unmigratedL1Supply'
}

export type Field = {
  __typename?: 'Field';
  /** 'beanstalk' */
  beanstalk: Beanstalk;
  /** Link to daily snapshot data */
  dailySnapshots: Array<FieldDailySnapshot>;
  /** Farmer address if applicable */
  farmer?: Maybe<Farmer>;
  /** Current harvestable index */
  harvestableIndex: Scalars['BigInt']['output'];
  /** Current harvestable pods */
  harvestablePods: Scalars['BigInt']['output'];
  /** Cumulative harvested pods */
  harvestedPods: Scalars['BigInt']['output'];
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<FieldHourlySnapshot>;
  /** Contract address for this field or farmer */
  id: Scalars['Bytes']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Cumulative number of unique sowers */
  numberOfSowers: Scalars['Int']['output'];
  /** Cumulative number of sows */
  numberOfSows: Scalars['Int']['output'];
  /** Array of current non-harvestable plots */
  plotIndexes: Array<Scalars['BigInt']['output']>;
  /** Current pod index */
  podIndex: Scalars['BigInt']['output'];
  /** Current pod rate: Total unharvestable pods / bean supply */
  podRate: Scalars['BigDecimal']['output'];
  /** Rate of return: Temperature / Bean Price */
  realRateOfReturn: Scalars['BigDecimal']['output'];
  /** Current season number */
  season: Scalars['Int']['output'];
  /** Current amount of soil available */
  soil: Scalars['BigInt']['output'];
  /** Cumulative total of sown beans */
  sownBeans: Scalars['BigInt']['output'];
  /** Current temperature */
  temperature: Scalars['Int']['output'];
  /** Current outstanding non-harvestable pods */
  unharvestablePods: Scalars['BigInt']['output'];
  /** Pods from L1 which has not been minted on L2 yet */
  unmigratedL1Pods?: Maybe<Scalars['BigInt']['output']>;
};


export type FieldDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FieldDailySnapshot_Filter>;
};


export type FieldHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FieldHourlySnapshot_Filter>;
};

export type FieldDailySnapshot = {
  __typename?: 'FieldDailySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaHarvestableIndex: Scalars['BigInt']['output'];
  deltaHarvestablePods: Scalars['BigInt']['output'];
  deltaHarvestedPods: Scalars['BigInt']['output'];
  deltaIssuedSoil: Scalars['BigInt']['output'];
  deltaNumberOfSowers: Scalars['Int']['output'];
  deltaNumberOfSows: Scalars['Int']['output'];
  deltaPodIndex: Scalars['BigInt']['output'];
  deltaPodRate: Scalars['BigDecimal']['output'];
  deltaRealRateOfReturn: Scalars['BigDecimal']['output'];
  deltaSoil: Scalars['BigInt']['output'];
  deltaSownBeans: Scalars['BigInt']['output'];
  deltaTemperature: Scalars['Int']['output'];
  deltaUnharvestablePods: Scalars['BigInt']['output'];
  /** Field associated with this snapshot */
  field: Field;
  /** Point in time harvestable index */
  harvestableIndex: Scalars['BigInt']['output'];
  /** Point in time harvestable pods */
  harvestablePods: Scalars['BigInt']['output'];
  /** Point in time delta harvested pods */
  harvestedPods: Scalars['BigInt']['output'];
  /** Field ID - Day */
  id: Scalars['ID']['output'];
  /** Point in time amount of soil issued */
  issuedSoil: Scalars['BigInt']['output'];
  /** Point in time cumulative number of unique sowers */
  numberOfSowers: Scalars['Int']['output'];
  /** Point in time cumulative number of sows */
  numberOfSows: Scalars['Int']['output'];
  /** Point in time pod index */
  podIndex: Scalars['BigInt']['output'];
  /** Point in time pod rate: Total unharvestable pods / bean supply */
  podRate: Scalars['BigDecimal']['output'];
  /** Point in time rate of return: Temperature / Bean Price */
  realRateOfReturn: Scalars['BigDecimal']['output'];
  /** Last season in the snapshot */
  season: Scalars['Int']['output'];
  /** Point in time amount of soil remaining */
  soil: Scalars['BigInt']['output'];
  /** Point in time cumulative total of sown beans */
  sownBeans: Scalars['BigInt']['output'];
  /** Point in time temperature */
  temperature: Scalars['Int']['output'];
  /** Point in time outstanding non-harvestable pods */
  unharvestablePods: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type FieldDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FieldDailySnapshot_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaIssuedSoil?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaIssuedSoil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaNumberOfSowers?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaNumberOfSowers_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_not?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaNumberOfSows?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaNumberOfSows_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_not?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaPodIndex?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaPodRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaRealRateOfReturn?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaRealRateOfReturn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaSoil?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSoil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSownBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSownBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTemperature?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaTemperature_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_not?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaUnharvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnharvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  field?: InputMaybe<Scalars['String']['input']>;
  field_?: InputMaybe<Field_Filter>;
  field_contains?: InputMaybe<Scalars['String']['input']>;
  field_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  field_ends_with?: InputMaybe<Scalars['String']['input']>;
  field_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_gt?: InputMaybe<Scalars['String']['input']>;
  field_gte?: InputMaybe<Scalars['String']['input']>;
  field_in?: InputMaybe<Array<Scalars['String']['input']>>;
  field_lt?: InputMaybe<Scalars['String']['input']>;
  field_lte?: InputMaybe<Scalars['String']['input']>;
  field_not?: InputMaybe<Scalars['String']['input']>;
  field_not_contains?: InputMaybe<Scalars['String']['input']>;
  field_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  field_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  field_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  field_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  field_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_starts_with?: InputMaybe<Scalars['String']['input']>;
  field_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  harvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  issuedSoil?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  issuedSoil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_not?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  numberOfSowers?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSowers_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_not?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSows?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSows_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_not?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FieldDailySnapshot_Filter>>>;
  podIndex?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  podRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  realRateOfReturn?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  realRateOfReturn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  soil?: InputMaybe<Scalars['BigInt']['input']>;
  soil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  soil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  soil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  soil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  soil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  soil_not?: InputMaybe<Scalars['BigInt']['input']>;
  soil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeans?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  temperature?: InputMaybe<Scalars['Int']['input']>;
  temperature_gt?: InputMaybe<Scalars['Int']['input']>;
  temperature_gte?: InputMaybe<Scalars['Int']['input']>;
  temperature_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  temperature_lt?: InputMaybe<Scalars['Int']['input']>;
  temperature_lte?: InputMaybe<Scalars['Int']['input']>;
  temperature_not?: InputMaybe<Scalars['Int']['input']>;
  temperature_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  unharvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unharvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FieldDailySnapshot_OrderBy {
  CreatedAt = 'createdAt',
  DeltaHarvestableIndex = 'deltaHarvestableIndex',
  DeltaHarvestablePods = 'deltaHarvestablePods',
  DeltaHarvestedPods = 'deltaHarvestedPods',
  DeltaIssuedSoil = 'deltaIssuedSoil',
  DeltaNumberOfSowers = 'deltaNumberOfSowers',
  DeltaNumberOfSows = 'deltaNumberOfSows',
  DeltaPodIndex = 'deltaPodIndex',
  DeltaPodRate = 'deltaPodRate',
  DeltaRealRateOfReturn = 'deltaRealRateOfReturn',
  DeltaSoil = 'deltaSoil',
  DeltaSownBeans = 'deltaSownBeans',
  DeltaTemperature = 'deltaTemperature',
  DeltaUnharvestablePods = 'deltaUnharvestablePods',
  Field = 'field',
  FieldHarvestableIndex = 'field__harvestableIndex',
  FieldHarvestablePods = 'field__harvestablePods',
  FieldHarvestedPods = 'field__harvestedPods',
  FieldId = 'field__id',
  FieldLastDailySnapshotDay = 'field__lastDailySnapshotDay',
  FieldLastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  FieldNumberOfSowers = 'field__numberOfSowers',
  FieldNumberOfSows = 'field__numberOfSows',
  FieldPodIndex = 'field__podIndex',
  FieldPodRate = 'field__podRate',
  FieldRealRateOfReturn = 'field__realRateOfReturn',
  FieldSeason = 'field__season',
  FieldSoil = 'field__soil',
  FieldSownBeans = 'field__sownBeans',
  FieldTemperature = 'field__temperature',
  FieldUnharvestablePods = 'field__unharvestablePods',
  FieldUnmigratedL1Pods = 'field__unmigratedL1Pods',
  HarvestableIndex = 'harvestableIndex',
  HarvestablePods = 'harvestablePods',
  HarvestedPods = 'harvestedPods',
  Id = 'id',
  IssuedSoil = 'issuedSoil',
  NumberOfSowers = 'numberOfSowers',
  NumberOfSows = 'numberOfSows',
  PodIndex = 'podIndex',
  PodRate = 'podRate',
  RealRateOfReturn = 'realRateOfReturn',
  Season = 'season',
  Soil = 'soil',
  SownBeans = 'sownBeans',
  Temperature = 'temperature',
  UnharvestablePods = 'unharvestablePods',
  UpdatedAt = 'updatedAt'
}

export type FieldHourlySnapshot = {
  __typename?: 'FieldHourlySnapshot';
  /** Number of blocks between sunrise and soil being sold out */
  blocksToSoldOutSoil?: Maybe<Scalars['BigInt']['output']>;
  /** The caseId used in the seasonal adjustment of temperature */
  caseId?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaHarvestableIndex: Scalars['BigInt']['output'];
  deltaHarvestablePods: Scalars['BigInt']['output'];
  deltaHarvestedPods: Scalars['BigInt']['output'];
  deltaIssuedSoil: Scalars['BigInt']['output'];
  deltaNumberOfSowers: Scalars['Int']['output'];
  deltaNumberOfSows: Scalars['Int']['output'];
  deltaPodIndex: Scalars['BigInt']['output'];
  deltaPodRate: Scalars['BigDecimal']['output'];
  deltaRealRateOfReturn: Scalars['BigDecimal']['output'];
  deltaSoil: Scalars['BigInt']['output'];
  deltaSownBeans: Scalars['BigInt']['output'];
  deltaTemperature: Scalars['Int']['output'];
  deltaUnharvestablePods: Scalars['BigInt']['output'];
  /** Field associated with this snapshot */
  field: Field;
  /** Point in time harvestable index */
  harvestableIndex: Scalars['BigInt']['output'];
  /** Point in time harvestable pods */
  harvestablePods: Scalars['BigInt']['output'];
  /** Point in time cumulative harvested pods */
  harvestedPods: Scalars['BigInt']['output'];
  /** Field ID - Season */
  id: Scalars['ID']['output'];
  /** Point in time amount of soil issued */
  issuedSoil: Scalars['BigInt']['output'];
  /** Point in time cumulative number of unique sowers */
  numberOfSowers: Scalars['Int']['output'];
  /** Point in time cumulative number of sows */
  numberOfSows: Scalars['Int']['output'];
  /** Point in time pod index */
  podIndex: Scalars['BigInt']['output'];
  /** Point in time pod rate: Total unharvestable pods / bean supply */
  podRate: Scalars['BigDecimal']['output'];
  /** Point in time rate of return: Temperature / Bean Price */
  realRateOfReturn: Scalars['BigDecimal']['output'];
  /** Season */
  season: Scalars['Int']['output'];
  /** Block that started this season/at time of snapshot creation */
  seasonBlock: Scalars['BigInt']['output'];
  /** Point in time amount of soil remaining */
  soil: Scalars['BigInt']['output'];
  /** Bool flag if soil sold out for the season */
  soilSoldOut: Scalars['Boolean']['output'];
  /** Point in time cumulative total of sown beans */
  sownBeans: Scalars['BigInt']['output'];
  /** Point in time temperature */
  temperature: Scalars['Int']['output'];
  /** Point in time outstanding non-harvestable pods */
  unharvestablePods: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type FieldHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FieldHourlySnapshot_Filter>>>;
  blocksToSoldOutSoil?: InputMaybe<Scalars['BigInt']['input']>;
  blocksToSoldOutSoil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blocksToSoldOutSoil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blocksToSoldOutSoil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blocksToSoldOutSoil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blocksToSoldOutSoil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blocksToSoldOutSoil_not?: InputMaybe<Scalars['BigInt']['input']>;
  blocksToSoldOutSoil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caseId?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caseId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_not?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaHarvestedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaHarvestedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaIssuedSoil?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaIssuedSoil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaIssuedSoil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaNumberOfSowers?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaNumberOfSowers_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_not?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSowers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaNumberOfSows?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaNumberOfSows_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_not?: InputMaybe<Scalars['Int']['input']>;
  deltaNumberOfSows_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaPodIndex?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaPodRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaPodRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaRealRateOfReturn?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaRealRateOfReturn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRealRateOfReturn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaSoil?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSoil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSoil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSownBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSownBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSownBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTemperature?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaTemperature_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_not?: InputMaybe<Scalars['Int']['input']>;
  deltaTemperature_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaUnharvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnharvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  field?: InputMaybe<Scalars['String']['input']>;
  field_?: InputMaybe<Field_Filter>;
  field_contains?: InputMaybe<Scalars['String']['input']>;
  field_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  field_ends_with?: InputMaybe<Scalars['String']['input']>;
  field_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_gt?: InputMaybe<Scalars['String']['input']>;
  field_gte?: InputMaybe<Scalars['String']['input']>;
  field_in?: InputMaybe<Array<Scalars['String']['input']>>;
  field_lt?: InputMaybe<Scalars['String']['input']>;
  field_lte?: InputMaybe<Scalars['String']['input']>;
  field_not?: InputMaybe<Scalars['String']['input']>;
  field_not_contains?: InputMaybe<Scalars['String']['input']>;
  field_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  field_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  field_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  field_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  field_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_starts_with?: InputMaybe<Scalars['String']['input']>;
  field_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  harvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  issuedSoil?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  issuedSoil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_not?: InputMaybe<Scalars['BigInt']['input']>;
  issuedSoil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  numberOfSowers?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSowers_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_not?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSows?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSows_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_not?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FieldHourlySnapshot_Filter>>>;
  podIndex?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  podRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  realRateOfReturn?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  realRateOfReturn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  seasonBlock?: InputMaybe<Scalars['BigInt']['input']>;
  seasonBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  seasonBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  seasonBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  seasonBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  seasonBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  seasonBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  seasonBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  soil?: InputMaybe<Scalars['BigInt']['input']>;
  soilSoldOut?: InputMaybe<Scalars['Boolean']['input']>;
  soilSoldOut_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  soilSoldOut_not?: InputMaybe<Scalars['Boolean']['input']>;
  soilSoldOut_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  soil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  soil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  soil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  soil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  soil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  soil_not?: InputMaybe<Scalars['BigInt']['input']>;
  soil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeans?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  temperature?: InputMaybe<Scalars['Int']['input']>;
  temperature_gt?: InputMaybe<Scalars['Int']['input']>;
  temperature_gte?: InputMaybe<Scalars['Int']['input']>;
  temperature_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  temperature_lt?: InputMaybe<Scalars['Int']['input']>;
  temperature_lte?: InputMaybe<Scalars['Int']['input']>;
  temperature_not?: InputMaybe<Scalars['Int']['input']>;
  temperature_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  unharvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unharvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FieldHourlySnapshot_OrderBy {
  BlocksToSoldOutSoil = 'blocksToSoldOutSoil',
  CaseId = 'caseId',
  CreatedAt = 'createdAt',
  DeltaHarvestableIndex = 'deltaHarvestableIndex',
  DeltaHarvestablePods = 'deltaHarvestablePods',
  DeltaHarvestedPods = 'deltaHarvestedPods',
  DeltaIssuedSoil = 'deltaIssuedSoil',
  DeltaNumberOfSowers = 'deltaNumberOfSowers',
  DeltaNumberOfSows = 'deltaNumberOfSows',
  DeltaPodIndex = 'deltaPodIndex',
  DeltaPodRate = 'deltaPodRate',
  DeltaRealRateOfReturn = 'deltaRealRateOfReturn',
  DeltaSoil = 'deltaSoil',
  DeltaSownBeans = 'deltaSownBeans',
  DeltaTemperature = 'deltaTemperature',
  DeltaUnharvestablePods = 'deltaUnharvestablePods',
  Field = 'field',
  FieldHarvestableIndex = 'field__harvestableIndex',
  FieldHarvestablePods = 'field__harvestablePods',
  FieldHarvestedPods = 'field__harvestedPods',
  FieldId = 'field__id',
  FieldLastDailySnapshotDay = 'field__lastDailySnapshotDay',
  FieldLastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  FieldNumberOfSowers = 'field__numberOfSowers',
  FieldNumberOfSows = 'field__numberOfSows',
  FieldPodIndex = 'field__podIndex',
  FieldPodRate = 'field__podRate',
  FieldRealRateOfReturn = 'field__realRateOfReturn',
  FieldSeason = 'field__season',
  FieldSoil = 'field__soil',
  FieldSownBeans = 'field__sownBeans',
  FieldTemperature = 'field__temperature',
  FieldUnharvestablePods = 'field__unharvestablePods',
  FieldUnmigratedL1Pods = 'field__unmigratedL1Pods',
  HarvestableIndex = 'harvestableIndex',
  HarvestablePods = 'harvestablePods',
  HarvestedPods = 'harvestedPods',
  Id = 'id',
  IssuedSoil = 'issuedSoil',
  NumberOfSowers = 'numberOfSowers',
  NumberOfSows = 'numberOfSows',
  PodIndex = 'podIndex',
  PodRate = 'podRate',
  RealRateOfReturn = 'realRateOfReturn',
  Season = 'season',
  SeasonBlock = 'seasonBlock',
  Soil = 'soil',
  SoilSoldOut = 'soilSoldOut',
  SownBeans = 'sownBeans',
  Temperature = 'temperature',
  UnharvestablePods = 'unharvestablePods',
  UpdatedAt = 'updatedAt'
}

export type Field_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Field_Filter>>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_?: InputMaybe<Beanstalk_Filter>;
  beanstalk_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_lt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_lte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshots_?: InputMaybe<FieldDailySnapshot_Filter>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  harvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlySnapshots_?: InputMaybe<FieldHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSowers?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSowers_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_not?: InputMaybe<Scalars['Int']['input']>;
  numberOfSowers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSows?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_gt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_gte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numberOfSows_lt?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_lte?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_not?: InputMaybe<Scalars['Int']['input']>;
  numberOfSows_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Field_Filter>>>;
  plotIndexes?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plotIndexes_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plotIndexes_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plotIndexes_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plotIndexes_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plotIndexes_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podIndex?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  podIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  podRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  podRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  realRateOfReturn?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  realRateOfReturn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  realRateOfReturn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  soil?: InputMaybe<Scalars['BigInt']['input']>;
  soil_gt?: InputMaybe<Scalars['BigInt']['input']>;
  soil_gte?: InputMaybe<Scalars['BigInt']['input']>;
  soil_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  soil_lt?: InputMaybe<Scalars['BigInt']['input']>;
  soil_lte?: InputMaybe<Scalars['BigInt']['input']>;
  soil_not?: InputMaybe<Scalars['BigInt']['input']>;
  soil_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeans?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  temperature?: InputMaybe<Scalars['Int']['input']>;
  temperature_gt?: InputMaybe<Scalars['Int']['input']>;
  temperature_gte?: InputMaybe<Scalars['Int']['input']>;
  temperature_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  temperature_lt?: InputMaybe<Scalars['Int']['input']>;
  temperature_lte?: InputMaybe<Scalars['Int']['input']>;
  temperature_not?: InputMaybe<Scalars['Int']['input']>;
  temperature_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  unharvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unharvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  unharvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1Pods?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Pods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Pods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Pods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1Pods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Pods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Pods_not?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Pods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Field_OrderBy {
  Beanstalk = 'beanstalk',
  BeanstalkFertilizer1155 = 'beanstalk__fertilizer1155',
  BeanstalkId = 'beanstalk__id',
  BeanstalkLastSeason = 'beanstalk__lastSeason',
  BeanstalkToken = 'beanstalk__token',
  DailySnapshots = 'dailySnapshots',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  HarvestableIndex = 'harvestableIndex',
  HarvestablePods = 'harvestablePods',
  HarvestedPods = 'harvestedPods',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  NumberOfSowers = 'numberOfSowers',
  NumberOfSows = 'numberOfSows',
  PlotIndexes = 'plotIndexes',
  PodIndex = 'podIndex',
  PodRate = 'podRate',
  RealRateOfReturn = 'realRateOfReturn',
  Season = 'season',
  Soil = 'soil',
  SownBeans = 'sownBeans',
  Temperature = 'temperature',
  UnharvestablePods = 'unharvestablePods',
  UnmigratedL1Pods = 'unmigratedL1Pods'
}

export type Germinating = {
  __typename?: 'Germinating';
  /** Address of the token or account which is germinating */
  address: Scalars['Bytes']['output'];
  /** Germinating bdv. This only applies to a Token address */
  bdv: Scalars['BigInt']['output'];
  /** Address-(EVEN|ODD) */
  id: Scalars['ID']['output'];
  /** True when the address is a farmer account */
  isFarmer: Scalars['Boolean']['output'];
  /** The season in which the germination started */
  season: Scalars['Int']['output'];
  /** Germinating stalk. This only applies to farmer/protocol address */
  stalk: Scalars['BigInt']['output'];
  /** Germinating tokens. This only applies to a Token address */
  tokenAmount: Scalars['BigInt']['output'];
  /** EVEN or ODD */
  type: Scalars['String']['output'];
};

export type Germinating_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Germinating_Filter>>>;
  bdv?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isFarmer?: InputMaybe<Scalars['Boolean']['input']>;
  isFarmer_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isFarmer_not?: InputMaybe<Scalars['Boolean']['input']>;
  isFarmer_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Germinating_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  stalk?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Germinating_OrderBy {
  Address = 'address',
  Bdv = 'bdv',
  Id = 'id',
  IsFarmer = 'isFarmer',
  Season = 'season',
  Stalk = 'stalk',
  TokenAmount = 'tokenAmount',
  Type = 'type'
}

export enum MarketStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  CancelledPartial = 'CANCELLED_PARTIAL',
  Expired = 'EXPIRED',
  Filled = 'FILLED',
  FilledPartial = 'FILLED_PARTIAL'
}

export type MarketplaceEvent = {
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Timestamp of this event */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** { Event type }-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Event log index. For transactions that don't emit event, create arbitrary index starting from 0 */
  logIndex: Scalars['Int']['output'];
};

export type MarketplaceEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MarketplaceEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MarketplaceEvent_Filter>>>;
};

export enum MarketplaceEvent_OrderBy {
  BlockNumber = 'blockNumber',
  CreatedAt = 'createdAt',
  Hash = 'hash',
  Id = 'id',
  LogIndex = 'logIndex'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Plot = {
  __typename?: 'Plot';
  /** Number of beans spent for each pod, whether through sowing or on the marketplace */
  beansPerPod: Scalars['BigInt']['output'];
  /** Timestamp of creation */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash of when this plot entity was created */
  creationHash: Scalars['Bytes']['output'];
  /** Farmer who owns this plot */
  farmer: Farmer;
  /** Field to which this plot belongs */
  field: Field;
  /** Flag for if plot is fully harvested */
  fullyHarvested: Scalars['Boolean']['output'];
  /** Number of pods harvestable */
  harvestablePods: Scalars['BigInt']['output'];
  /** Number of pods harvested */
  harvestedPods: Scalars['BigInt']['output'];
  /** Plot index */
  id: Scalars['ID']['output'];
  /** Plot Index */
  index: Scalars['BigInt']['output'];
  /** Associated plot listing */
  listing?: Maybe<PodListing>;
  /** Total pods in plot */
  pods: Scalars['BigInt']['output'];
  /** Season when created */
  season: Scalars['Int']['output'];
  /** Transaction source for this plot. Not the same as creationHash which can include plots splitting from transfer or harvest without the owner changing */
  source: PlotSource;
  /** Transaction hash corresponding to source */
  sourceHash: Scalars['Bytes']['output'];
  /** Timestamp when updated */
  updatedAt: Scalars['BigInt']['output'];
  /** Block when updated */
  updatedAtBlock: Scalars['BigInt']['output'];
};

export enum PlotSource {
  ContractReceiverMigrated = 'CONTRACT_RECEIVER_MIGRATED',
  Market = 'MARKET',
  ReseedMigrated = 'RESEED_MIGRATED',
  Sow = 'SOW',
  Transfer = 'TRANSFER'
}

export type Plot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Plot_Filter>>>;
  beansPerPod?: InputMaybe<Scalars['BigInt']['input']>;
  beansPerPod_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beansPerPod_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beansPerPod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beansPerPod_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beansPerPod_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beansPerPod_not?: InputMaybe<Scalars['BigInt']['input']>;
  beansPerPod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationHash?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creationHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field?: InputMaybe<Scalars['String']['input']>;
  field_?: InputMaybe<Field_Filter>;
  field_contains?: InputMaybe<Scalars['String']['input']>;
  field_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  field_ends_with?: InputMaybe<Scalars['String']['input']>;
  field_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_gt?: InputMaybe<Scalars['String']['input']>;
  field_gte?: InputMaybe<Scalars['String']['input']>;
  field_in?: InputMaybe<Array<Scalars['String']['input']>>;
  field_lt?: InputMaybe<Scalars['String']['input']>;
  field_lte?: InputMaybe<Scalars['String']['input']>;
  field_not?: InputMaybe<Scalars['String']['input']>;
  field_not_contains?: InputMaybe<Scalars['String']['input']>;
  field_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  field_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  field_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  field_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  field_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  field_starts_with?: InputMaybe<Scalars['String']['input']>;
  field_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fullyHarvested?: InputMaybe<Scalars['Boolean']['input']>;
  fullyHarvested_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  fullyHarvested_not?: InputMaybe<Scalars['Boolean']['input']>;
  fullyHarvested_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  harvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  listing?: InputMaybe<Scalars['String']['input']>;
  listing_?: InputMaybe<PodListing_Filter>;
  listing_contains?: InputMaybe<Scalars['String']['input']>;
  listing_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_ends_with?: InputMaybe<Scalars['String']['input']>;
  listing_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_gt?: InputMaybe<Scalars['String']['input']>;
  listing_gte?: InputMaybe<Scalars['String']['input']>;
  listing_in?: InputMaybe<Array<Scalars['String']['input']>>;
  listing_lt?: InputMaybe<Scalars['String']['input']>;
  listing_lte?: InputMaybe<Scalars['String']['input']>;
  listing_not?: InputMaybe<Scalars['String']['input']>;
  listing_not_contains?: InputMaybe<Scalars['String']['input']>;
  listing_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  listing_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  listing_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  listing_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_starts_with?: InputMaybe<Scalars['String']['input']>;
  listing_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Plot_Filter>>>;
  pods?: InputMaybe<Scalars['BigInt']['input']>;
  pods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pods_not?: InputMaybe<Scalars['BigInt']['input']>;
  pods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  source?: InputMaybe<PlotSource>;
  sourceHash?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sourceHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sourceHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  source_in?: InputMaybe<Array<PlotSource>>;
  source_not?: InputMaybe<PlotSource>;
  source_not_in?: InputMaybe<Array<PlotSource>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Plot_OrderBy {
  BeansPerPod = 'beansPerPod',
  CreatedAt = 'createdAt',
  CreationHash = 'creationHash',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  Field = 'field',
  FieldHarvestableIndex = 'field__harvestableIndex',
  FieldHarvestablePods = 'field__harvestablePods',
  FieldHarvestedPods = 'field__harvestedPods',
  FieldId = 'field__id',
  FieldLastDailySnapshotDay = 'field__lastDailySnapshotDay',
  FieldLastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  FieldNumberOfSowers = 'field__numberOfSowers',
  FieldNumberOfSows = 'field__numberOfSows',
  FieldPodIndex = 'field__podIndex',
  FieldPodRate = 'field__podRate',
  FieldRealRateOfReturn = 'field__realRateOfReturn',
  FieldSeason = 'field__season',
  FieldSoil = 'field__soil',
  FieldSownBeans = 'field__sownBeans',
  FieldTemperature = 'field__temperature',
  FieldUnharvestablePods = 'field__unharvestablePods',
  FieldUnmigratedL1Pods = 'field__unmigratedL1Pods',
  FullyHarvested = 'fullyHarvested',
  HarvestablePods = 'harvestablePods',
  HarvestedPods = 'harvestedPods',
  Id = 'id',
  Index = 'index',
  Listing = 'listing',
  ListingAmount = 'listing__amount',
  ListingCreatedAt = 'listing__createdAt',
  ListingCreationHash = 'listing__creationHash',
  ListingFilled = 'listing__filled',
  ListingFilledAmount = 'listing__filledAmount',
  ListingHistoryId = 'listing__historyID',
  ListingId = 'listing__id',
  ListingIndex = 'listing__index',
  ListingMaxHarvestableIndex = 'listing__maxHarvestableIndex',
  ListingMinFillAmount = 'listing__minFillAmount',
  ListingMode = 'listing__mode',
  ListingOriginalAmount = 'listing__originalAmount',
  ListingOriginalIndex = 'listing__originalIndex',
  ListingPricePerPod = 'listing__pricePerPod',
  ListingPricingFunction = 'listing__pricingFunction',
  ListingPricingType = 'listing__pricingType',
  ListingRemainingAmount = 'listing__remainingAmount',
  ListingStart = 'listing__start',
  ListingStatus = 'listing__status',
  ListingUpdatedAt = 'listing__updatedAt',
  Pods = 'pods',
  Season = 'season',
  Source = 'source',
  SourceHash = 'sourceHash',
  UpdatedAt = 'updatedAt',
  UpdatedAtBlock = 'updatedAtBlock'
}

export type PodFill = {
  __typename?: 'PodFill';
  /** Number of pods filled */
  amount: Scalars['BigInt']['output'];
  /** Total beans used to fill listing/order */
  costInBeans: Scalars['BigInt']['output'];
  /** Creation timestamp */
  createdAt: Scalars['BigInt']['output'];
  /** Account that is sending pods */
  fromFarmer: Scalars['Bytes']['output'];
  /** Beanstalk address - Order/Listing index - transaction hash */
  id: Scalars['ID']['output'];
  /** Index of plot transferred */
  index: Scalars['BigInt']['output'];
  /** Associated listing, if any */
  listing?: Maybe<PodListing>;
  /** Associated order, if any */
  order?: Maybe<PodOrder>;
  /** Where these pods were in line when filled */
  placeInLine: Scalars['BigInt']['output'];
  /** Marketplace associated with this fill */
  podMarketplace: PodMarketplace;
  /** Start of plot transferred */
  start: Scalars['BigInt']['output'];
  /** Account that is receiving pods */
  toFarmer: Farmer;
};

export type PodFill_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodFill_Filter>>>;
  costInBeans?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  costInBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fromFarmer?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  fromFarmer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  listing?: InputMaybe<Scalars['String']['input']>;
  listing_?: InputMaybe<PodListing_Filter>;
  listing_contains?: InputMaybe<Scalars['String']['input']>;
  listing_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_ends_with?: InputMaybe<Scalars['String']['input']>;
  listing_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_gt?: InputMaybe<Scalars['String']['input']>;
  listing_gte?: InputMaybe<Scalars['String']['input']>;
  listing_in?: InputMaybe<Array<Scalars['String']['input']>>;
  listing_lt?: InputMaybe<Scalars['String']['input']>;
  listing_lte?: InputMaybe<Scalars['String']['input']>;
  listing_not?: InputMaybe<Scalars['String']['input']>;
  listing_not_contains?: InputMaybe<Scalars['String']['input']>;
  listing_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  listing_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  listing_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  listing_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  listing_starts_with?: InputMaybe<Scalars['String']['input']>;
  listing_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<PodFill_Filter>>>;
  order?: InputMaybe<Scalars['String']['input']>;
  order_?: InputMaybe<PodOrder_Filter>;
  order_contains?: InputMaybe<Scalars['String']['input']>;
  order_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  order_ends_with?: InputMaybe<Scalars['String']['input']>;
  order_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  order_gt?: InputMaybe<Scalars['String']['input']>;
  order_gte?: InputMaybe<Scalars['String']['input']>;
  order_in?: InputMaybe<Array<Scalars['String']['input']>>;
  order_lt?: InputMaybe<Scalars['String']['input']>;
  order_lte?: InputMaybe<Scalars['String']['input']>;
  order_not?: InputMaybe<Scalars['String']['input']>;
  order_not_contains?: InputMaybe<Scalars['String']['input']>;
  order_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  order_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  order_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  order_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  order_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  order_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  order_starts_with?: InputMaybe<Scalars['String']['input']>;
  order_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  placeInLine?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  placeInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplace_Filter>;
  podMarketplace_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_lt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_lte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['BigInt']['input']>;
  start_gt?: InputMaybe<Scalars['BigInt']['input']>;
  start_gte?: InputMaybe<Scalars['BigInt']['input']>;
  start_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start_lt?: InputMaybe<Scalars['BigInt']['input']>;
  start_lte?: InputMaybe<Scalars['BigInt']['input']>;
  start_not?: InputMaybe<Scalars['BigInt']['input']>;
  start_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  toFarmer?: InputMaybe<Scalars['String']['input']>;
  toFarmer_?: InputMaybe<Farmer_Filter>;
  toFarmer_contains?: InputMaybe<Scalars['String']['input']>;
  toFarmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toFarmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  toFarmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toFarmer_gt?: InputMaybe<Scalars['String']['input']>;
  toFarmer_gte?: InputMaybe<Scalars['String']['input']>;
  toFarmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toFarmer_lt?: InputMaybe<Scalars['String']['input']>;
  toFarmer_lte?: InputMaybe<Scalars['String']['input']>;
  toFarmer_not?: InputMaybe<Scalars['String']['input']>;
  toFarmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  toFarmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toFarmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  toFarmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toFarmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toFarmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  toFarmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toFarmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  toFarmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum PodFill_OrderBy {
  Amount = 'amount',
  CostInBeans = 'costInBeans',
  CreatedAt = 'createdAt',
  FromFarmer = 'fromFarmer',
  Id = 'id',
  Index = 'index',
  Listing = 'listing',
  ListingAmount = 'listing__amount',
  ListingCreatedAt = 'listing__createdAt',
  ListingCreationHash = 'listing__creationHash',
  ListingFilled = 'listing__filled',
  ListingFilledAmount = 'listing__filledAmount',
  ListingHistoryId = 'listing__historyID',
  ListingId = 'listing__id',
  ListingIndex = 'listing__index',
  ListingMaxHarvestableIndex = 'listing__maxHarvestableIndex',
  ListingMinFillAmount = 'listing__minFillAmount',
  ListingMode = 'listing__mode',
  ListingOriginalAmount = 'listing__originalAmount',
  ListingOriginalIndex = 'listing__originalIndex',
  ListingPricePerPod = 'listing__pricePerPod',
  ListingPricingFunction = 'listing__pricingFunction',
  ListingPricingType = 'listing__pricingType',
  ListingRemainingAmount = 'listing__remainingAmount',
  ListingStart = 'listing__start',
  ListingStatus = 'listing__status',
  ListingUpdatedAt = 'listing__updatedAt',
  Order = 'order',
  OrderBeanAmount = 'order__beanAmount',
  OrderBeanAmountFilled = 'order__beanAmountFilled',
  OrderCreatedAt = 'order__createdAt',
  OrderCreationHash = 'order__creationHash',
  OrderHistoryId = 'order__historyID',
  OrderId = 'order__id',
  OrderMaxPlaceInLine = 'order__maxPlaceInLine',
  OrderMinFillAmount = 'order__minFillAmount',
  OrderPodAmountFilled = 'order__podAmountFilled',
  OrderPricePerPod = 'order__pricePerPod',
  OrderPricingFunction = 'order__pricingFunction',
  OrderPricingType = 'order__pricingType',
  OrderStatus = 'order__status',
  OrderUpdatedAt = 'order__updatedAt',
  PlaceInLine = 'placeInLine',
  PodMarketplace = 'podMarketplace',
  PodMarketplaceAvailableListedPods = 'podMarketplace__availableListedPods',
  PodMarketplaceAvailableOrderBeans = 'podMarketplace__availableOrderBeans',
  PodMarketplaceBeanVolume = 'podMarketplace__beanVolume',
  PodMarketplaceCancelledListedPods = 'podMarketplace__cancelledListedPods',
  PodMarketplaceCancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  PodMarketplaceExpiredListedPods = 'podMarketplace__expiredListedPods',
  PodMarketplaceFilledListedPods = 'podMarketplace__filledListedPods',
  PodMarketplaceFilledOrderBeans = 'podMarketplace__filledOrderBeans',
  PodMarketplaceFilledOrderedPods = 'podMarketplace__filledOrderedPods',
  PodMarketplaceId = 'podMarketplace__id',
  PodMarketplaceLastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  PodMarketplaceLastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  PodMarketplaceListedPods = 'podMarketplace__listedPods',
  PodMarketplaceOrderBeans = 'podMarketplace__orderBeans',
  PodMarketplacePodVolume = 'podMarketplace__podVolume',
  PodMarketplaceSeason = 'podMarketplace__season',
  Start = 'start',
  ToFarmer = 'toFarmer',
  ToFarmerId = 'toFarmer__id'
}

export type PodListing = {
  __typename?: 'PodListing';
  /**
   * The maximum amount of Pods remaining to be sold by *this* PodListing.
   *
   * When this PodListing is Filled or Cancelled, `amount` does NOT change.
   *
   */
  amount: Scalars['BigInt']['output'];
  /** Timestamp of PodListing creation. */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash when this PodListing entity was created. */
  creationHash: Scalars['Bytes']['output'];
  /** The Farmer that created the PodListing. */
  farmer: Farmer;
  /** Any Fills associated with this PodListing. */
  fill?: Maybe<PodFill>;
  /**
   * The amount of Pods Filled since the initial PodListing was Created.
   *
   * `0 <= filled <= originalAmount`
   *
   */
  filled: Scalars['BigInt']['output'];
  /**
   * The number of Pods purchased from *this* PodListing.
   *
   * If not yet Filled or the PodListing is CANCELLED: `filledAmount = 0`
   *
   */
  filledAmount: Scalars['BigInt']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /**
   * The PodListing ID is a unique subgraph ID: `{account}-{index}"
   *
   * The on-chain identifier for a PodListing is the `index`.
   *
   */
  id: Scalars['ID']['output'];
  /**
   * The absolute index of the listed Plot in the Pod Line.
   *
   * Measured from the front, so the Listing contains all Pods between
   * (index) and (index + totalAmount).
   *
   * An example where the podLine is 50,000 but the index is 150,000:
   *    0         the first Pod issued
   *    100,000   harvestableIndex
   *    150,000   index
   *
   */
  index: Scalars['BigInt']['output'];
  /**
   * When the `harvestableIndex` reaches this number, the Listing becomes EXPIRED.
   *
   */
  maxHarvestableIndex: Scalars['BigInt']['output'];
  /** Minimum number of Beans required to perform a Fill. */
  minFillAmount: Scalars['BigInt']['output'];
  /** Where Beans are sent when the PodListing is Filled. See `FarmToMode`. */
  mode: Scalars['Int']['output'];
  /**
   * The total number of Pods listed during the first emission of PodListingCreated.
   *
   */
  originalAmount: Scalars['BigInt']['output'];
  /**
   * The original index from the first emission of PodListingCreated in a chain.
   *
   * If `originalIndex !== index`, then this PodListing was created when a parent
   * PodListing was partially filled.
   *
   */
  originalIndex: Scalars['BigInt']['output'];
  /** Plot being Listed. */
  plot: Plot;
  /** Marketplace used for listing */
  podMarketplace: PodMarketplace;
  /**
   * [V1] The FIXED price per Pod denominated in Beans.
   *
   * Ex. `pricePerPod = 10000` indicates a price of 0.01 Beans per Pod.
   *
   * If `pricingType = 1`, this field is set to `0` and should be ignored.
   *
   */
  pricePerPod: Scalars['Int']['output'];
  /**
   * [V2] The FIXED or DYNAMIC pricing function, encoded as bytes.
   *
   * This must be decoded client-side, see `LibPolynomial.sol` for more info.
   *
   */
  pricingFunction?: Maybe<Scalars['Bytes']['output']>;
  /**
   * The Pricing Type states whether this PodListing uses FIXED or DYNAMIC pricing.
   *
   * null = V1 FIXED  = use `pricePerPod`
   * 0    = V2 FIXED  = use `pricePerPod`
   * 1    = V2 DYNAMIC = use `pricingFunction`
   *
   */
  pricingType?: Maybe<Scalars['Int']['output']>;
  /**
   * The number of Pods remaining in *this* PodListing.
   *
   * When a Fill occurs, `remainingAmount` is decremented on this PodListing. A new
   * PodListing is created with an updated `index` and `amount` equal to this
   * PodListing's remainingAmount.
   *
   * If this PodListing has NOT been Filled: `remainingAmount = amount`
   * If this PodListing has been Filled: `remainingAmount < amount`
   * If this PodListing has been Cancelled: `remainingAmount = 0`
   *
   */
  remainingAmount: Scalars['BigInt']['output'];
  /**
   * The position within the Plot from which to sell Pods.
   *
   * 0 <= `start` <= (plot size - `amount`)
   *
   */
  start: Scalars['BigInt']['output'];
  /** Current market status of listing */
  status: MarketStatus;
  /** Timestamp of last update to this PodListing, including Fills and Cancellations. */
  updatedAt: Scalars['BigInt']['output'];
};

export type PodListingCancelled = MarketplaceEvent & {
  __typename?: 'PodListingCancelled';
  /** Account cancelling listing */
  account: Scalars['Bytes']['output'];
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Timestamp of this event */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /** seedChange-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Index of plot listing being cancelled */
  index: Scalars['BigInt']['output'];
  /** Event log index. For transactions that don't emit event, create arbitrary index starting from 0 */
  logIndex: Scalars['Int']['output'];
  /** Where these pods were in line when cancelled */
  placeInLine: Scalars['BigInt']['output'];
};

export type PodListingCancelled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['Bytes']['input']>;
  account_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_gt?: InputMaybe<Scalars['Bytes']['input']>;
  account_gte?: InputMaybe<Scalars['Bytes']['input']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  account_lt?: InputMaybe<Scalars['Bytes']['input']>;
  account_lte?: InputMaybe<Scalars['Bytes']['input']>;
  account_not?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodListingCancelled_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodListingCancelled_Filter>>>;
  placeInLine?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  placeInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PodListingCancelled_OrderBy {
  Account = 'account',
  BlockNumber = 'blockNumber',
  CreatedAt = 'createdAt',
  Hash = 'hash',
  HistoryId = 'historyID',
  Id = 'id',
  Index = 'index',
  LogIndex = 'logIndex',
  PlaceInLine = 'placeInLine'
}

export type PodListingCreated = MarketplaceEvent & {
  __typename?: 'PodListingCreated';
  /** Account creating the listing */
  account: Scalars['Bytes']['output'];
  /** Amount of pods listed */
  amount: Scalars['BigInt']['output'];
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Timestamp of this event */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /** podListingCreated-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Index of the plot listed */
  index: Scalars['BigInt']['output'];
  /** Event log index. For transactions that don't emit event, create arbitrary index starting from 0 */
  logIndex: Scalars['Int']['output'];
  /** Max index for listing */
  maxHarvestableIndex: Scalars['BigInt']['output'];
  /** Minimum fill amount */
  minFillAmount: Scalars['BigInt']['output'];
  /** Claim to location */
  mode: Scalars['Int']['output'];
  /** Where these pods were in line when listed */
  placeInLine: Scalars['BigInt']['output'];
  /** Price per pod */
  pricePerPod: Scalars['Int']['output'];
  /** Pricing Function Data */
  pricingFunction?: Maybe<Scalars['Bytes']['output']>;
  /** Pricing Type */
  pricingType?: Maybe<Scalars['Int']['output']>;
  /** Start value of the plot listed */
  start: Scalars['BigInt']['output'];
};

export type PodListingCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['Bytes']['input']>;
  account_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_gt?: InputMaybe<Scalars['Bytes']['input']>;
  account_gte?: InputMaybe<Scalars['Bytes']['input']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  account_lt?: InputMaybe<Scalars['Bytes']['input']>;
  account_lte?: InputMaybe<Scalars['Bytes']['input']>;
  account_not?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodListingCreated_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxHarvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxHarvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minFillAmount?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minFillAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mode?: InputMaybe<Scalars['Int']['input']>;
  mode_gt?: InputMaybe<Scalars['Int']['input']>;
  mode_gte?: InputMaybe<Scalars['Int']['input']>;
  mode_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  mode_lt?: InputMaybe<Scalars['Int']['input']>;
  mode_lte?: InputMaybe<Scalars['Int']['input']>;
  mode_not?: InputMaybe<Scalars['Int']['input']>;
  mode_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodListingCreated_Filter>>>;
  placeInLine?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  placeInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerPod?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricePerPod_lt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_lte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingFunction?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingFunction_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingType?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingType_lt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_lte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  start?: InputMaybe<Scalars['BigInt']['input']>;
  start_gt?: InputMaybe<Scalars['BigInt']['input']>;
  start_gte?: InputMaybe<Scalars['BigInt']['input']>;
  start_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start_lt?: InputMaybe<Scalars['BigInt']['input']>;
  start_lte?: InputMaybe<Scalars['BigInt']['input']>;
  start_not?: InputMaybe<Scalars['BigInt']['input']>;
  start_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PodListingCreated_OrderBy {
  Account = 'account',
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  CreatedAt = 'createdAt',
  Hash = 'hash',
  HistoryId = 'historyID',
  Id = 'id',
  Index = 'index',
  LogIndex = 'logIndex',
  MaxHarvestableIndex = 'maxHarvestableIndex',
  MinFillAmount = 'minFillAmount',
  Mode = 'mode',
  PlaceInLine = 'placeInLine',
  PricePerPod = 'pricePerPod',
  PricingFunction = 'pricingFunction',
  PricingType = 'pricingType',
  Start = 'start'
}

export type PodListingFilled = MarketplaceEvent & {
  __typename?: 'PodListingFilled';
  /** Number of pods transferred */
  amount: Scalars['BigInt']['output'];
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Beans paid to fill the listing */
  costInBeans?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of this event */
  createdAt: Scalars['BigInt']['output'];
  /** Account selling pods */
  fromFarmer: Scalars['Bytes']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /** podListingFilled-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Index of the plot transferred */
  index: Scalars['BigInt']['output'];
  /** Event log index. For transactions that don't emit event, create arbitrary index starting from 0 */
  logIndex: Scalars['Int']['output'];
  /** Where these pods were in line when filled */
  placeInLine: Scalars['BigInt']['output'];
  /** Start of the plot transferred */
  start: Scalars['BigInt']['output'];
  /** Account buying pods */
  toFarmer: Scalars['Bytes']['output'];
};

export type PodListingFilled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodListingFilled_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  costInBeans?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  costInBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fromFarmer?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  fromFarmer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodListingFilled_Filter>>>;
  placeInLine?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  placeInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start?: InputMaybe<Scalars['BigInt']['input']>;
  start_gt?: InputMaybe<Scalars['BigInt']['input']>;
  start_gte?: InputMaybe<Scalars['BigInt']['input']>;
  start_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start_lt?: InputMaybe<Scalars['BigInt']['input']>;
  start_lte?: InputMaybe<Scalars['BigInt']['input']>;
  start_not?: InputMaybe<Scalars['BigInt']['input']>;
  start_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  toFarmer?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  toFarmer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_not?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum PodListingFilled_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  CostInBeans = 'costInBeans',
  CreatedAt = 'createdAt',
  FromFarmer = 'fromFarmer',
  Hash = 'hash',
  HistoryId = 'historyID',
  Id = 'id',
  Index = 'index',
  LogIndex = 'logIndex',
  PlaceInLine = 'placeInLine',
  Start = 'start',
  ToFarmer = 'toFarmer'
}

export type PodListing_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodListing_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationHash?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creationHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fill?: InputMaybe<Scalars['String']['input']>;
  fill_?: InputMaybe<PodFill_Filter>;
  fill_contains?: InputMaybe<Scalars['String']['input']>;
  fill_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fill_ends_with?: InputMaybe<Scalars['String']['input']>;
  fill_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fill_gt?: InputMaybe<Scalars['String']['input']>;
  fill_gte?: InputMaybe<Scalars['String']['input']>;
  fill_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fill_lt?: InputMaybe<Scalars['String']['input']>;
  fill_lte?: InputMaybe<Scalars['String']['input']>;
  fill_not?: InputMaybe<Scalars['String']['input']>;
  fill_not_contains?: InputMaybe<Scalars['String']['input']>;
  fill_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fill_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fill_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fill_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fill_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fill_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fill_starts_with?: InputMaybe<Scalars['String']['input']>;
  fill_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  filled?: InputMaybe<Scalars['BigInt']['input']>;
  filledAmount?: InputMaybe<Scalars['BigInt']['input']>;
  filledAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filled_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filled_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filled_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filled_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filled_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filled_not?: InputMaybe<Scalars['BigInt']['input']>;
  filled_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxHarvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxHarvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxHarvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minFillAmount?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minFillAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mode?: InputMaybe<Scalars['Int']['input']>;
  mode_gt?: InputMaybe<Scalars['Int']['input']>;
  mode_gte?: InputMaybe<Scalars['Int']['input']>;
  mode_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  mode_lt?: InputMaybe<Scalars['Int']['input']>;
  mode_lte?: InputMaybe<Scalars['Int']['input']>;
  mode_not?: InputMaybe<Scalars['Int']['input']>;
  mode_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodListing_Filter>>>;
  originalAmount?: InputMaybe<Scalars['BigInt']['input']>;
  originalAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  originalAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  originalAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  originalAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  originalAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  originalAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  originalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  originalIndex?: InputMaybe<Scalars['BigInt']['input']>;
  originalIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  originalIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  originalIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  originalIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  originalIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  originalIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  originalIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plot?: InputMaybe<Scalars['String']['input']>;
  plot_?: InputMaybe<Plot_Filter>;
  plot_contains?: InputMaybe<Scalars['String']['input']>;
  plot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  plot_ends_with?: InputMaybe<Scalars['String']['input']>;
  plot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  plot_gt?: InputMaybe<Scalars['String']['input']>;
  plot_gte?: InputMaybe<Scalars['String']['input']>;
  plot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  plot_lt?: InputMaybe<Scalars['String']['input']>;
  plot_lte?: InputMaybe<Scalars['String']['input']>;
  plot_not?: InputMaybe<Scalars['String']['input']>;
  plot_not_contains?: InputMaybe<Scalars['String']['input']>;
  plot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  plot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  plot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  plot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  plot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  plot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  plot_starts_with?: InputMaybe<Scalars['String']['input']>;
  plot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplace_Filter>;
  podMarketplace_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_lt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_lte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pricePerPod?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricePerPod_lt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_lte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingFunction?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingFunction_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingType?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingType_lt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_lte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  remainingAmount?: InputMaybe<Scalars['BigInt']['input']>;
  remainingAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  remainingAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  remainingAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  remainingAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  remainingAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start?: InputMaybe<Scalars['BigInt']['input']>;
  start_gt?: InputMaybe<Scalars['BigInt']['input']>;
  start_gte?: InputMaybe<Scalars['BigInt']['input']>;
  start_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start_lt?: InputMaybe<Scalars['BigInt']['input']>;
  start_lte?: InputMaybe<Scalars['BigInt']['input']>;
  start_not?: InputMaybe<Scalars['BigInt']['input']>;
  start_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status?: InputMaybe<MarketStatus>;
  status_in?: InputMaybe<Array<MarketStatus>>;
  status_not?: InputMaybe<MarketStatus>;
  status_not_in?: InputMaybe<Array<MarketStatus>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PodListing_OrderBy {
  Amount = 'amount',
  CreatedAt = 'createdAt',
  CreationHash = 'creationHash',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  Fill = 'fill',
  FillAmount = 'fill__amount',
  FillCostInBeans = 'fill__costInBeans',
  FillCreatedAt = 'fill__createdAt',
  FillFromFarmer = 'fill__fromFarmer',
  FillId = 'fill__id',
  FillIndex = 'fill__index',
  FillPlaceInLine = 'fill__placeInLine',
  FillStart = 'fill__start',
  Filled = 'filled',
  FilledAmount = 'filledAmount',
  HistoryId = 'historyID',
  Id = 'id',
  Index = 'index',
  MaxHarvestableIndex = 'maxHarvestableIndex',
  MinFillAmount = 'minFillAmount',
  Mode = 'mode',
  OriginalAmount = 'originalAmount',
  OriginalIndex = 'originalIndex',
  Plot = 'plot',
  PlotBeansPerPod = 'plot__beansPerPod',
  PlotCreatedAt = 'plot__createdAt',
  PlotCreationHash = 'plot__creationHash',
  PlotFullyHarvested = 'plot__fullyHarvested',
  PlotHarvestablePods = 'plot__harvestablePods',
  PlotHarvestedPods = 'plot__harvestedPods',
  PlotId = 'plot__id',
  PlotIndex = 'plot__index',
  PlotPods = 'plot__pods',
  PlotSeason = 'plot__season',
  PlotSource = 'plot__source',
  PlotSourceHash = 'plot__sourceHash',
  PlotUpdatedAt = 'plot__updatedAt',
  PlotUpdatedAtBlock = 'plot__updatedAtBlock',
  PodMarketplace = 'podMarketplace',
  PodMarketplaceAvailableListedPods = 'podMarketplace__availableListedPods',
  PodMarketplaceAvailableOrderBeans = 'podMarketplace__availableOrderBeans',
  PodMarketplaceBeanVolume = 'podMarketplace__beanVolume',
  PodMarketplaceCancelledListedPods = 'podMarketplace__cancelledListedPods',
  PodMarketplaceCancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  PodMarketplaceExpiredListedPods = 'podMarketplace__expiredListedPods',
  PodMarketplaceFilledListedPods = 'podMarketplace__filledListedPods',
  PodMarketplaceFilledOrderBeans = 'podMarketplace__filledOrderBeans',
  PodMarketplaceFilledOrderedPods = 'podMarketplace__filledOrderedPods',
  PodMarketplaceId = 'podMarketplace__id',
  PodMarketplaceLastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  PodMarketplaceLastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  PodMarketplaceListedPods = 'podMarketplace__listedPods',
  PodMarketplaceOrderBeans = 'podMarketplace__orderBeans',
  PodMarketplacePodVolume = 'podMarketplace__podVolume',
  PodMarketplaceSeason = 'podMarketplace__season',
  PricePerPod = 'pricePerPod',
  PricingFunction = 'pricingFunction',
  PricingType = 'pricingType',
  RemainingAmount = 'remainingAmount',
  Start = 'start',
  Status = 'status',
  UpdatedAt = 'updatedAt'
}

export type PodMarketplace = {
  __typename?: 'PodMarketplace';
  /** Information about the active pod listings. Each entry of the form 'account-index-expiry' */
  activeListings: Array<Scalars['String']['output']>;
  /** Information about the active pod orders. Each entry of the form 'orderId-maxPlaceInLine' */
  activeOrders: Array<Scalars['String']['output']>;
  /** All historical listings */
  allListings: Array<PodListing>;
  /** All historical orders */
  allOrders: Array<PodOrder>;
  /** Current amount of total pods listed */
  availableListedPods: Scalars['BigInt']['output'];
  /** Current amount of total beans in pod orders */
  availableOrderBeans: Scalars['BigInt']['output'];
  /** Cumulative bean volume between listings and orders */
  beanVolume: Scalars['BigInt']['output'];
  /** Current cumulative pod listings that were cancelled */
  cancelledListedPods: Scalars['BigInt']['output'];
  /** Current cumulative beans in pod orders cancelled */
  cancelledOrderBeans: Scalars['BigInt']['output'];
  /** Link to daily snapshot data */
  dailySnapshots: Array<PodMarketplaceDailySnapshot>;
  /** Current cumulative pod listings that expired */
  expiredListedPods: Scalars['BigInt']['output'];
  /** Current cumulative pod listings filled */
  filledListedPods: Scalars['BigInt']['output'];
  /** Current cumulative filled beans in pod orders */
  filledOrderBeans: Scalars['BigInt']['output'];
  /** Current cumulative pod orders filled */
  filledOrderedPods: Scalars['BigInt']['output'];
  /** All historical marketplace fills */
  fills: Array<PodFill>;
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<PodMarketplaceHourlySnapshot>;
  /** Field id */
  id: Scalars['ID']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Current cumulative pods listed for sale */
  listedPods: Scalars['BigInt']['output'];
  /** Current cumulative beans in pod orders created */
  orderBeans: Scalars['BigInt']['output'];
  /** Cumulative pod volume between listings and orders */
  podVolume: Scalars['BigInt']['output'];
  /** Current season of the marketplace */
  season: Scalars['Int']['output'];
};


export type PodMarketplaceAllListingsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListing_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodListing_Filter>;
};


export type PodMarketplaceAllOrdersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodOrder_Filter>;
};


export type PodMarketplaceDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodMarketplaceDailySnapshot_Filter>;
};


export type PodMarketplaceFillsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFill_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodFill_Filter>;
};


export type PodMarketplaceHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodMarketplaceHourlySnapshot_Filter>;
};

export type PodMarketplaceDailySnapshot = {
  __typename?: 'PodMarketplaceDailySnapshot';
  /** Point in time current amount of total pods listed */
  availableListedPods: Scalars['BigInt']['output'];
  /** Current amount of total beans in pod orders */
  availableOrderBeans: Scalars['BigInt']['output'];
  /** Point in time current cumulative bean volume between listings and orders */
  beanVolume: Scalars['BigInt']['output'];
  /** Point in time current cumulative pod listings that were cancelled */
  cancelledListedPods: Scalars['BigInt']['output'];
  /** Current cumulative beans in pod orders cancelled */
  cancelledOrderBeans: Scalars['BigInt']['output'];
  /** Timestamp of initial snapshot creation */
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
  /** Point in time current cumulative pod listings that expired */
  expiredListedPods: Scalars['BigInt']['output'];
  /** Point in time current cumulative pod listings filled */
  filledListedPods: Scalars['BigInt']['output'];
  /** Current cumulative filled beans in pod orders */
  filledOrderBeans: Scalars['BigInt']['output'];
  /** Current cumulative pod orders filled */
  filledOrderedPods: Scalars['BigInt']['output'];
  /** Marketplace ID - Day */
  id: Scalars['ID']['output'];
  /** Point in time current cumulative pods listed for sale */
  listedPods: Scalars['BigInt']['output'];
  /** Current cumulative beans in pod orders created */
  orderBeans: Scalars['BigInt']['output'];
  /** Marketplace associated with snapshot */
  podMarketplace: PodMarketplace;
  /** Point in time current cumulative pod volume between listings and orders */
  podVolume: Scalars['BigInt']['output'];
  /** Point in time latest season */
  season: Scalars['Int']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type PodMarketplaceDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PodMarketplaceDailySnapshot_Filter>>>;
  availableListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanVolume?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaExpiredListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaExpiredListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiredListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiredListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderedPods?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  listedPods?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  listedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodMarketplaceDailySnapshot_Filter>>>;
  orderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  orderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplace_Filter>;
  podMarketplace_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_lt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_lte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podVolume?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PodMarketplaceDailySnapshot_OrderBy {
  AvailableListedPods = 'availableListedPods',
  AvailableOrderBeans = 'availableOrderBeans',
  BeanVolume = 'beanVolume',
  CancelledListedPods = 'cancelledListedPods',
  CancelledOrderBeans = 'cancelledOrderBeans',
  CreatedAt = 'createdAt',
  DeltaAvailableListedPods = 'deltaAvailableListedPods',
  DeltaAvailableOrderBeans = 'deltaAvailableOrderBeans',
  DeltaBeanVolume = 'deltaBeanVolume',
  DeltaCancelledListedPods = 'deltaCancelledListedPods',
  DeltaCancelledOrderBeans = 'deltaCancelledOrderBeans',
  DeltaExpiredListedPods = 'deltaExpiredListedPods',
  DeltaFilledListedPods = 'deltaFilledListedPods',
  DeltaFilledOrderBeans = 'deltaFilledOrderBeans',
  DeltaFilledOrderedPods = 'deltaFilledOrderedPods',
  DeltaListedPods = 'deltaListedPods',
  DeltaOrderBeans = 'deltaOrderBeans',
  DeltaPodVolume = 'deltaPodVolume',
  ExpiredListedPods = 'expiredListedPods',
  FilledListedPods = 'filledListedPods',
  FilledOrderBeans = 'filledOrderBeans',
  FilledOrderedPods = 'filledOrderedPods',
  Id = 'id',
  ListedPods = 'listedPods',
  OrderBeans = 'orderBeans',
  PodMarketplace = 'podMarketplace',
  PodMarketplaceAvailableListedPods = 'podMarketplace__availableListedPods',
  PodMarketplaceAvailableOrderBeans = 'podMarketplace__availableOrderBeans',
  PodMarketplaceBeanVolume = 'podMarketplace__beanVolume',
  PodMarketplaceCancelledListedPods = 'podMarketplace__cancelledListedPods',
  PodMarketplaceCancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  PodMarketplaceExpiredListedPods = 'podMarketplace__expiredListedPods',
  PodMarketplaceFilledListedPods = 'podMarketplace__filledListedPods',
  PodMarketplaceFilledOrderBeans = 'podMarketplace__filledOrderBeans',
  PodMarketplaceFilledOrderedPods = 'podMarketplace__filledOrderedPods',
  PodMarketplaceId = 'podMarketplace__id',
  PodMarketplaceLastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  PodMarketplaceLastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  PodMarketplaceListedPods = 'podMarketplace__listedPods',
  PodMarketplaceOrderBeans = 'podMarketplace__orderBeans',
  PodMarketplacePodVolume = 'podMarketplace__podVolume',
  PodMarketplaceSeason = 'podMarketplace__season',
  PodVolume = 'podVolume',
  Season = 'season',
  UpdatedAt = 'updatedAt'
}

export type PodMarketplaceHourlySnapshot = {
  __typename?: 'PodMarketplaceHourlySnapshot';
  /** Point in time current amount of total pods listed */
  availableListedPods: Scalars['BigInt']['output'];
  /** Current amount of total beans in pod orders */
  availableOrderBeans: Scalars['BigInt']['output'];
  /** Point in time current cumulative bean volume between listings and orders */
  beanVolume: Scalars['BigInt']['output'];
  /** Point in time current cumulative pod listings that were cancelled */
  cancelledListedPods: Scalars['BigInt']['output'];
  /** Current cumulative beans in pod orders cancelled */
  cancelledOrderBeans: Scalars['BigInt']['output'];
  /** Timestamp of initial snapshot creation */
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
  /** Point in time current cumulative pod listings that expired */
  expiredListedPods: Scalars['BigInt']['output'];
  /** Point in time current cumulative pod listings filled */
  filledListedPods: Scalars['BigInt']['output'];
  /** Current cumulative filled beans in pod orders */
  filledOrderBeans: Scalars['BigInt']['output'];
  /** Current cumulative pod orders filled */
  filledOrderedPods: Scalars['BigInt']['output'];
  /** Marketplace ID - Season */
  id: Scalars['ID']['output'];
  /** Point in time current cumulative pods listed for sale */
  listedPods: Scalars['BigInt']['output'];
  /** Current cumulative beans in pod orders created */
  orderBeans: Scalars['BigInt']['output'];
  /** Marketplace associated with snapshot */
  podMarketplace: PodMarketplace;
  /** Point in time current cumulative pod volume between listings and orders */
  podVolume: Scalars['BigInt']['output'];
  /** Point in time latest season */
  season: Scalars['Int']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type PodMarketplaceHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PodMarketplaceHourlySnapshot_Filter>>>;
  availableListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanVolume?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvailableOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvailableOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCancelledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaCancelledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaExpiredListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaExpiredListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaExpiredListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFilledOrderedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFilledOrderedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiredListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiredListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderedPods?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  listedPods?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  listedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodMarketplaceHourlySnapshot_Filter>>>;
  orderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  orderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplace_Filter>;
  podMarketplace_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_lt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_lte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podVolume?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PodMarketplaceHourlySnapshot_OrderBy {
  AvailableListedPods = 'availableListedPods',
  AvailableOrderBeans = 'availableOrderBeans',
  BeanVolume = 'beanVolume',
  CancelledListedPods = 'cancelledListedPods',
  CancelledOrderBeans = 'cancelledOrderBeans',
  CreatedAt = 'createdAt',
  DeltaAvailableListedPods = 'deltaAvailableListedPods',
  DeltaAvailableOrderBeans = 'deltaAvailableOrderBeans',
  DeltaBeanVolume = 'deltaBeanVolume',
  DeltaCancelledListedPods = 'deltaCancelledListedPods',
  DeltaCancelledOrderBeans = 'deltaCancelledOrderBeans',
  DeltaExpiredListedPods = 'deltaExpiredListedPods',
  DeltaFilledListedPods = 'deltaFilledListedPods',
  DeltaFilledOrderBeans = 'deltaFilledOrderBeans',
  DeltaFilledOrderedPods = 'deltaFilledOrderedPods',
  DeltaListedPods = 'deltaListedPods',
  DeltaOrderBeans = 'deltaOrderBeans',
  DeltaPodVolume = 'deltaPodVolume',
  ExpiredListedPods = 'expiredListedPods',
  FilledListedPods = 'filledListedPods',
  FilledOrderBeans = 'filledOrderBeans',
  FilledOrderedPods = 'filledOrderedPods',
  Id = 'id',
  ListedPods = 'listedPods',
  OrderBeans = 'orderBeans',
  PodMarketplace = 'podMarketplace',
  PodMarketplaceAvailableListedPods = 'podMarketplace__availableListedPods',
  PodMarketplaceAvailableOrderBeans = 'podMarketplace__availableOrderBeans',
  PodMarketplaceBeanVolume = 'podMarketplace__beanVolume',
  PodMarketplaceCancelledListedPods = 'podMarketplace__cancelledListedPods',
  PodMarketplaceCancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  PodMarketplaceExpiredListedPods = 'podMarketplace__expiredListedPods',
  PodMarketplaceFilledListedPods = 'podMarketplace__filledListedPods',
  PodMarketplaceFilledOrderBeans = 'podMarketplace__filledOrderBeans',
  PodMarketplaceFilledOrderedPods = 'podMarketplace__filledOrderedPods',
  PodMarketplaceId = 'podMarketplace__id',
  PodMarketplaceLastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  PodMarketplaceLastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  PodMarketplaceListedPods = 'podMarketplace__listedPods',
  PodMarketplaceOrderBeans = 'podMarketplace__orderBeans',
  PodMarketplacePodVolume = 'podMarketplace__podVolume',
  PodMarketplaceSeason = 'podMarketplace__season',
  PodVolume = 'podVolume',
  Season = 'season',
  UpdatedAt = 'updatedAt'
}

export type PodMarketplace_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeListings?: InputMaybe<Array<Scalars['String']['input']>>;
  activeListings_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  activeListings_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  activeListings_not?: InputMaybe<Array<Scalars['String']['input']>>;
  activeListings_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  activeListings_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  activeOrders?: InputMaybe<Array<Scalars['String']['input']>>;
  activeOrders_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  activeOrders_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  activeOrders_not?: InputMaybe<Array<Scalars['String']['input']>>;
  activeOrders_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  activeOrders_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  allListings_?: InputMaybe<PodListing_Filter>;
  allOrders_?: InputMaybe<PodOrder_Filter>;
  and?: InputMaybe<Array<InputMaybe<PodMarketplace_Filter>>>;
  availableListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  availableOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  availableOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanVolume?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailySnapshots_?: InputMaybe<PodMarketplaceDailySnapshot_Filter>;
  expiredListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiredListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiredListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledListedPods?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledListedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledListedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderedPods?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  filledOrderedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  filledOrderedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fills_?: InputMaybe<PodFill_Filter>;
  hourlySnapshots_?: InputMaybe<PodMarketplaceHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  listedPods?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  listedPods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_not?: InputMaybe<Scalars['BigInt']['input']>;
  listedPods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodMarketplace_Filter>>>;
  orderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  orderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podVolume?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  podVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum PodMarketplace_OrderBy {
  ActiveListings = 'activeListings',
  ActiveOrders = 'activeOrders',
  AllListings = 'allListings',
  AllOrders = 'allOrders',
  AvailableListedPods = 'availableListedPods',
  AvailableOrderBeans = 'availableOrderBeans',
  BeanVolume = 'beanVolume',
  CancelledListedPods = 'cancelledListedPods',
  CancelledOrderBeans = 'cancelledOrderBeans',
  DailySnapshots = 'dailySnapshots',
  ExpiredListedPods = 'expiredListedPods',
  FilledListedPods = 'filledListedPods',
  FilledOrderBeans = 'filledOrderBeans',
  FilledOrderedPods = 'filledOrderedPods',
  Fills = 'fills',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  ListedPods = 'listedPods',
  OrderBeans = 'orderBeans',
  PodVolume = 'podVolume',
  Season = 'season'
}

export type PodOrder = {
  __typename?: 'PodOrder';
  /**
   * The original number of Beans locked in the PodOrder.
   *
   * Does NOT change as Fills occur.
   * Always deterministic, since the Farmer must lock Beans for PodOrder fulfillment.
   *
   * If FIXED (V1): `amount * pricePerPod` fields emitted in PodOrderCreated.
   * If FIXED (V2): `amount` field emitted in PodOrderCreated.
   * If DYNAMIC (V2): `amount` field emitted in PodOrderCreated.
   *
   */
  beanAmount: Scalars['BigInt']['output'];
  /**
   * The current number of Beans spent to acquire Pods.
   *
   * Increases during each subsequent Fill:
   * `0 <= beanAmountFilled <= beanAmount`
   *
   * Upon PodOrder cancellation, this value is locked.
   *
   */
  beanAmountFilled: Scalars['BigInt']['output'];
  /** Timestamp of PodOrder creation. */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash when this PodOrder entity was created. */
  creationHash: Scalars['Bytes']['output'];
  /** The Farmer that created the Pod Order. */
  farmer: Farmer;
  /** All Fills associated with this PodOrder. */
  fills: Array<PodFill>;
  /**
   * Historical ID for joins: `{account}-{createdAt}`
   *
   */
  historyID: Scalars['String']['output'];
  /**
   * The PodOrder ID matchces the `id` stored on-chain:
   *
   * `keccak256(abi.encodePacked(account, pricePerPod, maxPlaceInLine, minFillAmount))`
   *
   */
  id: Scalars['ID']['output'];
  /**
   * The Farmer is willing to buy any Pod that is before maxPlaceInLine at pricePerPod.
   * As the Pod Line moves, this value stays the same because new Pods meet the criteria.
   *
   */
  maxPlaceInLine: Scalars['BigInt']['output'];
  /** Minimum number of Pods required to perform a Fill. */
  minFillAmount: Scalars['BigInt']['output'];
  /**
   * The current number of Pods that have been purchased by this PodOrder.
   *
   * Increases during each subsequent Fill.
   * If pricingType = FIXED: `0 <= podAmountFilled <= podAmount`
   * If pricingType = DYNAMIC: No constraint, since `podAmount` is unknown.
   *
   * Upon PodOrder cancellation, this value is locked.
   *
   */
  podAmountFilled: Scalars['BigInt']['output'];
  /** Marketplace used for Pod Order. */
  podMarketplace: PodMarketplace;
  /**
   * [V1] The FIXED price per Pod denominated in Beans.
   *
   * Ex. `pricePerPod = 10000` indicates a price of 0.01 Beans per Pod.
   *
   * If `pricingType = 1`, this field is initialized to `0` and should be ignored.
   *
   */
  pricePerPod: Scalars['Int']['output'];
  /**
   * [V2] The FIXED or DYNAMIC pricing function, encoded as bytes.
   *
   * This must be decoded client-side, see `LibPolynomial.sol` for more info.
   *
   * null    = V1 FIXED    = use `pricePerPod`
   * "0x"    = V2 FIXED    = use `pricePerPod`
   * "0x..." = V2 DYNAMIC  = use `pricingFunction`
   *
   */
  pricingFunction?: Maybe<Scalars['Bytes']['output']>;
  /**
   * The Pricing Type states whether this PodOrder uses FIXED or DYNAMIC pricing.
   *
   * null = V1 FIXED  = use `pricePerPod`
   * 0    = V2 FIXED  = use `pricePerPod`
   * 1    = V2 DYNAMIC = use `pricingFunction`
   *
   */
  pricingType?: Maybe<Scalars['Int']['output']>;
  /** Current status of order. */
  status: MarketStatus;
  /** Timestamp of last PodOrder update. Changes when a PodOrder is Filled or Cancelled. */
  updatedAt: Scalars['BigInt']['output'];
};


export type PodOrderFillsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFill_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodFill_Filter>;
};

export type PodOrderCancelled = MarketplaceEvent & {
  __typename?: 'PodOrderCancelled';
  /** Account cancelling listing */
  account: Scalars['Bytes']['output'];
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Timestamp of this event */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /** podOrderCancelled-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Event log index. For transactions that don't emit event, create arbitrary index starting from 0 */
  logIndex: Scalars['Int']['output'];
  /** ID of order cancelled */
  orderId: Scalars['String']['output'];
};

export type PodOrderCancelled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['Bytes']['input']>;
  account_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_gt?: InputMaybe<Scalars['Bytes']['input']>;
  account_gte?: InputMaybe<Scalars['Bytes']['input']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  account_lt?: InputMaybe<Scalars['Bytes']['input']>;
  account_lte?: InputMaybe<Scalars['Bytes']['input']>;
  account_not?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodOrderCancelled_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodOrderCancelled_Filter>>>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  orderId_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_gt?: InputMaybe<Scalars['String']['input']>;
  orderId_gte?: InputMaybe<Scalars['String']['input']>;
  orderId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  orderId_lt?: InputMaybe<Scalars['String']['input']>;
  orderId_lte?: InputMaybe<Scalars['String']['input']>;
  orderId_not?: InputMaybe<Scalars['String']['input']>;
  orderId_not_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  orderId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum PodOrderCancelled_OrderBy {
  Account = 'account',
  BlockNumber = 'blockNumber',
  CreatedAt = 'createdAt',
  Hash = 'hash',
  HistoryId = 'historyID',
  Id = 'id',
  LogIndex = 'logIndex',
  OrderId = 'orderId'
}

export type PodOrderCreated = MarketplaceEvent & {
  __typename?: 'PodOrderCreated';
  /** Account creating the listing */
  account: Scalars['Bytes']['output'];
  /**
   * The represented value emitted with this event changed with BIP-29 at block 15277986
   * Pre  BIP-29: The number of pods ordered is emitted
   * Post BIP-29: The number of beans supplied for the order is emitted.
   *
   */
  amount: Scalars['BigInt']['output'];
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Timestamp of this event */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /** podOrderCreated-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Event log index. For transactions that don't emit event, create arbitrary index starting from 0 */
  logIndex: Scalars['Int']['output'];
  /** Max place in line */
  maxPlaceInLine: Scalars['BigInt']['output'];
  /** ID of the pod order */
  orderId: Scalars['String']['output'];
  /** Price per pod */
  pricePerPod: Scalars['Int']['output'];
  /** Pricing Function Data */
  pricingFunction?: Maybe<Scalars['Bytes']['output']>;
  /** Pricing Type */
  pricingType?: Maybe<Scalars['Int']['output']>;
};

export type PodOrderCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['Bytes']['input']>;
  account_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_gt?: InputMaybe<Scalars['Bytes']['input']>;
  account_gte?: InputMaybe<Scalars['Bytes']['input']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  account_lt?: InputMaybe<Scalars['Bytes']['input']>;
  account_lte?: InputMaybe<Scalars['Bytes']['input']>;
  account_not?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodOrderCreated_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxPlaceInLine?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxPlaceInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodOrderCreated_Filter>>>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  orderId_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_gt?: InputMaybe<Scalars['String']['input']>;
  orderId_gte?: InputMaybe<Scalars['String']['input']>;
  orderId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  orderId_lt?: InputMaybe<Scalars['String']['input']>;
  orderId_lte?: InputMaybe<Scalars['String']['input']>;
  orderId_not?: InputMaybe<Scalars['String']['input']>;
  orderId_not_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  orderId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  orderId_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pricePerPod?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricePerPod_lt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_lte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingFunction?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingFunction_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingType?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingType_lt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_lte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum PodOrderCreated_OrderBy {
  Account = 'account',
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  CreatedAt = 'createdAt',
  Hash = 'hash',
  HistoryId = 'historyID',
  Id = 'id',
  LogIndex = 'logIndex',
  MaxPlaceInLine = 'maxPlaceInLine',
  OrderId = 'orderId',
  PricePerPod = 'pricePerPod',
  PricingFunction = 'pricingFunction',
  PricingType = 'pricingType'
}

export type PodOrderFilled = MarketplaceEvent & {
  __typename?: 'PodOrderFilled';
  /** Number of pods transferred */
  amount: Scalars['BigInt']['output'];
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Beans paid to fill the order */
  costInBeans?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of this event */
  createdAt: Scalars['BigInt']['output'];
  /** Account selling pods */
  fromFarmer: Scalars['Bytes']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /** podOrderFilled-{ Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /** Index of the plot transferred */
  index: Scalars['BigInt']['output'];
  /** Event log index. For transactions that don't emit event, create arbitrary index starting from 0 */
  logIndex: Scalars['Int']['output'];
  /** Where these pods were in line when filled */
  placeInLine: Scalars['BigInt']['output'];
  /** Start of the plot transferred */
  start: Scalars['BigInt']['output'];
  /** Account buying pods */
  toFarmer: Scalars['Bytes']['output'];
};

export type PodOrderFilled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PodOrderFilled_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  costInBeans?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  costInBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  costInBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fromFarmer?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  fromFarmer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fromFarmer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['BigInt']['input']>;
  index_gt?: InputMaybe<Scalars['BigInt']['input']>;
  index_gte?: InputMaybe<Scalars['BigInt']['input']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  index_lt?: InputMaybe<Scalars['BigInt']['input']>;
  index_lte?: InputMaybe<Scalars['BigInt']['input']>;
  index_not?: InputMaybe<Scalars['BigInt']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodOrderFilled_Filter>>>;
  placeInLine?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  placeInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start?: InputMaybe<Scalars['BigInt']['input']>;
  start_gt?: InputMaybe<Scalars['BigInt']['input']>;
  start_gte?: InputMaybe<Scalars['BigInt']['input']>;
  start_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  start_lt?: InputMaybe<Scalars['BigInt']['input']>;
  start_lte?: InputMaybe<Scalars['BigInt']['input']>;
  start_not?: InputMaybe<Scalars['BigInt']['input']>;
  start_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  toFarmer?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  toFarmer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_not?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  toFarmer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum PodOrderFilled_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  CostInBeans = 'costInBeans',
  CreatedAt = 'createdAt',
  FromFarmer = 'fromFarmer',
  Hash = 'hash',
  HistoryId = 'historyID',
  Id = 'id',
  Index = 'index',
  LogIndex = 'logIndex',
  PlaceInLine = 'placeInLine',
  Start = 'start',
  ToFarmer = 'toFarmer'
}

export type PodOrder_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PodOrder_Filter>>>;
  beanAmount?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmountFilled?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmountFilled_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmountFilled_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmountFilled_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanAmountFilled_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmountFilled_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmountFilled_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmountFilled_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationHash?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  creationHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  creationHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fills?: InputMaybe<Array<Scalars['String']['input']>>;
  fills_?: InputMaybe<PodFill_Filter>;
  fills_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  fills_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  fills_not?: InputMaybe<Array<Scalars['String']['input']>>;
  fills_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  fills_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID?: InputMaybe<Scalars['String']['input']>;
  historyID_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_gt?: InputMaybe<Scalars['String']['input']>;
  historyID_gte?: InputMaybe<Scalars['String']['input']>;
  historyID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_lt?: InputMaybe<Scalars['String']['input']>;
  historyID_lte?: InputMaybe<Scalars['String']['input']>;
  historyID_not?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains?: InputMaybe<Scalars['String']['input']>;
  historyID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  historyID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with?: InputMaybe<Scalars['String']['input']>;
  historyID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maxPlaceInLine?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxPlaceInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxPlaceInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minFillAmount?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minFillAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  minFillAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PodOrder_Filter>>>;
  podAmountFilled?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podAmountFilled_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_not?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplace_Filter>;
  podMarketplace_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_gte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_lt?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_lte?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  podMarketplace_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pricePerPod?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_gte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricePerPod_lt?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_lte?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not?: InputMaybe<Scalars['Int']['input']>;
  pricePerPod_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingFunction?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingFunction_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingFunction_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingType?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_gte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricingType_lt?: InputMaybe<Scalars['Int']['input']>;
  pricingType_lte?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not?: InputMaybe<Scalars['Int']['input']>;
  pricingType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  status?: InputMaybe<MarketStatus>;
  status_in?: InputMaybe<Array<MarketStatus>>;
  status_not?: InputMaybe<MarketStatus>;
  status_not_in?: InputMaybe<Array<MarketStatus>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PodOrder_OrderBy {
  BeanAmount = 'beanAmount',
  BeanAmountFilled = 'beanAmountFilled',
  CreatedAt = 'createdAt',
  CreationHash = 'creationHash',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  Fills = 'fills',
  HistoryId = 'historyID',
  Id = 'id',
  MaxPlaceInLine = 'maxPlaceInLine',
  MinFillAmount = 'minFillAmount',
  PodAmountFilled = 'podAmountFilled',
  PodMarketplace = 'podMarketplace',
  PodMarketplaceAvailableListedPods = 'podMarketplace__availableListedPods',
  PodMarketplaceAvailableOrderBeans = 'podMarketplace__availableOrderBeans',
  PodMarketplaceBeanVolume = 'podMarketplace__beanVolume',
  PodMarketplaceCancelledListedPods = 'podMarketplace__cancelledListedPods',
  PodMarketplaceCancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  PodMarketplaceExpiredListedPods = 'podMarketplace__expiredListedPods',
  PodMarketplaceFilledListedPods = 'podMarketplace__filledListedPods',
  PodMarketplaceFilledOrderBeans = 'podMarketplace__filledOrderBeans',
  PodMarketplaceFilledOrderedPods = 'podMarketplace__filledOrderedPods',
  PodMarketplaceId = 'podMarketplace__id',
  PodMarketplaceLastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  PodMarketplaceLastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  PodMarketplaceListedPods = 'podMarketplace__listedPods',
  PodMarketplaceOrderBeans = 'podMarketplace__orderBeans',
  PodMarketplacePodVolume = 'podMarketplace__podVolume',
  PodMarketplaceSeason = 'podMarketplace__season',
  PricePerPod = 'pricePerPod',
  PricingFunction = 'pricingFunction',
  PricingType = 'pricingType',
  Status = 'status',
  UpdatedAt = 'updatedAt'
}

export type Pool = {
  __typename?: 'Pool';
  /** The Bean token that is in this pool */
  bean: Bean;
  crossEvents: Array<PoolCross>;
  crosses: Scalars['Int']['output'];
  dailySnapshot: Array<PoolDailySnapshot>;
  /** Instantaneous deltaB */
  deltaBeans: Scalars['BigInt']['output'];
  hourlySnapshot: Array<PoolHourlySnapshot>;
  id: Scalars['Bytes']['output'];
  /** Last timestamp a cross was seen for this pool */
  lastCross: Scalars['BigInt']['output'];
  lastPrice: Scalars['BigDecimal']['output'];
  lastSeason: Scalars['Int']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  reserves: Array<Scalars['BigInt']['output']>;
  /** All tokens in this pool */
  tokens: Array<Token>;
  volume: Scalars['BigInt']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type PoolCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolCross_Filter>;
};


export type PoolDailySnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolDailySnapshot_Filter>;
};


export type PoolHourlySnapshotArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolHourlySnapshot_Filter>;
};


export type PoolTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};

export type PoolCross = {
  __typename?: 'PoolCross';
  above: Scalars['Boolean']['output'];
  blockNumber: Scalars['BigInt']['output'];
  dailySnapshot: PoolDailySnapshot;
  hourlySnapshot: PoolHourlySnapshot;
  id: Scalars['ID']['output'];
  pool: Pool;
  price: Scalars['BigDecimal']['output'];
  timeSinceLastCross: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
};

export type PoolCross_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  above?: InputMaybe<Scalars['Boolean']['input']>;
  above_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  above_not?: InputMaybe<Scalars['Boolean']['input']>;
  above_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PoolCross_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailySnapshot?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_?: InputMaybe<PoolDailySnapshot_Filter>;
  dailySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dailySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dailySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  dailySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_?: InputMaybe<PoolHourlySnapshot_Filter>;
  hourlySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  hourlySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolCross_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timeSinceLastCross?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timeSinceLastCross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_not?: InputMaybe<Scalars['BigInt']['input']>;
  timeSinceLastCross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PoolCross_OrderBy {
  Above = 'above',
  BlockNumber = 'blockNumber',
  DailySnapshot = 'dailySnapshot',
  DailySnapshotCreatedAt = 'dailySnapshot__createdAt',
  DailySnapshotCrosses = 'dailySnapshot__crosses',
  DailySnapshotDeltaBeans = 'dailySnapshot__deltaBeans',
  DailySnapshotDeltaCrosses = 'dailySnapshot__deltaCrosses',
  DailySnapshotDeltaLiquidityUsd = 'dailySnapshot__deltaLiquidityUSD',
  DailySnapshotDeltaVolume = 'dailySnapshot__deltaVolume',
  DailySnapshotDeltaVolumeUsd = 'dailySnapshot__deltaVolumeUSD',
  DailySnapshotId = 'dailySnapshot__id',
  DailySnapshotLastPrice = 'dailySnapshot__lastPrice',
  DailySnapshotLiquidityUsd = 'dailySnapshot__liquidityUSD',
  DailySnapshotSeason = 'dailySnapshot__season',
  DailySnapshotTwaDeltaBeans = 'dailySnapshot__twaDeltaBeans',
  DailySnapshotTwaPrice = 'dailySnapshot__twaPrice',
  DailySnapshotTwaToken2Price = 'dailySnapshot__twaToken2Price',
  DailySnapshotUpdatedAt = 'dailySnapshot__updatedAt',
  DailySnapshotUtilization = 'dailySnapshot__utilization',
  DailySnapshotVolume = 'dailySnapshot__volume',
  DailySnapshotVolumeUsd = 'dailySnapshot__volumeUSD',
  HourlySnapshot = 'hourlySnapshot',
  HourlySnapshotCreatedAt = 'hourlySnapshot__createdAt',
  HourlySnapshotCrosses = 'hourlySnapshot__crosses',
  HourlySnapshotDeltaBeans = 'hourlySnapshot__deltaBeans',
  HourlySnapshotDeltaCrosses = 'hourlySnapshot__deltaCrosses',
  HourlySnapshotDeltaLiquidityUsd = 'hourlySnapshot__deltaLiquidityUSD',
  HourlySnapshotDeltaVolume = 'hourlySnapshot__deltaVolume',
  HourlySnapshotDeltaVolumeUsd = 'hourlySnapshot__deltaVolumeUSD',
  HourlySnapshotId = 'hourlySnapshot__id',
  HourlySnapshotLastPrice = 'hourlySnapshot__lastPrice',
  HourlySnapshotLiquidityUsd = 'hourlySnapshot__liquidityUSD',
  HourlySnapshotSeason = 'hourlySnapshot__season',
  HourlySnapshotTwaDeltaBeans = 'hourlySnapshot__twaDeltaBeans',
  HourlySnapshotTwaPrice = 'hourlySnapshot__twaPrice',
  HourlySnapshotTwaToken2Price = 'hourlySnapshot__twaToken2Price',
  HourlySnapshotUpdatedAt = 'hourlySnapshot__updatedAt',
  HourlySnapshotUtilization = 'hourlySnapshot__utilization',
  HourlySnapshotVolume = 'hourlySnapshot__volume',
  HourlySnapshotVolumeUsd = 'hourlySnapshot__volumeUSD',
  Id = 'id',
  Pool = 'pool',
  PoolCrosses = 'pool__crosses',
  PoolDeltaBeans = 'pool__deltaBeans',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastSeason = 'pool__lastSeason',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  Price = 'price',
  TimeSinceLastCross = 'timeSinceLastCross',
  Timestamp = 'timestamp'
}

export type PoolDailySnapshot = {
  __typename?: 'PoolDailySnapshot';
  createdAt: Scalars['BigInt']['output'];
  crossEvents: Array<PoolCross>;
  crosses: Scalars['Int']['output'];
  /** Instantaneous deltaB */
  deltaBeans: Scalars['BigInt']['output'];
  deltaCrosses: Scalars['Int']['output'];
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  deltaReserves: Array<Scalars['BigInt']['output']>;
  deltaVolume: Scalars['BigInt']['output'];
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  lastPrice: Scalars['BigDecimal']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  pool: Pool;
  reserves: Array<Scalars['BigInt']['output']>;
  season: Scalars['Int']['output'];
  /** Time-Weighted deltaB over the previous season */
  twaDeltaBeans: Scalars['BigInt']['output'];
  /** Time-Weighted price over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  /** Time-Weighted price of the other token in the pool over the previous season, if applicable */
  twaToken2Price?: Maybe<Scalars['BigDecimal']['output']>;
  updatedAt: Scalars['BigInt']['output'];
  utilization: Scalars['BigDecimal']['output'];
  volume: Scalars['BigInt']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type PoolDailySnapshotCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolCross_Filter>;
};

export type PoolDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolDailySnapshot_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<PoolCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCrosses?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaCrosses_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolDailySnapshot_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  twaDeltaBeans?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaDeltaBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaToken2Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaToken2Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  utilization?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  utilization_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume?: InputMaybe<Scalars['BigInt']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PoolDailySnapshot_OrderBy {
  CreatedAt = 'createdAt',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DeltaBeans = 'deltaBeans',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaReserves = 'deltaReserves',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  LastPrice = 'lastPrice',
  LiquidityUsd = 'liquidityUSD',
  Pool = 'pool',
  PoolCrosses = 'pool__crosses',
  PoolDeltaBeans = 'pool__deltaBeans',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastSeason = 'pool__lastSeason',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  Reserves = 'reserves',
  Season = 'season',
  TwaDeltaBeans = 'twaDeltaBeans',
  TwaPrice = 'twaPrice',
  TwaToken2Price = 'twaToken2Price',
  UpdatedAt = 'updatedAt',
  Utilization = 'utilization',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type PoolHourlySnapshot = {
  __typename?: 'PoolHourlySnapshot';
  createdAt: Scalars['BigInt']['output'];
  crossEvents: Array<PoolCross>;
  crosses: Scalars['Int']['output'];
  /** Instantaneous deltaB */
  deltaBeans: Scalars['BigInt']['output'];
  deltaCrosses: Scalars['Int']['output'];
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  deltaReserves: Array<Scalars['BigInt']['output']>;
  deltaVolume: Scalars['BigInt']['output'];
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  lastPrice: Scalars['BigDecimal']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  pool: Pool;
  reserves: Array<Scalars['BigInt']['output']>;
  season: Scalars['Int']['output'];
  /** Time-Weighted deltaB over the previous season */
  twaDeltaBeans: Scalars['BigInt']['output'];
  /** Time-Weighted bean price over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  /** Time-Weighted price of the other token in the pool over the previous season, if applicable */
  twaToken2Price?: Maybe<Scalars['BigDecimal']['output']>;
  updatedAt: Scalars['BigInt']['output'];
  utilization: Scalars['BigDecimal']['output'];
  volume: Scalars['BigInt']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type PoolHourlySnapshotCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolCross_Filter>;
};

export type PoolHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolHourlySnapshot_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<PoolCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaCrosses?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaCrosses_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not?: InputMaybe<Scalars['Int']['input']>;
  deltaCrosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaVolume?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaVolume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaVolume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaVolume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolHourlySnapshot_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  twaDeltaBeans?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaDeltaBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  twaDeltaBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaToken2Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaToken2Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  utilization?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  utilization_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  utilization_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume?: InputMaybe<Scalars['BigInt']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PoolHourlySnapshot_OrderBy {
  CreatedAt = 'createdAt',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DeltaBeans = 'deltaBeans',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaReserves = 'deltaReserves',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  LastPrice = 'lastPrice',
  LiquidityUsd = 'liquidityUSD',
  Pool = 'pool',
  PoolCrosses = 'pool__crosses',
  PoolDeltaBeans = 'pool__deltaBeans',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastSeason = 'pool__lastSeason',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  Reserves = 'reserves',
  Season = 'season',
  TwaDeltaBeans = 'twaDeltaBeans',
  TwaPrice = 'twaPrice',
  TwaToken2Price = 'twaToken2Price',
  UpdatedAt = 'updatedAt',
  Utilization = 'utilization',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  bean_?: InputMaybe<Bean_Filter>;
  bean_contains?: InputMaybe<Scalars['String']['input']>;
  bean_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_gt?: InputMaybe<Scalars['String']['input']>;
  bean_gte?: InputMaybe<Scalars['String']['input']>;
  bean_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_lt?: InputMaybe<Scalars['String']['input']>;
  bean_lte?: InputMaybe<Scalars['String']['input']>;
  bean_not?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains?: InputMaybe<Scalars['String']['input']>;
  bean_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bean_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with?: InputMaybe<Scalars['String']['input']>;
  bean_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  crossEvents_?: InputMaybe<PoolCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailySnapshot_?: InputMaybe<PoolDailySnapshot_Filter>;
  deltaBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlySnapshot_?: InputMaybe<PoolHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastCross?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastCross_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastCross_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastSeason?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  reserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_?: InputMaybe<Token_Filter>;
  tokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  volume?: InputMaybe<Scalars['BigInt']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_gte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigInt']['input']>;
  volume_lte?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not?: InputMaybe<Scalars['BigInt']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Pool_OrderBy {
  Bean = 'bean',
  BeanBeanstalk = 'bean__beanstalk',
  BeanChain = 'bean__chain',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastSeason = 'bean__lastSeason',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanMarketCap = 'bean__marketCap',
  BeanPrice = 'bean__price',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DailySnapshot = 'dailySnapshot',
  DeltaBeans = 'deltaBeans',
  HourlySnapshot = 'hourlySnapshot',
  Id = 'id',
  LastCross = 'lastCross',
  LastPrice = 'lastPrice',
  LastSeason = 'lastSeason',
  LiquidityUsd = 'liquidityUSD',
  Reserves = 'reserves',
  Tokens = 'tokens',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type PrevFarmerGerminatingEvent = {
  __typename?: 'PrevFarmerGerminatingEvent';
  /** The value for `deltaGerminatingStalk` from this previous `FarmerGerminatingStalkBalanceChanged` event. */
  deltaGerminatingStalk: Scalars['BigInt']['output'];
  /** The `block.number` of the `FarmerGerminatingStalkBalanceChanged` event */
  eventBlock: Scalars['BigInt']['output'];
  /** Farmer address */
  id: Scalars['Bytes']['output'];
  /** The `logIndex` of the `FarmerGerminatingStalkBalanceChanged` event */
  logIndex: Scalars['BigInt']['output'];
};

export type PrevFarmerGerminatingEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PrevFarmerGerminatingEvent_Filter>>>;
  deltaGerminatingStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGerminatingStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eventBlock?: InputMaybe<Scalars['BigInt']['input']>;
  eventBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  eventBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  eventBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eventBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  eventBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  eventBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  eventBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PrevFarmerGerminatingEvent_Filter>>>;
};

export enum PrevFarmerGerminatingEvent_OrderBy {
  DeltaGerminatingStalk = 'deltaGerminatingStalk',
  EventBlock = 'eventBlock',
  Id = 'id',
  LogIndex = 'logIndex'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bean?: Maybe<Bean>;
  beanCross?: Maybe<BeanCross>;
  beanCrosses: Array<BeanCross>;
  beanDailySnapshot?: Maybe<BeanDailySnapshot>;
  beanDailySnapshots: Array<BeanDailySnapshot>;
  beanHourlySnapshot?: Maybe<BeanHourlySnapshot>;
  beanHourlySnapshots: Array<BeanHourlySnapshot>;
  beans: Array<Bean>;
  beanstalk?: Maybe<Beanstalk>;
  beanstalks: Array<Beanstalk>;
  chop?: Maybe<Chop>;
  chops: Array<Chop>;
  farmer?: Maybe<Farmer>;
  farmers: Array<Farmer>;
  fertilizer?: Maybe<Fertilizer>;
  fertilizerBalance?: Maybe<FertilizerBalance>;
  fertilizerBalances: Array<FertilizerBalance>;
  fertilizerToken?: Maybe<FertilizerToken>;
  fertilizerTokens: Array<FertilizerToken>;
  fertilizerYield?: Maybe<FertilizerYield>;
  fertilizerYields: Array<FertilizerYield>;
  fertilizers: Array<Fertilizer>;
  field?: Maybe<Field>;
  fieldDailySnapshot?: Maybe<FieldDailySnapshot>;
  fieldDailySnapshots: Array<FieldDailySnapshot>;
  fieldHourlySnapshot?: Maybe<FieldHourlySnapshot>;
  fieldHourlySnapshots: Array<FieldHourlySnapshot>;
  fields: Array<Field>;
  germinating?: Maybe<Germinating>;
  germinatings: Array<Germinating>;
  marketplaceEvent?: Maybe<MarketplaceEvent>;
  marketplaceEvents: Array<MarketplaceEvent>;
  plot?: Maybe<Plot>;
  plots: Array<Plot>;
  podFill?: Maybe<PodFill>;
  podFills: Array<PodFill>;
  podListing?: Maybe<PodListing>;
  podListingCancelled?: Maybe<PodListingCancelled>;
  podListingCancelleds: Array<PodListingCancelled>;
  podListingCreated?: Maybe<PodListingCreated>;
  podListingCreateds: Array<PodListingCreated>;
  podListingFilled?: Maybe<PodListingFilled>;
  podListingFilleds: Array<PodListingFilled>;
  podListings: Array<PodListing>;
  podMarketplace?: Maybe<PodMarketplace>;
  podMarketplaceDailySnapshot?: Maybe<PodMarketplaceDailySnapshot>;
  podMarketplaceDailySnapshots: Array<PodMarketplaceDailySnapshot>;
  podMarketplaceHourlySnapshot?: Maybe<PodMarketplaceHourlySnapshot>;
  podMarketplaceHourlySnapshots: Array<PodMarketplaceHourlySnapshot>;
  podMarketplaces: Array<PodMarketplace>;
  podOrder?: Maybe<PodOrder>;
  podOrderCancelled?: Maybe<PodOrderCancelled>;
  podOrderCancelleds: Array<PodOrderCancelled>;
  podOrderCreated?: Maybe<PodOrderCreated>;
  podOrderCreateds: Array<PodOrderCreated>;
  podOrderFilled?: Maybe<PodOrderFilled>;
  podOrderFilleds: Array<PodOrderFilled>;
  podOrders: Array<PodOrder>;
  pool?: Maybe<Pool>;
  poolCross?: Maybe<PoolCross>;
  poolCrosses: Array<PoolCross>;
  poolDailySnapshot?: Maybe<PoolDailySnapshot>;
  poolDailySnapshots: Array<PoolDailySnapshot>;
  poolHourlySnapshot?: Maybe<PoolHourlySnapshot>;
  poolHourlySnapshots: Array<PoolHourlySnapshot>;
  pools: Array<Pool>;
  prevFarmerGerminatingEvent?: Maybe<PrevFarmerGerminatingEvent>;
  prevFarmerGerminatingEvents: Array<PrevFarmerGerminatingEvent>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  silo?: Maybe<Silo>;
  siloAsset?: Maybe<SiloAsset>;
  siloAssetDailySnapshot?: Maybe<SiloAssetDailySnapshot>;
  siloAssetDailySnapshots: Array<SiloAssetDailySnapshot>;
  siloAssetHourlySnapshot?: Maybe<SiloAssetHourlySnapshot>;
  siloAssetHourlySnapshots: Array<SiloAssetHourlySnapshot>;
  siloAssets: Array<SiloAsset>;
  siloDailySnapshot?: Maybe<SiloDailySnapshot>;
  siloDailySnapshots: Array<SiloDailySnapshot>;
  siloDeposit?: Maybe<SiloDeposit>;
  siloDeposits: Array<SiloDeposit>;
  siloHourlySnapshot?: Maybe<SiloHourlySnapshot>;
  siloHourlySnapshots: Array<SiloHourlySnapshot>;
  siloWithdraw?: Maybe<SiloWithdraw>;
  siloWithdraws: Array<SiloWithdraw>;
  siloYield?: Maybe<SiloYield>;
  siloYields: Array<SiloYield>;
  silos: Array<Silo>;
  token?: Maybe<Token>;
  tokenYield?: Maybe<TokenYield>;
  tokenYields: Array<TokenYield>;
  tokens: Array<Token>;
  twaOracle?: Maybe<TwaOracle>;
  twaOracles: Array<TwaOracle>;
  unripeToken?: Maybe<UnripeToken>;
  unripeTokenDailySnapshot?: Maybe<UnripeTokenDailySnapshot>;
  unripeTokenDailySnapshots: Array<UnripeTokenDailySnapshot>;
  unripeTokenHourlySnapshot?: Maybe<UnripeTokenHourlySnapshot>;
  unripeTokenHourlySnapshots: Array<UnripeTokenHourlySnapshot>;
  unripeTokens: Array<UnripeToken>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  whitelistTokenDailySnapshot?: Maybe<WhitelistTokenDailySnapshot>;
  whitelistTokenDailySnapshots: Array<WhitelistTokenDailySnapshot>;
  whitelistTokenHourlySnapshot?: Maybe<WhitelistTokenHourlySnapshot>;
  whitelistTokenHourlySnapshots: Array<WhitelistTokenHourlySnapshot>;
  whitelistTokenSetting?: Maybe<WhitelistTokenSetting>;
  whitelistTokenSettings: Array<WhitelistTokenSetting>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBeanArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanCrossArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanCrossesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanCross_Filter>;
};


export type QueryBeanDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanDailySnapshot_Filter>;
};


export type QueryBeanHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanHourlySnapshot_Filter>;
};


export type QueryBeansArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Bean_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bean_Filter>;
};


export type QueryBeanstalkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanstalksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Beanstalk_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Beanstalk_Filter>;
};


export type QueryChopArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryChopsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Chop_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Chop_Filter>;
};


export type QueryFarmerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFarmersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Farmer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Farmer_Filter>;
};


export type QueryFertilizerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFertilizerBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFertilizerBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FertilizerBalance_Filter>;
};


export type QueryFertilizerTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFertilizerTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FertilizerToken_Filter>;
};


export type QueryFertilizerYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFertilizerYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FertilizerYield_Filter>;
};


export type QueryFertilizersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Fertilizer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Fertilizer_Filter>;
};


export type QueryFieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFieldDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFieldDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FieldDailySnapshot_Filter>;
};


export type QueryFieldHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFieldHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FieldHourlySnapshot_Filter>;
};


export type QueryFieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Field_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Field_Filter>;
};


export type QueryGerminatingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGerminatingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Germinating_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Germinating_Filter>;
};


export type QueryMarketplaceEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMarketplaceEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketplaceEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketplaceEvent_Filter>;
};


export type QueryPlotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPlotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Plot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Plot_Filter>;
};


export type QueryPodFillArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodFillsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFill_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodFill_Filter>;
};


export type QueryPodListingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodListingCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodListingCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListingCancelled_Filter>;
};


export type QueryPodListingCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodListingCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListingCreated_Filter>;
};


export type QueryPodListingFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodListingFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListingFilled_Filter>;
};


export type QueryPodListingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListing_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListing_Filter>;
};


export type QueryPodMarketplaceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodMarketplaceDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodMarketplaceDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodMarketplaceDailySnapshot_Filter>;
};


export type QueryPodMarketplaceHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodMarketplaceHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodMarketplaceHourlySnapshot_Filter>;
};


export type QueryPodMarketplacesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplace_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodMarketplace_Filter>;
};


export type QueryPodOrderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodOrderCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodOrderCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrderCancelled_Filter>;
};


export type QueryPodOrderCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodOrderCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrderCreated_Filter>;
};


export type QueryPodOrderFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPodOrderFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrderFilled_Filter>;
};


export type QueryPodOrdersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrder_Filter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolCrossArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolCrossesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolCross_Filter>;
};


export type QueryPoolDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolDailySnapshot_Filter>;
};


export type QueryPoolHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolHourlySnapshot_Filter>;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type QueryPrevFarmerGerminatingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPrevFarmerGerminatingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PrevFarmerGerminatingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrevFarmerGerminatingEvent_Filter>;
};


export type QuerySeasonArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySeasonsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Season_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Season_Filter>;
};


export type QuerySiloArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloAssetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloAssetDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloAssetDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloAssetDailySnapshot_Filter>;
};


export type QuerySiloAssetHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloAssetHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloAssetHourlySnapshot_Filter>;
};


export type QuerySiloAssetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloAsset_Filter>;
};


export type QuerySiloDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloDailySnapshot_Filter>;
};


export type QuerySiloDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloDeposit_Filter>;
};


export type QuerySiloHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloHourlySnapshot_Filter>;
};


export type QuerySiloWithdrawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloWithdrawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloWithdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloWithdraw_Filter>;
};


export type QuerySiloYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySiloYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloYield_Filter>;
};


export type QuerySilosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Silo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Silo_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenYield_Filter>;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryTwaOracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTwaOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TwaOracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TwaOracle_Filter>;
};


export type QueryUnripeTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnripeTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnripeTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnripeTokenDailySnapshot_Filter>;
};


export type QueryUnripeTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnripeTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnripeTokenHourlySnapshot_Filter>;
};


export type QueryUnripeTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnripeToken_Filter>;
};


export type QueryVersionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVersionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Version_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Version_Filter>;
};


export type QueryWhitelistTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWhitelistTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WhitelistTokenDailySnapshot_Filter>;
};


export type QueryWhitelistTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWhitelistTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WhitelistTokenHourlySnapshot_Filter>;
};


export type QueryWhitelistTokenSettingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWhitelistTokenSettingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenSetting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WhitelistTokenSetting_Filter>;
};

export type Season = {
  __typename?: 'Season';
  /** Total Bean supply */
  beans: Scalars['BigInt']['output'];
  /** 'beanstalk' */
  beanstalk: Beanstalk;
  /** Block timestamp when sunrise was called */
  createdAt: Scalars['BigInt']['output'];
  /** Time weighted deltaB */
  deltaB: Scalars['BigInt']['output'];
  /** Change in Bean supply */
  deltaBeans: Scalars['BigInt']['output'];
  /** Season Number */
  id: Scalars['ID']['output'];
  /** Amount of Beans paid to sunrise caller */
  incentiveBeans: Scalars['BigInt']['output'];
  /** Bean Market Cap */
  marketCap: Scalars['BigDecimal']['output'];
  /** Price of BEAN during sunrise */
  price: Scalars['BigDecimal']['output'];
  /** Amount of Beans minted during sunrise */
  rewardBeans: Scalars['BigInt']['output'];
  /** Season number in Int form for sorting */
  season: Scalars['Int']['output'];
  /** Block in which the season start was triggered by the sunrise call */
  sunriseBlock: Scalars['BigInt']['output'];
  /** Beans from L1 which have not migrated yet */
  unmigratedL1Beans?: Maybe<Scalars['BigInt']['output']>;
};

export type Season_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Season_Filter>>>;
  beans?: InputMaybe<Scalars['BigInt']['input']>;
  beans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beans_not?: InputMaybe<Scalars['BigInt']['input']>;
  beans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_?: InputMaybe<Beanstalk_Filter>;
  beanstalk_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_lt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_lte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaB?: InputMaybe<Scalars['BigInt']['input']>;
  deltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  incentiveBeans?: InputMaybe<Scalars['BigInt']['input']>;
  incentiveBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  incentiveBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  incentiveBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  incentiveBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  incentiveBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  incentiveBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  incentiveBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  marketCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  marketCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  marketCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Season_Filter>>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardBeans?: InputMaybe<Scalars['BigInt']['input']>;
  rewardBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  sunriseBlock?: InputMaybe<Scalars['BigInt']['input']>;
  sunriseBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sunriseBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sunriseBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sunriseBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sunriseBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sunriseBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  sunriseBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1Beans?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Beans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Beans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Beans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1Beans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Beans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Beans_not?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Beans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Season_OrderBy {
  Beans = 'beans',
  Beanstalk = 'beanstalk',
  BeanstalkFertilizer1155 = 'beanstalk__fertilizer1155',
  BeanstalkId = 'beanstalk__id',
  BeanstalkLastSeason = 'beanstalk__lastSeason',
  BeanstalkToken = 'beanstalk__token',
  CreatedAt = 'createdAt',
  DeltaB = 'deltaB',
  DeltaBeans = 'deltaBeans',
  Id = 'id',
  IncentiveBeans = 'incentiveBeans',
  MarketCap = 'marketCap',
  Price = 'price',
  RewardBeans = 'rewardBeans',
  Season = 'season',
  SunriseBlock = 'sunriseBlock',
  UnmigratedL1Beans = 'unmigratedL1Beans'
}

export type Silo = {
  __typename?: 'Silo';
  /** Current number of active farmers deposited in the silo */
  activeFarmers: Scalars['Int']['output'];
  /** Link to all silo assets currently associated with this silo */
  assets: Array<SiloAsset>;
  /** Cumulative total for bean mints sent to the silo */
  beanMints: Scalars['BigInt']['output'];
  /** [Seed Gauge] Current target ratio of Bean to LP deposits */
  beanToMaxLpGpPerBdvRatio?: Maybe<Scalars['BigInt']['output']>;
  /** 'beanstalk' */
  beanstalk: Beanstalk;
  /** Link to daily snapshot data */
  dailySnapshots: Array<SiloDailySnapshot>;
  /** Current BDV of all deposited assets */
  depositedBDV: Scalars['BigInt']['output'];
  /** Tokens that have been removed from the silo deposit whitelist */
  dewhitelistedTokens: Array<Scalars['Bytes']['output']>;
  /** Farmer address if applicable */
  farmer?: Maybe<Farmer>;
  /** [Seed Gauge] Stalk that is currently Germinating */
  germinatingStalk: Scalars['BigInt']['output'];
  /**
   * Current grown stalk per season.
   * NOTE: This value is currently not accurate for pre-gauge queries (BIP-45).
   * A correct implementation would recalculate this value when a whitelisted token's seed amount is changed.
   *
   */
  grownStalkPerSeason: Scalars['BigInt']['output'];
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<SiloHourlySnapshot>;
  /** Address for the farmer or Beanstalk contract */
  id: Scalars['Bytes']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Current plantable stalk for bean seigniorage not yet claimed */
  plantableStalk: Scalars['BigInt']['output'];
  /** Current roots balance */
  roots: Scalars['BigInt']['output'];
  /** Current stalk balance */
  stalk: Scalars['BigInt']['output'];
  /** Deposited BDV from L1 which has not migrated yet */
  unmigratedL1DepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  /** Tokens whitelisted for deposit within the silo */
  whitelistedTokens: Array<Scalars['Bytes']['output']>;
};


export type SiloAssetsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloAsset_Filter>;
};


export type SiloDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloDailySnapshot_Filter>;
};


export type SiloHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloHourlySnapshot_Filter>;
};

export type SiloAsset = {
  __typename?: 'SiloAsset';
  /** Link to daily snapshot data */
  dailySnapshots: Array<SiloAssetDailySnapshot>;
  /** Current Token amount of deposits */
  depositedAmount: Scalars['BigInt']['output'];
  /** Current BDV of deposits */
  depositedBDV: Scalars['BigInt']['output'];
  /** Current internal (farm) balance of the asset */
  farmAmount: Scalars['BigInt']['output'];
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<SiloAssetHourlySnapshot>;
  /** Silo ID - Asset Token Address */
  id: Scalars['ID']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Silo for this asset */
  silo: Silo;
  /** Token address for this asset */
  token: Scalars['Bytes']['output'];
  /** Current Token amount of silo withdrawals */
  withdrawnAmount: Scalars['BigInt']['output'];
};


export type SiloAssetDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloAssetDailySnapshot_Filter>;
};


export type SiloAssetHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloAssetHourlySnapshot_Filter>;
};

export type SiloAssetDailySnapshot = {
  __typename?: 'SiloAssetDailySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaDepositedAmount: Scalars['BigInt']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaFarmAmount: Scalars['BigInt']['output'];
  deltaWithdrawnAmount: Scalars['BigInt']['output'];
  /** Point in time current Token amount of deposits */
  depositedAmount: Scalars['BigInt']['output'];
  /** Point in time current BDV of deposits */
  depositedBDV: Scalars['BigInt']['output'];
  /** Point in time current internal (farm) balance of the asset */
  farmAmount: Scalars['BigInt']['output'];
  /** Silo Asset ID - Day */
  id: Scalars['ID']['output'];
  /** Last season for the snapshot */
  season: Scalars['Int']['output'];
  /** Silo asset associated with this snapshot */
  siloAsset: SiloAsset;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
  /** Point in time current Token amount of silo withdrawals */
  withdrawnAmount: Scalars['BigInt']['output'];
};

export type SiloAssetDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloAssetDailySnapshot_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWithdrawnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWithdrawnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmAmount?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloAssetDailySnapshot_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloAsset?: InputMaybe<Scalars['String']['input']>;
  siloAsset_?: InputMaybe<SiloAsset_Filter>;
  siloAsset_contains?: InputMaybe<Scalars['String']['input']>;
  siloAsset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_gt?: InputMaybe<Scalars['String']['input']>;
  siloAsset_gte?: InputMaybe<Scalars['String']['input']>;
  siloAsset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloAsset_lt?: InputMaybe<Scalars['String']['input']>;
  siloAsset_lte?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_contains?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloAsset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloAssetDailySnapshot_OrderBy {
  CreatedAt = 'createdAt',
  DeltaDepositedAmount = 'deltaDepositedAmount',
  DeltaDepositedBdv = 'deltaDepositedBDV',
  DeltaFarmAmount = 'deltaFarmAmount',
  DeltaWithdrawnAmount = 'deltaWithdrawnAmount',
  DepositedAmount = 'depositedAmount',
  DepositedBdv = 'depositedBDV',
  FarmAmount = 'farmAmount',
  Id = 'id',
  Season = 'season',
  SiloAsset = 'siloAsset',
  SiloAssetDepositedAmount = 'siloAsset__depositedAmount',
  SiloAssetDepositedBdv = 'siloAsset__depositedBDV',
  SiloAssetFarmAmount = 'siloAsset__farmAmount',
  SiloAssetId = 'siloAsset__id',
  SiloAssetLastDailySnapshotDay = 'siloAsset__lastDailySnapshotDay',
  SiloAssetLastHourlySnapshotSeason = 'siloAsset__lastHourlySnapshotSeason',
  SiloAssetToken = 'siloAsset__token',
  SiloAssetWithdrawnAmount = 'siloAsset__withdrawnAmount',
  UpdatedAt = 'updatedAt',
  WithdrawnAmount = 'withdrawnAmount'
}

export type SiloAssetHourlySnapshot = {
  __typename?: 'SiloAssetHourlySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaDepositedAmount: Scalars['BigInt']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaFarmAmount: Scalars['BigInt']['output'];
  deltaWithdrawnAmount: Scalars['BigInt']['output'];
  /** Point in time current Token amount of deposits */
  depositedAmount: Scalars['BigInt']['output'];
  /** Point in time current BDV of deposits */
  depositedBDV: Scalars['BigInt']['output'];
  /** Point in time current internal (farm) balance of the asset */
  farmAmount: Scalars['BigInt']['output'];
  /** Silo Asset ID - Season */
  id: Scalars['ID']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Silo asset associated with this snapshot */
  siloAsset: SiloAsset;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
  /** Point in time current Token amount of silo withdrawals */
  withdrawnAmount: Scalars['BigInt']['output'];
};

export type SiloAssetHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloAssetHourlySnapshot_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWithdrawnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWithdrawnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWithdrawnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmAmount?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloAssetHourlySnapshot_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloAsset?: InputMaybe<Scalars['String']['input']>;
  siloAsset_?: InputMaybe<SiloAsset_Filter>;
  siloAsset_contains?: InputMaybe<Scalars['String']['input']>;
  siloAsset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_gt?: InputMaybe<Scalars['String']['input']>;
  siloAsset_gte?: InputMaybe<Scalars['String']['input']>;
  siloAsset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloAsset_lt?: InputMaybe<Scalars['String']['input']>;
  siloAsset_lte?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_contains?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloAsset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloAsset_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloAsset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloAssetHourlySnapshot_OrderBy {
  CreatedAt = 'createdAt',
  DeltaDepositedAmount = 'deltaDepositedAmount',
  DeltaDepositedBdv = 'deltaDepositedBDV',
  DeltaFarmAmount = 'deltaFarmAmount',
  DeltaWithdrawnAmount = 'deltaWithdrawnAmount',
  DepositedAmount = 'depositedAmount',
  DepositedBdv = 'depositedBDV',
  FarmAmount = 'farmAmount',
  Id = 'id',
  Season = 'season',
  SiloAsset = 'siloAsset',
  SiloAssetDepositedAmount = 'siloAsset__depositedAmount',
  SiloAssetDepositedBdv = 'siloAsset__depositedBDV',
  SiloAssetFarmAmount = 'siloAsset__farmAmount',
  SiloAssetId = 'siloAsset__id',
  SiloAssetLastDailySnapshotDay = 'siloAsset__lastDailySnapshotDay',
  SiloAssetLastHourlySnapshotSeason = 'siloAsset__lastHourlySnapshotSeason',
  SiloAssetToken = 'siloAsset__token',
  SiloAssetWithdrawnAmount = 'siloAsset__withdrawnAmount',
  UpdatedAt = 'updatedAt',
  WithdrawnAmount = 'withdrawnAmount'
}

export type SiloAsset_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloAsset_Filter>>>;
  dailySnapshots_?: InputMaybe<SiloAssetDailySnapshot_Filter>;
  depositedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmAmount?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlySnapshots_?: InputMaybe<SiloAssetHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloAsset_Filter>>>;
  silo?: InputMaybe<Scalars['String']['input']>;
  silo_?: InputMaybe<Silo_Filter>;
  silo_contains?: InputMaybe<Scalars['String']['input']>;
  silo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_ends_with?: InputMaybe<Scalars['String']['input']>;
  silo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_gt?: InputMaybe<Scalars['String']['input']>;
  silo_gte?: InputMaybe<Scalars['String']['input']>;
  silo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  silo_lt?: InputMaybe<Scalars['String']['input']>;
  silo_lte?: InputMaybe<Scalars['String']['input']>;
  silo_not?: InputMaybe<Scalars['String']['input']>;
  silo_not_contains?: InputMaybe<Scalars['String']['input']>;
  silo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  silo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  silo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  silo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_starts_with?: InputMaybe<Scalars['String']['input']>;
  silo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  withdrawnAmount?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawnAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawnAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloAsset_OrderBy {
  DailySnapshots = 'dailySnapshots',
  DepositedAmount = 'depositedAmount',
  DepositedBdv = 'depositedBDV',
  FarmAmount = 'farmAmount',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  Silo = 'silo',
  SiloActiveFarmers = 'silo__activeFarmers',
  SiloBeanMints = 'silo__beanMints',
  SiloBeanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  SiloDepositedBdv = 'silo__depositedBDV',
  SiloGerminatingStalk = 'silo__germinatingStalk',
  SiloGrownStalkPerSeason = 'silo__grownStalkPerSeason',
  SiloId = 'silo__id',
  SiloLastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  SiloLastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  SiloPlantableStalk = 'silo__plantableStalk',
  SiloRoots = 'silo__roots',
  SiloStalk = 'silo__stalk',
  SiloUnmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  Token = 'token',
  WithdrawnAmount = 'withdrawnAmount'
}

export type SiloDailySnapshot = {
  __typename?: 'SiloDailySnapshot';
  /** Point in time current number of active farmers deposited in the silo */
  activeFarmers: Scalars['Int']['output'];
  /** Point in time cumulative total for bean mints sent to the silo */
  beanMints: Scalars['BigInt']['output'];
  /** [Seed Gauge] Current target ratio of Bean to LP deposits */
  beanToMaxLpGpPerBdvRatio?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaActiveFarmers: Scalars['Int']['output'];
  deltaBeanMints: Scalars['BigInt']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaGerminatingStalk: Scalars['BigInt']['output'];
  deltaGrownStalkPerSeason: Scalars['BigInt']['output'];
  deltaPlantableStalk: Scalars['BigInt']['output'];
  deltaRoots: Scalars['BigInt']['output'];
  deltaStalk: Scalars['BigInt']['output'];
  /** Point in time current BDV of all deposited assets */
  depositedBDV: Scalars['BigInt']['output'];
  /** [Seed Gauge] Stalk that is currently Germinating */
  germinatingStalk: Scalars['BigInt']['output'];
  /** Point in time grown stalk per season */
  grownStalkPerSeason: Scalars['BigInt']['output'];
  /** ID of silo - Day */
  id: Scalars['ID']['output'];
  /** Point in time current plantable stalk for bean seigniorage not yet claimed */
  plantableStalk: Scalars['BigInt']['output'];
  /** Point in time current roots balance */
  roots: Scalars['BigInt']['output'];
  /** Last season for the snapshot */
  season: Scalars['Int']['output'];
  /** Silo associated with the snapshot */
  silo: Silo;
  /** Point in time current stalk balance */
  stalk: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type SiloDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeFarmers?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_gt?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_gte?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  activeFarmers_lt?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_lte?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_not?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SiloDailySnapshot_Filter>>>;
  beanMints?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanMints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanToMaxLpGpPerBdvRatio?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanToMaxLpGpPerBdvRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaActiveFarmers?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaActiveFarmers_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaBeanMints?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanMints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGerminatingStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGerminatingStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGrownStalkPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGrownStalkPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRoots?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRoots_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  germinatingStalk?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  germinatingStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grownStalkPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grownStalkPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloDailySnapshot_Filter>>>;
  plantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  roots?: InputMaybe<Scalars['BigInt']['input']>;
  roots_gt?: InputMaybe<Scalars['BigInt']['input']>;
  roots_gte?: InputMaybe<Scalars['BigInt']['input']>;
  roots_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  roots_lt?: InputMaybe<Scalars['BigInt']['input']>;
  roots_lte?: InputMaybe<Scalars['BigInt']['input']>;
  roots_not?: InputMaybe<Scalars['BigInt']['input']>;
  roots_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  silo?: InputMaybe<Scalars['String']['input']>;
  silo_?: InputMaybe<Silo_Filter>;
  silo_contains?: InputMaybe<Scalars['String']['input']>;
  silo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_ends_with?: InputMaybe<Scalars['String']['input']>;
  silo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_gt?: InputMaybe<Scalars['String']['input']>;
  silo_gte?: InputMaybe<Scalars['String']['input']>;
  silo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  silo_lt?: InputMaybe<Scalars['String']['input']>;
  silo_lte?: InputMaybe<Scalars['String']['input']>;
  silo_not?: InputMaybe<Scalars['String']['input']>;
  silo_not_contains?: InputMaybe<Scalars['String']['input']>;
  silo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  silo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  silo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  silo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_starts_with?: InputMaybe<Scalars['String']['input']>;
  silo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stalk?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloDailySnapshot_OrderBy {
  ActiveFarmers = 'activeFarmers',
  BeanMints = 'beanMints',
  BeanToMaxLpGpPerBdvRatio = 'beanToMaxLpGpPerBdvRatio',
  CreatedAt = 'createdAt',
  DeltaActiveFarmers = 'deltaActiveFarmers',
  DeltaBeanMints = 'deltaBeanMints',
  DeltaDepositedBdv = 'deltaDepositedBDV',
  DeltaGerminatingStalk = 'deltaGerminatingStalk',
  DeltaGrownStalkPerSeason = 'deltaGrownStalkPerSeason',
  DeltaPlantableStalk = 'deltaPlantableStalk',
  DeltaRoots = 'deltaRoots',
  DeltaStalk = 'deltaStalk',
  DepositedBdv = 'depositedBDV',
  GerminatingStalk = 'germinatingStalk',
  GrownStalkPerSeason = 'grownStalkPerSeason',
  Id = 'id',
  PlantableStalk = 'plantableStalk',
  Roots = 'roots',
  Season = 'season',
  Silo = 'silo',
  SiloActiveFarmers = 'silo__activeFarmers',
  SiloBeanMints = 'silo__beanMints',
  SiloBeanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  SiloDepositedBdv = 'silo__depositedBDV',
  SiloGerminatingStalk = 'silo__germinatingStalk',
  SiloGrownStalkPerSeason = 'silo__grownStalkPerSeason',
  SiloId = 'silo__id',
  SiloLastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  SiloLastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  SiloPlantableStalk = 'silo__plantableStalk',
  SiloRoots = 'silo__roots',
  SiloStalk = 'silo__stalk',
  SiloUnmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  Stalk = 'stalk',
  UpdatedAt = 'updatedAt'
}

export type SiloDeposit = {
  __typename?: 'SiloDeposit';
  /** Timestamp of first deposit */
  createdAt: Scalars['BigInt']['output'];
  /** Block of first deposit */
  createdBlock: Scalars['BigInt']['output'];
  /** Version of deposit. Options are season, v3, v3.1. `season` type includes those deposits which are calculated according to their silo v1 deposits pre-explout */
  depositVersion: Scalars['String']['output'];
  /** Token amount deposited */
  depositedAmount: Scalars['BigInt']['output'];
  /** Original deposited BDV */
  depositedBDV: Scalars['BigInt']['output'];
  /** Farmer address */
  farmer: Farmer;
  /** Transaction hashes pertaining to this deposit */
  hashes: Array<Scalars['Bytes']['output']>;
  /**
   * Account - Token Address - Deposit Version - (Season|Stem)
   *
   */
  id: Scalars['ID']['output'];
  /** Season of deposit */
  season?: Maybe<Scalars['Int']['output']>;
  /** Stem of deposit */
  stem?: Maybe<Scalars['BigInt']['output']>;
  /** Silo v3.1 equivalent stem. This value will always be assigned regardless of the deposit version. */
  stemV31: Scalars['BigInt']['output'];
  /** Token Address */
  token: Scalars['Bytes']['output'];
  /** Timestamp when last updated */
  updatedAt: Scalars['BigInt']['output'];
  /** Block when last updated */
  updatedBlock: Scalars['BigInt']['output'];
};

export type SiloDeposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloDeposit_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositVersion?: InputMaybe<Scalars['String']['input']>;
  depositVersion_contains?: InputMaybe<Scalars['String']['input']>;
  depositVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  depositVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  depositVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  depositVersion_gt?: InputMaybe<Scalars['String']['input']>;
  depositVersion_gte?: InputMaybe<Scalars['String']['input']>;
  depositVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  depositVersion_lt?: InputMaybe<Scalars['String']['input']>;
  depositVersion_lte?: InputMaybe<Scalars['String']['input']>;
  depositVersion_not?: InputMaybe<Scalars['String']['input']>;
  depositVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  depositVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  depositVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  depositVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  depositVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  depositVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  depositVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  depositVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  depositVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  depositedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hashes?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashes_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashes_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashes_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashes_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hashes_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloDeposit_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  stem?: InputMaybe<Scalars['BigInt']['input']>;
  stemV31?: InputMaybe<Scalars['BigInt']['input']>;
  stemV31_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stemV31_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stemV31_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stemV31_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stemV31_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stemV31_not?: InputMaybe<Scalars['BigInt']['input']>;
  stemV31_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stem_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stem_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stem_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stem_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stem_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stem_not?: InputMaybe<Scalars['BigInt']['input']>;
  stem_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedBlock?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloDeposit_OrderBy {
  CreatedAt = 'createdAt',
  CreatedBlock = 'createdBlock',
  DepositVersion = 'depositVersion',
  DepositedAmount = 'depositedAmount',
  DepositedBdv = 'depositedBDV',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  Hashes = 'hashes',
  Id = 'id',
  Season = 'season',
  Stem = 'stem',
  StemV31 = 'stemV31',
  Token = 'token',
  UpdatedAt = 'updatedAt',
  UpdatedBlock = 'updatedBlock'
}

export type SiloHourlySnapshot = {
  __typename?: 'SiloHourlySnapshot';
  /** Point in time current number of active farmers deposited in the silo */
  activeFarmers: Scalars['Int']['output'];
  /** Point in time cumulative total for bean mints sent to the silo */
  beanMints: Scalars['BigInt']['output'];
  /** [Seed Gauge] Current target ratio of Bean to LP deposits */
  beanToMaxLpGpPerBdvRatio?: Maybe<Scalars['BigInt']['output']>;
  /** [Seed Gauge] The caseId used in the seasonal adjustment of beanToMaxLpGpPerBdvRatio */
  caseId?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaActiveFarmers: Scalars['Int']['output'];
  deltaBeanMints: Scalars['BigInt']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaGerminatingStalk: Scalars['BigInt']['output'];
  deltaGrownStalkPerSeason: Scalars['BigInt']['output'];
  deltaPlantableStalk: Scalars['BigInt']['output'];
  deltaRoots: Scalars['BigInt']['output'];
  deltaStalk: Scalars['BigInt']['output'];
  /** Point in time current BDV of all deposited assets */
  depositedBDV: Scalars['BigInt']['output'];
  /** [Seed Gauge] Stalk that is currently Germinating */
  germinatingStalk: Scalars['BigInt']['output'];
  /** Point in time grown stalk per season */
  grownStalkPerSeason: Scalars['BigInt']['output'];
  /** ID of silo - Season */
  id: Scalars['ID']['output'];
  /** Point in time current plantable stalk for bean seigniorage not yet claimed */
  plantableStalk: Scalars['BigInt']['output'];
  /** Point in time current roots balance */
  roots: Scalars['BigInt']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Silo associated with the snapshot */
  silo: Silo;
  /** Point in time current stalk balance */
  stalk: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type SiloHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeFarmers?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_gt?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_gte?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  activeFarmers_lt?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_lte?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_not?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SiloHourlySnapshot_Filter>>>;
  beanMints?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanMints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanToMaxLpGpPerBdvRatio?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanToMaxLpGpPerBdvRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caseId?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caseId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_not?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaActiveFarmers?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaActiveFarmers_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaBeanMints?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanMints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaDepositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaDepositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGerminatingStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGerminatingStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGerminatingStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGrownStalkPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGrownStalkPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGrownStalkPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRoots?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRoots_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRoots_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  germinatingStalk?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  germinatingStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grownStalkPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grownStalkPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloHourlySnapshot_Filter>>>;
  plantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  roots?: InputMaybe<Scalars['BigInt']['input']>;
  roots_gt?: InputMaybe<Scalars['BigInt']['input']>;
  roots_gte?: InputMaybe<Scalars['BigInt']['input']>;
  roots_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  roots_lt?: InputMaybe<Scalars['BigInt']['input']>;
  roots_lte?: InputMaybe<Scalars['BigInt']['input']>;
  roots_not?: InputMaybe<Scalars['BigInt']['input']>;
  roots_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  silo?: InputMaybe<Scalars['String']['input']>;
  silo_?: InputMaybe<Silo_Filter>;
  silo_contains?: InputMaybe<Scalars['String']['input']>;
  silo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_ends_with?: InputMaybe<Scalars['String']['input']>;
  silo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_gt?: InputMaybe<Scalars['String']['input']>;
  silo_gte?: InputMaybe<Scalars['String']['input']>;
  silo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  silo_lt?: InputMaybe<Scalars['String']['input']>;
  silo_lte?: InputMaybe<Scalars['String']['input']>;
  silo_not?: InputMaybe<Scalars['String']['input']>;
  silo_not_contains?: InputMaybe<Scalars['String']['input']>;
  silo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  silo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  silo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  silo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  silo_starts_with?: InputMaybe<Scalars['String']['input']>;
  silo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stalk?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloHourlySnapshot_OrderBy {
  ActiveFarmers = 'activeFarmers',
  BeanMints = 'beanMints',
  BeanToMaxLpGpPerBdvRatio = 'beanToMaxLpGpPerBdvRatio',
  CaseId = 'caseId',
  CreatedAt = 'createdAt',
  DeltaActiveFarmers = 'deltaActiveFarmers',
  DeltaBeanMints = 'deltaBeanMints',
  DeltaDepositedBdv = 'deltaDepositedBDV',
  DeltaGerminatingStalk = 'deltaGerminatingStalk',
  DeltaGrownStalkPerSeason = 'deltaGrownStalkPerSeason',
  DeltaPlantableStalk = 'deltaPlantableStalk',
  DeltaRoots = 'deltaRoots',
  DeltaStalk = 'deltaStalk',
  DepositedBdv = 'depositedBDV',
  GerminatingStalk = 'germinatingStalk',
  GrownStalkPerSeason = 'grownStalkPerSeason',
  Id = 'id',
  PlantableStalk = 'plantableStalk',
  Roots = 'roots',
  Season = 'season',
  Silo = 'silo',
  SiloActiveFarmers = 'silo__activeFarmers',
  SiloBeanMints = 'silo__beanMints',
  SiloBeanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  SiloDepositedBdv = 'silo__depositedBDV',
  SiloGerminatingStalk = 'silo__germinatingStalk',
  SiloGrownStalkPerSeason = 'silo__grownStalkPerSeason',
  SiloId = 'silo__id',
  SiloLastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  SiloLastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  SiloPlantableStalk = 'silo__plantableStalk',
  SiloRoots = 'silo__roots',
  SiloStalk = 'silo__stalk',
  SiloUnmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  Stalk = 'stalk',
  UpdatedAt = 'updatedAt'
}

export type SiloWithdraw = {
  __typename?: 'SiloWithdraw';
  /** Token amount withdrawn */
  amount: Scalars['BigInt']['output'];
  /** Season when withdrawal can be claimed */
  claimableSeason: Scalars['Int']['output'];
  /** Flag for if this has been claimed */
  claimed: Scalars['Boolean']['output'];
  /** Timestamp created */
  createdAt: Scalars['BigInt']['output'];
  /** Farmer address */
  farmer: Farmer;
  /** Account - Deposit Token - Current Season */
  id: Scalars['ID']['output'];
  /** Token address */
  token: Scalars['Bytes']['output'];
  /** Season withdrawal initiated */
  withdrawSeason: Scalars['Int']['output'];
};

export type SiloWithdraw_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SiloWithdraw_Filter>>>;
  claimableSeason?: InputMaybe<Scalars['Int']['input']>;
  claimableSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  claimableSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  claimableSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  claimableSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  claimableSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  claimableSeason_not?: InputMaybe<Scalars['Int']['input']>;
  claimableSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  claimed?: InputMaybe<Scalars['Boolean']['input']>;
  claimed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  claimed_not?: InputMaybe<Scalars['Boolean']['input']>;
  claimed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloWithdraw_Filter>>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  withdrawSeason?: InputMaybe<Scalars['Int']['input']>;
  withdrawSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  withdrawSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  withdrawSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdrawSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  withdrawSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  withdrawSeason_not?: InputMaybe<Scalars['Int']['input']>;
  withdrawSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum SiloWithdraw_OrderBy {
  Amount = 'amount',
  ClaimableSeason = 'claimableSeason',
  Claimed = 'claimed',
  CreatedAt = 'createdAt',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  Id = 'id',
  Token = 'token',
  WithdrawSeason = 'withdrawSeason'
}

export type SiloYield = {
  __typename?: 'SiloYield';
  /** Bean EMA for season */
  beansPerSeasonEMA: Scalars['BigDecimal']['output'];
  /** Beta used for EMA */
  beta: Scalars['BigDecimal']['output'];
  /** Unix timestamp of update */
  createdAt: Scalars['BigInt']['output'];
  /** Window used for vAPY calc */
  emaWindow: EmaWindow;
  /** Season of data points - EMA window */
  id: Scalars['ID']['output'];
  /** Sortable int field for season */
  season: Scalars['Int']['output'];
  /** Current Bean (0) and Stalk (1) APY for each token. */
  tokenAPYS: Array<TokenYield>;
  /** u used for EMA */
  u: Scalars['Int']['output'];
  /** Current whitelisted silo tokens */
  whitelistedTokens: Array<Scalars['Bytes']['output']>;
};


export type SiloYieldTokenApysArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenYield_Filter>;
};

export type SiloYield_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloYield_Filter>>>;
  beansPerSeasonEMA?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beansPerSeasonEMA_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  beansPerSeasonEMA_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beta?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beta_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  emaWindow?: InputMaybe<EmaWindow>;
  emaWindow_in?: InputMaybe<Array<EmaWindow>>;
  emaWindow_not?: InputMaybe<EmaWindow>;
  emaWindow_not_in?: InputMaybe<Array<EmaWindow>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloYield_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenAPYS_?: InputMaybe<TokenYield_Filter>;
  u?: InputMaybe<Scalars['Int']['input']>;
  u_gt?: InputMaybe<Scalars['Int']['input']>;
  u_gte?: InputMaybe<Scalars['Int']['input']>;
  u_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  u_lt?: InputMaybe<Scalars['Int']['input']>;
  u_lte?: InputMaybe<Scalars['Int']['input']>;
  u_not?: InputMaybe<Scalars['Int']['input']>;
  u_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  whitelistedTokens?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum SiloYield_OrderBy {
  BeansPerSeasonEma = 'beansPerSeasonEMA',
  Beta = 'beta',
  CreatedAt = 'createdAt',
  EmaWindow = 'emaWindow',
  Id = 'id',
  Season = 'season',
  TokenApys = 'tokenAPYS',
  U = 'u',
  WhitelistedTokens = 'whitelistedTokens'
}

export type Silo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeFarmers?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_gt?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_gte?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  activeFarmers_lt?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_lte?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_not?: InputMaybe<Scalars['Int']['input']>;
  activeFarmers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Silo_Filter>>>;
  assets_?: InputMaybe<SiloAsset_Filter>;
  beanMints?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanMints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanMints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanToMaxLpGpPerBdvRatio?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanToMaxLpGpPerBdvRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  beanToMaxLpGpPerBdvRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_?: InputMaybe<Beanstalk_Filter>;
  beanstalk_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_gte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_lt?: InputMaybe<Scalars['String']['input']>;
  beanstalk_lte?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanstalk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanstalk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshots_?: InputMaybe<SiloDailySnapshot_Filter>;
  depositedBDV?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedBDV_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedBDV_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dewhitelistedTokens?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  dewhitelistedTokens_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  dewhitelistedTokens_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  dewhitelistedTokens_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  dewhitelistedTokens_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  dewhitelistedTokens_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<Farmer_Filter>;
  farmer_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_gt?: InputMaybe<Scalars['String']['input']>;
  farmer_gte?: InputMaybe<Scalars['String']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_lt?: InputMaybe<Scalars['String']['input']>;
  farmer_lte?: InputMaybe<Scalars['String']['input']>;
  farmer_not?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  germinatingStalk?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  germinatingStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  germinatingStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grownStalkPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  grownStalkPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  grownStalkPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlySnapshots_?: InputMaybe<SiloHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Silo_Filter>>>;
  plantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  roots?: InputMaybe<Scalars['BigInt']['input']>;
  roots_gt?: InputMaybe<Scalars['BigInt']['input']>;
  roots_gte?: InputMaybe<Scalars['BigInt']['input']>;
  roots_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  roots_lt?: InputMaybe<Scalars['BigInt']['input']>;
  roots_lte?: InputMaybe<Scalars['BigInt']['input']>;
  roots_not?: InputMaybe<Scalars['BigInt']['input']>;
  roots_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalk?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1DepositedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1DepositedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  whitelistedTokens?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Silo_OrderBy {
  ActiveFarmers = 'activeFarmers',
  Assets = 'assets',
  BeanMints = 'beanMints',
  BeanToMaxLpGpPerBdvRatio = 'beanToMaxLpGpPerBdvRatio',
  Beanstalk = 'beanstalk',
  BeanstalkFertilizer1155 = 'beanstalk__fertilizer1155',
  BeanstalkId = 'beanstalk__id',
  BeanstalkLastSeason = 'beanstalk__lastSeason',
  BeanstalkToken = 'beanstalk__token',
  DailySnapshots = 'dailySnapshots',
  DepositedBdv = 'depositedBDV',
  DewhitelistedTokens = 'dewhitelistedTokens',
  Farmer = 'farmer',
  FarmerId = 'farmer__id',
  GerminatingStalk = 'germinatingStalk',
  GrownStalkPerSeason = 'grownStalkPerSeason',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  PlantableStalk = 'plantableStalk',
  Roots = 'roots',
  Stalk = 'stalk',
  UnmigratedL1DepositedBdv = 'unmigratedL1DepositedBdv',
  WhitelistedTokens = 'whitelistedTokens'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bean?: Maybe<Bean>;
  beanCross?: Maybe<BeanCross>;
  beanCrosses: Array<BeanCross>;
  beanDailySnapshot?: Maybe<BeanDailySnapshot>;
  beanDailySnapshots: Array<BeanDailySnapshot>;
  beanHourlySnapshot?: Maybe<BeanHourlySnapshot>;
  beanHourlySnapshots: Array<BeanHourlySnapshot>;
  beans: Array<Bean>;
  beanstalk?: Maybe<Beanstalk>;
  beanstalks: Array<Beanstalk>;
  chop?: Maybe<Chop>;
  chops: Array<Chop>;
  farmer?: Maybe<Farmer>;
  farmers: Array<Farmer>;
  fertilizer?: Maybe<Fertilizer>;
  fertilizerBalance?: Maybe<FertilizerBalance>;
  fertilizerBalances: Array<FertilizerBalance>;
  fertilizerToken?: Maybe<FertilizerToken>;
  fertilizerTokens: Array<FertilizerToken>;
  fertilizerYield?: Maybe<FertilizerYield>;
  fertilizerYields: Array<FertilizerYield>;
  fertilizers: Array<Fertilizer>;
  field?: Maybe<Field>;
  fieldDailySnapshot?: Maybe<FieldDailySnapshot>;
  fieldDailySnapshots: Array<FieldDailySnapshot>;
  fieldHourlySnapshot?: Maybe<FieldHourlySnapshot>;
  fieldHourlySnapshots: Array<FieldHourlySnapshot>;
  fields: Array<Field>;
  germinating?: Maybe<Germinating>;
  germinatings: Array<Germinating>;
  marketplaceEvent?: Maybe<MarketplaceEvent>;
  marketplaceEvents: Array<MarketplaceEvent>;
  plot?: Maybe<Plot>;
  plots: Array<Plot>;
  podFill?: Maybe<PodFill>;
  podFills: Array<PodFill>;
  podListing?: Maybe<PodListing>;
  podListingCancelled?: Maybe<PodListingCancelled>;
  podListingCancelleds: Array<PodListingCancelled>;
  podListingCreated?: Maybe<PodListingCreated>;
  podListingCreateds: Array<PodListingCreated>;
  podListingFilled?: Maybe<PodListingFilled>;
  podListingFilleds: Array<PodListingFilled>;
  podListings: Array<PodListing>;
  podMarketplace?: Maybe<PodMarketplace>;
  podMarketplaceDailySnapshot?: Maybe<PodMarketplaceDailySnapshot>;
  podMarketplaceDailySnapshots: Array<PodMarketplaceDailySnapshot>;
  podMarketplaceHourlySnapshot?: Maybe<PodMarketplaceHourlySnapshot>;
  podMarketplaceHourlySnapshots: Array<PodMarketplaceHourlySnapshot>;
  podMarketplaces: Array<PodMarketplace>;
  podOrder?: Maybe<PodOrder>;
  podOrderCancelled?: Maybe<PodOrderCancelled>;
  podOrderCancelleds: Array<PodOrderCancelled>;
  podOrderCreated?: Maybe<PodOrderCreated>;
  podOrderCreateds: Array<PodOrderCreated>;
  podOrderFilled?: Maybe<PodOrderFilled>;
  podOrderFilleds: Array<PodOrderFilled>;
  podOrders: Array<PodOrder>;
  pool?: Maybe<Pool>;
  poolCross?: Maybe<PoolCross>;
  poolCrosses: Array<PoolCross>;
  poolDailySnapshot?: Maybe<PoolDailySnapshot>;
  poolDailySnapshots: Array<PoolDailySnapshot>;
  poolHourlySnapshot?: Maybe<PoolHourlySnapshot>;
  poolHourlySnapshots: Array<PoolHourlySnapshot>;
  pools: Array<Pool>;
  prevFarmerGerminatingEvent?: Maybe<PrevFarmerGerminatingEvent>;
  prevFarmerGerminatingEvents: Array<PrevFarmerGerminatingEvent>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  silo?: Maybe<Silo>;
  siloAsset?: Maybe<SiloAsset>;
  siloAssetDailySnapshot?: Maybe<SiloAssetDailySnapshot>;
  siloAssetDailySnapshots: Array<SiloAssetDailySnapshot>;
  siloAssetHourlySnapshot?: Maybe<SiloAssetHourlySnapshot>;
  siloAssetHourlySnapshots: Array<SiloAssetHourlySnapshot>;
  siloAssets: Array<SiloAsset>;
  siloDailySnapshot?: Maybe<SiloDailySnapshot>;
  siloDailySnapshots: Array<SiloDailySnapshot>;
  siloDeposit?: Maybe<SiloDeposit>;
  siloDeposits: Array<SiloDeposit>;
  siloHourlySnapshot?: Maybe<SiloHourlySnapshot>;
  siloHourlySnapshots: Array<SiloHourlySnapshot>;
  siloWithdraw?: Maybe<SiloWithdraw>;
  siloWithdraws: Array<SiloWithdraw>;
  siloYield?: Maybe<SiloYield>;
  siloYields: Array<SiloYield>;
  silos: Array<Silo>;
  token?: Maybe<Token>;
  tokenYield?: Maybe<TokenYield>;
  tokenYields: Array<TokenYield>;
  tokens: Array<Token>;
  twaOracle?: Maybe<TwaOracle>;
  twaOracles: Array<TwaOracle>;
  unripeToken?: Maybe<UnripeToken>;
  unripeTokenDailySnapshot?: Maybe<UnripeTokenDailySnapshot>;
  unripeTokenDailySnapshots: Array<UnripeTokenDailySnapshot>;
  unripeTokenHourlySnapshot?: Maybe<UnripeTokenHourlySnapshot>;
  unripeTokenHourlySnapshots: Array<UnripeTokenHourlySnapshot>;
  unripeTokens: Array<UnripeToken>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  whitelistTokenDailySnapshot?: Maybe<WhitelistTokenDailySnapshot>;
  whitelistTokenDailySnapshots: Array<WhitelistTokenDailySnapshot>;
  whitelistTokenHourlySnapshot?: Maybe<WhitelistTokenHourlySnapshot>;
  whitelistTokenHourlySnapshots: Array<WhitelistTokenHourlySnapshot>;
  whitelistTokenSetting?: Maybe<WhitelistTokenSetting>;
  whitelistTokenSettings: Array<WhitelistTokenSetting>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBeanArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanCrossArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanCrossesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanCross_Filter>;
};


export type SubscriptionBeanDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanDailySnapshot_Filter>;
};


export type SubscriptionBeanHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanHourlySnapshot_Filter>;
};


export type SubscriptionBeansArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Bean_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bean_Filter>;
};


export type SubscriptionBeanstalkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanstalksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Beanstalk_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Beanstalk_Filter>;
};


export type SubscriptionChopArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionChopsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Chop_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Chop_Filter>;
};


export type SubscriptionFarmerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFarmersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Farmer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Farmer_Filter>;
};


export type SubscriptionFertilizerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFertilizerBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFertilizerBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FertilizerBalance_Filter>;
};


export type SubscriptionFertilizerTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFertilizerTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FertilizerToken_Filter>;
};


export type SubscriptionFertilizerYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFertilizerYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FertilizerYield_Filter>;
};


export type SubscriptionFertilizersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Fertilizer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Fertilizer_Filter>;
};


export type SubscriptionFieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFieldDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFieldDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FieldDailySnapshot_Filter>;
};


export type SubscriptionFieldHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFieldHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FieldHourlySnapshot_Filter>;
};


export type SubscriptionFieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Field_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Field_Filter>;
};


export type SubscriptionGerminatingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGerminatingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Germinating_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Germinating_Filter>;
};


export type SubscriptionMarketplaceEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMarketplaceEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketplaceEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarketplaceEvent_Filter>;
};


export type SubscriptionPlotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPlotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Plot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Plot_Filter>;
};


export type SubscriptionPodFillArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodFillsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFill_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodFill_Filter>;
};


export type SubscriptionPodListingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodListingCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodListingCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListingCancelled_Filter>;
};


export type SubscriptionPodListingCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodListingCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListingCreated_Filter>;
};


export type SubscriptionPodListingFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodListingFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListingFilled_Filter>;
};


export type SubscriptionPodListingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListing_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodListing_Filter>;
};


export type SubscriptionPodMarketplaceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodMarketplaceDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodMarketplaceDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodMarketplaceDailySnapshot_Filter>;
};


export type SubscriptionPodMarketplaceHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodMarketplaceHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodMarketplaceHourlySnapshot_Filter>;
};


export type SubscriptionPodMarketplacesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplace_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodMarketplace_Filter>;
};


export type SubscriptionPodOrderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodOrderCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodOrderCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrderCancelled_Filter>;
};


export type SubscriptionPodOrderCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodOrderCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrderCreated_Filter>;
};


export type SubscriptionPodOrderFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPodOrderFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrderFilled_Filter>;
};


export type SubscriptionPodOrdersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PodOrder_Filter>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolCrossArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolCrossesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolCross_Filter>;
};


export type SubscriptionPoolDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolDailySnapshot_Filter>;
};


export type SubscriptionPoolHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolHourlySnapshot_Filter>;
};


export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type SubscriptionPrevFarmerGerminatingEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPrevFarmerGerminatingEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PrevFarmerGerminatingEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PrevFarmerGerminatingEvent_Filter>;
};


export type SubscriptionSeasonArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSeasonsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Season_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Season_Filter>;
};


export type SubscriptionSiloArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloAssetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloAssetDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloAssetDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloAssetDailySnapshot_Filter>;
};


export type SubscriptionSiloAssetHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloAssetHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloAssetHourlySnapshot_Filter>;
};


export type SubscriptionSiloAssetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloAsset_Filter>;
};


export type SubscriptionSiloDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloDailySnapshot_Filter>;
};


export type SubscriptionSiloDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloDeposit_Filter>;
};


export type SubscriptionSiloHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloHourlySnapshot_Filter>;
};


export type SubscriptionSiloWithdrawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloWithdrawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloWithdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloWithdraw_Filter>;
};


export type SubscriptionSiloYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSiloYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SiloYield_Filter>;
};


export type SubscriptionSilosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Silo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Silo_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenYield_Filter>;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type SubscriptionTwaOracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTwaOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TwaOracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TwaOracle_Filter>;
};


export type SubscriptionUnripeTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnripeTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnripeTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnripeTokenDailySnapshot_Filter>;
};


export type SubscriptionUnripeTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnripeTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnripeTokenHourlySnapshot_Filter>;
};


export type SubscriptionUnripeTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnripeToken_Filter>;
};


export type SubscriptionVersionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVersionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Version_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Version_Filter>;
};


export type SubscriptionWhitelistTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWhitelistTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WhitelistTokenDailySnapshot_Filter>;
};


export type SubscriptionWhitelistTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWhitelistTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WhitelistTokenHourlySnapshot_Filter>;
};


export type SubscriptionWhitelistTokenSettingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWhitelistTokenSettingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenSetting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WhitelistTokenSetting_Filter>;
};

export type Token = {
  __typename?: 'Token';
  /** Number of decimals */
  decimals: Scalars['BigInt']['output'];
  /** Smart contract address of the token */
  id: Scalars['Bytes']['output'];
  /** Last USD price calculated. Isn't calculated for all tokens, in those cases will be zero. */
  lastPriceUSD: Scalars['BigDecimal']['output'];
  /** Name of the token, i.e. BEAN, WETH */
  name: Scalars['String']['output'];
};

export type TokenYield = {
  __typename?: 'TokenYield';
  /** Bean APY for season */
  beanAPY: Scalars['BigDecimal']['output'];
  /** Unix timestamp of update */
  createdAt: Scalars['BigInt']['output'];
  /** Token address - season - EMA window */
  id: Scalars['Bytes']['output'];
  /** Season for APY calculation */
  season: Scalars['Int']['output'];
  /** Related silo yield entity */
  siloYield: SiloYield;
  /** Stalk APY for season */
  stalkAPY: Scalars['BigDecimal']['output'];
  /** Token being calculated */
  token: Scalars['Bytes']['output'];
};

export type TokenYield_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenYield_Filter>>>;
  beanAPY?: InputMaybe<Scalars['BigDecimal']['input']>;
  beanAPY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beanAPY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beanAPY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beanAPY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beanAPY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beanAPY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  beanAPY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenYield_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloYield?: InputMaybe<Scalars['String']['input']>;
  siloYield_?: InputMaybe<SiloYield_Filter>;
  siloYield_contains?: InputMaybe<Scalars['String']['input']>;
  siloYield_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloYield_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloYield_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloYield_gt?: InputMaybe<Scalars['String']['input']>;
  siloYield_gte?: InputMaybe<Scalars['String']['input']>;
  siloYield_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloYield_lt?: InputMaybe<Scalars['String']['input']>;
  siloYield_lte?: InputMaybe<Scalars['String']['input']>;
  siloYield_not?: InputMaybe<Scalars['String']['input']>;
  siloYield_not_contains?: InputMaybe<Scalars['String']['input']>;
  siloYield_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloYield_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloYield_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloYield_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloYield_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloYield_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloYield_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloYield_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stalkAPY?: InputMaybe<Scalars['BigDecimal']['input']>;
  stalkAPY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stalkAPY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stalkAPY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stalkAPY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stalkAPY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stalkAPY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stalkAPY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum TokenYield_OrderBy {
  BeanApy = 'beanAPY',
  CreatedAt = 'createdAt',
  Id = 'id',
  Season = 'season',
  SiloYield = 'siloYield',
  SiloYieldBeansPerSeasonEma = 'siloYield__beansPerSeasonEMA',
  SiloYieldBeta = 'siloYield__beta',
  SiloYieldCreatedAt = 'siloYield__createdAt',
  SiloYieldEmaWindow = 'siloYield__emaWindow',
  SiloYieldId = 'siloYield__id',
  SiloYieldSeason = 'siloYield__season',
  SiloYieldU = 'siloYield__u',
  StalkApy = 'stalkAPY',
  Token = 'token'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
};

export enum Token_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  LastPriceUsd = 'lastPriceUSD',
  Name = 'name'
}

export type TwaOracle = {
  __typename?: 'TwaOracle';
  cumulativeWellReserves: Scalars['Bytes']['output'];
  cumulativeWellReservesBlock: Scalars['BigInt']['output'];
  cumulativeWellReservesPrev: Scalars['Bytes']['output'];
  cumulativeWellReservesPrevBlock: Scalars['BigInt']['output'];
  cumulativeWellReservesPrevTime: Scalars['BigInt']['output'];
  cumulativeWellReservesTime: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  lastBalances: Array<Scalars['BigInt']['output']>;
  lastSun: Scalars['BigInt']['output'];
  lastUpdated: Scalars['BigInt']['output'];
  pool: Pool;
  priceCumulativeLast: Array<Scalars['BigInt']['output']>;
  priceCumulativeSun: Array<Scalars['BigInt']['output']>;
};

export type TwaOracle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TwaOracle_Filter>>>;
  cumulativeWellReserves?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesBlock?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReservesBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReservesPrev?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrevBlock?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReservesPrevBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReservesPrevTime?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReservesPrevTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesPrevTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReservesPrev_contains?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrev_gt?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrev_gte?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrev_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  cumulativeWellReservesPrev_lt?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrev_lte?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrev_not?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrev_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReservesPrev_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  cumulativeWellReservesTime?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReservesTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeWellReservesTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeWellReserves_contains?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReserves_gt?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReserves_gte?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReserves_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  cumulativeWellReserves_lt?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReserves_lte?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReserves_not?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReserves_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  cumulativeWellReserves_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastBalances?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastBalances_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastBalances_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastBalances_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastBalances_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastBalances_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastSun?: InputMaybe<Scalars['BigInt']['input']>;
  lastSun_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSun_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSun_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastSun_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastSun_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastSun_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastSun_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdated?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdated_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TwaOracle_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceCumulativeLast?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeLast_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeLast_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeLast_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeLast_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeLast_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum TwaOracle_OrderBy {
  CumulativeWellReserves = 'cumulativeWellReserves',
  CumulativeWellReservesBlock = 'cumulativeWellReservesBlock',
  CumulativeWellReservesPrev = 'cumulativeWellReservesPrev',
  CumulativeWellReservesPrevBlock = 'cumulativeWellReservesPrevBlock',
  CumulativeWellReservesPrevTime = 'cumulativeWellReservesPrevTime',
  CumulativeWellReservesTime = 'cumulativeWellReservesTime',
  Id = 'id',
  LastBalances = 'lastBalances',
  LastSun = 'lastSun',
  LastUpdated = 'lastUpdated',
  Pool = 'pool',
  PoolCrosses = 'pool__crosses',
  PoolDeltaBeans = 'pool__deltaBeans',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastSeason = 'pool__lastSeason',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  PriceCumulativeLast = 'priceCumulativeLast',
  PriceCumulativeSun = 'priceCumulativeSun'
}

export type UnripeToken = {
  __typename?: 'UnripeToken';
  /** The amount of `underlyingToken` corresponding to one of this unripe token (getUnderlyingPerUnripeToken) */
  amountUnderlyingOne: Scalars['BigInt']['output'];
  /** The bdv of `amountUnderlyingOne` of `underlyingToken`. Assumed to not always be the same as bdv(id) */
  bdvUnderlyingOne: Scalars['BigInt']['output'];
  /** The chop rate, in percent (getPercentPenalty) */
  chopRate: Scalars['BigDecimal']['output'];
  /** The amount of `underlyingToken` which would be received if one of this unripe token were to be chopped (getPenalty) */
  choppableAmountOne: Scalars['BigInt']['output'];
  /** The bdv that would be received if one of this unripe token were to be chopped */
  choppableBdvOne: Scalars['BigInt']['output'];
  /** Link to daily snapshot data */
  dailySnapshots: Array<UnripeTokenDailySnapshot>;
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<UnripeTokenHourlySnapshot>;
  /** Token Address */
  id: Scalars['Bytes']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** The amount recapitalized, in percent (getRecapFundedPercent) */
  recapPercent: Scalars['BigDecimal']['output'];
  /** The total amount of this unripe token which has been chopped */
  totalChoppedAmount: Scalars['BigInt']['output'];
  /** The total bdv of this unripe token which has been chopped */
  totalChoppedBdv: Scalars['BigInt']['output'];
  /** The total bdv of all `underlyingToken` that has been received from chopping */
  totalChoppedBdvReceived: Scalars['BigInt']['output'];
  /** The total amount of `underlyingToken` for this unripe token (getTotalUnderlying) */
  totalUnderlying: Scalars['BigInt']['output'];
  /** The ripe token underlying this unripe asset */
  underlyingToken: WhitelistTokenSetting;
};


export type UnripeTokenDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UnripeTokenDailySnapshot_Filter>;
};


export type UnripeTokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UnripeTokenHourlySnapshot_Filter>;
};

export type UnripeTokenDailySnapshot = {
  __typename?: 'UnripeTokenDailySnapshot';
  /** Point in time amount of `underlyingToken` corresponding to one of this unripe token (getUnderlyingPerUnripeToken) */
  amountUnderlyingOne: Scalars['BigInt']['output'];
  /** Point in time bdv of `amountUnderlyingOne` of `underlyingToken`. Assumed to not always be the same as bdv(id) */
  bdvUnderlyingOne: Scalars['BigInt']['output'];
  /** Point in time chop rate, in percent (getPercentPenalty) */
  chopRate: Scalars['BigDecimal']['output'];
  /** Point in time amount of `underlyingToken` which would be received if one of this unripe token were to be chopped (getPenalty) */
  choppableAmountOne: Scalars['BigInt']['output'];
  /** Point in time bdv that would be received if one of this unripe token were to be chopped */
  choppableBdvOne: Scalars['BigInt']['output'];
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** Note that the contents of this field are nonsense when deltaUnderlyingToken = true */
  deltaAmountUnderlyingOne: Scalars['BigInt']['output'];
  deltaBdvUnderlyingOne: Scalars['BigInt']['output'];
  deltaChopRate: Scalars['BigDecimal']['output'];
  /** Note that the contents of this field are nonsense when deltaUnderlyingToken = true */
  deltaChoppableAmountOne: Scalars['BigInt']['output'];
  deltaChoppableBdvOne: Scalars['BigInt']['output'];
  deltaRecapPercent: Scalars['BigDecimal']['output'];
  deltaTotalChoppedAmount: Scalars['BigInt']['output'];
  deltaTotalChoppedBdv: Scalars['BigInt']['output'];
  deltaTotalChoppedBdvReceived: Scalars['BigInt']['output'];
  /** Note that the contents of this field are nonsense when deltaUnderlyingToken = true */
  deltaTotalUnderlying: Scalars['BigInt']['output'];
  deltaUnderlyingToken: Scalars['Boolean']['output'];
  /** UnripeToken ID - Day */
  id: Scalars['ID']['output'];
  /** Point in time amount recapitalized, in percent (getRecapFundedPercent) */
  recapPercent: Scalars['BigDecimal']['output'];
  /** Last season for the snapshot */
  season: Scalars['Int']['output'];
  /** Point in time total amount of this unripe token which has been chopped */
  totalChoppedAmount: Scalars['BigInt']['output'];
  /** Point in time total bdv of this unripe token which has been chopped */
  totalChoppedBdv: Scalars['BigInt']['output'];
  /** Point in time total bdv of all `underlyingToken` that has been received from chopping */
  totalChoppedBdvReceived: Scalars['BigInt']['output'];
  /** Point in time total amount of `underlyingToken` for this unripe token (getTotalUnderlying) */
  totalUnderlying: Scalars['BigInt']['output'];
  /** Point in time ripe token underlying this unripe asset */
  underlyingToken: WhitelistTokenSetting;
  /** Unripe token associated with this snapshot */
  unripeToken: UnripeToken;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type UnripeTokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<UnripeTokenDailySnapshot_Filter>>>;
  bdvUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bdvUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chopRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chopRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  choppableAmountOne?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableAmountOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableBdvOne?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableBdvOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAmountUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAmountUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdvUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdvUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChopRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaChopRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaChoppableAmountOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChoppableAmountOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChoppableBdvOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChoppableBdvOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRecapPercent?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaRecapPercent_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTotalChoppedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdvReceived_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalUnderlying?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalUnderlying_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnderlyingToken?: InputMaybe<Scalars['Boolean']['input']>;
  deltaUnderlyingToken_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaUnderlyingToken_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaUnderlyingToken_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UnripeTokenDailySnapshot_Filter>>>;
  recapPercent?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  recapPercent_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalChoppedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdvReceived_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlying?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlying_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingToken?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_?: InputMaybe<WhitelistTokenSetting_Filter>;
  underlyingToken_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_lt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_lte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken?: InputMaybe<Scalars['String']['input']>;
  unripeToken_?: InputMaybe<UnripeToken_Filter>;
  unripeToken_contains?: InputMaybe<Scalars['String']['input']>;
  unripeToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_gt?: InputMaybe<Scalars['String']['input']>;
  unripeToken_gte?: InputMaybe<Scalars['String']['input']>;
  unripeToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unripeToken_lt?: InputMaybe<Scalars['String']['input']>;
  unripeToken_lte?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unripeToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum UnripeTokenDailySnapshot_OrderBy {
  AmountUnderlyingOne = 'amountUnderlyingOne',
  BdvUnderlyingOne = 'bdvUnderlyingOne',
  ChopRate = 'chopRate',
  ChoppableAmountOne = 'choppableAmountOne',
  ChoppableBdvOne = 'choppableBdvOne',
  CreatedAt = 'createdAt',
  DeltaAmountUnderlyingOne = 'deltaAmountUnderlyingOne',
  DeltaBdvUnderlyingOne = 'deltaBdvUnderlyingOne',
  DeltaChopRate = 'deltaChopRate',
  DeltaChoppableAmountOne = 'deltaChoppableAmountOne',
  DeltaChoppableBdvOne = 'deltaChoppableBdvOne',
  DeltaRecapPercent = 'deltaRecapPercent',
  DeltaTotalChoppedAmount = 'deltaTotalChoppedAmount',
  DeltaTotalChoppedBdv = 'deltaTotalChoppedBdv',
  DeltaTotalChoppedBdvReceived = 'deltaTotalChoppedBdvReceived',
  DeltaTotalUnderlying = 'deltaTotalUnderlying',
  DeltaUnderlyingToken = 'deltaUnderlyingToken',
  Id = 'id',
  RecapPercent = 'recapPercent',
  Season = 'season',
  TotalChoppedAmount = 'totalChoppedAmount',
  TotalChoppedBdv = 'totalChoppedBdv',
  TotalChoppedBdvReceived = 'totalChoppedBdvReceived',
  TotalUnderlying = 'totalUnderlying',
  UnderlyingToken = 'underlyingToken',
  UnderlyingTokenDecimals = 'underlyingToken__decimals',
  UnderlyingTokenGaugePoints = 'underlyingToken__gaugePoints',
  UnderlyingTokenId = 'underlyingToken__id',
  UnderlyingTokenIsGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  UnderlyingTokenLastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  UnderlyingTokenLastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  UnderlyingTokenMilestoneSeason = 'underlyingToken__milestoneSeason',
  UnderlyingTokenOptimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  UnderlyingTokenSelector = 'underlyingToken__selector',
  UnderlyingTokenStalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  UnderlyingTokenStalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  UnderlyingTokenUpdatedAt = 'underlyingToken__updatedAt',
  UnripeToken = 'unripeToken',
  UnripeTokenAmountUnderlyingOne = 'unripeToken__amountUnderlyingOne',
  UnripeTokenBdvUnderlyingOne = 'unripeToken__bdvUnderlyingOne',
  UnripeTokenChopRate = 'unripeToken__chopRate',
  UnripeTokenChoppableAmountOne = 'unripeToken__choppableAmountOne',
  UnripeTokenChoppableBdvOne = 'unripeToken__choppableBdvOne',
  UnripeTokenId = 'unripeToken__id',
  UnripeTokenLastDailySnapshotDay = 'unripeToken__lastDailySnapshotDay',
  UnripeTokenLastHourlySnapshotSeason = 'unripeToken__lastHourlySnapshotSeason',
  UnripeTokenRecapPercent = 'unripeToken__recapPercent',
  UnripeTokenTotalChoppedAmount = 'unripeToken__totalChoppedAmount',
  UnripeTokenTotalChoppedBdv = 'unripeToken__totalChoppedBdv',
  UnripeTokenTotalChoppedBdvReceived = 'unripeToken__totalChoppedBdvReceived',
  UnripeTokenTotalUnderlying = 'unripeToken__totalUnderlying',
  UpdatedAt = 'updatedAt'
}

export type UnripeTokenHourlySnapshot = {
  __typename?: 'UnripeTokenHourlySnapshot';
  /** Point in time amount of `underlyingToken` corresponding to one of this unripe token (getUnderlyingPerUnripeToken) */
  amountUnderlyingOne: Scalars['BigInt']['output'];
  /** Point in time bdv of `amountUnderlyingOne` of `underlyingToken`. Assumed to not always be the same as bdv(id) */
  bdvUnderlyingOne: Scalars['BigInt']['output'];
  /** Point in time chop rate, in percent (getPercentPenalty) */
  chopRate: Scalars['BigDecimal']['output'];
  /** Point in time amount of `underlyingToken` which would be received if one of this unripe token were to be chopped (getPenalty) */
  choppableAmountOne: Scalars['BigInt']['output'];
  /** Point in time bdv that would be received if one of this unripe token were to be chopped */
  choppableBdvOne: Scalars['BigInt']['output'];
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** Note that the contents of this field are nonsense when deltaUnderlyingToken = true */
  deltaAmountUnderlyingOne: Scalars['BigInt']['output'];
  deltaBdvUnderlyingOne: Scalars['BigInt']['output'];
  deltaChopRate: Scalars['BigDecimal']['output'];
  /** Note that the contents of this field are nonsense when deltaUnderlyingToken = true */
  deltaChoppableAmountOne: Scalars['BigInt']['output'];
  deltaChoppableBdvOne: Scalars['BigInt']['output'];
  deltaRecapPercent: Scalars['BigDecimal']['output'];
  deltaTotalChoppedAmount: Scalars['BigInt']['output'];
  deltaTotalChoppedBdv: Scalars['BigInt']['output'];
  deltaTotalChoppedBdvReceived: Scalars['BigInt']['output'];
  /** Note that the contents of this field are nonsense when deltaUnderlyingToken = true */
  deltaTotalUnderlying: Scalars['BigInt']['output'];
  deltaUnderlyingToken: Scalars['Boolean']['output'];
  /** UnripeToken ID - Season */
  id: Scalars['ID']['output'];
  /** Point in time amount recapitalized, in percent (getRecapFundedPercent) */
  recapPercent: Scalars['BigDecimal']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Point in time total amount of this unripe token which has been chopped */
  totalChoppedAmount: Scalars['BigInt']['output'];
  /** Point in time total bdv of this unripe token which has been chopped */
  totalChoppedBdv: Scalars['BigInt']['output'];
  /** Point in time total bdv of all `underlyingToken` that has been received from chopping */
  totalChoppedBdvReceived: Scalars['BigInt']['output'];
  /** Point in time total amount of `underlyingToken` for this unripe token (getTotalUnderlying) */
  totalUnderlying: Scalars['BigInt']['output'];
  /** Point in time ripe token underlying this unripe asset */
  underlyingToken: WhitelistTokenSetting;
  /** Unripe token associated with this snapshot */
  unripeToken: UnripeToken;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type UnripeTokenHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<UnripeTokenHourlySnapshot_Filter>>>;
  bdvUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bdvUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chopRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chopRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  choppableAmountOne?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableAmountOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableBdvOne?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableBdvOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAmountUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAmountUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAmountUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdvUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdvUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdvUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChopRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaChopRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaChopRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaChoppableAmountOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChoppableAmountOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableAmountOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChoppableBdvOne?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaChoppableBdvOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaChoppableBdvOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRecapPercent?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaRecapPercent_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaRecapPercent_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTotalChoppedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdvReceived_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdvReceived_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalChoppedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalChoppedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalUnderlying?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalUnderlying_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalUnderlying_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnderlyingToken?: InputMaybe<Scalars['Boolean']['input']>;
  deltaUnderlyingToken_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaUnderlyingToken_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaUnderlyingToken_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UnripeTokenHourlySnapshot_Filter>>>;
  recapPercent?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  recapPercent_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalChoppedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdvReceived_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlying?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlying_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingToken?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_?: InputMaybe<WhitelistTokenSetting_Filter>;
  underlyingToken_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_lt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_lte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken?: InputMaybe<Scalars['String']['input']>;
  unripeToken_?: InputMaybe<UnripeToken_Filter>;
  unripeToken_contains?: InputMaybe<Scalars['String']['input']>;
  unripeToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_gt?: InputMaybe<Scalars['String']['input']>;
  unripeToken_gte?: InputMaybe<Scalars['String']['input']>;
  unripeToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unripeToken_lt?: InputMaybe<Scalars['String']['input']>;
  unripeToken_lte?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unripeToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unripeToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  unripeToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum UnripeTokenHourlySnapshot_OrderBy {
  AmountUnderlyingOne = 'amountUnderlyingOne',
  BdvUnderlyingOne = 'bdvUnderlyingOne',
  ChopRate = 'chopRate',
  ChoppableAmountOne = 'choppableAmountOne',
  ChoppableBdvOne = 'choppableBdvOne',
  CreatedAt = 'createdAt',
  DeltaAmountUnderlyingOne = 'deltaAmountUnderlyingOne',
  DeltaBdvUnderlyingOne = 'deltaBdvUnderlyingOne',
  DeltaChopRate = 'deltaChopRate',
  DeltaChoppableAmountOne = 'deltaChoppableAmountOne',
  DeltaChoppableBdvOne = 'deltaChoppableBdvOne',
  DeltaRecapPercent = 'deltaRecapPercent',
  DeltaTotalChoppedAmount = 'deltaTotalChoppedAmount',
  DeltaTotalChoppedBdv = 'deltaTotalChoppedBdv',
  DeltaTotalChoppedBdvReceived = 'deltaTotalChoppedBdvReceived',
  DeltaTotalUnderlying = 'deltaTotalUnderlying',
  DeltaUnderlyingToken = 'deltaUnderlyingToken',
  Id = 'id',
  RecapPercent = 'recapPercent',
  Season = 'season',
  TotalChoppedAmount = 'totalChoppedAmount',
  TotalChoppedBdv = 'totalChoppedBdv',
  TotalChoppedBdvReceived = 'totalChoppedBdvReceived',
  TotalUnderlying = 'totalUnderlying',
  UnderlyingToken = 'underlyingToken',
  UnderlyingTokenDecimals = 'underlyingToken__decimals',
  UnderlyingTokenGaugePoints = 'underlyingToken__gaugePoints',
  UnderlyingTokenId = 'underlyingToken__id',
  UnderlyingTokenIsGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  UnderlyingTokenLastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  UnderlyingTokenLastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  UnderlyingTokenMilestoneSeason = 'underlyingToken__milestoneSeason',
  UnderlyingTokenOptimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  UnderlyingTokenSelector = 'underlyingToken__selector',
  UnderlyingTokenStalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  UnderlyingTokenStalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  UnderlyingTokenUpdatedAt = 'underlyingToken__updatedAt',
  UnripeToken = 'unripeToken',
  UnripeTokenAmountUnderlyingOne = 'unripeToken__amountUnderlyingOne',
  UnripeTokenBdvUnderlyingOne = 'unripeToken__bdvUnderlyingOne',
  UnripeTokenChopRate = 'unripeToken__chopRate',
  UnripeTokenChoppableAmountOne = 'unripeToken__choppableAmountOne',
  UnripeTokenChoppableBdvOne = 'unripeToken__choppableBdvOne',
  UnripeTokenId = 'unripeToken__id',
  UnripeTokenLastDailySnapshotDay = 'unripeToken__lastDailySnapshotDay',
  UnripeTokenLastHourlySnapshotSeason = 'unripeToken__lastHourlySnapshotSeason',
  UnripeTokenRecapPercent = 'unripeToken__recapPercent',
  UnripeTokenTotalChoppedAmount = 'unripeToken__totalChoppedAmount',
  UnripeTokenTotalChoppedBdv = 'unripeToken__totalChoppedBdv',
  UnripeTokenTotalChoppedBdvReceived = 'unripeToken__totalChoppedBdvReceived',
  UnripeTokenTotalUnderlying = 'unripeToken__totalUnderlying',
  UpdatedAt = 'updatedAt'
}

export type UnripeToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<UnripeToken_Filter>>>;
  bdvUnderlyingOne?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bdvUnderlyingOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  bdvUnderlyingOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chopRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  chopRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  chopRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  choppableAmountOne?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableAmountOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  choppableAmountOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableBdvOne?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_gt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_gte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  choppableBdvOne_lt?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_lte?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_not?: InputMaybe<Scalars['BigInt']['input']>;
  choppableBdvOne_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailySnapshots_?: InputMaybe<UnripeTokenDailySnapshot_Filter>;
  hourlySnapshots_?: InputMaybe<UnripeTokenHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UnripeToken_Filter>>>;
  recapPercent?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  recapPercent_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  recapPercent_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalChoppedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdvReceived_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdvReceived_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalChoppedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalChoppedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlying?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalUnderlying_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalUnderlying_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingToken?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_?: InputMaybe<WhitelistTokenSetting_Filter>;
  underlyingToken_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_gte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_lt?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_lte?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum UnripeToken_OrderBy {
  AmountUnderlyingOne = 'amountUnderlyingOne',
  BdvUnderlyingOne = 'bdvUnderlyingOne',
  ChopRate = 'chopRate',
  ChoppableAmountOne = 'choppableAmountOne',
  ChoppableBdvOne = 'choppableBdvOne',
  DailySnapshots = 'dailySnapshots',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  RecapPercent = 'recapPercent',
  TotalChoppedAmount = 'totalChoppedAmount',
  TotalChoppedBdv = 'totalChoppedBdv',
  TotalChoppedBdvReceived = 'totalChoppedBdvReceived',
  TotalUnderlying = 'totalUnderlying',
  UnderlyingToken = 'underlyingToken',
  UnderlyingTokenDecimals = 'underlyingToken__decimals',
  UnderlyingTokenGaugePoints = 'underlyingToken__gaugePoints',
  UnderlyingTokenId = 'underlyingToken__id',
  UnderlyingTokenIsGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  UnderlyingTokenLastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  UnderlyingTokenLastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  UnderlyingTokenMilestoneSeason = 'underlyingToken__milestoneSeason',
  UnderlyingTokenOptimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  UnderlyingTokenSelector = 'underlyingToken__selector',
  UnderlyingTokenStalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  UnderlyingTokenStalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  UnderlyingTokenUpdatedAt = 'underlyingToken__updatedAt'
}

export type Version = {
  __typename?: 'Version';
  /** Which blockchain is being indexed, i.e. 'ethereum', 'arbitrum', etc. */
  chain: Scalars['String']['output'];
  /** = 'subgraph' */
  id: Scalars['ID']['output'];
  /** Address of Beanstalk protocol */
  protocolAddress: Scalars['Bytes']['output'];
  /** = 'beanstalk' */
  subgraphName: Scalars['String']['output'];
  /** Verison number of the subgraph */
  versionNumber: Scalars['String']['output'];
};

export type Version_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  chain?: InputMaybe<Scalars['String']['input']>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with?: InputMaybe<Scalars['String']['input']>;
  chain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Version_Filter>>>;
  protocolAddress?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  protocolAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  protocolAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subgraphName?: InputMaybe<Scalars['String']['input']>;
  subgraphName_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphName_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphName_gt?: InputMaybe<Scalars['String']['input']>;
  subgraphName_gte?: InputMaybe<Scalars['String']['input']>;
  subgraphName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphName_lt?: InputMaybe<Scalars['String']['input']>;
  subgraphName_lte?: InputMaybe<Scalars['String']['input']>;
  subgraphName_not?: InputMaybe<Scalars['String']['input']>;
  subgraphName_not_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphName_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  versionNumber?: InputMaybe<Scalars['String']['input']>;
  versionNumber_contains?: InputMaybe<Scalars['String']['input']>;
  versionNumber_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  versionNumber_ends_with?: InputMaybe<Scalars['String']['input']>;
  versionNumber_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  versionNumber_gt?: InputMaybe<Scalars['String']['input']>;
  versionNumber_gte?: InputMaybe<Scalars['String']['input']>;
  versionNumber_in?: InputMaybe<Array<Scalars['String']['input']>>;
  versionNumber_lt?: InputMaybe<Scalars['String']['input']>;
  versionNumber_lte?: InputMaybe<Scalars['String']['input']>;
  versionNumber_not?: InputMaybe<Scalars['String']['input']>;
  versionNumber_not_contains?: InputMaybe<Scalars['String']['input']>;
  versionNumber_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  versionNumber_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  versionNumber_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  versionNumber_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  versionNumber_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  versionNumber_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  versionNumber_starts_with?: InputMaybe<Scalars['String']['input']>;
  versionNumber_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Version_OrderBy {
  Chain = 'chain',
  Id = 'id',
  ProtocolAddress = 'protocolAddress',
  SubgraphName = 'subgraphName',
  VersionNumber = 'versionNumber'
}

export type WhitelistTokenDailySnapshot = {
  __typename?: 'WhitelistTokenDailySnapshot';
  /** Point in time daily bdv */
  bdv?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaBdv?: Maybe<Scalars['BigInt']['output']>;
  deltaGaugePoints?: Maybe<Scalars['BigInt']['output']>;
  deltaIsGaugeEnabled: Scalars['Boolean']['output'];
  deltaMilestoneSeason: Scalars['Int']['output'];
  deltaOptimalPercentDepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  deltaStalkEarnedPerSeason: Scalars['BigInt']['output'];
  deltaStalkIssuedPerBdv: Scalars['BigInt']['output'];
  /** [Seed Gauge] Current Gauge Points */
  gaugePoints?: Maybe<Scalars['BigInt']['output']>;
  /** Token address - Day */
  id: Scalars['ID']['output'];
  /** Whether the seed gauge is enabled on this whitelisted token */
  isGaugeEnabled: Scalars['Boolean']['output'];
  /** The last season in which the stalkEarnedPerSeason for this token was updated. */
  milestoneSeason: Scalars['Int']['output'];
  /** [Seed Gauge] The current optimal targeted distribution of BDV for this whitelisted asset */
  optimalPercentDepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  /** The season for this snapshot */
  season: Scalars['Int']['output'];
  /** Encoded BDV selector */
  selector: Scalars['Bytes']['output'];
  /** Represents how much Stalk one BDV of the underlying deposited token grows each season. */
  stalkEarnedPerSeason: Scalars['BigInt']['output'];
  /** The stalk per BDV that the silo grants in exchange for depositing this token. */
  stalkIssuedPerBdv: Scalars['BigInt']['output'];
  /** WhitelistTokenSetting associated with this snapshot */
  token: WhitelistTokenSetting;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type WhitelistTokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WhitelistTokenDailySnapshot_Filter>>>;
  bdv?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGaugePoints?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGaugePoints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaIsGaugeEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  deltaIsGaugeEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaIsGaugeEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaIsGaugeEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaMilestoneSeason?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaMilestoneSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_not?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaOptimalPercentDepositedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaOptimalPercentDepositedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkEarnedPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkEarnedPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkIssuedPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkIssuedPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gaugePoints?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gaugePoints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_not?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isGaugeEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isGaugeEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isGaugeEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isGaugeEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  milestoneSeason?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  milestoneSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_not?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  optimalPercentDepositedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimalPercentDepositedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WhitelistTokenDailySnapshot_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  selector?: InputMaybe<Scalars['Bytes']['input']>;
  selector_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  selector_lt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_lte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stalkEarnedPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkEarnedPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkIssuedPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkIssuedPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<WhitelistTokenSetting_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum WhitelistTokenDailySnapshot_OrderBy {
  Bdv = 'bdv',
  CreatedAt = 'createdAt',
  DeltaBdv = 'deltaBdv',
  DeltaGaugePoints = 'deltaGaugePoints',
  DeltaIsGaugeEnabled = 'deltaIsGaugeEnabled',
  DeltaMilestoneSeason = 'deltaMilestoneSeason',
  DeltaOptimalPercentDepositedBdv = 'deltaOptimalPercentDepositedBdv',
  DeltaStalkEarnedPerSeason = 'deltaStalkEarnedPerSeason',
  DeltaStalkIssuedPerBdv = 'deltaStalkIssuedPerBdv',
  GaugePoints = 'gaugePoints',
  Id = 'id',
  IsGaugeEnabled = 'isGaugeEnabled',
  MilestoneSeason = 'milestoneSeason',
  OptimalPercentDepositedBdv = 'optimalPercentDepositedBdv',
  Season = 'season',
  Selector = 'selector',
  StalkEarnedPerSeason = 'stalkEarnedPerSeason',
  StalkIssuedPerBdv = 'stalkIssuedPerBdv',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenGaugePoints = 'token__gaugePoints',
  TokenId = 'token__id',
  TokenIsGaugeEnabled = 'token__isGaugeEnabled',
  TokenLastDailySnapshotDay = 'token__lastDailySnapshotDay',
  TokenLastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  TokenMilestoneSeason = 'token__milestoneSeason',
  TokenOptimalPercentDepositedBdv = 'token__optimalPercentDepositedBdv',
  TokenSelector = 'token__selector',
  TokenStalkEarnedPerSeason = 'token__stalkEarnedPerSeason',
  TokenStalkIssuedPerBdv = 'token__stalkIssuedPerBdv',
  TokenUpdatedAt = 'token__updatedAt',
  UpdatedAt = 'updatedAt'
}

export type WhitelistTokenHourlySnapshot = {
  __typename?: 'WhitelistTokenHourlySnapshot';
  /** Point in time hourly bdv */
  bdv?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaBdv?: Maybe<Scalars['BigInt']['output']>;
  deltaGaugePoints?: Maybe<Scalars['BigInt']['output']>;
  deltaIsGaugeEnabled: Scalars['Boolean']['output'];
  deltaMilestoneSeason: Scalars['Int']['output'];
  deltaOptimalPercentDepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  deltaStalkEarnedPerSeason: Scalars['BigInt']['output'];
  deltaStalkIssuedPerBdv: Scalars['BigInt']['output'];
  /** [Seed Gauge] Current Gauge Points */
  gaugePoints?: Maybe<Scalars['BigInt']['output']>;
  /** Token address - Season */
  id: Scalars['ID']['output'];
  /** Whether the seed gauge is enabled on this whitelisted token */
  isGaugeEnabled: Scalars['Boolean']['output'];
  /** The last season in which the stalkEarnedPerSeason for this token was updated. */
  milestoneSeason: Scalars['Int']['output'];
  /** [Seed Gauge] The current optimal targeted distribution of BDV for this whitelisted asset */
  optimalPercentDepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  /** The season for this snapshot */
  season: Scalars['Int']['output'];
  /** Encoded BDV selector */
  selector: Scalars['Bytes']['output'];
  /** Represents how much Stalk one BDV of the underlying deposited token grows each season. */
  stalkEarnedPerSeason: Scalars['BigInt']['output'];
  /** The stalk per BDV that the silo grants in exchange for depositing this token. */
  stalkIssuedPerBdv: Scalars['BigInt']['output'];
  /** WhitelistTokenSetting associated with this snapshot */
  token: WhitelistTokenSetting;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type WhitelistTokenHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WhitelistTokenHourlySnapshot_Filter>>>;
  bdv?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  bdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGaugePoints?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaGaugePoints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaGaugePoints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaIsGaugeEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  deltaIsGaugeEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaIsGaugeEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaIsGaugeEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaMilestoneSeason?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaMilestoneSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_not?: InputMaybe<Scalars['Int']['input']>;
  deltaMilestoneSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaOptimalPercentDepositedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaOptimalPercentDepositedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaOptimalPercentDepositedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkEarnedPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkEarnedPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkEarnedPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkIssuedPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStalkIssuedPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStalkIssuedPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gaugePoints?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gaugePoints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_not?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isGaugeEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isGaugeEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isGaugeEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isGaugeEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  milestoneSeason?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  milestoneSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_not?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  optimalPercentDepositedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimalPercentDepositedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WhitelistTokenHourlySnapshot_Filter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  selector?: InputMaybe<Scalars['Bytes']['input']>;
  selector_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  selector_lt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_lte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stalkEarnedPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkEarnedPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkIssuedPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkIssuedPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<WhitelistTokenSetting_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum WhitelistTokenHourlySnapshot_OrderBy {
  Bdv = 'bdv',
  CreatedAt = 'createdAt',
  DeltaBdv = 'deltaBdv',
  DeltaGaugePoints = 'deltaGaugePoints',
  DeltaIsGaugeEnabled = 'deltaIsGaugeEnabled',
  DeltaMilestoneSeason = 'deltaMilestoneSeason',
  DeltaOptimalPercentDepositedBdv = 'deltaOptimalPercentDepositedBdv',
  DeltaStalkEarnedPerSeason = 'deltaStalkEarnedPerSeason',
  DeltaStalkIssuedPerBdv = 'deltaStalkIssuedPerBdv',
  GaugePoints = 'gaugePoints',
  Id = 'id',
  IsGaugeEnabled = 'isGaugeEnabled',
  MilestoneSeason = 'milestoneSeason',
  OptimalPercentDepositedBdv = 'optimalPercentDepositedBdv',
  Season = 'season',
  Selector = 'selector',
  StalkEarnedPerSeason = 'stalkEarnedPerSeason',
  StalkIssuedPerBdv = 'stalkIssuedPerBdv',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenGaugePoints = 'token__gaugePoints',
  TokenId = 'token__id',
  TokenIsGaugeEnabled = 'token__isGaugeEnabled',
  TokenLastDailySnapshotDay = 'token__lastDailySnapshotDay',
  TokenLastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  TokenMilestoneSeason = 'token__milestoneSeason',
  TokenOptimalPercentDepositedBdv = 'token__optimalPercentDepositedBdv',
  TokenSelector = 'token__selector',
  TokenStalkEarnedPerSeason = 'token__stalkEarnedPerSeason',
  TokenStalkIssuedPerBdv = 'token__stalkIssuedPerBdv',
  TokenUpdatedAt = 'token__updatedAt',
  UpdatedAt = 'updatedAt'
}

export type WhitelistTokenSetting = {
  __typename?: 'WhitelistTokenSetting';
  /** Link to daily snapshot data */
  dailySnapshots: Array<WhitelistTokenDailySnapshot>;
  /** Number of decimals in this token */
  decimals: Scalars['Int']['output'];
  /** [Seed Gauge] Current Gauge Points */
  gaugePoints?: Maybe<Scalars['BigInt']['output']>;
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<WhitelistTokenHourlySnapshot>;
  /** Contract address for the whitelisted token */
  id: Scalars['Bytes']['output'];
  /** Whether the seed gauge is enabled on this whitelisted token */
  isGaugeEnabled: Scalars['Boolean']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** The last season in which the stalkEarnedPerSeason for this token was updated. */
  milestoneSeason: Scalars['Int']['output'];
  /** [Seed Gauge] The current optimal targeted distribution of BDV for this whitelisted asset */
  optimalPercentDepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  /** Encoded BDV selector */
  selector: Scalars['Bytes']['output'];
  /** Represents how much Stalk one BDV of the underlying deposited token grows each season. */
  stalkEarnedPerSeason: Scalars['BigInt']['output'];
  /** The stalk per BDV that the silo grants in exchange for depositing this token. */
  stalkIssuedPerBdv: Scalars['BigInt']['output'];
  /** Last timestamp entity was updated */
  updatedAt: Scalars['BigInt']['output'];
};


export type WhitelistTokenSettingDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WhitelistTokenDailySnapshot_Filter>;
};


export type WhitelistTokenSettingHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WhitelistTokenHourlySnapshot_Filter>;
};

export type WhitelistTokenSetting_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WhitelistTokenSetting_Filter>>>;
  dailySnapshots_?: InputMaybe<WhitelistTokenDailySnapshot_Filter>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  gaugePoints?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gaugePoints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_not?: InputMaybe<Scalars['BigInt']['input']>;
  gaugePoints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlySnapshots_?: InputMaybe<WhitelistTokenHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  isGaugeEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isGaugeEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isGaugeEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isGaugeEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  milestoneSeason?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  milestoneSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_not?: InputMaybe<Scalars['Int']['input']>;
  milestoneSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  optimalPercentDepositedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  optimalPercentDepositedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  optimalPercentDepositedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WhitelistTokenSetting_Filter>>>;
  selector?: InputMaybe<Scalars['Bytes']['input']>;
  selector_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_gte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  selector_lt?: InputMaybe<Scalars['Bytes']['input']>;
  selector_lte?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  selector_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stalkEarnedPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkEarnedPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalkEarnedPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkIssuedPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stalkIssuedPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  stalkIssuedPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum WhitelistTokenSetting_OrderBy {
  DailySnapshots = 'dailySnapshots',
  Decimals = 'decimals',
  GaugePoints = 'gaugePoints',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  IsGaugeEnabled = 'isGaugeEnabled',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  MilestoneSeason = 'milestoneSeason',
  OptimalPercentDepositedBdv = 'optimalPercentDepositedBdv',
  Selector = 'selector',
  StalkEarnedPerSeason = 'stalkEarnedPerSeason',
  StalkIssuedPerBdv = 'stalkIssuedPerBdv',
  UpdatedAt = 'updatedAt'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type AllPodListingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<MarketStatus>;
  maxHarvestableIndex: Scalars['BigInt']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllPodListingsQuery = { __typename?: 'Query', podListings: Array<{ __typename?: 'PodListing', id: string, historyID: string, index: any, start: any, mode: number, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxHarvestableIndex: any, minFillAmount: any, originalIndex: any, originalAmount: any, filled: any, amount: any, remainingAmount: any, filledAmount: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } }> };

export type AllPodOrdersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<MarketStatus>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllPodOrdersQuery = { __typename?: 'Query', podOrders: Array<{ __typename?: 'PodOrder', id: string, historyID: string, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxPlaceInLine: any, minFillAmount: any, beanAmount: any, podAmountFilled: any, beanAmountFilled: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } }> };

export type FarmerPlotsQueryVariables = Exact<{
  account: Scalars['ID']['input'];
}>;


export type FarmerPlotsQuery = { __typename?: 'Query', farmer?: { __typename?: 'Farmer', plots: Array<{ __typename?: 'Plot', beansPerPod: any, createdAt: any, creationHash: any, fullyHarvested: boolean, harvestablePods: any, harvestedPods: any, id: string, index: any, pods: any, season: number, source: PlotSource, sourceHash: any, updatedAt: any, updatedAtBlock: any, listing?: { __typename?: 'PodListing', amount: any, createdAt: any, creationHash: any, filled: any, filledAmount: any, historyID: string, id: string, index: any, maxHarvestableIndex: any, minFillAmount: any, mode: number, originalAmount: any, originalIndex: any, pricePerPod: number, pricingFunction?: any | null, pricingType?: number | null, remainingAmount: any, start: any, status: MarketStatus, updatedAt: any } | null }>, orders: Array<{ __typename?: 'PodOrder', beanAmount: any, beanAmountFilled: any, createdAt: any, creationHash: any, historyID: string, id: string, maxPlaceInLine: any, minFillAmount: any, podAmountFilled: any, pricePerPod: number, pricingFunction?: any | null, pricingType?: number | null, status: MarketStatus, updatedAt: any }>, listings: Array<{ __typename?: 'PodListing', amount: any, creationHash: any, createdAt: any, filled: any, filledAmount: any, historyID: string, id: string, index: any, maxHarvestableIndex: any, minFillAmount: any, mode: number, originalAmount: any, originalIndex: any, pricePerPod: number, pricingFunction?: any | null, pricingType?: number | null, remainingAmount: any, start: any, status: MarketStatus, updatedAt: any }> } | null };

export type FarmerPodListingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  account: Scalars['String']['input'];
}>;


export type FarmerPodListingsQuery = { __typename?: 'Query', podListings: Array<{ __typename?: 'PodListing', id: string, historyID: string, index: any, start: any, mode: number, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxHarvestableIndex: any, minFillAmount: any, originalIndex: any, originalAmount: any, filled: any, amount: any, remainingAmount: any, filledAmount: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } }> };

export type FarmerPodOrdersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  account: Scalars['String']['input'];
}>;


export type FarmerPodOrdersQuery = { __typename?: 'Query', podOrders: Array<{ __typename?: 'PodOrder', id: string, historyID: string, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxPlaceInLine: any, minFillAmount: any, beanAmount: any, podAmountFilled: any, beanAmountFilled: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } }> };

export type FarmerSiloBalancesQueryVariables = Exact<{
  account: Scalars['ID']['input'];
  season: Scalars['Int']['input'];
}>;


export type FarmerSiloBalancesQuery = { __typename?: 'Query', farmer?: { __typename?: 'Farmer', deposited: Array<{ __typename?: 'SiloDeposit', season?: number | null, stem?: any | null, token: any, depositedAmount: any, depositedBDV: any }>, withdrawn: Array<{ __typename?: 'SiloWithdraw', token: any, amount: any, season: number }>, claimable: Array<{ __typename?: 'SiloWithdraw', token: any, amount: any, season: number }> } | null };

export type FieldSnapshotsQueryVariables = Exact<{
  fieldId: Scalars['Bytes']['input'];
  first: Scalars['Int']['input'];
}>;


export type FieldSnapshotsQuery = { __typename?: 'Query', fieldHourlySnapshots: Array<{ __typename?: 'FieldHourlySnapshot', blocksToSoldOutSoil?: any | null, caseId?: any | null, deltaHarvestablePods: any, deltaHarvestedPods: any, deltaIssuedSoil: any, deltaNumberOfSowers: number, deltaNumberOfSows: number, deltaPodIndex: any, deltaPodRate: any, deltaRealRateOfReturn: any, deltaSoil: any, deltaSownBeans: any, deltaTemperature: number, deltaUnharvestablePods: any, harvestablePods: any, harvestedPods: any, id: string, issuedSoil: any, numberOfSowers: number, numberOfSows: number, podIndex: any, podRate: any, realRateOfReturn: any, season: number, seasonBlock: any, soil: any, soilSoldOut: boolean, sownBeans: any, temperature: number, unharvestablePods: any, updatedAt: any }> };

export type PodListingFragment = { __typename?: 'PodListing', id: string, historyID: string, index: any, start: any, mode: number, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxHarvestableIndex: any, minFillAmount: any, originalIndex: any, originalAmount: any, filled: any, amount: any, remainingAmount: any, filledAmount: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } };

export type PodOrderFragment = { __typename?: 'PodOrder', id: string, historyID: string, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxPlaceInLine: any, minFillAmount: any, beanAmount: any, podAmountFilled: any, beanAmountFilled: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } };

export type SiloSnapshotsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
}>;


export type SiloSnapshotsQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', deltaBeanMints: any, season: number }> };

export type SiloYieldsQueryVariables = Exact<{ [key: string]: never; }>;


export type SiloYieldsQuery = { __typename?: 'Query', siloYields: Array<{ __typename?: 'SiloYield', beansPerSeasonEMA: any, beta: any, createdAt: any, season: number, id: string, u: number, whitelistedTokens: Array<any>, emaWindow: EmaWindow, tokenAPYS: Array<{ __typename?: 'TokenYield', beanAPY: any, stalkAPY: any, season: number, createdAt: any, token: any }> }> };

export const PodListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<PodListingFragment, unknown>;
export const PodOrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<PodOrderFragment, unknown>;
export const AllPodListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPodListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketStatus"}},"defaultValue":{"kind":"EnumValue","value":"ACTIVE"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxHarvestableIndex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podListings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"maxHarvestableIndex_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxHarvestableIndex"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"remainingAmount_gt"},"value":{"kind":"StringValue","value":"100000","block":false}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"index"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodListing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<AllPodListingsQuery, AllPodListingsQueryVariables>;
export const AllPodOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPodOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketStatus"}},"defaultValue":{"kind":"EnumValue","value":"ACTIVE"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"createdAt"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodOrder"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<AllPodOrdersQuery, AllPodOrdersQueryVariables>;
export const FarmerPlotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerPlots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"farmer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pods_gt"},"value":{"kind":"StringValue","value":"50","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"fullyHarvested"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"index"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beansPerPod"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}},{"kind":"Field","name":{"kind":"Name","value":"fullyHarvested"}},{"kind":"Field","name":{"kind":"Name","value":"harvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"pods"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceHash"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAtBlock"}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"EnumValue","value":"ACTIVE"}},{"kind":"ObjectField","name":{"kind":"Name","value":"beanAmount_gt"},"value":{"kind":"StringValue","value":"50","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"EnumValue","value":"ACTIVE"}},{"kind":"ObjectField","name":{"kind":"Name","value":"amount_gt"},"value":{"kind":"StringValue","value":"50","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<FarmerPlotsQuery, FarmerPlotsQueryVariables>;
export const FarmerPodListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerPodListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podListings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdAt_gt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"farmer_contains_nocase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"status_not"},"value":{"kind":"EnumValue","value":"FILLED_PARTIAL"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodListing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<FarmerPodListingsQuery, FarmerPodListingsQueryVariables>;
export const FarmerPodOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerPodOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"createdAt"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"farmer_contains_nocase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdAt_gt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodOrder"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<FarmerPodOrdersQuery, FarmerPodOrdersQueryVariables>;
export const FarmerSiloBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerSiloBalances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"season"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"farmer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deposited"},"name":{"kind":"Name","value":"deposits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"depositedAmount_gt"},"value":{"kind":"IntValue","value":"0"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"stem"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"depositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withdrawn"},"name":{"kind":"Name","value":"withdraws"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"withdrawSeason"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"claimableSeason_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"season"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"claimed"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"season"},"name":{"kind":"Name","value":"withdrawSeason"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"claimable"},"name":{"kind":"Name","value":"withdraws"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"withdrawSeason"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"claimableSeason_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"season"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"claimed"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"season"},"name":{"kind":"Name","value":"withdrawSeason"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]} as unknown as DocumentNode<FarmerSiloBalancesQuery, FarmerSiloBalancesQueryVariables>;
export const FieldSnapshotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FieldSnapshots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bytes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field_"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blocksToSoldOutSoil"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}},{"kind":"Field","name":{"kind":"Name","value":"deltaHarvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"deltaHarvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"deltaIssuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaNumberOfSowers"}},{"kind":"Field","name":{"kind":"Name","value":"deltaNumberOfSows"}},{"kind":"Field","name":{"kind":"Name","value":"deltaPodIndex"}},{"kind":"Field","name":{"kind":"Name","value":"deltaPodRate"}},{"kind":"Field","name":{"kind":"Name","value":"deltaRealRateOfReturn"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"deltaUnharvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSowers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSows"}},{"kind":"Field","name":{"kind":"Name","value":"podIndex"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"realRateOfReturn"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"seasonBlock"}},{"kind":"Field","name":{"kind":"Name","value":"soil"}},{"kind":"Field","name":{"kind":"Name","value":"soilSoldOut"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"unharvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FieldSnapshotsQuery, FieldSnapshotsQueryVariables>;
export const SiloSnapshotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SiloSnapshots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deltaBeanMints"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}}]}}]} as unknown as DocumentNode<SiloSnapshotsQuery, SiloSnapshotsQueryVariables>;
export const SiloYieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SiloYields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloYields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"emaWindow"},"value":{"kind":"EnumValue","value":"ROLLING_30_DAY"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beansPerSeasonEMA"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"u"}},{"kind":"Field","name":{"kind":"Name","value":"whitelistedTokens"}},{"kind":"Field","name":{"kind":"Name","value":"emaWindow"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAPYS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beanAPY"}},{"kind":"Field","name":{"kind":"Name","value":"stalkAPY"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]}}]} as unknown as DocumentNode<SiloYieldsQuery, SiloYieldsQueryVariables>;