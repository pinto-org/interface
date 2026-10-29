import { TokenValue } from "@/classes/TokenValue";
import type { DepositData, Token, TokenDepositData } from "./types";

export function depositFingerprint(deposits: readonly DepositData[] = []) {
  return JSON.stringify(
    deposits
      .map((d) => [
        d.id.toString(),
        d.amount.toBlockchain(),
        d.depositBdv.toBlockchain(),
        (d.unlockedAmount ?? d.amount).toBlockchain(),
        d.isGerminating,
        d.stalk.total.toBlockchain(),
        d.seeds.toBlockchain(),
      ])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
  );
}

export type DepositSelection = { token: Token; amount: string; deposits: DepositData[] };

/** Never silently add a new token/crate to a user's selection after auto-convert. */
export function reconcileDepositSelection(selection: DepositSelection[], current: Map<Token, TokenDepositData>) {
  let changed = false;
  const next = selection.flatMap((row) => {
    const latest = [...current].find(([t]) => t.address.toLowerCase() === row.token.address.toLowerCase())?.[1];
    const ids = new Set(row.deposits.map((d) => d.id.toString()));
    const deposits = (latest?.deposits ?? []).filter((d) => ids.has(d.id.toString()));
    const available = deposits.reduce((sum, d) => sum.add(d.unlockedAmount ?? d.amount), TokenValue.ZERO);
    if (!deposits.length || available.lte(0)) {
      changed = true;
      return [];
    }
    const requested = TokenValue.fromHuman(row.amount || 0, row.token.decimals);
    const amount = requested.gt(available) ? available.toHuman() : row.amount;
    if (amount !== row.amount || depositFingerprint(deposits) !== depositFingerprint(row.deposits)) changed = true;
    return [{ ...row, amount, deposits }];
  });
  return { changed, selection: changed ? next : selection };
}
