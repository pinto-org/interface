import { TokenValue } from "@/classes/TokenValue";
import { FarmFromMode } from "@/utils/types";
import { TractorRequisitionEvent } from "..";
import { WithdrawalPlan } from "../core";

export interface SowBlueprintData {
  sourceTokenIndices: readonly number[];
  sowAmounts: {
    totalAmountToSow: bigint;
    totalAmountToSowAsString: string;
    minAmountToSowPerSeason: bigint;
    minAmountToSowPerSeasonAsString: string;
    maxAmountToSowPerSeason: bigint;
    maxAmountToSowPerSeasonAsString: string;
  };
  minTemp: bigint;
  minTempAsString: string;
  maxPodlineLength: bigint;
  maxPodlineLengthAsString: string;
  maxGrownStalkPerBdv: bigint;
  maxGrownStalkPerBdvAsString: string;
  runBlocksAfterSunrise: bigint;
  runBlocksAfterSunriseAsString: string;
  slippageRatio: bigint;
  slippageRatioAsString: string;
  operatorParams: {
    whitelistedOperators: readonly `0x${string}`[];
    tipAddress: `0x${string}`;
    operatorTipAmount: bigint;
    operatorTipAmountAsString: string;
  };
  fromMode: FarmFromMode;
}

export type TractorSowOrderParams = {
  sowParams: {
    sourceTokenIndices: readonly number[];
    sowAmounts: {
      totalAmountToSow: bigint;
      minAmountToSowPerSeason: bigint;
      maxAmountToSowPerSeason: bigint;
    };
    minTemp: bigint;
    maxPodlineLength: bigint;
    maxGrownStalkPerBdv: bigint;
    runBlocksAfterSunrise: bigint;
    slippageRatio: bigint;
  };
  opParams: {
    whitelistedOperators: readonly `0x${string}`[];
    tipAddress: `0x${string}`;
    operatorTipAmount: bigint;
  };
};

export interface SowEventArgs<T extends bigint | TokenValue = TokenValue> {
  account: `0x${string}`;
  fieldId: bigint;
  index: T;
  beans: T;
  pods: T;
}

// Update the interface to make decodedData optional
export interface OrderbookEntry extends Omit<TractorRequisitionEvent, "decodedData"> {
  decodedData?: SowBlueprintData;
  pintosLeftToSow: TokenValue;
  totalAvailablePinto: TokenValue;
  currentlySowable: TokenValue;
  amountSowableNextSeason: TokenValue;
  amountSowableNextSeasonConsideringAvailableSoil: TokenValue;
  estimatedPlaceInLine: TokenValue;
  minTemp: TokenValue;
  withdrawalPlan?: WithdrawalPlan;
  isComplete?: boolean;
  referralAddress?: `0x${string}`; // Optional referral address for referralV0 blueprints
}

// Sow order book entry type
export type SowOrderbookEntry = OrderbookEntry;

export interface SowBlueprintDisplayData {
  totalAmount: string;
  minAmount: string;
  maxAmount: string;
  minTemp: string;
  maxPodlineLength: string;
  maxGrownStalkPerBdv: string;
  runBlocksAfterSunrise: string;
  slippageRatio: string;
  operatorTip: string;
  whitelistedOperators: readonly `0x${string}`[];
  tipAddress: `0x${string}`;
}

// Referral blueprint types
export interface SowReferralBlueprintData {
  params: SowBlueprintData;
  referral: `0x${string}`;
}

export type SowBlueprintVersion = "v0" | "referralV0";
