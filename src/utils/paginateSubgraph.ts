import { TypedQueryDocumentNode } from "graphql";
import request, { RequestDocument } from "graphql-request";
import { Variables, VariablesAndRequestHeadersArgs } from "node_modules/graphql-request/build/legacy/helpers/types";

export interface PaginationSettings<T, K extends keyof T, V> {
  primaryPropertyName: K;
  paginateField: string;
  paginateDirection: "asc" | "desc";
  loopCallback: (value1000: T[K] extends Array<infer U> ? U : never, prevVars: V) => V;
}

export const paginateSubgraph = async <T, K extends keyof T, V extends Variables = Variables>(
  url: string,
  document: RequestDocument | TypedQueryDocumentNode<T, V>,
  initialVars: V,
  settings: PaginationSettings<T, K, V>,
): Promise<T> => {
  //
  const results = await request<T>(url, document, initialVars);
  return results;
};
