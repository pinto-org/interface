import { encodeAbiParameters } from "viem";
import { SEEDS, STALK, BEAN } from "@/constants/internalTokens";
import { TokenValue } from "@/classes/TokenValue";
import { DepositCrateData, DepositData, Token } from "./types";

export enum ConvertKind {
  LAMBDA_LAMBDA = 0,
  BEANS_TO_WELL_LP = 1,
  WELL_LP_TO_BEANS = 2,
  ANTI_LAMBDA_LAMBDA = 3
}

/**
 * Order crates by Stem.
 */
export function sortCratesByStem(crates: DepositData[], direction: "asc" | "desc" = "desc") {
  const m = direction === "asc" ? -1 : 1;
  return [...crates].sort((a, b) => Number.parseFloat(b.stem.sub(a.stem).mul(m).toHuman()));
}

/**
 * Order crates by BDV.
 */
export function sortCratesByBDVRatio(crates: DepositData[], direction: "asc" | "desc" = "asc") {
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
export function pickCrates(deposits: DepositData[], amount: TokenValue) {
  let totalAmount = TokenValue.ZERO;
  let totalBDV = TokenValue.ZERO;
  let totalStalk = TokenValue.ZERO;
  let totalSeeds = TokenValue.ZERO;

  const cratesToWithdrawFrom: DepositCrateData[] = [];

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
  deposits: DepositData[],
  toToken?: Token,
) {
  if (deposits.length === 0) throw new Error("No crates to pick and sort.");
  let sortedCrates: DepositData[];

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
  } else {
    throw new Error("sort and pick crates: Unknown mode.");
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
        { type: "uint256", name: "convertKind" },
        { type: "uint256", name: "amountBeans" },
        { type: "uint256", name: "minLP" },
        { type: "address", name: "pool" },
      ],
      [BigInt(ConvertKind.BEANS_TO_WELL_LP), amountIn.toBigInt(), minAmountOut.toBigInt(), toToken.address],
    );
    return encoded;
  } else if (fromToken.isLP && !toToken.isLP) {
    const encoded = encodeAbiParameters(
      [
        { type: "uint256", name: "convertKind" },
        { type: "uint256", name: "amountLP" },
        { type: "uint256", name: "minBeans" },
        { type: "address", name: "pool" },
      ],
      [BigInt(ConvertKind.WELL_LP_TO_BEANS), amountIn.toBigInt(), minAmountOut.toBigInt(), fromToken.address],
    );
    return encoded;
  } else {
    console.error("CONVERT: Unknown conversion pathway");
  }
}
