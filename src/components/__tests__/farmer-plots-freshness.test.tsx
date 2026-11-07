import { useFarmerPlotsQuery } from "@/state/useFarmerField";
// @vitest-environment jsdom
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
const state = vi.hoisted(() => ({ account: "seller", amounts: { seller: 49, buyer: 0 } as Record<string, number> }));
vi.mock("wagmi", () => ({ useAccount: () => ({ address: state.account }), useChainId: () => 1337 }));
vi.mock("@/generated/contractHooks", () => ({
  useReadFarmer_GetPlotsFromAccount: ({ args, query }: { args: string[]; query: object }) =>
    useQuery({
      queryKey: ["plots", args[0]],
      queryFn: async () => state.amounts[args[0]],
      ...query,
    }),
}));
vi.mock("@/state/useFieldData", () => ({ useHarvestableIndex: () => null }));
const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const container = document.createElement("div");
const root = createRoot(container);
function Position() {
  const query = useFarmerPlotsQuery();
  return <div>{String(query.data)}</div>;
}
const render = async () => {
  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <Position />
      </QueryClientProvider>,
    );
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
};
afterEach(() => {
  act(() => root.unmount());
  client.clear();
});
test("returning to a cached seller position refetches after another wallet fills it", async () => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  await render();
  await render();
  expect(container.textContent).toBe("49");
  state.account = "buyer";
  await render();
  state.amounts.seller = 39;
  state.amounts.buyer = 10;
  state.account = "seller";
  await render();
  await render();
  expect(container.textContent).toBe("39");
});
