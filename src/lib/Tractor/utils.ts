import { TV, TokenValue } from "@/classes/TokenValue";
import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import { diamondABI } from "@/constants/abi/diamondABI";
import { TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { PODS } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { getChainConstant } from "@/utils/chain";
import { resolveChainId } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { MinimumViableBlock } from "@/utils/types";
import { MayArray } from "@/utils/types.generic";
import { arrayify } from "@/utils/utils";
import { SignableMessage, decodeEventLog, decodeFunctionData } from "viem";
import { PublicClient } from "viem";
import { RequisitionType, TRACTOR_DEPLOYMENT_BLOCK, TRACTOR_TOKEN_STRATEGY_INDICIES } from "./core";
import { decodeSowTractorData } from "./sowOrder";
import { SowBlueprintData } from "./sowOrder/tractor-sow-types";
import {
  Requisition,
  TractorOrderDynamicFundingStrategy,
  TractorOrderMultiTokensStrategy,
  TractorOrderSpecificTokenStrategy,
  TractorRequisitionData,
  TractorRequisitionEvent,
  TractorTokenStrategy,
  TractorTokenStrategyType,
  TractorTokenStrategyUnion,
} from "./types";

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

// ────────────────────────────────────────────────────────────────────────────────
// Create Sow V0 Tractor Order & Sign Requisition
// ────────────────────────────────────────────────────────────────────────────────

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

// async function paginateGetContractEvents<T>(
//   publicClient: PublicClient,
//   request: (args: { fromBlock: BlockTag | bigint; toBlock: BlockTag | bigint }) => Promise<T[]>,
//   latestBlock: MinimumViableBlock<bigint>,
// ) {
//   const events: T[] = [];
//   let fromBlock: BlockTag | bigint = TRACTOR_DEPLOYMENT_BLOCK;
//   let toBlock: BlockTag | bigint = "latest";

//   while (true) {
//     const results = await request({ fromBlock, toBlock });
//     events.push(...results);
//   }
// }

// ────────────────────────────────────────────────────────────────────────────────
// Fetch Tractor Events
// ────────────────────────────────────────────────────────────────────────────────

export async function fetchTractorEvents(
  publicClient: PublicClient,
  protocolAddress: `0x${string}`,
  blockFrom?: bigint,
) {
  const fromBlock = blockFrom ?? TRACTOR_DEPLOYMENT_BLOCK;
  const sharedArgs = {
    address: protocolAddress,
    abi: diamondABI,
    fromBlock,
    toBlock: "latest",
  } as const;

  // Get published requisitions & cancelled blueprints
  const [publishEvents, cancelEvents] = await Promise.all([
    publicClient.getContractEvents({ eventName: "PublishRequisition", ...sharedArgs }),
    publicClient.getContractEvents({ eventName: "CancelBlueprint", ...sharedArgs }),
  ]);

  // Create a set of cancelled blueprint hashes
  const cancelledHashes = new Set(
    cancelEvents
      .map((event) => event.args?.blueprintHash)
      .filter((hash): hash is NonNullable<typeof hash> => hash !== undefined),
  );

  return { publishEvents, cancelledHashes };
}

// ────────────────────────────────────────────────────────────────────────────────
// Requisitions
// ────────────────────────────────────────────────────────────────────────────────

type SelectRequisitionTypeArgs = {
  latestBlock: MinimumViableBlock<bigint>;
  data: Awaited<ReturnType<typeof fetchTractorEvents>>;
};

export const getSelectRequisitionType = (requisitionsType: MayArray<RequisitionType> | undefined, address?: string) => {
  return (args: SelectRequisitionTypeArgs | undefined) => {
    if (!args) return undefined;

    const requisitionsSet = requisitionsType && new Set<RequisitionType>(arrayify(requisitionsType));

    const {
      data: { publishEvents, cancelledHashes },
      latestBlock,
    } = args;

    const latestTimestamp = Number(latestBlock.timestamp);
    const latestBlockNumber = Number(latestBlock.number);

    const filteredEvents = publishEvents
      .map((event) => {
        const requisition = event.args?.requisition as TractorRequisitionData;
        if (!requisition?.blueprint || !requisition?.blueprintHash || !requisition?.signature) return null;

        // Only filter by address if one is provided
        if (address && !stringEq(requisition.blueprint.publisher, address)) {
          return null;
        }

        let eventRequisitionType: RequisitionType = "unknown";
        // Try to decode the data
        const decodedData = decodeSowTractorData(requisition.blueprint.data);
        if (decodedData) {
          eventRequisitionType = "sowBlueprintv0";
        }

        // Filter by requisition type if provided
        if (requisitionsSet?.size && !requisitionsSet.has(eventRequisitionType)) {
          return null;
        }

        // Calculate timestamp if we have the latest block info
        let timestamp: number | undefined = undefined;
        if (latestBlock) {
          // Convert all BigInt values to Number before arithmetic operations
          const eventBlockNumber = Number(event.blockNumber);

          // Calculate timestamp (approximately 2 seconds per block)
          timestamp = latestTimestamp * 1000 - (latestBlockNumber - eventBlockNumber) * 2000;
        }

        return {
          requisition,
          blockNumber: Number(event.blockNumber),
          timestamp,
          isCancelled: cancelledHashes.has(requisition.blueprintHash),
          requisitionType: eventRequisitionType,
          decodedData,
        } as TractorRequisitionEvent<SowBlueprintData>;
      })
      .filter((event): event is NonNullable<typeof event> => event !== null);

    return filteredEvents;
  };
};

export async function loadPublishedRequisitions(
  address: string | undefined,
  protocolAddress: `0x${string}` | undefined,
  publicClient: PublicClient | null,
  latestBlock?: { number: bigint; timestamp: bigint } | null,
  requisitionType?: MayArray<RequisitionType>, // Add requisition type filter
  fromBlock?: bigint,
) {
  if (!protocolAddress || !publicClient) return [];

  try {
    const data = await fetchTractorEvents(publicClient, protocolAddress, fromBlock);
    const selectRequisitionType = getSelectRequisitionType(requisitionType, address);
    return selectRequisitionType({
      latestBlock: { number: latestBlock?.number ?? 0n, timestamp: latestBlock?.timestamp ?? 0n },
      data,
    });
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

export interface PublisherTractorExecution {
  type: "sow" | "convertUp";
  blockNumber: number;
  operator: `0x${string}`;
  publisher: `0x${string}`;
  blueprintHash: `0x${string}`;
  transactionHash: `0x${string}`;
  timestamp: number | undefined;
  sowEvent: SowEventArgs | undefined;
}

interface SowEventArgs<T extends bigint | TokenValue = TokenValue> {
  account: `0x${string}`;
  fieldId: bigint;
  index: T;
  beans: T;
  pods: T;
}

export async function fetchTractorExecutions(
  publicClient: PublicClient,
  protocolAddress: `0x${string}`,
  publisher: `0x${string}`,
  latestBlock: MinimumViableBlock<bigint>,
  lookbackBlocks?: bigint,
) {
  const chainId = publicClient.chain?.id;
  if (!chainId) throw new Error("[Tractor/fetchTractorExecutions] No chain ID found");

  console.debug("[Tractor/fetchTractorExecutions] FETCHING(executions for publisher):", publisher);

  let fromBlock = TRACTOR_DEPLOYMENT_BLOCK;

  if (lookbackBlocks !== undefined) {
    const newFromBlock = latestBlock.number - BigInt(lookbackBlocks);
    fromBlock = newFromBlock > TRACTOR_DEPLOYMENT_BLOCK ? newFromBlock : TRACTOR_DEPLOYMENT_BLOCK;
  }

  // Get Tractor events
  const tractorEvents = await publicClient.getContractEvents({
    address: protocolAddress,
    abi: diamondABI,
    eventName: "Tractor",
    args: {
      publisher: publisher,
    },
    fromBlock: fromBlock ?? TRACTOR_DEPLOYMENT_BLOCK,
    toBlock: "latest",
  });

  console.debug("[Tractor/fetchTractorExecutions] RESPONSE(Tractor events):", tractorEvents);

  // Process transaction receipts and collect block numbers
  const blockNumbers = new Set<bigint>();
  const processingResults = await Promise.all(
    tractorEvents.map(async (event) => {
      const receipt = await publicClient.getTransactionReceipt({
        hash: event.transactionHash,
      });

      // Add block number to the set for batch fetching
      blockNumbers.add(receipt.blockNumber);

      // Get the blueprint hash from the Tractor event
      const blueprintHash = event.args?.blueprintHash as `0x${string}`;

      // First, find the TractorExecutionBegan event with matching blueprint hash
      let tractorExecutionBeganIndex = -1;
      let tractorExecutionBeganEvent: any = null;

      const mainToken = getChainConstant(resolveChainId(chainId), MAIN_TOKEN);

      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        try {
          const decoded = decodeEventLog({
            abi: diamondABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "TractorExecutionBegan" && decoded.args?.blueprintHash === blueprintHash) {
            tractorExecutionBeganIndex = i;
            tractorExecutionBeganEvent = decoded;
            break;
          }
        } catch {
          // Skip logs that can't be decoded
        }
      }

      // If we found the TractorExecutionBegan event, look for the first Sow event after it
      let sowEvent: any = null;
      if (tractorExecutionBeganIndex >= 0) {
        for (let i = tractorExecutionBeganIndex + 1; i < receipt.logs.length; i++) {
          const log = receipt.logs[i];
          try {
            const decoded = decodeEventLog({
              abi: diamondABI,
              data: log.data,
              topics: log.topics,
            });

            if (decoded.eventName === "Sow") {
              sowEvent = log;
              break;
            }
          } catch {
            // Skip logs that can't be decoded
          }
        }
      }

      // Decode the Sow event if found
      let sowData: SowEventArgs | undefined;
      if (sowEvent) {
        try {
          const decoded = decodeEventLog({
            abi: diamondABI,
            data: sowEvent.data,
            topics: sowEvent.topics,
          }) as { args: SowEventArgs<bigint> };

          sowData = {
            account: decoded.args.account,
            fieldId: decoded.args.fieldId,
            index: TV.fromBigInt(decoded.args.index, PODS.decimals),
            beans: TV.fromBigInt(decoded.args.beans, mainToken.decimals),
            pods: TV.fromBigInt(decoded.args.pods, PODS.decimals),
          };
        } catch (error) {
          console.error("Failed to decode Sow event:", error);
        }
      }

      // Create the tractorExecutionBeganData object conditionally
      const tractorExecutionBeganData = tractorExecutionBeganEvent
        ? {
            operator: tractorExecutionBeganEvent.args?.operator as `0x${string}`,
            publisher: tractorExecutionBeganEvent.args?.publisher as `0x${string}`,
            blueprintHash: tractorExecutionBeganEvent.args?.blueprintHash as `0x${string}`,
            nonce: tractorExecutionBeganEvent.args?.nonce as bigint,
            gasleft: tractorExecutionBeganEvent.args?.gasleft as bigint,
          }
        : undefined;

      return {
        blockNumber: receipt.blockNumber,
        event,
        receipt,
        sowData,
        tractorExecutionBeganEvent: tractorExecutionBeganData,
      };
    }),
  );

  // Fetch all required blocks in a batch
  const blocks = await Promise.all(
    Array.from(blockNumbers).map((blockNumber) => publicClient.getBlock({ blockNumber })),
  );

  // Build a map of block numbers to timestamps
  const blockTimestamps = new Map<string, number>();
  blocks.forEach((block) => {
    blockTimestamps.set(block.number.toString(), Number(block.timestamp) * 1000);
  });

  // Assemble the final result
  const processed = processingResults.map((result) => {
    return {
      blockNumber: Number(result.blockNumber),
      operator: result.event.args?.operator as `0x${string}`,
      publisher: result.event.args?.publisher as `0x${string}`,
      blueprintHash: result.event.args?.blueprintHash as `0x${string}`,
      transactionHash: result.event.transactionHash,
      timestamp: blockTimestamps.get(result.blockNumber.toString()),
      sowEvent: result.sowData,
      tractorExecutionBeganEvent: result.tractorExecutionBeganEvent,
    };
  });

  console.debug("[Tractor/fetchTractorExecutions] RESPONSE", processed);
  return processed;
}

// ────────────────────────────────────────────────────────────────────────────────
// OPERATOR AVERAGE TIP PAID
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the average tip paid from OperatorReward events in the last 14 days.
 * Returns 1 if no events are found.
 */
export async function getAverageTipPaid(
  publicClient: PublicClient,
  currentBlock: MinimumViableBlock<bigint>,
  lookbackBlocks: bigint = TIME_TO_BLOCKS.fortnight,
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

// ────────────────────────────────────────────────────────────────────────────────
// Sow Order Utility Functions
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get the token strategy for a sow order.
 * @param indicies - The indices of the tokens to use for the order.
 * @returns The token strategy for the order.
 */
export const getSowOrderTokenStrategy = (indicies: readonly number[]): TractorTokenStrategyType => {
  if (indicies.includes(TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS)) {
    return "LOWEST_SEEDS";
  } else if (indicies.includes(TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE)) {
    return "LOWEST_PRICE";
  } else if (indicies.length > 1) {
    return "MULTI_TOKENS";
  }

  return "SPECIFIC_TOKEN";
};

export const extractAddressesFromTokenStrategy = (
  tokenStrategy: TractorTokenStrategyUnion,
): `0x${string}`[] | undefined => {
  if (tokenStrategy.type === "SPECIFIC_TOKEN" || tokenStrategy.type === "MULTI_TOKENS") {
    return tokenStrategy.addresses as `0x${string}`[] | undefined;
  }
  return undefined;
};

export const getTractorTokenStrategySummary = (strategy: TractorTokenStrategyUnion) => {
  const obj = {
    isSingle: false,
    isMulti: false,
    isValid: false,
    isDynamic: false,
    isLowestSeeds: false,
    isLowestPrice: false,
    type: strategy.type,
    addresses: strategy.addresses || (undefined as `0x${string}`[] | undefined),
  };

  if (isDynamicTractorTokenStrategy(strategy)) {
    obj.isDynamic = true;
    obj.isValid = true;
    if (strategy.type === "LOWEST_SEEDS") {
      obj.isLowestSeeds = true;
    } else {
      obj.isLowestPrice = true;
    }

    return obj;
  } else if (isSingleTractorTokenStrategy(strategy)) {
    obj.isValid = true;
    obj.isSingle = true;
    return obj;
  } else if (isMultiTractorTokenStrategy(strategy)) {
    obj.isValid = true;
    obj.isMulti = true;
    return obj;
  }

  return obj;
};

export const isDynamicTractorTokenStrategy = (
  tokenStrategy: TractorTokenStrategyUnion,
): tokenStrategy is TractorOrderDynamicFundingStrategy => {
  return tokenStrategy.type === "LOWEST_SEEDS" || tokenStrategy.type === "LOWEST_PRICE";
};

const isMultiTractorTokenStrategy = (
  strategy: TractorTokenStrategyUnion,
): strategy is TractorOrderMultiTokensStrategy => {
  if (strategy.type === "MULTI_TOKENS") {
    return !!strategy.addresses && strategy.addresses.every((adr) => typeof adr === "string" && adr.startsWith("0x"));
  }
  return false;
};

const isSingleTractorTokenStrategy = (
  strategy: TractorTokenStrategyUnion,
): strategy is TractorOrderSpecificTokenStrategy => {
  if (strategy.type === "SPECIFIC_TOKEN") {
    return !!strategy.addresses && strategy.addresses.length === 1 && strategy.addresses[0].startsWith("0x");
  }
  return false;
};

/**
 * Get the token strategy for a tractor order.
 * @param indicies - The indices of the tokens to use for the order.
 * @returns The token strategy for the order.
 */
export const getTractorOrderTokenStrategyFromIndicies = (indicies: readonly number[]) => {
  if (!indicies.length) {
    throw new Error("No source token indices provided");
  }

  if (indicies.length > 1) {
    const hasInvalid = indicies.some(
      (index) =>
        index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE ||
        index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS,
    );
    if (hasInvalid) {
      throw new Error("Invalid token indices. LOWEST SEEDS or LOWEST PRICE cannot be used with multiple tokens.");
    }
    return "MULTI_TOKENS";
  }

  const index = indicies[0];

  if (index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS) {
    return "LOWEST_SEEDS";
  } else if (index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE) {
    return "LOWEST_PRICE";
  } else {
    return "SPECIFIC_TOKEN";
  }
};

/**
 * Type guard function that validates if a value is a valid TractorTokenStrategy.
 *
 * @param value - The value to validate
 * @returns True if the value is a valid TractorTokenStrategy, false otherwise
 */
export const isTractorTokenStrategy = (value: unknown): value is TractorTokenStrategy => {
  if (!value) return false;

  const strategy = value as Record<string, unknown>;

  if (typeof strategy.type !== "string") return false;

  switch (strategy.type) {
    case "LOWEST_SEEDS":
      return true;
    case "LOWEST_PRICE":
      return true;
    default: {
      if (!("addresses" in strategy) || !Array.isArray(strategy.addresses)) {
        return false;
      }
      if (strategy.type === "SPECIFIC_TOKEN") {
        return strategy.addresses?.length && strategy.addresses.length === 1 && strategy.addresses[0].startsWith("0x");
      }
      if (strategy.type === "MULTI_TOKENS") {
        return strategy.addresses.every((addr) => typeof addr === "string" && addr.startsWith("0x"));
      }
      return false;
    }
  }
};

export const tractorTokenStrategyUtil = {
  // validation methods
  isValidStrategy: isTractorTokenStrategy,
  // type guards
  getSummary: getTractorTokenStrategySummary,
  isDynamic: isDynamicTractorTokenStrategy,
  isMulti: isMultiTractorTokenStrategy,
  isSingle: isSingleTractorTokenStrategy,
  // getters
  extractAddresses: extractAddressesFromTokenStrategy,
  getStrategyFromIndicies: getTractorOrderTokenStrategyFromIndicies,
  // misc utils
  getSowOrderTokenStrategy,
};

/**
 * Prepare a requisition event for a transaction by normalizing the blueprint data.
 * - Fix timestamp values for transaction
 * - Filter out invalid operator paste instructions
 * @param req - The requisition event to prepare
 * @returns The prepared requisition event
 */
export const prepareSowOrderV0RequisitionEventForTxn = (req: TractorRequisitionEvent) => {
  const normalizeEndTime = (endTime: bigint) => {
    if (endTime === 8640000000000n) {
      // max uint256
      return BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");
    }
    return endTime;
  };

  return {
    ...req.requisition,
    blueprint: {
      ...req.requisition.blueprint,
      startTime: req.requisition.blueprint.startTime,
      endTime: normalizeEndTime(req.requisition.blueprint.endTime),
      operatorPasteInstrs: req.requisition.blueprint.operatorPasteInstrs.filter(
        (instr) => instr !== "0x" && instr !== ("" as `0x${string}`),
      ),
    },
  };
};
