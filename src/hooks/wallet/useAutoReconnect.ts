import { useEffect, useRef } from "react";
import { useAccount, useConnect, useReconnect } from "wagmi";

/**
 * Automatically reconnects to previously connected wallets on page refresh
 *
 * This hook:
 * 1. Uses wagmi's built-in reconnect mechanism
 * 2. Falls back to manual reconnect for specific connectors
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

      try {
        // First, try wagmi's built-in reconnect
        await reconnectAsync();
        console.log("useAutoReconnect - Reconnected via wagmi reconnect");
        return;
      } catch (error) {
        // Reconnect failed, try manual approach
        console.log("useAutoReconnect - wagmi reconnect failed, trying manual approach");
      }

      // Manual reconnect for injected wallets
      if (typeof window !== "undefined" && window.ethereum) {
        const injectedConnectors = connectors.filter((c) => c.type === "injected" && !c.id.includes("privy"));

        for (const connector of injectedConnectors) {
          try {
            const isAuthorized = await connector.isAuthorized();
            if (isAuthorized) {
              await connectAsync({ connector });
              console.log(`useAutoReconnect - Connected to ${connector.id}`);
              return;
            }
          } catch (error) {
            if (error instanceof Error && error.message.includes("already connected")) {
              console.log(`useAutoReconnect - ${connector.id} already connected`);
              return;
            }
            console.error(`useAutoReconnect - Failed to reconnect to ${connector.id}:`, error);
          }
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isConnected, status, connectors, connectAsync, reconnectAsync]);
}
