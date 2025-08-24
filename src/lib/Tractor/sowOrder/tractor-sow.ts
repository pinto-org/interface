import { TokenValue } from "@/classes/TokenValue";
import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";
import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import { diamondABI } from "@/constants/abi/diamondABI";
import { SOW_BLUEPRINT_V0_ADDRESS, TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { PODS } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { beanstalkAbi } from "@/generated/contractHooks";
import { TRACTOR_DEPLOYMENT_BLOCK } from "@/lib/Tractor/core/constants";
import { getTokenIndexesFromTractorTokenStrategy } from "@/lib/Tractor/core/token-strategy";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { TEMPERATURE_DECIMALS } from "@/state/protocol/field";
import { getChainConstant, resolveChainId } from "@/utils/chain";
import { sanitizeNumericInputValue } from "@/utils/string";
import { AdvancedPipeCall, FarmFromMode, MinimumViableBlock, Token, TokenDepositData } from "@/utils/types";
import { PublicClient, decodeEventLog, decodeFunctionData, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { generateBatchSortDepositsCallData } from "../../claim/depositUtils";
import { CreateTractorDataReturnType, WithdrawalPlan } from "../core";
import { loadPublishedRequisitions } from "../requisitions/tractor-requisition";
import { OrderbookEntry, SowBlueprintData, SowBlueprintDisplayData, TractorSowOrderParams } from "./tractor-sow-types";

// ────────────────────────────────────────────────────────────────────────────────
// CREATE ORDER
// ────────────────────────────────────────────────────────────────────────────────

// Add a helper function to convert SowBlueprintData to display data
export function getSowBlueprintDisplayData(data: SowBlueprintData): SowBlueprintDisplayData {
  return {
    totalAmount: data.sowAmounts.totalAmountToSowAsString,
    minAmount: data.sowAmounts.minAmountToSowPerSeasonAsString,
    maxAmount: data.sowAmounts.maxAmountToSowPerSeasonAsString,
    minTemp: data.minTempAsString,
    maxPodlineLength: data.maxPodlineLengthAsString,
    maxGrownStalkPerBdv: data.maxGrownStalkPerBdvAsString,
    runBlocksAfterSunrise: data.runBlocksAfterSunriseAsString,
    slippageRatio: data.slippageRatioAsString,
    operatorTip: data.operatorParams.operatorTipAmountAsString,
    whitelistedOperators: data.operatorParams.whitelistedOperators,
    tipAddress: data.operatorParams.tipAddress,
  };
}

/**
 * Creates blueprint data from Tractor inputs
 */
export async function createSowTractorData({
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
  publicClient, // Add this parameter
  farmerDeposits,
  userAddress,
  protocolAddress,
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
  tokenStrategy: TractorTokenStrategy;
  publicClient: PublicClient;
  farmerDeposits?: Map<Token, TokenDepositData>;
  userAddress?: `0x${string}`;
  protocolAddress?: `0x${string}`;
}): Promise<CreateTractorDataReturnType> {
  // Add more detailed debug logs
  console.debug("tokenStrategy received:", tokenStrategy);
  console.debug("tokenStrategy.type:", tokenStrategy.type);
  console.debug(
    "tokenStrategy.address:",
    tokenStrategy.type === "SPECIFIC_TOKEN" ? tokenStrategy.addresses?.[0] : "N/A",
  );

  // Convert inputs to appropriate types
  const totalAmount = sanitizeNumericInputValue(totalAmountToSow, 6).tv.toBigInt();
  const minAmount = sanitizeNumericInputValue(minAmountPerSeason, 6).tv.toBigInt();
  const maxAmount = sanitizeNumericInputValue(maxAmountToSowPerSeason, 6).tv.toBigInt();

  // Fix for maxPodlineLength - convert to a full number without truncation
  // Remove commas, parse as float, multiply by 1e6 to get the raw value without truncation
  const maxPodlineBigInt = sanitizeNumericInputValue(maxPodlineLength, 6).tv.toBigInt();
  const maxGrownStalk = sanitizeNumericInputValue(maxGrownStalkPerBdv, 6).tv.toBigInt();
  const runBlocks = BigInt(runBlocksAfterSunrise); // Direct block number value
  const temp = sanitizeNumericInputValue(temperature, 6).tv.toBigInt();
  const tip = sanitizeNumericInputValue(operatorTip, 6).tv.toBigInt();

  // Get source token indices based on strategy
  let sourceTokenIndices: number[];
  if (tokenStrategy.type === "LOWEST_SEEDS") {
    console.debug("Using LOWEST_SEEDS strategy");
    sourceTokenIndices = [255];
  } else if (tokenStrategy.type === "LOWEST_PRICE") {
    console.debug("Using LOWEST_PRICE strategy");
    sourceTokenIndices = [254];
  } else if (tokenStrategy.type === "SPECIFIC_TOKEN") {
    console.debug("Using SPECIFIC_TOKEN strategy with address:", tokenStrategy.addresses?.[0]);
    const indexes = await getTokenIndexesFromTractorTokenStrategy(publicClient, tokenStrategy);
    console.debug("Got token index:", indexes);
    sourceTokenIndices = indexes;
  } else {
    console.debug("Unknown strategy type:", tokenStrategy);
    sourceTokenIndices = [];
  }

  // Log the final indices
  console.debug("Final sourceTokenIndices:", sourceTokenIndices);

  // Create the SowBlueprintStruct
  const sowBlueprintStruct = {
    sowParams: {
      sourceTokenIndices,
      sowAmounts: {
        totalAmountToSow: totalAmount,
        minAmountToSowPerSeason: minAmount,
        maxAmountToSowPerSeason: maxAmount,
      },
      minTemp: temp,
      maxPodlineLength: maxPodlineBigInt,
      maxGrownStalkPerBdv: maxGrownStalk,
      runBlocksAfterSunrise: runBlocks,
      slippageRatio: BigInt(1e18),
    },
    opParams: {
      whitelistedOperators: whitelistedOperators as readonly `0x${string}`[],
      tipAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      operatorTipAmount: tip,
    },
  };

  console.debug("Struct before encoding:", {
    sowParams: {
      sourceTokenIndices: sowBlueprintStruct.sowParams.sourceTokenIndices,
      sowAmounts: {
        totalAmountToSow: sowBlueprintStruct.sowParams.sowAmounts.totalAmountToSow.toString(),
        minAmountToSowPerSeason: sowBlueprintStruct.sowParams.sowAmounts.minAmountToSowPerSeason.toString(),
        maxAmountToSowPerSeason: sowBlueprintStruct.sowParams.sowAmounts.maxAmountToSowPerSeason.toString(),
      },
      minTemp: sowBlueprintStruct.sowParams.minTemp.toString(),
      maxPodlineLength: sowBlueprintStruct.sowParams.maxPodlineLength.toString(),
      maxGrownStalkPerBdv: sowBlueprintStruct.sowParams.maxGrownStalkPerBdv.toString(),
      runBlocksAfterSunrise: sowBlueprintStruct.sowParams.runBlocksAfterSunrise.toString(),
    },
    opParams: {
      whitelistedOperators: sowBlueprintStruct.opParams.whitelistedOperators,
      tipAddress: sowBlueprintStruct.opParams.tipAddress,
      operatorTipAmount: sowBlueprintStruct.opParams.operatorTipAmount.toString(),
    },
  });

  // Encode the raw sowBlueprintv0 call
  const sowBlueprintCall = encodeFunctionData({
    abi: sowBlueprintv0ABI,
    functionName: "sowBlueprintv0",
    args: [sowBlueprintStruct],
  });

  // Step 1: Wrap the sowBlueprintv0 call in an advancedPipe call
  const pipeCall = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "advancedPipe",
    args: [
      [
        {
          target: SOW_BLUEPRINT_V0_ADDRESS, // Use the constant directly
          callData: sowBlueprintCall,
          clipboard: "0x0000" as `0x${string}`, // Minimal clipboard data
        },
      ],
      0n, // outputIndex parameter as BigInt
    ],
  });

  const advFarmCall = encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "advancedFarm",
    args: [
      [
        {
          callData: pipeCall,
          clipboard: "0x" as `0x${string}`, // Empty clipboard
        },
      ],
    ],
  });

  // Step 3: Generate deposit optimization calls separately (for the user transaction)
  let depositOptimizationCalls: `0x${string}`[] | undefined;

  if (farmerDeposits && userAddress && protocolAddress) {
    console.debug("Generating deposit optimization calls for user transaction");

    try {
      depositOptimizationCalls = await generateBatchSortDepositsCallData(
        userAddress,
        farmerDeposits,
        publicClient,
        protocolAddress,
      );

      console.debug(`Generated ${depositOptimizationCalls.length} deposit optimization calls for user transaction`);
    } catch (error) {
      console.warn("Failed to generate deposit optimization calls:", error);
      // Continue without optimization calls - don't fail the entire transaction
    }
  }

  console.debug("Raw sowBlueprintv0 call:", sowBlueprintCall);
  console.debug("advancedPipe call:", pipeCall);
  console.debug("Final blueprint data:", advFarmCall);

  return {
    data: advFarmCall,
    operatorPasteInstrs: [], // TODO: Update if needed
    rawCall: sowBlueprintCall, // Return the raw call data
    depositOptimizationCalls, // Return optimization calls for user transaction
  };
}

export function handleDecodeSowV0BlueprintFromAdvancedPipe(
  calls: readonly AdvancedPipeCall[] | undefined,
  chainId: number,
): SowBlueprintData | null {
  if (!calls?.length) {
    console.debug("[Tractor/handleDecodeBlueprintFromAdvancedPipe] No calls provided. Returning null.");
    return null;
  }

  const sowBlueprintData = calls[0].callData;

  try {
    const sowDecoded = decodeFunctionData({
      abi: sowBlueprintv0ABI,
      data: sowBlueprintData,
    });

    const params = sowDecoded.args?.[0];

    return transformSowRequisitionEvent(params, chainId);
  } catch (error) {
    console.error("Failed to decode sowBlueprintv0 data:", error);
  }

  return null;
}

/**
 * Decodes sow data from encoded function call
 */
export function decodeSowTractorData(encodedData: `0x${string}`, chainId: number = base.id): SowBlueprintData | null {
  try {
    // Step 1: Attempt to decode.
    const calls = decodeFunctionData({
      abi: beanstalkAbi,
      data: encodedData,
    });

    // Valid tractor orders are encoded as advancedFarm(advancedPipe(callData))
    // Step 2: If the encoded data is an advancedFarm call, decode again.
    if (calls.functionName === "advancedFarm" && calls.args[0]) {
      const farmCalls = calls.args[0];

      if (!farmCalls.length) {
        console.debug("[Tractor/decodeSowTractorData] No farm calls provided. Returning null.");
        return null;
      }
      // Step 3: Try to decode the inner call as advancedPipe
      try {
        const pipeCallData = farmCalls[0].callData;
        const advancedPipeDecoded = decodeFunctionData({
          abi: beanstalkAbi,
          data: pipeCallData,
        });

        if (advancedPipeDecoded.functionName === "advancedPipe" && advancedPipeDecoded.args?.[0]) {
          return handleDecodeSowV0BlueprintFromAdvancedPipe(advancedPipeDecoded.args[0], chainId);
        }
      } catch (error) {
        console.debug("Failed to decode as advancedPipe:", error);
      }
    }
  } catch (error) {
    console.error("Failed to decode SowV0 Tractor Data:", error);
  }
  // If we get here, we didn't find a valid sow blueprint.
  return null;
}

export function transformSowRequisitionEvent(params: unknown | null, chainId: number) {
  try {
    if (!shallowCheckIsSowParams(params)) {
      console.debug("[Tractor/transformSowRequisitionEvent] Invalid parameters");
      return null;
    }

    const { sowParams: sp, opParams: op } = params;

    return {
      sourceTokenIndices: sp.sourceTokenIndices,
      sowAmounts: {
        totalAmountToSow: sp.sowAmounts.totalAmountToSow,
        totalAmountToSowAsString: TokenValue.fromBlockchain(sp.sowAmounts.totalAmountToSow, 6).toHuman(),
        minAmountToSowPerSeason: sp.sowAmounts.minAmountToSowPerSeason,
        minAmountToSowPerSeasonAsString: TokenValue.fromBlockchain(sp.sowAmounts.minAmountToSowPerSeason, 6).toHuman(),
        maxAmountToSowPerSeason: sp.sowAmounts.maxAmountToSowPerSeason,
        maxAmountToSowPerSeasonAsString: TokenValue.fromBlockchain(sp.sowAmounts.maxAmountToSowPerSeason, 6).toHuman(),
      },
      minTemp: sp.minTemp,
      minTempAsString: TokenValue.fromBlockchain(sp.minTemp, 6).toHuman(),
      maxPodlineLength: sp.maxPodlineLength,
      maxPodlineLengthAsString: TokenValue.fromBlockchain(sp.maxPodlineLength, 6).toHuman(),
      maxGrownStalkPerBdv: sp.maxGrownStalkPerBdv,
      maxGrownStalkPerBdvAsString: TokenValue.fromBlockchain(sp.maxGrownStalkPerBdv, 6).toHuman(),
      runBlocksAfterSunrise: sp.runBlocksAfterSunrise,
      runBlocksAfterSunriseAsString: sp.runBlocksAfterSunrise.toString(),
      slippageRatio: sp.slippageRatio,
      slippageRatioAsString: TokenValue.fromBlockchain(sp.slippageRatio, 18).toHuman(),
      operatorParams: {
        whitelistedOperators: op.whitelistedOperators,
        tipAddress: op.tipAddress,
        operatorTipAmount: op.operatorTipAmount,
        operatorTipAmountAsString: TokenValue.fromBlockchain(op.operatorTipAmount, 6).toHuman(),
      },
      fromMode: FarmFromMode.INTERNAL,
    };
  } catch (e) {
    console.debug("[Tractor/transformSowRequisitionEvent] Failed to transform sowParams:", e);
  }

  return null;
}

// ────────────────────────────────────────────────────────────────────────────────
// FETCH ORDERS
// ────────────────────────────────────────────────────────────────────────────────

export interface LoadOrderbookDataOptions {
  filterOutCompleted?: boolean;
}

export async function loadOrderbookData(
  address: string | undefined,
  protocolAddress: `0x${string}` | undefined,
  publicClient: PublicClient | null,
  latestBlock?: { number: bigint; timestamp: bigint } | null,
  maxTemperature?: number,
  activeApiEntries?: OrderbookEntry[],
  lookbackBlocks?: bigint,
  options?: LoadOrderbookDataOptions,
): Promise<OrderbookEntry[]> {
  if (!protocolAddress || !publicClient) return [];

  const loadOptions: Required<LoadOrderbookDataOptions> = { filterOutCompleted: true, ...options };

  const knownBlueprintHashes = new Set<string>(
    activeApiEntries?.map((order) => order.requisition.blueprintHash.toLowerCase()) ?? [],
  );

  const fromBlock =
    lookbackBlocks && latestBlock?.number ? latestBlock.number - lookbackBlocks : TRACTOR_DEPLOYMENT_BLOCK;

  try {
    // First, get the current pod line from the protocol
    let currentPodLine = TokenValue.ZERO;

    // Fetch SowOrderComplete events to identify completed orders
    console.debug("[TRACTOR/loadOrderbookData] Fetching...");

    const [podIndexResult, harvestableIndexResult, sowOrderCompleteEvents, _requisitions] = await Promise.all([
      publicClient.readContract({ address: protocolAddress, abi: diamondABI, args: [0n], functionName: "podIndex" }),
      publicClient.readContract({
        address: protocolAddress,
        abi: diamondABI,
        args: [0n],
        functionName: "harvestableIndex",
      }),
      publicClient.getContractEvents({
        address: SOW_BLUEPRINT_V0_ADDRESS,
        abi: sowBlueprintv0ABI,
        eventName: "SowOrderComplete",
        fromBlock: fromBlock,
        toBlock: "latest",
      }),
      loadPublishedRequisitions(address, protocolAddress, publicClient, latestBlock, "sowBlueprintv0", fromBlock),
    ]);

    const requisitions = _requisitions?.sowBlueprintV0 ?? [];

    if (podIndexResult && harvestableIndexResult) {
      // Pod line is podIndex - harvestableIndex
      currentPodLine = TokenValue.fromBlockchain(podIndexResult - harvestableIndexResult, 6);
    } else {
      console.error("[TRACTOR/loadOrderbookData] Failed to get current pod line");
      // Continue with zero if we can't get the current pod line
    }

    // Create a set of completed blueprint hashes
    const completedOrders = new Set<`0x${string}`>(
      loadOptions.filterOutCompleted
        ? sowOrderCompleteEvents
            .map((event) => event.args?.blueprintHash)
            .filter((hash): hash is `0x${string}` => hash !== undefined)
        : [],
    );

    // Filter out cancelled and completed orders
    const activeRequisitions = requisitions.filter((req) => {
      const hash = req.requisition.blueprintHash;
      if (knownBlueprintHashes.has(hash.toLowerCase())) {
        return false;
      }
      return !req.isCancelled && !completedOrders.has(req.requisition.blueprintHash);
    });

    // Decode data and sort requisitions by temperature (lowest first)
    const requisitionsWithTemperature = activeRequisitions.map((requisition) => {
      const decodedData = decodeSowTractorData(requisition.requisition.blueprint.data);
      return {
        requisition,
        temperature: decodedData?.minTemp || 0n,
        decodedData,
      };
    });

    // Sort requisitions by temperature
    requisitionsWithTemperature.sort((a, b) => Number(a.temperature - b.temperature));

    console.debug("[TRACTOR/loadOrderbookData] initial fetch results: ", {
      raw: {
        podIndexResult,
        harvestableIndexResult,
        completedOrders,
        activeRequisitions,
        requisitionsWithTemperature,
      },
      currentPodLine: currentPodLine.toHuman(),
      activeRequisitions: activeRequisitions?.length,
      completedOrders: completedOrders.size,
    });

    // Track used withdrawal plans per publisher for allocation priority
    const publisherWithdrawalPlans: { [publisher: string]: any[] } = {};

    // Process requisitions in a single loop (already sorted by temperature)
    const orderbookData: OrderbookEntry[] = (activeApiEntries ?? []).filter((entry) => {
      if (!!loadOptions.filterOutCompleted && entry.isComplete) return false;
      return true;
    });

    console.debug("\nProcessing orderbook data:");

    for (let i = 0; i < requisitionsWithTemperature.length; i++) {
      const { requisition, decodedData } = requisitionsWithTemperature[i];
      const publisher = requisition.requisition.blueprint.publisher;

      console.debug(`\n--- Processing Order #${i + 1} ---`);
      if (decodedData) {
        console.debug(`Temperature: ${decodedData.minTempAsString}%`);
      }
      console.debug(`Publisher: ${publisher}`);

      try {
        // Get pintos left to sow
        const pintosLeft = await publicClient.readContract({
          address: SOW_BLUEPRINT_V0_ADDRESS,
          abi: sowBlueprintv0ABI,
          functionName: "getPintosLeftToSow",
          args: [requisition.requisition.blueprintHash],
        });

        // If pintosLeft is zero, this means the storage slot hasn't been initialized yet
        const finalPintosLeft =
          pintosLeft === 0n && decodedData
            ? TokenValue.fromBlockchain(decodedData.sowAmounts.totalAmountToSow, 6)
            : TokenValue.fromBlockchain(pintosLeft, 6);

        console.debug(`Pintos Left to Sow: ${finalPintosLeft.toHuman()}`);

        // Handle withdrawal plan calculation with temperature priority
        let withdrawalPlan: WithdrawalPlan | null = null;
        let totalAvailablePinto = TokenValue.ZERO;

        if (decodedData) {
          // Get existing withdrawal plans for this publisher
          const existingPlans = publisherWithdrawalPlans[publisher] || [];
          console.debug("Existing plans for publisher:", existingPlans.length);

          let combinedExistingPlan = null;

          // If we have existing plans, combine them
          if (existingPlans.length > 0) {
            try {
              // Combine all existing withdrawal plans for this publisher
              const combinedPlan = (await publicClient.readContract({
                address: TRACTOR_HELPERS_ADDRESS,
                abi: tractorHelpersABI,
                functionName: "combineWithdrawalPlans",
                args: [existingPlans],
              })) as any;

              combinedExistingPlan = combinedPlan;

              console.debug("Combined existing plans for publisher:", publisher);
              console.debug(
                "Total available PINTO in combined plan:",
                TokenValue.fromBlockchain(combinedPlan.totalAvailableBeans, 6).toHuman(),
              );
            } catch (error) {
              console.error("Failed to combine withdrawal plans:", error);
              combinedExistingPlan = null;
            }
          }

          // Get a new withdrawal plan that excludes deposits already allocated to other orders
          try {
            const emptyPlan = {
              sourceTokens: [] as readonly `0x${string}`[],
              stems: [] as readonly (readonly bigint[])[],
              amounts: [] as readonly (readonly bigint[])[],
              availableBeans: [] as readonly bigint[],
              totalAvailableBeans: 0n,
            };

            withdrawalPlan = await publicClient.readContract({
              address: TRACTOR_HELPERS_ADDRESS,
              abi: tractorHelpersABI,
              functionName: "getWithdrawalPlanExcludingPlan",
              args: [
                publisher,
                decodedData.sourceTokenIndices,
                decodedData.sowAmounts.totalAmountToSow,
                decodedData.maxGrownStalkPerBdv,
                combinedExistingPlan || emptyPlan,
              ],
            });

            console.debug("Got updated withdrawal plan excluding existing orders");
            totalAvailablePinto = TokenValue.fromBlockchain(withdrawalPlan.totalAvailableBeans, 6);

            // Add this plan to the list of existing plans for future orders
            if (withdrawalPlan.sourceTokens.length > 0) {
              if (!publisherWithdrawalPlans[publisher]) {
                publisherWithdrawalPlans[publisher] = [];
              }
              publisherWithdrawalPlans[publisher].push(withdrawalPlan);
            }
          } catch (error) {
            // console.error("Failed to get updated withdrawal plan:", error);
            // If the error is "No beans available", set the plan to empty
            if (error instanceof Error && error.message?.includes("No beans available")) {
              console.debug("No beans available for this order, setting available PINTO to 0");
              withdrawalPlan = {
                sourceTokens: [] as readonly `0x${string}`[],
                stems: [] as readonly (readonly bigint[])[],
                amounts: [] as readonly (readonly bigint[])[],
                availableBeans: [] as readonly bigint[],
                totalAvailableBeans: 0n,
              };
              totalAvailablePinto = TokenValue.ZERO;
            }
          }
        }

        // Calculate how much PINTO this order can use
        const currentlySowable = TokenValue.min(finalPintosLeft, totalAvailablePinto);
        console.debug(`Total available PINTO: ${totalAvailablePinto.toHuman()}`);
        console.debug(`Currently sowable: ${currentlySowable.toHuman()}`);

        // Calculate amountSowableNextSeason as the greater of currentlySowable and minAmountToSowPerSeason
        let amountSowableNextSeason = currentlySowable;
        if (decodedData && decodedData.sowAmounts.maxAmountToSowPerSeason) {
          const maxAmountToSowPerSeason = TokenValue.fromBlockchain(decodedData.sowAmounts.maxAmountToSowPerSeason, 6);
          amountSowableNextSeason = TokenValue.min(currentlySowable, maxAmountToSowPerSeason);
          console.debug(`Min amount to sow per season: ${maxAmountToSowPerSeason.toHuman()}`);
          console.debug(`Amount sowable next season: ${amountSowableNextSeason.toHuman()}`);
        }

        if (!withdrawalPlan) {
          throw new Error("Failed to get withdrawal plan");
        }

        orderbookData.push({
          ...requisition,
          pintosLeftToSow: finalPintosLeft,
          totalAvailablePinto,
          currentlySowable,
          amountSowableNextSeason,
          amountSowableNextSeasonConsideringAvailableSoil: TokenValue.ZERO, // Initialize to zero, will be set in second pass
          estimatedPlaceInLine: TokenValue.ZERO, // Initialize to zero, will be set in second pass
          minTemp: TokenValue.fromBigInt(decodedData?.minTemp || 0n, TEMPERATURE_DECIMALS),
          withdrawalPlan,
        });
      } catch (error) {
        console.error(`Failed to get data for requisition ${requisition.requisition.blueprintHash}:`, error);
        orderbookData.push({
          ...requisition,
          pintosLeftToSow: TokenValue.ZERO,
          totalAvailablePinto: TokenValue.ZERO,
          currentlySowable: TokenValue.ZERO,
          amountSowableNextSeason: TokenValue.ZERO,
          amountSowableNextSeasonConsideringAvailableSoil: TokenValue.ZERO,
          estimatedPlaceInLine: TokenValue.fromBlockchain(0n, 6),
          minTemp: TokenValue.ZERO,
          withdrawalPlan: undefined,
        });
      }
    }

    // Running total of place in line, starting with current pod line
    let runningPlaceInLine = currentPodLine;

    orderbookData.sort((a, b) => a.minTemp.sub(b.minTemp).toNumber());

    for (let i = 0; i < orderbookData.length; i++) {
      const entry = orderbookData[i];
      // If this order will have some pods sown next season, update the running place in line
      // for future orders by adding this order's pod amount
      if (entry.amountSowableNextSeason.gt(0)) {
        entry.estimatedPlaceInLine = TokenValue.fromBlockchain(runningPlaceInLine.toBigInt(), PODS.decimals);
        const podsToMint = entry.amountSowableNextSeason.mul(entry.minTemp.add(1).div(100)).reDecimal(PODS.decimals);
        runningPlaceInLine = runningPlaceInLine.add(podsToMint);
      }
    }

    let availableSoil = TokenValue.ZERO;
    // Get the total amount of soil available from the protocol
    try {
      // Query for the most recent Soil event
      const soilEvents = await publicClient.getContractEvents({
        address: protocolAddress,
        abi: diamondABI,
        eventName: "Soil",
        fromBlock: TIME_TO_BLOCKS.month,
        toBlock: "latest",
      });

      // Get the most recent event (should be the last one)
      if (soilEvents.length > 0) {
        const latestSoilEvent = soilEvents[soilEvents.length - 1];
        const soilAmount = latestSoilEvent.args?.soil;

        if (soilAmount) {
          availableSoil = TokenValue.fromBlockchain(soilAmount, 6);
          console.debug(`\nCurrent soil from latest Soil event: ${availableSoil.toHuman()}`);
        }
      } else {
        console.debug(`No Soil events found, falling back to estimation`);
      }

      // If we couldn't get soil from events, fall back to estimate
      if (availableSoil.eq(0)) {
        availableSoil = orderbookData.reduce((total, entry) => total.add(entry.currentlySowable), TokenValue.ZERO);
        console.debug(`\nEstimated soil from orderbook data: ${availableSoil.toHuman()}`);
      }
    } catch (error) {
      console.error("Failed to get soil from on chain:", error);
      // Fall back to estimating soil as the sum of all currentlySowable values
      availableSoil = orderbookData.reduce((total, entry) => total.add(entry.currentlySowable), TokenValue.ZERO);
      console.debug(`\nFalling back to estimated soil: ${availableSoil.toHuman()}`);
    }

    // Sort orderbook entries by operator tip amount (highest first)
    const orderbookDataWithTips = orderbookData.map((entry) => {
      const decodedData = decodeSowTractorData(entry.requisition.blueprint.data);
      const tipAmount = decodedData?.operatorParams.operatorTipAmount || 0n;
      return {
        decodedData,
        entry,
        tipAmount,
      };
    });

    // Sort by tip amount (highest first)
    orderbookDataWithTips.sort((a, b) => Number(b.tipAmount - a.tipAmount));

    console.debug("\nAllocating available soil based on operator tip priority:");

    // Track remaining soil as we allocate it
    let remainingSoil = availableSoil;

    // Second pass: allocate soil based on tip priority
    for (let i = 0; i < orderbookDataWithTips.length; i++) {
      const { entry, tipAmount, decodedData } = orderbookDataWithTips[i];
      const tipAmountFormatted = TokenValue.fromBlockchain(tipAmount, 6).toHuman();
      const orderTemp = decodedData ? parseFloat(decodedData.minTempAsString) : 0;

      console.debug(
        `Order #${i + 1} - Tip: ${tipAmountFormatted}, Temp: ${orderTemp}%, Requested: ${entry.amountSowableNextSeason.toHuman()}`,
      );

      // Skip orders with temperature higher than the max temperature (if provided)
      if (maxTemperature !== undefined && orderTemp > maxTemperature) {
        console.debug(`  Temperature too high (max: ${maxTemperature}%), allocated: 0`);
        entry.amountSowableNextSeasonConsideringAvailableSoil = TokenValue.ZERO;
        continue;
      }

      // If no soil left, set to zero
      if (remainingSoil.lte(0)) {
        entry.amountSowableNextSeasonConsideringAvailableSoil = TokenValue.ZERO;
        console.debug(`  No soil remaining, allocated: 0`);
        continue;
      }

      // Calculate how much this order can sow considering available soil
      const allocatedAmount = TokenValue.min(entry.amountSowableNextSeason, remainingSoil);
      entry.amountSowableNextSeasonConsideringAvailableSoil = allocatedAmount;

      // Subtract from remaining soil
      remainingSoil = remainingSoil.sub(allocatedAmount);

      console.debug(`  Allocated: ${allocatedAmount.toHuman()}, Remaining soil: ${remainingSoil.toHuman()}`);
    }

    return orderbookData;
  } catch (error) {
    console.error("Error loading orderbook data:", error);
    throw new Error("Failed to load orderbook data");
  }
}

export function shallowCheckIsSowParams(data: unknown): data is TractorSowOrderParams {
  return typeof data === "object" && data !== null && "sowParams" in data && "opParams" in data;
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
            index: TokenValue.fromBigInt(decoded.args.index, PODS.decimals),
            beans: TokenValue.fromBigInt(decoded.args.beans, mainToken.decimals),
            pods: TokenValue.fromBigInt(decoded.args.pods, PODS.decimals),
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
