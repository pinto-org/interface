import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrum, foundry, localhost, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { createTestClient, defineChain } from "viem";
import { mock } from "wagmi/connectors";

export const anvilTestClient = 
  createTestClient({ mode: "anvil", chain: localhost, transport: http() })
  // alt test acc: 0xe543357d4f0eb174cfc6bed6ef5e7ab5762f1b2b
  // alt test acc: 0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7
  // alt test acc: 0x43B9F935c798522aaaCB2bFEa2F407cE5A291e9D
  // alt test acc: 0xe543357d4f0eb174cfc6bed6ef5e7ab5762f1b2b
  
export const testConfig = createConfig({
  connectors: [mock({ accounts: ["0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7"] })],
  chains: [localhost],
  client() {
    return anvilTestClient;
  },
});

export const tenderlyTestnet = defineChain({
  id: 31337,
  name: 'Tenderly Base Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://virtual.base.rpc.tenderly.co/29dab153-f0b9-4273-8beb-877f1ca3fa26'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 5022,
    },
  },
})


const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [tenderlyTestnet, localhost],
    transports: {
      // RPC URL for each chain
      [tenderlyTestnet.id]: http(),
      [localhost.id]: http(),
    },
    batch: {
      multicall: {
        wait: 200,
      },
    },
    // Required API Keys
    walletConnectProjectId: 'my-project',
    // Required App Info
    appName: "Pinto",
    // Optional App Info
    appDescription: "A decentralized stablecoin protocol",
    appUrl: "https://link.to.pinto/", // your app's url
    appIcon: "https://link.to.pinto/icon.jpg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {

  // anvilTestClient.impersonateAccount({ address: "0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7" });
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": "Pinto",
            "--ck-border-radius": "24px",
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
            "--ck-spinner-color" : "rgb(36 102 69)",
            "--ck-qr-border-color": "rgb(217, 217, 217)",
            "--ck-qr-dot-color": "rgb(36 102 69)",
            "--ck-body-divider": "rgb(217, 217, 217)"
          }}
          options={{
            avoidLayoutShift: true,
            hideNoWalletCTA: true,
            hideQuestionMarkCTA: true
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};