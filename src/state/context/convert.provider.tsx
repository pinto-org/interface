import { TV } from "@/classes/TokenValue";
import { useWells } from "@/hooks/wells/wells";
import { PoolData, usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { Prettify } from "@/utils/types.generic";
import { useQueryClient } from "@tanstack/react-query";

import { createContext, useContext, useEffect, useMemo } from "react";

interface SiloTokenState {
  /**
   * The token to convert from
   */
  token: Token;
  /**
   * Whether the wl token has enough bdv to convert from & to
   */
  convertable: boolean;
  /**
   * Whether the token is the max LP token
   */
  isMaxLP: boolean;
  /**
   * The rewards for the token
   */
  rewards: {
    seeds: TV;
    stalk: TV;
  };
  /**
   * The pool data for the token
   */
  pool?: PoolData;
}

export type SiloTokenConvertPath = {
  /**
   * The token to convert to
   */
  token: Token;
  /**
   * The seed reward for the target token
   */
  seedReward: TV;
  /**
   * Whether the conversion is enabled.
   * For example: Since we don't use gen-convert for LP<>NON_LP converts,
   * converting from NON_LP -> LP is not supported when deltaB < 0.
   */
  enabled: boolean;
  /**
   * delta seeds from converting 1 BDV of fromToken to targetToken
   */
  deltaSeedRewards: TV;
};

export type SiloTokenConvertState = Prettify<SiloTokenState & { paths: AddressMap<SiloTokenConvertPath> }>;

const usePrepareConvertContext = () => {
  const priceData = usePriceData();
  const queryClient = useQueryClient();

  const tokenData = useTokenData();
  const seedGauge = useSeedGauge();
  const wells = useWells();
  const silo = useSiloData();

  const overallDeltaP = priceData.deltaB;
  const pools = priceData.pools;
  const maxLPToken = seedGauge.data.maxLPToken;
  const whitelist = tokenData.whitelistedTokens;

  // biome-ignore lint/correctness/useExhaustiveDependencies: run on mount
  useEffect(() => {
    priceData.queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }, []);

  const tokenConvertState = useMemo(() => {
    return whitelist.reduce<AddressMap<SiloTokenState>>((acc, token) => {
      const tokenIndex = getTokenIndex(token);
      const siloTokenData = silo.tokenData.get(token);

      if (siloTokenData) {
        const data: SiloTokenState = {
          token,
          isMaxLP: stringEq(token.address, maxLPToken?.address),
          rewards: siloTokenData.rewards,
          convertable: siloTokenData.depositedBDV.gt(0),
          pool: wells[tokenIndex] ?? undefined,
        };

        acc[tokenIndex] = data;
      }

      return acc;
    }, {});
  }, [whitelist, silo.tokenData, wells, maxLPToken]);

  const loading = silo.tokenData.size !== whitelist.length || !pools.length || !maxLPToken || priceData.price.isZero;

  const convertState = useMemo(() => {
    const state: AddressMap<SiloTokenConvertState> = {};
    if (loading) return state;

    for (const fromState of Object.values(tokenConvertState)) {
      const fromToken = fromState.token;

      const filteredWhitelist = whitelist.filter((t) => !stringEq(t.address, fromToken.address));

      const paths = filteredWhitelist.reduce<AddressMap<SiloTokenConvertPath>>((acc, target) => {
        const targetIndex = getTokenIndex(target);
        const targetState = tokenConvertState[targetIndex];

        if (!targetState) return acc;

        const data: SiloTokenConvertPath = {
          token: target,
          seedReward: targetState.rewards.seeds,
          enabled: fromState.convertable && targetState.convertable,
          deltaSeedRewards: targetState.rewards.seeds.sub(fromState.rewards.seeds),
        };

        // if (fromToken.isLP && target.isLP) {
        //   data.enabled = false;
        // }

        // Disable converts from PINTO -> LP when overall deltaB < 0
        if (fromToken.isMain && target.isLP && overallDeltaP.lte(0)) {
          data.enabled = false;
        }

        // Disable converts from LP -> PINTO when overall deltaB > 0
        if (fromToken.isLP && target.isMain && overallDeltaP.gte(0)) {
          data.enabled = false;
        }

        // Disable converts from PINTO -> LP when LP pool deltaB < 0
        if (fromToken.isMain && target.isLP && targetState.pool?.deltaB.lte(0)) {
          data.enabled = false;
        }

        // Disable converts LP -> PINTO when pool deltaB < 0
        if (target.isMain && fromToken.isLP && fromState.pool?.deltaB.gt(0)) {
          data.enabled = false;
        }

        acc[targetIndex] = data;

        return acc;
      }, {});

      state[getTokenIndex(fromToken)] = {
        ...fromState,
        paths,
      };
    }

    return state;
  }, [loading, tokenConvertState, whitelist, overallDeltaP]);

  return useMemo(
    () => ({
      convertState,
      maxLPToken,
    }),
    [convertState, maxLPToken],
  );
};

const ConvertContext = createContext<ReturnType<typeof usePrepareConvertContext> | null>(null);

export const useConvertState = () => {
  const context = useContext(ConvertContext);
  if (!context) throw new Error("useConvertContext must be used within a ConvertProvider");
  return context;
};

const ConvertProvider = ({ children }: { children: React.ReactNode }) => {
  const value = usePrepareConvertContext();

  return <ConvertContext.Provider value={value}>{children}</ConvertContext.Provider>;
};

export default ConvertProvider;
