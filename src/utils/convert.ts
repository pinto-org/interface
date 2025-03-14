import { TokenValue } from "@/classes/TokenValue";
import { encodeAbiParameters } from "viem";
import { stringEq } from "./string";
import { DepositCrateData, DepositData, SiloTokenDataMap, Token } from "./types";
import { STALK } from "@/constants/internalTokens";

export enum ConvertKind {
  LAMBDA_LAMBDA = 0,
  BEANS_TO_WELL_LP = 1,
  WELL_LP_TO_BEANS = 2,
  ANTI_LAMBDA_LAMBDA = 3,
}

export type ConvertDetails = {
  amount: TokenValue;
  bdv: TokenValue;
  stalk: TokenValue;
  seeds: TokenValue;
  actions: [];
  crates: DepositCrateData[];
};

export interface PickedCratesDetails {
  totalAmount: TokenValue;
  totalBDV: TokenValue;
  totalStalk: TokenValue;
  totalSeeds: TokenValue;
  crates: DepositCrateData[];
}

export interface ExtendedPickedCratesDetails extends PickedCratesDetails {
  totalBaseStalk: TokenValue;
  totalGrownStalk: TokenValue;
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
export function pickCrates(deposits: DepositData[], amount: TokenValue): PickedCratesDetails {
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
    const crateBDV = cratePct.mul(deposit.depositBdv);
    const crateSeeds = cratePct.mul(deposit.seeds);

    const baseStalk = cratePct.mul(deposit.stalk.base);
    const grownStalk = cratePct.mul(deposit.stalk.grown);
    const crateStalk = cratePct.mul(deposit.stalk.total);

    totalAmount = totalAmount.add(amountToRemoveFromCrate);
    totalBDV = totalBDV.add(crateBDV);
    totalSeeds = totalSeeds.add(crateSeeds);
    totalStalk = totalStalk.add(crateStalk);

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

export function pickCratesMultiple(
  deposits: DepositData[],
  sortBy: "bdv" | "stem",
  sortOrder: "asc" | "desc",
  amounts: TokenValue[],
  noSort: boolean = false,
): ExtendedPickedCratesDetails[] {
  const sortCratesFn = sortBy === "bdv" ? sortCratesByBDVRatio : sortCratesByStem;
  const sortedDeposits = noSort ? deposits : sortCratesFn(deposits, sortOrder);

  // Make copy to avoid modifying the original object references
  let remaining = sortedDeposits.map((deposit) => ({ ...deposit }));

  // Return an array of PickedCratesDetails for each amount
  return amounts.map((amount) => {
    let totalAmount = TokenValue.ZERO;
    let totalBDV = TokenValue.ZERO;
    let totalStalk = TokenValue.ZERO;
    let totalBaseStalk = TokenValue.ZERO;
    let totalGrownStalk = TokenValue.ZERO;
    let totalSeeds = TokenValue.ZERO;

    const cratesToWithdrawFrom: DepositCrateData[] = [];

    remaining = remaining.filter((deposit) => !deposit.amount.eq(0));

    for (const deposit of remaining) {
      const amountToRemoveFromCrate = totalAmount.add(deposit.amount).lte(amount)
        ? deposit.amount
        : amount.sub(totalAmount);
      const cratePct = amountToRemoveFromCrate.div(deposit.amount);
      const crateBDV = cratePct.mul(deposit.depositBdv);
      const crateCurrentBDV = cratePct.mul(deposit.currentBdv);
      const crateSeeds = cratePct.mul(deposit.seeds);

      const baseStalk = cratePct.mul(deposit.stalk.base);
      const grownStalk = cratePct.mul(deposit.stalk.grown);
      const crateStalk = cratePct.mul(deposit.stalk.total);

      totalAmount = totalAmount.add(amountToRemoveFromCrate);
      totalBDV = totalBDV.add(crateBDV);
      totalSeeds = totalSeeds.add(crateSeeds);
      totalBaseStalk = totalBaseStalk.add(baseStalk);
      totalGrownStalk = totalGrownStalk.add(grownStalk);
      totalStalk = totalStalk.add(crateStalk);

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

      deposit.amount = deposit.amount.sub(amountToRemoveFromCrate);
      deposit.stalk = {
        ...deposit.stalk,
        base: deposit.stalk.base.sub(baseStalk),
        grown: deposit.stalk.grown.sub(grownStalk),
        total: deposit.stalk.total.sub(crateStalk),
      };
      deposit.seeds = deposit.seeds.sub(crateSeeds);
      deposit.depositBdv = deposit.depositBdv.sub(crateBDV);
      deposit.currentBdv = deposit.currentBdv.sub(crateCurrentBDV);

      if (totalAmount.eq(amount)) {
        break;
      }
    }

    if (totalAmount.lt(amount)) {
      throw new Error("Not enough deposits");
    }

    return {
      totalAmount,
      totalBDV,
      totalStalk,
      totalBaseStalk,
      totalGrownStalk,
      totalSeeds,
      crates: cratesToWithdrawFrom,
    };
  });
}

/**
 * Picks crates from a sorted list of deposits and returns summary data along with picked crates as the type `DepositData`.
 */
export function pickCratesAsCrates(sortedDeposits: DepositData[], quote: TokenValue) {
  const toDeposits: DepositData[] = [];

  let aggAmount = TokenValue.ZERO;
  let aggSeeds = TokenValue.ZERO;
  const aggStalk = {
    base: TokenValue.ZERO,
    grown: TokenValue.ZERO,
    germinating: TokenValue.ZERO,
    total: TokenValue.ZERO,
    grownSinceDeposit: TokenValue.ZERO,
  };

  sortedDeposits.some((d) => {
    const amount = aggAmount.add(d.amount).lte(quote) ? d.amount : quote.sub(aggAmount);

    const cratePct = amount.div(d.depositBdv);
    const seeds = d.seeds.mul(cratePct);

    aggStalk.base = aggStalk.base.add(cratePct.mul(d.stalk.base));
    aggStalk.grown = aggStalk.grown.add(cratePct.mul(d.stalk.grown));
    aggStalk.germinating = aggStalk.germinating.add(cratePct.mul(d.stalk.germinating));
    aggStalk.total = aggStalk.total.add(cratePct.mul(d.stalk.total));
    aggStalk.grownSinceDeposit = aggStalk.grownSinceDeposit.add(cratePct.mul(d.stalk.grownSinceDeposit));

    aggAmount = aggAmount.add(amount);
    aggSeeds = aggSeeds.add(seeds);

    const { base, grown, germinating, total, grownSinceDeposit } = d.stalk;

    toDeposits.push({
      ...d,
      amount: amount,
      depositBdv: d.depositBdv.mul(cratePct),
      currentBdv: d.currentBdv.mul(cratePct),
      stalk: {
        base: base.mul(cratePct),
        grown: grown.mul(cratePct),
        germinating: germinating.mul(cratePct).reDecimal(STALK.decimals),
        total: total.mul(cratePct),
        grownSinceDeposit: grownSinceDeposit.mul(cratePct),
      },
      seeds,
    });

    return aggAmount.eq(quote);
  });

  return {
    amount: aggAmount,
    stalk: aggStalk,
    seeds: aggSeeds,
    deposits: toDeposits,
  };
}

export const extractStemsAndAmountsFromCrates = (crates: DepositCrateData[]): {
  stems: TokenValue[],
  amounts: TokenValue[]
} => {
  return crates.reduce<{ stems: TokenValue[], amounts: TokenValue[] }>((acc, crate) => {
    acc.stems.push(crate.stem);
    acc.amounts.push(crate.amount);
    return acc;
  }, {
    stems: [],
    amounts: []
  });
}

export function sortAndPickCrates(
  mode: "convert" | "transfer" | "withdraw" | "wrap",
  fromAmount: TokenValue,
  deposits: DepositData[],
  toToken?: Token,
): ConvertDetails {
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
  } else if (mode === "transfer" || mode === "withdraw" || mode === "wrap") {
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

export function calculateConvert(
  fromToken: Token,
  toToken: Token,
  fromAmount: TokenValue,
  deposits: DepositData[],
  silo: SiloTokenDataMap,
): ConvertDetails {
  if (deposits.length === 0) throw new Error("No crates to withdraw from");
  const sortedCrates =
    !fromToken.isLP && toToken.isLP
      ? /// BEAN -> LP: oldest crates are best. Grown stalk is equivalent
      /// on both sides of the convert, but having more seeds in older crates
      /// allows you to accrue stalk faster after convert.
      /// Note that during this convert, BDV is approx. equal after the convert.
      sortCratesByStem(deposits, "asc")
      : /// X -> LP: use the crates with the lowest [BDV/Amount] ratio first.
      /// Since LP deposits can have varying BDV, the best option for the Farmer
      /// is to increase the BDV of their existing lowest-BDV crates.
      sortCratesByBDVRatio(deposits, "asc");

  const pickedCrates = pickCrates(sortedCrates, fromAmount);

  return {
    amount: pickedCrates.totalAmount,
    bdv: pickedCrates.totalBDV,
    stalk: pickedCrates.totalStalk,
    seeds: silo.get(fromToken)?.rewards?.seeds.mul(pickedCrates.totalBDV) || TokenValue.ZERO,
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
  } else if (stringEq(fromToken.address, toToken.address)) {
    const encoded = encodeAbiParameters(
      [
        { type: "uint256", name: "convertKind" },
        { type: "uint256", name: "amount" },
        { type: "address", name: "token" },
      ],
      [BigInt(ConvertKind.LAMBDA_LAMBDA), amountIn.toBigInt(), fromToken.address],
    );
    return encoded;
  } else {
    console.error("CONVERT: Unknown conversion pathway");
  }
}
