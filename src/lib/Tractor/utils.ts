import { Address, SignableMessage, decodeFunctionData, encodeAbiParameters, encodeFunctionData, keccak256 } from "viem";
import { useContractWrite, type BaseError } from "wagmi";
import { Requisition } from "./types";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { FarmFromMode } from "@/utils/types";
import { beanstalkAbi } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import { PublicClient } from "viem";
import { diamondABI } from "@/constants/abi/diamondABI";
import { siloHelpersABI } from "@/constants/abi/SiloHelpersABI";
import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";

/**
 * Encodes three uint80 values into a bytes32 value in the format:
 * [ Padding (2 bytes) | copyByteIndex (10 bytes) | pasteCallIndex (10 bytes) | pasteByteIndex (10 bytes) ]
 */
function encodePasteInstruction(copyByteIndex: bigint, pasteCallIndex: bigint, pasteByteIndex: bigint): `0x${string}` {
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
}

// Add the TokenStrategy type
export type TokenStrategy = 
  | { type: "LOWEST_SEEDS" }
  | { type: "LOWEST_PRICE" }
  | { type: "SPECIFIC_TOKEN"; address: string };


/**
 * Creates blueprint data from Tractor inputs
 */
export function createSowTractorData({
  totalAmountToSow,
  temperature,
  minAmountPerSeason,
  maxAmountToSowPerSeason,
  maxPodlineLength,
  maxGrownStalkPerBdv,
  runBlocksAfterSunrise,
  operatorTip,
  whitelistedOperators,
  tokenStrategy,
}: {
  totalAmountToSow: string;
  temperature: string;
  minAmountPerSeason: string;
  maxAmountToSowPerSeason: string;
  maxPodlineLength: string;
  maxGrownStalkPerBdv: string;
  runBlocksAfterSunrise: string;
  operatorTip: string;
  whitelistedOperators: `0x${string}`[];
  tokenStrategy: TokenStrategy;
}): { data: `0x${string}`; operatorPasteInstrs: `0x${string}`[] } {
  // Add debug logs
  console.log("tokenStrategy received:", tokenStrategy);
  console.log("tokenStrategy.type:", tokenStrategy.type);
  console.log("LOWEST_SEEDS check:", tokenStrategy.type === "LOWEST_SEEDS");
  console.log("LOWEST_PRICE check:", tokenStrategy.type === "LOWEST_PRICE");

  // Convert inputs to appropriate types
  const totalAmount = BigInt(Math.floor(parseFloat(totalAmountToSow) * 1e6));
  const minAmount = BigInt(Math.floor(parseFloat(minAmountPerSeason) * 1e6));
  const maxAmount = BigInt(Math.floor(parseFloat(maxAmountToSowPerSeason) * 1e6));
  const maxPodline = BigInt(Math.floor(parseFloat(maxPodlineLength) * 1e6));
  const maxGrownStalk = BigInt(Math.floor(parseFloat(maxGrownStalkPerBdv) * 1e6));
  const runBlocks = BigInt(runBlocksAfterSunrise === "true" ? 0 : 300);  // 0 for morning auction, 300 otherwise
  const temp = BigInt(Math.floor(parseFloat(temperature) * 1e6));
  const tip = BigInt(Math.floor(parseFloat(operatorTip) * 1e6));

  // Create the TokenSelectionStrategy
  let tokenSelectionStrategy: { type: number; token: `0x${string}` };
  switch (tokenStrategy.type) {
    case "LOWEST_SEEDS":
      tokenSelectionStrategy = { type: 0, token: "0x" as `0x${string}` };
      break;
    case "LOWEST_PRICE":
      tokenSelectionStrategy = { type: 1, token: "0x" as `0x${string}` };
      break;
    case "SPECIFIC_TOKEN":
      tokenSelectionStrategy = { type: 2, token: tokenStrategy.address as `0x${string}` };
      break;
  }

  // Create the SowBlueprintStruct
  const sowBlueprintStruct = {
    sourceTokenIndices: tokenStrategy.type === "LOWEST_SEEDS" 
      ? [255] 
      : tokenStrategy.type === "LOWEST_PRICE"
      ? [254]
      : [] as number[],
    sowAmounts: [
      totalAmount,
      minAmount,
      maxAmount
    ] as const,
    minTemp: temp,
    operatorTipAmount: tip,
    tipAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    maxPodlineLength: maxPodline,
    maxGrownStalkPerBdv: maxGrownStalk,
    runBlocksAfterSunrise: runBlocks,
    whitelistedOperators: whitelistedOperators as readonly `0x${string}`[],
  };

  console.log("Struct before encoding:", {
    sourceTokenIndices: sowBlueprintStruct.sourceTokenIndices,
    sowAmounts: sowBlueprintStruct.sowAmounts.map(n => n.toString()),
    minTemp: sowBlueprintStruct.minTemp.toString(),
    operatorTipAmount: sowBlueprintStruct.operatorTipAmount.toString(),
    tipAddress: sowBlueprintStruct.tipAddress,
    maxPodlineLength: sowBlueprintStruct.maxPodlineLength.toString(),
    maxGrownStalkPerBdv: sowBlueprintStruct.maxGrownStalkPerBdv.toString(),
    runBlocksAfterSunrise: sowBlueprintStruct.runBlocksAfterSunrise.toString(),
    whitelistedOperators: sowBlueprintStruct.whitelistedOperators,
  });

  // Encode the function call with the struct
  const data = encodeFunctionData({
    abi: sowBlueprintv0ABI,
    functionName: "sowBlueprintv0",
    args: [sowBlueprintStruct],
  });

  console.log("Encoded data:", {
    fullData: data,
    selector: data.slice(0, 10),
    structData: data.slice(10),
  });

  return {
    data,
    operatorPasteInstrs: [], // TODO: Update if needed
  };
}

/**
 * Signs a requisition using the publisher's wallet
 */
export async function signRequisition(
  requisition: Requisition,
  signer: { signMessage: (args: { message: SignableMessage }) => Promise<`0x${string}`> },
): Promise<`0x${string}`> {
  const signature = await signer.signMessage({ message: { raw: requisition.blueprintHash } });
  requisition.signature = signature;
  return signature;
}

/**
 * Decodes sow data from encoded function call
 */
export function decodeSowTractorData(encodedData: `0x${string}`): {
  pintoAmount: string;
  temperature: string;
  minPintoAmount: string;
  fromMode: FarmFromMode;
  operatorTip: string;
} {
  try {
    const decoded = decodeFunctionData({
      abi: beanstalkAbi,
      data: encodedData,
    });

    if (decoded.functionName !== "advancedFarm") {
      throw new Error("Not an advancedFarm call");
    }

    const [calls] = decoded.args;
    if (!calls?.[0]?.callData || !calls?.[1]?.callData) {
      throw new Error("Missing farm calls");
    }

    const sowWithMinCall = decodeFunctionData({
      abi: beanstalkAbi,
      data: calls[0].callData,
    });

    const transferTokenCall = decodeFunctionData({
      abi: beanstalkAbi,
      data: calls[1].callData,
    });

    if (sowWithMinCall.functionName !== "sowWithMin") {
      throw new Error("Not a sowWithMin call");
    }

    if (transferTokenCall.functionName !== "transferToken") {
      throw new Error("Not a transferToken call");
    }

    const [amount, temp, minAmount, fromMode] = sowWithMinCall.args;
    const [, , tip] = transferTokenCall.args;

    // Convert from blockchain values (6 decimals) to human readable
    return {
      pintoAmount: TokenValue.fromBlockchain(amount, 6).toHuman(),
      temperature: TokenValue.fromBlockchain(temp, 6).toHuman(),
      minPintoAmount: TokenValue.fromBlockchain(minAmount, 6).toHuman(),
      fromMode: Number(fromMode) as unknown as FarmFromMode,
      operatorTip: TokenValue.fromBlockchain(tip, 6).toHuman(),
    };
  } catch (error) {
    console.error("Failed to decode sow data:", error);
    throw new Error("Invalid sow data");
  }
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

export async function fetchTractorEvents(publicClient: PublicClient, protocolAddress: `0x${string}`) {
  // Get published requisitions
  const publishEvents = await publicClient.getContractEvents({
    address: protocolAddress,
    abi: diamondABI,
    eventName: "PublishRequisition",
    fromBlock: BigInt(0),
    toBlock: "latest",
  });

  // Get cancelled blueprints
  const cancelEvents = await publicClient.getContractEvents({
    address: protocolAddress,
    abi: diamondABI,
    eventName: "CancelBlueprint",
    fromBlock: BigInt(0),
    toBlock: "latest",
  });

  // Create a set of cancelled blueprint hashes
  const cancelledHashes = new Set(
    cancelEvents
      .map((event) => event.args?.blueprintHash)
      .filter((hash): hash is NonNullable<typeof hash> => hash !== undefined),
  );

  return { publishEvents, cancelledHashes };
}

export interface RequisitionData {
  blueprint: {
    publisher: `0x${string}`;
    data: `0x${string}`;
    operatorPasteInstrs: readonly `0x${string}`[];
    maxNonce: bigint;
    startTime: bigint;
    endTime: bigint;
  };
  blueprintHash: `0x${string}`;
  signature: `0x${string}`;
}

export interface RequisitionEvent {
  requisition: RequisitionData;
  blockNumber: number;
  timestamp?: number;
  isCancelled?: boolean;
  requisitionType: "sowWithMin" | "unknown";
}

export async function loadPublishedRequisitions(
  address: string | undefined,
  protocolAddress: `0x${string}` | undefined,
  publicClient: PublicClient | null,
) {
  if (!protocolAddress || !publicClient) return [];

  try {
    const { publishEvents, cancelledHashes } = await fetchTractorEvents(publicClient, protocolAddress);

    const filteredEvents = publishEvents
      .map((event) => {
        const requisition = event.args?.requisition as RequisitionData;
        if (!requisition?.blueprint || !requisition?.blueprintHash || !requisition?.signature) return null;

        // Only filter by address if one is provided
        if (address && requisition.blueprint.publisher.toLowerCase() !== address.toLowerCase()) {
          return null;
        }

        let requisitionType: "sowWithMin" | "unknown" = "unknown";
        try {
          const decodedData = decodeSowTractorData(requisition.blueprint.data);
          if (decodedData) {
            requisitionType = "sowWithMin";
          }
        } catch (error) {
          // If decoding fails, keep type as unknown
        }

        return {
          requisition,
          blockNumber: Number(event.blockNumber),
          timestamp: undefined,
          isCancelled: cancelledHashes.has(requisition.blueprintHash),
          requisitionType,
        } as RequisitionEvent;
      })
      .filter((event): event is NonNullable<typeof event> => event !== null);

    return filteredEvents;
  } catch (error) {
    console.error("Error loading published requisitions:", error);
    throw new Error("Failed to load published requisitions");
  }
}

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
 * Parses the paste instructions from the requisition, returns fields with descriptions and types
 */
export function parsePasteInstructions(requisition: RequisitionEvent): PasteInstructions | null {
  try {
    const decoded = decodeFunctionData({
      abi: beanstalkAbi,
      data: requisition.requisition.blueprint.data,
    });

    const calls = decoded.args?.[0] as { callData: `0x${string}`; clipboard: `0x${string}` }[] | undefined;
    if (!calls) {
      console.error("No calls found in blueprint data");
      return null;
    }

    const fields: PasteField[] = [];
    if (requisition.requisitionType === "sowWithMin") {
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
