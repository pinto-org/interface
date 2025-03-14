import { exists } from '@/utils/utils';
import { HashString } from './types.generic';

export function chunkReturnDataToBytes32BigIntArray(data: `0x${string}`): bigint[] {
  // Remove "0x" prefix
  const hexWithoutPrefix = data.startsWith("0x") ? data.slice(2) : data;

  // Each 32-byte word is 64 hex characters
  const chunkSize = 64;
  const chunks: bigint[] = [];

  for (let i = 0; i < hexWithoutPrefix.length; i += chunkSize) {
    const chunk = `0x${hexWithoutPrefix.slice(i, i + chunkSize)}` as `0x${string}`;
    const chunkBigInt = BigInt(chunk);
    chunks.push(chunkBigInt);
  }

  return chunks;
}

interface Bytes32FunctionReturnSummary {
  locationOfLengthIndex: number;
  lengthIndex: number;
  length: number;
  data: {
    data: bigint | HashString;
    index: number;
  }[];
}

export function summarizeFunctionReturnData(
  returnData: HashString,
): Bytes32FunctionReturnSummary[] {
  const [_, _lengthOfBytesBigInt, ...data] = chunkReturnDataToBytes32BigIntArray(returnData);

  // get the length of bytes
  const lengthOfBytes = Number(_lengthOfBytesBigInt);

  const indexArr = Array.from({ length: lengthOfBytes }, (_, i) => i);

  return indexArr.reduce<Bytes32FunctionReturnSummary[]>((memo, locationOfLengthIndex) => {
    const lengthIndex = Number(data[locationOfLengthIndex] / 32n);

    const summary: Bytes32FunctionReturnSummary = {
      locationOfLengthIndex,
      lengthIndex,
      length: Number(data[lengthIndex] / 32n),
      data: [],
    }

    if (summary.length > 0) {
      for (let j = 0; j < summary.length; j += 1) {
        const dataIndex = lengthIndex + j + 1;
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
}

export function deriveCopySlotFromReturnData(
  returnData: `0x${string}`,
  // advancedFarm: AdvancedFarmWorkflow,
  functionSlot: number | ((totalLen: number) => number),
  paramIndex: number,
) {
  const summary = summarizeFunctionReturnData(returnData);

  const fnSlotIndex = typeof functionSlot === 'function' ? functionSlot(summary.length) : functionSlot;

  const functionReturnData = summary[fnSlotIndex];

  const copySlot = functionReturnData?.data[paramIndex]?.index;

  if (!exists(copySlot)) {
    throw new Error(`No copy slot found for function slot ${functionSlot} and param index ${paramIndex}`);
  }

  return { copySlot, summary };
}

/*
  Example AdvancedFarmCall

  WETH -> USDC -> PINTOUSDC

  advancedFarm([
    0. transfer WETH -> pipeline,
    1. advancedPipe([
        0. approve 0x to use WETH
        1. 0x call data
        2. balanceofToken(USDC)
        3. transfer USDC to PINTOUSDCWELL
        4. sync(USDC) -> recipient = Pipeline
        5. approve beanstalk to use PINTOUSDC
        6. transfer PINTOUSDC to wallet internal balance
    ])
    2. deposit(PINTOUSDC)
  ])

  ====================================================================================================================================================================
  32Bytes                                                              | Decimal                 | Description                 | advPipe index
  ====================================================================================================================================================================
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | location of LENGTH of bytes |
  "0x0000000000000000000000000000000000000000000000000000000000000007" | (7n)                    | length of bytes             |
  "0x00000000000000000000000000000000000000000000000000000000000000e0" | (224n)                  | loc of LENGTH of data[0]    |
  "0x0000000000000000000000000000000000000000000000000000000000000120" | (288n)                  | loc of LENGTH of data[1]    |
  "0x00000000000000000000000000000000000000000000000000000000000001a0" | (416n)                  | loc of LENGTH of data[2]    |
  "0x00000000000000000000000000000000000000000000000000000000000001e0" | (480n)                  | loc of LENGTH of data[3]    |
  "0x0000000000000000000000000000000000000000000000000000000000000220" | (544n)                  | loc of LENGTH of data[4]    |
  "0x0000000000000000000000000000000000000000000000000000000000000260" | (608n)                  | loc of LENGTH of data[5]    |
  "0x00000000000000000000000000000000000000000000000000000000000002a0" | (672n)                  | loc of LENGTH of data[6]    |
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[0]           |
  "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[0]                     | 0. Approve 0x to use WETH
  "0x0000000000000000000000000000000000000000000000000000000000000060" | (96n)                   | LENGTH of data[1]           |
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | data[1.1]                   | 1. 0x return data (96 bytes)
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | data[1.2]                   | 
  "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[1.3]                   |
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[2]           | 
  "0x0000000000000000000000000000000000000000000000000cb13797bef111b6" | (914573324215980470n)   | data[2]                     | 2. balanceOfToken(USDC)
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[3]           |
  "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[3]                     | 3. transfer USDC to PINTOUSDCWELL
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[4]           | 
  "0x0000000000000000000000000000000000000000000000013c63a8800d7c974d" | (22798251006615131981n) | data[4]                     | 
  "0x0000000000000000000000000000000000000000000000000000000000000020" | (32n)                   | LENGTH of data[5]           |
  "0x0000000000000000000000000000000000000000000000000000000000000001" | (1n)                    | data[5]                     |
  "0x0000000000000000000000000000000000000000000000000000000000000000" | (0n)                    | LENGTH of data[6].          |



  [2 + pipecall.length] + (1 + slot * 2)
  [2 + pipecall.length] + from 0 to slot, ∑ (outputlength_i / 32) + slot + (return_param)
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


