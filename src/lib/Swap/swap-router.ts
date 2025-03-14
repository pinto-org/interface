import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { diamondPriceABI } from "@/constants/abi/diamondPriceABI";
import { abiSnippets } from "@/constants/abiSnippets";
import { tokens } from "@/constants/tokens";
import encoders from "@/encoders";
import { decodeGetSwapOut } from "@/encoders/well/getWellSwapOut";
import { beanstalkAddress, beanstalkPriceAddress } from "@/generated/contractHooks";
import { resolveChainId } from "@/utils/chain";
import { stringEq } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { AdvancedPipeCall, Token } from "@/utils/types";
import { AddressLookup, HashString } from "@/utils/types.generic";
import { readContract } from "viem/actions";
import { Config as WagmiConfig } from "wagmi";
import {
  ERC20SwapNode,
  WellRemoveSingleSidedSwapNode,
  WellSwapNode,
  WellSyncSwapNode,
  ZeroXSwapNode,
} from "./nodes/ERC20SwapNode";
import { UnwrapEthSwapNode, WrapEthSwapNode } from "./nodes/NativeSwapNode";
import { SwapNode } from "./nodes/SwapNode";
import { SwapPriceCache } from "./price-cache";

export interface BeanSwapNodeQuote {
  /**
   * The sell token of the swap.
   */
  sellToken: Token;
  /**
   * The buy token of the swap.
   */
  buyToken: Token;
  /**
   * The amount of the sell token.
   */
  sellAmount: TV;
  /**
   * The amount of the buy token.
   */
  buyAmount: TV;
  /**
   * The minimum amount of the buy token.
   */
  minBuyAmount: TV;
  /**
   * The nodes of the swap.
   */
  nodes: SwapNode[];
  /**
   * The slippage of the swap.
   */
  slippage: number;
  /**
   * The usd value of the input token amount.
   */
  usdIn: TV;
  /**
   * The usd value of the output token amount.
   */
  usdOut: TV;
}

interface ContractSwapRoute {
  /**
   * The well token if the route source is "well".
   */
  well: Token;
  /**
   * The data of the swap. Only used for the "aggregator" source.
   */
  data?: HashString;
  /**
   * The sell token of the swap.
   */
  sellToken: Token;
  /**
   * The buy token of the swap.
   */
  buyToken: Token;
  /**
   * The usd value of the sell token.
   */
  usdValueIn: TV;
  /**
   * The usd value of the buy token.
   */
  usdValueOut: TV;
  /**
   * The amount of the buy token.
   */
  amountOut: TV;
  /**
   * The minimum amount of the buy token.
   */
  minAmountOut: TV;
}

interface QuoteSourceFragment {
  sellToken: Token;
  buyToken: Token;
}

interface LiquidityQuoteSourceFragment extends QuoteSourceFragment {
  well: Token;
}

class WellsRouter {
  #priceCache: SwapPriceCache;

  #context: SwapContext;

  constructor(priceCache: SwapPriceCache, context: SwapContext) {
    this.#priceCache = priceCache;
    this.#context = context;
  }

  /**
   * get best wells for PINTO -> NON_PINTO sorted by usdValue descending
   */
  async getBestWellBeanInRoute(beanIn: TV, slippage: number, options?: SwapOptions): Promise<ContractSwapRoute[]> {
    const response = await readContract(this.#context.config.getClient({ chainId: this.#context.chainId }), {
      address: beanstalkPriceAddress[this.#context.chainId],
      abi: diamondPriceABI,
      functionName: "getSwapDataBeanInAll",
      args: [beanIn.toBigInt()],
    });

    const mainTokenPrice = this.#priceCache.getPrice(this.#context.mainToken) ?? TV.ZERO;

    const routes: ContractSwapRoute[] = [];

    for (const swapData of response) {
      const thisToken = this.#context.tokenMap[getTokenIndex(swapData.token)];

      const well = this.#context.tokenMap[getTokenIndex(swapData.well)];

      if (options?.disabledThruTokens?.has(thisToken) || !well) {
        continue;
      }

      const amountOut = TV.fromBlockchain(swapData.amountOut, thisToken.decimals);

      routes.push({
        well,
        sellToken: this.#context.mainToken,
        buyToken: thisToken,
        usdValueIn: mainTokenPrice.mul(beanIn).reDecimal(6),
        usdValueOut: TV.fromBlockchain(swapData.usdValue, 6),
        amountOut,
        minAmountOut: amountOut.subSlippage(slippage),
      });
    }

    const sortedRoutes = routes.sort((a, b) => b.usdValueOut.sub(a.usdValueOut).toNumber());
    console.debug("\n--------[Swap/WellsRouter] getBestWellBeanIn: ", sortedRoutes, "\n");
    return sortedRoutes;
  }

  /**
   * get best wells for NON_PINTO -> PINTO sorted by amountOut descending
   */
  async getBestWellBeanOutRoute(usdIn: TV, slippage: number, options?: SwapOptions): Promise<ContractSwapRoute[]> {
    const response = await readContract(this.#context.config.getClient({ chainId: this.#context.chainId }), {
      address: beanstalkPriceAddress[this.#context.chainId],
      abi: diamondPriceABI,
      functionName: "getSwapDataUsdInAll",
      args: [usdIn.toBigInt()],
    });

    const mainTokenPrice = this.#priceCache.getPrice(this.#context.mainToken) ?? TV.ZERO;

    const routes: ContractSwapRoute[] = [];

    for (const swapData of response) {
      const thisToken = this.#context.tokenMap[getTokenIndex(swapData.token)];

      const well = this.#context.tokenMap[getTokenIndex(swapData.well)];

      if (options?.disabledThruTokens?.has(thisToken) || !well) {
        continue;
      }

      const amountOut = TV.fromBlockchain(swapData.amountOut, this.#context.mainToken.decimals);

      routes.push({
        well,
        sellToken: thisToken,
        buyToken: this.#context.mainToken,
        usdValueIn: TV.fromBlockchain(swapData.usdValue, 6),
        usdValueOut: mainTokenPrice.mul(amountOut).reDecimal(6),
        amountOut,
        minAmountOut: amountOut.subSlippage(slippage),
      });
    }

    const sortedRoutes = routes.sort((a, b) => b.amountOut.sub(a.amountOut).toNumber());
    console.debug("\n--------[Swap/WellsRouter] getBestWellBeanOut: ", sortedRoutes, "\n");
    return sortedRoutes;
  }

  /**
   * get well quote route for well2well route: NON_PINTO -> NON_PINTO
   */
  async getWell2WellRoute(
    sellToken: Token,
    buyToken: Token,
    amount: TV,
    slippage: number,
  ): Promise<ContractSwapRoute[]> {
    if (sellToken.isMain || buyToken.isMain) {
      throw new Error("[RouterRouter] Cannot multi well swap main token");
    }

    const sellTokenWell = this.#context.underlying2LP[getTokenIndex(sellToken)];
    const buyTokenWell = this.#context.underlying2LP[getTokenIndex(buyToken)];

    if (!sellTokenWell) {
      throw new Error(`Error building multi-well route. Could not find well for ${sellToken.symbol}`);
    }
    if (!buyTokenWell) {
      throw new Error(`Error building multi-well route. Could not find well for ${buyToken.symbol}`);
    }

    const pipe: AdvancedPipeCall[] = [
      encoders.well.getSwapOut(sellTokenWell, sellToken, this.#context.mainToken, amount),
      encoders.well.getSwapOut(buyTokenWell, this.#context.mainToken, buyToken, amount, Clipboard.encodeSlot(0, 0, 2)),
    ];

    const encodedResult = await readContract(this.#context.config.getClient({ chainId: this.#context.chainId }), {
      address: beanstalkAddress[this.#context.chainId],
      abi: abiSnippets.advancedPipe,
      functionName: "advancedPipe",
      args: [pipe, 0n],
    });

    const decodedResults = (encodedResult as HashString[]).map((r) => decodeGetSwapOut(r));

    const decoded = decodedResults.map((r, i, arr) => {
      const tokenSell = i === 0 ? sellToken : this.#context.mainToken;
      const tokenBuy = i === 0 ? this.#context.mainToken : buyToken;

      const sellAmount = i === 0 ? amount : TV.fromBigInt(arr[i - 1], tokenBuy.decimals);
      const tokenSellUSD = this.#priceCache.getPrice(tokenSell) ?? TV.ZERO;
      const tokenBuyUSD = this.#priceCache.getPrice(tokenBuy) ?? TV.ZERO;
      const amountOut = TV.fromBigInt(r, tokenBuy.decimals);

      return {
        well: i === 0 ? sellTokenWell : buyTokenWell,
        sellToken: tokenSell,
        buyToken: tokenBuy,
        amountOut,
        minAmountOut: amountOut.subSlippage(slippage),
        usdValueIn: sellAmount.mul(tokenSellUSD).reDecimal(6),
        usdValueOut: amountOut.mul(tokenBuyUSD).reDecimal(6),
      };
    });

    return decoded;
  }
}

export interface SwapContext {
  /**
   * The chain id of the chain the swap is being made on
   */
  chainId: number;
  /**
   * The wagmi config
   */
  config: WagmiConfig;
  /**
   * token map for looking up tokens by address
   */
  tokenMap: AddressLookup<Token>;
  /**
   * token map for looking up an LP token by it's non PINTO underlying token
   */
  underlying2LP: Record<string, Token>;
  /**
   * WETH
   */
  wrappedNative: Token;
  /**
   * ETH
   */
  native: Token;
  /**
   * PINTO
   */
  mainToken: Token;
}

export interface SwapOptions {
  /**
   * disables 0x routes
   */
  aggDisabled?: boolean;
  /**
   * If true, only use direct routes for PINTO<>NON_PINTO swaps ONLY.
   * Assumes that it will be a single hop swap.
   */
  directOnly?: boolean;
  /**
   * disables routes where these tokens are the thru token
   */
  disabledThruTokens?: Set<Token>;
  /**
   * Limit the route chosen for adding liquidity to an Well.
   * Unless sellToken is an underlying token, route to this underlying token.
   * 
   * Thus: 
   * WETH -> PINTOWSOL ==> WETH -> PINTO -> PINTOWSOL
   * PINTO -> PINTOWSOL ==> PINTO -> PINTOWSOL
   * WSOL -> PINTOWSOL ==> WSOL -> PINTOWSOL
   
   */
  lpRouteOverrides?: Map<Token, Token>;
}

export class SwapQuoter {
  priceCache: SwapPriceCache;

  wellsRouter: WellsRouter;

  context: SwapContext;

  constructor(
    public readonly chainId: number,
    public readonly config: WagmiConfig,
  ) {
    this.context = makeSwapContext(chainId, config);
    this.priceCache = new SwapPriceCache(this.context);
    this.wellsRouter = new WellsRouter(this.priceCache, this.context);
  }

  // Clear the price cache.
  clear() {
    this.priceCache.clear();
  }

  async route(
    sellToken: Token,
    buyToken: Token,
    amount: TV,
    slippage: number,
    options?: SwapOptions,
    forceRefresh: boolean = false,
  ) {
    const nodes: SwapNode[] = [];

    // Handle the case where the sell and buy tokens are the same
    if (tokensEqual(sellToken, buyToken)) {
      if (sellToken.isNative && buyToken.isNative) {
        throw new Error("[Swap Router] Cannot swap native token with itself");
      }
      // Return a quote with no swap nodes (tokens are the same)
      return this.#makeQuote(nodes, sellToken, buyToken, amount, slippage);
    }

    const sellingWETH = tokensEqual(this.context.wrappedNative, sellToken);
    const buyingWETH = tokensEqual(this.context.wrappedNative, buyToken);

    const wrappingETH = tokensEqual(this.context.native, sellToken);
    const unwrappingETH = tokensEqual(this.context.native, buyToken);

    // Update token prices
    await this.priceCache.updatePrices(forceRefresh);

    // Handle WETH to ETH swap (unwrap)
    if (sellingWETH && unwrappingETH) {
      const unwrapEthNode = new UnwrapEthSwapNode(this.context);
      unwrapEthNode.setFields({ sellAmount: amount });
      return this.#makeQuote([unwrapEthNode], sellToken, buyToken, amount, slippage);
    }

    // Handle ETH to other token swaps (wrap ETH)
    if (wrappingETH) {
      const wrapEthNode = new WrapEthSwapNode(this.context);
      wrapEthNode.setFields({ sellAmount: amount });

      // If buying WETH, return the wrap node
      if (buyingWETH) {
        return this.#makeQuote([wrapEthNode], sellToken, buyToken, amount, slippage);
      }

      // Add the wrap node to the nodes array
      nodes.push(wrapEthNode);
    }

    // Handle ERC20 token swaps
    const swapNodes = await this.#erc20OnlyQuote(sellToken, buyToken, amount, slippage, options);
    nodes.push(...swapNodes);

    // Handle swapping to ETH (unwrap)
    if (unwrappingETH) {
      // We can cast to SwapNode here because we know we will have at least 1 node in 'nodes'
      const lastSwapNode = extractLast(nodes) as SwapNode;
      const unwrapEthNode = new UnwrapEthSwapNode(this.context);

      unwrapEthNode.setFields({ sellAmount: lastSwapNode.buyAmount });

      nodes.push(unwrapEthNode);
    }

    // Return the final quote
    return this.#makeQuote(nodes, sellToken, buyToken, amount, slippage);
  }

  /**
   * Handle quote for ERC20 only swaps
   */
  async #erc20OnlyQuote(_sellToken: Token, _buyToken: Token, sellAmount: TV, slippage: number, options?: SwapOptions) {
    const sellToken = _sellToken.isNative ? this.context.wrappedNative : _sellToken;
    const buyToken = _buyToken.isNative ? this.context.wrappedNative : _buyToken;

    const {
      swap: swapFragment,
      sync: syncFragment,
      remove: removeFragment,
    } = this.#splitSwapsAndSync(sellToken, buyToken, options);

    const nodes: SwapNode[] = [];

    if (removeFragment) {
      const removeNode = await this.#handleRemoveLiquidityQuote(removeFragment, sellAmount, slippage);
      nodes.push(removeNode);
    }

    // Handle non LP swaps
    if (swapFragment) {
      const swapNodes = await this.#nonLPQuote(swapFragment, sellAmount, slippage, options);
      nodes.push(...swapNodes);
    }

    // Handle adding liquidity to a well if necessary
    if (syncFragment) {
      const syncNode = await this.#handleSyncQuote(extractLast(nodes), syncFragment, sellAmount, slippage);
      nodes.push(syncNode);
    }

    return nodes;
  }

  /**
   * Handle quote for non LP tokens
   */
  async #nonLPQuote(swapFragment: QuoteSourceFragment, sellAmount: TV, slippage: number, options?: SwapOptions) {
    const { sellToken, buyToken } = swapFragment;
    //
    const sellingMain = tokensEqual(sellToken, this.context.mainToken);
    const buyingMain = tokensEqual(buyToken, this.context.mainToken);

    if (tokensEqual(sellToken, buyToken)) {
      throw new Error("[Swap Router] Cannot swap main token with itself");
    }
    // Handle main token to non-main token swaps
    if (sellingMain) {
      return this.#handleSellMain(sellToken, buyToken, sellAmount, slippage, options);
    }

    // Handle non-main token to main token swaps
    if (!sellingMain && buyingMain) {
      return this.#handleBuyMain(sellToken, buyToken, sellAmount, slippage, options);
    }

    // Handle non-main token to non-main token swaps
    return this.#handleNonPintoSwap(sellToken, buyToken, sellAmount, slippage, options);
  }

  // -------------------------- PINTO SWAPS --------------------------

  /**
   * Handle quote for buying NON_PINTO -> PINTO
   */
  async #handleBuyMain(
    sellToken: Token,
    buyToken: Token,
    sellAmount: TV,
    slippage: number,
    options?: SwapOptions,
  ): Promise<SwapNode[]> {
    if (options?.directOnly) {
      return this.#handleDirectRoute(sellToken, buyToken, sellAmount, slippage);
    }

    // Calculate USD value of the sell amount
    const usdIn = this.priceCache.getPrice(sellToken)?.mul(sellAmount).reDecimal(6);
    if (!usdIn) {
      throw new Error("[Swap Router] Failed to get price for sell token");
    }

    // Get the best route from the wells router
    const routes = await this.wellsRouter.getBestWellBeanOutRoute(usdIn, slippage, options);

    const route = routes?.[0];

    if (!route) {
      throw new Error("[Swap Router] No route found");
    }

    const thruToken = route.sellToken;

    const directPathIsBestPath = tokensEqual(thruToken, sellToken);

    const directPath = routes.find((route) => tokensEqual(route.sellToken, sellToken));

    const directNode = directPath ? new WellSwapNode(this.context, directPath.well, sellToken, buyToken) : undefined;
    // Define the direct path node
    if (directPath && directNode) {
      directNode.setFields({
        sellAmount: sellAmount,
        buyAmount: directPath.amountOut,
        minBuyAmount: directPath.minAmountOut,
        slippage,
      });
    }

    // If the direct path is the best path, return the direct path node.
    if (directPathIsBestPath && directNode) {
      return [directNode];
    }

    // Quote the swap from the sell token to the intermediary token.
    const nonMain2NonMainNodes = await this.#handleNonPintoSwap(sellToken, thruToken, sellAmount, slippage, options);

    // Swap from the intermediary token to the main token
    const well = this.context.underlying2LP[getTokenIndex(thruToken)];
    const lastNode = extractLast(nonMain2NonMainNodes);
    if (!lastNode) {
      throw new Error(`[Swap Router] could not find path for found ${sellToken.symbol} -> ${thruToken.symbol}`);
    }

    // Get the last step's buy amount & quote the swap from the intermediary token to the main token
    const wellSwapAmountIn = lastNode.buyAmount;
    const wellSwapNode = new WellSwapNode(this.context, well, thruToken, buyToken);
    await wellSwapNode.quoteForward(wellSwapAmountIn, slippage);

    // If the direct path provides a better price, return the direct path node.
    if (directNode && wellSwapNode.buyAmount.lt(directNode.buyAmount)) {
      return [directNode];
    }

    // Otherwise, return the nodes
    return [...nonMain2NonMainNodes, wellSwapNode];
  }

  /**
   * Handle quote for selling PINTO -> NON_PINTO
   */
  async #handleSellMain(
    sellToken: Token,
    buyToken: Token,
    sellAmount: TV,
    slippage: number,
    options?: SwapOptions,
  ): Promise<SwapNode[]> {
    if (options?.directOnly) {
      return this.#handleDirectRoute(sellToken, buyToken, sellAmount, slippage);
    }

    // Get the best route from the wells router
    const routes = await this.wellsRouter.getBestWellBeanInRoute(sellAmount, slippage, options);
    const route = routes?.[0];
    const directPath = routes.find((route) => tokensEqual(route.buyToken, buyToken));

    if (!routes.length || !route?.well) {
      throw new Error("[Swap Router] Error building quote");
    }

    const thruToken = route.buyToken;
    const nodes: SwapNode[] = [];

    // Create the first swap node (main token to intermediary token)
    const firstNode = new WellSwapNode(this.context, route.well, sellToken, thruToken);
    firstNode.setFields({
      sellAmount: sellAmount,
      buyAmount: route.amountOut,
      minBuyAmount: route.minAmountOut,
      slippage,
    });
    nodes.push(firstNode);

    // If the intermediary token is the target token, return the nodes
    if (tokensEqual(thruToken, buyToken)) {
      return nodes;
    }

    // Otherwise, quote swapping from the intermediary token to the target token
    const nonDirectNodes = await this.#handleNonPintoSwap(thruToken, buyToken, firstNode.buyAmount, slippage, {
      ...options,
    });

    const lastStep = extractLast(nonDirectNodes);
    if (!lastStep && !directPath) {
      throw new Error("[Swap Router] No path found");
    }

    // If the direct route provides a better price instead of swapping through the intermediary token, return the direct route
    if (directPath && lastStep && directPath.amountOut.gt(lastStep.buyAmount)) {
      const directNode = new WellSwapNode(this.context, directPath.well, sellToken, buyToken);
      directNode.setFields({
        sellAmount: sellAmount,
        buyAmount: directPath.amountOut,
        minBuyAmount: directPath.minAmountOut,
        slippage,
      });

      return [directNode];
    }

    nodes.push(...nonDirectNodes);

    return nodes;
  }

  // -------------------------- DIRECT ROUTE --------------------------

  /**
   * Handle direct route for MAIN_TOKEN<>NON_MAIN_TOKEN
   */
  async #handleDirectRoute(sellToken: Token, buyToken: Token, sellAmount: TV, slippage: number): Promise<SwapNode[]> {
    const well = this.context.underlying2LP[getTokenIndex(buyToken.isMain ? sellToken : buyToken)];

    this.#validateWellSwap(sellToken, buyToken, well);

    const node = new WellSwapNode(this.context, well, sellToken, buyToken);
    await node.quoteForward(sellAmount, slippage);
    return [node];
  }

  // -------------------------- NON_PINTO SWAPS --------------------------

  /**
   * Handle quote for NON_PINTO tokens
   */
  async #handleNonPintoSwap(
    sellToken: Token,
    buyToken: Token,
    sellAmount: TV,
    slippage: number,
    options?: SwapOptions & {
      well2WellDisabled?: boolean;
    },
  ): Promise<SwapNode[]> {
    const [zeroXNode, well2WellQuote] = await Promise.all([
      options?.aggDisabled ? undefined : this.#handleZeroXQuote(sellToken, buyToken, sellAmount, slippage),
      options?.well2WellDisabled ? undefined : this.#handleWell2WellQuote(sellToken, buyToken, sellAmount, slippage),
    ]);

    console.debug("\n----------[SwapRouter/#handleNonPintoSwap] options: ", { zeroXNode, well2WellQuote }, "\n");

    if (zeroXNode && !!options?.well2WellDisabled) {
      return [zeroXNode];
    }

    if (well2WellQuote && !!options?.aggDisabled) {
      return well2WellQuote;
    }

    const well2WellOutput = well2WellQuote?.length ? well2WellQuote[well2WellQuote.length - 1]?.minBuyAmount : TV.ZERO;
    const zeroXOutput = zeroXNode?.buyAmount ?? TV.ZERO;
    const best = well2WellOutput.gt(zeroXOutput) ? well2WellQuote : zeroXNode;

    if (!best || (well2WellOutput.lte(0) && zeroXOutput.lte(0))) {
      throw new Error(
        `[Swap Router] Failed to quote. No output from any route. ${sellToken.symbol} -> ${buyToken.symbol}`,
      );
    }

    return Array.isArray(best) ? best : [best];
  }

  async #handleWell2WellQuote(sellToken: Token, buyToken: Token, sellAmount: TV, slippage: number) {
    const nodes: WellSwapNode[] = [];

    const quotes = await this.wellsRouter.getWell2WellRoute(sellToken, buyToken, sellAmount, slippage);

    for (const [index, quote] of quotes.entries()) {
      if (!quote.well) {
        throw new Error("[Swap Router] No well found for well2well quote");
      }
      const node = new WellSwapNode(this.context, quote.well, quote.sellToken, quote.buyToken);
      node.setFields({
        sellAmount: index === 0 ? sellAmount : quotes[index - 1].amountOut,
        buyAmount: quote.amountOut,
        minBuyAmount: quote.minAmountOut,
        slippage,
      });
      nodes.push(node);
    }

    return nodes;
  }

  async #handleZeroXQuote(sellToken: Token, buyToken: Token, sellAmount: TV, slippage: number) {
    const node = new ZeroXSwapNode(this.context, sellToken, buyToken);
    await node.quoteForward(sellAmount, slippage);
    return node;
  }

  // -------------------------- Remove Liquidity --------------------------

  /**
   * Handle quote removing liquidity from a well
   */

  async #handleRemoveLiquidityQuote(fragment: LiquidityQuoteSourceFragment, sellAmount: TV, slippage: number) {
    const node = new WellRemoveSingleSidedSwapNode(this.context, fragment.sellToken, fragment.buyToken);
    await node.quoteForward(sellAmount, slippage);
    return node;
  }

  // -------------------------- Add Liquidity --------------------------

  /**
   * Handle quote adding liquidity to a well
   */
  async #handleSyncQuote(
    prevNode: SwapNode | undefined,
    syncFragment: LiquidityQuoteSourceFragment,
    sellAmount: TV,
    slippage: number,
  ) {
    const addLiquidityIn = !prevNode ? sellAmount : prevNode.buyAmount;
    const syncNode = new WellSyncSwapNode(this.context, syncFragment.sellToken, syncFragment.buyToken);
    await syncNode.quoteForward(addLiquidityIn, slippage);
    return syncNode;
  }

  /// -------------------------- UTILITY METHODS --------------------------

  /**
   * Splits the swap into swap, add liquidity, and remove liquidity routes.
   *
   * If sell token is LP:
   *  - LP -> Underlying
   *  - LP -> Underlying -> NON_UNDERLYING (NOT SUPPORTED YET!!)
   *
   * If sell token is BEAN:
   *  - BEAN -> LP (single sided Add BEAN liquidity)
   *
   * If sell token is not BEAN:
   *  - NON_UNDERLYING -> NON_BEAN_UNDERLYING -> LP
   *  - NON_BEAN_UNDERLYING -> LP
   *
   * Examples:
   * - cbETH -> PINTOWETH ===> cbETH -> WETH -> PINTOWETH
   * - WETH -> PINTOWETH  ===> WETH  -> PINTOWETH
   * - PINTO -> PINTOWETH ===> PINTO -> PINTOWETH
   */
  #splitSwapsAndSync(sellToken: Token, buyToken: Token, options?: SwapOptions) {
    if (sellToken.isNative || buyToken.isNative) {
      throw new Error("[Swap Router] Cannot split swaps and sync native tokens");
    }

    const routes: {
      remove: LiquidityQuoteSourceFragment | undefined;
      swap: QuoteSourceFragment | undefined;
      sync: LiquidityQuoteSourceFragment | undefined;
    } = {
      remove: undefined,
      swap: undefined,
      sync: undefined,
    };

    const inputSwap: QuoteSourceFragment = {
      sellToken,
      buyToken,
    };

    // If the sell token is a LP token, then we only need the remove liquidity step
    if (sellToken.isLP) {
      this.#validateTokenIsWellUnderlying(buyToken, sellToken);

      routes.remove = {
        ...inputSwap,
        well: sellToken,
      };

      // TODO: Add support for LP -> NON_UNDERLYING

      return routes;
    }

    // if the buy token is not a LP token, then we only need the swap step
    if (!buyToken.isLP) {
      routes.swap = inputSwap;
      return routes;
    }

    const wellPairToken = this.#getWellPairToken(buyToken, this.context.mainToken);

    const overrideThru = options?.lpRouteOverrides?.get(buyToken);

    // If a route override is specified,
    if (overrideThru) {
      // Validate that the override token is an underlying token for the well
      this.#validateTokenIsWellUnderlying(overrideThru, buyToken);

      // If the sell token is the override token or equal to the underlying tokens in the well, only need the add liquidity step
      if (tokensEqual(sellToken, overrideThru) || tokensEqual(sellToken, wellPairToken) || sellToken.isMain) {
        routes.sync = {
          ...inputSwap,
          well: buyToken,
        };
        return routes;
      }

      // Otherwise, swap from the sell token to the overrideThru token
      routes.swap = {
        ...inputSwap,
        buyToken: overrideThru,
      };
      // And add liquidity to the well with the overrideThru token
      routes.sync = {
        sellToken: overrideThru,
        buyToken,
        well: buyToken,
      };
      return routes;
    }

    // if the sell token is a well underlying token, only need the add liquidity step
    if (sellToken.isMain || tokensEqual(sellToken, wellPairToken)) {
      routes.sync = { ...inputSwap, well: buyToken };
      return routes;
    }

    // At this point we know that the sell token is NOT an underlying token for the well.
    // Swap sellToken for wellPairToken
    routes.swap = {
      sellToken,
      buyToken: wellPairToken,
    };

    // Add liquidity to the well with the wellPairToken
    routes.sync = {
      sellToken: wellPairToken,
      buyToken,
      well: buyToken,
    };

    return routes;
  }

  // -------------------------- SUMMARY METHODS --------------------------

  #makeQuote(
    nodes: SwapNode[],
    sellToken: Token,
    buyToken: Token,
    sellAmount: TV,
    slippage: number,
  ): BeanSwapNodeQuote {
    const quote: BeanSwapNodeQuote = {
      usdIn: TV.ZERO,
      usdOut: TV.ZERO,
      sellToken,
      buyToken,
      sellAmount,
      buyAmount: TV.ZERO,
      minBuyAmount: TV.ZERO,
      slippage,
      nodes,
    };

    if (!nodes.length) {
      return { ...quote };
    }

    for (const node of nodes) {
      node.setUSDValues(this.priceCache);
    }

    const first = nodes?.[0];
    const last = nodes?.[nodes.length - 1];

    quote.buyAmount = last?.buyAmount ?? TV.fromHuman(0, buyToken.decimals);
    quote.minBuyAmount = last?.buyAmount ?? TV.fromHuman(0, buyToken.decimals);
    quote.usdIn = first?.usdIn ?? TV.ZERO;
    quote.usdOut = last?.usdOut ?? TV.ZERO;

    if (last && last instanceof ERC20SwapNode) {
      quote.minBuyAmount = last.minBuyAmount;
    }

    quote.nodes = [...nodes];

    return quote;
  }

  // -------------------------- HELPER METHODS --------------------------

  #getWellPairToken(well: Token, token: Token): Token {
    if (!well.isLP) {
      throw new Error(`[Swap Router/getWellPairToken] Well ${well.symbol} is not a LP token`);
    }

    const wellTokens = well.tokens;
    if (wellTokens?.length !== 2) {
      throw new Error(`[Swap Router/getWellPairToken] Well ${well.symbol} does not have exactly 2 tokens`);
    }

    const pairIndex = wellTokens.findIndex((t) => !stringEq(t, token.address));
    if (pairIndex < 0) {
      throw new Error(`[Swap Router/getWellPairToken] Token ${token.symbol} is not in well ${well.symbol}`);
    }

    const pairToken = this.context.tokenMap[getTokenIndex(wellTokens[pairIndex])];

    if (!pairToken) {
      throw new Error(`[Swap Router/getWellPairToken] Pair token ${wellTokens[pairIndex]} not found in token map`);
    }

    return pairToken;
  }

  #validateTokenIsWellUnderlying(token: Token, well: Token) {
    if (well.tokens?.length !== 2) {
      throw new Error(
        `[Swap Router/validateTokenIsWellUnderlying] Well ${well.symbol} does not have underlying tokens`,
      );
    }

    if (!stringEq(token.address, well.tokens[0]) && !stringEq(token.address, well.tokens[1])) {
      throw new Error(
        `[Swap Router/validateTokenIsWellUnderlying] Token ${token.symbol} is not an underlying token for well ${well.symbol}`,
      );
    }
  }

  #validateWellSwap(sellToken: Token, buyToken: Token, well: Token | undefined) {
    if (!sellToken.isMain && !buyToken.isMain) {
      throw new Error("Direct route cannot be used for two non-main tokens");
    }
    if (sellToken.isMain && buyToken.isMain) {
      throw new Error("Direct route cannot be used for two main tokens");
    }
    if (!well) {
      throw new Error(`Well for ${sellToken.symbol} -> ${buyToken.symbol} not found`);
    }
    if (!well.tokens) {
      throw new Error(`Well ${well.symbol} does not have underlying tokens`);
    }
    if (well.tokens?.length !== 2) {
      throw new Error("Well does not have exactly 2 tokens");
    }

    const sellKey = getTokenIndex(sellToken);
    const buyKey = getTokenIndex(buyToken);

    if (!well.tokens?.every((token) => stringEq(sellKey, token) || stringEq(buyKey, token))) {
      throw new Error(`Well ${well.symbol} does not contain both ${sellToken.symbol} and ${buyToken.symbol}`);
    }
  }
}

function makeSwapContext(_chainId: number, config: WagmiConfig): SwapContext {
  const chainId = resolveChainId(_chainId);
  const weth = tokens[chainId].find((t) => t.isWrappedNative);
  const eth = tokens[chainId].find((t) => t.isNative);
  const main = tokens[chainId].find((t) => t.isMain);

  if (!weth || !eth || !main) {
    throw new Error("[Swap Router] WETH and ETH, or MAIN tokens not found");
  }

  const underlying2LP: Record<string, Token> = {};

  const tokenMap = Object.values(tokens[chainId]).reduce((prev, curr) => {
    prev[getTokenIndex(curr)] = curr;
    return prev;
  }, {});

  for (const token of tokens[chainId]) {
    if (!token.isLP) continue;
    const underlying = token.tokens;

    if (!underlying || underlying.length !== 2) continue;

    const [underlying0, underlying1] = [tokenMap[getTokenIndex(underlying[0])], tokenMap[getTokenIndex(underlying[1])]];

    // Assumes that whitelisted well will always have a PINTO underlying
    const nonPintoUnderlying = underlying0.isMain ? underlying1 : underlying0;

    underlying2LP[getTokenIndex(nonPintoUnderlying)] = token;
  }

  return {
    chainId: _chainId,
    config,
    tokenMap,
    underlying2LP,
    wrappedNative: weth,
    native: eth,
    mainToken: main,
  };
}

function extractLast<T>(arr: T[]) {
  if (!arr.length) return undefined;
  return arr[arr.length - 1];
}
