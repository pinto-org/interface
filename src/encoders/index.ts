import advancedPipe from "./advancedPipe";
import erc20Approve from "./erc20Approve";
import erc20Transfer from "./erc20Transfer";
import balanceOfStalk from "./farmerSilo/balanceOfStalk";
import junctionCheck from "./junction/junctionCheck";
import junctionGte from "./junction/junctionGte";
import { pipelineConvert } from "./silo/pipelineConvert";
import wellRemoveLiquidity, { wellRemoveLiquidityOneToken } from "./wellRemoveLiquidity";

const encoders = {
  advancedPipe,

  // junction
  junction: {
    check: junctionCheck,
    gte: junctionGte,
  },

  silo: {
    pipelineConvert,
  },

  token: {
    erc20Transfer,
    erc20Approve,
  },

  well: {
    removeLiquidity: wellRemoveLiquidity,
    removeLiquidityOneToken: wellRemoveLiquidityOneToken,
  },

  farmerSilo: {
    balanceOfStalk,
  },
};

export default encoders;
