import { automateClaimBlueprintABI } from "@/constants/abi/AutomateClaimBlueprintABI";
import { AUTOMATE_CLAIM_BLUEPRINT_SELECTOR } from "@/constants/address";
import { decodeFunctionData } from "viem";
import type { BlueprintDecoder, DecodedBlueprintResult } from "./index";

export const automateClaimBlueprintDecoder: BlueprintDecoder = {
  selector: AUTOMATE_CLAIM_BLUEPRINT_SELECTOR,
  abi: automateClaimBlueprintABI,
  functionName: "automateClaimBlueprint",
  decode: (callData: string): DecodedBlueprintResult | null => {
    try {
      const decoded = decodeFunctionData({
        abi: automateClaimBlueprintABI,
        data: callData as `0x${string}`,
      });

      if (decoded.functionName === "automateClaimBlueprint" && decoded.args[0]) {
        return {
          type: "automateClaim",
          functionName: "automateClaimBlueprint",
          params: decoded.args[0],
        };
      }
    } catch (error) {
      console.error("Error decoding automateClaimBlueprint:", error);
    }

    return null;
  },
};
