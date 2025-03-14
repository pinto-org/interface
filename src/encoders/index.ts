import advancedPipe from "./advancedPipe";
import erc20Approve from "./erc20Approve";
import erc20Transfer from "./erc20Transfer";
import balanceOfRainRoots from "./farmerSilo/balanceOfRainRoots";
import balanceOfStalk from "./farmerSilo/balanceOfStalk";
import junctionCheck from "./junction/junctionCheck";
import junctionDiv from "./junction/junctionDiv";
import junctionGte from "./junction/junctionGte";
import junctionMul from "./junction/junctionMul";
import junctionMulDiv from "./junction/junctionMulDiv";
import junctionSub from "./junction/junctionSub";
import shift from "./shift";
import convert, { getMaxAmountIn, getAmountOut } from "./silo/convert";
import { pipelineConvert } from "./silo/pipelineConvert";
import siloWithdraw from "./silo/withdraw";
import sync from "./sync";
import transferToken from "./transferToken";
import unwrapEth from "./unwrapEth";
import calcReserveAtRatioLiquidity from "./well/calcReserveAtRatioLiquidity";
import getRemoveLiquidityImbalancedIn from "./well/getRemoveLiquidityImbalancedIn";
import getWellSwapOut from "./well/getWellSwapOut";
import swapFrom from "./well/swapFrom";
import wellRemoveLiquidity, { wellRemoveLiquidityOneToken } from "./wellRemoveLiquidity";
import wrapEth from "./wrapEth";

const encoders = {
  advancedPipe,

  // junction
  junction: {
    check: junctionCheck,
    gte: junctionGte,
    sub: junctionSub,
    mulDiv: junctionMulDiv,
    mul: junctionMul,
    div: junctionDiv,
  },

  silo: {
    pipelineConvert,
    convert,
    withdraw: siloWithdraw,
    getMaxAmountIn,
    getAmountOut,
  },

  token: {
    transferToken,
    erc20Transfer,
    erc20Approve,
    unwrapEth,
    wrapEth,
  },

  well: {
    removeLiquidity: wellRemoveLiquidity,
    removeLiquidityOneToken: wellRemoveLiquidityOneToken,
    getSwapOut: getWellSwapOut,
    shift: shift,
    sync: sync,
    swapFrom,
    getRemoveLiquidityImbalancedIn,
    calcReserveAtRatioLiquidity,
  },

  farmerSilo: {
    balanceOfStalk,
    balanceOfRainRoots,
  },
};

export default encoders;
