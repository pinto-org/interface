import { TV } from "@/classes/TokenValue";
import { defaultQuerySettingsQuote } from "@/constants/query";
import { MAIN_TOKEN } from "@/constants/tokens";
import { decodeAdvancedPipeResult } from "@/encoders/advancedPipe";
import encodePrice, { decodePriceResult } from "@/encoders/ecosystem/price";
import { AdvancedFarmWorkflow, AdvancedPipeWorkflow } from "@/lib/farm/workflow";
import { usePriceData } from "@/state/usePriceData";
import { getOverrideAllowanceStateOverride, useChainConstant } from "@/utils/chain";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { AddressLookup } from "@/utils/types.generic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useConfig } from "wagmi";
import { useWells } from "./wells";

export interface PriceImpactSummary {
  token: Token;
  priceBefore: TV;
  priceAfter: TV | undefined;
  priceImpact: number | undefined;
  lpUSDBefore: TV;
  lpUSDAfter: TV | undefined;
}

export type PriceImpactSummaryMap = AddressLookup<PriceImpactSummary> & {
  main: PriceImpactSummary;
};

export const PRICE_IMPACT_PREDICATE = ["priceImpactSummary"];

export function useDeterminePriceImpact(result: ReturnType<typeof decodePriceResult> | undefined) {
  const priceData = usePriceData();
  const wells = useWells();

  const mainToken = useChainConstant(MAIN_TOKEN);

  // Price impact is calculated as ((priceAfter - priceBefore) / priceBefore) * 100%
  const priceImpactByWell = useMemo(() => {
    const overallPriceBefore = priceData.price;
    const overallPriceAfter = result?.price ? TV.fromBigInt(result.price, 6) : undefined;

    const mainTokenData = {
      priceBefore: priceData.price,
      priceAfter: overallPriceAfter,
      token: mainToken,
      priceImpact: calculatePriceImpact(overallPriceBefore, overallPriceAfter),
      lpUSDBefore: TV.ZERO,
      lpUSDAfter: TV.ZERO,
    };

    const map = Object.values(wells).reduce<PriceImpactSummaryMap>(
      (prev, curr) => {
        // current pool data
        const well = curr.pool;
        const wellIndex = getTokenIndex(well);
        const priceBefore = wells[wellIndex].price;
        const lpUSDBefore = wells[wellIndex].lpUsd;

        // after simulation pool data
        const postWellState = result?.pools?.[wellIndex];
        const after = postWellState?.price;
        const lpUSDAfter = postWellState ? TV.fromBigInt(postWellState?.lpUsd, 6) : undefined;

        const priceAfter = after ? TV.fromBigInt(after, 6) : undefined;
        const priceImpact = calculatePriceImpact(priceBefore, priceAfter);

        prev[wellIndex] = {
          priceBefore,
          priceAfter,
          priceImpact,
          token: well,
          lpUSDBefore,
          lpUSDAfter,
        };

        return prev;
      },
      { main: mainTokenData },
    );

    return map;
  }, [result, wells, mainToken, priceData.price]);

  /**
   * Get the price impact with a well
   */
  const getPriceImpactWithWell = useCallback(
    (well: Token) => priceImpactByWell?.[getTokenIndex(well)],
    [priceImpactByWell],
  );

  return {
    priceImpactByWell,
    get: getPriceImpactWithWell,
  } as const;
}

export default function usePriceImpactSummary(
  // The advanced farm workflow to be used for the simulation
  advancedFarmWorkflow: AdvancedFarmWorkflow | undefined,
  // The token to be used for the static contract call
  approvalToken?: Token,
  // The value to be used for the static contract call
  value?: TV,
  // Disable the query if true
  disabled?: boolean,
  // Override the default behavior of setting the query key to the advanced farm workflow steps
  qkDependency?: string | string[],
) {
  const config = useConfig();
  const chainId = useChainId();
  const account = useAccount();
  const qc = useQueryClient();

  const pricePipeStruct = useMemo(() => {
    const advFarm = new AdvancedFarmWorkflow(chainId, config, "price-impact-adv-farm");
    const pipe = new AdvancedPipeWorkflow(chainId, config, "price-impact-adv-pipe");

    pipe.add(encodePrice(chainId));
    advFarm.add(pipe);

    return advFarm;
  }, [config, chainId]);

  const queryKey = useMemo(() => {
    const qkDep = qkDependency ? [qkDependency] : advancedFarmWorkflow?.getSteps();

    return [
      PRICE_IMPACT_PREDICATE,
      {
        approvalToken: approvalToken?.address ?? "no-approval-token",
        value: value?.toHuman() ?? "0",
        qkDep,
      },
    ];
  }, [advancedFarmWorkflow, value, qkDependency, approvalToken]);

  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (!account.address) throw new Error("Expected account to be set");
      if (!advancedFarmWorkflow?.length) throw new Error("Expected advancedFarm to be set");

      const simulation = await advancedFarmWorkflow.simulate({
        account: account.address as Address,
        after: pricePipeStruct,
        stateOverrides: getOverrideAllowanceStateOverride(chainId, approvalToken, account.address),
        value,
      });

      const advPipeResult = simulation.result[simulation.result.length - 1];

      const decodedAdvancedPipe = decodeAdvancedPipeResult(advPipeResult);
      return decodePriceResult(decodedAdvancedPipe?.[0]);
    },
    enabled: !!advancedFarmWorkflow?.length && !!account.address && !disabled,
    retry: (failureCount, error) => {
      if (failureCount === 3) {
        console.error("price impact simlulation failed.", { failureCount, error });
        return false;
      }
      return true;
    },
    ...defaultQuerySettingsQuote,
  });

  const { priceImpactByWell, get } = useDeterminePriceImpact(query.data);

  /**
   * Clear the price impact query
   */
  const clear = useCallback(() => {
    qc.removeQueries({ queryKey: PRICE_IMPACT_PREDICATE, exact: false, type: "all" });
  }, [qc]);

  return { ...query, data: priceImpactByWell, get, clear } as const;
}

function calculatePriceImpact(priceBefore: TV, priceAfter?: TV): number | undefined {
  if (!priceAfter) return undefined;

  let priceImpact: TV | undefined = undefined;

  // Calculate basic price change percentage
  const priceChange = priceAfter.sub(priceBefore).div(priceBefore).mul(100);

  // Calculate distances to fair value (1)
  const distanceBefore = priceBefore.sub(1).abs();
  const distanceAfter = priceAfter.sub(1).abs();

  // If we're moving closer to $1, price impact is negative
  // If we're moving away from $1, price impact is positive
  if (distanceAfter.lt(distanceBefore)) {
    priceImpact = priceChange.abs().mul(-1); // Negative impact when price improves
  } else {
    priceImpact = priceChange.abs(); // Positive impact when price worsens
  }

  return priceImpact?.toNumber();
}
