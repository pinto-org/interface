import { TV } from "@/classes/TokenValue";
import { SwapPriceCache } from "@/lib/Swap/price-cache";
import { SwapContext } from "@/lib/Swap/swap-router";
import { stringEq } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { AdvancedFarmCall, AdvancedPipeCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { MayArray } from "@/utils/types.generic";
import { Address } from "viem";
import { ERC20SwapNode } from "./ERC20SwapNode";

export interface ISwapNodeSettable {
  sellAmount: TV;
  buyAmount: TV;
}
export interface ISwapNode extends ISwapNodeSettable {
  sellToken: Token;
  buyToken: Token;
  usdIn: TV;
  usdOut: TV;
}

type BuildStepParams = Partial<{
  copySlot: number;
  fromMode: FarmFromMode;
  toMode: FarmToMode;
  recipient: string;
}>;

export type ClipboardContext = {
  indexMap: Map<string, number>;
};

export abstract class SwapNode implements ISwapNode {
  abstract name: string;

  /** Token to exchange */
  abstract readonly sellToken: Token;

  /** Token to receive */
  abstract readonly buyToken: Token;

  /** Amount of SellToken to exchange */
  sellAmount: TV = TV.ZERO;

  /** Max amount of of buyToken received */
  buyAmount: TV = TV.ZERO;

  /** Min amount of buyToken received */
  minBuyAmount: TV = TV.ZERO;

  /** USD amount of sellAmount */
  usdIn: TV = TV.ZERO;

  /** USD amount of buyAmount */
  usdOut: TV = TV.ZERO;

  /** The address that should be approved to perform the txn in buildStep */
  abstract readonly allowanceTarget: Address;

  /// ----------------------------------------

  constructor(public readonly context: SwapContext) {}

  /**
   * Build the swap step
   * @param args copySlot, fromMode, toMode
   */
  abstract buildStep(args?: BuildStepParams, context?: ClipboardContext): MayArray<AdvancedPipeCall | AdvancedFarmCall>;

  /**
   * The tag for the amount out for THIS node. Subsequent nodes will copy from this value.
   */
  get thisTag(): `get-${string}` {
    return `get-${this.buyToken.symbol}`;
  }

  /**
   * The clipboard tag of a PREVIOUS node that this step will copy from
   */
  get tagNeeded(): `get-${string}` {
    return `get-${this.sellToken.symbol}`;
  }

  /**
   * Set the fields of the node
   */
  setFields<T extends ISwapNodeSettable>(args: Partial<T>) {
    Object.assign(this, args);
    return this;
  }

  setUSDValues(priceCache: SwapPriceCache) {
    const sellTokenPrice = priceCache.getPrice(this.sellToken) ?? TV.ZERO;
    const buyTokenPrice = priceCache.getPrice(this.buyToken) ?? TV.ZERO;
    this.usdIn = this.sellAmount.mul(sellTokenPrice).reDecimal(6);
    this.usdOut = this.buyAmount.mul(buyTokenPrice).reDecimal(6);

    // console.debug(`[SwapNode] ${this.name} setUSDValues: `, {
    //   sellToken: this.sellToken,
    //   buyToken: this.buyToken,
    //   sellPrice: sellTokenPrice,
    //   buyPrice: buyTokenPrice,
    //   sellAmount: this.sellAmount,
    //   buyAmount: this.buyAmount,
    //   usdIn: this.usdIn,
    //   usdOut: this.usdOut,
    // });
  }

  getNodeToken(token: Token | Address | string | undefined): Token | undefined {
    if (!token) return undefined;

    const address = typeof token === "object" ? token.address : token;

    if (stringEq(address, this.sellToken.address)) return this.sellToken;
    if (stringEq(address, this.buyToken.address)) return this.buyToken;

    return undefined;
  }

  protected getHuman() {
    return {
      sellToken: this.sellToken.symbol,
      buyToken: this.buyToken.symbol,
      sellAmount: this.sellAmount.toNumber(),
      buyAmount: this.buyAmount.toNumber(),
      thisTag: this.thisTag,
      tagNeeded: this.tagNeeded,
    };
  }

  /// ----------------------------------------
  /// ------------ VALIDATION ------------ ///
  protected makeErrorWithContext(msg: string) {
    return new Error(`Error: building swap step in ${this.name}: ${msg}`);
  }
  protected validateIsERC20Token(token: Token) {
    if (token.isNative) {
      throw this.makeErrorWithContext(`Expected ERC20 token but got ${token.symbol}.`);
    }
  }
  protected validateTokens() {
    if (!this.sellToken) {
      throw this.makeErrorWithContext("Sell token is required.");
    }
    if (!this.buyToken) {
      throw this.makeErrorWithContext("buy token is required.");
    }
    if (tokensEqual(this.sellToken, this.buyToken)) {
      throw this.makeErrorWithContext(`Expected unique tokens. ${this.sellToken.symbol} and ${this.buyToken.symbol}`);
    }
  }
  protected validateSellAmount() {
    if (!this.sellAmount) {
      throw this.makeErrorWithContext("sell amount is required.");
    }
    if (this.sellAmount.lte(0)) {
      throw this.makeErrorWithContext("sell amount must be greater than 0.");
    }
  }
  protected validateBuyAmount() {
    if (!this.buyAmount) {
      throw this.makeErrorWithContext("buy amount is required.");
    }
    if (this.buyAmount.lte(0)) {
      throw this.makeErrorWithContext("buy amount must be greater than 0.");
    }
    return true;
  }
}
