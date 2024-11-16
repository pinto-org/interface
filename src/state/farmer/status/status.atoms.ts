import { atomWithImmer } from "jotai-immer";
import { Address } from "viem";

export interface FarmerStatus {
  address: Address | undefined;
  loading: boolean;
  hasPlots: boolean;
  hasDeposits: boolean;
  hasUndepositedBalance: boolean;
  didLoad: boolean;
}

export const farmerStatusAtom = atomWithImmer<FarmerStatus>({
  address: undefined,
  loading: true,
  hasPlots: false,
  hasDeposits: false,
  hasUndepositedBalance: true,
  didLoad: false,
});
