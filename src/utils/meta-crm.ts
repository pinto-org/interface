import { useEffect } from "react";
import { useAccount } from "wagmi";
import { isProd } from "./utils";

declare global {
  interface Window {
    MetaCRMTracking?: {
      manualConnectWallet: (address: string | undefined) => void;
    };
  }
}

export function useMetaCRM() {
  const { address } = useAccount();
  const isProduction = isProd();

  useEffect(() => {
    // Only allow this in PROD env
    if (!isProduction) {
      return;
    }

    if (window?.MetaCRMTracking?.manualConnectWallet) {
      window.MetaCRMTracking.manualConnectWallet(address);
    }
  }, [isProduction, address]);
}
