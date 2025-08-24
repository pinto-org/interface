// import { Token } from "@/utils/types";
// import { Address } from "viem";

// export type TractorBlueprintType = "sow" | "convertUp";
// export interface Blueprint {
//   publisher: Address;
//   data: `0x${string}`;
//   operatorPasteInstrs: `0x${string}`[];
//   maxNonce: bigint;
//   startTime: bigint;
//   endTime: bigint;
// }

// export interface Requisition {
//   blueprint: Blueprint;
//   blueprintHash: `0x${string}`;
//   signature?: `0x${string}`;
// }

// export interface PublishedRequisition {
//   blueprint: {
//     publisher: string;
//     data: string;
//     maxNonce: bigint;
//   };
//   blueprintHash: string;
//   blockNumber: number;
// }

// export const TRACTOR_TOKEN_STRATEGY_TYPES = ["LOWEST_SEEDS", "LOWEST_PRICE", "SPECIFIC_TOKEN", "MULTI_TOKENS"] as const;

// export type TractorTokenStrategyType = (typeof TRACTOR_TOKEN_STRATEGY_TYPES)[number];

// /**
//  *
//  */
// export type TractorOrderSpecificTokenStrategy = {
//   type: "SPECIFIC_TOKEN";
//   addresses: `0x${string}`[];
// };

// export type TractorOrderDynamicFundingStrategy = { type: "LOWEST_SEEDS" } | { type: "LOWEST_PRICE" };

// export interface ExtendedTractorOrderSpecificTokenStrategy extends TractorOrderSpecificTokenStrategy {
//   token?: Token;
// }

// export type TractorOrderMultiTokensStrategy = {
//   type: "MULTI_TOKENS";
//   addresses: `0x${string}`[];
// };

// export interface ExtendedTractorOrderMultiTokensStrategy extends TractorOrderMultiTokensStrategy {
//   tokens?: Token[];
// }

// // Add the TokenStrategy type
// export type SowOrderTokenStrategy =
//   | TractorOrderDynamicFundingStrategy
//   | TractorOrderSpecificTokenStrategy
//   | TractorOrderMultiTokensStrategy;

// export type TractorTokenStrategy = SowOrderTokenStrategy;

// // Extended type that includes token information for SPECIFIC_TOKEN
// export type ExtendedTractorTokenStrategy =
//   | TractorOrderDynamicFundingStrategy
//   | ExtendedTractorOrderSpecificTokenStrategy
//   | ExtendedTractorOrderMultiTokensStrategy;

// export type TractorTokenStrategyUnion = {
//   type: TractorTokenStrategyType;
//   addresses?: (string | `0x${string}`)[];
// };
