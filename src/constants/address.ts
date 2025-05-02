import { ChainLookup, HashString } from "@/utils/types.generic";

import { base } from "viem/chains";

export const ZERO_ADDRESS: HashString = "0x";

export const ZERO_ADDRESS_HEX: HashString = "0x0000000000000000000000000000000000000000";

export const PIPELINE_ADDRESS: HashString = "0xb1bE0001f5a373b69b1E132b420e6D9687155e80";

export const JUNCTION_ADDRESS: HashString = "0x5A5A5AF07D8a389472AdC1E60aA71BAC89Fcff8b";

export const TRACTOR_HELPERS_ADDRESS: HashString = "0x2808b14d287F8CA77eb25B16575aF187d5A05119";

export const SILO_HELPERS_ADDRESS: HashString = "0xc345F3aA0A13a6f6a113004553976eefe33674B3";

export const SOW_BLUEPRINT_V0_ADDRESS: HashString = "0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B";

export const SOW_BLUEPRINT_V0_SELECTOR = "0x3ca8e1b2" as const;

export const WELL_FUNCTION_ADDRESSES: ChainLookup<{
  stable2: HashString;
  cp2: HashString;
}> = {
  [base.id]: {
    stable2: "0xBA51055a97b40d7f41f3F64b57469b5D45B67c87",
    cp2: "0xBA510C289fD067EBbA41335afa11F0591940d6fe",
  },
} as const;
