import { TV } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { HashString, Prettify } from "@/utils/types.generic";
import { Address } from "viem";

// ────────────────────────────────────────────────────────────────────────────────
// Individual Event Log Args Types
// ────────────────────────────────────────────────────────────────────────────────

export interface SowEventLogArgs<T extends bigint | TV = TV> {
  eventName: "Sow";
  args: {
    account: HashString;
    fieldId: bigint;
    index: T;
    beans: T;
    pods: T;
  };
}

export type ConvertEventLog<T extends bigint | TV = TV, TokenIsh = Address | Address> = {
  eventName: "Convert";
  args: {
    account: HashString;
    fromToken: TokenIsh;
    toToken: TokenIsh;
    fromAmount: T;
    toAmount: T;
    fromBdv: T;
    toBdv: T;
  };
};

export type ConvertUpBonusEventLog<T extends bigint | TV = TV> = {
  eventName: "ConvertUpBonus";
  args: {
    account: HashString;
    grownStalkGained: T;
    newGrownStalk: T;
    bdvCapacityUsed: T;
    bdvConverted: T;
  };
};

// ────────────────────────────────────────────────────────────────────────────────
// Combined Event Log Args Types
// ────────────────────────────────────────────────────────────────────────────────

export type TractorEventLogArgsMap<T extends bigint | TV = TV, TokenIsh extends Address | Token = Token> = {
  Sow: SowEventLogArgs<T>;
  Convert: ConvertEventLog<T, TokenIsh>;
  ConvertUpBonus: ConvertUpBonusEventLog<T>;
};

// ────────────────────────────────────────────────────────────────────────────────
// Combined Event Log Args Types
// ────────────────────────────────────────────────────────────────────────────────

export type CombinedConvertUpEventLog<
  T extends bigint | TV = TV,
  TokenIsh extends HashString | Token = Token, //
> = Prettify<
  TractorEventLogArgsMap<T, TokenIsh>["Convert"]["args"] & TractorEventLogArgsMap<T, TokenIsh>["ConvertUpBonus"]["args"]
>;

// ────────────────────────────────────────────────────────────────────────────────
// Tractor Execution Event Log Args Types
// ────────────────────────────────────────────────────────────────────────────────

export type TractorExecutionEventLog<
  eventName extends "Sow" | "Convert" | "ConvertUpBonus",
  T extends bigint | TV = TV,
  TokenIsh extends HashString | Token = Token,
> = {
  eventName: eventName;
  args: TractorEventLogArgsMap<T, TokenIsh>[eventName]["args"];
};

// Central event mapping - ADD NEW EVENTS HERE
export type TractorEventMapping<
  Numeric extends bigint | TV = TV,
  TokenIsh extends HashString | Token = Token, //
> = Prettify<{
  sow: TractorExecutionEventLog<"Sow", Numeric>["args"];
  convertUp: CombinedConvertUpEventLog<Numeric, TokenIsh>;
  // Future events can be added here:
}>;

// Extract blueprint types from the mapping
type BlueprintType = keyof TractorEventMapping;

// Base interface with common fields
interface PublisherTractorExecutionBase {
  blockNumber: number;
  operator: HashString;
  publisher: HashString;
  blueprintHash: HashString;
  transactionHash: HashString;
  timestamp: number | undefined;
}

// Mapped type that creates a union of all possible executions
type PublisherTractorExecutionMap<Numeric extends bigint | TV = TV, TokenIsh extends `0x${string}` | Token = Token> = {
  [K in BlueprintType]: PublisherTractorExecutionBase & {
    type: K;
    event: TractorEventMapping<Numeric, TokenIsh>[K];
    // Legacy support - only for 'sow' type
    sowEvent?: K extends "sow" ? TractorExecutionEventLog<"Sow", Numeric>["args"] : never;
  };
};

// Export as discriminated union
export type PublisherTractorExecution<
  Numeric extends bigint | TV = TV,
  TokenIsh extends `0x${string}` | Token = Token,
  BP extends BlueprintType = BlueprintType,
> = PublisherTractorExecutionMap<Numeric, TokenIsh>[BP];
