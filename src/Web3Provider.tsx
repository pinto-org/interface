import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ConnectKitProvider } from "connectkit";
import { atom, useAtom } from "jotai";
import { ReactNode, useEffect, useMemo } from "react";
import { createTestClient } from "viem";
import { http, WagmiProvider, createConfig, createStorage } from "wagmi";
import type { CreateConnectorFn } from "wagmi";
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

function getDefaultChainId() {
  if (isProd()) {
    return base.id;
  }
  if (isNetlifyPreview()) {
    return !!TENDERLY_RPC_URL ? testnet.id : base.id;
  }
  return localhost.id;
}

/**
 * Stable wagmi config for non-localhost environments
 * Config instance never changes to preserve wagmi's storage state
 * Privy connector uses global refs that can be updated without recreating config
 */
const stableBaseConfig = createConfig(
  buildBaseConfigParams({
    additionalConnectors: [
      privyConnector({
        getEmbeddedWallet: getPrivyEmbeddedWallet,
        logout: () => {
          const logout = getPrivyLogout();
          return logout ? logout() : Promise.resolve();
        },
      }),
    ],
  }),
);

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

function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const wagmiConfig = useEnvConfig(stableBaseConfig);

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

/**
 * Manages wallet connection lifecycle
 * Handles auto-reconnect and Privy sync
 */
function ConnectionManager() {
  useAutoReconnect();
  usePrivySync();
  return null;
}

/**
 * Manages mock connector for localhost development
 * Impersonates accounts for testing
 */
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

export const mockAddressAtom = atom<`0x${string}`>((localStorage.getItem("mockAddress") as `0x${string}`) || "0x");

export const anvilTestClient = createTestClient({
  mode: "anvil",
  chain: localhost,
  transport: http(),
});

/**
 * Creates wagmi config based on environment
 * - Localhost: Uses mock connector with impersonation
 * - Other environments: Uses stable base config
 */
function useEnvConfig(stableBaseConfig: ReturnType<typeof createConfig>) {
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

  return isLocal && localConfig ? localConfig : stableBaseConfig;
}
