<h1 align="center">
	<img  src="https://pinto.money/pinto-logo.png"  alt="Pinto Exchange"  title='Pinto Interface' height="64px"  />
	<br  />
	<span>Pinto Interface</span>
	<br  />
	<a href="https://pinto.money/discord">
		<img src="https://img.shields.io/discord/1308123512216748105?label=Pinto%20Discord"/>
	</a>
</h1>

## System Requirements
- **Yarn Version:** 4.5.0
- **Node Version:** >= 18


## Installation

```bash
# Install packages
yarn install

# Generate typed contracts, hooks and queries
yarn generate

# Start dev server on localhost:5173
yarn dev
```

## Linting
We use **Biome** for linting and formatting. Install the Biome extension in your IDE and set it as the default formatter. If you have Prettier and/or EsLint installed, it’s recommended to disable them to prevent conflicts during formatting.


## Environment Variables

Create a `.env.local` at the project root. See `.env.example` for more details. At a minimum, you should have the following environment variables defined:

```bash
# https://www.alchemy.com/
VITE_ALCHEMY_API_KEY=
# https://0x.org/
VITE_ZEROEX_API_KEY=
# Comma separated list of chain ids. (ex: "1337,8543")
VITE_CHAINS=
```


## Environment Setup

### Local Development Fork
We highly recommend setting up a local fork. Instructions to install Anvil by Foundry can be found [here](https://book.getfoundry.sh/getting-started/installation). Once installed, you can run your fork locally via:
 
```bash
# Run your fork locally
anvil --fork-url https://base-mainnet.g.alchemy.com/v2/{alchemy_api_key} --chain-id 1337
```
### Protocol Dev Server

To assist in development, a dev page is available in the dev environment with on-chain utilities, such as:

- Minting tokens to an address
- Managing Well liquidity
- Setting token approvals
- Forwarding Seasons

To use these utilities:

```bash
# Clone the repo
git clone git@github.com:pinto-org/protocol.git && cd protocol
	
# Install npm dependencies
yarn install

# Run the protocol dev server
yarn hardhat-server
```
Then, navigate to the `/dev` or dev in the navbar to access the on-chain utilities. A toast will render upon a successful function call.



## Troubleshooting

- **Enum Types**: Ensure the ABI doesn’t have any enums with a type that isn’t `uint8`. (For instance, an enum `ShipmentRecipient` with a different type can cause issues.) See this known Solidity issue for [more details](https://github.com/ethereum/solidity/issues/9278).
- **Oracle Timeouts**: Because the Protocol uses time-based parameters to prevent manipulation, certain function calls (e.g., to the Pinto Price Contract) will often fail in the dev environment if the local fork’s time is out of sync. To fix this, navigate to the dev page and click `Update Oracle Timeouts`. It’s recommended to update these timeouts whenever you reset your local fork.
- **On-Chain vs. Subgraph Data**: The app uses on-chain data for most real-time values and the subgraph for historical data (e.g., chart or seasonal data) and the Pod Marketplace. As a result, when using a local fork, any components dependent on the subgraph may not reflect local on-chain state.
- **0x Swap API**: We leverage the 0x Swap API to route and split users’ swaps. Because these API responses reflect mainnet state, you may encounter issues during period of high price volatility or if your local fork’s state diverges greatly from mainnet. Try increasing slippage or disabling 0x locally by setting `aggDisabled` to `true` in `useSwap.tsx`.
- **Alchemy Auth Errors**: If you see authentication errors from Alchemy, verify that your API key is correct and that Base is enabled as a supported network for that key.
- **Infinitely Pending Transactions**: This typically happens when the transaction nonce in your wallet doesn't match the expected nonce from your local fork. **After resetting your fork, make sure to reset the nonce in your wallet** to avoid stuck transactions.


If you run into issues not covered here, or have questions about contributing, feel free to ask in our [#frontend](https://discord.com/channels/1308123512216748105/1348517965997412374) channel on Discord. We're happy to help troubleshoot, clarify edge cases, review PRs, and answer any questions!


## License

[MIT](https://github.com/pintomoney/interface/blob/main/LICENSE.txt)