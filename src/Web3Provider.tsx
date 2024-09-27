import { WagmiProvider, createConfig, http } from "wagmi";
import { localhost, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { createTestClient } from "viem";
import { mock } from "wagmi/connectors";

export const anvilTestClient = 
  createTestClient({ mode: "anvil", chain: localhost, transport: http() })
  // alt test acc: 0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7
  
export const testConfig = createConfig({
  connectors: [mock({ accounts: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"] })],
  chains: [localhost],
  client() {
    return anvilTestClient;
  },
});

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, localhost],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(),
      [localhost.id]: http(),
    },
    batch: {
      multicall: {
        wait: 200,
      },
    },
    // Required API Keys
    walletConnectProjectId: '',
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

  anvilTestClient.impersonateAccount({ address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" });
  
  return (
    <WagmiProvider config={testConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};