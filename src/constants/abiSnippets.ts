const pipelineConvert = [
  {
    inputs: [
      { internalType: "address", name: "inputToken", type: "address" },
      { internalType: "int96[]", name: "stems", type: "int96[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "address", name: "outputToken", type: "address" },
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "bytes", name: "clipboard", type: "bytes" },
        ],
        internalType: "struct AdvancedPipeCall[]",
        name: "advancedPipeCalls",
        type: "tuple[]",
      },
    ],
    name: "pipelineConvert",
    outputs: [
      { internalType: "int96", name: "toStem", type: "int96" },
      { internalType: "uint256", name: "fromAmount", type: "uint256" },
      { internalType: "uint256", name: "toAmount", type: "uint256" },
      { internalType: "uint256", name: "fromBdv", type: "uint256" },
      { internalType: "uint256", name: "toBdv", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const getRemoveLiquidityOut = [
  {
    inputs: [{ internalType: "uint256", name: "lpAmountIn", type: "uint256" }],
    name: "getRemoveLiquidityOut",
    outputs: [{ internalType: "uint256[]", name: "tokenAmountsOut", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const getRemoveLiquidityOneTokenOut = [
  {
    inputs: [
      { internalType: "uint256", name: "lpAmountIn", type: "uint256" },
      { internalType: "contract IERC20", name: "tokenOut", type: "address" },
    ],
    name: "getRemoveLiquidityOneTokenOut",
    outputs: [{ internalType: "uint256", name: "tokenAmountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const getAddLiquidityOut = [
  {
    inputs: [{ internalType: "uint256[]", name: "tokenAmountsIn", type: "uint256[]" }],
    name: "getAddLiquidityOut",
    outputs: [{ internalType: "uint256", name: "lpAmountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const balanceOfStalk = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOfStalk",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const abiSnippets = {
  pipelineConvert,
  wells: {
    getRemoveLiquidityOneTokenOut,
    getRemoveLiquidityOut,
    getAddLiquidityOut,
  },
  farmer: {
    balanceOfStalk,
  },
} as const;
