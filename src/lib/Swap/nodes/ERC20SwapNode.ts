import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { basinWellABI } from "@/constants/abi/basinWellABI";
import { siloedPintoABI } from "@/constants/abi/siloedPintoABI";
import { MAIN_TOKEN, S_MAIN_TOKEN } from "@/constants/tokens";
import encoders from "@/encoders";
import erc20BalanceOf from "@/encoders/erc20BalanceOf";
import { pipelineAddress } from "@/generated/contractHooks";
import { SwapContext } from "@/lib/Swap/swap-router";
import { ZeroX } from "@/lib/matcha/ZeroX";
import { ZeroXQuoteV2Response } from "@/lib/matcha/types";
import { resolveChainId } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { Address } from "viem";
import { readContract } from "viem/actions";
import { ClipboardContext, ISwapNode, SwapNode } from "./SwapNode";

interface IERC20SwapNode {
  minBuyAmount: TV;
  slippage: number;
  amountOutCopySlot: number;
}

type IERC20SwapNodeUnion = IERC20SwapNode & ISwapNode;

/** ========================================================================================================== */
/** ---------------------------------------- Abstract Class -------------------------------------------------- */
/** ========================================================================================================== */

/**
 * Abstract class for swaps involving only ERC20 tokens.
 *
 * Implements properties & methods that require slippage to be considered.
 */
export abstract class ERC20SwapNode extends SwapNode implements IERC20SwapNode {
  readonly sellToken: Token;

  readonly buyToken: Token;

  /**
   * The slippage for the swap occuring via this node
   */
  slippage: number = 0;

  /**
   * The minimum amount of buyToken that should be received after the swap. (buyAmount less slippage)
   */
  minBuyAmount: TV = TV.ZERO;

  /**
   * The index pointing towards the amount buyAmount receieved at run-time to be copied
   */
  abstract readonly amountOutCopySlot: number;

  constructor(context: SwapContext, sellToken: Token, buyToken: Token) {
    super(context);
    this.sellToken = sellToken;
    this.buyToken = buyToken;
  }

  getBalanceOfTokenEncoded(token: "sell" | "buy", address: Address): AdvancedPipeCall {
    const callData = erc20BalanceOf(address, token === "sell" ? this.sellToken.address : this.buyToken.address);

    // should never happen, but sanity check
    if (!callData.target) {
      throw new Error("Target required to encode balanceOf");
    }

    return callData;
  }

  /**
   * Quote the amount of buyToken that will be received for selling sellToken
   * @param sellToken
   * @param buyToken
   * @param sellAmount
   * @param slippage
   */
  abstract quoteForward(sellAmount: TV, slippage: number): Promise<this>;

  override setFields<T extends IERC20SwapNodeUnion>(args: Partial<T>) {
    super.setFields(args);
    return this;
  }

  protected override getHuman() {
    const obj = super.getHuman();

    return {
      ...obj,
      allowanceTarget: this.allowanceTarget,
      slippage: this.slippage,
      minBuyAmount: this.minBuyAmount.toNumber(),
      amountOutCopySlot: this.amountOutCopySlot,
    };
  }

  // ------------------------------------------
  // ----- ERC20SwapNode specific methods -----

  private validateSlippage() {
    if (this.slippage === null || this.slippage === undefined) {
      throw this.makeErrorWithContext("Slippage is required");
    }
    if (this.slippage < 0 || this.slippage > 100) {
      throw this.makeErrorWithContext(`Expected slippage to be between 0 and 100% but got ${this.slippage}`);
    }
    return true;
  }
  private validateMinBuyAmount() {
    if (!this.minBuyAmount) {
      throw this.makeErrorWithContext("minBuyAmount has not been set.");
    }
    if (this.minBuyAmount.lte(0)) {
      throw this.makeErrorWithContext("minBuyAmount must be greater than 0.");
    }
    this.validateBuyAmount();
    if (this.minBuyAmount.gt(this.buyAmount)) {
      throw this.makeErrorWithContext("minBuyAmount must be less than buyAmount.");
    }
    return true;
  }
  protected validateQuoteForward() {
    this.validateTokens();
    this.validateIsERC20Token(this.sellToken);
    this.validateIsERC20Token(this.buyToken);
    this.validateSellAmount();
    this.validateSlippage();
  }
  protected validateAll() {
    this.validateQuoteForward();
    this.validateBuyAmount();
    this.validateMinBuyAmount();
  }
}

/** ========================================================================================================== */
/** ---------------------------------------- Implementations ------------------------------------------------- */
/** ========================================================================================================== */

/** ---------------------------------------------------------------------------------------------------------- */
/** ---------------------------------------- Dex Aggregator -------------------------------------------------- */
/** ---------------------------------------------------------------------------------------------------------- */

// ----------------------------------------- Matcha 0x -------------------------------------------------------

export class ZeroXSwapNode extends ERC20SwapNode {
  name: string = "SwapNode: ZeroX";

  quote: ZeroXQuoteV2Response | undefined;

  readonly amountOutCopySlot: number = 0;

  get allowanceTarget() {
    if (!this.quote?.transaction) {
      throw this.makeErrorWithContext(
        "Error building zeroX swap: Quote must be set fetched before getting allowance target.",
      );
    }
    return this.quote.transaction.to;
  }

  setQuote(quote: ZeroXQuoteV2Response) {
    this.quote = quote;
    return this;
  }

  async quoteForward(sellAmount: TV, slippage: number, excludePintoExchange: boolean = false) {
    this.setFields({ sellAmount, slippage });
    this.validateQuoteForward();

    const [quote] = await ZeroX.quote({
      chainId: this.context.chainId,
      sellToken: this.sellToken.address,
      buyToken: this.buyToken.address,
      sellAmount: this.sellAmount.blockchainString,
      taker: pipelineAddress[resolveChainId(this.context.chainId)],
      txOrigin: pipelineAddress[resolveChainId(this.context.chainId)],
      sellEntireBalance: true,
      slippageBps: ZeroX.slippageToSlippageBps(this.slippage),
      excludedSources: excludePintoExchange ? "Pinto" : undefined,
    });

    this.quote = quote;

    console.debug("[Swap/ZeroXSwapNode] QUOTE:", quote);

    if (!this.quote?.transaction?.to || !this.quote?.transaction?.data) {
      throw this.makeErrorWithContext("Error building zeroX swap: no transaction data found.");
    }

    const buyAmount = TV.fromBlockchain(quote.buyAmount, this.buyToken.decimals);
    const minBuyAmount = TV.fromBlockchain(quote.minBuyAmount, this.buyToken.decimals);

    this.setFields({ buyAmount, minBuyAmount: minBuyAmount });

    console.debug("[Swap/ZeroXSwapNode] quoteForward:", {
      ...this.getHuman(),
      quote,
    });
    return this;
  }

  buildStep(): AdvancedPipeCall[] {
    this.validateAll();
    const zeroXQuote = this.quote;
    if (!zeroXQuote) {
      throw this.makeErrorWithContext("Error building zeroX swap: no quote found. Run quoteForward first.");
    }

    const encoded = zeroXQuote.transaction.data;

    const pipeStruct: AdvancedPipeCall = {
      target: zeroXQuote.transaction.to,
      callData: encoded,
      clipboard: Clipboard.encode([]),
    };

    console.debug("[Swap/ZeroXSwapNode/] build:", {
      ...this.getHuman(),
      quote: this.quote,
      pipeStruct,
    });

    const balanceStruct = this.getBalanceOfTokenEncoded("buy", pipelineAddress[this.context.chainId]);

    return [pipeStruct, balanceStruct];
  }

  getFeeFromQuote() {
    const fee = this.quote?.fees?.zeroExFee;
    // assumes that fee is either sell token or buy token since the fee is taken from on-chain.
    const feeToken = this.getNodeToken(fee?.token);

    if (!fee || !feeToken) return undefined;

    return {
      fee: TV.fromBlockchain(fee.amount, feeToken.decimals),
      feeToken,
    };
  }
}

/** ---------------------------------------------------------------------------------------------------------- */
/** ---------------------------------------- Basin Well Methods ---------------------------------------------- */
/** ---------------------------------------------------------------------------------------------------------- */

// ----------------------------------------- Well SwapFrom ---------------------------------------------------
interface WellSwapBuildParams {
  copySlot: number | undefined;
  recipient: Address;
}

export class WellSwapNode extends ERC20SwapNode {
  readonly name: string;

  readonly well: Token;

  readonly amountOutCopySlot = 0;

  readonly amountInPasteSlot = 2;

  readonly allowanceTarget: Address;

  constructor(context: SwapContext, well: Token, sellToken: Token, buyToken: Token) {
    super(context, sellToken, buyToken);
    this.well = well;
    this.name = `SwapNode: Well ${this.well.symbol}`;
    this.allowanceTarget = this.well.address;
  }

  async quoteForward(sellAmount: TV, slippage: number) {
    this.setFields({ sellAmount, slippage });
    this.validateQuoteForward();

    const result = await readContract(this.context.config.getClient({ chainId: this.context.chainId }), {
      abi: basinWellABI,
      address: this.well.address,
      functionName: "getSwapOut",
      args: [this.sellToken.address, this.buyToken.address, this.sellAmount.toBigInt()],
    });

    const buyAmount = TV.fromBigInt(result, this.buyToken.decimals);
    const minBuyAmount = buyAmount.subSlippage(this.slippage);
    this.setFields({ buyAmount, minBuyAmount });

    console.debug("[Swap/WellSwapNode] quoteForward:", {
      ...this.getHuman(),
    });

    return this;
  }

  buildStep({ copySlot, recipient }: WellSwapBuildParams, clipboardContext?: ClipboardContext): AdvancedPipeCall {
    this.validateAll();

    let clipboard: HashString | undefined = undefined;

    if (exists(copySlot) && exists(clipboardContext)) {
      const copyIndex = clipboardContext.indexMap.get(this.tagNeeded);
      if (exists(copyIndex)) {
        clipboard = Clipboard.encodeSlot(copyIndex, copySlot, this.amountInPasteSlot);
      }
    }

    const pipeStruct = encoders.well.swapFrom(
      this.well,
      this.sellToken,
      this.buyToken,
      this.sellAmount,
      this.minBuyAmount,
      recipient,
      TV.MAX_UINT256.toBigInt(),
      clipboard,
    );

    if (!pipeStruct.target) {
      throw new Error("Target required to encode Well Swap Node");
    }

    console.debug("[Swap/WellSwapNode] build:", {
      ...this.getHuman(),
      well: this.well.symbol,
      recipient: stringEq(pipelineAddress[this.context.chainId], recipient) ? "PIPELINE" : recipient,
      clipboard: [clipboardContext?.indexMap.get(this.tagNeeded), copySlot, this.amountInPasteSlot],
      pipeStruct,
    });

    return pipeStruct;
  }

  override validateTokens() {
    super.validateTokens();
    if (this.well.tokens?.length !== 2) {
      throw this.makeErrorWithContext("Cannot configure well swap with non-pair wells");
    }
    if (!this.well.tokens.some((token) => stringEq(token, this.sellToken.address))) {
      throw this.makeErrorWithContext(
        `Invalid token Sell Token. Well ${this.well.name} does not contain ${this.sellToken.symbol}`,
      );
    }
  }
}

// ----------------------------------------- Well Sync ---------------------------------------------------

interface WellSyncSwapBuildParams {
  recipient: Address;
}

export class WellSyncSwapNode extends ERC20SwapNode {
  readonly name: string;

  readonly amountOutCopySlot: number = 0;

  readonly transferAmountInPasteSlot = 1;

  readonly allowanceTarget: Address;

  constructor(context: SwapContext, sellToken: Token, buyToken: Token) {
    super(context, sellToken, buyToken);

    this.name = `SwapNode: WellSync: ${this.sellToken.symbol} -> ${this.buyToken.symbol}`;

    if (!this.buyToken.isLP) {
      throw this.makeErrorWithContext(
        `WellSyncSwapNode can only swap to the well's LP token, but got ${this.buyToken.symbol}`,
      );
    }

    this.allowanceTarget = this.buyToken.address;
  }

  async quoteForward(sellAmount: TV, slippage: number) {
    this.setFields({ sellAmount, slippage });
    this.validateQuoteForward();

    const [token0] = validateAndGetWellTokens(this.context, this.buyToken);

    const amounts = tokensEqual(token0, this.sellToken) ? [this.sellAmount, TV.ZERO] : [TV.ZERO, this.sellAmount];

    const result = await readContract(this.context.config.getClient(), {
      abi: basinWellABI,
      functionName: "getAddLiquidityOut",
      address: this.buyToken.address,
      args: [amounts.map((amount) => amount.toBigInt())],
    });

    const buyAmount = TV.fromBigInt(result, this.buyToken.decimals);

    const minBuyAmount = buyAmount.subSlippage(this.slippage);

    this.setFields({ buyAmount, minBuyAmount });

    console.debug("[Swap/SellSyncSwapNode] quoteForward:", this.getHuman());

    return this;
  }

  buildStep({ recipient }: WellSyncSwapBuildParams): AdvancedPipeCall {
    this.validateAll();

    const pipeStruct = encoders.well.sync(recipient, this.minBuyAmount, this.buyToken.address);

    if (!pipeStruct.target) {
      throw this.makeErrorWithContext("Target required to encoded Well Sync Swap Node");
    }

    console.debug("[Swap/WellSyncSwapNode/] build:", {
      ...this.getHuman(),
      recipient: stringEq(pipelineAddress[this.context.chainId], recipient) ? "PIPELINE" : recipient,
      pipeStruct,
    });

    return pipeStruct;
  }

  transferStep({ copySlot }: { copySlot: number | undefined }, clipboardContext?: ClipboardContext): AdvancedPipeCall {
    let clipboard: HashString | undefined = undefined;

    if (exists(copySlot) && exists(clipboardContext)) {
      const copyIndex = clipboardContext.indexMap.get(this.tagNeeded);
      if (exists(copyIndex)) {
        clipboard = Clipboard.encodeSlot(copyIndex, copySlot, this.transferAmountInPasteSlot);
      }
    }

    const transfer = encoders.token.erc20Transfer(
      this.buyToken.address,
      this.sellAmount,
      this.sellToken.address,
      clipboard,
    );

    if (!transfer.target) {
      throw this.makeErrorWithContext("Target required to encoded Well Sync Transfer Step");
    }

    console.debug("[Swap/WellSyncSwapNode/transferStep]: ", {
      sellToken: this.sellToken.symbol,
      buyToken: this.buyToken.symbol,
      sellAmount: this.sellAmount.toNumber(),
      pipeStruct: transfer,
      tagNeeded: this.tagNeeded,
      thisTag: this.thisTag,
      clipboard: [clipboardContext?.indexMap.get(this.tagNeeded), copySlot, this.transferAmountInPasteSlot],
    });

    return transfer;
  }

  override validateTokens() {
    super.validateTokens();

    if (!this.buyToken.isLP) {
      throw this.makeErrorWithContext(
        `WellSyncSwapNode can only swap to the well's LP token, but got ${this.buyToken.symbol}`,
      );
    }

    const underlying = validateAndGetWellTokens(this.context, this.buyToken);

    if (!tokensEqual(this.sellToken, underlying[0]) && !tokensEqual(this.sellToken, underlying[1])) {
      throw this.makeErrorWithContext(
        `Invalid Sell Token. Well ${this.buyToken.name} does not contain ${this.sellToken.symbol}`,
      );
    }
  }
}

// ----------------------------------------- Well Remove Liquidity One Token -----------------------------

interface WellRemoveSingleSidedSwapNodeBuildParams {
  recipient: Address;
}

export class WellRemoveSingleSidedSwapNode extends ERC20SwapNode {
  readonly name: string;

  readonly amountOutCopySlot: number = 0;

  readonly amountInPasteSlot: number = 0;

  readonly allowanceTarget: Address;

  constructor(context: SwapContext, sellToken: Token, buyToken: Token) {
    super(context, sellToken, buyToken);

    this.name = `SwapNode: WellRemoveLiquidityOneToken: ${this.sellToken.symbol}`;

    if (!this.sellToken.isLP) {
      throw this.makeErrorWithContext(`Expected LP token as sell token, but got ${this.sellToken.symbol}`);
    }

    this.allowanceTarget = this.sellToken.address;
  }

  async quoteForward(sellAmount: TV, slippage: number) {
    this.setFields({ sellAmount, slippage });
    validateAndGetWellTokens(this.context, this.sellToken);
    this.validateQuoteForward();

    const result = await readContract(this.context.config.getClient(), {
      abi: basinWellABI,
      functionName: "getRemoveLiquidityOneTokenOut",
      address: this.sellToken.address,
      args: [sellAmount.toBigInt(), this.buyToken.address],
    });

    const buyAmount = TV.fromBigInt(result, this.buyToken.decimals);

    const minBuyAmount = buyAmount.subSlippage(this.slippage);

    this.setFields({ buyAmount, minBuyAmount });

    console.debug("[Swap/WellRemoveSingleSidedSwapNode] quoteForward:", this.getHuman());

    return this;
  }

  buildStep({ recipient }: WellRemoveSingleSidedSwapNodeBuildParams): AdvancedPipeCall {
    this.validateAll();
    validateAndGetWellTokens(this.context, this.sellToken);
    const pipeStruct = encoders.well.removeLiquidityOneToken(
      this.sellToken,
      this.sellAmount,
      this.buyToken,
      this.minBuyAmount,
      recipient,
    );

    if (!pipeStruct.target) {
      throw this.makeErrorWithContext("Target required to encode removeLiquidityOneToken");
    }

    console.debug("[Swap/WellRemoveSingleSidedSwapNode] build:", {
      ...this.getHuman(),
      recipient: stringEq(pipelineAddress[this.context.chainId], recipient) ? "PIPELINE" : recipient,
      pipeStruct,
    });

    return pipeStruct;
  }
}

/** ---------------------------------------------------------------------------------------------------------- */
/** ---------------------------------------- Silo Deposit Methods -------------------------------------------- */
/** ---------------------------------------------------------------------------------------------------------- */

// ----------------------------------------- Siloed Pinto Wrap ------------------------------------------------

interface SiloWrappedTokenWrapNodeBuildParams {
  recipient: Address;
  copySlot: number | undefined;
}

export class SiloWrappedTokenWrapNode extends ERC20SwapNode {
  readonly name = "SwapNode: SiloWrappedTokenWrapNode";

  readonly amountOutCopySlot: number = 0;

  readonly amountInPasteSlot: number = 0;

  readonly allowanceTarget: Address;

  constructor(context: SwapContext) {
    const sellToken = MAIN_TOKEN[resolveChainId(context.chainId)];
    const buyToken = S_MAIN_TOKEN[resolveChainId(context.chainId)];
    super(context, sellToken, buyToken);
    this.allowanceTarget = buyToken.address;
  }

  // slippage is ignored for Silo Wrap
  async quoteForward(sellAmount: TV, slippage: number = 0) {
    this.setFields({ sellAmount, slippage });
    this.validateQuoteForward();

    const quote = await readContract(this.context.config.getClient({ chainId: this.context.chainId }), {
      abi: siloedPintoABI,
      address: this.buyToken.address,
      functionName: "previewDeposit",
      args: [sellAmount.toBigInt()],
    });

    const buyAmount = TV.fromBigInt(quote, this.buyToken.decimals);

    this.setFields({ buyAmount, minBuyAmount: buyAmount });

    return this;
  }

  buildStep(
    { recipient, copySlot }: SiloWrappedTokenWrapNodeBuildParams,
    clipboardContext?: ClipboardContext,
  ): AdvancedPipeCall {
    this.validateAll();

    let clipboard: HashString | undefined = undefined;

    if (exists(copySlot) && exists(clipboardContext)) {
      const copyIndex = clipboardContext.indexMap.get(this.tagNeeded);
      if (exists(copyIndex)) {
        clipboard = Clipboard.encodeSlot(copyIndex, copySlot, this.amountInPasteSlot);
      }
    }

    const pipeStruct = encoders.siloedPinto.depositERC20(this.sellAmount, recipient, this.buyToken.address, clipboard);

    console.debug("[Swap/SiloedPintoWrapNode] build:", {
      ...this.getHuman(),
      recipient: stringEq(pipelineAddress[this.context.chainId], recipient) ? "PIPELINE" : recipient,
      pipeStruct,
    });

    return pipeStruct;
  }
}

// ----------------------------------------- Siloed Pinto Unwrap ----------------------------------------------

interface SiloWrappedTokenUnwrapNodeBuildParams {
  recipient: Address;
  owner: Address;
  copySlot: number | undefined;
}

export class SiloWrappedTokenUnwrapNode extends ERC20SwapNode {
  readonly name = "SwapNode: SiloWrappedTokenUnwrapNode";

  readonly amountOutCopySlot: number = 0;

  readonly amountInPasteSlot: number = 0;

  readonly allowanceTarget: Address;

  constructor(context: SwapContext) {
    const sellToken = S_MAIN_TOKEN[resolveChainId(context.chainId)];
    const buyToken = MAIN_TOKEN[resolveChainId(context.chainId)];
    super(context, sellToken, buyToken);
    this.allowanceTarget = sellToken.address;
  }

  // slippage is ignored for Silo Unwrap
  async quoteForward(sellAmount: TV, slippage: number = 0) {
    this.setFields({ sellAmount, slippage });
    this.validateQuoteForward();

    const quote = await readContract(this.context.config.getClient({ chainId: this.context.chainId }), {
      abi: siloedPintoABI,
      address: this.sellToken.address,
      functionName: "previewRedeem",
      args: [sellAmount.toBigInt()],
    });

    const buyAmount = TV.fromBigInt(quote, this.buyToken.decimals);

    this.setFields({ buyAmount, minBuyAmount: buyAmount });

    return this;
  }

  buildStep(
    { recipient, owner, copySlot }: SiloWrappedTokenUnwrapNodeBuildParams,
    clipboardContext?: ClipboardContext,
  ): AdvancedPipeCall {
    this.validateAll();

    let clipboard: HashString | undefined = undefined;

    if (exists(copySlot) && exists(clipboardContext)) {
      const copyIndex = clipboardContext.indexMap.get(this.tagNeeded);
      if (exists(copyIndex)) {
        clipboard = Clipboard.encodeSlot(copyIndex, copySlot, this.amountInPasteSlot);
      }
    }

    const pipeStruct = encoders.siloedPinto.redeemERC20(
      this.sellAmount,
      recipient,
      owner,
      this.sellToken.address,
      clipboard,
    );

    console.debug("[Swap/SiloedPintoUnwrapNode] build:", {
      ...this.getHuman(),
      recipient: stringEq(pipelineAddress[this.context.chainId], recipient) ? "PIPELINE" : recipient,
      pipeStruct,
    });

    return pipeStruct;
  }
}

function validateAndGetWellTokens(context: SwapContext, well: Token) {
  const thisTokens = well.tokens;
  if (thisTokens?.length !== 2) {
    throw new Error("Cannot determine well tokens for non-pair wells");
  }

  const t0 = context.tokenMap[getTokenIndex(thisTokens[0])];
  const t1 = context.tokenMap[getTokenIndex(thisTokens[1])];

  if (!t0 || !t1) {
    throw new Error("Well tokens not found in constants");
  }

  return [t0, t1];
}
