import { MAIN_TOKEN, SPECTRA_LP_TOKEN, SPECTRA_PT_TOKEN, SPECTRA_YT_TOKEN, S_MAIN_TOKEN } from "@/constants/tokens";
import { Token } from "@/utils/types";
import { ChainLookup } from "@/utils/types.generic";
import { Address } from "viem";
import { base } from "viem/chains";

export interface SpectraCurvePool {
  maturity: number;
  pool: Address;
  lp: Address;
  pt: Address;
  yt: Address;
  underlying: Token;
  token: Token;
}

export const SPECTRA_CURVE_POOLS: ChainLookup<SpectraCurvePool> = {
  [base.id]: {
    maturity: 1758153782,
    pool: "0xd8E4662ffd6b202cF85e3783Fb7252ff0A423a72",
    lp: SPECTRA_LP_TOKEN[base.id].address,
    pt: SPECTRA_PT_TOKEN[base.id].address,
    yt: SPECTRA_YT_TOKEN[base.id].address,
    underlying: MAIN_TOKEN[base.id],
    token: S_MAIN_TOKEN[base.id],
  },
} as const;
