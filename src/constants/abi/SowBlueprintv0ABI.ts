export const sowBlueprintv0ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_beanstalk",
        type: "address",
      },
      {
        internalType: "address",
        name: "_siloHelpers",
        type: "address",
      },
      {
        internalType: "address",
        name: "_priceManipulation",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPaused",
        type: "bool",
      },
    ],
    name: "FunctionPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SowBlueprintv0.RewardType",
        name: "rewardType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "publisher",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "amount",
        type: "int256",
      },
    ],
    name: "OperatorReward",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    name: "functionPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orderHash",
        type: "bytes32",
      },
    ],
    name: "getCounter",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "blueprintHash",
        type: "bytes32",
      },
    ],
    name: "getLastExecutedSeason",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
    ],
    name: "pauseFunction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint8[]",
                name: "sourceTokenIndices",
                type: "uint8[]",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "totalAmountToSow",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "minAmountToSowPerSeason",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxAmountToSowPerSeason",
                    type: "uint256",
                  },
                ],
                internalType: "struct SowBlueprintv0.SowAmounts",
                name: "sowAmounts",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "minTemp",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "maxPodlineLength",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "maxGrownStalkPerBdv",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "runBlocksAfterSunrise",
                type: "uint256",
              },
            ],
            internalType: "struct SowBlueprintv0.SowParams",
            name: "sowParams",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address[]",
                name: "whitelistedOperators",
                type: "address[]",
              },
              {
                internalType: "address",
                name: "tipAddress",
                type: "address",
              },
              {
                internalType: "int256",
                name: "operatorTipAmount",
                type: "int256",
              },
            ],
            internalType: "struct SowBlueprintv0.OperatorParams",
            name: "opParams",
            type: "tuple",
          },
        ],
        internalType: "struct SowBlueprintv0.SowBlueprintStruct",
        name: "params",
        type: "tuple",
      },
    ],
    name: "sowBlueprintv0",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
    ],
    name: "unpauseFunction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
