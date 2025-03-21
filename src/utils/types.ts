import { TokenValue } from "@/classes/TokenValue";
import { SeasonalChartData } from "@/components/charts/SeasonalChart";
import { PlotSource } from "@/generated/gql/graphql";
import { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { ReactNode } from "react";
import { Address } from "viem";

export enum FarmFromMode {
  EXTERNAL = "0",
  INTERNAL = "1",
  INTERNAL_EXTERNAL = "2",
  INTERNAL_TOLERANT = "3",
}

export enum FarmToMode {
  EXTERNAL = "0",
  INTERNAL = "1",
}

export interface Token {
  name: string;
  symbol: string;
  chainId: number;
  decimals: number;
  displayDecimals?: number;
  isMain?: boolean;
  isLP?: boolean;
  isNative?: boolean;
  isWrappedNative?: boolean;
  isWhitelisted?: boolean;
  isSiloWrapped?: boolean;
  is3PSiloWrapped?: boolean;
  address: Address;
  logoURI: string;
  color?: string;
  tokens?: Address[];
  description?: string;
}

export interface InternalToken {
  name: string;
  symbol: string;
  decimals: number;
  displayDecimals: number;
  logoURI: string;
}

export interface DepositCrateData {
  stem: TokenValue;
  amount: TokenValue;
  bdv: TokenValue;
  stalk: {
    base: TokenValue;
    grown: TokenValue;
    total: TokenValue;
  };
  seeds: TokenValue;
  isGerminating: boolean;
}

export interface DepositData {
  token: Token;
  id: bigint;
  idHex: string;
  stemTipForToken: TokenValue;
  season: number;
  stem: TokenValue;
  lastStem: TokenValue;
  amount: TokenValue;
  depositBdv: TokenValue;
  currentBdv: TokenValue;
  stalk: {
    base: TokenValue;
    grown: TokenValue;
    germinating: TokenValue;
    total: TokenValue;
    grownSinceDeposit: TokenValue;
  };
  isPlantDeposit?: boolean;
  seeds: TokenValue;
  isGerminating: boolean;
  germinationDate?: Date;
}

export interface TokenDepositData {
  amount: TokenValue;
  convertibleAmount: TokenValue;
  currentBDV: TokenValue;
  depositBDV: TokenValue;
  stalk: {
    base: TokenValue;
    grown: TokenValue;
    germinating: TokenValue;
    total: TokenValue;
  };
  seeds: TokenValue;
  deposits: DepositData[];
  convertibleDeposits: DepositData[];
}

export interface SiloTokenData {
  totalDeposited: TokenValue;
  tokenBDV: TokenValue;
  stemTip: TokenValue;
  depositedBDV: TokenValue;
  germinatingStem: TokenValue;
  germinatingBDV: TokenValue;
  germinatingAmount: TokenValue;
  tokenSettings: {
    deltaStalkEarnedPerSeason: TokenValue;
    encodeType: string;
    gaugePointImplementation: {
      target: Address;
      selector: string;
      encodeType: string;
      data: string;
    };
    gaugePoints: bigint;
    liquidityWeightImplementation: {
      target: Address;
      selector: string;
      encodeType: string;
      data: string;
    };
    milestoneSeason: number;
    milestoneStem: TokenValue;
    optimalPercentDepositedBdv: TokenValue;
    selector: string;
    stalkEarnedPerSeason: TokenValue;
    stalkIssuedPerBdv: TokenValue;
  };
  rewards: {
    seeds: TokenValue;
    stalk: TokenValue;
  };
  yields: {
    beanAPY: number;
    stalkAPY: number;
  };
}

export type SiloTokenDataMap = Map<Token, SiloTokenData>;

export interface Plot {
  fullyHarvested?: boolean;
  unharvestablePods?: TokenValue;
  harvestedPods: TokenValue;
  harvestablePods: TokenValue;
  pods: TokenValue;
  index: TokenValue;
  beansPerPod?: TokenValue;
  isListed?: boolean;
  createdAt?: number;
  creationHash?: string;
  id?: string;
  idHex: string;
  season?: number;
  source?: PlotSource;
  sourceHash?: string;
  preTransferSource?: PlotSource | null;
  preTransferOwner?: `0x${string}` | null;
  updatedAt?: number;
  updatedAtBlock?: number;
}

export interface Listing {
  type?: string;
  id: string;
  amount: TokenValue;
  creationHash: string;
  createdAt: number;
  filled: TokenValue;
  filledAmount: TokenValue;
  historyID: string;
  index: TokenValue;
  maxHarvestableIndex: TokenValue;
  minFillAmount: TokenValue;
  mode: number;
  originalAmount: TokenValue;
  originalIndex: TokenValue;
  originalPlaceInLine: TokenValue;
  pricePerPod: TokenValue;
  pricingFunction: string;
  pricingType: number | null | undefined;
  remainingAmount: TokenValue;
  fillPlaceInLine?: TokenValue;
  start: string;
  status: string;
  updatedAt: number;
}

export interface Order {
  type?: string;
  id: string;
  beanAmount: TokenValue;
  beanAmountFilled: TokenValue;
  createdAt: number;
  creationHash: string;
  historyID: string;
  maxPlaceInLine: TokenValue;
  minFillAmount: TokenValue;
  podAmountFilled: TokenValue;
  pricePerPod: TokenValue;
  pricingFunction: string;
  pricingType: number | null | undefined;
  status: string;
  updatedAt: number;
}

export interface FilledListing {
  id: string;
  originalPodAmount: TokenValue;
}

export interface FilledOrder {
  id: string;
  originalOrderBeans: TokenValue;
}

export interface Fill {
  type?: string;
  id: string;
  podAmount: TokenValue;
  beanAmountFilled: TokenValue;
  fromFarmer: `0x${string}`;
  toFarmer: `0x${string}`;
  plotIndex: TokenValue;
  plotPlaceInLine: TokenValue;
  plotStart: number;
  listing?: FilledListing;
  order?: FilledOrder;
  createdAt: number;
}

export interface CallStruct {
  target: `0x${string}`;
  data: `0x${string}`;
}

export interface PipeCall {
  target: Address;
  data: `0x${string}`;
}

export interface AdvancedPipeCall {
  target: Address;
  callData: `0x${string}`;
  clipboard: `0x${string}`;
}

export interface AdvancedFarmCall {
  callData: `0x${string}`;
  clipboard: `0x${string}`;
}

export type AddressMap<T> = { [k: string]: T };

export type StatPanelData = {
  mode: "stalk" | "pods" | "seeds" | "depositedValue";
  title: string;
  mainValue: TokenValue;
  auxValue?: TokenValue;
  altTooltipContent?: ReactNode;
  mainValueChange?: TokenValue;
  secondaryValue: TokenValue;
  actionValue?: TokenValue;
  tooltipContent?: ReactNode;
  showActionValues: boolean;
  isLoading: boolean;
};

export type UseSeasonalResult = {
  data: SeasonalChartData[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export type UseMultiSeasonalResult = {
  data: {[key: string]: SeasonalChartData[]} | undefined;
  isLoading: boolean;
  isError: boolean;
};

export type BlockInfo = {
  blockNumber: number;
  timestamp: DateTime;
};

// ---------- REACT QUERY TYPES ----------

export type ConstrainedUseQueryOptions<TData, TSelect = TData> = UseQueryOptions<TData, Error, TSelect, QueryKey>;

export type ConstrainedUseQueryArgs<TData, TSelect = TData> = Omit<
  ConstrainedUseQueryOptions<TData, TSelect>,
  "queryKey" | "queryFn"
>;

export type ConstrainedUseQueryArgsWithSelect<TData, TSelect = TData> = ConstrainedUseQueryArgs<TData, TSelect> & {
  select?: (data: TData) => TSelect;
};

export type FailableUseContractsResult<T> = (
  | {
      error: Error;
      result?: undefined;
      status: "failure";
    }
  | {
      error?: undefined;
      result: T;
      status: "success";
    }
)[];

export type TypedAdvancedFarmCalls =
  | readonly never[]
  | (readonly { callData: `0x${string}`; clipboard: `0x${string}` }[] & readonly never[]);
