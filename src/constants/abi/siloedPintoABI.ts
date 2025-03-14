export const siloedPintoABI = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'asset',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'claim',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'convertToAssets',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'convertToShares',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositAdvanced',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      },
      {
        name: 'toMode',
        type: 'uint8',
        internalType: 'enum To'
      }
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositFromSilo',
    inputs: [
      {
        name: 'stems',
        type: 'int96[]',
        internalType: 'int96[]'
      },
      {
        name: 'amounts',
        type: 'uint256[]',
        internalType: 'uint256[]'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'toMode',
        type: 'uint8',
        internalType: 'enum To'
      }
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'deposits',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'stem',
        type: 'int96',
        internalType: 'int96'
      },
      {
        name: 'amount',
        type: 'uint160',
        internalType: 'uint160'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'floodAssetsPresent',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'floodTranchRatio',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'germinatingDeposits',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'stem',
        type: 'int96',
        internalType: 'int96'
      },
      {
        name: 'amount',
        type: 'uint160',
        internalType: 'uint160'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getDeposit',
    inputs: [
      {
        name: 'index',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct AbstractSiloedPinto.SiloDeposit',
        components: [
          {
            name: 'stem',
            type: 'int96',
            internalType: 'int96'
          },
          {
            name: 'amount',
            type: 'uint160',
            internalType: 'uint160'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getDepositsLength',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getGerminatingDepositsLength',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getMaxRedeem',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getMaxWithdraw',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: '_maxTriggerPrice',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: '_slippageRatio',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: '_floodTranchRatio',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: '_vestingPeriod',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: '_minSize',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: '_targetMinSize',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'lastEarnedTimestamp',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'maxDeposit',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'maxMint',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'maxRedeem',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'maxTriggerPrice',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'maxWithdraw',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'minSize',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'mintAdvanced',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      },
      {
        name: 'toMode',
        type: 'uint8',
        internalType: 'enum To'
      }
    ],
    outputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'previewDeposit',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'previewMint',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'previewRedeem',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'previewWithdraw',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'redeem',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'redeemAdvanced',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      },
      {
        name: 'toMode',
        type: 'uint8',
        internalType: 'enum To'
      }
    ],
    outputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'redeemToSilo',
    inputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      }
    ],
    outputs: [
      {
        name: 'stems',
        type: 'int96[]',
        internalType: 'int96[]'
      },
      {
        name: 'amounts',
        type: 'uint256[]',
        internalType: 'uint256[]'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'rescueTokens',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setFloodTranchRatio',
    inputs: [
      {
        name: '_floodTranchRatio',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setMaxTriggerPrice',
    inputs: [
      {
        name: '_maxTriggerPrice',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setMinSize',
    inputs: [
      {
        name: '_minSize',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setSlippageRatio',
    inputs: [
      {
        name: '_slippageRatio',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setTargetMinSize',
    inputs: [
      {
        name: '_targetMinSize',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setVestingPeriod',
    inputs: [
      {
        name: '_vestingPeriod',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'slippageRatio',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'targetMinSize',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalAssets',
    inputs: [],
    outputs: [
      {
        name: 'totalManagedAssets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'trancheSizes',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'underlyingPdv',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'unvestedAssets',
    inputs: [],
    outputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'version',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    name: 'vestingPeriod',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'vestingPinto',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawAdvanced',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      },
      {
        name: 'toMode',
        type: 'uint8',
        internalType: 'enum To'
      }
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawToSilo',
    inputs: [
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'fromMode',
        type: 'uint8',
        internalType: 'enum From'
      }
    ],
    outputs: [
      {
        name: 'stems',
        type: 'int96[]',
        internalType: 'int96[]'
      },
      {
        name: 'amounts',
        type: 'uint256[]',
        internalType: 'uint256[]'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'spender',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'assets',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'shares',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Update',
    inputs: [
      {
        name: 'totalAssets',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'totalShares',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Withdraw',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'assets',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'shares',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'DepositNotInserted',
    inputs: []
  },
  {
    type: 'error',
    name: 'ERC20InsufficientAllowance',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'allowance',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InsufficientBalance',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidApprover',
    inputs: [
      {
        name: 'approver',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidReceiver',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidSender',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC20InvalidSpender',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC4626ExceededMaxDeposit',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'max',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC4626ExceededMaxMint',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'max',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC4626ExceededMaxRedeem',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'shares',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'max',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC4626ExceededMaxWithdraw',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'assets',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'max',
        type: 'uint256',
        internalType: 'uint256'
      }
    ]
  },
  {
    type: 'error',
    name: 'InsufficientDepositAmount',
    inputs: []
  },
  {
    type: 'error',
    name: 'InvalidGerminatingStem',
    inputs: []
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: []
  },
  {
    type: 'error',
    name: 'InvalidMode',
    inputs: []
  },
  {
    type: 'error',
    name: 'InvalidToken',
    inputs: []
  },
  {
    type: 'error',
    name: 'MinPdvViolation',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotInitializing',
    inputs: []
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'PdvDecrease',
    inputs: []
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: []
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'StemsAmountMismatch',
    inputs: []
  },
  {
    type: 'error',
    name: 'ZeroAssets',
    inputs: []
  },
  {
    type: 'error',
    name: 'ZeroShares',
    inputs: []
  }
] as const;