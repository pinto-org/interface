import { atom } from "jotai";

export type NavbarPanelType = "price" | "seasons" | "wallet" | "mobile-navi" | "chart-select" | undefined;

// Define specific view states for each panel type
export interface WalletPanelState {
  balanceTab: string;
  showClaim?: boolean;
  showTransfer?: boolean;
}

export interface NavbarPanelState {
  openPanel: NavbarPanelType;
  backdropMounted: boolean;
  backdropVisible: boolean;
  walletPanel: WalletPanelState;
}

export const navbarPanelAtom = atom<NavbarPanelState>({
  openPanel: undefined,
  backdropMounted: true,
  backdropVisible: false,
  walletPanel: {
    balanceTab: "combined",
    showClaim: false,
    showTransfer: false,
  },
});

// Helper function to open wallet panel directly to claim view
export const openWalletPanelToClaim = (
  setPanelState: (value: NavbarPanelState) => void,
  currentState: NavbarPanelState,
) => {
  setPanelState({
    ...currentState,
    openPanel: "wallet",
    backdropMounted: true,
    backdropVisible: true,
    walletPanel: {
      ...currentState.walletPanel,
      showClaim: true,
      showTransfer: false,
    },
  });
};
