import assert from "node:assert/strict";
import { test } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { hashFn, readContractQueryKey } from "@wagmi/core/query";
import { queryKeys } from "@/state/queryKeys";
import { refreshAfterTractorExecution } from "../tractorQueryRefresh";

test("execution refreshes separate Tractor progress/execution caches and live protocol reads", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { queryKeyHashFn: hashFn } } });
  const diamond = "0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f";
  const live = readContractQueryKey({ chainId: 8453, address: diamond, functionName: "totalSoil" });
  const historical = readContractQueryKey({ chainId: 8453, address: diamond, blockNumber: 100n });
  const otherChain = readContractQueryKey({ chainId: 1, address: diamond });
  const refresh = [
    live,
    [...queryKeys.tractor.sowOrdersV0Chain(1, undefined), 8453, diamond, "all-publishers"],
    [...queryKeys.tractor.convertUpOrdersV0Chain(1), 8453, diamond, "all-publishers"],
    queryKeys.tractor.tractorEvents,
    queryKeys.tractor.tractorExecutionsChain(diamond, 1),
    queryKeys.tractor.sowOrdersV0({ publisher: diamond }),
    ["depositsWithLocks", 8453, diamond],
  ];
  const preserve = [historical, otherChain, ["unrelated"]];
  for (const key of [...refresh, ...preserve]) client.setQueryData(key, { cached: true });
  await refreshAfterTractorExecution(client, 8453, diamond);
  for (const key of refresh) assert.equal(client.getQueryState(key)?.isInvalidated, true);
  for (const key of preserve) assert.equal(client.getQueryState(key)?.isInvalidated, false);
  client.clear();
});
