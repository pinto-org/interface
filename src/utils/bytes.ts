import { exists } from "@/utils/utils";
import { HashString } from "./types.generic";

/**
 * Splits a hexadecimal string into an array of 32-byte chunks.
 *
 * @param data - A hexadecimal string (with or without '0x' prefix)
 *               Each chunk in the return data represents a 32-byte word (64 hexadecimal characters).
 *
 * @returns An array of HashString values, where each element is a 32-byte chunk prefixed with '0x'.
 *          Each chunk maintains consistent length of 64 hexadecimal characters (32 bytes).
 *
 * @example
 * const data = "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0";
 * const chunks = splitHexToBytes32Words(data);
 * // Returns: ["0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0"]
 */
export function splitHexToBytes32Words(data: HashString | string): HashString[] {
  // Normalize and sanitize input
  const hexWithoutPrefix = data.startsWith("0x") ? data.slice(2) : data;

  // Handle empty input
  if (hexWithoutPrefix.length === 0) return [];

  // Validate hex characters
  if (!/^[0-9a-fA-F]*$/.test(hexWithoutPrefix)) {
    throw new Error("Invalid hex string: contains non-hexadecimal characters.");
  }

  // Ensure even length (since hex is byte-based, 2 characters per byte)
  if (hexWithoutPrefix.length % 2 !== 0) {
    throw new Error("Invalid hex string: Hex string must have an even length.");
  }

  // Each 32-byte word is 64 hex characters
  const chunkSize = 64;
  const chunks: HashString[] = [];

  for (let i = 0; i < hexWithoutPrefix.length; i += chunkSize) {
    let chunkContent = hexWithoutPrefix.slice(i, i + chunkSize);

    // Pad incomplete chunk to 64 hex chars with zeros
    if (chunkContent.length < chunkSize) {
      chunkContent = chunkContent.padEnd(chunkSize, "0");
    }

    chunks.push(`0x${chunkContent}` as HashString);
  }
  return chunks;
}

/**
 * Represents the decoded structure of an ABI-encoded function return value.
 * This interface maps the standard Solidity ABI dynamic array encoding format,
 * where data is stored in specific memory slots following the Ethereum ABI specification.
 *
 * @property locationOfLengthIndex - Index where the pointer to the length data is stored (offset by 2 for header)
 * @property lengthIndex - Index where the actual length of the return data is stored
 * @property length - Number of 32-byte words in the return data (derived from lengthIndex)
 * @property data - Array of decoded 32-byte words with their corresponding indices
 *                  Each item contains:
 *                  - data: The actual 32-byte word as a hex string
 *                  - index: The absolute position of this word in the full return data
 *
 * @example
 * {
 *   locationOfLengthIndex: 2,    // Points to position 0x60
 *   lengthIndex: 3,              // Contains the length value
 *   length: 2,                   // Two 32-byte words of actual data
 *   data: [
 *     { data: "0x...", index: 4 },
 *     { data: "0x...", index: 5 }
 *   ]
 * }
 */
export interface ParsedABIReturnData {
  locationOfLengthIndex: number;
  lengthIndex: number;
  length: number;
  data: {
    data: HashString;
    index: number;
  }[];
}

/**
 * Parses and decodes ABI-encoded return data from Ethereum function calls.
 *
 * This function processes raw hexadecimal return data from contract calls (particularly
 * from advancedPipe/advancedFarm operations) and structures it according to the Ethereum
 * ABI encoding specification for dynamic arrays.
 *
 * @param returnData - Raw hexadecimal string containing ABI-encoded return data
 *
 * @returns An object containing:
 *   - summary: Array of ParsedABIReturnData objects, each representing a decoded function return
 *   - data: The complete array of 32-byte chunks from the original return data
 *
 * @example
 * // For an advancedPipe call with multiple operations
 * const returnData = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000...";
 * const result = parseABIDynamicArrayReturnData(returnData);
 * // result.summary contains structured data for each function call
 * // result.data contains all raw 32-byte chunks
 *
 * @remarks
 * The function follows Ethereum ABI encoding rules where:
 * - First 32 bytes contain a pointer to the data location
 * - Second 32 bytes contain the number of elements
 * - Subsequent bytes contain pointers to individual elements
 * - Each element has its own length prefix followed by actual data
 */
export function parseABIDynamicArrayReturnData(returnData: HashString): {
  summary: ParsedABIReturnData[];
  data: HashString[];
} {
  // Split the hex string into an array of 32-byte chunks
  const raw = splitHexToBytes32Words(returnData);

  if (!raw.length) {
    return {
      summary: [],
      data: [],
    };
  }

  if (raw.length < 2) {
    throw new Error("Invalid return data: Not enough data to parse");
  }

  // Destructure the array:
  // - First element (index 0) contains the location pointer (ignored with _)
  // - Second element (index 1) contains the number of function calls in the pipe
  // - Remaining elements contain the actual data for each function call
  const [_, _lengthOfBytesBigInt, ...data] = raw;

  // Standard offset of 2 to account for the ABI header (location pointer and length of array are always the first two 32-byte words)
  const offset = 2;

  // Convert the length from BigInt to Number for array operations. This represents the number of function calls in the pipe
  const lengthOfBytes = Number(BigInt(_lengthOfBytesBigInt));

  // Create an array of indices [0, 1, 2, ..., lengthOfBytes-1]. Each index corresponds to one function call in the pipe
  const indexArr = Array.from({ length: lengthOfBytes }, (_, i) => i);

  // Process each function call
  const summaryData = indexArr.reduce<ParsedABIReturnData[]>((memo, locationOfLengthIndex) => {
    // Calculate the index where the length of this function's return data is stored
    // We divide by 32n because the value represents a byte offset, but we need a 32-byte word index
    const lengthIndex = Number(BigInt(data[locationOfLengthIndex]) / 32n);

    const summary: ParsedABIReturnData = {
      // Add offset to get absolute position in the full array
      locationOfLengthIndex: locationOfLengthIndex + offset,
      lengthIndex: lengthIndex + offset,
      // Calculate how many 32-byte words this function returned
      length: Number(BigInt(data[lengthIndex]) / 32n),
      data: [],
    };

    // Only process if this function actually returned data
    if (summary.length > 0) {
      for (let j = 0; j < summary.length; j += 1) {
        // Calculate the absolute index of this data word
        // (lengthIndex - offset + 1) points to the first data word, then we add j for subsequent words
        const dataIndex = summary.lengthIndex - offset + j + 1;
        const dataValue = data[dataIndex];

        summary.data.push({ data: dataValue, index: dataIndex + offset });
      }
    }

    memo.push(summary);
    return memo;
  }, []);

  // Return both the structured summary and the raw data array
  return { summary: summaryData, data: raw };
}

/**
 * Extracts a specific data slot from ABI-encoded return data based on function position and parameter index.
 *
 * This function is used to locate specific return values within complex nested function calls,
 * particularly for accessing return values from advancedPipe/advancedFarm operations that need
 * to be referenced in subsequent operations.
 *
 * @param returnData - Raw hexadecimal string containing ABI-encoded return data from a contract call
 * @param functionSlot - Zero-based index of the function within the pipe sequence
 *                       (e.g., for the 3rd function in an advancedPipe, use 2)
 * @param paramIndex - Zero-based index of the parameter to extract from the function's return data
 *                     (e.g., if a function returns multiple values, use 0 for the first return value)
 *
 * @returns An object containing:
 *   - copySlot: The absolute index of the requested return value in the raw data array
 *   - summary: The complete parsed structure of the return data (for debugging or advanced usage)
 *
 * @throws Error if the requested slot cannot be found in the return data
 *
 * @example
 * // To get the return value from the 5th function (index 4) in a pipe
 * const returnData = "0x..."; // Return data from advancedPipe
 * const result = extractABIDynamicArrayCopySlot(returnData, 4, 0);
 * // result.copySlot can be used to reference this value in subsequent operations
 */
export function extractABIDynamicArrayCopySlot(returnData: `0x${string}`, functionSlot: number, paramIndex: number) {
  if (functionSlot < 0 || paramIndex < 0) {
    throw new Error("Invalid function or parameter index");
  }
  try {
    // Parse the raw return data into a structured format
    const summary = parseABIDynamicArrayReturnData(returnData);

    const fnData = summary.summary?.[functionSlot];
    // Extract the absolute index of the requested parameter
    // This is the "clipboard slot" that can be referenced in subsequent operations
    const copySlot = fnData?.data?.[paramIndex]?.index;

    if (!exists(copySlot)) {
      throw new Error(`Unable to determine copy slot`);
    }

    // Return both the specific slot and the complete summary for potential further processing
    return { copySlot, summary };
  } catch (e) {
    console.error("Unable to determine copy slot", {
      functionSlot,
      paramIndex,
      returnData,
    });
    throw e;
  }
}

/**
 * USE CAREFULLY. This function assumes that:
 * - each call w/in advPipe returns 32 bytes.
 * - each call returns a single value.
 *
 * OPT TO USE deriveCopySlotFromReturnData() unless you have a very good reason to use this function.
 */
export function calculatePipeCallClipboardSlot(pipeCallLength: number, slot: number) {
  if (!pipeCallLength || !slot) return 0;
  return 2 + pipeCallLength + (1 + slot * 2);
}

/**
 * ABI-encoded return data structure from advancedPipe/advancedFarm calls.
 *
 * This documentation explains the memory layout of return data from complex nested contract calls
 * and provides a detailed breakdown of how data is organized in the Ethereum ABI encoding format.
 *
 * MEMORY LAYOUT OVERVIEW:
 *
 * For an advancedPipe with multiple function calls, the return data follows this structure:
 *
 * 1. HEADER SECTION (Indexes 0-1):
 *    - Index 0: Location pointer to the data array (typically 0x20 = 32 bytes)
 *    - Index 1: Number of function calls in the pipe (e.g., 7 for a pipe with 7 operations)
 *
 * 2. POINTER SECTION (Indexes 2 to 1+pipeLength):
 *    - Contains pointers to where each function's return data length is stored
 *    - Each value is a byte offset that must be divided by 32 to get the actual array index
 *    - Example: Value 0xE0 (224) at index 2 means the length is at index 224/32 = 7
 *
 * 3. DATA SECTION (Remaining indexes):
 *    - For each function call:
 *      a. Length word: Number of 32-byte words returned by this function
 *      b. Data words: The actual return values (1 or more 32-byte words)
 *
 * CLIPBOARD SLOT CALCULATION:
 *
 * To reference a specific return value in subsequent operations, use this formula:
 * slot = (2 + pipeLength) + (sum of all previous function return lengths in words) + functionSlot + paramIndex
 *
 * Example calculation for the 5th function (index 4) in a pipe with 7 functions:
 * - Header: 2 words
 * - Pipe length: 7 functions
 * - Previous return lengths: [0](32) + [1](96) + [2](32) + [3](32) + [4](32) = 224 bytes = 7 words
 * - Function slot: 4
 * - Parameter index: 0 (first return value)
 *
 * Therefore: 2 + 7 + 7 + 4 + 0 = 20
 *
 * This means the return value is at index 20 in the raw data array.
 */

/*
  Example AdvancedFarmCall

  WETH -> cbETH -> PINTOcbETH

  advancedFarm([
    0. transfer WETH -> pipeline,
    1. advancedPipe([
        0. approve 0x to use WETH
        1. 0x call data (WETH -> cbETH)
        2. balanceofToken(cbETH)
        3. transfer cbETH to PINTOcbETH Well
        4. sync(cbETH -> PINTOcbETH, recipient = Pipeline)
        5. approve beanstalk to use PINTOcbETH
        6. transfer PINTOcbETH to wallet internal balance
    ])
    2. deposit(PINTOcbETH)
  ])

  AdvancedPipe (advancedFarm[1]) Return Data parsed into an array of 32Bytes
  ========================================================================================================================================================================================
  index | 32Bytes                                                              | Data                    | Description                 | advPipe index
  ========================================================================================================================================================================================

  For Indexes 0-1:
  - The 1st 32bytes represent the data location of the length of the bytes array.
  - The 2nd 32bytes represent the length of the bytes array.
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   0    | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n) = 1               | location of LENGTH of bytes |
   1    | "0x0000000000000000000000000000000000000000000000000000000000000007" | (7n)                    | length of bytes             |
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  For Indexes 2-8:
  - arr[i] represents 32byte data representing the location of the length of the corresponding return data.
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   2    | "0x00000000000000000000000000000000000000000000000000000000000000e0" | (224n) = 7              | loc of LENGTH of data[0]    | 0
   3    | "0x0000000000000000000000000000000000000000000000000000000000000120" | (288n) = 9              | loc of LENGTH of data[1]    | 1
   4    | "0x00000000000000000000000000000000000000000000000000000000000001a0" | (416n) = 13             | loc of LENGTH of data[2]    | 2
   5    | "0x00000000000000000000000000000000000000000000000000000000000001e0" | (480n) = 15             | loc of LENGTH of data[3]    | 3
   6    | "0x0000000000000000000000000000000000000000000000000000000000000220" | (544n) = 17             | loc of LENGTH of data[4]    | 4
   7    | "0x0000000000000000000000000000000000000000000000000000000000000260" | (608n) = 19             | loc of LENGTH of data[5]    | 5
   8    | "0x00000000000000000000000000000000000000000000000000000000000002a0" | (672n) = 21             | loc of LENGTH of data[6]    | 6
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  For indexes 9-23:
  - arr[locationOfLength] represents the length of the corresponding return data
  - arr[locationOfLength + (1...length)] represent the data returned from the corresponding call

  For example:
  - arr[11] = 96n, meaning the LENGTH OF DATA RETURNED from advPipe[1] is 96 bytes, so in 32byte chunks, we know the next 3 elements are returned from advPipe[1]
  - arr[11 + (1...3)] represent the DATA RETURNED from advPipe[1]
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   9    | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[0]           |
   10   | "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[0]                     | 0. Approve 0x to use WETH
   11   | "0x0000000000000000000000000000000000000000000000000000000000000060" | (96n)                   | LENGTH of data[1]           |
   12   | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | data[1.1]                   | 1. 0x return data (96 bytes)
   13   | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | data[1.2]                   | 
   14   | "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[1.3]                   |
   15   | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[2]           | 
   16   | "0x0000000000000000000000000000000000000000000000000cb3b7a8b0b5ef7b" | (915277084433444731n)   | data[2]                     | 2. balanceOfToken(USDC)
   17   | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[3]           |
   18   | "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[3]                     | 3. transfer USDC to PINTOUSDCWELL
   19   | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[4]           | 
   20   | "0x00000000000000000000000000000000000000000000000135c7aea7fcce269b" | (22322002114609292955n) | data[4]                     | 4. sync(USDC) -> recipient = Pipeline
   21   | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[5]           |
   22   | "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[5]                     | 5. approve beanstalk to use PINTOUSDC
   23   | "0x0000000000000000000000000000000000000000000000000000000000000000" | (0n)                    | LENGTH of data[6].          | 6. transfer PINTOUSDC to wallet internal balance
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  ========================================================================================================================================================================================
*/
