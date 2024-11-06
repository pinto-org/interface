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
  fullyHarvested: boolean;
  harvestablePods: TokenValue;
  harvestedPods: TokenValue;
  pods: TokenValue;
  index: TokenValue;
  beansPerPod?: TokenValue;
  createdAt?: number;
  creationHash?: string;
  id?: string;
  listing?: string;
  season?: number;
  source?: string;
  sourceHash?: string;
  updatedAt?: number;
  updatedAtBlock?: number;
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

export type AddressMap<T> = { [k: string]: T };
