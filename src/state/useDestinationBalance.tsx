import { useFarmerBalances } from "@/state/useFarmerBalances";
// utils/useBalanceToMode.ts
import { FarmToMode } from "@/utils/types";
import { useEffect, useState } from "react";

export const useDestinationBalance = () => {
  const balances = useFarmerBalances();
  const [balanceTo, setBalanceTo] = useState<FarmToMode>(FarmToMode.EXTERNAL);
  const [didSet, setDidSet] = useState(false);

  useEffect(() => {
    if (didSet) return;

    if (balances) {
      const hasInternalBalance = Array.from(balances.balances.entries()).some(([_, balance]) => balance.internal.gt(0));
      if (hasInternalBalance) {
        setBalanceTo(FarmToMode.INTERNAL);
      } else {
        setBalanceTo(FarmToMode.EXTERNAL);
      }
      setDidSet(true);
    }
  }, [didSet, balances]);

  return { balanceTo, setBalanceTo };
};
