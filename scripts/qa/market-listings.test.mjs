import { describe, expect, it } from "vitest";
import { listingHash } from "./market-listings.mjs";
import { answerMarketQuery, marketStartBlock, readLocalMarket, replayOrders as replay } from "./market-orders.mjs";

const replayOrders = (events) => ({ ...replay(events), harvestableIndex: "500000000" });

const seller = `0x${"22".repeat(20)}`;
const buyer = `0x${"11".repeat(20)}`;
const hash = `0x${"44".repeat(32)}`;
const zero = `0x${"00".repeat(32)}`;
const index = 1_000_000_000n;
const create = (n = 1, extra = {}) => ({
  eventName: "PodListingCreated", blockNumber: marketStartBlock + BigInt(n), blockHash: hash,
  transactionHash: `0x${n.toString(16).padStart(64, "0")}`, logIndex: 0, timestamp: BigInt(100 + n),
  harvestable: 500_000_000n,
  args: { lister: seller, fieldId: 0n, index, start: 50n, podAmount: 20_000_000n, pricePerPod: 10_000,
    maxHarvestableIndex: 9_000_000_000n, minFillAmount: 100_000n, mode: 0, ...extra },
});
const fill = (n = 2, extra = {}) => ({ ...create(n), eventName: "PodListingFilled",
  args: { filler: buyer, lister: seller, fieldId: 0n, index, start: 50n,
    podAmount: 10_000_000n, costInBeans: 100_000n, ...extra },
});
const cancel = (n = 3, extra = {}) => ({ ...create(n), eventName: "PodListingCancelled",
  args: { lister: seller, fieldId: 0n, index, ...extra },
});
const nextIndex = index + 50n + 10_000_000n;
const query = (name, variables = {}) => ({ query: `query ${name} { podListings { id } }`,
  variables: { maxHarvestableIndex: "500000000", ...variables } });

describe("local-only Pod listing replay", () => {
  it("reproduces all packed hash inputs, including uint24 price and uint8 mode", () => {
    const listing = replayOrders([create()]).listings[0];
    // Independently generated with ethers.solidityKeccak256 and Listing._hashListing types.
    expect(listingHash(listing)).toBe("0xe5003f52a99cba238b272ea822d2d05a98c0762d774e3b382f5e6b24eab08a27");
    for (const [field, value] of [["start", "51"], ["amount", "19999999"], ["mode", 1]])
      expect(listingHash({ ...listing, [field]: value })).not.toBe(listingHash(listing));
  });
  it("moves a partial remainder to the exact new index without losing its original history", () => {
    const s = replayOrders([fill(), create()]);
    expect(s.currentListings[0]).toMatchObject({ status: "FILLED_PARTIAL", filled: "10000000" });
    expect(s.currentListings[1]).toMatchObject({ id: `${seller}-${nextIndex}`, index: nextIndex.toString(),
      start: "0", amount: "10000000", remainingAmount: "10000000", originalAmount: "20000000",
      originalIndex: index.toString(), originalPlaceInLine: "500000050", filled: "10000000",
      filledAmount: "0", status: "ACTIVE", createdAt: "101", updatedAt: "102", fill: null });
    expect(s.fills[0]).toMatchObject({ fromFarmer: { id: seller }, toFarmer: { id: buyer },
      listing: { id: `${seller}-${index}`, originalAmount: "20000000" }, order: null,
      placeInLine: "500000050", costInBeans: "100000" });
    expect(answerMarketQuery(query("AllPodListings"), s).data.podListings).toHaveLength(1);
    expect(answerMarketQuery(query("AllMarketActivity"), s).data.podListings).toHaveLength(1);
  });
  it("handles full fills after partials with no active remainder", () => {
    const s = replayOrders([create(), fill(), fill(3, { index: nextIndex, start: 0n })]);
    expect(s.currentListings[1]).toMatchObject({ status: "FILLED", filled: "20000000", remainingAmount: "0" });
    expect(answerMarketQuery(query("AllPodListings"), s).data.podListings).toEqual([]);
    expect(answerMarketQuery(query("FarmerMarketActivity", { account: buyer }), s).data.podFills).toHaveLength(2);
  });
  it("cancels a partial remainder and retains its cumulative fill", () => {
    const s = replayOrders([create(), fill(), cancel(3, { index: nextIndex })]);
    expect(s.currentListings[1]).toMatchObject({ status: "CANCELLED_PARTIAL", filled: "10000000", remainingAmount: "10000000" });
    expect(answerMarketQuery(query("MyPodListings", { account: seller }), s).data.podListings).toEqual([]);
  });
  it("archives re-created listings at the same contract key", () => {
    const s = replayOrders([create(), cancel(), create(4, { mode: 1 })]);
    expect(s.listings).toHaveLength(2);
    expect(s.listings[0]).toMatchObject({ id: `${seller}-${index}-0`, status: "CANCELLED" });
    expect(s.currentListings[0]).toMatchObject({ status: "ACTIVE", mode: 1, createdAt: "104" });
  });
  it("ignores inherited/empty cancellations and already-inactive cancellation events", () => {
    expect(replayOrders([cancel(), fill()]).listings).toEqual([]);
    expect(replayOrders([create(), cancel(), cancel(4)]).listings[0].status).toBe("CANCELLED");
  });
  it("rejects missing metadata, malformed fills, active replacement and duplicate events", () => {
    expect(() => replayOrders([{ ...create(), harvestable: undefined }])).toThrow("creation harvestable");
    expect(() => replayOrders([create(), { ...fill(), harvestable: undefined }])).toThrow("mutation harvestable");
    expect(() => replayOrders([create(), fill(2, { start: 0n })])).toThrow("start mismatch");
    expect(() => replayOrders([create(), fill(2, { podAmount: 20_000_001n })])).toThrow("overfill");
    expect(() => replayOrders([create(), fill(2, { lister: buyer })])).toThrow("owner mismatch");
    expect(() => replayOrders([create(), create(2)])).toThrow("cancel the old listing");
    expect(() => replayOrders([create(), create()])).toThrow("duplicate");
  });
  it("uses pinned expiry for activity, preserves equality, and does not mutate stored hash status", () => {
    const s = replayOrders([create(1, { maxHarvestableIndex: 500_000_000n })]);
    expect(answerMarketQuery(query("AllMarketActivity"), s).data.podListings[0].status).toBe("ACTIVE");
    const expired = { ...s, harvestableIndex: "500000001" };
    expect(answerMarketQuery(query("FarmerMarketActivity", { account: seller, maxHarvestableIndex: "0" }), expired)
      .data.podListings[0].status).toBe("EXPIRED");
    expect(answerMarketQuery(query("AllPodListings", { maxHarvestableIndex: "0" }), expired).data.podListings).toEqual([]);
    expect(s.currentListings[0]).toMatchObject({ status: "ACTIVE", contractListed: true });
    expect(() => answerMarketQuery(query("AllMarketActivity"), { ...s, harvestableIndex: undefined })).toThrow("pinned harvestable");
  });
  it("preserves expired history when its onchain hash is cancelled then the plot is relisted", () => {
    const c = { ...cancel(), harvestable: 500_000_001n };
    const s = replayOrders([create(1, { maxHarvestableIndex: 500_000_000n }), c, cancel(4), create(5)]);
    expect(s.listings[0]).toMatchObject({ status: "EXPIRED", contractListed: false, updatedAt: "101" });
    expect(s.currentListings[0]).toMatchObject({ status: "ACTIVE", contractListed: true });
  });
  it("matches query expiry/dust boundaries and exact index sorting", () => {
    const s = replayOrders([create(1, { index: index + 2n }), create(2),
      create(3, { index: index + 1n, maxHarvestableIndex: 500_000_000n }),
      create(4, { index: index + 3n, podAmount: 100_000n }),
      create(5, { index: index + 4n, podAmount: 100_001n })]);
    expect(answerMarketQuery(query("AllPodListings"), s).data.podListings.map(x => x.index))
      .toEqual([index.toString(), (index + 2n).toString(), (index + 4n).toString()]);
    expect(answerMarketQuery(query("AllPodListings", { first: 1, skip: 1 }), s).data.podListings[0].index).toBe((index + 2n).toString());
    expect(answerMarketQuery(query("MyPodListings", { account: buyer }), s).data.podListings).toEqual([]);
    expect(answerMarketQuery(query("AllMarketActivity", { listings_createdAt_gt: "104" }), s).data.podListings).toHaveLength(1);
    expect(() => answerMarketQuery(query("AllPodListings", { maxHarvestableIndex: undefined }), s)).toThrow("cutoff required");
  });
  it("cross-checks active and deleted hashes at one pinned block", async () => {
    const logs = [create(), fill()];
    const listings = replayOrders(logs).currentListings;
    const rpc = {
      request: async () => "anvil/v1.7.1", getChainId: async () => 1337,
      getBlock: async ({ blockNumber } = {}) => ({ number: blockNumber ?? marketStartBlock + 10n, hash, timestamp: 101n }),
      getLogs: async () => logs.map(l => ({ ...l })),
      readContract: async ({ functionName, args, blockNumber }) => {
        if (functionName === "harvestableIndex") return 500_000_000n;
        expect(functionName).toBe("getPodListing"); expect(blockNumber).toBe(marketStartBlock + 10n);
        return args[1] === index ? zero : listingHash(listings[1]);
      },
    };
    expect((await readLocalMarket(rpc)).listings).toHaveLength(2);
    const correct = rpc.readContract;
    rpc.readContract = async (args) => args.functionName === "harvestableIndex" && args.blockNumber === marketStartBlock + 10n
      ? 9_000_000_001n : correct(args);
    const expired = await readLocalMarket(rpc);
    expect(expired.currentListings[1]).toMatchObject({ contractListed: true, status: "ACTIVE" });
    expect(answerMarketQuery(query("AllMarketActivity"), expired).data.podListings[0].status).toBe("EXPIRED");
    rpc.readContract = async (args) => args.functionName === "getPodListing" ? zero : correct(args);
    await expect(readLocalMarket(rpc)).rejects.toThrow("onchain hash");
  });
});
