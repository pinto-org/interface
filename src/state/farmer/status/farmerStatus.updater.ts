import useFarmerBalances from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import useFarmerField from "@/state/useFarmerField";
import useTokenData from "@/state/useTokenData";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { farmerStatusAtom } from "./status.atoms";

export default function useUpdateFarmerStatus() {
  const farmerField = useFarmerField();
  const farmerBalances = useFarmerBalances();
  const farmerDepositedBalances = useFarmerDepositedBalances();
  const protocolToken = useTokenData().mainToken;
  const account = useAccount();

  const hasBalanceOnBase =
    Array.from(farmerBalances.balances.entries()).findIndex((data) => {
      data[1].total.gt(0);
    }) > -1;

  const setStatus = useSetAtom(farmerStatusAtom);

  const balance = farmerBalances.balances.get(protocolToken)?.total;
  const loading = farmerDepositedBalances.isLoading || farmerField.isLoading || farmerBalances.isLoading;

  const hasDeposits = Array.from(farmerDepositedBalances.data.values()).some(
    (tokenData) => tokenData.deposits.length > 0,
  );

  const hasPlots = !!farmerField.plots.length;

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
