import {
  CBBTC_TOKEN,
  CBETH_TOKEN,
  LP_TOKENS,
  MAIN_TOKEN,
  USDC_TOKEN,
  WETH_TOKEN,
  WSOL_TOKEN,
} from "@/constants/tokens";
import { AddressMap } from "@/utils/types";
import { ChainLookup } from "@/utils/types.generic";
import { base } from "viem/chains";

export const addressAllowanceSlotMap: ChainLookup<AddressMap<number>> = {
  [base.id]: {
    [MAIN_TOKEN[base.id].address.toLowerCase()]: 1,
    [WETH_TOKEN[base.id].address.toLowerCase()]: 4,
    [CBETH_TOKEN[base.id].address.toLowerCase()]: 52,
    [USDC_TOKEN[base.id].address.toLowerCase()]: 10,
    [CBBTC_TOKEN[base.id].address.toLowerCase()]: 10,
    [WSOL_TOKEN[base.id].address.toLowerCase()]: 6,
    ...LP_TOKENS[base.id].reduce<AddressMap<number>>((prev, curr) => {
      prev[curr.address.toLowerCase()] = 51;
      return prev;
    }, {}),
  },
};
