import {
  AUTOMATE_CLAIM_BLUEPRINT_SELECTOR,
  CONVERT_UP_BLUEPRINT_V0_SELECTOR,
  SOW_BLUEPRINT_REFERRAL_V0_SELECTOR,
  SOW_BLUEPRINT_V0_SELECTOR,
} from "@/constants/address";
import { extractTractorBlueprintCall } from "../requisitions/tractor-requisition";
import { automateClaimBlueprintDecoder } from "./automate-claim-decoder";
import { convertUpBlueprintDecoder } from "./convert-up-decoder";
import { genericBlueprintDecoder } from "./generic-decoder";
import { sowBlueprintDecoder } from "./sow-decoder";
import { sowBlueprintReferralDecoder } from "./sow-referral-decoder";

export interface BlueprintDecoder {
  selector: string;
  abi: readonly unknown[];
  functionName: string;
  decode: (callData: string) => DecodedBlueprintResult | null;
}

export interface DecodedBlueprintResult {
  type: "sow" | "convertUp" | "automateClaim" | "generic";
  functionName: string;
  params: any;
}

export const BLUEPRINT_REGISTRY: Record<string, BlueprintDecoder> = {
  [SOW_BLUEPRINT_V0_SELECTOR]: sowBlueprintDecoder,
  [SOW_BLUEPRINT_REFERRAL_V0_SELECTOR]: sowBlueprintReferralDecoder,
  [CONVERT_UP_BLUEPRINT_V0_SELECTOR]: convertUpBlueprintDecoder,
  [AUTOMATE_CLAIM_BLUEPRINT_SELECTOR]: automateClaimBlueprintDecoder,
} as const;

export function getBlueprintDecoder(selector: string): BlueprintDecoder | null {
  return BLUEPRINT_REGISTRY[selector] || null;
}

export function extractSelector(callData: string): string {
  return callData.slice(0, 10);
}

export function decodeBlueprintCallData(callData: string): DecodedBlueprintResult | null {
  // First extract the actual blueprint call from the tractor wrapper
  const blueprintCall = extractTractorBlueprintCall(callData as `0x${string}`);

  if (!blueprintCall) {
    return null;
  }

  const selector = extractSelector(blueprintCall);
  const decoder = getBlueprintDecoder(selector);

  if (decoder) {
    return decoder.decode(blueprintCall);
  }

  // fail safe for decoding tractor orders
  try {
    const convertDecoded = convertUpBlueprintDecoder.decode(blueprintCall);
    return convertDecoded;
  } catch (error) {
    // do nothing
  }

  try {
    const sowDecoded = sowBlueprintDecoder.decode(blueprintCall);
    return sowDecoded;
  } catch (error) {
    // do nothing
  }

  // Fallback to generic decoder
  const genericResult = genericBlueprintDecoder.decode(blueprintCall);
  return genericResult;
}

export type BlueprintType = "sow" | "convertUp" | "automateClaim" | "auto";
