import PintoIcon from "@/assets/tokens/PINTO.png";
import { getEnvEnabledChains, localhostNetwork as localhost } from "@/utils/wagmi/chains";
import { Chain, Transport, createTestClient } from "viem";
import { http, createStorage } from "wagmi";
import type { CreateConnectorFn } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const anvilTestClient = createTestClient({
  mode: "anvil",
  chain: localhost,
  transport: http(),
});

type ChainsConfig = readonly [Chain, ...Chain[]];
type TransportsConfig = Record<number, Transport>;

export const getChainConfig = (): ChainsConfig => {
  const chains = [...getEnvEnabledChains()] as const;
  return chains as ChainsConfig;
};

export const getTransportsConfig = (): TransportsConfig => {
  const config: TransportsConfig = {};

  for (const chain of getEnvEnabledChains()) {
    if (chain === undefined) {
      console.error('VITE_CHAINS environment variable is not set correctly. Try: VITE_CHAINS="41337,1337,8453,42161"');
    }
    config[chain.id] = http(chain.rpcUrls.default.http[0]);
  }

  return config;
};

const getWalletConnectMetadataUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return import.meta.env.VITE_SITE_URL || "https://pinto.money/";
};

export const getBaseConnectors = (): CreateConnectorFn[] => {
  const connectors: CreateConnectorFn[] = [injected({ shimDisconnect: true })];

  if (import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
    connectors.push(
      walletConnect({
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: "Pinto",
          description: "A decentralized stablecoin protocol",
          url: getWalletConnectMetadataUrl(),
          icons: [PintoIcon],
        },
      }),
    );
  }

  connectors.push(
    coinbaseWallet({
      appName: "Pinto",
      appLogoUrl: PintoIcon,
      preference: "smartWalletOnly",
    }) as CreateConnectorFn,
  );

  return connectors;
};

const resolveStorage = (provided?: Storage | null) => {
  if (typeof provided !== "undefined") {
    return provided ?? undefined;
  }
  return typeof window !== "undefined" ? window.localStorage : undefined;
};

interface BuildBaseConfigParamsOptions {
  additionalConnectors?: CreateConnectorFn[];
  storage?: Storage | null;
  ssr?: boolean;
  batchWait?: number;
}

export const buildBaseConfigParams = (options: BuildBaseConfigParamsOptions = {}) => {
  const { additionalConnectors = [], storage, ssr = false, batchWait = 200 } = options;

  return {
    chains: getChainConfig(),
    transports: getTransportsConfig(),
    connectors: [...getBaseConnectors(), ...additionalConnectors],
    storage: createStorage({
      storage: resolveStorage(storage),
      key: "wagmi.pinto",
    }),
    ssr,
    // Disable wagmi's automatic reconnect - handled manually in useAutoReconnect
    reconnectOnMount: false,
    batch: {
      multicall: { wait: batchWait },
    },
  };
};
