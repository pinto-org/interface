import {
  convertUpBlueprintAddress,
  siloHelpersAddress,
  sowBlueprintv0Address,
  tractorHelpersAddress,
} from "@/generated/contractHooks";
import { ChainLookup, HashString } from "@/utils/types.generic";

import { base } from "viem/chains";

export const ZERO_ADDRESS: HashString = "0x";

export const ZERO_ADDRESS_HEX: HashString = "0x0000000000000000000000000000000000000000";

export const PIPELINE_ADDRESS: HashString = "0xb1bE0001f5a373b69b1E132b420e6D9687155e80";

export const JUNCTION_ADDRESS: HashString = "0x5A5A5AF07D8a389472AdC1E60aA71BAC89Fcff8b";

// re-export here for backwards compatibility
export const TRACTOR_HELPERS_ADDRESS: HashString = tractorHelpersAddress[base.id];

export const SILO_HELPERS_ADDRESS: HashString = siloHelpersAddress[base.id];

export const SOW_BLUEPRINT_V0_ADDRESS: HashString = sowBlueprintv0Address[base.id];

export const CONVERT_UP_BLUEPRINT_V0_ADDRESS: HashString = convertUpBlueprintAddress[base.id];

export const SOW_BLUEPRINT_V0_SELECTOR = "0x3ca8e1b2" as const;

export const CONVERT_UP_BLUEPRINT_V0_SELECTOR = "0x0fd2f3ed" as const;

export const WELL_FUNCTION_ADDRESSES: ChainLookup<{
  stable2: HashString;
  cp2: HashString;
}> = {
  [base.id]: {
    stable2: "0xBA51055a97b40d7f41f3F64b57469b5D45B67c87",
    cp2: "0xBA510C289fD067EBbA41335afa11F0591940d6fe",
  },
} as const;

export const NFT_COLLECTION_1_CONTRACT: HashString = "0xBea5e200a087529AA3B62c460040aE94E3651b76";
