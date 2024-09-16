import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bean
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const beanAbi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const beanAddress = {
  1: '0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab',
  1337: '0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const beanConfig = { address: beanAddress, abi: beanAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// beanstalk
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const beanstalkAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'unripeToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underlyingToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'merkleRoot',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'AddUnripeToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underlying',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'ChangeUnderlying',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'underlying',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Chop',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Pick',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'underlyingToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SwitchUnderlyingToken',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'supply', internalType: 'uint256', type: 'uint256' },
    ],
    name: '_getPenalizedUnderlying',
    outputs: [{ name: 'redeem', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addMigratedUnderlying',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'underlyingToken', internalType: 'address', type: 'address' },
      { name: 'root', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'addUnripeToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'balanceOfPenalizedUnderlying',
    outputs: [{ name: 'underlying', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'balanceOfUnderlying',
    outputs: [{ name: 'underlying', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'chop',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLockedBeans',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'cumulativeReserves', internalType: 'bytes', type: 'bytes' },
      { name: 'timestamp', internalType: 'uint40', type: 'uint40' },
    ],
    name: 'getLockedBeansFromTwaReserves',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLockedBeansUnderlyingUnripeBean',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLockedBeansUnderlyingUnripeBeanEth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPenalizedUnderlying',
    outputs: [{ name: 'redeem', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unripeToken', internalType: 'address', type: 'address' }],
    name: 'getPenalty',
    outputs: [{ name: 'penalty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unripeToken', internalType: 'address', type: 'address' }],
    name: 'getPercentPenalty',
    outputs: [{ name: 'penalty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unripeToken', internalType: 'address', type: 'address' }],
    name: 'getRecapFundedPercent',
    outputs: [{ name: 'percent', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRecapPaidPercent',
    outputs: [{ name: 'percent', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unripeToken', internalType: 'address', type: 'address' }],
    name: 'getTotalUnderlying',
    outputs: [{ name: 'underlying', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getUnderlying',
    outputs: [
      { name: 'underlyingAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unripeToken', internalType: 'address', type: 'address' }],
    name: 'getUnderlyingPerUnripeToken',
    outputs: [
      { name: 'underlyingPerToken', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unripeToken', internalType: 'address', type: 'address' }],
    name: 'getUnderlyingToken',
    outputs: [
      { name: 'underlyingToken', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'unripeToken', internalType: 'address', type: 'address' }],
    name: 'isUnripe',
    outputs: [{ name: 'unripe', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'pick',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'picked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'newUnderlyingToken', internalType: 'address', type: 'address' },
    ],
    name: 'switchUnderlyingToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'bpf', internalType: 'uint128', type: 'uint128', indexed: false },
    ],
    name: 'SetFertilizer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatchFertilizer',
    outputs: [
      {
        name: '',
        internalType: 'struct IFertilizer.Balance[]',
        type: 'tuple[]',
        components: [
          { name: 'amount', internalType: 'uint128', type: 'uint128' },
          { name: 'lastBpf', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfFertilized',
    outputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOfFertilizer',
    outputs: [
      {
        name: '',
        internalType: 'struct IFertilizer.Balance',
        type: 'tuple',
        components: [
          { name: 'amount', internalType: 'uint128', type: 'uint128' },
          { name: 'lastBpf', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfUnfertilized',
    outputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'beansPerFertilizer',
    outputs: [{ name: 'bpf', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'claimFertilized',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveFertilizer',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentHumidity',
    outputs: [{ name: 'humidity', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEndBpf',
    outputs: [{ name: 'endBpf', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint128', type: 'uint128' }],
    name: 'getFertilizer',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFertilizers',
    outputs: [
      {
        name: 'fertilizers',
        internalType: 'struct FertilizerFacet.Supply[]',
        type: 'tuple[]',
        components: [
          { name: 'endBpf', internalType: 'uint128', type: 'uint128' },
          { name: 'supply', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFirst',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_s', internalType: 'uint128', type: 'uint128' }],
    name: 'getHumidity',
    outputs: [{ name: 'humidity', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLast',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'wethAmountIn', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMintFertilizerOut',
    outputs: [
      { name: 'fertilizerAmountOut', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint128', type: 'uint128' }],
    name: 'getNext',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isFertilizing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'wethAmountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'minFertilizerOut', internalType: 'uint256', type: 'uint256' },
      { name: 'minLPTokensOut', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'mintFertilizer',
    outputs: [
      { name: 'fertilizerAmountOut', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'payFertilizer',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'remainingRecapitalization',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalFertilizedBeans',
    outputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalFertilizerBeans',
    outputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalUnfertilizedBeans',
    outputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Pause',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timePassed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Unpause',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ownerCandidate',
    outputs: [
      { name: 'ownerCandidate_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_functionSelector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'facetAddress',
    outputs: [
      { name: 'facetAddress_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'facetAddresses',
    outputs: [
      { name: 'facetAddresses_', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_facet', internalType: 'address', type: 'address' }],
    name: 'facetFunctionSelectors',
    outputs: [
      {
        name: 'facetFunctionSelectors_',
        internalType: 'bytes4[]',
        type: 'bytes4[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'facets',
    outputs: [
      {
        name: 'facets_',
        internalType: 'struct IDiamondLoupe.Facet[]',
        type: 'tuple[]',
        components: [
          { name: 'facetAddress', internalType: 'address', type: 'address' },
          {
            name: 'functionSelectors',
            internalType: 'bytes4[]',
            type: 'bytes4[]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_diamondCut',
        internalType: 'struct IDiamondCut.FacetCut[]',
        type: 'tuple[]',
        components: [
          { name: 'facetAddress', internalType: 'address', type: 'address' },
          {
            name: 'action',
            internalType: 'enum IDiamondCut.FacetCutAction',
            type: 'uint8',
          },
          {
            name: 'functionSelectors',
            internalType: 'bytes4[]',
            type: 'bytes4[]',
          },
        ],
        indexed: false,
      },
      {
        name: '_init',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_calldata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'DiamondCut',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_diamondCut',
        internalType: 'struct IDiamondCut.FacetCut[]',
        type: 'tuple[]',
        components: [
          { name: 'facetAddress', internalType: 'address', type: 'address' },
          {
            name: 'action',
            internalType: 'enum IDiamondCut.FacetCutAction',
            type: 'uint8',
          },
          {
            name: 'functionSelectors',
            internalType: 'bytes4[]',
            type: 'bytes4[]',
          },
        ],
      },
      { name: '_init', internalType: 'address', type: 'address' },
      { name: '_calldata', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'diamondCut',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC1155', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchTransferERC1155',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20Permit', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitERC20',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC4494', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitERC721',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC1155', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferERC1155',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC721', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferERC721',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'token',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      { name: 'delta', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'InternalBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenApproval',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseTokenAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getAllBalance',
    outputs: [
      {
        name: 'b',
        internalType: 'struct TokenFacet.Balance',
        type: 'tuple',
        components: [
          { name: 'internalBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'externalBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'totalBalance', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'getAllBalances',
    outputs: [
      {
        name: 'balances',
        internalType: 'struct TokenFacet.Balance[]',
        type: 'tuple[]',
        components: [
          { name: 'internalBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'externalBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'totalBalance', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'getBalances',
    outputs: [
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getExternalBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'getExternalBalances',
    outputs: [
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getInternalBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'getInternalBalances',
    outputs: [
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseTokenAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'tokenAllowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenPermitDomainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'tokenPermitNonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'transferInternalTokenFrom',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'unwrapEth',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'wrapEth',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct AdvancedFarmCall[]',
        type: 'tuple[]',
        components: [
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'clipboard', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'advancedFarm',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'farm',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'pipes',
        internalType: 'struct AdvancedPipeCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'clipboard', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'advancedPipe',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct PipeCall',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'etherPipe',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'pipes',
        internalType: 'struct PipeCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'multiPipe',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct PipeCall',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'pipe',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct PipeCall',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'readPipe',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'registry', internalType: 'address', type: 'address' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'minAmountOut', internalType: 'uint256', type: 'uint256' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'addLiquidity',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'registry', internalType: 'address', type: 'address' },
      { name: 'fromToken', internalType: 'address', type: 'address' },
      { name: 'toToken', internalType: 'address', type: 'address' },
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountOut', internalType: 'uint256', type: 'uint256' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'exchange',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'fromToken', internalType: 'address', type: 'address' },
      { name: 'toToken', internalType: 'address', type: 'address' },
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountOut', internalType: 'uint256', type: 'uint256' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'exchangeUnderlying',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'registry', internalType: 'address', type: 'address' },
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountsOut', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'removeLiquidity',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'registry', internalType: 'address', type: 'address' },
      { name: 'amountsOut', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'maxAmountIn', internalType: 'uint256', type: 'uint256' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'removeLiquidityImbalance',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'address', type: 'address' },
      { name: 'registry', internalType: 'address', type: 'address' },
      { name: 'toToken', internalType: 'address', type: 'address' },
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountOut', internalType: 'uint256', type: 'uint256' },
      {
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
      },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'removeLiquidityOneToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'CompleteFundraiser',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'payee',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CreateFundraiser',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FundFundraiser',
  },
  {
    type: 'function',
    inputs: [
      { name: 'payee', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createFundraiser',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint32', type: 'uint32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'fund',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint32', type: 'uint32' }],
    name: 'fundingToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint32', type: 'uint32' }],
    name: 'fundraiser',
    outputs: [
      {
        name: '',
        internalType: 'struct Storage.Fundraiser',
        type: 'tuple',
        components: [
          { name: 'payee', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'total', internalType: 'uint256', type: 'uint256' },
          { name: 'remaining', internalType: 'uint256', type: 'uint256' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'numberOfFundraisers',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint32', type: 'uint32' }],
    name: 'remainingFunding',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint32', type: 'uint32' }],
    name: 'totalFunding',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'plots',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'beans',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Harvest',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PodListingCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'beans',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Sow',
  },
  {
    type: 'function',
    inputs: [
      { name: 'plots', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'harvestableIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxTemperature',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'plot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'podIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'remainingPods',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'beans', internalType: 'uint256', type: 'uint256' },
      { name: 'minTemperature', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'sow',
    outputs: [{ name: 'pods', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'beans', internalType: 'uint256', type: 'uint256' },
      { name: 'minTemperature', internalType: 'uint256', type: 'uint256' },
      { name: 'minSoil', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'sowWithMin',
    outputs: [{ name: 'pods', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'temperature',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalHarvestable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalHarvested',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalPods',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSoil',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalUnharvestable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'yield',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'pods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PlotTransfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'pods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PodApproval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'start',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pricePerPod',
        internalType: 'uint24',
        type: 'uint24',
        indexed: false,
      },
      {
        name: 'maxHarvestableIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'minFillAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pricingFunction',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'mode',
        internalType: 'enum LibTransfer.To',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'pricingType',
        internalType: 'enum LibPolynomial.PriceType',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'PodListingCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'start',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'costInBeans',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PodListingFilled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'PodOrderCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pricePerPod',
        internalType: 'uint24',
        type: 'uint24',
        indexed: false,
      },
      {
        name: 'maxPlaceInLine',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'minFillAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'pricingFunction',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'priceType',
        internalType: 'enum LibPolynomial.PriceType',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'PodOrderCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'start',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'costInBeans',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PodOrderFilled',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowancePods',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approvePods',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelPodListing',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
      { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'cancelPodOrder',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'cancelPodOrderV2',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
      { name: 'maxHarvestableIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'createPodListing',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'maxHarvestableIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'createPodListingV2',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'beanAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
      { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'createPodOrder',
    outputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'beanAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'createPodOrderV2',
    outputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'l',
        internalType: 'struct Listing.PodListing',
        type: 'tuple',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'index', internalType: 'uint256', type: 'uint256' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
          {
            name: 'maxHarvestableIndex',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
        ],
      },
      { name: 'beanAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'fillPodListing',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'l',
        internalType: 'struct Listing.PodListing',
        type: 'tuple',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'index', internalType: 'uint256', type: 'uint256' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
          {
            name: 'maxHarvestableIndex',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
        ],
      },
      { name: 'beanAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'fillPodListingV2',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'o',
        internalType: 'struct Order.PodOrder',
        type: 'tuple',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
          { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
          { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'fillPodOrder',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'o',
        internalType: 'struct Order.PodOrder',
        type: 'tuple',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
          { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
          { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'fillPodOrderV2',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'placeInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'amountPodsFromOrder', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getAmountBeansToFillOrderV2',
    outputs: [{ name: 'beanAmount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'placeInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'podListingAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'fillBeanAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getAmountPodsFromFillListingV2',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'podListing',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
      { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'podOrder',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'podOrderById',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
      { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'pricingFunction', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'podOrderV2',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'end', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferPlot',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfGrownStalkUpToStemsDeployment',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfLegacySeeds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'season', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'getDepositLegacy',
    outputs: [
      { name: '', internalType: 'uint128', type: 'uint128' },
      { name: '', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'seasons', internalType: 'uint32[][]', type: 'uint32[][]' },
      { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
      { name: 'stalkDiff', internalType: 'uint256', type: 'uint256' },
      { name: 'seedsDiff', internalType: 'uint256', type: 'uint256' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'mowAndMigrate',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'mowAndMigrateNoDeposits',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'totalMigratedBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'stem', internalType: 'int96', type: 'int96', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'bdv', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'RemoveDeposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'stems',
        internalType: 'int96[]',
        type: 'int96[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'bdvs',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'RemoveDeposits',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'enrootDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'enrootDeposits',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIn', internalType: 'address', type: 'address' },
      { name: 'tokenOut', internalType: 'address', type: 'address' },
      { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getAmountOut',
    outputs: [{ name: 'amountOut', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIn', internalType: 'address', type: 'address' },
      { name: 'tokenOut', internalType: 'address', type: 'address' },
    ],
    name: 'getMaxAmountIn',
    outputs: [{ name: 'amountIn', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'toToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fromAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Convert',
  },
  {
    type: 'function',
    inputs: [
      { name: 'convertData', internalType: 'bytes', type: 'bytes' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'convert',
    outputs: [
      { name: 'toStem', internalType: 'int96', type: 'int96' },
      { name: 'fromAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'toAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'fromBdv', internalType: 'uint256', type: 'uint256' },
      { name: 'toBdv', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'beanToBDV',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'curveToBDV',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'unripeBeanToBDV',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'unripeLPToBDV',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'wellBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositApproval',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseDepositAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'depositAllowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'depositPermitDomainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'depositPermitNonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseDepositAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitDeposits',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'dewhitelistToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSiloTokens',
    outputs: [{ name: 'tokens', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getWhitelistStatus',
    outputs: [
      {
        name: '_whitelistStatuses',
        internalType: 'struct Storage.WhitelistStatus',
        type: 'tuple',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'isWhitelisted', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedLp', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedWell', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWhitelistStatuses',
    outputs: [
      {
        name: '_whitelistStatuses',
        internalType: 'struct Storage.WhitelistStatus[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'isWhitelisted', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedLp', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedWell', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWhitelistedLpTokens',
    outputs: [{ name: 'tokens', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWhitelistedTokens',
    outputs: [{ name: 'tokens', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWhitelistedWellLpTokens',
    outputs: [{ name: 'tokens', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'gaugePointSelector', internalType: 'bytes4', type: 'bytes4' },
      {
        name: 'liquidityWeightSelector',
        internalType: 'bytes4',
        type: 'bytes4',
      },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
      },
    ],
    name: 'updateGaugeForToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stalkEarnedPerSeason', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'updateStalkPerBdvPerSeasonForToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
      { name: 'stalkIssuedPerBdv', internalType: 'uint32', type: 'uint32' },
      { name: 'stalkEarnedPerSeason', internalType: 'uint32', type: 'uint32' },
      { name: 'gaugePointSelector', internalType: 'bytes4', type: 'bytes4' },
      {
        name: 'liquidityWeightSelector',
        internalType: 'bytes4',
        type: 'bytes4',
      },
      { name: 'gaugePoints', internalType: 'uint128', type: 'uint128' },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
      },
    ],
    name: 'whitelistToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
      { name: 'stalkIssuedPerBdv', internalType: 'uint32', type: 'uint32' },
      { name: 'stalkEarnedPerSeason', internalType: 'uint32', type: 'uint32' },
      { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
      { name: 'gaugePointSelector', internalType: 'bytes4', type: 'bytes4' },
      {
        name: 'liquidityWeightSelector',
        internalType: 'bytes4',
        type: 'bytes4',
      },
      { name: 'gaugePoints', internalType: 'uint128', type: 'uint128' },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
      },
    ],
    name: 'whitelistTokenWithEncodeType',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'depositId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'depositIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'balanceOfDepositedBdv',
    outputs: [
      { name: 'depositedBdv', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfEarnedBeans',
    outputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfEarnedStalk',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfFinishedGerminatingStalkAndRoots',
    outputs: [
      { name: 'gStalk', internalType: 'uint256', type: 'uint256' },
      { name: 'gRoots', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfGerminatingStalk',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'balanceOfGrownStalk',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfPlenty',
    outputs: [{ name: 'plenty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfRainRoots',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfRoots',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfSop',
    outputs: [
      {
        name: 'sop',
        internalType: 'struct SiloGettersFacet.AccountSeasonOfPlenty',
        type: 'tuple',
        components: [
          { name: 'lastRain', internalType: 'uint32', type: 'uint32' },
          { name: 'lastSop', internalType: 'uint32', type: 'uint32' },
          { name: 'roots', internalType: 'uint256', type: 'uint256' },
          { name: 'plentyPerRoot', internalType: 'uint256', type: 'uint256' },
          { name: 'plenty', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfStalk',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfYoungAndMatureGerminatingStalk',
    outputs: [
      {
        name: 'matureGerminatingStalk',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'youngGerminatingStalk',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'bdv',
    outputs: [{ name: '_bdv', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
    ],
    name: 'getDeposit',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
    ],
    name: 'getDepositId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getEvenGerminating',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'season', internalType: 'uint32', type: 'uint32' }],
    name: 'getGerminatingRootsForSeason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'season', internalType: 'uint32', type: 'uint32' }],
    name: 'getGerminatingStalkAndRootsForSeason',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'season', internalType: 'uint32', type: 'uint32' }],
    name: 'getGerminatingStalkForSeason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getGerminatingStem',
    outputs: [
      { name: 'germinatingStem', internalType: 'int96', type: 'int96' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokens', internalType: 'address[]', type: 'address[]' }],
    name: 'getGerminatingStems',
    outputs: [
      { name: 'germinatingStems', internalType: 'int96[]', type: 'int96[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getGerminatingTotalDeposited',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getGerminatingTotalDepositedBdv',
    outputs: [{ name: '_bdv', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getLastMowedStem',
    outputs: [{ name: 'lastStem', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getLegacySeedsPerToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getMowStatus',
    outputs: [
      {
        name: 'mowStatus',
        internalType: 'struct Account.MowStatus',
        type: 'tuple',
        components: [
          { name: 'lastStem', internalType: 'int96', type: 'int96' },
          { name: 'bdv', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getOddGerminating',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTotalDeposited',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTotalDepositedBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTotalGerminatingAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTotalGerminatingBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalGerminatingStalk',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getYoungAndMatureGerminatingTotalStalk',
    outputs: [
      {
        name: 'matureGerminatingStalk',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'youngGerminatingStalk',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
    ],
    name: 'grownStalkForDeposit',
    outputs: [{ name: 'grownStalk', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastSeasonOfPlenty',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'lastUpdate',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'migrationNeeded',
    outputs: [{ name: 'hasMigrated', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'season', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'seasonToStem',
    outputs: [{ name: 'stem', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stemStartSeason',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'stemTipForToken',
    outputs: [{ name: '_stemTip', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'tokenSettings',
    outputs: [
      {
        name: '',
        internalType: 'struct Storage.SiloSettings',
        type: 'tuple',
        components: [
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          {
            name: 'stalkEarnedPerSeason',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'stalkIssuedPerBdv', internalType: 'uint32', type: 'uint32' },
          { name: 'milestoneSeason', internalType: 'uint32', type: 'uint32' },
          { name: 'milestoneStem', internalType: 'int96', type: 'int96' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          {
            name: 'deltaStalkEarnedPerSeason',
            internalType: 'int24',
            type: 'int24',
          },
          { name: 'gpSelector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'lwSelector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'gaugePoints', internalType: 'uint128', type: 'uint128' },
          {
            name: 'optimalPercentDepositedBdv',
            internalType: 'uint64',
            type: 'uint64',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalEarnedBeans',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalRoots',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalStalk',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'stem', internalType: 'int96', type: 'int96', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'bdv', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AddDeposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'plenty',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimPlenty',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'beans',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Plant',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'delta', internalType: 'int256', type: 'int256', indexed: false },
      {
        name: 'deltaRoots',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'StalkBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimPlenty',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'deposit',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: '_bdv', internalType: 'uint256', type: 'uint256' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'mow',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'mowMultiple',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'plant',
    outputs: [
      { name: 'beans', internalType: 'uint256', type: 'uint256' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'depositIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'depositId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferDeposit',
    outputs: [{ name: '_bdv', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'transferDeposits',
    outputs: [{ name: 'bdvs', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'withdrawDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'withdrawDeposits',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'season', internalType: 'uint32', type: 'uint32' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'claimWithdrawal',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'seasons', internalType: 'uint32[]', type: 'uint32[]' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'claimWithdrawals',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTotalWithdrawn',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'season', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'getWithdrawal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DewhitelistToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'gpSelector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      {
        name: 'lwSelector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'UpdateGaugeSettings',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'stalkEarnedPerSeason',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'season',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'UpdatedStalkPerBdvPerSeason',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      {
        name: 'stalkEarnedPerSeason',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'stalkIssuedPerBdv',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'gpSelector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      {
        name: 'lwSelector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      {
        name: 'gaugePoints',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'WhitelistToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'season',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'gaugePoints',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GaugePointChange',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newStalkPerBdvPerSeason',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UpdateAverageStalkPerBdvPerSeason',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'season',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RemoveWithdrawal',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'seasons',
        internalType: 'uint32[]',
        type: 'uint32[]',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RemoveWithdrawals',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'delta', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'SeedsBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'deltaGerminatingStalk',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'germinationState',
        internalType: 'enum LibGerminate.Germinate',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'FarmerGerminatingStalkBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'germinationSeason',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'deltaAmount',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'deltaBdv',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'TotalGerminatingBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'germinationSeason',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'deltaGerminatingStalk',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'TotalGerminatingStalkChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'deltaStalk',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'deltaRoots',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'TotalStalkChangedFromGermination',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'isWhitelisted',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'isWhitelistedLp',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'isWhitelistedWell',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'AddWhitelistStatus',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RemoveWhitelistStatus',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'isWhitelisted',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'isWhitelistedLp',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'isWhitelistedWell',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'UpdateWhitelistStatus',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'season', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'well',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'deltaB',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'cumulativeReserves',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'WellOracle',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'currentGaugePoints', internalType: 'uint256', type: 'uint256' },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'percentOfDepositedBdv',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'defaultGaugePointFunction',
    outputs: [
      { name: 'newGaugePoints', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'abovePeg',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'currentGaugePoints', internalType: 'uint256', type: 'uint256' },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'percentOfDepositedBdv',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'calcGaugePointsWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAverageGrownStalkPerBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAverageGrownStalkPerBdvPerSeason',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBeanEthGaugePointsPerBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBeanGaugePointsPerBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBeanToMaxLpGpPerBdvRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBeanToMaxLpGpPerBdvRatioScaled',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeltaPodDemand',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getGaugePoints',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getGaugePointsPerBdvForToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'getGaugePointsPerBdvForWell',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getGaugePointsWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGrownStalkIssuedPerGp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGrownStalkIssuedPerSeason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLargestLiqWell',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLiquidityToSupplyRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPodRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSeedGauge',
    outputs: [
      {
        name: '',
        internalType: 'struct Storage.SeedGauge',
        type: 'tuple',
        components: [
          {
            name: 'averageGrownStalkPerBdvPerSeason',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'beanToMaxLpGpPerBdvRatio',
            internalType: 'uint128',
            type: 'uint128',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSopWell',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalBdv',
    outputs: [{ name: 'totalBdv', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalUsdLiquidity',
    outputs: [
      { name: 'totalLiquidity', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalWeightedUsdLiquidity',
    outputs: [
      {
        name: 'totalWeightedLiquidity',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'getTwaLiquidityForWell',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'getWeightedTwaLiquidityForWell',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_season', internalType: 'uint32', type: 'uint32' }],
    name: 'plentyPerRoot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'poolDeltaB',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rain',
    outputs: [
      {
        name: '',
        internalType: 'struct Storage.Rain',
        type: 'tuple',
        components: [
          { name: 'deprecated', internalType: 'uint256', type: 'uint256' },
          { name: 'pods', internalType: 'uint256', type: 'uint256' },
          { name: 'roots', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'season',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sunriseBlock',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'time',
    outputs: [
      {
        name: '',
        internalType: 'struct Storage.Season',
        type: 'tuple',
        components: [
          { name: 'current', internalType: 'uint32', type: 'uint32' },
          { name: 'lastSop', internalType: 'uint32', type: 'uint32' },
          { name: 'withdrawSeasons', internalType: 'uint8', type: 'uint8' },
          { name: 'lastSopSeason', internalType: 'uint32', type: 'uint32' },
          { name: 'rainStart', internalType: 'uint32', type: 'uint32' },
          { name: 'raining', internalType: 'bool', type: 'bool' },
          { name: 'fertilizing', internalType: 'bool', type: 'bool' },
          { name: 'sunriseBlock', internalType: 'uint32', type: 'uint32' },
          { name: 'abovePeg', internalType: 'bool', type: 'bool' },
          { name: 'stemStartSeason', internalType: 'uint16', type: 'uint16' },
          { name: 'stemScaleSeason', internalType: 'uint16', type: 'uint16' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'period', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalDeltaB',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'weather',
    outputs: [
      {
        name: '',
        internalType: 'struct Storage.Weather',
        type: 'tuple',
        components: [
          {
            name: 'deprecated',
            internalType: 'uint256[2]',
            type: 'uint256[2]',
          },
          { name: 'lastDSoil', internalType: 'uint128', type: 'uint128' },
          { name: 'lastSowTime', internalType: 'uint32', type: 'uint32' },
          { name: 'thisSowTime', internalType: 'uint32', type: 'uint32' },
          { name: 't', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'wellOracleSnapshot',
    outputs: [{ name: 'snapshot', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'season',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'caseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'absChange',
        internalType: 'int80',
        type: 'int80',
        indexed: false,
      },
    ],
    name: 'BeanToMaxLpGpPerBdvRatioChange',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'season', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'toField',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toSilo',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toFertilizer',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Reward',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'season',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'well',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toField',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SeasonOfPlenty',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'season', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'soil',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Soil',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'season',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Sunrise',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'season',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'caseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'absChange', internalType: 'int8', type: 'int8', indexed: false },
    ],
    name: 'TemperatureChange',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'gm',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'seasonTime',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sunrise',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const beanstalkAddress = {
  1: '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5',
  1337: '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const beanstalkConfig = {
  address: beanstalkAddress,
  abi: beanstalkAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// beanstalkPrice
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 */
export const beanstalkPriceAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'beanstalk', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'wellAddress', internalType: 'address', type: 'address' }],
    name: 'getConstantProductWell',
    outputs: [
      {
        name: 'pool',
        internalType: 'struct P.Pool',
        type: 'tuple',
        components: [
          { name: 'pool', internalType: 'address', type: 'address' },
          { name: 'tokens', internalType: 'address[2]', type: 'address[2]' },
          { name: 'balances', internalType: 'uint256[2]', type: 'uint256[2]' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
          { name: 'deltaB', internalType: 'int256', type: 'int256' },
          { name: 'lpUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'lpBdv', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurve',
    outputs: [
      {
        name: 'pool',
        internalType: 'struct P.Pool',
        type: 'tuple',
        components: [
          { name: 'pool', internalType: 'address', type: 'address' },
          { name: 'tokens', internalType: 'address[2]', type: 'address[2]' },
          { name: 'balances', internalType: 'uint256[2]', type: 'uint256[2]' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
          { name: 'deltaB', internalType: 'int256', type: 'int256' },
          { name: 'lpUsd', internalType: 'uint256', type: 'uint256' },
          { name: 'lpBdv', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'price',
    outputs: [
      {
        name: 'p',
        internalType: 'struct BeanstalkPrice.Prices',
        type: 'tuple',
        components: [
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
          { name: 'deltaB', internalType: 'int256', type: 'int256' },
          {
            name: 'ps',
            internalType: 'struct P.Pool[]',
            type: 'tuple[]',
            components: [
              { name: 'pool', internalType: 'address', type: 'address' },
              {
                name: 'tokens',
                internalType: 'address[2]',
                type: 'address[2]',
              },
              {
                name: 'balances',
                internalType: 'uint256[2]',
                type: 'uint256[2]',
              },
              { name: 'price', internalType: 'uint256', type: 'uint256' },
              { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
              { name: 'deltaB', internalType: 'int256', type: 'int256' },
              { name: 'lpUsd', internalType: 'uint256', type: 'uint256' },
              { name: 'lpBdv', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 */
export const beanstalkPriceAddress = {
  1: '0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4',
  1337: '0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 */
export const beanstalkPriceConfig = {
  address: beanstalkPriceAddress,
  abi: beanstalkPriceAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// depot
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const depotAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'pipes',
        internalType: 'struct AdvancedPipeCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'clipboard', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'advancedPipe',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC1155', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchTransferERC1155',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct PipeCall',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'etherPipe',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'farm',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'pipes',
        internalType: 'struct PipeCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'multiPipe',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitDeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitDeposits',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20Permit', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitERC20',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC4494', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitERC721',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permitToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct PipeCall',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'pipe',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct PipeCall',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'readPipe',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferDeposit',
    outputs: [{ name: 'bdv', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'transferDeposits',
    outputs: [{ name: 'bdvs', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC1155', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferERC1155',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC721', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferERC721',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'fromMode', internalType: 'enum From', type: 'uint8' },
      { name: 'toMode', internalType: 'enum To', type: 'uint8' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const depotAddress = {
  1: '0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2',
  1337: '0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const depotConfig = { address: depotAddress, abi: depotAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// pipeline
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const pipelineAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'pipes',
        internalType: 'struct AdvancedPipeCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'clipboard', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'advancedPipe',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'pipes',
        internalType: 'struct PipeCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'multiPipe',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'p',
        internalType: 'struct PipeCall',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'pipe',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const pipelineAddress = {
  1: '0xb1bE0000C6B3C62749b5F0c92480146452D15423',
  1337: '0xb1bE0000C6B3C62749b5F0c92480146452D15423',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const pipelineConfig = {
  address: pipelineAddress,
  abi: pipelineAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useReadBean_undefined = /*#__PURE__*/ createUseReadContract({
  abi: beanAbi,
  address: beanAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useReadBean_Allowance = /*#__PURE__*/ createUseReadContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useReadBean_BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useReadBean_Decimals = /*#__PURE__*/ createUseReadContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useReadBean_Name = /*#__PURE__*/ createUseReadContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useReadBean_Symbol = /*#__PURE__*/ createUseReadContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useReadBean_TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useWriteBean_undefined = /*#__PURE__*/ createUseWriteContract({
  abi: beanAbi,
  address: beanAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useWriteBean_Approve = /*#__PURE__*/ createUseWriteContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useWriteBean_Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useWriteBean_TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useSimulateBean_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanAbi,
    address: beanAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useSimulateBean_Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: beanAbi,
  address: beanAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useSimulateBean_Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: beanAbi, address: beanAddress, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useSimulateBean_TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanAbi,
    address: beanAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useWatchBean_undefined = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: beanAbi, address: beanAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useWatchBean_Approval = /*#__PURE__*/ createUseWatchContractEvent({
  abi: beanAbi,
  address: beanAddress,
  eventName: 'Approval',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab)
 * -
 */
export const useWatchBean_Transfer = /*#__PURE__*/ createUseWatchContractEvent({
  abi: beanAbi,
  address: beanAddress,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_undefined = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"_getPenalizedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetPenalizedUnderlying =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: '_getPenalizedUnderlying',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfPenalizedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfPenalizedUnderlying =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfPenalizedUnderlying',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfUnderlying =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfUnderlying',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLockedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLockedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLockedBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLockedBeansFromTwaReserves"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLockedBeansFromTwaReserves =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLockedBeansFromTwaReserves',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLockedBeansUnderlyingUnripeBean"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLockedBeansUnderlyingUnripeBean =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLockedBeansUnderlyingUnripeBean',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLockedBeansUnderlyingUnripeBeanEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLockedBeansUnderlyingUnripeBeanEth =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLockedBeansUnderlyingUnripeBeanEth',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPenalizedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetPenalizedUnderlying_duplicated =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPenalizedUnderlying',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPenalty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetPenalty = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getPenalty',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPercentPenalty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetPercentPenalty =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPercentPenalty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRecapFundedPercent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetRecapFundedPercent =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRecapFundedPercent',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRecapPaidPercent"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetRecapPaidPercent =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRecapPaidPercent',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalUnderlying =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalUnderlying',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetUnderlying =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getUnderlying',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getUnderlyingPerUnripeToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetUnderlyingPerUnripeToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getUnderlyingPerUnripeToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getUnderlyingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetUnderlyingToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getUnderlyingToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"isUnripe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_IsUnripe = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'isUnripe',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"picked"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Picked = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'picked',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfBatchFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfBatchFertilizer =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfBatchFertilizer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfFertilized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfFertilized =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfFertilized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfFertilizer =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfFertilizer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfUnfertilized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfUnfertilized =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfUnfertilized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"beansPerFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BeansPerFertilizer =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'beansPerFertilizer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getActiveFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetActiveFertilizer =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getActiveFertilizer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getCurrentHumidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetCurrentHumidity =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getCurrentHumidity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getEndBpf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetEndBpf = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getEndBpf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetFertilizer =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getFertilizer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getFertilizers"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetFertilizers =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getFertilizers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getFirst"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetFirst = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getFirst',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getHumidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetHumidity = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getHumidity' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLast"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLast = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getLast',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMintFertilizerOut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetMintFertilizerOut =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMintFertilizerOut',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getNext"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetNext = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getNext',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"isFertilizing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_IsFertilizing =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'isFertilizing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"remainingRecapitalization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_RemainingRecapitalization =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'remainingRecapitalization',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalFertilizedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalFertilizedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalFertilizedBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalFertilizerBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalFertilizerBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalFertilizerBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalUnfertilizedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalUnfertilizedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalUnfertilizedBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Owner = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"ownerCandidate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_OwnerCandidate =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'ownerCandidate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"facetAddress"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_FacetAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'facetAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"facetAddresses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_FacetAddresses =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'facetAddresses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"facetFunctionSelectors"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_FacetFunctionSelectors =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'facetFunctionSelectors',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"facets"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Facets = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'facets',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAllBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetAllBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAllBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAllBalances"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetAllBalances =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAllBalances',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetBalance = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getBalance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBalances"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetBalances = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getBalances' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getExternalBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetExternalBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getExternalBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getExternalBalances"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetExternalBalances =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getExternalBalances',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getInternalBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetInternalBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getInternalBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getInternalBalances"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetInternalBalances =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getInternalBalances',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_OnErc1155BatchReceived =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"onERC1155Received"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_OnErc1155Received =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"tokenAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TokenAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'tokenAllowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"tokenPermitDomainSeparator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TokenPermitDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'tokenPermitDomainSeparator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"tokenPermitNonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TokenPermitNonces =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'tokenPermitNonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"readPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_ReadPipe = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'readPipe',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fundingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_FundingToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fundingToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fundraiser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Fundraiser = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'fundraiser',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"numberOfFundraisers"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_NumberOfFundraisers =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'numberOfFundraisers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"remainingFunding"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_RemainingFunding =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'remainingFunding',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalFunding"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalFunding =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalFunding',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"harvestableIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_HarvestableIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'harvestableIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"maxTemperature"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_MaxTemperature =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'maxTemperature',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"plot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Plot = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'plot',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"podIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_PodIndex = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'podIndex',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"remainingPods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_RemainingPods =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'remainingPods',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"temperature"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Temperature = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'temperature' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalHarvestable"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalHarvestable =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalHarvestable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalHarvested"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalHarvested =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalHarvested',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalPods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalPods = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'totalPods',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalSoil"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalSoil = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'totalSoil',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalUnharvestable"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalUnharvestable =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalUnharvestable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"yield"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Yield = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'yield',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"allowancePods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_AllowancePods =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'allowancePods',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAmountBeansToFillOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetAmountBeansToFillOrderV2 =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAmountBeansToFillOrderV2',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAmountPodsFromFillListingV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetAmountPodsFromFillListingV2 =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAmountPodsFromFillListingV2',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"podListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_PodListing = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'podListing',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"podOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_PodOrder = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'podOrder',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"podOrderById"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_PodOrderById =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'podOrderById',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"podOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_PodOrderV2 = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'podOrderV2',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfGrownStalkUpToStemsDeployment"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfGrownStalkUpToStemsDeployment =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfGrownStalkUpToStemsDeployment',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfLegacySeeds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfLegacySeeds =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfLegacySeeds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDepositLegacy"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetDepositLegacy =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDepositLegacy',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalMigratedBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalMigratedBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalMigratedBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAmountOut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetAmountOut =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAmountOut',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMaxAmountIn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetMaxAmountIn =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMaxAmountIn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"beanToBDV"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BeanToBdv = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'beanToBDV',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"curveToBDV"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_CurveToBdv = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'curveToBDV',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"unripeBeanToBDV"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_UnripeBeanToBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'unripeBeanToBDV',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"unripeLPToBDV"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_UnripeLpToBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'unripeLPToBDV',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"wellBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_WellBdv = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'wellBdv',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"depositAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_DepositAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'depositAllowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"depositPermitDomainSeparator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_DepositPermitDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'depositPermitDomainSeparator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"depositPermitNonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_DepositPermitNonces =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'depositPermitNonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"isApprovedForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSiloTokens"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetSiloTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSiloTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWhitelistStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetWhitelistStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWhitelistStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWhitelistStatuses"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetWhitelistStatuses =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWhitelistStatuses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWhitelistedLpTokens"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetWhitelistedLpTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWhitelistedLpTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWhitelistedTokens"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetWhitelistedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWhitelistedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWhitelistedWellLpTokens"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetWhitelistedWellLpTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWhitelistedWellLpTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfBatch"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfDepositedBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfDepositedBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfDepositedBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfEarnedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfEarnedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfEarnedBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfEarnedStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfEarnedStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfEarnedStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfFinishedGerminatingStalkAndRoots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfFinishedGerminatingStalkAndRoots =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfFinishedGerminatingStalkAndRoots',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfGerminatingStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfGerminatingStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfGerminatingStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfGrownStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfGrownStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfGrownStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfPlenty =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfPlenty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfRainRoots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfRainRoots =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfRainRoots',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfRoots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfRoots =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfRoots',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfSop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfSop =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfSop',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfYoungAndMatureGerminatingStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_BalanceOfYoungAndMatureGerminatingStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfYoungAndMatureGerminatingStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"bdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Bdv = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'bdv',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetDeposit = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getDeposit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDepositId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetDepositId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDepositId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getEvenGerminating"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetEvenGerminating =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getEvenGerminating',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGerminatingRootsForSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGerminatingRootsForSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingRootsForSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGerminatingStalkAndRootsForSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGerminatingStalkAndRootsForSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingStalkAndRootsForSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGerminatingStalkForSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGerminatingStalkForSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingStalkForSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGerminatingStem"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGerminatingStem =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGerminatingStems"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGerminatingStems =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingStems',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGerminatingTotalDeposited"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGerminatingTotalDeposited =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingTotalDeposited',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGerminatingTotalDepositedBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGerminatingTotalDepositedBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingTotalDepositedBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLastMowedStem"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLastMowedStem =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLastMowedStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLegacySeedsPerToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLegacySeedsPerToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLegacySeedsPerToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMowStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetMowStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMowStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getOddGerminating"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetOddGerminating =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getOddGerminating',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalDeposited"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalDeposited =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalDeposited',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalDepositedBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalDepositedBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalDepositedBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalGerminatingAmount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalGerminatingAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalGerminatingAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalGerminatingBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalGerminatingBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalGerminatingBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalGerminatingStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalGerminatingStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalGerminatingStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getYoungAndMatureGerminatingTotalStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetYoungAndMatureGerminatingTotalStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getYoungAndMatureGerminatingTotalStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"grownStalkForDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GrownStalkForDeposit =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'grownStalkForDeposit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"lastSeasonOfPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_LastSeasonOfPlenty =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'lastSeasonOfPlenty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"lastUpdate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_LastUpdate = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'lastUpdate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"migrationNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_MigrationNeeded =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'migrationNeeded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"seasonToStem"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_SeasonToStem =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'seasonToStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"stemStartSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_StemStartSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'stemStartSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"stemTipForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_StemTipForToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'stemTipForToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"tokenSettings"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TokenSettings =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'tokenSettings',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalEarnedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalEarnedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalEarnedBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalRoots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalRoots = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'totalRoots',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalStalk = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'totalStalk',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalWithdrawn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalWithdrawn =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalWithdrawn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWithdrawal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetWithdrawal =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWithdrawal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"maxWeight"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_MaxWeight = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'maxWeight',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"defaultGaugePointFunction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_DefaultGaugePointFunction =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'defaultGaugePointFunction',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"abovePeg"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_AbovePeg = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'abovePeg',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"calcGaugePointsWithParams"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_CalcGaugePointsWithParams =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'calcGaugePointsWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAverageGrownStalkPerBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetAverageGrownStalkPerBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAverageGrownStalkPerBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAverageGrownStalkPerBdvPerSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetAverageGrownStalkPerBdvPerSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAverageGrownStalkPerBdvPerSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanEthGaugePointsPerBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetBeanEthGaugePointsPerBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeanEthGaugePointsPerBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanGaugePointsPerBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetBeanGaugePointsPerBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeanGaugePointsPerBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanToMaxLpGpPerBdvRatio"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetBeanToMaxLpGpPerBdvRatio =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeanToMaxLpGpPerBdvRatio',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanToMaxLpGpPerBdvRatioScaled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetBeanToMaxLpGpPerBdvRatioScaled =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeanToMaxLpGpPerBdvRatioScaled',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDeltaPodDemand"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetDeltaPodDemand =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDeltaPodDemand',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugePoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGaugePoints =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugePoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugePointsPerBdvForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGaugePointsPerBdvForToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugePointsPerBdvForToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugePointsPerBdvForWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGaugePointsPerBdvForWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugePointsPerBdvForWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugePointsWithParams"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGaugePointsWithParams =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugePointsWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGrownStalkIssuedPerGp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGrownStalkIssuedPerGp =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGrownStalkIssuedPerGp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGrownStalkIssuedPerSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetGrownStalkIssuedPerSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGrownStalkIssuedPerSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLargestLiqWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLargestLiqWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLargestLiqWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLiquidityToSupplyRatio"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetLiquidityToSupplyRatio =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLiquidityToSupplyRatio',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPodRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetPodRate = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getPodRate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSeedGauge"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetSeedGauge =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSeedGauge',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSopWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetSopWell = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getSopWell',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalBdv = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getTotalBdv' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalUsdLiquidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalUsdLiquidity =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalUsdLiquidity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalWeightedUsdLiquidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTotalWeightedUsdLiquidity =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalWeightedUsdLiquidity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTwaLiquidityForWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetTwaLiquidityForWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTwaLiquidityForWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWeightedTwaLiquidityForWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_GetWeightedTwaLiquidityForWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWeightedTwaLiquidityForWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Paused = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"plentyPerRoot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_PlentyPerRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'plentyPerRoot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"poolDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_PoolDeltaB = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'poolDeltaB',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"rain"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Rain = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'rain',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"season"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Season = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'season',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sunriseBlock"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_SunriseBlock =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'sunriseBlock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"time"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Time = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'time',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_TotalDeltaB = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'totalDeltaB' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"weather"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_Weather = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'weather',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"wellOracleSnapshot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_WellOracleSnapshot =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'wellOracleSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"seasonTime"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useReadBeanstalk_SeasonTime = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'seasonTime',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_undefined = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addMigratedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_AddMigratedUnderlying =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'addMigratedUnderlying',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addUnripeToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_AddUnripeToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'addUnripeToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"chop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Chop = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'chop',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pick"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Pick = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'pick',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"switchUnderlyingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_SwitchUnderlyingToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'switchUnderlyingToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimFertilized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ClaimFertilized =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimFertilized',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mintFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_MintFertilizer =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mintFertilizer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"payFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_PayFertilizer =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'payFertilizer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Pause = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Unpause = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ClaimOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"diamondCut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_DiamondCut =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'diamondCut',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"batchTransferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_BatchTransferErc1155 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'batchTransferERC1155',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_PermitErc20 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitERC20',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_PermitErc721 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitERC721',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferErc1155 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferERC1155',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferErc721 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferERC721',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ApproveToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"decreaseTokenAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_DecreaseTokenAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'decreaseTokenAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"increaseTokenAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_IncreaseTokenAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'increaseTokenAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_PermitToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferInternalTokenFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferInternalTokenFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferInternalTokenFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"unwrapEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_UnwrapEth = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'unwrapEth' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"wrapEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_WrapEth = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'wrapEth',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"advancedFarm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_AdvancedFarm =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'advancedFarm',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"farm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Farm = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'farm',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"advancedPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_AdvancedPipe =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'advancedPipe',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"etherPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_EtherPipe = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'etherPipe' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"multiPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_MultiPipe = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'multiPipe' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Pipe = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'pipe',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addLiquidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_AddLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'addLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"exchange"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Exchange = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'exchange',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"exchangeUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ExchangeUnderlying =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'exchangeUnderlying',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"removeLiquidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_RemoveLiquidity =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'removeLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"removeLiquidityImbalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_RemoveLiquidityImbalance =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'removeLiquidityImbalance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"removeLiquidityOneToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_RemoveLiquidityOneToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'removeLiquidityOneToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createFundraiser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CreateFundraiser =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createFundraiser',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fund"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Fund = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'fund',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"harvest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Harvest = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'harvest',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Sow = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'sow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sowWithMin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_SowWithMin =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'sowWithMin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approvePods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ApprovePods =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approvePods',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CancelPodListing =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodListing',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CancelPodOrder =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodOrder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelPodOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CancelPodOrderV2 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodOrderV2',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CreatePodListing =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodListing',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodListingV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CreatePodListingV2 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodListingV2',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CreatePodOrder =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodOrder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_CreatePodOrderV2 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodOrderV2',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_FillPodListing =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodListing',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodListingV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_FillPodListingV2 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodListingV2',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_FillPodOrder =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodOrder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_FillPodOrderV2 =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodOrderV2',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferPlot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferPlot =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferPlot',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAndMigrate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_MowAndMigrate =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowAndMigrate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAndMigrateNoDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_MowAndMigrateNoDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowAndMigrateNoDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"enrootDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_EnrootDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'enrootDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"enrootDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_EnrootDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'enrootDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"convert"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Convert = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'convert',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ApproveDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"decreaseDepositAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_DecreaseDepositAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'decreaseDepositAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"increaseDepositAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_IncreaseDepositAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'increaseDepositAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_PermitDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_PermitDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"dewhitelistToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_DewhitelistToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'dewhitelistToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateGaugeForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_UpdateGaugeForToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateGaugeForToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateStalkPerBdvPerSeasonForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_UpdateStalkPerBdvPerSeasonForToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateStalkPerBdvPerSeasonForToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"whitelistToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_WhitelistToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'whitelistToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"whitelistTokenWithEncodeType"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_WhitelistTokenWithEncodeType =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'whitelistTokenWithEncodeType',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ClaimPlenty =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimPlenty',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Deposit = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Mow = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'mow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowMultiple"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_MowMultiple =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowMultiple',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"plant"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Plant = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'plant',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_TransferDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"withdrawDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_WithdrawDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'withdrawDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"withdrawDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_WithdrawDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'withdrawDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimWithdrawal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ClaimWithdrawal =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimWithdrawal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimWithdrawals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_ClaimWithdrawals =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimWithdrawals',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"gm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Gm = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'gm',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sunrise"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWriteBeanstalk_Sunrise = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'sunrise',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addMigratedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_AddMigratedUnderlying =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'addMigratedUnderlying',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addUnripeToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_AddUnripeToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'addUnripeToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"chop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Chop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'chop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pick"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Pick =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pick',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"switchUnderlyingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_SwitchUnderlyingToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'switchUnderlyingToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimFertilized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ClaimFertilized =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimFertilized',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mintFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_MintFertilizer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mintFertilizer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"payFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_PayFertilizer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'payFertilizer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Pause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Unpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ClaimOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"diamondCut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_DiamondCut =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'diamondCut',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"batchTransferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_BatchTransferErc1155 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'batchTransferERC1155',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_PermitErc20 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitERC20',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_PermitErc721 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitERC721',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferErc1155 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferERC1155',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferErc721 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferERC721',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ApproveToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"decreaseTokenAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_DecreaseTokenAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'decreaseTokenAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"increaseTokenAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_IncreaseTokenAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'increaseTokenAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_PermitToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferInternalTokenFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferInternalTokenFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferInternalTokenFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"unwrapEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_UnwrapEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'unwrapEth',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"wrapEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_WrapEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'wrapEth',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"advancedFarm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_AdvancedFarm =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'advancedFarm',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"farm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Farm =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'farm',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"advancedPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_AdvancedPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'advancedPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"etherPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_EtherPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'etherPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"multiPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_MultiPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'multiPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Pipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addLiquidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_AddLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'addLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"exchange"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Exchange =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'exchange',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"exchangeUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ExchangeUnderlying =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'exchangeUnderlying',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"removeLiquidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_RemoveLiquidity =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'removeLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"removeLiquidityImbalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_RemoveLiquidityImbalance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'removeLiquidityImbalance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"removeLiquidityOneToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_RemoveLiquidityOneToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'removeLiquidityOneToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createFundraiser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CreateFundraiser =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createFundraiser',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fund"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Fund =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fund',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"harvest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Harvest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'harvest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Sow = /*#__PURE__*/ createUseSimulateContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'sow' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sowWithMin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_SowWithMin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'sowWithMin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approvePods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ApprovePods =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approvePods',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CancelPodListing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodListing',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CancelPodOrder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodOrder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelPodOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CancelPodOrderV2 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodOrderV2',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CreatePodListing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodListing',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodListingV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CreatePodListingV2 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodListingV2',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CreatePodOrder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodOrder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_CreatePodOrderV2 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodOrderV2',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_FillPodListing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodListing',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodListingV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_FillPodListingV2 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodListingV2',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_FillPodOrder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodOrder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodOrderV2"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_FillPodOrderV2 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodOrderV2',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferPlot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferPlot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferPlot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAndMigrate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_MowAndMigrate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowAndMigrate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAndMigrateNoDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_MowAndMigrateNoDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowAndMigrateNoDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"enrootDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_EnrootDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'enrootDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"enrootDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_EnrootDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'enrootDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"convert"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Convert =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'convert',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ApproveDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"decreaseDepositAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_DecreaseDepositAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'decreaseDepositAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"increaseDepositAllowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_IncreaseDepositAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'increaseDepositAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_PermitDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"permitDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_PermitDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'permitDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"dewhitelistToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_DewhitelistToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'dewhitelistToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateGaugeForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_UpdateGaugeForToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateGaugeForToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateStalkPerBdvPerSeasonForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_UpdateStalkPerBdvPerSeasonForToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateStalkPerBdvPerSeasonForToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"whitelistToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_WhitelistToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'whitelistToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"whitelistTokenWithEncodeType"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_WhitelistTokenWithEncodeType =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'whitelistTokenWithEncodeType',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ClaimPlenty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimPlenty',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Deposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Mow = /*#__PURE__*/ createUseSimulateContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'mow' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowMultiple"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_MowMultiple =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowMultiple',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"plant"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Plant =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'plant',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_TransferDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"withdrawDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_WithdrawDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'withdrawDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"withdrawDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_WithdrawDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'withdrawDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimWithdrawal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ClaimWithdrawal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimWithdrawal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimWithdrawals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_ClaimWithdrawals =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimWithdrawals',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"gm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Gm = /*#__PURE__*/ createUseSimulateContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'gm',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sunrise"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useSimulateBeanstalk_Sunrise =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'sunrise',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_undefined =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"AddUnripeToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_AddUnripeToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'AddUnripeToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ChangeUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_ChangeUnderlying =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ChangeUnderlying',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Chop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Chop = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: beanstalkAbi, address: beanstalkAddress, eventName: 'Chop' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Pick"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Pick = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: beanstalkAbi, address: beanstalkAddress, eventName: 'Pick' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SwitchUnderlyingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_SwitchUnderlyingToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SwitchUnderlyingToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SetFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_SetFertilizer =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SetFertilizer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Pause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Pause =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Pause',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Unpause"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Unpause =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Unpause',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_OwnershipTransferred =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"DiamondCut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_DiamondCut =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'DiamondCut',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"InternalBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_InternalBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'InternalBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TokenApproval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_TokenApproval =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TokenApproval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"CompleteFundraiser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_CompleteFundraiser =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'CompleteFundraiser',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"CreateFundraiser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_CreateFundraiser =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'CreateFundraiser',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"FundFundraiser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_FundFundraiser =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'FundFundraiser',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Harvest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Harvest =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Harvest',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PodListingCancelled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PodListingCancelled =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodListingCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Sow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Sow = /*#__PURE__*/ createUseWatchContractEvent({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  eventName: 'Sow',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PlotTransfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PlotTransfer =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PlotTransfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PodApproval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PodApproval =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodApproval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PodListingCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PodListingCreated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodListingCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PodListingFilled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PodListingFilled =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodListingFilled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PodOrderCancelled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PodOrderCancelled =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodOrderCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PodOrderCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PodOrderCreated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodOrderCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PodOrderFilled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_PodOrderFilled =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodOrderFilled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_RemoveDeposit =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_RemoveDeposits =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveDeposits',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Convert"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Convert =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Convert',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_ApprovalForAll =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"DepositApproval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_DepositApproval =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'DepositApproval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"AddDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_AddDeposit =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'AddDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ClaimPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_ClaimPlenty =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ClaimPlenty',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Plant"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Plant =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Plant',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"StalkBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_StalkBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'StalkBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TransferBatch"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_TransferBatch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TransferSingle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_TransferSingle =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"DewhitelistToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_DewhitelistToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'DewhitelistToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdateGaugeSettings"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_UpdateGaugeSettings =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdateGaugeSettings',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedStalkPerBdvPerSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_UpdatedStalkPerBdvPerSeason =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdatedStalkPerBdvPerSeason',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"WhitelistToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_WhitelistToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'WhitelistToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"GaugePointChange"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_GaugePointChange =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'GaugePointChange',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdateAverageStalkPerBdvPerSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_UpdateAverageStalkPerBdvPerSeason =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdateAverageStalkPerBdvPerSeason',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveWithdrawal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_RemoveWithdrawal =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveWithdrawal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveWithdrawals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_RemoveWithdrawals =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveWithdrawals',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SeedsBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_SeedsBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SeedsBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"FarmerGerminatingStalkBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_FarmerGerminatingStalkBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'FarmerGerminatingStalkBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TotalGerminatingBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_TotalGerminatingBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TotalGerminatingBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TotalGerminatingStalkChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_TotalGerminatingStalkChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TotalGerminatingStalkChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TotalStalkChangedFromGermination"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_TotalStalkChangedFromGermination =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TotalStalkChangedFromGermination',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"AddWhitelistStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_AddWhitelistStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'AddWhitelistStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveWhitelistStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_RemoveWhitelistStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveWhitelistStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdateWhitelistStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_UpdateWhitelistStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdateWhitelistStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"WellOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_WellOracle =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'WellOracle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"BeanToMaxLpGpPerBdvRatioChange"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_BeanToMaxLpGpPerBdvRatioChange =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'BeanToMaxLpGpPerBdvRatioChange',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Reward"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Reward =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Reward',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SeasonOfPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_SeasonOfPlenty =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SeasonOfPlenty',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Soil"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Soil = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: beanstalkAbi, address: beanstalkAddress, eventName: 'Soil' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Sunrise"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_Sunrise =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Sunrise',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TemperatureChange"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 */
export const useWatchBeanstalk_TemperatureChange =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TemperatureChange',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 */
export const useReadBeanstalkPrice_undefined =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getConstantProductWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 */
export const useReadBeanstalkPrice_GetConstantProductWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getConstantProductWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getCurve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 */
export const useReadBeanstalkPrice_GetCurve =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getCurve',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"price"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 */
export const useReadBeanstalkPrice_Price = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkPriceAbi,
  address: beanstalkPriceAddress,
  functionName: 'price',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link depotAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useReadDepot_undefined = /*#__PURE__*/ createUseReadContract({
  abi: depotAbi,
  address: depotAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"readPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useReadDepot_ReadPipe = /*#__PURE__*/ createUseReadContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'readPipe',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"version"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useReadDepot_Version = /*#__PURE__*/ createUseReadContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'version',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_undefined = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"advancedPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_AdvancedPipe = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'advancedPipe',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"batchTransferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_BatchTransferErc1155 =
  /*#__PURE__*/ createUseWriteContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'batchTransferERC1155',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"etherPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_EtherPipe = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'etherPipe',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"farm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_Farm = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'farm',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"multiPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_MultiPipe = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'multiPipe',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_PermitDeposit = /*#__PURE__*/ createUseWriteContract(
  { abi: depotAbi, address: depotAddress, functionName: 'permitDeposit' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_PermitDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'permitDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_PermitErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'permitERC20',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_PermitErc721 = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'permitERC721',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_PermitToken = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'permitToken',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"pipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_Pipe = /*#__PURE__*/ createUseWriteContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'pipe',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_TransferDeposit =
  /*#__PURE__*/ createUseWriteContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferDeposit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_TransferDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_TransferErc1155 =
  /*#__PURE__*/ createUseWriteContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferERC1155',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_TransferErc721 =
  /*#__PURE__*/ createUseWriteContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferERC721',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useWriteDepot_TransferToken = /*#__PURE__*/ createUseWriteContract(
  { abi: depotAbi, address: depotAddress, functionName: 'transferToken' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"advancedPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_AdvancedPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'advancedPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"batchTransferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_BatchTransferErc1155 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'batchTransferERC1155',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"etherPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_EtherPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'etherPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"farm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_Farm = /*#__PURE__*/ createUseSimulateContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'farm',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"multiPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_MultiPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'multiPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_PermitDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'permitDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_PermitDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'permitDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitERC20"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_PermitErc20 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'permitERC20',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_PermitErc721 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'permitERC721',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_PermitToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'permitToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"pipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_Pipe = /*#__PURE__*/ createUseSimulateContract({
  abi: depotAbi,
  address: depotAddress,
  functionName: 'pipe',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_TransferDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_TransferDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_TransferErc1155 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferERC1155',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferERC721"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_TransferErc721 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferERC721',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"transferToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 */
export const useSimulateDepot_TransferToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: depotAbi,
    address: depotAddress,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pipelineAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useReadPipeline_undefined = /*#__PURE__*/ createUseReadContract({
  abi: pipelineAbi,
  address: pipelineAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useReadPipeline_SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"version"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useReadPipeline_Version = /*#__PURE__*/ createUseReadContract({
  abi: pipelineAbi,
  address: pipelineAddress,
  functionName: 'version',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pipelineAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useWritePipeline_undefined = /*#__PURE__*/ createUseWriteContract({
  abi: pipelineAbi,
  address: pipelineAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"advancedPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useWritePipeline_AdvancedPipe =
  /*#__PURE__*/ createUseWriteContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'advancedPipe',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"multiPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useWritePipeline_MultiPipe = /*#__PURE__*/ createUseWriteContract({
  abi: pipelineAbi,
  address: pipelineAddress,
  functionName: 'multiPipe',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useWritePipeline_OnErc1155BatchReceived =
  /*#__PURE__*/ createUseWriteContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"onERC1155Received"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useWritePipeline_OnErc1155Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"onERC721Received"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useWritePipeline_OnErc721Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"pipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useWritePipeline_Pipe = /*#__PURE__*/ createUseWriteContract({
  abi: pipelineAbi,
  address: pipelineAddress,
  functionName: 'pipe',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pipelineAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useSimulatePipeline_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pipelineAbi,
    address: pipelineAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"advancedPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useSimulatePipeline_AdvancedPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'advancedPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"multiPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useSimulatePipeline_MultiPipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'multiPipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useSimulatePipeline_OnErc1155BatchReceived =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"onERC1155Received"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useSimulatePipeline_OnErc1155Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"onERC721Received"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useSimulatePipeline_OnErc721Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: pipelineAbi,
    address: pipelineAddress,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link pipelineAbi}__ and `functionName` set to `"pipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 */
export const useSimulatePipeline_Pipe = /*#__PURE__*/ createUseSimulateContract(
  { abi: pipelineAbi, address: pipelineAddress, functionName: 'pipe' },
)
