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
    
    // Extract callData from base farm calls
    const baseCallDataArray: `0x${string}`[] = [];
    
    if (Array.isArray(farmCalls)) {
      for (const call of farmCalls) {
        if (!call) continue;
        
        if (typeof call === 'string') {
          baseCallDataArray.push(call.startsWith('0x') ? call as `0x${string}` : `0x${call}` as `0x${string}`);
        } else if (call.callData) {
          const callData = typeof call.callData === 'string' 
            ? (call.callData.startsWith('0x') ? call.callData : `0x${call.callData}`) as `0x${string}`
            : "0x" as `0x${string}`;
          
          baseCallDataArray.push(callData);
        }
      }
    }
    
    console.log(`Extracted ${baseCallDataArray.length} base call data items`);
    
    // Create a result object to store simulation results for each token
    const results = {
      sortedDeposits: {} as Record<string, { stems: bigint[], depositIds: bigint[] }>
    };
    
    // Get just the first token with deposits
    if (sortableTokens.length > 0) {
      const token = sortableTokens[0];
      console.log(`Processing only the first token for sorted deposits: ${token.symbol} (${token.address})`);
      
      try {
        if (!token.address) {
          console.log(`Cannot process token without address`);
          return results;
        }
        
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
            0n // Value parameter (only 2 parameters based on Beanstalk ABI)
          ]
        });
        
        // Log detailed info about the advancedPipe call
        console.log("advancedPipe encoding details:", {
          target: tractorHelpersAddress,
          callData: getSortedDepositsCallData,
          functionName: "advancedPipe",
          pipeCallData: pipeCallData.substring(0, 66) + "..." // Truncate for readability
        });
        
        // We need to make sure we have the right function signature for advancedFarm
        // Create farmCalls array with proper typing for advancedFarm
        const formattedFarmCalls: { callData: `0x${string}`; clipboard: `0x${string}` }[] = [
          ...baseCallDataArray.map(callData => ({
            callData,
            clipboard: "0x" as `0x${string}`
          })), 
          {
            callData: pipeCallData,
            clipboard: "0x" as `0x${string}`
          }
        ];
        
        // Wrap everything in an advancedFarm call - using proper format
        console.log(`Creating advancedFarm call with ${formattedFarmCalls.length} inner calls...`);
        
        try {
          // Try encoding the advancedFarm call with proper format
          const advancedFarmCallData = encodeFunctionData({
            abi: beanstalkAbi,
            functionName: "advancedFarm",
            args: [formattedFarmCalls] // Properly formatted calls
          });
          
          console.log(`Successfully encoded advancedFarm call, first 66 chars: ${advancedFarmCallData.substring(0, 66)}...`);
          
          console.log(`Running advancedFarm simulation for single token ${token.symbol}...`);
          
          try {
            // Run simulation directly using advancedFarm
            const tokenSimulationResult = await publicClient.simulateContract({
              address: beanstalkAddress,
              abi: beanstalkAbi,
              functionName: "advancedFarm",
              args: [formattedFarmCalls],
              account,
            });
            
            console.log(`Simulation for token ${token.symbol} successful!`);
            
            // Process simulation results for this token
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
          } catch (simulationErr: any) {
            console.error(`Error simulating advancedFarm transaction for token ${token.symbol}:`, simulationErr);
            
            // Try to extract helpful error information
            const errorMessage = simulationErr.toString();
            console.error("Error details:", {
              message: errorMessage,
              // Extract any revert reasons if possible
              revertReason: errorMessage.includes("revert") ? 
                errorMessage.substring(errorMessage.indexOf("revert") + 7) : "Unknown"
            });
            
            // Log detailed transaction data for debugging
            console.error(`Simulation transaction details for ${token.symbol}:`);
            
            // Log the transaction contract address
            console.error(`- Contract address: ${beanstalkAddress}`);
            
            // Log the account address
            console.error(`- Account address: ${account}`);
            
            // Log TractorHelpers address
            console.error(`- TractorHelpers address: ${tractorHelpersAddress}`);
            
            // Log each call in the advancedFarm
            console.error("- AdvancedFarm inner calls:");
            formattedFarmCalls.forEach((call, index) => {
              console.error(`  Call #${index}: ${call.callData.substring(0, 10)}...`);
            });
            
            // Encode the advancedFarm function with args for full transaction data
            try {
              const advancedFarmCalldata = encodeFunctionData({
                abi: beanstalkAbi,
                functionName: "advancedFarm",
                args: [formattedFarmCalls],
              });
              
              console.error(`- Full transaction data for simulator: ${advancedFarmCalldata} end`);
            } catch (encodeErr) {
              console.error("Error encoding advancedFarm call data:", encodeErr);
            }
          }
        } catch (encodeErr) {
          console.error("Error encoding advancedFarm function:", encodeErr);
        }
      } catch (err) {
        console.error(`Error creating pipe call for token ${token.symbol}:`, err);
      }
    } else {
      console.log("No tokens found to process for sorted deposits");
    }
    
    return results;
  } catch (err) {
    console.error("Error processing sorted deposits:", err);
    throw err;
  }
}
