import { TV } from "@/classes/TokenValue";
import { usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { Prettify } from "@/utils/types.generic";

import { keyBy } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  pool?: {
    deltaB: TV;
    price: TV;
  };
}

type SiloTokenConvertPath = {
  /**
   * The token to convert to
   */
  token: Token;
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
  const tokenData = useTokenData();
  const seedGauge = useSeedGauge();
  const silo = useSiloData();

  const [convertState, setConvertState] = useState<AddressMap<SiloTokenConvertState>>({});

  const deltaB = priceData.deltaB;

  const pools = priceData.pools;
  const maxLPToken = seedGauge.data.maxLPToken;
  const whitelist = tokenData.whitelistedTokens;

  const loading = silo.tokenData.size !== whitelist.length || !pools.length || !maxLPToken || priceData.price.isZero;

  const poolMap = useMemo(() => keyBy(pools, (p) => getTokenIndex(p.pool)), [pools]);

  const tokenConvertState = useMemo(() => {
    return whitelist.reduce<AddressMap<SiloTokenState>>((acc, token) => {
      const tokenIndex = getTokenIndex(token);
      const siloTokenData = silo.tokenData.get(token);
      const pool = poolMap[tokenIndex];

      if (siloTokenData) {
        const data: SiloTokenState = {
          token,
          isMaxLP: stringEq(token.address, maxLPToken?.address),
          rewards: siloTokenData.rewards,
          convertable: siloTokenData.depositedBDV.gt(0),
          pool: undefined,
        };

        if (pool) {
          data.pool = {
            deltaB: pool.deltaB,
            price: pool.price,
          };
        }

        acc[token.address] = data;
      }

      return acc;
    }, {});
  }, [whitelist, silo.tokenData, poolMap, maxLPToken]);

  useEffect(() => {
    if (loading) return;

    const state: AddressMap<SiloTokenConvertState> = {};

    for (const fromState of Object.values(tokenConvertState)) {
      const fromToken = fromState.token;

      const filteredWhitelist = whitelist.filter((t) => !stringEq(t.address, fromToken.address));

      const paths = filteredWhitelist.reduce<AddressMap<SiloTokenConvertPath>>((acc, target) => {
        const targetIndex = getTokenIndex(target);
        const targetState = tokenConvertState[targetIndex];

        if (!targetState) return acc;

        const data: SiloTokenConvertPath = {
          token: target,
          enabled: fromState.convertable && targetState.convertable,
          deltaSeedRewards: targetState.rewards.seeds.sub(fromState.rewards.seeds),
        };

        // Disable converts from PINTO -> LP when deltaB < 0
        if (!fromToken.isLP && deltaB.lt(0)) {
          data.enabled = false;
        }

        // Disable converts LP -> PINTO when deltaB > 0
        if (target.isLP && deltaB.gt(0)) {
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

    setConvertState(state);
  }, [loading, tokenConvertState, whitelist, deltaB]);

  return {
    convertState,
    loading,
  } as const;
};

const ConvertContext = createContext<ReturnType<typeof usePrepareConvertContext> | null>(null);

export const useConvertContext = () => {
  const context = useContext(ConvertContext);
  if (!context) throw new Error("useConvertContext must be used within a ConvertProvider");
  return context;
};

const ConvertProvider = ({ children }: { children: React.ReactNode }) => {
  const value = usePrepareConvertContext();

  return <ConvertContext.Provider value={value}>{children}</ConvertContext.Provider>;
};

export default ConvertProvider;
