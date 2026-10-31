import { TokenValue } from "@/classes/TokenValue";
import { useQueryKeys } from "@/state/useQueryKeys";
import { QueryClient } from "@tanstack/react-query";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

vi.mock("wagmi", () => ({ useChainId: () => 8453 }));

function queryKeys(props: Parameters<typeof useQueryKeys>[0]) {
  let result: ReturnType<typeof useQueryKeys> | undefined;
  function Probe() {
    result = useQueryKeys(props);
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  if (!result) throw new Error("Missing query keys");
  return result;
}

it("invalidates listing caches for both fields on the current chain after a mutation", async () => {
  const client = new QueryClient();
  const field0 = [
    ...queryKeys({ chainId: 8453, harvestableIndex: TokenValue.fromHuman(100, 6) }).allPodListings,
    { podMarketplaceId: "0" },
  ];
  const field1 = [
    ...queryKeys({ chainId: 8453, harvestableIndex: TokenValue.fromHuman(900, 6) }).allPodListings,
    { podMarketplaceId: "1" },
  ];
  const otherChain = [
    ...queryKeys({ chainId: 1, harvestableIndex: TokenValue.fromHuman(900, 6) }).allPodListings,
    { podMarketplaceId: "1" },
  ];
  for (const key of [field0, field1, otherChain]) client.setQueryData(key, { podListings: [] });
  // Create, fill and cancel mutations use this index-independent listing prefix.
  const mutationKeys = queryKeys({ chainId: 8453, account: "0x123" });
  await client.invalidateQueries({ queryKey: mutationKeys.allPodListings });
  expect(client.getQueryState(field1)?.isInvalidated).toBe(true);
  expect(client.getQueryState(field0)?.isInvalidated).toBe(true);
  expect(client.getQueryState(otherChain)?.isInvalidated).toBe(false);
  client.clear();
});
