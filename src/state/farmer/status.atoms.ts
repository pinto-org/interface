import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerDepositsForAccountQuery } from "@/state/useFarmerDepositedBalances";
import { useFarmerPlotsQuery } from "@/state/useFarmerField";
import useTokenData from "@/state/useTokenData";
import { useAtom, useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useEffect } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

export interface FarmerStatus {
  address: Address | undefined;
  loading: boolean;
  hasPlots: boolean;
  hasDeposits: boolean;
  hasUndepositedBalance: boolean;
}

export const farmerStatusAtom = atomWithImmer<FarmerStatus>({
  address: undefined,
  loading: true,
  hasPlots: false,
  hasDeposits: false,
  hasUndepositedBalance: false,
});
