import { TypedQueryDocumentNode } from "graphql";
import request, { RequestDocument } from "graphql-request";

const PAGE_SIZE = 1000;

export interface PaginationSettings<R, T, K extends keyof T, V> {
  primaryPropertyName: Extract<K, string>;
  idField: Extract<keyof R, string>;
  nextVars: (value1000: R, prevVars: V) => V | undefined;
  orderBy?: 'asc' | 'desc';
}

type ResultObject<T, K extends keyof T, R> = {
  [P in K]: R[];
};

// Performs arbitrary pagination on subgraph queries. The graphql query interface limits to 1000 results
// and does not have suitable skip functionality. This function will make repeated queries until the
// result set is exhausted.
// The provided `document` must specify `first: 1000` and an orderBy/orderDirection.
// The actual pagination logic is specified by the caller in `settings.loopCallback`.
export const paginateSubgraph = async <R, T, V>(
  settings: PaginationSettings<R, T, keyof T, V>,
  url: string,
  document: RequestDocument | TypedQueryDocumentNode<T, V>,
  initialVars: V,
): Promise<R[]> => {
  let vars: V | undefined = initialVars;
  let prevPageIds: string[] = [];
  const k = settings.primaryPropertyName;

  const allResults: R[] = [];
  while (vars) {
    const results = (await request<T>(url, document, vars)) as ResultObject<T, typeof k, R>;

    if (results[k].length > 0 && !results[k][0][settings.idField]) {
      throw new Error(`The result did not include the identity column ${settings.idField}`);
    }

    const pageIds: string[] = [];
    for (const r of results[k]) {
      if (!prevPageIds.includes(r[settings.idField] as string)) {
        pageIds.push(r[settings.idField] as string);
        allResults.push(r);
      }
    }
    prevPageIds = pageIds;

    vars = settings.nextVars(results[k][PAGE_SIZE - 1], vars);
  }

  return allResults;
};

export const paginateMultiQuerySubgraph = async <R, T, V>(
  settings: PaginationSettings<R, T, keyof T, V>,
  url: string,
  document: RequestDocument | TypedQueryDocumentNode<T, V>,
  initialVars: V,
): Promise<{[key: string]: R[]}> => {
  let vars: V | undefined = initialVars;
  let prevPageIds: {[key: string] : string[]} = {};
  const k = 'id'//settings.primaryPropertyName;

  const allResults: {[key: string]: R[]} = {};
  while (vars) {
    const results = (await request<T>(url, document, vars)) as ResultObject<T, any, R>;

    Object.entries(results).forEach(([key, value]: [string, any]) => {

      if (!allResults[key]) {
        allResults[key] = [];
      }

      if (!prevPageIds[key]) {
        prevPageIds[key] = [];
      }

      if (value.length > 0 && !value[0][settings.idField]) {
        throw new Error(`The result did not include the identity column ${settings.idField}`);
      }

      const pageIds: string[] = [];

      for (const r of value) {
        if (!prevPageIds[key].includes(r[settings.idField] as string)) {
          pageIds.push(r[settings.idField] as string);
          allResults[key].push(r);
        }
      }
      prevPageIds[key] = pageIds;
    })

    const firstQueryKey = Object.keys(results)[0];
    vars = settings.nextVars(results[firstQueryKey][PAGE_SIZE - 1], vars);
  }

  return allResults;
};
