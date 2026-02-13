import { ChainLookup, HashString } from "@/utils/types.generic";

import { base } from "viem/chains";

export const ZERO_ADDRESS: HashString = "0x";

export const ZERO_ADDRESS_HEX: HashString = "0x0000000000000000000000000000000000000000";

export const JUNCTION_ADDRESS: HashString = "0x5A5A5AF07D8a389472AdC1E60aA71BAC89Fcff8b";

export const DIAMOND_PRICE_ADDRESS: HashString = "0x13D25ABCB6a19948d35654715c729c6501230b49";

// re-export here for backwards compatibility
export const PIPELINE_ADDRESS: HashString = "0xb1bE0001f5a373b69b1E132b420e6D9687155e80";

export const TRACTOR_HELPERS_ADDRESS: HashString = "0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6";

export const SILO_HELPERS_ADDRESS: HashString = "0xE145082A7C5EDd1767f8148A6c29a17488d1eb31";

export const SOW_BLUEPRINT_V0_ADDRESS: HashString = "0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B";

export const SOW_BLUEPRINT_REFERRAL_V0_ADDRESS: HashString = "0xD9DF9C4C0160401702de1771AAAaD886e2375F65"; // Placeholder - update after deployment

export const CONVERT_UP_BLUEPRINT_V0_ADDRESS: HashString = "0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca";

export const SOW_BLUEPRINT_V0_SELECTOR = "0x3ca8e1b2" as const;

export const SOW_BLUEPRINT_REFERRAL_V0_SELECTOR = "0xd3936ead" as const; // Placeholder - update after deployment

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

// Deployed contract addresses for Beanstalk Shipments
export const SILO_PAYBACK_ADDRESS: HashString = "0x525C94754C51946a7a3B72580Ce0DF36922E1E64";
export const BARN_PAYBACK_ADDRESS: HashString = "0x68bDbb0402a3Ca89C7C4af8e41C021635102d158";
export const CONTRACT_PAYBACK_ADDRESS: HashString = "0xbA941Af3292c49b585f4EC5C8164c1dfc893EEdC";
