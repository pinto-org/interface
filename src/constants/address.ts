import { ChainLookup, HashString } from "@/utils/types.generic";

import { base } from "viem/chains";

export const ZERO_ADDRESS: HashString = "0x";

export const ZERO_ADDRESS_HEX: HashString = "0x0000000000000000000000000000000000000000";

export const PIPELINE_ADDRESS: HashString = "0xb1bE0001f5a373b69b1E132b420e6D9687155e80";

export const JUNCTION_ADDRESS: HashString = "0x5A5A5AF07D8a389472AdC1E60aA71BAC89Fcff8b";

export const TRACTOR_HELPERS_ADDRESS: HashString = "0x5A30f5a2bB1CD4dB9d69328c4520733776D318df";

export const SILO_HELPERS_ADDRESS: HashString = "0x2a9757807153d55b3399C79d44c9318aFE0C5Bc8";

export const SOW_BLUEPRINT_V0_ADDRESS: HashString = "0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B";

export const CONVERT_UP_BLUEPRINT_V0_ADDRESS: HashString = "0xC7E51aCCbE76dd83eBC79356997F73cCDad04732";

export const SOW_BLUEPRINT_V0_SELECTOR = "0x3ca8e1b2" as const;

export const CONVERT_UP_BLUEPRINT_V0_SELECTOR = "0xd4db3ec6" as const;

export const CONVERT_BLUEPRINT_V0_SELECTOR = "0x36bfafbd" as const;

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
