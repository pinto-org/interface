export interface MetaProps {
  title: string;
  url: string;
  description: string;
  imgUrl?: string;
}

const slugs = [
  "index",
  "overview",
  "silo",
  "field",
  "swap",
  "market",
  "transfer",
  "explorer",
  "404",
  "PINTOUSDC",
  "PINTOcbBTC",
  "PINTOWSOL",
  "PINTOWETH",
  "PINTOcbETH",
  "PINTO",
  "wrap",
] as const;

const nestedSlugs = ["PINTOUSDC", "PINTOcbBTC", "PINTOWSOL", "PINTOWETH", "PINTOcbETH", "PINTO"] as const;

export type MetaSlug = (typeof slugs)[number] | (typeof nestedSlugs)[number];

const PINTO_META: Record<MetaSlug, MetaProps> = {
  index: {
    title: "Pinto | Low Volatility Money",
    url: "https://pinto.money",
    description: "Pinto: Censorship Resistant Low Volatility Money",
  },
  overview: {
    title: "Pinto | Low Volatility Money",
    url: "https://pinto.money/overview",
    description: "Pinto: Censorship Resistant Low Volatility Money",
  },
  "404": {
    title: "404 Page Not Found | Pinto",
    url: "https://pinto.money/404",
    description: "Page not found",
  },
  silo: {
    title: "Silo: The Pinto Deposit Facility",
    url: "https://pinto.money/silo",
    description:
      "Pinto's permissionless deposit facility is designed to attract and retain liquidity and reduce volatility. Depositors earn Stalk and Seeds to benefit from protocol-native financial incentives, including seigniorage.",
  },
  transfer: {
    title: "Transfer: Send protocol native assets",
    url: "https://pinto.money/transfer",
    description: "Send assets to another address through the protocol.",
  },
  field: {
    title: "Field: The Pinto Credit Facility",
    url: "https://pinto.money/field",
    description:
      "Pinto's permissionless credit facility is designed to attract lenders to the protocol during periods of excess supply. Lenders Pinto (Sow) for Pods, the protocol-native debt asset, which are repaid on a first in first out basis.",
  },
  swap: {
    title: "Swap: Buy and Sell Pinto",
    url: "https://pinto.money/swap",
    description: "Perform zero fee swaps between Pinto and whitelisted assets. Powered by the Pinto Exchange.",
  },
  market: {
    title: "Pod Market: Trade Pods",
    url: "https://pinto.money/market",
    description:
      "Trade Pods, the protocol-native debt asset of Pinto, in a censorship resistant, trustless and permissionless marketplace.",
  },
  explorer: {
    title: "Explorer: Pinto Analytics",
    url: "https://pinto.money/explorer",
    description:
      "Explore real-time charts and historical data on Pinto's market activity and overall protocol health, including liquidity and stability.",
  },
  PINTO: {
    title: "PINTO | Pinto",
    url: "https://pinto.money/silo/0xb170000aeeFa790fa61D6e837d1035906839a3c8",
    description: "Deposit, convert, and withdraw deposited PINTO.",
  },
  PINTOUSDC: {
    title: "PINTOUSDC LP | Pinto",
    url: "https://pinto.money/silo/0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1",
    description: "Deposit, convert, and withdraw deposited PINTOUSDC.",
  },
  PINTOcbBTC: {
    title: "PINTOcbBTC LP | Pinto",
    url: "https://pinto.money/silo/0x3e11226fe3d85142B734ABCe6e58918d5828d1b4",
    description: "Deposit, convert, and withdraw deposited PINTOcbBTC.",
  },
  PINTOWSOL: {
    title: "PINTOWSOL LP | Pinto",
    url: "https://pinto.money/silo/0x3e11444c7650234c748D743D8d374fcE2eE5E6C9",
    description: "Deposit, convert, and withdraw deposited PINTOWSOL.",
  },
  PINTOWETH: {
    title: "PINTOWETH LP | Pinto",
    url: "https://pinto.money/silo/0x3e11001CfbB6dE5737327c59E10afAB47B82B5d3",
    description: "Deposit, convert, and withdraw deposited PINTOWETH.",
  },
  PINTOcbETH: {
    title: "PINTOcbETH LP | Pinto",
    url: "https://pinto.money/silo/0x3e111115A82dF6190e36ADf0d552880663A4dBF1",
    description: "Deposit, convert, and withdraw deposited PINTOcbETH.",
  },
  wrap: {
    title: "Wrap and Unwrap Pinto | sPinto",
    url: "https://pinto.money/wrap",
    description:
      "sPinto is a yield bearing token denominated in Pinto. It wraps Pinto Silo deposits and adheres to the ERC-20 and ERC-4626 standards. The token will increase in Pinto denominated value as yield accrues and does not rebase.",
  },
};

export default PINTO_META;
