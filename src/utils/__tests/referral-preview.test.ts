import { expect, test, vi } from "vitest";
import { estimateReferralBonus, readReferralRewards, type ReferralRewards } from "@/utils/referralPreview";

const rewards: ReferralRewards = {
  eligible: true,
  refereePercentage: 50_000n,
  remainingPods: 100_000_000n,
  blockNumber: 12n,
};
test("uses current percentage, floors Pinto first, and caps referee Pods at the shared pool", () => {
  expect(estimateReferralBonus(1_000_000n, 48_370_000n, rewards)).toBe(2_418_500n);
  expect(estimateReferralBonus(1_000_000n, 48_370_000n, { ...rewards, refereePercentage: 100_000n })).toBe(4_837_000n);
  expect(estimateReferralBonus(1_000_000n, 48_370_000n, { ...rewards, remainingPods: 123n })).toBe(123n);
  expect(estimateReferralBonus(19n, 919n, rewards)).toBe(0n);
  expect(estimateReferralBonus(20n, 967n, rewards)).toBe(48n);
});
test("never previews unverified, ineligible, empty or disabled rewards", () => {
  for (const data of [
    undefined,
    { ...rewards, eligible: false },
    { ...rewards, remainingPods: 0n },
    { ...rewards, refereePercentage: 0n },
  ]) {
    expect(estimateReferralBonus(1_000_000n, 48_370_000n, data)).toBe(0n);
  }
  expect(estimateReferralBonus(0n, 48_370_000n, rewards)).toBe(0n);
  expect(estimateReferralBonus(1n, 0n, rewards)).toBe(0n);
});
test("reads all policy fields at one block and fails the entire preview on missing data", async () => {
  const values: Record<string, unknown> = {
    isValidReferrer: true,
    getRefereePercentage: 50_000n,
    getTargetReferralPods: 1_000n,
    getTotalReferralPods: 900n,
  };
  const readContract = vi.fn(async (args) => values[args.functionName]);
  const client = { getBlockNumber: vi.fn(async () => 42n), readContract };
  const diamond = "0x0000000000000000000000000000000000000001";
  const referrer = "0x0000000000000000000000000000000000000002";
  expect(await readReferralRewards(client as any, diamond, referrer)).toEqual({
    ...rewards,
    remainingPods: 100n,
    blockNumber: 42n,
  });
  expect(readContract.mock.calls.every(([args]) => args.blockNumber === 42n && args.address === diamond)).toBe(true);
  expect(readContract.mock.calls[0][0].args).toEqual([referrer]);
  values.getTotalReferralPods = 1_001n;
  expect((await readReferralRewards(client as any, diamond, referrer)).remainingPods).toBe(0n);
  readContract.mockRejectedValueOnce(new Error("RPC unavailable"));
  await expect(readReferralRewards(client as any, diamond, referrer)).rejects.toThrow("RPC unavailable");
});
