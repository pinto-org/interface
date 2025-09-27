import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import { TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { beanstalkAbi } from "@/generated/contractHooks";
import { MinimumViableBlock } from "@/utils/types";
import { PublicClient, decodeEventLog, decodeFunctionData } from "viem";
import { TRACTOR_DEPLOYMENT_BLOCK } from "./constants";
import { TractorRequisitionEvent } from "./shared-tractor-types";

// Interface

interface PasteField {
  name: string;
  type: "address" | string; // Add more types as needed
}

interface PasteInstructions {
  fields: PasteField[];
  calls: { callData: `0x${string}`; clipboard: `0x${string}` }[];
  operatorPasteInstrs: readonly `0x${string}`[];
}

/**
 * Finds the offset of the operator placeholder address in the encoded data
 * Returns the offset where the placeholder slot begins
 */
export function findOperatorPlaceholderOffset(encodedData: `0x${string}`): number {
  // Remove 0x prefix for easier searching
  const data = encodedData.slice(2);

  // The placeholder address without 0x prefix, padded to 32 bytes (64 hex chars)
  const PLACEHOLDER = "0000000000000000000000004242424242424242424242424242424242424242";

  // Search for the placeholder in the data
  const index = data.toLowerCase().indexOf(PLACEHOLDER.toLowerCase());

  if (index === -1) {
    throw new Error("Operator placeholder not found in encoded data");
  }
  return index / 2; // Convert from hex characters to bytes
}

/**
 * Generates operator data by padding and concatenating field values
 */
export function generateOperatorData(fields: PasteField[], values: string[]): `0x${string}` {
  try {
    if (fields.length !== values.length) {
      throw new Error(`Expected ${fields.length} values but got ${values.length}`);
    }

    // For each field, pad the value to 32 bytes
    const paddedValues = fields.map((field, index) => {
      const value = values[index];
      if (!value) throw new Error(`Missing value for field: ${field.name}`);

      if (field.type === "address") {
        // Remove 0x prefix if present and pad to 32 bytes (64 hex chars)
        const cleanAddr = value.toLowerCase().replace("0x", "");
        return cleanAddr.padStart(64, "0");
      }
      // Add other field types here as needed
      throw new Error(`Unsupported field type: ${field.type}`);
    });

    // Concatenate all padded values
    const operatorData = `0x${paddedValues.join("")}`;
    return operatorData as `0x${string}`;
  } catch (error) {
    console.error("Failed to generate operator data:", error);
    throw error;
  }
}

/**
 * Parses the paste instructions from the requisition, returns fields with descriptions and types
 */
export function parsePasteInstructions(requisition: TractorRequisitionEvent): PasteInstructions | null {
  try {
    // Try to decode as advancedFarm first
    let calls: { callData: `0x${string}`; clipboard: `0x${string}` }[] | undefined;

    try {
      const decoded = decodeFunctionData({
        abi: beanstalkAbi,
        data: requisition.requisition.blueprint.data,
      });

      if (decoded.functionName === "advancedFarm") {
        calls = decoded.args?.[0] as { callData: `0x${string}`; clipboard: `0x${string}` }[] | undefined;
      }
    } catch (error) {
      console.debug("Not an advancedFarm call, trying direct approach:", error);
      // Not an advancedFarm call, will try the original approach next
    }

    // If we couldn't decode as advancedFarm or didn't find the calls
    if (!calls) {
      // Try the original approach - assume it's a direct call
      calls = [
        {
          callData: requisition.requisition.blueprint.data,
          clipboard: "0x" as `0x${string}`,
        },
      ];
    }

    if (!calls || calls.length === 0) {
      console.error("No calls found in blueprint data");
      return null;
    }

    const fields: PasteField[] = [];
    if (requisition.requisitionType === "sowBlueprintv0") {
      fields.push({ name: "Operator Address", type: "address" });
    }

    return {
      fields,
      calls: calls.map((call) => ({
        callData: call.callData,
        clipboard: call.clipboard,
      })),
      operatorPasteInstrs: requisition.requisition.blueprint.operatorPasteInstrs,
    };
  } catch (error) {
    console.error("Failed to decode paste instructions:", error);
    return null;
  }
}

/**
 * Calculates the average tip paid from OperatorReward events in the last 14 days.
 * Returns 1 if no events are found.
 */
export async function getAverageTipPaid(
  publicClient: PublicClient,
  currentBlock: MinimumViableBlock<bigint>,
  lookbackBlocks: bigint = TIME_TO_BLOCKS.month * 2n,
): Promise<number> {
  console.debug("[Tractor/getAverageTipPaid] FETCHING", { currentBlock, lookbackBlocks });

  try {
    // Calculate starting block (use max of deployment block or lookback. Default is 14 days)
    const lookback = currentBlock.number > lookbackBlocks ? currentBlock.number - lookbackBlocks : 0n;
    const fromBlock = lookback > TRACTOR_DEPLOYMENT_BLOCK ? lookback : TRACTOR_DEPLOYMENT_BLOCK;

    // Query for OperatorReward events
    const events = await publicClient.getContractEvents({
      address: TRACTOR_HELPERS_ADDRESS,
      abi: tractorHelpersABI,
      eventName: "OperatorReward",
      fromBlock,
      toBlock: "latest",
    });

    console.log("[Tractor/getAverageTipPaid]", events);

    // If no events found, return default value of 1
    if (events.length === 0) {
      return 1;
    }

    // Calculate average tip amount
    let totalTipAmount = 0n;
    let validEventCount = 0;

    for (const event of events) {
      try {
        // Get the event data
        const decodedEvent = decodeEventLog({
          abi: tractorHelpersABI,
          data: event.data,
          topics: event.topics,
        });

        // Extract and use the amount parameter
        if (decodedEvent.args && "amount" in decodedEvent.args) {
          const amount = decodedEvent.args.amount;

          // Make sure it's a bigint and positive
          if (typeof amount === "bigint" && amount > 0n) {
            totalTipAmount += amount;
            validEventCount++;
          }
        }
      } catch (error) {
        // Silently continue on error
      }
    }

    // If no valid events found, return default value
    if (validEventCount === 0) {
      return 1;
    }

    // Calculate average in human-readable form
    const avgTipAmount = Number(totalTipAmount) / (validEventCount * 1e6);
    const result = avgTipAmount > 0 ? avgTipAmount : 1;

    console.debug("[Tractor/getAverageTipPaid] RESPONSE", {
      totalTipAmount,
      validEventCount,
      avgTipAmount,
      result,
    });

    // If we somehow got a non-positive number, return the default
    return result;
  } catch (error) {
    console.error("Error getting average tip amount:", error);
    // Return default value in case of error
    return 1;
  }
}

/**
 * Encodes three uint80 values into a bytes32 value in the format:
 * [ Padding (2 bytes) | copyByteIndex (10 bytes) | pasteCallIndex (10 bytes) | pasteByteIndex (10 bytes) ]
 */
/*function encodePasteInstruction(copyByteIndex: bigint, pasteCallIndex: bigint, pasteByteIndex: bigint): `0x${string}` {
  // Each value should be uint80 (10 bytes)
  const maxUint80 = BigInt("1208925819614629174706176"); // 2^80
  if (copyByteIndex >= maxUint80 || pasteCallIndex >= maxUint80 || pasteByteIndex >= maxUint80) {
    throw new Error("Values must be less than 2^80");
  }

  // Convert each value to a hex string padded to 10 bytes (20 hex chars)
  const copyByteHex = copyByteIndex.toString(16).padStart(20, "0");
  const callByteHex = pasteCallIndex.toString(16).padStart(20, "0");
  const pasteByteHex = pasteByteIndex.toString(16).padStart(20, "0");

  // Combine with 2 bytes of padding at the start
  const combined = `0x0000${copyByteHex}${callByteHex}${pasteByteHex}`;

  return combined as `0x${string}`;
}*/
