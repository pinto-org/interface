import { TokenValue } from "@/classes/TokenValue";
import { DepositGroup } from "@/components/CombineSelect";
import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import { TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import convert from "@/encoders/silo/convert";
import { beanstalkAbi } from "@/generated/contractHooks";
import { calculateConvertData } from "@/utils/convert";
import { Token, TokenDepositData } from "@/utils/types";
import { DepositData } from "@/utils/types";
import { PublicClient, decodeAbiParameters, encodeFunctionData } from "viem";

// Constants for deposit management
const MIN_DEPOSITS_FOR_COMBINING = 25; // Minimum deposits to trigger combining logic
const MIN_DEPOSITS_FOR_ELIGIBILITY = 20; // Combine down to this many deposits
const PROCESS_SINGLE_TOKEN_ONLY_THRESHOLD = 200; // If a single token has more than this many deposits, process it alone
const LARGE_DEPOSITS_THRESHOLD = 100; // If a single token has more than this many deposits, process it along with not more than the next variable's worth of tokens at time
const MAX_TOKENS_WITH_LARGE_DEPOSITS = 3; // Maximum number of tokens to process when large deposits are present
const MAX_TOP_DEPOSITS = 10; // Maximum number of deposits to L2L update in regular Claim
const MIN_BDV_THRESHOLD = TokenValue.ONE; // Minimum BDV difference threshold for regular updates, this filters out "dust" updates that are not worth L2L'ing

/**
 * Determines if deposits need combining based on deposit counts
 * @param deposits Map of token to deposit data
 * @returns boolean indicating if any token has 25+ deposits
 */
export function needsCombining(deposits: Map<Token, TokenDepositData>): boolean {
  return Array.from(deposits.entries()).some(
    ([_, depositData]) => depositData.deposits.length >= MIN_DEPOSITS_FOR_COMBINING,
  );
}

/**
 * Generates smart conversion calls for updating deposits (L2L)
 * @param farmerDeposits Map of token to deposit data
 * @returns Array of encoded function calls
 */
export function generateCombineAndL2LCallData(farmerDeposits: Map<Token, TokenDepositData>): `0x${string}`[] {
  const tokenEntries = Array.from(farmerDeposits.entries());

  // The "only update top 10 deposits" stuff is getting commented out for now, since
  // We're reducing the total number of deposits to something managable that should be L2L-able every time,
  // But more importantly, we're trying to get Tractor out, we can come back to this and optimize when/if we print again.
  // if (!needsCombining(farmerDeposits)) {
  //   // If no tokens need combining, use the top deposits logic
  //   console.log(
  //     `No tokens need combining, processing top ${MAX_TOP_DEPOSITS} deposits by BDV difference (regular L2L update)`,
  //   );

  //   // Collect all eligible deposits into a flat array with their token info
  //   const allDeposits = tokenEntries.flatMap(([token, depositData]) =>
  //     depositData.deposits
  //       .filter((deposit) => {
  //         const bdvDiff = deposit.currentBdv.sub(deposit.depositBdv);
  //         const onePercent = deposit.depositBdv.mul(0.01);
  //         const minThreshold = TokenValue.min(onePercent, MIN_BDV_THRESHOLD);
  //         return bdvDiff.gt(minThreshold) && !deposit.isGerminating;
  //       })
  //       .map((deposit) => ({
  //         token,
  //         deposit,
  //         bdvDifference: deposit.currentBdv.sub(deposit.depositBdv),
  //       })),
  //   );

  //   // Sort by BDV difference and take top deposits
  //   const topDeposits = allDeposits
  //     .filter((deposit) => deposit.bdvDifference.gte(MIN_BDV_THRESHOLD))
  //     .sort((a, b) => (b.bdvDifference.gt(a.bdvDifference) ? 1 : -1))
  //     .slice(0, MAX_TOP_DEPOSITS);

  //   return topDeposits.map(({ token, deposit }) => {
  //     const convertData = calculateConvertData(token, token, deposit.amount, deposit.amount);
  //     if (!convertData) {
  //       throw new Error("Invalid convert data");
  //     }
  //     return encodeFunctionData({
  //       abi: beanstalkAbi,
  //       functionName: "convert",
  //       args: [convertData, [deposit.stem.toBigInt()], [deposit.amount.toBigInt()]],
  //     });
  //   });
  // }

  console.log(`Combining logic triggered (${MIN_DEPOSITS_FOR_COMBINING}+ deposits of a single token)`);

  // Check if any token has more than PROCESS_SINGLE_TOKEN_ONLY_THRESHOLD deposits
  /*  const highVolumeToken = tokenEntries.find(
      ([_, depositData]) => depositData.deposits.length >= PROCESS_SINGLE_TOKEN_ONLY_THRESHOLD,
    );
  
    if (highVolumeToken) {
      console.log("Processing single high-volume token:", {
        name: highVolumeToken[0].name,
        depositCount: highVolumeToken[1].deposits.length,
      });
      return encodeClaimRewardCombineCalls(highVolumeToken[1].deposits, highVolumeToken[0]);
    }
  */

  // Check if any token has more than LARGE_DEPOSITS_THRESHOLD deposits
  /*const hasLargeToken = tokenEntries.some(
    ([_, depositData]) => depositData.deposits.length >= LARGE_DEPOSITS_THRESHOLD,
  );

  const eligibleTokens = tokenEntries.filter(([_token, depositData]) => {
    const hasEnoughDeposits = depositData.deposits.length >= MIN_DEPOSITS_FOR_ELIGIBILITY;
    if (!hasEnoughDeposits) {
      console.log("Skipping token:", {
        name: _token.name,
        symbol: _token.symbol,
        depositCount: depositData.deposits.length,
      });
    }
    return hasEnoughDeposits;
  });

  if (hasLargeToken) {
    console.log(`Limiting to ${MAX_TOKENS_WITH_LARGE_DEPOSITS} tokens due to large deposit count`);
    return eligibleTokens
      .slice(0, MAX_TOKENS_WITH_LARGE_DEPOSITS)
      .flatMap(([token, depositData]) => encodeClaimRewardCombineCalls(depositData.deposits, token));
  }*/

  // The above logic had 3 cases:
  // 1. Process single high-volume token only
  // 2. Process large tokens only
  // 3. Process all tokens with large deposits

  // We're now just going to combine/sort all tokens, so that Tractor orders will work as expected.

  return tokenEntries.flatMap(([token, depositData]) => encodeClaimRewardCombineCalls(depositData.deposits, token));
}

/**
 * First decodes the outer farm call result, which is an array of results from each subcall
 * @param resultData The raw hex data from the farm call simulation result
 * @returns The array of results, with each item being the result of a subcall
 */
function decodeFarmCallResult(resultData: `0x${string}`): `0x${string}`[] | undefined {
  try {
    console.log("Decoding farm call result");
    // The farm call returns an array of bytes
    const decoded = decodeAbiParameters(
      [{ type: 'bytes[]' }],
      resultData
    );

    if (!decoded || !decoded[0] || !Array.isArray(decoded[0])) {
      console.error("Failed to decode farm call result");
      return undefined;
    }

    const results = decoded[0] as `0x${string}`[];
    console.log(`Successfully decoded farm call result with ${results.length} items`);

    return results;
  } catch (error) {
    console.error("Error decoding farm call result:", error);
    return undefined;
  }
}

/**
 * Decodes the raw result data from a getSortedDeposits simulation
 * @param resultData The raw hex data from the simulation result
 * @returns Object containing the decoded stems and amounts, or undefined if decoding fails
 */
function decodeSortedDepositsResult(
  resultData: `0x${string}` | undefined,
): { stems: bigint[]; amounts: bigint[] } | undefined {
  if (!resultData) return undefined;

  try {
    // Parse out the hex data without the 0x prefix
    const hexData = resultData.slice(2);

    // For the pipe function's response format:
    // The stem count is at position 256 (hex index) based on the debugging
    const stemCountPosition = 256;
    const stemCount = parseInt(hexData.slice(stemCountPosition, stemCountPosition + 64), 16);

    if (stemCount > 0 && stemCount < 1000) {
      // Sanity check on the count
      console.log(`Decoding ${stemCount} sorted deposits`);

      // Start position for stem array elements (after the length field)
      const stemStartPos = stemCountPosition + 64;
      const stems: bigint[] = [];
      const amounts: bigint[] = [];

      // Extract stems
      for (let i = 0; i < stemCount; i++) {
        const stemHex = hexData.slice(stemStartPos + i * 64, stemStartPos + (i + 1) * 64);
        const stemValue = BigInt("0x" + stemHex);
        stems.push(stemValue);
      }

      // The amount array starts after all stems
      // Add 64 bytes for the array length field
      const amountCountPosition = stemStartPos + stemCount * 64;
      const amountCount = parseInt(hexData.slice(amountCountPosition, amountCountPosition + 64), 16);

      // Verify the amount count matches the stem count
      if (amountCount === stemCount) {
        // Extract amounts
        const amountStartPos = amountCountPosition + 64;
        for (let i = 0; i < amountCount; i++) {
          const amountHex = hexData.slice(amountStartPos + i * 64, amountStartPos + (i + 1) * 64);
          const amountValue = BigInt("0x" + amountHex);
          amounts.push(amountValue);
        }

        console.log(`Successfully decoded ${stems.length} stems and ${amounts.length} amounts`);
        return { stems, amounts };
      } else {
        console.error(`Amount count (${amountCount}) doesn't match stem count (${stemCount})`);
      }
    } else {
      console.error(`Invalid stem count: ${stemCount}`);
    }
  } catch (error) {
    console.error("Error decoding simulation result:", error);
  }

  return undefined;
}

/**
 * Creates a pipe call that retrieves sorted deposits for a farmer and token
 * @param address Farmer address
 * @param tokenAddress Token address
 * @returns Encoded function call for pipe with getSortedDeposits
 */
export function getSortedDepositsCallForFarmerAndToken(
  address: `0x${string}`,
  tokenAddress: `0x${string}`
): `0x${string}` {
  // Create a call to getSortedDeposits from the TractorHelpers contract
  const getSortedDepositsCall = encodeFunctionData({
    abi: tractorHelpersABI,
    functionName: "getSortedDeposits",
    args: [address, tokenAddress],
  });

  // Create a pipe call that calls getSortedDeposits
  return encodeFunctionData({
    abi: beanstalkAbi,
    functionName: "pipe",
    args: [
      {
        target: TRACTOR_HELPERS_ADDRESS as `0x${string}`, // Target contract for the call
        data: getSortedDepositsCall, // The call data for getSortedDeposits
      },
    ],
  });
}

/**
 * Simulates a transaction on Tenderly
 * @param protocolAddress The contract address to call
 * @param calldata The encoded function call data
 * @param fromAddress The caller address
 * @returns The simulation result data
 */
export async function simulateOnTenderly(
  protocolAddress: `0x${string}`,
  calldata: `0x${string}`,
  fromAddress: `0x${string}`,
): Promise<{ success: boolean, results?: any[], decodedOutput?: any, error?: string }> {
  try {
    // Get Tenderly API credentials from environment variables
    const TENDERLY_USER = import.meta.env.VITE_TENDERLY_USER;
    const TENDERLY_PROJECT = import.meta.env.VITE_TENDERLY_PROJECT;
    const TENDERLY_ACCESS_KEY = import.meta.env.VITE_TENDERLY_ACCESS_KEY;

    if (!TENDERLY_USER || !TENDERLY_PROJECT || !TENDERLY_ACCESS_KEY) {
      throw new Error("Missing Tenderly configuration. Please set TENDERLY environment variables.");
    }

    const url = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`;

    // Prepare the simulation request
    const body = {
      network_id: '8453', // Base
      from: fromAddress,
      to: protocolAddress,
      input: calldata,
      simulation_type: "abi", // Main options are full or abi, full is a really big response
      // Additional simulation parameters can be added here if needed
      save: false, // Don't save the simulation
      save_if_fails: false, // Don't save even if it fails
    };

    console.log("Sending simulation request to Tenderly API...");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': TENDERLY_ACCESS_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Tenderly API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.transaction) {
      throw new Error("Invalid response from Tenderly API");
    }

    const simulation = data.transaction;

    if (simulation.status) {
      console.log("Tenderly simulation successful");

      // Just log a small part of the response for debugging
      console.log("Tenderly transaction status:", simulation.status);

      // Define the results array
      let callResults: `0x${string}`[] = [];
      let decodedOutputValue;

      // Extract the output specifically from call_trace.output
      if (simulation.transaction_info && simulation.transaction_info.call_trace) {
        console.log("Found call_trace in transaction_info");

        // Check if we have decoded_output which is much easier to work with
        if (simulation.transaction_info.call_trace.decoded_output &&
          Array.isArray(simulation.transaction_info.call_trace.decoded_output) &&
          simulation.transaction_info.call_trace.decoded_output.length > 0) {

          console.log("Found decoded_output in call_trace");

          // Get the first decoded output object
          const decodedOutput = simulation.transaction_info.call_trace.decoded_output[0];

          // Check if it has a value array (for farm call results)
          if (decodedOutput && decodedOutput.value && Array.isArray(decodedOutput.value)) {
            console.log(`Found ${decodedOutput.value.length} values in decoded_output`);

            // The last item should be our getSortedDeposits result
            decodedOutputValue = decodedOutput.value[decodedOutput.value.length - 1];

            if (decodedOutputValue) {
              console.log(`Found getSortedDeposits result in decoded_output: ${decodedOutputValue.slice(0, 100)}${decodedOutputValue.length > 100 ? '...' : ''}`);
            }
          }
        }

        // If we didn't get the decoded output, fall back to the raw output
        if (!decodedOutputValue) {
          // Get the output directly from the call_trace
          const callTraceOutput = simulation.transaction_info.call_trace.output;
          if (callTraceOutput && callTraceOutput !== "0x") {
            console.log(`Found output in call_trace: ${callTraceOutput.slice(0, 100)}${callTraceOutput.length > 100 ? '...' : ''}`);
            callResults.push(callTraceOutput as `0x${string}`);
          } else {
            console.log("No output found in call_trace or output is empty");

            // If the main call trace doesn't have output, check subcalls
            if (simulation.transaction_info.call_trace.calls && simulation.transaction_info.call_trace.calls.length > 0) {
              console.log(`Checking ${simulation.transaction_info.call_trace.calls.length} subcalls for outputs`);

              // Look for the last subcall that might be our pipe call
              for (let i = simulation.transaction_info.call_trace.calls.length - 1; i >= 0; i--) {
                const subcall = simulation.transaction_info.call_trace.calls[i];
                if (subcall.output && subcall.output !== "0x") {
                  console.log(`Found output in subcall ${i}: ${subcall.output.slice(0, 100)}${subcall.output.length > 100 ? '...' : ''}`);
                  callResults.push(subcall.output as `0x${string}`);
                  break; // Just get the first valid output we find
                }
              }
            }
          }
        }
      } else {
        console.log("No call_trace found in transaction_info");
      }

      return {
        success: true,
        results: callResults,
        decodedOutput: decodedOutputValue
      };
    } else {
      console.error("Tenderly simulation failed:", simulation.error_message);
      return {
        success: false,
        error: simulation.error_message,
      };
    }
  } catch (error) {
    console.error("Error during Tenderly simulation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}



/**
 * Simulates and prepares farm calls for token deposits in one comprehensive function
 *
 * @param token Token to process
 * @param address User's address for simulation
 * @param publicClient Public client for blockchain interaction
 * @param protocolAddress Protocol contract address
 * @param farmerDeposits Map of token to deposit data
 * @param sender Optional override for the sender address in the updateSortedDepositIds call
 * @returns Array of farm calls or null if simulation failed
 */
export async function simulateAndPrepareFarmCalls(
  token: Token,
  address: `0x${string}`,
  publicClient: PublicClient,
  protocolAddress: `0x${string}`,
  farmerDeposits: Map<Token, TokenDepositData>,
  sender?: `0x${string}`,
): Promise<`0x${string}`[] | null> {
  console.log(`Simulating and preparing farm calls for ${token.symbol}`);

  try {
    // Get the pipe call for sorted deposits using our utility function
    const pipeCall = getSortedDepositsCallForFarmerAndToken(
      address,
      token.address as `0x${string}`
    );

    // Prepare the farm calls array
    const farmCalls: `0x${string}`[] = [];

    var combineCalls: `0x${string}`[] = [];

    // If farmer deposits are provided, add combine and L2L calls first
    if (farmerDeposits && farmerDeposits.size > 0) {
      // Generate convert calls with smart limits using our utility function
      combineCalls = generateCombineAndL2LCallData(farmerDeposits);
      if (combineCalls.length > 0) {
        console.log(`Adding ${combineCalls.length} combine/L2L calls to execute before sort deposits`);
        farmCalls.push(...combineCalls);

        console.log(
          "Simulation compare L2L calls for token:",
          token.symbol,
          combineCalls
        );
      } else {
        console.log("No combine/L2L calls needed");
      }
    } else {
      console.log("No farmer deposits provided, skipping combine/L2L calls");
    }

    // Add the pipe call last so we can capture its result
    farmCalls.push(pipeCall);
    console.log(`Total farm calls to execute in simulation: ${farmCalls.length}`);

    console.log("Simulation farm calls:");
    farmCalls.forEach((call, index) => {
      console.log(`  [${index}]: ${call}`);
    });

    // Extract the last part of farmCalls to get the getSortedDeposits call details
    // This will help us identify it in the trace
    const lastCall = farmCalls[farmCalls.length - 1];
    // Get the function selector (first 10 characters after 0x)
    const pipeSelector = lastCall.substring(0, 10);
    console.log("Pipe call selector:", pipeSelector);

    // Extract the TractorHelpers address from the call data
    const tractorHelpersAddressInCall = pipeCall.indexOf(TRACTOR_HELPERS_ADDRESS.toLowerCase().substring(2));
    console.log("TractorHelpers address position in call data:", tractorHelpersAddressInCall > 0 ? "found" : "not found");

    // Encode the farm function call that we'll send to Tenderly
    const farmCallData = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "farm",
      args: [farmCalls]
    });

    console.log("Simulating via Tenderly instead of Viem...");

    // Use Tenderly for simulation instead of Viem
    const simulationResult = await simulateOnTenderly(
      protocolAddress,
      farmCallData,
      address
    );

    if (!simulationResult.success) {
      console.error("Tenderly simulation failed:", simulationResult.error);
      return null;
    }

    console.log("Tenderly simulation completed successfully");
    console.log("Number of results:", simulationResult);



    // Use the decoded output from Tenderly if available
    let sortedDepositsData: { stems: bigint[]; amounts: bigint[] } | undefined;

    if (simulationResult.decodedOutput) {
      console.log("Using decoded output from Tenderly: ", simulationResult.decodedOutput);
      sortedDepositsData = decodeSortedDepositsResult(simulationResult.decodedOutput as `0x${string}`);
    }

    if (!sortedDepositsData || !sortedDepositsData.stems || sortedDepositsData.stems.length === 0) {
      console.error("Failed to decode sorted deposits result");
      return null;
    }

    console.log(`Successfully obtained ${sortedDepositsData.stems.length} stems and amounts`);

    // Convert the sorted stems to deposit IDs and reverse them for proper sorting order
    const reversedDepositIds = createReversedDepositIds(token.address, sortedDepositsData.stems);

    console.log(`Generated ${reversedDepositIds.length} deposit IDs from sorted stems`);

    // For the actual transaction, we need to use the real sender address in the call
    // Use address for simulation, but zero address for transaction to avoid "tx from field is set" error
    const effectiveAddress = sender || address;

    // Create the updateSortedDepositIds call with the effective address
    const updateSortedIdsCall = encodeFunctionData({
      abi: beanstalkAbi,
      functionName: "updateSortedDepositIds",
      args: [effectiveAddress, token.address as `0x${string}`, reversedDepositIds],
    });

    // Prepare the final farm calls: combine/L2L calls followed by updateSortedDepositIds
    const finalFarmCalls = [...combineCalls, updateSortedIdsCall];

    // Log details about the operations
    console.log(`Final farm calls: ${finalFarmCalls.length} total (${combineCalls.length} combine + 1 update)`);

    console.log("Final farm calls:");
    finalFarmCalls.forEach((call, index) => {
      console.log(`  [${index}]: ${call}`);
    });

    return finalFarmCalls;
  } catch (error) {
    console.error(`Error simulating and preparing farm calls for ${token.symbol}:`, error);
    return null;
  }
}

/**
 * Creates reversed deposit IDs from stems for a token's storage optimization
 * @param tokenAddress The token address
 * @param stems Array of stem values
 * @returns Array of deposit IDs reversed for optimal storage
 */
export function createReversedDepositIds(tokenAddress: string, stems: readonly bigint[] | bigint[]): bigint[] {
  // Convert stems to depositIds using the packing function
  const depositIds = stems.map((stem) => packAddressAndStem(tokenAddress, stem));

  // Reverse the order of deposit IDs (invert sorting order)
  return [...depositIds].reverse();
}

/**
 * Utility function to pack a token address and stem into a deposit ID
 * Matches the Solidity implementation:
 * function packAddressAndStem(address _address, int96 stem) internal pure returns (uint256) {
 *     return (uint256(uint160(_address)) << 96) | uint96(stem);
 * }
 *
 * @param tokenAddress The token address
 * @param stem The stem value
 * @returns A packed deposit ID as a bigint
 */
export function packAddressAndStem(tokenAddress: string, stem: bigint): bigint {
  // In Solidity: uint256(uint160(_address)) << 96
  // We need to extract just the lower 160 bits of the address (20 bytes)
  const addressValue = BigInt(tokenAddress) & ((1n << 160n) - 1n);

  // Shift the address left by 96 bits
  const shiftedAddress = addressValue << 96n;

  // Convert stem to uint96 (mask with 2^96-1)
  const stemUint96 = stem & ((1n << 96n) - 1n);

  // Combine with bitwise OR
  return shiftedAddress | stemUint96;
}

/**
 * Generates calldata for updating sorted deposits for multiple tokens
 *
 * @param account The user's account address
 * @param farmerDeposits Map of token to deposit data
 * @param publicClient The viem public client for blockchain interaction
 * @param protocolAddress The Beanstalk protocol address
 * @param sender Optional override for the sender address in the updateSortedDepositIds calls
 * @returns Array of encoded function calls for updating sorted deposits
 */
export async function generateBatchSortDepositsCallData(
  account: `0x${string}`,
  farmerDeposits: Map<Token, TokenDepositData>,
  publicClient: PublicClient,
  protocolAddress: `0x${string}`,
  sender?: `0x${string}`,
): Promise<`0x${string}`[]> {
  console.log(`Generating batch sort deposits call data for ${farmerDeposits.size} tokens`);

  const callData: `0x${string}`[] = [];

  // Process each token in the farmer's deposits
  for (const [token, depositData] of farmerDeposits.entries()) {
    if (!depositData.deposits.length) {
      console.log(`Skipping ${token.symbol} - no deposits`);
      continue;
    }

    console.log(`Processing ${token.symbol} with ${depositData.deposits.length} deposits`);

    try {
      // Create a map with only this token's deposits
      const singleTokenMap = new Map<Token, TokenDepositData>();
      singleTokenMap.set(token, depositData);

      // Get sorted deposits through simulation and prepare farm calls
      // Only pass the current token's deposits instead of all deposits
      const farmCalls = await simulateAndPrepareFarmCalls(
        token,
        account,
        publicClient,
        protocolAddress,
        singleTokenMap, // Pass only this token's deposits
        sender, // Pass the sender parameter
      );

      // If we got farm calls, add them to our callData array
      if (farmCalls && farmCalls.length > 0) {
        // Include all calls from simulateAndPrepareFarmCalls including combines
        callData.push(...farmCalls);
        console.log(`Added ${farmCalls.length} calls for ${token.symbol} (includes combine operations)`);

        console.log(
          "Final compare L2L calls for token:",
          token.symbol,
          farmCalls
        );
      }
    } catch (error) {
      console.error(`Error processing ${token.symbol}:`, error);
    }
  }

  console.log(`Generated ${callData.length} total calls (combines + sort deposits)`);
  return callData;
}

export function createSmartGroups(deposits: DepositData[], targetGroups: number = 20): DepositGroup[] {
  const MAX_DEPOSITS = 2000; // Increased for Tractor launch to combine everyone's deposits
  const MIN_BDV = TokenValue.fromHuman(25, 6);

  // Filter and map deposits, including BDV for small deposit handling
  const validDeposits = deposits
    .filter((d) => !d.isGerminating)
    .map((d) => ({
      stem: d.stem.toHuman(),
      ratio: d.stalk.total.div(d.depositBdv),
      bdv: d.depositBdv,
    }))
    .sort((a, b) => b.ratio.sub(a.ratio).toNumber());

  // Only slice if we have more than MAX_DEPOSITS
  const slicedDeposits = validDeposits.length > MAX_DEPOSITS ? validDeposits.slice(-MAX_DEPOSITS) : validDeposits;

  if (slicedDeposits.length === 0) return [];

  // Calculate ratio differences between adjacent deposits
  const ratioDiffs = slicedDeposits.slice(1).map((deposit, i) => ({
    diff: slicedDeposits[i].ratio.sub(deposit.ratio),
    index: i + 1,
    // Don't create breakpoint if current or next deposit is small
    isValidBreakpoint: !(slicedDeposits[i].bdv.lte(MIN_BDV) || slicedDeposits[i + 1].bdv.lte(MIN_BDV)),
  }));

  // Sort ratio differences to find natural breakpoints, excluding small deposits
  const sortedDiffs = [...ratioDiffs].filter((d) => d.isValidBreakpoint).sort((a, b) => b.diff.sub(a.diff).toNumber());

  // Select the top N-1 breakpoints (for N groups)
  const numBreakpoints = Math.min(targetGroups - 1, sortedDiffs.length);
  const breakpoints = sortedDiffs
    .slice(0, numBreakpoints)
    .sort((a, b) => a.index - b.index)
    .map((b) => b.index);

  // Create groups based on calculated breakpoints
  const newGroups: DepositGroup[] = [];
  let groupId = 1;
  let currentGroup: (typeof validDeposits)[0][] = [];

  slicedDeposits.forEach((deposit, index) => {
    currentGroup.push(deposit);

    // Only create new group at breakpoint if it wouldn't leave a small deposit alone
    const isBreakpoint = breakpoints.includes(index + 1);
    const nextDeposit = slicedDeposits[index + 1];
    const isLastDeposit = index === slicedDeposits.length - 1;

    const shouldBreak = isBreakpoint || isLastDeposit;
    const wouldLeaveSmallDeposit = nextDeposit && nextDeposit.bdv.lte(MIN_BDV);

    if (shouldBreak && !wouldLeaveSmallDeposit) {
      if (currentGroup.length > 0) {
        newGroups.push({
          id: groupId++,
          deposits: currentGroup.map((d) => d.stem),
        });
      }
      currentGroup = [];
    }
  });

  return newGroups;
}

export function encodeGroupCombineCalls(
  validGroups: DepositGroup[],
  token: Token,
  deposits: DepositData[],
): `0x${string}`[] {
  // Exclude groups with only one deposit, since they are already alone
  const groupsToEncode = validGroups.filter((group) => group.deposits.length > 1);

  return groupsToEncode.map((group) => {
    // Get selected deposits for this group
    const selectedDepositData = group.deposits
      .map((stem) => deposits.find((d) => d.stem.toHuman() === stem))
      .filter(Boolean);

    const totalAmount = selectedDepositData.reduce((sum, deposit) => {
      if (!deposit) return sum;
      return deposit.amount.add(sum);
    }, TokenValue.ZERO);

    const convertData = calculateConvertData(token, token, totalAmount, totalAmount);
    if (!convertData) throw new Error("Failed to prepare combine data");

    const stems = selectedDepositData.filter((d): d is DepositData => d !== undefined).map((d) => d.stem.toBigInt());
    const amounts = selectedDepositData
      .filter((d): d is DepositData => d !== undefined)
      .map((d) => d.amount.toBigInt());

    // Use the imported convert function instead
    return convert(convertData, stems, amounts).callData;
  });
}

// Add a new function to handle claim reward grouping and encoding
export function encodeClaimRewardCombineCalls(
  deposits: DepositData[],
  token: Token,
  targetGroups: number = 20,
): `0x${string}`[] {
  console.log("Processing deposits for", token.symbol, ":", {
    depositCount: deposits.length,
  });

  // Use our existing smart grouping logic
  const groups = createSmartGroups(deposits, targetGroups);

  console.log("Created groups for", token.symbol, ":", {
    groupCount: groups.length,
    groups: groups.map((g) => ({
      id: g.id,
      depositCount: g.deposits.length,
    })),
  });

  // Sort groups by average Stalk/BDV ratio
  const groupsWithRatio = groups.map((group) => {
    const groupDeposits = group.deposits
      .map((stem) => deposits.find((d) => d.stem.toHuman() === stem))
      .filter(Boolean) as DepositData[];

    const totalStalk = groupDeposits.reduce((sum, deposit) => sum.add(deposit.stalk.total), TokenValue.ZERO);

    const totalBdv = groupDeposits.reduce((sum, deposit) => sum.add(deposit.depositBdv), TokenValue.ZERO);

    // Calculate the stalk-to-BDV ratio for the entire group
    const stalkPerBdv = totalBdv.gt(0) ? totalStalk.div(totalBdv) : TokenValue.ZERO;

    return {
      ...group,
      stalkPerBdv,
    };
  });

  // Sort by Stalk/BDV ratio (highest to lowest)
  const sortedGroups = groupsWithRatio
    .sort((a, b) => b.stalkPerBdv.sub(a.stalkPerBdv).toNumber())
    .map(({ id, deposits, stalkPerBdv }) => ({ id, deposits, stalkPerBdv }));

  console.log("Sorted groups by Stalk/BDV ratio for", token.symbol, ":", {
    sortedGroups: sortedGroups.map((g) => ({
      id: g.id,
      depositCount: g.deposits.length,
      stalkPerBdv: g.stalkPerBdv.toHuman(),
    })),
  });

  // Use our existing encode function with sorted groups - strip stalkPerBdv before passing
  const result = encodeGroupCombineCalls(
    sortedGroups.map(({ id, deposits }) => ({ id, deposits })),
    token,
    deposits,
  );

  console.log("Final encoded calls for", token.symbol, ":", {
    groupCount: sortedGroups.length,
    encodedCallCount: result.length,
  });

  return result;
}
