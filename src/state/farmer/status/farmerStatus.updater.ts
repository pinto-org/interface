import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerDepositsForAccountQuery } from "@/state/useFarmerDepositedBalances";
import { useFarmerPlotsQuery } from "@/state/useFarmerField";
import useTokenData from "@/state/useTokenData";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { farmerStatusAtom } from "./status.atoms";

export default function useUpdateFarmerStatus() {
  const depositsQuery = useFarmerDepositsForAccountQuery();
  const plotsQuery = useFarmerPlotsQuery();

  const balances = useFarmerBalances();
  const protocolToken = useTokenData().mainToken;
  const account = useAccount();

  const hasBalanceOnBase =
    Array.from(balances.balances.entries()).findIndex((data) => {
      data[1].total.gt(0);
    }) > -1;

  const setStatus = useSetAtom(farmerStatusAtom);

  const balance = balances.balances.get(protocolToken)?.total;
  const loading = depositsQuery.isLoading || plotsQuery.isLoading || balances.isLoading;

  const hasDeposits = !!depositsQuery.data?.some((deposit) => !!deposit.depositIds.length);

  const hasPlots = !!plotsQuery.data?.length;

  const hasUndepositedBalance = Boolean(balance?.gt(0));

  useEffect(() => {
    setStatus((draft) => {
      draft.loading = loading;
      if (!loading) {
        draft.didLoad = true;
      }
    });
  }, [loading, setStatus]);

  useEffect(() => {
    setStatus((draft) => {
      draft.address = account.address;
    });
  }, [account.address, setStatus]);

  useEffect(() => {
    if (loading) return;

    setStatus((draft) => {
      draft.hasDeposits = hasDeposits;
      draft.hasPlots = hasPlots;
      draft.hasUndepositedBalance = hasUndepositedBalance;
      draft.hasBalanceOnBase = hasBalanceOnBase;
    });
  }, [hasDeposits, hasPlots, hasUndepositedBalance, hasBalanceOnBase, loading, setStatus]);
}
