import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { createTestClient, defineChain } from "viem";
import { http, WagmiProvider, createConfig } from "wagmi";
import { base, localhost } from "wagmi/chains";
import { mock } from "wagmi/connectors";
import { isDev } from "./utils/utils";

// serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

const LOCAL_RPC_URL = "http://127.0.0.1:8545";
const TENDERLY_RPC_URL = "https://virtual.base.rpc.tenderly.co/85c75a4b-5646-48a8-9d61-eaebc9ef4382";

export const localfork = defineChain({
  ...base,
  id: 1337,
  name: "Local Fork",
  rpcUrls: {
    default: { http: [LOCAL_RPC_URL] },
  },
});

export const tenderlyTestnet = defineChain({
  id: 41337,
  name: "Tenderly Base Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [TENDERLY_RPC_URL] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 5022,
    },
  },
});

export const anvilTestClient = createTestClient({ mode: "anvil", chain: localhost, transport: http() });

// export const testConfig = createConfig({
//   connectors: [mock({ accounts: ["0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7"] })],
//   chains: [localfork],
//   client() {
//     return anvilTestClient;
//   },
// });

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [tenderlyTestnet, localfork, base],
    transports: {
      // RPC URL for each chain
      [tenderlyTestnet.id]: http(),
      [localfork.id]: http(),
      [base.id]: http(),
    },
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
    appIcon: "https://link.to.pinto/icon.jpg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

export const web3Config = config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  // anvilTestClient.impersonateAccount({ address: "0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7" });

  return (
    <WagmiProvider config={web3Config}>
      <QueryClientProvider client={queryClient}>
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
            initialChainId: !isDev() ? base.id : undefined,
            avoidLayoutShift: true,
            hideNoWalletCTA: true,
            hideQuestionMarkCTA: true,
            enforceSupportedChains: true,
          }}
        >
          {children}
        </ConnectKitProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
};
