// QA ONLY: new Field-0 Pod orders on the disposable fork. Not a production subgraph.
import assert from "node:assert/strict";
import { createPublicClient, http, parseAbi } from "viem";
import { parse } from "graphql";
import { listingHash, replayListings } from "./market-listings.mjs";
import { readHistoricalHarvestable } from "./historical-market-read.mjs";
import { fixtureConfig } from "./fixture-config.mjs";

const fixture = fixtureConfig();
export const marketRpc = fixture.rpc;
// graphql-request constructs URL without a base; a relative endpoint is invalid.
export const marketEndpoint = fixture.marketEndpoint;
export const marketStartBlock = BigInt(fixture.startBlock) + 1n;
export const marketDiamond = "0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f";
export const marketAbi = parseAbi([
  "event PodOrderCreated(address indexed orderer, bytes32 id, uint256 beanAmount, uint256 fieldId, uint24 pricePerPod, uint256 maxPlaceInLine, uint256 minFillAmount)",
  "event PodOrderFilled(address indexed filler, address indexed orderer, bytes32 id, uint256 fieldId, uint256 index, uint256 start, uint256 podAmount, uint256 costInBeans)",
  "event PodOrderCancelled(address indexed orderer, bytes32 id)",
  "event PodListingCreated(address indexed lister, uint256 fieldId, uint256 index, uint256 start, uint256 podAmount, uint24 pricePerPod, uint256 maxHarvestableIndex, uint256 minFillAmount, uint8 mode)",
  "event PodListingFilled(address indexed filler, address indexed lister, uint256 fieldId, uint256 index, uint256 start, uint256 podAmount, uint256 costInBeans)",
  "event PodListingCancelled(address indexed lister, uint256 fieldId, uint256 index)",
  "function getPodListing(uint256 fieldId, uint256 index) view returns (bytes32)",
  "function getPodOrder(bytes32 id) view returns (uint256)",
  "function harvestableIndex(uint256 fieldId) view returns (uint256)",
]);
const client = createPublicClient({ transport: http(marketRpc) });
const supportedQueries = new Set([
  "AllPodOrders", "MyPodOrders", "AllPodListings", "MyPodListings", "AllMarketActivity", "FarmerMarketActivity",
]);
const fieldZero = (value) => value === undefined || String(value) === "0";
const compareBigInt = (a, b) => a < b ? -1 : a > b ? 1 : 0;

/** Replay real event units without floating-point conversion. Unknown pre-cutoff orders
 * and listings are intentionally outside this fixture's history. */
export function replayOrders(events) {
  const current = new Map();
  const historical = [];
  const fills = [];
  const seen = new Set();
  const sorted = [...events].sort((a, b) => compareBigInt(a.blockNumber, b.blockNumber) || a.logIndex - b.logIndex);
  for (const event of sorted) {
    const identity = `${event.transactionHash}-${event.logIndex}`;
    assert.ok(!seen.has(identity), "duplicate market log");
    seen.add(identity);
    const a = event.args;
    if (!fieldZero(a.fieldId)) continue;
    if (event.eventName.startsWith("PodListing")) continue;
    const id = a.id.toLowerCase();
    const now = event.timestamp.toString();
    if (event.eventName === "PodOrderCreated") {
      const previous = current.get(id);
      if (previous) {
        assert.notEqual(previous.status, "ACTIVE", "replacement must cancel the old order first");
        historical.push({ ...previous, id: `${id}-${historical.filter((x) => x.id.startsWith(`${id}-`)).length}` });
      }
      current.set(id, {
        id, farmer: { id: a.orderer.toLowerCase() }, historyID: `${id}-${now}-${event.logIndex}`,
        pricingType: 0, pricePerPod: a.pricePerPod, pricingFunction: null,
        maxPlaceInLine: a.maxPlaceInLine.toString(), minFillAmount: a.minFillAmount.toString(),
        beanAmount: a.beanAmount.toString(), podAmountFilled: "0", beanAmountFilled: "0",
        status: "ACTIVE", createdAt: now, updatedAt: now, creationHash: event.transactionHash,
      });
    } else {
      const order = current.get(id);
      if (!order) continue; // Not a locally created order; outside the stated QA scope.
      assert.equal(a.orderer.toLowerCase(), order.farmer.id, "order owner mismatch");
      // The contract emits cancellation even when escrow was already zero. Graph ignores it.
      if (event.eventName === "PodOrderCancelled" && order.status !== "ACTIVE") continue;
      assert.equal(order.status, "ACTIVE", "mutation of inactive order");
      order.updatedAt = now;
      if (event.eventName === "PodOrderCancelled") {
        order.status = BigInt(order.podAmountFilled) === 0n ? "CANCELLED" : "CANCELLED_PARTIAL";
      } else {
        assert.equal(event.eventName, "PodOrderFilled", "unsupported market event");
        const paid = BigInt(order.beanAmountFilled) + a.costInBeans;
        assert.ok(paid <= BigInt(order.beanAmount), "fill exceeds escrow");
        order.beanAmountFilled = paid.toString();
        order.podAmountFilled = (BigInt(order.podAmountFilled) + a.podAmount).toString();
        order.status = paid === BigInt(order.beanAmount) ? "FILLED" : "ACTIVE";
        assert.ok(event.harvestable !== undefined, "missing historical harvestable index");
        fills.push({
          id: `${marketDiamond.toLowerCase()}-${a.index}-${identity}`, index: a.index.toString(),
          start: a.start.toString(), amount: a.podAmount.toString(), costInBeans: a.costInBeans.toString(),
          placeInLine: (a.index + a.start - event.harvestable).toString(),
          fromFarmer: { id: a.filler.toLowerCase() }, toFarmer: { id: a.orderer.toLowerCase() },
          listing: null, order: { id, beanAmount: order.beanAmount }, createdAt: now,
        });
      }
    }
  }
  const listings = replayListings(sorted);
  return { current: [...current.values()], orders: [...historical, ...current.values()],
    ...listings, fills: [...fills, ...listings.listingFills] };
}

export async function readLocalMarket(rpcClient = client) {
  assert.match(await rpcClient.request({ method: "web3_clientVersion" }), /^anvil\//);
  assert.equal(await rpcClient.getChainId(), 1337, "market QA requires isolated chain 1337");
  const tip = await rpcClient.getBlock();
  assert.ok(tip.number >= marketStartBlock && tip.number - marketStartBlock <= 100_000n, "QA history window exceeded");
  const logs = await rpcClient.getLogs({
    address: marketDiamond, events: marketAbi.filter((entry) => entry.type === "event"),
    fromBlock: marketStartBlock, toBlock: tip.number, strict: true,
  });
  const metadata = new Map();
  for (const log of logs) {
    if (!metadata.has(log.blockNumber)) {
      const block = await rpcClient.getBlock({ blockNumber: log.blockNumber });
      metadata.set(log.blockNumber, { timestamp: block.timestamp, hash: block.hash });
    }
    const block = metadata.get(log.blockNumber);
    assert.equal(log.blockHash, block.hash, "market event block changed");
    log.timestamp = block.timestamp;
    if (["PodOrderFilled", "PodListingCreated", "PodListingFilled", "PodListingCancelled"].includes(log.eventName) && fieldZero(log.args.fieldId)) {
      log.harvestable = await readHistoricalHarvestable(rpcClient, log.blockNumber);
    }
  }
  const result = replayOrders(logs);
  // The event adapter is not authoritative over escrow: cross-check the pinned contract.
  for (const order of result.current) {
    const amount = await rpcClient.readContract({
      address: marketDiamond, abi: marketAbi, functionName: "getPodOrder", args: [order.id], blockNumber: tip.number,
    });
    const expected = order.status === "ACTIVE" ? BigInt(order.beanAmount) - BigInt(order.beanAmountFilled) : 0n;
    assert.equal(amount, expected, "event-derived order differs from pinned onchain escrow");
  }
  for (const listing of result.currentListings) {
    const hash = await rpcClient.readContract({
      address: marketDiamond, abi: marketAbi, functionName: "getPodListing",
      args: [0n, BigInt(listing.index)], blockNumber: tip.number,
    });
    // Expiry changes Graph status, not the contract's stored hash. Cancellation/fill deletes it.
    const expected = listing.contractListed ? listingHash(listing) : `0x${"00".repeat(32)}`;
    assert.equal(hash.toLowerCase(), expected, "event-derived listing differs from pinned onchain hash");
  }
  const harvestableIndex = await rpcClient.readContract({
    address: marketDiamond, abi: marketAbi, functionName: "harvestableIndex", args: [0n], blockNumber: tip.number,
  });
  assert.equal((await rpcClient.getBlock({ blockNumber: tip.number })).hash, tip.hash, "fork changed during market read");
  return { ...result, harvestableIndex: harvestableIndex.toString(), blockNumber: tip.number.toString(), blockHash: tip.hash };
}

export function answerMarketQuery(body, snapshot) {
  const operations = parse(body.query).definitions.filter((entry) => entry.kind === "OperationDefinition");
  assert.equal(operations.length, 1, "one QA query required");
  const operation = operations[0];
  const name = operation.name?.value;
  assert.ok(operation.operation === "query" && supportedQueries.has(name), "unsupported QA market query");
  const v = body.variables ?? {};
  for (const field of ["podMarketplace", "listings_podMarketplace", "orders_podMarketplace"])
    assert.ok(fieldZero(v[field]), "QA market supports Pinto Field 0 only");
  assert.ok(v.status === undefined || v.status === "ACTIVE", "unsupported QA status filter");
  const mine = name.startsWith("My") || name === "FarmerMarketActivity";
  assert.ok(!mine || /^0x[0-9a-fA-F]{40}$/.test(v.account), "account required for farmer query");
  const account = v.account?.toLowerCase();
  const first = v.first ?? (name.startsWith("My") ? 100 : 1000);
  const skip = v.skip ?? 0;
  assert.ok(Number.isInteger(first) && first >= 0 && first <= 1000 && Number.isInteger(skip) && skip >= 0, "invalid pagination");
  const activity = name.endsWith("Activity");
  if (name.includes("Listings")) assert.ok(/^\d+$/.test(v.maxHarvestableIndex), "listing harvestable cutoff required");
  const orders = snapshot.orders.filter((order) =>
    (!mine || order.farmer.id === account) && (activity || order.status === "ACTIVE") &&
    BigInt(order.createdAt) > BigInt(v.orders_createdAt_gt ?? -1));
  orders.sort((a, b) => compareBigInt(BigInt(b.createdAt), BigInt(a.createdAt)) || a.id.localeCompare(b.id));
  const fills = snapshot.fills.filter((fill) =>
    (!mine || fill.fromFarmer.id === account || fill.toFarmer.id === account) &&
    BigInt(fill.createdAt) > BigInt(v.fill_createdAt_gt ?? -1));
  // A Sunrise can expire a listing without emitting a listing event. Use the authenticated
  // snapshot index, not a client-supplied query cutoff. Equality is NOT contract/Graph expiry.
  assert.ok(snapshot.listings.length === 0 || /^\d+$/.test(snapshot.harvestableIndex), "missing pinned harvestable index");
  const listings = snapshot.listings.map((listing) => listing.status === "ACTIVE" &&
    BigInt(snapshot.harvestableIndex) > BigInt(listing.maxHarvestableIndex)
    ? { ...listing, status: "EXPIRED" } : listing).filter((listing) =>
    (!mine || listing.farmer.id === account) &&
    (activity ? listing.status !== "FILLED_PARTIAL" : listing.status === "ACTIVE" &&
      BigInt(listing.maxHarvestableIndex) > BigInt(v.maxHarvestableIndex ?? 0) && BigInt(listing.remainingAmount) > 100_000n) &&
    BigInt(listing.createdAt) > BigInt(v.listings_createdAt_gt ?? -1));
  listings.sort((a, b) => name === "AllPodListings"
    ? compareBigInt(BigInt(a.index), BigInt(b.index))
    : compareBigInt(BigInt(b.createdAt), BigInt(a.createdAt)) || a.id.localeCompare(b.id));
  const data = name.includes("Listings") ? { podListings: listings.slice(skip, skip + first) }
    : activity ? { podOrders: orders.slice(0, first), podListings: listings.slice(0, first), podFills: fills.slice(0, first) }
    : { podOrders: orders.slice(skip, skip + first) };
  return { data, extensions: { qaOnly: true, scope: "new local Field-0 orders/listings only", blockNumber: snapshot.blockNumber, blockHash: snapshot.blockHash } };
}

export function qaMarketMiddleware(req, res, next) {
  if (req.url !== "/__qa/market") return next();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.statusCode = 405; res.end(JSON.stringify({ errors: [{ message: "POST required" }] })); return; }
  void (async () => {
    const chunks = [];
    let length = 0;
    for await (const chunk of req) {
      length += chunk.length;
      assert.ok(length <= 65_536, "QA query too large");
      chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const snapshot = await readLocalMarket();
    res.end(JSON.stringify(answerMarketQuery(body, snapshot)));
  })().catch((error) => {
    res.statusCode = 400;
    res.end(JSON.stringify({ errors: [{ message: `Local QA market unavailable: ${error.message}` }] }));
  });
}
