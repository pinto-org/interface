import { TokenValue } from "@/classes/TokenValue";
import { redemptionLosses } from "@/utils/redemptionLosses";
import { selectRedemptionDeposits } from "@/utils/siloRedemption";
import type { DepositData } from "@/utils/types";
import { describe, expect, it } from "vitest";

const tv = (amount: string) => TokenValue.fromHuman(amount, 6);
function crate(stem: bigint, amount: string, stalk: string, seeds: string): DepositData {
  return {
    token: { decimals: 6 },
    stem: TokenValue.fromBlockchain(stem, 6),
    amount: tv(amount),
    depositBdv: tv(amount),
    stalk: { total: tv(stalk) },
    seeds: tv(seeds),
  } as DepositData;
}
const crates = [crate(1n, "100", "200", "400"), crate(2n, "100", "120", "200")];
const snapshot = crates.map((d) => ({
  stem: d.stem.toBigInt(),
  amount: d.amount.toBigInt(),
  bdv: d.depositBdv.toBigInt(),
  available: d.amount.toBigInt(),
  eligible: true,
}));
describe("fee-free withdrawal reward preview", () => {
  it("uses the youngest selected crate rather than average account rewards", () => {
    const result = redemptionLosses(selectRedemptionDeposits(snapshot, tv("50").toBigInt()), crates, tv("0.01"))!;
    expect(result.stalk.toHuman()).toBe("60");
    expect(result.seeds.toHuman()).toBe("100");
    expect(result.seasons).toBe(20);
  });
  it("sums complete and partial crates and rounds regrowth seasons up", () => {
    const result = redemptionLosses(selectRedemptionDeposits(snapshot, tv("150").toBigInt()), crates, tv("0.01"))!;
    expect(result.stalk.toHuman()).toBe("220");
    expect(result.seeds.toHuman()).toBe("400");
    expect(result.seasons).toBe(47);
  });
  it("excludes ineligible deposits when selecting Max", () => {
    const eligible = snapshot.map((d) => ({ ...d, eligible: d.stem === 2n }));
    const result = redemptionLosses(selectRedemptionDeposits(eligible, tv("100").toBigInt()), crates, tv("0.01"))!;
    expect(result.stalk.toHuman()).toBe("120");
    expect(result.seeds.toHuman()).toBe("200");
  });
  it("does not invent a regrowth time without a growth rate", () => {
    const result = redemptionLosses(selectRedemptionDeposits(snapshot, tv("200").toBigInt()), crates, TokenValue.ZERO)!;
    expect(result.stalk.toHuman()).toBe("320");
    expect(result.seasons).toBe(0);
  });
  it("does not display rewards for missing or depleted crates", () => {
    const selected = selectRedemptionDeposits(snapshot, tv("150").toBigInt());
    expect(redemptionLosses(selected, [], tv("0.01"))).toBeUndefined();
    expect(redemptionLosses(selected, [crates[0], crate(2n, "10", "12", "20")], tv("0.01"))).toBeUndefined();
  });
});
