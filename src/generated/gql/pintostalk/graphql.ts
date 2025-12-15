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

export enum AggregationInterval {
  day = 'day',
  hour = 'hour'
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
  /** Supported wrapped deposit tokens */
  wrappedDepositTokens: Array<WrappedDepositErc20>;
};


export type BeanstalkSeasonsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SeasonOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SeasonFilter>;
};


export type BeanstalkWrappedDepositTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDepositErc20OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WrappedDepositErc20Filter>;
};

export type BeanstalkFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeFarmers?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  activeFarmers_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<BeanstalkFilter>>>;
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
  field_?: InputMaybe<FieldFilter>;
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
  or?: InputMaybe<Array<InputMaybe<BeanstalkFilter>>>;
  seasons_?: InputMaybe<SeasonFilter>;
  silo_?: InputMaybe<SiloFilter>;
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
  wrappedDepositTokens_?: InputMaybe<WrappedDepositErc20Filter>;
};

export enum BeanstalkOrderBy {
  activeFarmers = 'activeFarmers',
  farmersToUpdate = 'farmersToUpdate',
  fertilizer1155 = 'fertilizer1155',
  field = 'field',
  field__cultivationFactor = 'field__cultivationFactor',
  field__cultivationTemperature = 'field__cultivationTemperature',
  field__fieldId = 'field__fieldId',
  field__harvestableIndex = 'field__harvestableIndex',
  field__harvestablePods = 'field__harvestablePods',
  field__harvestedPods = 'field__harvestedPods',
  field__id = 'field__id',
  field__lastDailySnapshotDay = 'field__lastDailySnapshotDay',
  field__lastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  field__numberOfSowers = 'field__numberOfSowers',
  field__numberOfSows = 'field__numberOfSows',
  field__podIndex = 'field__podIndex',
  field__podRate = 'field__podRate',
  field__realRateOfReturn = 'field__realRateOfReturn',
  field__season = 'field__season',
  field__soil = 'field__soil',
  field__sownBeans = 'field__sownBeans',
  field__temperature = 'field__temperature',
  field__unharvestablePods = 'field__unharvestablePods',
  field__unmigratedL1Pods = 'field__unmigratedL1Pods',
  id = 'id',
  lastSeason = 'lastSeason',
  seasons = 'seasons',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  token = 'token',
  wrappedDepositTokens = 'wrappedDepositTokens'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type BlockHeight = {
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

export type ChopFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ChopFilter>>>;
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
  farmer_?: InputMaybe<FarmerFilter>;
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
  or?: InputMaybe<Array<InputMaybe<ChopFilter>>>;
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
  underlyingToken_?: InputMaybe<WhitelistTokenSettingFilter>;
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
  unripeToken_?: InputMaybe<UnripeTokenFilter>;
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

export enum ChopOrderBy {
  blockNumber = 'blockNumber',
  chopRate = 'chopRate',
  createdAt = 'createdAt',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  hash = 'hash',
  id = 'id',
  underlyingAmount = 'underlyingAmount',
  underlyingBdv = 'underlyingBdv',
  underlyingToken = 'underlyingToken',
  underlyingToken__decimals = 'underlyingToken__decimals',
  underlyingToken__gaugePoints = 'underlyingToken__gaugePoints',
  underlyingToken__id = 'underlyingToken__id',
  underlyingToken__isGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  underlyingToken__lastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  underlyingToken__lastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  underlyingToken__milestoneSeason = 'underlyingToken__milestoneSeason',
  underlyingToken__optimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  underlyingToken__selector = 'underlyingToken__selector',
  underlyingToken__stalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  underlyingToken__stalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  underlyingToken__stemTip = 'underlyingToken__stemTip',
  underlyingToken__updatedAt = 'underlyingToken__updatedAt',
  unripeAmount = 'unripeAmount',
  unripeBdv = 'unripeBdv',
  unripeToken = 'unripeToken',
  unripeToken__amountUnderlyingOne = 'unripeToken__amountUnderlyingOne',
  unripeToken__bdvUnderlyingOne = 'unripeToken__bdvUnderlyingOne',
  unripeToken__chopRate = 'unripeToken__chopRate',
  unripeToken__choppableAmountOne = 'unripeToken__choppableAmountOne',
  unripeToken__choppableBdvOne = 'unripeToken__choppableBdvOne',
  unripeToken__id = 'unripeToken__id',
  unripeToken__lastDailySnapshotDay = 'unripeToken__lastDailySnapshotDay',
  unripeToken__lastHourlySnapshotSeason = 'unripeToken__lastHourlySnapshotSeason',
  unripeToken__recapPercent = 'unripeToken__recapPercent',
  unripeToken__totalChoppedAmount = 'unripeToken__totalChoppedAmount',
  unripeToken__totalChoppedBdv = 'unripeToken__totalChoppedBdv',
  unripeToken__totalChoppedBdvReceived = 'unripeToken__totalChoppedBdvReceived',
  unripeToken__totalUnderlying = 'unripeToken__totalUnderlying'
}

export enum EmaWindow {
  ROLLING_7_DAY = 'ROLLING_7_DAY',
  ROLLING_24_HOUR = 'ROLLING_24_HOUR',
  ROLLING_30_DAY = 'ROLLING_30_DAY'
}

export type Farmer = {
  __typename?: 'Farmer';
  /** Block number in which this entity was created */
  creationBlock: Scalars['BigInt']['output'];
  deposits: Array<SiloDeposit>;
  fertilizers: Array<FertilizerBalance>;
  field?: Maybe<Field>;
  fills: Array<PodFill>;
  /** Address for the farmer */
  id: Scalars['Bytes']['output'];
  listings: Array<PodListing>;
  orders: Array<PodOrder>;
  plots: Array<Plot>;
  /** Number of accounts this farmer has referred */
  refereeCount: Scalars['Int']['output'];
  silo?: Maybe<Silo>;
  /** Total pods this farmer has received as referral rewards */
  totalReferralRewardPodsReceived: Scalars['BigInt']['output'];
  withdraws: Array<SiloWithdraw>;
};


export type FarmerDepositsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDepositOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloDepositFilter>;
};


export type FarmerFertilizersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerBalanceOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FertilizerBalanceFilter>;
};


export type FarmerFillsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFillOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodFillFilter>;
};


export type FarmerListingsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodListingFilter>;
};


export type FarmerOrdersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodOrderFilter>;
};


export type FarmerPlotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PlotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlotFilter>;
};


export type FarmerWithdrawsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloWithdrawOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloWithdrawFilter>;
};

export type FarmerFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FarmerFilter>>>;
  creationBlock?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  creationBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  creationBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deposits_?: InputMaybe<SiloDepositFilter>;
  fertilizers_?: InputMaybe<FertilizerBalanceFilter>;
  field_?: InputMaybe<FieldFilter>;
  fills_?: InputMaybe<PodFillFilter>;
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
  listings_?: InputMaybe<PodListingFilter>;
  or?: InputMaybe<Array<InputMaybe<FarmerFilter>>>;
  orders_?: InputMaybe<PodOrderFilter>;
  plots_?: InputMaybe<PlotFilter>;
  refereeCount?: InputMaybe<Scalars['Int']['input']>;
  refereeCount_gt?: InputMaybe<Scalars['Int']['input']>;
  refereeCount_gte?: InputMaybe<Scalars['Int']['input']>;
  refereeCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  refereeCount_lt?: InputMaybe<Scalars['Int']['input']>;
  refereeCount_lte?: InputMaybe<Scalars['Int']['input']>;
  refereeCount_not?: InputMaybe<Scalars['Int']['input']>;
  refereeCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  silo_?: InputMaybe<SiloFilter>;
  totalReferralRewardPodsReceived?: InputMaybe<Scalars['BigInt']['input']>;
  totalReferralRewardPodsReceived_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReferralRewardPodsReceived_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReferralRewardPodsReceived_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalReferralRewardPodsReceived_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalReferralRewardPodsReceived_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalReferralRewardPodsReceived_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalReferralRewardPodsReceived_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdraws_?: InputMaybe<SiloWithdrawFilter>;
};

export enum FarmerOrderBy {
  creationBlock = 'creationBlock',
  deposits = 'deposits',
  fertilizers = 'fertilizers',
  field = 'field',
  field__cultivationFactor = 'field__cultivationFactor',
  field__cultivationTemperature = 'field__cultivationTemperature',
  field__fieldId = 'field__fieldId',
  field__harvestableIndex = 'field__harvestableIndex',
  field__harvestablePods = 'field__harvestablePods',
  field__harvestedPods = 'field__harvestedPods',
  field__id = 'field__id',
  field__lastDailySnapshotDay = 'field__lastDailySnapshotDay',
  field__lastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  field__numberOfSowers = 'field__numberOfSowers',
  field__numberOfSows = 'field__numberOfSows',
  field__podIndex = 'field__podIndex',
  field__podRate = 'field__podRate',
  field__realRateOfReturn = 'field__realRateOfReturn',
  field__season = 'field__season',
  field__soil = 'field__soil',
  field__sownBeans = 'field__sownBeans',
  field__temperature = 'field__temperature',
  field__unharvestablePods = 'field__unharvestablePods',
  field__unmigratedL1Pods = 'field__unmigratedL1Pods',
  fills = 'fills',
  id = 'id',
  listings = 'listings',
  orders = 'orders',
  plots = 'plots',
  refereeCount = 'refereeCount',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  totalReferralRewardPodsReceived = 'totalReferralRewardPodsReceived',
  withdraws = 'withdraws'
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
  orderBy?: InputMaybe<FertilizerTokenOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FertilizerTokenFilter>;
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

export type FertilizerBalanceFilter = {
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
  and?: InputMaybe<Array<InputMaybe<FertilizerBalanceFilter>>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<FarmerFilter>;
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
  fertilizerToken_?: InputMaybe<FertilizerTokenFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FertilizerBalanceFilter>>>;
};

export enum FertilizerBalanceOrderBy {
  amount = 'amount',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  fertilizerToken = 'fertilizerToken',
  fertilizerToken__endBpf = 'fertilizerToken__endBpf',
  fertilizerToken__humidity = 'fertilizerToken__humidity',
  fertilizerToken__id = 'fertilizerToken__id',
  fertilizerToken__season = 'fertilizerToken__season',
  fertilizerToken__startBpf = 'fertilizerToken__startBpf',
  fertilizerToken__supply = 'fertilizerToken__supply',
  id = 'id'
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
  orderBy?: InputMaybe<FertilizerBalanceOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FertilizerBalanceFilter>;
};

export type FertilizerTokenFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FertilizerTokenFilter>>>;
  balances_?: InputMaybe<FertilizerBalanceFilter>;
  endBpf?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBpf_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBpf_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fertilizer?: InputMaybe<Scalars['String']['input']>;
  fertilizer_?: InputMaybe<FertilizerFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FertilizerTokenFilter>>>;
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

export enum FertilizerTokenOrderBy {
  balances = 'balances',
  endBpf = 'endBpf',
  fertilizer = 'fertilizer',
  fertilizer__beanstalk = 'fertilizer__beanstalk',
  fertilizer__id = 'fertilizer__id',
  fertilizer__supply = 'fertilizer__supply',
  fertilizer__unmigratedL1Supply = 'fertilizer__unmigratedL1Supply',
  humidity = 'humidity',
  id = 'id',
  season = 'season',
  startBpf = 'startBpf',
  supply = 'supply'
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

export type FertilizerYieldFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FertilizerYieldFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<FertilizerYieldFilter>>>;
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

export enum FertilizerYieldOrderBy {
  beansPerSeasonEMA = 'beansPerSeasonEMA',
  createdAt = 'createdAt',
  deltaBpf = 'deltaBpf',
  emaWindow = 'emaWindow',
  humidity = 'humidity',
  id = 'id',
  outstandingFert = 'outstandingFert',
  season = 'season',
  simpleAPY = 'simpleAPY'
}

export type FertilizerFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FertilizerFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<FertilizerFilter>>>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens_?: InputMaybe<FertilizerTokenFilter>;
  unmigratedL1Supply?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1Supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1Supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum FertilizerOrderBy {
  beanstalk = 'beanstalk',
  id = 'id',
  supply = 'supply',
  tokens = 'tokens',
  unmigratedL1Supply = 'unmigratedL1Supply'
}

export type Field = {
  __typename?: 'Field';
  /** 'beanstalk' */
  beanstalk: Beanstalk;
  /** PI-6 Cultivation Factor, in percent (i.e. 20.5 = 20.5% cultivation factor) */
  cultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  /** PI-10 Cultivation Temperature, in percent (i.e. 50.5 = 50.5% cultivation temperature). This value is presented since protocol deployment, despite not being introduced onchain until PI-10. */
  cultivationTemperature?: Maybe<Scalars['BigDecimal']['output']>;
  /** Link to daily snapshot data */
  dailySnapshots: Array<FieldDailySnapshot>;
  /** Farmer address if applicable */
  farmer?: Maybe<Farmer>;
  /** Numeric identifier of the field emitted on protocol events */
  fieldId: Scalars['BigInt']['output'];
  /** Current harvestable index */
  harvestableIndex: Scalars['BigInt']['output'];
  /** Current harvestable pods */
  harvestablePods: Scalars['BigInt']['output'];
  /** Cumulative harvested pods */
  harvestedPods: Scalars['BigInt']['output'];
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<FieldHourlySnapshot>;
  /** Contract address for this field or farmer when fieldId is zero. Otherwise address:fieldId */
  id: Scalars['ID']['output'];
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
  /** Current temperature, in percent (i.e. 50.5 = 50.5% temperature) */
  temperature: Scalars['BigDecimal']['output'];
  /** Current outstanding non-harvestable pods */
  unharvestablePods: Scalars['BigInt']['output'];
  /** Pods from L1 which has not been minted on L2 yet */
  unmigratedL1Pods?: Maybe<Scalars['BigInt']['output']>;
};


export type FieldDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FieldDailySnapshotFilter>;
};


export type FieldHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FieldHourlySnapshotFilter>;
};

export type FieldDailySnapshot = {
  __typename?: 'FieldDailySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** Point in time PI-6 Cultivation Factor */
  cultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  /** Point in time PI-10 Cultivation Temperature */
  cultivationTemperature?: Maybe<Scalars['BigDecimal']['output']>;
  deltaCultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  deltaCultivationTemperature?: Maybe<Scalars['BigDecimal']['output']>;
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
  deltaTemperature: Scalars['BigDecimal']['output'];
  deltaUnharvestablePods: Scalars['BigInt']['output'];
  /** Field associated with this snapshot */
  field: Field;
  /** Numeric identifier of the field */
  fieldId: Scalars['BigInt']['output'];
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
  temperature: Scalars['BigDecimal']['output'];
  /** Point in time outstanding non-harvestable pods */
  unharvestablePods: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type FieldDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FieldDailySnapshotFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationTemperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationTemperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationTemperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationTemperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  deltaTemperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTemperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaUnharvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnharvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  field?: InputMaybe<Scalars['String']['input']>;
  fieldId?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fieldId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  field_?: InputMaybe<FieldFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FieldDailySnapshotFilter>>>;
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
  temperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  temperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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

export enum FieldDailySnapshotOrderBy {
  createdAt = 'createdAt',
  cultivationFactor = 'cultivationFactor',
  cultivationTemperature = 'cultivationTemperature',
  deltaCultivationFactor = 'deltaCultivationFactor',
  deltaCultivationTemperature = 'deltaCultivationTemperature',
  deltaHarvestableIndex = 'deltaHarvestableIndex',
  deltaHarvestablePods = 'deltaHarvestablePods',
  deltaHarvestedPods = 'deltaHarvestedPods',
  deltaIssuedSoil = 'deltaIssuedSoil',
  deltaNumberOfSowers = 'deltaNumberOfSowers',
  deltaNumberOfSows = 'deltaNumberOfSows',
  deltaPodIndex = 'deltaPodIndex',
  deltaPodRate = 'deltaPodRate',
  deltaRealRateOfReturn = 'deltaRealRateOfReturn',
  deltaSoil = 'deltaSoil',
  deltaSownBeans = 'deltaSownBeans',
  deltaTemperature = 'deltaTemperature',
  deltaUnharvestablePods = 'deltaUnharvestablePods',
  field = 'field',
  fieldId = 'fieldId',
  field__cultivationFactor = 'field__cultivationFactor',
  field__cultivationTemperature = 'field__cultivationTemperature',
  field__fieldId = 'field__fieldId',
  field__harvestableIndex = 'field__harvestableIndex',
  field__harvestablePods = 'field__harvestablePods',
  field__harvestedPods = 'field__harvestedPods',
  field__id = 'field__id',
  field__lastDailySnapshotDay = 'field__lastDailySnapshotDay',
  field__lastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  field__numberOfSowers = 'field__numberOfSowers',
  field__numberOfSows = 'field__numberOfSows',
  field__podIndex = 'field__podIndex',
  field__podRate = 'field__podRate',
  field__realRateOfReturn = 'field__realRateOfReturn',
  field__season = 'field__season',
  field__soil = 'field__soil',
  field__sownBeans = 'field__sownBeans',
  field__temperature = 'field__temperature',
  field__unharvestablePods = 'field__unharvestablePods',
  field__unmigratedL1Pods = 'field__unmigratedL1Pods',
  harvestableIndex = 'harvestableIndex',
  harvestablePods = 'harvestablePods',
  harvestedPods = 'harvestedPods',
  id = 'id',
  issuedSoil = 'issuedSoil',
  numberOfSowers = 'numberOfSowers',
  numberOfSows = 'numberOfSows',
  podIndex = 'podIndex',
  podRate = 'podRate',
  realRateOfReturn = 'realRateOfReturn',
  season = 'season',
  soil = 'soil',
  sownBeans = 'sownBeans',
  temperature = 'temperature',
  unharvestablePods = 'unharvestablePods',
  updatedAt = 'updatedAt'
}

export type FieldHourlySnapshot = {
  __typename?: 'FieldHourlySnapshot';
  /** Number of blocks between sunrise and soil being sold out */
  blocksToSoldOutSoil?: Maybe<Scalars['BigInt']['output']>;
  /** The caseId used in the seasonal adjustment of temperature */
  caseId?: Maybe<Scalars['BigInt']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** Point in time PI-6 Cultivation Factor */
  cultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  /** Point in time PI-10 Cultivation Temperature */
  cultivationTemperature?: Maybe<Scalars['BigDecimal']['output']>;
  deltaCultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  deltaCultivationTemperature?: Maybe<Scalars['BigDecimal']['output']>;
  deltaHarvestableIndex: Scalars['BigInt']['output'];
  deltaHarvestablePods: Scalars['BigInt']['output'];
  deltaHarvestedPods: Scalars['BigInt']['output'];
  deltaIssuedSoil: Scalars['BigInt']['output'];
  deltaNumberOfSowers: Scalars['Int']['output'];
  deltaNumberOfSows: Scalars['Int']['output'];
  /** Result of getDeltaPodDemand for this season. Refer to protocol codebase to understand how to interpret this value */
  deltaPodDemand: Scalars['BigInt']['output'];
  deltaPodIndex: Scalars['BigInt']['output'];
  deltaPodRate: Scalars['BigDecimal']['output'];
  deltaRealRateOfReturn: Scalars['BigDecimal']['output'];
  deltaSoil: Scalars['BigInt']['output'];
  deltaSownBeans: Scalars['BigInt']['output'];
  deltaTemperature: Scalars['BigDecimal']['output'];
  deltaUnharvestablePods: Scalars['BigInt']['output'];
  /** Field associated with this snapshot */
  field: Field;
  /** Numeric identifier of the field */
  fieldId: Scalars['BigInt']['output'];
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
  temperature: Scalars['BigDecimal']['output'];
  /** Point in time outstanding non-harvestable pods */
  unharvestablePods: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type FieldHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FieldHourlySnapshotFilter>>>;
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
  cultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationTemperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationTemperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationTemperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCultivationTemperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCultivationTemperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  deltaPodDemand?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodDemand_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodDemand_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodDemand_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPodDemand_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodDemand_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodDemand_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPodDemand_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  deltaTemperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaTemperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaTemperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaUnharvestablePods?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnharvestablePods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnharvestablePods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  field?: InputMaybe<Scalars['String']['input']>;
  fieldId?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fieldId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  field_?: InputMaybe<FieldFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FieldHourlySnapshotFilter>>>;
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
  temperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  temperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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

export enum FieldHourlySnapshotOrderBy {
  blocksToSoldOutSoil = 'blocksToSoldOutSoil',
  caseId = 'caseId',
  createdAt = 'createdAt',
  cultivationFactor = 'cultivationFactor',
  cultivationTemperature = 'cultivationTemperature',
  deltaCultivationFactor = 'deltaCultivationFactor',
  deltaCultivationTemperature = 'deltaCultivationTemperature',
  deltaHarvestableIndex = 'deltaHarvestableIndex',
  deltaHarvestablePods = 'deltaHarvestablePods',
  deltaHarvestedPods = 'deltaHarvestedPods',
  deltaIssuedSoil = 'deltaIssuedSoil',
  deltaNumberOfSowers = 'deltaNumberOfSowers',
  deltaNumberOfSows = 'deltaNumberOfSows',
  deltaPodDemand = 'deltaPodDemand',
  deltaPodIndex = 'deltaPodIndex',
  deltaPodRate = 'deltaPodRate',
  deltaRealRateOfReturn = 'deltaRealRateOfReturn',
  deltaSoil = 'deltaSoil',
  deltaSownBeans = 'deltaSownBeans',
  deltaTemperature = 'deltaTemperature',
  deltaUnharvestablePods = 'deltaUnharvestablePods',
  field = 'field',
  fieldId = 'fieldId',
  field__cultivationFactor = 'field__cultivationFactor',
  field__cultivationTemperature = 'field__cultivationTemperature',
  field__fieldId = 'field__fieldId',
  field__harvestableIndex = 'field__harvestableIndex',
  field__harvestablePods = 'field__harvestablePods',
  field__harvestedPods = 'field__harvestedPods',
  field__id = 'field__id',
  field__lastDailySnapshotDay = 'field__lastDailySnapshotDay',
  field__lastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  field__numberOfSowers = 'field__numberOfSowers',
  field__numberOfSows = 'field__numberOfSows',
  field__podIndex = 'field__podIndex',
  field__podRate = 'field__podRate',
  field__realRateOfReturn = 'field__realRateOfReturn',
  field__season = 'field__season',
  field__soil = 'field__soil',
  field__sownBeans = 'field__sownBeans',
  field__temperature = 'field__temperature',
  field__unharvestablePods = 'field__unharvestablePods',
  field__unmigratedL1Pods = 'field__unmigratedL1Pods',
  harvestableIndex = 'harvestableIndex',
  harvestablePods = 'harvestablePods',
  harvestedPods = 'harvestedPods',
  id = 'id',
  issuedSoil = 'issuedSoil',
  numberOfSowers = 'numberOfSowers',
  numberOfSows = 'numberOfSows',
  podIndex = 'podIndex',
  podRate = 'podRate',
  realRateOfReturn = 'realRateOfReturn',
  season = 'season',
  seasonBlock = 'seasonBlock',
  soil = 'soil',
  soilSoldOut = 'soilSoldOut',
  sownBeans = 'sownBeans',
  temperature = 'temperature',
  unharvestablePods = 'unharvestablePods',
  updatedAt = 'updatedAt'
}

export type FieldFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FieldFilter>>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_?: InputMaybe<BeanstalkFilter>;
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
  cultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationTemperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cultivationTemperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cultivationTemperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySnapshots_?: InputMaybe<FieldDailySnapshotFilter>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<FarmerFilter>;
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
  fieldId?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fieldId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  hourlySnapshots_?: InputMaybe<FieldHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<FieldFilter>>>;
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
  temperature?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  temperature_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  temperature_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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

export enum FieldOrderBy {
  beanstalk = 'beanstalk',
  beanstalk__fertilizer1155 = 'beanstalk__fertilizer1155',
  beanstalk__id = 'beanstalk__id',
  beanstalk__lastSeason = 'beanstalk__lastSeason',
  beanstalk__token = 'beanstalk__token',
  cultivationFactor = 'cultivationFactor',
  cultivationTemperature = 'cultivationTemperature',
  dailySnapshots = 'dailySnapshots',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  fieldId = 'fieldId',
  harvestableIndex = 'harvestableIndex',
  harvestablePods = 'harvestablePods',
  harvestedPods = 'harvestedPods',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  numberOfSowers = 'numberOfSowers',
  numberOfSows = 'numberOfSows',
  plotIndexes = 'plotIndexes',
  podIndex = 'podIndex',
  podRate = 'podRate',
  realRateOfReturn = 'realRateOfReturn',
  season = 'season',
  soil = 'soil',
  sownBeans = 'sownBeans',
  temperature = 'temperature',
  unharvestablePods = 'unharvestablePods',
  unmigratedL1Pods = 'unmigratedL1Pods'
}

export type GaugesInfo = {
  __typename?: 'GaugesInfo';
  /** Link to daily snapshot data */
  dailySnapshots: Array<GaugesInfoDailySnapshot>;
  /** Cultivation Factor, in percent (i.e. 20.5 = 20.5% cultivation factor) */
  g0CultivationFactor?: Maybe<Scalars['BigDecimal']['output']>;
  /** Whether the Cultivation Factor gauge is active */
  g0IsActive: Scalars['Boolean']['output'];
  /** Blight factor; increments each season the twaDeltaB is above 1 and decrements otherwise (minimum zero). */
  g1BlightFactor?: Maybe<Scalars['BigInt']['output']>;
  /** Convert down penalty ratio */
  g1ConvertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  /** Whether the Convert Down Penalty gauge is active */
  g1IsActive: Scalars['Boolean']['output'];
  /** Convert Up Bonus bdv converted this season */
  g2BdvConvertedThisSeason?: Maybe<Scalars['BigInt']['output']>;
  /** Convert Up Bonus current bonus stalk per bdv */
  g2BonusStalkPerBdv?: Maybe<Scalars['BigInt']['output']>;
  /** Whether the Convert Up Bonus gauge is active */
  g2IsActive: Scalars['Boolean']['output'];
  /** Convert Up Bonus seasonal max convert capacity (in bdv) that is eligible for a bonus */
  g2MaxConvertCapacity?: Maybe<Scalars['BigInt']['output']>;
  /** Convert Up Bonus max recorded negative twaDeltaB while the bonus was active */
  g2MaxTwaDeltaB?: Maybe<Scalars['BigInt']['output']>;
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<GaugesInfoHourlySnapshot>;
  /** 'gauges' */
  id: Scalars['ID']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
};


export type GaugesInfoDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugesInfoDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GaugesInfoDailySnapshotFilter>;
};


export type GaugesInfoHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugesInfoHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GaugesInfoHourlySnapshotFilter>;
};

export type GaugesInfoDailySnapshot = {
  __typename?: 'GaugesInfoDailySnapshot';
  /** Timestamp of initial snapshot creation */
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
  /** Unripe token associated with this snapshot */
  gaugesInfo: GaugesInfo;
  /** Gauge ID - Day */
  id: Scalars['ID']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type GaugesInfoDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugesInfoDailySnapshotFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG0CultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG0CultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG0IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG0IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG0IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG0IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG1BlightFactor?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG1BlightFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG1ConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG1ConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG1IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG1IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG1IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG1IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG2BdvConvertedThisSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2BdvConvertedThisSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2BonusStalkPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2BonusStalkPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG2IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG2IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG2IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG2MaxConvertCapacity?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2MaxConvertCapacity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2MaxTwaDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2MaxTwaDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g0CultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g0CultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g0IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g0IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g0IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g0IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g1BlightFactor?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g1BlightFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g1ConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g1ConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g1IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g1IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g1IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g1IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2BdvConvertedThisSeason?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BdvConvertedThisSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BonusStalkPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BonusStalkPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g2IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g2IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2MaxConvertCapacity?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxConvertCapacity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxTwaDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxTwaDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gaugesInfo?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_?: InputMaybe<GaugesInfoFilter>;
  gaugesInfo_contains?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_ends_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_gt?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_gte?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gaugesInfo_lt?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_lte?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_contains?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gaugesInfo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_starts_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GaugesInfoDailySnapshotFilter>>>;
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

export enum GaugesInfoDailySnapshotOrderBy {
  createdAt = 'createdAt',
  deltaG0CultivationFactor = 'deltaG0CultivationFactor',
  deltaG0IsActive = 'deltaG0IsActive',
  deltaG1BlightFactor = 'deltaG1BlightFactor',
  deltaG1ConvertDownPenalty = 'deltaG1ConvertDownPenalty',
  deltaG1IsActive = 'deltaG1IsActive',
  deltaG2BdvConvertedThisSeason = 'deltaG2BdvConvertedThisSeason',
  deltaG2BonusStalkPerBdv = 'deltaG2BonusStalkPerBdv',
  deltaG2IsActive = 'deltaG2IsActive',
  deltaG2MaxConvertCapacity = 'deltaG2MaxConvertCapacity',
  deltaG2MaxTwaDeltaB = 'deltaG2MaxTwaDeltaB',
  g0CultivationFactor = 'g0CultivationFactor',
  g0IsActive = 'g0IsActive',
  g1BlightFactor = 'g1BlightFactor',
  g1ConvertDownPenalty = 'g1ConvertDownPenalty',
  g1IsActive = 'g1IsActive',
  g2BdvConvertedThisSeason = 'g2BdvConvertedThisSeason',
  g2BonusStalkPerBdv = 'g2BonusStalkPerBdv',
  g2IsActive = 'g2IsActive',
  g2MaxConvertCapacity = 'g2MaxConvertCapacity',
  g2MaxTwaDeltaB = 'g2MaxTwaDeltaB',
  gaugesInfo = 'gaugesInfo',
  gaugesInfo__g0CultivationFactor = 'gaugesInfo__g0CultivationFactor',
  gaugesInfo__g0IsActive = 'gaugesInfo__g0IsActive',
  gaugesInfo__g1BlightFactor = 'gaugesInfo__g1BlightFactor',
  gaugesInfo__g1ConvertDownPenalty = 'gaugesInfo__g1ConvertDownPenalty',
  gaugesInfo__g1IsActive = 'gaugesInfo__g1IsActive',
  gaugesInfo__g2BdvConvertedThisSeason = 'gaugesInfo__g2BdvConvertedThisSeason',
  gaugesInfo__g2BonusStalkPerBdv = 'gaugesInfo__g2BonusStalkPerBdv',
  gaugesInfo__g2IsActive = 'gaugesInfo__g2IsActive',
  gaugesInfo__g2MaxConvertCapacity = 'gaugesInfo__g2MaxConvertCapacity',
  gaugesInfo__g2MaxTwaDeltaB = 'gaugesInfo__g2MaxTwaDeltaB',
  gaugesInfo__id = 'gaugesInfo__id',
  gaugesInfo__lastDailySnapshotDay = 'gaugesInfo__lastDailySnapshotDay',
  gaugesInfo__lastHourlySnapshotSeason = 'gaugesInfo__lastHourlySnapshotSeason',
  id = 'id',
  season = 'season',
  updatedAt = 'updatedAt'
}

export type GaugesInfoHourlySnapshot = {
  __typename?: 'GaugesInfoHourlySnapshot';
  /** Timestamp of initial snapshot creation */
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
  /** Unripe token associated with this snapshot */
  gaugesInfo: GaugesInfo;
  /** Gauge ID - Season */
  id: Scalars['ID']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type GaugesInfoHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugesInfoHourlySnapshotFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG0CultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG0CultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG0CultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG0IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG0IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG0IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG0IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG1BlightFactor?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG1BlightFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG1BlightFactor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG1ConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG1ConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaG1ConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaG1IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG1IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG1IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG1IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG2BdvConvertedThisSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2BdvConvertedThisSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BdvConvertedThisSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2BonusStalkPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2BonusStalkPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2BonusStalkPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG2IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG2IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  deltaG2IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deltaG2MaxConvertCapacity?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2MaxConvertCapacity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxConvertCapacity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2MaxTwaDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaG2MaxTwaDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaG2MaxTwaDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g0CultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g0CultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g0IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g0IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g0IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g0IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g1BlightFactor?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g1BlightFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g1ConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g1ConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g1IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g1IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g1IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g1IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2BdvConvertedThisSeason?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BdvConvertedThisSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BonusStalkPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BonusStalkPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g2IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g2IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2MaxConvertCapacity?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxConvertCapacity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxTwaDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxTwaDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gaugesInfo?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_?: InputMaybe<GaugesInfoFilter>;
  gaugesInfo_contains?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_ends_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_gt?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_gte?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gaugesInfo_lt?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_lte?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_contains?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gaugesInfo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_starts_with?: InputMaybe<Scalars['String']['input']>;
  gaugesInfo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GaugesInfoHourlySnapshotFilter>>>;
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

export enum GaugesInfoHourlySnapshotOrderBy {
  createdAt = 'createdAt',
  deltaG0CultivationFactor = 'deltaG0CultivationFactor',
  deltaG0IsActive = 'deltaG0IsActive',
  deltaG1BlightFactor = 'deltaG1BlightFactor',
  deltaG1ConvertDownPenalty = 'deltaG1ConvertDownPenalty',
  deltaG1IsActive = 'deltaG1IsActive',
  deltaG2BdvConvertedThisSeason = 'deltaG2BdvConvertedThisSeason',
  deltaG2BonusStalkPerBdv = 'deltaG2BonusStalkPerBdv',
  deltaG2IsActive = 'deltaG2IsActive',
  deltaG2MaxConvertCapacity = 'deltaG2MaxConvertCapacity',
  deltaG2MaxTwaDeltaB = 'deltaG2MaxTwaDeltaB',
  g0CultivationFactor = 'g0CultivationFactor',
  g0IsActive = 'g0IsActive',
  g1BlightFactor = 'g1BlightFactor',
  g1ConvertDownPenalty = 'g1ConvertDownPenalty',
  g1IsActive = 'g1IsActive',
  g2BdvConvertedThisSeason = 'g2BdvConvertedThisSeason',
  g2BonusStalkPerBdv = 'g2BonusStalkPerBdv',
  g2IsActive = 'g2IsActive',
  g2MaxConvertCapacity = 'g2MaxConvertCapacity',
  g2MaxTwaDeltaB = 'g2MaxTwaDeltaB',
  gaugesInfo = 'gaugesInfo',
  gaugesInfo__g0CultivationFactor = 'gaugesInfo__g0CultivationFactor',
  gaugesInfo__g0IsActive = 'gaugesInfo__g0IsActive',
  gaugesInfo__g1BlightFactor = 'gaugesInfo__g1BlightFactor',
  gaugesInfo__g1ConvertDownPenalty = 'gaugesInfo__g1ConvertDownPenalty',
  gaugesInfo__g1IsActive = 'gaugesInfo__g1IsActive',
  gaugesInfo__g2BdvConvertedThisSeason = 'gaugesInfo__g2BdvConvertedThisSeason',
  gaugesInfo__g2BonusStalkPerBdv = 'gaugesInfo__g2BonusStalkPerBdv',
  gaugesInfo__g2IsActive = 'gaugesInfo__g2IsActive',
  gaugesInfo__g2MaxConvertCapacity = 'gaugesInfo__g2MaxConvertCapacity',
  gaugesInfo__g2MaxTwaDeltaB = 'gaugesInfo__g2MaxTwaDeltaB',
  gaugesInfo__id = 'gaugesInfo__id',
  gaugesInfo__lastDailySnapshotDay = 'gaugesInfo__lastDailySnapshotDay',
  gaugesInfo__lastHourlySnapshotSeason = 'gaugesInfo__lastHourlySnapshotSeason',
  id = 'id',
  season = 'season',
  updatedAt = 'updatedAt'
}

export type GaugesInfoFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugesInfoFilter>>>;
  dailySnapshots_?: InputMaybe<GaugesInfoDailySnapshotFilter>;
  g0CultivationFactor?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g0CultivationFactor_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  g0CultivationFactor_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g0IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g0IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g0IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g0IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g1BlightFactor?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g1BlightFactor_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_not?: InputMaybe<Scalars['BigInt']['input']>;
  g1BlightFactor_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g1ConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g1ConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  g1ConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  g1IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g1IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g1IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g1IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2BdvConvertedThisSeason?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BdvConvertedThisSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2BdvConvertedThisSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BonusStalkPerBdv?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2BonusStalkPerBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2BonusStalkPerBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  g2IsActive_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2IsActive_not?: InputMaybe<Scalars['Boolean']['input']>;
  g2IsActive_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  g2MaxConvertCapacity?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxConvertCapacity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxConvertCapacity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxTwaDeltaB?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_gt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_gte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  g2MaxTwaDeltaB_lt?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_lte?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_not?: InputMaybe<Scalars['BigInt']['input']>;
  g2MaxTwaDeltaB_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  hourlySnapshots_?: InputMaybe<GaugesInfoHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<GaugesInfoFilter>>>;
};

export enum GaugesInfoOrderBy {
  dailySnapshots = 'dailySnapshots',
  g0CultivationFactor = 'g0CultivationFactor',
  g0IsActive = 'g0IsActive',
  g1BlightFactor = 'g1BlightFactor',
  g1ConvertDownPenalty = 'g1ConvertDownPenalty',
  g1IsActive = 'g1IsActive',
  g2BdvConvertedThisSeason = 'g2BdvConvertedThisSeason',
  g2BonusStalkPerBdv = 'g2BonusStalkPerBdv',
  g2IsActive = 'g2IsActive',
  g2MaxConvertCapacity = 'g2MaxConvertCapacity',
  g2MaxTwaDeltaB = 'g2MaxTwaDeltaB',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason'
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

export type GerminatingFilter = {
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
  and?: InputMaybe<Array<InputMaybe<GerminatingFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GerminatingFilter>>>;
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

export enum GerminatingOrderBy {
  address = 'address',
  bdv = 'bdv',
  id = 'id',
  isFarmer = 'isFarmer',
  season = 'season',
  stalk = 'stalk',
  tokenAmount = 'tokenAmount',
  type = 'type'
}

export type MarketPerformanceSeasonal = {
  __typename?: 'MarketPerformanceSeasonal';
  /** Cumulative percentage change in value of each deposited non-bean token. It is possible for this value to appear out of sync with cumulativeUsdChange; it does not account for the number of these tokens deposited at the time of the value changing (only their ratios). Ordering according to silo.whitelistedTokens */
  cumulativePercentChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /** Cumulative percentage change in value across all deposited non-bean tokens. It is possible for this value to appear out of sync with cumulativeUsdChange; it does not account for the number of these tokens deposited at the time of the value changing (only their ratios) */
  cumulativeTotalPercentChange?: Maybe<Scalars['BigDecimal']['output']>;
  /** Cumulative net change in usd value across all deposited non-bean tokens */
  cumulativeTotalUsdChange?: Maybe<Scalars['BigDecimal']['output']>;
  /** Cumulative net change in usd value of each deposited non-bean token. Ordering according to silo.whitelistedTokens */
  cumulativeUsdChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /** Silo ID - Season */
  id: Scalars['ID']['output'];
  /** Seasonal percentage change in value of each deposited non-bean token. Ordering according to silo.whitelistedTokens. Null for !valid */
  percentChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /** Amount of tokens in each well, as of the previous season starting. Ordering according to silo.whitelistedTokens */
  prevSeasonTokenBalances: Array<Scalars['BigInt']['output']>;
  /** Prices of the non-bean token in each well, as of the previous season starting. Ordering according to silo.whitelistedTokens */
  prevSeasonTokenUsdPrices: Array<Scalars['BigDecimal']['output']>;
  /** Usd value of the non-bean tokens in each well, as of the previous season starting. Ordering according to silo.whitelistedTokens */
  prevSeasonTokenUsdValues: Array<Scalars['BigDecimal']['output']>;
  /** Usd value across all the non-bean tokens in each well, as of the previous season starting */
  prevSeasonTotalUsd: Scalars['BigDecimal']['output'];
  season: Scalars['Int']['output'];
  silo: Silo;
  /** Prices of the non-bean token in each well, as of this season starting. Ordering according to silo.whitelistedTokens. Null for !valid */
  thisSeasonTokenUsdPrices?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /** Usd value of prevSeasonTokenBalances, as of this season starting. Ordering according to silo.whitelistedTokens. Null for !valid */
  thisSeasonTokenUsdValues?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /** Usd value across all prevSeasonTokenBalances, as of this season starting. Null for !valid */
  thisSeasonTotalUsd?: Maybe<Scalars['BigDecimal']['output']>;
  /** Timestamp of this entry becoming valid */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
  /** Seasonal percentage change in value across all deposited non-bean tokens. Null for !valid */
  totalPercentChange?: Maybe<Scalars['BigDecimal']['output']>;
  /** Seasonal net change in usd value across all deposited non-bean tokens. Null for !valid */
  totalUsdChange?: Maybe<Scalars['BigDecimal']['output']>;
  /** Seasonal net change in usd value of each deposited non-bean token. Ordering according to silo.whitelistedTokens. Null for !valid */
  usdChange?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /** True if the entity is valid; entity is not valid for (current season + 1), the 'this' season has not occurred yet */
  valid: Scalars['Boolean']['output'];
};

export type MarketPerformanceSeasonalFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MarketPerformanceSeasonalFilter>>>;
  cumulativePercentChange?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativePercentChange_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativePercentChange_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativePercentChange_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativePercentChange_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativePercentChange_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalPercentChange?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalPercentChange_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalPercentChange_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalPercentChange_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalPercentChange_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalPercentChange_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalPercentChange_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalPercentChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalUsdChange?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalUsdChange_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalUsdChange_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalUsdChange_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalUsdChange_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalUsdChange_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalUsdChange_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalUsdChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUsdChange?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUsdChange_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUsdChange_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUsdChange_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUsdChange_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUsdChange_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MarketPerformanceSeasonalFilter>>>;
  percentChange?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  percentChange_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  percentChange_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  percentChange_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  percentChange_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  percentChange_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenBalances?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  prevSeasonTokenBalances_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  prevSeasonTokenBalances_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  prevSeasonTokenBalances_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  prevSeasonTokenBalances_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  prevSeasonTokenBalances_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  prevSeasonTokenUsdPrices?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdPrices_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdPrices_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdPrices_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdPrices_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdPrices_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdValues?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdValues_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdValues_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdValues_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdValues_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTokenUsdValues_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTotalUsd?: InputMaybe<Scalars['BigDecimal']['input']>;
  prevSeasonTotalUsd_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  prevSeasonTotalUsd_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  prevSeasonTotalUsd_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  prevSeasonTotalUsd_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  prevSeasonTotalUsd_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  prevSeasonTotalUsd_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  prevSeasonTotalUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  silo?: InputMaybe<Scalars['String']['input']>;
  silo_?: InputMaybe<SiloFilter>;
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
  thisSeasonTokenUsdPrices?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdPrices_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdPrices_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdPrices_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdPrices_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdPrices_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdValues?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdValues_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdValues_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdValues_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdValues_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTokenUsdValues_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTotalUsd?: InputMaybe<Scalars['BigDecimal']['input']>;
  thisSeasonTotalUsd_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  thisSeasonTotalUsd_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  thisSeasonTotalUsd_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  thisSeasonTotalUsd_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  thisSeasonTotalUsd_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  thisSeasonTotalUsd_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  thisSeasonTotalUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPercentChange?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPercentChange_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPercentChange_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPercentChange_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalPercentChange_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPercentChange_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPercentChange_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalPercentChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalUsdChange?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalUsdChange_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalUsdChange_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalUsdChange_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalUsdChange_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalUsdChange_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalUsdChange_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalUsdChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdChange?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdChange_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdChange_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdChange_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdChange_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  usdChange_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valid?: InputMaybe<Scalars['Boolean']['input']>;
  valid_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  valid_not?: InputMaybe<Scalars['Boolean']['input']>;
  valid_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export enum MarketPerformanceSeasonalOrderBy {
  cumulativePercentChange = 'cumulativePercentChange',
  cumulativeTotalPercentChange = 'cumulativeTotalPercentChange',
  cumulativeTotalUsdChange = 'cumulativeTotalUsdChange',
  cumulativeUsdChange = 'cumulativeUsdChange',
  id = 'id',
  percentChange = 'percentChange',
  prevSeasonTokenBalances = 'prevSeasonTokenBalances',
  prevSeasonTokenUsdPrices = 'prevSeasonTokenUsdPrices',
  prevSeasonTokenUsdValues = 'prevSeasonTokenUsdValues',
  prevSeasonTotalUsd = 'prevSeasonTotalUsd',
  season = 'season',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  thisSeasonTokenUsdPrices = 'thisSeasonTokenUsdPrices',
  thisSeasonTokenUsdValues = 'thisSeasonTokenUsdValues',
  thisSeasonTotalUsd = 'thisSeasonTotalUsd',
  timestamp = 'timestamp',
  totalPercentChange = 'totalPercentChange',
  totalUsdChange = 'totalUsdChange',
  usdChange = 'usdChange',
  valid = 'valid'
}

export enum MarketStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  CANCELLED_PARTIAL = 'CANCELLED_PARTIAL',
  EXPIRED = 'EXPIRED',
  FILLED = 'FILLED',
  FILLED_PARTIAL = 'FILLED_PARTIAL'
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

export type MarketplaceEventFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MarketplaceEventFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<MarketplaceEventFilter>>>;
};

export enum MarketplaceEventOrderBy {
  blockNumber = 'blockNumber',
  createdAt = 'createdAt',
  hash = 'hash',
  id = 'id',
  logIndex = 'logIndex'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  asc = 'asc',
  desc = 'desc'
}

export type Plot = {
  __typename?: 'Plot';
  /** Number of beans spent for each pod, whether through sowing or on the marketplace */
  beansPerPod: Scalars['BigInt']['output'];
  /** Timestamp of entity creation (not sown) */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash of when this plot entity was created (not sown) */
  creationHash: Scalars['Bytes']['output'];
  /** Farmer who owns this plot */
  farmer: Farmer;
  /** Field to which this plot belongs */
  field: Field;
  /** Numeric identifier of the field */
  fieldId: Scalars['BigInt']['output'];
  /** Flag for if plot is fully harvested */
  fullyHarvested: Scalars['Boolean']['output'];
  /** Timestamp of plot harvest, if it has harvested */
  harvestAt?: Maybe<Scalars['BigInt']['output']>;
  /** Transaction hash of plot harvest */
  harvestHash?: Maybe<Scalars['Bytes']['output']>;
  /** Number of pods harvestable */
  harvestablePods: Scalars['BigInt']['output'];
  /** Number of pods harvested */
  harvestedPods: Scalars['BigInt']['output'];
  /** Plot index when fieldId is 0, otherwise plotIndex:fieldId */
  id: Scalars['ID']['output'];
  /** Plot Index */
  index: Scalars['BigInt']['output'];
  /** The harvestable index at the time the plot was sown or exchanged on the marketplace */
  initialHarvestableIndex: Scalars['BigInt']['output'];
  /** True if this plot was sown during the morning auction */
  isMorning: Scalars['Boolean']['output'];
  /** Associated plot listing */
  listing?: Maybe<PodListing>;
  /** Total pods in plot */
  pods: Scalars['BigInt']['output'];
  /** If `source === 'TRANSFER'`: Farmer who acquired this plot in the Field or Market, and spent `beansPerPod` for each pod in the plot. */
  preTransferOwner?: Maybe<Farmer>;
  /** If `source === 'TRANSFER'`: Source SOW/MARKET of the farmer who acquired the plot. Cannot be TRANSFER. */
  preTransferSource?: Maybe<PlotSource>;
  /** If source === 'REFERRAL': The referee who was referred. */
  referee?: Maybe<Farmer>;
  /** If source === 'REFERRAL': The referrer who referred the farmer. */
  referrer?: Maybe<Farmer>;
  /** Season on entity creation (not sown) */
  season: Scalars['Int']['output'];
  /** Source for this plot */
  source: PlotSource;
  /** Transaction hash corresponding to when source was set. Not the same as creationHash which can include plots splitting from transfer or harvest without the owner changing */
  sourceHash: Scalars['Bytes']['output'];
  /** Transaction hash of initial sowing */
  sowHash: Scalars['Bytes']['output'];
  /** Same as season, but only for the initial sowing */
  sowSeason: Scalars['Int']['output'];
  /** Timestamp of initial sowing */
  sowTimestamp: Scalars['BigInt']['output'];
  /** Same as beansPerPod, but only for the initial sowing */
  sownBeansPerPod: Scalars['BigInt']['output'];
  /** Same as initialHarvestableIndex, but only for the initial sowing */
  sownInitialHarvestableIndex: Scalars['BigInt']['output'];
  /** Timestamp when updated */
  updatedAt: Scalars['BigInt']['output'];
  /** Block when updated */
  updatedAtBlock: Scalars['BigInt']['output'];
};

export enum PlotSource {
  CONTRACT_RECEIVER_MIGRATED = 'CONTRACT_RECEIVER_MIGRATED',
  MARKET = 'MARKET',
  REFERRAL = 'REFERRAL',
  RESEED_MIGRATED = 'RESEED_MIGRATED',
  SOW = 'SOW',
  TRANSFER = 'TRANSFER'
}

export type PlotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PlotFilter>>>;
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
  farmer_?: InputMaybe<FarmerFilter>;
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
  fieldId?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fieldId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  field_?: InputMaybe<FieldFilter>;
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
  harvestAt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  harvestAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  harvestAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  harvestAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  harvestHash?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  harvestHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  harvestHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  initialHarvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  initialHarvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  initialHarvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  initialHarvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  initialHarvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  initialHarvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  initialHarvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  initialHarvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  isMorning?: InputMaybe<Scalars['Boolean']['input']>;
  isMorning_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isMorning_not?: InputMaybe<Scalars['Boolean']['input']>;
  isMorning_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  listing?: InputMaybe<Scalars['String']['input']>;
  listing_?: InputMaybe<PodListingFilter>;
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
  or?: InputMaybe<Array<InputMaybe<PlotFilter>>>;
  pods?: InputMaybe<Scalars['BigInt']['input']>;
  pods_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pods_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pods_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pods_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pods_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pods_not?: InputMaybe<Scalars['BigInt']['input']>;
  pods_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  preTransferOwner?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_?: InputMaybe<FarmerFilter>;
  preTransferOwner_contains?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_ends_with?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_gt?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_gte?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  preTransferOwner_lt?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_lte?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_not?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  preTransferOwner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_starts_with?: InputMaybe<Scalars['String']['input']>;
  preTransferOwner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  preTransferSource?: InputMaybe<PlotSource>;
  preTransferSource_in?: InputMaybe<Array<PlotSource>>;
  preTransferSource_not?: InputMaybe<PlotSource>;
  preTransferSource_not_in?: InputMaybe<Array<PlotSource>>;
  referee?: InputMaybe<Scalars['String']['input']>;
  referee_?: InputMaybe<FarmerFilter>;
  referee_contains?: InputMaybe<Scalars['String']['input']>;
  referee_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  referee_ends_with?: InputMaybe<Scalars['String']['input']>;
  referee_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  referee_gt?: InputMaybe<Scalars['String']['input']>;
  referee_gte?: InputMaybe<Scalars['String']['input']>;
  referee_in?: InputMaybe<Array<Scalars['String']['input']>>;
  referee_lt?: InputMaybe<Scalars['String']['input']>;
  referee_lte?: InputMaybe<Scalars['String']['input']>;
  referee_not?: InputMaybe<Scalars['String']['input']>;
  referee_not_contains?: InputMaybe<Scalars['String']['input']>;
  referee_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  referee_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  referee_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  referee_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  referee_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  referee_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  referee_starts_with?: InputMaybe<Scalars['String']['input']>;
  referee_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  referrer_?: InputMaybe<FarmerFilter>;
  referrer_contains?: InputMaybe<Scalars['String']['input']>;
  referrer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  referrer_ends_with?: InputMaybe<Scalars['String']['input']>;
  referrer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  referrer_gt?: InputMaybe<Scalars['String']['input']>;
  referrer_gte?: InputMaybe<Scalars['String']['input']>;
  referrer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  referrer_lt?: InputMaybe<Scalars['String']['input']>;
  referrer_lte?: InputMaybe<Scalars['String']['input']>;
  referrer_not?: InputMaybe<Scalars['String']['input']>;
  referrer_not_contains?: InputMaybe<Scalars['String']['input']>;
  referrer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  referrer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  referrer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  referrer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  referrer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  referrer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  referrer_starts_with?: InputMaybe<Scalars['String']['input']>;
  referrer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  sowHash?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sowHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sowHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sowSeason?: InputMaybe<Scalars['Int']['input']>;
  sowSeason_gt?: InputMaybe<Scalars['Int']['input']>;
  sowSeason_gte?: InputMaybe<Scalars['Int']['input']>;
  sowSeason_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  sowSeason_lt?: InputMaybe<Scalars['Int']['input']>;
  sowSeason_lte?: InputMaybe<Scalars['Int']['input']>;
  sowSeason_not?: InputMaybe<Scalars['Int']['input']>;
  sowSeason_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  sowTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  sowTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sowTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sowTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sowTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sowTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sowTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  sowTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeansPerPod?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeansPerPod_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeansPerPod_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeansPerPod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownBeansPerPod_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeansPerPod_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeansPerPod_not?: InputMaybe<Scalars['BigInt']['input']>;
  sownBeansPerPod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownInitialHarvestableIndex?: InputMaybe<Scalars['BigInt']['input']>;
  sownInitialHarvestableIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  sownInitialHarvestableIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  sownInitialHarvestableIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sownInitialHarvestableIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  sownInitialHarvestableIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  sownInitialHarvestableIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  sownInitialHarvestableIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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

export enum PlotOrderBy {
  beansPerPod = 'beansPerPod',
  createdAt = 'createdAt',
  creationHash = 'creationHash',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  field = 'field',
  fieldId = 'fieldId',
  field__cultivationFactor = 'field__cultivationFactor',
  field__cultivationTemperature = 'field__cultivationTemperature',
  field__fieldId = 'field__fieldId',
  field__harvestableIndex = 'field__harvestableIndex',
  field__harvestablePods = 'field__harvestablePods',
  field__harvestedPods = 'field__harvestedPods',
  field__id = 'field__id',
  field__lastDailySnapshotDay = 'field__lastDailySnapshotDay',
  field__lastHourlySnapshotSeason = 'field__lastHourlySnapshotSeason',
  field__numberOfSowers = 'field__numberOfSowers',
  field__numberOfSows = 'field__numberOfSows',
  field__podIndex = 'field__podIndex',
  field__podRate = 'field__podRate',
  field__realRateOfReturn = 'field__realRateOfReturn',
  field__season = 'field__season',
  field__soil = 'field__soil',
  field__sownBeans = 'field__sownBeans',
  field__temperature = 'field__temperature',
  field__unharvestablePods = 'field__unharvestablePods',
  field__unmigratedL1Pods = 'field__unmigratedL1Pods',
  fullyHarvested = 'fullyHarvested',
  harvestAt = 'harvestAt',
  harvestHash = 'harvestHash',
  harvestablePods = 'harvestablePods',
  harvestedPods = 'harvestedPods',
  id = 'id',
  index = 'index',
  initialHarvestableIndex = 'initialHarvestableIndex',
  isMorning = 'isMorning',
  listing = 'listing',
  listing__amount = 'listing__amount',
  listing__createdAt = 'listing__createdAt',
  listing__creationHash = 'listing__creationHash',
  listing__fieldId = 'listing__fieldId',
  listing__filled = 'listing__filled',
  listing__filledAmount = 'listing__filledAmount',
  listing__historyID = 'listing__historyID',
  listing__id = 'listing__id',
  listing__index = 'listing__index',
  listing__maxHarvestableIndex = 'listing__maxHarvestableIndex',
  listing__minFillAmount = 'listing__minFillAmount',
  listing__mode = 'listing__mode',
  listing__originalAmount = 'listing__originalAmount',
  listing__originalIndex = 'listing__originalIndex',
  listing__originalPlaceInLine = 'listing__originalPlaceInLine',
  listing__pricePerPod = 'listing__pricePerPod',
  listing__pricingFunction = 'listing__pricingFunction',
  listing__pricingType = 'listing__pricingType',
  listing__remainingAmount = 'listing__remainingAmount',
  listing__start = 'listing__start',
  listing__status = 'listing__status',
  listing__updatedAt = 'listing__updatedAt',
  pods = 'pods',
  preTransferOwner = 'preTransferOwner',
  preTransferOwner__creationBlock = 'preTransferOwner__creationBlock',
  preTransferOwner__id = 'preTransferOwner__id',
  preTransferOwner__refereeCount = 'preTransferOwner__refereeCount',
  preTransferOwner__totalReferralRewardPodsReceived = 'preTransferOwner__totalReferralRewardPodsReceived',
  preTransferSource = 'preTransferSource',
  referee = 'referee',
  referee__creationBlock = 'referee__creationBlock',
  referee__id = 'referee__id',
  referee__refereeCount = 'referee__refereeCount',
  referee__totalReferralRewardPodsReceived = 'referee__totalReferralRewardPodsReceived',
  referrer = 'referrer',
  referrer__creationBlock = 'referrer__creationBlock',
  referrer__id = 'referrer__id',
  referrer__refereeCount = 'referrer__refereeCount',
  referrer__totalReferralRewardPodsReceived = 'referrer__totalReferralRewardPodsReceived',
  season = 'season',
  source = 'source',
  sourceHash = 'sourceHash',
  sowHash = 'sowHash',
  sowSeason = 'sowSeason',
  sowTimestamp = 'sowTimestamp',
  sownBeansPerPod = 'sownBeansPerPod',
  sownInitialHarvestableIndex = 'sownInitialHarvestableIndex',
  updatedAt = 'updatedAt',
  updatedAtBlock = 'updatedAtBlock'
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
  fromFarmer: Farmer;
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

export type PodFillFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodFillFilter>>>;
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
  fromFarmer?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_?: InputMaybe<FarmerFilter>;
  fromFarmer_contains?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_gt?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_gte?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromFarmer_lt?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_lte?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_not?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_not_contains?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromFarmer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromFarmer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  listing_?: InputMaybe<PodListingFilter>;
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
  or?: InputMaybe<Array<InputMaybe<PodFillFilter>>>;
  order?: InputMaybe<Scalars['String']['input']>;
  order_?: InputMaybe<PodOrderFilter>;
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
  podMarketplace_?: InputMaybe<PodMarketplaceFilter>;
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
  toFarmer_?: InputMaybe<FarmerFilter>;
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

export enum PodFillOrderBy {
  amount = 'amount',
  costInBeans = 'costInBeans',
  createdAt = 'createdAt',
  fromFarmer = 'fromFarmer',
  fromFarmer__creationBlock = 'fromFarmer__creationBlock',
  fromFarmer__id = 'fromFarmer__id',
  fromFarmer__refereeCount = 'fromFarmer__refereeCount',
  fromFarmer__totalReferralRewardPodsReceived = 'fromFarmer__totalReferralRewardPodsReceived',
  id = 'id',
  index = 'index',
  listing = 'listing',
  listing__amount = 'listing__amount',
  listing__createdAt = 'listing__createdAt',
  listing__creationHash = 'listing__creationHash',
  listing__fieldId = 'listing__fieldId',
  listing__filled = 'listing__filled',
  listing__filledAmount = 'listing__filledAmount',
  listing__historyID = 'listing__historyID',
  listing__id = 'listing__id',
  listing__index = 'listing__index',
  listing__maxHarvestableIndex = 'listing__maxHarvestableIndex',
  listing__minFillAmount = 'listing__minFillAmount',
  listing__mode = 'listing__mode',
  listing__originalAmount = 'listing__originalAmount',
  listing__originalIndex = 'listing__originalIndex',
  listing__originalPlaceInLine = 'listing__originalPlaceInLine',
  listing__pricePerPod = 'listing__pricePerPod',
  listing__pricingFunction = 'listing__pricingFunction',
  listing__pricingType = 'listing__pricingType',
  listing__remainingAmount = 'listing__remainingAmount',
  listing__start = 'listing__start',
  listing__status = 'listing__status',
  listing__updatedAt = 'listing__updatedAt',
  order = 'order',
  order__beanAmount = 'order__beanAmount',
  order__beanAmountFilled = 'order__beanAmountFilled',
  order__createdAt = 'order__createdAt',
  order__creationHash = 'order__creationHash',
  order__fieldId = 'order__fieldId',
  order__historyID = 'order__historyID',
  order__id = 'order__id',
  order__maxPlaceInLine = 'order__maxPlaceInLine',
  order__minFillAmount = 'order__minFillAmount',
  order__podAmountFilled = 'order__podAmountFilled',
  order__pricePerPod = 'order__pricePerPod',
  order__pricingFunction = 'order__pricingFunction',
  order__pricingType = 'order__pricingType',
  order__status = 'order__status',
  order__updatedAt = 'order__updatedAt',
  placeInLine = 'placeInLine',
  podMarketplace = 'podMarketplace',
  podMarketplace__availableListedPods = 'podMarketplace__availableListedPods',
  podMarketplace__availableOrderBeans = 'podMarketplace__availableOrderBeans',
  podMarketplace__beanVolume = 'podMarketplace__beanVolume',
  podMarketplace__cancelledListedPods = 'podMarketplace__cancelledListedPods',
  podMarketplace__cancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  podMarketplace__expiredListedPods = 'podMarketplace__expiredListedPods',
  podMarketplace__filledListedPods = 'podMarketplace__filledListedPods',
  podMarketplace__filledOrderBeans = 'podMarketplace__filledOrderBeans',
  podMarketplace__filledOrderedPods = 'podMarketplace__filledOrderedPods',
  podMarketplace__id = 'podMarketplace__id',
  podMarketplace__lastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  podMarketplace__lastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  podMarketplace__listedPods = 'podMarketplace__listedPods',
  podMarketplace__orderBeans = 'podMarketplace__orderBeans',
  podMarketplace__podVolume = 'podMarketplace__podVolume',
  podMarketplace__season = 'podMarketplace__season',
  start = 'start',
  toFarmer = 'toFarmer',
  toFarmer__creationBlock = 'toFarmer__creationBlock',
  toFarmer__id = 'toFarmer__id',
  toFarmer__refereeCount = 'toFarmer__refereeCount',
  toFarmer__totalReferralRewardPodsReceived = 'toFarmer__totalReferralRewardPodsReceived'
}

export type PodListing = {
  __typename?: 'PodListing';
  /**
   * The maximum amount of Pods remaining to be sold by *this* PodListing.
   *
   * When this PodListing is Filled or Cancelled, `amount` does NOT change.
   */
  amount: Scalars['BigInt']['output'];
  /** Timestamp of PodListing creation. */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash when this PodListing entity was created. */
  creationHash: Scalars['Bytes']['output'];
  /** The Farmer that created the PodListing. */
  farmer: Farmer;
  /** Numeric identifier of the field for this listing */
  fieldId: Scalars['BigInt']['output'];
  /** Any Fills associated with this PodListing. */
  fill?: Maybe<PodFill>;
  /**
   * The amount of Pods Filled since the initial PodListing was Created.
   *
   * `0 <= filled <= originalAmount`
   */
  filled: Scalars['BigInt']['output'];
  /**
   * The number of Pods purchased from *this* PodListing.
   *
   * If not yet Filled or the PodListing is CANCELLED: `filledAmount = 0`
   */
  filledAmount: Scalars['BigInt']['output'];
  /** Historical ID for joins */
  historyID: Scalars['String']['output'];
  /**
   * The PodListing ID is a unique subgraph ID; if fieldId is 0: `{account}-{index}`, if fieldId isn't 0: `{account}-{index}:{fieldId}`
   *
   * The on-chain identifier for a PodListing is the `index`.
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
   */
  index: Scalars['BigInt']['output'];
  /** When the `harvestableIndex` reaches this number, the Listing becomes EXPIRED. */
  maxHarvestableIndex: Scalars['BigInt']['output'];
  /** Minimum number of Beans required to perform a Fill. */
  minFillAmount: Scalars['BigInt']['output'];
  /** Where Beans are sent when the PodListing is Filled. See `FarmToMode`. */
  mode: Scalars['Int']['output'];
  /** The total number of Pods listed during the first emission of PodListingCreated. */
  originalAmount: Scalars['BigInt']['output'];
  /**
   * The original index from the first emission of PodListingCreated in a chain.
   *
   * If `originalIndex !== index`, then this PodListing was created when a parent
   * PodListing was partially filled.
   */
  originalIndex: Scalars['BigInt']['output'];
  /** The place of this plot in the pod line at the time it was listed */
  originalPlaceInLine: Scalars['BigInt']['output'];
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
   */
  pricePerPod: Scalars['Int']['output'];
  /**
   * [V2] The FIXED or DYNAMIC pricing function, encoded as bytes.
   *
   * This must be decoded client-side, see `LibPolynomial.sol` for more info.
   */
  pricingFunction?: Maybe<Scalars['Bytes']['output']>;
  /**
   * The Pricing Type states whether this PodListing uses FIXED or DYNAMIC pricing.
   *
   * null = V1 FIXED  = use `pricePerPod`
   * 0    = V2 FIXED  = use `pricePerPod`
   * 1    = V2 DYNAMIC = use `pricingFunction`
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
   */
  remainingAmount: Scalars['BigInt']['output'];
  /**
   * The position within the Plot from which to sell Pods.
   *
   * 0 <= `start` <= (plot size - `amount`)
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

export type PodListingCancelledFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodListingCancelledFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodListingCancelledFilter>>>;
  placeInLine?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  placeInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  placeInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PodListingCancelledOrderBy {
  account = 'account',
  blockNumber = 'blockNumber',
  createdAt = 'createdAt',
  hash = 'hash',
  historyID = 'historyID',
  id = 'id',
  index = 'index',
  logIndex = 'logIndex',
  placeInLine = 'placeInLine'
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

export type PodListingCreatedFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodListingCreatedFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodListingCreatedFilter>>>;
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

export enum PodListingCreatedOrderBy {
  account = 'account',
  amount = 'amount',
  blockNumber = 'blockNumber',
  createdAt = 'createdAt',
  hash = 'hash',
  historyID = 'historyID',
  id = 'id',
  index = 'index',
  logIndex = 'logIndex',
  maxHarvestableIndex = 'maxHarvestableIndex',
  minFillAmount = 'minFillAmount',
  mode = 'mode',
  placeInLine = 'placeInLine',
  pricePerPod = 'pricePerPod',
  pricingFunction = 'pricingFunction',
  pricingType = 'pricingType',
  start = 'start'
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

export type PodListingFilledFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodListingFilledFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodListingFilledFilter>>>;
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

export enum PodListingFilledOrderBy {
  amount = 'amount',
  blockNumber = 'blockNumber',
  costInBeans = 'costInBeans',
  createdAt = 'createdAt',
  fromFarmer = 'fromFarmer',
  hash = 'hash',
  historyID = 'historyID',
  id = 'id',
  index = 'index',
  logIndex = 'logIndex',
  placeInLine = 'placeInLine',
  start = 'start',
  toFarmer = 'toFarmer'
}

export type PodListingFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodListingFilter>>>;
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
  farmer_?: InputMaybe<FarmerFilter>;
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
  fieldId?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fieldId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fill?: InputMaybe<Scalars['String']['input']>;
  fill_?: InputMaybe<PodFillFilter>;
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
  or?: InputMaybe<Array<InputMaybe<PodListingFilter>>>;
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
  originalPlaceInLine?: InputMaybe<Scalars['BigInt']['input']>;
  originalPlaceInLine_gt?: InputMaybe<Scalars['BigInt']['input']>;
  originalPlaceInLine_gte?: InputMaybe<Scalars['BigInt']['input']>;
  originalPlaceInLine_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  originalPlaceInLine_lt?: InputMaybe<Scalars['BigInt']['input']>;
  originalPlaceInLine_lte?: InputMaybe<Scalars['BigInt']['input']>;
  originalPlaceInLine_not?: InputMaybe<Scalars['BigInt']['input']>;
  originalPlaceInLine_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plot?: InputMaybe<Scalars['String']['input']>;
  plot_?: InputMaybe<PlotFilter>;
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
  podMarketplace_?: InputMaybe<PodMarketplaceFilter>;
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

export enum PodListingOrderBy {
  amount = 'amount',
  createdAt = 'createdAt',
  creationHash = 'creationHash',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  fieldId = 'fieldId',
  fill = 'fill',
  fill__amount = 'fill__amount',
  fill__costInBeans = 'fill__costInBeans',
  fill__createdAt = 'fill__createdAt',
  fill__id = 'fill__id',
  fill__index = 'fill__index',
  fill__placeInLine = 'fill__placeInLine',
  fill__start = 'fill__start',
  filled = 'filled',
  filledAmount = 'filledAmount',
  historyID = 'historyID',
  id = 'id',
  index = 'index',
  maxHarvestableIndex = 'maxHarvestableIndex',
  minFillAmount = 'minFillAmount',
  mode = 'mode',
  originalAmount = 'originalAmount',
  originalIndex = 'originalIndex',
  originalPlaceInLine = 'originalPlaceInLine',
  plot = 'plot',
  plot__beansPerPod = 'plot__beansPerPod',
  plot__createdAt = 'plot__createdAt',
  plot__creationHash = 'plot__creationHash',
  plot__fieldId = 'plot__fieldId',
  plot__fullyHarvested = 'plot__fullyHarvested',
  plot__harvestAt = 'plot__harvestAt',
  plot__harvestHash = 'plot__harvestHash',
  plot__harvestablePods = 'plot__harvestablePods',
  plot__harvestedPods = 'plot__harvestedPods',
  plot__id = 'plot__id',
  plot__index = 'plot__index',
  plot__initialHarvestableIndex = 'plot__initialHarvestableIndex',
  plot__isMorning = 'plot__isMorning',
  plot__pods = 'plot__pods',
  plot__preTransferSource = 'plot__preTransferSource',
  plot__season = 'plot__season',
  plot__source = 'plot__source',
  plot__sourceHash = 'plot__sourceHash',
  plot__sowHash = 'plot__sowHash',
  plot__sowSeason = 'plot__sowSeason',
  plot__sowTimestamp = 'plot__sowTimestamp',
  plot__sownBeansPerPod = 'plot__sownBeansPerPod',
  plot__sownInitialHarvestableIndex = 'plot__sownInitialHarvestableIndex',
  plot__updatedAt = 'plot__updatedAt',
  plot__updatedAtBlock = 'plot__updatedAtBlock',
  podMarketplace = 'podMarketplace',
  podMarketplace__availableListedPods = 'podMarketplace__availableListedPods',
  podMarketplace__availableOrderBeans = 'podMarketplace__availableOrderBeans',
  podMarketplace__beanVolume = 'podMarketplace__beanVolume',
  podMarketplace__cancelledListedPods = 'podMarketplace__cancelledListedPods',
  podMarketplace__cancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  podMarketplace__expiredListedPods = 'podMarketplace__expiredListedPods',
  podMarketplace__filledListedPods = 'podMarketplace__filledListedPods',
  podMarketplace__filledOrderBeans = 'podMarketplace__filledOrderBeans',
  podMarketplace__filledOrderedPods = 'podMarketplace__filledOrderedPods',
  podMarketplace__id = 'podMarketplace__id',
  podMarketplace__lastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  podMarketplace__lastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  podMarketplace__listedPods = 'podMarketplace__listedPods',
  podMarketplace__orderBeans = 'podMarketplace__orderBeans',
  podMarketplace__podVolume = 'podMarketplace__podVolume',
  podMarketplace__season = 'podMarketplace__season',
  pricePerPod = 'pricePerPod',
  pricingFunction = 'pricingFunction',
  pricingType = 'pricingType',
  remainingAmount = 'remainingAmount',
  start = 'start',
  status = 'status',
  updatedAt = 'updatedAt'
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
  orderBy?: InputMaybe<PodListingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodListingFilter>;
};


export type PodMarketplaceAllOrdersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodOrderFilter>;
};


export type PodMarketplaceDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodMarketplaceDailySnapshotFilter>;
};


export type PodMarketplaceFillsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFillOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodFillFilter>;
};


export type PodMarketplaceHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodMarketplaceHourlySnapshotFilter>;
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

export type PodMarketplaceDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PodMarketplaceDailySnapshotFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodMarketplaceDailySnapshotFilter>>>;
  orderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  orderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplaceFilter>;
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

export enum PodMarketplaceDailySnapshotOrderBy {
  availableListedPods = 'availableListedPods',
  availableOrderBeans = 'availableOrderBeans',
  beanVolume = 'beanVolume',
  cancelledListedPods = 'cancelledListedPods',
  cancelledOrderBeans = 'cancelledOrderBeans',
  createdAt = 'createdAt',
  deltaAvailableListedPods = 'deltaAvailableListedPods',
  deltaAvailableOrderBeans = 'deltaAvailableOrderBeans',
  deltaBeanVolume = 'deltaBeanVolume',
  deltaCancelledListedPods = 'deltaCancelledListedPods',
  deltaCancelledOrderBeans = 'deltaCancelledOrderBeans',
  deltaExpiredListedPods = 'deltaExpiredListedPods',
  deltaFilledListedPods = 'deltaFilledListedPods',
  deltaFilledOrderBeans = 'deltaFilledOrderBeans',
  deltaFilledOrderedPods = 'deltaFilledOrderedPods',
  deltaListedPods = 'deltaListedPods',
  deltaOrderBeans = 'deltaOrderBeans',
  deltaPodVolume = 'deltaPodVolume',
  expiredListedPods = 'expiredListedPods',
  filledListedPods = 'filledListedPods',
  filledOrderBeans = 'filledOrderBeans',
  filledOrderedPods = 'filledOrderedPods',
  id = 'id',
  listedPods = 'listedPods',
  orderBeans = 'orderBeans',
  podMarketplace = 'podMarketplace',
  podMarketplace__availableListedPods = 'podMarketplace__availableListedPods',
  podMarketplace__availableOrderBeans = 'podMarketplace__availableOrderBeans',
  podMarketplace__beanVolume = 'podMarketplace__beanVolume',
  podMarketplace__cancelledListedPods = 'podMarketplace__cancelledListedPods',
  podMarketplace__cancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  podMarketplace__expiredListedPods = 'podMarketplace__expiredListedPods',
  podMarketplace__filledListedPods = 'podMarketplace__filledListedPods',
  podMarketplace__filledOrderBeans = 'podMarketplace__filledOrderBeans',
  podMarketplace__filledOrderedPods = 'podMarketplace__filledOrderedPods',
  podMarketplace__id = 'podMarketplace__id',
  podMarketplace__lastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  podMarketplace__lastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  podMarketplace__listedPods = 'podMarketplace__listedPods',
  podMarketplace__orderBeans = 'podMarketplace__orderBeans',
  podMarketplace__podVolume = 'podMarketplace__podVolume',
  podMarketplace__season = 'podMarketplace__season',
  podVolume = 'podVolume',
  season = 'season',
  updatedAt = 'updatedAt'
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

export type PodMarketplaceHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PodMarketplaceHourlySnapshotFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodMarketplaceHourlySnapshotFilter>>>;
  orderBeans?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  orderBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  orderBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplaceFilter>;
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

export enum PodMarketplaceHourlySnapshotOrderBy {
  availableListedPods = 'availableListedPods',
  availableOrderBeans = 'availableOrderBeans',
  beanVolume = 'beanVolume',
  cancelledListedPods = 'cancelledListedPods',
  cancelledOrderBeans = 'cancelledOrderBeans',
  createdAt = 'createdAt',
  deltaAvailableListedPods = 'deltaAvailableListedPods',
  deltaAvailableOrderBeans = 'deltaAvailableOrderBeans',
  deltaBeanVolume = 'deltaBeanVolume',
  deltaCancelledListedPods = 'deltaCancelledListedPods',
  deltaCancelledOrderBeans = 'deltaCancelledOrderBeans',
  deltaExpiredListedPods = 'deltaExpiredListedPods',
  deltaFilledListedPods = 'deltaFilledListedPods',
  deltaFilledOrderBeans = 'deltaFilledOrderBeans',
  deltaFilledOrderedPods = 'deltaFilledOrderedPods',
  deltaListedPods = 'deltaListedPods',
  deltaOrderBeans = 'deltaOrderBeans',
  deltaPodVolume = 'deltaPodVolume',
  expiredListedPods = 'expiredListedPods',
  filledListedPods = 'filledListedPods',
  filledOrderBeans = 'filledOrderBeans',
  filledOrderedPods = 'filledOrderedPods',
  id = 'id',
  listedPods = 'listedPods',
  orderBeans = 'orderBeans',
  podMarketplace = 'podMarketplace',
  podMarketplace__availableListedPods = 'podMarketplace__availableListedPods',
  podMarketplace__availableOrderBeans = 'podMarketplace__availableOrderBeans',
  podMarketplace__beanVolume = 'podMarketplace__beanVolume',
  podMarketplace__cancelledListedPods = 'podMarketplace__cancelledListedPods',
  podMarketplace__cancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  podMarketplace__expiredListedPods = 'podMarketplace__expiredListedPods',
  podMarketplace__filledListedPods = 'podMarketplace__filledListedPods',
  podMarketplace__filledOrderBeans = 'podMarketplace__filledOrderBeans',
  podMarketplace__filledOrderedPods = 'podMarketplace__filledOrderedPods',
  podMarketplace__id = 'podMarketplace__id',
  podMarketplace__lastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  podMarketplace__lastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  podMarketplace__listedPods = 'podMarketplace__listedPods',
  podMarketplace__orderBeans = 'podMarketplace__orderBeans',
  podMarketplace__podVolume = 'podMarketplace__podVolume',
  podMarketplace__season = 'podMarketplace__season',
  podVolume = 'podVolume',
  season = 'season',
  updatedAt = 'updatedAt'
}

export type PodMarketplaceFilter = {
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
  allListings_?: InputMaybe<PodListingFilter>;
  allOrders_?: InputMaybe<PodOrderFilter>;
  and?: InputMaybe<Array<InputMaybe<PodMarketplaceFilter>>>;
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
  dailySnapshots_?: InputMaybe<PodMarketplaceDailySnapshotFilter>;
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
  fills_?: InputMaybe<PodFillFilter>;
  hourlySnapshots_?: InputMaybe<PodMarketplaceHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<PodMarketplaceFilter>>>;
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

export enum PodMarketplaceOrderBy {
  activeListings = 'activeListings',
  activeOrders = 'activeOrders',
  allListings = 'allListings',
  allOrders = 'allOrders',
  availableListedPods = 'availableListedPods',
  availableOrderBeans = 'availableOrderBeans',
  beanVolume = 'beanVolume',
  cancelledListedPods = 'cancelledListedPods',
  cancelledOrderBeans = 'cancelledOrderBeans',
  dailySnapshots = 'dailySnapshots',
  expiredListedPods = 'expiredListedPods',
  filledListedPods = 'filledListedPods',
  filledOrderBeans = 'filledOrderBeans',
  filledOrderedPods = 'filledOrderedPods',
  fills = 'fills',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  listedPods = 'listedPods',
  orderBeans = 'orderBeans',
  podVolume = 'podVolume',
  season = 'season'
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
   */
  beanAmount: Scalars['BigInt']['output'];
  /**
   * The current number of Beans spent to acquire Pods.
   *
   * Increases during each subsequent Fill:
   * `0 <= beanAmountFilled <= beanAmount`
   *
   * Upon PodOrder cancellation, this value is locked.
   */
  beanAmountFilled: Scalars['BigInt']['output'];
  /** Timestamp of PodOrder creation. */
  createdAt: Scalars['BigInt']['output'];
  /** Transaction hash when this PodOrder entity was created. */
  creationHash: Scalars['Bytes']['output'];
  /** The Farmer that created the Pod Order. */
  farmer: Farmer;
  /** Numeric identifier of the field for this order */
  fieldId: Scalars['BigInt']['output'];
  /** All Fills associated with this PodOrder. */
  fills: Array<PodFill>;
  /** Historical ID for joins: `{account}-{createdAt}` */
  historyID: Scalars['String']['output'];
  /**
   * The PodOrder ID matchces the `id` stored on-chain:
   *
   * `keccak256(abi.encodePacked(account, pricePerPod, maxPlaceInLine, minFillAmount))`
   */
  id: Scalars['ID']['output'];
  /**
   * The Farmer is willing to buy any Pod that is before maxPlaceInLine at pricePerPod.
   * As the Pod Line moves, this value stays the same because new Pods meet the criteria.
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
   */
  pricingFunction?: Maybe<Scalars['Bytes']['output']>;
  /**
   * The Pricing Type states whether this PodOrder uses FIXED or DYNAMIC pricing.
   *
   * null = V1 FIXED  = use `pricePerPod`
   * 0    = V2 FIXED  = use `pricePerPod`
   * 1    = V2 DYNAMIC = use `pricingFunction`
   */
  pricingType?: Maybe<Scalars['Int']['output']>;
  /** Current status of order. */
  status: MarketStatus;
  /** Timestamp of last PodOrder update. Changes when a PodOrder is Filled or Cancelled. */
  updatedAt: Scalars['BigInt']['output'];
};


export type PodOrderFillsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFillOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PodFillFilter>;
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

export type PodOrderCancelledFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodOrderCancelledFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodOrderCancelledFilter>>>;
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

export enum PodOrderCancelledOrderBy {
  account = 'account',
  blockNumber = 'blockNumber',
  createdAt = 'createdAt',
  hash = 'hash',
  historyID = 'historyID',
  id = 'id',
  logIndex = 'logIndex',
  orderId = 'orderId'
}

export type PodOrderCreated = MarketplaceEvent & {
  __typename?: 'PodOrderCreated';
  /** Account creating the listing */
  account: Scalars['Bytes']['output'];
  /**
   * The represented value emitted with this event changed with BIP-29 at block 15277986
   * Pre  BIP-29: The number of pods ordered is emitted
   * Post BIP-29: The number of beans supplied for the order is emitted.
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

export type PodOrderCreatedFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodOrderCreatedFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodOrderCreatedFilter>>>;
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

export enum PodOrderCreatedOrderBy {
  account = 'account',
  amount = 'amount',
  blockNumber = 'blockNumber',
  createdAt = 'createdAt',
  hash = 'hash',
  historyID = 'historyID',
  id = 'id',
  logIndex = 'logIndex',
  maxPlaceInLine = 'maxPlaceInLine',
  orderId = 'orderId',
  pricePerPod = 'pricePerPod',
  pricingFunction = 'pricingFunction',
  pricingType = 'pricingType'
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

export type PodOrderFilledFilter = {
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
  and?: InputMaybe<Array<InputMaybe<PodOrderFilledFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PodOrderFilledFilter>>>;
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

export enum PodOrderFilledOrderBy {
  amount = 'amount',
  blockNumber = 'blockNumber',
  costInBeans = 'costInBeans',
  createdAt = 'createdAt',
  fromFarmer = 'fromFarmer',
  hash = 'hash',
  historyID = 'historyID',
  id = 'id',
  index = 'index',
  logIndex = 'logIndex',
  placeInLine = 'placeInLine',
  start = 'start',
  toFarmer = 'toFarmer'
}

export type PodOrderFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PodOrderFilter>>>;
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
  farmer_?: InputMaybe<FarmerFilter>;
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
  fieldId?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fieldId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not?: InputMaybe<Scalars['BigInt']['input']>;
  fieldId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fills?: InputMaybe<Array<Scalars['String']['input']>>;
  fills_?: InputMaybe<PodFillFilter>;
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
  or?: InputMaybe<Array<InputMaybe<PodOrderFilter>>>;
  podAmountFilled?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_gt?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_gte?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podAmountFilled_lt?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_lte?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_not?: InputMaybe<Scalars['BigInt']['input']>;
  podAmountFilled_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  podMarketplace?: InputMaybe<Scalars['String']['input']>;
  podMarketplace_?: InputMaybe<PodMarketplaceFilter>;
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

export enum PodOrderOrderBy {
  beanAmount = 'beanAmount',
  beanAmountFilled = 'beanAmountFilled',
  createdAt = 'createdAt',
  creationHash = 'creationHash',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  fieldId = 'fieldId',
  fills = 'fills',
  historyID = 'historyID',
  id = 'id',
  maxPlaceInLine = 'maxPlaceInLine',
  minFillAmount = 'minFillAmount',
  podAmountFilled = 'podAmountFilled',
  podMarketplace = 'podMarketplace',
  podMarketplace__availableListedPods = 'podMarketplace__availableListedPods',
  podMarketplace__availableOrderBeans = 'podMarketplace__availableOrderBeans',
  podMarketplace__beanVolume = 'podMarketplace__beanVolume',
  podMarketplace__cancelledListedPods = 'podMarketplace__cancelledListedPods',
  podMarketplace__cancelledOrderBeans = 'podMarketplace__cancelledOrderBeans',
  podMarketplace__expiredListedPods = 'podMarketplace__expiredListedPods',
  podMarketplace__filledListedPods = 'podMarketplace__filledListedPods',
  podMarketplace__filledOrderBeans = 'podMarketplace__filledOrderBeans',
  podMarketplace__filledOrderedPods = 'podMarketplace__filledOrderedPods',
  podMarketplace__id = 'podMarketplace__id',
  podMarketplace__lastDailySnapshotDay = 'podMarketplace__lastDailySnapshotDay',
  podMarketplace__lastHourlySnapshotSeason = 'podMarketplace__lastHourlySnapshotSeason',
  podMarketplace__listedPods = 'podMarketplace__listedPods',
  podMarketplace__orderBeans = 'podMarketplace__orderBeans',
  podMarketplace__podVolume = 'podMarketplace__podVolume',
  podMarketplace__season = 'podMarketplace__season',
  pricePerPod = 'pricePerPod',
  pricingFunction = 'pricingFunction',
  pricingType = 'pricingType',
  status = 'status',
  updatedAt = 'updatedAt'
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

export type PrevFarmerGerminatingEventFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PrevFarmerGerminatingEventFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PrevFarmerGerminatingEventFilter>>>;
};

export enum PrevFarmerGerminatingEventOrderBy {
  deltaGerminatingStalk = 'deltaGerminatingStalk',
  eventBlock = 'eventBlock',
  id = 'id',
  logIndex = 'logIndex'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<Meta>;
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
  gaugesInfo?: Maybe<GaugesInfo>;
  gaugesInfoDailySnapshot?: Maybe<GaugesInfoDailySnapshot>;
  gaugesInfoDailySnapshots: Array<GaugesInfoDailySnapshot>;
  gaugesInfoHourlySnapshot?: Maybe<GaugesInfoHourlySnapshot>;
  gaugesInfoHourlySnapshots: Array<GaugesInfoHourlySnapshot>;
  gaugesInfos: Array<GaugesInfo>;
  germinating?: Maybe<Germinating>;
  germinatings: Array<Germinating>;
  marketPerformanceSeasonal?: Maybe<MarketPerformanceSeasonal>;
  marketPerformanceSeasonals: Array<MarketPerformanceSeasonal>;
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
  tokenYield?: Maybe<TokenYield>;
  tokenYields: Array<TokenYield>;
  tractor?: Maybe<Tractor>;
  tractorDailySnapshot?: Maybe<TractorDailySnapshot>;
  tractorDailySnapshots: Array<TractorDailySnapshot>;
  tractorHourlySnapshot?: Maybe<TractorHourlySnapshot>;
  tractorHourlySnapshots: Array<TractorHourlySnapshot>;
  tractorReward?: Maybe<TractorReward>;
  tractorRewards: Array<TractorReward>;
  tractors: Array<Tractor>;
  unripeToken?: Maybe<UnripeToken>;
  unripeTokenDailySnapshot?: Maybe<UnripeTokenDailySnapshot>;
  unripeTokenDailySnapshots: Array<UnripeTokenDailySnapshot>;
  unripeTokenHourlySnapshot?: Maybe<UnripeTokenHourlySnapshot>;
  unripeTokenHourlySnapshots: Array<UnripeTokenHourlySnapshot>;
  unripeTokens: Array<UnripeToken>;
  version?: Maybe<Version>;
  versions: Array<Version>;
  wellPlenties: Array<WellPlenty>;
  wellPlenty?: Maybe<WellPlenty>;
  whitelistTokenDailySnapshot?: Maybe<WhitelistTokenDailySnapshot>;
  whitelistTokenDailySnapshots: Array<WhitelistTokenDailySnapshot>;
  whitelistTokenHourlySnapshot?: Maybe<WhitelistTokenHourlySnapshot>;
  whitelistTokenHourlySnapshots: Array<WhitelistTokenHourlySnapshot>;
  whitelistTokenSetting?: Maybe<WhitelistTokenSetting>;
  whitelistTokenSettings: Array<WhitelistTokenSetting>;
  wrappedDepositERC20?: Maybe<WrappedDepositErc20>;
  wrappedDepositERC20DailySnapshot?: Maybe<WrappedDepositErc20DailySnapshot>;
  wrappedDepositERC20DailySnapshots: Array<WrappedDepositErc20DailySnapshot>;
  wrappedDepositERC20HourlySnapshot?: Maybe<WrappedDepositErc20HourlySnapshot>;
  wrappedDepositERC20HourlySnapshots: Array<WrappedDepositErc20HourlySnapshot>;
  wrappedDepositERC20S: Array<WrappedDepositErc20>;
};


export type QueryMetaArgs = {
  block?: InputMaybe<BlockHeight>;
};


export type QueryBeanstalkArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryBeanstalksArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BeanstalkOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<BeanstalkFilter>;
};


export type QueryChopArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryChopsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ChopOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ChopFilter>;
};


export type QueryFarmerArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFarmersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FarmerOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FarmerFilter>;
};


export type QueryFertilizerArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFertilizerBalanceArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFertilizerBalancesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerBalanceOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FertilizerBalanceFilter>;
};


export type QueryFertilizerTokenArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFertilizerTokensArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerTokenOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FertilizerTokenFilter>;
};


export type QueryFertilizerYieldArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFertilizerYieldsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerYieldOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FertilizerYieldFilter>;
};


export type QueryFertilizersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FertilizerOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FertilizerFilter>;
};


export type QueryFieldArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFieldDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFieldDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FieldDailySnapshotFilter>;
};


export type QueryFieldHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryFieldHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FieldHourlySnapshotFilter>;
};


export type QueryFieldsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FieldOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<FieldFilter>;
};


export type QueryGaugesInfoArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryGaugesInfoDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryGaugesInfoDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugesInfoDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<GaugesInfoDailySnapshotFilter>;
};


export type QueryGaugesInfoHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryGaugesInfoHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugesInfoHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<GaugesInfoHourlySnapshotFilter>;
};


export type QueryGaugesInfosArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugesInfoOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<GaugesInfoFilter>;
};


export type QueryGerminatingArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryGerminatingsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GerminatingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<GerminatingFilter>;
};


export type QueryMarketPerformanceSeasonalArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryMarketPerformanceSeasonalsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketPerformanceSeasonalOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<MarketPerformanceSeasonalFilter>;
};


export type QueryMarketplaceEventArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryMarketplaceEventsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketplaceEventOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<MarketplaceEventFilter>;
};


export type QueryPlotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPlotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PlotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PlotFilter>;
};


export type QueryPodFillArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodFillsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodFillOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodFillFilter>;
};


export type QueryPodListingArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodListingCancelledArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodListingCancelledsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingCancelledOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodListingCancelledFilter>;
};


export type QueryPodListingCreatedArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodListingCreatedsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingCreatedOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodListingCreatedFilter>;
};


export type QueryPodListingFilledArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodListingFilledsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingFilledOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodListingFilledFilter>;
};


export type QueryPodListingsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodListingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodListingFilter>;
};


export type QueryPodMarketplaceArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodMarketplaceDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodMarketplaceDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodMarketplaceDailySnapshotFilter>;
};


export type QueryPodMarketplaceHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodMarketplaceHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodMarketplaceHourlySnapshotFilter>;
};


export type QueryPodMarketplacesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodMarketplaceOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodMarketplaceFilter>;
};


export type QueryPodOrderArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodOrderCancelledArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodOrderCancelledsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderCancelledOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodOrderCancelledFilter>;
};


export type QueryPodOrderCreatedArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodOrderCreatedsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderCreatedOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodOrderCreatedFilter>;
};


export type QueryPodOrderFilledArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPodOrderFilledsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderFilledOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodOrderFilledFilter>;
};


export type QueryPodOrdersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PodOrderOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PodOrderFilter>;
};


export type QueryPrevFarmerGerminatingEventArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryPrevFarmerGerminatingEventsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PrevFarmerGerminatingEventOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<PrevFarmerGerminatingEventFilter>;
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


export type QuerySiloArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloAssetArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloAssetDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloAssetDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloAssetDailySnapshotFilter>;
};


export type QuerySiloAssetHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloAssetHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloAssetHourlySnapshotFilter>;
};


export type QuerySiloAssetsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloAssetFilter>;
};


export type QuerySiloDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloDailySnapshotFilter>;
};


export type QuerySiloDepositArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloDepositsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDepositOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloDepositFilter>;
};


export type QuerySiloHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloHourlySnapshotFilter>;
};


export type QuerySiloWithdrawArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloWithdrawsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloWithdrawOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloWithdrawFilter>;
};


export type QuerySiloYieldArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySiloYieldsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloYieldOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloYieldFilter>;
};


export type QuerySilosArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SiloFilter>;
};


export type QueryTokenYieldArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTokenYieldsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenYieldOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TokenYieldFilter>;
};


export type QueryTractorArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTractorDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTractorDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TractorDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TractorDailySnapshotFilter>;
};


export type QueryTractorHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTractorHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TractorHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TractorHourlySnapshotFilter>;
};


export type QueryTractorRewardArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTractorRewardsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TractorRewardOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TractorRewardFilter>;
};


export type QueryTractorsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TractorOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TractorFilter>;
};


export type QueryUnripeTokenArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryUnripeTokenDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryUnripeTokenDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<UnripeTokenDailySnapshotFilter>;
};


export type QueryUnripeTokenHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryUnripeTokenHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<UnripeTokenHourlySnapshotFilter>;
};


export type QueryUnripeTokensArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<UnripeTokenFilter>;
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


export type QueryWellPlentiesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WellPlentyOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<WellPlentyFilter>;
};


export type QueryWellPlentyArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryWhitelistTokenDailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryWhitelistTokenDailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<WhitelistTokenDailySnapshotFilter>;
};


export type QueryWhitelistTokenHourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryWhitelistTokenHourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<WhitelistTokenHourlySnapshotFilter>;
};


export type QueryWhitelistTokenSettingArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryWhitelistTokenSettingsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenSettingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<WhitelistTokenSettingFilter>;
};


export type QueryWrappedDepositErc20Args = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryWrappedDepositErc20DailySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryWrappedDepositErc20DailySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDepositErc20DailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<WrappedDepositErc20DailySnapshotFilter>;
};


export type QueryWrappedDepositErc20HourlySnapshotArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryWrappedDepositErc20HourlySnapshotsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDepositErc20HourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<WrappedDepositErc20HourlySnapshotFilter>;
};


export type QueryWrappedDepositErc20SArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDepositErc20OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<WrappedDepositErc20Filter>;
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
  /** Delta of beans */
  deltaBeans: Scalars['BigInt']['output'];
  /** Amount of beans minted to the Field due to the flood */
  floodFieldBeans: Scalars['BigInt']['output'];
  /** Amount of beans minted to the Silo due to the flood */
  floodSiloBeans: Scalars['BigInt']['output'];
  /** Season Number */
  id: Scalars['ID']['output'];
  /** Amount of Beans paid to sunrise caller */
  incentiveBeans: Scalars['BigInt']['output'];
  /** Bean Market Cap */
  marketCap: Scalars['BigDecimal']['output'];
  /** Price of BEAN during sunrise */
  price: Scalars['BigDecimal']['output'];
  /** Boolean indicating whether the system is currently raining */
  raining: Scalars['Boolean']['output'];
  /** Amount of Beans minted during sunrise from TWA. Does not include flood mints */
  rewardBeans: Scalars['BigInt']['output'];
  /** Season number in Int form for sorting */
  season: Scalars['Int']['output'];
  /** Block in which the season start was triggered by the sunrise call */
  sunriseBlock: Scalars['BigInt']['output'];
  /** Beans from L1 which have not migrated yet */
  unmigratedL1Beans?: Maybe<Scalars['BigInt']['output']>;
};

export type SeasonFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SeasonFilter>>>;
  beans?: InputMaybe<Scalars['BigInt']['input']>;
  beans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  beans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  beans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  beans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  beans_not?: InputMaybe<Scalars['BigInt']['input']>;
  beans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_?: InputMaybe<BeanstalkFilter>;
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
  floodFieldBeans?: InputMaybe<Scalars['BigInt']['input']>;
  floodFieldBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  floodFieldBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  floodFieldBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  floodFieldBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  floodFieldBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  floodFieldBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  floodFieldBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  floodSiloBeans?: InputMaybe<Scalars['BigInt']['input']>;
  floodSiloBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  floodSiloBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  floodSiloBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  floodSiloBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  floodSiloBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  floodSiloBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  floodSiloBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<SeasonFilter>>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  raining?: InputMaybe<Scalars['Boolean']['input']>;
  raining_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  raining_not?: InputMaybe<Scalars['Boolean']['input']>;
  raining_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
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

export enum SeasonOrderBy {
  beans = 'beans',
  beanstalk = 'beanstalk',
  beanstalk__fertilizer1155 = 'beanstalk__fertilizer1155',
  beanstalk__id = 'beanstalk__id',
  beanstalk__lastSeason = 'beanstalk__lastSeason',
  beanstalk__token = 'beanstalk__token',
  createdAt = 'createdAt',
  deltaB = 'deltaB',
  deltaBeans = 'deltaBeans',
  floodFieldBeans = 'floodFieldBeans',
  floodSiloBeans = 'floodSiloBeans',
  id = 'id',
  incentiveBeans = 'incentiveBeans',
  marketCap = 'marketCap',
  price = 'price',
  raining = 'raining',
  rewardBeans = 'rewardBeans',
  season = 'season',
  sunriseBlock = 'sunriseBlock',
  unmigratedL1Beans = 'unmigratedL1Beans'
}

export type Silo = {
  __typename?: 'Silo';
  /** (protocol) Current number of active farmers deposited in the silo */
  activeFarmers: Scalars['Int']['output'];
  /** (protocol) Tokens in the order they were whitelisted for deposit. This list never shrinks. */
  allWhitelistedTokens: Array<Scalars['Bytes']['output']>;
  /** Link to all silo assets currently associated with this silo */
  assets: Array<SiloAsset>;
  /** Average convert down penalty that has been assessed, in percent */
  avgConvertDownPenalty: Scalars['BigDecimal']['output'];
  /** (protocol) Value emitted by UpdateAverageStalkPerBdvPerSeason event */
  avgGrownStalkPerBdvPerSeason: Scalars['BigInt']['output'];
  /** (protocol) Cumulative total for bean mints sent to the silo */
  beanMints: Scalars['BigInt']['output'];
  /** (protocol) [Seed Gauge] Current target ratio of Bean to LP deposits */
  beanToMaxLpGpPerBdvRatio: Scalars['BigInt']['output'];
  /** 'beanstalk' */
  beanstalk: Beanstalk;
  /** Total grown stalk gained via the Convert Up Bonus */
  bonusStalkConvertUp: Scalars['BigInt']['output'];
  /** (protocol) PI-7 Convert down penalty */
  convertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  /** (protocol) [Seed Gauge] Measures the difference in seeds of Bean and the max LP; can be derived from beanToMaxLpGpPerBdvRatio */
  cropRatio: Scalars['BigDecimal']['output'];
  /** Link to daily snapshot data */
  dailySnapshots: Array<SiloDailySnapshot>;
  /** Current BDV of all deposited assets */
  depositedBDV: Scalars['BigInt']['output'];
  /** (protocol) Tokens that have been removed from the silo deposit whitelist */
  dewhitelistedTokens: Array<Scalars['Bytes']['output']>;
  /** Farmer address if applicable */
  farmer?: Maybe<Farmer>;
  /** [Seed Gauge] Stalk that is currently Germinating */
  germinatingStalk: Scalars['BigInt']['output'];
  /** (protocol) Current grown stalk per season according to avgGrownStalkPerBdvPerSeason */
  grownStalkPerSeason: Scalars['BigInt']['output'];
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<SiloHourlySnapshot>;
  /** Address for the farmer or Beanstalk contract */
  id: Scalars['Bytes']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** (protocol) Market performance for each season */
  marketPerformanceSeasonals: Array<MarketPerformanceSeasonal>;
  /** Total stalk amount that has been penalized by the convert down penalty */
  penalizedStalkConvertDown: Scalars['BigInt']['output'];
  /** (protocol) Current plantable stalk for bean seigniorage not yet claimed */
  plantableStalk: Scalars['BigInt']['output'];
  /** Cumulative total of beans that have been Planted */
  plantedBeans: Scalars['BigInt']['output'];
  /** Current roots balance */
  roots: Scalars['BigInt']['output'];
  /** Current stalk balance */
  stalk: Scalars['BigInt']['output'];
  /** Total BDV converted up regardless of receiving a bonus. (!) This value accumulates only when the Convert Up Bonus (gauge id 2) is active. */
  totalBdvConvertUp: Scalars['BigInt']['output'];
  /** Total BDV converted up that was awarded the bonus */
  totalBdvConvertUpBonus: Scalars['BigInt']['output'];
  /** (protocol) Deposited BDV from L1 which has not migrated yet */
  unmigratedL1DepositedBdv?: Maybe<Scalars['BigInt']['output']>;
  /** Total amount of stalk that was not penalized during the application of a down convert penalty. Needed to compute the avg penalty rate */
  unpenalizedStalkConvertDown: Scalars['BigInt']['output'];
  /** (protocol) Tokens whitelisted for deposit within the silo */
  whitelistedTokens: Array<Scalars['Bytes']['output']>;
};


export type SiloAssetsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloAssetFilter>;
};


export type SiloDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloDailySnapshotFilter>;
};


export type SiloHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloHourlySnapshotFilter>;
};


export type SiloMarketPerformanceSeasonalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MarketPerformanceSeasonalOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MarketPerformanceSeasonalFilter>;
};

export type SiloAsset = {
  __typename?: 'SiloAsset';
  /** Link to daily snapshot data */
  dailySnapshots: Array<SiloAssetDailySnapshot>;
  /** Current Token amount of deposits */
  depositedAmount: Scalars['BigInt']['output'];
  /** Current BDV of deposits */
  depositedBDV: Scalars['BigInt']['output'];
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
  orderBy?: InputMaybe<SiloAssetDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloAssetDailySnapshotFilter>;
};


export type SiloAssetHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SiloAssetHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SiloAssetHourlySnapshotFilter>;
};

export type SiloAssetDailySnapshot = {
  __typename?: 'SiloAssetDailySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaDepositedAmount: Scalars['BigInt']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaWithdrawnAmount: Scalars['BigInt']['output'];
  /** Point in time current Token amount of deposits */
  depositedAmount: Scalars['BigInt']['output'];
  /** Point in time current BDV of deposits */
  depositedBDV: Scalars['BigInt']['output'];
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

export type SiloAssetDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloAssetDailySnapshotFilter>>>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloAssetDailySnapshotFilter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloAsset?: InputMaybe<Scalars['String']['input']>;
  siloAsset_?: InputMaybe<SiloAssetFilter>;
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

export enum SiloAssetDailySnapshotOrderBy {
  createdAt = 'createdAt',
  deltaDepositedAmount = 'deltaDepositedAmount',
  deltaDepositedBDV = 'deltaDepositedBDV',
  deltaWithdrawnAmount = 'deltaWithdrawnAmount',
  depositedAmount = 'depositedAmount',
  depositedBDV = 'depositedBDV',
  id = 'id',
  season = 'season',
  siloAsset = 'siloAsset',
  siloAsset__depositedAmount = 'siloAsset__depositedAmount',
  siloAsset__depositedBDV = 'siloAsset__depositedBDV',
  siloAsset__id = 'siloAsset__id',
  siloAsset__lastDailySnapshotDay = 'siloAsset__lastDailySnapshotDay',
  siloAsset__lastHourlySnapshotSeason = 'siloAsset__lastHourlySnapshotSeason',
  siloAsset__token = 'siloAsset__token',
  siloAsset__withdrawnAmount = 'siloAsset__withdrawnAmount',
  updatedAt = 'updatedAt',
  withdrawnAmount = 'withdrawnAmount'
}

export type SiloAssetHourlySnapshot = {
  __typename?: 'SiloAssetHourlySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaDepositedAmount: Scalars['BigInt']['output'];
  deltaDepositedBDV: Scalars['BigInt']['output'];
  deltaWithdrawnAmount: Scalars['BigInt']['output'];
  /** Point in time current Token amount of deposits */
  depositedAmount: Scalars['BigInt']['output'];
  /** Point in time current BDV of deposits */
  depositedBDV: Scalars['BigInt']['output'];
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

export type SiloAssetHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloAssetHourlySnapshotFilter>>>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SiloAssetHourlySnapshotFilter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloAsset?: InputMaybe<Scalars['String']['input']>;
  siloAsset_?: InputMaybe<SiloAssetFilter>;
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

export enum SiloAssetHourlySnapshotOrderBy {
  createdAt = 'createdAt',
  deltaDepositedAmount = 'deltaDepositedAmount',
  deltaDepositedBDV = 'deltaDepositedBDV',
  deltaWithdrawnAmount = 'deltaWithdrawnAmount',
  depositedAmount = 'depositedAmount',
  depositedBDV = 'depositedBDV',
  id = 'id',
  season = 'season',
  siloAsset = 'siloAsset',
  siloAsset__depositedAmount = 'siloAsset__depositedAmount',
  siloAsset__depositedBDV = 'siloAsset__depositedBDV',
  siloAsset__id = 'siloAsset__id',
  siloAsset__lastDailySnapshotDay = 'siloAsset__lastDailySnapshotDay',
  siloAsset__lastHourlySnapshotSeason = 'siloAsset__lastHourlySnapshotSeason',
  siloAsset__token = 'siloAsset__token',
  siloAsset__withdrawnAmount = 'siloAsset__withdrawnAmount',
  updatedAt = 'updatedAt',
  withdrawnAmount = 'withdrawnAmount'
}

export type SiloAssetFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloAssetFilter>>>;
  dailySnapshots_?: InputMaybe<SiloAssetDailySnapshotFilter>;
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
  hourlySnapshots_?: InputMaybe<SiloAssetHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<SiloAssetFilter>>>;
  silo?: InputMaybe<Scalars['String']['input']>;
  silo_?: InputMaybe<SiloFilter>;
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

export enum SiloAssetOrderBy {
  dailySnapshots = 'dailySnapshots',
  depositedAmount = 'depositedAmount',
  depositedBDV = 'depositedBDV',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  token = 'token',
  withdrawnAmount = 'withdrawnAmount'
}

export type SiloDailySnapshot = {
  __typename?: 'SiloDailySnapshot';
  /** Point in time active farmers */
  activeFarmers: Scalars['Int']['output'];
  /** Average convert down penalty that has been assessed, in percent. 20.5 = 20.5% */
  avgConvertDownPenalty: Scalars['BigDecimal']['output'];
  /** Point in time average grown stalk per bdv per season */
  avgGrownStalkPerBdvPerSeason: Scalars['BigInt']['output'];
  /** Point in time cumulative total for bean mints sent to the silo */
  beanMints: Scalars['BigInt']['output'];
  /** [Seed Gauge] Current target ratio of Bean to LP deposits */
  beanToMaxLpGpPerBdvRatio: Scalars['BigInt']['output'];
  /** Point in time total grown stalk gained via the Convert Up Bonus */
  bonusStalkConvertUp: Scalars['BigInt']['output'];
  /** Point in time PI-7 convert down penalty) */
  convertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** [Seed Gauge] Measures the difference in seeds of Bean and the max LP; can be derived from beanToMaxLpGpPerBdvRatio */
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
  /** Point in time current BDV of all deposited assets */
  depositedBDV: Scalars['BigInt']['output'];
  /** [Seed Gauge] Stalk that is currently Germinating */
  germinatingStalk: Scalars['BigInt']['output'];
  /** Point in time grown stalk per season */
  grownStalkPerSeason: Scalars['BigInt']['output'];
  /** ID of silo - Day */
  id: Scalars['ID']['output'];
  /** Point in time total stalk that has been penalized by the convert down penalty */
  penalizedStalkConvertDown: Scalars['BigInt']['output'];
  /** Point in time current plantable stalk for bean seigniorage not yet claimed (only set on protocol-level Silo) */
  plantableStalk: Scalars['BigInt']['output'];
  /** Point in time total of beans that have been Planted */
  plantedBeans: Scalars['BigInt']['output'];
  /** Point in time current roots balance */
  roots: Scalars['BigInt']['output'];
  /** Last season for the snapshot */
  season: Scalars['Int']['output'];
  /** Silo associated with the snapshot */
  silo: Silo;
  /** Point in time current stalk balance */
  stalk: Scalars['BigInt']['output'];
  /** Point in time total BDV converted up regardless of receiving a bonus. (!) This value accumulates only when the Convert Up Bonus (gauge id 2) is active. */
  totalBdvConvertUp: Scalars['BigInt']['output'];
  /** Point in time total BDV converted up that was awarded the bonus */
  totalBdvConvertUpBonus: Scalars['BigInt']['output'];
  /** Point in time totalstalk that was not penalized during the application of a down convert penalty */
  unpenalizedStalkConvertDown: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type SiloDailySnapshotFilter = {
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
  and?: InputMaybe<Array<InputMaybe<SiloDailySnapshotFilter>>>;
  avgConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  avgConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  avgGrownStalkPerBdvPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  avgGrownStalkPerBdvPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  bonusStalkConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bonusStalkConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cropRatio?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cropRatio_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaActiveFarmers?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaActiveFarmers_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaAvgConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaAvgConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaAvgGrownStalkPerBdvPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvgGrownStalkPerBdvPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanMints?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanMints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanToMaxLpGpPerBdvRatio?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanToMaxLpGpPerBdvRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBonusStalkConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBonusStalkConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCropRatio?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCropRatio_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  deltaPenalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPenalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  deltaTotalBdvConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBdvConvertUpBonus_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBdvConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBdvConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnpenalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnpenalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<SiloDailySnapshotFilter>>>;
  penalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  penalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  silo_?: InputMaybe<SiloFilter>;
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
  totalBdvConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUpBonus_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unpenalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unpenalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloDailySnapshotOrderBy {
  activeFarmers = 'activeFarmers',
  avgConvertDownPenalty = 'avgConvertDownPenalty',
  avgGrownStalkPerBdvPerSeason = 'avgGrownStalkPerBdvPerSeason',
  beanMints = 'beanMints',
  beanToMaxLpGpPerBdvRatio = 'beanToMaxLpGpPerBdvRatio',
  bonusStalkConvertUp = 'bonusStalkConvertUp',
  convertDownPenalty = 'convertDownPenalty',
  createdAt = 'createdAt',
  cropRatio = 'cropRatio',
  deltaActiveFarmers = 'deltaActiveFarmers',
  deltaAvgConvertDownPenalty = 'deltaAvgConvertDownPenalty',
  deltaAvgGrownStalkPerBdvPerSeason = 'deltaAvgGrownStalkPerBdvPerSeason',
  deltaBeanMints = 'deltaBeanMints',
  deltaBeanToMaxLpGpPerBdvRatio = 'deltaBeanToMaxLpGpPerBdvRatio',
  deltaBonusStalkConvertUp = 'deltaBonusStalkConvertUp',
  deltaConvertDownPenalty = 'deltaConvertDownPenalty',
  deltaCropRatio = 'deltaCropRatio',
  deltaDepositedBDV = 'deltaDepositedBDV',
  deltaGerminatingStalk = 'deltaGerminatingStalk',
  deltaGrownStalkPerSeason = 'deltaGrownStalkPerSeason',
  deltaPenalizedStalkConvertDown = 'deltaPenalizedStalkConvertDown',
  deltaPlantableStalk = 'deltaPlantableStalk',
  deltaPlantedBeans = 'deltaPlantedBeans',
  deltaRoots = 'deltaRoots',
  deltaStalk = 'deltaStalk',
  deltaTotalBdvConvertUp = 'deltaTotalBdvConvertUp',
  deltaTotalBdvConvertUpBonus = 'deltaTotalBdvConvertUpBonus',
  deltaUnpenalizedStalkConvertDown = 'deltaUnpenalizedStalkConvertDown',
  depositedBDV = 'depositedBDV',
  germinatingStalk = 'germinatingStalk',
  grownStalkPerSeason = 'grownStalkPerSeason',
  id = 'id',
  penalizedStalkConvertDown = 'penalizedStalkConvertDown',
  plantableStalk = 'plantableStalk',
  plantedBeans = 'plantedBeans',
  roots = 'roots',
  season = 'season',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  stalk = 'stalk',
  totalBdvConvertUp = 'totalBdvConvertUp',
  totalBdvConvertUpBonus = 'totalBdvConvertUpBonus',
  unpenalizedStalkConvertDown = 'unpenalizedStalkConvertDown',
  updatedAt = 'updatedAt'
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
  /** Account - Token Address - Deposit Version - (Season|Stem) */
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

export type SiloDepositFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloDepositFilter>>>;
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
  farmer_?: InputMaybe<FarmerFilter>;
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
  or?: InputMaybe<Array<InputMaybe<SiloDepositFilter>>>;
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

export enum SiloDepositOrderBy {
  createdAt = 'createdAt',
  createdBlock = 'createdBlock',
  depositVersion = 'depositVersion',
  depositedAmount = 'depositedAmount',
  depositedBDV = 'depositedBDV',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  hashes = 'hashes',
  id = 'id',
  season = 'season',
  stem = 'stem',
  stemV31 = 'stemV31',
  token = 'token',
  updatedAt = 'updatedAt',
  updatedBlock = 'updatedBlock'
}

export type SiloHourlySnapshot = {
  __typename?: 'SiloHourlySnapshot';
  /** Point in time active farmers */
  activeFarmers: Scalars['Int']['output'];
  /** Average convert down penalty that has been assessed, in percent. 20.5 = 20.5% */
  avgConvertDownPenalty: Scalars['BigDecimal']['output'];
  /** Point in time average grown stalk per bdv per season */
  avgGrownStalkPerBdvPerSeason: Scalars['BigInt']['output'];
  /** Point in time cumulative total for bean mints sent to the silo */
  beanMints: Scalars['BigInt']['output'];
  /** [Seed Gauge] Target ratio of Bean to LP deposits */
  beanToMaxLpGpPerBdvRatio: Scalars['BigInt']['output'];
  /** Point in time total grown stalk gained via the Convert Up Bonus */
  bonusStalkConvertUp: Scalars['BigInt']['output'];
  /** [Seed Gauge] The caseId used in the seasonal adjustment of beanToMaxLpGpPerBdvRatio */
  caseId?: Maybe<Scalars['BigInt']['output']>;
  /** Point in time PI-7 convert down penalty) */
  convertDownPenalty?: Maybe<Scalars['BigDecimal']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** [Seed Gauge] Measures the difference in seeds of Bean and the max LP; can be derived from beanToMaxLpGpPerBdvRatio */
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
  /** Point in time current BDV of all deposited assets */
  depositedBDV: Scalars['BigInt']['output'];
  /** [Seed Gauge] Stalk that is currently Germinating */
  germinatingStalk: Scalars['BigInt']['output'];
  /** Point in time grown stalk per season */
  grownStalkPerSeason: Scalars['BigInt']['output'];
  /** ID of silo - Season */
  id: Scalars['ID']['output'];
  /** Point in time total stalk that has been penalized by the convert down penalty */
  penalizedStalkConvertDown: Scalars['BigInt']['output'];
  /** Point in time current plantable stalk for bean seigniorage not yet claimed (only set on protocol-level Silo) */
  plantableStalk: Scalars['BigInt']['output'];
  /** Point in time total of beans that have been Planted */
  plantedBeans: Scalars['BigInt']['output'];
  /** Point in time current roots balance */
  roots: Scalars['BigInt']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Silo associated with the snapshot */
  silo: Silo;
  /** Point in time current stalk balance */
  stalk: Scalars['BigInt']['output'];
  /** Point in time total BDV converted up regardless of receiving a bonus. (!) This value accumulates only when the Convert Up Bonus (gauge id 2) is active. */
  totalBdvConvertUp: Scalars['BigInt']['output'];
  /** Point in time total BDV converted up that was awarded the bonus */
  totalBdvConvertUpBonus: Scalars['BigInt']['output'];
  /** Point in time totalstalk that was not penalized during the application of a down convert penalty */
  unpenalizedStalkConvertDown: Scalars['BigInt']['output'];
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type SiloHourlySnapshotFilter = {
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
  and?: InputMaybe<Array<InputMaybe<SiloHourlySnapshotFilter>>>;
  avgConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  avgConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  avgGrownStalkPerBdvPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  avgGrownStalkPerBdvPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  bonusStalkConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bonusStalkConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caseId?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caseId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_not?: InputMaybe<Scalars['BigInt']['input']>;
  caseId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cropRatio?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cropRatio_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaActiveFarmers?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaActiveFarmers_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not?: InputMaybe<Scalars['Int']['input']>;
  deltaActiveFarmers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaAvgConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaAvgConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaAvgConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaAvgGrownStalkPerBdvPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaAvgGrownStalkPerBdvPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaAvgGrownStalkPerBdvPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanMints?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanMints_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanMints_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanToMaxLpGpPerBdvRatio?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBeanToMaxLpGpPerBdvRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBeanToMaxLpGpPerBdvRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBonusStalkConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaBonusStalkConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaBonusStalkConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCropRatio?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  deltaCropRatio_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  deltaCropRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  deltaPenalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPenalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPenalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaPlantedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaPlantedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  deltaTotalBdvConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBdvConvertUpBonus_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUpBonus_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBdvConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalBdvConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalBdvConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnpenalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaUnpenalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaUnpenalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<SiloHourlySnapshotFilter>>>;
  penalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  penalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  silo_?: InputMaybe<SiloFilter>;
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
  totalBdvConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUpBonus_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unpenalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unpenalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum SiloHourlySnapshotOrderBy {
  activeFarmers = 'activeFarmers',
  avgConvertDownPenalty = 'avgConvertDownPenalty',
  avgGrownStalkPerBdvPerSeason = 'avgGrownStalkPerBdvPerSeason',
  beanMints = 'beanMints',
  beanToMaxLpGpPerBdvRatio = 'beanToMaxLpGpPerBdvRatio',
  bonusStalkConvertUp = 'bonusStalkConvertUp',
  caseId = 'caseId',
  convertDownPenalty = 'convertDownPenalty',
  createdAt = 'createdAt',
  cropRatio = 'cropRatio',
  deltaActiveFarmers = 'deltaActiveFarmers',
  deltaAvgConvertDownPenalty = 'deltaAvgConvertDownPenalty',
  deltaAvgGrownStalkPerBdvPerSeason = 'deltaAvgGrownStalkPerBdvPerSeason',
  deltaBeanMints = 'deltaBeanMints',
  deltaBeanToMaxLpGpPerBdvRatio = 'deltaBeanToMaxLpGpPerBdvRatio',
  deltaBonusStalkConvertUp = 'deltaBonusStalkConvertUp',
  deltaConvertDownPenalty = 'deltaConvertDownPenalty',
  deltaCropRatio = 'deltaCropRatio',
  deltaDepositedBDV = 'deltaDepositedBDV',
  deltaGerminatingStalk = 'deltaGerminatingStalk',
  deltaGrownStalkPerSeason = 'deltaGrownStalkPerSeason',
  deltaPenalizedStalkConvertDown = 'deltaPenalizedStalkConvertDown',
  deltaPlantableStalk = 'deltaPlantableStalk',
  deltaPlantedBeans = 'deltaPlantedBeans',
  deltaRoots = 'deltaRoots',
  deltaStalk = 'deltaStalk',
  deltaTotalBdvConvertUp = 'deltaTotalBdvConvertUp',
  deltaTotalBdvConvertUpBonus = 'deltaTotalBdvConvertUpBonus',
  deltaUnpenalizedStalkConvertDown = 'deltaUnpenalizedStalkConvertDown',
  depositedBDV = 'depositedBDV',
  germinatingStalk = 'germinatingStalk',
  grownStalkPerSeason = 'grownStalkPerSeason',
  id = 'id',
  penalizedStalkConvertDown = 'penalizedStalkConvertDown',
  plantableStalk = 'plantableStalk',
  plantedBeans = 'plantedBeans',
  roots = 'roots',
  season = 'season',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  stalk = 'stalk',
  totalBdvConvertUp = 'totalBdvConvertUp',
  totalBdvConvertUpBonus = 'totalBdvConvertUpBonus',
  unpenalizedStalkConvertDown = 'unpenalizedStalkConvertDown',
  updatedAt = 'updatedAt'
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

export type SiloWithdrawFilter = {
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
  and?: InputMaybe<Array<InputMaybe<SiloWithdrawFilter>>>;
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
  farmer_?: InputMaybe<FarmerFilter>;
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
  or?: InputMaybe<Array<InputMaybe<SiloWithdrawFilter>>>;
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

export enum SiloWithdrawOrderBy {
  amount = 'amount',
  claimableSeason = 'claimableSeason',
  claimed = 'claimed',
  createdAt = 'createdAt',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  id = 'id',
  token = 'token',
  withdrawSeason = 'withdrawSeason'
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
  orderBy?: InputMaybe<TokenYieldOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenYieldFilter>;
};

export type SiloYieldFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SiloYieldFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<SiloYieldFilter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenAPYS_?: InputMaybe<TokenYieldFilter>;
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

export enum SiloYieldOrderBy {
  beansPerSeasonEMA = 'beansPerSeasonEMA',
  beta = 'beta',
  createdAt = 'createdAt',
  emaWindow = 'emaWindow',
  id = 'id',
  season = 'season',
  tokenAPYS = 'tokenAPYS',
  u = 'u',
  whitelistedTokens = 'whitelistedTokens'
}

export type SiloFilter = {
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
  allWhitelistedTokens?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  allWhitelistedTokens_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  allWhitelistedTokens_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  allWhitelistedTokens_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  allWhitelistedTokens_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  allWhitelistedTokens_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SiloFilter>>>;
  assets_?: InputMaybe<SiloAssetFilter>;
  avgConvertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  avgConvertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  avgConvertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  avgGrownStalkPerBdvPerSeason?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_gt?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_gte?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  avgGrownStalkPerBdvPerSeason_lt?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_lte?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_not?: InputMaybe<Scalars['BigInt']['input']>;
  avgGrownStalkPerBdvPerSeason_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  beanstalk_?: InputMaybe<BeanstalkFilter>;
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
  bonusStalkConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  bonusStalkConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  bonusStalkConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  convertDownPenalty?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  convertDownPenalty_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  convertDownPenalty_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cropRatio?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cropRatio_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cropRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySnapshots_?: InputMaybe<SiloDailySnapshotFilter>;
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
  farmer_?: InputMaybe<FarmerFilter>;
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
  hourlySnapshots_?: InputMaybe<SiloHourlySnapshotFilter>;
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
  marketPerformanceSeasonals_?: InputMaybe<MarketPerformanceSeasonalFilter>;
  or?: InputMaybe<Array<InputMaybe<SiloFilter>>>;
  penalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  penalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  penalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantableStalk_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantableStalk_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantedBeans?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_gt?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_gte?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  plantedBeans_lt?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_lte?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_not?: InputMaybe<Scalars['BigInt']['input']>;
  plantedBeans_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  totalBdvConvertUp?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUpBonus_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUpBonus_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalBdvConvertUp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalBdvConvertUp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1DepositedBdv?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unmigratedL1DepositedBdv_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_not?: InputMaybe<Scalars['BigInt']['input']>;
  unmigratedL1DepositedBdv_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unpenalizedStalkConvertDown?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unpenalizedStalkConvertDown_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_not?: InputMaybe<Scalars['BigInt']['input']>;
  unpenalizedStalkConvertDown_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  whitelistedTokens?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelistedTokens_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum SiloOrderBy {
  activeFarmers = 'activeFarmers',
  allWhitelistedTokens = 'allWhitelistedTokens',
  assets = 'assets',
  avgConvertDownPenalty = 'avgConvertDownPenalty',
  avgGrownStalkPerBdvPerSeason = 'avgGrownStalkPerBdvPerSeason',
  beanMints = 'beanMints',
  beanToMaxLpGpPerBdvRatio = 'beanToMaxLpGpPerBdvRatio',
  beanstalk = 'beanstalk',
  beanstalk__fertilizer1155 = 'beanstalk__fertilizer1155',
  beanstalk__id = 'beanstalk__id',
  beanstalk__lastSeason = 'beanstalk__lastSeason',
  beanstalk__token = 'beanstalk__token',
  bonusStalkConvertUp = 'bonusStalkConvertUp',
  convertDownPenalty = 'convertDownPenalty',
  cropRatio = 'cropRatio',
  dailySnapshots = 'dailySnapshots',
  depositedBDV = 'depositedBDV',
  dewhitelistedTokens = 'dewhitelistedTokens',
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  germinatingStalk = 'germinatingStalk',
  grownStalkPerSeason = 'grownStalkPerSeason',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  marketPerformanceSeasonals = 'marketPerformanceSeasonals',
  penalizedStalkConvertDown = 'penalizedStalkConvertDown',
  plantableStalk = 'plantableStalk',
  plantedBeans = 'plantedBeans',
  roots = 'roots',
  stalk = 'stalk',
  totalBdvConvertUp = 'totalBdvConvertUp',
  totalBdvConvertUpBonus = 'totalBdvConvertUpBonus',
  unmigratedL1DepositedBdv = 'unmigratedL1DepositedBdv',
  unpenalizedStalkConvertDown = 'unpenalizedStalkConvertDown',
  whitelistedTokens = 'whitelistedTokens'
}

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

export type TokenYieldFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenYieldFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<TokenYieldFilter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloYield?: InputMaybe<Scalars['String']['input']>;
  siloYield_?: InputMaybe<SiloYieldFilter>;
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

export enum TokenYieldOrderBy {
  beanAPY = 'beanAPY',
  createdAt = 'createdAt',
  id = 'id',
  season = 'season',
  siloYield = 'siloYield',
  siloYield__beansPerSeasonEMA = 'siloYield__beansPerSeasonEMA',
  siloYield__beta = 'siloYield__beta',
  siloYield__createdAt = 'siloYield__createdAt',
  siloYield__emaWindow = 'siloYield__emaWindow',
  siloYield__id = 'siloYield__id',
  siloYield__season = 'siloYield__season',
  siloYield__u = 'siloYield__u',
  stalkAPY = 'stalkAPY',
  token = 'token'
}

export type Tractor = {
  __typename?: 'Tractor';
  /** Link to daily snapshot data */
  dailySnapshots: Array<TractorDailySnapshot>;
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<TractorHourlySnapshot>;
  /** 'tractor' */
  id: Scalars['ID']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Total number of tractor executions (# times the `Tractor` event is emitted) */
  totalExecutions: Scalars['Int']['output'];
  /** Total amount of Bean tips paid from operator to publisher. Does not include any other tokens. */
  totalNegBeanTips: Scalars['BigInt']['output'];
  /** Total amount of Bean tips paid from publisher to operator. Does not include any other tokens. */
  totalPosBeanTips: Scalars['BigInt']['output'];
};


export type TractorDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TractorDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TractorDailySnapshotFilter>;
};


export type TractorHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TractorHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TractorHourlySnapshotFilter>;
};

export type TractorDailySnapshot = {
  __typename?: 'TractorDailySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaTotalExecutions: Scalars['Int']['output'];
  deltaTotalNegBeanTips: Scalars['BigInt']['output'];
  deltaTotalPosBeanTips: Scalars['BigInt']['output'];
  /** Tractor ID - Day */
  id: Scalars['ID']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Point in time totalExecutions */
  totalExecutions: Scalars['Int']['output'];
  /** Point in time totalNegBeanTips */
  totalNegBeanTips: Scalars['BigInt']['output'];
  /** Point in time totalPosBeanTips */
  totalPosBeanTips: Scalars['BigInt']['output'];
  /** Tractor associated with this snapshot */
  tractor: Tractor;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type TractorDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TractorDailySnapshotFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalExecutions?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaTotalExecutions_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_not?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaTotalNegBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalNegBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalPosBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalPosBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TractorDailySnapshotFilter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalExecutions?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_gt?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_gte?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalExecutions_lt?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_lte?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_not?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalNegBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalNegBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPosBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPosBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tractor?: InputMaybe<Scalars['String']['input']>;
  tractor_?: InputMaybe<TractorFilter>;
  tractor_contains?: InputMaybe<Scalars['String']['input']>;
  tractor_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_ends_with?: InputMaybe<Scalars['String']['input']>;
  tractor_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_gt?: InputMaybe<Scalars['String']['input']>;
  tractor_gte?: InputMaybe<Scalars['String']['input']>;
  tractor_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tractor_lt?: InputMaybe<Scalars['String']['input']>;
  tractor_lte?: InputMaybe<Scalars['String']['input']>;
  tractor_not?: InputMaybe<Scalars['String']['input']>;
  tractor_not_contains?: InputMaybe<Scalars['String']['input']>;
  tractor_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tractor_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tractor_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tractor_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_starts_with?: InputMaybe<Scalars['String']['input']>;
  tractor_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum TractorDailySnapshotOrderBy {
  createdAt = 'createdAt',
  deltaTotalExecutions = 'deltaTotalExecutions',
  deltaTotalNegBeanTips = 'deltaTotalNegBeanTips',
  deltaTotalPosBeanTips = 'deltaTotalPosBeanTips',
  id = 'id',
  season = 'season',
  totalExecutions = 'totalExecutions',
  totalNegBeanTips = 'totalNegBeanTips',
  totalPosBeanTips = 'totalPosBeanTips',
  tractor = 'tractor',
  tractor__id = 'tractor__id',
  tractor__lastDailySnapshotDay = 'tractor__lastDailySnapshotDay',
  tractor__lastHourlySnapshotSeason = 'tractor__lastHourlySnapshotSeason',
  tractor__totalExecutions = 'tractor__totalExecutions',
  tractor__totalNegBeanTips = 'tractor__totalNegBeanTips',
  tractor__totalPosBeanTips = 'tractor__totalPosBeanTips',
  updatedAt = 'updatedAt'
}

export type TractorHourlySnapshot = {
  __typename?: 'TractorHourlySnapshot';
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  deltaTotalExecutions: Scalars['Int']['output'];
  deltaTotalNegBeanTips: Scalars['BigInt']['output'];
  deltaTotalPosBeanTips: Scalars['BigInt']['output'];
  /** Tractor ID - Season */
  id: Scalars['ID']['output'];
  /** Season for the snapshot */
  season: Scalars['Int']['output'];
  /** Point in time totalExecutions */
  totalExecutions: Scalars['Int']['output'];
  /** Point in time totalNegBeanTips */
  totalNegBeanTips: Scalars['BigInt']['output'];
  /** Point in time totalPosBeanTips */
  totalPosBeanTips: Scalars['BigInt']['output'];
  /** Tractor associated with this snapshot */
  tractor: Tractor;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type TractorHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TractorHourlySnapshotFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalExecutions?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_gt?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_gte?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaTotalExecutions_lt?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_lte?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_not?: InputMaybe<Scalars['Int']['input']>;
  deltaTotalExecutions_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  deltaTotalNegBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalNegBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalNegBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalPosBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaTotalPosBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaTotalPosBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TractorHourlySnapshotFilter>>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalExecutions?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_gt?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_gte?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalExecutions_lt?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_lte?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_not?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalNegBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalNegBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPosBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPosBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tractor?: InputMaybe<Scalars['String']['input']>;
  tractor_?: InputMaybe<TractorFilter>;
  tractor_contains?: InputMaybe<Scalars['String']['input']>;
  tractor_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_ends_with?: InputMaybe<Scalars['String']['input']>;
  tractor_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_gt?: InputMaybe<Scalars['String']['input']>;
  tractor_gte?: InputMaybe<Scalars['String']['input']>;
  tractor_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tractor_lt?: InputMaybe<Scalars['String']['input']>;
  tractor_lte?: InputMaybe<Scalars['String']['input']>;
  tractor_not?: InputMaybe<Scalars['String']['input']>;
  tractor_not_contains?: InputMaybe<Scalars['String']['input']>;
  tractor_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tractor_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tractor_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tractor_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tractor_starts_with?: InputMaybe<Scalars['String']['input']>;
  tractor_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum TractorHourlySnapshotOrderBy {
  createdAt = 'createdAt',
  deltaTotalExecutions = 'deltaTotalExecutions',
  deltaTotalNegBeanTips = 'deltaTotalNegBeanTips',
  deltaTotalPosBeanTips = 'deltaTotalPosBeanTips',
  id = 'id',
  season = 'season',
  totalExecutions = 'totalExecutions',
  totalNegBeanTips = 'totalNegBeanTips',
  totalPosBeanTips = 'totalPosBeanTips',
  tractor = 'tractor',
  tractor__id = 'tractor__id',
  tractor__lastDailySnapshotDay = 'tractor__lastDailySnapshotDay',
  tractor__lastHourlySnapshotSeason = 'tractor__lastHourlySnapshotSeason',
  tractor__totalExecutions = 'tractor__totalExecutions',
  tractor__totalNegBeanTips = 'tractor__totalNegBeanTips',
  tractor__totalPosBeanTips = 'tractor__totalPosBeanTips',
  updatedAt = 'updatedAt'
}

export type TractorReward = {
  __typename?: 'TractorReward';
  /** The farmer associated to this reward */
  farmer: Farmer;
  /** {farmer}-{rewardType}-{rewardToken} */
  id: Scalars['ID']['output'];
  /** For account=operator - Total executed orders with these reward settings. */
  operatorExecutions: Scalars['Int']['output'];
  /** For account=operator - Total amount paid to the publisher for executed orders. */
  operatorNegAmount: Scalars['BigInt']['output'];
  /** For account=operator - Total amount received from the publisher for executed orders. */
  operatorPosAmount: Scalars['BigInt']['output'];
  /** For account=publisher - Total executed orders with these reward settings. */
  publisherExecutions: Scalars['Int']['output'];
  /** For account=publisher - Total amount received from the operator for executed orders. */
  publisherNegAmount: Scalars['BigInt']['output'];
  /** For account=publisher - Total amount paid to the operator for executed orders. */
  publisherPosAmount: Scalars['BigInt']['output'];
  /** The token given for this reward */
  rewardToken: Scalars['Bytes']['output'];
  /** The type of this reward */
  rewardType: Scalars['Int']['output'];
};

export type TractorRewardFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TractorRewardFilter>>>;
  farmer?: InputMaybe<Scalars['String']['input']>;
  farmer_?: InputMaybe<FarmerFilter>;
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
  operatorExecutions?: InputMaybe<Scalars['Int']['input']>;
  operatorExecutions_gt?: InputMaybe<Scalars['Int']['input']>;
  operatorExecutions_gte?: InputMaybe<Scalars['Int']['input']>;
  operatorExecutions_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorExecutions_lt?: InputMaybe<Scalars['Int']['input']>;
  operatorExecutions_lte?: InputMaybe<Scalars['Int']['input']>;
  operatorExecutions_not?: InputMaybe<Scalars['Int']['input']>;
  operatorExecutions_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  operatorNegAmount?: InputMaybe<Scalars['BigInt']['input']>;
  operatorNegAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorNegAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorNegAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorNegAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorNegAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorNegAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorNegAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorPosAmount?: InputMaybe<Scalars['BigInt']['input']>;
  operatorPosAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorPosAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorPosAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  operatorPosAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  operatorPosAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  operatorPosAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  operatorPosAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TractorRewardFilter>>>;
  publisherExecutions?: InputMaybe<Scalars['Int']['input']>;
  publisherExecutions_gt?: InputMaybe<Scalars['Int']['input']>;
  publisherExecutions_gte?: InputMaybe<Scalars['Int']['input']>;
  publisherExecutions_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  publisherExecutions_lt?: InputMaybe<Scalars['Int']['input']>;
  publisherExecutions_lte?: InputMaybe<Scalars['Int']['input']>;
  publisherExecutions_not?: InputMaybe<Scalars['Int']['input']>;
  publisherExecutions_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  publisherNegAmount?: InputMaybe<Scalars['BigInt']['input']>;
  publisherNegAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  publisherNegAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  publisherNegAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  publisherNegAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  publisherNegAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  publisherNegAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  publisherNegAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  publisherPosAmount?: InputMaybe<Scalars['BigInt']['input']>;
  publisherPosAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  publisherPosAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  publisherPosAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  publisherPosAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  publisherPosAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  publisherPosAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  publisherPosAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardToken?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_contains?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_gt?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_gte?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardToken_lt?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_lte?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_not?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardType?: InputMaybe<Scalars['Int']['input']>;
  rewardType_gt?: InputMaybe<Scalars['Int']['input']>;
  rewardType_gte?: InputMaybe<Scalars['Int']['input']>;
  rewardType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rewardType_lt?: InputMaybe<Scalars['Int']['input']>;
  rewardType_lte?: InputMaybe<Scalars['Int']['input']>;
  rewardType_not?: InputMaybe<Scalars['Int']['input']>;
  rewardType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum TractorRewardOrderBy {
  farmer = 'farmer',
  farmer__creationBlock = 'farmer__creationBlock',
  farmer__id = 'farmer__id',
  farmer__refereeCount = 'farmer__refereeCount',
  farmer__totalReferralRewardPodsReceived = 'farmer__totalReferralRewardPodsReceived',
  id = 'id',
  operatorExecutions = 'operatorExecutions',
  operatorNegAmount = 'operatorNegAmount',
  operatorPosAmount = 'operatorPosAmount',
  publisherExecutions = 'publisherExecutions',
  publisherNegAmount = 'publisherNegAmount',
  publisherPosAmount = 'publisherPosAmount',
  rewardToken = 'rewardToken',
  rewardType = 'rewardType'
}

export type TractorFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TractorFilter>>>;
  dailySnapshots_?: InputMaybe<TractorDailySnapshotFilter>;
  hourlySnapshots_?: InputMaybe<TractorHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<TractorFilter>>>;
  totalExecutions?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_gt?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_gte?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalExecutions_lt?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_lte?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_not?: InputMaybe<Scalars['Int']['input']>;
  totalExecutions_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalNegBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalNegBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalNegBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPosBeanTips?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPosBeanTips_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalPosBeanTips_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum TractorOrderBy {
  dailySnapshots = 'dailySnapshots',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  totalExecutions = 'totalExecutions',
  totalNegBeanTips = 'totalNegBeanTips',
  totalPosBeanTips = 'totalPosBeanTips'
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
  orderBy?: InputMaybe<UnripeTokenDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UnripeTokenDailySnapshotFilter>;
};


export type UnripeTokenHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnripeTokenHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UnripeTokenHourlySnapshotFilter>;
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

export type UnripeTokenDailySnapshotFilter = {
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
  and?: InputMaybe<Array<InputMaybe<UnripeTokenDailySnapshotFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<UnripeTokenDailySnapshotFilter>>>;
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
  underlyingToken_?: InputMaybe<WhitelistTokenSettingFilter>;
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
  unripeToken_?: InputMaybe<UnripeTokenFilter>;
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

export enum UnripeTokenDailySnapshotOrderBy {
  amountUnderlyingOne = 'amountUnderlyingOne',
  bdvUnderlyingOne = 'bdvUnderlyingOne',
  chopRate = 'chopRate',
  choppableAmountOne = 'choppableAmountOne',
  choppableBdvOne = 'choppableBdvOne',
  createdAt = 'createdAt',
  deltaAmountUnderlyingOne = 'deltaAmountUnderlyingOne',
  deltaBdvUnderlyingOne = 'deltaBdvUnderlyingOne',
  deltaChopRate = 'deltaChopRate',
  deltaChoppableAmountOne = 'deltaChoppableAmountOne',
  deltaChoppableBdvOne = 'deltaChoppableBdvOne',
  deltaRecapPercent = 'deltaRecapPercent',
  deltaTotalChoppedAmount = 'deltaTotalChoppedAmount',
  deltaTotalChoppedBdv = 'deltaTotalChoppedBdv',
  deltaTotalChoppedBdvReceived = 'deltaTotalChoppedBdvReceived',
  deltaTotalUnderlying = 'deltaTotalUnderlying',
  deltaUnderlyingToken = 'deltaUnderlyingToken',
  id = 'id',
  recapPercent = 'recapPercent',
  season = 'season',
  totalChoppedAmount = 'totalChoppedAmount',
  totalChoppedBdv = 'totalChoppedBdv',
  totalChoppedBdvReceived = 'totalChoppedBdvReceived',
  totalUnderlying = 'totalUnderlying',
  underlyingToken = 'underlyingToken',
  underlyingToken__decimals = 'underlyingToken__decimals',
  underlyingToken__gaugePoints = 'underlyingToken__gaugePoints',
  underlyingToken__id = 'underlyingToken__id',
  underlyingToken__isGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  underlyingToken__lastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  underlyingToken__lastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  underlyingToken__milestoneSeason = 'underlyingToken__milestoneSeason',
  underlyingToken__optimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  underlyingToken__selector = 'underlyingToken__selector',
  underlyingToken__stalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  underlyingToken__stalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  underlyingToken__stemTip = 'underlyingToken__stemTip',
  underlyingToken__updatedAt = 'underlyingToken__updatedAt',
  unripeToken = 'unripeToken',
  unripeToken__amountUnderlyingOne = 'unripeToken__amountUnderlyingOne',
  unripeToken__bdvUnderlyingOne = 'unripeToken__bdvUnderlyingOne',
  unripeToken__chopRate = 'unripeToken__chopRate',
  unripeToken__choppableAmountOne = 'unripeToken__choppableAmountOne',
  unripeToken__choppableBdvOne = 'unripeToken__choppableBdvOne',
  unripeToken__id = 'unripeToken__id',
  unripeToken__lastDailySnapshotDay = 'unripeToken__lastDailySnapshotDay',
  unripeToken__lastHourlySnapshotSeason = 'unripeToken__lastHourlySnapshotSeason',
  unripeToken__recapPercent = 'unripeToken__recapPercent',
  unripeToken__totalChoppedAmount = 'unripeToken__totalChoppedAmount',
  unripeToken__totalChoppedBdv = 'unripeToken__totalChoppedBdv',
  unripeToken__totalChoppedBdvReceived = 'unripeToken__totalChoppedBdvReceived',
  unripeToken__totalUnderlying = 'unripeToken__totalUnderlying',
  updatedAt = 'updatedAt'
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

export type UnripeTokenHourlySnapshotFilter = {
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
  and?: InputMaybe<Array<InputMaybe<UnripeTokenHourlySnapshotFilter>>>;
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
  or?: InputMaybe<Array<InputMaybe<UnripeTokenHourlySnapshotFilter>>>;
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
  underlyingToken_?: InputMaybe<WhitelistTokenSettingFilter>;
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
  unripeToken_?: InputMaybe<UnripeTokenFilter>;
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

export enum UnripeTokenHourlySnapshotOrderBy {
  amountUnderlyingOne = 'amountUnderlyingOne',
  bdvUnderlyingOne = 'bdvUnderlyingOne',
  chopRate = 'chopRate',
  choppableAmountOne = 'choppableAmountOne',
  choppableBdvOne = 'choppableBdvOne',
  createdAt = 'createdAt',
  deltaAmountUnderlyingOne = 'deltaAmountUnderlyingOne',
  deltaBdvUnderlyingOne = 'deltaBdvUnderlyingOne',
  deltaChopRate = 'deltaChopRate',
  deltaChoppableAmountOne = 'deltaChoppableAmountOne',
  deltaChoppableBdvOne = 'deltaChoppableBdvOne',
  deltaRecapPercent = 'deltaRecapPercent',
  deltaTotalChoppedAmount = 'deltaTotalChoppedAmount',
  deltaTotalChoppedBdv = 'deltaTotalChoppedBdv',
  deltaTotalChoppedBdvReceived = 'deltaTotalChoppedBdvReceived',
  deltaTotalUnderlying = 'deltaTotalUnderlying',
  deltaUnderlyingToken = 'deltaUnderlyingToken',
  id = 'id',
  recapPercent = 'recapPercent',
  season = 'season',
  totalChoppedAmount = 'totalChoppedAmount',
  totalChoppedBdv = 'totalChoppedBdv',
  totalChoppedBdvReceived = 'totalChoppedBdvReceived',
  totalUnderlying = 'totalUnderlying',
  underlyingToken = 'underlyingToken',
  underlyingToken__decimals = 'underlyingToken__decimals',
  underlyingToken__gaugePoints = 'underlyingToken__gaugePoints',
  underlyingToken__id = 'underlyingToken__id',
  underlyingToken__isGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  underlyingToken__lastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  underlyingToken__lastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  underlyingToken__milestoneSeason = 'underlyingToken__milestoneSeason',
  underlyingToken__optimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  underlyingToken__selector = 'underlyingToken__selector',
  underlyingToken__stalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  underlyingToken__stalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  underlyingToken__stemTip = 'underlyingToken__stemTip',
  underlyingToken__updatedAt = 'underlyingToken__updatedAt',
  unripeToken = 'unripeToken',
  unripeToken__amountUnderlyingOne = 'unripeToken__amountUnderlyingOne',
  unripeToken__bdvUnderlyingOne = 'unripeToken__bdvUnderlyingOne',
  unripeToken__chopRate = 'unripeToken__chopRate',
  unripeToken__choppableAmountOne = 'unripeToken__choppableAmountOne',
  unripeToken__choppableBdvOne = 'unripeToken__choppableBdvOne',
  unripeToken__id = 'unripeToken__id',
  unripeToken__lastDailySnapshotDay = 'unripeToken__lastDailySnapshotDay',
  unripeToken__lastHourlySnapshotSeason = 'unripeToken__lastHourlySnapshotSeason',
  unripeToken__recapPercent = 'unripeToken__recapPercent',
  unripeToken__totalChoppedAmount = 'unripeToken__totalChoppedAmount',
  unripeToken__totalChoppedBdv = 'unripeToken__totalChoppedBdv',
  unripeToken__totalChoppedBdvReceived = 'unripeToken__totalChoppedBdvReceived',
  unripeToken__totalUnderlying = 'unripeToken__totalUnderlying',
  updatedAt = 'updatedAt'
}

export type UnripeTokenFilter = {
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
  and?: InputMaybe<Array<InputMaybe<UnripeTokenFilter>>>;
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
  dailySnapshots_?: InputMaybe<UnripeTokenDailySnapshotFilter>;
  hourlySnapshots_?: InputMaybe<UnripeTokenHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<UnripeTokenFilter>>>;
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
  underlyingToken_?: InputMaybe<WhitelistTokenSettingFilter>;
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

export enum UnripeTokenOrderBy {
  amountUnderlyingOne = 'amountUnderlyingOne',
  bdvUnderlyingOne = 'bdvUnderlyingOne',
  chopRate = 'chopRate',
  choppableAmountOne = 'choppableAmountOne',
  choppableBdvOne = 'choppableBdvOne',
  dailySnapshots = 'dailySnapshots',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  recapPercent = 'recapPercent',
  totalChoppedAmount = 'totalChoppedAmount',
  totalChoppedBdv = 'totalChoppedBdv',
  totalChoppedBdvReceived = 'totalChoppedBdvReceived',
  totalUnderlying = 'totalUnderlying',
  underlyingToken = 'underlyingToken',
  underlyingToken__decimals = 'underlyingToken__decimals',
  underlyingToken__gaugePoints = 'underlyingToken__gaugePoints',
  underlyingToken__id = 'underlyingToken__id',
  underlyingToken__isGaugeEnabled = 'underlyingToken__isGaugeEnabled',
  underlyingToken__lastDailySnapshotDay = 'underlyingToken__lastDailySnapshotDay',
  underlyingToken__lastHourlySnapshotSeason = 'underlyingToken__lastHourlySnapshotSeason',
  underlyingToken__milestoneSeason = 'underlyingToken__milestoneSeason',
  underlyingToken__optimalPercentDepositedBdv = 'underlyingToken__optimalPercentDepositedBdv',
  underlyingToken__selector = 'underlyingToken__selector',
  underlyingToken__stalkEarnedPerSeason = 'underlyingToken__stalkEarnedPerSeason',
  underlyingToken__stalkIssuedPerBdv = 'underlyingToken__stalkIssuedPerBdv',
  underlyingToken__stemTip = 'underlyingToken__stemTip',
  underlyingToken__updatedAt = 'underlyingToken__updatedAt'
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

export type WellPlenty = {
  __typename?: 'WellPlenty';
  /** The amount of claimed plenty for this token */
  claimedAmount: Scalars['BigInt']['output'];
  /** {Address for the farmer or Beanstalk contract}-{Non-Pinto token} */
  id: Scalars['ID']['output'];
  /** Beanstalk or farmer silo (used in the ID) */
  silo: Silo;
  /** Payout token (used in the ID) */
  token: Scalars['Bytes']['output'];
  /** The amount of unclaimed plenty for this token. Always = 0 for an individual Farmer's Silo. */
  unclaimedAmount: Scalars['BigInt']['output'];
};

export type WellPlentyFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WellPlentyFilter>>>;
  claimedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  claimedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WellPlentyFilter>>>;
  silo?: InputMaybe<Scalars['String']['input']>;
  silo_?: InputMaybe<SiloFilter>;
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
  unclaimedAmount?: InputMaybe<Scalars['BigInt']['input']>;
  unclaimedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unclaimedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unclaimedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unclaimedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unclaimedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unclaimedAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  unclaimedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum WellPlentyOrderBy {
  claimedAmount = 'claimedAmount',
  id = 'id',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  token = 'token',
  unclaimedAmount = 'unclaimedAmount'
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
  deltaStemTip: Scalars['BigInt']['output'];
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
  /** The stem tip of the whitelisted token. Used to derive cumulative Stalk growth.  */
  stemTip: Scalars['BigInt']['output'];
  /** WhitelistTokenSetting associated with this snapshot */
  token: WhitelistTokenSetting;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type WhitelistTokenDailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WhitelistTokenDailySnapshotFilter>>>;
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
  deltaStemTip?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStemTip_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<WhitelistTokenDailySnapshotFilter>>>;
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
  stemTip?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stemTip_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_not?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<WhitelistTokenSettingFilter>;
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

export enum WhitelistTokenDailySnapshotOrderBy {
  bdv = 'bdv',
  createdAt = 'createdAt',
  deltaBdv = 'deltaBdv',
  deltaGaugePoints = 'deltaGaugePoints',
  deltaIsGaugeEnabled = 'deltaIsGaugeEnabled',
  deltaMilestoneSeason = 'deltaMilestoneSeason',
  deltaOptimalPercentDepositedBdv = 'deltaOptimalPercentDepositedBdv',
  deltaStalkEarnedPerSeason = 'deltaStalkEarnedPerSeason',
  deltaStalkIssuedPerBdv = 'deltaStalkIssuedPerBdv',
  deltaStemTip = 'deltaStemTip',
  gaugePoints = 'gaugePoints',
  id = 'id',
  isGaugeEnabled = 'isGaugeEnabled',
  milestoneSeason = 'milestoneSeason',
  optimalPercentDepositedBdv = 'optimalPercentDepositedBdv',
  season = 'season',
  selector = 'selector',
  stalkEarnedPerSeason = 'stalkEarnedPerSeason',
  stalkIssuedPerBdv = 'stalkIssuedPerBdv',
  stemTip = 'stemTip',
  token = 'token',
  token__decimals = 'token__decimals',
  token__gaugePoints = 'token__gaugePoints',
  token__id = 'token__id',
  token__isGaugeEnabled = 'token__isGaugeEnabled',
  token__lastDailySnapshotDay = 'token__lastDailySnapshotDay',
  token__lastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  token__milestoneSeason = 'token__milestoneSeason',
  token__optimalPercentDepositedBdv = 'token__optimalPercentDepositedBdv',
  token__selector = 'token__selector',
  token__stalkEarnedPerSeason = 'token__stalkEarnedPerSeason',
  token__stalkIssuedPerBdv = 'token__stalkIssuedPerBdv',
  token__stemTip = 'token__stemTip',
  token__updatedAt = 'token__updatedAt',
  updatedAt = 'updatedAt'
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
  deltaStemTip: Scalars['BigInt']['output'];
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
  /** The stem tip of the whitelisted token. Used to derive cumulative Stalk growth.  */
  stemTip: Scalars['BigInt']['output'];
  /** WhitelistTokenSetting associated with this snapshot */
  token: WhitelistTokenSetting;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type WhitelistTokenHourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WhitelistTokenHourlySnapshotFilter>>>;
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
  deltaStemTip?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaStemTip_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaStemTip_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<WhitelistTokenHourlySnapshotFilter>>>;
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
  stemTip?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stemTip_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_not?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<WhitelistTokenSettingFilter>;
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

export enum WhitelistTokenHourlySnapshotOrderBy {
  bdv = 'bdv',
  createdAt = 'createdAt',
  deltaBdv = 'deltaBdv',
  deltaGaugePoints = 'deltaGaugePoints',
  deltaIsGaugeEnabled = 'deltaIsGaugeEnabled',
  deltaMilestoneSeason = 'deltaMilestoneSeason',
  deltaOptimalPercentDepositedBdv = 'deltaOptimalPercentDepositedBdv',
  deltaStalkEarnedPerSeason = 'deltaStalkEarnedPerSeason',
  deltaStalkIssuedPerBdv = 'deltaStalkIssuedPerBdv',
  deltaStemTip = 'deltaStemTip',
  gaugePoints = 'gaugePoints',
  id = 'id',
  isGaugeEnabled = 'isGaugeEnabled',
  milestoneSeason = 'milestoneSeason',
  optimalPercentDepositedBdv = 'optimalPercentDepositedBdv',
  season = 'season',
  selector = 'selector',
  stalkEarnedPerSeason = 'stalkEarnedPerSeason',
  stalkIssuedPerBdv = 'stalkIssuedPerBdv',
  stemTip = 'stemTip',
  token = 'token',
  token__decimals = 'token__decimals',
  token__gaugePoints = 'token__gaugePoints',
  token__id = 'token__id',
  token__isGaugeEnabled = 'token__isGaugeEnabled',
  token__lastDailySnapshotDay = 'token__lastDailySnapshotDay',
  token__lastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  token__milestoneSeason = 'token__milestoneSeason',
  token__optimalPercentDepositedBdv = 'token__optimalPercentDepositedBdv',
  token__selector = 'token__selector',
  token__stalkEarnedPerSeason = 'token__stalkEarnedPerSeason',
  token__stalkIssuedPerBdv = 'token__stalkIssuedPerBdv',
  token__stemTip = 'token__stemTip',
  token__updatedAt = 'token__updatedAt',
  updatedAt = 'updatedAt'
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
  /** The stem tip of the whitelisted token. Used to derive cumulative Stalk growth.  */
  stemTip: Scalars['BigInt']['output'];
  /** Last timestamp entity was updated */
  updatedAt: Scalars['BigInt']['output'];
};


export type WhitelistTokenSettingDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenDailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WhitelistTokenDailySnapshotFilter>;
};


export type WhitelistTokenSettingHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WhitelistTokenHourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WhitelistTokenHourlySnapshotFilter>;
};

export type WhitelistTokenSettingFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WhitelistTokenSettingFilter>>>;
  dailySnapshots_?: InputMaybe<WhitelistTokenDailySnapshotFilter>;
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
  hourlySnapshots_?: InputMaybe<WhitelistTokenHourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<WhitelistTokenSettingFilter>>>;
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
  stemTip?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stemTip_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_not?: InputMaybe<Scalars['BigInt']['input']>;
  stemTip_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum WhitelistTokenSettingOrderBy {
  dailySnapshots = 'dailySnapshots',
  decimals = 'decimals',
  gaugePoints = 'gaugePoints',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  isGaugeEnabled = 'isGaugeEnabled',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  milestoneSeason = 'milestoneSeason',
  optimalPercentDepositedBdv = 'optimalPercentDepositedBdv',
  selector = 'selector',
  stalkEarnedPerSeason = 'stalkEarnedPerSeason',
  stalkIssuedPerBdv = 'stalkIssuedPerBdv',
  stemTip = 'stemTip',
  updatedAt = 'updatedAt'
}

export type WrappedDepositErc20 = {
  __typename?: 'WrappedDepositERC20';
  /** Projected apy from percent change in redeem rate over the past 7d */
  apy7d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 24h */
  apy24h?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 30d */
  apy30d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 90d */
  apy90d?: Maybe<Scalars['BigDecimal']['output']>;
  /** 'beanstalk' */
  beanstalk: Beanstalk;
  /** Link to daily snapshot data */
  dailySnapshots: Array<WrappedDepositErc20DailySnapshot>;
  /** Number of decimals for the token */
  decimals: Scalars['Int']['output'];
  /** Link to hourly snapshot data */
  hourlySnapshots: Array<WrappedDepositErc20HourlySnapshot>;
  /** Address of the wrapped silo token */
  id: Scalars['Bytes']['output'];
  /** Day of when the previous daily snapshot was taken/updated */
  lastDailySnapshotDay?: Maybe<Scalars['BigInt']['output']>;
  /** Season when the previous hourly snapshot was taken/updated */
  lastHourlySnapshotSeason?: Maybe<Scalars['Int']['output']>;
  /** Amount of underlying tokens redeemable for 1e(decimals) of this wrapped token */
  redeemRate: Scalars['BigInt']['output'];
  /** Silo stats for this wrapped deposit contract */
  silo: Silo;
  /** Total token supply */
  supply: Scalars['BigInt']['output'];
  /** The whitelisted silo deposit token that this erc20 is wrapping */
  underlyingAsset: WhitelistTokenSetting;
};


export type WrappedDepositErc20DailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDepositErc20DailySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WrappedDepositErc20DailySnapshotFilter>;
};


export type WrappedDepositErc20HourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDepositErc20HourlySnapshotOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WrappedDepositErc20HourlySnapshotFilter>;
};

export type WrappedDepositErc20DailySnapshot = {
  __typename?: 'WrappedDepositERC20DailySnapshot';
  /** Projected apy from percent change in redeem rate over the past 7d */
  apy7d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 24h */
  apy24h?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 30d */
  apy30d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 90d */
  apy90d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** Delta of redeemRate */
  deltaRedeemRate: Scalars['BigInt']['output'];
  /** Delta of supply */
  deltaSupply: Scalars['BigInt']['output'];
  /** Token address - Day */
  id: Scalars['ID']['output'];
  /** Amount of underlying tokens redeemable for 1e(decimals) of this wrapped token */
  redeemRate: Scalars['BigInt']['output'];
  /** The season for this snapshot */
  season: Scalars['Int']['output'];
  /** Daily Silo stats for this wrapped deposit contract */
  siloDailySnapshot: SiloHourlySnapshot;
  /** Total token supply */
  supply: Scalars['BigInt']['output'];
  /** WrappedDepositERC20 associated with this snapshot */
  token: WrappedDepositErc20;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type WrappedDepositErc20DailySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WrappedDepositErc20DailySnapshotFilter>>>;
  apy7d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy7d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy24h?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy24h_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy30d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy30d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy90d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy90d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRedeemRate?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRedeemRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WrappedDepositErc20DailySnapshotFilter>>>;
  redeemRate?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  redeemRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloDailySnapshot?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_?: InputMaybe<SiloHourlySnapshotFilter>;
  siloDailySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloDailySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloDailySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloDailySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<WrappedDepositErc20Filter>;
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

export enum WrappedDepositErc20DailySnapshotOrderBy {
  apy7d = 'apy7d',
  apy24h = 'apy24h',
  apy30d = 'apy30d',
  apy90d = 'apy90d',
  createdAt = 'createdAt',
  deltaRedeemRate = 'deltaRedeemRate',
  deltaSupply = 'deltaSupply',
  id = 'id',
  redeemRate = 'redeemRate',
  season = 'season',
  siloDailySnapshot = 'siloDailySnapshot',
  siloDailySnapshot__activeFarmers = 'siloDailySnapshot__activeFarmers',
  siloDailySnapshot__avgConvertDownPenalty = 'siloDailySnapshot__avgConvertDownPenalty',
  siloDailySnapshot__avgGrownStalkPerBdvPerSeason = 'siloDailySnapshot__avgGrownStalkPerBdvPerSeason',
  siloDailySnapshot__beanMints = 'siloDailySnapshot__beanMints',
  siloDailySnapshot__beanToMaxLpGpPerBdvRatio = 'siloDailySnapshot__beanToMaxLpGpPerBdvRatio',
  siloDailySnapshot__bonusStalkConvertUp = 'siloDailySnapshot__bonusStalkConvertUp',
  siloDailySnapshot__caseId = 'siloDailySnapshot__caseId',
  siloDailySnapshot__convertDownPenalty = 'siloDailySnapshot__convertDownPenalty',
  siloDailySnapshot__createdAt = 'siloDailySnapshot__createdAt',
  siloDailySnapshot__cropRatio = 'siloDailySnapshot__cropRatio',
  siloDailySnapshot__deltaActiveFarmers = 'siloDailySnapshot__deltaActiveFarmers',
  siloDailySnapshot__deltaAvgConvertDownPenalty = 'siloDailySnapshot__deltaAvgConvertDownPenalty',
  siloDailySnapshot__deltaAvgGrownStalkPerBdvPerSeason = 'siloDailySnapshot__deltaAvgGrownStalkPerBdvPerSeason',
  siloDailySnapshot__deltaBeanMints = 'siloDailySnapshot__deltaBeanMints',
  siloDailySnapshot__deltaBeanToMaxLpGpPerBdvRatio = 'siloDailySnapshot__deltaBeanToMaxLpGpPerBdvRatio',
  siloDailySnapshot__deltaBonusStalkConvertUp = 'siloDailySnapshot__deltaBonusStalkConvertUp',
  siloDailySnapshot__deltaConvertDownPenalty = 'siloDailySnapshot__deltaConvertDownPenalty',
  siloDailySnapshot__deltaCropRatio = 'siloDailySnapshot__deltaCropRatio',
  siloDailySnapshot__deltaDepositedBDV = 'siloDailySnapshot__deltaDepositedBDV',
  siloDailySnapshot__deltaGerminatingStalk = 'siloDailySnapshot__deltaGerminatingStalk',
  siloDailySnapshot__deltaGrownStalkPerSeason = 'siloDailySnapshot__deltaGrownStalkPerSeason',
  siloDailySnapshot__deltaPenalizedStalkConvertDown = 'siloDailySnapshot__deltaPenalizedStalkConvertDown',
  siloDailySnapshot__deltaPlantableStalk = 'siloDailySnapshot__deltaPlantableStalk',
  siloDailySnapshot__deltaPlantedBeans = 'siloDailySnapshot__deltaPlantedBeans',
  siloDailySnapshot__deltaRoots = 'siloDailySnapshot__deltaRoots',
  siloDailySnapshot__deltaStalk = 'siloDailySnapshot__deltaStalk',
  siloDailySnapshot__deltaTotalBdvConvertUp = 'siloDailySnapshot__deltaTotalBdvConvertUp',
  siloDailySnapshot__deltaTotalBdvConvertUpBonus = 'siloDailySnapshot__deltaTotalBdvConvertUpBonus',
  siloDailySnapshot__deltaUnpenalizedStalkConvertDown = 'siloDailySnapshot__deltaUnpenalizedStalkConvertDown',
  siloDailySnapshot__depositedBDV = 'siloDailySnapshot__depositedBDV',
  siloDailySnapshot__germinatingStalk = 'siloDailySnapshot__germinatingStalk',
  siloDailySnapshot__grownStalkPerSeason = 'siloDailySnapshot__grownStalkPerSeason',
  siloDailySnapshot__id = 'siloDailySnapshot__id',
  siloDailySnapshot__penalizedStalkConvertDown = 'siloDailySnapshot__penalizedStalkConvertDown',
  siloDailySnapshot__plantableStalk = 'siloDailySnapshot__plantableStalk',
  siloDailySnapshot__plantedBeans = 'siloDailySnapshot__plantedBeans',
  siloDailySnapshot__roots = 'siloDailySnapshot__roots',
  siloDailySnapshot__season = 'siloDailySnapshot__season',
  siloDailySnapshot__stalk = 'siloDailySnapshot__stalk',
  siloDailySnapshot__totalBdvConvertUp = 'siloDailySnapshot__totalBdvConvertUp',
  siloDailySnapshot__totalBdvConvertUpBonus = 'siloDailySnapshot__totalBdvConvertUpBonus',
  siloDailySnapshot__unpenalizedStalkConvertDown = 'siloDailySnapshot__unpenalizedStalkConvertDown',
  siloDailySnapshot__updatedAt = 'siloDailySnapshot__updatedAt',
  supply = 'supply',
  token = 'token',
  token__apy7d = 'token__apy7d',
  token__apy24h = 'token__apy24h',
  token__apy30d = 'token__apy30d',
  token__apy90d = 'token__apy90d',
  token__decimals = 'token__decimals',
  token__id = 'token__id',
  token__lastDailySnapshotDay = 'token__lastDailySnapshotDay',
  token__lastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  token__redeemRate = 'token__redeemRate',
  token__supply = 'token__supply',
  updatedAt = 'updatedAt'
}

export type WrappedDepositErc20HourlySnapshot = {
  __typename?: 'WrappedDepositERC20HourlySnapshot';
  /** Projected apy from percent change in redeem rate over the past 7d */
  apy7d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 24h */
  apy24h?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 30d */
  apy30d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Projected apy from percent change in redeem rate over the past 90d */
  apy90d?: Maybe<Scalars['BigDecimal']['output']>;
  /** Timestamp of initial snapshot creation */
  createdAt: Scalars['BigInt']['output'];
  /** Delta of redeemRate */
  deltaRedeemRate: Scalars['BigInt']['output'];
  /** Delta of supply */
  deltaSupply: Scalars['BigInt']['output'];
  /** Token address - Season */
  id: Scalars['ID']['output'];
  /** Amount of underlying tokens redeemable for 1e(decimals) of this wrapped token */
  redeemRate: Scalars['BigInt']['output'];
  /** The season for this snapshot */
  season: Scalars['Int']['output'];
  /** Hourly Silo stats for this wrapped deposit contract */
  siloHourlySnapshot: SiloHourlySnapshot;
  /** Total token supply */
  supply: Scalars['BigInt']['output'];
  /** WrappedDepositERC20 associated with this snapshot */
  token: WrappedDepositErc20;
  /** Timestamp of last entity update */
  updatedAt: Scalars['BigInt']['output'];
};

export type WrappedDepositErc20HourlySnapshotFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WrappedDepositErc20HourlySnapshotFilter>>>;
  apy7d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy7d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy24h?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy24h_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy30d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy30d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy90d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy90d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRedeemRate?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaRedeemRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaRedeemRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deltaSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  deltaSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WrappedDepositErc20HourlySnapshotFilter>>>;
  redeemRate?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  redeemRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  season?: InputMaybe<Scalars['Int']['input']>;
  season_gt?: InputMaybe<Scalars['Int']['input']>;
  season_gte?: InputMaybe<Scalars['Int']['input']>;
  season_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  season_lt?: InputMaybe<Scalars['Int']['input']>;
  season_lte?: InputMaybe<Scalars['Int']['input']>;
  season_not?: InputMaybe<Scalars['Int']['input']>;
  season_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  siloHourlySnapshot?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_?: InputMaybe<SiloHourlySnapshotFilter>;
  siloHourlySnapshot_contains?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_gt?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_gte?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloHourlySnapshot_lt?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_lte?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_not?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  siloHourlySnapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  siloHourlySnapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<WrappedDepositErc20Filter>;
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

export enum WrappedDepositErc20HourlySnapshotOrderBy {
  apy7d = 'apy7d',
  apy24h = 'apy24h',
  apy30d = 'apy30d',
  apy90d = 'apy90d',
  createdAt = 'createdAt',
  deltaRedeemRate = 'deltaRedeemRate',
  deltaSupply = 'deltaSupply',
  id = 'id',
  redeemRate = 'redeemRate',
  season = 'season',
  siloHourlySnapshot = 'siloHourlySnapshot',
  siloHourlySnapshot__activeFarmers = 'siloHourlySnapshot__activeFarmers',
  siloHourlySnapshot__avgConvertDownPenalty = 'siloHourlySnapshot__avgConvertDownPenalty',
  siloHourlySnapshot__avgGrownStalkPerBdvPerSeason = 'siloHourlySnapshot__avgGrownStalkPerBdvPerSeason',
  siloHourlySnapshot__beanMints = 'siloHourlySnapshot__beanMints',
  siloHourlySnapshot__beanToMaxLpGpPerBdvRatio = 'siloHourlySnapshot__beanToMaxLpGpPerBdvRatio',
  siloHourlySnapshot__bonusStalkConvertUp = 'siloHourlySnapshot__bonusStalkConvertUp',
  siloHourlySnapshot__caseId = 'siloHourlySnapshot__caseId',
  siloHourlySnapshot__convertDownPenalty = 'siloHourlySnapshot__convertDownPenalty',
  siloHourlySnapshot__createdAt = 'siloHourlySnapshot__createdAt',
  siloHourlySnapshot__cropRatio = 'siloHourlySnapshot__cropRatio',
  siloHourlySnapshot__deltaActiveFarmers = 'siloHourlySnapshot__deltaActiveFarmers',
  siloHourlySnapshot__deltaAvgConvertDownPenalty = 'siloHourlySnapshot__deltaAvgConvertDownPenalty',
  siloHourlySnapshot__deltaAvgGrownStalkPerBdvPerSeason = 'siloHourlySnapshot__deltaAvgGrownStalkPerBdvPerSeason',
  siloHourlySnapshot__deltaBeanMints = 'siloHourlySnapshot__deltaBeanMints',
  siloHourlySnapshot__deltaBeanToMaxLpGpPerBdvRatio = 'siloHourlySnapshot__deltaBeanToMaxLpGpPerBdvRatio',
  siloHourlySnapshot__deltaBonusStalkConvertUp = 'siloHourlySnapshot__deltaBonusStalkConvertUp',
  siloHourlySnapshot__deltaConvertDownPenalty = 'siloHourlySnapshot__deltaConvertDownPenalty',
  siloHourlySnapshot__deltaCropRatio = 'siloHourlySnapshot__deltaCropRatio',
  siloHourlySnapshot__deltaDepositedBDV = 'siloHourlySnapshot__deltaDepositedBDV',
  siloHourlySnapshot__deltaGerminatingStalk = 'siloHourlySnapshot__deltaGerminatingStalk',
  siloHourlySnapshot__deltaGrownStalkPerSeason = 'siloHourlySnapshot__deltaGrownStalkPerSeason',
  siloHourlySnapshot__deltaPenalizedStalkConvertDown = 'siloHourlySnapshot__deltaPenalizedStalkConvertDown',
  siloHourlySnapshot__deltaPlantableStalk = 'siloHourlySnapshot__deltaPlantableStalk',
  siloHourlySnapshot__deltaPlantedBeans = 'siloHourlySnapshot__deltaPlantedBeans',
  siloHourlySnapshot__deltaRoots = 'siloHourlySnapshot__deltaRoots',
  siloHourlySnapshot__deltaStalk = 'siloHourlySnapshot__deltaStalk',
  siloHourlySnapshot__deltaTotalBdvConvertUp = 'siloHourlySnapshot__deltaTotalBdvConvertUp',
  siloHourlySnapshot__deltaTotalBdvConvertUpBonus = 'siloHourlySnapshot__deltaTotalBdvConvertUpBonus',
  siloHourlySnapshot__deltaUnpenalizedStalkConvertDown = 'siloHourlySnapshot__deltaUnpenalizedStalkConvertDown',
  siloHourlySnapshot__depositedBDV = 'siloHourlySnapshot__depositedBDV',
  siloHourlySnapshot__germinatingStalk = 'siloHourlySnapshot__germinatingStalk',
  siloHourlySnapshot__grownStalkPerSeason = 'siloHourlySnapshot__grownStalkPerSeason',
  siloHourlySnapshot__id = 'siloHourlySnapshot__id',
  siloHourlySnapshot__penalizedStalkConvertDown = 'siloHourlySnapshot__penalizedStalkConvertDown',
  siloHourlySnapshot__plantableStalk = 'siloHourlySnapshot__plantableStalk',
  siloHourlySnapshot__plantedBeans = 'siloHourlySnapshot__plantedBeans',
  siloHourlySnapshot__roots = 'siloHourlySnapshot__roots',
  siloHourlySnapshot__season = 'siloHourlySnapshot__season',
  siloHourlySnapshot__stalk = 'siloHourlySnapshot__stalk',
  siloHourlySnapshot__totalBdvConvertUp = 'siloHourlySnapshot__totalBdvConvertUp',
  siloHourlySnapshot__totalBdvConvertUpBonus = 'siloHourlySnapshot__totalBdvConvertUpBonus',
  siloHourlySnapshot__unpenalizedStalkConvertDown = 'siloHourlySnapshot__unpenalizedStalkConvertDown',
  siloHourlySnapshot__updatedAt = 'siloHourlySnapshot__updatedAt',
  supply = 'supply',
  token = 'token',
  token__apy7d = 'token__apy7d',
  token__apy24h = 'token__apy24h',
  token__apy30d = 'token__apy30d',
  token__apy90d = 'token__apy90d',
  token__decimals = 'token__decimals',
  token__id = 'token__id',
  token__lastDailySnapshotDay = 'token__lastDailySnapshotDay',
  token__lastHourlySnapshotSeason = 'token__lastHourlySnapshotSeason',
  token__redeemRate = 'token__redeemRate',
  token__supply = 'token__supply',
  updatedAt = 'updatedAt'
}

export type WrappedDepositErc20Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WrappedDepositErc20Filter>>>;
  apy7d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy7d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy7d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy24h?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy24h_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy24h_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy30d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy30d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy30d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy90d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apy90d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apy90d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beanstalk?: InputMaybe<Scalars['String']['input']>;
  beanstalk_?: InputMaybe<BeanstalkFilter>;
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
  dailySnapshots_?: InputMaybe<WrappedDepositErc20DailySnapshotFilter>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlySnapshots_?: InputMaybe<WrappedDepositErc20HourlySnapshotFilter>;
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
  or?: InputMaybe<Array<InputMaybe<WrappedDepositErc20Filter>>>;
  redeemRate?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  redeemRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  redeemRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  silo?: InputMaybe<Scalars['String']['input']>;
  silo_?: InputMaybe<SiloFilter>;
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
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  underlyingAsset?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_?: InputMaybe<WhitelistTokenSettingFilter>;
  underlyingAsset_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_gt?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_gte?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingAsset_lt?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_lte?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_not?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_not_contains?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  underlyingAsset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_starts_with?: InputMaybe<Scalars['String']['input']>;
  underlyingAsset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum WrappedDepositErc20OrderBy {
  apy7d = 'apy7d',
  apy24h = 'apy24h',
  apy30d = 'apy30d',
  apy90d = 'apy90d',
  beanstalk = 'beanstalk',
  beanstalk__fertilizer1155 = 'beanstalk__fertilizer1155',
  beanstalk__id = 'beanstalk__id',
  beanstalk__lastSeason = 'beanstalk__lastSeason',
  beanstalk__token = 'beanstalk__token',
  dailySnapshots = 'dailySnapshots',
  decimals = 'decimals',
  hourlySnapshots = 'hourlySnapshots',
  id = 'id',
  lastDailySnapshotDay = 'lastDailySnapshotDay',
  lastHourlySnapshotSeason = 'lastHourlySnapshotSeason',
  redeemRate = 'redeemRate',
  silo = 'silo',
  silo__activeFarmers = 'silo__activeFarmers',
  silo__avgConvertDownPenalty = 'silo__avgConvertDownPenalty',
  silo__avgGrownStalkPerBdvPerSeason = 'silo__avgGrownStalkPerBdvPerSeason',
  silo__beanMints = 'silo__beanMints',
  silo__beanToMaxLpGpPerBdvRatio = 'silo__beanToMaxLpGpPerBdvRatio',
  silo__bonusStalkConvertUp = 'silo__bonusStalkConvertUp',
  silo__convertDownPenalty = 'silo__convertDownPenalty',
  silo__cropRatio = 'silo__cropRatio',
  silo__depositedBDV = 'silo__depositedBDV',
  silo__germinatingStalk = 'silo__germinatingStalk',
  silo__grownStalkPerSeason = 'silo__grownStalkPerSeason',
  silo__id = 'silo__id',
  silo__lastDailySnapshotDay = 'silo__lastDailySnapshotDay',
  silo__lastHourlySnapshotSeason = 'silo__lastHourlySnapshotSeason',
  silo__penalizedStalkConvertDown = 'silo__penalizedStalkConvertDown',
  silo__plantableStalk = 'silo__plantableStalk',
  silo__plantedBeans = 'silo__plantedBeans',
  silo__roots = 'silo__roots',
  silo__stalk = 'silo__stalk',
  silo__totalBdvConvertUp = 'silo__totalBdvConvertUp',
  silo__totalBdvConvertUpBonus = 'silo__totalBdvConvertUpBonus',
  silo__unmigratedL1DepositedBdv = 'silo__unmigratedL1DepositedBdv',
  silo__unpenalizedStalkConvertDown = 'silo__unpenalizedStalkConvertDown',
  supply = 'supply',
  underlyingAsset = 'underlyingAsset',
  underlyingAsset__decimals = 'underlyingAsset__decimals',
  underlyingAsset__gaugePoints = 'underlyingAsset__gaugePoints',
  underlyingAsset__id = 'underlyingAsset__id',
  underlyingAsset__isGaugeEnabled = 'underlyingAsset__isGaugeEnabled',
  underlyingAsset__lastDailySnapshotDay = 'underlyingAsset__lastDailySnapshotDay',
  underlyingAsset__lastHourlySnapshotSeason = 'underlyingAsset__lastHourlySnapshotSeason',
  underlyingAsset__milestoneSeason = 'underlyingAsset__milestoneSeason',
  underlyingAsset__optimalPercentDepositedBdv = 'underlyingAsset__optimalPercentDepositedBdv',
  underlyingAsset__selector = 'underlyingAsset__selector',
  underlyingAsset__stalkEarnedPerSeason = 'underlyingAsset__stalkEarnedPerSeason',
  underlyingAsset__stalkIssuedPerBdv = 'underlyingAsset__stalkIssuedPerBdv',
  underlyingAsset__stemTip = 'underlyingAsset__stemTip',
  underlyingAsset__updatedAt = 'underlyingAsset__updatedAt'
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

export type BeanstalkAdvancedChartQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BeanstalkAdvancedChartQuery = { __typename?: 'Query', seasons: Array<{ __typename?: 'Season', id: string, sunriseBlock: any, rewardBeans: any, price: any, deltaBeans: any, raining: boolean, season: number, createdAt: any }>, fieldHourlySnapshots: Array<{ __typename?: 'FieldHourlySnapshot', id: string, caseId?: any | null, issuedSoil: any, deltaSownBeans: any, sownBeans: any, deltaPodDemand: any, blocksToSoldOutSoil?: any | null, podRate: any, temperature: any, deltaTemperature: any, season: number, cultivationTemperature?: any | null, harvestableIndex: any, harvestablePods: any, harvestedPods: any, numberOfSowers: number, numberOfSows: number, podIndex: any, realRateOfReturn: any, seasonBlock: any, soil: any, soilSoldOut: boolean, unharvestablePods: any }>, siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, beanToMaxLpGpPerBdvRatio: any, deltaBeanToMaxLpGpPerBdvRatio: any, season: number, stalk: any, cropRatio: any, deltaCropRatio: any }>, gaugesInfoHourlySnapshots: Array<{ __typename?: 'GaugesInfoHourlySnapshot', id: string, g0CultivationFactor?: any | null, g1BlightFactor?: any | null, g1ConvertDownPenalty?: any | null, g2BdvConvertedThisSeason?: any | null, g2BonusStalkPerBdv?: any | null, g2MaxConvertCapacity?: any | null }> };

export type FarmerPlotsQueryVariables = Exact<{
  account: Scalars['ID']['input'];
}>;


export type FarmerPlotsQuery = { __typename?: 'Query', farmer?: { __typename?: 'Farmer', plots: Array<{ __typename?: 'Plot', beansPerPod: any, createdAt: any, creationHash: any, fullyHarvested: boolean, harvestablePods: any, harvestedPods: any, id: string, index: any, pods: any, season: number, source: PlotSource, sourceHash: any, preTransferSource?: PlotSource | null, updatedAt: any, updatedAtBlock: any, preTransferOwner?: { __typename?: 'Farmer', id: any } | null, listing?: { __typename?: 'PodListing', id: string } | null }> } | null };

export type FarmerSiloBalancesQueryVariables = Exact<{
  account: Scalars['ID']['input'];
  season: Scalars['Int']['input'];
}>;


export type FarmerSiloBalancesQuery = { __typename?: 'Query', farmer?: { __typename?: 'Farmer', deposited: Array<{ __typename?: 'SiloDeposit', season?: number | null, stem?: any | null, token: any, depositedAmount: any, depositedBDV: any }>, withdrawn: Array<{ __typename?: 'SiloWithdraw', token: any, amount: any, season: number }>, claimable: Array<{ __typename?: 'SiloWithdraw', token: any, amount: any, season: number }> } | null };

export type FieldIssuedSoilQueryVariables = Exact<{
  season?: InputMaybe<Scalars['Int']['input']>;
  field_contains_nocase?: InputMaybe<Scalars['String']['input']>;
}>;


export type FieldIssuedSoilQuery = { __typename?: 'Query', fieldHourlySnapshots: Array<{ __typename?: 'FieldHourlySnapshot', issuedSoil: any, season: number, soil: any }> };

export type FieldSnapshotsQueryVariables = Exact<{
  fieldId: Scalars['ID']['input'];
  first: Scalars['Int']['input'];
}>;


export type FieldSnapshotsQuery = { __typename?: 'Query', fieldHourlySnapshots: Array<{ __typename?: 'FieldHourlySnapshot', blocksToSoldOutSoil?: any | null, caseId?: any | null, deltaHarvestablePods: any, deltaHarvestedPods: any, deltaIssuedSoil: any, deltaNumberOfSowers: number, deltaNumberOfSows: number, deltaPodIndex: any, deltaPodRate: any, deltaRealRateOfReturn: any, deltaSoil: any, deltaSownBeans: any, deltaTemperature: any, deltaUnharvestablePods: any, harvestablePods: any, harvestedPods: any, id: string, issuedSoil: any, numberOfSowers: number, numberOfSows: number, podIndex: any, podRate: any, realRateOfReturn: any, season: number, seasonBlock: any, soil: any, soilSoldOut: boolean, sownBeans: any, temperature: any, unharvestablePods: any, updatedAt: any }> };

export type BeanstalkSeasonsTableQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BeanstalkSeasonsTableQuery = { __typename?: 'Query', seasons: Array<{ __typename?: 'Season', id: string, sunriseBlock: any, rewardBeans: any, price: any, deltaBeans: any, raining: boolean, season: number }>, fieldHourlySnapshots: Array<{ __typename?: 'FieldHourlySnapshot', id: string, caseId?: any | null, issuedSoil: any, deltaSownBeans: any, sownBeans: any, deltaPodDemand: any, blocksToSoldOutSoil?: any | null, podRate: any, temperature: any, deltaTemperature: any, season: number }>, siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, beanToMaxLpGpPerBdvRatio: any, deltaBeanToMaxLpGpPerBdvRatio: any, season: number }> };

export type SiloSnapshotsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  id: Scalars['Bytes']['input'];
}>;


export type SiloSnapshotsQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', beanToMaxLpGpPerBdvRatio: any, deltaBeanMints: any, season: number }> };

export type SiloYieldsQueryVariables = Exact<{ [key: string]: never; }>;


export type SiloYieldsQuery = { __typename?: 'Query', siloYields: Array<{ __typename?: 'SiloYield', beansPerSeasonEMA: any, beta: any, createdAt: any, season: number, id: string, u: number, whitelistedTokens: Array<any>, emaWindow: EmaWindow, tokenAPYS: Array<{ __typename?: 'TokenYield', beanAPY: any, stalkAPY: any, season: number, createdAt: any, token: any }> }> };

export type AllMarketActivityQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  listings_createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  orders_createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fill_createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
}>;


export type AllMarketActivityQuery = { __typename?: 'Query', podListings: Array<{ __typename?: 'PodListing', id: string, historyID: string, index: any, start: any, mode: number, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxHarvestableIndex: any, minFillAmount: any, originalIndex: any, originalPlaceInLine: any, originalAmount: any, filled: any, amount: any, remainingAmount: any, filledAmount: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any }, fill?: { __typename?: 'PodFill', placeInLine: any } | null }>, podOrders: Array<{ __typename?: 'PodOrder', id: string, historyID: string, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxPlaceInLine: any, minFillAmount: any, beanAmount: any, podAmountFilled: any, beanAmountFilled: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } }>, podFills: Array<{ __typename?: 'PodFill', id: string, placeInLine: any, amount: any, index: any, start: any, costInBeans: any, createdAt: any, fromFarmer: { __typename?: 'Farmer', id: any }, toFarmer: { __typename?: 'Farmer', id: any }, listing?: { __typename?: 'PodListing', id: string, originalAmount: any } | null, order?: { __typename?: 'PodOrder', id: string, beanAmount: any } | null }> };

export type AllPodListingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<MarketStatus>;
  maxHarvestableIndex: Scalars['BigInt']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllPodListingsQuery = { __typename?: 'Query', podListings: Array<{ __typename?: 'PodListing', id: string, historyID: string, index: any, start: any, mode: number, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxHarvestableIndex: any, minFillAmount: any, originalIndex: any, originalPlaceInLine: any, originalAmount: any, filled: any, amount: any, remainingAmount: any, filledAmount: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any }, fill?: { __typename?: 'PodFill', placeInLine: any } | null }> };

export type AllPodOrdersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<MarketStatus>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllPodOrdersQuery = { __typename?: 'Query', podOrders: Array<{ __typename?: 'PodOrder', id: string, historyID: string, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxPlaceInLine: any, minFillAmount: any, beanAmount: any, podAmountFilled: any, beanAmountFilled: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } }> };

export type FarmerMarketActivityQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  account: Scalars['String']['input'];
  listings_createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  orders_createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  fill_createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
}>;


export type FarmerMarketActivityQuery = { __typename?: 'Query', podListings: Array<{ __typename?: 'PodListing', id: string, historyID: string, index: any, start: any, mode: number, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxHarvestableIndex: any, minFillAmount: any, originalIndex: any, originalPlaceInLine: any, originalAmount: any, filled: any, amount: any, remainingAmount: any, filledAmount: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any }, fill?: { __typename?: 'PodFill', placeInLine: any } | null }>, podOrders: Array<{ __typename?: 'PodOrder', id: string, historyID: string, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxPlaceInLine: any, minFillAmount: any, beanAmount: any, podAmountFilled: any, beanAmountFilled: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } }>, podFills: Array<{ __typename?: 'PodFill', id: string, placeInLine: any, amount: any, index: any, start: any, costInBeans: any, createdAt: any, fromFarmer: { __typename?: 'Farmer', id: any }, toFarmer: { __typename?: 'Farmer', id: any }, listing?: { __typename?: 'PodListing', id: string, originalAmount: any } | null, order?: { __typename?: 'PodOrder', id: string, beanAmount: any } | null }> };

export type PodFillFragment = { __typename?: 'PodFill', id: string, placeInLine: any, amount: any, index: any, start: any, costInBeans: any, createdAt: any, fromFarmer: { __typename?: 'Farmer', id: any }, toFarmer: { __typename?: 'Farmer', id: any }, listing?: { __typename?: 'PodListing', id: string, originalAmount: any } | null, order?: { __typename?: 'PodOrder', id: string, beanAmount: any } | null };

export type PodListingFragment = { __typename?: 'PodListing', id: string, historyID: string, index: any, start: any, mode: number, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxHarvestableIndex: any, minFillAmount: any, originalIndex: any, originalPlaceInLine: any, originalAmount: any, filled: any, amount: any, remainingAmount: any, filledAmount: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any }, fill?: { __typename?: 'PodFill', placeInLine: any } | null };

export type PodOrderFragment = { __typename?: 'PodOrder', id: string, historyID: string, pricingType?: number | null, pricePerPod: number, pricingFunction?: any | null, maxPlaceInLine: any, minFillAmount: any, beanAmount: any, podAmountFilled: any, beanAmountFilled: any, status: MarketStatus, createdAt: any, updatedAt: any, creationHash: any, farmer: { __typename?: 'Farmer', id: any } };

export type FarmerReferralQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FarmerReferralQuery = { __typename?: 'Query', farmer?: { __typename?: 'Farmer', id: any, totalReferralRewardPodsReceived: any, refereeCount: number } | null };

export type ReferralLeaderboardQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  block?: InputMaybe<BlockHeight>;
}>;


export type ReferralLeaderboardQuery = { __typename?: 'Query', farmers: Array<{ __typename?: 'Farmer', id: any, refereeCount: number, totalReferralRewardPodsReceived: any }> };

export type FarmerSeasonalSiloQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
  account?: InputMaybe<Scalars['String']['input']>;
}>;


export type FarmerSeasonalSiloQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, season: number, createdAt: any, plantedBeans: any, stalk: any, germinatingStalk: any, depositedBDV: any }> };

export type FarmerSeasonalSiloAssetTokenQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
  siloAsset?: InputMaybe<Scalars['String']['input']>;
}>;


export type FarmerSeasonalSiloAssetTokenQuery = { __typename?: 'Query', siloAssetHourlySnapshots: Array<{ __typename?: 'SiloAssetHourlySnapshot', id: string, season: number, depositedAmount: any, depositedBDV: any, deltaDepositedBDV: any, deltaDepositedAmount: any, createdAt: any }> };

export type BeanstalkSeasonalSiloActiveFarmersQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
  silo?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkSeasonalSiloActiveFarmersQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, season: number, activeFarmers: number }> };

export type BeanstalkSeasonalFieldQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
  field?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkSeasonalFieldQuery = { __typename?: 'Query', fieldHourlySnapshots: Array<{ __typename?: 'FieldHourlySnapshot', id: string, season: number, podRate: any, temperature: any, podIndex: any, harvestableIndex: any, sownBeans: any, harvestedPods: any, cultivationFactor?: any | null, cultivationTemperature?: any | null, issuedSoil: any, deltaSownBeans: any, createdAt: any }> };

export type SeasonalGaugesInfoQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SeasonalGaugesInfoQuery = { __typename?: 'Query', gaugesInfoHourlySnapshots: Array<{ __typename?: 'GaugesInfoHourlySnapshot', id: string, g2BonusStalkPerBdv?: any | null, g2MaxConvertCapacity?: any | null, season: number, createdAt: any }> };

export type BeanstalkSeasonalMarketPerformanceQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BeanstalkSeasonalMarketPerformanceQuery = { __typename?: 'Query', marketPerformanceSeasonals: Array<{ __typename?: 'MarketPerformanceSeasonal', id: string, season: number, timestamp?: any | null, thisSeasonTokenUsdPrices?: Array<any> | null, usdChange?: Array<any> | null, percentChange?: Array<any> | null, totalUsdChange?: any | null, totalPercentChange?: any | null, cumulativeUsdChange?: Array<any> | null, cumulativePercentChange?: Array<any> | null, cumulativeTotalUsdChange?: any | null, cumulativeTotalPercentChange?: any | null, silo: { __typename?: 'Silo', allWhitelistedTokens: Array<any> } }> };

export type SeasonalNewPintoSnapshotsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
}>;


export type SeasonalNewPintoSnapshotsQuery = { __typename?: 'Query', seasons: Array<{ __typename?: 'Season', season: number, deltaBeans: any, rewardBeans: any, floodSiloBeans: any, floodFieldBeans: any, incentiveBeans: any }> };

export type BeanstalkSeasonalSiloQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
  silo?: InputMaybe<Scalars['String']['input']>;
}>;


export type BeanstalkSeasonalSiloQuery = { __typename?: 'Query', siloHourlySnapshots: Array<{ __typename?: 'SiloHourlySnapshot', id: string, season: number, stalk: any, avgGrownStalkPerBdvPerSeason: any, depositedBDV: any, createdAt: any }> };

export type BeanstalkSeasonalWrappedDepositErc20QueryVariables = Exact<{
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}>;


export type BeanstalkSeasonalWrappedDepositErc20Query = { __typename?: 'Query', wrappedDepositERC20HourlySnapshots: Array<{ __typename?: 'WrappedDepositERC20HourlySnapshot', id: string, season: number, supply: any, redeemRate: any, apy24h?: any | null, apy7d?: any | null, apy30d?: any | null, apy90d?: any | null, createdAt: any }> };

export const PodFillFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodFill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodFill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"placeInLine"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"costInBeans"}},{"kind":"Field","name":{"kind":"Name","value":"fromFarmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toFarmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PodFillFragment, unknown>;
export const PodListingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"originalPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeInLine"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<PodListingFragment, unknown>;
export const PodOrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<PodOrderFragment, unknown>;
export const BeanstalkAdvancedChartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkAdvancedChart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sunriseBlock"}},{"kind":"Field","name":{"kind":"Name","value":"rewardBeans"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeans"}},{"kind":"Field","name":{"kind":"Name","value":"raining"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"StringValue","value":"0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"deltaPodDemand"}},{"kind":"Field","name":{"kind":"Name","value":"blocksToSoldOutSoil"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"cultivationTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"harvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"harvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSowers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSows"}},{"kind":"Field","name":{"kind":"Name","value":"podIndex"}},{"kind":"Field","name":{"kind":"Name","value":"realRateOfReturn"}},{"kind":"Field","name":{"kind":"Name","value":"seasonBlock"}},{"kind":"Field","name":{"kind":"Name","value":"soil"}},{"kind":"Field","name":{"kind":"Name","value":"soilSoldOut"}},{"kind":"Field","name":{"kind":"Name","value":"unharvestablePods"}}]}},{"kind":"Field","name":{"kind":"Name","value":"siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"silo"},"value":{"kind":"StringValue","value":"0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"beanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"cropRatio"}},{"kind":"Field","name":{"kind":"Name","value":"deltaCropRatio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gaugesInfoHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"g0CultivationFactor"}},{"kind":"Field","name":{"kind":"Name","value":"g1BlightFactor"}},{"kind":"Field","name":{"kind":"Name","value":"g1ConvertDownPenalty"}},{"kind":"Field","name":{"kind":"Name","value":"g2BdvConvertedThisSeason"}},{"kind":"Field","name":{"kind":"Name","value":"g2BonusStalkPerBdv"}},{"kind":"Field","name":{"kind":"Name","value":"g2MaxConvertCapacity"}}]}}]}}]} as unknown as DocumentNode<BeanstalkAdvancedChartQuery, BeanstalkAdvancedChartQueryVariables>;
export const FarmerPlotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerPlots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"farmer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pods_gt"},"value":{"kind":"StringValue","value":"50","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"fullyHarvested"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"index"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beansPerPod"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}},{"kind":"Field","name":{"kind":"Name","value":"fullyHarvested"}},{"kind":"Field","name":{"kind":"Name","value":"harvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"pods"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceHash"}},{"kind":"Field","name":{"kind":"Name","value":"preTransferSource"}},{"kind":"Field","name":{"kind":"Name","value":"preTransferOwner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAtBlock"}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FarmerPlotsQuery, FarmerPlotsQueryVariables>;
export const FarmerSiloBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerSiloBalances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"season"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"farmer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deposited"},"name":{"kind":"Name","value":"deposits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"depositedAmount_gt"},"value":{"kind":"IntValue","value":"0"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"stem"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"depositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"withdrawn"},"name":{"kind":"Name","value":"withdraws"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"withdrawSeason"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"claimableSeason_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"season"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"claimed"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"season"},"name":{"kind":"Name","value":"withdrawSeason"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"claimable"},"name":{"kind":"Name","value":"withdraws"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"withdrawSeason"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"claimableSeason_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"season"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"claimed"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"season"},"name":{"kind":"Name","value":"withdrawSeason"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]}}]} as unknown as DocumentNode<FarmerSiloBalancesQuery, FarmerSiloBalancesQueryVariables>;
export const FieldIssuedSoilDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fieldIssuedSoil"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"season"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"field_contains_nocase"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season"},"value":{"kind":"Variable","name":{"kind":"Name","value":"season"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"field_contains_nocase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field_contains_nocase"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"soil"}}]}}]}}]} as unknown as DocumentNode<FieldIssuedSoilQuery, FieldIssuedSoilQueryVariables>;
export const FieldSnapshotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FieldSnapshots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field_"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blocksToSoldOutSoil"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}},{"kind":"Field","name":{"kind":"Name","value":"deltaHarvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"deltaHarvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"deltaIssuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaNumberOfSowers"}},{"kind":"Field","name":{"kind":"Name","value":"deltaNumberOfSows"}},{"kind":"Field","name":{"kind":"Name","value":"deltaPodIndex"}},{"kind":"Field","name":{"kind":"Name","value":"deltaPodRate"}},{"kind":"Field","name":{"kind":"Name","value":"deltaRealRateOfReturn"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"deltaUnharvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSowers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfSows"}},{"kind":"Field","name":{"kind":"Name","value":"podIndex"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"realRateOfReturn"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"seasonBlock"}},{"kind":"Field","name":{"kind":"Name","value":"soil"}},{"kind":"Field","name":{"kind":"Name","value":"soilSoldOut"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"unharvestablePods"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FieldSnapshotsQuery, FieldSnapshotsQueryVariables>;
export const BeanstalkSeasonsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sunriseBlock"}},{"kind":"Field","name":{"kind":"Name","value":"rewardBeans"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeans"}},{"kind":"Field","name":{"kind":"Name","value":"raining"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"StringValue","value":"0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"caseId"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"deltaPodDemand"}},{"kind":"Field","name":{"kind":"Name","value":"blocksToSoldOutSoil"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"deltaTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}},{"kind":"Field","name":{"kind":"Name","value":"siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"silo"},"value":{"kind":"StringValue","value":"0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"beanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonsTableQuery, BeanstalkSeasonsTableQueryVariables>;
export const SiloSnapshotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SiloSnapshots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bytes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"silo_"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beanToMaxLpGpPerBdvRatio"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeanMints"}},{"kind":"Field","name":{"kind":"Name","value":"season"}}]}}]}}]} as unknown as DocumentNode<SiloSnapshotsQuery, SiloSnapshotsQueryVariables>;
export const SiloYieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SiloYields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloYields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"emaWindow"},"value":{"kind":"EnumValue","value":"ROLLING_30_DAY"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beansPerSeasonEMA"}},{"kind":"Field","name":{"kind":"Name","value":"beta"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"u"}},{"kind":"Field","name":{"kind":"Name","value":"whitelistedTokens"}},{"kind":"Field","name":{"kind":"Name","value":"emaWindow"}},{"kind":"Field","name":{"kind":"Name","value":"tokenAPYS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beanAPY"}},{"kind":"Field","name":{"kind":"Name","value":"stalkAPY"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]}}]} as unknown as DocumentNode<SiloYieldsQuery, SiloYieldsQueryVariables>;
export const AllMarketActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllMarketActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listings_createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orders_createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fill_createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podListings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listings_createdAt_gt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"status_not"},"value":{"kind":"EnumValue","value":"FILLED_PARTIAL"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodListing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"podOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"createdAt"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orders_createdAt_gt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"podFills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fill_createdAt_gt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodFill"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"originalPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeInLine"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodFill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodFill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"placeInLine"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"costInBeans"}},{"kind":"Field","name":{"kind":"Name","value":"fromFarmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toFarmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AllMarketActivityQuery, AllMarketActivityQueryVariables>;
export const AllPodListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPodListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketStatus"}},"defaultValue":{"kind":"EnumValue","value":"ACTIVE"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxHarvestableIndex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podListings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"maxHarvestableIndex_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxHarvestableIndex"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"remainingAmount_gt"},"value":{"kind":"StringValue","value":"100000","block":false}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"index"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodListing"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"originalPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeInLine"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<AllPodListingsQuery, AllPodListingsQueryVariables>;
export const AllPodOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPodOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketStatus"}},"defaultValue":{"kind":"EnumValue","value":"ACTIVE"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"createdAt"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodOrder"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}}]} as unknown as DocumentNode<AllPodOrdersQuery, AllPodOrdersQueryVariables>;
export const FarmerMarketActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerMarketActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1000"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listings_createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orders_createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fill_createdAt_gt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"podListings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"farmer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listings_createdAt_gt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"status_not"},"value":{"kind":"EnumValue","value":"FILLED_PARTIAL"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodListing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"podOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"createdAt"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"farmer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orders_createdAt_gt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"podFills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fill_createdAt_gt"}}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"fromFarmer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"toFarmer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}}]}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PodFill"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodListing"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodListing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxHarvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"originalIndex"}},{"kind":"Field","name":{"kind":"Name","value":"originalPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filled"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"filledAmount"}},{"kind":"Field","name":{"kind":"Name","value":"fill"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeInLine"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodOrder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"farmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historyID"}},{"kind":"Field","name":{"kind":"Name","value":"pricingType"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerPod"}},{"kind":"Field","name":{"kind":"Name","value":"pricingFunction"}},{"kind":"Field","name":{"kind":"Name","value":"maxPlaceInLine"}},{"kind":"Field","name":{"kind":"Name","value":"minFillAmount"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}},{"kind":"Field","name":{"kind":"Name","value":"podAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmountFilled"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creationHash"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PodFill"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PodFill"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"placeInLine"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"costInBeans"}},{"kind":"Field","name":{"kind":"Name","value":"fromFarmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toFarmer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"listing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"beanAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<FarmerMarketActivityQuery, FarmerMarketActivityQueryVariables>;
export const FarmerReferralDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerReferral"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"farmer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalReferralRewardPodsReceived"}},{"kind":"Field","name":{"kind":"Name","value":"refereeCount"}}]}}]}}]} as unknown as DocumentNode<FarmerReferralQuery, FarmerReferralQueryVariables>;
export const ReferralLeaderboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReferralLeaderboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"block"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Block_height"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"farmers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"totalReferralRewardPodsReceived"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"refereeCount_gte"},"value":{"kind":"IntValue","value":"0"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"block"},"value":{"kind":"Variable","name":{"kind":"Name","value":"block"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"refereeCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalReferralRewardPodsReceived"}}]}}]}}]} as unknown as DocumentNode<ReferralLeaderboardQuery, ReferralLeaderboardQueryVariables>;
export const FarmerSeasonalSiloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerSeasonalSilo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"account"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"silo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"account"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"plantedBeans"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"germinatingStalk"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}}]}}]}}]} as unknown as DocumentNode<FarmerSeasonalSiloQuery, FarmerSeasonalSiloQueryVariables>;
export const FarmerSeasonalSiloAssetTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FarmerSeasonalSiloAssetToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"siloAsset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloAssetHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"siloAsset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"siloAsset"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"depositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"deltaDepositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"deltaDepositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<FarmerSeasonalSiloAssetTokenQuery, FarmerSeasonalSiloAssetTokenQueryVariables>;
export const BeanstalkSeasonalSiloActiveFarmersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalSiloActiveFarmers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"silo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"silo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"silo"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stalk_gt"},"value":{"kind":"IntValue","value":"0"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"activeFarmers"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalSiloActiveFarmersQuery, BeanstalkSeasonalSiloActiveFarmersQueryVariables>;
export const BeanstalkSeasonalFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"field"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"podRate"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"podIndex"}},{"kind":"Field","name":{"kind":"Name","value":"harvestableIndex"}},{"kind":"Field","name":{"kind":"Name","value":"sownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"harvestedPods"}},{"kind":"Field","name":{"kind":"Name","value":"cultivationFactor"}},{"kind":"Field","name":{"kind":"Name","value":"cultivationTemperature"}},{"kind":"Field","name":{"kind":"Name","value":"issuedSoil"}},{"kind":"Field","name":{"kind":"Name","value":"deltaSownBeans"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalFieldQuery, BeanstalkSeasonalFieldQueryVariables>;
export const SeasonalGaugesInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SeasonalGaugesInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaugesInfoHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"g2BonusStalkPerBdv"}},{"kind":"Field","name":{"kind":"Name","value":"g2MaxConvertCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SeasonalGaugesInfoQuery, SeasonalGaugesInfoQueryVariables>;
export const BeanstalkSeasonalMarketPerformanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalMarketPerformance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketPerformanceSeasonals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"valid"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"thisSeasonTokenUsdPrices"}},{"kind":"Field","name":{"kind":"Name","value":"usdChange"}},{"kind":"Field","name":{"kind":"Name","value":"percentChange"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsdChange"}},{"kind":"Field","name":{"kind":"Name","value":"totalPercentChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeUsdChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativePercentChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeTotalUsdChange"}},{"kind":"Field","name":{"kind":"Name","value":"cumulativeTotalPercentChange"}},{"kind":"Field","name":{"kind":"Name","value":"silo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allWhitelistedTokens"}}]}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalMarketPerformanceQuery, BeanstalkSeasonalMarketPerformanceQueryVariables>;
export const SeasonalNewPintoSnapshotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SeasonalNewPintoSnapshots"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"deltaBeans"}},{"kind":"Field","name":{"kind":"Name","value":"rewardBeans"}},{"kind":"Field","name":{"kind":"Name","value":"floodSiloBeans"}},{"kind":"Field","name":{"kind":"Name","value":"floodFieldBeans"}},{"kind":"Field","name":{"kind":"Name","value":"incentiveBeans"}}]}}]}}]} as unknown as DocumentNode<SeasonalNewPintoSnapshotsQuery, SeasonalNewPintoSnapshotsQueryVariables>;
export const BeanstalkSeasonalSiloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalSilo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"silo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siloHourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"silo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"silo"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"stalk"}},{"kind":"Field","name":{"kind":"Name","value":"avgGrownStalkPerBdvPerSeason"}},{"kind":"Field","name":{"kind":"Name","value":"depositedBDV"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalSiloQuery, BeanstalkSeasonalSiloQueryVariables>;
export const BeanstalkSeasonalWrappedDepositErc20Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BeanstalkSeasonalWrappedDepositERC20"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wrappedDepositERC20HourlySnapshots"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"season_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"season_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"season"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1000"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"supply"}},{"kind":"Field","name":{"kind":"Name","value":"redeemRate"}},{"kind":"Field","name":{"kind":"Name","value":"apy24h"}},{"kind":"Field","name":{"kind":"Name","value":"apy7d"}},{"kind":"Field","name":{"kind":"Name","value":"apy30d"}},{"kind":"Field","name":{"kind":"Name","value":"apy90d"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<BeanstalkSeasonalWrappedDepositErc20Query, BeanstalkSeasonalWrappedDepositErc20QueryVariables>;