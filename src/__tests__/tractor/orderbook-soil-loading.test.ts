import { beforeEach, expect, test, vi } from "vitest";
import { encodeFunctionData, zeroAddress, type PublicClient } from "viem";
import { TokenValue as TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { sowReleaseABI } from "@/constants/abi/tractorReleaseABI";
import { loadOrderbookData, type LoadOrderbookDataOptions } from "@/lib/Tractor/sowOrder/tractor-sow";
import type { OrderbookEntry } from "@/lib/Tractor/sowOrder/tractor-sow-types";

vi.mock("@/lib/Tractor/requisitions/tractor-requisition", async (original) => ({
  ...(await original<typeof import("@/lib/Tractor/requisitions/tractor-requisition")>()),
  loadPublishedRequisitions: vi.fn(async () => ({ sowBlueprintv0: [] })),
}));

const diamond = "0x0000000000000000000000000000000000000001";
const latestBlock = { number: 1_000_000n, timestamp: 1_000_000n };
const readContract = vi.fn();
const getContractEvents = vi.fn();
const client = { readContract, getContractEvents } as unknown as PublicClient;

function entry(hashByte: string, tip: bigint): OrderbookEntry {
  const callData = encodeFunctionData({
    abi: sowReleaseABI,
    functionName: "sowBlueprint",
    args: [
      {
        sowParams: {
          sourceTokenIndices: [0],
          sowAmounts: {
            totalAmountToSow: 10_000_000n,
            minAmountToSowPerSeason: 1_000_000n,
            maxAmountToSowPerSeason: 4_000_000n,
          },
          minTemp: 1_000_000n,
          maxPodlineLength: 90_000_000_000_000n,
          maxGrownStalkPerBdv: 10n ** 24n,
          runBlocksAfterSunrise: 300n,
          slippageRatio: 10n ** 18n,
        },
        opParams: { whitelistedOperators: [], tipAddress: zeroAddress, operatorTipAmount: tip },
      },
    ],
  });
  const pipe = encodeFunctionData({
    abi: diamondABI,
    functionName: "advancedPipe",
    args: [[{ target: diamond, callData, clipboard: "0x0000" }], 0n],
  });
  const data = encodeFunctionData({
    abi: diamondABI,
    functionName: "advancedFarm",
    args: [[{ callData: pipe, clipboard: "0x" }]],
  });
  return {
    requisition: {
      blueprintHash: `0x${hashByte.repeat(32)}`,
      blueprint: { publisher: diamond, data, operatorPasteInstrs: [], maxNonce: 1n, startTime: 0n, endTime: 0n },
      signature: "0x",
    },
    blockNumber: 999_999,
    timestamp: 999_999,
    isCancelled: false,
    requisitionType: "sowBlueprintv0",
    pintosLeftToSow: TV.fromHuman(10, 6),
    totalAvailablePinto: TV.fromHuman(10, 6),
    currentlySowable: TV.fromHuman(10, 6),
    amountSowableNextSeason: TV.fromHuman(4, 6),
    amountSowableNextSeasonConsideringAvailableSoil: TV.ZERO,
    estimatedPlaceInLine: TV.ZERO,
    minTemp: TV.ONE,
  };
}
const load = (entries: OrderbookEntry[], options?: LoadOrderbookDataOptions) =>
  loadOrderbookData(diamond, diamond, client, latestBlock, 100, entries, 100n, { currentSeason: 100, ...options });
const soilCalls = () => getContractEvents.mock.calls.filter(([args]) => args.eventName === "Soil");

beforeEach(() => {
  readContract
    .mockReset()
    .mockImplementation(async ({ functionName }) => (functionName === "podIndex" ? 100_000_000n : 1_000_000n));
  getContractEvents
    .mockReset()
    .mockImplementation(async ({ eventName }) => (eventName === "Soil" ? [{ args: { soil: 5_000_000n } }] : []));
});

test("publisher history preserves orders without issuing or waiting for historical Soil", async () => {
  getContractEvents.mockImplementation(async ({ eventName }) => {
    if (eventName === "Soil") return new Promise(() => {});
    return [];
  });
  const orders = [entry("11", 100_000n), { ...entry("22", 200_000n), isComplete: true }];
  const result = await load(orders, { includeSoilForecast: false, filterOutCompleted: false });
  expect(result.map((x) => x.requisition.blueprintHash)).toEqual(orders.map((x) => x.requisition.blueprintHash));
  expect(result[1].isComplete).toBe(true);
  expect(soilCalls()).toHaveLength(0);
  expect(getContractEvents).toHaveBeenCalledTimes(2); // Completion reads are still made.
  expect(readContract).toHaveBeenCalledTimes(2);
});

test.each([undefined, true])(
  "default/explicit forecast keeps historical Soil and tip allocation (%s)",
  async (includeSoilForecast) => {
    const result = await load([entry("11", 100_000n), entry("22", 200_000n)], { includeSoilForecast });
    expect(soilCalls()).toHaveLength(1);
    expect(soilCalls()[0][0]).toMatchObject({ fromBlock: 956_800n, toBlock: "latest", args: { season: 100 } });
    expect(result[0].amountSowableNextSeasonConsideringAvailableSoil.toHuman()).toBe("1");
    expect(result[1].amountSowableNextSeasonConsideringAvailableSoil.toHuman()).toBe("4");
  },
);

test("a default empty orderbook avoids the historical read without inventing a forecast", async () => {
  expect(await load([])).toEqual([]);
  expect(soilCalls()).toHaveLength(0);
});

test("opting out does not change the existing completed-order filter", async () => {
  const result = await load([{ ...entry("11", 100_000n), isComplete: true }], { includeSoilForecast: false });
  expect(result).toEqual([]);
});
