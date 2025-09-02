import { beanstalkAbi } from "@/generated/contractHooks";
import type { BlueprintDecoder, DecodedBlueprintResult } from "./index";

export const genericBlueprintDecoder: BlueprintDecoder = {
  selector: "",
  abi: beanstalkAbi,
  functionName: "",
  decode: (callData: string): DecodedBlueprintResult | null => {
    const selector = callData.slice(0, 10);
    const data = callData.slice(10);

    // Find the function in the ABI that matches this selector
    const functionAbi = beanstalkAbi.find(
      (item) =>
        item.type === "function" &&
        item.name ===
          (selector === "0x553030d0"
            ? "sowWithMin"
            : selector === "0x6204aa43"
              ? "transferToken"
              : selector === "0x36bfafbd"
                ? "advancedFarm"
                : null),
    );

    if (functionAbi && functionAbi.type === "function" && functionAbi.inputs) {
      return {
        type: "generic",
        functionName: functionAbi.name || "unknown",
        params: {
          selector,
          data,
          functionAbi,
        },
      };
    }

    // Return raw data if we can't decode
    return {
      type: "generic",
      functionName: "unknown",
      params: {
        selector,
        data,
        functionAbi: null,
      },
    };
  },
};
