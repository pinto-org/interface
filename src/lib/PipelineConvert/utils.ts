import { TokenValue } from "@/classes/TokenValue";
import { PoolData } from "@/state/usePriceData";
import { DepositCrateData } from "@/utils/types";
import { chunk } from "lodash";
import { ContractFunctionParameters } from "viem";

import { abiSnippets } from "@/constants/abiSnippets";

const MAX_PER_CALL = 20;

const { getRemoveLiquidityOut, getAddLiquidityOut } = abiSnippets.wells;

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
  deposits: DepositCrateData[],
): ContractFunctionParameters<typeof getRemoveLiquidityOut>[][] {
  const contracts: ContractFunctionParameters<typeof getRemoveLiquidityOut>[] = [];

  const address = well.pool.address as `0x${string}`;

  deposits.forEach((deposit) => {
    contracts.push({
      address,
      abi: getRemoveLiquidityOut,
      functionName: "getRemoveLiquidityOut",
      args: [deposit.amount.toBigInt()],
    });
  });

  return chunk(contracts, MAX_PER_CALL);
}

const PipelineConvertUtils = {
  constructMulticall: {
    addLiquidity: constructAddLiquidityMulticall,
    removeLiquidityEqual: constructRemoveLiquidityMulticall,
  },
};

export default PipelineConvertUtils;
