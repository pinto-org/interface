import { TokenValue } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { PINTOWSOL } from "@/constants/tokens";
import { PoolData } from "@/state/usePriceData";
import { DepositData } from "@/utils/types";
import { HashString, Prettify } from "@/utils/types.generic";
import { Config } from "@wagmi/core";
import { Address, decodeFunctionResult } from "viem";
import { tokensEqual } from "./../../utils/token";
import { PipelineConvertStrategy, PipelineConvertStrategyQuoteResult } from "./strategies/PipelineConvertStrategy";
import { Lp2LPEqual2EqualPipelineConvertStrategy } from "./strategies/strategy.lp2lpEqual2Equal";
import { LP2LPOneSidedSameTokenPipelineConvertStrategy } from "./strategies/strategy.lp2lpOneSidedSameToken";

const { pipelineConvert: pipelineConvertABI } = abiSnippets;

/**
 * The result of a pipeline convert quote.
 */
export type PipelineConvertQuote = Prettify<
  PipelineConvertStrategyQuoteResult & {
    encoded: readonly {
      callData: `0x${string}`;
      clipboard: `0x${string}`;
    }[];
  }
>;

/**
 * The result of a pipeline convert from on-chain.
 */
export type PipelineConvertDepositResult<T = TokenValue> = {
  /**
   * The updated stem of the Silo token we are converting to.
   */
  toStem: T;
  /**
   * The amount of the source Silo token we are converting from.
   */
  fromAmount: T;
  /**
   * The amount of the target Silo token we are converting to.
   */
  toAmount: T;
  /**
   * bdv of the source Silo token we are attempting to convert from.
   */
  fromBdv: T;
  /**
   * bdv of the target Silo token after the convert.
   */
  toBdv: T;
};

/**
 * Utility class for constructing pipeline converts
 */
export class PipelineConvert {
  /**
   * The address of the pinto diamond
   */
  readonly diamondAddress: Address;
  /**
   * The well to convert from
   */
  readonly sourceWell: PoolData;
  /**
   * The well to convert to
   */
  readonly targetWell: PoolData;
  /**
   * The wagmi config
   */
  readonly config: Config;

  /**
   * The strategy to use for the pipeline convert.
   */
  strategy: PipelineConvertStrategy | undefined;

  constructor(_diamondAddress: Address, _sourceWell: PoolData, _targetWell: PoolData, _config: Config) {
    this.diamondAddress = _diamondAddress;
    this.sourceWell = _sourceWell;
    this.targetWell = _targetWell;
    this.config = _config;
  }

  /**
   * Estimates the result of a pipeline convert
   * @param sourceWell Well to remove liquidity from
   * @param targetWell Well to add liquidity to
   * @param siloTokenBalance Silo token balance of the user
   * @param amountIn Amount of sourceWell.lpToken to remove
   * @param slippage Slippage tolerance for swap
   */
  async quote(
    deposits: DepositData[],
    amountIn: TokenValue,
    swapSlippage: number,
    addLiquiditySlippage: number,
  ): Promise<PipelineConvertQuote> {
    await this.determineStrategy();
    this.validateStrategy();

    const quote = await this.strategy.quote(deposits, amountIn, swapSlippage, addLiquiditySlippage);

    const encoded = this.strategy.encodeConvertResults(quote.results);

    return {
      ...quote,
      encoded,
    };
  }

  /**
   * Determines the strategy to use for the pipeline convert.
   *
   * TODO: Add other strategies here. Eventually this should be dynamic based on the deltaBs/reserves/convertCapacities of the wells.
   */
  async determineStrategy() {
    // B/c there is no WSOL liquidity other than Basin, we only support the single-sided Pinto liquidity strategy for now for this well.
    if (tokensEqual(this.sourceWell.pool, PINTOWSOL) || tokensEqual(this.targetWell.pool, PINTOWSOL)) {
      return new LP2LPOneSidedSameTokenPipelineConvertStrategy(
        "main",
        "main",
        this.sourceWell,
        this.targetWell,
        this.config,
      );
    }

    return new Lp2LPEqual2EqualPipelineConvertStrategy(this.sourceWell, this.targetWell, this.config);
  }

  /// ------------------------------ Static Methods ------------------------------ ///

  /**
   * Decodes the static results returned from either a successful pipeline convert txn or simulation.
   * @param results - The results to decode.
   */
  static decodeStaticResults(results: string[]): PipelineConvertDepositResult<bigint>[] {
    try {
      const data = results.map((result) => {
        const decoded = decodeFunctionResult<typeof pipelineConvertABI>({
          abi: pipelineConvertABI,
          data: result as HashString,
          functionName: "pipelineConvert",
        });
        return {
          toStem: decoded[0],
          fromAmount: decoded[1],
          toAmount: decoded[2],
          fromBdv: decoded[3],
          toBdv: decoded[4],
        };
      });

      return data;
    } catch (e) {
      console.error("[PipelineConvert/decodeStaticResult] FAILED: ", e);
      throw e;
    }
  }

  /**
   * Returns an empty pipeline convert quote.
   */
  static getEmptyResult(): PipelineConvertQuote {
    return {
      pickedCrates: {
        totalAmount: TokenValue.ZERO,
        totalBDV: TokenValue.ZERO,
        totalStalk: TokenValue.ZERO,
        totalSeeds: TokenValue.ZERO,
        crates: [],
      },
      encoded: [],
      results: [],
      totalAmountOut: TokenValue.ZERO,
      details: {
        removeLiquidity: {
          amountsOut: [],
          summedAmounts: [TokenValue.ZERO, TokenValue.ZERO],
        },
        addLiquidity: {
          amountsOut: [],
          summedAmounts: TokenValue.ZERO,
        },
      },
    };
  }

  /// ------------------------------ Private Methods ------------------------------ ///

  /**
   * Validates that the strategy is set.
   */
  private validateStrategy(): asserts this is { strategy: NonNullable<{ strategy: PipelineConvertStrategy }> } {
    if (this.strategy) return;
    throw new Error("Expected PipelineConvertStrategy to be determined but got undefined");
  }
}
