import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { answerMarketQuery, marketEndpoint, marketRpc, marketStartBlock, readLocalMarket, replayOrders } from "./market-orders.mjs";

const buyer = `0x${"11".repeat(20)}`;
const seller = `0x${"22".repeat(20)}`;
const id = `0x${"33".repeat(32)}`;
const hash = `0x${"44".repeat(32)}`;
const create = (n = 1, extra = {}) => ({
  eventName: "PodOrderCreated", blockNumber: marketStartBlock + BigInt(n), blockHash: hash,
  transactionHash: `0x${n.toString(16).padStart(64, "0")}`, logIndex: 0, timestamp: BigInt(n + 100),
  args: { orderer: buyer, id, beanAmount: 2_000_000n, fieldId: 0n, pricePerPod: 10_000,
    maxPlaceInLine: 43_281_233_000_000n, minFillAmount: 1_000_000n, ...extra },
});
const fill = (n = 2, extra = {}) => ({ ...create(n), eventName: "PodOrderFilled", harvestable: 500n,
  args: { orderer: buyer, filler: seller, id, fieldId: 0n, index: 1000n, start: 50n,
    podAmount: 100_000_000n, costInBeans: 1_000_000n, ...extra },
});
const cancel = (n = 3) => ({ ...create(n), eventName: "PodOrderCancelled", args: { orderer: buyer, id } });
const query = (name, variables = {}) => ({ query: `query ${name} { podOrders { id } }`, variables });

describe("local-only Pod order QA adapter", () => {
  it("pins the disposable RPC and excludes the inherited parent history", () => {
    expect(marketRpc).toBe("http://127.0.0.1:18569");
    expect(new URL(marketEndpoint).origin).toBe("http://127.0.0.1:17845");
    expect(marketStartBlock).toBe(53178879n);
  });
  it("replays out-of-order logs in chain order with exact partial-fill and cancellation units", () => {
    const s = replayOrders([cancel(), create(), fill()]);
    expect(s.current[0]).toMatchObject({ status: "CANCELLED_PARTIAL", beanAmount: "2000000",
      beanAmountFilled: "1000000", podAmountFilled: "100000000" });
    expect(s.fills[0]).toMatchObject({ placeInLine: "550", costInBeans: "1000000",
      fromFarmer: { id: seller }, toFarmer: { id: buyer } });
    expect(answerMarketQuery(query("AllPodOrders"), s).data.podOrders).toEqual([]);
    expect(answerMarketQuery(query("FarmerMarketActivity", { account: seller }), s).data.podFills).toHaveLength(1);
  });
  it("marks full fills and archives replaced IDs without reviving old escrow", () => {
    const s = replayOrders([create(), fill(2, { podAmount: 200_000_000n, costInBeans: 2_000_000n }), create(4)]);
    expect(s.orders).toHaveLength(2);
    expect(s.orders[0]).toMatchObject({ id: `${id}-0`, status: "FILLED" });
    expect(s.current[0]).toMatchObject({ id, status: "ACTIVE", beanAmountFilled: "0", createdAt: "104" });
    expect(answerMarketQuery(query("AllPodOrders"), s).data.podOrders).toHaveLength(1);
  });
  it("handles replacement cancellation within the same transaction in log order", () => {
    const cancelled = { ...cancel(2), logIndex: 4 };
    const recreated = { ...create(2, { beanAmount: 3_000_000n }), logIndex: 5 };
    const s = replayOrders([recreated, create(), cancelled]);
    expect(s.orders[0].status).toBe("CANCELLED");
    expect(s.current[0].beanAmount).toBe("3000000");
  });
  it("ignores zero-escrow cancellation after full fill or earlier cancellation", () => {
    const full = replayOrders([create(), fill(2, { costInBeans: 2_000_000n, podAmount: 200_000_000n }), cancel(), cancel(4)]);
    expect(full.current[0]).toMatchObject({ status: "FILLED", updatedAt: "102" });
    const cancelled = replayOrders([create(), cancel(), cancel(4), create(5)]);
    expect(cancelled.orders[0]).toMatchObject({ status: "CANCELLED", updatedAt: "103" });
    expect(cancelled.current[0]).toMatchObject({ status: "ACTIVE", beanAmountFilled: "0" });
    expect(() => replayOrders([create(), cancel(), fill(4)])).toThrow("inactive order");
  });
  it("does not fabricate inherited orders or non-Field-0 listings", () => {
    expect(replayOrders([fill(), cancel()]).orders).toEqual([]);
    expect(replayOrders([create(1, { fieldId: 1n })]).orders).toEqual([]);
    expect(replayOrders([{ ...create(1, { fieldId: 1n }), eventName: "PodListingCreated" }]).listings).toEqual([]);
  });
  it("rejects duplicated logs, overfills and missing historical metadata", () => {
    expect(() => replayOrders([create(), create()])).toThrow("duplicate");
    expect(() => replayOrders([create(), fill(2, { costInBeans: 3_000_000n })])).toThrow("exceeds escrow");
    expect(() => replayOrders([create(), { ...fill(), harvestable: undefined }])).toThrow("harvestable");
    expect(() => replayOrders([create(), create(2)])).toThrow("cancel the old order");
  });
  it("filters account, timestamp, active status and pagination", () => {
    const s = replayOrders([create(), create(2, { id: `0x${"55".repeat(32)}`, orderer: seller })]);
    expect(answerMarketQuery(query("MyPodOrders", { account: buyer }), s).data.podOrders.map(x => x.id)).toEqual([id]);
    expect(answerMarketQuery(query("AllPodOrders", { first: 1, skip: 1 }), s).data.podOrders[0].id).toBe(id);
    expect(answerMarketQuery(query("AllMarketActivity", { orders_createdAt_gt: "101" }), s).data.podOrders).toHaveLength(1);
  });
  it("accepts the six actual UI query documents and rejects unsupported coverage", () => {
    const s = replayOrders([create()]);
    for (const name of ["AllPodOrders", "MyPodOrders", "AllPodListings", "MyPodListings", "AllMarketActivity", "FarmerMarketActivity"]) {
      const source = readFileSync(new URL(`../../src/queries/beanstalk/podmarket/${name}.graphql`, import.meta.url), "utf8");
      const result = answerMarketQuery({ query: source, variables: { account: buyer, maxHarvestableIndex: "500" } }, s);
      expect(result.extensions.qaOnly).toBe(true);
    }
    expect(() => answerMarketQuery(query("AllPodOrders", { podMarketplace: "1" }), s)).toThrow("Field 0");
    expect(() => answerMarketQuery(query("AllPodOrders", { status: "CANCELLED" }), s)).toThrow("status");
    expect(() => answerMarketQuery(query("MyPodOrders"), s)).toThrow("account required");
    expect(() => answerMarketQuery(query("AllPodOrders", { first: 1001 }), s)).toThrow("pagination");
    expect(() => answerMarketQuery({ query: "mutation AllPodOrders { podOrders { id } }" }, s)).toThrow("unsupported");
  });

  const mockClient = (options = {}) => ({
    request: async ({ method }) => { expect(method).toBe("web3_clientVersion"); return options.client ?? "anvil/v1.7.1"; },
    getChainId: async () => options.chain ?? 1337,
    getBlock: async ({ blockNumber } = {}) => ({ number: blockNumber ?? marketStartBlock + 10n, hash, timestamp: 101n }),
    getLogs: async ({ fromBlock, toBlock }) => { expect(fromBlock).toBe(marketStartBlock); expect(toBlock).toBe(marketStartBlock + 10n); return [create()]; },
    readContract: async ({ functionName, blockNumber }) => {
      if (functionName === "harvestableIndex") return 500n;
      expect(functionName).toBe("getPodOrder"); expect(blockNumber).toBe(marketStartBlock + 10n);
      return options.escrow ?? 2_000_000n;
    },
  });
  it("cross-checks the exact escrow at the pinned block", async () => {
    expect((await readLocalMarket(mockClient())).orders).toHaveLength(1);
    await expect(readLocalMarket(mockClient({ escrow: 1n }))).rejects.toThrow("onchain escrow");
  });
  it("fails closed for the wrong chain/client and a changed snapshot", async () => {
    await expect(readLocalMarket(mockClient({ chain: 8453 }))).rejects.toThrow("isolated chain");
    await expect(readLocalMarket(mockClient({ client: "geth" }))).rejects.toThrow();
    const rpc = mockClient();
    rpc.getBlock = async ({ blockNumber } = {}) => ({ number: blockNumber ?? marketStartBlock + 10n,
      hash: blockNumber === marketStartBlock + 10n ? `0x${"aa".repeat(32)}` : hash, timestamp: 101n });
    await expect(readLocalMarket(rpc)).rejects.toThrow("fork changed");
  });
});
