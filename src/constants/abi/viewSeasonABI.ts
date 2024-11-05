export const viewSeasonABI = [
  {
    inputs: [],
    name: "time",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "current",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "lastSop",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "lastSopSeason",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "rainStart",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "raining",
            type: "bool",
          },
          {
            internalType: "uint64",
            name: "sunriseBlock",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "abovePeg",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "period",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bytes32[8]",
            name: "_buffer",
            type: "bytes32[8]",
          },
        ],
        internalType: "struct Season",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSeasonTimestamp",
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
    inputs: [],
    name: "seasonTime",
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
] as const;
