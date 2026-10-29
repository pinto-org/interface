// Local-only test provider. The production entry never imports this file.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { atom } from "jotai";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import config, { qaAccount } from "./wallet";

(BigInt.prototype as any).toJSON = function () { return this.toString(); };
export const mockAddressAtom = atom(qaAccount);
export const skipPrivyAtom = atom(true);
const queryClient = new QueryClient();
export function Web3Provider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}><WagmiProvider config={config}>
    <ConnectKitProvider mode="light">{children}</ConnectKitProvider>
  </WagmiProvider></QueryClientProvider>;
}
