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
  /** 8 bytes signed integer */
  Int8: { input: any; output: any; }
  /** A string representation of microseconds UNIX timestamp (16 digits) */
  Timestamp: { input: any; output: any; }
};

/** Indicates whether the current, partially filled bucket should be included in the response. Defaults to `exclude` */
export enum AggregationCurrent {
  /** Exclude the current, partially filled bucket from the response */
  exclude = 'exclude',
  /** Include the current, partially filled bucket in the response */
  include = 'include'
}

export enum AggregationInterval {
  day = 'day',
  hour = 'hour'
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
  orderBy?: InputMaybe<BeanCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanCrossFilter>;
};


export type BeanDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanDailySnapshotFilter>;
};


export type BeanDewhitelistedPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolFilter>;
};


export type BeanHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanHourlySnapshotFilter>;
};


export type BeanPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolFilter>;
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

export type BeanCrossFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  above?: InputMaybe<Scalars['Boolean']['input']>;
  above_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  above_not?: InputMaybe<Scalars['Boolean']['input']>;
  above_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  and?: InputMaybe<Array<InputMaybe<BeanCrossFilter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot?: InputMaybe<Scalars['String']['input']>;
  beanDailySnapshot_?: InputMaybe<BeanDailySnapshotFilter>;
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
  beanHourlySnapshot_?: InputMaybe<BeanHourlySnapshotFilter>;
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
  bean_?: InputMaybe<BeanFilter>;
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
  or?: InputMaybe<Array<InputMaybe<BeanCrossFilter>>>;
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

export enum BeanCrossOrderBy {
  above = 'above',
  bean = 'bean',
  beanDailySnapshot = 'beanDailySnapshot',
  beanDailySnapshot__createdTimestamp = 'beanDailySnapshot__createdTimestamp',
  beanDailySnapshot__crosses = 'beanDailySnapshot__crosses',
  beanDailySnapshot__day = 'beanDailySnapshot__day',
  beanDailySnapshot__deltaCrosses = 'beanDailySnapshot__deltaCrosses',
  beanDailySnapshot__deltaLiquidityUSD = 'beanDailySnapshot__deltaLiquidityUSD',
  beanDailySnapshot__deltaVolume = 'beanDailySnapshot__deltaVolume',
  beanDailySnapshot__deltaVolumeUSD = 'beanDailySnapshot__deltaVolumeUSD',
  beanDailySnapshot__id = 'beanDailySnapshot__id',
  beanDailySnapshot__instDeltaB = 'beanDailySnapshot__instDeltaB',
  beanDailySnapshot__instPrice = 'beanDailySnapshot__instPrice',
  beanDailySnapshot__l2sr = 'beanDailySnapshot__l2sr',
  beanDailySnapshot__lastUpdateBlockNumber = 'beanDailySnapshot__lastUpdateBlockNumber',
  beanDailySnapshot__lastUpdateTimestamp = 'beanDailySnapshot__lastUpdateTimestamp',
  beanDailySnapshot__liquidityUSD = 'beanDailySnapshot__liquidityUSD',
  beanDailySnapshot__lockedBeans = 'beanDailySnapshot__lockedBeans',
  beanDailySnapshot__marketCap = 'beanDailySnapshot__marketCap',
  beanDailySnapshot__supply = 'beanDailySnapshot__supply',
  beanDailySnapshot__supplyInPegLP = 'beanDailySnapshot__supplyInPegLP',
  beanDailySnapshot__twaBeanLiquidityUSD = 'beanDailySnapshot__twaBeanLiquidityUSD',
  beanDailySnapshot__twaDeltaB = 'beanDailySnapshot__twaDeltaB',
  beanDailySnapshot__twaLiquidityUSD = 'beanDailySnapshot__twaLiquidityUSD',
  beanDailySnapshot__twaNonBeanLiquidityUSD = 'beanDailySnapshot__twaNonBeanLiquidityUSD',
  beanDailySnapshot__twaPrice = 'beanDailySnapshot__twaPrice',
  beanDailySnapshot__volume = 'beanDailySnapshot__volume',
  beanDailySnapshot__volumeUSD = 'beanDailySnapshot__volumeUSD',
  beanHourlySnapshot = 'beanHourlySnapshot',
  beanHourlySnapshot__createdTimestamp = 'beanHourlySnapshot__createdTimestamp',
  beanHourlySnapshot__crosses = 'beanHourlySnapshot__crosses',
  beanHourlySnapshot__deltaCrosses = 'beanHourlySnapshot__deltaCrosses',
  beanHourlySnapshot__deltaLiquidityUSD = 'beanHourlySnapshot__deltaLiquidityUSD',
  beanHourlySnapshot__deltaVolume = 'beanHourlySnapshot__deltaVolume',
  beanHourlySnapshot__deltaVolumeUSD = 'beanHourlySnapshot__deltaVolumeUSD',
  beanHourlySnapshot__id = 'beanHourlySnapshot__id',
  beanHourlySnapshot__instDeltaB = 'beanHourlySnapshot__instDeltaB',
  beanHourlySnapshot__instPrice = 'beanHourlySnapshot__instPrice',
  beanHourlySnapshot__l2sr = 'beanHourlySnapshot__l2sr',
  beanHourlySnapshot__lastUpdateBlockNumber = 'beanHourlySnapshot__lastUpdateBlockNumber',
  beanHourlySnapshot__lastUpdateTimestamp = 'beanHourlySnapshot__lastUpdateTimestamp',
  beanHourlySnapshot__liquidityUSD = 'beanHourlySnapshot__liquidityUSD',
  beanHourlySnapshot__lockedBeans = 'beanHourlySnapshot__lockedBeans',
  beanHourlySnapshot__marketCap = 'beanHourlySnapshot__marketCap',
  beanHourlySnapshot__seasonNumber = 'beanHourlySnapshot__seasonNumber',
  beanHourlySnapshot__supply = 'beanHourlySnapshot__supply',
  beanHourlySnapshot__supplyInPegLP = 'beanHourlySnapshot__supplyInPegLP',
  beanHourlySnapshot__twaBeanLiquidityUSD = 'beanHourlySnapshot__twaBeanLiquidityUSD',
  beanHourlySnapshot__twaDeltaB = 'beanHourlySnapshot__twaDeltaB',
  beanHourlySnapshot__twaLiquidityUSD = 'beanHourlySnapshot__twaLiquidityUSD',
  beanHourlySnapshot__twaNonBeanLiquidityUSD = 'beanHourlySnapshot__twaNonBeanLiquidityUSD',
  beanHourlySnapshot__twaPrice = 'beanHourlySnapshot__twaPrice',
  beanHourlySnapshot__volume = 'beanHourlySnapshot__volume',
  beanHourlySnapshot__volumeUSD = 'beanHourlySnapshot__volumeUSD',
  bean__createdTimestamp = 'bean__createdTimestamp',
  bean__crosses = 'bean__crosses',
  bean__id = 'bean__id',
  bean__lastCross = 'bean__lastCross',
  bean__lastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  bean__lastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  bean__lastPrice = 'bean__lastPrice',
  bean__lastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  bean__lastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  bean__liquidityUSD = 'bean__liquidityUSD',
  bean__lockedBeans = 'bean__lockedBeans',
  bean__supply = 'bean__supply',
  bean__supplyInPegLP = 'bean__supplyInPegLP',
  bean__volume = 'bean__volume',
  bean__volumeUSD = 'bean__volumeUSD',
  blockNumber = 'blockNumber',
  cross = 'cross',
  id = 'id',
  price = 'price',
  timeSinceLastCross = 'timeSinceLastCross',
  timestamp = 'timestamp'
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
  orderBy?: InputMaybe<BeanCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanCrossFilter>;
};

export type BeanDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeanDailySnapshotFilter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  bean_?: InputMaybe<BeanFilter>;
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
  crossEvents_?: InputMaybe<BeanCrossFilter>;
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
  or?: InputMaybe<Array<InputMaybe<BeanDailySnapshotFilter>>>;
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<SeasonFilter>;
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

export enum BeanDailySnapshotOrderBy {
  bean = 'bean',
  bean__createdTimestamp = 'bean__createdTimestamp',
  bean__crosses = 'bean__crosses',
  bean__id = 'bean__id',
  bean__lastCross = 'bean__lastCross',
  bean__lastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  bean__lastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  bean__lastPrice = 'bean__lastPrice',
  bean__lastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  bean__lastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  bean__liquidityUSD = 'bean__liquidityUSD',
  bean__lockedBeans = 'bean__lockedBeans',
  bean__supply = 'bean__supply',
  bean__supplyInPegLP = 'bean__supplyInPegLP',
  bean__volume = 'bean__volume',
  bean__volumeUSD = 'bean__volumeUSD',
  createdTimestamp = 'createdTimestamp',
  crossEvents = 'crossEvents',
  crosses = 'crosses',
  day = 'day',
  deltaCrosses = 'deltaCrosses',
  deltaLiquidityUSD = 'deltaLiquidityUSD',
  deltaVolume = 'deltaVolume',
  deltaVolumeUSD = 'deltaVolumeUSD',
  id = 'id',
  instDeltaB = 'instDeltaB',
  instPrice = 'instPrice',
  l2sr = 'l2sr',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  liquidityUSD = 'liquidityUSD',
  lockedBeans = 'lockedBeans',
  marketCap = 'marketCap',
  season = 'season',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  supply = 'supply',
  supplyInPegLP = 'supplyInPegLP',
  twaBeanLiquidityUSD = 'twaBeanLiquidityUSD',
  twaDeltaB = 'twaDeltaB',
  twaLiquidityUSD = 'twaLiquidityUSD',
  twaNonBeanLiquidityUSD = 'twaNonBeanLiquidityUSD',
  twaPrice = 'twaPrice',
  volume = 'volume',
  volumeUSD = 'volumeUSD'
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
  orderBy?: InputMaybe<BeanCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanCrossFilter>;
};

export type BeanHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeanHourlySnapshotFilter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  bean_?: InputMaybe<BeanFilter>;
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
  crossEvents_?: InputMaybe<BeanCrossFilter>;
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
  or?: InputMaybe<Array<InputMaybe<BeanHourlySnapshotFilter>>>;
  season?: InputMaybe<Scalars['String']['input']>;
  seasonNumber?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  seasonNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_?: InputMaybe<SeasonFilter>;
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

export enum BeanHourlySnapshotOrderBy {
  bean = 'bean',
  bean__createdTimestamp = 'bean__createdTimestamp',
  bean__crosses = 'bean__crosses',
  bean__id = 'bean__id',
  bean__lastCross = 'bean__lastCross',
  bean__lastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  bean__lastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  bean__lastPrice = 'bean__lastPrice',
  bean__lastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  bean__lastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  bean__liquidityUSD = 'bean__liquidityUSD',
  bean__lockedBeans = 'bean__lockedBeans',
  bean__supply = 'bean__supply',
  bean__supplyInPegLP = 'bean__supplyInPegLP',
  bean__volume = 'bean__volume',
  bean__volumeUSD = 'bean__volumeUSD',
  createdTimestamp = 'createdTimestamp',
  crossEvents = 'crossEvents',
  crosses = 'crosses',
  deltaCrosses = 'deltaCrosses',
  deltaLiquidityUSD = 'deltaLiquidityUSD',
  deltaVolume = 'deltaVolume',
  deltaVolumeUSD = 'deltaVolumeUSD',
  id = 'id',
  instDeltaB = 'instDeltaB',
  instPrice = 'instPrice',
  l2sr = 'l2sr',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  liquidityUSD = 'liquidityUSD',
  lockedBeans = 'lockedBeans',
  marketCap = 'marketCap',
  season = 'season',
  seasonNumber = 'seasonNumber',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  supply = 'supply',
  supplyInPegLP = 'supplyInPegLP',
  twaBeanLiquidityUSD = 'twaBeanLiquidityUSD',
  twaDeltaB = 'twaDeltaB',
  twaLiquidityUSD = 'twaLiquidityUSD',
  twaNonBeanLiquidityUSD = 'twaNonBeanLiquidityUSD',
  twaPrice = 'twaPrice',
  volume = 'volume',
  volumeUSD = 'volumeUSD'
}

export type BeanFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeanFilter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<BeanCrossFilter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  currentSeason?: InputMaybe<Scalars['String']['input']>;
  currentSeason_?: InputMaybe<SeasonFilter>;
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
  dailySnapshots_?: InputMaybe<BeanDailySnapshotFilter>;
  dewhitelistedPools?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_?: InputMaybe<PoolFilter>;
  dewhitelistedPools_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not?: InputMaybe<Array<Scalars['String']['input']>>;
  dewhitelistedPools_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlySnapshots_?: InputMaybe<BeanHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<BeanFilter>>>;
  pools?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_?: InputMaybe<PoolFilter>;
  pools_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not?: InputMaybe<Array<Scalars['String']['input']>>;
  pools_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
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

export enum BeanOrderBy {
  createdTimestamp = 'createdTimestamp',
  crossEvents = 'crossEvents',
  crosses = 'crosses',
  currentSeason = 'currentSeason',
  currentSeason__id = 'currentSeason__id',
  currentSeason__season = 'currentSeason__season',
  currentSeason__timestamp = 'currentSeason__timestamp',
  dailySnapshots = 'dailySnapshots',
  dewhitelistedPools = 'dewhitelistedPools',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastCross = 'lastCross',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  lastPrice = 'lastPrice',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  liquidityUSD = 'liquidityUSD',
  lockedBeans = 'lockedBeans',
  pools = 'pools',
  supply = 'supply',
  supplyInPegLP = 'supplyInPegLP',
  volume = 'volume',
  volumeUSD = 'volumeUSD'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type BlockHeight = {
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
  orderBy?: InputMaybe<FarmerBalanceDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FarmerBalanceDailySnapshotFilter>;
};


export type FarmerBalanceHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FarmerBalanceHourlySnapshotFilter>;
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

export type FarmerBalanceDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FarmerBalanceDailySnapshotFilter>>>;
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
  farmerBalance_?: InputMaybe<FarmerBalanceFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FarmerBalanceDailySnapshotFilter>>>;
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<SeasonFilter>;
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

export enum FarmerBalanceDailySnapshotOrderBy {
  createdTimestamp = 'createdTimestamp',
  day = 'day',
  deltaFarmBalance = 'deltaFarmBalance',
  deltaTotalBalance = 'deltaTotalBalance',
  deltaWalletBalance = 'deltaWalletBalance',
  farmBalance = 'farmBalance',
  farmerBalance = 'farmerBalance',
  farmerBalance__farmBalance = 'farmerBalance__farmBalance',
  farmerBalance__farmer = 'farmerBalance__farmer',
  farmerBalance__id = 'farmerBalance__id',
  farmerBalance__lastDailySnapshotDay = 'farmerBalance__lastDailySnapshotDay',
  farmerBalance__lastHourlySnapshotSeason = 'farmerBalance__lastHourlySnapshotSeason',
  farmerBalance__token = 'farmerBalance__token',
  farmerBalance__totalBalance = 'farmerBalance__totalBalance',
  farmerBalance__walletBalance = 'farmerBalance__walletBalance',
  id = 'id',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  season = 'season',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  totalBalance = 'totalBalance',
  walletBalance = 'walletBalance'
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

export type FarmerBalanceHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FarmerBalanceHourlySnapshotFilter>>>;
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
  farmerBalance_?: InputMaybe<FarmerBalanceFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FarmerBalanceHourlySnapshotFilter>>>;
  season?: InputMaybe<Scalars['String']['input']>;
  seasonNumber?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  seasonNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_?: InputMaybe<SeasonFilter>;
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

export enum FarmerBalanceHourlySnapshotOrderBy {
  createdTimestamp = 'createdTimestamp',
  deltaFarmBalance = 'deltaFarmBalance',
  deltaTotalBalance = 'deltaTotalBalance',
  deltaWalletBalance = 'deltaWalletBalance',
  farmBalance = 'farmBalance',
  farmerBalance = 'farmerBalance',
  farmerBalance__farmBalance = 'farmerBalance__farmBalance',
  farmerBalance__farmer = 'farmerBalance__farmer',
  farmerBalance__id = 'farmerBalance__id',
  farmerBalance__lastDailySnapshotDay = 'farmerBalance__lastDailySnapshotDay',
  farmerBalance__lastHourlySnapshotSeason = 'farmerBalance__lastHourlySnapshotSeason',
  farmerBalance__token = 'farmerBalance__token',
  farmerBalance__totalBalance = 'farmerBalance__totalBalance',
  farmerBalance__walletBalance = 'farmerBalance__walletBalance',
  id = 'id',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  season = 'season',
  seasonNumber = 'seasonNumber',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  totalBalance = 'totalBalance',
  walletBalance = 'walletBalance'
}

export type FarmerBalanceFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FarmerBalanceFilter>>>;
  dailySnapshots_?: InputMaybe<FarmerBalanceDailySnapshotFilter>;
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
  hourlySnapshots_?: InputMaybe<FarmerBalanceHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FarmerBalanceFilter>>>;
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

export enum FarmerBalanceOrderBy {
  dailySnapshots = 'dailySnapshots',
  farmBalance = 'farmBalance',
  farmer = 'farmer',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  token = 'token',
  totalBalance = 'totalBalance',
  walletBalance = 'walletBalance'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  asc = 'asc',
  desc = 'desc'
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
  orderBy?: InputMaybe<PoolCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolCrossFilter>;
};


export type PoolDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolDailySnapshotFilter>;
};


export type PoolHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolHourlySnapshotFilter>;
};


export type PoolTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenFilter>;
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

export type PoolCrossFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  above?: InputMaybe<Scalars['Boolean']['input']>;
  above_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  above_not?: InputMaybe<Scalars['Boolean']['input']>;
  above_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PoolCrossFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PoolCrossFilter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot?: InputMaybe<Scalars['String']['input']>;
  poolDailySnapshot_?: InputMaybe<PoolDailySnapshotFilter>;
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
  poolHourlySnapshot_?: InputMaybe<PoolHourlySnapshotFilter>;
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
  pool_?: InputMaybe<PoolFilter>;
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

export enum PoolCrossOrderBy {
  above = 'above',
  blockNumber = 'blockNumber',
  cross = 'cross',
  id = 'id',
  pool = 'pool',
  poolDailySnapshot = 'poolDailySnapshot',
  poolDailySnapshot__createdTimestamp = 'poolDailySnapshot__createdTimestamp',
  poolDailySnapshot__crosses = 'poolDailySnapshot__crosses',
  poolDailySnapshot__day = 'poolDailySnapshot__day',
  poolDailySnapshot__deltaCrosses = 'poolDailySnapshot__deltaCrosses',
  poolDailySnapshot__deltaLiquidityUSD = 'poolDailySnapshot__deltaLiquidityUSD',
  poolDailySnapshot__deltaVolume = 'poolDailySnapshot__deltaVolume',
  poolDailySnapshot__deltaVolumeUSD = 'poolDailySnapshot__deltaVolumeUSD',
  poolDailySnapshot__id = 'poolDailySnapshot__id',
  poolDailySnapshot__instDeltaB = 'poolDailySnapshot__instDeltaB',
  poolDailySnapshot__instPrice = 'poolDailySnapshot__instPrice',
  poolDailySnapshot__lastUpdateBlockNumber = 'poolDailySnapshot__lastUpdateBlockNumber',
  poolDailySnapshot__lastUpdateTimestamp = 'poolDailySnapshot__lastUpdateTimestamp',
  poolDailySnapshot__liquidityUSD = 'poolDailySnapshot__liquidityUSD',
  poolDailySnapshot__twaBeanLiquidityUSD = 'poolDailySnapshot__twaBeanLiquidityUSD',
  poolDailySnapshot__twaDeltaB = 'poolDailySnapshot__twaDeltaB',
  poolDailySnapshot__twaLiquidityUSD = 'poolDailySnapshot__twaLiquidityUSD',
  poolDailySnapshot__twaNonBeanLiquidityUSD = 'poolDailySnapshot__twaNonBeanLiquidityUSD',
  poolDailySnapshot__twaPrice = 'poolDailySnapshot__twaPrice',
  poolDailySnapshot__twaToken2Price = 'poolDailySnapshot__twaToken2Price',
  poolDailySnapshot__volume = 'poolDailySnapshot__volume',
  poolDailySnapshot__volumeUSD = 'poolDailySnapshot__volumeUSD',
  poolHourlySnapshot = 'poolHourlySnapshot',
  poolHourlySnapshot__createdTimestamp = 'poolHourlySnapshot__createdTimestamp',
  poolHourlySnapshot__crosses = 'poolHourlySnapshot__crosses',
  poolHourlySnapshot__deltaCrosses = 'poolHourlySnapshot__deltaCrosses',
  poolHourlySnapshot__deltaLiquidityUSD = 'poolHourlySnapshot__deltaLiquidityUSD',
  poolHourlySnapshot__deltaVolume = 'poolHourlySnapshot__deltaVolume',
  poolHourlySnapshot__deltaVolumeUSD = 'poolHourlySnapshot__deltaVolumeUSD',
  poolHourlySnapshot__id = 'poolHourlySnapshot__id',
  poolHourlySnapshot__instDeltaB = 'poolHourlySnapshot__instDeltaB',
  poolHourlySnapshot__instPrice = 'poolHourlySnapshot__instPrice',
  poolHourlySnapshot__lastUpdateBlockNumber = 'poolHourlySnapshot__lastUpdateBlockNumber',
  poolHourlySnapshot__lastUpdateTimestamp = 'poolHourlySnapshot__lastUpdateTimestamp',
  poolHourlySnapshot__liquidityUSD = 'poolHourlySnapshot__liquidityUSD',
  poolHourlySnapshot__seasonNumber = 'poolHourlySnapshot__seasonNumber',
  poolHourlySnapshot__twaBeanLiquidityUSD = 'poolHourlySnapshot__twaBeanLiquidityUSD',
  poolHourlySnapshot__twaDeltaB = 'poolHourlySnapshot__twaDeltaB',
  poolHourlySnapshot__twaLiquidityUSD = 'poolHourlySnapshot__twaLiquidityUSD',
  poolHourlySnapshot__twaNonBeanLiquidityUSD = 'poolHourlySnapshot__twaNonBeanLiquidityUSD',
  poolHourlySnapshot__twaPrice = 'poolHourlySnapshot__twaPrice',
  poolHourlySnapshot__twaToken2Price = 'poolHourlySnapshot__twaToken2Price',
  poolHourlySnapshot__volume = 'poolHourlySnapshot__volume',
  poolHourlySnapshot__volumeUSD = 'poolHourlySnapshot__volumeUSD',
  pool__createdTimestamp = 'pool__createdTimestamp',
  pool__crosses = 'pool__crosses',
  pool__id = 'pool__id',
  pool__lastCross = 'pool__lastCross',
  pool__lastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  pool__lastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  pool__lastPrice = 'pool__lastPrice',
  pool__lastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  pool__lastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  pool__liquidityUSD = 'pool__liquidityUSD',
  pool__volume = 'pool__volume',
  pool__volumeUSD = 'pool__volumeUSD',
  price = 'price',
  timeSinceLastCross = 'timeSinceLastCross',
  timestamp = 'timestamp'
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
  orderBy?: InputMaybe<PoolCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolCrossFilter>;
};

export type PoolDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolDailySnapshotFilter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<PoolCrossFilter>;
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
  deltaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<PoolDailySnapshotFilter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<PoolFilter>;
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
  reserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<SeasonFilter>;
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
  twaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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

export enum PoolDailySnapshotOrderBy {
  createdTimestamp = 'createdTimestamp',
  crossEvents = 'crossEvents',
  crosses = 'crosses',
  day = 'day',
  deltaCrosses = 'deltaCrosses',
  deltaLiquidityUSD = 'deltaLiquidityUSD',
  deltaReserves = 'deltaReserves',
  deltaVolume = 'deltaVolume',
  deltaVolumeUSD = 'deltaVolumeUSD',
  id = 'id',
  instDeltaB = 'instDeltaB',
  instPrice = 'instPrice',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  liquidityUSD = 'liquidityUSD',
  pool = 'pool',
  pool__createdTimestamp = 'pool__createdTimestamp',
  pool__crosses = 'pool__crosses',
  pool__id = 'pool__id',
  pool__lastCross = 'pool__lastCross',
  pool__lastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  pool__lastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  pool__lastPrice = 'pool__lastPrice',
  pool__lastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  pool__lastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  pool__liquidityUSD = 'pool__liquidityUSD',
  pool__volume = 'pool__volume',
  pool__volumeUSD = 'pool__volumeUSD',
  reserves = 'reserves',
  season = 'season',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  twaBeanLiquidityUSD = 'twaBeanLiquidityUSD',
  twaDeltaB = 'twaDeltaB',
  twaLiquidityUSD = 'twaLiquidityUSD',
  twaNonBeanLiquidityUSD = 'twaNonBeanLiquidityUSD',
  twaPrice = 'twaPrice',
  twaReserves = 'twaReserves',
  twaToken2Price = 'twaToken2Price',
  volume = 'volume',
  volumeUSD = 'volumeUSD'
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
  orderBy?: InputMaybe<PoolCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolCrossFilter>;
};

export type PoolHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolHourlySnapshotFilter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  crossEvents_?: InputMaybe<PoolCrossFilter>;
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
  deltaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<PoolHourlySnapshotFilter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<PoolFilter>;
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
  reserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['String']['input']>;
  seasonNumber?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  seasonNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not?: InputMaybe<Scalars['Int']['input']>;
  seasonNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_?: InputMaybe<SeasonFilter>;
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
  twaReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  twaReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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

export enum PoolHourlySnapshotOrderBy {
  createdTimestamp = 'createdTimestamp',
  crossEvents = 'crossEvents',
  crosses = 'crosses',
  deltaCrosses = 'deltaCrosses',
  deltaLiquidityUSD = 'deltaLiquidityUSD',
  deltaReserves = 'deltaReserves',
  deltaVolume = 'deltaVolume',
  deltaVolumeUSD = 'deltaVolumeUSD',
  id = 'id',
  instDeltaB = 'instDeltaB',
  instPrice = 'instPrice',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  liquidityUSD = 'liquidityUSD',
  pool = 'pool',
  pool__createdTimestamp = 'pool__createdTimestamp',
  pool__crosses = 'pool__crosses',
  pool__id = 'pool__id',
  pool__lastCross = 'pool__lastCross',
  pool__lastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  pool__lastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  pool__lastPrice = 'pool__lastPrice',
  pool__lastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  pool__lastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  pool__liquidityUSD = 'pool__liquidityUSD',
  pool__volume = 'pool__volume',
  pool__volumeUSD = 'pool__volumeUSD',
  reserves = 'reserves',
  season = 'season',
  seasonNumber = 'seasonNumber',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  twaBeanLiquidityUSD = 'twaBeanLiquidityUSD',
  twaDeltaB = 'twaDeltaB',
  twaLiquidityUSD = 'twaLiquidityUSD',
  twaNonBeanLiquidityUSD = 'twaNonBeanLiquidityUSD',
  twaPrice = 'twaPrice',
  twaReserves = 'twaReserves',
  twaToken2Price = 'twaToken2Price',
  volume = 'volume',
  volumeUSD = 'volumeUSD'
}

export type PoolFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolFilter>>>;
  bean?: InputMaybe<Scalars['String']['input']>;
  bean_?: InputMaybe<BeanFilter>;
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
  crossEvents_?: InputMaybe<PoolCrossFilter>;
  crosses?: InputMaybe<Scalars['Int']['input']>;
  crosses_gt?: InputMaybe<Scalars['Int']['input']>;
  crosses_gte?: InputMaybe<Scalars['Int']['input']>;
  crosses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  crosses_lt?: InputMaybe<Scalars['Int']['input']>;
  crosses_lte?: InputMaybe<Scalars['Int']['input']>;
  crosses_not?: InputMaybe<Scalars['Int']['input']>;
  crosses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  currentSeason?: InputMaybe<Scalars['String']['input']>;
  currentSeason_?: InputMaybe<SeasonFilter>;
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
  dailySnapshots_?: InputMaybe<PoolDailySnapshotFilter>;
  hourlySnapshots_?: InputMaybe<PoolHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<PoolFilter>>>;
  reserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_?: InputMaybe<TokenFilter>;
  tokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
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

export enum PoolOrderBy {
  bean = 'bean',
  bean__createdTimestamp = 'bean__createdTimestamp',
  bean__crosses = 'bean__crosses',
  bean__id = 'bean__id',
  bean__lastCross = 'bean__lastCross',
  bean__lastDailySnapshotDay = 'bean__lastDailySnapshotDay',
  bean__lastHourlySnapshotSeason = 'bean__lastHourlySnapshotSeason',
  bean__lastPrice = 'bean__lastPrice',
  bean__lastUpdateBlockNumber = 'bean__lastUpdateBlockNumber',
  bean__lastUpdateTimestamp = 'bean__lastUpdateTimestamp',
  bean__liquidityUSD = 'bean__liquidityUSD',
  bean__lockedBeans = 'bean__lockedBeans',
  bean__supply = 'bean__supply',
  bean__supplyInPegLP = 'bean__supplyInPegLP',
  bean__volume = 'bean__volume',
  bean__volumeUSD = 'bean__volumeUSD',
  createdTimestamp = 'createdTimestamp',
  crossEvents = 'crossEvents',
  crosses = 'crosses',
  currentSeason = 'currentSeason',
  currentSeason__id = 'currentSeason__id',
  currentSeason__season = 'currentSeason__season',
  currentSeason__timestamp = 'currentSeason__timestamp',
  dailySnapshots = 'dailySnapshots',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastCross = 'lastCross',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  lastPrice = 'lastPrice',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  liquidityUSD = 'liquidityUSD',
  reserves = 'reserves',
  tokens = 'tokens',
  volume = 'volume',
  volumeUSD = 'volumeUSD'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<Meta>;
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


export type QueryMetaArgs = {
  block?: InputMaybe<BlockHeight>;
};


export type QueryBeanArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryBeanCrossArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryBeanCrossesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<BeanCrossFilter>;
};


export type QueryBeanDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryBeanDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<BeanDailySnapshotFilter>;
};


export type QueryBeanHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryBeanHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<BeanHourlySnapshotFilter>;
};


export type QueryBeansArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<BeanFilter>;
};


export type QueryFarmerBalanceArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFarmerBalanceDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFarmerBalanceDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FarmerBalanceDailySnapshotFilter>;
};


export type QueryFarmerBalanceHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFarmerBalanceHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FarmerBalanceHourlySnapshotFilter>;
};


export type QueryFarmerBalancesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerBalanceOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FarmerBalanceFilter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPoolCrossArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPoolCrossesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolCrossOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PoolCrossFilter>;
};


export type QueryPoolDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPoolDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PoolDailySnapshotFilter>;
};


export type QueryPoolHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPoolHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PoolHourlySnapshotFilter>;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PoolFilter>;
};


export type QuerySeasonArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySeasonsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SeasonOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SeasonFilter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTokenDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTokenDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TokenDailySnapshotFilter>;
};


export type QueryTokenHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTokenHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TokenHourlySnapshotFilter>;
};


export type QueryTokensArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TokenFilter>;
};


export type QueryTwaOracleArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTwaOraclesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TwaOracleOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TwaOracleFilter>;
};


export type QueryVersionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryVersionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VersionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<VersionFilter>;
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
  orderBy?: InputMaybe<PoolDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolDailySnapshotFilter>;
};


export type SeasonPoolHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolHourlySnapshotFilter>;
};

export type SeasonFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SeasonFilter>>>;
  beanDailySnapshot_?: InputMaybe<BeanDailySnapshotFilter>;
  beanHourlySnapshot_?: InputMaybe<BeanHourlySnapshotFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SeasonFilter>>>;
  poolDailySnapshots_?: InputMaybe<PoolDailySnapshotFilter>;
  poolHourlySnapshots_?: InputMaybe<PoolHourlySnapshotFilter>;
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

export enum SeasonOrderBy {
  beanDailySnapshot = 'beanDailySnapshot',
  beanDailySnapshot__createdTimestamp = 'beanDailySnapshot__createdTimestamp',
  beanDailySnapshot__crosses = 'beanDailySnapshot__crosses',
  beanDailySnapshot__day = 'beanDailySnapshot__day',
  beanDailySnapshot__deltaCrosses = 'beanDailySnapshot__deltaCrosses',
  beanDailySnapshot__deltaLiquidityUSD = 'beanDailySnapshot__deltaLiquidityUSD',
  beanDailySnapshot__deltaVolume = 'beanDailySnapshot__deltaVolume',
  beanDailySnapshot__deltaVolumeUSD = 'beanDailySnapshot__deltaVolumeUSD',
  beanDailySnapshot__id = 'beanDailySnapshot__id',
  beanDailySnapshot__instDeltaB = 'beanDailySnapshot__instDeltaB',
  beanDailySnapshot__instPrice = 'beanDailySnapshot__instPrice',
  beanDailySnapshot__l2sr = 'beanDailySnapshot__l2sr',
  beanDailySnapshot__lastUpdateBlockNumber = 'beanDailySnapshot__lastUpdateBlockNumber',
  beanDailySnapshot__lastUpdateTimestamp = 'beanDailySnapshot__lastUpdateTimestamp',
  beanDailySnapshot__liquidityUSD = 'beanDailySnapshot__liquidityUSD',
  beanDailySnapshot__lockedBeans = 'beanDailySnapshot__lockedBeans',
  beanDailySnapshot__marketCap = 'beanDailySnapshot__marketCap',
  beanDailySnapshot__supply = 'beanDailySnapshot__supply',
  beanDailySnapshot__supplyInPegLP = 'beanDailySnapshot__supplyInPegLP',
  beanDailySnapshot__twaBeanLiquidityUSD = 'beanDailySnapshot__twaBeanLiquidityUSD',
  beanDailySnapshot__twaDeltaB = 'beanDailySnapshot__twaDeltaB',
  beanDailySnapshot__twaLiquidityUSD = 'beanDailySnapshot__twaLiquidityUSD',
  beanDailySnapshot__twaNonBeanLiquidityUSD = 'beanDailySnapshot__twaNonBeanLiquidityUSD',
  beanDailySnapshot__twaPrice = 'beanDailySnapshot__twaPrice',
  beanDailySnapshot__volume = 'beanDailySnapshot__volume',
  beanDailySnapshot__volumeUSD = 'beanDailySnapshot__volumeUSD',
  beanHourlySnapshot = 'beanHourlySnapshot',
  beanHourlySnapshot__createdTimestamp = 'beanHourlySnapshot__createdTimestamp',
  beanHourlySnapshot__crosses = 'beanHourlySnapshot__crosses',
  beanHourlySnapshot__deltaCrosses = 'beanHourlySnapshot__deltaCrosses',
  beanHourlySnapshot__deltaLiquidityUSD = 'beanHourlySnapshot__deltaLiquidityUSD',
  beanHourlySnapshot__deltaVolume = 'beanHourlySnapshot__deltaVolume',
  beanHourlySnapshot__deltaVolumeUSD = 'beanHourlySnapshot__deltaVolumeUSD',
  beanHourlySnapshot__id = 'beanHourlySnapshot__id',
  beanHourlySnapshot__instDeltaB = 'beanHourlySnapshot__instDeltaB',
  beanHourlySnapshot__instPrice = 'beanHourlySnapshot__instPrice',
  beanHourlySnapshot__l2sr = 'beanHourlySnapshot__l2sr',
  beanHourlySnapshot__lastUpdateBlockNumber = 'beanHourlySnapshot__lastUpdateBlockNumber',
  beanHourlySnapshot__lastUpdateTimestamp = 'beanHourlySnapshot__lastUpdateTimestamp',
  beanHourlySnapshot__liquidityUSD = 'beanHourlySnapshot__liquidityUSD',
  beanHourlySnapshot__lockedBeans = 'beanHourlySnapshot__lockedBeans',
  beanHourlySnapshot__marketCap = 'beanHourlySnapshot__marketCap',
  beanHourlySnapshot__seasonNumber = 'beanHourlySnapshot__seasonNumber',
  beanHourlySnapshot__supply = 'beanHourlySnapshot__supply',
  beanHourlySnapshot__supplyInPegLP = 'beanHourlySnapshot__supplyInPegLP',
  beanHourlySnapshot__twaBeanLiquidityUSD = 'beanHourlySnapshot__twaBeanLiquidityUSD',
  beanHourlySnapshot__twaDeltaB = 'beanHourlySnapshot__twaDeltaB',
  beanHourlySnapshot__twaLiquidityUSD = 'beanHourlySnapshot__twaLiquidityUSD',
  beanHourlySnapshot__twaNonBeanLiquidityUSD = 'beanHourlySnapshot__twaNonBeanLiquidityUSD',
  beanHourlySnapshot__twaPrice = 'beanHourlySnapshot__twaPrice',
  beanHourlySnapshot__volume = 'beanHourlySnapshot__volume',
  beanHourlySnapshot__volumeUSD = 'beanHourlySnapshot__volumeUSD',
  id = 'id',
  poolDailySnapshots = 'poolDailySnapshots',
  poolHourlySnapshots = 'poolHourlySnapshots',
  season = 'season',
  timestamp = 'timestamp'
}

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
  orderBy?: InputMaybe<TokenDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenDailySnapshotFilter>;
};


export type TokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenHourlySnapshotFilter>;
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

export type TokenDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenDailySnapshotFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<TokenDailySnapshotFilter>>>;
  pooledBalance?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pooledBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  pooledBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['String']['input']>;
  season_?: InputMaybe<SeasonFilter>;
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
  token_?: InputMaybe<TokenFilter>;
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

export enum TokenDailySnapshotOrderBy {
  createdTimestamp = 'createdTimestamp',
  day = 'day',
  decimals = 'decimals',
  deltaFarmBalance = 'deltaFarmBalance',
  deltaLastPriceUSD = 'deltaLastPriceUSD',
  deltaPooledBalance = 'deltaPooledBalance',
  deltaSupply = 'deltaSupply',
  deltaWalletBalance = 'deltaWalletBalance',
  farmBalance = 'farmBalance',
  id = 'id',
  lastPriceUSD = 'lastPriceUSD',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  name = 'name',
  pooledBalance = 'pooledBalance',
  season = 'season',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  supply = 'supply',
  token = 'token',
  token__decimals = 'token__decimals',
  token__farmBalance = 'token__farmBalance',
  token__id = 'token__id',
  token__lastDailySnapshotDay = 'token__lastDailySnapshotDay',
  token__lastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  token__lastPriceUSD = 'token__lastPriceUSD',
  token__name = 'token__name',
  token__pooledBalance = 'token__pooledBalance',
  token__supply = 'token__supply',
  token__walletBalance = 'token__walletBalance',
  walletBalance = 'walletBalance'
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

export type TokenHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenHourlySnapshotFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<TokenHourlySnapshotFilter>>>;
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
  season_?: InputMaybe<SeasonFilter>;
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
  token_?: InputMaybe<TokenFilter>;
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

export enum TokenHourlySnapshotOrderBy {
  createdTimestamp = 'createdTimestamp',
  decimals = 'decimals',
  deltaFarmBalance = 'deltaFarmBalance',
  deltaLastPriceUSD = 'deltaLastPriceUSD',
  deltaPooledBalance = 'deltaPooledBalance',
  deltaSupply = 'deltaSupply',
  deltaWalletBalance = 'deltaWalletBalance',
  farmBalance = 'farmBalance',
  id = 'id',
  lastPriceUSD = 'lastPriceUSD',
  lastUpdateBlockNumber = 'lastUpdateBlockNumber',
  lastUpdateTimestamp = 'lastUpdateTimestamp',
  name = 'name',
  pooledBalance = 'pooledBalance',
  season = 'season',
  seasonNumber = 'seasonNumber',
  season__id = 'season__id',
  season__season = 'season__season',
  season__timestamp = 'season__timestamp',
  supply = 'supply',
  token = 'token',
  token__decimals = 'token__decimals',
  token__farmBalance = 'token__farmBalance',
  token__id = 'token__id',
  token__lastDailySnapshotDay = 'token__lastDailySnapshotDay',
  token__lastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  token__lastPriceUSD = 'token__lastPriceUSD',
  token__name = 'token__name',
  token__pooledBalance = 'token__pooledBalance',
  token__supply = 'token__supply',
  token__walletBalance = 'token__walletBalance',
  walletBalance = 'walletBalance'
}

export type TokenFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenFilter>>>;
  dailySnapshots_?: InputMaybe<TokenDailySnapshotFilter>;
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
  hourlySnapshots_?: InputMaybe<TokenHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<TokenFilter>>>;
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

export enum TokenOrderBy {
  dailySnapshots = 'dailySnapshots',
  decimals = 'decimals',
  farmBalance = 'farmBalance',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  lastPriceUSD = 'lastPriceUSD',
  name = 'name',
  pooledBalance = 'pooledBalance',
  supply = 'supply',
  walletBalance = 'walletBalance'
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

export type TwaOracleFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TwaOracleFilter>>>;
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
  lastBalances_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastBalances_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<TwaOracleFilter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_?: InputMaybe<PoolFilter>;
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
  priceCumulativeLast_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeLast_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  priceCumulativeSun_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum TwaOracleOrderBy {
  cumulativeWellReserves = 'cumulativeWellReserves',
  cumulativeWellReservesBlock = 'cumulativeWellReservesBlock',
  cumulativeWellReservesPrev = 'cumulativeWellReservesPrev',
  cumulativeWellReservesPrevBlock = 'cumulativeWellReservesPrevBlock',
  cumulativeWellReservesPrevTime = 'cumulativeWellReservesPrevTime',
  cumulativeWellReservesTime = 'cumulativeWellReservesTime',
  id = 'id',
  lastBalances = 'lastBalances',
  lastSun = 'lastSun',
  lastUpdated = 'lastUpdated',
  pool = 'pool',
  pool__createdTimestamp = 'pool__createdTimestamp',
  pool__crosses = 'pool__crosses',
  pool__id = 'pool__id',
  pool__lastCross = 'pool__lastCross',
  pool__lastDailySnapshotDay = 'pool__lastDailySnapshotDay',
  pool__lastHourlySnapshotSeason = 'pool__lastHourlySnapshotSeason',
  pool__lastPrice = 'pool__lastPrice',
  pool__lastUpdateBlockNumber = 'pool__lastUpdateBlockNumber',
  pool__lastUpdateTimestamp = 'pool__lastUpdateTimestamp',
  pool__liquidityUSD = 'pool__liquidityUSD',
  pool__volume = 'pool__volume',
  pool__volumeUSD = 'pool__volumeUSD',
  priceCumulativeLast = 'priceCumulativeLast',
  priceCumulativeSun = 'priceCumulativeSun'
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

export type VersionFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VersionFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<VersionFilter>>>;
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

export enum VersionOrderBy {
  chain = 'chain',
  id = 'id',
  protocolAddress = 'protocolAddress',
  subgraphName = 'subgraphName',
  versionNumber = 'versionNumber'
}

export type Block = {
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
export type Meta = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: Block;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum SubgraphErrorPolicy {
  /** Data will be returned even if the subgraph has indexing errors */
  allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  deny = 'deny'
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