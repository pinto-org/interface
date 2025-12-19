import type { ConnectedWallet } from "@privy-io/react-auth";
import type { Account, Chain, Transport, WalletClient } from "viem";
import { createConnector } from "wagmi";

interface PrivyConnectorOptions {
  getEmbeddedWallet: () => ConnectedWallet | undefined;
  logout: () => Promise<void>;
}

/**
 * Custom Privy connector for wagmi v2
 * Connects Privy's embedded wallet to wagmi
 *
 * @param options - Options for the Privy connector
 * @param options.getEmbeddedWallet - Function that returns the current Privy embedded wallet
 * @param options.logout - Function to logout from Privy
 *
 * Returns a connector factory function that can be added to wagmi's connectors array
 */
export function privy({ getEmbeddedWallet, logout }: PrivyConnectorOptions) {
  // Return a function that creates the connector (wagmi expects functions in connectors array)
  return createConnector((config) => ({
    id: "privy",
    name: "Privy",
    type: "privy" as const,
    async setup() {
      // Setup is called when connector is initialized
    },
    async connect({ chainId: requestedChainId }: { chainId?: number; isReconnecting?: boolean } = {}) {
      const wallet = getEmbeddedWallet();
      if (!wallet) {
        throw new Error("Privy embedded wallet not found");
      }

      // Get provider from Privy wallet
      const provider = await wallet.getEthereumProvider();
      const accounts = await provider.request({ method: "eth_accounts" });
      const account = accounts[0] as `0x${string}`;

      // Get chain ID
      const chainIdHex = await provider.request({ method: "eth_chainId" });
      const currentChainId = Number.parseInt(chainIdHex as string, 16);

      // If chainId is specified and different, switch chain
      if (requestedChainId && requestedChainId !== currentChainId) {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${requestedChainId.toString(16)}` }],
        });
      }

      return {
        accounts: [account],
        chainId: requestedChainId || currentChainId,
      };
    },
    async disconnect() {
      // Disconnect is handled by Privy's logout
      await logout();
    },
    async getAccounts() {
      const wallet = getEmbeddedWallet();
      if (!wallet) {
        return [];
      }

      const provider = await wallet.getEthereumProvider();
      const accounts = await provider.request({ method: "eth_accounts" });
      return accounts as `0x${string}`[];
    },
    async getChainId() {
      const wallet = getEmbeddedWallet();
      if (!wallet) {
        throw new Error("Privy embedded wallet not found");
      }

      const provider = await wallet.getEthereumProvider();
      const chainIdHex = await provider.request({ method: "eth_chainId" });
      return Number.parseInt(chainIdHex as string, 16);
    },
    async isAuthorized() {
      const wallet = getEmbeddedWallet();
      return !!wallet;
    },
    async switchChain({ chainId }) {
      const wallet = getEmbeddedWallet();
      if (!wallet) {
        throw new Error("Privy embedded wallet not found");
      }

      const provider = await wallet.getEthereumProvider();
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      return config.chains.find((c) => c.id === chainId) || config.chains[0];
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        config.emitter.emit("disconnect");
      } else {
        config.emitter.emit("change", { accounts: accounts as `0x${string}`[] });
      }
    },
    onChainChanged(chainId) {
      const id = Number.parseInt(chainId as string, 16);
      config.emitter.emit("change", { chainId: id });
    },
    onDisconnect() {
      config.emitter.emit("disconnect");
    },
    async getProvider() {
      const wallet = getEmbeddedWallet();
      if (!wallet) {
        throw new Error("Privy embedded wallet not found");
      }

      const provider = await wallet.getEthereumProvider();

      // Return provider in the format wagmi expects
      return {
        config: {
          request: provider.request.bind(provider),
        },
        request: provider.request.bind(provider),
      } as any;
    },
    async getWalletClient({ chainId }: { chainId?: number }) {
      const wallet = getEmbeddedWallet();
      if (!wallet) {
        throw new Error("Privy embedded wallet not found");
      }

      const provider = await wallet.getEthereumProvider();
      const accounts = await provider.request({ method: "eth_accounts" });
      const account = accounts[0] as `0x${string}`;

      const chain = config.chains.find((c) => c.id === chainId) || config.chains[0];
      const transport = config.transports?.[chain.id] as Transport;

      return {
        account: account as unknown as Account,
        chain,
        transport: transport || (config.transports?.[chain.id] as Transport),
        request: provider.request.bind(provider),
      } as unknown as WalletClient;
    },
  }));
}
