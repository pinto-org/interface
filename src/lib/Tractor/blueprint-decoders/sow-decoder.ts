import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";
import { SOW_BLUEPRINT_V0_SELECTOR } from "@/constants/address";
import { decodeFunctionData } from "viem";
import type { BlueprintDecoder, DecodedBlueprintResult } from "./index";

export const sowBlueprintDecoder: BlueprintDecoder = {
  selector: SOW_BLUEPRINT_V0_SELECTOR,
  abi: sowBlueprintv0ABI,
  functionName: "sowBlueprintv0",
  decode: (callData: string): DecodedBlueprintResult | null => {
    try {
      const decoded = decodeFunctionData({
        abi: sowBlueprintv0ABI,
        data: callData as `0x${string}`,
      });

      if (decoded.functionName === "sowBlueprintv0" && decoded.args[0]) {
        return {
          type: "sow",
          functionName: "sowBlueprintv0",
          params: decoded.args[0],
        };
      }
    } catch (error) {
      console.error("Error decoding sowBlueprintv0:", error);
    }

    return null;
  },
};
