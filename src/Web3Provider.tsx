import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider } from "connectkit";
import { ReactNode, useEffect, useMemo } from "react";
import { createTestClient } from "viem";
import { http, WagmiProvider, createConfig } from "wagmi";
import { mock } from "wagmi/connectors";
import { isLocalhost, isNetlifyPreview, isProd } from "./utils/utils";
import {
  TENDERLY_RPC_URL,
  baseNetwork as base,
  localhostNetwork as localhost,
  tenderlyTestnetNetwork as testnet,
} from "./utils/wagmi/chains";
import config from "./utils/wagmi/config";
import { atom, useAtom } from 'jotai';
import { isValidAddress } from "./utils/string";

// biome-ignore lint/suspicious/noExplicitAny: React Query needs this to serialize BigInts
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const config = useEnvConfig();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MockConnectorManager />
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


// New component to handle mock connector logic
function MockConnectorManager() {
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();

  // Impersonate account whenever mockAddress changes
  useEffect(() => {
    if (isLocal && isValidAddress(mockAddress)) {
      anvilTestClient.impersonateAccount({ address: mockAddress });
    }
  }, [mockAddress, isLocal]);

  return null;
}

// Add atom for mock address with stored value or default
export const mockAddressAtom = atom<`0x${string}`>(
  // default to local storage
  (localStorage.getItem('mockAddress') as `0x${string}` || null) ||
  // if none in local storage, use env variable
  '0x'
);

export const anvilTestClient = createTestClient({
  mode: "anvil",
  chain: localhost,
  transport: http(),
});

const getDefaultChainId = () => {
  if (isProd()) {
    return base.id;
  }
  if (isNetlifyPreview()) {
    return !!TENDERLY_RPC_URL ? testnet.id : base.id;
  }
  return localhost.id;
};


// Create config with current mock address value
const useEnvConfig = () => {
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();

  const localConfig = useMemo(() => {
    if (!isValidAddress(mockAddress)) {
      return undefined;
    }

    return createConfig({
      connectors: [mock({ accounts: [mockAddress], features: { defaultConnected: true, reconnect: true } })],
      chains: [localhost, base],
      client() { return anvilTestClient; }
    })
  }, [mockAddress]);

  const envConfig = isLocal && localConfig ? localConfig : config;

  return envConfig;
}