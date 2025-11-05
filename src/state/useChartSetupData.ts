import pintoExchangeLogo from "@/assets/misc/pinto-exchange-logo.svg";
import podIcon from "@/assets/protocol/Pod.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { CBBTC_TOKEN, CBETH_TOKEN, WETH_TOKEN, WSOL_TOKEN } from "@/constants/tokens";
import { chartFormatters, formatNum, formatPct, formatUSD } from "@/utils/format";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import useTokenData from "./useTokenData";

type ChartType = "Pinto" | "Field" | "Silo" | "Tractor" | "Exchange" | "Inflow" | "Market";
interface ChartSetupBase {
  /**
   * Chart ID
   */
  id: string;
  /**
   * Chart type, used to categorize charts in the Select panel
   */
  type: ChartType;
  /**
   * Name of variable to be used to fill the time scale. Usually "timestamp"
   */
  timeScaleKey: string;
  /**
   * Name of variable to be used to fill the price scale.
   */
  priceScaleKey: string;
  /**
   * Short name for this chart
   */
  name: string;
  /**
   * Short description for this chart, used in the Select panel
   */
  shortDescription: string;
  /**
   * Longer name for this chart, used on tooltips (not implemented yet)
   */
  tooltipTitle?: string;
  /**
   * Longer description for this chart, used on tooltips (not implemented yet)
   */
  tooltipHoverText?: string | JSX.Element;
  /**
   * Icon for this chart, shown in the Select panel
   */
  icon: string;
  /**
   * In Lightweight Charts, each price scale can have its own id tag, allowing
   * for multiple data sets to use the same price scale.
   *
   * For example, it makes sense for Instant DeltaB and TWA DeltaB to share the same price scale,
   * therefore they have the same valueAxisType.
   */
  valueAxisType: string;
  /**
   * Formats the value into a number for Lightweight Charts, this is the number
   * it uses internally to plot the line chart
   */
  valueFormatter: (value: any) => number;
  /**
   * Formats the number into a string. This is what is shown above the chart,
   * so this is where we want to do things like adding dollar signs and the like
   */
  tickFormatter: (value: number) => string;
  /**
   * Formats the number into a string. This is what is shown on the price scale,
   * so it's a good idea to make this a short string (ie: 30M instead of 30,000,000)
   * for aestethic purposes
   */
  shortTickFormatter: (value: number) => string;
  /**
   * Optinal extra required inputs when using this chart.
   * START_SEASON: numeric entry for a season number
   */
  inputOptions?: "SEASON";
}

export type ChartSetup = ChartSetupBase & {
  index: number;
};

type ChartColors = Array<{
  lineColor: string;
}>;

// The length of chartColors determines how many charts you can plot at the same time
export const chartColors: ChartColors = [
  {
    lineColor: "#246645", // Pinto Green (pinto-green-3)
  },
  {
    lineColor: "#1E6091", // Deep Blue
  },
  {
    lineColor: "#D62828", // Vibrant Red
  },
  {
    lineColor: "#8338EC", // Bright Purple
  },
  {
    lineColor: "#FF9F1C", // Golden Orange
  },
  {
    lineColor: "#00BCD4", // Light Blue / Cyan
  },
];

const usdFormatter = (v: number) => {
  const formatted = TokenValue.fromHuman(v, 2).toHuman("short");
  // Ensure 2 decimal places
  if (formatted.match(/[KMBT]$/)) {
    const [num, suffix] = formatted.split(/([KMBT])/);
    return `$${Number(num).toFixed(2)}${suffix}`;
  }
  return `$${formatted}`;
};

// Function to generate Pinto charts
const createPintoCharts = (mainToken: Token): ChartSetupBase[] => [
  {
    id: "priceInstantPINTO",
    type: "Pinto",
    name: "Pinto Price",
    tooltipTitle: "Current Pinto Price",
    tooltipHoverText: "The Current Price of Pinto in USD",
    shortDescription: "The USD price of 1 Pinto.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "instPrice",
    valueAxisType: "PINTO_price",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatUSD(v, { decimals: 4 }),
    shortTickFormatter: (v: number) => formatUSD(v, { decimals: 4 }),
  },
  {
    id: "supplyPINTO",
    type: "Pinto",
    name: "Supply",
    tooltipTitle: "Pinto Supply",
    tooltipHoverText: "The total Pinto supply at the beginning of every Season.",
    shortDescription: "The total Pinto supply.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "supply",
    valueAxisType: "PINTO_amount",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "marketCap",
    type: "Pinto",
    name: "Market Cap",
    tooltipTitle: "Market Cap",
    tooltipHoverText: "The USD value of the Pinto supply at the beginning of every Season.",
    shortDescription: "The USD value of the Pinto supply.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "marketCap",
    valueAxisType: "marketCap",
    valueFormatter: (v: number) => v,
    tickFormatter: usdFormatter,
    shortTickFormatter: usdFormatter,
  },
  {
    id: "priceTargetCrosses",
    type: "Pinto",
    name: "Price Target Crosses",
    tooltipTitle: "Price Target Crosses",
    tooltipHoverText: "The total number of times Pinto has crossed its price target at the beginning of every Season.",
    shortDescription: "The total number of times Pinto has crossed its price target.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "crosses",
    valueAxisType: "priceTargetCrosses",
    valueFormatter: (v: number) => v,
    tickFormatter: (v: number) => v.toFixed(0),
    shortTickFormatter: (v: number) => v.toFixed(0),
  },
  {
    id: "priceTwaPINTO",
    type: "Pinto",
    name: "TWA Pinto Price",
    tooltipTitle: "TWA Pinto Price",
    tooltipHoverText:
      "The cumulative liquidity and time weighted average USD price of 1 Pinto at the beginning of every Season.",
    shortDescription: "The cumulative liquidity and time weighted average USD price of 1 Pinto.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "twaPrice",
    valueAxisType: "PINTO_price",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatUSD(v, { decimals: 4 }),
    shortTickFormatter: (v: number) => formatUSD(v, { decimals: 4 }),
  },
  {
    id: "instDeltaB",
    type: "Pinto",
    name: "Instantaneous ΔP",
    tooltipTitle: "Cumulative Instantaneous ΔP",
    tooltipHoverText:
      "The cumulative instantaneous shortage of Pinto in liquidity pools on the Minting Whitelist at the beginning of every Season.",
    shortDescription: "The cumulative instantaneous shortage of Pinto in liquidity pools on the Minting Whitelist.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "instDeltaB",
    valueAxisType: "deltaB",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatNum(v, { allowZero: true, maxDecimals: 0, showPositiveSign: true }),
    shortTickFormatter: (v: number) => formatNum(v, { allowZero: true, maxDecimals: 0, showPositiveSign: true }),
  },
  {
    id: "twaDeltaB",
    type: "Pinto",
    name: "TWA ΔP",
    tooltipTitle: "Cumulative TWA ΔP",
    tooltipHoverText:
      "The cumulative liquidity and time weighted average shortage of Pinto in liquidity pools on the Minting Whitelist at the beginning of every Season.",
    shortDescription: "The time weighted average shortage of Pinto in liquidity pools on the Minting Whitelist.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "twaDeltaB",
    valueAxisType: "deltaB",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) =>
      formatNum(v, { allowZero: true, maxDecimals: 4, minDecimals: 4, showPositiveSign: true }),
    shortTickFormatter: (v: number) =>
      formatNum(v, { allowZero: true, maxDecimals: 4, minDecimals: 4, showPositiveSign: true }),
  },
  {
    id: "l2sr",
    type: "Pinto",
    name: "Liquidity to Supply Ratio",
    tooltipTitle: "Liquidity to Supply Ratio",
    tooltipHoverText:
      "The ratio of Pinto in Liquidity Pools on the Minting Whitelist per outstanding Pinto, displayed as a percentage.",
    shortDescription:
      "The ratio of Pinto in Liquidity Pools on the Minting Whitelist per outstanding Pinto, displayed as a percentage.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "l2sr",
    valueAxisType: "L2SR",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
];

// Function to generate Field charts
const createFieldCharts = (mainToken: Token): ChartSetupBase[] => [
  {
    id: "pintoMaxTemperature",
    type: "Field",
    name: "Max Temperature",
    tooltipTitle: "Max Temperature",
    tooltipHoverText: "The maximum interest rate for Sowing Pinto every Season.",
    shortDescription: "The maximum interest rate for Sowing Pinto every Season.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "temperature",
    valueAxisType: "temperature",
    valueFormatter: (v: number) => v,
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
  {
    id: "issuedSoil",
    type: "Field",
    name: "Issued Soil",
    tooltipTitle: "Issued Soil",
    tooltipHoverText: "The amount of Soil available every Season.",
    shortDescription: "The amount of Soil available every Season.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "issuedSoil",
    valueAxisType: "issuedSoil",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "cultivationFactor",
    type: "Field",
    name: "Cultivation Factor",
    tooltipTitle: "Cultivation Factor",
    tooltipHoverText:
      "The Cultivation Factor scales the amount of Soil issuance every Season. This factor fluctuates every Season based on whether all Soil was sold out in the prior Season.",
    shortDescription: "The Cultivation Factor scales the amount of Soil issuance every Season.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "cultivationFactor",
    valueAxisType: "cultivationFactor",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
  {
    id: "cultivationTemperature",
    type: "Field",
    name: "Cultivation Temperature",
    tooltipTitle: "Cultivation Temperature",
    tooltipHoverText:
      "The Max Temperature when Soil is selling out and demand for Soil is increasing. This value doesn't start affecting the Cultivation Factor until Season 5067.",
    shortDescription: "The Max Temperature when Soil is selling out and demand for Soil is increasing.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "cultivationTemperature",
    valueAxisType: "temperature",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
  {
    id: "podRate",
    type: "Field",
    name: "Pod Rate",
    tooltipTitle: "Pod Rate",
    tooltipHoverText:
      "The ratio of Unharvestable Pods per Pinto, displayed as a percentage, at the beginning of every Season. The Pod Rate is used by Pinto as a proxy for its health.",
    shortDescription: "The ratio of Unharvestable Pods per Pinto, displayed as a percentage.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "podRate",
    valueAxisType: "podRate",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
  {
    id: "realRateOfReturn",
    type: "Field",
    name: "Real Rate of Return",
    tooltipTitle: "Real Rate of Return",
    tooltipHoverText: "The return for sowing Pinto, accounting for Pinto price. RRoR = (1 + Temperature) / TWAP",
    shortDescription: "The return for sowing Pinto, accounting for Pinto price.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "realRateOfReturn",
    valueAxisType: "realRateOfReturn",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
  {
    id: "unharvestablePods",
    type: "Field",
    name: "Pods",
    tooltipTitle: "Pods",
    tooltipHoverText: "The total number of Unharvestable Pods.",
    shortDescription: "The total number of Unharvestable Pods.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "unharvestablePods",
    valueAxisType: "pods",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) =>
      formatNum(v, { allowZero: true, minDecimals: 2, maxDecimals: 2, showPositiveSign: false }),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "pintoSown",
    type: "Field",
    name: "Cumulative Pinto Sown",
    tooltipTitle: "Cumulative Pinto Sown",
    tooltipHoverText: "The total number of Pinto Sown as of the beginning of every Season.",
    shortDescription: "The total number of Pinto Sown.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "sownBeans",
    valueAxisType: "PINTO_amount",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "pintoSownSeasonally",
    type: "Field",
    name: "Seasonal Pinto Sown",
    tooltipTitle: "Seasonal Pinto Sown",
    tooltipHoverText: "The total number of Pinto Sown during the Season.",
    shortDescription: "The total number of Pinto Sown during the Season.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "deltaSownBeans",
    valueAxisType: "deltaSownBeans",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "harvestedPods",
    type: "Field",
    name: "Harvested Pods",
    tooltipTitle: "Harvested Pods",
    tooltipHoverText: "The total number of Pods Harvested.",
    shortDescription: "The total number of Pods Harvested.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "harvestedPods",
    valueAxisType: "pods",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) =>
      formatNum(v, { allowZero: true, minDecimals: 2, maxDecimals: 2, showPositiveSign: false }),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "totalSows",
    type: "Field",
    name: "Total Sows",
    tooltipTitle: "Total Sows",
    tooltipHoverText: "The total number of Sows at the beginning of every Season.",
    shortDescription: "The total number of Sows.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "numberOfSows",
    valueAxisType: "sows",
    valueFormatter: (v: number) => v,
    tickFormatter: (v: number) => v.toFixed(0),
    shortTickFormatter: (v: number) => v.toFixed(0),
  },
  {
    id: "totalSowers",
    type: "Field",
    name: "Unique Sowers",
    tooltipTitle: "Unique Sowers",
    tooltipHoverText: "The total number of unique Sowers at the beginning of every Season.",
    shortDescription: "The total number of unique Sowers.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "numberOfSowers",
    valueAxisType: "sowers",
    valueFormatter: (v: number) => v,
    tickFormatter: (v: number) => v.toFixed(0),
    shortTickFormatter: (v: number) => v.toFixed(0),
  },
];

const createExchangeCharts = (_mainToken: Token): ChartSetupBase[] => {
  const exchangeEntry = ({
    id,
    name,
    tooltipTitle,
    description,
    valueAxis = id,
  }: {
    id: string;
    name: string;
    tooltipTitle: string;
    description: string;
    valueAxis?: string;
  }) => {
    return {
      id,
      type: "Exchange" as ChartType,
      name,
      tooltipTitle,
      tooltipHoverText: description,
      shortDescription: description,
      icon: pintoExchangeLogo,
      timeScaleKey: "timestamp",
      priceScaleKey: id,
      valueAxisType: valueAxis,
      valueFormatter: (v: number) => v,
      tickFormatter: usdFormatter,
      shortTickFormatter: usdFormatter,
    };
  };
  return [
    exchangeEntry({
      id: "cumulativeVolumeNet",
      name: "Cumulative Net Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Net Volume (USD)",
      description: "Cumulative Net of Exchange Volume.",
    }),
    exchangeEntry({
      id: "cumulativeBuyVolumeUSD",
      name: "Cumulative Buy Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Buy Volume (USD)",
      description: "Cumulative Sum of Exchange Buys.",
      valueAxis: "exchangeCumulativeBuySell",
    }),
    exchangeEntry({
      id: "cumulativeSellVolumeUSD",
      name: "Cumulative Sell Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Sell Volume (USD)",
      description: "Cumulative Sum of Exchange Sells.",
      valueAxis: "exchangeCumulativeBuySell",
    }),
    exchangeEntry({
      id: "cumulativeVolumeUSD",
      name: "Cumulative Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Volume (USD)",
      description: "Cumulative Sum of Exchange Buys/Sells.",
      valueAxis: "exchangeCumulativeBuySell",
    }),
    exchangeEntry({
      id: "deltaVolumeNet",
      name: "Seasonal Net Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Net Volume (USD)",
      description: "Seasonal Net of Exchange Volume.",
    }),
    exchangeEntry({
      id: "deltaBuyVolumeUSD",
      name: "Seasonal Buy Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Buy Volume (USD)",
      description: "Seasonal Sum of Exchange Buys.",
      valueAxis: "exchangeDeltaBuySell",
    }),
    exchangeEntry({
      id: "deltaSellVolumeUSD",
      name: "Seasonal Sell Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Sell Volume (USD)",
      description: "Seasonal Sum of Exchange Sells.",
      valueAxis: "exchangeDeltaBuySell",
    }),
    exchangeEntry({
      id: "deltaVolumeUSD",
      name: "Seasonal Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Volume (USD)",
      description: "Seasonal Sum of Exchange Buys/Sells.",
      valueAxis: "exchangeDeltaBuySell",
    }),
    exchangeEntry({
      id: "cumulativeConvertVolumeNet",
      name: "Cumulative Net Convert Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Net Convert Volume (USD)",
      description: "Cumulative Net of Convert Volume.",
    }),
    exchangeEntry({
      id: "cumulativeConvertUpVolumeUSD",
      name: "Cumulative Convert Up Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Convert Up Volume (USD)",
      description: "Cumulative Sum of Convert Up Volume.",
      valueAxis: "exchangeCumulativeConvertUpDown",
    }),
    exchangeEntry({
      id: "cumulativeConvertDownVolumeUSD",
      name: "Cumulative Convert Down Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Convert Down Volume (USD)",
      description: "Cumulative Sum of Convert Down Volume.",
      valueAxis: "exchangeCumulativeConvertUpDown",
    }),
    exchangeEntry({
      id: "cumulativeConvertVolumeUSD",
      name: "Cumulative Convert Volume (USD)",
      tooltipTitle: "Exchange: Cumulative Convert Volume (USD)",
      description: "Cumulative Sum of Convert Up/Down Volume.",
      valueAxis: "exchangeCumulativeConvertUpDown",
    }),
    exchangeEntry({
      id: "cumulativeConvertNeutralTransferVolumeUSD",
      name: "Cumulative LP->LP Convert Volume (USD)",
      tooltipTitle: "Exchange: Cumulative LP->LP Convert Volume (USD)",
      description: "Cumulative Sum of LP->LP Convert Volume.",
    }),
    exchangeEntry({
      id: "deltaConvertVolumeNet",
      name: "Seasonal Net Convert Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Net Convert Volume (USD)",
      description: "Seasonal Net of Convert Volume.",
    }),
    exchangeEntry({
      id: "deltaConvertUpVolumeUSD",
      name: "Seasonal Convert Up Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Convert Up Volume (USD)",
      description: "Seasonal Sum of Convert Up Volume.",
      valueAxis: "exchangeDeltaConvertUpDown",
    }),
    exchangeEntry({
      id: "deltaConvertDownVolumeUSD",
      name: "Seasonal Convert Down Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Convert Down Volume (USD)",
      description: "Seasonal Sum of Convert Down Volume.",
      valueAxis: "exchangeDeltaConvertUpDown",
    }),
    exchangeEntry({
      id: "deltaConvertVolumeUSD",
      name: "Seasonal Convert Volume (USD)",
      tooltipTitle: "Exchange: Seasonal Convert Volume (USD)",
      description: "Seasonal Sum of Convert Up/Down Volume.",
      valueAxis: "exchangeDeltaConvertUpDown",
    }),
    exchangeEntry({
      id: "deltaConvertNeutralTransferVolumeUSD",
      name: "Seasonal LP->LP Convert Volume (USD)",
      tooltipTitle: "Exchange: Seasonal LP->LP Convert Volume (USD)",
      description: "Seasonal Sum of LP->LP Convert Volume.",
    }),
    exchangeEntry({
      id: "liquidityUSD",
      name: "Total Liquidity (USD)",
      tooltipTitle: "Exchange: Total Liquidity (USD)",
      description: "Sum of Liquidity across all Pools.",
    }),
    exchangeEntry({
      id: "deltaLiquidityUSD",
      name: "Seasonal Delta Liquidity (USD)",
      tooltipTitle: "Exchange: Seasonal Delta Liquidity (USD)",
      description: "Seasonal Change in Liquidity across all Pools.",
    }),
  ];
};

const createSiloCharts = (mainToken: Token): ChartSetupBase[] => [
  {
    id: "stalk",
    type: "Silo",
    name: "Stalk Supply",
    tooltipTitle: "Stalk Supply",
    tooltipHoverText: "The total number of Stalk.",
    shortDescription: "The total number of Stalk.",
    icon: stalkIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "stalk",
    valueAxisType: "stalk",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) =>
      formatNum(v, { allowZero: true, minDecimals: 2, maxDecimals: 2, showPositiveSign: false }),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "pinto30d",
    type: "Silo",
    name: "30D Deposited Pinto vAPY",
    tooltipTitle: "30D Deposited Pinto vAPY",
    tooltipHoverText: "The 30D variable Pinto APY for Deposited Pinto in the Silo.",
    shortDescription: "Deposited Pinto 30D vAPY.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "pinto30d",
    valueAxisType: "vAPY",
    valueFormatter: (v: number) => v * 100,
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
  {
    id: "pinto7d",
    type: "Silo",
    name: "7D Deposited Pinto vAPY",
    tooltipTitle: "7D Deposited Pinto vAPY",
    tooltipHoverText: "The 7D variable Pinto APY for Deposited Pinto in the Silo.",
    shortDescription: "Deposited Pinto 7D vAPY.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "pinto7d",
    valueAxisType: "vAPY",
    valueFormatter: (v: number) => v * 100,
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
  {
    id: "pinto24h",
    type: "Silo",
    name: "24H Deposited Pinto vAPY",
    tooltipTitle: "24H Deposited Pinto vAPY",
    tooltipHoverText: "The 24H variable Pinto APY for Deposited Pinto in the Silo.",
    shortDescription: "Deposited Pinto 24H vAPY.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "pinto24h",
    valueAxisType: "vAPY",
    valueFormatter: (v: number) => v * 100,
    tickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
    shortTickFormatter: (v: number) => formatPct(v, { minDecimals: 2, maxDecimals: 2 }),
  },
];

const createTractorCharts = (mainToken: Token): ChartSetupBase[] => [
  {
    id: "tractorSownPinto",
    type: "Tractor",
    name: "Tractor: Sown Pinto",
    tooltipTitle: "Pinto Sown using Tractor",
    tooltipHoverText: "Cumulative Pinto Sown using Tractor.",
    shortDescription: "Cumulative Pinto Sown using Tractor.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorSownPinto",
    valueAxisType: "sownBeans",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "tractorPodsMinted",
    type: "Tractor",
    name: "Tractor: Pods Minted",
    tooltipTitle: "Pods Minted using Tractor",
    tooltipHoverText: "Cumulative Pods Minted using Tractor.",
    shortDescription: "Cumulative Pods Minted using Tractor.",
    icon: podIcon,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorPodsMinted",
    valueAxisType: "sownBeans",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "tractorSowingQueue",
    type: "Tractor",
    name: "Tractor: Sowing Queue",
    tooltipTitle: "Pinto Queued to be Sown",
    tooltipHoverText: "Pinto Queued to be Sown at or below the current Max Temperature.",
    shortDescription: "Pinto Queued to be Sown.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorSowingQueue",
    valueAxisType: "tractorSowingQueue",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "tractorMaxSeasonalSow",
    type: "Tractor",
    name: "Tractor: Queued Max Sow",
    tooltipTitle: "Queued Max Sow each Season",
    tooltipHoverText: "Queued max Pinto that can be Sown each Season.",
    shortDescription: "Queued max Pinto that can be Sown each Season.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorMaxSeasonalSow",
    valueAxisType: "tractorMaxSeasonalSow",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "tractorCumulativeTips",
    type: "Tractor",
    name: "Tractor: Cumulative Operator Tipped Pinto",
    tooltipTitle: "Total Pinto tipped to Tractor Operators",
    tooltipHoverText: "Cumulative Pinto tipped to Tractor Operators.",
    shortDescription: "Cumulative Pinto tipped to Tractor Operators.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorCumulativeTips",
    valueAxisType: "tractorCumulativeTips",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "tractorMaxActiveTip",
    type: "Tractor",
    name: "Tractor: Maximum Active Tip",
    tooltipTitle: "Current Maximum Tip",
    tooltipHoverText: "Current Maximum Tip Offered in Sow Orders.",
    shortDescription: "Current Maximum Tip Offered in Sow Orders.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorMaxActiveTip",
    valueAxisType: "tractorMaxActiveTip",
    valueFormatter: (v: TokenValue) => v.toNumber(),
    tickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
  },
  {
    id: "tractorExecutions",
    type: "Tractor",
    name: "Tractor: Executions",
    tooltipTitle: "Cumulative Tractor Execution Count",
    tooltipHoverText: "Count of Sow order executions.",
    shortDescription: "Count of Sow order executions.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorExecutions",
    valueAxisType: "tractorExecutions",
    valueFormatter: (v: number) => v,
    tickFormatter: (v: number) => v.toFixed(0),
    shortTickFormatter: (v: number) => v.toFixed(0),
  },
  {
    id: "tractorPublishers",
    type: "Tractor",
    name: "Tractor: Unique Publishers",
    tooltipTitle: "Unique Tractor Order Publishers",
    tooltipHoverText: "Count of unique publishers of Tractor Sow orders.",
    shortDescription: "Count of unique publishers of Tractor Sow orders.",
    icon: mainToken.logoURI,
    timeScaleKey: "timestamp",
    priceScaleKey: "tractorPublishers",
    valueAxisType: "tractorPublishers",
    valueFormatter: (v: number) => v,
    tickFormatter: (v: number) => v.toFixed(0),
    shortTickFormatter: (v: number) => v.toFixed(0),
  },
];

const createInflowCharts = (mainToken: Token): ChartSetupBase[] => {
  const inflowEntry = ({
    id,
    name,
    tooltipTitle,
    description,
    valueAxis = id,
  }: {
    id: string;
    name: string;
    tooltipTitle: string;
    description: string;
    valueAxis?: string;
  }) => {
    return {
      id,
      type: "Inflow" as ChartType,
      name,
      tooltipTitle,
      tooltipHoverText: description,
      shortDescription: description,
      icon: mainToken.logoURI,
      timeScaleKey: "timestamp",
      priceScaleKey: id,
      valueAxisType: valueAxis,
      valueFormatter: (v: number) => v,
      tickFormatter: usdFormatter,
      shortTickFormatter: usdFormatter,
    };
  };
  return [
    inflowEntry({
      id: "inflowAllCumulativeNet",
      name: "Protocol Cumulative Net (USD)",
      tooltipTitle: "Inflow: Protocol Cumulative Net (USD)",
      description: "Cumulative Net of Protocol Inflows/Outflows.",
    }),
    inflowEntry({
      id: "inflowAllCumulativeIn",
      name: "Protocol Cumulative Inflows (USD)",
      tooltipTitle: "Inflow: Protocol Cumulative Inflows (USD)",
      description: "Cumulative Sum of Protocol Inflows.",
      valueAxis: "inflowAllCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowAllCumulativeOut",
      name: "Protocol Cumulative Outflows (USD)",
      tooltipTitle: "Inflow: Protocol Cumulative Outflows (USD)",
      description: "Cumulative Sum of Protocol Outflows.",
      valueAxis: "inflowAllCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowAllCumulativeVolume",
      name: "Protocol Cumulative Volume (USD)",
      tooltipTitle: "Inflow: Protocol Cumulative Volume (USD)",
      description: "Cumulative Sum of Protocol Inflows/Outflows.",
      valueAxis: "inflowAllCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowAllDeltaNet",
      name: "Protocol Seasonal Net (USD)",
      tooltipTitle: "Inflow: Protocol Seasonal Net (USD)",
      description: "Seasonal Net of Protocol Inflows/Outflows.",
    }),
    inflowEntry({
      id: "inflowAllDeltaIn",
      name: "Protocol Seasonal Inflows (USD)",
      tooltipTitle: "Inflow: Protocol Seasonal Inflows (USD)",
      description: "Seasonal Sum of Protocol Inflows.",
      valueAxis: "inflowAllDeltaInOut",
    }),
    inflowEntry({
      id: "inflowAllDeltaOut",
      name: "Protocol Seasonal Outflows (USD)",
      tooltipTitle: "Inflow: Protocol Seasonal Outflows (USD)",
      description: "Seasonal Sum of Protocol Outflows.",
      valueAxis: "inflowAllDeltaInOut",
    }),
    inflowEntry({
      id: "inflowAllDeltaVolume",
      name: "Protocol Seasonal Volume (USD)",
      tooltipTitle: "Inflow: Protocol Seasonal Volume (USD)",
      description: "Seasonal Sum of Protocol Inflows/Outflows.",
      valueAxis: "inflowAllDeltaInOut",
    }),
    inflowEntry({
      id: "inflowSiloCumulativeNet",
      name: "Silo Cumulative Net (USD)",
      tooltipTitle: "Inflow: Silo Cumulative Net (USD)",
      description: "Cumulative Net of Silo Inflows/Outflows.",
    }),
    inflowEntry({
      id: "inflowSiloCumulativeIn",
      name: "Silo Cumulative Inflows (USD)",
      tooltipTitle: "Inflow: Silo Cumulative Inflows (USD)",
      description: "Cumulative Sum of Silo Inflows.",
      valueAxis: "inflowSiloCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowSiloCumulativeOut",
      name: "Silo Cumulative Outflows (USD)",
      tooltipTitle: "Inflow: Silo Cumulative Outflows (USD)",
      description: "Cumulative Sum of Silo Outflows.",
      valueAxis: "inflowSiloCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowSiloCumulativeVolume",
      name: "Silo Cumulative Volume (USD)",
      tooltipTitle: "Inflow: Silo Cumulative Volume (USD)",
      description: "Cumulative Sum of Silo Inflows/Outflows.",
      valueAxis: "inflowSiloCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowSiloDeltaNet",
      name: "Silo Seasonal Net (USD)",
      tooltipTitle: "Inflow: Silo Seasonal Net (USD)",
      description: "Seasonal Net of Silo Inflows/Outflows.",
    }),
    inflowEntry({
      id: "inflowSiloDeltaIn",
      name: "Silo Seasonal Inflows (USD)",
      tooltipTitle: "Inflow: Silo Seasonal Inflows (USD)",
      description: "Seasonal Sum of Silo Inflows.",
      valueAxis: "inflowSiloDeltaInOut",
    }),
    inflowEntry({
      id: "inflowSiloDeltaOut",
      name: "Silo Seasonal Outflows (USD)",
      tooltipTitle: "Inflow: Silo Seasonal Outflows (USD)",
      description: "Seasonal Sum of Silo Outflows.",
      valueAxis: "inflowSiloDeltaInOut",
    }),
    inflowEntry({
      id: "inflowSiloDeltaVolume",
      name: "Silo Seasonal Volume (USD)",
      tooltipTitle: "Inflow: Silo Seasonal Volume (USD)",
      description: "Seasonal Sum of Silo Inflows/Outflows.",
      valueAxis: "inflowSiloDeltaInOut",
    }),
    inflowEntry({
      id: "inflowFieldCumulativeNet",
      name: "Field Cumulative Net (USD)",
      tooltipTitle: "Inflow: Field Cumulative Net (USD)",
      description: "Cumulative Net of Field Inflows/Outflows.",
    }),
    inflowEntry({
      id: "inflowFieldCumulativeIn",
      name: "Field Cumulative Inflows (USD)",
      tooltipTitle: "Inflow: Field Cumulative Inflows (USD)",
      description: "Cumulative Sum of Field Inflows.",
      valueAxis: "inflowFieldCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowFieldCumulativeOut",
      name: "Field Cumulative Outflows (USD)",
      tooltipTitle: "Inflow: Field Cumulative Outflows (USD)",
      description: "Cumulative Sum of Field Outflows.",
      valueAxis: "inflowFieldCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowFieldCumulativeVolume",
      name: "Field Cumulative Volume (USD)",
      tooltipTitle: "Inflow: Field Cumulative Volume (USD)",
      description: "Cumulative Sum of Field Inflows/Outflows.",
      valueAxis: "inflowFieldCumulativeInOut",
    }),
    inflowEntry({
      id: "inflowFieldDeltaNet",
      name: "Field Seasonal Net (USD)",
      tooltipTitle: "Inflow: Field Seasonal Net (USD)",
      description: "Seasonal Net of Field Inflows/Outflows.",
    }),
    inflowEntry({
      id: "inflowFieldDeltaIn",
      name: "Field Seasonal Inflows (USD)",
      tooltipTitle: "Inflow: Field Seasonal Inflows (USD)",
      description: "Seasonal Sum of Field Inflows.",
      valueAxis: "inflowFieldDeltaInOut",
    }),
    inflowEntry({
      id: "inflowFieldDeltaOut",
      name: "Field Seasonal Outflows (USD)",
      tooltipTitle: "Inflow: Field Seasonal Outflows (USD)",
      description: "Seasonal Sum of Field Outflows.",
      valueAxis: "inflowFieldDeltaInOut",
    }),
    inflowEntry({
      id: "inflowFieldDeltaVolume",
      name: "Field Seasonal Volume (USD)",
      tooltipTitle: "Inflow: Field Seasonal Volume (USD)",
      description: "Seasonal Sum of Field Inflows/Outflows.",
      valueAxis: "inflowFieldDeltaInOut",
    }),
  ];
};

const createMarketCharts = (mainToken: Token): ChartSetupBase[] => {
  const marketEntry = ({
    id,
    name,
    icon,
    tooltipTitle,
    description,
    formatter,
    valueAxis = id,
    inputOptions = undefined,
  }: {
    id: string;
    name: string;
    icon: string;
    tooltipTitle: string;
    description: string;
    formatter: (v: number) => string;
    valueAxis?: string;
    inputOptions?: "SEASON";
  }) => {
    return {
      id,
      type: "Market" as ChartType,
      name,
      tooltipTitle,
      tooltipHoverText: description,
      shortDescription: description,
      icon,
      timeScaleKey: "timestamp",
      priceScaleKey: id,
      valueAxisType: valueAxis,
      valueFormatter: (v: number) => v,
      tickFormatter: formatter,
      shortTickFormatter: formatter,
      inputOptions,
    };
  };
  return [
    marketEntry({
      id: "marketPriceWeth",
      name: "WETH Price",
      icon: WETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "WETH Price",
      description: "WETH Price",
      valueAxis: "ethPrice",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketPriceCbeth",
      name: "cbETH Price",
      icon: CBETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "cbETH Price",
      description: "cbETH Price",
      valueAxis: "ethPrice",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketPriceCbbtc",
      name: "cbBTC Price",
      icon: CBBTC_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "cbBTC Price",
      description: "cbBTC Price",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketPriceWsol",
      name: "WSOL Price",
      icon: WSOL_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "WSOL Price",
      description: "WSOL Price",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketCumulativeNonPintoUsd",
      name: "Protocol Cumulative Non-Pinto Value Change (USD)",
      icon: mainToken.logoURI,
      tooltipTitle: "Market: Cumulative Non-Pinto Value Change",
      description: "Change of non-Pinto liquidity USD value since a selectable starting season.",
      formatter: usdFormatter,
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeWethUsd",
      name: "Protocol Cumulative WETH Value Change (USD)",
      icon: WETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative WETH Value Change",
      description: "Change of WETH liquidity USD value since a selectable starting season.",
      formatter: usdFormatter,
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeCbethUsd",
      name: "Protocol Cumulative cbETH Value Change (USD)",
      icon: CBETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative cbETH Value Change",
      description: "Change of cbETH liquidity USD value since a selectable starting season.",
      formatter: usdFormatter,
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeCbbtcUsd",
      name: "Protocol Cumulative cbBTC Value Change (USD)",
      icon: CBBTC_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative cbBTC Value Change",
      description: "Change of cbBTC liquidity USD value since a selectable starting season.",
      formatter: usdFormatter,
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeWsolUsd",
      name: "Protocol Cumulative WSOL Value Change (USD)",
      icon: WSOL_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative WSOL Value Change",
      description: "Change of WSOL liquidity USD value since a selectable starting season.",
      formatter: usdFormatter,
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketSeasonalNonPintoUsd",
      name: "Protocol Seasonal Non-Pinto Value Change (USD)",
      icon: mainToken.logoURI,
      tooltipTitle: "Market: Seasonal Non-Pinto Value Change",
      description: "Change of non-Pinto liquidity USD value by season.",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketSeasonalWethUsd",
      name: "Protocol Seasonal WETH Value Change (USD)",
      icon: WETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal WETH Value Change",
      description: "Change of WETH liquidity USD value by season.",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketSeasonalCbethUsd",
      name: "Protocol Seasonal cbETH Value Change (USD)",
      icon: CBETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal cbETH Value Change",
      description: "Change of cbETH liquidity USD value by season.",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketSeasonalCbbtcUsd",
      name: "Protocol Seasonal cbBTC Value Change (USD)",
      icon: CBBTC_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal cbBTC Value Change",
      description: "Change of cbBTC liquidity USD value by season.",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketSeasonalWsolUsd",
      name: "Protocol Seasonal WSOL Value Change (USD)",
      icon: WSOL_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal WSOL Value Change",
      description: "Change of WSOL liquidity USD value by season.",
      formatter: usdFormatter,
    }),
    marketEntry({
      id: "marketCumulativeNonPintoPercent",
      name: "Protocol Cumulative Non-Pinto Value Change (%)",
      icon: mainToken.logoURI,
      tooltipTitle: "Market: Cumulative Non-Pinto Value Change",
      description: "Percentage change of Non-Pinto liquidity value since a selectable starting season.",
      formatter: chartFormatters.percentFormatter(4),
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeWethPercent",
      name: "Protocol Cumulative WETH Value Change (%)",
      icon: WETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative WETH Value Change",
      description: "Percentage change of WETH liquidity value since a selectable starting season.",
      formatter: chartFormatters.percentFormatter(4),
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeCbethPercent",
      name: "Protocol Cumulative cbETH Value Change (%)",
      icon: CBETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative cbETH Value Change",
      description: "Percentage change of cbETH liquidity value since a selectable starting season.",
      formatter: chartFormatters.percentFormatter(4),
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeCbbtcPercent",
      name: "Protocol Cumulative cbBTC Value Change (%)",
      icon: CBBTC_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative cbBTC Value Change",
      description: "Percentage change of cbBTC liquidity value since a selectable starting season.",
      formatter: chartFormatters.percentFormatter(4),
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketCumulativeWsolPercent",
      name: "Protocol Cumulative WSOL Value Change (%)",
      icon: WSOL_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Cumulative WSOL Value Change",
      description: "Percentage change of WSOL liquidity value since a selectable starting season.",
      formatter: chartFormatters.percentFormatter(4),
      inputOptions: "SEASON",
    }),
    marketEntry({
      id: "marketSeasonalNonPintoPercent",
      name: "Protocol Seasonal Non-Pinto Value Change (%)",
      icon: mainToken.logoURI,
      tooltipTitle: "Market: Seasonal Non-Pinto Value Change",
      description: "Percentage change of Non-Pinto liquidity value by season.",
      formatter: chartFormatters.percentFormatter(4),
    }),
    marketEntry({
      id: "marketSeasonalWethPercent",
      name: "Protocol Seasonal WETH Value Change (%)",
      icon: WETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal WETH Value Change",
      description: "Percentage change of WETH liquidity value by season.",
      formatter: chartFormatters.percentFormatter(4),
    }),
    marketEntry({
      id: "marketSeasonalCbethPercent",
      name: "Protocol Seasonal cbETH Value Change (%)",
      icon: CBETH_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal cbETH Value Change",
      description: "Percentage change of cbETH liquidity value by season.",
      formatter: chartFormatters.percentFormatter(4),
    }),
    marketEntry({
      id: "marketSeasonalCbbtcPercent",
      name: "Protocol Seasonal cbBTC Value Change (%)",
      icon: CBBTC_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal cbBTC Value Change",
      description: "Percentage change of cbBTC liquidity value by season.",
      formatter: chartFormatters.percentFormatter(4),
    }),
    marketEntry({
      id: "marketSeasonalWsolPercent",
      name: "Protocol Seasonal WSOL Value Change (%)",
      icon: WSOL_TOKEN[mainToken.chainId].logoURI,
      tooltipTitle: "Market: Seasonal WSOL Value Change",
      description: "Percentage change of WSOL liquidity value by season.",
      formatter: chartFormatters.percentFormatter(4),
    }),
  ];
};

export function useChartSetupData() {
  const { mainToken } = useTokenData();

  // Memoize data separately with proper dependencies
  const data = useMemo(() => {
    const pintoCharts = createPintoCharts(mainToken);
    const siloCharts = createSiloCharts(mainToken);
    const fieldCharts = createFieldCharts(mainToken);
    const exchangeCharts = createExchangeCharts(mainToken);
    const tractorCharts = createTractorCharts(mainToken);
    const inflowCharts = createInflowCharts(mainToken);
    const marketCharts = createMarketCharts(mainToken);

    const output: ChartSetup[] = [
      ...pintoCharts,
      ...siloCharts,
      ...fieldCharts,
      ...exchangeCharts,
      ...tractorCharts,
      ...inflowCharts,
      ...marketCharts,
    ].map((setupData, index) => ({
      ...setupData,
      index: index,
    }));

    return output;
  }, [mainToken]); // Include all dependencies

  // Return a stable reference when dependencies don't change
  return { data, chartColors };
}
