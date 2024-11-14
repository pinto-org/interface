/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   *
   */
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  /**
   * RPC URL for the testnet
   */
  readonly VITE_TESTNET_RPC: string;
}

// biome-ignore lint/correctness/noUnusedVariables:
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
