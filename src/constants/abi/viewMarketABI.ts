export const ViewMarketABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fieldId",
        type: "uint256",
      },
    ],
    name: "allowancePods",
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
        components: [
          {
            internalType: "address",
            name: "orderer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "fieldId",
            type: "uint256",
          },
          {
            internalType: "uint24",
            name: "pricePerPod",
            type: "uint24",
          },
          {
            internalType: "uint256",
            name: "maxPlaceInLine",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minFillAmount",
            type: "uint256",
          },
        ],
        internalType: "struct Order.PodOrder",
        name: "podOrder",
        type: "tuple",
      },
    ],
    name: "getOrderId",
    outputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fieldId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getPodListing",
    outputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getPodOrder",
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
