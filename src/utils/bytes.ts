import { exists } from '@/utils/utils';
import { HashString } from './types.generic';

export function chunkReturnDataToBytes32BigIntArray(data: HashString): HashString[] {
  // Remove "0x" prefix
  const hexWithoutPrefix = data.startsWith("0x") ? data.slice(2) : data;

  // Each 32-byte word is 64 hex characters
  const chunkSize = 64;
  const chunks: HashString[] = [];

  for (let i = 0; i < hexWithoutPrefix.length; i += chunkSize) {
    const chunk = `0x${hexWithoutPrefix.slice(i, i + chunkSize)}` as HashString;
    chunks.push(chunk);
  }
  return chunks;
}

interface Bytes32FunctionReturnSummary {
  locationOfLengthIndex: number;
  lengthIndex: number;
  length: number;
  data: {
    data: HashString;
    index: number;
  }[];
}

export function summarizeFunctionReturnData(
  returnData: HashString,
): {
  summary: Bytes32FunctionReturnSummary[],
  data: HashString[],
} {
  const bytes32Array = chunkReturnDataToBytes32BigIntArray(returnData);
  const [_, _lengthOfBytesBigInt, ...data] = bytes32Array;

  // offset of 2 b/c data[0] & data[1] are the length and location of length, respectively
  const offset = 2;

  // The length of bytes
  const lengthOfBytes = Number(BigInt(_lengthOfBytesBigInt));

  // The index of the bytes
  const indexArr = Array.from({ length: lengthOfBytes }, (_, i) => i);

  const summaryData = indexArr.reduce<Bytes32FunctionReturnSummary[]>((memo, locationOfLengthIndex) => {
    const lengthIndex = Number(BigInt(data[locationOfLengthIndex]) / 32n);

    const summary: Bytes32FunctionReturnSummary = {
      locationOfLengthIndex: locationOfLengthIndex + offset,
      lengthIndex: lengthIndex + offset,
      length: Number(BigInt(data[lengthIndex]) / 32n),
      data: [],
    }

    // If the length of the bytes is greater than 0, then we need to iterate over the bytes and get the data
    if (summary.length > 0) {
      for (let j = 0; j < summary.length; j += 1) {
        const dataIndex = summary.lengthIndex + j + 1;
        const dataValue = data[dataIndex];

        summary.data.push({
          data: dataValue,
          index: dataIndex,
        });
      }
    }

    memo.push(summary);
    return memo;
  }, []);

  return { summary: summaryData, data: bytes32Array };
}

export function deriveCopySlotFromReturnData(
  returnData: `0x${string}`,
  functionSlot: number,
  paramIndex: number,
) {
  try {
    const summary = summarizeFunctionReturnData(returnData);

    const fnSlotIndex = functionSlot;

    const fnData = summary.summary?.[fnSlotIndex];

    const copySlot = fnData?.data?.[paramIndex]?.index;
    if (!exists(copySlot)) {
      throw new Error(`Unable to determine copy slot`);
    }

    return { copySlot, summary };
  } catch (e) {
    console.error("Unable to determine copy slot", {
      functionSlot,
      paramIndex,
      returnData
    });
    throw e;
  }
}

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

  AdvancedFarm Return Data for indexes 0, 1
  [
    transfer(WETH) -> pipeline: "0x",
    advancedPipe([0,6]): "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000cb3b7a8b0b5ef7b00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000135c7aea7fcce269b000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000"
  ]

  AdvancedPipe Return Data parsed into an array of 32Bytes
  ==============================================================================================================================================================================
  index | 32Bytes                                                              | Data                    | Description                 | advPipe index
  ==============================================================================================================================================================================

  For Indexes 0-1:
  - The 1st 32bytes represent the data location of the length of the bytes array.
  - The 2nd 32bytes represent the length of the bytes array.
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   0    | "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n) = 1               | location of LENGTH of bytes |
   1    | "0x0000000000000000000000000000000000000000000000000000000000000007" | (7n)                    | length of bytes             |
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  For Indexes 2-8:
  - arr[i] represents 32byte data representing the location of the length of the corresponding return data.
  - NOTE: 224n (7) seems to represent bytes[2 + 7] = arr[9]
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   2    | "0x00000000000000000000000000000000000000000000000000000000000000e0" | (224n) = 7              | loc of LENGTH of data[0]    | 0
   3    | "0x0000000000000000000000000000000000000000000000000000000000000120" | (288n) = 9              | loc of LENGTH of data[1]    | 1
   4    | "0x00000000000000000000000000000000000000000000000000000000000001a0" | (416n) = 13             | loc of LENGTH of data[2]    | 2
   5    | "0x00000000000000000000000000000000000000000000000000000000000001e0" | (480n) = 15             | loc of LENGTH of data[3]    | 3
   6    | "0x0000000000000000000000000000000000000000000000000000000000000220" | (544n) = 17             | loc of LENGTH of data[4]    | 4
   7    | "0x0000000000000000000000000000000000000000000000000000000000000260" | (608n) = 19             | loc of LENGTH of data[5]    | 5
   8    | "0x00000000000000000000000000000000000000000000000000000000000002a0" | (672n) = 21             | loc of LENGTH of data[6]    | 6
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  For indexes 9-23:
  - arr[locationOfLength] represents the length of the corresponding return data
  - arr[locationOfLength + (1...length)] represent the data returned from the corresponding call

  For example:
  - arr[11] = 96n, meaning the LENGTH OF DATA RETURNED from advPipe[1] is 96 bytes, so in 32byte chunks, we know the next 3 elements are returned from advPipe[1]
  - arr[11 + (1...3)] represent the DATA RETURNED from advPipe[1]
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

  [2 + pipecall.length] + (1 + slot * 2)

  [2 + pipecall.length] + (from 0 to slot, ∑(outputlength_i / 32)) + slot + (return_param)
  [0](32) [1](96)  [2](32)    [3](32)   [4](32)
  0x20 +   0x60   + 0x20    +  0x20     + 0x20 = 0xC0 (192) -> (192/32 = 7) + 4 

  2 + 7 = 9 + 7 = 16 + slot = 20

  [2 + pipecall.length] + 
  from 0 to 4, ∑ (outputlength_i / 32) + 4
  0: 1 
  1: 3
  2: 1
  3: 1
  4: 1 

  1 + 3 + 1 + 1 + 1 = 7

  2 + 7 + 7 + 4 = 20

*/


