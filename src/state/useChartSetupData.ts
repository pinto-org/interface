import podIcon from "@/assets/protocol/Pod.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { formatNum, formatPct, formatUSD } from "@/utils/format";
import { Token } from "@/utils/types";
import { useMemo } from "react";
import useTokenData from "./useTokenData";

interface ChartSetupBase {
  /**
   * Chart ID
   */
  id: string;
  /**
   * Chart type, used to categorize charts in the Select panel
   */
  type: "Pinto" | "Field" | "Silo" | "Tractor";
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
    tickFormatter: (v: number) => formatUSD(v, { decimals: 2 }),
    shortTickFormatter: (v: number) => TokenValue.fromHuman(v, 2).toHuman("short"),
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
  {
    id: "stalk",
    type: "Pinto",
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
    valueAxisType: "maxTemp",
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
    name: "Pinto Sown (Cumulative)",
    tooltipTitle: "Pinto Sown (Cumulative)",
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
    name: "Pinto Sown (Seasonal)",
    tooltipTitle: "Pinto Sown (Seasonal)",
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

const createAPYCharts = (mainToken: Token): ChartSetupBase[] => [
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

export function useChartSetupData() {
  const { mainToken, lpTokens, whitelistedTokens } = useTokenData();

  // Memoize data separately with proper dependencies
  const data = useMemo(() => {
    // Get Pinto charts
    const pintoCharts = createPintoCharts(mainToken);

    // Get Field charts
    const fieldCharts = createFieldCharts(mainToken);

    // LP charts
    if (lpTokens.length > 0) {
      // Add LP charts here
    }

    // Deposit & APY charts
    if (whitelistedTokens.length > 0) {
      // Add deposit & APY charts here
    }

    const apyCharts = createAPYCharts(mainToken);

    const tractorCharts = createTractorCharts(mainToken);

    const output: ChartSetup[] = [...pintoCharts, ...fieldCharts, ...apyCharts, ...tractorCharts].map(
      (setupData, index) => ({
        ...setupData,
        index: index,
      }),
    );

    return output;
  }, [mainToken, lpTokens, whitelistedTokens]); // Include all dependencies

  // Return a stable reference when dependencies don't change
  return { data, chartColors };
}
