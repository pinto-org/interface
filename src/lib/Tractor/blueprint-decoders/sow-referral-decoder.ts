import { sowBlueprintReferralV0ABI } from "@/constants/abi/SowBlueprintReferralV0ABI";
import { SOW_BLUEPRINT_REFERRAL_V0_SELECTOR } from "@/constants/address";
import { decodeFunctionData } from "viem";
import type { BlueprintDecoder, DecodedBlueprintResult } from "./index";

export const sowBlueprintReferralDecoder: BlueprintDecoder = {
  selector: SOW_BLUEPRINT_REFERRAL_V0_SELECTOR,
  abi: sowBlueprintReferralV0ABI,
  functionName: "sowBlueprintReferral",
  decode: (callData: string): DecodedBlueprintResult | null => {
    try {
      const decoded = decodeFunctionData({
        abi: sowBlueprintReferralV0ABI,
        data: callData as `0x${string}`,
      });

      if (decoded.functionName === "sowBlueprintReferral" && decoded.args[0]) {
        const referralStruct = decoded.args[0];

        if (typeof referralStruct === "object" && referralStruct !== null && "params" in referralStruct) {
          return {
            type: "sow",
            functionName: "sowBlueprintReferral",
            params: referralStruct.params,
          };
        }
      }
    } catch (error) {
      console.error("Error decoding sowBlueprintReferral:", error);
    }

    return null;
  },
};
