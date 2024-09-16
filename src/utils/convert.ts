import { encodeAbiParameters } from "viem";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "./types";
import { MAIN_TOKENS } from "@/constants/tokens";

export enum ConvertKind {
  BEANS_TO_CURVE_LP = 0,
  CURVE_LP_TO_BEANS = 1,
  UNRIPE_BEANS_TO_LP = 2,
  UNRIPE_LP_TO_BEANS = 3,
  LAMBDA_LAMBDA = 4,
  BEANS_TO_WELL_LP = 5,
  WELL_LP_TO_BEANS = 6,
  UNRIPE_TO_RIPE = 7
};

/**
 * Order crates by Stem.
 */
export function sortCratesByStem(crates, direction: "asc" | "desc" = "desc") {
  const m = direction === "asc" ? -1 : 1;
  return [...crates].sort((a, b) => m * b.stem.sub(a.stem));
}

/**
 * Order crates by BDV.
 */
export function sortCratesByBDVRatio(crates, direction: "asc" | "desc" = "asc") {
  const m = direction === "asc" ? -1 : 1;
  return [...crates].sort((a, b) => {
    const _a: TokenValue = a.depositBdv.div(a.amount);
    const _b: TokenValue = b.depositBdv.div(b.amount);
    return Number.parseFloat(_b.sub(_a).mul(m).toHuman());
  });
}

/**
 * Selects the number of crates needed to add up to the desired `amount`.
 */
export function pickCrates(deposits, amount: TokenValue) {
  let totalAmount = TokenValue.ZERO;
  let totalBDV = TokenValue.ZERO;
  let totalStalk = TokenValue.ZERO;
  let totalSeeds = TokenValue.ZERO;

  const BEAN = MAIN_TOKENS[0];
  const cratesToWithdrawFrom = [];

  deposits.some((deposit) => {
    const amountToRemoveFromCrate = totalAmount.add(deposit.amount).lte(amount)
      ? deposit.amount
      : amount.sub(totalAmount);
    const cratePct = amountToRemoveFromCrate.div(deposit.amount);
    const crateBDV = cratePct.mul(deposit.depositBdv).reDecimal(BEAN.decimals);
    const crateSeeds = cratePct.mul(deposit.seeds).reDecimal(SEEDS.decimals);

    const baseStalk = cratePct.mul(deposit.stalk.base).reDecimal(STALK.decimals);
    const grownStalk = cratePct.mul(deposit.stalk.grown).reDecimal(STALK.decimals);
    const crateStalk = cratePct.mul(deposit.stalk.total).reDecimal(STALK.decimals);

    totalAmount = totalAmount.add(amountToRemoveFromCrate);
    totalBDV = totalBDV.add(crateBDV);
    totalStalk = totalStalk.add(crateStalk);
    totalSeeds = totalSeeds.add(crateSeeds);

    cratesToWithdrawFrom.push({
      stem: deposit.stem,
      amount: amountToRemoveFromCrate,
      bdv: crateBDV,
      stalk: {
        total: crateStalk,
        base: baseStalk,
        grown: grownStalk,
      },
      seeds: crateSeeds,
      isGerminating: deposit.isGerminating,
    });

    return totalAmount.eq(amount);
  });

  if (totalAmount.lt(amount)) {
    throw new Error("Not enough deposits");
  }

  return {
    totalAmount,
    totalBDV,
    totalStalk,
    totalSeeds,
    crates: cratesToWithdrawFrom,
  };
}

export function sortAndPickCrates(
  mode: "convert" | "transfer" | "withdraw",
  fromAmount: TokenValue,
  deposits,
  toToken?: Token,
) {
  if (deposits.length === 0) throw new Error("No crates to pick and sort.");
  let sortedCrates;

  if (mode === "convert") {
    if (!toToken) throw new Error("No toToken specified.");
    sortedCrates = toToken.isLP
      ? /// BEAN -> LP: oldest crates are best. Grown stalk is equivalent
        /// on both sides of the convert, but having more seeds in older crates
        /// allows you to accrue stalk faster after convert.
        /// Note that during this convert, BDV is approx. equal after the convert.
        sortCratesByStem(deposits, "asc")
      : /// LP -> BEAN: use the crates with the lowest [BDV/Amount] ratio first.
        /// Since LP deposits can have varying BDV, the best option for the Farmer
        /// is to increase the BDV of their existing lowest-BDV crates.
        sortCratesByBDVRatio(deposits, "asc");
  } else if (mode === "transfer" || mode === "withdraw") {
    sortedCrates = sortCratesByStem(deposits, "desc");
  }

  const pickedCrates = pickCrates(sortedCrates, fromAmount);

  return {
    amount: pickedCrates.totalAmount,
    bdv: pickedCrates.totalBDV,
    stalk: pickedCrates.totalStalk,
    seeds: pickedCrates.totalSeeds,
    actions: [],
    crates: pickedCrates.crates,
  };
}

export function calculateConvertData(fromToken: Token, toToken: Token, amountIn: TokenValue, minAmountOut: TokenValue) {

  if (!fromToken.isLP && toToken.isLP) {
    const encoded = encodeAbiParameters(
      [ 
        { type: "uint256", name: "convertKind"},
        { type: "uint256", name: "amountBeans" },
        { type: "uint256", name: "minLP" },
        { type: "address", name: "pool"}
      ],
      [
        BigInt(ConvertKind.BEANS_TO_WELL_LP),
        amountIn.toBigInt(),
        minAmountOut.toBigInt(),
        toToken.address
      ]
    );
    return encoded;
  } else if (fromToken.isLP && !toToken.isLP) {
    const encoded = encodeAbiParameters(
      [ 
        { type: "uint256", name: "convertKind"},
        { type: "uint256", name: "amountLP" },
        { type: "uint256", name: "minBeans" },
        { type: "address", name: "pool"}
      ],
      [
        BigInt(ConvertKind.WELL_LP_TO_BEANS),
        amountIn.toBigInt(),
        minAmountOut.toBigInt(),
        fromToken.address
      ]
    );
    return encoded;
  } else {
    console.error("CONVERT: Unknown conversion pathway");
  }
}