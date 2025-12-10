/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query BasinAdvancedChart($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: desc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeBuyVolumeUSD\n    cumulativeSellVolumeUSD\n    cumulativeTradeVolumeUSD\n    deltaBuyVolumeUSD\n    deltaSellVolumeUSD\n    deltaTradeVolumeUSD\n    cumulativeConvertUpVolumeUSD\n    cumulativeConvertDownVolumeUSD\n    cumulativeConvertVolumeUSD\n    cumulativeConvertNeutralTransferVolumeUSD\n    deltaConvertDownVolumeUSD\n    deltaConvertUpVolumeUSD\n    deltaConvertVolumeUSD\n    deltaConvertNeutralTransferVolumeUSD\n    totalLiquidityUSD\n    deltaLiquidityUSD\n  }\n}": typeof types.BasinAdvancedChartDocument,
    "query BasinSeasonalSummary($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeTradeVolumeUSD\n    cumulativeConvertVolumeUSD\n    totalLiquidityUSD\n  }\n}": typeof types.BasinSeasonalSummaryDocument,
};
const documents: Documents = {
    "query BasinAdvancedChart($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: desc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeBuyVolumeUSD\n    cumulativeSellVolumeUSD\n    cumulativeTradeVolumeUSD\n    deltaBuyVolumeUSD\n    deltaSellVolumeUSD\n    deltaTradeVolumeUSD\n    cumulativeConvertUpVolumeUSD\n    cumulativeConvertDownVolumeUSD\n    cumulativeConvertVolumeUSD\n    cumulativeConvertNeutralTransferVolumeUSD\n    deltaConvertDownVolumeUSD\n    deltaConvertUpVolumeUSD\n    deltaConvertVolumeUSD\n    deltaConvertNeutralTransferVolumeUSD\n    totalLiquidityUSD\n    deltaLiquidityUSD\n  }\n}": types.BasinAdvancedChartDocument,
    "query BasinSeasonalSummary($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeTradeVolumeUSD\n    cumulativeConvertVolumeUSD\n    totalLiquidityUSD\n  }\n}": types.BasinSeasonalSummaryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query BasinAdvancedChart($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: desc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeBuyVolumeUSD\n    cumulativeSellVolumeUSD\n    cumulativeTradeVolumeUSD\n    deltaBuyVolumeUSD\n    deltaSellVolumeUSD\n    deltaTradeVolumeUSD\n    cumulativeConvertUpVolumeUSD\n    cumulativeConvertDownVolumeUSD\n    cumulativeConvertVolumeUSD\n    cumulativeConvertNeutralTransferVolumeUSD\n    deltaConvertDownVolumeUSD\n    deltaConvertUpVolumeUSD\n    deltaConvertVolumeUSD\n    deltaConvertNeutralTransferVolumeUSD\n    totalLiquidityUSD\n    deltaLiquidityUSD\n  }\n}"): (typeof documents)["query BasinAdvancedChart($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: desc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeBuyVolumeUSD\n    cumulativeSellVolumeUSD\n    cumulativeTradeVolumeUSD\n    deltaBuyVolumeUSD\n    deltaSellVolumeUSD\n    deltaTradeVolumeUSD\n    cumulativeConvertUpVolumeUSD\n    cumulativeConvertDownVolumeUSD\n    cumulativeConvertVolumeUSD\n    cumulativeConvertNeutralTransferVolumeUSD\n    deltaConvertDownVolumeUSD\n    deltaConvertUpVolumeUSD\n    deltaConvertVolumeUSD\n    deltaConvertNeutralTransferVolumeUSD\n    totalLiquidityUSD\n    deltaLiquidityUSD\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query BasinSeasonalSummary($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeTradeVolumeUSD\n    cumulativeConvertVolumeUSD\n    totalLiquidityUSD\n  }\n}"): (typeof documents)["query BasinSeasonalSummary($from: Int, $to: Int) {\n  beanstalkHourlySnapshots(\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n    where: {season_: {season_gte: $from, season_lte: $to}}\n  ) {\n    id\n    createdTimestamp\n    season {\n      season\n    }\n    cumulativeTradeVolumeUSD\n    cumulativeConvertVolumeUSD\n    totalLiquidityUSD\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;