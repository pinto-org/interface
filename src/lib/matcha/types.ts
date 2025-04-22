import { HashString } from "@/utils/types.generic";
import { Address } from "viem";

/**
 * Zero X V2 API params
 * @link https://0x.org/docs/api#tag/Swap/operation/swap::allowanceHolder::getQuote
 */

export interface ZeroXQuoteV2Parameters {
  /**
   * The chain ID to use for the quote.
   */
  chainId: number;
  /**
   * The contract address of the token to buy
   */
  buyToken: Address;
  /**
   * The contract address of the token to sell
   */
  sellToken: Address;
  /**
   * The amount of sellToken in sellToken base units to sell
   */
  sellAmount: string;
  /**
   * The address which holds the sellToken balance and has the allowance set for the swap.
   */
  taker?: Address;
  /**
   * The contract address of the external account that started the transaction. This is only needed if taker is a smart contract.
   */
  txOrigin?: Address;
  /**
   * The wallet address to receive the specified trading fees.
   * You must also specify the swapFeeToken and swapFeeBps in the request to use this feature.
   */
  swapFeeRecipient?: Address;
  /**
   * The amount in Bps of the swapFeeToken to charge and deliver to the swapFeeRecipient.
   * You must also specify the swapFeeRecipient and swapFeeToken in the request to use this feature.
   * For security, this field has a default limit of 1000 Bps.
   */
  swapFeeBps?: number;
  /**
   * The address to receive any trade surplus. If specified, this address will receive trade surplus when applicable.
   * Otherwise, the taker will receive the surplus
   */
  tradeSurplusRecipient?: Address;
  /**
   * The target gas price (in wei) for the swap transaction. If not provided, the default value is based on the 0x gas price oracle
   */
  gasPrice?: string;
  /**
   * [0 .. 10_000]
   * The maximum acceptable slippage of the buyToken in Bps. If this parameter is set to 0, no slippage will be tolerated.
   * If not provided, the default slippage tolerance is 100Bps
   */
  slippageBps?: number;
  /**
   * Liquidity sources e.g. Uniswap_V3, SushiSwap, 0x_RFQ to exclude from the provided quote.
   * See https://api.0x.org/sources?chainId= with the desired chain's ID for a full list of sources.
   * Separate multiple sources with a comma
   */
  excludedSources?: string;
  /**
   * If set to true, the taker's entire sellToken balance will be sold during trade execution.
   * The sellAmount should be the maximum estimated value, as close as possible to the actual taker's balance to ensure the best routing.
   * Selling more than the sellAmount may cause the trade to revert. This feature is designed for cases where the precise sell amount is determined during execution
   */
  sellEntireBalance?: boolean;
}

export interface ZeroXQuoteHeaders {
  /**
   * The 0x API key to use for the request.
   */
  "0x-api-key": string;
  /**
   * The version of the 0x API to use for the request.
   */
  "0x-version": "v2" | "v1";
}

export type ZeroXSwapFeeType =
  | "zeroExFee" // The fee charged by 0x for the trade.
  | "integratorFee" // The specified fee to charge and deliver to the 'swapFeeRecipient'
  | "gasFee"; // The gas fee to be used in submitting the transaction.

export interface ZeroXSwapFeeDetails {
  /**
   * The amount of token charged as the fee.
   */
  amount: string;
  /**
   * The address of the token charged as the fee.
   */
  token: Address;
  /**
   * Usually "volume" | "gas"
   */
  type: string;
}

export interface ZeroXQuoteV2Response {
  /**
   * The block number at which the liquidity sources were sampled to generate the quote.
   * Indicates the freshness of the quote.
   */
  blockNumber: string;
  /**
   * The amount of buyToken (in buyToken units) that will be bought in the swap
   */
  buyAmount: string;
  /**
   * The contract address of the token to buy in the swap
   */
  buyToken: Address;
  /**
   * The fees charged for the trade.
   */
  fees: Record<ZeroXSwapFeeType, ZeroXSwapFeeDetails | null>;
  /**
   * An object containing potential issues discovered during 0x validation that can prevent the swap from being executed successfully by the taker
   */
  issues: {
    /**
     * Details of allowances that the taker must set for in order to execute the swap successfully. Null if no allowance is required
     */
    allowance: {
      /**
       * The taker's current allowance of the spender
       */
      actual: Address;
      /**
       * The address to set the allowance on
       */
      spender: Address;
    } | null;
    /**
     * Details of balance of the sellToken that the taker must hold. Null if the taker has sufficient balance
     */
    balance: {
      /**
       * The contract address of the token
       */
      token: Address;
      /**
       * The current balance of the sellToken in the taker address
       */
      actual: string;
      /**
       * The balance of the sellToken required for the swap to execute successfully
       */
      expected: string;
    } | null;
    /**
     * This is set to true when 0x cannot validate the transaction.
     * This happens when the taker has an insufficient balance of the sellToken and 0x is unable to perform ehanced quote validation with the low balance.
     * Note that this does not necessarily mean that the trade will revert
     */
    simulationIncomplete: boolean;
    /**
     * A list of invalid sources present in excludedSources request.
     */
    invalidSourcesPassed: string[];
    /**
     * This validates the availability of liquidity for the quote requested. The rest of the fields will only be returned if true
     */
    liquidityAvailable: boolean;
  };
  /**
   * The price which must be met or else the transaction will revert.
   * This price is influenced by the slippageBps parameter. On-chain sources may encounter price movements from quote to settlement
   */
  minBuyAmount: string;
  route: {
    /**
     * Details of each segment that 0x routes the swap through
     */
    fills: {
      /**
       * The contract address of the input token
       */
      from: Address;
      /**
       * The contract address of the output token
       */
      to: Address;
      /**
       * The liquidity source used in the route
       */
      source: string;
      /**
       * The proportion of the trade to be filled by the source
       */
      proportionBps: string;
    }[];
    /**
     * Properties of the tokens involved in the swap
     */
    tokens: {
      /**
       * The token address. This is the unique identifier of the token
       */
      address: Address;
      /**
       * The token symbol. This is not guaranteed to be unique, as multiple tokens can have the same symbol
       */
      symbol: string;
    }[];
  };
  /**
   * The amount of sellToken (in sellToken units) that will be sold in this swap
   */
  sellAmount: string;
  /**
   * The contract address of the token to sell in the swap
   */
  sellToken: Address;
  /**
   * Swap-related metadata for the buy and sell token in the swap
   */
  tokenMetadata: {
    /**
     * Swap-related metadata for the buy token
     */
    buyToken: {
      /**
       * The buy tax in bps of the token.
       * Since each token could have arbitrary implementation, this field is best effort, meaning it would be set to null if the system is not able to determine the tax
       */
      buyTaxBps: string | null;
      /**
       * The sell tax in bps of the token.
       * Since each token could have arbitrary implementation, this field is best effort, meaning it would be set to null if the system is not able to determine the tax
       */
      sellTaxBps: string | null;
    };

    sellToken: {
      buyTaxBps: string | null;
      sellTaxBps: string | null;
    };
  };
  /**
   * The estimated total network cost of the swap.
   * On chains where there is no L1 data cost, it is calculated as gas * gasPrice. On chains where there is an L1 data cost, it is calculated as gas*gasPrice + L1 data
   */
  totalNetworkFee: string | null;
  /**
   * The details required to submit the transaction
   */
  transaction: {
    /**
     * The address of the target contract to send call data to
     */
    to: Address;
    /**
     * The calldata containing transaction execution details to be sent to the to address
     */
    data: HashString;
    /**
     * The estimated gas limit that should be used to send the transaction to guarantee settlement
     */
    gas: string | null;
    /**
     * The gas price (in wei) that should be used to send the transaction
     */
    gasPrice: string;
    /**
     * The amount of ether (in wei) that should be sent with the transaction
     */
    value: string;
  };
  /**
   * The unique ZeroEx identifier of the request
   */
  zid: string;
}
