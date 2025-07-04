import { Token } from "@/utils/types";
import { Address } from "viem";

export interface Blueprint {
  publisher: Address;
  data: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  maxNonce: bigint;
  startTime: bigint;
  endTime: bigint;
}

export interface Requisition {
  blueprint: Blueprint;
  blueprintHash: `0x${string}`;
  signature?: `0x${string}`;
}

export interface PublishedRequisition {
  blueprint: {
    publisher: string;
    data: string;
    maxNonce: bigint;
  };
  blueprintHash: string;
  blockNumber: number;
}

/**
 *
 */
export type TractorOrderSpecificTokenStrategy = {
  type: "SPECIFIC_TOKEN";
  address: `0x${string}`;
};

// Add the TokenStrategy type
export type SowOrderTokenStrategy =
  | { type: "LOWEST_SEEDS" }
  | { type: "LOWEST_PRICE" }
  | TractorOrderSpecificTokenStrategy;

// Extended type that includes token information for SPECIFIC_TOKEN
export type ExtendedTractorTokenStrategy =
  | { type: "LOWEST_SEEDS" }
  | { type: "LOWEST_PRICE" }
  | (TractorOrderSpecificTokenStrategy & { token?: Token });
