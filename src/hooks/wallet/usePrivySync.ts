import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackSimpleEvent } from "@/utils/analytics";
import { updatePrivyRefs } from "@/utils/privy/privyRefs";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useRef } from "react";
import { useAccount, useConnect } from "wagmi";

/**
 * Synchronizes Privy embedded wallet with wagmi connection
 *
 * This hook:
 * 1. Updates global Privy refs when authentication state changes
 * 2. Auto-connects Privy embedded wallet to wagmi when authenticated
 * 3. Handles connection state synchronization
 *
 * Must be used inside both PrivyProvider and WagmiProvider
 */
export function usePrivySync(): void {
  const wallets = useWallets();
  const { connectors, connectAsync, status } = useConnect();
  const { address: wagmiAddress } = useAccount();
  const { ready: privyReady, authenticated: privyAuthenticated, logout: privyLogout } = usePrivy();
  const hasAttemptedConnect = useRef(false);

  // Normalize wallets array (useWallets can return array or object with wallets property)
  const walletsArray = Array.isArray(wallets) ? wallets : wallets?.wallets || [];
  const embeddedWallet = walletsArray.find((w) => w.walletClientType === "privy");

  // Update global Privy refs when wallet or logout state changes
  useEffect(() => {
    if (embeddedWallet && privyLogout) {
      updatePrivyRefs(embeddedWallet, privyLogout);
    } else {
      updatePrivyRefs(undefined, undefined);
    }
  }, [embeddedWallet, privyLogout]);

  // Auto-connect Privy embedded wallet to wagmi when authenticated
  useEffect(() => {
    if (!privyReady || !privyAuthenticated) {
      return;
    }

    if (!embeddedWallet) {
      hasAttemptedConnect.current = false;
      return;
    }

    // Check if already connected to the same address
    if (wagmiAddress) {
      if (wagmiAddress.toLowerCase() === embeddedWallet.address.toLowerCase()) {
        hasAttemptedConnect.current = true;
        return;
      }
      hasAttemptedConnect.current = false;
    }

    if (connectors.length === 0) {
      return;
    }

    const privyConnector = connectors.find((c) => c.id === "privy");

    if (!privyConnector) {
      hasAttemptedConnect.current = false;
      return;
    }

    if (status !== "idle" || hasAttemptedConnect.current) {
      return;
    }

    hasAttemptedConnect.current = true;

    connectAsync({ connector: privyConnector })
      .then(() => {
        // Track successful Privy wallet connection
        trackSimpleEvent(ANALYTICS_EVENTS.WALLET.CONNECT_SUCCESS, {
          wallet_type: "privy",
          wallet_name: "Privy Embedded Wallet",
          connection_method: "email_social",
          source: "auto_sync",
        });
      })
      .catch((error) => {
        console.error("usePrivySync - Failed to connect:", error);
        hasAttemptedConnect.current = false;
      });
  }, [embeddedWallet, wagmiAddress, connectAsync, connectors, status, privyReady, privyAuthenticated]);
}
