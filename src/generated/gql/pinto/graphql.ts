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
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** Peg cross references */
  crossEvents: Array<BeanCross>;
  /** Cumulative number of peg crosses */
  crosses: Scalars['Int']['output'];
  /** Current Beanstalk season */
  currentSeason: Season;
  dailySnapshots: Array<BeanDailySnapshot>;
  /** Dewhitelisted pools having Bean */
  dewhitelistedPools: Array<Pool>;
  hourlySnapshots: Array<BeanHourlySnapshot>;
  /** Contract address of the Bean token */
  id: Scalars['Bytes']['output'];
  /** Last timestamp a peg cross occurred */
  lastCross: Scalars['BigInt']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['Int']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** * The last recorded bean price. Updated upon a trade, a peg cross, or sunrise. May not be useful for external use as accuracy is not guaranteed. */
  lastPrice: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Total liquidity trading against this Bean */
  liquidityUSD: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): Not relevant to Pinto. // Amount of the supply which is considered Locked Beans (untradeable due to chop rate) */
  lockedBeans: Scalars['BigInt']['output'];
  /** Whitelisted pools having Bean */
  pools: Array<Pool>;
  /** Current bean supply */
  supply: Scalars['BigInt']['output'];
  /** Percent of supply in LP used for peg maintenance */
  supplyInPegLP: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): See basin subgraph instead // Exchange volume in bean */
  volume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Exchange volume in USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type BeanCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanCross_Filter>;
};


export type BeanDailySnapshotsArgs = {
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


export type BeanHourlySnapshotsArgs = {
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
  /** Whether this cross was above or below peg */
  above: Scalars['Boolean']['output'];
  /** The Bean for which this cross occurred */
  bean: Bean;
  /** Daily snapshot for this cross */
  beanDailySnapshot: BeanDailySnapshot;
  /** Hourly snapshot for this cross */
  beanHourlySnapshot: BeanHourlySnapshot;
  /** Block number when this cross was identified */
  blockNumber: Scalars['BigInt']['output'];
  /** Cross number (int) */
  cross: Scalars['Int']['output'];
  /** Cross number (string) */
  id: Scalars['ID']['output'];
  /** The price of bean at the time this cross occurred */
  price: Scalars['BigDecimal']['output'];
  /** Time elapsed since the previous cross */
  timeSinceLastCross: Scalars['BigInt']['output'];
  /** Timestamp when this cross was identified */
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
  beanDailySnapshot?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_?: InputMaybe<BeanDailySnapshot_Filter>;
  beanDailySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanDailySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanDailySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_?: InputMaybe<BeanHourlySnapshot_Filter>;
  beanHourlySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanHourlySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  beanHourlySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  beanHourlySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  cross?: InputMaybe<Scalars['Int']['input']>;
  cross_gt?: InputMaybe<Scalars['Int']['input']>;
  cross_gte?: InputMaybe<Scalars['Int']['input']>;
  cross_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cross_lt?: InputMaybe<Scalars['Int']['input']>;
  cross_lte?: InputMaybe<Scalars['Int']['input']>;
  cross_not?: InputMaybe<Scalars['Int']['input']>;
  cross_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  BeanDailySnapshot = 'beanDailySnapshot',
  BeanDailySnapshotCreatedTimestamp = 'beanDailySnapshot__createdTimestamp',
  BeanDailySnapshotCrosses = 'beanDailySnapshot__crosses',
  BeanDailySnapshotDay = 'beanDailySnapshot__day',
  BeanDailySnapshotDeltaCrosses = 'beanDailySnapshot__deltaCrosses',
  BeanDailySnapshotDeltaLiquidityUsd = 'beanDailySnapshot__deltaLiquidityUSD',
  BeanDailySnapshotDeltaVolume = 'beanDailySnapshot__deltaVolume',
  BeanDailySnapshotDeltaVolumeUsd = 'beanDailySnapshot__deltaVolumeUSD',
  BeanDailySnapshotId = 'beanDailySnapshot__id',
  BeanDailySnapshotInstDeltaB = 'beanDailySnapshot__instDeltaB',
  BeanDailySnapshotInstPrice = 'beanDailySnapshot__instPrice',
  BeanDailySnapshotL2sr = 'beanDailySnapshot__l2sr',
  BeanDailySnapshotLastUpdateBlockNumber = 'beanDailySnapshot__lastUpdateBlockNumber',
  BeanDailySnapshotLastUpdateTimestamp = 'beanDailySnapshot__lastUpdateTimestamp',
  BeanDailySnapshotLiquidityUsd = 'beanDailySnapshot__liquidityUSD',
  BeanDailySnapshotLockedBeans = 'beanDailySnapshot__lockedBeans',
  BeanDailySnapshotMarketCap = 'beanDailySnapshot__marketCap',
  BeanDailySnapshotSupply = 'beanDailySnapshot__supply',
  BeanDailySnapshotSupplyInPegLp = 'beanDailySnapshot__supplyInPegLP',
  BeanDailySnapshotTwaBeanLiquidityUsd = 'beanDailySnapshot__twaBeanLiquidityUSD',
  BeanDailySnapshotTwaDeltaB = 'beanDailySnapshot__twaDeltaB',
  BeanDailySnapshotTwaLiquidityUsd = 'beanDailySnapshot__twaLiquidityUSD',
  BeanDailySnapshotTwaNonBeanLiquidityUsd = 'beanDailySnapshot__twaNonBeanLiquidityUSD',
  BeanDailySnapshotTwaPrice = 'beanDailySnapshot__twaPrice',
  BeanDailySnapshotVolume = 'beanDailySnapshot__volume',
  BeanDailySnapshotVolumeUsd = 'beanDailySnapshot__volumeUSD',
  BeanHourlySnapshot = 'beanHourlySnapshot',
  BeanHourlySnapshotCreatedTimestamp = 'beanHourlySnapshot__createdTimestamp',
  BeanHourlySnapshotCrosses = 'beanHourlySnapshot__crosses',
  BeanHourlySnapshotDeltaCrosses = 'beanHourlySnapshot__deltaCrosses',
  BeanHourlySnapshotDeltaLiquidityUsd = 'beanHourlySnapshot__deltaLiquidityUSD',
  BeanHourlySnapshotDeltaVolume = 'beanHourlySnapshot__deltaVolume',
  BeanHourlySnapshotDeltaVolumeUsd = 'beanHourlySnapshot__deltaVolumeUSD',
  BeanHourlySnapshotId = 'beanHourlySnapshot__id',
  BeanHourlySnapshotInstDeltaB = 'beanHourlySnapshot__instDeltaB',
  BeanHourlySnapshotInstPrice = 'beanHourlySnapshot__instPrice',
  BeanHourlySnapshotL2sr = 'beanHourlySnapshot__l2sr',
  BeanHourlySnapshotLastUpdateBlockNumber = 'beanHourlySnapshot__lastUpdateBlockNumber',
  BeanHourlySnapshotLastUpdateTimestamp = 'beanHourlySnapshot__lastUpdateTimestamp',
  BeanHourlySnapshotLiquidityUsd = 'beanHourlySnapshot__liquidityUSD',
  BeanHourlySnapshotLockedBeans = 'beanHourlySnapshot__lockedBeans',
  BeanHourlySnapshotMarketCap = 'beanHourlySnapshot__marketCap',
  BeanHourlySnapshotSeasonNumber = 'beanHourlySnapshot__seasonNumber',
  BeanHourlySnapshotSupply = 'beanHourlySnapshot__supply',
  BeanHourlySnapshotSupplyInPegLp = 'beanHourlySnapshot__supplyInPegLP',
  BeanHourlySnapshotTwaBeanLiquidityUsd = 'beanHourlySnapshot__twaBeanLiquidityUSD',
  BeanHourlySnapshotTwaDeltaB = 'beanHourlySnapshot__twaDeltaB',
  BeanHourlySnapshotTwaLiquidityUsd = 'beanHourlySnapshot__twaLiquidityUSD',
  BeanHourlySnapshotTwaNonBeanLiquidityUsd = 'beanHourlySnapshot__twaNonBeanLiquidityUSD',
  BeanHourlySnapshotTwaPrice = 'beanHourlySnapshot__twaPrice',
  BeanHourlySnapshotVolume = 'beanHourlySnapshot__volume',
  BeanHourlySnapshotVolumeUsd = 'beanHourlySnapshot__volumeUSD',
  BeanCreatedTimestamp = 'bean__createdTimestamp',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  BeanLastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  BeanLastPrice = 'bean__lastPrice',
  BeanLastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  BeanLastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  BlockNumber = 'blockNumber',
  Cross = 'cross',
  Id = 'id',
  Price = 'price',
  TimeSinceLastCross = 'timeSinceLastCross',
  Timestamp = 'timestamp'
}

export type BeanDailySnapshot = {
  __typename?: 'BeanDailySnapshot';
  bean: Bean;
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All crosses occurred in the same time period as this snapshot */
  crossEvents: Array<BeanCross>;
  /** Cumulative number of peg crosses */
  crosses: Scalars['Int']['output'];
  /** Unix day */
  day: Scalars['Int']['output'];
  /** Delta of crosses */
  deltaCrosses: Scalars['Int']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of liquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of volume */
  deltaVolume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of volumeUSD */
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Bean ID}-{Unix day} */
  id: Scalars['ID']['output'];
  /** Sum of instantaneous deltaB across all whitelisted pools at the end of the previous season */
  instDeltaB: Scalars['BigDecimal']['output'];
  /** Bean price at the end of the previous season */
  instPrice: Scalars['BigDecimal']['output'];
  /** The L2SR at the end of the previous season. [0-1] */
  l2sr: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Total liquidity trading against this Bean */
  liquidityUSD: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): Not relevant to Pinto. // Amount of the supply which is considered Locked Beans (untradeable due to chop rate) */
  lockedBeans: Scalars['BigInt']['output'];
  /** Market cap at the end of the previous season */
  marketCap: Scalars['BigDecimal']['output'];
  season: Season;
  /** Bean supply */
  supply: Scalars['BigInt']['output'];
  /** Percent of supply in LP used for peg maintenance */
  supplyInPegLP: Scalars['BigDecimal']['output'];
  /** Time-Weighted cumulative bean USD liquidity over the previous season. Sum of the same property on individual pools */
  twaBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Sum of time-weighted deltaB across all whitelisted pools over the previous season */
  twaDeltaB: Scalars['BigDecimal']['output'];
  /** Time-Weighted cumulative total USD liquidity over the previous season. Sum of the same property on individual pools */
  twaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted cumulative non-bean USD liquidity over the previous season. Sum of the same property on individual pools */
  twaNonBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted bean price over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): See basin subgraph instead // Exchange volume in bean */
  volume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Exchange volume in USD */
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
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<BeanCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  instDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  l2sr?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  l2sr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  twaBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  BeanCreatedTimestamp = 'bean__createdTimestamp',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  BeanLastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  BeanLastPrice = 'bean__lastPrice',
  BeanLastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  BeanLastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  CreatedTimestamp = 'createdTimestamp',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  Day = 'day',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  InstDeltaB = 'instDeltaB',
  InstPrice = 'instPrice',
  L2sr = 'l2sr',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LiquidityUsd = 'liquidityUSD',
  LockedBeans = 'lockedBeans',
  MarketCap = 'marketCap',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  Supply = 'supply',
  SupplyInPegLp = 'supplyInPegLP',
  TwaBeanLiquidityUsd = 'twaBeanLiquidityUSD',
  TwaDeltaB = 'twaDeltaB',
  TwaLiquidityUsd = 'twaLiquidityUSD',
  TwaNonBeanLiquidityUsd = 'twaNonBeanLiquidityUSD',
  TwaPrice = 'twaPrice',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type BeanHourlySnapshot = {
  __typename?: 'BeanHourlySnapshot';
  bean: Bean;
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All crosses occurred in the same time period as this snapshot */
  crossEvents: Array<BeanCross>;
  /** Cumulative number of peg crosses */
  crosses: Scalars['Int']['output'];
  /** Delta of crosses */
  deltaCrosses: Scalars['Int']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of liquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of volume */
  deltaVolume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of volumeUSD */
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Bean ID}-{Season} */
  id: Scalars['ID']['output'];
  /** Sum of instantaneous deltaB across all whitelisted pools at the end of the previous season */
  instDeltaB: Scalars['BigDecimal']['output'];
  /** Bean price at the end of the previous season */
  instPrice: Scalars['BigDecimal']['output'];
  /** The L2SR at the end of the previous season. [0-1] */
  l2sr: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Total liquidity trading against this Bean */
  liquidityUSD: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): Not relevant to Pinto. // Amount of the supply which is considered Locked Beans (untradeable due to chop rate) */
  lockedBeans: Scalars['BigInt']['output'];
  /** Market cap at the end of the previous season */
  marketCap: Scalars['BigDecimal']['output'];
  season: Season;
  seasonNumber: Scalars['Int']['output'];
  /** Bean supply */
  supply: Scalars['BigInt']['output'];
  /** Percent of bean supply in LP pools [0-1] */
  supplyInPegLP: Scalars['BigDecimal']['output'];
  /** Time-Weighted cumulative bean USD liquidity over the previous season. Sum of the same property on individual pools */
  twaBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Sum of time-weighted deltaB across all whitelisted pools over the previous season */
  twaDeltaB: Scalars['BigDecimal']['output'];
  /** Time-Weighted cumulative total USD liquidity over the previous season. Sum of the same property on individual pools */
  twaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted cumulative non-bean USD liquidity over the previous season. Sum of the same property on individual pools */
  twaNonBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted bean price over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): See basin subgraph instead // Exchange volume in bean */
  volume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Exchange volume in USD */
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
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  instDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  l2sr?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  l2sr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  l2sr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  season?: InputMaybe<Scalars['String']['input']>;
  seasonNumber?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  seasonNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  twaBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  BeanCreatedTimestamp = 'bean__createdTimestamp',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  BeanLastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  BeanLastPrice = 'bean__lastPrice',
  BeanLastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  BeanLastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  CreatedTimestamp = 'createdTimestamp',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  InstDeltaB = 'instDeltaB',
  InstPrice = 'instPrice',
  L2sr = 'l2sr',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LiquidityUsd = 'liquidityUSD',
  LockedBeans = 'lockedBeans',
  MarketCap = 'marketCap',
  Season = 'season',
  SeasonNumber = 'seasonNumber',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  Supply = 'supply',
  SupplyInPegLp = 'supplyInPegLP',
  TwaBeanLiquidityUsd = 'twaBeanLiquidityUSD',
  TwaDeltaB = 'twaDeltaB',
  TwaLiquidityUsd = 'twaLiquidityUSD',
  TwaNonBeanLiquidityUsd = 'twaNonBeanLiquidityUSD',
  TwaPrice = 'twaPrice',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type Bean_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Bean_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<BeanCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  currentSeason?: InputMaybe<Scalars['String']['input']>;
  currentSeason_?: InputMaybe<Season_Filter>;
  currentSeason_contains?: InputMaybe<Scalars['String']['input']>;
  currentSeason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_ends_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_gt?: InputMaybe<Scalars['String']['input']>;
  currentSeason_gte?: InputMaybe<Scalars['String']['input']>;
  currentSeason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentSeason_lt?: InputMaybe<Scalars['String']['input']>;
  currentSeason_lte?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_contains?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentSeason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_starts_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshots_?: InputMaybe<BeanDailySnapshot_Filter>;
  dewhitelistedPools?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_?: InputMaybe<Pool_Filter>;
  dewhitelistedPools_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlySnapshots_?: InputMaybe<BeanHourlySnapshot_Filter>;
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
  lastDailySnapshotDay?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<Bean_Filter>>>;
  pools?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_?: InputMaybe<Pool_Filter>;
  pools_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
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
  CreatedTimestamp = 'createdTimestamp',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  CurrentSeason = 'currentSeason',
  CurrentSeasonId = 'currentSeason__id',
  CurrentSeasonSeason = 'currentSeason__season',
  CurrentSeasonTimestamp = 'currentSeason__timestamp',
  DailySnapshots = 'dailySnapshots',
  DewhitelistedPools = 'dewhitelistedPools',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastCross = 'lastCross',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  LastPrice = 'lastPrice',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LiquidityUsd = 'liquidityUSD',
  LockedBeans = 'lockedBeans',
  Pools = 'pools',
  Supply = 'supply',
  SupplyInPegLp = 'supplyInPegLP',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type FarmerBalance = {
  __typename?: 'FarmerBalance';
  dailySnapshots: Array<FarmerBalanceDailySnapshot>;
  /** Amount of this token in farm balances */
  farmBalance: Scalars['BigInt']['output'];
  /** Farmer address */
  farmer: Scalars['Bytes']['output'];
  hourlySnapshots: Array<FarmerBalanceHourlySnapshot>;
  /** {Farmer address}-{Token address} */
  id: Scalars['ID']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['Int']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Token address */
  token: Scalars['Bytes']['output'];
  /** Amount of this token held by the farmer */
  totalBalance: Scalars['BigInt']['output'];
  /** Amount of this token in the wallet */
  walletBalance: Scalars['BigInt']['output'];
};


export type FarmerBalanceDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FarmerBalanceDailySnapshot_Filter>;
};


export type FarmerBalanceHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FarmerBalanceHourlySnapshot_Filter>;
};

export type FarmerBalanceDailySnapshot = {
  __typename?: 'FarmerBalanceDailySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** Unix day */
  day: Scalars['Int']['output'];
  /** Delta of farmBalance */
  deltaFarmBalance: Scalars['BigInt']['output'];
  /** Delta of totalBalance */
  deltaTotalBalance: Scalars['BigInt']['output'];
  /** Delta of walletBalance */
  deltaWalletBalance: Scalars['BigInt']['output'];
  /** Amount of this token in farm balances */
  farmBalance: Scalars['BigInt']['output'];
  farmerBalance: FarmerBalance;
  /** {FarmerBalance ID}-{Unix day} */
  id: Scalars['ID']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  season: Season;
  /** Amount of this token held by the farmer */
  totalBalance: Scalars['BigInt']['output'];
  /** Amount of this token in the wallet */
  walletBalance: Scalars['BigInt']['output'];
};

export type FarmerBalanceDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FarmerBalanceDailySnapshot_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaFarmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmerBalance?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_?: InputMaybe<FarmerBalance_Filter>;
  farmerBalance_contains?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_gt?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_gte?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmerBalance_lt?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_lte?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmerBalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FarmerBalanceDailySnapshot_Filter>>>;
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalBalance?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FarmerBalanceDailySnapshot_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  Day = 'day',
  DeltaFarmBalance = 'deltaFarmBalance',
  DeltaTotalBalance = 'deltaTotalBalance',
  DeltaWalletBalance = 'deltaWalletBalance',
  FarmBalance = 'farmBalance',
  FarmerBalance = 'farmerBalance',
  FarmerBalanceFarmBalance = 'farmerBalance__farmBalance',
  FarmerBalanceFarmer = 'farmerBalance__farmer',
  FarmerBalanceId = 'farmerBalance__id',
  FarmerBalanceLastDailySnapshotDay = 'farmerBalance__lastDailySnapshotDay',
  FarmerBalanceLastHourlySnapshotSeason = 'farmerBalance__lastHourlySnapshotSeason',
  FarmerBalanceToken = 'farmerBalance__token',
  FarmerBalanceTotalBalance = 'farmerBalance__totalBalance',
  FarmerBalanceWalletBalance = 'farmerBalance__walletBalance',
  Id = 'id',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TotalBalance = 'totalBalance',
  WalletBalance = 'walletBalance'
}

export type FarmerBalanceHourlySnapshot = {
  __typename?: 'FarmerBalanceHourlySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** Delta of farmBalance */
  deltaFarmBalance: Scalars['BigInt']['output'];
  /** Delta of totalBalance */
  deltaTotalBalance: Scalars['BigInt']['output'];
  /** Delta of walletBalance */
  deltaWalletBalance: Scalars['BigInt']['output'];
  /** Amount of this token in farm balances */
  farmBalance: Scalars['BigInt']['output'];
  farmerBalance: FarmerBalance;
  /** {FarmerBalance ID}-{Season} */
  id: Scalars['ID']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  season: Season;
  seasonNumber: Scalars['Int']['output'];
  /** Amount of this token held by the farmer */
  totalBalance: Scalars['BigInt']['output'];
  /** Amount of this token in the wallet */
  walletBalance: Scalars['BigInt']['output'];
};

export type FarmerBalanceHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FarmerBalanceHourlySnapshot_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmerBalance?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_?: InputMaybe<FarmerBalance_Filter>;
  farmerBalance_contains?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_gt?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_gte?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmerBalance_lt?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_lte?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_contains?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  farmerBalance_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_starts_with?: InputMaybe<Scalars['String']['input']>;
  farmerBalance_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FarmerBalanceHourlySnapshot_Filter>>>;
  season?: InputMaybe<Scalars['String']['input']>;
  seasonNumber?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  seasonNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalBalance?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FarmerBalanceHourlySnapshot_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  DeltaFarmBalance = 'deltaFarmBalance',
  DeltaTotalBalance = 'deltaTotalBalance',
  DeltaWalletBalance = 'deltaWalletBalance',
  FarmBalance = 'farmBalance',
  FarmerBalance = 'farmerBalance',
  FarmerBalanceFarmBalance = 'farmerBalance__farmBalance',
  FarmerBalanceFarmer = 'farmerBalance__farmer',
  FarmerBalanceId = 'farmerBalance__id',
  FarmerBalanceLastDailySnapshotDay = 'farmerBalance__lastDailySnapshotDay',
  FarmerBalanceLastHourlySnapshotSeason = 'farmerBalance__lastHourlySnapshotSeason',
  FarmerBalanceToken = 'farmerBalance__token',
  FarmerBalanceTotalBalance = 'farmerBalance__totalBalance',
  FarmerBalanceWalletBalance = 'farmerBalance__walletBalance',
  Id = 'id',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  Season = 'season',
  SeasonNumber = 'seasonNumber',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TotalBalance = 'totalBalance',
  WalletBalance = 'walletBalance'
}

export type FarmerBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FarmerBalance_Filter>>>;
  dailySnapshots_?: InputMaybe<FarmerBalanceDailySnapshot_Filter>;
  farmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmer?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  farmer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_not?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  farmer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hourlySnapshots_?: InputMaybe<FarmerBalanceHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FarmerBalance_Filter>>>;
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
  totalBalance?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FarmerBalance_OrderBy {
  DailySnapshots = 'dailySnapshots',
  FarmBalance = 'farmBalance',
  Farmer = 'farmer',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  Token = 'token',
  TotalBalance = 'totalBalance',
  WalletBalance = 'walletBalance'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pool = {
  __typename?: 'Pool';
  /** The Bean token that is in this pool */
  bean: Bean;
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** Peg cross references */
  crossEvents: Array<PoolCross>;
  /** Cumulative number of peg crosses in this Pool */
  crosses: Scalars['Int']['output'];
  /** Current Beanstalk season */
  currentSeason: Season;
  dailySnapshots: Array<PoolDailySnapshot>;
  hourlySnapshots: Array<PoolHourlySnapshot>;
  /** Pool contract address */
  id: Scalars['Bytes']['output'];
  /** Last timestamp a peg cross occurred */
  lastCross: Scalars['BigInt']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['Int']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** * The last recorded bean price in this pool. Updated upon a trade, a peg cross, or sunrise. May not be useful for external use as accuracy is not guaranteed. */
  lastPrice: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Total liquidity in this pool */
  liquidityUSD: Scalars['BigDecimal']['output'];
  /** Token reserves in the pool */
  reserves: Array<Scalars['BigInt']['output']>;
  /** Tokens in this pool */
  tokens: Array<Token>;
  /** (DEPRECATED): See basin subgraph instead // Pool exchange volume in bean */
  volume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Pool exchange volume in USD */
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type PoolCrossEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolCross_Filter>;
};


export type PoolDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolDailySnapshot_Filter>;
};


export type PoolHourlySnapshotsArgs = {
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
  /** Whether this cross was above or below peg */
  above: Scalars['Boolean']['output'];
  /** Block number when this cross was identified */
  blockNumber: Scalars['BigInt']['output'];
  /** Cross number (int) */
  cross: Scalars['Int']['output'];
  /** {Pool Address}-{Cross Number} */
  id: Scalars['ID']['output'];
  /** The Pool in which this cross occurred */
  pool: Pool;
  /** Daily snapshot for this cross */
  poolDailySnapshot: PoolDailySnapshot;
  /** Hourly snapshot for this cross */
  poolHourlySnapshot: PoolHourlySnapshot;
  /** The price of bean in this pool at the time this cross occurred */
  price: Scalars['BigDecimal']['output'];
  /** Time elapsed since the previous cross in this pool */
  timeSinceLastCross: Scalars['BigInt']['output'];
  /** Timestamp when this cross was identified */
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
  cross?: InputMaybe<Scalars['Int']['input']>;
  cross_gt?: InputMaybe<Scalars['Int']['input']>;
  cross_gte?: InputMaybe<Scalars['Int']['input']>;
  cross_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cross_lt?: InputMaybe<Scalars['Int']['input']>;
  cross_lte?: InputMaybe<Scalars['Int']['input']>;
  cross_not?: InputMaybe<Scalars['Int']['input']>;
  cross_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  poolDailySnapshot?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_?: InputMaybe<PoolDailySnapshot_Filter>;
  poolDailySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolDailySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolDailySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_?: InputMaybe<PoolHourlySnapshot_Filter>;
  poolHourlySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolHourlySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolHourlySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolHourlySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  Cross = 'cross',
  Id = 'id',
  Pool = 'pool',
  PoolDailySnapshot = 'poolDailySnapshot',
  PoolDailySnapshotCreatedTimestamp = 'poolDailySnapshot__createdTimestamp',
  PoolDailySnapshotCrosses = 'poolDailySnapshot__crosses',
  PoolDailySnapshotDay = 'poolDailySnapshot__day',
  PoolDailySnapshotDeltaCrosses = 'poolDailySnapshot__deltaCrosses',
  PoolDailySnapshotDeltaLiquidityUsd = 'poolDailySnapshot__deltaLiquidityUSD',
  PoolDailySnapshotDeltaVolume = 'poolDailySnapshot__deltaVolume',
  PoolDailySnapshotDeltaVolumeUsd = 'poolDailySnapshot__deltaVolumeUSD',
  PoolDailySnapshotId = 'poolDailySnapshot__id',
  PoolDailySnapshotInstDeltaB = 'poolDailySnapshot__instDeltaB',
  PoolDailySnapshotInstPrice = 'poolDailySnapshot__instPrice',
  PoolDailySnapshotLastUpdateBlockNumber = 'poolDailySnapshot__lastUpdateBlockNumber',
  PoolDailySnapshotLastUpdateTimestamp = 'poolDailySnapshot__lastUpdateTimestamp',
  PoolDailySnapshotLiquidityUsd = 'poolDailySnapshot__liquidityUSD',
  PoolDailySnapshotTwaBeanLiquidityUsd = 'poolDailySnapshot__twaBeanLiquidityUSD',
  PoolDailySnapshotTwaDeltaB = 'poolDailySnapshot__twaDeltaB',
  PoolDailySnapshotTwaLiquidityUsd = 'poolDailySnapshot__twaLiquidityUSD',
  PoolDailySnapshotTwaNonBeanLiquidityUsd = 'poolDailySnapshot__twaNonBeanLiquidityUSD',
  PoolDailySnapshotTwaPrice = 'poolDailySnapshot__twaPrice',
  PoolDailySnapshotTwaToken2Price = 'poolDailySnapshot__twaToken2Price',
  PoolDailySnapshotVolume = 'poolDailySnapshot__volume',
  PoolDailySnapshotVolumeUsd = 'poolDailySnapshot__volumeUSD',
  PoolHourlySnapshot = 'poolHourlySnapshot',
  PoolHourlySnapshotCreatedTimestamp = 'poolHourlySnapshot__createdTimestamp',
  PoolHourlySnapshotCrosses = 'poolHourlySnapshot__crosses',
  PoolHourlySnapshotDeltaCrosses = 'poolHourlySnapshot__deltaCrosses',
  PoolHourlySnapshotDeltaLiquidityUsd = 'poolHourlySnapshot__deltaLiquidityUSD',
  PoolHourlySnapshotDeltaVolume = 'poolHourlySnapshot__deltaVolume',
  PoolHourlySnapshotDeltaVolumeUsd = 'poolHourlySnapshot__deltaVolumeUSD',
  PoolHourlySnapshotId = 'poolHourlySnapshot__id',
  PoolHourlySnapshotInstDeltaB = 'poolHourlySnapshot__instDeltaB',
  PoolHourlySnapshotInstPrice = 'poolHourlySnapshot__instPrice',
  PoolHourlySnapshotLastUpdateBlockNumber = 'poolHourlySnapshot__lastUpdateBlockNumber',
  PoolHourlySnapshotLastUpdateTimestamp = 'poolHourlySnapshot__lastUpdateTimestamp',
  PoolHourlySnapshotLiquidityUsd = 'poolHourlySnapshot__liquidityUSD',
  PoolHourlySnapshotSeasonNumber = 'poolHourlySnapshot__seasonNumber',
  PoolHourlySnapshotTwaBeanLiquidityUsd = 'poolHourlySnapshot__twaBeanLiquidityUSD',
  PoolHourlySnapshotTwaDeltaB = 'poolHourlySnapshot__twaDeltaB',
  PoolHourlySnapshotTwaLiquidityUsd = 'poolHourlySnapshot__twaLiquidityUSD',
  PoolHourlySnapshotTwaNonBeanLiquidityUsd = 'poolHourlySnapshot__twaNonBeanLiquidityUSD',
  PoolHourlySnapshotTwaPrice = 'poolHourlySnapshot__twaPrice',
  PoolHourlySnapshotTwaToken2Price = 'poolHourlySnapshot__twaToken2Price',
  PoolHourlySnapshotVolume = 'poolHourlySnapshot__volume',
  PoolHourlySnapshotVolumeUsd = 'poolHourlySnapshot__volumeUSD',
  PoolCreatedTimestamp = 'pool__createdTimestamp',
  PoolCrosses = 'pool__crosses',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  PoolLastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  PoolLastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  Price = 'price',
  TimeSinceLastCross = 'timeSinceLastCross',
  Timestamp = 'timestamp'
}

export type PoolDailySnapshot = {
  __typename?: 'PoolDailySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All crosses occurred in the same time period as this snapshot */
  crossEvents: Array<PoolCross>;
  /** Cumulative number of peg crosses in this Pool */
  crosses: Scalars['Int']['output'];
  /** Unix day */
  day: Scalars['Int']['output'];
  /** Delta of crosses */
  deltaCrosses: Scalars['Int']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of liquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Delta of reserves */
  deltaReserves: Array<Scalars['BigInt']['output']>;
  /** (DEPRECATED): See basin subgraph instead // Delta of volume */
  deltaVolume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of volumeUSD */
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Pool ID}-{Unix day} */
  id: Scalars['ID']['output'];
  /** Instantaneous deltaB at the start of the season */
  instDeltaB: Scalars['BigDecimal']['output'];
  /** Bean price in this pool at the end of the previous season */
  instPrice: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Total liquidity in this pool */
  liquidityUSD: Scalars['BigDecimal']['output'];
  pool: Pool;
  /** Token reserves in the pool */
  reserves: Array<Scalars['BigInt']['output']>;
  season: Season;
  /** Time-Weighted average bean USD liquidity in this pool over the previous season, using the price of bean in this pool only */
  twaBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted deltaB over the previous season */
  twaDeltaB: Scalars['BigDecimal']['output'];
  /** Time-Weighted average total USD liquidity in this pool over the previous season */
  twaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted average non-bean USD liquidity in this pool over the previous season */
  twaNonBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted bean price in this pool over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  /** Time-Weighted average reserves in this pool over the previous season */
  twaReserves: Array<Scalars['BigInt']['output']>;
  /** Time-Weighted price of the non-bean token in the pool over the previous season */
  twaToken2Price: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): See basin subgraph instead // Pool exchange volume in bean */
  volume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Pool exchange volume in USD */
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
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<PoolCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  instDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  twaBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaToken2Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaToken2Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  CreatedTimestamp = 'createdTimestamp',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  Day = 'day',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaReserves = 'deltaReserves',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  InstDeltaB = 'instDeltaB',
  InstPrice = 'instPrice',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LiquidityUsd = 'liquidityUSD',
  Pool = 'pool',
  PoolCreatedTimestamp = 'pool__createdTimestamp',
  PoolCrosses = 'pool__crosses',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  PoolLastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  PoolLastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  Reserves = 'reserves',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TwaBeanLiquidityUsd = 'twaBeanLiquidityUSD',
  TwaDeltaB = 'twaDeltaB',
  TwaLiquidityUsd = 'twaLiquidityUSD',
  TwaNonBeanLiquidityUsd = 'twaNonBeanLiquidityUSD',
  TwaPrice = 'twaPrice',
  TwaReserves = 'twaReserves',
  TwaToken2Price = 'twaToken2Price',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
}

export type PoolHourlySnapshot = {
  __typename?: 'PoolHourlySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All crosses occurred in the same time period as this snapshot */
  crossEvents: Array<PoolCross>;
  /** Cumulative number of peg crosses in this Pool */
  crosses: Scalars['Int']['output'];
  /** Delta of crosses */
  deltaCrosses: Scalars['Int']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of liquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Delta of reserves */
  deltaReserves: Array<Scalars['BigInt']['output']>;
  /** (DEPRECATED): See basin subgraph instead // Delta of volume */
  deltaVolume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Delta of volumeUSD */
  deltaVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Pool ID}-{Season} */
  id: Scalars['ID']['output'];
  /** Instantaneous deltaB at the start of the season */
  instDeltaB: Scalars['BigDecimal']['output'];
  /** Bean price in this pool at the end of the previous season */
  instPrice: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Total liquidity in this pool */
  liquidityUSD: Scalars['BigDecimal']['output'];
  pool: Pool;
  /** Token reserves in the pool */
  reserves: Array<Scalars['BigInt']['output']>;
  season: Season;
  seasonNumber: Scalars['Int']['output'];
  /** Time-Weighted average bean USD liquidity in this pool over the previous season, using the price of bean in this pool only */
  twaBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted deltaB over the previous season */
  twaDeltaB: Scalars['BigDecimal']['output'];
  /** Time-Weighted average total USD liquidity in this pool over the previous season */
  twaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted average non-bean USD liquidity in this pool over the previous season */
  twaNonBeanLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Time-Weighted bean price in this pool over the previous season */
  twaPrice: Scalars['BigDecimal']['output'];
  /** Time-Weighted average reserves in this pool over the previous season */
  twaReserves: Array<Scalars['BigInt']['output']>;
  /** Time-Weighted price of the non-bean token in the pool over the previous season */
  twaToken2Price: Scalars['BigDecimal']['output'];
  /** (DEPRECATED): See basin subgraph instead // Pool exchange volume in bean */
  volume: Scalars['BigInt']['output'];
  /** (DEPRECATED): See basin subgraph instead // Pool exchange volume in USD */
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
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<PoolCross_Filter>;
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
  instDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  instPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  instPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  season?: InputMaybe<Scalars['String']['input']>;
  seasonNumber?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  seasonNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  twaBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaDeltaB_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaDeltaB_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaNonBeanLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaNonBeanLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaToken2Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  twaToken2Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  twaToken2Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  CreatedTimestamp = 'createdTimestamp',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  DeltaCrosses = 'deltaCrosses',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaReserves = 'deltaReserves',
  DeltaVolume = 'deltaVolume',
  DeltaVolumeUsd = 'deltaVolumeUSD',
  Id = 'id',
  InstDeltaB = 'instDeltaB',
  InstPrice = 'instPrice',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LiquidityUsd = 'liquidityUSD',
  Pool = 'pool',
  PoolCreatedTimestamp = 'pool__createdTimestamp',
  PoolCrosses = 'pool__crosses',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  PoolLastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  PoolLastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  Reserves = 'reserves',
  Season = 'season',
  SeasonNumber = 'seasonNumber',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TwaBeanLiquidityUsd = 'twaBeanLiquidityUSD',
  TwaDeltaB = 'twaDeltaB',
  TwaLiquidityUsd = 'twaLiquidityUSD',
  TwaNonBeanLiquidityUsd = 'twaNonBeanLiquidityUSD',
  TwaPrice = 'twaPrice',
  TwaReserves = 'twaReserves',
  TwaToken2Price = 'twaToken2Price',
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
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<PoolCross_Filter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  currentSeason?: InputMaybe<Scalars['String']['input']>;
  currentSeason_?: InputMaybe<Season_Filter>;
  currentSeason_contains?: InputMaybe<Scalars['String']['input']>;
  currentSeason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_ends_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_gt?: InputMaybe<Scalars['String']['input']>;
  currentSeason_gte?: InputMaybe<Scalars['String']['input']>;
  currentSeason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentSeason_lt?: InputMaybe<Scalars['String']['input']>;
  currentSeason_lte?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_contains?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentSeason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentSeason_starts_with?: InputMaybe<Scalars['String']['input']>;
  currentSeason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailySnapshots_?: InputMaybe<PoolDailySnapshot_Filter>;
  hourlySnapshots_?: InputMaybe<PoolHourlySnapshot_Filter>;
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
  lastDailySnapshotDay?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  BeanCreatedTimestamp = 'bean__createdTimestamp',
  BeanCrosses = 'bean__crosses',
  BeanId = 'bean__id',
  BeanLastCross = 'bean__lastCross',
  BeanLastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  BeanLastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  BeanLastPrice = 'bean__lastPrice',
  BeanLastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  BeanLastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  BeanLiquidityUsd = 'bean__liquidityUSD',
  BeanLockedBeans = 'bean__lockedBeans',
  BeanSupply = 'bean__supply',
  BeanSupplyInPegLp = 'bean__supplyInPegLP',
  BeanVolume = 'bean__volume',
  BeanVolumeUsd = 'bean__volumeUSD',
  CreatedTimestamp = 'createdTimestamp',
  CrossEvents = 'crossEvents',
  Crosses = 'crosses',
  CurrentSeason = 'currentSeason',
  CurrentSeasonId = 'currentSeason__id',
  CurrentSeasonSeason = 'currentSeason__season',
  CurrentSeasonTimestamp = 'currentSeason__timestamp',
  DailySnapshots = 'dailySnapshots',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastCross = 'lastCross',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  LastPrice = 'lastPrice',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LiquidityUsd = 'liquidityUSD',
  Reserves = 'reserves',
  Tokens = 'tokens',
  Volume = 'volume',
  VolumeUsd = 'volumeUSD'
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
  farmerBalance?: Maybe<FarmerBalance>;
  farmerBalanceDailySnapshot?: Maybe<FarmerBalanceDailySnapshot>;
  farmerBalanceDailySnapshots: Array<FarmerBalanceDailySnapshot>;
  farmerBalanceHourlySnapshot?: Maybe<FarmerBalanceHourlySnapshot>;
  farmerBalanceHourlySnapshots: Array<FarmerBalanceHourlySnapshot>;
  farmerBalances: Array<FarmerBalance>;
  pool?: Maybe<Pool>;
  poolCross?: Maybe<PoolCross>;
  poolCrosses: Array<PoolCross>;
  poolDailySnapshot?: Maybe<PoolDailySnapshot>;
  poolDailySnapshots: Array<PoolDailySnapshot>;
  poolHourlySnapshot?: Maybe<PoolHourlySnapshot>;
  poolHourlySnapshots: Array<PoolHourlySnapshot>;
  pools: Array<Pool>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  token?: Maybe<Token>;
  tokenDailySnapshot?: Maybe<TokenDailySnapshot>;
  tokenDailySnapshots: Array<TokenDailySnapshot>;
  tokenHourlySnapshot?: Maybe<TokenHourlySnapshot>;
  tokenHourlySnapshots: Array<TokenHourlySnapshot>;
  tokens: Array<Token>;
  twaOracle?: Maybe<TwaOracle>;
  twaOracles: Array<TwaOracle>;
  version?: Maybe<Version>;
  versions: Array<Version>;
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


export type QueryFarmerBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFarmerBalanceDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFarmerBalanceDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FarmerBalanceDailySnapshot_Filter>;
};


export type QueryFarmerBalanceHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFarmerBalanceHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FarmerBalanceHourlySnapshot_Filter>;
};


export type QueryFarmerBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FarmerBalance_Filter>;
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


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDailySnapshot_Filter>;
};


export type QueryTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHourlySnapshot_Filter>;
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

export type Season = {
  __typename?: 'Season';
  beanDailySnapshot: BeanDailySnapshot;
  beanHourlySnapshot: BeanHourlySnapshot;
  /** Season number (string) */
  id: Scalars['ID']['output'];
  poolDailySnapshots: Array<PoolDailySnapshot>;
  poolHourlySnapshots: Array<PoolHourlySnapshot>;
  /** Season number (int) */
  season: Scalars['Int']['output'];
  /** Timestamp of the start of this season */
  timestamp: Scalars['BigInt']['output'];
};


export type SeasonPoolDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolDailySnapshot_Filter>;
};


export type SeasonPoolHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolHourlySnapshot_Filter>;
};

export type Season_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Season_Filter>>>;
  beanDailySnapshot_?: InputMaybe<BeanDailySnapshot_Filter>;
  beanHourlySnapshot_?: InputMaybe<BeanHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Season_Filter>>>;
  poolDailySnapshots_?: InputMaybe<PoolDailySnapshot_Filter>;
  poolHourlySnapshots_?: InputMaybe<PoolHourlySnapshot_Filter>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Season_OrderBy {
  BeanDailySnapshot = 'beanDailySnapshot',
  BeanDailySnapshotCreatedTimestamp = 'beanDailySnapshot__createdTimestamp',
  BeanDailySnapshotCrosses = 'beanDailySnapshot__crosses',
  BeanDailySnapshotDay = 'beanDailySnapshot__day',
  BeanDailySnapshotDeltaCrosses = 'beanDailySnapshot__deltaCrosses',
  BeanDailySnapshotDeltaLiquidityUsd = 'beanDailySnapshot__deltaLiquidityUSD',
  BeanDailySnapshotDeltaVolume = 'beanDailySnapshot__deltaVolume',
  BeanDailySnapshotDeltaVolumeUsd = 'beanDailySnapshot__deltaVolumeUSD',
  BeanDailySnapshotId = 'beanDailySnapshot__id',
  BeanDailySnapshotInstDeltaB = 'beanDailySnapshot__instDeltaB',
  BeanDailySnapshotInstPrice = 'beanDailySnapshot__instPrice',
  BeanDailySnapshotL2sr = 'beanDailySnapshot__l2sr',
  BeanDailySnapshotLastUpdateBlockNumber = 'beanDailySnapshot__lastUpdateBlockNumber',
  BeanDailySnapshotLastUpdateTimestamp = 'beanDailySnapshot__lastUpdateTimestamp',
  BeanDailySnapshotLiquidityUsd = 'beanDailySnapshot__liquidityUSD',
  BeanDailySnapshotLockedBeans = 'beanDailySnapshot__lockedBeans',
  BeanDailySnapshotMarketCap = 'beanDailySnapshot__marketCap',
  BeanDailySnapshotSupply = 'beanDailySnapshot__supply',
  BeanDailySnapshotSupplyInPegLp = 'beanDailySnapshot__supplyInPegLP',
  BeanDailySnapshotTwaBeanLiquidityUsd = 'beanDailySnapshot__twaBeanLiquidityUSD',
  BeanDailySnapshotTwaDeltaB = 'beanDailySnapshot__twaDeltaB',
  BeanDailySnapshotTwaLiquidityUsd = 'beanDailySnapshot__twaLiquidityUSD',
  BeanDailySnapshotTwaNonBeanLiquidityUsd = 'beanDailySnapshot__twaNonBeanLiquidityUSD',
  BeanDailySnapshotTwaPrice = 'beanDailySnapshot__twaPrice',
  BeanDailySnapshotVolume = 'beanDailySnapshot__volume',
  BeanDailySnapshotVolumeUsd = 'beanDailySnapshot__volumeUSD',
  BeanHourlySnapshot = 'beanHourlySnapshot',
  BeanHourlySnapshotCreatedTimestamp = 'beanHourlySnapshot__createdTimestamp',
  BeanHourlySnapshotCrosses = 'beanHourlySnapshot__crosses',
  BeanHourlySnapshotDeltaCrosses = 'beanHourlySnapshot__deltaCrosses',
  BeanHourlySnapshotDeltaLiquidityUsd = 'beanHourlySnapshot__deltaLiquidityUSD',
  BeanHourlySnapshotDeltaVolume = 'beanHourlySnapshot__deltaVolume',
  BeanHourlySnapshotDeltaVolumeUsd = 'beanHourlySnapshot__deltaVolumeUSD',
  BeanHourlySnapshotId = 'beanHourlySnapshot__id',
  BeanHourlySnapshotInstDeltaB = 'beanHourlySnapshot__instDeltaB',
  BeanHourlySnapshotInstPrice = 'beanHourlySnapshot__instPrice',
  BeanHourlySnapshotL2sr = 'beanHourlySnapshot__l2sr',
  BeanHourlySnapshotLastUpdateBlockNumber = 'beanHourlySnapshot__lastUpdateBlockNumber',
  BeanHourlySnapshotLastUpdateTimestamp = 'beanHourlySnapshot__lastUpdateTimestamp',
  BeanHourlySnapshotLiquidityUsd = 'beanHourlySnapshot__liquidityUSD',
  BeanHourlySnapshotLockedBeans = 'beanHourlySnapshot__lockedBeans',
  BeanHourlySnapshotMarketCap = 'beanHourlySnapshot__marketCap',
  BeanHourlySnapshotSeasonNumber = 'beanHourlySnapshot__seasonNumber',
  BeanHourlySnapshotSupply = 'beanHourlySnapshot__supply',
  BeanHourlySnapshotSupplyInPegLp = 'beanHourlySnapshot__supplyInPegLP',
  BeanHourlySnapshotTwaBeanLiquidityUsd = 'beanHourlySnapshot__twaBeanLiquidityUSD',
  BeanHourlySnapshotTwaDeltaB = 'beanHourlySnapshot__twaDeltaB',
  BeanHourlySnapshotTwaLiquidityUsd = 'beanHourlySnapshot__twaLiquidityUSD',
  BeanHourlySnapshotTwaNonBeanLiquidityUsd = 'beanHourlySnapshot__twaNonBeanLiquidityUSD',
  BeanHourlySnapshotTwaPrice = 'beanHourlySnapshot__twaPrice',
  BeanHourlySnapshotVolume = 'beanHourlySnapshot__volume',
  BeanHourlySnapshotVolumeUsd = 'beanHourlySnapshot__volumeUSD',
  Id = 'id',
  PoolDailySnapshots = 'poolDailySnapshots',
  PoolHourlySnapshots = 'poolHourlySnapshots',
  Season = 'season',
  Timestamp = 'timestamp'
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
  farmerBalance?: Maybe<FarmerBalance>;
  farmerBalanceDailySnapshot?: Maybe<FarmerBalanceDailySnapshot>;
  farmerBalanceDailySnapshots: Array<FarmerBalanceDailySnapshot>;
  farmerBalanceHourlySnapshot?: Maybe<FarmerBalanceHourlySnapshot>;
  farmerBalanceHourlySnapshots: Array<FarmerBalanceHourlySnapshot>;
  farmerBalances: Array<FarmerBalance>;
  pool?: Maybe<Pool>;
  poolCross?: Maybe<PoolCross>;
  poolCrosses: Array<PoolCross>;
  poolDailySnapshot?: Maybe<PoolDailySnapshot>;
  poolDailySnapshots: Array<PoolDailySnapshot>;
  poolHourlySnapshot?: Maybe<PoolHourlySnapshot>;
  poolHourlySnapshots: Array<PoolHourlySnapshot>;
  pools: Array<Pool>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  token?: Maybe<Token>;
  tokenDailySnapshot?: Maybe<TokenDailySnapshot>;
  tokenDailySnapshots: Array<TokenDailySnapshot>;
  tokenHourlySnapshot?: Maybe<TokenHourlySnapshot>;
  tokenHourlySnapshots: Array<TokenHourlySnapshot>;
  tokens: Array<Token>;
  twaOracle?: Maybe<TwaOracle>;
  twaOracles: Array<TwaOracle>;
  version?: Maybe<Version>;
  versions: Array<Version>;
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


export type SubscriptionFarmerBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFarmerBalanceDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFarmerBalanceDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FarmerBalanceDailySnapshot_Filter>;
};


export type SubscriptionFarmerBalanceHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFarmerBalanceHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FarmerBalanceHourlySnapshot_Filter>;
};


export type SubscriptionFarmerBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FarmerBalance_Filter>;
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


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDailySnapshot_Filter>;
};


export type SubscriptionTokenHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHourlySnapshot_Filter>;
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

export type Token = {
  __typename?: 'Token';
  dailySnapshots: Array<TokenDailySnapshot>;
  /** Number of decimals */
  decimals: Scalars['BigInt']['output'];
  /** Amount of tokens in farm balances. Isn't calculated for all tokens, in those cases will be zero. */
  farmBalance: Scalars['BigInt']['output'];
  hourlySnapshots: Array<TokenHourlySnapshot>;
  /** Smart contract address of the token */
  id: Scalars['Bytes']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['Int']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Last USD price calculated. Isn't calculated for all tokens, in those cases will be zero. */
  lastPriceUSD: Scalars['BigDecimal']['output'];
  /** Name of the token */
  name: Scalars['String']['output'];
  /** Amount of tokens in whitelisted LP pools. Isn't calculated for all tokens, in those cases will be zero. */
  pooledBalance: Scalars['BigInt']['output'];
  /** Total supply of this token. Isn't calculated for all tokens, in those cases will be zero. */
  supply: Scalars['BigInt']['output'];
  /** Amount of tokens in individual wallets/contracts (includes silo). Isn't calculated for all tokens, in those cases will be zero. */
  walletBalance: Scalars['BigInt']['output'];
};


export type TokenDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenDailySnapshot_Filter>;
};


export type TokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenHourlySnapshot_Filter>;
};

export type TokenDailySnapshot = {
  __typename?: 'TokenDailySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** Unix day */
  day: Scalars['Int']['output'];
  /** Number of decimals */
  decimals: Scalars['BigInt']['output'];
  /** Delta of farmBalance */
  deltaFarmBalance: Scalars['BigInt']['output'];
  /** Delta of lastPriceUSD */
  deltaLastPriceUSD: Scalars['BigDecimal']['output'];
  /** Delta of pooledBalance */
  deltaPooledBalance: Scalars['BigInt']['output'];
  /** Delta of supply */
  deltaSupply: Scalars['BigInt']['output'];
  /** Delta of walletBalance */
  deltaWalletBalance: Scalars['BigInt']['output'];
  /** Amount of tokens in farm balances. Isn't calculated for all tokens, in those cases will be zero. */
  farmBalance: Scalars['BigInt']['output'];
  /** {Token address}-{Unix day} */
  id: Scalars['ID']['output'];
  /** Last USD price calculated. Isn't calculated for all tokens, in those cases will be zero. */
  lastPriceUSD: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Name of the token */
  name: Scalars['String']['output'];
  /** Amount of tokens in whitelisted LP pools. Isn't calculated for all tokens, in those cases will be zero. */
  pooledBalance: Scalars['BigInt']['output'];
  season: Season;
  /** Total supply of this token. Isn't calculated for all tokens, in those cases will be zero. */
  supply: Scalars['BigInt']['output'];
  token: Token;
  /** Amount of tokens in individual wallets/contracts (includes silo). Isn't calculated for all tokens, in those cases will be zero. */
  walletBalance: Scalars['BigInt']['output'];
};

export type TokenDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaLastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaPooledBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPooledBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<TokenDailySnapshot_Filter>>>;
  pooledBalance?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pooledBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
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
  walletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum TokenDailySnapshot_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  Day = 'day',
  Decimals = 'decimals',
  DeltaFarmBalance = 'deltaFarmBalance',
  DeltaLastPriceUsd = 'deltaLastPriceUSD',
  DeltaPooledBalance = 'deltaPooledBalance',
  DeltaSupply = 'deltaSupply',
  DeltaWalletBalance = 'deltaWalletBalance',
  FarmBalance = 'farmBalance',
  Id = 'id',
  LastPriceUsd = 'lastPriceUSD',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  Name = 'name',
  PooledBalance = 'pooledBalance',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  Supply = 'supply',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenFarmBalance = 'token__farmBalance',
  TokenId = 'token__id',
  TokenLastDailySnapshotDay = 'token__lastDailySnapshotDay',
  TokenLastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenName = 'token__name',
  TokenPooledBalance = 'token__pooledBalance',
  TokenSupply = 'token__supply',
  TokenWalletBalance = 'token__walletBalance',
  WalletBalance = 'walletBalance'
}

export type TokenHourlySnapshot = {
  __typename?: 'TokenHourlySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** Number of decimals */
  decimals: Scalars['BigInt']['output'];
  /** Delta of farmBalance */
  deltaFarmBalance: Scalars['BigInt']['output'];
  /** Delta of lastPriceUSD */
  deltaLastPriceUSD: Scalars['BigDecimal']['output'];
  /** Delta of pooledBalance */
  deltaPooledBalance: Scalars['BigInt']['output'];
  /** Delta of supply */
  deltaSupply: Scalars['BigInt']['output'];
  /** Delta of walletBalance */
  deltaWalletBalance: Scalars['BigInt']['output'];
  /** Amount of tokens in farm balances. Isn't calculated for all tokens, in those cases will be zero. */
  farmBalance: Scalars['BigInt']['output'];
  /** {Token address}-{Season} */
  id: Scalars['ID']['output'];
  /** Last USD price calculated. Isn't calculated for all tokens, in those cases will be zero. */
  lastPriceUSD: Scalars['BigDecimal']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Name of the token */
  name: Scalars['String']['output'];
  /** Amount of tokens in whitelisted LP pools. Isn't calculated for all tokens, in those cases will be zero. */
  pooledBalance: Scalars['BigInt']['output'];
  season: Season;
  seasonNumber: Scalars['Int']['output'];
  /** Total supply of this token. Isn't calculated for all tokens, in those cases will be zero. */
  supply: Scalars['BigInt']['output'];
  token: Token;
  /** Amount of tokens in individual wallets/contracts (includes silo). Isn't calculated for all tokens, in those cases will be zero. */
  walletBalance: Scalars['BigInt']['output'];
};

export type TokenHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaFarmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaFarmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaLastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaPooledBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPooledBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPooledBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaWalletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaWalletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<TokenHourlySnapshot_Filter>>>;
  pooledBalance?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pooledBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['String']['input']>;
  seasonNumber?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  seasonNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_?: InputMaybe<Season_Filter>;
  season_contains?: InputMaybe<Scalars['String']['input']>;
  season_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_gt?: InputMaybe<Scalars['String']['input']>;
  season_gte?: InputMaybe<Scalars['String']['input']>;
  season_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_lt?: InputMaybe<Scalars['String']['input']>;
  season_lte?: InputMaybe<Scalars['String']['input']>;
  season_not?: InputMaybe<Scalars['String']['input']>;
  season_not_contains?: InputMaybe<Scalars['String']['input']>;
  season_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  season_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  season_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  season_starts_with?: InputMaybe<Scalars['String']['input']>;
  season_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
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
  walletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum TokenHourlySnapshot_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  Decimals = 'decimals',
  DeltaFarmBalance = 'deltaFarmBalance',
  DeltaLastPriceUsd = 'deltaLastPriceUSD',
  DeltaPooledBalance = 'deltaPooledBalance',
  DeltaSupply = 'deltaSupply',
  DeltaWalletBalance = 'deltaWalletBalance',
  FarmBalance = 'farmBalance',
  Id = 'id',
  LastPriceUsd = 'lastPriceUSD',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  Name = 'name',
  PooledBalance = 'pooledBalance',
  Season = 'season',
  SeasonNumber = 'seasonNumber',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  Supply = 'supply',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenFarmBalance = 'token__farmBalance',
  TokenId = 'token__id',
  TokenLastDailySnapshotDay = 'token__lastDailySnapshotDay',
  TokenLastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenName = 'token__name',
  TokenPooledBalance = 'token__pooledBalance',
  TokenSupply = 'token__supply',
  TokenWalletBalance = 'token__walletBalance',
  WalletBalance = 'walletBalance'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  dailySnapshots_?: InputMaybe<TokenDailySnapshot_Filter>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  farmBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  farmBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlySnapshots_?: InputMaybe<TokenHourlySnapshot_Filter>;
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
  lastDailySnapshotDay?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  pooledBalance?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pooledBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  walletBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  walletBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Token_OrderBy {
  DailySnapshots = 'dailySnapshots',
  Decimals = 'decimals',
  FarmBalance = 'farmBalance',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  LastPriceUsd = 'lastPriceUSD',
  Name = 'name',
  PooledBalance = 'pooledBalance',
  Supply = 'supply',
  WalletBalance = 'walletBalance'
}

export type TwaOracle = {
  __typename?: 'TwaOracle';
  cumulativeWellReserves: Scalars['Bytes']['output'];
  cumulativeWellReservesBlock: Scalars['BigInt']['output'];
  cumulativeWellReservesPrev: Scalars['Bytes']['output'];
  cumulativeWellReservesPrevBlock: Scalars['BigInt']['output'];
  cumulativeWellReservesPrevTime: Scalars['BigInt']['output'];
  cumulativeWellReservesTime: Scalars['BigInt']['output'];
  /** NOTICE! This entity is intended for internal use, and is intentionally not documented or even useful in the graphql interface. */
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
  PoolCreatedTimestamp = 'pool__createdTimestamp',
  PoolCrosses = 'pool__crosses',
  PoolId = 'pool__id',
  PoolLastCross = 'pool__lastCross',
  PoolLastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  PoolLastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  PoolLastPrice = 'pool__lastPrice',
  PoolLastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  PoolLastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  PoolLiquidityUsd = 'pool__liquidityUSD',
  PoolVolume = 'pool__volume',
  PoolVolumeUsd = 'pool__volumeUSD',
  PriceCumulativeLast = 'priceCumulativeLast',
  PriceCumulativeSun = 'priceCumulativeSun'
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

export type BeanAdvancedChartQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BeanAdvancedChartQuery = { __typename?: 'Query', seasons: Array<{ __typename?: 'Season', id: string, timestamp: any, beanHourlySnapshot: { __typename?: 'BeanHourlySnapshot', l2sr: any, twaPrice: any, instPrice: any, twaDeltaB: any, instDeltaB: any, crosses: number, marketCap: any, supply: any, supplyInPegLP: any, season: { __typename?: 'Season', season: number, timestamp: any } } }> };

export type BeanSeasonsTableQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BeanSeasonsTableQuery = { __typename?: 'Query', seasons: Array<{ __typename?: 'Season', id: string, timestamp: any, beanHourlySnapshot: { __typename?: 'BeanHourlySnapshot', l2sr: any, twaPrice: any, instPrice: any, twaDeltaB: any, instDeltaB: any, season: { __typename?: 'Season', season: number } } }> };

export type BeanSeasonalBeanQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BeanSeasonalBeanQuery = { __typename?: 'Query', beanHourlySnapshots: Array<{ __typename?: 'BeanHourlySnapshot', id: string, supply: any, marketCap: any, instPrice: any, l2sr: any, liquidityUSD: any, createdTimestamp: any, season: { __typename?: 'Season', season: number } }> };


export const BeanAdvancedChartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanAdvancedChart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"beanHourlySnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"l2sr"}},{"kind":"Field","name":{"kind":"Name","value":"twaPrice"}},{"kind":"Field","name":{"kind":"Name","value":"instPrice"}},{"kind":"Field","name":{"kind":"Name","value":"twaDeltaB"}},{"kind":"Field","name":{"kind":"Name","value":"instDeltaB"}},{"kind":"Field","name":{"kind":"Name","value":"season"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"crosses"}},{"kind":"Field","name":{"kind":"Name","value":"marketCap"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"supplyInPegLP"}}]}}]}}]}}]} as unknown as DocumentNode<BeanAdvancedChartQuery, BeanAdvancedChartQueryVariables>;
export const BeanSeasonsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanSeasonsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"beanHourlySnapshot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"l2sr"}},{"kind":"Field","name":{"kind":"Name","value":"twaPrice"}},{"kind":"Field","name":{"kind":"Name","value":"instPrice"}},{"kind":"Field","name":{"kind":"Name","value":"twaDeltaB"}},{"kind":"Field","name":{"kind":"Name","value":"instDeltaB"}},{"kind":"Field","name":{"kind":"Name","value":"season"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BeanSeasonsTableQuery, BeanSeasonsTableQueryVariables>;
export const BeanSeasonalBeanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanSeasonalBean"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beanHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season__season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}}]}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"marketCap"}},{"kind":"Field","name":{"kind":"Name","value":"instPrice"}},{"kind":"Field","name":{"kind":"Name","value":"l2sr"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityUSD"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}}]}}]}}]} as unknown as DocumentNode<BeanSeasonalBeanQuery, BeanSeasonalBeanQueryVariables>;