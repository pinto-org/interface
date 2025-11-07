import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { withTracking } from "@/utils/analytics";
import { isDev, isLocalhost, isNetlifyPreview, isProd } from "@/utils/utils";
import { TENDERLY_RPC_URL, baseNetwork as base, tenderlyTestnetNetwork as testnet } from "@/utils/wagmi/chains";
import { isCoinbaseWalletConnector, isWalletConnectConnector } from "@/utils/wagmi/connectorFilters";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import type { Connector } from "wagmi";

export interface UseWalletConnectionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseWalletConnectionReturn {
  connect: (connectorId: string) => Promise<void>;
  isPending: boolean;
  connectingWalletId: string | null;
}

/**
 * Hook for managing wallet connections with analytics and error handling
 *
 * Features:
 * - Connects to wallets with proper chain selection based on environment
 * - Tracks analytics events for connections
 * - Handles WalletConnect and Coinbase Wallet special cases
 * - Waits for account sync when needed
 * - Provides error handling with callbacks
 *
 * @param options - Configuration options for connection behavior
 * @returns Connection function, pending state, and currently connecting wallet ID
 */
export function useWalletConnection(options?: UseWalletConnectionOptions): UseWalletConnectionReturn {
  const { onSuccess, onError } = options || {};
  const { connectors, connectAsync, isPending } = useConnect();
  const { address, isConnected, status: accountStatus, chainId } = useAccount();
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);

  // Use refs to access latest account state in async callbacks
  const accountStateRef = useRef({ address, isConnected, accountStatus, chainId });

  useEffect(() => {
    accountStateRef.current = { address, isConnected, accountStatus, chainId };
  }, [address, isConnected, accountStatus, chainId]);

  const connect = useCallback(
    async (connectorId: string) => {
      const connector = connectors.find((c) => c.id === connectorId);

      if (!connector) {
        const error = new Error(`Connector not found: ${connectorId}`);
        console.error(error.message);
        onError?.(error);
        return;
      }

      const isWalletConnect = isWalletConnectConnector(connector);
      const isCoinbaseWallet = isCoinbaseWalletConnector(connector);

      setConnectingWalletId(connectorId);

      try {
        await withTracking(
          ANALYTICS_EVENTS.WALLET.CONNECT_BUTTON_CLICK,
          async () => {
            // Determine chain ID based on environment
            let connectChainId: number | undefined = undefined;

            if (isProd()) {
              connectChainId = base.id;
            } else if (isNetlifyPreview()) {
              connectChainId = !!TENDERLY_RPC_URL ? testnet.id : base.id;
            } else if (!isLocalhost()) {
              connectChainId = base.id;
            }

            // Connect to wallet
            await connectAsync({
              connector,
              ...(connectChainId ? { chainId: connectChainId } : {}),
            });

            // Wait for account sync if needed (especially for Coinbase Wallet)
            const shouldWaitForAccountSync = isCoinbaseWallet || isDev();
            if (shouldWaitForAccountSync) {
              await waitForAccountSync(accountStateRef, connector.name);
            }

            // Track successful connection
            withTracking(ANALYTICS_EVENTS.WALLET.CONNECT_SUCCESS, () => {}, {
              wallet_type: connectorId,
              wallet_name: connector.name,
              connection_method: isWalletConnect ? "qr_code" : "browser_extension",
              source: "wallet_connection_modal",
            })();
          },
          {
            wallet_type: connectorId,
            wallet_name: connector.name,
            source: "wallet_connection_modal",
          },
        )();

        onSuccess?.();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`Connection error for ${connector.name}:`, error);

        if (isCoinbaseWallet) {
          console.warn("Coinbase Wallet connection failed. Possible reasons:");
          console.warn("1. Extension not installed");
          console.warn("2. QR modal couldn't open");
          console.warn("3. User cancelled connection");
        }

        onError?.(err);
      } finally {
        setConnectingWalletId(null);
      }
    },
    [connectors, connectAsync, onSuccess, onError],
  );

  return {
    connect,
    isPending,
    connectingWalletId,
  };
}

/**
 * Waits for account to be available after connection
 * Polls account state with timeout
 */
async function waitForAccountSync(
  accountStateRef: React.MutableRefObject<{
    address: `0x${string}` | undefined;
    isConnected: boolean;
    accountStatus: string;
    chainId: number | undefined;
  }>,
  connectorName: string,
): Promise<void> {
  const maxWaitTime = 5000;
  const pollInterval = 100;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const currentState = accountStateRef.current;
    if (currentState.isConnected && currentState.address) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  const finalState = accountStateRef.current;
  if (!finalState.isConnected || !finalState.address) {
    console.warn(`${connectorName} account did not sync within timeout`);
    console.warn("Current state:", finalState);
  }
}
