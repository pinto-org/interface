import { useEffect, useRef } from "react";
import { useAccount, useConnect, useConnections } from "wagmi";

/**
 * Automatically reconnects to previously connected wallets on page refresh
 *
 * This hook:
 * 1. Checks for saved connections from previous session
 * 2. Attempts to reconnect to non-Privy connectors
 * 3. Checks injected wallets for authorization
 * 4. Only attempts reconnection once per session
 *
 * Must be used inside WagmiProvider
 */
export function useAutoReconnect(): void {
  const { isConnected } = useAccount();
  const { connectors, connectAsync, status } = useConnect();
  const connections = useConnections();
  const hasAttemptedReconnect = useRef(false);

  useEffect(() => {
    if (hasAttemptedReconnect.current || isConnected || status !== "idle") {
      return;
    }

    const timeoutId = setTimeout(async () => {
      // Double check connection status before attempting
      if (isConnected) {
        hasAttemptedReconnect.current = true;
        return;
      }

      // Try to reconnect to saved connection first
      if (connections.length > 0) {
        const savedConnection = connections[0];
        const connector = connectors.find((c) => c.id === savedConnection.connector.id);

        // Only reconnect to non-Privy connectors (Privy is handled by usePrivySync)
        if (connector && connector.id !== "privy" && !connector.id.includes("privy")) {
          hasAttemptedReconnect.current = true;
          try {
            await connectAsync({ connector });
          } catch (error) {
            // Ignore "already connected" errors
            if (error instanceof Error && error.message.includes("already connected")) {
              console.log("useAutoReconnect - Connector already connected, skipping");
            } else {
              console.error("useAutoReconnect - Failed to reconnect:", error);
              hasAttemptedReconnect.current = false;
            }
          }
          return;
        }
      }

      // If no saved connection, check for authorized injected wallets
      if (typeof window !== "undefined" && window.ethereum) {
        const injectedConnectors = connectors.filter((c) => c.type === "injected" && !c.id.includes("privy"));

        for (const connector of injectedConnectors) {
          try {
            const isAuthorized = await connector.isAuthorized();

            if (isAuthorized && !hasAttemptedReconnect.current) {
              hasAttemptedReconnect.current = true;
              try {
                await connectAsync({ connector });
                return;
              } catch (error) {
                // Ignore "already connected" errors
                if (error instanceof Error && error.message.includes("already connected")) {
                  console.log(`useAutoReconnect - ${connector.id} already connected, skipping`);
                  return;
                }
                console.error(`useAutoReconnect - Failed to reconnect to ${connector.id}:`, error);
                hasAttemptedReconnect.current = false;
              }
            }
          } catch (error) {
            console.error(`useAutoReconnect - Error checking authorization for ${connector.id}:`, error);
          }
        }
      }

      hasAttemptedReconnect.current = true;
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isConnected, status, connectors, connectAsync, connections]);
}
