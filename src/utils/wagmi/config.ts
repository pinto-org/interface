import PintoIcon from "@/assets/tokens/PINTO.png";
import { isProd } from "@/utils/utils";
import {
  TENDERLY_RPC_URL,
  baseNetwork as base,
  localhostNetwork as localhost,
  tenderlyTestnetNetwork as testnet,
} from "@/utils/wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { Chain, Transport, createTestClient } from "viem";
import { http, createConfig } from "wagmi";

export const anvilTestClient = createTestClient({ mode: "anvil", chain: localhost, transport: http() });

type ChainsConfig = readonly [Chain, ...Chain[]];

type TransportsConfig = Record<number, Transport>;

const addTestnet = !!TENDERLY_RPC_URL;

const getChainConfig = (): ChainsConfig => {
  if (isProd()) return [base] as const;

  if (addTestnet) {
    return [base, testnet, localhost] as const;
  }

  return [base, localhost] as const;
};

const getTransportsConfig = (): TransportsConfig => {
  const config: TransportsConfig = {};

  config[base.id] = http(base.rpcUrls.default.http[0]);
  if (isProd()) return config;

  if (addTestnet) {
    config[testnet.id] = http(testnet.rpcUrls.default.http[0]);
  }

  config[localhost.id] = http(localhost.rpcUrls.default.http[0]);

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
  }),
);

export default config;
