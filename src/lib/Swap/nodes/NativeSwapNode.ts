import { Clipboard } from "@/classes/Clipboard";
import encoders from "@/encoders";
import { beanstalkAddress } from "@/generated/contractHooks";
import { SwapContext } from "@/lib/Swap/swap-router";
import { resolveChainId } from "@/utils/chain";
import { AdvancedFarmCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { Address } from "viem";
import { ClipboardContext, ISwapNodeSettable, SwapNode } from "./SwapNode";

/**
 * Abstract class to extend for actions involving ETH, specifically, wrapETH & unwrapETH.
 * we declare the sellToken & buyToken as readonly to ensure they are never changed
 */
export abstract class NativeSwapNode extends SwapNode {
  abstract readonly sellToken: Token;

  abstract readonly buyToken: Token;

  /**
   * @param args sell amount or buy amount
   * setting sellAmount sets buyAmount and vice versa
   */
  override setFields<T extends ISwapNodeSettable>(args: Partial<T>) {
    const amount = args.sellAmount ?? args.buyAmount;
    if (amount) {
      this.sellAmount = amount;
      this.buyAmount = amount;
      this.minBuyAmount = amount;
    }
    return this;
  }

  protected validateIsNativeToken(token: Token) {
    if (!token.isNative) {
      throw this.makeErrorWithContext(`Expected Native token but got ${token.symbol}.`);
    }
  }
}

interface UnwrapEthBuildParams {
  fromMode: FarmFromMode;
  copySlot: number | undefined;
}

/**
 * Class to faciliate unwrapping WETH -> ETH
 */
export class UnwrapEthSwapNode extends NativeSwapNode {
  readonly name = "SwapNode: UnwrapEth";

  readonly sellToken: Token;

  readonly buyToken: Token;

  readonly allowanceTarget: Address;

  constructor(context: SwapContext) {
    super(context);
    this.sellToken = this.context.wrappedNative;
    this.buyToken = this.context.native;
    this.allowanceTarget = beanstalkAddress[resolveChainId(this.context.chainId)];
  }

  buildStep(
    { fromMode, copySlot }: UnwrapEthBuildParams,
    context?: ClipboardContext,
    _clipboard?: HashString,
  ): AdvancedFarmCall {
    this.validateSellAmount();
    this.validateBuyAmount();

    let clipboard: HashString | undefined = _clipboard;

    if (!clipboard && copySlot !== undefined) {
      const returnIndexSlot = context?.indexMap.get(this.tagNeeded);
      if (returnIndexSlot) {
        clipboard = Clipboard.encodeSlot(returnIndexSlot, copySlot, 0);
      }
    }

    const farmStruct = encoders.token.unwrapEth(this.sellAmount, fromMode, clipboard);

    console.debug(`[SwapNode/UnwrapEthSwapNode] build:`, {
      ...this.getHuman(),
      allowanceTarget: this.allowanceTarget,
      fromMode,
      clipboard: [context?.indexMap.get(this.tagNeeded), copySlot, 0],
      utilizedClipboard: clipboard,
      farmStruct,
    });

    return farmStruct;
  }
}

interface WrapEthBuildParams {
  toMode: FarmToMode;
}

/**
 * Class to faciliate wrapping ETH -> WETH
 */
export class WrapEthSwapNode extends NativeSwapNode {
  readonly name = "SwapNode: WrapEth";

  readonly sellToken: Token;

  readonly buyToken: Token;

  readonly allowanceTarget: Address;

  constructor(context: SwapContext) {
    super(context);

    this.sellToken = this.context.native;
    this.buyToken = this.context.wrappedNative;
    this.allowanceTarget = beanstalkAddress[resolveChainId(this.context.chainId)];
  }

  buildStep({ toMode }: WrapEthBuildParams, _ctx?: ClipboardContext, clipboard?: HashString): AdvancedFarmCall {
    this.validateSellAmount();
    this.validateBuyAmount();

    const farmStruct = encoders.token.wrapEth(this.sellAmount, toMode, clipboard);

    console.debug(`[SwapNode/WrapEthSwapNode] build:`, {
      ...this.getHuman(),
      allowanceTarget: this.allowanceTarget,
      toMode,
      clipboard,
      farmStruct,
    });

    return farmStruct;
  }
}
