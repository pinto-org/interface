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

# Create a file called .env.local, copy the contents of .env.example to it
For testing purposes, an API key is provided. Will be removed later

# Start development server
yarn dev
```

## License

[MIT](https://github.com/pintomoney/interface/blob/main/LICENSE.txt)
