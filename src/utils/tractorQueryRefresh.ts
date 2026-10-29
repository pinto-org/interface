import { queryKeys } from "@/state/queryKeys";
import type { QueryClient } from "@tanstack/react-query";
import { isProtocolSeasonQuery } from "./protocolSeasonRefresh";

export function refreshAfterTractorExecution(client: QueryClient, chainId: number, diamond: string) {
  return Promise.all([
    client.invalidateQueries({
      // Tractor keys contain the base array as their first element. The flat
      // ["TRACTOR"] prefix does not match those order/progress/execution keys.
      queryKey: [queryKeys.base.tractor],
      refetchType: "active",
    }),
    client.invalidateQueries({
      predicate: (query) => isProtocolSeasonQuery(query.queryKey, chainId, diamond),
      refetchType: "active",
    }),
  ]);
}
