import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { PODS, STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { RequisitionType, TRACTOR_DEPLOYMENT_BLOCK, TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE } from "@/lib/Tractor/core";
import { getChainConstant } from "@/utils/chain";
import { getChainTokenMap, getTokenIndex } from "@/utils/token";
import { MinimumViableBlock, Token } from "@/utils/types";
import { MayArray } from "@/utils/types.generic";
import { arrayify } from "@/utils/utils";
import { PublicClient, decodeEventLog } from "viem";
import { TractorExecutionEventLog } from "./tractor-events.types";

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

export async function fetchPublisherTractorExecutionEvents(
  publicClient: PublicClient,
  protocolAddress: `0x${string}`,
  publisher: `0x${string}`,
  requisitionType: MayArray<RequisitionType>,
  latestBlock: MinimumViableBlock<bigint>,
  lookbackBlocks?: bigint,
) {
  const reqTypes = new Set(arrayify(requisitionType));

  const chainId = publicClient.chain?.id;
  if (!chainId) throw new Error("[Tractor/fetchTractorExecutions] No chain ID found");

  const defaultFromBlock = reqTypes.has("sowBlueprintv0")
    ? TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE.sowBlueprintv0
    : TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE.sowBlueprintv0;

  let fromBlock: bigint = defaultFromBlock;

  if (lookbackBlocks !== undefined) {
    const newFromBlock = latestBlock.number - lookbackBlocks;
    fromBlock = newFromBlock > defaultFromBlock ? newFromBlock : defaultFromBlock;
  }

  // Get Tractor events
  const tractorEvents = await publicClient.getContractEvents({
    address: protocolAddress,
    abi: diamondABI,
    eventName: "Tractor",
    args: {
      publisher: publisher,
    },
    fromBlock: fromBlock ?? defaultFromBlock,
    toBlock: "latest",
  });

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

      const mainToken = getChainConstant(chainId, MAIN_TOKEN);

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

      const tokenMap = getChainTokenMap(chainId);

      // Decode the Sow event if found
      let sowData: TractorExecutionEventLog<"Sow", TV>["args"] | undefined;
      let convertUpData: TractorExecutionEventLog<"Convert", TV, Token>["args"] | undefined;
      let bonusData: TractorExecutionEventLog<"ConvertUpBonus", TV>["args"] | undefined;

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
              sowData = {
                account: decoded.args.account,
                fieldId: decoded.args.fieldId,
                index: TV.fromBigInt(decoded.args.index, PODS.decimals),
                beans: TV.fromBigInt(decoded.args.beans, mainToken.decimals),
                pods: TV.fromBigInt(decoded.args.pods, PODS.decimals),
              };
              break;
            } else if (decoded.eventName === "Convert") {
              console.debug("[Tractor/fetchTractorExecutions] Skipping log:", {
                eventName: decoded.eventName,
                log,
              });

              const fromToken = tokenMap[getTokenIndex(decoded.args.fromToken)];
              const toToken = tokenMap[getTokenIndex(decoded.args.toToken)];

              convertUpData = {
                account: decoded.args.account,
                fromToken: fromToken,
                toToken: toToken,
                fromAmount: TV.fromBigInt(decoded.args.fromAmount, fromToken.decimals),
                toAmount: TV.fromBigInt(decoded.args.toAmount, toToken.decimals),
                fromBdv: TV.fromBigInt(decoded.args.fromBdv, mainToken.decimals),
                toBdv: TV.fromBigInt(decoded.args.toBdv, mainToken.decimals),
              };
            } else if (decoded.eventName === "ConvertUpBonus") {
              bonusData = {
                account: decoded.args.account,
                grownStalkGained: TV.fromBigInt(decoded.args.grownStalkGained, STALK.decimals),
                bdvCapacityUsed: TV.fromBigInt(decoded.args.bdvCapacityUsed, mainToken.decimals),
                bdvConverted: TV.fromBigInt(0n, mainToken.decimals),
                newGrownStalk: TV.fromBigInt(0n, STALK.decimals),
              };

              if ("newGrownStalk" in decoded.args) {
                bonusData.newGrownStalk = TV.fromBigInt(decoded.args.newGrownStalk, STALK.decimals);
              }
              if ("bdvConverted" in decoded.args) {
                bonusData.bdvConverted = TV.fromBigInt(decoded.args.bdvConverted, mainToken.decimals);
              }
            }

            if (convertUpData && bonusData) {
              break;
            }
          } catch {
            // Skip logs that can't be decoded
          }
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
        convertUpData,
        bonusData,
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
      convertUpEvent: result.convertUpData,
      bonusEvent: result.bonusData,
      tractorExecutionBeganEvent: result.tractorExecutionBeganEvent,
    };
  });

  console.debug("[Tractor/fetchTractorExecutions] RESPONSE", processed);
  return processed;
}
