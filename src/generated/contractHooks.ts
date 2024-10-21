import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// beanstalk
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const beanstalkAbi = [
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
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
    name: 'getLockedBeansUnderlyingUnripeLP',
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
    inputs: [],
    name: 'getRecapitalized',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
      { name: 'unripeToken', internalType: 'address', type: 'address' },
      { name: 'newUnderlyingToken', internalType: 'address', type: 'address' },
    ],
    name: 'switchUnderlyingToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'SafeCastOverflowedIntDowncast',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  { type: 'error', inputs: [], name: 'T' },
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
      { name: 'tokenAmountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'barnRaiseToken', internalType: 'address', type: 'address' },
    ],
    name: '_getMintFertilizerOut',
    outputs: [
      { name: 'fertilizerAmountOut', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
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
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'beginBarnRaiseMigration',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'getBarnRaiseToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBarnRaiseWell',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
      { name: 'tokenAmountIn', internalType: 'uint256', type: 'uint256' },
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
    name: 'getTotalRecapDollarsNeeded',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'leftoverBeans',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAmountIn', internalType: 'uint256', type: 'uint256' },
      { name: 'minFertilizerOut', internalType: 'uint256', type: 'uint256' },
      { name: 'minLPTokensOut', internalType: 'uint256', type: 'uint256' },
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
    name: 'rinsableSprouts',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rinsedSprouts',
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
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'blueprintHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'CancelBlueprint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'requisition',
        internalType: 'struct LibTractor.Requisition',
        type: 'tuple',
        components: [
          {
            name: 'blueprint',
            internalType: 'struct LibTractor.Blueprint',
            type: 'tuple',
            components: [
              { name: 'publisher', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
              {
                name: 'operatorPasteInstrs',
                internalType: 'bytes32[]',
                type: 'bytes32[]',
              },
              { name: 'maxNonce', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'endTime', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'blueprintHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'PublishRequisition',
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
      {
        name: 'blueprintHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'Tractor',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'TractorVersionSet',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'requisition',
        internalType: 'struct LibTractor.Requisition',
        type: 'tuple',
        components: [
          {
            name: 'blueprint',
            internalType: 'struct LibTractor.Blueprint',
            type: 'tuple',
            components: [
              { name: 'publisher', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
              {
                name: 'operatorPasteInstrs',
                internalType: 'bytes32[]',
                type: 'bytes32[]',
              },
              { name: 'maxNonce', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'endTime', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'blueprintHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'cancelBlueprint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'blueprint',
        internalType: 'struct LibTractor.Blueprint',
        type: 'tuple',
        components: [
          { name: 'publisher', internalType: 'address', type: 'address' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          {
            name: 'operatorPasteInstrs',
            internalType: 'bytes32[]',
            type: 'bytes32[]',
          },
          { name: 'maxNonce', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getBlueprintHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'blueprintHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getBlueprintNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'counterId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getCounter',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'counterId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getPublisherCounter',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTractorVersion',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'requisition',
        internalType: 'struct LibTractor.Requisition',
        type: 'tuple',
        components: [
          {
            name: 'blueprint',
            internalType: 'struct LibTractor.Blueprint',
            type: 'tuple',
            components: [
              { name: 'publisher', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
              {
                name: 'operatorPasteInstrs',
                internalType: 'bytes32[]',
                type: 'bytes32[]',
              },
              { name: 'maxNonce', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'endTime', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'blueprintHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'publishRequisition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'requisition',
        internalType: 'struct LibTractor.Requisition',
        type: 'tuple',
        components: [
          {
            name: 'blueprint',
            internalType: 'struct LibTractor.Blueprint',
            type: 'tuple',
            components: [
              { name: 'publisher', internalType: 'address', type: 'address' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
              {
                name: 'operatorPasteInstrs',
                internalType: 'bytes32[]',
                type: 'bytes32[]',
              },
              { name: 'maxNonce', internalType: 'uint256', type: 'uint256' },
              { name: 'startTime', internalType: 'uint256', type: 'uint256' },
              { name: 'endTime', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'blueprintHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'operatorData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'tractor',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'counterId', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'updateType',
        internalType: 'enum LibTractor.CounterUpdateType',
        type: 'uint8',
      },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updatePublisherCounter',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'version', internalType: 'string', type: 'string' }],
    name: 'updateTractorVersion',
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
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
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
        name: 'fromMode',
        internalType: 'enum LibTransfer.From',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'toMode',
        internalType: 'enum LibTransfer.To',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'TokenTransferred',
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
    type: 'error',
    inputs: [
      { name: 'prod1', internalType: 'uint256', type: 'uint256' },
      { name: 'denominator', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'PRBMath__MulDivOverflow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ActiveFieldSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FieldAdded',
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
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
        name: 'lister',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
    inputs: [],
    name: 'activeField',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'addField',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOfPods',
    outputs: [{ name: 'pods', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'fieldCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPlotIndexesFromAccount',
    outputs: [
      { name: 'plotIndexes', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPlotsFromAccount',
    outputs: [
      {
        name: 'plots',
        internalType: 'struct FieldFacet.Plot[]',
        type: 'tuple[]',
        components: [
          { name: 'index', internalType: 'uint256', type: 'uint256' },
          { name: 'pods', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: 'plots', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
    name: 'harvestableIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
    name: 'isHarvesting',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'plot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
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
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: '_temperature', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setActiveField',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
    name: 'totalHarvestable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalHarvestableForActiveField',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
    name: 'totalHarvested',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
    name: 'totalUnharvestable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
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
        name: 'fieldId',
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
    ],
    name: 'PodApproval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'lister',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
        name: 'podAmount',
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
        name: 'mode',
        internalType: 'enum LibTransfer.To',
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
      {
        name: 'filler',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'lister',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
        name: 'podAmount',
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
        name: 'orderer',
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
        name: 'orderer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      {
        name: 'beanAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'fieldId',
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
    ],
    name: 'PodOrderCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'filler',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'orderer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
        name: 'podAmount',
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
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'allowancePods',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approvePods',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelPodListing',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'podOrder',
        internalType: 'struct Order.PodOrder',
        type: 'tuple',
        components: [
          { name: 'orderer', internalType: 'address', type: 'address' },
          { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
          { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
          { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
          { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'cancelPodOrder',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'podListing',
        internalType: 'struct Listing.PodListing',
        type: 'tuple',
        components: [
          { name: 'lister', internalType: 'address', type: 'address' },
          { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
          { name: 'index', internalType: 'uint256', type: 'uint256' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'podAmount', internalType: 'uint256', type: 'uint256' },
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
    ],
    name: 'createPodListing',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'podOrder',
        internalType: 'struct Order.PodOrder',
        type: 'tuple',
        components: [
          { name: 'orderer', internalType: 'address', type: 'address' },
          { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
          { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
          { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
          { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'beanAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.From', type: 'uint8' },
    ],
    name: 'createPodOrder',
    outputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'podListing',
        internalType: 'struct Listing.PodListing',
        type: 'tuple',
        components: [
          { name: 'lister', internalType: 'address', type: 'address' },
          { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
          { name: 'index', internalType: 'uint256', type: 'uint256' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'podAmount', internalType: 'uint256', type: 'uint256' },
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
        name: 'podOrder',
        internalType: 'struct Order.PodOrder',
        type: 'tuple',
        components: [
          { name: 'orderer', internalType: 'address', type: 'address' },
          { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
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
        name: 'podOrder',
        internalType: 'struct Order.PodOrder',
        type: 'tuple',
        components: [
          { name: 'orderer', internalType: 'address', type: 'address' },
          { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
          { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
          { name: 'maxPlaceInLine', internalType: 'uint256', type: 'uint256' },
          { name: 'minFillAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'getOrderId',
    outputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPodListing',
    outputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getPodOrder',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'start', internalType: 'uint256', type: 'uint256' },
      { name: 'end', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferPlot',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'starts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'ends', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'transferPlots',
    outputs: [],
    stateMutability: 'payable',
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
        name: 'germ',
        internalType: 'enum GerminationSide',
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
    type: 'function',
    inputs: [
      { name: 'inputToken', internalType: 'address', type: 'address' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'outputToken', internalType: 'address', type: 'address' },
      {
        name: 'advancedPipeCalls',
        internalType: 'struct AdvancedPipeCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'clipboard', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'pipelineConvert',
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
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfRevitalizedStalk',
    outputs: [{ name: 'stalk', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
      { name: 'well', internalType: 'address', type: 'address' },
      { name: 'reserves', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lookback', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateDeltaBFromReserves',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'dbs',
        internalType: 'struct LibConvert.DeltaBStorage',
        type: 'tuple',
        components: [
          {
            name: 'beforeInputTokenDeltaB',
            internalType: 'int256',
            type: 'int256',
          },
          {
            name: 'afterInputTokenDeltaB',
            internalType: 'int256',
            type: 'int256',
          },
          {
            name: 'beforeOutputTokenDeltaB',
            internalType: 'int256',
            type: 'int256',
          },
          {
            name: 'afterOutputTokenDeltaB',
            internalType: 'int256',
            type: 'int256',
          },
          {
            name: 'beforeOverallDeltaB',
            internalType: 'int256',
            type: 'int256',
          },
          {
            name: 'afterOverallDeltaB',
            internalType: 'int256',
            type: 'int256',
          },
        ],
      },
      { name: 'bdvConverted', internalType: 'uint256', type: 'uint256' },
      {
        name: 'overallConvertCapacity',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'inputToken', internalType: 'address', type: 'address' },
      { name: 'outputToken', internalType: 'address', type: 'address' },
    ],
    name: 'calculateStalkPenalty',
    outputs: [
      { name: 'stalkPenaltyBdv', internalType: 'uint256', type: 'uint256' },
      {
        name: 'overallConvertCapacityUsed',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'inputTokenAmountUsed',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'outputTokenAmountUsed',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'cappedReservesDeltaB',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
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
    type: 'function',
    inputs: [],
    name: 'getOverallConvertCapacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'getWellConvertCapacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'overallCappedDeltaB',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'overallCurrentDeltaB',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'beforeLpTokenSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'afterLpTokenSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'deltaB', internalType: 'int256', type: 'int256' },
    ],
    name: 'scaledDeltaB',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'pure',
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
      {
        name: 'isSoppable',
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
      {
        name: 'isSoppable',
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
      {
        name: '',
        internalType: 'struct EvaluationParameters',
        type: 'tuple',
        components: [
          {
            name: 'maxBeanMaxLpGpPerBdvRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minBeanMaxLpGpPerBdvRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'targetSeasonsToCatchUp',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'podRateLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'podRateOptimal', internalType: 'uint256', type: 'uint256' },
          {
            name: 'podRateUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'deltaPodDemandLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'deltaPodDemandUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioOptimal',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'excessivePriceThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientHigh',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientLow',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'baseReward', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'UpdatedEvaluationParameters',
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
        name: 'gaugePointImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'UpdatedGaugePointImplementationForToken',
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
        name: 'liquidityWeightImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'UpdatedLiquidityWeightImplementationForToken',
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
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'UpdatedOptimalPercentDepositedBdvForToken',
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
        name: 'oracleImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'UpdatedOracleImplementationForToken',
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
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'dewhitelistToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getGaugePointImplementationForToken',
    outputs: [
      {
        name: '',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getLiquidityWeightImplementationForToken',
    outputs: [
      {
        name: '',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getOracleImplementationForToken',
    outputs: [
      {
        name: '',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
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
        internalType: 'struct WhitelistStatus',
        type: 'tuple',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'isWhitelisted', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedLp', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedWell', internalType: 'bool', type: 'bool' },
          { name: 'isSoppable', internalType: 'bool', type: 'bool' },
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
        internalType: 'struct WhitelistStatus[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'isWhitelisted', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedLp', internalType: 'bool', type: 'bool' },
          { name: 'isWhitelistedWell', internalType: 'bool', type: 'bool' },
          { name: 'isSoppable', internalType: 'bool', type: 'bool' },
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
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
      },
      {
        name: 'gpImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'lwImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
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
      {
        name: 'impl',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'updateGaugePointImplementationForToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      {
        name: 'impl',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'updateLiquidityWeightImplementationForToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      {
        name: 'impl',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'updateOracleImplementationForToken',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'updatedSeedGaugeSettings',
        internalType: 'struct EvaluationParameters',
        type: 'tuple',
        components: [
          {
            name: 'maxBeanMaxLpGpPerBdvRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minBeanMaxLpGpPerBdvRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'targetSeasonsToCatchUp',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'podRateLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'podRateOptimal', internalType: 'uint256', type: 'uint256' },
          {
            name: 'podRateUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'deltaPodDemandLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'deltaPodDemandUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioOptimal',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'excessivePriceThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientHigh',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientLow',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'baseReward', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'updateSeedGaugeSettings',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { name: 'stalkIssuedPerBdv', internalType: 'uint48', type: 'uint48' },
      { name: 'stalkEarnedPerSeason', internalType: 'uint32', type: 'uint32' },
      { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
      { name: 'gaugePoints', internalType: 'uint128', type: 'uint128' },
      {
        name: 'optimalPercentDepositedBdv',
        internalType: 'uint64',
        type: 'uint64',
      },
      {
        name: 'oracleImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'gaugePointImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'liquidityWeightImplementation',
        internalType: 'struct Implementation',
        type: 'tuple',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'whitelistToken',
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
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'balanceOfGrownStalkMultiple',
    outputs: [
      { name: 'grownStalks', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfPlantableSeeds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'well', internalType: 'address', type: 'address' },
    ],
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
          {
            name: 'farmerSops',
            internalType: 'struct SiloGettersFacet.FarmerSops[]',
            type: 'tuple[]',
            components: [
              { name: 'well', internalType: 'address', type: 'address' },
              {
                name: 'wellsPlenty',
                internalType: 'struct PerWellPlenty',
                type: 'tuple',
                components: [
                  {
                    name: 'plentyPerRoot',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'plenty', internalType: 'uint256', type: 'uint256' },
                  {
                    name: '_buffer',
                    internalType: 'bytes32[4]',
                    type: 'bytes32[4]',
                  },
                ],
              },
            ],
          },
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
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'bdvs',
    outputs: [{ name: '_bdvs', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'grownStalk', internalType: 'uint256', type: 'uint256' },
      { name: 'bdvOfDeposit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateStemForTokenFromGrownStalk',
    outputs: [
      { name: 'stem', internalType: 'int96', type: 'int96' },
      { name: 'germ', internalType: 'enum GerminationSide', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'depositId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAddressAndStem',
    outputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'getBeanIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBeanstalkTokens',
    outputs: [
      {
        name: '',
        internalType: 'struct Tokens',
        type: 'tuple',
        components: [
          { name: 'bean', internalType: 'address', type: 'address' },
          { name: 'fertilizer', internalType: 'address', type: 'address' },
          { name: 'urBean', internalType: 'address', type: 'address' },
          { name: 'urLp', internalType: 'address', type: 'address' },
        ],
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
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getDepositsForAccount',
    outputs: [
      {
        name: 'deposits',
        internalType: 'struct SiloGettersFacet.TokenDepositId[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'depositIds', internalType: 'uint256[]', type: 'uint256[]' },
          {
            name: 'tokenDeposits',
            internalType: 'struct Deposit[]',
            type: 'tuple[]',
            components: [
              { name: 'amount', internalType: 'uint128', type: 'uint128' },
              { name: 'bdv', internalType: 'uint128', type: 'uint128' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
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
      { name: 'depositId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getIndexForDepositId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'getMowStatus',
    outputs: [
      {
        name: 'mowStatuses',
        internalType: 'struct MowStatus[]',
        type: 'tuple[]',
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
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'getNonBeanTokenAndIndexFromWell',
    outputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
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
    inputs: [],
    name: 'getStemTips',
    outputs: [{ name: '_stemTips', internalType: 'int96[]', type: 'int96[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getTokenDepositIdsForAccount',
    outputs: [
      { name: 'depositIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getTokenDepositsForAccount',
    outputs: [
      {
        name: 'deposits',
        internalType: 'struct SiloGettersFacet.TokenDepositId',
        type: 'tuple',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'depositIds', internalType: 'uint256[]', type: 'uint256[]' },
          {
            name: 'tokenDeposits',
            internalType: 'struct Deposit[]',
            type: 'tuple[]',
            components: [
              { name: 'amount', internalType: 'uint128', type: 'uint128' },
              { name: 'bdv', internalType: 'uint128', type: 'uint128' },
            ],
          },
        ],
      },
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
    name: 'getTotalSiloDeposited',
    outputs: [
      {
        name: 'depositedAmounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalSiloDepositedBdv',
    outputs: [
      { name: 'depositedBdvs', internalType: 'uint256[]', type: 'uint256[]' },
    ],
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
    inputs: [{ name: 'tokens', internalType: 'address[]', type: 'address[]' }],
    name: 'stalkEarnedPerSeason',
    outputs: [
      {
        name: 'stalkEarnedPerSeasons',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
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
        internalType: 'struct AssetSettings',
        type: 'tuple',
        components: [
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          {
            name: 'stalkEarnedPerSeason',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'stalkIssuedPerBdv', internalType: 'uint48', type: 'uint48' },
          { name: 'milestoneSeason', internalType: 'uint32', type: 'uint32' },
          { name: 'milestoneStem', internalType: 'int96', type: 'int96' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          {
            name: 'deltaStalkEarnedPerSeason',
            internalType: 'int32',
            type: 'int32',
          },
          { name: 'gaugePoints', internalType: 'uint128', type: 'uint128' },
          {
            name: 'optimalPercentDepositedBdv',
            internalType: 'uint64',
            type: 'uint64',
          },
          {
            name: 'gaugePointImplementation',
            internalType: 'struct Implementation',
            type: 'tuple',
            components: [
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
              { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
          {
            name: 'liquidityWeightImplementation',
            internalType: 'struct Implementation',
            type: 'tuple',
            components: [
              { name: 'target', internalType: 'address', type: 'address' },
              { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
              { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
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
    name: 'totalRainRoots',
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
    type: 'function',
    inputs: [
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'claimAllPlenty',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'well', internalType: 'address', type: 'address' },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'claimPlenty',
    outputs: [],
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
    name: 'Incentivization',
  },
  {
    type: 'function',
    inputs: [{ name: 'secondsLate', internalType: 'uint256', type: 'uint256' }],
    name: 'determineReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
    inputs: [{ name: 'well', internalType: 'address', type: 'address' }],
    name: 'check',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
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
        name: 'recipient',
        internalType: 'enum ShipmentRecipient',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'receivedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Receipt',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'season', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'shipmentAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Shipped',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shipmentAmounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: 'shipmentPlans',
        internalType: 'struct ShipmentPlan[]',
        type: 'tuple[]',
        components: [
          { name: 'points', internalType: 'uint256', type: 'uint256' },
          { name: 'cap', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'totalPoints', internalType: 'uint256', type: 'uint256' },
      { name: 'beansToShip', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBeansFromPoints',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'shipmentRoutes',
        internalType: 'struct ShipmentRoute[]',
        type: 'tuple[]',
        components: [
          { name: 'planContract', internalType: 'address', type: 'address' },
          { name: 'planSelector', internalType: 'bytes4', type: 'bytes4' },
          {
            name: 'recipient',
            internalType: 'enum ShipmentRecipient',
            type: 'uint8',
          },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'getShipmentPlans',
    outputs: [
      {
        name: 'shipmentPlans',
        internalType: 'struct ShipmentPlan[]',
        type: 'tuple[]',
        components: [
          { name: 'points', internalType: 'uint256', type: 'uint256' },
          { name: 'cap', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'totalPoints', internalType: 'uint256', type: 'uint256' },
    ],
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
        name: 'stalk',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'roots',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MigratedAccountStatus',
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
      { name: 'bdv', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'lastStem',
        internalType: 'int96',
        type: 'int96',
        indexed: false,
      },
    ],
    name: 'MigratedAccountTokenStatus',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'accountStatuses',
        internalType: 'struct ReseedAccountStatus.AccountStatus[]',
        type: 'tuple[]',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'stalk', internalType: 'uint256', type: 'uint256' },
          { name: 'tokens', internalType: 'address[]', type: 'address[]' },
          {
            name: 'mowStatuses',
            internalType: 'struct MowStatus[]',
            type: 'tuple[]',
            components: [
              { name: 'lastStem', internalType: 'int96', type: 'int96' },
              { name: 'bdv', internalType: 'uint128', type: 'uint128' },
            ],
          },
          { name: 'lastUpdate', internalType: 'uint32', type: 'uint32' },
          {
            name: 'germinatingStalkOdd',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'germinatingStalkEven',
            internalType: 'uint128',
            type: 'uint128',
          },
        ],
      },
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'fid', internalType: 'uint128', type: 'uint128', indexed: false },
      {
        name: 'amount',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'lastBpf',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'FertilizerMigrated',
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
        name: 'plotIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'pods',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MigratedPlot',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newShipmentRoutes',
        internalType: 'struct ShipmentRoute[]',
        type: 'tuple[]',
        components: [
          { name: 'planContract', internalType: 'address', type: 'address' },
          { name: 'planSelector', internalType: 'bytes4', type: 'bytes4' },
          {
            name: 'recipient',
            internalType: 'enum ShipmentRecipient',
            type: 'uint8',
          },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'ShipmentRoutesSet',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getShipmentRoutes',
    outputs: [
      {
        name: '',
        internalType: 'struct ShipmentRoute[]',
        type: 'tuple[]',
        components: [
          { name: 'planContract', internalType: 'address', type: 'address' },
          { name: 'planSelector', internalType: 'bytes4', type: 'bytes4' },
          {
            name: 'recipient',
            internalType: 'enum ShipmentRecipient',
            type: 'uint8',
          },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'shipmentRoutes',
        internalType: 'struct ShipmentRoute[]',
        type: 'tuple[]',
        components: [
          { name: 'planContract', internalType: 'address', type: 'address' },
          { name: 'planSelector', internalType: 'bytes4', type: 'bytes4' },
          {
            name: 'recipient',
            internalType: 'enum ShipmentRecipient',
            type: 'uint8',
          },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'setShipmentRoutes',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      { name: 'delta', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'InternalBalanceMigrated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'lister',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
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
        name: 'podAmount',
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
        name: 'mode',
        internalType: 'enum LibTransfer.To',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'MigratedPodListing',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: false },
      {
        name: 'beanAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'fieldId',
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
    ],
    name: 'MigratedPodOrder',
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
    name: 'AddMigratedDeposit',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'lookback', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMillionUsdPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
      { name: 'lookback', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRatiosAndBeanIndex',
    outputs: [
      { name: 'ratios', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'beanIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'success', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTokenUsdPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'lookback', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTokenUsdPriceFromExternal',
    outputs: [{ name: 'tokenUsd', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'lookback', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTokenUsdTwap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getUsdTokenPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'lookback', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getUsdTokenPriceFromExternal',
    outputs: [{ name: 'usdToken', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'lookback', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getUsdTokenTwap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'maxWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'noWeight',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'pools', internalType: 'address[]', type: 'address[]' }],
    name: 'cumulativeCurrentDeltaB',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'caseId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAbsBeanToMaxLpRatioChangeFromCaseId',
    outputs: [{ name: 'ml', internalType: 'uint80', type: 'uint80' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'caseId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAbsTemperatureChangeFromCaseId',
    outputs: [{ name: 't', internalType: 'int8', type: 'int8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'caseId', internalType: 'uint256', type: 'uint256' }],
    name: 'getCaseData',
    outputs: [{ name: 'casesData', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCases',
    outputs: [
      { name: 'cases', internalType: 'bytes32[144]', type: 'bytes32[144]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'caseId', internalType: 'uint256', type: 'uint256' }],
    name: 'getChangeFromCaseId',
    outputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'int8', type: 'int8' },
      { name: '', internalType: 'uint80', type: 'uint80' },
      { name: '', internalType: 'int80', type: 'int80' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeltaPodDemandLowerBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeltaPodDemandUpperBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEvaluationParameters',
    outputs: [
      {
        name: '',
        internalType: 'struct EvaluationParameters',
        type: 'tuple',
        components: [
          {
            name: 'maxBeanMaxLpGpPerBdvRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minBeanMaxLpGpPerBdvRatio',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'targetSeasonsToCatchUp',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'podRateLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'podRateOptimal', internalType: 'uint256', type: 'uint256' },
          {
            name: 'podRateUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'deltaPodDemandLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'deltaPodDemandUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioUpperBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioOptimal',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'lpToSupplyRatioLowerBound',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'excessivePriceThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientHigh',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientLow',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'baseReward', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExcessivePriceThreshold',
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
    name: 'getLpToSupplyRatioLowerBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLpToSupplyRatioOptimal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLpToSupplyRatioUpperBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaxBeanMaxLpGpPerBdvRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinBeanMaxLpGpPerBdvRatio',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPodRateLowerBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPodRateOptimal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPodRateUpperBound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'caseId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRelBeanToMaxLpRatioChangeFromCaseId',
    outputs: [{ name: 'l', internalType: 'int80', type: 'int80' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'caseId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRelTemperatureChangeFromCaseId',
    outputs: [{ name: 'mt', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSeasonStruct',
    outputs: [
      {
        name: '',
        internalType: 'struct Season',
        type: 'tuple',
        components: [
          { name: 'current', internalType: 'uint32', type: 'uint32' },
          { name: 'lastSop', internalType: 'uint32', type: 'uint32' },
          { name: 'lastSopSeason', internalType: 'uint32', type: 'uint32' },
          { name: 'rainStart', internalType: 'uint32', type: 'uint32' },
          { name: 'raining', internalType: 'bool', type: 'bool' },
          { name: 'fertilizing', internalType: 'bool', type: 'bool' },
          { name: 'sunriseBlock', internalType: 'uint64', type: 'uint64' },
          { name: 'abovePeg', internalType: 'bool', type: 'bool' },
          { name: 'stemStartSeason', internalType: 'uint16', type: 'uint16' },
          { name: 'stemScaleSeason', internalType: 'uint16', type: 'uint16' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'period', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: '_buffer', internalType: 'bytes32[8]', type: 'bytes32[8]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSeasonTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetSeasonsToCatchUp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'getWellsByDeltaB',
    outputs: [
      {
        name: 'wellDeltaBs',
        internalType: 'struct LibFlood.WellDeltaB[]',
        type: 'tuple[]',
        components: [
          { name: 'well', internalType: 'address', type: 'address' },
          { name: 'deltaB', internalType: 'int256', type: 'int256' },
        ],
      },
      { name: 'totalPositiveDeltaB', internalType: 'uint256', type: 'uint256' },
      { name: 'totalNegativeDeltaB', internalType: 'uint256', type: 'uint256' },
      { name: 'positiveDeltaBCount', internalType: 'uint256', type: 'uint256' },
    ],
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
    inputs: [
      { name: '_season', internalType: 'uint32', type: 'uint32' },
      { name: 'well', internalType: 'address', type: 'address' },
    ],
    name: 'plentyPerRoot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'poolCurrentDeltaB',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
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
        internalType: 'struct Rain',
        type: 'tuple',
        components: [
          { name: 'pods', internalType: 'uint256', type: 'uint256' },
          { name: 'roots', internalType: 'uint256', type: 'uint256' },
          { name: '_buffer', internalType: 'bytes32[4]', type: 'bytes32[4]' },
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
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'time',
    outputs: [
      {
        name: '',
        internalType: 'struct Season',
        type: 'tuple',
        components: [
          { name: 'current', internalType: 'uint32', type: 'uint32' },
          { name: 'lastSop', internalType: 'uint32', type: 'uint32' },
          { name: 'lastSopSeason', internalType: 'uint32', type: 'uint32' },
          { name: 'rainStart', internalType: 'uint32', type: 'uint32' },
          { name: 'raining', internalType: 'bool', type: 'bool' },
          { name: 'fertilizing', internalType: 'bool', type: 'bool' },
          { name: 'sunriseBlock', internalType: 'uint64', type: 'uint64' },
          { name: 'abovePeg', internalType: 'bool', type: 'bool' },
          { name: 'stemStartSeason', internalType: 'uint16', type: 'uint16' },
          { name: 'stemScaleSeason', internalType: 'uint16', type: 'uint16' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'period', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: '_buffer', internalType: 'bytes32[8]', type: 'bytes32[8]' },
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
        internalType: 'struct Weather',
        type: 'tuple',
        components: [
          { name: 'lastDeltaSoil', internalType: 'uint128', type: 'uint128' },
          { name: 'lastSowTime', internalType: 'uint32', type: 'uint32' },
          { name: 'thisSowTime', internalType: 'uint32', type: 'uint32' },
          { name: 'temp', internalType: 'uint32', type: 'uint32' },
          { name: '_buffer', internalType: 'bytes32[4]', type: 'bytes32[4]' },
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
      {
        name: 'toField',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SeasonOfPlentyField',
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
    ],
    name: 'SeasonOfPlentyWell',
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
      {
        name: 'fieldId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
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
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
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
    name: 'getLargestGpPerBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'fieldId', internalType: 'uint256', type: 'uint256' }],
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
        internalType: 'struct SeedGauge',
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
          { name: '_buffer', internalType: 'bytes32[4]', type: 'bytes32[4]' },
        ],
      },
    ],
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
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'defaultGaugePointFunction',
    outputs: [
      { name: 'newGaugePoints', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'optimalPercentBdv', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getExtremelyFarAbove',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'optimalPercentBdv', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getExtremelyFarBelow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'optimalPercentBdv', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRelativelyFarAbove',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'optimalPercentBdv', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRelativelyFarBelow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_uri', internalType: 'string', type: 'string', indexed: false },
      { name: '_id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'stem', internalType: 'int96', type: 'int96' },
      { name: 'stemTip', internalType: 'int96', type: 'int96' },
    ],
    name: 'imageURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'depositId', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'ticketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RetryableTicketCreated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'L2Beanstalk', internalType: 'address', type: 'address' },
      { name: 'maxSubmissionCost', internalType: 'uint256', type: 'uint256' },
      { name: 'maxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPriceBid', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveL2Receiver',
    outputs: [{ name: 'ticketID', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'L2Beanstalk', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
      { name: 'maxSubmissionCost', internalType: 'uint256', type: 'uint256' },
      { name: 'maxGas', internalType: 'uint256', type: 'uint256' },
      { name: 'gasPriceBid', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'migrateL2Beans',
    outputs: [{ name: 'ticketID', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'receiver',
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
        name: 'toMode',
        internalType: 'enum LibTransfer.To',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'L1BeansMigrated',
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
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'depositIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'bdvs',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'L1DepositsMigrated',
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
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fertIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint128[]',
        type: 'uint128[]',
        indexed: false,
      },
      {
        name: 'lastBpf',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'L1FertilizerMigrated',
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
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokens',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'L1InternalBalancesMigrated',
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
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'orders',
        internalType: 'struct L1ReceiverFacet.L1PodOrder[]',
        type: 'tuple[]',
        components: [
          {
            name: 'podOrder',
            internalType: 'struct Order.PodOrder',
            type: 'tuple',
            components: [
              { name: 'orderer', internalType: 'address', type: 'address' },
              { name: 'fieldId', internalType: 'uint256', type: 'uint256' },
              { name: 'pricePerPod', internalType: 'uint24', type: 'uint24' },
              {
                name: 'maxPlaceInLine',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minFillAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          { name: 'beanAmount', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'L1OrdersMigrated',
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
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'pods',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'L1PlotsMigrated',
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
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ReceiverApproved',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'approveReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDepositMerkleRoot',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFertilizerMerkleRoot',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInternalBalanceMerkleRoot',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPlotMerkleRoot',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'getReceiver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'depositIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'bdvs', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'issueDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'fertIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint128[]', type: 'uint128[]' },
      { name: 'lastBpf', internalType: 'uint128', type: 'uint128' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'issueFertilizer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'issueInternalBalances',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'pods', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'issuePlots',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'recieveL1Beans',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'depositIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'bdvs', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'verifyDepositMerkleProof',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'fertIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint128[]', type: 'uint128[]' },
      { name: 'lastBpf', internalType: 'uint128', type: 'uint128' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'verifyFertilizerMerkleProof',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'verifyInternalBalanceMerkleProof',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'verifyPlotMerkleProof',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const beanstalkAddress = {
  1: '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5',
  1337: '0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70',
  8453: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  31337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  42161: '0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const beanstalkPriceAbi = [
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const beanstalkPriceAddress = {
  1: '0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4',
  1337: '0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7',
  8453: '0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E',
  31337: '0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E',
  42161: '0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
 */
export const depotAddress = {
  1: '0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2',
  1337: '0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c',
  8453: '0xDEb0f00B711f90e503D3035E890A19693ef27Db9',
  31337: '0xDEb0f00B711f90e503D3035E890A19693ef27Db9',
  42161: '0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
 */
export const depotConfig = { address: depotAddress, abi: depotAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// pipeline
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
 */
export const pipelineAddress = {
  1: '0xb1bE0000C6B3C62749b5F0c92480146452D15423',
  1337: '0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0',
  8453: '0xb1bE000421A9d890cb51EBd9D593De9C0B199419',
  31337: '0xb1bE000421A9d890cb51EBd9D593De9C0B199419',
  42161: '0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
 */
export const pipelineConfig = {
  address: pipelineAddress,
  abi: pipelineAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_undefined = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfPenalizedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLockedBeansUnderlyingUnripeBean =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLockedBeansUnderlyingUnripeBean',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLockedBeansUnderlyingUnripeLP"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLockedBeansUnderlyingUnripeLp =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLockedBeansUnderlyingUnripeLP',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPenalizedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPenalizedUnderlying =
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRecapPaidPercent =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRecapPaidPercent',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRecapitalized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRecapitalized =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRecapitalized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_IsUnripe = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'isUnripe',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"_getMintFertilizerOut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMintFertilizerOut =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: '_getMintFertilizerOut',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfBatchFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetActiveFertilizer =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getActiveFertilizer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBarnRaiseToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBarnRaiseToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBarnRaiseToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBarnRaiseWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBarnRaiseWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBarnRaiseWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getCurrentHumidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetHumidity = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getHumidity' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLast"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMintFertilizerOut_duplicated =
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetNext = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getNext',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalRecapDollarsNeeded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTotalRecapDollarsNeeded =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalRecapDollarsNeeded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"isFertilizing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_IsFertilizing =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'isFertilizing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"leftoverBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_LeftoverBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'leftoverBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"remainingRecapitalization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_RemainingRecapitalization =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'remainingRecapitalization',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"rinsableSprouts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_RinsableSprouts =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'rinsableSprouts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"rinsedSprouts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_RinsedSprouts =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'rinsedSprouts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalFertilizedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBlueprintHash"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBlueprintHash =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBlueprintHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBlueprintNonce"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBlueprintNonce =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBlueprintNonce',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getCounter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetCounter = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getCounter',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPublisherCounter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPublisherCounter =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPublisherCounter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTractorVersion"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTractorVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTractorVersion',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAllBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBalances = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getBalances' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getExternalBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_ReadPipe = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'readPipe',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"activeField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_ActiveField = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'activeField' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfPods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_BalanceOfPods =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfPods',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fieldCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_FieldCount = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'fieldCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPlotIndexesFromAccount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPlotIndexesFromAccount =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPlotIndexesFromAccount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPlotsFromAccount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPlotsFromAccount =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPlotsFromAccount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"harvestableIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_HarvestableIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'harvestableIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"isHarvesting"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_IsHarvesting =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'isHarvesting',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"maxTemperature"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Temperature = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'temperature' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalHarvestable"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalHarvestable =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalHarvestable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalHarvestableForActiveField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalHarvestableForActiveField =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalHarvestableForActiveField',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalHarvested"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalUnharvestable =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalUnharvestable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"allowancePods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_AllowancePods =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'allowancePods',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getOrderId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetOrderId = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getOrderId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPodListing =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPodListing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPodOrder = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getPodOrder' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfRevitalizedStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_BalanceOfRevitalizedStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfRevitalizedStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"calculateDeltaBFromReserves"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_CalculateDeltaBFromReserves =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'calculateDeltaBFromReserves',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"calculateStalkPenalty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_CalculateStalkPenalty =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'calculateStalkPenalty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cappedReservesDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_CappedReservesDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cappedReservesDeltaB',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAmountOut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMaxAmountIn =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMaxAmountIn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getOverallConvertCapacity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetOverallConvertCapacity =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getOverallConvertCapacity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWellConvertCapacity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetWellConvertCapacity =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWellConvertCapacity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"overallCappedDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_OverallCappedDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'overallCappedDeltaB',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"overallCurrentDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_OverallCurrentDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'overallCurrentDeltaB',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"scaledDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_ScaledDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'scaledDeltaB',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"beanToBDV"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_BeanToBdv = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'beanToBDV',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"unripeBeanToBDV"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugePointImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGaugePointImplementationForToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugePointImplementationForToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLiquidityWeightImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLiquidityWeightImplementationForToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLiquidityWeightImplementationForToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getOracleImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetOracleImplementationForToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getOracleImplementationForToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSiloTokens"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_BalanceOfGrownStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfGrownStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfGrownStalkMultiple"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_BalanceOfGrownStalkMultiple =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfGrownStalkMultiple',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfPlantableSeeds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_BalanceOfPlantableSeeds =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'balanceOfPlantableSeeds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"balanceOfPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Bdv = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'bdv',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"bdvs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Bdvs = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'bdvs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"calculateStemForTokenFromGrownStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_CalculateStemForTokenFromGrownStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'calculateStemForTokenFromGrownStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAddressAndStem"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetAddressAndStem =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAddressAndStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBeanIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeanIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanstalkTokens"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBeanstalkTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeanstalkTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetDepositId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDepositId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDepositsForAccount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetDepositsForAccount =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDepositsForAccount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getEvenGerminating"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGerminatingTotalDepositedBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGerminatingTotalDepositedBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getIndexForDepositId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetIndexForDepositId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getIndexForDepositId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLastMowedStem"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLastMowedStem =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLastMowedStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMowStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMowStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMowStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getNonBeanTokenAndIndexFromWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetNonBeanTokenAndIndexFromWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getNonBeanTokenAndIndexFromWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getOddGerminating"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetOddGerminating =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getOddGerminating',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getStemTips"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetStemTips = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getStemTips' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTokenDepositIdsForAccount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTokenDepositIdsForAccount =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTokenDepositIdsForAccount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTokenDepositsForAccount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTokenDepositsForAccount =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTokenDepositsForAccount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalDeposited"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTotalGerminatingStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalGerminatingStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalSiloDeposited"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTotalSiloDeposited =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalSiloDeposited',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalSiloDepositedBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTotalSiloDepositedBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTotalSiloDepositedBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getYoungAndMatureGerminatingTotalStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_LastUpdate = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'lastUpdate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"stalkEarnedPerSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_StalkEarnedPerSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'stalkEarnedPerSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"stemStartSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalEarnedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalEarnedBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalRainRoots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalRainRoots =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalRainRoots',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalRoots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalStalk = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'totalStalk',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"determineReward"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_DetermineReward =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'determineReward',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"check"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Check = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'check',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeansFromPoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBeansFromPoints =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeansFromPoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getShipmentPlans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetShipmentPlans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getShipmentPlans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getShipmentRoutes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetShipmentRoutes =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getShipmentRoutes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMillionUsdPrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMillionUsdPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMillionUsdPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRatiosAndBeanIndex"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRatiosAndBeanIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRatiosAndBeanIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTokenUsdPrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTokenUsdPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTokenUsdPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTokenUsdPriceFromExternal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTokenUsdPriceFromExternal =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTokenUsdPriceFromExternal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTokenUsdTwap"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTokenUsdTwap =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTokenUsdTwap',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getUsdTokenPrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetUsdTokenPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getUsdTokenPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getUsdTokenPriceFromExternal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetUsdTokenPriceFromExternal =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getUsdTokenPriceFromExternal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getUsdTokenTwap"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetUsdTokenTwap =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getUsdTokenTwap',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"maxWeight"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_MaxWeight = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'maxWeight',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"noWeight"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_NoWeight = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'noWeight',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"abovePeg"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_AbovePeg = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'abovePeg',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cumulativeCurrentDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_CumulativeCurrentDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cumulativeCurrentDeltaB',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAbsBeanToMaxLpRatioChangeFromCaseId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetAbsBeanToMaxLpRatioChangeFromCaseId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAbsBeanToMaxLpRatioChangeFromCaseId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getAbsTemperatureChangeFromCaseId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetAbsTemperatureChangeFromCaseId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAbsTemperatureChangeFromCaseId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getCaseData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetCaseData = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getCaseData' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getCases"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetCases = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getCases',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getChangeFromCaseId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetChangeFromCaseId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getChangeFromCaseId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDeltaPodDemandLowerBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetDeltaPodDemandLowerBound =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDeltaPodDemandLowerBound',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDeltaPodDemandUpperBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetDeltaPodDemandUpperBound =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDeltaPodDemandUpperBound',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getEvaluationParameters"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetEvaluationParameters =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getEvaluationParameters',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getExcessivePriceThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetExcessivePriceThreshold =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getExcessivePriceThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLargestLiqWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLargestLiqWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLargestLiqWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLpToSupplyRatioLowerBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLpToSupplyRatioLowerBound =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLpToSupplyRatioLowerBound',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLpToSupplyRatioOptimal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLpToSupplyRatioOptimal =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLpToSupplyRatioOptimal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLpToSupplyRatioUpperBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLpToSupplyRatioUpperBound =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLpToSupplyRatioUpperBound',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMaxBeanMaxLpGpPerBdvRatio"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMaxBeanMaxLpGpPerBdvRatio =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMaxBeanMaxLpGpPerBdvRatio',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMinBeanMaxLpGpPerBdvRatio"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMinBeanMaxLpGpPerBdvRatio =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMinBeanMaxLpGpPerBdvRatio',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPodRateLowerBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPodRateLowerBound =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPodRateLowerBound',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPodRateOptimal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPodRateOptimal =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPodRateOptimal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPodRateUpperBound"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPodRateUpperBound =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPodRateUpperBound',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRelBeanToMaxLpRatioChangeFromCaseId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRelBeanToMaxLpRatioChangeFromCaseId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRelBeanToMaxLpRatioChangeFromCaseId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRelTemperatureChangeFromCaseId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRelTemperatureChangeFromCaseId =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRelTemperatureChangeFromCaseId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSeasonStruct"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetSeasonStruct =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSeasonStruct',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSeasonTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetSeasonTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSeasonTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTargetSeasonsToCatchUp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTargetSeasonsToCatchUp =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getTargetSeasonsToCatchUp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalUsdLiquidity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetWeightedTwaLiquidityForWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWeightedTwaLiquidityForWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getWellsByDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetWellsByDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getWellsByDeltaB',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"paused"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_PlentyPerRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'plentyPerRoot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"poolCurrentDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_PoolCurrentDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'poolCurrentDeltaB',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"poolDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalDeltaB = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'totalDeltaB' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"weather"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_SeasonTime = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'seasonTime',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"calcGaugePointsWithParams"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetAverageGrownStalkPerBdvPerSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getAverageGrownStalkPerBdvPerSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanGaugePointsPerBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGrownStalkIssuedPerSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGrownStalkIssuedPerSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLargestGpPerBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetLargestGpPerBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getLargestGpPerBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getLiquidityToSupplyRatio"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetSeedGauge =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSeedGauge',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getTotalBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetTotalBdv = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getTotalBdv' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"defaultGaugePointFunction"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_DefaultGaugePointFunction =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'defaultGaugePointFunction',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getExtremelyFarAbove"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetExtremelyFarAbove =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getExtremelyFarAbove',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getExtremelyFarBelow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetExtremelyFarBelow =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getExtremelyFarBelow',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRelativelyFarAbove"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRelativelyFarAbove =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRelativelyFarAbove',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRelativelyFarBelow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRelativelyFarBelow =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRelativelyFarBelow',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"imageURI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_ImageUri = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'imageURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Name = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Symbol = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"uri"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Uri = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'uri',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getDepositMerkleRoot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetDepositMerkleRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getDepositMerkleRoot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getFertilizerMerkleRoot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetFertilizerMerkleRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getFertilizerMerkleRoot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getInternalBalanceMerkleRoot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetInternalBalanceMerkleRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getInternalBalanceMerkleRoot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getPlotMerkleRoot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetPlotMerkleRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getPlotMerkleRoot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getReceiver"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetReceiver = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'getReceiver' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"verifyDepositMerkleProof"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_VerifyDepositMerkleProof =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'verifyDepositMerkleProof',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"verifyFertilizerMerkleProof"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_VerifyFertilizerMerkleProof =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'verifyFertilizerMerkleProof',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"verifyInternalBalanceMerkleProof"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_VerifyInternalBalanceMerkleProof =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'verifyInternalBalanceMerkleProof',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"verifyPlotMerkleProof"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_VerifyPlotMerkleProof =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'verifyPlotMerkleProof',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_undefined = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addMigratedUnderlying"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Chop = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'chop',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"switchUnderlyingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_SwitchUnderlyingToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'switchUnderlyingToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"beginBarnRaiseMigration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_BeginBarnRaiseMigration =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'beginBarnRaiseMigration',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimFertilized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_DiamondCut =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'diamondCut',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelBlueprint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_CancelBlueprint =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelBlueprint',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"publishRequisition"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_PublishRequisition =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'publishRequisition',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"tractor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Tractor = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'tractor',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updatePublisherCounter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdatePublisherCounter =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updatePublisherCounter',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateTractorVersion"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdateTractorVersion =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateTractorVersion',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"batchTransferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UnwrapEth = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'unwrapEth' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"wrapEth"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_EtherPipe = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'etherPipe' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"multiPipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_MultiPipe = /*#__PURE__*/ createUseWriteContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'multiPipe' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pipe"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Pipe = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'pipe',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_AddField = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'addField',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"harvest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Harvest = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'harvest',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"setActiveField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_SetActiveField =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'setActiveField',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_CancelPodOrder =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodOrder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_CreatePodListing =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodListing',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_CreatePodOrder =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodOrder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_FillPodListing =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodListing',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_FillPodOrder =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodOrder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferPlot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_TransferPlot =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferPlot',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferPlots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_TransferPlots =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferPlots',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pipelineConvert"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_PipelineConvert =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pipelineConvert',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"enrootDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdateGaugeForToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateGaugeForToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateGaugePointImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdateGaugePointImplementationForToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateGaugePointImplementationForToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateLiquidityWeightImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdateLiquidityWeightImplementationForToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateLiquidityWeightImplementationForToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateOracleImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdateOracleImplementationForToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateOracleImplementationForToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateSeedGaugeSettings"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdateSeedGaugeSettings =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateSeedGaugeSettings',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateStalkPerBdvPerSeasonForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_WhitelistToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'whitelistToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Deposit = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_WithdrawDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'withdrawDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimAllPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_ClaimAllPlenty =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimAllPlenty',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_ClaimPlenty =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimPlenty',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Plant = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'plant',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"init"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Init = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'init',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"setShipmentRoutes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_SetShipmentRoutes =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'setShipmentRoutes',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"gm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_Sunrise = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'sunrise',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveL2Receiver"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_ApproveL2Receiver =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveL2Receiver',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"migrateL2Beans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_MigrateL2Beans =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'migrateL2Beans',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveReceiver"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_ApproveReceiver =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveReceiver',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issueDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_IssueDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issueDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issueFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_IssueFertilizer =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issueFertilizer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issueInternalBalances"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_IssueInternalBalances =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issueInternalBalances',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issuePlots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_IssuePlots =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issuePlots',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"recieveL1Beans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_RecieveL1Beans =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'recieveL1Beans',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Chop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'chop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"switchUnderlyingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_SwitchUnderlyingToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'switchUnderlyingToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"beginBarnRaiseMigration"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_BeginBarnRaiseMigration =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'beginBarnRaiseMigration',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimFertilized"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_DiamondCut =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'diamondCut',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cancelBlueprint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_CancelBlueprint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelBlueprint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"publishRequisition"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_PublishRequisition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'publishRequisition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"tractor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Tractor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'tractor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updatePublisherCounter"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdatePublisherCounter =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updatePublisherCounter',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateTractorVersion"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdateTractorVersion =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateTractorVersion',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"batchTransferERC1155"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Pipe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pipe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"addField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_AddField =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'addField',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"harvest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Harvest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'harvest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"setActiveField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_SetActiveField =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'setActiveField',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Sow = /*#__PURE__*/ createUseSimulateContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'sow' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sowWithMin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_CancelPodOrder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cancelPodOrder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_CreatePodListing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodListing',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"createPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_CreatePodOrder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'createPodOrder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_FillPodListing =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodListing',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"fillPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_FillPodOrder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'fillPodOrder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferPlot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_TransferPlot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferPlot',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"transferPlots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_TransferPlots =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'transferPlots',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pipelineConvert"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_PipelineConvert =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pipelineConvert',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"enrootDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdateGaugeForToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateGaugeForToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateGaugePointImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdateGaugePointImplementationForToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateGaugePointImplementationForToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateLiquidityWeightImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdateLiquidityWeightImplementationForToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateLiquidityWeightImplementationForToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateOracleImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdateOracleImplementationForToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateOracleImplementationForToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateSeedGaugeSettings"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdateSeedGaugeSettings =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateSeedGaugeSettings',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateStalkPerBdvPerSeasonForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_WhitelistToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'whitelistToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"deposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Deposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_WithdrawDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'withdrawDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimAllPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_ClaimAllPlenty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimAllPlenty',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"claimPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_ClaimPlenty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'claimPlenty',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Mow = /*#__PURE__*/ createUseSimulateContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'mow' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowMultiple"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Plant =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'plant',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"init"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Init =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'init',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"setShipmentRoutes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_SetShipmentRoutes =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'setShipmentRoutes',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"gm"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_Sunrise =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'sunrise',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveL2Receiver"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_ApproveL2Receiver =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveL2Receiver',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"migrateL2Beans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_MigrateL2Beans =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'migrateL2Beans',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"approveReceiver"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_ApproveReceiver =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'approveReceiver',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issueDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_IssueDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issueDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issueFertilizer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_IssueFertilizer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issueFertilizer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issueInternalBalances"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_IssueInternalBalances =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issueInternalBalances',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"issuePlots"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_IssuePlots =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'issuePlots',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"recieveL1Beans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_RecieveL1Beans =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'recieveL1Beans',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Chop = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: beanstalkAbi, address: beanstalkAddress, eventName: 'Chop' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"InternalBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_InternalBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'InternalBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Pick"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Pick = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: beanstalkAbi, address: beanstalkAddress, eventName: 'Pick' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SwitchUnderlyingToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_DiamondCut =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'DiamondCut',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"CancelBlueprint"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_CancelBlueprint =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'CancelBlueprint',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"PublishRequisition"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_PublishRequisition =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PublishRequisition',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Tractor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Tractor =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Tractor',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TractorVersionSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TractorVersionSet =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TractorVersionSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TokenApproval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TokenApproval =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TokenApproval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TokenTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TokenTransferred =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TokenTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ActiveFieldSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_ActiveFieldSet =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ActiveFieldSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"FieldAdded"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_FieldAdded =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'FieldAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Harvest"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_PodOrderFilled =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'PodOrderFilled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Convert"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Convert =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Convert',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"FarmerGerminatingStalkBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_FarmerGerminatingStalkBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'FarmerGerminatingStalkBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_RemoveDeposits =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveDeposits',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"StalkBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_StalkBalanceChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'StalkBalanceChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TotalGerminatingBalanceChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TotalGerminatingStalkChanged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TotalGerminatingStalkChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TransferBatch"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TransferBatch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_RemoveDeposit =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ApprovalForAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_DepositApproval =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'DepositApproval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"AddWhitelistStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_AddWhitelistStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'AddWhitelistStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"DewhitelistToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_DewhitelistToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'DewhitelistToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdateWhitelistStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdateWhitelistStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdateWhitelistStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedEvaluationParameters"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdatedEvaluationParameters =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdatedEvaluationParameters',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedGaugePointImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdatedGaugePointImplementationForToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdatedGaugePointImplementationForToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedLiquidityWeightImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdatedLiquidityWeightImplementationForToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdatedLiquidityWeightImplementationForToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedOptimalPercentDepositedBdvForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdatedOptimalPercentDepositedBdvForToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdatedOptimalPercentDepositedBdvForToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedOracleImplementationForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdatedOracleImplementationForToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdatedOracleImplementationForToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedStalkPerBdvPerSeason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_WhitelistToken =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'WhitelistToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"AddDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_AddDeposit =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'AddDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TransferSingle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TransferSingle =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ClaimPlenty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Plant =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Plant',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Incentivization"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Incentivization =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Incentivization',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TotalStalkChangedFromGermination"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TotalStalkChangedFromGermination =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TotalStalkChangedFromGermination',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"WellOracle"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_WellOracle =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'WellOracle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RemoveWhitelistStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_RemoveWhitelistStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RemoveWhitelistStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"GaugePointChange"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdateAverageStalkPerBdvPerSeason =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdateAverageStalkPerBdvPerSeason',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Receipt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Receipt =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Receipt',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Shipped"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Shipped =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Shipped',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"MigratedAccountStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_MigratedAccountStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'MigratedAccountStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"MigratedAccountTokenStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_MigratedAccountTokenStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'MigratedAccountTokenStatus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"FertilizerMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_FertilizerMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'FertilizerMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"MigratedPlot"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_MigratedPlot =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'MigratedPlot',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ShipmentRoutesSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_ShipmentRoutesSet =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ShipmentRoutesSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"InternalBalanceMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_InternalBalanceMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'InternalBalanceMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"MigratedPodListing"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_MigratedPodListing =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'MigratedPodListing',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"MigratedPodOrder"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_MigratedPodOrder =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'MigratedPodOrder',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"AddMigratedDeposit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_AddMigratedDeposit =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'AddMigratedDeposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"BeanToMaxLpGpPerBdvRatioChange"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_BeanToMaxLpGpPerBdvRatioChange =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'BeanToMaxLpGpPerBdvRatioChange',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SeasonOfPlentyField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_SeasonOfPlentyField =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SeasonOfPlentyField',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SeasonOfPlentyWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_SeasonOfPlentyWell =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SeasonOfPlentyWell',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Soil"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Soil = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: beanstalkAbi, address: beanstalkAddress, eventName: 'Soil' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Sunrise"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TemperatureChange =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TemperatureChange',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"URI"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Uri = /*#__PURE__*/ createUseWatchContractEvent({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  eventName: 'URI',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RetryableTicketCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_RetryableTicketCreated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RetryableTicketCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"L1BeansMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_L1BeansMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'L1BeansMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"L1DepositsMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_L1DepositsMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'L1DepositsMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"L1FertilizerMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_L1FertilizerMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'L1FertilizerMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"L1InternalBalancesMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_L1InternalBalancesMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'L1InternalBalancesMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"L1OrdersMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_L1OrdersMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'L1OrdersMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"L1PlotsMigrated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_L1PlotsMigrated =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'L1PlotsMigrated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ReceiverApproved"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_ReceiverApproved =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ReceiverApproved',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD0fd333F7B30c7925DEBD81B7b7a4DFE106c3a5E)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
 */
export const useWriteDepot_PermitDeposit = /*#__PURE__*/ createUseWriteContract(
  { abi: depotAbi, address: depotAddress, functionName: 'permitDeposit' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link depotAbi}__ and `functionName` set to `"permitDeposits"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
 */
export const useWriteDepot_TransferToken = /*#__PURE__*/ createUseWriteContract(
  { abi: depotAbi, address: depotAddress, functionName: 'transferToken' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link depotAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xDEb0f00B711f90e503D3035E890A19693ef27Db9)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE000421A9d890cb51EBd9D593De9C0B199419)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
 */
export const useSimulatePipeline_Pipe = /*#__PURE__*/ createUseSimulateContract(
  { abi: pipelineAbi, address: pipelineAddress, functionName: 'pipe' },
)
