// import { TV } from "@/classes/TokenValue";
// import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
// import { diamondABI } from "@/constants/abi/diamondABI";
// import { TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
// import { TIME_TO_BLOCKS } from "@/constants/blocks";
// import { PODS } from "@/constants/internalTokens";
// import { MAIN_TOKEN } from "@/constants/tokens";
// import { beanstalkAbi } from "@/generated/contractHooks";
// import { getChainConstant, resolveChainId } from "@/utils/chain";
// import { stringEq } from "@/utils/string";
// import { MinimumViableBlock } from "@/utils/types";
// import { MayArray } from "@/utils/types.generic";
// import { arrayify } from "@/utils/utils";
// import { SignableMessage, decodeEventLog, decodeFunctionData } from "viem";
// import { PublicClient } from "viem";
// import { Requisition } from "./types";
// import { TRACTOR_DEPLOYMENT_BLOCK } from "./core/constants";
// import {
//   SowBlueprintData,
//   RequisitionData,
//   RequisitionType,
//   RequisitionEvent,
//   SowEventArgs,
//   PasteField,
//   PasteInstructions,
//   getSowBlueprintDisplayData,
// } from "./shared/interfaces";
// import { handleDecodeSowV0BlueprintFromAdvancedPipe } from "./core/encoding";

// /**
//  * Signs a requisition using the publisher's wallet
//  */
// export async function signRequisition(
//   requisition: Requisition,
//   signer: { signMessage: (args: { message: SignableMessage }) => Promise<`0x${string}`> },
// ): Promise<`0x${string}`> {
//   const signature = await signer.signMessage({ message: { raw: requisition.blueprintHash } });
//   requisition.signature = signature;
//   return signature;
// }

// /**
//  * Decodes sow data from encoded function call
//  */
// export function decodeSowTractorData(encodedData: `0x${string}`): SowBlueprintData | null {
//   try {
//     // Step 1: Attempt to decode.
//     const calls = decodeFunctionData({
//       abi: beanstalkAbi,
//       data: encodedData,
//     });

//     // Valid tractor orders are encoded as advancedFarm(advancedPipe(callData))
//     // Step 2: If the encoded data is an advancedFarm call, decode again.
//     if (calls.functionName === "advancedFarm" && calls.args[0]) {
//       const farmCalls = calls.args[0];

//       if (!farmCalls.length) {
//         console.debug("[Tractor/decodeSowTractorData] No farm calls provided. Returning null.");
//         return null;
//       }
//       // Step 3: Try to decode the inner call as advancedPipe
//       try {
//         const pipeCallData = farmCalls[0].callData;
//         const advancedPipeDecoded = decodeFunctionData({
//           abi: beanstalkAbi,
//           data: pipeCallData,
//         });

//         if (advancedPipeDecoded.functionName === "advancedPipe" && advancedPipeDecoded.args?.[0]) {
//           try {
//             const k = handleDecodeSowV0BlueprintFromAdvancedPipe(advancedPipeDecoded.args[0]);
//             console.log("k: ", k);
//           } catch (e) {
//             console.debug("Failed to decode as advancedPipe:", e);
//           }
//           return handleDecodeSowV0BlueprintFromAdvancedPipe(advancedPipeDecoded.args[0]);
//         }
//       } catch (error) {
//         console.debug("Failed to decode as advancedPipe:", error);
//       }
//     }
//   } catch (error) {
//     console.error("Failed to decode SowV0 Tractor Data:", error);
//   }
//   // If we get here, we didn't find a valid sow blueprint.
//   return null;
// }

// /**
//  * Finds the offset of the operator placeholder address in the encoded data
//  * Returns the offset where the placeholder slot begins
//  */
// export function findOperatorPlaceholderOffset(encodedData: `0x${string}`): number {
//   // Remove 0x prefix for easier searching
//   const data = encodedData.slice(2);

//   // The placeholder address without 0x prefix, padded to 32 bytes (64 hex chars)
//   const PLACEHOLDER = "0000000000000000000000004242424242424242424242424242424242424242";

//   // Search for the placeholder in the data
//   const index = data.toLowerCase().indexOf(PLACEHOLDER.toLowerCase());

//   if (index === -1) {
//     throw new Error("Operator placeholder not found in encoded data");
//   }
//   return index / 2; // Convert from hex characters to bytes
// }

// // ────────────────────────────────────────────────────────────────────────────────
// // Fetch Tractor Events
// // ────────────────────────────────────────────────────────────────────────────────

// export async function fetchTractorEvents(
//   publicClient: PublicClient,
//   protocolAddress: `0x${string}`,
//   blockFrom?: bigint,
// ) {
//   const fromBlock = blockFrom ?? TRACTOR_DEPLOYMENT_BLOCK;
//   const sharedArgs = {
//     address: protocolAddress,
//     abi: diamondABI,
//     fromBlock,
//     toBlock: "latest",
//   } as const;

//   // Get published requisitions & cancelled blueprints
//   const [publishEvents, cancelEvents] = await Promise.all([
//     publicClient.getContractEvents({ eventName: "PublishRequisition", ...sharedArgs }),
//     publicClient.getContractEvents({ eventName: "CancelBlueprint", ...sharedArgs }),
//   ]);

//   // Create a set of cancelled blueprint hashes
//   const cancelledHashes = new Set(
//     cancelEvents
//       .map((event) => event.args?.blueprintHash)
//       .filter((hash): hash is NonNullable<typeof hash> => hash !== undefined),
//   );

//   return { publishEvents, cancelledHashes };
// }

// // ────────────────────────────────────────────────────────────────────────────────
// // Requisitions
// // ────────────────────────────────────────────────────────────────────────────────

// // First, export the requisition type as a standalone type for reuse
// export type { RequisitionType } from "./shared/interfaces";

// type SelectRequisitionTypeArgs = {
//   latestBlock: MinimumViableBlock<bigint>;
//   data: Awaited<ReturnType<typeof fetchTractorEvents>>;
// };

// export const getSelectRequisitionType = (requisitionsType: MayArray<RequisitionType> | undefined, address?: string) => {
//   return (args: SelectRequisitionTypeArgs | undefined) => {
//     if (!args) return undefined;

//     const requisitionsSet = requisitionsType && new Set<RequisitionType>(arrayify(requisitionsType));

//     const {
//       data: { publishEvents, cancelledHashes },
//       latestBlock,
//     } = args;

//     const latestTimestamp = Number(latestBlock.timestamp);
//     const latestBlockNumber = Number(latestBlock.number);

//     const filteredEvents = publishEvents
//       .map((event) => {
//         const requisition = event.args?.requisition as RequisitionData;
//         if (!requisition?.blueprint || !requisition?.blueprintHash || !requisition?.signature) return null;

//         // Only filter by address if one is provided
//         if (address && !stringEq(requisition.blueprint.publisher, address)) {
//           return null;
//         }

//         let eventRequisitionType: RequisitionType = "unknown";
//         // Try to decode the data
//         const decodedData = decodeSowTractorData(requisition.blueprint.data);
//         if (decodedData) {
//           eventRequisitionType = "sowBlueprintv0";
//         }

//         // Filter by requisition type if provided
//         if (requisitionsSet?.size && !requisitionsSet.has(eventRequisitionType)) {
//           return null;
//         }

//         // Calculate timestamp if we have the latest block info
//         let timestamp: number | undefined = undefined;
//         if (latestBlock) {
//           // Convert all BigInt values to Number before arithmetic operations
//           const eventBlockNumber = Number(event.blockNumber);

//           // Calculate timestamp (approximately 2 seconds per block)
//           timestamp = latestTimestamp * 1000 - (latestBlockNumber - eventBlockNumber) * 2000;
//         }

//         return {
//           requisition,
//           blockNumber: Number(event.blockNumber),
//           timestamp,
//           isCancelled: cancelledHashes.has(requisition.blueprintHash),
//           requisitionType: eventRequisitionType,
//           decodedData,
//         } as RequisitionEvent;
//       })
//       .filter((event): event is NonNullable<typeof event> => event !== null);

//     return filteredEvents;
//   };
// };

// export async function loadPublishedRequisitions(
//   address: string | undefined,
//   protocolAddress: `0x${string}` | undefined,
//   publicClient: PublicClient | null,
//   latestBlock?: { number: bigint; timestamp: bigint } | null,
//   requisitionType?: MayArray<RequisitionType>, // Add requisition type filter
//   fromBlock?: bigint,
// ) {
//   if (!protocolAddress || !publicClient) return [];

//   try {
//     const data = await fetchTractorEvents(publicClient, protocolAddress, fromBlock);
//     const selectRequisitionType = getSelectRequisitionType(requisitionType, address);
//     return selectRequisitionType({
//       latestBlock: { number: latestBlock?.number ?? 0n, timestamp: latestBlock?.timestamp ?? 0n },
//       data,
//     });
//   } catch (error) {
//     console.error("Error loading published requisitions:", error);
//     throw new Error("Failed to load published requisitions");
//   }
// }

// /**
//  * Parses the paste instructions from the requisition, returns fields with descriptions and types
//  */
// export function parsePasteInstructions(requisition: RequisitionEvent): PasteInstructions | null {
//   try {
//     // Try to decode as advancedFarm first
//     let calls: { callData: `0x${string}`; clipboard: `0x${string}` }[] | undefined;

//     try {
//       const decoded = decodeFunctionData({
//         abi: beanstalkAbi,
//         data: requisition.requisition.blueprint.data,
//       });

//       if (decoded.functionName === "advancedFarm") {
//         calls = decoded.args?.[0] as { callData: `0x${string}`; clipboard: `0x${string}` }[] | undefined;
//       }
//     } catch (error) {
//       console.debug("Not an advancedFarm call, trying direct approach:", error);
//       // Not an advancedFarm call, will try the original approach next
//     }

//     // If we couldn't decode as advancedFarm or didn't find the calls
//     if (!calls) {
//       // Try the original approach - assume it's a direct call
//       calls = [
//         {
//           callData: requisition.requisition.blueprint.data,
//           clipboard: "0x" as `0x${string}`,
//         },
//       ];
//     }

//     if (!calls || calls.length === 0) {
//       console.error("No calls found in blueprint data");
//       return null;
//     }

//     const fields: PasteField[] = [];
//     if (requisition.requisitionType === "sowBlueprintv0") {
//       fields.push({ name: "Operator Address", type: "address" });
//     }

//     return {
//       fields,
//       calls: calls.map((call) => ({
//         callData: call.callData,
//         clipboard: call.clipboard,
//       })),
//       operatorPasteInstrs: requisition.requisition.blueprint.operatorPasteInstrs,
//     };
//   } catch (error) {
//     console.error("Failed to decode paste instructions:", error);
//     return null;
//   }
// }

// /**
//  * Generates operator data by padding and concatenating field values
//  */
// export function generateOperatorData(fields: PasteField[], values: string[]): `0x${string}` {
//   try {
//     if (fields.length !== values.length) {
//       throw new Error(`Expected ${fields.length} values but got ${values.length}`);
//     }

//     // For each field, pad the value to 32 bytes
//     const paddedValues = fields.map((field, index) => {
//       const value = values[index];
//       if (!value) throw new Error(`Missing value for field: ${field.name}`);

//       if (field.type === "address") {
//         // Remove 0x prefix if present and pad to 32 bytes (64 hex chars)
//         const cleanAddr = value.toLowerCase().replace("0x", "");
//         return cleanAddr.padStart(64, "0");
//       }
//       // Add other field types here as needed
//       throw new Error(`Unsupported field type: ${field.type}`);
//     });

//     // Concatenate all padded values
//     const operatorData = `0x${paddedValues.join("")}`;
//     return operatorData as `0x${string}`;
//   } catch (error) {
//     console.error("Failed to generate operator data:", error);
//     throw error;
//   }
// }

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

// /**
//  * Prepare a requisition event for a transaction by normalizing the blueprint data.
//  * - Fix timestamp values for transaction
//  * - Filter out invalid operator paste instructions
//  * @param req - The requisition event to prepare
//  * @returns The prepared requisition event
//  */
// export const prepareSowOrderV0RequisitionEventForTxn = (req: RequisitionEvent) => {
//   const normalizeEndTime = (endTime: bigint) => {
//     if (endTime === 8640000000000n) {
//       // max uint256
//       return BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");
//     }
//     return endTime;
//   };

//   return {
//     ...req.requisition,
//     blueprint: {
//       ...req.requisition.blueprint,
//       startTime: req.requisition.blueprint.startTime,
//       endTime: normalizeEndTime(req.requisition.blueprint.endTime),
//       operatorPasteInstrs: req.requisition.blueprint.operatorPasteInstrs.filter(
//         (instr) => instr !== "0x" && instr !== ("" as `0x${string}`),
//       ),
//     },
//   };
// };

// // Re-export functions from shared modules for backwards compatibility
// export {
//   getSowBlueprintDisplayData,
//   type RequisitionEvent,
//   type OrderbookEntry,
//   type SowBlueprintData,
//   type PublisherTractorExecution,
// } from "./shared/interfaces";
// export { TRACTOR_DEPLOYMENT_BLOCK } from "./core/constants";
// export {
//   getTokenIndexesFromTractorTokenStrategy,
//   getSowOrderTokenStrategy,
//   extractAddressesFromTokenStrategy,
//   getTractorTokenStrategySummary,
//   isDynamicTractorTokenStrategy,
//   getTractorOrderTokenStrategyFromIndicies,
//   isTractorTokenStrategy,
//   tractorTokenStrategyUtil,
//   getTokenIndex,
// } from "./core/token-strategy";
// export { encodeTractorAndOptimizeDeposits } from "./core/encoding";
// export { loadOrderbookData } from "./sow-tractor-utils";
