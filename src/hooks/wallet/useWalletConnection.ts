import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { withTracking } from "@/utils/analytics";
import { isDev, isLocalhost, isNetlifyPreview, isProd } from "@/utils/utils";
import { TENDERLY_RPC_URL, baseNetwork as base, tenderlyTestnetNetwork as testnet } from "@/utils/wagmi/chains";
import { isCoinbaseWalletConnector, isWalletConnectConnector } from "@/utils/wagmi/connectorFilters";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useConnect } from "wagmi";

const COINBASE_STORAGE_KEY = "cbwsdk.store";

/**
 * Determines the chain ID to connect to based on environment
 */
function getConnectChainId(): number | undefined {
  if (isProd()) {
    return base.id;
  }
  if (isNetlifyPreview()) {
    return TENDERLY_RPC_URL ? testnet.id : base.id;
  }
  if (!isLocalhost()) {
    return base.id;
  }
  return undefined;
}

/**
 * Clears Coinbase Wallet localStorage to prevent popup issues
 * when connecting to a different wallet
 */
function clearCoinbaseStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(COINBASE_STORAGE_KEY);
  } catch {
    // Storage errors are non-critical, silently ignore
  }
}

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
        onError?.(new Error(`Connector not found: ${connectorId}`));
        return;
      }

      const isWalletConnect = isWalletConnectConnector(connector);
      const isCoinbaseWallet = isCoinbaseWalletConnector(connector);

      setConnectingWalletId(connectorId);

      try {
        withTracking(
          ANALYTICS_EVENTS.WALLET.CONNECT_BUTTON_CLICK,
          async () => {
            // Determine chain ID based on environment
            const connectChainId = getConnectChainId();

            // Connect to wallet
            await connectAsync({
              connector,
              ...(connectChainId ? { chainId: connectChainId } : {}),
            });

            // Clear Coinbase storage if connecting to a different wallet
            if (!isCoinbaseWallet) {
              clearCoinbaseStorage();
            }

            // Wait for account sync when needed
            if (isCoinbaseWallet || isDev()) {
              await waitForAccountSync(accountStateRef);
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
}
