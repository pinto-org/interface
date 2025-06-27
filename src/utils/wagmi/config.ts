import PintoIcon from "@/assets/tokens/PINTO.png";
import { getEnvEnabledChains, localhostNetwork as localhost } from "@/utils/wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { Chain, Transport, createTestClient } from "viem";
import { http, createConfig } from "wagmi";

export const anvilTestClient = createTestClient({ mode: "anvil", chain: localhost, transport: http() });

type ChainsConfig = readonly [Chain, ...Chain[]];

type TransportsConfig = Record<number, Transport>;

const getChainConfig = (): ChainsConfig => {
  const chains = [...getEnvEnabledChains()] as const;
  return chains as ChainsConfig;
};

const getTransportsConfig = (): TransportsConfig => {
  const config: TransportsConfig = {};

  for (const chain of getEnvEnabledChains()) {
    if (chain === undefined) {
      console.error(
        'Your VITE_CHAINS environment variable is not set correctly, try setting it to something like `VITE_CHAINS="41337,1337,8453,42161"`',
      );
    }
    config[chain.id] = http(chain.rpcUrls.default.http[0]);
  }

  return config;
};

const config = createConfig(
  getDefaultConfig({
    chains: getChainConfig(),
    transports: getTransportsConfig(),
    batch: {
      multicall: {
        wait: 200,
      },
    },
    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    // Required App Info
    appName: "Pinto",
    // Optional App Info
    appDescription: "A decentralized stablecoin protocol",
    appUrl: "https://pinto.money/", // your app's url
    appIcon: PintoIcon, // your app's icon, no bigger than 1024x1024px (max. 1MB)
    enableFamily: false,
  }),
);

export default config;
