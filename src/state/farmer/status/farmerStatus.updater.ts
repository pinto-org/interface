import { MAIN_TOKEN, S_MAIN_TOKEN } from "@/constants/tokens";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerPlotsQuery } from "@/state/useFarmerField";
import { useChainAddress, useChainConstant } from "@/utils/chain";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { farmerStatusAtom } from "./status.atoms";

const querySettings = {
  staleTime: 1000 * 60 * 20, // 20 minutes, in milliseconds
  refetchInterval: 1000 * 60 * 20, // 20 minutes, in milliseconds
};

function useFarmerDepositsForAccountQuery(address?: Address) {
  const diamondAddress = useChainAddress(beanstalkAddress);
  const account = useAccount();

  const readAddress = address ?? account.address;

  return useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getDepositsForAccount",
    args: [readAddress as Address],
    query: {
      ...querySettings,
      refetchOnWindowFocus: true,
      enabled: Boolean(readAddress),
    },
  });
}

export default function useUpdateFarmerStatus() {
  const depositsQuery = useFarmerDepositsForAccountQuery();
  const plotsQuery = useFarmerPlotsQuery();

  const protocolToken = useChainConstant(MAIN_TOKEN);
  const siloedProtocolToken = useChainConstant(S_MAIN_TOKEN);

  const balances = useFarmerBalances();
  const account = useAccount();

  const hasBalanceOnBase =
    Array.from(balances.balances.entries()).findIndex((data) => {
      data[1].total.gt(0);
    }) > -1;

  const setStatus = useSetAtom(farmerStatusAtom);

  const balance = balances.balances.get(protocolToken)?.total;
  const siloedTokenBalance = balances.balances.get(siloedProtocolToken)?.total;

  const loading = depositsQuery.isLoading || plotsQuery.isLoading || balances.isLoading;

  const hasDeposits = !!depositsQuery.data?.some((deposit) => !!deposit.depositIds.length);

  const hasPlots = !!plotsQuery.data?.length;

  const hasSiloWrappedTokenBalance = Boolean(siloedTokenBalance?.gt(0));
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
      draft.hasSiloWrappedTokenBalance = hasSiloWrappedTokenBalance;
    });
  }, [hasDeposits, hasPlots, hasUndepositedBalance, hasBalanceOnBase, hasSiloWrappedTokenBalance, loading, setStatus]);
}
