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
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
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
        name: 'blueprintHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'CancelBlueprint',
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
        name: 'publisher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'blueprintHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'nonce',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'gasleft',
        internalType: 'uint256',
        type: 'uint256',
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
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'publisher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'blueprintHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'nonce',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'gasleft',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TractorExecutionBegan',
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
    inputs: [],
    name: 'getCurrentBlueprintHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
    inputs: [],
    name: 'operator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendTokenToInternalBalance',
    outputs: [],
    stateMutability: 'payable',
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
    inputs: [],
    name: 'tractorUser',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
    stateMutability: 'view',
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
    inputs: [{ name: 'x', internalType: 'uint256', type: 'uint256' }],
    name: 'PRBMathUD60x18__LogInputTooSmall',
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
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
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
        name: 'secondsSinceStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SoilMostlySoldOut',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'secondsSinceStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SoilSoldOut',
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
    name: 'beanSown',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [],
    name: 'floodHarvestablePods',
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
    inputs: [],
    name: 'getSoilMostlySoldOutThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSoilSoldOutThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    outputs: [
      { name: 'beansHarvested', internalType: 'uint256', type: 'uint256' },
    ],
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
    inputs: [],
    name: 'initialSoil',
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
    type: 'function',
    inputs: [],
    name: 'totalUnharvestableForActiveField',
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
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'SafeCastOverflowedIntDowncast',
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
          { name: 'minAvgGsPerBdv', internalType: 'uint128', type: 'uint128' },
          {
            name: 'rainingMinBeanMaxLpGpPerBdvRatio',
            internalType: 'uint128',
            type: 'uint128',
          },
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
        internalType: 'uint40',
        type: 'uint40',
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
        internalType: 'uint40',
        type: 'uint40',
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
          { name: 'minAvgGsPerBdv', internalType: 'uint128', type: 'uint128' },
          {
            name: 'rainingMinBeanMaxLpGpPerBdvRatio',
            internalType: 'uint128',
            type: 'uint128',
          },
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
      { name: 'stalkEarnedPerSeason', internalType: 'uint40', type: 'uint40' },
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
      { name: 'stalkEarnedPerSeason', internalType: 'uint40', type: 'uint40' },
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
    name: 'getBeanToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
    ],
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
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getHighestNonGerminatingStem',
    outputs: [{ name: 'stem', internalType: 'int96', type: 'int96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokens', internalType: 'address[]', type: 'address[]' }],
    name: 'getHighestNonGerminatingStems',
    outputs: [
      {
        name: 'highestNonGerminatingStems',
        internalType: 'int96[]',
        type: 'int96[]',
      },
    ],
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
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getMowStatus',
    outputs: [
      {
        name: 'mowStatus',
        internalType: 'struct MowStatus',
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
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getSeedsForToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
            internalType: 'uint40',
            type: 'uint40',
          },
          { name: 'stalkIssuedPerBdv', internalType: 'uint48', type: 'uint48' },
          { name: 'milestoneSeason', internalType: 'uint32', type: 'uint32' },
          { name: 'milestoneStem', internalType: 'int96', type: 'int96' },
          { name: 'encodeType', internalType: 'bytes1', type: 'bytes1' },
          {
            name: 'deltaStalkEarnedPerSeason',
            internalType: 'int40',
            type: 'int40',
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
        name: 'depositId',
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
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      {
        name: 'sortedDepositIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'updateSortedDepositIds',
    outputs: [],
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
      {
        name: 'fromBdv',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toBdv',
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
    type: 'function',
    inputs: [
      { name: 'inputToken', internalType: 'address', type: 'address' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'outputToken', internalType: 'address', type: 'address' },
      { name: 'grownStalkSlippage', internalType: 'int256', type: 'int256' },
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
    name: 'pipelineConvertWithStalkSlippage',
    outputs: [
      { name: 'toStem', internalType: 'int96', type: 'int96' },
      { name: 'fromAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'toAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'fromBdv', internalType: 'uint256', type: 'uint256' },
      { name: 'toBdv', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  { type: 'error', inputs: [], name: 'T' },
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
      { name: 'well', internalType: 'address', type: 'address' },
      { name: 'bdvToConvert', internalType: 'uint256', type: 'uint256' },
      { name: 'grownStalkToConvert', internalType: 'uint256', type: 'uint256' },
      { name: 'amountConverted', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'downPenalizedGrownStalk',
    outputs: [
      { name: 'newGrownStalk', internalType: 'uint256', type: 'uint256' },
      { name: 'grownStalkLost', internalType: 'uint256', type: 'uint256' },
    ],
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
    inputs: [],
    name: 'getCalculatedBonusStalkPerBdv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConvertStalkPerBdvBonusAndMaximumCapacity',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConvertStalkPerBdvBonusAndRemainingCapacity',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
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
    inputs: [
      { name: 'tokenIn', internalType: 'address', type: 'address' },
      { name: 'tokenOut', internalType: 'address', type: 'address' },
      { name: 'rate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMaxAmountInAtRate',
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
      { name: 'bdvToConvert', internalType: 'uint256', type: 'uint256' },
      { name: 'grownStalk', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stalkBonus',
    outputs: [
      { name: 'bdvCapacityUsed', internalType: 'uint256', type: 'uint256' },
      { name: 'grownStalkGained', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
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
    inputs: [
      { name: 'convertData', internalType: 'bytes', type: 'bytes' },
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'grownStalkSlippage', internalType: 'int256', type: 'int256' },
    ],
    name: 'convertWithStalkSlippage',
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
    outputs: [
      {
        name: 'allPlenty',
        internalType: 'struct ClaimFacet.ClaimPlentyData[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'plenty', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'well', internalType: 'address', type: 'address' },
      { name: 'toMode', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'claimPlenty',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'mowAll',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'mowAllMultipleAccounts',
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
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'tokens', internalType: 'address[][]', type: 'address[][]' },
    ],
    name: 'mowMultipleAccounts',
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
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'beanToBDV',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
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
        name: 'newMaxTotalGaugePoints',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UpdateMaxTotalGaugePoints',
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
        name: 'season',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'deltaPodDemand',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'lpToSupplyRatio',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'podRate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'thisSowTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'lastSowTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SeasonMetrics',
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
        name: 'season',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'raining', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RainStatus',
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
      {
        name: 'beans',
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
        internalType: 'int32',
        type: 'int32',
        indexed: false,
      },
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gaugeId',
        internalType: 'enum GaugeId',
        type: 'uint8',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'UpdatedGaugeData',
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
      {
        name: 'grownStalkLost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'grownStalkKept',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ConvertDownPenalty',
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
      {
        name: 'grownStalkGained',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newGrownStalk',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'bdvCapacityUsed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'bdvConverted',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ConvertUpBonus',
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
    outputs: [{ name: 't', internalType: 'int32', type: 'int32' }],
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
      { name: '', internalType: 'int32', type: 'int32' },
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
          { name: 'minAvgGsPerBdv', internalType: 'uint128', type: 'uint128' },
          {
            name: 'rainingMinBeanMaxLpGpPerBdvRatio',
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
    name: 'getExcessivePriceThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getExtEvaluationParameters',
    outputs: [
      {
        name: '',
        internalType: 'struct ExtEvaluationParameters',
        type: 'tuple',
        components: [
          {
            name: 'belowPegSoilL2SRScalar',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientRelativelyHigh',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilCoefficientRelativelyLow',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'abovePegDeltaBSoilScalar',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'soilDistributionPeriod',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minSoilIssuance', internalType: 'uint256', type: 'uint256' },
          { name: 'buffer', internalType: 'bytes32[61]', type: 'bytes32[61]' },
        ],
      },
    ],
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
    name: 'getOrderLockedBeans',
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
          { name: 'sunriseBlock', internalType: 'uint64', type: 'uint64' },
          { name: 'abovePeg', internalType: 'bool', type: 'bool' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'period', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          {
            name: 'standardMintedBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'poolDeltaBNoCap',
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
          {
            name: 'floodHarvestablePods',
            internalType: 'uint128',
            type: 'uint128',
          },
          { name: '_buffer', internalType: 'bytes32[3]', type: 'bytes32[3]' },
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
          { name: 'sunriseBlock', internalType: 'uint64', type: 'uint64' },
          { name: 'abovePeg', internalType: 'bool', type: 'bool' },
          { name: 'start', internalType: 'uint256', type: 'uint256' },
          { name: 'period', internalType: 'uint256', type: 'uint256' },
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          {
            name: 'standardMintedBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    name: 'totalDeltaBNoCap',
    outputs: [{ name: 'deltaB', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalInstantaneousDeltaB',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
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
          { name: 'temp', internalType: 'uint64', type: 'uint64' },
          { name: 'morningControl', internalType: 'uint128', type: 'uint128' },
          { name: 'morningDuration', internalType: 'uint16', type: 'uint16' },
          { name: '_buffer', internalType: 'bytes32[3]', type: 'bytes32[3]' },
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
  { type: 'error', inputs: [], name: 'MathOverflowedMulDiv' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gaugeId',
        internalType: 'enum GaugeId',
        type: 'uint8',
        indexed: false,
      },
      { name: 'value', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Engaged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'gaugeId',
        internalType: 'enum GaugeId',
        type: 'uint8',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'EngagedData',
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
    inputs: [],
    name: 'getMaxTotalGaugePoints',
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
          { name: 'avgGsPerBdvFlag', internalType: 'bool', type: 'bool' },
          {
            name: 'maxTotalGaugePoints',
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
      { name: 'value', internalType: 'bytes', type: 'bytes' },
      { name: 'systemData', internalType: 'bytes', type: 'bytes' },
      { name: 'gaugeData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'convertDownPenaltyGauge',
    outputs: [
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'value', internalType: 'bytes', type: 'bytes' },
      { name: 'systemData', internalType: 'bytes', type: 'bytes' },
      { name: 'gaugeData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'convertUpBonusGauge',
    outputs: [
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'value', internalType: 'bytes', type: 'bytes' },
      { name: 'systemData', internalType: 'bytes', type: 'bytes' },
      { name: 'gaugeData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cultivationFactor',
    outputs: [
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
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
    name: 'defaultGaugePoints',
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
    inputs: [{ name: 'gaugeId', internalType: 'enum GaugeId', type: 'uint8' }],
    name: 'getGauge',
    outputs: [
      {
        name: '',
        internalType: 'struct Gauge',
        type: 'tuple',
        components: [
          { name: 'value', internalType: 'bytes', type: 'bytes' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'gaugeId', internalType: 'enum GaugeId', type: 'uint8' }],
    name: 'getGaugeData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gaugeId', internalType: 'enum GaugeId', type: 'uint8' },
      { name: 'systemData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getGaugeIdResult',
    outputs: [
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'gauge',
        internalType: 'struct Gauge',
        type: 'tuple',
        components: [
          { name: 'value', internalType: 'bytes', type: 'bytes' },
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'systemData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getGaugeResult',
    outputs: [
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'gaugeId', internalType: 'enum GaugeId', type: 'uint8' }],
    name: 'getGaugeValue',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'optimalPercentBdv', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRelativelyCloseAbove',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'optimalPercentBdv', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRelativelyCloseBelow',
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
  1337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  8453: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  31337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  41337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const beanstalkPriceAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'beanstalk', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    name: 'getBestWellForBeanIn',
    outputs: [
      {
        name: 'sd',
        internalType: 'struct WellPrice.SwapData',
        type: 'tuple',
        components: [
          { name: 'well', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'usdValue', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'usdAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getBestWellForUsdIn',
    outputs: [
      {
        name: 'sd',
        internalType: 'struct WellPrice.SwapData',
        type: 'tuple',
        components: [
          { name: 'well', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'usdValue', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'well', internalType: 'address', type: 'address' },
      { name: 'beans', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSwapDataBeanIn',
    outputs: [
      {
        name: 'sd',
        internalType: 'struct WellPrice.SwapData',
        type: 'tuple',
        components: [
          { name: 'well', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'usdValue', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
    name: 'getSwapDataBeanInAll',
    outputs: [
      {
        name: 'sds',
        internalType: 'struct WellPrice.SwapData[]',
        type: 'tuple[]',
        components: [
          { name: 'well', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'usdValue', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'well', internalType: 'address', type: 'address' },
      { name: 'usdAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getSwapDataUsdIn',
    outputs: [
      {
        name: 'sd',
        internalType: 'struct WellPrice.SwapData',
        type: 'tuple',
        components: [
          { name: 'well', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'usdValue', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'usdAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'getSwapDataUsdInAll',
    outputs: [
      {
        name: 'sds',
        internalType: 'struct WellPrice.SwapData[]',
        type: 'tuple[]',
        components: [
          { name: 'well', internalType: 'address', type: 'address' },
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'usdValue', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'wellAddress', internalType: 'address', type: 'address' }],
    name: 'getWell',
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
          { name: 'beanLiquidity', internalType: 'uint256', type: 'uint256' },
          {
            name: 'nonBeanLiquidity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'poolPrice',
    outputs: [
      {
        name: 'p',
        internalType: 'struct P.Pool',
        type: 'tuple',
        components: [
          { name: 'pool', internalType: 'address', type: 'address' },
          { name: 'tokens', internalType: 'address[2]', type: 'address[2]' },
          { name: 'balances', internalType: 'uint256[2]', type: 'uint256[2]' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'liquidity', internalType: 'uint256', type: 'uint256' },
          { name: 'beanLiquidity', internalType: 'uint256', type: 'uint256' },
          {
            name: 'nonBeanLiquidity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'beanLiquidity',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'nonBeanLiquidity',
                internalType: 'uint256',
                type: 'uint256',
              },
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
  {
    type: 'function',
    inputs: [{ name: 'wells', internalType: 'address[]', type: 'address[]' }],
    name: 'priceForWells',
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
              {
                name: 'beanLiquidity',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'nonBeanLiquidity',
                internalType: 'uint256',
                type: 'uint256',
              },
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const beanstalkPriceAddress = {
  1: '0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4',
  1337: '0x13D25ABCB6a19948d35654715c729c6501230b49',
  8453: '0x13D25ABCB6a19948d35654715c729c6501230b49',
  31337: '0x13D25ABCB6a19948d35654715c729c6501230b49',
  41337: '0x13D25ABCB6a19948d35654715c729c6501230b49',
  42161: '0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const beanstalkPriceConfig = {
  address: beanstalkPriceAddress,
  abi: beanstalkPriceAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// convertUpBlueprint
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const convertUpBlueprintAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_beanstalk', internalType: 'address', type: 'address' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_tractorHelpers', internalType: 'address', type: 'address' },
      { name: '_siloHelpers', internalType: 'address', type: 'address' },
      { name: '_beanstalkPrice', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'blueprintHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'publisher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalAmountConverted',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'beansUnfulfilled',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ConvertUpOrderComplete',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'functionSelector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      { name: 'isPaused', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'FunctionPaused',
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
    name: 'beanstalkPrice',
    outputs: [
      { name: '', internalType: 'contract BeanstalkPrice', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ConvertUpBlueprint.ConvertUpBlueprintStruct',
        type: 'tuple',
        components: [
          {
            name: 'convertUpParams',
            internalType: 'struct ConvertUpBlueprint.ConvertUpParams',
            type: 'tuple',
            components: [
              {
                name: 'sourceTokenIndices',
                internalType: 'uint8[]',
                type: 'uint8[]',
              },
              {
                name: 'totalBeanAmountToConvert',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minBeansConvertPerExecution',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxBeansConvertPerExecution',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'capAmountToBonusCapacity',
                internalType: 'bool',
                type: 'bool',
              },
              {
                name: 'minTimeBetweenConverts',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minConvertBonusCapacity',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxGrownStalkPerBdv',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'grownStalkPerBdvBonusBid',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxPriceToConvertUp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minPriceToConvertUp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'seedDifference',
                internalType: 'int256',
                type: 'int256',
              },
              {
                name: 'maxGrownStalkPerBdvPenalty',
                internalType: 'int256',
                type: 'int256',
              },
              {
                name: 'slippageRatio',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'lowStalkDeposits',
                internalType: 'enum LibSiloHelpers.Mode',
                type: 'uint8',
              },
            ],
          },
          {
            name: 'opParams',
            internalType: 'struct ConvertUpBlueprint.OperatorParams',
            type: 'tuple',
            components: [
              {
                name: 'whitelistedOperators',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'tipAddress', internalType: 'address', type: 'address' },
              {
                name: 'operatorTipAmount',
                internalType: 'int256',
                type: 'int256',
              },
            ],
          },
        ],
      },
    ],
    name: 'convertUpBlueprint',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    name: 'functionPaused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'orderHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBeansLeftToConvert',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'orderHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getLastExecutedTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'orderInfo',
    outputs: [
      {
        name: 'lastExecutedTimestamp',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'beansLeftToConvert', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSelector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'pauseFunction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'siloHelpers',
    outputs: [
      { name: '', internalType: 'contract SiloHelpers', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tractorHelpers',
    outputs: [
      { name: '', internalType: 'contract TractorHelpers', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSelector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'unpauseFunction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct ConvertUpBlueprint.ConvertUpBlueprintStruct',
        type: 'tuple',
        components: [
          {
            name: 'convertUpParams',
            internalType: 'struct ConvertUpBlueprint.ConvertUpParams',
            type: 'tuple',
            components: [
              {
                name: 'sourceTokenIndices',
                internalType: 'uint8[]',
                type: 'uint8[]',
              },
              {
                name: 'totalBeanAmountToConvert',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minBeansConvertPerExecution',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxBeansConvertPerExecution',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'capAmountToBonusCapacity',
                internalType: 'bool',
                type: 'bool',
              },
              {
                name: 'minTimeBetweenConverts',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minConvertBonusCapacity',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxGrownStalkPerBdv',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'grownStalkPerBdvBonusBid',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxPriceToConvertUp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minPriceToConvertUp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'seedDifference',
                internalType: 'int256',
                type: 'int256',
              },
              {
                name: 'maxGrownStalkPerBdvPenalty',
                internalType: 'int256',
                type: 'int256',
              },
              {
                name: 'slippageRatio',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'lowStalkDeposits',
                internalType: 'enum LibSiloHelpers.Mode',
                type: 'uint8',
              },
            ],
          },
          {
            name: 'opParams',
            internalType: 'struct ConvertUpBlueprint.OperatorParams',
            type: 'tuple',
            components: [
              {
                name: 'whitelistedOperators',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'tipAddress', internalType: 'address', type: 'address' },
              {
                name: 'operatorTipAmount',
                internalType: 'int256',
                type: 'int256',
              },
            ],
          },
        ],
      },
      { name: 'orderHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'blueprintPublisher', internalType: 'address', type: 'address' },
    ],
    name: 'validateParamsAndReturnBeanstalkState',
    outputs: [
      { name: 'bonusStalkPerBdv', internalType: 'uint256', type: 'uint256' },
      { name: 'beansLeftToConvert', internalType: 'uint256', type: 'uint256' },
      {
        name: 'beansToConvertThisExecution',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'withdrawalPlan',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'paramsArray',
        internalType: 'struct ConvertUpBlueprint.ConvertUpBlueprintStruct[]',
        type: 'tuple[]',
        components: [
          {
            name: 'convertUpParams',
            internalType: 'struct ConvertUpBlueprint.ConvertUpParams',
            type: 'tuple',
            components: [
              {
                name: 'sourceTokenIndices',
                internalType: 'uint8[]',
                type: 'uint8[]',
              },
              {
                name: 'totalBeanAmountToConvert',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minBeansConvertPerExecution',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxBeansConvertPerExecution',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'capAmountToBonusCapacity',
                internalType: 'bool',
                type: 'bool',
              },
              {
                name: 'minTimeBetweenConverts',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minConvertBonusCapacity',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxGrownStalkPerBdv',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'grownStalkPerBdvBonusBid',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxPriceToConvertUp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'minPriceToConvertUp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'seedDifference',
                internalType: 'int256',
                type: 'int256',
              },
              {
                name: 'maxGrownStalkPerBdvPenalty',
                internalType: 'int256',
                type: 'int256',
              },
              {
                name: 'slippageRatio',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'lowStalkDeposits',
                internalType: 'enum LibSiloHelpers.Mode',
                type: 'uint8',
              },
            ],
          },
          {
            name: 'opParams',
            internalType: 'struct ConvertUpBlueprint.OperatorParams',
            type: 'tuple',
            components: [
              {
                name: 'whitelistedOperators',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'tipAddress', internalType: 'address', type: 'address' },
              {
                name: 'operatorTipAmount',
                internalType: 'int256',
                type: 'int256',
              },
            ],
          },
        ],
      },
      { name: 'orderHashes', internalType: 'bytes32[]', type: 'bytes32[]' },
      {
        name: 'blueprintPublishers',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'validateParamsAndReturnBeanstalkStateArray',
    outputs: [
      {
        name: 'validOrderHashes',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
] as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const convertUpBlueprintAddress = {
  1337: '0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca',
  8453: '0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca',
  31337: '0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca',
  41337: '0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca',
} as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const convertUpBlueprintConfig = {
  address: convertUpBlueprintAddress,
  abi: convertUpBlueprintAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// depot
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
 */
export const depotAddress = {
  1: '0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2',
  1337: '0x02F7c20dabC251f35272492177E177035C21269B',
  8453: '0x02F7c20dabC251f35272492177E177035C21269B',
  31337: '0x02F7c20dabC251f35272492177E177035C21269B',
  41337: '0x02F7c20dabC251f35272492177E177035C21269B',
  42161: '0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xDEb0f0dEEc1A29ab97ABf65E537452D1B00A619c)
 */
export const depotConfig = { address: depotAddress, abi: depotAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// farmer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const farmerAbi = [
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
    name: 'balanceOfEarnedBeans',
    outputs: [{ name: 'beans', internalType: 'uint256', type: 'uint256' }],
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
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const farmerAddress = {
  1: '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5',
  1337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  8453: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  31337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  41337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  42161: '0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const farmerConfig = { address: farmerAddress, abi: farmerAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// junction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const junctionAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'add',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'selector', internalType: 'uint256', type: 'uint256' },
      { name: 'options', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'bytes32Switch',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'check',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'div',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'eq',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'gt',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'gte',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lt',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lte',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mul',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
      { name: 'c', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mulDiv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'neq',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sub',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

export const junctionAddress =
  '0x5A5A5AF07D8a389472AdC1E60aA71BAC89Fcff8b' as const

export const junctionConfig = {
  address: junctionAddress,
  abi: junctionAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// pipeline
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
 */
export const pipelineAddress = {
  1: '0xb1bE0000C6B3C62749b5F0c92480146452D15423',
  1337: '0xb1bE0001f5a373b69b1E132b420e6D9687155e80',
  8453: '0xb1bE0001f5a373b69b1E132b420e6D9687155e80',
  31337: '0xb1bE0001f5a373b69b1E132b420e6D9687155e80',
  41337: '0xb1bE0001f5a373b69b1E132b420e6D9687155e80',
  42161: '0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
 */
export const pipelineConfig = {
  address: pipelineAddress,
  abi: pipelineAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// seasonFacetView
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const seasonFacetViewAbi = [
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
          { name: 'sunriseBlock', internalType: 'uint64', type: 'uint64' },
          { name: 'abovePeg', internalType: 'bool', type: 'bool' },
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
    name: 'seasonTime',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const seasonFacetViewAddress = {
  1: '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5',
  1337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  8453: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  31337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  41337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  42161: '0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const seasonFacetViewConfig = {
  address: seasonFacetViewAddress,
  abi: seasonFacetViewAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// silo
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const siloAbi = [
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
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const siloAddress = {
  1: '0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5',
  1337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  8453: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  31337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  41337: '0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f',
  42161: '0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const siloConfig = { address: siloAddress, abi: siloAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// siloHelpers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const siloHelpersAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_beanstalk', internalType: 'address', type: 'address' },
      { name: '_tractorHelpers', internalType: 'address', type: 'address' },
      { name: '_priceManipulation', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
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
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getBeanAmountAvailable',
    outputs: [
      { name: 'beanAmountAvailable', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'minStem', internalType: 'int96', type: 'int96' },
    ],
    name: 'getDepositStemsAndAmountsToWithdraw',
    outputs: [
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'availableAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'filterParams',
        internalType: 'struct LibSiloHelpers.FilterParams',
        type: 'tuple',
        components: [
          {
            name: 'maxGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minStem', internalType: 'int96', type: 'int96' },
          {
            name: 'excludeGerminatingDeposits',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'excludeBean', internalType: 'bool', type: 'bool' },
          {
            name: 'lowStalkDeposits',
            internalType: 'enum LibSiloHelpers.Mode',
            type: 'uint8',
          },
          {
            name: 'lowGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxStem', internalType: 'int96', type: 'int96' },
          { name: 'seedDifference', internalType: 'int256', type: 'int256' },
        ],
      },
      {
        name: 'excludingPlan',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'getDepositStemsAndAmountsToWithdraw',
    outputs: [
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'availableAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getSortedDeposits',
    outputs: [
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTokenIndex',
    outputs: [{ name: 'index', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getUserDepositedTokens',
    outputs: [
      { name: 'depositedTokens', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWhitelistStatusAddresses',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokenIndices', internalType: 'uint8[]', type: 'uint8[]' },
      { name: 'targetAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'filterParams',
        internalType: 'struct LibSiloHelpers.FilterParams',
        type: 'tuple',
        components: [
          {
            name: 'maxGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minStem', internalType: 'int96', type: 'int96' },
          {
            name: 'excludeGerminatingDeposits',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'excludeBean', internalType: 'bool', type: 'bool' },
          {
            name: 'lowStalkDeposits',
            internalType: 'enum LibSiloHelpers.Mode',
            type: 'uint8',
          },
          {
            name: 'lowGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxStem', internalType: 'int96', type: 'int96' },
          { name: 'seedDifference', internalType: 'int256', type: 'int256' },
        ],
      },
    ],
    name: 'getWithdrawalPlan',
    outputs: [
      {
        name: 'plan',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokenIndices', internalType: 'uint8[]', type: 'uint8[]' },
      { name: 'targetAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'filterParams',
        internalType: 'struct LibSiloHelpers.FilterParams',
        type: 'tuple',
        components: [
          {
            name: 'maxGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minStem', internalType: 'int96', type: 'int96' },
          {
            name: 'excludeGerminatingDeposits',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'excludeBean', internalType: 'bool', type: 'bool' },
          {
            name: 'lowStalkDeposits',
            internalType: 'enum LibSiloHelpers.Mode',
            type: 'uint8',
          },
          {
            name: 'lowGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxStem', internalType: 'int96', type: 'int96' },
          { name: 'seedDifference', internalType: 'int256', type: 'int256' },
        ],
      },
      {
        name: 'excludingPlan',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'getWithdrawalPlanExcludingPlan',
    outputs: [
      {
        name: 'plan',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'slippageRatio', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isValidSlippage',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'sortDeposits',
    outputs: [
      { name: 'updatedTokens', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'tokenIndices', internalType: 'uint8[]', type: 'uint8[]' },
      { name: 'targetAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'filterParams',
        internalType: 'struct LibSiloHelpers.FilterParams',
        type: 'tuple',
        components: [
          {
            name: 'maxGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'minStem', internalType: 'int96', type: 'int96' },
          {
            name: 'excludeGerminatingDeposits',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'excludeBean', internalType: 'bool', type: 'bool' },
          {
            name: 'lowStalkDeposits',
            internalType: 'enum LibSiloHelpers.Mode',
            type: 'uint8',
          },
          {
            name: 'lowGrownStalkPerBdv',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'maxStem', internalType: 'int96', type: 'int96' },
          { name: 'seedDifference', internalType: 'int256', type: 'int256' },
        ],
      },
      { name: 'slippageRatio', internalType: 'uint256', type: 'uint256' },
      { name: 'mode', internalType: 'enum LibTransfer.To', type: 'uint8' },
      {
        name: 'plan',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'withdrawBeansFromSources',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
] as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const siloHelpersAddress = {
  1337: '0xE145082A7C5EDd1767f8148A6c29a17488d1eb31',
  8453: '0xE145082A7C5EDd1767f8148A6c29a17488d1eb31',
  31337: '0xE145082A7C5EDd1767f8148A6c29a17488d1eb31',
  41337: '0xE145082A7C5EDd1767f8148A6c29a17488d1eb31',
} as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const siloHelpersConfig = {
  address: siloHelpersAddress,
  abi: siloHelpersAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sowBlueprintv0
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const sowBlueprintv0Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_beanstalk', internalType: 'address', type: 'address' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_tractorHelpers', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'functionSelector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: true,
      },
      { name: 'isPaused', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'FunctionPaused',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'blueprintHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'publisher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalAmountSown',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountUnfulfilled',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SowOrderComplete',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    name: 'functionPaused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'orderHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getLastExecutedSeason',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'orderHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getPintosLeftToSow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSelector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'pauseFunction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct SowBlueprintv0.SowBlueprintStruct',
        type: 'tuple',
        components: [
          {
            name: 'sowParams',
            internalType: 'struct SowBlueprintv0.SowParams',
            type: 'tuple',
            components: [
              {
                name: 'sourceTokenIndices',
                internalType: 'uint8[]',
                type: 'uint8[]',
              },
              {
                name: 'sowAmounts',
                internalType: 'struct SowBlueprintv0.SowAmounts',
                type: 'tuple',
                components: [
                  {
                    name: 'totalAmountToSow',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'minAmountToSowPerSeason',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'maxAmountToSowPerSeason',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
              { name: 'minTemp', internalType: 'uint256', type: 'uint256' },
              {
                name: 'maxPodlineLength',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxGrownStalkPerBdv',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'runBlocksAfterSunrise',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'slippageRatio',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'opParams',
            internalType: 'struct SowBlueprintv0.OperatorParams',
            type: 'tuple',
            components: [
              {
                name: 'whitelistedOperators',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'tipAddress', internalType: 'address', type: 'address' },
              {
                name: 'operatorTipAmount',
                internalType: 'int256',
                type: 'int256',
              },
            ],
          },
        ],
      },
    ],
    name: 'sowBlueprintv0',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tractorHelpers',
    outputs: [
      { name: '', internalType: 'contract TractorHelpers', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'functionSelector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'unpauseFunction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct SowBlueprintv0.SowBlueprintStruct',
        type: 'tuple',
        components: [
          {
            name: 'sowParams',
            internalType: 'struct SowBlueprintv0.SowParams',
            type: 'tuple',
            components: [
              {
                name: 'sourceTokenIndices',
                internalType: 'uint8[]',
                type: 'uint8[]',
              },
              {
                name: 'sowAmounts',
                internalType: 'struct SowBlueprintv0.SowAmounts',
                type: 'tuple',
                components: [
                  {
                    name: 'totalAmountToSow',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'minAmountToSowPerSeason',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'maxAmountToSowPerSeason',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
              { name: 'minTemp', internalType: 'uint256', type: 'uint256' },
              {
                name: 'maxPodlineLength',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxGrownStalkPerBdv',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'runBlocksAfterSunrise',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'slippageRatio',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'opParams',
            internalType: 'struct SowBlueprintv0.OperatorParams',
            type: 'tuple',
            components: [
              {
                name: 'whitelistedOperators',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'tipAddress', internalType: 'address', type: 'address' },
              {
                name: 'operatorTipAmount',
                internalType: 'int256',
                type: 'int256',
              },
            ],
          },
        ],
      },
      { name: 'orderHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'blueprintPublisher', internalType: 'address', type: 'address' },
    ],
    name: 'validateParamsAndReturnBeanstalkState',
    outputs: [
      { name: 'availableSoil', internalType: 'uint256', type: 'uint256' },
      { name: 'beanToken', internalType: 'address', type: 'address' },
      { name: 'currentSeason', internalType: 'uint32', type: 'uint32' },
      { name: 'pintoLeftToSow', internalType: 'uint256', type: 'uint256' },
      { name: 'totalAmountToSow', internalType: 'uint256', type: 'uint256' },
      { name: 'totalBeansNeeded', internalType: 'uint256', type: 'uint256' },
      {
        name: 'plan',
        internalType: 'struct LibTractorHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'paramsArray',
        internalType: 'struct SowBlueprintv0.SowBlueprintStruct[]',
        type: 'tuple[]',
        components: [
          {
            name: 'sowParams',
            internalType: 'struct SowBlueprintv0.SowParams',
            type: 'tuple',
            components: [
              {
                name: 'sourceTokenIndices',
                internalType: 'uint8[]',
                type: 'uint8[]',
              },
              {
                name: 'sowAmounts',
                internalType: 'struct SowBlueprintv0.SowAmounts',
                type: 'tuple',
                components: [
                  {
                    name: 'totalAmountToSow',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'minAmountToSowPerSeason',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'maxAmountToSowPerSeason',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
              { name: 'minTemp', internalType: 'uint256', type: 'uint256' },
              {
                name: 'maxPodlineLength',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'maxGrownStalkPerBdv',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'runBlocksAfterSunrise',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'slippageRatio',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'opParams',
            internalType: 'struct SowBlueprintv0.OperatorParams',
            type: 'tuple',
            components: [
              {
                name: 'whitelistedOperators',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'tipAddress', internalType: 'address', type: 'address' },
              {
                name: 'operatorTipAmount',
                internalType: 'int256',
                type: 'int256',
              },
            ],
          },
        ],
      },
      { name: 'orderHashes', internalType: 'bytes32[]', type: 'bytes32[]' },
      {
        name: 'blueprintPublishers',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'validateParamsAndReturnBeanstalkStateArray',
    outputs: [
      {
        name: 'validOrderHashes',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
      },
    ],
    stateMutability: 'view',
  },
] as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const sowBlueprintv0Address = {
  1337: '0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B',
  8453: '0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B',
  31337: '0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B',
  41337: '0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B',
} as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const sowBlueprintv0Config = {
  address: sowBlueprintv0Address,
  abi: sowBlueprintv0Abi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// tractorHelpers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const tractorHelpersAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_beanstalk', internalType: 'address', type: 'address' },
      { name: '_beanstalkPrice', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rewardType',
        internalType: 'enum TractorHelpers.RewardType',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'publisher',
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
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'OperatorReward',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'add',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'selector', internalType: 'uint256', type: 'uint256' },
      { name: 'options', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'bytes32Switch',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'condition', internalType: 'bool', type: 'bool' }],
    name: 'check',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'plans',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan[]',
        type: 'tuple[]',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'combineWithdrawalPlans',
    outputs: [
      {
        name: '',
        internalType: 'struct LibSiloHelpers.WithdrawalPlan',
        type: 'tuple',
        components: [
          {
            name: 'sourceTokens',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'stems', internalType: 'int96[][]', type: 'int96[][]' },
          { name: 'amounts', internalType: 'uint256[][]', type: 'uint256[][]' },
          {
            name: 'availableBeans',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'totalAvailableBeans',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'div',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'eq',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
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
    inputs: [],
    name: 'getBeanstalkPrice',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHighestSeedToken',
    outputs: [
      { name: 'highestSeedToken', internalType: 'address', type: 'address' },
      { name: 'seedAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'beanAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'well', internalType: 'address', type: 'address' },
    ],
    name: 'getLPTokensToWithdrawForBeans',
    outputs: [{ name: 'lpAmount', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLowestSeedToken',
    outputs: [
      { name: 'lowestSeedToken', internalType: 'address', type: 'address' },
      { name: 'seedAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getSortedDeposits',
    outputs: [
      { name: 'stems', internalType: 'int96[]', type: 'int96[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSortedWhitelistedTokensBySeeds',
    outputs: [
      { name: 'tokens', internalType: 'address[]', type: 'address[]' },
      { name: 'seeds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'getTokenIndex',
    outputs: [{ name: 'index', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'excludeBean', internalType: 'bool', type: 'bool' }],
    name: 'getTokensAscendingPrice',
    outputs: [
      { name: 'tokenIndices', internalType: 'uint8[]', type: 'uint8[]' },
      { name: 'prices', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTokensAscendingPrice',
    outputs: [
      { name: 'tokenIndices', internalType: 'uint8[]', type: 'uint8[]' },
      { name: 'prices', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'excludeBean', internalType: 'bool', type: 'bool' }],
    name: 'getTokensAscendingSeeds',
    outputs: [
      { name: 'tokenIndices', internalType: 'uint8[]', type: 'uint8[]' },
      { name: 'seeds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTokensAscendingSeeds',
    outputs: [
      { name: 'tokenIndices', internalType: 'uint8[]', type: 'uint8[]' },
      { name: 'seeds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWhitelistStatusAddresses',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'gt',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'gte',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'whitelistedOperators',
        internalType: 'address[]',
        type: 'address[]',
      },
    ],
    name: 'isOperatorWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lt',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lte',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mul',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
      { name: 'c', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mulDiv',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'neq',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'a', internalType: 'uint256', type: 'uint256' },
      { name: 'b', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sub',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'publisher', internalType: 'address', type: 'address' },
      { name: 'tipAddress', internalType: 'address', type: 'address' },
      { name: 'tipAmount', internalType: 'int256', type: 'int256' },
      { name: 'from', internalType: 'enum LibTransfer.From', type: 'uint8' },
      { name: 'to', internalType: 'enum LibTransfer.To', type: 'uint8' },
    ],
    name: 'tip',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const tractorHelpersAddress = {
  1337: '0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6',
  8453: '0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6',
  31337: '0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6',
  41337: '0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6',
} as const

/**
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const tractorHelpersConfig = {
  address: tractorHelpersAddress,
  abi: tractorHelpersAbi,
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getCurrentBlueprintHash"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetCurrentBlueprintHash =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getCurrentBlueprintHash',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"operator"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_Operator = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'operator',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"tractorUser"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TractorUser = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'tractorUser' },
)

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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"beanSown"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_BeanSown = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'beanSown',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"floodHarvestablePods"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_FloodHarvestablePods =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'floodHarvestablePods',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSoilMostlySoldOutThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetSoilMostlySoldOutThreshold =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSoilMostlySoldOutThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSoilSoldOutThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetSoilSoldOutThreshold =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSoilSoldOutThreshold',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"initialSoil"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_InitialSoil = /*#__PURE__*/ createUseReadContract(
  { abi: beanstalkAbi, address: beanstalkAddress, functionName: 'initialSoil' },
)

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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalUnharvestableForActiveField"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalUnharvestableForActiveField =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalUnharvestableForActiveField',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getBeanToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetBeanToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getBeanToken',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getHighestNonGerminatingStem"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetHighestNonGerminatingStem =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getHighestNonGerminatingStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getHighestNonGerminatingStems"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetHighestNonGerminatingStems =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getHighestNonGerminatingStems',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getSeedsForToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetSeedsForToken =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getSeedsForToken',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"downPenalizedGrownStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_DownPenalizedGrownStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'downPenalizedGrownStalk',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getCalculatedBonusStalkPerBdv"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetCalculatedBonusStalkPerBdv =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getCalculatedBonusStalkPerBdv',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getConvertStalkPerBdvBonusAndMaximumCapacity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetConvertStalkPerBdvBonusAndMaximumCapacity =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getConvertStalkPerBdvBonusAndMaximumCapacity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getConvertStalkPerBdvBonusAndRemainingCapacity"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetConvertStalkPerBdvBonusAndRemainingCapacity =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getConvertStalkPerBdvBonusAndRemainingCapacity',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMaxAmountInAtRate"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMaxAmountInAtRate =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMaxAmountInAtRate',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"stalkBonus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_StalkBonus = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'stalkBonus',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getExtEvaluationParameters"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetExtEvaluationParameters =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getExtEvaluationParameters',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getOrderLockedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetOrderLockedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getOrderLockedBeans',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"poolDeltaBNoCap"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_PoolDeltaBNoCap =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'poolDeltaBNoCap',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalDeltaBNoCap"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalDeltaBNoCap =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalDeltaBNoCap',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"totalInstantaneousDeltaB"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_TotalInstantaneousDeltaB =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'totalInstantaneousDeltaB',
  })

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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getMaxTotalGaugePoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetMaxTotalGaugePoints =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getMaxTotalGaugePoints',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"convertDownPenaltyGauge"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_ConvertDownPenaltyGauge =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'convertDownPenaltyGauge',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"convertUpBonusGauge"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_ConvertUpBonusGauge =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'convertUpBonusGauge',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"cultivationFactor"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_CultivationFactor =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'cultivationFactor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"defaultGaugePoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_DefaultGaugePoints =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'defaultGaugePoints',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGauge"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGauge = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'getGauge',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugeData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGaugeData =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugeData',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugeIdResult"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGaugeIdResult =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugeIdResult',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugeResult"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGaugeResult =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugeResult',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getGaugeValue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetGaugeValue =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getGaugeValue',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRelativelyCloseAbove"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRelativelyCloseAbove =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRelativelyCloseAbove',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"getRelativelyCloseBelow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadBeanstalk_GetRelativelyCloseBelow =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'getRelativelyCloseBelow',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sendTokenToInternalBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_SendTokenToInternalBalance =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'sendTokenToInternalBalance',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateSortedDepositIds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_UpdateSortedDepositIds =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateSortedDepositIds',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pipelineConvertWithStalkSlippage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_PipelineConvertWithStalkSlippage =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pipelineConvertWithStalkSlippage',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"convertWithStalkSlippage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_ConvertWithStalkSlippage =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'convertWithStalkSlippage',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_MowAll = /*#__PURE__*/ createUseWriteContract({
  abi: beanstalkAbi,
  address: beanstalkAddress,
  functionName: 'mowAll',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAllMultipleAccounts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_MowAllMultipleAccounts =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowAllMultipleAccounts',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowMultipleAccounts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWriteBeanstalk_MowMultipleAccounts =
  /*#__PURE__*/ createUseWriteContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowMultipleAccounts',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"sendTokenToInternalBalance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_SendTokenToInternalBalance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'sendTokenToInternalBalance',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"updateSortedDepositIds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_UpdateSortedDepositIds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'updateSortedDepositIds',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"pipelineConvertWithStalkSlippage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_PipelineConvertWithStalkSlippage =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'pipelineConvertWithStalkSlippage',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"convertWithStalkSlippage"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_ConvertWithStalkSlippage =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'convertWithStalkSlippage',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_MowAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowAllMultipleAccounts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_MowAllMultipleAccounts =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowAllMultipleAccounts',
  })

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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link beanstalkAbi}__ and `functionName` set to `"mowMultipleAccounts"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useSimulateBeanstalk_MowMultipleAccounts =
  /*#__PURE__*/ createUseSimulateContract({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    functionName: 'mowMultipleAccounts',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"TractorExecutionBegan"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_TractorExecutionBegan =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'TractorExecutionBegan',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SoilMostlySoldOut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_SoilMostlySoldOut =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SoilMostlySoldOut',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SoilSoldOut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_SoilSoldOut =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SoilSoldOut',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdateMaxTotalGaugePoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdateMaxTotalGaugePoints =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdateMaxTotalGaugePoints',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"SeasonMetrics"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_SeasonMetrics =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'SeasonMetrics',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"RainStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_RainStatus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'RainStatus',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"UpdatedGaugeData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_UpdatedGaugeData =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'UpdatedGaugeData',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ConvertDownPenalty"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_ConvertDownPenalty =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ConvertDownPenalty',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"ConvertUpBonus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_ConvertUpBonus =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'ConvertUpBonus',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"Engaged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_Engaged =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'Engaged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link beanstalkAbi}__ and `eventName` set to `"EngagedData"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useWatchBeanstalk_EngagedData =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: beanstalkAbi,
    address: beanstalkAddress,
    eventName: 'EngagedData',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_undefined =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getBestWellForBeanIn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_GetBestWellForBeanIn =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getBestWellForBeanIn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getBestWellForUsdIn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_GetBestWellForUsdIn =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getBestWellForUsdIn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getSwapDataBeanIn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_GetSwapDataBeanIn =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getSwapDataBeanIn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getSwapDataBeanInAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_GetSwapDataBeanInAll =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getSwapDataBeanInAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getSwapDataUsdIn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_GetSwapDataUsdIn =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getSwapDataUsdIn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getSwapDataUsdInAll"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_GetSwapDataUsdInAll =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getSwapDataUsdInAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"getWell"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_GetWell =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'getWell',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"poolPrice"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_PoolPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'poolPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"price"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_Price = /*#__PURE__*/ createUseReadContract({
  abi: beanstalkPriceAbi,
  address: beanstalkPriceAddress,
  functionName: 'price',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link beanstalkPriceAbi}__ and `functionName` set to `"priceForWells"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4BEd6cb142b7d474242d87F4796387DEB9E1E1B4)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x13D25ABCB6a19948d35654715c729c6501230b49)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xC218F5a782b0913931DCF502FA2aA959b36Ac9E7)
 */
export const useReadBeanstalkPrice_PriceForWells =
  /*#__PURE__*/ createUseReadContract({
    abi: beanstalkPriceAbi,
    address: beanstalkPriceAddress,
    functionName: 'priceForWells',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_undefined =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"beanstalkPrice"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_BeanstalkPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'beanstalkPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"functionPaused"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_FunctionPaused =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'functionPaused',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"getBeansLeftToConvert"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_GetBeansLeftToConvert =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'getBeansLeftToConvert',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"getLastExecutedTimestamp"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_GetLastExecutedTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'getLastExecutedTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"orderInfo"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_OrderInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'orderInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"owner"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_Owner =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"siloHelpers"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_SiloHelpers =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'siloHelpers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"tractorHelpers"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_TractorHelpers =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'tractorHelpers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"validateParamsAndReturnBeanstalkState"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_ValidateParamsAndReturnBeanstalkState =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'validateParamsAndReturnBeanstalkState',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"validateParamsAndReturnBeanstalkStateArray"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_ValidateParamsAndReturnBeanstalkStateArray =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'validateParamsAndReturnBeanstalkStateArray',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"version"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useReadConvertUpBlueprint_Version =
  /*#__PURE__*/ createUseReadContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'version',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWriteConvertUpBlueprint_undefined =
  /*#__PURE__*/ createUseWriteContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"convertUpBlueprint"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWriteConvertUpBlueprint_ConvertUpBlueprint =
  /*#__PURE__*/ createUseWriteContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'convertUpBlueprint',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"pauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWriteConvertUpBlueprint_PauseFunction =
  /*#__PURE__*/ createUseWriteContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'pauseFunction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWriteConvertUpBlueprint_RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWriteConvertUpBlueprint_TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"unpauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWriteConvertUpBlueprint_UnpauseFunction =
  /*#__PURE__*/ createUseWriteContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'unpauseFunction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useSimulateConvertUpBlueprint_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"convertUpBlueprint"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useSimulateConvertUpBlueprint_ConvertUpBlueprint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'convertUpBlueprint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"pauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useSimulateConvertUpBlueprint_PauseFunction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'pauseFunction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useSimulateConvertUpBlueprint_RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useSimulateConvertUpBlueprint_TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `functionName` set to `"unpauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useSimulateConvertUpBlueprint_UnpauseFunction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    functionName: 'unpauseFunction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link convertUpBlueprintAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWatchConvertUpBlueprint_undefined =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `eventName` set to `"ConvertUpOrderComplete"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWatchConvertUpBlueprint_ConvertUpOrderComplete =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    eventName: 'ConvertUpOrderComplete',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `eventName` set to `"FunctionPaused"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWatchConvertUpBlueprint_FunctionPaused =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    eventName: 'FunctionPaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link convertUpBlueprintAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x5167Ae1fF37bE08D9cc9188C7e64DB228B6F06ca)
 * -
 */
export const useWatchConvertUpBlueprint_OwnershipTransferred =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: convertUpBlueprintAbi,
    address: convertUpBlueprintAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link depotAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xDEb0f00071497a5cc9b4A6B96068277e57A82Ae2)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0x02F7c20dabC251f35272492177E177035C21269B)
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_undefined = /*#__PURE__*/ createUseReadContract({
  abi: farmerAbi,
  address: farmerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__ and `functionName` set to `"balanceOfStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_BalanceOfStalk = /*#__PURE__*/ createUseReadContract(
  { abi: farmerAbi, address: farmerAddress, functionName: 'balanceOfStalk' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__ and `functionName` set to `"balanceOfSop"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_BalanceOfSop = /*#__PURE__*/ createUseReadContract({
  abi: farmerAbi,
  address: farmerAddress,
  functionName: 'balanceOfSop',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__ and `functionName` set to `"balanceOfGrownStalk"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_BalanceOfGrownStalk =
  /*#__PURE__*/ createUseReadContract({
    abi: farmerAbi,
    address: farmerAddress,
    functionName: 'balanceOfGrownStalk',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__ and `functionName` set to `"balanceOfEarnedBeans"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_BalanceOfEarnedBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: farmerAbi,
    address: farmerAddress,
    functionName: 'balanceOfEarnedBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__ and `functionName` set to `"getPlotsFromAccount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_GetPlotsFromAccount =
  /*#__PURE__*/ createUseReadContract({
    abi: farmerAbi,
    address: farmerAddress,
    functionName: 'getPlotsFromAccount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__ and `functionName` set to `"balanceOfGrownStalkMultiple"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_BalanceOfGrownStalkMultiple =
  /*#__PURE__*/ createUseReadContract({
    abi: farmerAbi,
    address: farmerAddress,
    functionName: 'balanceOfGrownStalkMultiple',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link farmerAbi}__ and `functionName` set to `"getMowStatus"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadFarmer_GetMowStatus = /*#__PURE__*/ createUseReadContract({
  abi: farmerAbi,
  address: farmerAddress,
  functionName: 'getMowStatus',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__
 */
export const useReadJunction_undefined = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"add"`
 */
export const useReadJunction_Add = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'add',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"bytes32Switch"`
 */
export const useReadJunction_Bytes32Switch =
  /*#__PURE__*/ createUseReadContract({
    abi: junctionAbi,
    address: junctionAddress,
    functionName: 'bytes32Switch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"check"`
 */
export const useReadJunction_Check = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'check',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"div"`
 */
export const useReadJunction_Div = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'div',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"eq"`
 */
export const useReadJunction_Eq = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'eq',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"gt"`
 */
export const useReadJunction_Gt = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'gt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"gte"`
 */
export const useReadJunction_Gte = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'gte',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"lt"`
 */
export const useReadJunction_Lt = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'lt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"lte"`
 */
export const useReadJunction_Lte = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'lte',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"mod"`
 */
export const useReadJunction_Mod = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'mod',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"mul"`
 */
export const useReadJunction_Mul = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'mul',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"mulDiv"`
 */
export const useReadJunction_MulDiv = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'mulDiv',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"neq"`
 */
export const useReadJunction_Neq = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'neq',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link junctionAbi}__ and `functionName` set to `"sub"`
 */
export const useReadJunction_Sub = /*#__PURE__*/ createUseReadContract({
  abi: junctionAbi,
  address: junctionAddress,
  functionName: 'sub',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link pipelineAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xb1bE0000C6B3C62749b5F0c92480146452D15423)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
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
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xb1bE0001f5a373b69b1E132b420e6D9687155e80)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1bE000644bD25996b0d9C2F7a6D6BA3954c91B0)
 */
export const useSimulatePipeline_Pipe = /*#__PURE__*/ createUseSimulateContract(
  { abi: pipelineAbi, address: pipelineAddress, functionName: 'pipe' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link seasonFacetViewAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadSeasonFacetView_undefined =
  /*#__PURE__*/ createUseReadContract({
    abi: seasonFacetViewAbi,
    address: seasonFacetViewAddress,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link seasonFacetViewAbi}__ and `functionName` set to `"time"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadSeasonFacetView_Time = /*#__PURE__*/ createUseReadContract({
  abi: seasonFacetViewAbi,
  address: seasonFacetViewAddress,
  functionName: 'time',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link seasonFacetViewAbi}__ and `functionName` set to `"getSeasonTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadSeasonFacetView_GetSeasonTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: seasonFacetViewAbi,
    address: seasonFacetViewAddress,
    functionName: 'getSeasonTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link seasonFacetViewAbi}__ and `functionName` set to `"seasonTime"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadSeasonFacetView_SeasonTime =
  /*#__PURE__*/ createUseReadContract({
    abi: seasonFacetViewAbi,
    address: seasonFacetViewAddress,
    functionName: 'seasonTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadSilo_undefined = /*#__PURE__*/ createUseReadContract({
  abi: siloAbi,
  address: siloAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloAbi}__ and `functionName` set to `"getAmountOut"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5)
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xD1A0D188E861ed9d15773a2F3574a2e94134bA8f)
 * -
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xD1A0060ba708BC4BCD3DA6C37EFa8deDF015FB70)
 */
export const useReadSilo_GetAmountOut = /*#__PURE__*/ createUseReadContract({
  abi: siloAbi,
  address: siloAddress,
  functionName: 'getAmountOut',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_undefined = /*#__PURE__*/ createUseReadContract(
  { abi: siloHelpersAbi, address: siloHelpersAddress },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getAddressAndStem"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetAddressAndStem =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getAddressAndStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getBeanAmountAvailable"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetBeanAmountAvailable =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getBeanAmountAvailable',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getDepositStemsAndAmountsToWithdraw"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetDepositStemsAndAmountsToWithdraw =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getDepositStemsAndAmountsToWithdraw',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getSortedDeposits"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetSortedDeposits =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getSortedDeposits',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getTokenIndex"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetTokenIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getTokenIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getUserDepositedTokens"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetUserDepositedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getUserDepositedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getWhitelistStatusAddresses"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetWhitelistStatusAddresses =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getWhitelistStatusAddresses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getWithdrawalPlan"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetWithdrawalPlan =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getWithdrawalPlan',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"getWithdrawalPlanExcludingPlan"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useReadSiloHelpers_GetWithdrawalPlanExcludingPlan =
  /*#__PURE__*/ createUseReadContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'getWithdrawalPlanExcludingPlan',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link siloHelpersAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useWriteSiloHelpers_undefined =
  /*#__PURE__*/ createUseWriteContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"isValidSlippage"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useWriteSiloHelpers_IsValidSlippage =
  /*#__PURE__*/ createUseWriteContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'isValidSlippage',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"sortDeposits"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useWriteSiloHelpers_SortDeposits =
  /*#__PURE__*/ createUseWriteContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'sortDeposits',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"withdrawBeansFromSources"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useWriteSiloHelpers_WithdrawBeansFromSources =
  /*#__PURE__*/ createUseWriteContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'withdrawBeansFromSources',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link siloHelpersAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useSimulateSiloHelpers_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"isValidSlippage"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useSimulateSiloHelpers_IsValidSlippage =
  /*#__PURE__*/ createUseSimulateContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'isValidSlippage',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"sortDeposits"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useSimulateSiloHelpers_SortDeposits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'sortDeposits',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link siloHelpersAbi}__ and `functionName` set to `"withdrawBeansFromSources"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xE145082A7C5EDd1767f8148A6c29a17488d1eb31)
 * -
 */
export const useSimulateSiloHelpers_WithdrawBeansFromSources =
  /*#__PURE__*/ createUseSimulateContract({
    abi: siloHelpersAbi,
    address: siloHelpersAddress,
    functionName: 'withdrawBeansFromSources',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_undefined =
  /*#__PURE__*/ createUseReadContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"functionPaused"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_FunctionPaused =
  /*#__PURE__*/ createUseReadContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'functionPaused',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"getLastExecutedSeason"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_GetLastExecutedSeason =
  /*#__PURE__*/ createUseReadContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'getLastExecutedSeason',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"getPintosLeftToSow"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_GetPintosLeftToSow =
  /*#__PURE__*/ createUseReadContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'getPintosLeftToSow',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"owner"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_Owner = /*#__PURE__*/ createUseReadContract({
  abi: sowBlueprintv0Abi,
  address: sowBlueprintv0Address,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"tractorHelpers"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_TractorHelpers =
  /*#__PURE__*/ createUseReadContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'tractorHelpers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"validateParamsAndReturnBeanstalkState"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_ValidateParamsAndReturnBeanstalkState =
  /*#__PURE__*/ createUseReadContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'validateParamsAndReturnBeanstalkState',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"validateParamsAndReturnBeanstalkStateArray"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useReadSowBlueprintv0_ValidateParamsAndReturnBeanstalkStateArray =
  /*#__PURE__*/ createUseReadContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'validateParamsAndReturnBeanstalkStateArray',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWriteSowBlueprintv0_undefined =
  /*#__PURE__*/ createUseWriteContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"pauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWriteSowBlueprintv0_PauseFunction =
  /*#__PURE__*/ createUseWriteContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'pauseFunction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWriteSowBlueprintv0_RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"sowBlueprintv0"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWriteSowBlueprintv0_SowBlueprintv0 =
  /*#__PURE__*/ createUseWriteContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'sowBlueprintv0',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWriteSowBlueprintv0_TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"unpauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWriteSowBlueprintv0_UnpauseFunction =
  /*#__PURE__*/ createUseWriteContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'unpauseFunction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useSimulateSowBlueprintv0_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"pauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useSimulateSowBlueprintv0_PauseFunction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'pauseFunction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"renounceOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useSimulateSowBlueprintv0_RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"sowBlueprintv0"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useSimulateSowBlueprintv0_SowBlueprintv0 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'sowBlueprintv0',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"transferOwnership"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useSimulateSowBlueprintv0_TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `functionName` set to `"unpauseFunction"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useSimulateSowBlueprintv0_UnpauseFunction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    functionName: 'unpauseFunction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sowBlueprintv0Abi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWatchSowBlueprintv0_undefined =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `eventName` set to `"FunctionPaused"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWatchSowBlueprintv0_FunctionPaused =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    eventName: 'FunctionPaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWatchSowBlueprintv0_OwnershipTransferred =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sowBlueprintv0Abi}__ and `eventName` set to `"SowOrderComplete"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xbb0a41927895F8ca2b4ECCc659ba158735fCF28B)
 * -
 */
export const useWatchSowBlueprintv0_SowOrderComplete =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sowBlueprintv0Abi,
    address: sowBlueprintv0Address,
    eventName: 'SowOrderComplete',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_undefined =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"add"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Add = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'add',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"bytes32Switch"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Bytes32Switch =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'bytes32Switch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"check"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Check = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'check',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"combineWithdrawalPlans"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_CombineWithdrawalPlans =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'combineWithdrawalPlans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"div"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Div = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'div',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"eq"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Eq = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'eq',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getAddressAndStem"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetAddressAndStem =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getAddressAndStem',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getBeanstalkPrice"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetBeanstalkPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getBeanstalkPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getHighestSeedToken"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetHighestSeedToken =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getHighestSeedToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getLPTokensToWithdrawForBeans"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetLpTokensToWithdrawForBeans =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getLPTokensToWithdrawForBeans',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getLowestSeedToken"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetLowestSeedToken =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getLowestSeedToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getSortedDeposits"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetSortedDeposits =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getSortedDeposits',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getSortedWhitelistedTokensBySeeds"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetSortedWhitelistedTokensBySeeds =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getSortedWhitelistedTokensBySeeds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getTokenIndex"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetTokenIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getTokenIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getTokensAscendingPrice"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetTokensAscendingPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getTokensAscendingPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getTokensAscendingSeeds"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetTokensAscendingSeeds =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getTokensAscendingSeeds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"getWhitelistStatusAddresses"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_GetWhitelistStatusAddresses =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'getWhitelistStatusAddresses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"gt"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Gt = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'gt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"gte"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Gte = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'gte',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"isOperatorWhitelisted"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_IsOperatorWhitelisted =
  /*#__PURE__*/ createUseReadContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'isOperatorWhitelisted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"lt"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Lt = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'lt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"lte"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Lte = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'lte',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"mod"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Mod = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'mod',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"mul"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Mul = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'mul',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"mulDiv"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_MulDiv = /*#__PURE__*/ createUseReadContract(
  {
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'mulDiv',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"neq"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Neq = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'neq',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"sub"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useReadTractorHelpers_Sub = /*#__PURE__*/ createUseReadContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'sub',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tractorHelpersAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useWriteTractorHelpers_undefined =
  /*#__PURE__*/ createUseWriteContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"tip"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useWriteTractorHelpers_Tip = /*#__PURE__*/ createUseWriteContract({
  abi: tractorHelpersAbi,
  address: tractorHelpersAddress,
  functionName: 'tip',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tractorHelpersAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useSimulateTractorHelpers_undefined =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tractorHelpersAbi}__ and `functionName` set to `"tip"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useSimulateTractorHelpers_Tip =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    functionName: 'tip',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tractorHelpersAbi}__
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useWatchTractorHelpers_undefined =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tractorHelpersAbi}__ and `eventName` set to `"OperatorReward"`
 *
 * -
 * - [__View Contract on Base Basescan__](https://basescan.org/address/0xBCa2F299602c2a43850c8b2FD19D5275D0F388b6)
 * -
 */
export const useWatchTractorHelpers_OperatorReward =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tractorHelpersAbi,
    address: tractorHelpersAddress,
    eventName: 'OperatorReward',
  })
