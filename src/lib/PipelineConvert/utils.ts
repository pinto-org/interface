/* eslint-disable @typescript-eslint/no-use-before-define */

import { TokenValue } from "@/classes/TokenValue";
import { PoolData } from "@/state/usePriceData";
import { DepositCrateData, DepositData } from "@/utils/types";
import { chunk } from "lodash";
import { ContractFunctionParameters } from "viem";

const MAX_PER_CALL = 20;

const BasinWellABI = [
  // get remove liquidity out
  {
    inputs: [{ internalType: "uint256", name: "lpAmountIn", type: "uint256" }],
    name: "getRemoveLiquidityOut",
    outputs: [{ internalType: "uint256[]", name: "tokenAmountsOut", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  // add liquidity out
  {
    inputs: [{ internalType: "uint256[]", name: "tokenAmountsIn", type: "uint256[]" }],
    name: "getAddLiquidityOut",
    outputs: [{ internalType: "uint256", name: "lpAmountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

function constructAddLiquidityMulticall(well: PoolData, amountsIn: TokenValue[][]) {
  const contracts: ContractFunctionParameters<typeof BasinWellABI>[] = [];

  const address = well.pool.address as `0x${string}`;

  amountsIn.forEach((amounts) => {
    contracts.push({
      address,
      abi: BasinWellABI,
      functionName: "getAddLiquidityOut",
      args: [amounts.map((v) => BigInt(v.blockchainString))],
    });
  });

  return chunk(contracts, MAX_PER_CALL);
}

function constructRemoveLiquidityMulticall(well: PoolData, deposits: DepositCrateData[]) {
  const contracts: ContractFunctionParameters<typeof BasinWellABI>[] = [];

  const address = well.pool.address as `0x${string}`;

  deposits.forEach((deposit) => {
    contracts.push({
      address,
      abi: BasinWellABI,
      functionName: "getRemoveLiquidityOut",
      args: [deposit.amount.toBigInt()],
    });
  });

  return [...chunk(contracts, MAX_PER_CALL)] as const;
}

const PipelineConvertUtils = {
  constructMulticall: {
    addLiquidity: constructAddLiquidityMulticall,
    removeLiquidityEqual: constructRemoveLiquidityMulticall,
  },
};

export default PipelineConvertUtils;
