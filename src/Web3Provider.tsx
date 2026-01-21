import { PrivyProvider } from "@privy-io/react-auth";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ConnectKitProvider } from "connectkit";
import { atom, useAtom } from "jotai";
import { ReactNode, useEffect, useMemo } from "react";
import { createTestClient } from "viem";
import { http, WagmiProvider, createConfig, createStorage, useAccount } from "wagmi";
import { mock } from "wagmi/connectors";

import { useAutoReconnect } from "./hooks/wallet/useAutoReconnect";
import { usePrivySync } from "./hooks/wallet/usePrivySync";
import { privyConfig } from "./utils/privy/privy.config";
import { getPrivyEmbeddedWallet, getPrivyLogout } from "./utils/privy/privyRefs";
import { isValidAddress } from "./utils/string";
import { isLocalhost, isNetlifyPreview, isProd } from "./utils/utils";
import {
  TENDERLY_RPC_URL,
  baseNetwork as base,
  localhostNetwork as localhost,
  tenderlyTestnetNetwork as testnet,
} from "./utils/wagmi/chains";
import { buildBaseConfigParams } from "./utils/wagmi/config";
import { isCoinbaseWalletConnector } from "./utils/wagmi/connectorFilters";
import { privy as privyConnector } from "./utils/wagmi/connectors/privy";

// biome-ignore lint/suspicious/noExplicitAny: React Query needs this to serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// ============================================================================
// Query Client & Persister
// ============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    dehydrate: {
      shouldDehydrateQuery: (query) => query.meta?.persist === true,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

// ============================================================================
// Privy Skip Logic
// ============================================================================

const WAGMI_STORAGE_KEY = "wagmi.pinto.store";

/**
 * Checks localStorage for active external wallet connections on initial load.
 * Used to skip Privy when user has Coinbase/MetaMask connected to avoid SDK conflicts.
 */
function hasActiveExternalWalletConnectionOnLoad(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const wagmiStore = localStorage.getItem(WAGMI_STORAGE_KEY);
    if (!wagmiStore) return false;

    const parsed = JSON.parse(wagmiStore);
    const connections = parsed?.state?.connections;

    if (connections?.__type === "Map" && connections.value?.length > 0) {
      return connections.value.some(
        ([, conn]: [string, { connector?: { id?: string } }]) => conn?.connector?.id && conn.connector.id !== "privy",
      );
    }
  } catch {
    // Ignore parse errors
  }

  return false;
}

/** Jotai atom to track if Privy should be skipped (shared across components) */
export const skipPrivyAtom = atom(hasActiveExternalWalletConnectionOnLoad());

// ============================================================================
// Wagmi Config
// ============================================================================

const stableBaseConfig = createConfig(
  buildBaseConfigParams({
    additionalConnectors: [
      privyConnector({
        getEmbeddedWallet: getPrivyEmbeddedWallet,
        logout: () => getPrivyLogout()?.() ?? Promise.resolve(),
      }),
    ],
  }),
);

export const anvilTestClient = createTestClient({
  mode: "anvil",
  chain: localhost,
  transport: http(),
});

export const mockAddressAtom = atom<`0x${string}`>((localStorage.getItem("mockAddress") as `0x${string}`) || "0x");

// ============================================================================
// ConnectKit Theme & Options
// ============================================================================

function getDefaultChainId() {
  if (isProd()) return base.id;
  if (isNetlifyPreview()) return TENDERLY_RPC_URL ? testnet.id : base.id;
  return localhost.id;
}

const connectKitTheme = {
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
};

const connectKitOptions = {
  initialChainId: getDefaultChainId(),
  avoidLayoutShift: true,
  hideNoWalletCTA: true,
  hideQuestionMarkCTA: true,
  enforceSupportedChains: true,
};

// ============================================================================
// Main Provider
// ============================================================================

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
  const [skipPrivy] = useAtom(skipPrivyAtom);

  if (!privyAppId) {
    console.warn("VITE_PRIVY_APP_ID is not set. Privy email/social login will not work.");
  }

  const persistOptions = { persister: localStoragePersister, buster: "20250501" };

  // Skip Privy when external wallet is connected to avoid SDK conflicts
  if (skipPrivy) {
    return (
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        <WagmiProviderWrapperNoPrivy>{children}</WagmiProviderWrapperNoPrivy>
      </PersistQueryClientProvider>
    );
  }

  return (
    <PrivyProvider appId={privyAppId || ""} config={privyConfig}>
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
      </PersistQueryClientProvider>
    </PrivyProvider>
  );
};

// ============================================================================
// Wagmi Provider Wrappers
// ============================================================================

function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const wagmiConfig = useEnvConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <MockConnectorManager />
      <ConnectionManager />
      <ConnectKitProvider mode="light" customTheme={connectKitTheme} options={connectKitOptions}>
        {children}
      </ConnectKitProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </WagmiProvider>
  );
}

/** Wagmi provider without Privy sync - used when external wallet is connected */
function WagmiProviderWrapperNoPrivy({ children }: { children: ReactNode }) {
  const wagmiConfig = useEnvConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <MockConnectorManager />
      <ConnectionManagerNoPrivy />
      <ConnectKitProvider mode="light" customTheme={connectKitTheme} options={connectKitOptions}>
        {children}
      </ConnectKitProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </WagmiProvider>
  );
}

// ============================================================================
// Connection Managers
// ============================================================================

/** Handles auto-reconnect and Privy sync */
function ConnectionManager() {
  useAutoReconnect();
  usePrivySync();
  return null;
}

/** Handles auto-reconnect without Privy, re-enables Privy on disconnect */
function ConnectionManagerNoPrivy() {
  const { isConnected, connector } = useAccount();
  const [, setSkipPrivy] = useAtom(skipPrivyAtom);

  useAutoReconnect();

  useEffect(() => {
    if (!isConnected) {
      // Re-enable Privy when wallet disconnects
      const timer = setTimeout(() => setSkipPrivy(false), 100);
      return () => clearTimeout(timer);
    }

    // Keep Privy disabled while Coinbase is connected
    if (connector && isCoinbaseWalletConnector(connector)) {
      setSkipPrivy(true);
    }
  }, [isConnected, connector, setSkipPrivy]);

  return null;
}

/** Manages mock connector for localhost development */
function MockConnectorManager() {
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();

  useEffect(() => {
    if (isLocal && isValidAddress(mockAddress)) {
      anvilTestClient.impersonateAccount({ address: mockAddress });
    }
  }, [mockAddress, isLocal]);

  return null;
}

// ============================================================================
// Environment Config Hook
// ============================================================================

/**
 * Returns appropriate wagmi config based on environment.
 * Localhost uses mock connector for impersonation, other envs use stable config.
 */
function useEnvConfig() {
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();

  const localConfig = useMemo(() => {
    if (!isValidAddress(mockAddress)) return undefined;

    return createConfig({
      connectors: [
        mock({ accounts: [mockAddress], features: { defaultConnected: true, reconnect: true } }),
        privyConnector({
          getEmbeddedWallet: getPrivyEmbeddedWallet,
          logout: () => getPrivyLogout()?.() ?? Promise.resolve(),
        }),
      ],
      chains: [localhost, base],
      client: () => anvilTestClient,
      storage: createStorage({
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      }),
      ssr: false,
    });
  }, [mockAddress]);

  return isLocal && localConfig ? localConfig : stableBaseConfig;
}
