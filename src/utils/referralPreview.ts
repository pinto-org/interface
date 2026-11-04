import { parseAbi, type Address, type PublicClient } from "viem";

// Keep the preview tied to contract policy, not the historical 5% UI constant.
const referralPreviewABI = parseAbi([
  "function isValidReferrer(address) view returns (bool)",
  "function getRefereePercentage() view returns (uint256)",
  "function getTargetReferralPods() view returns (uint256)",
  "function getTotalReferralPods() view returns (uint256)",
]);

export interface ReferralRewards {
  eligible: boolean;
  refereePercentage: bigint;
  remainingPods: bigint;
  blockNumber: bigint;
}

export async function readReferralRewards(
  client: PublicClient,
  diamond: Address,
  referrer: Address,
): Promise<ReferralRewards> {
  const blockNumber = await client.getBlockNumber();
  const args = { address: diamond, abi: referralPreviewABI, blockNumber } as const;
  // One block for eligibility, percentage and shared reward-pool balance.
  // Any failed read rejects the whole preview; no optimistic defaults.
  const [eligible, refereePercentage, target, total] = await Promise.all([
    client.readContract({ ...args, functionName: "isValidReferrer", args: [referrer] }),
    client.readContract({ ...args, functionName: "getRefereePercentage" }),
    client.readContract({ ...args, functionName: "getTargetReferralPods" }),
    client.readContract({ ...args, functionName: "getTotalReferralPods" }),
  ]);
  return { eligible, refereePercentage, remainingPods: target > total ? target - total : 0n, blockNumber };
}

/** Estimated referee Pods (6 decimals), not a guaranteed future reward.
 * LibDibbler floors bonus Pinto first and allocates the referee before the referrer.
 * Scale the form's base-Pod estimate by those rounded Pinto, then cap at the pool.
 */
export function estimateReferralBonus(pinto: bigint, basePods: bigint, rewards?: ReferralRewards): bigint {
  if (
    !rewards?.eligible ||
    pinto <= 0n ||
    basePods <= 0n ||
    rewards.refereePercentage <= 0n ||
    rewards.remainingPods <= 0n
  )
    return 0n;
  const bonusPinto = (pinto * rewards.refereePercentage) / 1_000_000n;
  const pods = (bonusPinto * basePods) / pinto;
  return pods < rewards.remainingPods ? pods : rewards.remainingPods;
}
