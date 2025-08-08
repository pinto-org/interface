import { AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { AdvancedFarmCall } from "@/utils/types";
import { Address } from "viem";
import { Config } from "wagmi";
import { SiloConvertStrategy, SiloConvertType } from "./strategies/core";

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

export type PipelineConvertStrategyAndArgs<T extends SiloConvertType> = {
  strategy: SiloConvertStrategy<T>;
  args: {
    stems: bigint[];
    amounts: bigint[];
    advPipeCalls: AdvancedPipeWorkflow;
  };
  farmStruct: AdvancedFarmCall;
};
