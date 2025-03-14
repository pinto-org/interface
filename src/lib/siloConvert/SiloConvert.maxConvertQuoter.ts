import { Clipboard } from "@/classes/Clipboard";
import { TV } from "@/classes/TokenValue";
import { abiSnippets } from "@/constants/abiSnippets";
import { MAIN_TOKEN, PINTO_WSOL_TOKEN } from "@/constants/tokens";
import encoders from "@/encoders";
import decodeJunctionResult from "@/encoders/junction/decodeJunction";
import { decodeJunctionSub } from "@/encoders/junction/junctionSub";
import { decodeGetMaxAmountIn } from "@/encoders/silo/convert";
import { decodeCalcReserveAtRatioLiquidity } from "@/encoders/well/calcReserveAtRatioLiquidity";
import { decodeGetRemoveLiquidityImbalanceIn } from "@/encoders/well/getRemoveLiquidityImbalancedIn";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { SiloConvertContext } from "@/lib/siloConvert/SiloConvert";
import { SiloConvertCache } from "@/lib/siloConvert/SiloConvert.cache";
import { ExchangeWell, ExtendedRawWellData } from "@/lib/well/ExchangeWell";
import { resolveChainId } from "@/utils/chain";
import { pickCratesMultiple, sortCratesByBDVRatio } from "@/utils/convert";
import { tokensEqual } from "@/utils/token";
import { DepositData, Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { readContract } from "viem/actions";
import { DefaultConvertStrategy } from "./strategies/DefaultConvertStrategy";

interface ConvertTokens {
  source: Token;
  target: Token;
}

/**
 * Scaling down min threshold for stable swap wells.
 *
 * Due to the nature of stable swap & it's usage of the lookup table, the amounts we recieve from the contract
 * can be off by a certain amount.
 *
 * This is a temporary fix to ensure we don't run into issues with small amounts.
 */
const MIN_THRESHOLD = 150;

const SCALARS_UPDATE_INTERVAL = 15_000;

/**
 * Utility class that quotes the max convert from a source to a target.
 */
export class SiloConvertMaxConvertQuoter {
  #context: SiloConvertContext;

  #cache: SiloConvertCache;

  #scalars: Record<string, number>;

  #scalarsLastUpdateTime: number;

  static NO_MAX_CONVERT_AMOUNT = 1_000_000_000;

  // ---------- Constructor ----------

  constructor(context: SiloConvertContext, cache: SiloConvertCache) {
    this.#context = context;
    this.#cache = cache;
    this.#scalars = {};
    this.#scalarsLastUpdateTime = 0;
  }

  // ===================================================================
  // ------------------------- Public Methods --------------------------
  // ===================================================================

  /**
   * Checks if the token has a pair token that is one we disallow being swapped via the swap aggregator.
   * If true, we have no choice but to withdraw & add liquidity as single-sided BEAN.
   */
  isAggDisabledToken(token: Token) {
    const PINTOWSOL = PINTO_WSOL_TOKEN[resolveChainId(this.#context.chainId)];
    return tokensEqual(token, PINTOWSOL);
  }

  /**
   * Clears the scalars cache.
   *
   * Same thing as re-initializing this class, but provided as a method for convenience.
   */
  clear() {
    this.#scalars = {};
    this.#scalarsLastUpdateTime = 0;
  }

  /**
   * Given a source & target token, returns the max convert amount.
   * If farmerDeposits are provided, it will return a tested scaled max convert.
   */
  async quoteMaxConvert(source: Token, target: Token, farmerDeposits?: DepositData[]) {
    if (source.isMain || target.isMain) {
      return this.#getDefaultConvertMaxConvert({ source, target }, farmerDeposits);
    }

    if (source.isLP && target.isLP) {
      return this.#getMaxConvertLPToLP({ source, target });
    }

    throw new Error("Convert Router: Invalid source and target tokens");
  }

  // ===================================================================
  // ------------------------- Default Convert -------------------------
  // ===================================================================

  /**
   * Gets the max convert from the source to the target.
   * @throws Error if the source or target is not a main token.
   */
  async #getDefaultConvertMaxConvert(convertTokens: ConvertTokens, farmerDeposits?: DepositData[]): Promise<TV> {
    validateConversionTokens(convertTokens, "default");

    const { source, target } = convertTokens;
    const lpToken = source.isMain ? target : source;

    if (!source || !target || (!source.isMain && !target.isMain) || !lpToken) {
      throw new Error("Convert Router: Invalid source and target tokens");
    }

    const [rawWellData] = await Promise.all([this.#cache.getRawWellData(lpToken.address), this.#cache.update()]);

    const maxAmountIn = await readContract(this.#context.wagmiConfig.getClient({ chainId: this.#context.chainId }), {
      abi: abiSnippets.silo.getMaxAmountIn,
      address: this.#context.diamond,
      functionName: "getMaxAmountIn",
      args: [source.address, target.address],
    });

    const { scaledAmountIn, scalingReason } = this.#scaleDefaultConvertMaxAmountIn(
      convertTokens,
      TV.fromBigInt(maxAmountIn, source.decimals),
      rawWellData,
    );

    console.debug("[MaxConvertQuoter/getDefaultConvertMaxConvert]: ", {
      source: source,
      target: target,
      maxConvertResult: maxAmountIn,
      scaledAmountIn: scaledAmountIn.toHuman(),
      scalingReason,
    });

    if (farmerDeposits) {
      return this.#findSafeDefaultMaxConvert(convertTokens, scaledAmountIn, farmerDeposits);
    }

    return scaledAmountIn;
  }

  /**
   * Quotes the maximum convert from the source to the target.
   * Sometimes the maximum convert is quoted higher than what is allowed, so we find the highest scalar that doesn't revert.
   *
   * Implements a jump algorithm where it will try 100% first, scalars[0]
   * If that fails, it will iteratively:
   *    - try scalars[i + 1]
   *    - if failure, continue
   *    - try scalars[i]
   *       - if success, return scalars[i], otherwise return scalars[i+1]
   *
   * @returns The max convert that doesn't revert.
   */
  async #findSafeDefaultMaxConvert(tokens: ConvertTokens, maxConvert: TV, farmerDeposits: DepositData[]): Promise<TV> {
    validateConversionTokens(tokens, "default");

    const { source, target } = tokens;

    // Get the max amount convertible from the farmer deposits.
    const farmerAvailableAmount = farmerDeposits.reduce((prev, curr) => prev.add(curr.amount), TV.ZERO);

    if (farmerDeposits.length === 0 || farmerAvailableAmount.isZero) {
      return maxConvert;
    }

    if (farmerAvailableAmount.lt(maxConvert)) {
      console.debug("[MaxConvertQuoter/findSafeDefaultMaxConvert]: convertible amount < than max convert", {
        maxConvert: maxConvert.toHuman(),
        farmerAvailableAmount: farmerAvailableAmount.toHuman(),
      });
      return maxConvert;
    }

    const scalars = SCALE_DOWN_SCALARS;
    const existingScalar = this.#scalars[`${source.address}-${target.address}`];
    const diffMS = Date.now() - this.#scalarsLastUpdateTime;

    if (exists(existingScalar) && diffMS < SCALARS_UPDATE_INTERVAL) {
      console.debug("[MaxConvertQuoter/findSafeDefaultMaxConvert]: using existing scalar", {
        existingScalar,
        diffMS,
      });
      return maxConvert.mul(existingScalar);
    }

    const workflow = new AdvancedFarmWorkflow(this.#context.chainId, this.#context.wagmiConfig);

    // try scalar[0] 100% first.
    const res = await this.#testDefaultConvertScalar(tokens, farmerDeposits, workflow, maxConvert, scalars[0]);
    if (res) {
      this.#updateScalars(tokens, scalars[0]);
      return res;
    }

    // we start at index 2 b/c we know that 100% will fail.
    const startIndex = 1;
    const jumpAmount = 2;

    // Jump in pairs: for each odd index, try the previous one.
    // For example, try index 3. If it works, then test index 2.
    for (let i = startIndex; i < scalars.length - 1; i += jumpAmount) {
      const jIndex = i + 1;
      const jInBounds = jIndex <= scalars.length - 1;

      const jScalar = scalars[jIndex];
      const iScalar = scalars[i];

      let jMax: TV | undefined = undefined;

      // Try scalar[jIndex] if in bounds.
      if (jInBounds) {
        jMax = await this.#testDefaultConvertScalar(tokens, farmerDeposits, workflow, maxConvert, jScalar);
      }

      // If it failed, continue.
      if (!jMax && jInBounds) continue;

      // Try scalar[i]
      const iMax = await this.#testDefaultConvertScalar(tokens, farmerDeposits, workflow, maxConvert, iScalar);
      // If iMax is defined, update scalars & return iMax.
      if (iMax) {
        this.#updateScalars(tokens, iScalar);
        return iMax;
      }
      // if jMax is defined, update scalars & return jMax.
      // We check if jMax is defined b/c jMax is defined if jIndex is in bounds.
      if (jMax) {
        this.#updateScalars(tokens, jScalar);
        return jMax;
      }
    }

    // Everyting fails, throw error.
    // throw new Error("Failed to fetch max convert");
    return maxConvert;
  }

  /**
   * Tests a default convert scalar w/ the Farmer's deposits.
   *
   * @returns The scaled maxAmountIn if it doesn't revert, otherwise undefined.
   */
  async #testDefaultConvertScalar(
    { source, target }: ConvertTokens,
    farmerDeposits: DepositData[],
    workflow: AdvancedFarmWorkflow,
    maxAmountIn: TV,
    scalar: number,
  ) {
    validateConversionTokens({ source, target }, "default");

    // clear the workflow before testing.
    workflow.clear();

    let amount: TV | undefined;

    try {
      const scaledMaxAmountIn = maxAmountIn.mul(scalar);
      const crates = pickCratesMultiple(farmerDeposits, "bdv", "asc", [scaledMaxAmountIn]);
      const strategy = new DefaultConvertStrategy(source, target, this.#context);

      await strategy.quote(crates[0], workflow, 0.5);
      await workflow.simulate({ account: this.#context.account });
      amount = scaledMaxAmountIn;
    } catch (_e) {}

    console.debug(`[MaxConvertQuoter/testDefaultConvertScalar]: scalar ${scalar} ${amount ? "succeeded" : "failed"}`, {
      amount,
      maxAmountIn,
      scalar,
    });

    return amount;
  }

  /**
   * Scales down the max amount in if needed.
   * The number returned by getMaxAmountIn is too high, so we scale the result down.
   */
  #scaleDefaultConvertMaxAmountIn({ source, target }: ConvertTokens, max: TV, rawWellData: ExtendedRawWellData) {
    validateConversionTokens({ source, target }, "default");

    const lpToken = source.isMain ? target : source;
    const scalingReason: string[] = [];

    let scaledAmountIn = max;

    // Scale down the result if the well is a stable2 well & we converting from the main token.
    // This is because the maxAmountIn() returns a value that is too high.
    // Converting to the main token from a stableswap well doesn't need to be scaled down.
    if (rawWellData.wellFunctionType === "stable2" && source.isMain) {
      // We for some reason run into issues with small amounts, so just return 0 below min threshold.
      if (max.lt(MIN_THRESHOLD)) {
        return {
          scaledAmountIn: TV.fromHuman("0", source.decimals),
          scalingReason: ["stable2", "below-min-threshold"],
        };
      }

      const threshold = STABLE_SCALE_DOWN_THRESHOLDS.find((t) => max.gte(t.threshold));

      // type check
      if (!threshold) throw new Error("Convert Router: No threshold found for max convert");

      scalingReason.push("stable2");
      scaledAmountIn = max.mul(threshold.scale);
    }

    // Scale down the result if we are constrained by the overall ΔP.
    const overallDeltaB = this.#cache.getDeltaB();
    const wellDeltaB = this.#cache.getWell(lpToken.address).deltaB;

    // If we are constrained by the overall ΔP, we need to scale down the result
    const overallDeltaBConstrained = overallDeltaB.abs().lt(wellDeltaB.abs());
    if (overallDeltaBConstrained) {
      const ratio = overallDeltaB.abs().div(wellDeltaB.abs());
      const scaled = scaledAmountIn.mul(ratio);
      scaledAmountIn = scaled.mul(0.99);
      scalingReason.push("overall-ΔP-constrained");
    }

    return { scaledAmountIn, scalingReason };
  }

  // ===================================================================
  // ------------------------- LP<>LP Converts -------------------------
  // ===================================================================

  /**
   * Gets the max convert from a LP to another LP.
   *
   * @throws Error if the source or target is not a LP token.
   */
  async #getMaxConvertLPToLP({ source, target }: ConvertTokens) {
    validateConversionTokens({ source, target }, "LP2LP");

    await this.#cache.update();

    // There is only a max convert if there is a restriction on whether we can use 0x or not, because
    // We can always convert LP<>LP in equal proportions if liquidity external to wells exists.
    if (this.isAggDisabledToken(source) || this.isAggDisabledToken(target)) {
      return this.getSingleSidedMainTokenMaxConvert({ source, target });
    }

    // No additional restrictions apply as we can convert in equal proportions
    return TV.fromHuman(SiloConvertMaxConvertQuoter.NO_MAX_CONVERT_AMOUNT, source.decimals);
  }

  /**
   * Gets the max convert from a single sided pair token to another single sided pair token.
   *
   * Example: PINTOWETH -> PINTOcbETH. We quote remove single sided WETH & add single sided cbETH
   *
   * @throws Error if the source or target is not a single sided pair token.
   */
  async getSingleSidedPairTokenMaxConvert({ source, target }: ConvertTokens): Promise<TV> {
    validateConversionTokens({ source, target }, "LP2LP");

    const sourceWell = this.#cache.getWell(source.address);
    const targetWell = this.#cache.getWell(target.address);

    // Find the Well with the smaller absolute value of deltaP.
    // The amount we can convert single sided is limited by this well.
    const restrictiveWell = sourceWell.deltaB.abs().gt(targetWell.deltaB.abs()) ? targetWell : sourceWell;
    const sourceIsRestrictive = restrictiveWell === sourceWell;

    // obtain the ideal well reserve ratios for the restrictive well
    const ratios = ExchangeWell.getRatiosJ(restrictiveWell.tokens, restrictiveWell.prices);

    // Get the raw well data for the restrictive well.
    const rawWellData = await this.#cache.getRawWellData(restrictiveWell.pool.address);

    const pipe = new AdvancedPipeWorkflow(this.#context.chainId, this.#context.wagmiConfig);

    // 1. Calculate the reserves at the ideal ratios.
    pipe.add(
      encoders.well.calcReserveAtRatioLiquidity(
        rawWellData.wellFunction.target,
        restrictiveWell.balances,
        1,
        ratios,
        rawWellData.wellFunction.data,
      ),
    );
    // 2. Subtract the reserves at the ideal ratios from the current reserves to get the amount of single sided liquidity we can remove.
    pipe.add(
      encoders.junction.sub(
        restrictiveWell.balances[1].toBigInt(),
        restrictiveWell.balances[1].toBigInt(),
        Clipboard.encodeSlot(0, 0, sourceIsRestrictive ? 1 : 0),
      ),
    );

    // 3.a. If the source well is the restrictive well,
    if (sourceIsRestrictive) {
      // get the amount of LP tokens we can remove based on the imbalance in the source well from step 2.
      pipe.add(
        encoders.well.getRemoveLiquidityImbalancedIn(
          restrictiveWell.pool.address,
          [0n, 0n],
          Clipboard.encodeSlot(1, 0, 3),
        ),
      );
    }
    // 3b. If the target well is the restrictive Well
    else {
      // get the amount of LP tokens we will receive for adding the single sided liquidity from step 2.
      // scale up to to 18 decimals for max precision
      pipe.add(
        encoders.junction.mul(0n, BigInt(10 ** (18 - targetWell.pair.token.decimals)), Clipboard.encodeSlot(1, 0, 0)),
      );
      // 4. (targetPairTokenAmount * targetPairTokenUSD) / sourcePairTokenUSD
      // scale all numbers to 18 decimals for max precision
      pipe.add(
        encoders.junction.mulDiv(
          0n,
          targetWell.pair.price.reDecimal(18).toBigInt(),
          sourceWell.pair.price.reDecimal(18).toBigInt(),
          Clipboard.encodeSlot(2, 0, 0),
        ),
      );
      // 5. scale down to the source well pair token decimals
      pipe.add(
        encoders.junction.div(0n, BigInt(10 ** (18 - sourceWell.pair.token.decimals)), Clipboard.encodeSlot(3, 0, 0)),
      );
      // 6. calculate the equivalent amount of the source well pair token we will be removing in LP token terms.
      pipe.add(
        encoders.well.getRemoveLiquidityImbalancedIn(sourceWell.pool.address, [0n, 0n], Clipboard.encodeSlot(4, 0, 3)),
      );
    }

    const result = await pipe.readStatic();

    if (!result.length) {
      throw new Error("Failed to fetch max convert");
    }

    return this.#decodeSingleSidedPairAdvPipeResult({ source, target }, sourceIsRestrictive, result);
  }

  /**
   * Gets the max convert LP<>LP via a single-sided LP remove / add liquidity strategy.
   *
   * @returns MaxConvertSummary
   */
  async getSingleSidedMainTokenMaxConvert({ source, target }: ConvertTokens): Promise<TV> {
    validateConversionTokens({ source, target }, "LP2LP");

    const mainToken = MAIN_TOKEN[resolveChainId(this.#context.chainId)];

    const pipe = new AdvancedPipeWorkflow(this.#context.chainId, this.#context.wagmiConfig);

    // 1. max convertible Source LP -> BEAN
    pipe.add({
      ...encoders.silo.getMaxAmountIn(source.address, mainToken.address),
      target: this.#context.diamond,
    });

    // 2.max convertible BEAN -> Target LP
    pipe.add({
      ...encoders.silo.getMaxAmountIn(mainToken.address, target.address),
      target: this.#context.diamond,
    });

    // 3. max convertible Source LP -> BEAN from step 2.
    // The amount we can max targetLP convert in terms of the source LP token
    pipe.add({
      ...encoders.well.getRemoveLiquidityImbalancedIn(source.address, [0n, 0n], Clipboard.encodeSlot(1, 0, 2)),
      target: source.address,
    });

    const rawResult = await pipe.readStatic();

    const maxSource2Main = TV.fromBigInt(decodeGetMaxAmountIn(rawResult[0]), source.decimals);
    const maxMain2Target = TV.fromBigInt(decodeGetMaxAmountIn(rawResult[1]), mainToken.decimals);
    const maxSource2MainFromTarget = TV.fromBigInt(decodeGetRemoveLiquidityImbalanceIn(rawResult[2]), source.decimals);

    const maxSourceLPIn = TV.min(maxSource2Main, maxSource2MainFromTarget);

    console.debug("[Convert/getSingleSidedMainTokenMaxConvert]: ", {
      maxSource2Main,
      maxMain2Target,
      maxSource2MainFromTarget,
      max: maxSourceLPIn,
    });

    return maxSourceLPIn;
  }

  // ===================================================================
  // ------------------------- Utility methods -------------------------
  // ===================================================================

  #decodeSingleSidedPairAdvPipeResult(
    { source, target }: ConvertTokens,
    sourceIsRestrictive: boolean,
    result: HashString[],
  ) {
    if (result.length !== 3 && result.length !== 6) {
      throw new Error("Convert Router: Invalid result length");
    }

    // index 0
    const calcReserveAtRatioLiquidity = decodeCalcReserveAtRatioLiquidity(result[0]);
    // index 1
    const deltaReserves = decodeJunctionSub(result[1]);
    // index 2 | 5
    const maxSourceLP = TV.fromBigInt(decodeGetRemoveLiquidityImbalanceIn(result[result.length - 1]), source.decimals);

    let debugData: any = {
      source,
      target,
      sourceIsRestrictive,
      "1deltaReserves": deltaReserves,
    };

    if (sourceIsRestrictive) {
      debugData = {
        ...debugData,
        "2maxSourceLP": maxSourceLP.toBigInt(),
        "00currReserves": [
          this.#cache.getWell(source.address).balances[0].toBigInt(),
          this.#cache.getWell(source.address).balances[1].toBigInt(),
        ],
        "0idealLPReserves": [this.#cache.getWell(source.address).balances[0].toBigInt(), calcReserveAtRatioLiquidity],
      };
    } else {
      debugData = {
        ...debugData,
        "00currReserves": [
          this.#cache.getWell(target.address).balances[0].toBigInt(),
          this.#cache.getWell(target.address).balances[1].toBigInt(),
        ],
        "0idealLPReserves": [this.#cache.getWell(target.address).balances[0].toBigInt(), calcReserveAtRatioLiquidity],
        "3reserveDiffScaledUp": decodeJunctionResult("mul", result[2]),
        "4sourcePairTokenAmountScaled": decodeJunctionResult("mulDiv", result[3]),
        "5sourcePairTokenAmount": decodeJunctionResult("div", result[4]),
        "6maxSourceLP": maxSourceLP.toBigInt(),
      };
    }

    console.debug("[Convert/decodeSingleSidedPairAdvPipeResult]: ", debugData);

    return maxSourceLP;
  }

  #updateScalars({ source, target }: ConvertTokens, scalar: number) {
    const scalarKey = `${source.address}-${target.address}`;
    const prevScalar = this.#scalars[scalarKey];

    this.#scalars[scalarKey] = scalar;
    this.#scalarsLastUpdateTime = Date.now();

    console.debug("[MaxConvertQuoter/updateScalars]: scalars updated", {
      source,
      target,
      scalar,
      prevScalar,
      scalars: this.#scalars,
      scalarsLastUpdateTime: this.#scalarsLastUpdateTime,
    });
  }
}

// Helper Methods

const baseErrMessage = `[MaxConvertQuoter/validation]: Invalid source or target.`;

const validateConversionTokens = (tokens: ConvertTokens, expectedType: "LP2LP" | "default") => {
  const { source, target } = tokens;

  if ((source.isMain || target.isMain) && expectedType === "LP2LP") {
    throw new Error(
      `${baseErrMessage} Expected both to be Wells but got source: ${source.address} and target: ${target.address}`,
    );
  }

  if (source.isLP && target.isLP && expectedType === "default") {
    throw new Error(
      `${baseErrMessage} Expected only 1 Well, but got source: ${source.address} and target: ${target.address}`,
    );
  }

  if (source.isMain && target.isMain) {
    throw new Error(
      `${baseErrMessage} Expected only 1 Main token but got source: ${source.address} and target: ${target.address}`,
    );
  }
};

// total of 15 scalars
const SCALE_DOWN_SCALARS: number[] = [
  1, // 100%
  0.99999, // 99.999%
  0.9999, // 99.99%
  0.99975, // 99.975%
  0.9995, // 99.95%
  0.99925, // 99.925%
  0.999, // 99.90%
  0.9975, // 99.75%
  0.995, // 99.5%
  0.99, // 99%
  0.95, // 95%
  0.9, // 90%
  0.75, // 75%
  0.5, // 50%
  0.25, // 25%
  0.1, // 10%
] as const;

/**
 * Lookup table for scaling down the max amount in for stable swap wells.
 *
 * @note These scalars are approximate as they were found experimentally & may need greater precision.
 */
const STABLE_SCALE_DOWN_THRESHOLDS: { threshold: number; scale: number }[] = [
  { threshold: 100_000, scale: 0.999 },
  { threshold: 75_000, scale: 0.998 },
  { threshold: 50_000, scale: 0.997 },
  { threshold: 25_000, scale: 0.996 },
  { threshold: 10_000, scale: 0.995 },
  { threshold: 5_000, scale: 0.99 },
  { threshold: 2_500, scale: 0.97 },
  { threshold: 1_750, scale: 0.95 },
  { threshold: 1_000, scale: 0.925 },
  { threshold: 750, scale: 0.9 },
  { threshold: 500, scale: 0.875 },
  { threshold: 250, scale: 0.7 },
  { threshold: MIN_THRESHOLD, scale: 0.5 },
] as const;
