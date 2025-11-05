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

const advancedPipe = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
          { internalType: "bytes", name: "clipboard", type: "bytes" },
        ],
        internalType: "struct AdvancedPipeCall[]",
        name: "pipes",
        type: "tuple[]",
      },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "advancedPipe",
    outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const advancedFarm = [
  {
    type: "function",
    inputs: [
      {
        name: "data",
        internalType: "struct AdvancedFarmCall[]",
        type: "tuple[]",
        components: [
          { name: "callData", internalType: "bytes", type: "bytes" },
          { name: "clipboard", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "advancedFarm",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
    stateMutability: "payable",
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

const getTokenUsdPrice = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenUsdPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const getTokenUsdTwap = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "lookback",
        type: "uint256",
      },
    ],
    name: "getTokenUsdTwap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const poolDeltaBNoCap = [
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "poolDeltaBNoCap",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const getMaxAmountIn = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
    ],
    name: "getMaxAmountIn",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const calculateDeltaBFromReserves = [
  {
    inputs: [
      {
        internalType: "address",
        name: "well",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "reserves",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "lookback",
        type: "uint256",
      },
    ],
    name: "calculateDeltaBFromReserves",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const well = [
  {
    inputs: [],
    name: "well",
    outputs: [
      { internalType: "contract IERC20[]", name: "_tokens", type: "address[]" },
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct Call",
        name: "_wellFunction",
        type: "tuple",
      },
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct Call[]",
        name: "_pumps",
        type: "tuple[]",
      },
      { internalType: "bytes", name: "_wellData", type: "bytes" },
      { internalType: "address", name: "_aquifer", type: "address" },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const getAmountOut = [
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const convert = [
  {
    inputs: [
      { internalType: "bytes", name: "convertData", type: "bytes" },
      { internalType: "int96[]", name: "stems", type: "int96[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    name: "convert",
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

const erc721Enum = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "tokenByIndex",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "tokenOfOwnerByIndex",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

export const abiSnippets = {
  advancedPipe,
  advancedFarm,
  wells: {
    getRemoveLiquidityOneTokenOut,
    getRemoveLiquidityOut,
    getAddLiquidityOut,
    well,
  },
  farmer: {
    balanceOfStalk,
  },
  price: {
    getTokenUsdPrice,
    getTokenUsdTwap,
  },
  pool: {
    poolDeltaBNoCap,
  },
  silo: {
    pipelineConvert,
    getMaxAmountIn,
    calculateDeltaBFromReserves,
    getAmountOut,
    convert,
  },
  erc721Enum,
} as const;
