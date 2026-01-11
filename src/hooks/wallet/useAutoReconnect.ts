import { isCoinbaseWalletConnector } from "@/utils/wagmi/connectorFilters";
import { useEffect, useRef } from "react";
import { useAccount, useConnect, useReconnect } from "wagmi";

const COINBASE_STORAGE_KEY = "cbwsdk.store";

/**
 * Clears Coinbase Wallet localStorage
 */
function clearCoinbaseStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(COINBASE_STORAGE_KEY);
  } catch (error) {
    // localStorage might be unavailable (private browsing, etc.)
    console.debug("Failed to clear Coinbase storage:", error);
  }
}

/**
 * Checks if there's a previous Coinbase Wallet session in localStorage
 * by looking for the account object in cbwsdk.store
 */
function checkCoinbaseLocalStorage(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem(COINBASE_STORAGE_KEY);
    if (!stored) return false;

    const parsed = JSON.parse(stored);
    // Check if account exists in the stored state
    return !!parsed?.state?.account;
  } catch (error) {
    // Failed to parse Coinbase storage, assume no session
    console.debug("Failed to parse Coinbase storage:", error);
    return false;
  }
}

/**
 * Automatically reconnects to previously connected wallets on page refresh
 *
 * This hook:
 * 1. Uses wagmi's built-in reconnect mechanism
 * 2. Falls back to manual reconnect for specific connectors (injected + Coinbase)
 * 3. Only attempts reconnection once per session
 *
 * Must be used inside WagmiProvider
 */
export function useAutoReconnect(): void {
  const { isConnected } = useAccount();
  const { connectors, connectAsync, status } = useConnect();
  const { reconnectAsync } = useReconnect();
  const hasAttemptedReconnect = useRef(false);

  useEffect(() => {
    if (hasAttemptedReconnect.current || isConnected || status !== "idle") {
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (isConnected) {
        hasAttemptedReconnect.current = true;
        return;
      }

      hasAttemptedReconnect.current = true;

      // Check wagmi storage for last connected wallet
      let lastConnectorId: string | undefined;
      try {
        const wagmiStore = localStorage.getItem("wagmi.store");
        if (wagmiStore) {
          const parsed = JSON.parse(wagmiStore);
          lastConnectorId = parsed?.state?.connections?.value?.[0]?.[0];
        }
      } catch (error) {
        // Failed to parse wagmi storage, continue without last connector info
        console.debug("Failed to parse wagmi storage:", error);
      }

      const hasCoinbaseSession = checkCoinbaseLocalStorage();
      const hasOtherWalletConnected = lastConnectorId && !lastConnectorId.toLowerCase().includes("coinbase");

      // If another wallet was last connected, clear Coinbase storage to prevent popup
      if (hasCoinbaseSession && hasOtherWalletConnected) {
        clearCoinbaseStorage();
      }

      // If Coinbase session exists and no other wallet is connected, try Coinbase
      if (hasCoinbaseSession && !hasOtherWalletConnected) {
        const coinbaseConnector = connectors.find((c) => isCoinbaseWalletConnector(c));
        if (coinbaseConnector) {
          try {
            await connectAsync({ connector: coinbaseConnector });
            return;
          } catch (error) {
            if (error instanceof Error && error.message.includes("already connected")) {
              return;
            }
            // Coinbase connect failed, clear the stale session
            clearCoinbaseStorage();
          }
        }
      }

      // Clear Coinbase storage if another wallet was last connected
      if (hasCoinbaseSession && !hasOtherWalletConnected) {
        clearCoinbaseStorage();
      }

      // Try wagmi's built-in reconnect for other wallets
      try {
        await reconnectAsync();
        return;
      } catch (error) {
        // Built-in reconnect failed, try manual approaches
        console.debug("Wagmi reconnect failed:", error);
      }

      // Manual reconnect for injected wallets
      if (typeof window !== "undefined" && window.ethereum) {
        const injectedConnectors = connectors.filter((c) => c.type === "injected" && !c.id.includes("privy"));

        for (const connector of injectedConnectors) {
          try {
            const isAuthorized = await connector.isAuthorized();
            if (isAuthorized) {
              await connectAsync({ connector });
              return;
            }
          } catch (error) {
            if (error instanceof Error && error.message.includes("already connected")) {
              return;
            }
          }
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isConnected, status, connectors, connectAsync, reconnectAsync]);
}
