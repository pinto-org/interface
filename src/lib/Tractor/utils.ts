import { TokenValue } from "@/classes/TokenValue";
import { TractorRequisitionEvent } from "./types";

export interface PublisherTractorExecution {
  type: "sow" | "convertUp";
  blockNumber: number;
  operator: `0x${string}`;
  publisher: `0x${string}`;
  blueprintHash: `0x${string}`;
  transactionHash: `0x${string}`;
  timestamp: number | undefined;
  sowEvent?: SowEventArgs;
  convertUpEvent?: any;
}

interface SowEventArgs<T extends bigint | TokenValue = TokenValue> {
  account: `0x${string}`;
  fieldId: bigint;
  index: T;
  beans: T;
  pods: T;
}

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

// export async function fetchTractorExecutions(
//   publicClient: PublicClient,
//   protocolAddress: `0x${string}`,
//   publisher: `0x${string}`,
//   latestBlock: MinimumViableBlock<bigint>,
//   lookbackBlocks?: bigint,
// ) {
//   const chainId = publicClient.chain?.id;
//   if (!chainId) throw new Error("[Tractor/fetchTractorExecutions] No chain ID found");

//   console.debug("[Tractor/fetchTractorExecutions] FETCHING(executions for publisher):", publisher);

//   let fromBlock = TRACTOR_DEPLOYMENT_BLOCK;

//   if (lookbackBlocks !== undefined) {
//     const newFromBlock = latestBlock.number - BigInt(lookbackBlocks);
//     fromBlock = newFromBlock > TRACTOR_DEPLOYMENT_BLOCK ? newFromBlock : TRACTOR_DEPLOYMENT_BLOCK;
//   }

//   // Get Tractor events
//   const tractorEvents = await publicClient.getContractEvents({
//     address: protocolAddress,
//     abi: diamondABI,
//     eventName: "Tractor",
//     args: {
//       publisher: publisher,
//     },
//     fromBlock: fromBlock ?? TRACTOR_DEPLOYMENT_BLOCK,
//     toBlock: "latest",
//   });

//   console.debug("[Tractor/fetchTractorExecutions] RESPONSE(Tractor events):", tractorEvents);

//   // Process transaction receipts and collect block numbers
//   const blockNumbers = new Set<bigint>();
//   const processingResults = await Promise.all(
//     tractorEvents.map(async (event) => {
//       const receipt = await publicClient.getTransactionReceipt({
//         hash: event.transactionHash,
//       });

//       // Add block number to the set for batch fetching
//       blockNumbers.add(receipt.blockNumber);

//       // Get the blueprint hash from the Tractor event
//       const blueprintHash = event.args?.blueprintHash as `0x${string}`;

//       // First, find the TractorExecutionBegan event with matching blueprint hash
//       let tractorExecutionBeganIndex = -1;
//       let tractorExecutionBeganEvent: any = null;

//       const mainToken = getChainConstant(resolveChainId(chainId), MAIN_TOKEN);

//       for (let i = 0; i < receipt.logs.length; i++) {
//         const log = receipt.logs[i];
//         try {
//           const decoded = decodeEventLog({
//             abi: diamondABI,
//             data: log.data,
//             topics: log.topics,
//           });

//           if (decoded.eventName === "TractorExecutionBegan" && decoded.args?.blueprintHash === blueprintHash) {
//             tractorExecutionBeganIndex = i;
//             tractorExecutionBeganEvent = decoded;
//             break;
//           }
//         } catch {
//           // Skip logs that can't be decoded
//         }
//       }

//       // If we found the TractorExecutionBegan event, look for the first Sow event after it
//       let sowEvent: any = null;
//       if (tractorExecutionBeganIndex >= 0) {
//         for (let i = tractorExecutionBeganIndex + 1; i < receipt.logs.length; i++) {
//           const log = receipt.logs[i];
//           try {
//             const decoded = decodeEventLog({
//               abi: diamondABI,
//               data: log.data,
//               topics: log.topics,
//             });

//             if (decoded.eventName === "Sow") {
//               sowEvent = log;
//               break;
//             }
//           } catch {
//             // Skip logs that can't be decoded
//           }
//         }
//       }

//       // Decode the Sow event if found
//       let sowData: SowEventArgs | undefined;
//       if (sowEvent) {
//         try {
//           const decoded = decodeEventLog({
//             abi: diamondABI,
//             data: sowEvent.data,
//             topics: sowEvent.topics,
//           }) as { args: SowEventArgs<bigint> };

//           sowData = {
//             account: decoded.args.account,
//             fieldId: decoded.args.fieldId,
//             index: TV.fromBigInt(decoded.args.index, PODS.decimals),
//             beans: TV.fromBigInt(decoded.args.beans, mainToken.decimals),
//             pods: TV.fromBigInt(decoded.args.pods, PODS.decimals),
//           };
//         } catch (error) {
//           console.error("Failed to decode Sow event:", error);
//         }
//       }

//       // Create the tractorExecutionBeganData object conditionally
//       const tractorExecutionBeganData = tractorExecutionBeganEvent
//         ? {
//           operator: tractorExecutionBeganEvent.args?.operator as `0x${string}`,
//           publisher: tractorExecutionBeganEvent.args?.publisher as `0x${string}`,
//           blueprintHash: tractorExecutionBeganEvent.args?.blueprintHash as `0x${string}`,
//           nonce: tractorExecutionBeganEvent.args?.nonce as bigint,
//           gasleft: tractorExecutionBeganEvent.args?.gasleft as bigint,
//         }
//         : undefined;

//       return {
//         blockNumber: receipt.blockNumber,
//         event,
//         receipt,
//         sowData,
//         tractorExecutionBeganEvent: tractorExecutionBeganData,
//       };
//     }),
//   );

//   // Fetch all required blocks in a batch
//   const blocks = await Promise.all(
//     Array.from(blockNumbers).map((blockNumber) => publicClient.getBlock({ blockNumber })),
//   );

//   // Build a map of block numbers to timestamps
//   const blockTimestamps = new Map<string, number>();
//   blocks.forEach((block) => {
//     blockTimestamps.set(block.number.toString(), Number(block.timestamp) * 1000);
//   });

//   // Assemble the final result
//   const processed = processingResults.map((result) => {
//     return {
//       blockNumber: Number(result.blockNumber),
//       operator: result.event.args?.operator as `0x${string}`,
//       publisher: result.event.args?.publisher as `0x${string}`,
//       blueprintHash: result.event.args?.blueprintHash as `0x${string}`,
//       transactionHash: result.event.transactionHash,
//       timestamp: blockTimestamps.get(result.blockNumber.toString()),
//       sowEvent: result.sowData,
//       tractorExecutionBeganEvent: result.tractorExecutionBeganEvent,
//     };
//   });

//   console.debug("[Tractor/fetchTractorExecutions] RESPONSE", processed);
//   return processed;
// }

// // ────────────────────────────────────────────────────────────────────────────────
// // OPERATOR AVERAGE TIP PAID
// // ────────────────────────────────────────────────────────────────────────────────

// /**
//  * Calculates the average tip paid from OperatorReward events in the last 14 days.
//  * Returns 1 if no events are found.
//  */
// export async function getAverageTipPaid(
//   publicClient: PublicClient,
//   currentBlock: MinimumViableBlock<bigint>,
//   lookbackBlocks: bigint = TIME_TO_BLOCKS.fortnight,
// ): Promise<number> {
//   console.debug("[Tractor/getAverageTipPaid] FETCHING", { currentBlock, lookbackBlocks });

//   try {
//     // Calculate starting block (use max of deployment block or lookback. Default is 14 days)
//     const lookback = currentBlock.number > lookbackBlocks ? currentBlock.number - lookbackBlocks : 0n;
//     const fromBlock = lookback > TRACTOR_DEPLOYMENT_BLOCK ? lookback : TRACTOR_DEPLOYMENT_BLOCK;

//     // Query for OperatorReward events
//     const events = await publicClient.getContractEvents({
//       address: TRACTOR_HELPERS_ADDRESS,
//       abi: tractorHelpersABI,
//       eventName: "OperatorReward",
//       fromBlock,
//       toBlock: "latest",
//     });

//     // If no events found, return default value of 1
//     if (events.length === 0) {
//       return 1;
//     }

//     // Calculate average tip amount
//     let totalTipAmount = 0n;
//     let validEventCount = 0;

//     for (const event of events) {
//       try {
//         // Get the event data
//         const decodedEvent = decodeEventLog({
//           abi: tractorHelpersABI,
//           data: event.data,
//           topics: event.topics,
//         });

//         // Extract and use the amount parameter
//         if (decodedEvent.args && "amount" in decodedEvent.args) {
//           const amount = decodedEvent.args.amount;

//           // Make sure it's a bigint and positive
//           if (typeof amount === "bigint" && amount > 0n) {
//             totalTipAmount += amount;
//             validEventCount++;
//           }
//         }
//       } catch (error) {
//         // Silently continue on error
//       }
//     }

//     // If no valid events found, return default value
//     if (validEventCount === 0) {
//       return 1;
//     }

//     // Calculate average in human-readable form
//     const avgTipAmount = Number(totalTipAmount) / (validEventCount * 1e6);
//     const result = avgTipAmount > 0 ? avgTipAmount : 1;

//     console.debug("[Tractor/getAverageTipPaid] RESPONSE", {
//       totalTipAmount,
//       validEventCount,
//       avgTipAmount,
//       result,
//     });

//     // If we somehow got a non-positive number, return the default
//     return result;
//   } catch (error) {
//     console.error("Error getting average tip amount:", error);
//     // Return default value in case of error
//     return 1;
//   }
// }

// // ────────────────────────────────────────────────────────────────────────────────
// // Sow Order Utility Functions
// // ────────────────────────────────────────────────────────────────────────────────

// /**
//  * Get the token strategy for a sow order.
//  * @param indicies - The indices of the tokens to use for the order.
//  * @returns The token strategy for the order.
//  */
// export const getSowOrderTokenStrategy = (indicies: readonly number[]): TractorTokenStrategyType => {
//   if (indicies.includes(TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS)) {
//     return "LOWEST_SEEDS";
//   } else if (indicies.includes(TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE)) {
//     return "LOWEST_PRICE";
//   } else if (indicies.length > 1) {
//     return "MULTI_TOKENS";
//   }

//   return "SPECIFIC_TOKEN";
// };

// export const extractAddressesFromTokenStrategy = (
//   tokenStrategy: TractorTokenStrategyUnion,
// ): `0x${string}`[] | undefined => {
//   if (tokenStrategy.type === "SPECIFIC_TOKEN" || tokenStrategy.type === "MULTI_TOKENS") {
//     return tokenStrategy.addresses as `0x${string}`[] | undefined;
//   }
//   return undefined;
// };

// export const getTractorTokenStrategySummary = (strategy: TractorTokenStrategyUnion) => {
//   const obj = {
//     isSingle: false,
//     isMulti: false,
//     isValid: false,
//     isDynamic: false,
//     isLowestSeeds: false,
//     isLowestPrice: false,
//     type: strategy.type,
//     addresses: strategy.addresses || (undefined as `0x${string}`[] | undefined),
//   };

//   if (isDynamicTractorTokenStrategy(strategy)) {
//     obj.isDynamic = true;
//     obj.isValid = true;
//     if (strategy.type === "LOWEST_SEEDS") {
//       obj.isLowestSeeds = true;
//     } else {
//       obj.isLowestPrice = true;
//     }

//     return obj;
//   } else if (isSingleTractorTokenStrategy(strategy)) {
//     obj.isValid = true;
//     obj.isSingle = true;
//     return obj;
//   } else if (isMultiTractorTokenStrategy(strategy)) {
//     obj.isValid = true;
//     obj.isMulti = true;
//     return obj;
//   }

//   return obj;
// };

// export const isDynamicTractorTokenStrategy = (
//   tokenStrategy: TractorTokenStrategyUnion,
// ): tokenStrategy is TractorOrderDynamicFundingStrategy => {
//   return tokenStrategy.type === "LOWEST_SEEDS" || tokenStrategy.type === "LOWEST_PRICE";
// };

// const isMultiTractorTokenStrategy = (
//   strategy: TractorTokenStrategyUnion,
// ): strategy is TractorOrderMultiTokensStrategy => {
//   if (strategy.type === "MULTI_TOKENS") {
//     return !!strategy.addresses && strategy.addresses.every((adr) => typeof adr === "string" && adr.startsWith("0x"));
//   }
//   return false;
// };

// const isSingleTractorTokenStrategy = (
//   strategy: TractorTokenStrategyUnion,
// ): strategy is TractorOrderSpecificTokenStrategy => {
//   if (strategy.type === "SPECIFIC_TOKEN") {
//     return !!strategy.addresses && strategy.addresses.length === 1 && strategy.addresses[0].startsWith("0x");
//   }
//   return false;
// };

// /**
//  * Get the token strategy for a tractor order.
//  * @param indicies - The indices of the tokens to use for the order.
//  * @returns The token strategy for the order.
//  */
// export const getTractorOrderTokenStrategyFromIndicies = (indicies: readonly number[]) => {
//   if (!indicies.length) {
//     throw new Error("No source token indices provided");
//   }

//   if (indicies.length > 1) {
//     const hasInvalid = indicies.some(
//       (index) =>
//         index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE ||
//         index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS,
//     );
//     if (hasInvalid) {
//       throw new Error("Invalid token indices. LOWEST SEEDS or LOWEST PRICE cannot be used with multiple tokens.");
//     }
//     return "MULTI_TOKENS";
//   }

//   const index = indicies[0];

//   if (index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS) {
//     return "LOWEST_SEEDS";
//   } else if (index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE) {
//     return "LOWEST_PRICE";
//   } else {
//     return "SPECIFIC_TOKEN";
//   }
// };

// /**
//  * Type guard function that validates if a value is a valid TractorTokenStrategy.
//  *
//  * @param value - The value to validate
//  * @returns True if the value is a valid TractorTokenStrategy, false otherwise
//  */
// export const isTractorTokenStrategy = (value: unknown): value is TractorTokenStrategy => {
//   if (!value) return false;

//   const strategy = value as Record<string, unknown>;

//   if (typeof strategy.type !== "string") return false;

//   switch (strategy.type) {
//     case "LOWEST_SEEDS":
//       return true;
//     case "LOWEST_PRICE":
//       return true;
//     default: {
//       if (!("addresses" in strategy) || !Array.isArray(strategy.addresses)) {
//         return false;
//       }
//       if (strategy.type === "SPECIFIC_TOKEN") {
//         return strategy.addresses?.length && strategy.addresses.length === 1 && strategy.addresses[0].startsWith("0x");
//       }
//       if (strategy.type === "MULTI_TOKENS") {
//         return strategy.addresses.every((addr) => typeof addr === "string" && addr.startsWith("0x"));
//       }
//       return false;
//     }
//   }
// };

// export const tractorTokenStrategyUtil = {
//   // validation methods
//   isValidStrategy: isTractorTokenStrategy,
//   // type guards
//   getSummary: getTractorTokenStrategySummary,
//   isDynamic: isDynamicTractorTokenStrategy,
//   isMulti: isMultiTractorTokenStrategy,
//   isSingle: isSingleTractorTokenStrategy,
//   // getters
//   extractAddresses: extractAddressesFromTokenStrategy,
//   getStrategyFromIndicies: getTractorOrderTokenStrategyFromIndicies,
//   // misc utils
//   getSowOrderTokenStrategy,
// };
