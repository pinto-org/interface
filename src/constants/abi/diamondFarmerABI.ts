export const diamondFarmerABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOfStalk",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOfSop",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "lastRain",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "lastSop",
            type: "uint32",
          },
          {
            internalType: "uint256",
            name: "roots",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "well",
                type: "address",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "plentyPerRoot",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "plenty",
                    type: "uint256",
                  },
                  {
                    internalType: "bytes32[4]",
                    name: "_buffer",
                    type: "bytes32[4]",
                  },
                ],
                internalType: "struct PerWellPlenty",
                name: "wellsPlenty",
                type: "tuple",
              },
            ],
            internalType: "struct SiloGettersFacet.FarmerSops[]",
            name: "farmerSops",
            type: "tuple[]",
          },
        ],
        internalType: "struct SiloGettersFacet.AccountSeasonOfPlenty",
        name: "sop",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "balanceOfGrownStalk",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOfEarnedBeans",
    outputs: [
      {
        internalType: "uint256",
        name: "beans",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "fieldId", internalType: "uint256", type: "uint256" },
    ],
    name: "getPlotsFromAccount",
    outputs: [
      {
        name: "plots",
        internalType: "struct FieldFacet.Plot[]",
        type: "tuple[]",
        components: [
          { name: "index", internalType: "uint256", type: "uint256" },
          { name: "pods", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "balanceOfGrownStalkMultiple",
    outputs: [
      {
        internalType: "uint256[]",
        name: "grownStalks",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address[]", name: "tokens", type: "address[]" },
    ],
    name: "getMowStatus",
    outputs: [
      {
        components: [
          { internalType: "int96", name: "lastStem", type: "int96" },
          { internalType: "uint128", name: "bdv", type: "uint128" },
        ],
        internalType: "struct MowStatus[]",
        name: "mowStatuses",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
