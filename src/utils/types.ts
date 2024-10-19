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
  name: string,
  symbol: string,
  chainId: number,
  decimals: number,
  isMain?: boolean,
  isLP?: boolean,
  isNative?: boolean,
  isWrappedNative?: boolean,
  isWhitelisted?: boolean,
  address: Address,
  logoURI: string,
  color?: string
}

export interface InternalToken {
  name: string,
  symbol: string,
  decimals: number,
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
};

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
};

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
};

export interface ZeroExAPI {
  /**
   * The ERC20 token address of the token you want to sell. It is recommended to always use the token address 
   * instead of token symbols (e.g. ETH ) which may not be recognized by the API.	
   */
  sellToken: Address;
  /**
   * The ERC20 token address of the token you want to receive. It is recommended to always use the token address
   * instead of token symbols (e.g. ETH ) which may not be recognized by the API.	
   */
  buyToken: Address;
  /**
   * (Optional) The amount of sellToken (in sellToken base units) you want to send. Either sellAmount or buyAmount 
   * must be present in a request. Specifying sellAmount is the recommended way to interact with 
   * 0x API as it covers all on-chain sources.
   */
  sellAmount?: string;
  /**
   * (Optional) The amount of buyToken(in buyToken base units) you want to receive. Either sellAmount 
   * or buyAmount must be present in a request. Note that some on-chain sources do not allow 
   * specifying buyAmount, when using buyAmount these sources are excluded.
   */
  buyAmount?: string;
  /**
   * (Optional, default is 0.01 for 1%) The maximum acceptable slippage of the buyToken amount if sellAmount 
   * is provided; The maximum acceptable slippage of the sellAmount amount if buyAmount is provided 
   * (e.g. 0.03 for 3% slippage allowed). The lowest possible value that can be set for this parameter 
   * is 0; in other words, no amount of slippage would be allowed. If no value for this optional parameter is 
   * provided in the API request, the default slippage percentage is 1%.	
   */
  slippagePercentage?: string;
  /**
   * (Optional, defaults to ethgasstation "fast") The target gas price (in wei) for the swap transaction. 
   * If the price is too low to achieve the quote, an error will be returned.	
   */
  gasPrice?: string;
  /**
   * (Optional) The address which will fill the quote. While optional, we highly recommend providing this 
   * parameter if possible so that the API can more accurately estimate the gas required for the swap transaction. 
   * This helps when validating the entire transaction for success, and catches revert issues. If the validation 
   * fails, a Revert Error will be returned in the response. The quote should be fillable if this address is provided.
   * 
   * Also, make sure this address has enough token balance. Additionally, including the takerAddress is required 
   * if you want to integrate RFQ liquidity.
   */
  takerAddress?: string;
  /**
   * (Optional) Liquidity sources (Uniswap, SushiSwap, 0x, Curve, etc) that will not be included in the provided quote. 
   * See the docs for a full list of sources.
   * 
   * This parameter cannot be combined with includedSources.
   */
  excludedSources?: string;
  /**
   * (Optional) Typically used to filter for RFQ liquidity without any other DEX orders which this is useful 
   * for testing your RFQ integration. To do so, set it to 0x.
   * 
   * This parameter cannot be combined with excludedSources.
   */
  includedSources?: string;
  /**
   * (Optional) Normally, whenever a takerAddress is provided, the API will validate the quote for the user.
   * 
   * For more details, see "How does takerAddress help with catching issues?" in the docs.
   * 
   * When this parameter is set to true, that validation will be skipped.
   * 
   * Also see Quote Validation in the docs. .
   */
  skipValidation?: string;
  /**
   * (Optional) The ETH address that should receive affiliate fees specified with buyTokenPercentageFee. 
   * Can be used combination with buyTokenPercentageFee to set a commission/trading fee when using the API.
   * 
   * Learn more about how to setup a trading fee/commission fee/transaction fee in the FAQs.
   */
  feeRecipient?: string;
  /**
   * (Optional) The percentage (denoted as a decimal between 0 - 1.0 where 1.0 represents 100%) of 
   * the buyAmount that should be attributed to feeRecipient as affiliate fees. Note that this requires 
   * that the feeRecipient parameter is also specified in the request. Learn more about how to setup 
   * a trading fee/commission fee/transaction fee in the FAQs.
   */
  buyTokenPercentageFee?: string;
  /**
   * (Optional, defaults to 100%) The percentage (between 0 - 1.0) of allowed price impact.
   * 
   * When priceImpactProtectionPercentage is set, estimatedPriceImpact is returned which estimates the change 
   * in the price of the specified asset that would be caused by the executed swap due to price impact.
   * 
   * If the estimated price impact is above the percentage indicated, an error will be returned. For example, 
   * if PriceImpactProtectionPercentage=.15 (15%), any quote with a price impact higher than 15% will return an error.
   * 
   * This is an opt-in feature, the default value of 1.0 will disable the feature. When it is set to 1.0 (100%) 
   * it means that every transaction is allowed to pass.
   * 
   * Note: When we fail to calculate Price Impact we will return null and Price Impact Protection will be disabled 
   * See affects on estimatedPriceImpact in the Response fields. Read more about price 
   * impact protection and how to set it up in the docs.
   */
  priceImpactProtectionPercentage?: string;
  /**
   * (Optional) The recipient address of any trade surplus fees. If specified, this address will collect trade surplus 
   * when applicable. Otherwise, trade surplus will not be collected.
   * 
   * Note: Trade surplus is only sent to this address for sells. It is a no-op for buys. 
   * Read more about "Can I collect trade surplus?" in the FAQs.
   */
  feeRecipientTradeSurplus?: string;
  /**
   * (Optional) A boolean field. If set to true, the 0x Swap API quote request should sell the entirety of the 
   * caller's takerToken balance. A sellAmount is still required, even if it is a best guess, because it is 
   * how a reasonable minimum received amount is determined after slippage.
   * 
   * Note: This parameter is only required for special cases, such as when setting up a multi-step transaction 
   * or composable operation, where the entire balance is not known ahead of time. Read more about 
   * "Is there a way to sell assets via Swap API if the exact sellToken amount is not known 
   * before the transaction is executed?" in the FAQs.
   */
  shouldSellEntireBalance?: string;
};

export interface PipeCall {
  target: Address,
  data: `0x${string}`
};

export interface AdvancedPipeCall {
  target: Address,
  callData: `0x${string}`,
  clipboard: `0x${string}`
};

export interface AdvancedFarmCall {
  callData: `0x${string}`,
  clipboard: `0x${string}`
};