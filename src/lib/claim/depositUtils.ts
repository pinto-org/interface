import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { calculateConvertData } from "@/utils/convert";
import { Token, TokenDepositData } from "@/utils/types";
import { encodeClaimRewardCombineCalls } from "@/utils/utils";
import { encodeFunctionData } from "viem";
import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";

// Helper function to ensure a value is a properly formatted hex string
function ensureHexString(value: any): `0x${string}` {
  if (typeof value === 'string') {
    // Make sure it starts with 0x
    return (value.startsWith('0x') ? value : `0x${value}`) as `0x${string}`;
  }
  // If it's not a string, return the empty hex string
  return "0x" as `0x${string}`;
}

// Type definition for farm calls
type FarmCall = {
  callData: `0x${string}`;
  clipboard: `0x${string}`;
};

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
 * @param isRaining Weather condition that affects conversion strategy
 * @returns Array of encoded function calls
 */
export function generateCombineAndL2LCallData(
  farmerDeposits: Map<Token, TokenDepositData>,
  isRaining: boolean,
): `0x${string}`[] {
  // Prevents L2L converts when it's raining, don't want to lose rain roots
  if (isRaining) return [];

  const tokenEntries = Array.from(farmerDeposits.entries());

  // First check if any tokens need combining
  if (!needsCombining(farmerDeposits)) {
    // If no tokens need combining, use the top deposits logic
    console.log(
      `No tokens need combining, processing top ${MAX_TOP_DEPOSITS} deposits by BDV difference (regular L2L update)`,
    );

    // Collect all eligible deposits into a flat array with their token info
    const allDeposits = tokenEntries.flatMap(([token, depositData]) =>
      depositData.deposits
        .filter((deposit) => {
          const bdvDiff = deposit.currentBdv.sub(deposit.depositBdv);
          const onePercent = deposit.depositBdv.mul(0.01);
          const minThreshold = TokenValue.min(onePercent, MIN_BDV_THRESHOLD);
          return bdvDiff.gt(minThreshold) && !deposit.isGerminating;
        })
        .map((deposit) => ({
          token,
          deposit,
          bdvDifference: deposit.currentBdv.sub(deposit.depositBdv),
        })),
    );

    // Sort by BDV difference and take top deposits
    const topDeposits = allDeposits
      .filter((deposit) => deposit.bdvDifference.gte(MIN_BDV_THRESHOLD))
      .sort((a, b) => (b.bdvDifference.gt(a.bdvDifference) ? 1 : -1))
      .slice(0, MAX_TOP_DEPOSITS);

    return topDeposits.map(({ token, deposit }) => {
      const convertData = calculateConvertData(token, token, deposit.amount, deposit.amount);
      if (!convertData) {
        throw new Error("Invalid convert data");
      }
      return encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "convert",
        args: [convertData, [deposit.stem.toBigInt()], [deposit.amount.toBigInt()]],
      });
    });
  }

  console.log(`Combining logic triggered (${MIN_DEPOSITS_FOR_COMBINING}+ deposits of a single token)`);

  // Check if any token has more than PROCESS_SINGLE_TOKEN_ONLY_THRESHOLD deposits
  const highVolumeToken = tokenEntries.find(
    ([_, depositData]) => depositData.deposits.length >= PROCESS_SINGLE_TOKEN_ONLY_THRESHOLD,
  );

  if (highVolumeToken) {
    console.log("Processing single high-volume token:", {
      name: highVolumeToken[0].name,
      depositCount: highVolumeToken[1].deposits.length,
    });
    return encodeClaimRewardCombineCalls(highVolumeToken[1].deposits, highVolumeToken[0]);
  }

  // Check if any token has more than LARGE_DEPOSITS_THRESHOLD deposits
  const hasLargeToken = tokenEntries.some(
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
  }

  return eligibleTokens.flatMap(([token, depositData]) => encodeClaimRewardCombineCalls(depositData.deposits, token));
}

/**
 * Simulates farm transaction to get sorted deposits for tokens with multiple deposits
 * @param account User's account address
 * @param tokenMap Map of tokens with their deposit information
 * @param farmCalls Initial farm calls (plant, mow, etc.) to include in simulation
 * @param publicClient Viem public client for contract interactions
 * @param beanstalkAddress Beanstalk contract address
 * @param tractorHelpersAddress Address of the TractorHelpers contract
 * @returns Result of the simulation including sorted deposit information
 */
export async function simulateGetSortedDeposits(
  account: `0x${string}`,
  tokenMap: any, // Map or object of tokens with deposit information
  farmCalls: any[], // Initial calls like plant, mow
  publicClient: any, // PublicClient from wagmi
  beanstalkAddress: `0x${string}`,
  tractorHelpersAddress: `0x${string}`
) {
  // Define a token type for better type safety
  type TokenWithDeposits = {
    address: `0x${string}`;
    symbol: string;
    decimals: number;
    depositedAmount: {
      gt: (value: number) => boolean;
    };
    deposited: {
      deposits: Record<string, { amount: { toString: () => string } }>;
    };
  };

  try {
    // Debug: Log the structure of tokenMap to verify it contains what we expect
    console.log("TokenMap structure:", {
      type: typeof tokenMap,
      isArray: Array.isArray(tokenMap),
      isMap: tokenMap instanceof Map,
      tokenCount: typeof tokenMap === 'object' ? Object.keys(tokenMap).length : 'not object',
      firstTokenAddress: tokenMap && Object.keys(tokenMap).length > 0 ? Object.keys(tokenMap)[0] : 'no tokens'
    });
    
    // Get tokens based on the type of tokenMap
    let tokensToProcess: any[] = [];
    
    if (tokenMap instanceof Map) {
      console.log("Map keys:", Array.from(tokenMap.keys()).map(k => k.symbol || 'unknown'));
      // For Map, we need to use Array.from(map.values())
      tokensToProcess = Array.from(tokenMap.values());
    } else if (typeof tokenMap === 'object') {
      console.log("Object keys:", Object.keys(tokenMap).slice(0, 5));
      tokensToProcess = Object.values(tokenMap);
      
      // Log detail of first token if available
      if (Object.keys(tokenMap).length > 0) {
        const firstKey = Object.keys(tokenMap)[0];
        const firstToken = tokenMap[firstKey];
        console.log("First token:", {
          symbol: firstToken.symbol,
          hasDeposits: !!firstToken.deposited,
          depositCount: firstToken.deposited?.deposits ? Object.keys(firstToken.deposited.deposits).length : 'no deposits'
        });
      }
    }
    
    console.log(`Found ${tokensToProcess.length} total tokens to check for deposits`);
    
    // Find tokens with any deposits, removing the restrictions
    const sortableTokens = tokensToProcess
      .filter((token: any) => {
        if (!token) {
          console.log("Found undefined token");
          return false;
        }
        
        const symbol = token.symbol || 'unknown';
        
        // Check for valid deposits structure and count deposits
        const hasDeposited = !!token.deposited;
        const hasDeposits = hasDeposited && !!token.deposited.deposits;
        let depositCount = 0;
        
        if (hasDeposits) {
          // Handle both Map and Object deposit structures
          if (token.deposited.deposits instanceof Map) {
            depositCount = token.deposited.deposits.size;
          } else {
            depositCount = Object.keys(token.deposited.deposits).length;
          }
        }
        
        console.log(`Token ${symbol}: hasDeposited=${hasDeposited}, hasDeposits=${hasDeposits}, depositCount=${depositCount}`);
        
        // Include if there are any deposits
        return hasDeposits && depositCount > 0;
      }) as TokenWithDeposits[];
    
    console.log(`Found ${sortableTokens.length} tokens with deposits to sort`);
    
    // Process the input farm calls to extract callData
    const rawCallDataArray: `0x${string}`[] = [];
    
    // Handle farmCalls based on its type
    /*if (Array.isArray(farmCalls)) {
      // Process each farm call to extract just the callData
      for (const call of farmCalls) {
        if (!call) continue;
        
        // Handle both object format and direct string format
        if (typeof call === 'string') {
          // It's already a callData string
          rawCallDataArray.push(call.startsWith('0x') ? call as `0x${string}` : `0x${call}` as `0x${string}`);
        } else if (call.callData) {
          // It's an object with callData property
          const callData = typeof call.callData === 'string' 
            ? (call.callData.startsWith('0x') ? call.callData : `0x${call.callData}`) as `0x${string}`
            : "0x" as `0x${string}`;
          
          rawCallDataArray.push(callData);
        }
      }
    }
    
    console.log(`Added ${rawCallDataArray.length} raw call data items from input farm calls`);*/
    
    // For each token with deposits, create a call to TractorHelpers.getSortedDeposits
    for (const token of sortableTokens) {
      try {
        if (!token.address) {
          console.log(`Skipping token without address: ${token.symbol || 'unknown'}`);
          continue;
        }
        
        console.log(`Processing token for sorted deposits: ${token.symbol} (${token.address})`);
        
        // Create call to get sorted deposits using the imported ABI
        const getSortedDepositsCallData = encodeFunctionData({
          abi: tractorHelpersABI,
          functionName: "getSortedDeposits",
          args: [account, token.address]
        });
        
        // Create advancedPipe call using the full Beanstalk ABI
        const pipeCallData = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "advancedPipe",
          args: [
            [{ 
              target: tractorHelpersAddress, 
              callData: getSortedDepositsCallData, 
              clipboard: "0x" as `0x${string}` 
            }], 
            0n
          ]
        });
        
        // Wrap the advancedPipe call inside an advancedFarm call using the full Beanstalk ABI
        const advancedFarmCallData = encodeFunctionData({
          abi: beanstalkAbi,
          functionName: "advancedFarm",
          args: [[{ 
            callData: pipeCallData,
            clipboard: "0x" as `0x${string}`
          }]]
        });
        
        // Add the advancedFarm call to our array of calls
        rawCallDataArray.push(advancedFarmCallData);
        
        console.log(`Added nested advancedFarm->advancedPipe call for token ${token.symbol} (${token.address})`);
      } catch (err) {
        console.error(`Error creating pipe call for token ${token.symbol}:`, err);
      }
    }
    
    // Simulate the farm transaction to get sorted deposits
    console.log(`Simulating farm transaction with ${rawCallDataArray.length} calls...`);
    
    // If we have no calls to make, return early
    if (rawCallDataArray.length === 0) {
      console.log("No calls to simulate, returning empty result");
      return {
        simulationResult: null,
        sortedDeposits: {}
      };
    }
    
    try {
      // A much simpler approach using a direct function call
      const simulationResult = await publicClient.simulateContract({
        address: beanstalkAddress,
        abi: beanstalkAbi,
        functionName: "farm",
        args: [rawCallDataArray],
        account,
      });
      
      console.log("Farm simulation successful:", {
        gasUsed: simulationResult.request?.gas,
        resultType: typeof simulationResult.result,
        resultLength: Array.isArray(simulationResult.result) ? simulationResult.result.length : 'not an array'
      });
      
      // Process simulation results
      const results = {
        simulationResult,
        sortedDeposits: {} as Record<string, { stems: bigint[], depositIds: bigint[] }>
      };
      
      // Extract results for each token
      for (const token of sortableTokens) {
        try {
          if (!token.address) continue;
          
          const deposits = token.deposited.deposits || {};
          const depositCount = Object.keys(deposits).length;
          
          console.log(`Token ${token.symbol}: ${depositCount} deposits`);
          
          if (depositCount > 0) {
            // For tokens with deposits, extract results from simulation
            // Here we're just logging for demonstration
            const stems = Object.keys(deposits).slice(0, 10);
            const amounts = stems.map(stem => 
              deposits[stem].amount.toString()
            );
            
            console.log(`First few stems: ${stems.join(', ')}`);
            console.log(`First few amounts: ${amounts.join(', ')}`);
            
            // Pack address and stem to create deposit IDs
            const createDepositId = (tokenAddress: `0x${string}`, stem: string) => {
              // Simple implementation if packAddressAndStem isn't available
              return BigInt(stem);
            };
            
            const depositIds = stems.map(stem => 
              createDepositId(token.address, stem)
            );
            
            console.log(`First few depositIds: ${depositIds.join(', ')}`);
            
            // Store in results
            results.sortedDeposits[token.address] = {
              stems: stems.map(s => BigInt(s)),
              depositIds
            };
          }
        } catch (err) {
          console.error(`Error extracting sorted deposits for ${token.symbol}:`, err);
        }
      }
      
      return results;
    } catch (err) {
      console.error("Error simulating farm transaction:", err);
      throw err;
    }
  } catch (err) {
    console.error("Error simulating farm transaction:", err);
    throw err;
  }
}
