import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { PIPELINE_ADDRESS } from "@/constants/address";
import encoders from "@/encoders";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { ExtendedPoolData } from "@/lib/siloConvert/SiloConvert.cache";
import { ConvertQuoteSummary, ConvertStrategyQuote, PipelineConvertStrategy } from "@/lib/siloConvert/strategies/core";
import { SiloConvertContext } from "@/lib/siloConvert/types";
import { ExtendedPickedCratesDetails } from "@/utils/convert";
import { AdvancedFarmCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { exists, throwIfAborted } from "@/utils/utils";
import { decodeFunctionResult, encodeFunctionData } from "viem";

/**
 * Strategy for converting from Main Token (PINTO) -> LP Token while depositing pair token from wallet
 *
 * Uses PipelineConvert to convert from Main Token -> LP Token
 *
 * Strategy:
 *  -> take PINTO from silo deposits
 *  -> transfer pair token (e.g., USDC) from external wallet to pipeline
 *  -> add liquidity in equal proportions
 *  -> deposit LP token back to silo
 */

class Main2LPDepositPairStrategy extends PipelineConvertStrategy<"Main2LPDeposit"> {
  readonly name = "Main2LPDeposit_Pipeline";

  readonly targetWell: ExtendedPoolData;
  readonly secondaryAmount: TV;
  readonly fromMode: FarmFromMode;

  constructor(
    source: Token,
    targetWell: ExtendedPoolData,
    context: SiloConvertContext,
    wellUnderlyingPairTokenAmount: TV,
    fromMode: FarmFromMode,
  ) {
    super(source, targetWell.pool, context);

    if (!exists(fromMode)) {
      throw new Error("[Main2LPDepositPairStrategy] Farm from mode is required");
    }

    this.initErrorHandlerCtx();

    this.errorHandler.validateConversionTokens("Main2LP", source, targetWell.pool);
    this.errorHandler.validateAmount(wellUnderlyingPairTokenAmount, "secondary amount");
    this.targetWell = targetWell;
    this.secondaryAmount = wellUnderlyingPairTokenAmount;
    this.fromMode = fromMode;
  }

  get targetIndexes() {
    const pairIndex = this.targetWell.pair.index;
    return {
      pair: pairIndex,
      main: pairIndex === 1 ? 0 : 1,
    };
  }

  private get pairToken() {
    return this.targetWell.tokens[this.targetIndexes.pair];
  }

  private get mainToken() {
    return this.targetWell.tokens[this.targetIndexes.main];
  }

  async quote(
    deposits: ExtendedPickedCratesDetails,
    advancedFarm: AdvancedFarmWorkflow,
    slippage: number,
    signal?: AbortSignal,
  ): Promise<ConvertStrategyQuote<"Main2LPDeposit">> {
    // Check if already aborted
    throwIfAborted(signal);

    // Validation
    this.validateQuoteArgs(deposits, slippage);

    const mainAmount = deposits.totalAmount;
    const pairAmount = this.secondaryAmount;

    // Check if aborted after calculation
    throwIfAborted(signal);

    // Get add liquidity output
    const amountsIn = [TV.ZERO, TV.ZERO];
    amountsIn[this.targetIndexes.main] = mainAmount;
    amountsIn[this.targetIndexes.pair] = pairAmount;

    const lpAmountOut = await this.getAddLiquidityOut(amountsIn, advancedFarm);

    // Check if aborted after async operation
    throwIfAborted(signal);

    const summary: ConvertQuoteSummary<"Main2LPDeposit"> = {
      source: {
        token: this.sourceToken,
        amountIn: mainAmount,
        pairToken: this.pairToken,
        pairAmountIn: pairAmount,
      },
      target: {
        token: this.targetToken,
        amountOut: lpAmountOut.subSlippage(slippage),
      },
    };

    // build advanced pipe calls
    const advPipeCalls = this.errorHandler.wrap(
      () => this.buildAdvancedPipeCalls(summary),
      "build advanced pipe calls",
      {
        targetWell: this.targetWell.pool.symbol,
        sourceToken: this.sourceToken.symbol,
        pairToken: this.pairToken.symbol,
        pairAmount: pairAmount.toHuman(),
        fromMode: this.fromMode,
      },
    );

    return {
      pickedCrates: deposits,
      summary,
      advPipeCalls,
      amountOut: lpAmountOut,
      convertData: undefined,
      needsRebuild: false,
    };
  }

  /**
   * Gets the LP amount out for adding liquidity with given amounts
   */
  private async getAddLiquidityOut(amountsIn: TV[], advFarm: AdvancedFarmWorkflow): Promise<TV> {
    // Validation
    this.errorHandler.assert(amountsIn.length === 2, "Add liquidity amounts array must have 2 elements", {
      amountsInLength: amountsIn.length,
    });
    amountsIn.forEach((amount, index) => {
      this.errorHandler.validateAmount(amount, `add liquidity amount[${index}]`, { index });
    });

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    const callData = this.errorHandler.wrap(
      () =>
        encodeFunctionData({
          abi: abiSnippets.wells.getAddLiquidityOut,
          functionName: "getAddLiquidityOut",
          args: [amountsIn.map((v) => BigInt(v.blockchainString))],
        }),
      "encode add liquidity call data",
      { amountsIn: amountsIn.map((v) => v.toHuman()) },
    );

    pipe.add({
      target: this.targetWell.pool.address,
      callData,
      clipboard: Clipboard.encode([]),
    });

    const simulate = await this.errorHandler.wrapAsync(
      () =>
        advFarm.simulate({
          after: pipe,
          account: this.context.account,
        }),
      "add liquidity simulation",
      { amountsIn: amountsIn.map((v) => v.toHuman()), account: this.context.account },
    );

    // Validate simulation results
    this.errorHandler.validateSimulation(simulate, "add liquidity simulation");

    const decoded = this.errorHandler.wrap(
      () => AdvancedPipeWorkflow.decodeResult(simulate.result[simulate.result.length - 1]),
      "decode advanced pipe result for add liquidity",
      { resultLength: simulate.result.length },
    );

    this.errorHandler.assert(decoded.length > 0, "Decoded advanced pipe result is empty for add liquidity", {
      decodedLength: decoded.length,
    });

    const addLiquidityResult = this.errorHandler.wrap(
      () =>
        decodeFunctionResult({
          abi: abiSnippets.wells.getAddLiquidityOut,
          functionName: "getAddLiquidityOut",
          data: decoded[decoded.length - 1],
        }),
      "decode add liquidity result",
      { decodedLength: decoded.length },
    );

    const amountOut = this.errorHandler.wrap(
      () => TV.fromBlockchain(addLiquidityResult, this.targetWell.pool.decimals),
      "convert add liquidity amount out",
      { decodedAmountOut: addLiquidityResult.toString(), decimals: this.targetWell.pool.decimals },
    );

    console.debug("[Main2LPDepositPairStrategy] getAddLiquidityOut: ", {
      well: this.targetWell.pool.name,
      amountsIn,
      amountOut,
    });

    return amountOut;
  }

  /**
   * Builds the advanced pipe calls for the convert.
   *
   * For the Main2LPDeposit strategy, the advanced pipe calls are:
   * 1. Get external balance of pair token (for validation/clipboard)
   * 2. Approve pair token for diamond to spend
   * 3. Transfer pair token from external wallet to pipeline
   * 4. Transfer main token (PINTO) from silo to pipeline (handled by pipelineConvert)
   * 5. Transfer both tokens to well address
   * 6. Call wellSync to add liquidity in equal proportions
   * 7. LP token is automatically deposited to silo via pipelineConvert
   *
   * @param summary - The summary of the convert.
   */
  buildAdvancedPipeCalls({ source, target }: ConvertStrategyQuote<"Main2LPDeposit">["summary"]): AdvancedPipeWorkflow {
    // Validation
    this.errorHandler.validateAmount(source.amountIn, "source amount in");
    this.errorHandler.validateAmount(target.amountOut, "target amount out");
    this.errorHandler.validateAmount(this.secondaryAmount, "secondary amount");

    const pipe = new AdvancedPipeWorkflow(this.context.chainId, this.context.wagmiConfig);

    // 0. Transfer the underlying pair token to the well
    pipe.add(
      Main2LPDepositPairStrategy.snippets.erc20Transfer(
        this.pairToken,
        this.targetWell.pool.address,
        this.secondaryAmount,
      ),
    );
    // 1. Transfer the main token to the well
    pipe.add(
      Main2LPDepositPairStrategy.snippets.erc20Transfer(this.mainToken, this.targetWell.pool.address, source.amountIn),
    );

    // 2. Call wellSync to add liquidity in equal proportions
    pipe.add(
      Main2LPDepositPairStrategy.snippets.wellSync(
        this.targetWell,
        PIPELINE_ADDRESS, // recipient (pipeline, which will then deposit to silo via pipelineConvert)
        target.amountOut, // min LP amount out (already has slippage applied in summary)
      ),
    );

    return pipe;
  }

  override encodeFromQuote(quote: ConvertStrategyQuote<"Main2LPDeposit">) {
    const stems: bigint[] = [];
    const amounts: bigint[] = [];

    quote.pickedCrates.crates.forEach((crate) => {
      stems.push(crate.stem.toBigInt());
      amounts.push(crate.amount.toBigInt());
    });

    if (!quote.advPipeCalls) {
      throw new Error("No advanced pipe calls provided");
    }

    const args = {
      stems,
      amounts,
      advPipeCalls: quote.advPipeCalls?.getSteps() ?? [],
    };

    const transfer = Main2LPDepositPairStrategy.snippets.diamondTransferToken(
      this.pairToken,
      PIPELINE_ADDRESS,
      this.secondaryAmount,
      this.fromMode,
      FarmToMode.EXTERNAL, // to pipeline (external)
      this.context.diamond,
      Clipboard.encode([]),
    );

    const calls: AdvancedFarmCall[] = [transfer, encoders.silo.pipelineConvert(this.mainToken, this.targetToken, args)];

    return {
      calls,
      decodeIndex: 1,
    };
  }

  override getApprovalTokens() {
    return this.pairToken;
  }
}

export { Main2LPDepositPairStrategy as SiloConvertMain2LPDepositPairStrategy };
