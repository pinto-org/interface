import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import batchCreatePodListing, { CreatePodListingParams } from "@/encoders/batchCreatePodListing";
import { FarmToMode } from "@/utils/types";
import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

const mockAddress = "0x1234567890abcdef1234567890abcdef12345678" as const;

interface DecodedPodListing {
  lister: string;
  fieldId: bigint;
  index: bigint;
  start: bigint;
  podAmount: bigint;
  pricePerPod: number;
  maxHarvestableIndex: bigint;
  minFillAmount: bigint;
  mode: number;
}

function decodeResult(data: `0x${string}`) {
  const decoded = decodeFunctionData({
    abi: diamondABI,
    data,
  });
  return {
    functionName: decoded.functionName,
    listings: decoded.args[0] as unknown as DecodedPodListing[],
  };
}

function createMockListing(overrides: Partial<CreatePodListingParams> = {}): CreatePodListingParams {
  return {
    lister: mockAddress,
    fieldId: 0n,
    index: TokenValue.fromBlockchain("1000000", 6),
    start: TokenValue.fromBlockchain("0", 6),
    podAmount: TokenValue.fromBlockchain("5000000", 6),
    pricePerPod: TokenValue.fromBlockchain("500000", 6),
    maxHarvestableIndex: TokenValue.fromBlockchain("100000000000", 6),
    minFillAmount: TokenValue.fromBlockchain("1000000", 6),
    mode: FarmToMode.EXTERNAL,
    ...overrides,
  };
}

describe("batchCreatePodListing encoder", () => {
  it("encodes a single listing", () => {
    const listing = createMockListing();
    const result = batchCreatePodListing([listing]);

    expect(result).toMatch(/^0x/);
    expect(result.length).toBeGreaterThan(10);

    const { functionName, listings } = decodeResult(result);

    expect(functionName).toBe("batchCreatePodListing");
    expect(listings).toHaveLength(1);

    const decodedListing = listings[0];
    expect(decodedListing.lister.toLowerCase()).toBe(mockAddress.toLowerCase());
    expect(decodedListing.fieldId).toBe(0n);
    expect(decodedListing.index).toBe(listing.index.toBigInt());
    expect(decodedListing.start).toBe(listing.start.toBigInt());
    expect(decodedListing.podAmount).toBe(listing.podAmount.toBigInt());
    expect(decodedListing.pricePerPod).toBe(Number(listing.pricePerPod.toBigInt()));
    expect(decodedListing.maxHarvestableIndex).toBe(listing.maxHarvestableIndex.toBigInt());
    expect(decodedListing.minFillAmount).toBe(listing.minFillAmount.toBigInt());
    expect(decodedListing.mode).toBe(Number(FarmToMode.EXTERNAL));
  });

  it("encodes multiple listings", () => {
    const listings = [
      createMockListing({ index: TokenValue.fromBlockchain("1000000", 6) }),
      createMockListing({ index: TokenValue.fromBlockchain("2000000", 6) }),
      createMockListing({ index: TokenValue.fromBlockchain("3000000", 6) }),
    ];

    const result = batchCreatePodListing(listings);
    const { listings: decoded } = decodeResult(result);

    expect(decoded).toHaveLength(3);
    expect(decoded[0].index).toBe(listings[0].index.toBigInt());
    expect(decoded[1].index).toBe(listings[1].index.toBigInt());
    expect(decoded[2].index).toBe(listings[2].index.toBigInt());
  });

  it("converts pricePerPod to number (uint24)", () => {
    const listing = createMockListing({
      pricePerPod: TokenValue.fromBlockchain("800000", 6),
    });

    const result = batchCreatePodListing([listing]);
    const { listings } = decodeResult(result);

    expect(typeof listings[0].pricePerPod).toBe("number");
    expect(listings[0].pricePerPod).toBe(800000);
  });

  it("handles FarmToMode.INTERNAL", () => {
    const listing = createMockListing({ mode: FarmToMode.INTERNAL });

    const result = batchCreatePodListing([listing]);
    const { listings } = decodeResult(result);

    expect(listings[0].mode).toBe(Number(FarmToMode.INTERNAL));
  });

  it("converts TokenValue fields to BigInt", () => {
    const listing = createMockListing({
      index: TokenValue.fromHuman("100", 6),
      start: TokenValue.fromHuman("10", 6),
      podAmount: TokenValue.fromHuman("50", 6),
      maxHarvestableIndex: TokenValue.fromHuman("999999", 6),
      minFillAmount: TokenValue.fromHuman("1", 6),
    });

    const result = batchCreatePodListing([listing]);
    const { listings } = decodeResult(result);

    const d = listings[0];
    expect(d.index).toBe(100000000n);
    expect(d.start).toBe(10000000n);
    expect(d.podAmount).toBe(50000000n);
    expect(d.maxHarvestableIndex).toBe(999999000000n);
    expect(d.minFillAmount).toBe(1000000n);
  });

  it("preserves lister address", () => {
    const customAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as const;
    const listing = createMockListing({ lister: customAddress });

    const result = batchCreatePodListing([listing]);
    const { listings } = decodeResult(result);

    expect(listings[0].lister.toLowerCase()).toBe(customAddress.toLowerCase());
  });
});
