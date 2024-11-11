import { TokenValue } from "@/classes/TokenValue";
import { PoolData } from "@/state/usePriceData";
import { DepositCrateData } from "@/utils/types";
import { chunk } from "lodash";
import { ContractFunctionParameters } from "viem";

import { abiSnippets } from "@/constants/abiSnippets";

const MAX_PER_CALL = 20;

const { getRemoveLiquidityOut, getAddLiquidityOut, getRemoveLiquidityOneTokenOut } = abiSnippets.wells;

function constructAddLiquidityMulticall(
  well: PoolData,
  amountsIn: TokenValue[][],
): ContractFunctionParameters<typeof getAddLiquidityOut>[][] {
  const contracts: ContractFunctionParameters<typeof getAddLiquidityOut>[] = [];

  const address = well.pool.address as `0x${string}`;

  amountsIn.forEach((amounts) => {
    contracts.push({
      address,
      abi: getAddLiquidityOut,
      functionName: "getAddLiquidityOut",
      args: [amounts.map((v) => BigInt(v.blockchainString))],
    });
  });

  return chunk(contracts, MAX_PER_CALL);
}

function constructRemoveLiquidityMulticall(
  well: PoolData,
  crates: DepositCrateData[],
): ContractFunctionParameters<typeof getRemoveLiquidityOut>[][] {
  const contracts: ContractFunctionParameters<typeof getRemoveLiquidityOut>[] = [];

  const address = well.pool.address as `0x${string}`;

  crates.forEach((deposit) => {
    contracts.push({
      address,
      abi: getRemoveLiquidityOut,
      functionName: "getRemoveLiquidityOut",
      args: [deposit.amount.toBigInt()],
    });
  });

  return chunk(contracts, MAX_PER_CALL);
}

function constructSingleSidedLiquidityMulticall(well: PoolData, tokenIndex: number, crates: DepositCrateData[]) {
  const contracts: ContractFunctionParameters<typeof getRemoveLiquidityOneTokenOut>[] = [];
  for (const crate of crates) {
    contracts.push({
      address: well.pool.address,
      abi: getRemoveLiquidityOneTokenOut,
      functionName: "getRemoveLiquidityOneTokenOut",
      args: [crate.amount.toBigInt(), well.tokens[tokenIndex].address],
    });
  }

  return chunk(contracts, MAX_PER_CALL);
}

const PipelineConvertUtils = {
  constructMulticall: {
    addLiquidity: constructAddLiquidityMulticall,
    removeLiquidityEqual: constructRemoveLiquidityMulticall,
    removeLiquidityOneToken: constructSingleSidedLiquidityMulticall,
  },
};

export default PipelineConvertUtils;
