import { TV } from "@/classes/TokenValue";
import { STALK } from "@/constants/internalTokens";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSunData } from "@/state/useSunData";
import { exists } from "@/utils/utils";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export default function useMaxBurnableStalkOnRain() {
  const account = useAccount();
  const farmerSilo = useFarmerSilo();
  const raining = useSunData().raining;

  const rainRoots = farmerSilo.flood.roots;

  const activeStalkBalance = farmerSilo.activeStalkBalance;

  const roots = farmerSilo.rootsBalance;

  const maxBurnableStalk = useMemo(() => {
    if (!raining || !exists(roots) || !exists(rainRoots) || !account.address || roots === 0n || rainRoots === 0n) {
      return undefined;
    }

    const rainStalk = (activeStalkBalance.toBigInt() * (rainRoots ?? 0n)) / roots;
    const rainStalkTV = TV.fromBigInt(rainStalk, STALK.decimals);

    return activeStalkBalance.sub(rainStalkTV);
  }, [raining, rainRoots, roots, activeStalkBalance, account.address]);

  return maxBurnableStalk;
}
