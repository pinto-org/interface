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
    "query BeanAdvancedChart($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n        timestamp\n      }\n      crosses\n      marketCap\n      supply\n      supplyInPegLP\n    }\n  }\n}": typeof types.BeanAdvancedChartDocument,
    "query BeanSeasonsTable($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n      }\n    }\n  }\n}": typeof types.BeanSeasonsTableDocument,
    "query BeanSeasonalBean($from: Int, $to: Int) {\n  beanHourlySnapshots(\n    where: {season_: {season_gte: $from, season_lte: $to}}\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n  ) {\n    id\n    season {\n      season\n    }\n    supply\n    marketCap\n    instPrice\n    l2sr\n    liquidityUSD\n    createdTimestamp\n  }\n}": typeof types.BeanSeasonalBeanDocument,
};
const documents: Documents = {
    "query BeanAdvancedChart($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n        timestamp\n      }\n      crosses\n      marketCap\n      supply\n      supplyInPegLP\n    }\n  }\n}": types.BeanAdvancedChartDocument,
    "query BeanSeasonsTable($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n      }\n    }\n  }\n}": types.BeanSeasonsTableDocument,
    "query BeanSeasonalBean($from: Int, $to: Int) {\n  beanHourlySnapshots(\n    where: {season_: {season_gte: $from, season_lte: $to}}\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n  ) {\n    id\n    season {\n      season\n    }\n    supply\n    marketCap\n    instPrice\n    l2sr\n    liquidityUSD\n    createdTimestamp\n  }\n}": types.BeanSeasonalBeanDocument,
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
export function graphql(source: "query BeanAdvancedChart($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n        timestamp\n      }\n      crosses\n      marketCap\n      supply\n      supplyInPegLP\n    }\n  }\n}"): (typeof documents)["query BeanAdvancedChart($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n        timestamp\n      }\n      crosses\n      marketCap\n      supply\n      supplyInPegLP\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query BeanSeasonsTable($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n      }\n    }\n  }\n}"): (typeof documents)["query BeanSeasonsTable($from: Int, $to: Int) {\n  seasons(\n    first: 1000\n    orderBy: season\n    orderDirection: desc\n    where: {season_gte: $from, season_lte: $to}\n  ) {\n    id\n    timestamp\n    beanHourlySnapshot {\n      l2sr\n      twaPrice\n      instPrice\n      twaDeltaB\n      instDeltaB\n      season {\n        season\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query BeanSeasonalBean($from: Int, $to: Int) {\n  beanHourlySnapshots(\n    where: {season_: {season_gte: $from, season_lte: $to}}\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n  ) {\n    id\n    season {\n      season\n    }\n    supply\n    marketCap\n    instPrice\n    l2sr\n    liquidityUSD\n    createdTimestamp\n  }\n}"): (typeof documents)["query BeanSeasonalBean($from: Int, $to: Int) {\n  beanHourlySnapshots(\n    where: {season_: {season_gte: $from, season_lte: $to}}\n    first: 1000\n    orderBy: season__season\n    orderDirection: asc\n  ) {\n    id\n    season {\n      season\n    }\n    supply\n    marketCap\n    instPrice\n    l2sr\n    liquidityUSD\n    createdTimestamp\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;