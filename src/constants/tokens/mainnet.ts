import { Token } from "@/utils/types";
import pintoIcon from "@/assets/tokens/Pinto.png";
import pintoWethIcon from "@/assets/tokens/Pinto_wETH.png";
import pintoWstethIcon from "@/assets/tokens/Pinto_wstETH.png";

export const mainnetProtocol: Token[] = [
    {
        chainId: 1,
        address: "0xbea0000029ad1c77d3d5d23ba2d8893db9d1efab",
        name: "Bean",
        symbol: "BEAN",
        decimals: 6,
        logoURI: pintoIcon
    }
];

export const mainnetNative: Token[] = [
    {
        chainId: 1,
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        isNative: true,
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        logoURI: "https://assets.coingecko.com/coins/images/18447/thumb/bean-logo-coingecko.png?1696517934"
    },
];

export const mainnetLP: Token[] = [
    {
        chainId: 1,
        name: "BEAN:WETH LP",
        symbol: "BEAN:WETH",
        decimals: 18,
        isLP: true,
        address: "0xBEA0e11282e2bB5893bEcE110cF199501e872bAd",
        logoURI: pintoWethIcon
    },
    {
        chainId: 1,
        name: "BEAN:wstETH LP",
        symbol: "BEAN:wstETH",
        decimals: 18,
        isLP: true,
        address: "0xBeA0000113B0d182f4064C86B71c315389E4715D",
        logoURI: pintoWstethIcon
    }
];

export const mainnetPreferred: Token[] = [
    {
        name: "Wrapped Ether",
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        symbol: "WETH",
        decimals: 18,
        isWrappedNative: true,
        chainId: 1,
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    {
        chainId: 1,
        address: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
        name: "Wrapped stETH",
        symbol: "WSTETH",
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/18834/thumb/wstETH.png?1696518295"
    },
    {
        name: "Dai Stablecoin",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        symbol: "DAI",
        decimals: 18,
        chainId: 1,
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
    },
    {
        name: "USDCoin",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        symbol: "USDC",
        decimals: 6,
        chainId: 1,
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    {
        name: "Tether USD",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        symbol: "USDT",
        decimals: 6,
        chainId: 1,
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
        chainId: 1,
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
        name: "Curve 3pool LP",
        symbol: "3CRV",
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/12972/thumb/3pool_128.png?1696512759"
    },
];