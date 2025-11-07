import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import type { ConnectedWallet } from "@privy-io/react-auth";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ConnectKitProvider } from "connectkit";
import { atom, useAtom } from "jotai";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { createTestClient } from "viem";
import { http, WagmiProvider, createConfig, createStorage, useAccount, useConnect, useConnections } from "wagmi";
import type { CreateConnectorFn } from "wagmi";
import { mock } from "wagmi/connectors";
import { privyConfig } from "./utils/privy/privy.config";
import { isValidAddress } from "./utils/string";
import { isLocalhost, isNetlifyPreview, isProd } from "./utils/utils";
import {
  TENDERLY_RPC_URL,
  baseNetwork as base,
  localhostNetwork as localhost,
  tenderlyTestnetNetwork as testnet,
} from "./utils/wagmi/chains";
import { buildBaseConfigParams } from "./utils/wagmi/config";
import { privy as privyConnector } from "./utils/wagmi/connectors/privy";

// biome-ignore lint/suspicious/noExplicitAny: React Query needs this to serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const queryClient = new QueryClient({
  defaultOptions: {
    dehydrate: {
      shouldDehydrateQuery: (query) => {
        return query.meta?.persist === true;
      },
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

  if (!privyAppId) {
    console.warn("VITE_PRIVY_APP_ID is not set. Privy email/social login will not work.");
  }

  return (
    <PrivyProvider appId={privyAppId || ""} config={privyConfig}>
      {/**
       * If the cache that is found has a different buster string than what is set here, it will be discarded.
       * Should be changed whenever there's a significant change in the subgraphs.
       * Currently it is based on the date that the string is being set, in the YYYYMMDD format.
       * But really it can be anything, as long as it's different than what's expected to be stored.
       */}
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: localStoragePersister, buster: "20250501" }}
      >
        <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
      </PersistQueryClientProvider>
    </PrivyProvider>
  );
};

// Global references for Privy connector (allows connector to work even when config is stable)
// These are updated when Privy authenticates, but the connector instance in config stays the same
let privyEmbeddedWalletRef: ConnectedWallet | undefined = undefined;
let privyLogoutRef: (() => Promise<void>) | null = null;

// Helper to get current Privy embedded wallet (used by Privy connector)
const getPrivyEmbeddedWallet = () => {
  return privyEmbeddedWalletRef;
};

// Create a stable base config outside component (only for non-localhost)
// This ensures the config instance never changes, allowing wagmi's storage to work properly
// Privy connector is always included, but uses global refs that can be updated dynamically
const stableBaseConfig = createConfig(
  buildBaseConfigParams({
    additionalConnectors: [
      privyConnector({
        getEmbeddedWallet: getPrivyEmbeddedWallet,
        logout: () => {
          if (privyLogoutRef) {
            return privyLogoutRef();
          }
          return Promise.resolve();
        },
      }),
    ],
  }),
);

// Inner component that uses Privy hooks (must be inside PrivyProvider)
function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const wagmiConfig = useEnvConfig(stableBaseConfig);

  return (
    <WagmiProvider config={wagmiConfig}>
      <MockConnectorManager />
      <AutoReconnect />
      <PrivyWagmiSync />
      <ConnectKitProvider
        mode="light"
        customTheme={{
          "--ck-font-family": "Pinto",
          "--ck-border-radius": "24px",
          "--ck-body-color": "#404040",
          "--ck-body-background": "#FCFCFC",
          "--ck-modal-box-shadow": "0px 0px 0px 1px rgb(217, 217, 217)",
          "--ck-overlay-backdrop-filter": "blur(2px)",
          "--ck-overlay-background": "rgb(255 255 255 / 0.5)",
          "--ck-primary-button-font-weight": "400",
          "--ck-primary-button-box-shadow": "0px 0px 0px 1px rgb(217, 217, 217)",
          "--ck-primary-button-background": "#FCFCFC",
          "--ck-primary-button-hover-background": "#EBEBEB",
          "--ck-secondary-button-background": "#FCFCFC",
          "--ck-secondary-button-hover-background": "#EBEBEB",
          "--ck-secondary-button-box-shadow": "0px 0px 0px 1px rgb(217, 217, 217)",
          "--ck-spinner-color": "rgb(36 102 69)",
          "--ck-qr-border-color": "rgb(217, 217, 217)",
          "--ck-qr-dot-color": "rgb(36 102 69)",
          "--ck-body-divider": "rgb(217, 217, 217)",
        }}
        options={{
          initialChainId: getDefaultChainId(),
          avoidLayoutShift: true,
          hideNoWalletCTA: true,
          hideQuestionMarkCTA: true,
          enforceSupportedChains: true,
        }}
      >
        {children}
      </ConnectKitProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </WagmiProvider>
  );
}

// New component to handle mock connector logic
function MockConnectorManager() {
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();

  // Impersonate account whenever mockAddress changes
  useEffect(() => {
    if (isLocal && isValidAddress(mockAddress)) {
      anvilTestClient.impersonateAccount({ address: mockAddress });
    }
  }, [mockAddress, isLocal]);

  return null;
}

// Add atom for mock address with stored value or default
export const mockAddressAtom = atom<`0x${string}`>(
  // default to local storage
  (localStorage.getItem("mockAddress") as `0x${string}`) ||
    null ||
    // if none in local storage, use env variable
    "0x",
);

export const anvilTestClient = createTestClient({
  mode: "anvil",
  chain: localhost,
  transport: http(),
});

const getDefaultChainId = () => {
  if (isProd()) {
    return base.id;
  }
  if (isNetlifyPreview()) {
    return !!TENDERLY_RPC_URL ? testnet.id : base.id;
  }
  return localhost.id;
};

// Component to automatically reconnect to injected wallets on page refresh
function AutoReconnect() {
  const { isConnected } = useAccount();
  const { connectors, connectAsync, status } = useConnect();
  const connections = useConnections();
  const hasAttemptedReconnect = useRef(false);

  useEffect(() => {
    if (hasAttemptedReconnect.current || isConnected || status !== "idle") {
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (connections.length > 0) {
        const savedConnection = connections[0];
        const connector = connectors.find((c) => c.id === savedConnection.connector.id);

        if (connector && connector.id !== "privy" && !connector.id.includes("privy")) {
          hasAttemptedReconnect.current = true;
          try {
            await connectAsync({ connector });
          } catch (error) {
            console.error("AutoReconnect - Failed to reconnect:", error);
            hasAttemptedReconnect.current = false; // Retry on next mount if failed
          }
          return;
        }
      }

      if (typeof window !== "undefined" && window.ethereum) {
        const injectedConnectors = connectors.filter((c) => c.type === "injected" && !c.id.includes("privy"));

        for (const connector of injectedConnectors) {
          try {
            const isAuthorized = await connector.isAuthorized();

            if (isAuthorized && !hasAttemptedReconnect.current) {
              hasAttemptedReconnect.current = true;
              try {
                await connectAsync({ connector });
                return; // Success, exit early
              } catch (error) {
                console.error(`AutoReconnect - Failed to reconnect to ${connector.id}:`, error);
                hasAttemptedReconnect.current = false; // Retry on next mount if failed
              }
            }
          } catch (error) {
            console.error(`AutoReconnect - Error checking authorization for ${connector.id}:`, error);
          }
        }
      }

      hasAttemptedReconnect.current = true;
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isConnected, status, connectors, connectAsync, connections]);

  return null;
}

// Component to auto-connect Privy embedded wallet to wagmi
function PrivyWagmiSync() {
  const wallets = useWallets();
  const { connectors, connectAsync, status } = useConnect();
  const { address: wagmiAddress } = useAccount();
  const { ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const hasAttemptedConnect = useRef(false);

  // useWallets() returns an array directly, or an object with wallets property
  const walletsArray = Array.isArray(wallets) ? wallets : wallets?.wallets || [];
  const embeddedWallet = walletsArray.find((w) => w.walletClientType === "privy");

  useEffect(() => {
    if (!privyReady || !privyAuthenticated) {
      return;
    }

    if (!embeddedWallet) {
      hasAttemptedConnect.current = false; // Reset when wallet disappears
      return;
    }

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

    const privyConn = connectors.find((c) => c.id === "privy");

    if (!privyConn) {
      hasAttemptedConnect.current = false;
      return;
    }

    if (status !== "idle" || hasAttemptedConnect.current) {
      return;
    }

    hasAttemptedConnect.current = true;

    connectAsync({ connector: privyConn }).catch((error) => {
      console.error("PrivyWagmiSync - Failed to connect:", error);
      hasAttemptedConnect.current = false; // Allow retry on error
    });
  }, [embeddedWallet, wagmiAddress, connectAsync, connectors, status, privyReady, privyAuthenticated]);

  return null;
}

// Create config with current mock address value and Privy connector
const useEnvConfig = (stableBaseConfig: ReturnType<typeof createConfig>) => {
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();
  const { logout: privyLogout } = usePrivy();
  const wallets = useWallets();
  const walletsArray = Array.isArray(wallets) ? wallets : wallets?.wallets || [];
  const embeddedWallet = walletsArray.find((w) => w.walletClientType === "privy");

  const localConfig = useMemo(() => {
    if (!isValidAddress(mockAddress)) {
      return undefined;
    }

    const connectors: CreateConnectorFn[] = [
      mock({ accounts: [mockAddress], features: { defaultConnected: true, reconnect: true } }),
    ];

    // Add Privy connector if Privy is authenticated
    if (embeddedWallet && privyLogout) {
      connectors.push(
        privyConnector({
          getEmbeddedWallet: () => embeddedWallet,
          logout: privyLogout,
        }),
      );
    }

    return createConfig({
      connectors,
      chains: [localhost, base],
      client() {
        return anvilTestClient;
      },
      storage: createStorage({
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      }),
      ssr: false,
    });
  }, [mockAddress, embeddedWallet, privyLogout]);

  // For non-localhost, ALWAYS use the stable base config
  // CRITICAL: Config must NEVER change after initial creation to preserve wagmi's storage state
  // If we recreate the config when Privy authenticates, WagmiProvider resets its state
  // and loses the connection, causing the "connect then disconnect" issue
  //
  // Solution: Use stable config always. Privy connector is always in config,
  // but uses global refs (privyEmbeddedWalletRef, privyLogoutRef) that can be updated
  // without recreating the config. This allows the connector to work when Privy authenticates
  // without breaking MetaMask reconnect.
  useEffect(() => {
    // Update global refs when Privy wallet state changes
    // This allows Privy connector to work without recreating config
    if (embeddedWallet && privyLogout) {
      privyEmbeddedWalletRef = embeddedWallet;
      privyLogoutRef = privyLogout;
    } else {
      privyEmbeddedWalletRef = undefined;
      privyLogoutRef = null;
    }
  }, [embeddedWallet, privyLogout]);

  const sharedConfig = stableBaseConfig;

  const envConfig = isLocal && localConfig ? localConfig : sharedConfig;

  return envConfig;
};
