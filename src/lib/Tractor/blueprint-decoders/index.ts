import { diamondABI } from "@/constants/abi/diamondABI";
import { CONVERT_UP_BLUEPRINT_V0_SELECTOR, SOW_BLUEPRINT_V0_SELECTOR } from "@/constants/address";
import { decodeFunctionData } from "viem";
import { extractTractorBlueprintCall } from "../requisitions/tractor-requisition";
import { convertUpBlueprintDecoder } from "./convert-up-decoder";
import { genericBlueprintDecoder } from "./generic-decoder";
import { sowBlueprintDecoder } from "./sow-decoder";

export interface BlueprintDecoder {
  selector: string;
  abi: readonly unknown[];
  functionName: string;
  decode: (callData: string) => DecodedBlueprintResult | null;
}

export interface DecodedBlueprintResult {
  type: "sow" | "convertUp" | "generic";
  functionName: string;
  params: any;
}

export const BLUEPRINT_REGISTRY: Record<string, BlueprintDecoder> = {
  [SOW_BLUEPRINT_V0_SELECTOR]: sowBlueprintDecoder,
  [CONVERT_UP_BLUEPRINT_V0_SELECTOR]: convertUpBlueprintDecoder,
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

  let data: DecodedBlueprintResult | undefined | null = undefined;

  try {
    data = convertUpBlueprintDecoder.decode(blueprintCall);
  } catch (e) {
    try {
      data = sowBlueprintDecoder.decode(blueprintCall);
    } catch (err) {
      // throw err;
    }
  }

  const decoder = getBlueprintDecoder(selector);

  if (decoder) {
    return decoder.decode(blueprintCall);
  }

  // Fallback to generic decoder
  return genericBlueprintDecoder.decode(blueprintCall);
}

export type BlueprintType = "sow" | "convertUp" | "auto";
