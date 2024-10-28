import { Token } from "@/utils/types";
import pintoIcon from "@/assets/tokens/Pinto.png";
import pintoWethIcon from "@/assets/tokens/Pinto_wETH.png";
import pintoWstethIcon from "@/assets/tokens/Pinto_wstETH.png";
import { arbitrum, base } from "viem/chains";

export const tokens: { [chainId: number]: Token[] } = {
  [arbitrum.id]: [
    // Protocol Token
    {
      chainId: arbitrum.id,
      name: "Bean",
      symbol: "BEAN",
      address: "0xBEA0005B8599265D41256905A9B3073D397812E4",
      decimals: 6,
      isMain: true,
      logoURI: pintoIcon,
      color: "#246645",
    },
    // Native Chain Token
    {
      chainId: arbitrum.id,
      name: "Ether",
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      isNative: true,
      logoURI: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
    },
    // Well LP Tokens
    {
      chainId: arbitrum.id,
      name: "BEAN:WETH LP",
      symbol: "BEAN:WETH",
      address: "0xBeA00Aa8130aCaD047E137ec68693C005f8736Ce",
      decimals: 18,
      isLP: true,
      logoURI: pintoWethIcon,
      color: "#627EEA",
      tokens: ["0xBEA0005B8599265D41256905A9B3073D397812E4", "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"],
    },
    {
      chainId: arbitrum.id,
      name: "BEAN:wstETH LP",
      symbol: "BEAN:wstETH",
      address: "0xBEa00BbE8b5da39a3F57824a1a13Ec2a8848D74F",
      decimals: 18,
      isLP: true,
      logoURI: pintoWstethIcon,
      color: "#00A3FF",
      tokens: ["0xBEA0005B8599265D41256905A9B3073D397812E4", "0x5979D7b546E38E414F7E9822514be443A4800529"],
    },
    // Whitelisted Tokens
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
  ],
  [base.id]: [
    // Protocol Token
    {
      chainId: base.id,
      name: "Pinto",
      symbol: "PINTO",
      address: "0xb170000aeeFa790fa61D6e837d1035906839a3c8",
      decimals: 6,
      isMain: true,
      logoURI: pintoIcon,
      color: "#246645",
    },
    // Native Chain Token
    {
      chainId: base.id,
      name: "Ether",
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      isNative: true,
      logoURI: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
    },
    // Well LP Tokens
    {
      chainId: base.id,
      name: "PINTO:WETH LP",
      symbol: "PINTO:WETH",
      address: "0x3e110022a76aEde1fA51E43913730FE3D4C3cCBC",
      decimals: 18,
      isLP: true,
      logoURI: pintoWethIcon,
      color: "#627EEA",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0x4200000000000000000000000000000000000006"],
    },
    {
      chainId: base.id,
      name: "PINTO:cbETH LP",
      symbol: "PINTO:cbETH",
      address: "0x3e1111FF07062BbdaE1Af96fAF514133D9CE8Bfe",
      decimals: 18,
      isLP: true,
      logoURI: pintoWstethIcon,
      color: "#0052FF",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22"],
    },
    {
      chainId: base.id,
      name: "PINTO:USDC LP",
      symbol: "PINTO:USDC",
      address: "0x3e11334a0D56cA378cdE00a32f53C8cB0a7536b8",
      decimals: 18,
      isLP: true,
      logoURI: pintoWstethIcon,
      color: "#00A3FF",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"],
    },
    {
      chainId: base.id,
      name: "PINTO:cbBTC LP",
      symbol: "PINTO:cbBTC",
      address: "0x3e1122C27A21080546E9bca66421c078AF349Cd6",
      decimals: 18,
      isLP: true,
      logoURI: pintoWstethIcon,
      color: "#F7931A",
      tokens: ["0xb170000aeeFa790fa61D6e837d1035906839a3c8", "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf"],
    },
    // Whitelisted Tokens
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
    // Other Tokens
    {
      chainId: base.id,
      name: "USDCoin",
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
      name: "Tether USD",
      symbol: "USDT",
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      decimals: 6,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
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
    // Other Tokens
    /* {
            chainId: base.id,
            name: "Tether USD",
            symbol: "USDT",
            address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
            decimals: 6,
            logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        }, */
  ],
};
