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

export type Account = {
  __typename?: 'Account';
  id: Scalars['Bytes']['output'];
  trades: Array<Trade>;
};


export type AccountTradesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Trade_Filter>;
};

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  trades_?: InputMaybe<Trade_Filter>;
};

export enum Account_OrderBy {
  Id = 'id',
  Trades = 'trades'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type Aquifer = {
  __typename?: 'Aquifer';
  /** Smart contract address of the aquifer */
  id: Scalars['Bytes']['output'];
  /** Wells deployed by this aquifer */
  wells: Array<Well>;
};


export type AquiferWellsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Well_Filter>;
};

export type Aquifer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Aquifer_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Aquifer_Filter>>>;
  wells_?: InputMaybe<Well_Filter>;
};

export enum Aquifer_OrderBy {
  Id = 'id',
  Wells = 'wells'
}

export type Beanstalk = {
  __typename?: 'Beanstalk';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All bean buying volume, including converts. Subset of cumulativeTradeVolumeUSD. */
  cumulativeBuyVolumeUSD: Scalars['BigDecimal']['output'];
  /** All downconvert convert trading volume, in USD. Subset of cumulativeConvertVolumeUSD. */
  cumulativeConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  /** All LP->LP convert trading volume, in USD. Counts values from both Well interactions. A LP->LP convert is defined as a remove liquidity in one Well and add liquidity in another Well. Does not include L2L or AL2L converts which have no Well trading activity. Subset of cumulativeConvertVolumeUSD. */
  cumulativeConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All LP->LP convert transfer volume, in USD. Does NOT double count values from both well interactions. A LP->LP convert is defined as a remove liquidity in one Well and add liquidity in another Well. Does not include L2L or AL2L converts which have no Well trading activity. Subset of cumulativeConvertVolumeUSD. */
  cumulativeConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** All upconvert convert trading volume, in USD. Subset of cumulativeConvertVolumeUSD. */
  cumulativeConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  /** All bidirectional convert trading volume, in USD. Includes LP->LP converts which are neither up nor down. */
  cumulativeConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** All bean selling volume, including converts. Subset of cumulativeTradeVolumeUSD. */
  cumulativeSellVolumeUSD: Scalars['BigDecimal']['output'];
  /** All trade volume occurred, in USD. This includes any net trading activity as a result of add/remove liquidity. */
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All transfer volume occurred, in USD. This includes the full value of tokens transferred in add/remove liquidity. */
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** = 'beanstalk' */
  id: Scalars['ID']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['Int']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Last season seen from Beanstalk */
  lastSeason: Season;
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Rolling 24h of cumulativeBuyVolumeUSD */
  rollingDailyBuyVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeConvertDownVolumeUSD */
  rollingDailyConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeConvertNeutralTradeVolumeUSD */
  rollingDailyConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeConvertNeutralTransferVolumeUSD */
  rollingDailyConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeConvertUpVolumeUSD */
  rollingDailyConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeConvertVolumeUSD */
  rollingDailyConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeSellVolumeUSD */
  rollingDailySellVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeTradeVolumeUSD */
  rollingDailyTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeTransferVolumeUSD */
  rollingDailyTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeBuyVolumeUSD */
  rollingWeeklyBuyVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeConvertDownVolumeUSD */
  rollingWeeklyConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeConvertNeutralTradeVolumeUSD */
  rollingWeeklyConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeConvertNeutralTransferVolumeUSD */
  rollingWeeklyConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeConvertUpVolumeUSD */
  rollingWeeklyConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeConvertVolumeUSD */
  rollingWeeklyConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeSellVolumeUSD */
  rollingWeeklySellVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeTradeVolumeUSD */
  rollingWeeklyTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeTransferVolumeUSD */
  rollingWeeklyTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** The sum of all liquidity in USD all wells. */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Beanstalk Wells */
  wells: Array<Well>;
};


export type BeanstalkWellsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Well_Filter>;
};

export type BeanstalkDailySnapshot = {
  __typename?: 'BeanstalkDailySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All bean buying volume, including converts. */
  cumulativeBuyVolumeUSD: Scalars['BigDecimal']['output'];
  /** All downconvert convert trading volume, in USD. */
  cumulativeConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  /** All LP->LP convert trading volume, in USD. Counts values from both Well interactions. A LP->LP convert is defined as a remove liquidity in one Well and add liquidity in another Well. Does not include L2L or AL2L converts which have no Well trading activity. */
  cumulativeConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All LP->LP convert transfer volume, in USD. Does NOT double count values from both well interactions. A LP->LP convert is defined as a remove liquidity in one Well and add liquidity in another Well. Does not include L2L or AL2L converts which have no Well trading activity. */
  cumulativeConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** All upconvert convert trading volume, in USD. */
  cumulativeConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  /** All bidirectional convert trading volume, in USD. Includes LP->LP converts which are neither up nor down. */
  cumulativeConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** All bean selling volume, including converts. */
  cumulativeSellVolumeUSD: Scalars['BigDecimal']['output'];
  /** All trade volume occurred, in USD. This includes any net trading activity as a result of add/remove liquidity. */
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All transfer volume occurred, in USD. This includes the full value of tokens transferred in add/remove liquidity. */
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Unix day (int) */
  day: Scalars['Int']['output'];
  /** Delta of cumulativeBuyVolumeUSD */
  deltaBuyVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertDownVolumeUSD */
  deltaConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertNeutralTradeVolumeUSD */
  deltaConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertNeutralTransferVolumeUSD */
  deltaConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertUpVolumeUSD */
  deltaConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertVolumeUSD */
  deltaConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of totalLiquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeSellVolumeUSD */
  deltaSellVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeTradeVolumeUSD */
  deltaTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeTransferVolumeUSD */
  deltaTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Beanstalk ID}-{Unix day} */
  id: Scalars['ID']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Season */
  season: Season;
  /** The sum of all liquidity in USD all wells. */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Beanstalk Wells */
  wells: Array<Well>;
};


export type BeanstalkDailySnapshotWellsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Well_Filter>;
};

export type BeanstalkDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeanstalkDailySnapshot_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBuyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeBuyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertDownVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertDownVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertUpVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertUpVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSellVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSellVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaBuyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaBuyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertDownVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertDownVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertUpVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertUpVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaSellVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaSellVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<BeanstalkDailySnapshot_Filter>>>;
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
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  wells?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_?: InputMaybe<Well_Filter>;
  wells_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum BeanstalkDailySnapshot_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  CumulativeBuyVolumeUsd = 'cumulativeBuyVolumeUSD',
  CumulativeConvertDownVolumeUsd = 'cumulativeConvertDownVolumeUSD',
  CumulativeConvertNeutralTradeVolumeUsd = 'cumulativeConvertNeutralTradeVolumeUSD',
  CumulativeConvertNeutralTransferVolumeUsd = 'cumulativeConvertNeutralTransferVolumeUSD',
  CumulativeConvertUpVolumeUsd = 'cumulativeConvertUpVolumeUSD',
  CumulativeConvertVolumeUsd = 'cumulativeConvertVolumeUSD',
  CumulativeSellVolumeUsd = 'cumulativeSellVolumeUSD',
  CumulativeTradeVolumeUsd = 'cumulativeTradeVolumeUSD',
  CumulativeTransferVolumeUsd = 'cumulativeTransferVolumeUSD',
  Day = 'day',
  DeltaBuyVolumeUsd = 'deltaBuyVolumeUSD',
  DeltaConvertDownVolumeUsd = 'deltaConvertDownVolumeUSD',
  DeltaConvertNeutralTradeVolumeUsd = 'deltaConvertNeutralTradeVolumeUSD',
  DeltaConvertNeutralTransferVolumeUsd = 'deltaConvertNeutralTransferVolumeUSD',
  DeltaConvertUpVolumeUsd = 'deltaConvertUpVolumeUSD',
  DeltaConvertVolumeUsd = 'deltaConvertVolumeUSD',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaSellVolumeUsd = 'deltaSellVolumeUSD',
  DeltaTradeVolumeUsd = 'deltaTradeVolumeUSD',
  DeltaTransferVolumeUsd = 'deltaTransferVolumeUSD',
  Id = 'id',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  Wells = 'wells'
}

export type BeanstalkHourlySnapshot = {
  __typename?: 'BeanstalkHourlySnapshot';
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All bean buying volume, including converts. */
  cumulativeBuyVolumeUSD: Scalars['BigDecimal']['output'];
  /** All downconvert convert trading volume, in USD. */
  cumulativeConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  /** All LP->LP convert trading volume, in USD. Counts values from both Well interactions. A LP->LP convert is defined as a remove liquidity in one Well and add liquidity in another Well. Does not include L2L or AL2L converts which have no Well trading activity. */
  cumulativeConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All LP->LP convert transfer volume, in USD. Does NOT double count values from both well interactions. A LP->LP convert is defined as a remove liquidity in one Well and add liquidity in another Well. Does not include L2L or AL2L converts which have no Well trading activity. */
  cumulativeConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** All upconvert convert trading volume, in USD. */
  cumulativeConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  /** All bidirectional convert trading volume, in USD. Includes LP->LP converts which are neither up nor down. */
  cumulativeConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** All bean selling volume, including converts. */
  cumulativeSellVolumeUSD: Scalars['BigDecimal']['output'];
  /** All trade volume occurred, in USD. This includes any net trading activity as a result of add/remove liquidity. */
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All transfer volume occurred, in USD. This includes the full value of tokens transferred in add/remove liquidity. */
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeBuyVolumeUSD */
  deltaBuyVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertDownVolumeUSD */
  deltaConvertDownVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertNeutralTradeVolumeUSD */
  deltaConvertNeutralTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertNeutralTransferVolumeUSD */
  deltaConvertNeutralTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertUpVolumeUSD */
  deltaConvertUpVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeConvertVolumeUSD */
  deltaConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of totalLiquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeSellVolumeUSD */
  deltaSellVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeTradeVolumeUSD */
  deltaTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeTransferVolumeUSD */
  deltaTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Beanstalk ID}-{Season number} */
  id: Scalars['ID']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Season */
  season: Season;
  /** The sum of all liquidity in USD all wells. */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Beanstalk Wells */
  wells: Array<Well>;
};


export type BeanstalkHourlySnapshotWellsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Well_Filter>;
};

export type BeanstalkHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeanstalkHourlySnapshot_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBuyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeBuyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertDownVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertDownVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertUpVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertUpVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSellVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSellVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaBuyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaBuyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaBuyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertDownVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertDownVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertNeutralTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertNeutralTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertUpVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertUpVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertUpVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaSellVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaSellVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaSellVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<BeanstalkHourlySnapshot_Filter>>>;
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
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  wells?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_?: InputMaybe<Well_Filter>;
  wells_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum BeanstalkHourlySnapshot_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  CumulativeBuyVolumeUsd = 'cumulativeBuyVolumeUSD',
  CumulativeConvertDownVolumeUsd = 'cumulativeConvertDownVolumeUSD',
  CumulativeConvertNeutralTradeVolumeUsd = 'cumulativeConvertNeutralTradeVolumeUSD',
  CumulativeConvertNeutralTransferVolumeUsd = 'cumulativeConvertNeutralTransferVolumeUSD',
  CumulativeConvertUpVolumeUsd = 'cumulativeConvertUpVolumeUSD',
  CumulativeConvertVolumeUsd = 'cumulativeConvertVolumeUSD',
  CumulativeSellVolumeUsd = 'cumulativeSellVolumeUSD',
  CumulativeTradeVolumeUsd = 'cumulativeTradeVolumeUSD',
  CumulativeTransferVolumeUsd = 'cumulativeTransferVolumeUSD',
  DeltaBuyVolumeUsd = 'deltaBuyVolumeUSD',
  DeltaConvertDownVolumeUsd = 'deltaConvertDownVolumeUSD',
  DeltaConvertNeutralTradeVolumeUsd = 'deltaConvertNeutralTradeVolumeUSD',
  DeltaConvertNeutralTransferVolumeUsd = 'deltaConvertNeutralTransferVolumeUSD',
  DeltaConvertUpVolumeUsd = 'deltaConvertUpVolumeUSD',
  DeltaConvertVolumeUsd = 'deltaConvertVolumeUSD',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaSellVolumeUsd = 'deltaSellVolumeUSD',
  DeltaTradeVolumeUsd = 'deltaTradeVolumeUSD',
  DeltaTransferVolumeUsd = 'deltaTransferVolumeUSD',
  Id = 'id',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  Wells = 'wells'
}

export type Beanstalk_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Beanstalk_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBuyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeBuyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeBuyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertDownVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertDownVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertDownVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertNeutralTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertNeutralTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertUpVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertUpVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertUpVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSellVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSellVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSellVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  lastSeason?: InputMaybe<Scalars['String']['input']>;
  lastSeason_?: InputMaybe<Season_Filter>;
  lastSeason_contains?: InputMaybe<Scalars['String']['input']>;
  lastSeason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastSeason_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastSeason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastSeason_gt?: InputMaybe<Scalars['String']['input']>;
  lastSeason_gte?: InputMaybe<Scalars['String']['input']>;
  lastSeason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastSeason_lt?: InputMaybe<Scalars['String']['input']>;
  lastSeason_lte?: InputMaybe<Scalars['String']['input']>;
  lastSeason_not?: InputMaybe<Scalars['String']['input']>;
  lastSeason_not_contains?: InputMaybe<Scalars['String']['input']>;
  lastSeason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastSeason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastSeason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastSeason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastSeason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastSeason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastSeason_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastSeason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  or?: InputMaybe<Array<InputMaybe<Beanstalk_Filter>>>;
  rollingDailyBuyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyBuyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyBuyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyBuyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyBuyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyBuyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyBuyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyBuyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertDownVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertDownVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertDownVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertDownVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertDownVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertDownVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertDownVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertDownVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertNeutralTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertNeutralTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertNeutralTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertNeutralTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertNeutralTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertUpVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertUpVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertUpVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertUpVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertUpVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertUpVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertUpVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertUpVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailySellVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailySellVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailySellVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailySellVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailySellVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailySellVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailySellVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailySellVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyBuyVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyBuyVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyBuyVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyBuyVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyBuyVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyBuyVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyBuyVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyBuyVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertDownVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertDownVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertDownVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertDownVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertDownVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertDownVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertDownVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertDownVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertNeutralTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertNeutralTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertNeutralTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertNeutralTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertNeutralTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertUpVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertUpVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertUpVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertUpVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertUpVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertUpVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertUpVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertUpVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklySellVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklySellVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklySellVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklySellVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklySellVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklySellVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklySellVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklySellVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  wells?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_?: InputMaybe<Well_Filter>;
  wells_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  wells_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum Beanstalk_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  CumulativeBuyVolumeUsd = 'cumulativeBuyVolumeUSD',
  CumulativeConvertDownVolumeUsd = 'cumulativeConvertDownVolumeUSD',
  CumulativeConvertNeutralTradeVolumeUsd = 'cumulativeConvertNeutralTradeVolumeUSD',
  CumulativeConvertNeutralTransferVolumeUsd = 'cumulativeConvertNeutralTransferVolumeUSD',
  CumulativeConvertUpVolumeUsd = 'cumulativeConvertUpVolumeUSD',
  CumulativeConvertVolumeUsd = 'cumulativeConvertVolumeUSD',
  CumulativeSellVolumeUsd = 'cumulativeSellVolumeUSD',
  CumulativeTradeVolumeUsd = 'cumulativeTradeVolumeUSD',
  CumulativeTransferVolumeUsd = 'cumulativeTransferVolumeUSD',
  Id = 'id',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  LastSeason = 'lastSeason',
  LastSeasonId = 'lastSeason__id',
  LastSeasonSeason = 'lastSeason__season',
  LastSeasonTimestamp = 'lastSeason__timestamp',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  RollingDailyBuyVolumeUsd = 'rollingDailyBuyVolumeUSD',
  RollingDailyConvertDownVolumeUsd = 'rollingDailyConvertDownVolumeUSD',
  RollingDailyConvertNeutralTradeVolumeUsd = 'rollingDailyConvertNeutralTradeVolumeUSD',
  RollingDailyConvertNeutralTransferVolumeUsd = 'rollingDailyConvertNeutralTransferVolumeUSD',
  RollingDailyConvertUpVolumeUsd = 'rollingDailyConvertUpVolumeUSD',
  RollingDailyConvertVolumeUsd = 'rollingDailyConvertVolumeUSD',
  RollingDailySellVolumeUsd = 'rollingDailySellVolumeUSD',
  RollingDailyTradeVolumeUsd = 'rollingDailyTradeVolumeUSD',
  RollingDailyTransferVolumeUsd = 'rollingDailyTransferVolumeUSD',
  RollingWeeklyBuyVolumeUsd = 'rollingWeeklyBuyVolumeUSD',
  RollingWeeklyConvertDownVolumeUsd = 'rollingWeeklyConvertDownVolumeUSD',
  RollingWeeklyConvertNeutralTradeVolumeUsd = 'rollingWeeklyConvertNeutralTradeVolumeUSD',
  RollingWeeklyConvertNeutralTransferVolumeUsd = 'rollingWeeklyConvertNeutralTransferVolumeUSD',
  RollingWeeklyConvertUpVolumeUsd = 'rollingWeeklyConvertUpVolumeUSD',
  RollingWeeklyConvertVolumeUsd = 'rollingWeeklyConvertVolumeUSD',
  RollingWeeklySellVolumeUsd = 'rollingWeeklySellVolumeUSD',
  RollingWeeklyTradeVolumeUsd = 'rollingWeeklyTradeVolumeUSD',
  RollingWeeklyTransferVolumeUsd = 'rollingWeeklyTransferVolumeUSD',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  Wells = 'wells'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type ConvertCandidate = {
  __typename?: 'ConvertCandidate';
  /** The most recent add liquidity Trade */
  addLiquidityTrade?: Maybe<Trade>;
  /** internal */
  id: Scalars['ID']['output'];
  /** The most recent remove liquidity Trade */
  removeLiquidityTrade?: Maybe<Trade>;
};

export type ConvertCandidate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addLiquidityTrade?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_?: InputMaybe<Trade_Filter>;
  addLiquidityTrade_contains?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_ends_with?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_gt?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_gte?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addLiquidityTrade_lt?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_lte?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_not?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_not_contains?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addLiquidityTrade_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_starts_with?: InputMaybe<Scalars['String']['input']>;
  addLiquidityTrade_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<ConvertCandidate_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ConvertCandidate_Filter>>>;
  removeLiquidityTrade?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_?: InputMaybe<Trade_Filter>;
  removeLiquidityTrade_contains?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_ends_with?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_gt?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_gte?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_in?: InputMaybe<Array<Scalars['String']['input']>>;
  removeLiquidityTrade_lt?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_lte?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_not?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_not_contains?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  removeLiquidityTrade_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_starts_with?: InputMaybe<Scalars['String']['input']>;
  removeLiquidityTrade_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ConvertCandidate_OrderBy {
  AddLiquidityTrade = 'addLiquidityTrade',
  AddLiquidityTradeBlockNumber = 'addLiquidityTrade__blockNumber',
  AddLiquidityTradeHash = 'addLiquidityTrade__hash',
  AddLiquidityTradeId = 'addLiquidityTrade__id',
  AddLiquidityTradeIsConvert = 'addLiquidityTrade__isConvert',
  AddLiquidityTradeLiqLpTokenAmount = 'addLiquidityTrade__liqLpTokenAmount',
  AddLiquidityTradeLogIndex = 'addLiquidityTrade__logIndex',
  AddLiquidityTradeSwapAmountIn = 'addLiquidityTrade__swapAmountIn',
  AddLiquidityTradeSwapAmountOut = 'addLiquidityTrade__swapAmountOut',
  AddLiquidityTradeTimestamp = 'addLiquidityTrade__timestamp',
  AddLiquidityTradeTradeType = 'addLiquidityTrade__tradeType',
  AddLiquidityTradeTradeVolumeUsd = 'addLiquidityTrade__tradeVolumeUSD',
  AddLiquidityTradeTransferVolumeUsd = 'addLiquidityTrade__transferVolumeUSD',
  Id = 'id',
  RemoveLiquidityTrade = 'removeLiquidityTrade',
  RemoveLiquidityTradeBlockNumber = 'removeLiquidityTrade__blockNumber',
  RemoveLiquidityTradeHash = 'removeLiquidityTrade__hash',
  RemoveLiquidityTradeId = 'removeLiquidityTrade__id',
  RemoveLiquidityTradeIsConvert = 'removeLiquidityTrade__isConvert',
  RemoveLiquidityTradeLiqLpTokenAmount = 'removeLiquidityTrade__liqLpTokenAmount',
  RemoveLiquidityTradeLogIndex = 'removeLiquidityTrade__logIndex',
  RemoveLiquidityTradeSwapAmountIn = 'removeLiquidityTrade__swapAmountIn',
  RemoveLiquidityTradeSwapAmountOut = 'removeLiquidityTrade__swapAmountOut',
  RemoveLiquidityTradeTimestamp = 'removeLiquidityTrade__timestamp',
  RemoveLiquidityTradeTradeType = 'removeLiquidityTrade__tradeType',
  RemoveLiquidityTradeTradeVolumeUsd = 'removeLiquidityTrade__tradeVolumeUSD',
  RemoveLiquidityTradeTransferVolumeUsd = 'removeLiquidityTrade__transferVolumeUSD'
}

export type Implementation = {
  __typename?: 'Implementation';
  /** Implementation address */
  id: Scalars['Bytes']['output'];
  /** Wells deployed with this implementation */
  wells: Array<Well>;
};


export type ImplementationWellsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Well_Filter>;
};

export type Implementation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Implementation_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Implementation_Filter>>>;
  wells_?: InputMaybe<Well_Filter>;
};

export enum Implementation_OrderBy {
  Id = 'id',
  Wells = 'wells'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pump = {
  __typename?: 'Pump';
  /** Pump address */
  id: Scalars['Bytes']['output'];
  /** Wells associated with this pump */
  wells: Array<Well>;
};


export type PumpWellsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Well_Filter>;
};

export type Pump_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Pump_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Pump_Filter>>>;
  wells_?: InputMaybe<Well_Filter>;
};

export enum Pump_OrderBy {
  Id = 'id',
  Wells = 'wells'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  aquifer?: Maybe<Aquifer>;
  aquifers: Array<Aquifer>;
  beanstalk?: Maybe<Beanstalk>;
  beanstalkDailySnapshot?: Maybe<BeanstalkDailySnapshot>;
  beanstalkDailySnapshots: Array<BeanstalkDailySnapshot>;
  beanstalkHourlySnapshot?: Maybe<BeanstalkHourlySnapshot>;
  beanstalkHourlySnapshots: Array<BeanstalkHourlySnapshot>;
  beanstalks: Array<Beanstalk>;
  convertCandidate?: Maybe<ConvertCandidate>;
  convertCandidates: Array<ConvertCandidate>;
  implementation?: Maybe<Implementation>;
  implementations: Array<Implementation>;
  pump?: Maybe<Pump>;
  pumps: Array<Pump>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  well?: Maybe<Well>;
  wellDailySnapshot?: Maybe<WellDailySnapshot>;
  wellDailySnapshots: Array<WellDailySnapshot>;
  wellFunction?: Maybe<WellFunction>;
  wellFunctions: Array<WellFunction>;
  wellHourlySnapshot?: Maybe<WellHourlySnapshot>;
  wellHourlySnapshots: Array<WellHourlySnapshot>;
  wellUpgradeHistories: Array<WellUpgradeHistory>;
  wellUpgradeHistory?: Maybe<WellUpgradeHistory>;
  wells: Array<Well>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type QueryAquiferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAquifersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Aquifer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Aquifer_Filter>;
};


export type QueryBeanstalkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanstalkDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanstalkDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanstalkDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanstalkDailySnapshot_Filter>;
};


export type QueryBeanstalkHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeanstalkHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanstalkHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanstalkHourlySnapshot_Filter>;
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


export type QueryConvertCandidateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryConvertCandidatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ConvertCandidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConvertCandidate_Filter>;
};


export type QueryImplementationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryImplementationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Implementation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Implementation_Filter>;
};


export type QueryPumpArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPumpsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pump_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pump_Filter>;
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


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
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


export type QueryWellArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWellDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWellDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellDailySnapshot_Filter>;
};


export type QueryWellFunctionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWellFunctionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellFunction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellFunction_Filter>;
};


export type QueryWellHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWellHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellHourlySnapshot_Filter>;
};


export type QueryWellUpgradeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellUpgradeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellUpgradeHistory_Filter>;
};


export type QueryWellUpgradeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWellsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Well_Filter>;
};

export type Season = {
  __typename?: 'Season';
  beanstalkDailySnapshots: Array<BeanstalkDailySnapshot>;
  beanstalkHourlySnapshots: Array<BeanstalkHourlySnapshot>;
  /** Season number (string) */
  id: Scalars['ID']['output'];
  /** Season number (int)  */
  season: Scalars['Int']['output'];
  /** Timestamp of the start of this season */
  timestamp: Scalars['BigInt']['output'];
  wellDailySnapshots: Array<WellDailySnapshot>;
  wellHourlySnapshots: Array<WellHourlySnapshot>;
};


export type SeasonBeanstalkDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanstalkDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanstalkDailySnapshot_Filter>;
};


export type SeasonBeanstalkHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanstalkHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BeanstalkHourlySnapshot_Filter>;
};


export type SeasonWellDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WellDailySnapshot_Filter>;
};


export type SeasonWellHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WellHourlySnapshot_Filter>;
};

export type Season_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Season_Filter>>>;
  beanstalkDailySnapshots_?: InputMaybe<BeanstalkDailySnapshot_Filter>;
  beanstalkHourlySnapshots_?: InputMaybe<BeanstalkHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Season_Filter>>>;
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
  wellDailySnapshots_?: InputMaybe<WellDailySnapshot_Filter>;
  wellHourlySnapshots_?: InputMaybe<WellHourlySnapshot_Filter>;
};

export enum Season_OrderBy {
  BeanstalkDailySnapshots = 'beanstalkDailySnapshots',
  BeanstalkHourlySnapshots = 'beanstalkHourlySnapshots',
  Id = 'id',
  Season = 'season',
  Timestamp = 'timestamp',
  WellDailySnapshots = 'wellDailySnapshots',
  WellHourlySnapshots = 'wellHourlySnapshots'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  aquifer?: Maybe<Aquifer>;
  aquifers: Array<Aquifer>;
  beanstalk?: Maybe<Beanstalk>;
  beanstalkDailySnapshot?: Maybe<BeanstalkDailySnapshot>;
  beanstalkDailySnapshots: Array<BeanstalkDailySnapshot>;
  beanstalkHourlySnapshot?: Maybe<BeanstalkHourlySnapshot>;
  beanstalkHourlySnapshots: Array<BeanstalkHourlySnapshot>;
  beanstalks: Array<Beanstalk>;
  convertCandidate?: Maybe<ConvertCandidate>;
  convertCandidates: Array<ConvertCandidate>;
  implementation?: Maybe<Implementation>;
  implementations: Array<Implementation>;
  pump?: Maybe<Pump>;
  pumps: Array<Pump>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  well?: Maybe<Well>;
  wellDailySnapshot?: Maybe<WellDailySnapshot>;
  wellDailySnapshots: Array<WellDailySnapshot>;
  wellFunction?: Maybe<WellFunction>;
  wellFunctions: Array<WellFunction>;
  wellHourlySnapshot?: Maybe<WellHourlySnapshot>;
  wellHourlySnapshots: Array<WellHourlySnapshot>;
  wellUpgradeHistories: Array<WellUpgradeHistory>;
  wellUpgradeHistory?: Maybe<WellUpgradeHistory>;
  wells: Array<Well>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type SubscriptionAquiferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAquifersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Aquifer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Aquifer_Filter>;
};


export type SubscriptionBeanstalkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanstalkDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanstalkDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanstalkDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanstalkDailySnapshot_Filter>;
};


export type SubscriptionBeanstalkHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeanstalkHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanstalkHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeanstalkHourlySnapshot_Filter>;
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


export type SubscriptionConvertCandidateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionConvertCandidatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ConvertCandidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConvertCandidate_Filter>;
};


export type SubscriptionImplementationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionImplementationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Implementation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Implementation_Filter>;
};


export type SubscriptionPumpArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPumpsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pump_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pump_Filter>;
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


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type SubscriptionTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
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


export type SubscriptionWellArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWellDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWellDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellDailySnapshot_Filter>;
};


export type SubscriptionWellFunctionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWellFunctionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellFunction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellFunction_Filter>;
};


export type SubscriptionWellHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWellHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellHourlySnapshot_Filter>;
};


export type SubscriptionWellUpgradeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellUpgradeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WellUpgradeHistory_Filter>;
};


export type SubscriptionWellUpgradeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWellsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Well_Filter>;
};

export type Token = {
  __typename?: 'Token';
  /** The number of decimal places this token uses, default to 18 */
  decimals: Scalars['Int']['output'];
  /** Smart contract address of the token */
  id: Scalars['Bytes']['output'];
  /** Optional field to track the block number of the last token price */
  lastPriceBlockNumber: Scalars['BigInt']['output'];
  /** Optional field to track the price of a token, mostly for caching purposes */
  lastPriceUSD: Scalars['BigDecimal']['output'];
  /** Name of the token, mirrored from the smart contract */
  name: Scalars['String']['output'];
  /** Symbol of the token, mirrored from the smart contract */
  symbol: Scalars['String']['output'];
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  lastPriceBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPriceBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Token_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  LastPriceBlockNumber = 'lastPriceBlockNumber',
  LastPriceUsd = 'lastPriceUSD',
  Name = 'name',
  Symbol = 'symbol'
}

export type Trade = {
  __typename?: 'Trade';
  /** Account that sent this transaction */
  account: Account;
  /** Well.reserves after this event */
  afterReserves: Array<Scalars['BigInt']['output']>;
  /** Well.tokenRates before this event */
  afterTokenRates: Array<Scalars['BigDecimal']['output']>;
  /** Well.reserves before this event */
  beforeReserves: Array<Scalars['BigInt']['output']>;
  /** Well.tokenRates before this event */
  beforeTokenRates: Array<Scalars['BigDecimal']['output']>;
  /** Same as tradeVolumeReserves, but further includes absolute tokens on both sides of the effective trade. */
  biTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Block number of this event */
  blockNumber: Scalars['BigInt']['output'];
  /** Transaction hash of the transaction that emitted this event */
  hash: Scalars['Bytes']['output'];
  /** {TradeType}-{Transaction hash}-{Well}-{LP token amount}(-{log index})? | The ID is constructed in this fashion to allow any subsequent event in the same transaction to identify this entity. (Adds log index if necessary to prevent collision) */
  id: Scalars['ID']['output'];
  /** [Add/Remove Liquidity] Boolean indicating whether this liquidity addition is a Beanstalk convert */
  isConvert: Scalars['Boolean']['output'];
  /** [Add/Remove Liquidity] Amount of liquidity tokens minted/burned */
  liqLpTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /** [Add/Remove Liquidity] Amount of input/output tokens */
  liqReservesAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /** Event log index. */
  logIndex: Scalars['Int']['output'];
  /** [Swap] Amount of token sold into the well */
  swapAmountIn?: Maybe<Scalars['BigInt']['output']>;
  /** [Swap] Amount of the token bought from the well */
  swapAmountOut?: Maybe<Scalars['BigInt']['output']>;
  /** [Swap] Token sold into the well */
  swapFromToken?: Maybe<Token>;
  /** [Swap] Token bought from the well */
  swapToToken?: Maybe<Token>;
  /** Timestamp of this event */
  timestamp: Scalars['BigInt']['output'];
  /** Trade type discriminator */
  tradeType: TradeType;
  /** Trade volume for each token, in native amount, as a result of this event. The ordering should be the same as the well's `tokens` field. */
  tradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Trade volume for each token, in USD, as a result of this event. The ordering should be the same as the well's `tokens` field. */
  tradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Trade volume in USD as a result of this event. */
  tradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Transfer volume for each token, in native amount. The ordering should be the same as the well's `tokens` field. */
  transferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Transfer volume for each token, in USD. The ordering should be the same as the well's `tokens` field. */
  transferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Transfer volume in USD as a result of this event. */
  transferVolumeUSD: Scalars['BigDecimal']['output'];
  /** The well this trade occurred in */
  well: Well;
};

export enum TradeType {
  AddLiquidity = 'ADD_LIQUIDITY',
  RemoveLiquidity = 'REMOVE_LIQUIDITY',
  Swap = 'SWAP'
}

export type Trade_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  afterReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  afterReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  afterReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  afterReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  afterReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  afterReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  afterTokenRates?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  afterTokenRates_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  afterTokenRates_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  afterTokenRates_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  afterTokenRates_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  afterTokenRates_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  beforeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beforeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beforeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beforeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beforeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beforeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beforeTokenRates?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beforeTokenRates_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beforeTokenRates_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beforeTokenRates_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beforeTokenRates_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beforeTokenRates_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  biTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  biTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  biTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  biTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  biTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  biTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  isConvert?: InputMaybe<Scalars['Boolean']['input']>;
  isConvert_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isConvert_not?: InputMaybe<Scalars['Boolean']['input']>;
  isConvert_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  liqLpTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  liqLpTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liqLpTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liqLpTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liqLpTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liqLpTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liqLpTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  liqLpTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liqReservesAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liqReservesAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liqReservesAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liqReservesAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liqReservesAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liqReservesAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Trade_Filter>>>;
  swapAmountIn?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountIn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountIn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountIn_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swapAmountIn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountIn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountIn_not?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountIn_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swapAmountOut?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountOut_gt?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountOut_gte?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountOut_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swapAmountOut_lt?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountOut_lte?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountOut_not?: InputMaybe<Scalars['BigInt']['input']>;
  swapAmountOut_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swapFromToken?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_?: InputMaybe<Token_Filter>;
  swapFromToken_contains?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_gt?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_gte?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  swapFromToken_lt?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_lte?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_not?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  swapFromToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  swapFromToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapToToken?: InputMaybe<Scalars['String']['input']>;
  swapToToken_?: InputMaybe<Token_Filter>;
  swapToToken_contains?: InputMaybe<Scalars['String']['input']>;
  swapToToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  swapToToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  swapToToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapToToken_gt?: InputMaybe<Scalars['String']['input']>;
  swapToToken_gte?: InputMaybe<Scalars['String']['input']>;
  swapToToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  swapToToken_lt?: InputMaybe<Scalars['String']['input']>;
  swapToToken_lte?: InputMaybe<Scalars['String']['input']>;
  swapToToken_not?: InputMaybe<Scalars['String']['input']>;
  swapToToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  swapToToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  swapToToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  swapToToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapToToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  swapToToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  swapToToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  swapToToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  swapToToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeType?: InputMaybe<TradeType>;
  tradeType_in?: InputMaybe<Array<TradeType>>;
  tradeType_not?: InputMaybe<TradeType>;
  tradeType_not_in?: InputMaybe<Array<TradeType>>;
  tradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  transferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  transferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  transferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  transferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  transferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  transferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  transferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  well?: InputMaybe<Scalars['String']['input']>;
  well_?: InputMaybe<Well_Filter>;
  well_contains?: InputMaybe<Scalars['String']['input']>;
  well_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_gt?: InputMaybe<Scalars['String']['input']>;
  well_gte?: InputMaybe<Scalars['String']['input']>;
  well_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_lt?: InputMaybe<Scalars['String']['input']>;
  well_lte?: InputMaybe<Scalars['String']['input']>;
  well_not?: InputMaybe<Scalars['String']['input']>;
  well_not_contains?: InputMaybe<Scalars['String']['input']>;
  well_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Trade_OrderBy {
  Account = 'account',
  AccountId = 'account__id',
  AfterReserves = 'afterReserves',
  AfterTokenRates = 'afterTokenRates',
  BeforeReserves = 'beforeReserves',
  BeforeTokenRates = 'beforeTokenRates',
  BiTradeVolumeReserves = 'biTradeVolumeReserves',
  BlockNumber = 'blockNumber',
  Hash = 'hash',
  Id = 'id',
  IsConvert = 'isConvert',
  LiqLpTokenAmount = 'liqLpTokenAmount',
  LiqReservesAmount = 'liqReservesAmount',
  LogIndex = 'logIndex',
  SwapAmountIn = 'swapAmountIn',
  SwapAmountOut = 'swapAmountOut',
  SwapFromToken = 'swapFromToken',
  SwapFromTokenDecimals = 'swapFromToken__decimals',
  SwapFromTokenId = 'swapFromToken__id',
  SwapFromTokenLastPriceBlockNumber = 'swapFromToken__lastPriceBlockNumber',
  SwapFromTokenLastPriceUsd = 'swapFromToken__lastPriceUSD',
  SwapFromTokenName = 'swapFromToken__name',
  SwapFromTokenSymbol = 'swapFromToken__symbol',
  SwapToToken = 'swapToToken',
  SwapToTokenDecimals = 'swapToToken__decimals',
  SwapToTokenId = 'swapToToken__id',
  SwapToTokenLastPriceBlockNumber = 'swapToToken__lastPriceBlockNumber',
  SwapToTokenLastPriceUsd = 'swapToToken__lastPriceUSD',
  SwapToTokenName = 'swapToToken__name',
  SwapToTokenSymbol = 'swapToToken__symbol',
  Timestamp = 'timestamp',
  TradeType = 'tradeType',
  TradeVolumeReserves = 'tradeVolumeReserves',
  TradeVolumeReservesUsd = 'tradeVolumeReservesUSD',
  TradeVolumeUsd = 'tradeVolumeUSD',
  TransferVolumeReserves = 'transferVolumeReserves',
  TransferVolumeReservesUsd = 'transferVolumeReservesUSD',
  TransferVolumeUsd = 'transferVolumeUSD',
  Well = 'well',
  WellBoredWell = 'well__boredWell',
  WellConvertVolumeUsd = 'well__convertVolumeUSD',
  WellCreatedTimestamp = 'well__createdTimestamp',
  WellCumulativeTradeVolumeUsd = 'well__cumulativeTradeVolumeUSD',
  WellCumulativeTransferVolumeUsd = 'well__cumulativeTransferVolumeUSD',
  WellId = 'well__id',
  WellIsBeanstalk = 'well__isBeanstalk',
  WellLastDailySnapshotDay = 'well__lastDailySnapshotDay',
  WellLastHourlySnapshotHour = 'well__lastHourlySnapshotHour',
  WellLastUpdateBlockNumber = 'well__lastUpdateBlockNumber',
  WellLastUpdateTimestamp = 'well__lastUpdateTimestamp',
  WellLpTokenSupply = 'well__lpTokenSupply',
  WellName = 'well__name',
  WellRollingDailyConvertVolumeUsd = 'well__rollingDailyConvertVolumeUSD',
  WellRollingDailyTradeVolumeUsd = 'well__rollingDailyTradeVolumeUSD',
  WellRollingDailyTransferVolumeUsd = 'well__rollingDailyTransferVolumeUSD',
  WellRollingWeeklyConvertVolumeUsd = 'well__rollingWeeklyConvertVolumeUSD',
  WellRollingWeeklyTradeVolumeUsd = 'well__rollingWeeklyTradeVolumeUSD',
  WellRollingWeeklyTransferVolumeUsd = 'well__rollingWeeklyTransferVolumeUSD',
  WellSymbol = 'well__symbol',
  WellTotalLiquidityUsd = 'well__totalLiquidityUSD',
  WellWellFunctionData = 'well__wellFunctionData'
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

export type Well = {
  __typename?: 'Well';
  /** The aquifer used to bore this well */
  aquifer: Aquifer;
  /** The bored well address. Differs from `id` in the case of an Upgradeable well. */
  boredWell: Scalars['Bytes']['output'];
  /** All Beanstalk convert trading volume occurring in this Well, by each token, in native amount. A subset of cumulativeTradeVolumeReserves */
  convertVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All Beanstalk convert trading volume occurring in this Well, by each token, in USD.  A subset of cumulativeTradeVolumeReservesUSD */
  convertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All Beanstalk convert trading volume occurring in this Well. A subset of cumulativeTradeVolumeUSD */
  convertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All trade volume occurred for a specific token, in native amount. This includes absolute tokens on both sides of the trade unlike cumulativeTradeVolumeReserves. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All trade volume occurred for a specific token, in native amount. Volume for an individual token is defined as a purchase of that token. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All trade volume occurred for a specific token, in USD. Volume for an individual token is defined as a purchase of that token. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All trade volume occurred in this well, in USD. This includes any net trading activity as a result of add/remove liquidity. Should be equal to the sum of all entries in cumulativeTradeVolumeReservesUSD */
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All transfer volume occurred for a specific token, in native amount. This includes the full amount of tokens transferred in add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All transfer volume occurred for a specific token, in USD. This includes the full value of tokens transferred in add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All transfer volume occurred in this well, in USD. This includes the full value of tokens transferred in add/remove liquidity. Should be equal to the sum of all entries in cumulativeTransferVolumeReservesUSD */
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  dailySnapshots: Array<WellDailySnapshot>;
  hourlySnapshots: Array<WellHourlySnapshot>;
  /** Well address. For upgradeable wells, this is the proxy address. */
  id: Scalars['Bytes']['output'];
  /** The well implementation used to deploy this well */
  implementation: Implementation;
  /** True if this is a Beanstalk well */
  isBeanstalk: Scalars['Boolean']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['Int']['output']>;
  /** Hour when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotHour?: Maybe<Scalars['Int']['output']>;
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Total liquidity token supply for the well. */
  lpTokenSupply: Scalars['BigInt']['output'];
  /** Name of liquidity well (e.g. Curve.fi DAI/USDC/USDT)  */
  name?: Maybe<Scalars['String']['output']>;
  /** Data to be passed to each pump */
  pumpData: Array<Scalars['Bytes']['output']>;
  /** Pumps associated with this well */
  pumps: Array<Pump>;
  /** Amount of each token in the well. The ordering should be the same as the well's `tokens` field. */
  reserves: Array<Scalars['BigInt']['output']>;
  /** USD value of each token in the well. The ordering should be the same as the well's `tokens` field. */
  reservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Rolling 24h of cumulativeBiTradeVolumeReserves */
  rollingDailyBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 24h of convertVolumeReserves */
  rollingDailyConvertVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 24h of convertVolumeReservesUSD */
  rollingDailyConvertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Rolling 24h of convertVolumeUSD */
  rollingDailyConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeTradeVolumeReserves */
  rollingDailyTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 24h of cumulativeTradeVolumeReservesUSD */
  rollingDailyTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Rolling 24h of cumulativeTradeVolumeUSD */
  rollingDailyTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 24h of cumulativeTransferVolumeReserves */
  rollingDailyTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 24h of cumulativeTransferVolumeReservesUSD */
  rollingDailyTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Rolling 24h of cumulativeTransferVolumeUSD */
  rollingDailyTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeBiTradeVolumeReserves */
  rollingWeeklyBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 7d of convertVolumeReserves */
  rollingWeeklyConvertVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 7d of convertVolumeReservesUSD */
  rollingWeeklyConvertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Rolling 7d of convertVolumeUSD */
  rollingWeeklyConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeTradeVolumeReserves */
  rollingWeeklyTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 7d of cumulativeTradeVolumeReservesUSD */
  rollingWeeklyTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Rolling 7d of cumulativeTradeVolumeUSD */
  rollingWeeklyTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Rolling 7d of cumulativeTransferVolumeReserves */
  rollingWeeklyTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Rolling 7d of cumulativeTransferVolumeReservesUSD */
  rollingWeeklyTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Rolling 7d of cumulativeTransferVolumeUSD */
  rollingWeeklyTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Symbol of liquidity well (e.g. 3CRV)  */
  symbol?: Maybe<Scalars['String']['output']>;
  /** The order of the tokens in the Well. The above `tokens` association will be sorted by id on any retrieval. */
  tokenOrder: Array<Scalars['Bytes']['output']>;
  /** The current amount of each token needed to exchange for one of the other token, with token decimal precision applied. Resulting decimal value may have more digits than is possible to represent tokens on chain. This is necessary to calculate proper prices for highly expensive tokens like btc. */
  tokenRates: Array<Scalars['BigDecimal']['output']>;
  /** Tokens that need to be deposited to take a position in protocol. e.g. WETH and USDC to deposit into the WETH-USDC well. Array to account for multi-asset wells like Curve and Balancer */
  tokens: Array<Token>;
  /** The sum of all active and non-active liquidity in USD for this well. */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /** All trade (add/remove liquidity, swaps) events occurred in this well */
  trades: Array<Trade>;
  /** History of upgrades (for upgradeable wells). All wells will have at least one entry here. */
  upgradeHistory: Array<WellUpgradeHistory>;
  /** Pricing function contract used with this well */
  wellFunction: WellFunction;
  /** Data to be passed to the well function */
  wellFunctionData: Scalars['Bytes']['output'];
};


export type WellDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WellDailySnapshot_Filter>;
};


export type WellHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WellHourlySnapshot_Filter>;
};


export type WellPumpsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pump_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pump_Filter>;
};


export type WellTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};


export type WellTradesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Trade_Filter>;
};


export type WellUpgradeHistoryArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellUpgradeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WellUpgradeHistory_Filter>;
};

export type WellDailySnapshot = {
  __typename?: 'WellDailySnapshot';
  /** All Beanstalk convert trading volume occurring in this Well, by each token, in native amount. A subset of cumulativeTradeVolumeReserves */
  convertVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All Beanstalk convert trading volume occurring in this Well, by each token, in USD.  A subset of cumulativeTradeVolumeReservesUSD */
  convertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All Beanstalk convert trading volume occurring in this Well. A subset of cumulativeTradeVolumeUSD */
  convertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All trade volume occurred for a specific token, in native amount. This includes absolute tokens on both sides of the trade unlike cumulativeTradeVolumeReserves. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All trade volume occurred for a specific token, in native amount. Volume for an individual token is defined as a purchase of that token. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All trade volume occurred for a specific token, in USD. Volume for an individual token is defined as a purchase of that token. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All trade volume occurred in this well, in USD. This includes any net trading activity as a result of add/remove liquidity. Should be equal to the sum of all entries in cumulativeTradeVolumeReservesUSD */
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All transfer volume occurred for a specific token, in native amount. This includes the full amount of tokens transferred in add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All transfer volume occurred for a specific token, in USD. This includes the full value of tokens transferred in add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All transfer volume occurred in this well, in USD. This includes the full value of tokens transferred in add/remove liquidity. Should be equal to the sum of all entries in cumulativeTransferVolumeReservesUSD */
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Unix day */
  day: Scalars['Int']['output'];
  /** Delta of cumulativeBiTradeVolumeReserves */
  deltaBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of convertVolumeReserves */
  deltaConvertVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of convertVolumeReservesUSD */
  deltaConvertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Delta of convertVolumeUSD */
  deltaConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of totalLiquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Delta of lpTokenSupply */
  deltaLpTokenSupply: Scalars['BigInt']['output'];
  /** Delta of tokenRates */
  deltaTokenRates: Array<Scalars['BigDecimal']['output']>;
  /** Delta of cumulativeTradeVolumeReserves */
  deltaTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of cumulativeTradeVolumeReservesUSD */
  deltaTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Delta of cumulativeTradeVolumeUSD */
  deltaTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeTransferVolumeReserves */
  deltaTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of cumulativeTransferVolumeReservesUSD */
  deltaTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Delta of cumulativeTransferVolumeUSD */
  deltaTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** {Smart contract address of the well}-{Unix day} */
  id: Scalars['ID']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Total liquidity token supply for the well. */
  lpTokenSupply: Scalars['BigInt']['output'];
  /** Beanstalk season (if this is a Beanstalk Well) */
  season?: Maybe<Season>;
  /** The current amount of each token needed to exchange for one of the other token, with token decimal precision applied. Resulting decimal value may have more digits than is possible to represent tokens on chain. This is necessary to calculate proper prices for highly expensive tokens like btc. */
  tokenRates: Array<Scalars['BigDecimal']['output']>;
  /** The sum of all active and non-active liquidity in USD for this well. */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /** The well this snapshot belongs to */
  well: Well;
};

export type WellDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WellDailySnapshot_Filter>>>;
  convertVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  day?: InputMaybe<Scalars['Int']['input']>;
  day_gt?: InputMaybe<Scalars['Int']['input']>;
  day_gte?: InputMaybe<Scalars['Int']['input']>;
  day_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  day_lt?: InputMaybe<Scalars['Int']['input']>;
  day_lte?: InputMaybe<Scalars['Int']['input']>;
  day_not?: InputMaybe<Scalars['Int']['input']>;
  day_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaBiTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLpTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaLpTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTokenRates?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  lpTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WellDailySnapshot_Filter>>>;
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
  tokenRates?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  well?: InputMaybe<Scalars['String']['input']>;
  well_?: InputMaybe<Well_Filter>;
  well_contains?: InputMaybe<Scalars['String']['input']>;
  well_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_gt?: InputMaybe<Scalars['String']['input']>;
  well_gte?: InputMaybe<Scalars['String']['input']>;
  well_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_lt?: InputMaybe<Scalars['String']['input']>;
  well_lte?: InputMaybe<Scalars['String']['input']>;
  well_not?: InputMaybe<Scalars['String']['input']>;
  well_not_contains?: InputMaybe<Scalars['String']['input']>;
  well_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum WellDailySnapshot_OrderBy {
  ConvertVolumeReserves = 'convertVolumeReserves',
  ConvertVolumeReservesUsd = 'convertVolumeReservesUSD',
  ConvertVolumeUsd = 'convertVolumeUSD',
  CreatedTimestamp = 'createdTimestamp',
  CumulativeBiTradeVolumeReserves = 'cumulativeBiTradeVolumeReserves',
  CumulativeTradeVolumeReserves = 'cumulativeTradeVolumeReserves',
  CumulativeTradeVolumeReservesUsd = 'cumulativeTradeVolumeReservesUSD',
  CumulativeTradeVolumeUsd = 'cumulativeTradeVolumeUSD',
  CumulativeTransferVolumeReserves = 'cumulativeTransferVolumeReserves',
  CumulativeTransferVolumeReservesUsd = 'cumulativeTransferVolumeReservesUSD',
  CumulativeTransferVolumeUsd = 'cumulativeTransferVolumeUSD',
  Day = 'day',
  DeltaBiTradeVolumeReserves = 'deltaBiTradeVolumeReserves',
  DeltaConvertVolumeReserves = 'deltaConvertVolumeReserves',
  DeltaConvertVolumeReservesUsd = 'deltaConvertVolumeReservesUSD',
  DeltaConvertVolumeUsd = 'deltaConvertVolumeUSD',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaLpTokenSupply = 'deltaLpTokenSupply',
  DeltaTokenRates = 'deltaTokenRates',
  DeltaTradeVolumeReserves = 'deltaTradeVolumeReserves',
  DeltaTradeVolumeReservesUsd = 'deltaTradeVolumeReservesUSD',
  DeltaTradeVolumeUsd = 'deltaTradeVolumeUSD',
  DeltaTransferVolumeReserves = 'deltaTransferVolumeReserves',
  DeltaTransferVolumeReservesUsd = 'deltaTransferVolumeReservesUSD',
  DeltaTransferVolumeUsd = 'deltaTransferVolumeUSD',
  Id = 'id',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LpTokenSupply = 'lpTokenSupply',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TokenRates = 'tokenRates',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  Well = 'well',
  WellBoredWell = 'well__boredWell',
  WellConvertVolumeUsd = 'well__convertVolumeUSD',
  WellCreatedTimestamp = 'well__createdTimestamp',
  WellCumulativeTradeVolumeUsd = 'well__cumulativeTradeVolumeUSD',
  WellCumulativeTransferVolumeUsd = 'well__cumulativeTransferVolumeUSD',
  WellId = 'well__id',
  WellIsBeanstalk = 'well__isBeanstalk',
  WellLastDailySnapshotDay = 'well__lastDailySnapshotDay',
  WellLastHourlySnapshotHour = 'well__lastHourlySnapshotHour',
  WellLastUpdateBlockNumber = 'well__lastUpdateBlockNumber',
  WellLastUpdateTimestamp = 'well__lastUpdateTimestamp',
  WellLpTokenSupply = 'well__lpTokenSupply',
  WellName = 'well__name',
  WellRollingDailyConvertVolumeUsd = 'well__rollingDailyConvertVolumeUSD',
  WellRollingDailyTradeVolumeUsd = 'well__rollingDailyTradeVolumeUSD',
  WellRollingDailyTransferVolumeUsd = 'well__rollingDailyTransferVolumeUSD',
  WellRollingWeeklyConvertVolumeUsd = 'well__rollingWeeklyConvertVolumeUSD',
  WellRollingWeeklyTradeVolumeUsd = 'well__rollingWeeklyTradeVolumeUSD',
  WellRollingWeeklyTransferVolumeUsd = 'well__rollingWeeklyTransferVolumeUSD',
  WellSymbol = 'well__symbol',
  WellTotalLiquidityUsd = 'well__totalLiquidityUSD',
  WellWellFunctionData = 'well__wellFunctionData'
}

export type WellFunction = {
  __typename?: 'WellFunction';
  /** Well Function address */
  id: Scalars['Bytes']['output'];
  /** Wells associated with this well function */
  wells: Array<Well>;
};


export type WellFunctionWellsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Well_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Well_Filter>;
};

export type WellFunction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WellFunction_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<WellFunction_Filter>>>;
  wells_?: InputMaybe<Well_Filter>;
};

export enum WellFunction_OrderBy {
  Id = 'id',
  Wells = 'wells'
}

export type WellHourlySnapshot = {
  __typename?: 'WellHourlySnapshot';
  /** All Beanstalk convert trading volume occurring in this Well, by each token, in native amount. A subset of cumulativeTradeVolumeReserves */
  convertVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All Beanstalk convert trading volume occurring in this Well, by each token, in USD.  A subset of cumulativeTradeVolumeReservesUSD */
  convertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All Beanstalk convert trading volume occurring in this Well. A subset of cumulativeTradeVolumeUSD */
  convertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Timestamp of entity creation */
  createdTimestamp: Scalars['BigInt']['output'];
  /** All trade volume occurred for a specific token, in native amount. This includes absolute tokens on both sides of the trade unlike cumulativeTradeVolumeReserves. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All trade volume occurred for a specific token, in native amount. Volume for an individual token is defined as a purchase of that token. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All trade volume occurred for a specific token, in USD. Volume for an individual token is defined as a purchase of that token. This includes any net trading activity as a result of add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All trade volume occurred in this well, in USD. This includes any net trading activity as a result of add/remove liquidity. Should be equal to the sum of all entries in cumulativeTradeVolumeReservesUSD */
  cumulativeTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** All transfer volume occurred for a specific token, in native amount. This includes the full amount of tokens transferred in add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** All transfer volume occurred for a specific token, in USD. This includes the full value of tokens transferred in add/remove liquidity. The ordering should be the same as the well's `tokens` field. */
  cumulativeTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** All transfer volume occurred in this well, in USD. This includes the full value of tokens transferred in add/remove liquidity. Should be equal to the sum of all entries in cumulativeTransferVolumeReservesUSD */
  cumulativeTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeBiTradeVolumeReserves */
  deltaBiTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of convertVolumeReserves */
  deltaConvertVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of convertVolumeReservesUSD */
  deltaConvertVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Delta of convertVolumeUSD */
  deltaConvertVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of totalLiquidityUSD */
  deltaLiquidityUSD: Scalars['BigDecimal']['output'];
  /** Delta of lpTokenSupply */
  deltaLpTokenSupply: Scalars['BigInt']['output'];
  /** Delta of tokenRates */
  deltaTokenRates: Array<Scalars['BigDecimal']['output']>;
  /** Delta of cumulativeTradeVolumeReserves */
  deltaTradeVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of cumulativeTradeVolumeReservesUSD */
  deltaTradeVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Delta of cumulativeTradeVolumeUSD */
  deltaTradeVolumeUSD: Scalars['BigDecimal']['output'];
  /** Delta of cumulativeTransferVolumeReserves */
  deltaTransferVolumeReserves: Array<Scalars['BigInt']['output']>;
  /** Delta of cumulativeTransferVolumeReservesUSD */
  deltaTransferVolumeReservesUSD: Array<Scalars['BigDecimal']['output']>;
  /** Delta of cumulativeTransferVolumeUSD */
  deltaTransferVolumeUSD: Scalars['BigDecimal']['output'];
  /** Unix hour */
  hour: Scalars['Int']['output'];
  /** {Smart contract address of the well}-{Unix hour}  */
  id: Scalars['ID']['output'];
  /** Block number of the last time this entity was updated */
  lastUpdateBlockNumber: Scalars['BigInt']['output'];
  /** Timestamp of the last time this entity was updated */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /** Total liquidity token supply for the well. */
  lpTokenSupply: Scalars['BigInt']['output'];
  /** Beanstalk season (if this is a Beanstalk Well) */
  season?: Maybe<Season>;
  /** The current amount of each token needed to exchange for one of the other token, with token decimal precision applied. Resulting decimal value may have more digits than is possible to represent tokens on chain. This is necessary to calculate proper prices for highly expensive tokens like btc. */
  tokenRates: Array<Scalars['BigDecimal']['output']>;
  /** The sum of all active and non-active liquidity in USD for this well. */
  totalLiquidityUSD: Scalars['BigDecimal']['output'];
  /** The well this snapshot belongs to */
  well: Well;
};

export type WellHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WellHourlySnapshot_Filter>>>;
  convertVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaBiTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBiTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaLpTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaLpTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaLpTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTokenRates?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTokenRates_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  hour_gt?: InputMaybe<Scalars['Int']['input']>;
  hour_gte?: InputMaybe<Scalars['Int']['input']>;
  hour_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hour_lt?: InputMaybe<Scalars['Int']['input']>;
  hour_lte?: InputMaybe<Scalars['Int']['input']>;
  hour_not?: InputMaybe<Scalars['Int']['input']>;
  hour_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  lpTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WellHourlySnapshot_Filter>>>;
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
  tokenRates?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  well?: InputMaybe<Scalars['String']['input']>;
  well_?: InputMaybe<Well_Filter>;
  well_contains?: InputMaybe<Scalars['String']['input']>;
  well_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_gt?: InputMaybe<Scalars['String']['input']>;
  well_gte?: InputMaybe<Scalars['String']['input']>;
  well_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_lt?: InputMaybe<Scalars['String']['input']>;
  well_lte?: InputMaybe<Scalars['String']['input']>;
  well_not?: InputMaybe<Scalars['String']['input']>;
  well_not_contains?: InputMaybe<Scalars['String']['input']>;
  well_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum WellHourlySnapshot_OrderBy {
  ConvertVolumeReserves = 'convertVolumeReserves',
  ConvertVolumeReservesUsd = 'convertVolumeReservesUSD',
  ConvertVolumeUsd = 'convertVolumeUSD',
  CreatedTimestamp = 'createdTimestamp',
  CumulativeBiTradeVolumeReserves = 'cumulativeBiTradeVolumeReserves',
  CumulativeTradeVolumeReserves = 'cumulativeTradeVolumeReserves',
  CumulativeTradeVolumeReservesUsd = 'cumulativeTradeVolumeReservesUSD',
  CumulativeTradeVolumeUsd = 'cumulativeTradeVolumeUSD',
  CumulativeTransferVolumeReserves = 'cumulativeTransferVolumeReserves',
  CumulativeTransferVolumeReservesUsd = 'cumulativeTransferVolumeReservesUSD',
  CumulativeTransferVolumeUsd = 'cumulativeTransferVolumeUSD',
  DeltaBiTradeVolumeReserves = 'deltaBiTradeVolumeReserves',
  DeltaConvertVolumeReserves = 'deltaConvertVolumeReserves',
  DeltaConvertVolumeReservesUsd = 'deltaConvertVolumeReservesUSD',
  DeltaConvertVolumeUsd = 'deltaConvertVolumeUSD',
  DeltaLiquidityUsd = 'deltaLiquidityUSD',
  DeltaLpTokenSupply = 'deltaLpTokenSupply',
  DeltaTokenRates = 'deltaTokenRates',
  DeltaTradeVolumeReserves = 'deltaTradeVolumeReserves',
  DeltaTradeVolumeReservesUsd = 'deltaTradeVolumeReservesUSD',
  DeltaTradeVolumeUsd = 'deltaTradeVolumeUSD',
  DeltaTransferVolumeReserves = 'deltaTransferVolumeReserves',
  DeltaTransferVolumeReservesUsd = 'deltaTransferVolumeReservesUSD',
  DeltaTransferVolumeUsd = 'deltaTransferVolumeUSD',
  Hour = 'hour',
  Id = 'id',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LpTokenSupply = 'lpTokenSupply',
  Season = 'season',
  SeasonId = 'season__id',
  SeasonSeason = 'season__season',
  SeasonTimestamp = 'season__timestamp',
  TokenRates = 'tokenRates',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  Well = 'well',
  WellBoredWell = 'well__boredWell',
  WellConvertVolumeUsd = 'well__convertVolumeUSD',
  WellCreatedTimestamp = 'well__createdTimestamp',
  WellCumulativeTradeVolumeUsd = 'well__cumulativeTradeVolumeUSD',
  WellCumulativeTransferVolumeUsd = 'well__cumulativeTransferVolumeUSD',
  WellId = 'well__id',
  WellIsBeanstalk = 'well__isBeanstalk',
  WellLastDailySnapshotDay = 'well__lastDailySnapshotDay',
  WellLastHourlySnapshotHour = 'well__lastHourlySnapshotHour',
  WellLastUpdateBlockNumber = 'well__lastUpdateBlockNumber',
  WellLastUpdateTimestamp = 'well__lastUpdateTimestamp',
  WellLpTokenSupply = 'well__lpTokenSupply',
  WellName = 'well__name',
  WellRollingDailyConvertVolumeUsd = 'well__rollingDailyConvertVolumeUSD',
  WellRollingDailyTradeVolumeUsd = 'well__rollingDailyTradeVolumeUSD',
  WellRollingDailyTransferVolumeUsd = 'well__rollingDailyTransferVolumeUSD',
  WellRollingWeeklyConvertVolumeUsd = 'well__rollingWeeklyConvertVolumeUSD',
  WellRollingWeeklyTradeVolumeUsd = 'well__rollingWeeklyTradeVolumeUSD',
  WellRollingWeeklyTransferVolumeUsd = 'well__rollingWeeklyTransferVolumeUSD',
  WellSymbol = 'well__symbol',
  WellTotalLiquidityUsd = 'well__totalLiquidityUSD',
  WellWellFunctionData = 'well__wellFunctionData'
}

export type WellUpgradeHistory = {
  __typename?: 'WellUpgradeHistory';
  aquifer: Aquifer;
  boredWell: Scalars['Bytes']['output'];
  /** The block this upgrade went into effect */
  effectiveBlock: Scalars['BigInt']['output'];
  /** The timestamp this upgrade went into effect */
  effectiveTimestamp: Scalars['BigInt']['output'];
  /** {Well Address}-{Upgrade Index}  */
  id: Scalars['ID']['output'];
  implementation: Implementation;
  pumpData: Array<Scalars['Bytes']['output']>;
  pumps: Array<Pump>;
  /** The well that this upgrade history is for */
  well: Well;
  wellFunction: WellFunction;
  wellFunctionData: Scalars['Bytes']['output'];
};


export type WellUpgradeHistoryPumpsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pump_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pump_Filter>;
};

export type WellUpgradeHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WellUpgradeHistory_Filter>>>;
  aquifer?: InputMaybe<Scalars['String']['input']>;
  aquifer_?: InputMaybe<Aquifer_Filter>;
  aquifer_contains?: InputMaybe<Scalars['String']['input']>;
  aquifer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_ends_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_gt?: InputMaybe<Scalars['String']['input']>;
  aquifer_gte?: InputMaybe<Scalars['String']['input']>;
  aquifer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aquifer_lt?: InputMaybe<Scalars['String']['input']>;
  aquifer_lte?: InputMaybe<Scalars['String']['input']>;
  aquifer_not?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_contains?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aquifer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_starts_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  boredWell?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_contains?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_gt?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_gte?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  boredWell_lt?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_lte?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_not?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  effectiveBlock?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectiveBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectiveTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectiveTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  effectiveTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  implementation?: InputMaybe<Scalars['String']['input']>;
  implementation_?: InputMaybe<Implementation_Filter>;
  implementation_contains?: InputMaybe<Scalars['String']['input']>;
  implementation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_ends_with?: InputMaybe<Scalars['String']['input']>;
  implementation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_gt?: InputMaybe<Scalars['String']['input']>;
  implementation_gte?: InputMaybe<Scalars['String']['input']>;
  implementation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  implementation_lt?: InputMaybe<Scalars['String']['input']>;
  implementation_lte?: InputMaybe<Scalars['String']['input']>;
  implementation_not?: InputMaybe<Scalars['String']['input']>;
  implementation_not_contains?: InputMaybe<Scalars['String']['input']>;
  implementation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  implementation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  implementation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  implementation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_starts_with?: InputMaybe<Scalars['String']['input']>;
  implementation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<WellUpgradeHistory_Filter>>>;
  pumpData?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumps?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_?: InputMaybe<Pump_Filter>;
  pumps_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_not?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  well?: InputMaybe<Scalars['String']['input']>;
  wellFunction?: InputMaybe<Scalars['String']['input']>;
  wellFunctionData?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_contains?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_gt?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_gte?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  wellFunctionData_lt?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_lte?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_not?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  wellFunction_?: InputMaybe<WellFunction_Filter>;
  wellFunction_contains?: InputMaybe<Scalars['String']['input']>;
  wellFunction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_ends_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_gt?: InputMaybe<Scalars['String']['input']>;
  wellFunction_gte?: InputMaybe<Scalars['String']['input']>;
  wellFunction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wellFunction_lt?: InputMaybe<Scalars['String']['input']>;
  wellFunction_lte?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_contains?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wellFunction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_starts_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_?: InputMaybe<Well_Filter>;
  well_contains?: InputMaybe<Scalars['String']['input']>;
  well_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_gt?: InputMaybe<Scalars['String']['input']>;
  well_gte?: InputMaybe<Scalars['String']['input']>;
  well_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_lt?: InputMaybe<Scalars['String']['input']>;
  well_lte?: InputMaybe<Scalars['String']['input']>;
  well_not?: InputMaybe<Scalars['String']['input']>;
  well_not_contains?: InputMaybe<Scalars['String']['input']>;
  well_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  well_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  well_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  well_starts_with?: InputMaybe<Scalars['String']['input']>;
  well_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum WellUpgradeHistory_OrderBy {
  Aquifer = 'aquifer',
  AquiferId = 'aquifer__id',
  BoredWell = 'boredWell',
  EffectiveBlock = 'effectiveBlock',
  EffectiveTimestamp = 'effectiveTimestamp',
  Id = 'id',
  Implementation = 'implementation',
  ImplementationId = 'implementation__id',
  PumpData = 'pumpData',
  Pumps = 'pumps',
  Well = 'well',
  WellFunction = 'wellFunction',
  WellFunctionData = 'wellFunctionData',
  WellFunctionId = 'wellFunction__id',
  WellBoredWell = 'well__boredWell',
  WellConvertVolumeUsd = 'well__convertVolumeUSD',
  WellCreatedTimestamp = 'well__createdTimestamp',
  WellCumulativeTradeVolumeUsd = 'well__cumulativeTradeVolumeUSD',
  WellCumulativeTransferVolumeUsd = 'well__cumulativeTransferVolumeUSD',
  WellId = 'well__id',
  WellIsBeanstalk = 'well__isBeanstalk',
  WellLastDailySnapshotDay = 'well__lastDailySnapshotDay',
  WellLastHourlySnapshotHour = 'well__lastHourlySnapshotHour',
  WellLastUpdateBlockNumber = 'well__lastUpdateBlockNumber',
  WellLastUpdateTimestamp = 'well__lastUpdateTimestamp',
  WellLpTokenSupply = 'well__lpTokenSupply',
  WellName = 'well__name',
  WellRollingDailyConvertVolumeUsd = 'well__rollingDailyConvertVolumeUSD',
  WellRollingDailyTradeVolumeUsd = 'well__rollingDailyTradeVolumeUSD',
  WellRollingDailyTransferVolumeUsd = 'well__rollingDailyTransferVolumeUSD',
  WellRollingWeeklyConvertVolumeUsd = 'well__rollingWeeklyConvertVolumeUSD',
  WellRollingWeeklyTradeVolumeUsd = 'well__rollingWeeklyTradeVolumeUSD',
  WellRollingWeeklyTransferVolumeUsd = 'well__rollingWeeklyTransferVolumeUSD',
  WellSymbol = 'well__symbol',
  WellTotalLiquidityUsd = 'well__totalLiquidityUSD',
  WellWellFunctionData = 'well__wellFunctionData'
}

export type Well_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Well_Filter>>>;
  aquifer?: InputMaybe<Scalars['String']['input']>;
  aquifer_?: InputMaybe<Aquifer_Filter>;
  aquifer_contains?: InputMaybe<Scalars['String']['input']>;
  aquifer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_ends_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_gt?: InputMaybe<Scalars['String']['input']>;
  aquifer_gte?: InputMaybe<Scalars['String']['input']>;
  aquifer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aquifer_lt?: InputMaybe<Scalars['String']['input']>;
  aquifer_lte?: InputMaybe<Scalars['String']['input']>;
  aquifer_not?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_contains?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  aquifer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  aquifer_starts_with?: InputMaybe<Scalars['String']['input']>;
  aquifer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  boredWell?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_contains?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_gt?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_gte?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  boredWell_lt?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_lte?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_not?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  boredWell_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  convertVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeBiTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySnapshots_?: InputMaybe<WellDailySnapshot_Filter>;
  hourlySnapshots_?: InputMaybe<WellHourlySnapshot_Filter>;
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
  implementation?: InputMaybe<Scalars['String']['input']>;
  implementation_?: InputMaybe<Implementation_Filter>;
  implementation_contains?: InputMaybe<Scalars['String']['input']>;
  implementation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_ends_with?: InputMaybe<Scalars['String']['input']>;
  implementation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_gt?: InputMaybe<Scalars['String']['input']>;
  implementation_gte?: InputMaybe<Scalars['String']['input']>;
  implementation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  implementation_lt?: InputMaybe<Scalars['String']['input']>;
  implementation_lte?: InputMaybe<Scalars['String']['input']>;
  implementation_not?: InputMaybe<Scalars['String']['input']>;
  implementation_not_contains?: InputMaybe<Scalars['String']['input']>;
  implementation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  implementation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  implementation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  implementation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  implementation_starts_with?: InputMaybe<Scalars['String']['input']>;
  implementation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  isBeanstalk?: InputMaybe<Scalars['Boolean']['input']>;
  isBeanstalk_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isBeanstalk_not?: InputMaybe<Scalars['Boolean']['input']>;
  isBeanstalk_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  lastDailySnapshotDay?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_gte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastDailySnapshotDay_lt?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_lte?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not?: InputMaybe<Scalars['Int']['input']>;
  lastDailySnapshotDay_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotHour?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotHour_gt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotHour_gte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotHour_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastHourlySnapshotHour_lt?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotHour_lte?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotHour_not?: InputMaybe<Scalars['Int']['input']>;
  lastHourlySnapshotHour_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  lpTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lpTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  lpTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<Well_Filter>>>;
  pumpData?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumpData_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pumps?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_?: InputMaybe<Pump_Filter>;
  pumps_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_not?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  pumps_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  reserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyBiTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyBiTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyBiTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyBiTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyBiTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyBiTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyConvertVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyConvertVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyConvertVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyConvertVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyConvertVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyConvertVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTransferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTransferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTransferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTransferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTransferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingDailyTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingDailyTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingDailyTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyBiTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyBiTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyBiTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyBiTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyBiTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyBiTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyConvertVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyConvertVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyConvertVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyConvertVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyConvertVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyConvertVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyConvertVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyConvertVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyConvertVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTradeVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTradeVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTradeVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTradeVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTradeVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTradeVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTradeVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTradeVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeReserves?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTransferVolumeReservesUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeReservesUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeReservesUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeReservesUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeReservesUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeReservesUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeReserves_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTransferVolumeReserves_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTransferVolumeReserves_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTransferVolumeReserves_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTransferVolumeReserves_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rollingWeeklyTransferVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rollingWeeklyTransferVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rollingWeeklyTransferVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOrder?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenOrder_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenOrder_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenOrder_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenOrder_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenOrder_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenRates?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenRates_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokens?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_?: InputMaybe<Token_Filter>;
  tokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  totalLiquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  trades_?: InputMaybe<Trade_Filter>;
  upgradeHistory_?: InputMaybe<WellUpgradeHistory_Filter>;
  wellFunction?: InputMaybe<Scalars['String']['input']>;
  wellFunctionData?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_contains?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_gt?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_gte?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  wellFunctionData_lt?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_lte?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_not?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  wellFunctionData_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  wellFunction_?: InputMaybe<WellFunction_Filter>;
  wellFunction_contains?: InputMaybe<Scalars['String']['input']>;
  wellFunction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_ends_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_gt?: InputMaybe<Scalars['String']['input']>;
  wellFunction_gte?: InputMaybe<Scalars['String']['input']>;
  wellFunction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wellFunction_lt?: InputMaybe<Scalars['String']['input']>;
  wellFunction_lte?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_contains?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wellFunction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wellFunction_starts_with?: InputMaybe<Scalars['String']['input']>;
  wellFunction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Well_OrderBy {
  Aquifer = 'aquifer',
  AquiferId = 'aquifer__id',
  BoredWell = 'boredWell',
  ConvertVolumeReserves = 'convertVolumeReserves',
  ConvertVolumeReservesUsd = 'convertVolumeReservesUSD',
  ConvertVolumeUsd = 'convertVolumeUSD',
  CreatedTimestamp = 'createdTimestamp',
  CumulativeBiTradeVolumeReserves = 'cumulativeBiTradeVolumeReserves',
  CumulativeTradeVolumeReserves = 'cumulativeTradeVolumeReserves',
  CumulativeTradeVolumeReservesUsd = 'cumulativeTradeVolumeReservesUSD',
  CumulativeTradeVolumeUsd = 'cumulativeTradeVolumeUSD',
  CumulativeTransferVolumeReserves = 'cumulativeTransferVolumeReserves',
  CumulativeTransferVolumeReservesUsd = 'cumulativeTransferVolumeReservesUSD',
  CumulativeTransferVolumeUsd = 'cumulativeTransferVolumeUSD',
  DailySnapshots = 'dailySnapshots',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  Implementation = 'implementation',
  ImplementationId = 'implementation__id',
  IsBeanstalk = 'isBeanstalk',
  LastDailySnapshotDay = 'lastDailySnapshotDay',
  LastHourlySnapshotHour = 'lastHourlySnapshotHour',
  LastUpdateBlockNumber = 'lastUpdateBlockNumber',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  LpTokenSupply = 'lpTokenSupply',
  Name = 'name',
  PumpData = 'pumpData',
  Pumps = 'pumps',
  Reserves = 'reserves',
  ReservesUsd = 'reservesUSD',
  RollingDailyBiTradeVolumeReserves = 'rollingDailyBiTradeVolumeReserves',
  RollingDailyConvertVolumeReserves = 'rollingDailyConvertVolumeReserves',
  RollingDailyConvertVolumeReservesUsd = 'rollingDailyConvertVolumeReservesUSD',
  RollingDailyConvertVolumeUsd = 'rollingDailyConvertVolumeUSD',
  RollingDailyTradeVolumeReserves = 'rollingDailyTradeVolumeReserves',
  RollingDailyTradeVolumeReservesUsd = 'rollingDailyTradeVolumeReservesUSD',
  RollingDailyTradeVolumeUsd = 'rollingDailyTradeVolumeUSD',
  RollingDailyTransferVolumeReserves = 'rollingDailyTransferVolumeReserves',
  RollingDailyTransferVolumeReservesUsd = 'rollingDailyTransferVolumeReservesUSD',
  RollingDailyTransferVolumeUsd = 'rollingDailyTransferVolumeUSD',
  RollingWeeklyBiTradeVolumeReserves = 'rollingWeeklyBiTradeVolumeReserves',
  RollingWeeklyConvertVolumeReserves = 'rollingWeeklyConvertVolumeReserves',
  RollingWeeklyConvertVolumeReservesUsd = 'rollingWeeklyConvertVolumeReservesUSD',
  RollingWeeklyConvertVolumeUsd = 'rollingWeeklyConvertVolumeUSD',
  RollingWeeklyTradeVolumeReserves = 'rollingWeeklyTradeVolumeReserves',
  RollingWeeklyTradeVolumeReservesUsd = 'rollingWeeklyTradeVolumeReservesUSD',
  RollingWeeklyTradeVolumeUsd = 'rollingWeeklyTradeVolumeUSD',
  RollingWeeklyTransferVolumeReserves = 'rollingWeeklyTransferVolumeReserves',
  RollingWeeklyTransferVolumeReservesUsd = 'rollingWeeklyTransferVolumeReservesUSD',
  RollingWeeklyTransferVolumeUsd = 'rollingWeeklyTransferVolumeUSD',
  Symbol = 'symbol',
  TokenOrder = 'tokenOrder',
  TokenRates = 'tokenRates',
  Tokens = 'tokens',
  TotalLiquidityUsd = 'totalLiquidityUSD',
  Trades = 'trades',
  UpgradeHistory = 'upgradeHistory',
  WellFunction = 'wellFunction',
  WellFunctionData = 'wellFunctionData',
  WellFunctionId = 'wellFunction__id'
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

export type BasinAdvancedChartQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BasinAdvancedChartQuery = { __typename?: 'Query', beanstalkHourlySnapshots: Array<{ __typename?: 'BeanstalkHourlySnapshot', id: string, createdTimestamp: any, cumulativeBuyVolumeUSD: any, cumulativeSellVolumeUSD: any, cumulativeTradeVolumeUSD: any, deltaBuyVolumeUSD: any, deltaSellVolumeUSD: any, deltaTradeVolumeUSD: any, cumulativeConvertUpVolumeUSD: any, cumulativeConvertDownVolumeUSD: any, cumulativeConvertVolumeUSD: any, cumulativeConvertNeutralTransferVolumeUSD: any, deltaConvertDownVolumeUSD: any, deltaConvertUpVolumeUSD: any, deltaConvertVolumeUSD: any, deltaConvertNeutralTransferVolumeUSD: any, totalLiquidityUSD: any, deltaLiquidityUSD: any, season: { __typename?: 'Season', season: number } }> };

export type BasinSeasonalSummaryQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BasinSeasonalSummaryQuery = { __typename?: 'Query', beanstalkHourlySnapshots: Array<{ __typename?: 'BeanstalkHourlySnapshot', id: string, createdTimestamp: any, cumulativeTradeVolumeUSD: any, cumulativeConvertVolumeUSD: any, totalLiquidityUSD: any, season: { __typename?: 'Season', season: number } }> };


export const BasinAdvancedChartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BasinAdvancedChart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beanstalkHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season__season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"season"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeBuyVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeSellVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeTradeVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBuyVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSellVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTradeVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeConvertUpVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeConvertDownVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeConvertVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeConvertNeutralTransferVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaConvertDownVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaConvertUpVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaConvertVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaConvertNeutralTransferVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"totalLiquidityUSD"}},{"kind":"Field","name":{"kind":"Name","value":"deltaLiquidityUSD"}}]}}]}}]} as unknown as DocumentNode<BasinAdvancedChartQuery, BasinAdvancedChartQueryVariables>;
export const BasinSeasonalSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BasinSeasonalSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beanstalkHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season__season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"season"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeTradeVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeConvertVolumeUSD"}},{"kind":"Field","name":{"kind":"Name","value":"totalLiquidityUSD"}}]}}]}}]} as unknown as DocumentNode<BasinSeasonalSummaryQuery, BasinSeasonalSummaryQueryVariables>;