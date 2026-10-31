import { TokenValue } from "@/classes/TokenValue";
import { getSiloDepositUsdValue } from "@/utils/silo";
import { describe, expect, it } from "vitest";

const lp = (v: number) => TokenValue.fromHuman(v, 18);
const bdv = (v: number) => TokenValue.fromHuman(v, 6);
const usd = (v: number) => TokenValue.fromHuman(v, 6);

describe("silo deposit USD value", () => {
  it("values a de-whitelisted LP deposit at market, matching the amount input (amount x lpUsd)", () => {
    const amount = lp(2);
    const lpUsd = usd(150);
    const value = getSiloDepositUsdValue({
      isWhitelisted: false,
      amount,
      currentBdv: bdv(0),
      // Stale BDV recorded at deposit time must not drive the USD value.
      depositBdv: bdv(100),
      bdvPrice: usd(1),
      tokenUsdPrice: lpUsd,
    });
    expect(value.toNumber()).toBeCloseTo(300);
    // Same expression ComboInputField uses for its "$" value.
    expect(value.toNumber()).toBeCloseTo(lpUsd.mul(amount).toNumber());
  });

  it("falls back to recorded BDV while the market price is unavailable", () => {
    const value = getSiloDepositUsdValue({
      isWhitelisted: false,
      amount: lp(2),
      currentBdv: bdv(0),
      depositBdv: bdv(100),
      bdvPrice: usd(0.5),
      tokenUsdPrice: undefined,
    });
    expect(value.toNumber()).toBeCloseTo(50);
  });

  it("keeps whitelisted tokens on current BDV x pool price", () => {
    const value = getSiloDepositUsdValue({
      isWhitelisted: true,
      amount: lp(2),
      currentBdv: bdv(120),
      depositBdv: bdv(100),
      bdvPrice: usd(0.9),
      tokenUsdPrice: usd(150),
    });
    expect(value.toNumber()).toBeCloseTo(108);
  });
});
