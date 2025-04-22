import ethIcon from "@/assets/tokens/ETH.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import pintoUsdcIcon from "@/assets/tokens/PINTO_USDC.png";
import pintoWethIcon from "@/assets/tokens/PINTO_WETH.png";
import pintoWsolIcon from "@/assets/tokens/PINTO_WSOL.png";
import pintoCbbtcIcon from "@/assets/tokens/PINTO_cbBTC.png";
import pintoCbethIcon from "@/assets/tokens/PINTO_cbETH.png";
import spectrasPintoLPIcon from "@/assets/tokens/SPECTRA-sPINTO-LP.png";
import spectrasPintoPTIcon from "@/assets/tokens/SPECTRA-sPINTO-PT.png";
import spectrasPintoYTIcon from "@/assets/tokens/SPECTRA-sPINTO-YT.png";
import wsolIcon from "@/assets/tokens/WSOL.png";
import crsPintoIcon from "@/assets/tokens/crsPINTO.png";
import sPintoIcon from "@/assets/tokens/sPINTO.png";
import { Token, Token3PIntegration } from "@/utils/types";
import { ChainLookup } from "@/utils/types.generic";
import { arbitrum, base } from "viem/chains";

const defaultChain = base.id;

// -------------------- PROTOCOL TOKEN --------------------

export const MAIN_TOKEN: ChainLookup<Token> = {
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: "Bean",
    symbol: "BEAN",
    address: "0xBEA0005B8599265D41256905A9B3073D397812E4",
    decimals: 6,
    displayDecimals: 2,
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
    displayDecimals: 2,
    isMain: true,
    logoURI: pintoIcon,
    color: "#246645",
  },
} as const;

// -------------------- CHAIN NATIVE TOKENS --------------------

export const NATIVE_TOKEN: ChainLookup<Token> = {
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: "Ether",
    symbol: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    displayDecimals: 2,
    isNative: true,
    logoURI: ethIcon,
  },
  [base.id]: {
    chainId: base.id,
    name: "Ether",
    symbol: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    displayDecimals: 2,
    isNative: true,
    logoURI: ethIcon,
  },
} as const;

// -------------------- WELL UNDERLYING TOKENS --------------------

export const WETH_TOKEN: ChainLookup<Token> = {
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
    displayDecimals: 2,
    isWrappedNative: true,
    isWhitelisted: true,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    color: "#8C8C8C",
  },
  [base.id]: {
    chainId: base.id,
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    displayDecimals: 2,
    isWrappedNative: true,
    isWhitelisted: true,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    color: "#8C8C8C",
  },
} as const;

export const USDC_TOKEN: ChainLookup<Token> = {
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: "USDCoin",
    symbol: "USDC",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
    displayDecimals: 2,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
  [base.id]: {
    chainId: base.id,
    name: "USD Coin",
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    displayDecimals: 2,
    isWhitelisted: true,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    color: "#2775CA",
  },
} as const;

export const CBETH_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "Coinbase Wrapped Staked ETH",
    symbol: "cbETH",
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    displayDecimals: 2,
    isWhitelisted: true,
    logoURI: "https://assets.coingecko.com/coins/images/27008/standard/cbeth.png?1709186989",
    color: "#0052FF",
  },
} as const;

export const CBBTC_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "Coinbase Wrapped BTC",
    symbol: "cbBTC",
    address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
    decimals: 8,
    displayDecimals: 2,
    isWhitelisted: true,
    logoURI: "https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp?1726136727",
    color: "#F7931A",
  },
} as const;

export const WSOL_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "Wrapped SOL (Wormhole)",
    symbol: "WSOL",
    address: "0x1C61629598e4a901136a81BC138E5828dc150d67",
    decimals: 9,
    displayDecimals: 2,
    isWhitelisted: true,
    logoURI: wsolIcon,
    color: "#9945FF",
  },
} as const;

// -------------------- LP TOKENS --------------------

export const PINTO_WSOL_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "PINTOWSOL LP",
    symbol: "PINTOWSOL",
    address: "0x3e11444c7650234c748D743D8d374fcE2eE5E6C9",
    decimals: 18,
    displayDecimals: 6, // show 6 decimal places for this token
    isLP: true,
    logoURI: pintoWsolIcon,
    color: "#9945FF",
    tokens: [MAIN_TOKEN[base.id].address, WSOL_TOKEN[base.id].address],
  },
} as const;

export const PINTO_WETH_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "PINTOWETH LP",
    symbol: "PINTOWETH",
    address: "0x3e11001CfbB6dE5737327c59E10afAB47B82B5d3",
    decimals: 18,
    displayDecimals: 2,
    isLP: true,
    logoURI: pintoWethIcon,
    color: "#8C8C8C",
    tokens: [MAIN_TOKEN[base.id].address, WETH_TOKEN[base.id].address],
  },
} as const;

export const PINTO_CBETH_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "PINTOcbETH LP",
    symbol: "PINTOcbETH",
    address: "0x3e111115A82dF6190e36ADf0d552880663A4dBF1",
    decimals: 18,
    displayDecimals: 2,
    isLP: true,
    logoURI: pintoCbethIcon,
    color: "#0052FF",
    tokens: [MAIN_TOKEN[base.id].address, CBETH_TOKEN[base.id].address],
  },
} as const;

export const PINTO_USDC_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "PINTOUSDC LP",
    symbol: "PINTOUSDC",
    address: "0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1",
    decimals: 18,
    displayDecimals: 2,
    isLP: true,
    logoURI: pintoUsdcIcon,
    color: "#2775CA",
    tokens: [MAIN_TOKEN[base.id].address, USDC_TOKEN[base.id].address],
  },
} as const;

export const PINTO_CBBTC_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "PINTOcbBTC LP",
    symbol: "PINTOcbBTC",
    address: "0x3e11226fe3d85142B734ABCe6e58918d5828d1b4",
    decimals: 18,
    displayDecimals: 6, // show 6 decimal places for this token
    isLP: true,
    logoURI: pintoCbbtcIcon,
    color: "#F7931A",
    tokens: [MAIN_TOKEN[base.id].address, CBBTC_TOKEN[base.id].address],
  },
} as const;

// -------------------- SILO WRAPPED MAIN TOKEN --------------------

export const S_MAIN_TOKEN: ChainLookup<Token> = {
  [base.id]: {
    chainId: base.id,
    name: "Siloed Pinto",
    symbol: "sPINTO",
    address: "0x00b174d66adA7d63789087F50A9b9e0e48446dc1",
    decimals: 18,
    displayDecimals: 2,
    isSiloWrapped: true,
    logoURI: sPintoIcon,
    description: "sPINTO is a yield-bearing, ERC-20 representation of a PINTO Silo Deposit.",
  },
} as const;

// -------------------- THIRD-PARTY INTEGRATIONS --------------------

// Cream
export const CREAM_S_MAIN_TOKEN: ChainLookup<Token3PIntegration> = {
  [base.id]: {
    chainId: base.id,
    name: "Cream Siloed Pinto",
    symbol: "crsPINTO",
    address: "0x98887ED12565cd9518f41A009d2EcE7c71ff271e",
    decimals: 8,
    displayDecimals: 2,
    is3PSiloWrapped: true,
    logoURI: crsPintoIcon,
    integration: "CREAM",
    description:
      "crsPINTO is a yield-bearing, ERC-20 representation of a PINTO Silo Deposit, integrated by Cream Finance.",
  },
} as const;

// Spectra
export const SPECTRA_YT_TOKEN: ChainLookup<Token3PIntegration> = {
  [base.id]: {
    chainId: base.id,
    name: "Yield Token: sPINTO",
    symbol: "sPINTO YT",
    address: "0xaF4f5bdF468861feF71Ed6f5ea0C01A75B62273d",
    decimals: 18,
    displayDecimals: 2,
    is3PSiloWrapped: true,
    logoURI: spectrasPintoYTIcon,
    integration: "SPECTRA",
  },
};

export const SPECTRA_PT_TOKEN: ChainLookup<Token3PIntegration> = {
  [base.id]: {
    chainId: base.id,
    name: "Principal Token: sPINTO",
    symbol: "sPINTO PT",
    address: "0x42AF817725D8cda8E69540d72f35dBfB17345178",
    decimals: 18,
    displayDecimals: 2,
    is3PSiloWrapped: true,
    logoURI: spectrasPintoPTIcon,
    integration: "SPECTRA",
  },
};

export const SPECTRA_LP_TOKEN: ChainLookup<Token3PIntegration> = {
  [base.id]: {
    chainId: base.id,
    name: "sPINTO Curve.fi Factory Crypto Pool: Spectra-PT/IBT",
    symbol: "sPINTO LP",
    address: "0xba1F1eA8c269003aFe161aFAa0bd205E2c7F782a",
    decimals: 18,
    displayDecimals: 2,
    is3PSiloWrapped: true,
    logoURI: spectrasPintoLPIcon,
    integration: "SPECTRA",
  },
};

// -------------------- AGGREGATED TOKEN LISTS --------------------

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
      color: "#8C8C8C",
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
    PINTO_WETH_TOKEN[base.id],
    PINTO_USDC_TOKEN[base.id],
    PINTO_CBETH_TOKEN[base.id],
    PINTO_CBBTC_TOKEN[base.id],
    PINTO_WSOL_TOKEN[base.id],
  ],
} as const;

export const PROTOCOL_INTEGRATION_TOKENS: ChainLookup<Token[]> = {
  [base.id]: [
    CREAM_S_MAIN_TOKEN[base.id],
    SPECTRA_YT_TOKEN[base.id],
    SPECTRA_PT_TOKEN[base.id],
    SPECTRA_LP_TOKEN[base.id],
  ],
} as const;

export const UNDERLYING_TOKENS: ChainLookup<Token[]> = {
  [arbitrum.id]: [
    WETH_TOKEN[arbitrum.id],
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
    WETH_TOKEN[base.id],
    USDC_TOKEN[base.id],
    CBETH_TOKEN[base.id],
    CBBTC_TOKEN[base.id],
    WSOL_TOKEN[base.id],
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
    USDC_TOKEN[arbitrum.id],
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
    // Silo Wrapped Pinto
    S_MAIN_TOKEN[base.id],
    // Cream Silo Wrapped Pinto
    CREAM_S_MAIN_TOKEN[base.id],
  ],
};

// -------------------- BASE ONLY TOKENS --------------------

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
