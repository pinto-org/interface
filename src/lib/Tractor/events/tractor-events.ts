import { diamondABI } from "@/constants/abi/diamondABI";
import { RequisitionType, TRACTOR_DEPLOYMENT_BLOCK, TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE } from "@/lib/Tractor/core";
import { MinimumViableBlock } from "@/utils/types";
import { MayArray } from "@/utils/types.generic";
import { arrayify } from "@/utils/utils";
import { PublicClient } from "viem";

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

export async function fetchPublisherTractorExecutioEvents(
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
    : TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE.convertUpBlueprint;

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

      blockNumbers.add(receipt.blockNumber);
    }),
  );
}
