import { TokenValue } from "@/classes/TokenValue";
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
  isMain?: boolean;
  isLP?: boolean;
  isNative?: boolean;
  isWrappedNative?: boolean;
  isWhitelisted?: boolean;
  address: Address;
  logoURI: string;
  color?: string;
  tokens?: Address[];
}

export interface InternalToken {
  name: string;
  symbol: string;
  decimals: number;
}

export interface DepositData {
  token: Token;
  stemTipForToken: TokenValue;
  stem: TokenValue;
  season: number;
  amount: TokenValue;
  depositBdv: TokenValue;
  currentBdv: TokenValue;
  stalk: {
    base: TokenValue;
    grown: TokenValue;
    total: TokenValue;
  };
  seeds: TokenValue;
  isGerminating: boolean;
}

export interface TokenDepositData {
  amount: TokenValue;
  convertibleAmount: TokenValue;
  currentBDV: TokenValue;
  depositBDV: TokenValue;
  stalk: {
    base: TokenValue;
    grown: TokenValue;
    total: TokenValue;
  };
  seeds: TokenValue;
  deposits: DepositData[];
}

export interface SiloTokenData {
  totalDeposited: TokenValue;
  tokenBDV: TokenValue;
  stemTip: TokenValue;
  depositedBDV: TokenValue;
  germinatingStem: TokenValue;
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
  beansPerPod: TokenValue;
  createdAt: number;
  creationHash: string;
  fullyHarvested: boolean;
  harvestablePods: TokenValue;
  harvestedPods: TokenValue;
  id: string;
  index: TokenValue;
  listing: string;
  pods: TokenValue;
  season: number;
  source: string;
  sourceHash: string;
  updatedAt: number;
  updatedAtBlock: number;
}

export interface Order {
  type?: string;
  beanAmount: TokenValue;
  beanAmountFilled: TokenValue;
  createdAt: number;
  creationHash: string;
  historyID: string;
  id: string;
  maxPlaceInLine: TokenValue;
  minFillAmount: TokenValue;
  podAmountFilled: TokenValue;
  pricePerPod: TokenValue;
  pricingFunction: string;
  pricingType: number | null | undefined;
  status: string;
  updatedAt: number;
}

export interface Listing {
  type?: string;
  amount: TokenValue;
  creationHash: string;
  createdAt: number;
  filled: TokenValue;
  filledAmount: TokenValue;
  historyID: string;
  id: string;
  index: TokenValue;
  maxHarvestableIndex: TokenValue;
  minFillAmount: TokenValue;
  mode: number;
  originalAmount: TokenValue;
  originalIndex: TokenValue;
  pricePerPod: TokenValue;
  pricingFunction: string;
  pricingType: number | null | undefined;
  remainingAmount: TokenValue;
  start: string;
  status: string;
  updatedAt: number;
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
