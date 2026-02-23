export const automateClaimBlueprintABI = [
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "minMowAmount",
                type: "uint256",
              },
              {
                internalType: "int256",
                name: "minTwaDeltaB",
                type: "int256",
              },
              {
                internalType: "uint256",
                name: "minPlantAmount",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "fieldId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "minHarvestAmount",
                    type: "uint256",
                  },
                ],
                internalType: "struct AutomateClaimBlueprint.FieldHarvestConfig[]",
                name: "fieldHarvestConfigs",
                type: "tuple[]",
              },
              {
                internalType: "uint256",
                name: "minRinseAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minUnripeClaimAmount",
                type: "uint256",
              },
              {
                internalType: "uint256[]",
                name: "sourceTokenIndices",
                type: "uint256[]",
              },
              {
                internalType: "uint256",
                name: "maxGrownStalkPerBdv",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "slippageRatio",
                type: "uint256",
              },
            ],
            internalType: "struct AutomateClaimBlueprint.AutomateClaimParams",
            name: "claimParams",
            type: "tuple",
          },
          {
            components: [
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
                    internalType: "uint256",
                    name: "operatorTipAmount",
                    type: "uint256",
                  },
                ],
                internalType: "struct AutomateClaimBlueprint.OperatorParams",
                name: "baseOpParams",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "mowTipAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "plantTipAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "harvestTipAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "rinseTipAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "unripeClaimTipAmount",
                type: "uint256",
              },
            ],
            internalType: "struct AutomateClaimBlueprint.OperatorParamsExtended",
            name: "opParams",
            type: "tuple",
          },
        ],
        internalType: "struct AutomateClaimBlueprint.AutomateClaimBlueprintStruct",
        name: "params",
        type: "tuple",
      },
    ],
    name: "automateClaimBlueprint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
