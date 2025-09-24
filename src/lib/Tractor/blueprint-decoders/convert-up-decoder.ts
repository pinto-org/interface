import { convertUpBlueprintV0ABI } from "@/constants/abi/convertUpBlueprintV0ABI";
import { CONVERT_UP_BLUEPRINT_V0_SELECTOR } from "@/constants/address";
import { decodeFunctionData } from "viem";
import type { BlueprintDecoder, DecodedBlueprintResult } from "./index";

export const convertUpBlueprintDecoder: BlueprintDecoder = {
  selector: CONVERT_UP_BLUEPRINT_V0_SELECTOR,
  abi: convertUpBlueprintV0ABI,
  functionName: "convertUpBlueprint",
  decode: (callData: string): DecodedBlueprintResult | null => {
    try {
      console.log("[Tractor/convertUpBlueprintDecoder] callData", callData);
      const decoded = decodeFunctionData({
        abi: convertUpBlueprintV0ABI,
        data: callData as `0x${string}`,
      });

      if (decoded.functionName === "convertUpBlueprint" && decoded.args[0]) {
        return {
          type: "convertUp",
          functionName: "convertUpBlueprint",
          params: decoded.args[0],
        };
      }
    } catch (error) {
      console.error("Error decoding convertUpBlueprint:", error);
    }

    return null;
  },
};
