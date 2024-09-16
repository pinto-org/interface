import { createTestClient } from "viem";
import { http, createConfig } from "wagmi";
import { localhost, mainnet } from "wagmi/chains";
import { coinbaseWallet, injected, mock, walletConnect } from "wagmi/connectors";

export const anvilTestClient = 
  createTestClient({ mode: "anvil", chain: localhost, transport: http() })
  // alt test acc: 0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7
  
export const testConfig = createConfig({
  connectors: [mock({ accounts: ["0x43B9F935c798522aaaCB2bFEa2F407cE5A291e9D"] })],
  chains: [localhost],
  client() {
    return anvilTestClient;
  },
});

export const config = createConfig({
  chains: [localhost],
  /* client(localhost) {
    return createTestClient({ mode: 'anvil', chain: localhost as Chain, transport: http() })
      .extend(publicActions)
      .extend(walletActions)
      .impersonateAccount({ address: '0x008829acd7ec452fc50989aa9bfa5d196baae20a' })
  }, */
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
    // mock({ accounts: ['0xcde68f6a7078f47ee664ccbc594c9026a8a72d25'] })
  ],
  batch: {
    multicall: {
      wait: 200,
    },
  },
  transports: {
    [mainnet.id]: http(),
    [localhost.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof testConfig;
  }
}
