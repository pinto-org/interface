import { Address } from "viem";
import { Config } from "wagmi";

/**
 * shared context for all silo convert related operations
 */
export interface SiloConvertContext {
  diamond: Address;
  account: Address;
  wagmiConfig: Config;
  chainId: number;
}

export type SiloConvertTokenDirection =
  | "default" // OmniDirectional LP<>Main
  | "LP2LP" // LP<>LP
  | "LP2Main" // LP -> Main
  | "Main2LP"; // Main -> LP
