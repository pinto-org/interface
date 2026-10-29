import { TokenValue } from "@/classes/TokenValue";
import { sortAndPickCrates } from "./convert";
import type { DepositData } from "./types";

/** Use the submission picker for display too; never substitute locked/unused crates. */
export function depositTransferPreview(amount: TokenValue, deposits: DepositData[]) {
  const available = deposits.reduce(
    (sum, deposit) => sum.add(deposit.unlockedAmount ?? deposit.amount),
    TokenValue.ZERO,
  );
  // Input and live balances can briefly disagree while the parent reconciles a Sunrise.
  if (!deposits.length || amount.lt(0) || amount.gt(available)) return undefined;
  const picked = sortAndPickCrates("transfer", amount, deposits);
  const ids = new Map(deposits.map((deposit) => [deposit.stem.toBlockchain(), deposit.idHex]));
  return { ...picked, depositIds: picked.crates.map((crate) => ids.get(crate.stem.toBlockchain())!) };
}

/** mulDiv keeps the full product; matching raw token precision makes the ratio exact. */
export function proportionalDepositValue(currentBDV: TokenValue, amount: TokenValue, total: TokenValue) {
  if (total.lte(0)) return TokenValue.ZERO;
  return currentBDV.mulDiv(amount.reDecimal(total.decimals), total);
}
