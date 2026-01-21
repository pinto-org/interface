import { isCoinbaseWalletConnector } from "@/utils/wagmi/connectorFilters";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useReconnect } from "wagmi";

const COINBASE_STORAGE_KEY = "cbwsdk.store";

/**
 * Gets account address from Coinbase localStorage if available
 */
function getCoinbaseStoredAccount(): `0x${string}` | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(COINBASE_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const accounts = parsed?.state?.account?.accounts;
    return (accounts?.[0] as `0x${string}`) ?? null;
  } catch {
    return null;
  }
}

/**
 * Automatically reconnects to previously connected wallets on page refresh.
 *
 * - Uses wagmi's built-in reconnect mechanism
 * - Falls back to manual reconnect for Coinbase Wallet
 * - Only attempts reconnection once per session
 */
export function useAutoReconnect(): void {
  const { isConnected, address } = useAccount();
  const { connectors, connectAsync, status: connectStatus } = useConnect();
  const { reconnect, status: reconnectStatus } = useReconnect();
  const hasAttemptedReconnect = useRef(false);
  const [initialWaitComplete, setInitialWaitComplete] = useState(false);

  const attemptManualReconnect = useCallback(async () => {
    const storedAccount = getCoinbaseStoredAccount();
    if (!storedAccount) return;

    const coinbaseConnector = connectors.find(isCoinbaseWalletConnector);
    if (!coinbaseConnector) return;

    // Try connector.getAccounts() first
    try {
      const accounts = await coinbaseConnector.getAccounts();
      if (accounts?.length > 0) {
        await connectAsync({ connector: coinbaseConnector });
        return;
      }
    } catch {
      // Fall through to eth_accounts
    }

    // Try eth_accounts (doesn't open popup)
    try {
      const provider = (await coinbaseConnector.getProvider()) as {
        request: (args: { method: string }) => Promise<unknown>;
      };
      const existingAccounts = (await provider.request({ method: "eth_accounts" })) as string[];

      if (existingAccounts?.length > 0) {
        await connectAsync({ connector: coinbaseConnector });
      }
    } catch {
      // Silent fail - user can manually reconnect
    }
  }, [connectors, connectAsync]);

  // Wait for Coinbase SDK to auto-reconnect before attempting manual reconnect
  useEffect(() => {
    if (isConnected || address) {
      hasAttemptedReconnect.current = true;
      return;
    }

    if (!getCoinbaseStoredAccount()) {
      hasAttemptedReconnect.current = true;
      return;
    }

    const timer = setTimeout(() => setInitialWaitComplete(true), 1500);
    return () => clearTimeout(timer);
  }, [isConnected, address]);

  // Attempt manual reconnect after initial wait
  useEffect(() => {
    if (!initialWaitComplete || hasAttemptedReconnect.current) return;
    if (isConnected || address) {
      hasAttemptedReconnect.current = true;
      return;
    }
    if (reconnectStatus === "pending" || connectStatus === "pending") return;

    hasAttemptedReconnect.current = true;
    attemptManualReconnect();
  }, [initialWaitComplete, isConnected, address, reconnectStatus, connectStatus, attemptManualReconnect]);

  // Try wagmi's built-in reconnect on mount (skip if already connected)
  useEffect(() => {
    if (isConnected || address) return;

    const coinbaseConnector = getCoinbaseStoredAccount() ? connectors.find(isCoinbaseWalletConnector) : null;

    if (coinbaseConnector) {
      reconnect({ connectors: [coinbaseConnector] });
    } else {
      reconnect();
    }
  }, [reconnect, connectors, isConnected, address]);
}
