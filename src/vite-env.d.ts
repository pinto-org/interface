/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Wallet Connect Project ID
   */
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  /**
   * RPC URL for the alchemy
   */
  readonly VITE_ALCHEMY_API_KEY: string;
  /**
   * ZeroEx API Key
   */
  readonly VITE_ZEROEX_API_KEY: string;
  /**
   * enabled chains
   */
  readonly VITE_CHAINS: string;
  /**
   * main API endpoint for services
   */
  readonly VITE_BASE_ENDPOINT: string;
  /**
   * RPC URL for the testnet
   */
  readonly VITE_TENDERLY_RPC_URL?: string;
}

declare module "*.md";

// biome-ignore lint/correctness/noUnusedVariables:
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
