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

  /**
   * CONVERT UP BLUEPRINT DEPLOYMENT
   */
  readonly VITE_TRACTOR_HELPERS_ADDRESS?: string;

  readonly VITE_SILO_HELPERS_ADDRESS?: string;

  readonly VITE_CONVERT_UP_BLUEPRINT_V0_ADDRESS?: string;

  readonly VITE_DIAMOND_PRICE_ADDRESS?: string;
}

declare module "*.md";

// biome-ignore lint/correctness/noUnusedVariables:
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
