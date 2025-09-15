import { TV } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { Address } from "viem";

export interface SowEventLogArgs<T extends bigint | TV = TV> {
  eventName: "Sow";
  args: {
    account: `0x${string}`;
    fieldId: bigint;
    index: T;
    beans: T;
    pods: T;
  };
}

export type ConvertEventLog<T extends bigint | TV = TV, TokenIsh = Address | Address> = {
  eventName: "Convert";
  args: {
    account: `0x${string}`;
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
    account: `0x${string}`;
    grownStalkGained: T;
    newGrownStalk: T;
    bdvCapacityUsed: T;
    bdvConverted: T;
  };
};

export type TractorEventLogArgsMap<T extends bigint | TV = TV, MayToken = Address | Token> = {
  Sow: SowEventLogArgs<T>;
  Convert: ConvertEventLog<T, MayToken>;
  ConvertUpBonus: ConvertUpBonusEventLog<T>;
};

export type TractorExecutionEventLog<
  eventName extends "Sow" | "Convert" | "ConvertUpBonus",
  T extends bigint | TV = TV,
  MayToken = Address | Token,
> = {
  eventName: eventName;
  args: TractorEventLogArgsMap<T, MayToken>[eventName]["args"];
};
