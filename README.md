## Pinto UI

**An interface for Pinto**

## Getting started

### Installation
```
# Install packages
yarn install

# Generate typed contracts, hooks and queries
yarn generate
NOTE: Make sure the abi doesn't have any enums with a type that isn't uint8, in our case, this seems to be one of the 'enum ShipmentRecipient' enums. This is a known issue https://github.com/ethereum/solidity/issues/9278

# Start development server
yarn dev
