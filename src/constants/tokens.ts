import ethIcon from "@/assets/tokens/ETH.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import pintoUsdcIcon from "@/assets/tokens/PINTO_USDC.png";
import pintoWethIcon from "@/assets/tokens/PINTO_WETH.png";
import pintoWsolIcon from "@/assets/tokens/PINTO_WSOL.png";
import pintoCbbtcIcon from "@/assets/tokens/PINTO_cbBTC.png";
import pintoCbethIcon from "@/assets/tokens/PINTO_cbETH.png";
import wsolIcon from "@/assets/tokens/WSOL.png";
import { Token } from "@/utils/types";
import { ChainLookup } from "@/utils/types.generic";
import { arbitrum, base } from "viem/chains";

const defaultChain = base.id;

export const MAIN_TOKEN: ChainLookup<Token> = {
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: "Bean",
    symbol: "BEAN",
    address: "0xBEA0005B8599265D41256905A9B3073D397812E4",
    decimals: 6,
    isMain: true,
    logoURI: pintoIcon,
    color: "#246645",
  },
  [base.id]: {
    chainId: base.id,
    name: "PINTO",
    symbol: "PINTO",
    address: "0xb170000aeeFa790fa61D6e837d1035906839a3c8",
    decimals: 6,
    isMain: true,
    logoURI: pintoIcon,
    color: "#246645",
  },
} as const;

export const NATIVE_TOKEN: ChainLookup<Token> = {
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: "Ether",
    symbol: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    isNative: true,
    logoURI: ethIcon,
  },
  [base.id]: {
    chainId: base.id,
    name: "Ether",
    symbol: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    isNative: true,
    logoURI: ethIcon,
  },
} as const;

export const LP_TOKENS: ChainLookup<Token[]> = {
  [arbitrum.id]: [
    {
      chainId: arbitrum.id,
      name: "BEANWETH LP",
      symbol: "BEANWETH",
      address: "0xBeA00Aa8130aCaD047E137ec68693C005f8736Ce",
      decimals: 18,
      isLP: true,
      logoURI: pintoWethIcon,
      color: "#627EEA",
      tokens: ["0xBEA0005B8599265D41256905A9B3073D397812E4", "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"],
    },
    {
      chainId: arbitrum.id,
      name: "BEANwstETH LP",
      symbol: "BEANwstETH",
      address: "0xBEa00BbE8b5da39a3F57824a1a13Ec2a8848D74F",
      decimals: 18,
      isLP: true,
      logoURI: pintoWethIcon,
      color: "#00A3FF",
      tokens: ["0xBEA0005B8599265D41256905A9B3073D397812E4", "0x5979D7b546E38E414F7E9822514be443A4800529"],
    },
  ],
  [base.id]: [
    {
      chainId: base.id,
      name: "PINTOWETH LP",
      symbol: "PINTOWETH",
      address: "0x3e11001CfbB6dE5737327c59E10afAB47B82B5d3",
      decimals: 18,
      isLP: true,
      logoURI: pintoWethIcon,
      color: "#627EEA",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0x4200000000000000000000000000000000000006"],
    },
    {
      chainId: base.id,
      name: "PINTOcbETH LP",
      symbol: "PINTOcbETH",
      address: "0x3e111115A82dF6190e36ADf0d552880663A4dBF1",
      decimals: 18,
      isLP: true,
      logoURI: pintoCbethIcon,
      color: "#0052FF",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22"],
    },
    {
      chainId: base.id,
      name: "PINTOUSDC LP",
      symbol: "PINTOUSDC",
      address: "0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1",
      decimals: 18,
      isLP: true,
      logoURI: pintoUsdcIcon,
      color: "#00A3FF",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"],
    },
    {
      chainId: base.id,
      name: "PINTOcbBTC LP",
      symbol: "PINTOcbBTC",
      address: "0x3e11226fe3d85142B734ABCe6e58918d5828d1b4",
      decimals: 18,
      isLP: true,
      logoURI: pintoCbbtcIcon,
      color: "#F7931A",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf"],
    },
    {
      chainId: base.id,
      name: "PINTOWSOL LP",
      symbol: "PINTOWSOL",
      address: "0x3e11444c7650234c748D743D8d374fcE2eE5E6C9",
      decimals: 18,
      isLP: true,
      logoURI: pintoWsolIcon,
      color: "#9945FF",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0x1C61629598e4a901136a81BC138E5828dc150d67"],
    },
  ],
} as const;

export const UNDERLYING_TOKENS: ChainLookup<Token[]> = {
  [arbitrum.id]: [
    {
      chainId: arbitrum.id,
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      decimals: 18,
      isWrappedNative: true,
      isWhitelisted: true,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      color: "#627EEA",
    },
    {
      chainId: arbitrum.id,
      name: "Wrapped stETH",
      symbol: "WSTETH",
      address: "0x5979D7b546E38E414F7E9822514be443A4800529",
      decimals: 18,
      isWhitelisted: true,
      logoURI: "https://assets.coingecko.com/coins/images/18834/thumb/wstETH.png?1696518295",
      color: "#00A3FF",
    },
  ],
  [base.id]: [
    {
      chainId: base.id,
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      isWrappedNative: true,
      isWhitelisted: true,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      color: "#627EEA",
    },
    {
      chainId: base.id,
      name: "USD Coin",
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      isWhitelisted: true,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      color: "#2775CA",
    },
    {
      chainId: base.id,
      name: "Coinbase Wrapped Staked ETH",
      symbol: "cbETH",
      address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
      decimals: 18,
      isWhitelisted: true,
      logoURI: "https://assets.coingecko.com/coins/images/27008/standard/cbeth.png?1709186989",
      color: "#0052FF",
    },
    {
      chainId: base.id,
      name: "Coinbase Wrapped BTC",
      symbol: "cbBTC",
      address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
      decimals: 8,
      isWhitelisted: true,
      logoURI: "https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp?1726136727",
      color: "#F7931A",
    },
    {
      chainId: base.id,
      name: "Wrapped SOL (Wormhole)",
      symbol: "WSOL",
      address: "0x1C61629598e4a901136a81BC138E5828dc150d67",
      decimals: 9,
      isWhitelisted: true,
      logoURI: wsolIcon,
      color: "#9945FF",
    },
  ],
} as const;

export const tokens: { [chainId: number]: Token[] } = {
  [arbitrum.id]: [
    // Protocol Token
    MAIN_TOKEN[arbitrum.id],
    // Native Chain Token
    NATIVE_TOKEN[arbitrum.id],
    // Well LP Tokens
    ...LP_TOKENS[arbitrum.id],
    // Other Tokens
    {
      chainId: arbitrum.id,
      name: "USDCoin",
      symbol: "USDC",
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    {
      chainId: arbitrum.id,
      name: "Tether USD",
      symbol: "USDT",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimals: 6,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    // Whitelisted Tokens
    ...UNDERLYING_TOKENS[arbitrum.id],
  ],
  [base.id]: [
    // Protocol Token
    MAIN_TOKEN[base.id],
    // Native Chain Token
    NATIVE_TOKEN[base.id],
    // Well LP Tokens
    ...LP_TOKENS[base.id],
    // Whitelisted Tokens
    ...UNDERLYING_TOKENS[base.id],
  ],
};

// Protocol Token
export const PINTO = MAIN_TOKEN[defaultChain];

// Native Chain Token
export const ETH = NATIVE_TOKEN[defaultChain][1];

// Well LP Tokens
export const PINTOWETH = LP_TOKENS[defaultChain][0];
export const PINTOCBETH = LP_TOKENS[defaultChain][1];
export const PINTOUSDC = LP_TOKENS[defaultChain][2];
export const PINTOCBBTC = LP_TOKENS[defaultChain][3];
export const PINTOWSOL = LP_TOKENS[defaultChain][4];

// Underlying Tokens
export const WETH = UNDERLYING_TOKENS[defaultChain][0];
export const USDC = UNDERLYING_TOKENS[defaultChain][1];
export const CBETH = UNDERLYING_TOKENS[defaultChain][2];
export const CBBTC = UNDERLYING_TOKENS[defaultChain][3];
export const WSOL = UNDERLYING_TOKENS[defaultChain][4];

// {
//   chainId: base.id,
//   name: "Tether USD",
//   symbol: "USDT",
//   address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
//   decimals: 6,
//   logoURI:
//     "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
// };
