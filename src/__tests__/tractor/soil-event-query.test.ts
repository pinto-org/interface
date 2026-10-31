import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { getSoilEventQueryOptions } from "@/lib/Tractor/sowOrder/soil-event-query";
import { describe, expect, it } from "vitest";

describe("getSoilEventQueryOptions", () => {
  it("uses the current season and a one-day relative lookback when season is available", () => {
    const latestBlock = 2_000_000n;

    expect(getSoilEventQueryOptions(latestBlock, 12_345)).toEqual({
      fromBlock: latestBlock - TIME_TO_BLOCKS.day,
      toBlock: "latest",
      args: {
        season: 12_345,
      },
    });
  });

  it("uses latest-minus-one-month for fallback queries", () => {
    const latestBlock = 2_000_000n;

    expect(getSoilEventQueryOptions(latestBlock)).toEqual({
      fromBlock: latestBlock - TIME_TO_BLOCKS.month,
      toBlock: "latest",
    });
  });

  it("clamps low block numbers to zero", () => {
    expect(getSoilEventQueryOptions(100n)).toEqual({
      fromBlock: 0n,
      toBlock: "latest",
    });

    expect(getSoilEventQueryOptions(100n, 12_345)).toEqual({
      fromBlock: 0n,
      toBlock: "latest",
      args: {
        season: 12_345,
      },
    });
  });
});
