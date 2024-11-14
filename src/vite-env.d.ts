/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   *
   */
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  /**
   * RPC URL for the testnet
   */
  readonly VITE_TENDERLY_RPC_URL: string;
  /**
   * RPC URL for the alchemy
   */
  readonly VITE_ALCHEMY_RPC_URL: string;
  /**
   * ZeroEx API Key
   */
  readonly VITE_ZEROEX_API_KEY: string;
}

// biome-ignore lint/correctness/noUnusedVariables:
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
