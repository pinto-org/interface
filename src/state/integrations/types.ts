import { MinimumViableUseQueryResult, Token } from "@/utils/types";
import { Address } from "viem";

export type IProtocolIntegration = {
  integration: ProtocolIntegration;
};

export type ProtocolIntegrationQueryReturnType<T = unknown> = MinimumViableUseQueryResult<T> & IProtocolIntegration;

export type ProtocolIntegration = "CREAM" | "SPECTRA";

export interface SpectraCurvePool {
  maturity: number;
  pool: Address;
  lp: Address;
  pt: Address;
  yt: Address;
  underlying: Token;
  token: Token;
}
