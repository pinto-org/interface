import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient } from "@tanstack/react-query";
import { test } from "vitest";
import { type TransactionReceipt, encodeAbiParameters, encodeEventTopics, parseAbiItem } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import type { AllMarketActivityQuery } from "@/generated/gql/pintostalk/graphql";
import { useMarketEntities } from "@/state/market/useMarketEntities";
import {
  type CancellableListing,
  canCancelListing,
  didCancelListing,
  refreshAfterListingCancellation,
} from "../marketListing";

const owner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const other = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
const index = TokenValue.fromBlockchain("17861647363077", 6);
const listing: CancellableListing = {
  id: `${owner}-${index.toBigInt()}`,
  farmer: owner,
  index,
  status: "ACTIVE",
  remainingAmount: TokenValue.fromHuman("150", 6),
};

test("initial numeric price filter uses the same default as the displayed input", () => {
  const source = readFileSync(new URL("../../pages/market/actions/FillListing.tsx", import.meta.url), "utf8");
  assert.match(source, /const DEFAULT_PRICE_INPUT = "0\.01"/);
  assert.match(source, /\[maxPricePerPod, setMaxPricePerPod\] = useState<number>\(Number\(DEFAULT_PRICE_INPUT\)\)/);
  assert.match(source, /\[maxPricePerPodInput, setMaxPricePerPodInput\] = useState<string>\(DEFAULT_PRICE_INPUT\)/);
});

test("only the connected listing owner can cancel, irrespective of address casing", () => {
  assert.equal(canCancelListing(listing, owner, 0n), true);
  assert.equal(canCancelListing(listing, owner.toUpperCase(), 0n), true);
  assert.equal(canCancelListing(listing, other, 0n), false);
  assert.equal(canCancelListing(listing, undefined, 0n), false);
});

test("cancellation rejects another Field or historical version even with the same owner and index", () => {
  assert.equal(canCancelListing(listing, owner, 1n), false);
  const fieldOne = { ...listing, id: `${listing.id}:1` };
  assert.equal(canCancelListing(fieldOne, owner, 1n), true);
  assert.equal(canCancelListing(fieldOne, owner, 0n), false);
  assert.equal(canCancelListing({ ...listing, id: `${listing.id}-0` }, owner, 0n), false);
  assert.equal(canCancelListing({ ...listing, id: `${fieldOne.id}-0` }, owner, 1n), false);
  assert.equal(canCancelListing({ ...listing, id: `${other}-${index.toBigInt()}` }, owner, 0n), false);
});

test("tiny active remainders remain cancellable but completed or zero listings do not", () => {
  assert.equal(canCancelListing({ ...listing, remainingAmount: TokenValue.fromBlockchain("1", 6) }, owner, 0n), true);
  assert.equal(canCancelListing({ ...listing, remainingAmount: TokenValue.ZERO }, owner, 0n), false);
  for (const status of ["FILLED", "FILLED_PARTIAL", "CANCELLED", "CANCELLED_PARTIAL", "EXPIRED"]) {
    assert.equal(canCancelListing({ ...listing, status }, owner, 0n), false);
  }
});

test("activity preserves tiny listings and filled history, and carries owner identity to cancellation", () => {
  const raw = {
    ...listing,
    farmer: { id: owner },
    index: index.toBigInt().toString(),
    amount: "1",
    remainingAmount: "1",
    pricePerPod: 10000,
    minFillAmount: "100000",
    originalAmount: "150000000",
    filled: "149999999",
    filledAmount: "149999999",
    originalIndex: index.toBigInt().toString(),
    originalPlaceInLine: "1000000",
    maxHarvestableIndex: "99999999999999",
    creationHash: "0x1",
    createdAt: "1",
    updatedAt: "1",
    historyID: "history",
    mode: 0,
    pricingFunction: "",
    pricingType: 0,
    start: "0",
    fill: null,
  };
  const data = {
    podListings: [raw, { ...raw, id: `${raw.id}-0`, status: "FILLED", remainingAmount: "0" }],
    podOrders: [],
    podFills: [],
  } as AllMarketActivityQuery;
  function Probe() {
    const result = useMarketEntities(data, false, ["test"]);
    assert.equal(result.data.length, 2);
    assert.equal((result.data[0] as CancellableListing).farmer, owner);
    assert.equal(canCancelListing(result.data[0] as CancellableListing, owner, 0n), true);
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
});

test("cancellation invalidates all local market variants without touching other networks", async () => {
  const client = new QueryClient();
  const refresh = [
    ["allPodListings", { chainId: 8453, variables: ["1"] }, { podMarketplaceId: "0" }],
    ["allPodListings", { chainId: 8453, variables: ["2"] }, { podMarketplaceId: "1" }],
    ["myPodListings", { chainId: 8453, account: owner, harvestableIndex: "2" }],
    ["allMarket", { chainId: 8453 }, { podMarketplaceId: "0" }],
    ["farmerMarket", { chainId: 8453, variables: [owner] }],
    ["farmerField", { chainId: 8453, variables: [owner] }],
  ];
  const preserve = [
    ["allMarket", { chainId: 1 }],
    ["allPodOrders", { chainId: 8453 }],
  ];
  for (const key of [...refresh, ...preserve]) client.setQueryData(key, []);
  await refreshAfterListingCancellation(client, 8453);
  for (const key of refresh) assert.equal(client.getQueryState(key)?.isInvalidated, true);
  for (const key of preserve) assert.equal(client.getQueryState(key)?.isInvalidated, false);
  client.clear();
});

test("success requires the matching Diamond cancellation event, including for replacement receipts", () => {
  const diamond = "0xd1a0d188e861ed9d15773a2f3574a2e94134ba8f";
  const event = parseAbiItem("event PodListingCancelled(address indexed lister, uint256 fieldId, uint256 index)");
  const log: TransactionReceipt["logs"][number] = {
    address: diamond,
    blockHash: "0x01",
    blockNumber: 1n,
    transactionHash: "0x02",
    transactionIndex: 0,
    logIndex: 0,
    removed: false,
    topics: encodeEventTopics({
      abi: [event],
      eventName: "PodListingCancelled",
      args: { lister: owner },
    }) as TransactionReceipt["logs"][number]["topics"],
    data: encodeAbiParameters([{ type: "uint256" }, { type: "uint256" }], [0n, index.toBigInt()]),
  };
  const receipt = { status: "success" as const, logs: [log] };
  assert.equal(didCancelListing(receipt, diamond, owner, 0n, index.toBigInt()), true);
  assert.equal(didCancelListing({ ...receipt, status: "reverted" }, diamond, owner, 0n, index.toBigInt()), false);
  // A wallet cancel/replacement may have status success and no matching event.
  assert.equal(didCancelListing({ ...receipt, logs: [] }, diamond, owner, 0n, index.toBigInt()), false);
  assert.equal(
    didCancelListing({ ...receipt, logs: [{ ...log, address: other }] }, diamond, owner, 0n, index.toBigInt()),
    false,
  );
  assert.equal(didCancelListing(receipt, diamond, other, 0n, index.toBigInt()), false);
  assert.equal(didCancelListing(receipt, diamond, owner, 1n, index.toBigInt()), false);
  assert.equal(didCancelListing(receipt, diamond, owner, 0n, index.toBigInt() + 1n), false);
});
