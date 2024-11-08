import { TypedQueryDocumentNode } from "graphql";
import request, { RequestDocument } from "graphql-request";
import { Variables } from "node_modules/graphql-request/build/legacy/helpers/types";

export interface PaginationSettings<R, T, K extends keyof T, V> {
  primaryPropertyName: Extract<K, string>;
  idField: Extract<keyof R, string>;
  paginateField: Extract<keyof R, string>;
  paginateDirection: "asc" | "desc";
  loopCallback: (value1000: R, prevVars: V) => V | undefined;
}

// TODO(ss)
// Ideally order direction can be removed from the generated graphql
// Specify paginate field
// Specify order asc/desc

type ResultObject<T, K extends keyof T, R> = {
  [P in K]: R[];
};

export const paginateSubgraph = async <R, T, V extends Variables = Variables>(
  url: string,
  document: RequestDocument | TypedQueryDocumentNode<T, V>,
  initialVars: V,
  settings: PaginationSettings<R, T, keyof T, V>,
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

    vars = settings.loopCallback(results[k][999], vars);
  }

  return allResults;
};
