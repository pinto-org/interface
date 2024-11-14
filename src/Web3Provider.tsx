import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider } from "connectkit";
import { ReactNode } from "react";
import { createTestClient } from "viem";
import { http, WagmiProvider } from "wagmi";
import { isNetlifyPreview, isProd } from "./utils/utils";
import {
  TENDERLY_RPC_URL,
  baseNetwork as base,
  localhostNetwork as localhost,
  tenderlyTestnetNetwork as testnet,
} from "./utils/wagmi/chains";
import config from "./utils/wagmi/config";

// serialize BigInts
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const anvilTestClient = createTestClient({ mode: "anvil", chain: localhost, transport: http() });

const getDefaultChainId = () => {
  if (isProd()) {
    return base.id;
  }
  if (isNetlifyPreview()) {
    return !!TENDERLY_RPC_URL ? testnet.id : base.id;
  }
  return localhost.id;
};

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
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
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// export const testConfig = createConfig({
//   connectors: [mock({ accounts: ["0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7"] })],
//   chains: [localfork],
//   client() {
//     return anvilTestClient;
//   },
// });
// anvilTestClient.impersonateAccount({ address: "0xfe42972c584e442c3f0a49cb2930e55d5bf13ba7" });
