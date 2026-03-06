import { TokenValue } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import batchFillPodListing, { FillPodListingParams } from "@/encoders/batchFillPodListing";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

const mockAddress = "0x1234567890abcdef1234567890abcdef12345678" as const;

interface DecodedFillParams {
  podListing: {
    lister: string;
    fieldId: bigint;
    index: bigint;
    start: bigint;
    podAmount: bigint;
    pricePerPod: number;
    maxHarvestableIndex: bigint;
    minFillAmount: bigint;
    mode: number;
  };
  beanAmount: bigint;
  mode: number;
}

function decodeResult(data: `0x${string}`) {
  const decoded = decodeFunctionData({
    abi: diamondABI,
    data,
  });
  return {
    functionName: decoded.functionName,
    params: decoded.args[0] as unknown as DecodedFillParams[],
  };
}

function createMockFillParams(overrides: Partial<FillPodListingParams> = {}): FillPodListingParams {
  return {
    podListing: {
      lister: mockAddress,
      fieldId: 0n,
      index: TokenValue.fromBlockchain("1000000", 6),
      start: TokenValue.fromBlockchain("0", 6),
      podAmount: TokenValue.fromBlockchain("5000000", 6),
      pricePerPod: TokenValue.fromBlockchain("500000", 6),
      maxHarvestableIndex: TokenValue.fromBlockchain("100000000000", 6),
      minFillAmount: TokenValue.fromBlockchain("1000000", 6),
      mode: FarmToMode.EXTERNAL,
      ...overrides?.podListing,
    },
    beanAmount: TokenValue.fromBlockchain("2000000", 6),
    mode: FarmFromMode.EXTERNAL,
    ...("beanAmount" in overrides ? { beanAmount: overrides.beanAmount } : {}),
    ...("mode" in overrides && overrides.mode !== undefined ? { mode: overrides.mode } : {}),
  };
}

describe("batchFillPodListing encoder", () => {
  it("encodes a single fill", () => {
    const fill = createMockFillParams();
    const result = batchFillPodListing([fill]);

    expect(result).toMatch(/^0x/);
    expect(result.length).toBeGreaterThan(10);

    const { functionName, params } = decodeResult(result);

    expect(functionName).toBe("batchFillPodListing");
    expect(params).toHaveLength(1);

    const decoded = params[0];
    expect(decoded.podListing.lister.toLowerCase()).toBe(mockAddress.toLowerCase());
    expect(decoded.podListing.fieldId).toBe(0n);
    expect(decoded.podListing.index).toBe(fill.podListing.index.toBigInt());
    expect(decoded.podListing.start).toBe(fill.podListing.start.toBigInt());
    expect(decoded.podListing.podAmount).toBe(fill.podListing.podAmount.toBigInt());
    expect(decoded.podListing.pricePerPod).toBe(Number(fill.podListing.pricePerPod.toBigInt()));
    expect(decoded.podListing.maxHarvestableIndex).toBe(fill.podListing.maxHarvestableIndex.toBigInt());
    expect(decoded.podListing.minFillAmount).toBe(fill.podListing.minFillAmount.toBigInt());
    expect(decoded.podListing.mode).toBe(Number(FarmToMode.EXTERNAL));
    expect(decoded.beanAmount).toBe(fill.beanAmount.toBigInt());
    expect(decoded.mode).toBe(Number(FarmFromMode.EXTERNAL));
  });

  it("encodes multiple fills", () => {
    const fills: FillPodListingParams[] = [
      createMockFillParams(),
      createMockFillParams({
        podListing: {
          lister: mockAddress,
          fieldId: 0n,
          index: TokenValue.fromBlockchain("2000000", 6),
          start: TokenValue.fromBlockchain("0", 6),
          podAmount: TokenValue.fromBlockchain("3000000", 6),
          pricePerPod: TokenValue.fromBlockchain("600000", 6),
          maxHarvestableIndex: TokenValue.fromBlockchain("100000000000", 6),
          minFillAmount: TokenValue.fromBlockchain("500000", 6),
          mode: FarmToMode.EXTERNAL,
        },
        beanAmount: TokenValue.fromBlockchain("1500000", 6),
        mode: FarmFromMode.INTERNAL,
      }),
      createMockFillParams({
        podListing: {
          lister: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as const,
          fieldId: 0n,
          index: TokenValue.fromBlockchain("3000000", 6),
          start: TokenValue.fromBlockchain("100000", 6),
          podAmount: TokenValue.fromBlockchain("8000000", 6),
          pricePerPod: TokenValue.fromBlockchain("450000", 6),
          maxHarvestableIndex: TokenValue.fromBlockchain("200000000000", 6),
          minFillAmount: TokenValue.fromBlockchain("2000000", 6),
          mode: FarmToMode.INTERNAL,
        },
        beanAmount: TokenValue.fromBlockchain("4000000", 6),
        mode: FarmFromMode.EXTERNAL,
      }),
    ];

    const result = batchFillPodListing(fills);
    const { params } = decodeResult(result);

    expect(params).toHaveLength(3);
    expect(params[0].podListing.index).toBe(fills[0].podListing.index.toBigInt());
    expect(params[1].podListing.index).toBe(fills[1].podListing.index.toBigInt());
    expect(params[2].podListing.index).toBe(fills[2].podListing.index.toBigInt());
    expect(params[1].beanAmount).toBe(fills[1].beanAmount.toBigInt());
    expect(params[2].podListing.lister.toLowerCase()).toBe("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd");
  });

  it("converts pricePerPod to number (uint24)", () => {
    const fill = createMockFillParams({
      podListing: {
        lister: mockAddress,
        fieldId: 0n,
        index: TokenValue.fromBlockchain("1000000", 6),
        start: TokenValue.fromBlockchain("0", 6),
        podAmount: TokenValue.fromBlockchain("5000000", 6),
        pricePerPod: TokenValue.fromBlockchain("800000", 6),
        maxHarvestableIndex: TokenValue.fromBlockchain("100000000000", 6),
        minFillAmount: TokenValue.fromBlockchain("1000000", 6),
        mode: FarmToMode.EXTERNAL,
      },
    });

    const result = batchFillPodListing([fill]);
    const { params } = decodeResult(result);

    expect(typeof params[0].podListing.pricePerPod).toBe("number");
    expect(params[0].podListing.pricePerPod).toBe(800000);
  });

  it("handles FarmFromMode.INTERNAL", () => {
    const fill = createMockFillParams({
      podListing: {
        lister: mockAddress,
        fieldId: 0n,
        index: TokenValue.fromBlockchain("1000000", 6),
        start: TokenValue.fromBlockchain("0", 6),
        podAmount: TokenValue.fromBlockchain("5000000", 6),
        pricePerPod: TokenValue.fromBlockchain("500000", 6),
        maxHarvestableIndex: TokenValue.fromBlockchain("100000000000", 6),
        minFillAmount: TokenValue.fromBlockchain("1000000", 6),
        mode: FarmToMode.EXTERNAL,
      },
      beanAmount: TokenValue.fromBlockchain("2000000", 6),
      mode: FarmFromMode.INTERNAL,
    });

    const result = batchFillPodListing([fill]);
    const { params } = decodeResult(result);

    expect(params[0].mode).toBe(Number(FarmFromMode.INTERNAL));
  });

  it("handles FarmToMode on podListing.mode", () => {
    const fill = createMockFillParams({
      podListing: {
        lister: mockAddress,
        fieldId: 0n,
        index: TokenValue.fromBlockchain("1000000", 6),
        start: TokenValue.fromBlockchain("0", 6),
        podAmount: TokenValue.fromBlockchain("5000000", 6),
        pricePerPod: TokenValue.fromBlockchain("500000", 6),
        maxHarvestableIndex: TokenValue.fromBlockchain("100000000000", 6),
        minFillAmount: TokenValue.fromBlockchain("1000000", 6),
        mode: FarmToMode.INTERNAL,
      },
    });

    const result = batchFillPodListing([fill]);
    const { params } = decodeResult(result);

    expect(params[0].podListing.mode).toBe(Number(FarmToMode.INTERNAL));
  });

  it("converts TokenValue fields to BigInt correctly", () => {
    const fill = createMockFillParams({
      podListing: {
        lister: mockAddress,
        fieldId: 0n,
        index: TokenValue.fromHuman("100", 6),
        start: TokenValue.fromHuman("10", 6),
        podAmount: TokenValue.fromHuman("50", 6),
        pricePerPod: TokenValue.fromBlockchain("500000", 6),
        maxHarvestableIndex: TokenValue.fromHuman("999999", 6),
        minFillAmount: TokenValue.fromHuman("1", 6),
        mode: FarmToMode.EXTERNAL,
      },
      beanAmount: TokenValue.fromHuman("25", 6),
      mode: FarmFromMode.EXTERNAL,
    });

    const result = batchFillPodListing([fill]);
    const { params } = decodeResult(result);

    const d = params[0];
    expect(d.podListing.index).toBe(100000000n);
    expect(d.podListing.start).toBe(10000000n);
    expect(d.podListing.podAmount).toBe(50000000n);
    expect(d.podListing.maxHarvestableIndex).toBe(999999000000n);
    expect(d.podListing.minFillAmount).toBe(1000000n);
    expect(d.beanAmount).toBe(25000000n);
  });
});
