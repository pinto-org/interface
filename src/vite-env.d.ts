/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * RPC URL for the testnet
   */
  readonly VITE_TESTNET_RPC: string;
}

// biome-ignore lint/correctness/noUnusedVariables:
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
