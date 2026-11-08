import { TokenValue } from "@/classes/TokenValue";
import { describe, expect, it } from "vitest";
import { getTotalDepositedUsd } from "../siloValue";

describe("getTotalDepositedUsd", () => {
  it("values LP deposits at the LP price instead of recorded PDV times the Pinto price", () => {
    // PINTO/cbETH at Base block 53298716: recorded PDV implied only $10,207.89.
    const data = {
      totalDeposited: TokenValue.fromHuman("2121.863992417706", 18),
      germinatingAmount: TokenValue.ZERO,
      depositedBDV: TokenValue.fromHuman("307318.477018", 6),
    };
    const usd = getTotalDepositedUsd(data, TokenValue.fromHuman("18.393463", 6));

    expect(usd?.toNumber()).toBeCloseTo(39028.43, 2);
  });

  it("includes germinating LP tokens and values only the deposited share of a pool", () => {
    // A $200 pool with 100 LP tokens; 30 mature + 10 germinating LP are in the Silo.
    const data = {
      totalDeposited: TokenValue.fromHuman(30, 18),
      germinatingAmount: TokenValue.fromHuman(10, 18),
    };

    expect(getTotalDepositedUsd(data, TokenValue.fromHuman(2, 6))?.toNumber()).toBe(80);
  });

  it("values Pinto deposits using Pinto's USD price", () => {
    const data = {
      totalDeposited: TokenValue.fromHuman(100, 6),
      germinatingAmount: TokenValue.fromHuman(20, 6),
    };

    expect(getTotalDepositedUsd(data, TokenValue.fromHuman("0.033", 6))?.toNumber()).toBe(3.96);
  });

  it("distinguishes unavailable data from zero deposited value", () => {
    const empty = { totalDeposited: TokenValue.ZERO, germinatingAmount: TokenValue.ZERO };

    expect(getTotalDepositedUsd(undefined, TokenValue.ONE)).toBeUndefined();
    expect(getTotalDepositedUsd(empty, undefined)).toBeUndefined();
    expect(getTotalDepositedUsd(empty, TokenValue.ONE)?.toNumber()).toBe(0);
    expect(getTotalDepositedUsd({ ...empty, totalDeposited: TokenValue.ONE }, TokenValue.ZERO)?.toNumber()).toBe(0);
  });
});
