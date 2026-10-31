import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { redemptionLosses } from "@/utils/redemptionLosses";
import { type RedemptionDeposit, parseRedemptionAmount, selectRedemptionDeposits } from "@/utils/siloRedemption";
import type { Token } from "@/utils/types";
import { noop } from "@/utils/utils";
import { useMemo } from "react";

export default function FeeFreeWithdrawalAmount({
  token,
  amount,
  setAmount,
  deposits,
  disabled,
  loading,
}: {
  token: Token;
  amount: string;
  setAmount: (value: string) => void;
  deposits: readonly RedemptionDeposit[];
  disabled: boolean;
  loading: boolean;
}) {
  const farmer = useFarmerSilo();
  const silo = useSiloData();
  const available = deposits.reduce((sum, deposit) => sum + (deposit.eligible ? deposit.available : 0n), 0n);
  const balanceMap = useMemo(
    () => new Map([[token, TokenValue.fromBlockchain(available, token.decimals)]]),
    [token, available],
  );
  let exceedsAvailable = false;
  let losses: ReturnType<typeof redemptionLosses>;
  try {
    const parsed = parseRedemptionAmount(amount, token.decimals);
    exceedsAvailable = parsed > available;
    if (parsed > 0n && !loading && !farmer.depositsError) {
      const selection = selectRedemptionDeposits(deposits, parsed);
      const crates = farmer.deposits.get(token)?.deposits ?? [];
      // A balance refresh must not combine new eligibility with stale reward amounts.
      const consistent = selection.stems.every((stem) => {
        const snapshot = deposits.find((deposit) => deposit.stem === stem);
        const crate = crates.find((deposit) => deposit.stem.toBigInt() === stem);
        return (
          crate &&
          snapshot &&
          crate.amount.toBigInt() === snapshot.amount &&
          crate.depositBdv.toBigInt() === snapshot.bdv
        );
      });
      if (consistent) losses = redemptionLosses(selection, crates, silo.averageGrownStalkPerBdvPerSeason);
    }
  } catch {
    // Invalid, excessive, or incomplete amounts have no withdrawal preview.
  }
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="h-10 flex items-center pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
          Amount to Withdraw
        </div>
        <ComboInputField
          amount={amount}
          setAmount={setAmount}
          selectedToken={token}
          setToken={noop}
          tokenAndBalanceMap={balanceMap}
          mode="balance"
          disableButton
          disableClamping
          disableDebounce
          disableInput={disabled || loading}
          isLoading={loading}
          error={exceedsAvailable}
          altText="Eligible balance:"
          balanceTextClassName={exceedsAvailable ? "text-red-500" : undefined}
        />
      </div>
      {losses && (
        <SiloOutputDisplay
          title=""
          stalk={losses.stalk}
          seeds={losses.seeds}
          stalkLabel="Stalk Burnt"
          seedsLabel="Seeds Lost"
          showNegativeDeltas
          showGrownStalkSeasonsNotice
          showGrownStalkTime
          grownStalkSeasons={losses.seasons}
        />
      )}
    </div>
  );
}
