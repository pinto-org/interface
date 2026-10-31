import { TokenValue } from "@/classes/TokenValue";
import type { RedemptionSelection } from "@/utils/siloRedemption";
import type { DepositData } from "@/utils/types";

/** Preview the exact crates selected for redemption, not a share of the wallet's aggregate rewards. */
export function redemptionLosses(
  selection: RedemptionSelection,
  deposits: readonly DepositData[],
  averageGrowth: TokenValue,
) {
  let stalk = TokenValue.ZERO;
  let seeds = TokenValue.ZERO;
  let bdv = TokenValue.ZERO;
  const byStem = new Map(deposits.map((deposit) => [deposit.stem.toBigInt(), deposit]));
  for (let i = 0; i < selection.stems.length; i++) {
    const deposit = byStem.get(selection.stems[i]);
    const amount = selection.amounts[i];
    if (!deposit || amount <= 0n || amount > deposit.amount.toBigInt()) return undefined;
    const portion = TokenValue.fromBlockchain(amount, deposit.token.decimals);
    stalk = stalk.add(deposit.stalk.total.mul(portion).div(deposit.amount));
    seeds = seeds.add(deposit.seeds.mul(portion).div(deposit.amount));
    bdv = bdv.add(deposit.depositBdv.mul(portion).div(deposit.amount));
  }
  const grownStalk = stalk.sub(bdv);
  const growthPerSeason = bdv.mul(averageGrowth);
  const seasons = grownStalk.gt(0) && growthPerSeason.gt(0) ? Math.ceil(grownStalk.div(growthPerSeason).toNumber()) : 0;
  return { stalk, seeds, seasons };
}
