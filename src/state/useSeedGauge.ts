import { exists } from "@/utils/utils";
import { useMemo } from "react";

import { TV, TokenValue } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { getTokenIndex } from "@/utils/token";
import { AddressMap, Token } from "@/utils/types";
import { useReadContract, useReadContracts } from "wagmi";
import { useSiloData } from "./useSiloData";
import useTokenData from "./useTokenData";

interface BaseTokenSeedGaugeInfo {
  token: Token;
  /**
   * the total BDV deposited in the silo
   */
  totalBdv: TokenValue;
  /**
   * Optimal % of deposited BDV desired by the Gauge System
   */
  optimalPctDepositedBdv: TokenValue;
  /**
   * Current amount of GP allocated by the Gauge System
   */
  gaugePoints: TokenValue;
  /**
   * Whether the whitelisted token is allocated gauge points by the gauge system
   */
  isAllocatedGP: boolean;
  /**
   * Gauge points per BDV
   */
  gaugePointsPerBdv: TokenValue;
}

export interface TokenSeedGaugeInfo extends BaseTokenSeedGaugeInfo {
  /**
   * the current percentage of all BDV deposited in the silo
   */
  currentDepositedBdvRatio: TokenValue;
  /**
   * the current percentage of all LP BDV deposited in the silo.
   * Only for LP tokens
   */
  currentDepositedLPBDVRatio?: TokenValue;
}

const EMPTY_TOKEN_SEED_GAUGE_INFO: AddressMap<TokenSeedGaugeInfo> = {};

export const useSeedGauge = () => {
  const protocolAddress = useProtocolAddress();
  const { tokenData } = useSiloData();

  const { whitelistedTokens } = useTokenData();

  const { data: bean2MaxLpRatioScaled, ...bean2MaxLpRatioScaledQuery } = useReadContract({
    address: protocolAddress,
    abi: getBeanToMaxLpGpPerBdvRatioScaledABI,
    functionName: "getBeanToMaxLpGpPerBdvRatioScaled",
    args: [],
    query: {
      select: (data) => {
        return TokenValue.fromBlockchain(data, 18);
      },
    },
  });

  const { data: gaugePointsPerBdv, ...gaugePointsQuery } = useReadContracts({
    contracts: whitelistedTokens.map((token) => ({
      address: protocolAddress,
      abi: gaugePointsPerBdvABI,
      functionName: "getGaugePointsPerBdvForToken",
      args: [token.address],
    })),
    query: {
      enabled: !!whitelistedTokens.length,
      select: (data) => {
        const map: AddressMap<bigint> = Object.fromEntries(
          whitelistedTokens.map((token, i) => {
            const { error, result } = data[i];
            return [getTokenIndex(token), error ? 0n : result] as const;
          }),
        );
        return map;
      },
    },
  });

  const queryKeys = useMemo(() => {
    return [bean2MaxLpRatioScaledQuery.queryKey, gaugePointsQuery.queryKey];
  }, [bean2MaxLpRatioScaledQuery.queryKey, gaugePointsQuery.queryKey]);

  const { gaugeData, maxLPToken } = useMemo(() => {
    if (!exists(bean2MaxLpRatioScaled) || !exists(gaugePointsPerBdv) || !tokenData.size) {
      return {
        gaugeData: EMPTY_TOKEN_SEED_GAUGE_INFO,
        maxLPToken: undefined,
      };
    }

    const map: AddressMap<BaseTokenSeedGaugeInfo> = {};
    let totalRelevantBDV = TV.fromHuman(0, PINTO.decimals);
    let totalRelevantLPBDV = TV.fromHuman(0, PINTO.decimals);

    let maxLP = whitelistedTokens[0];

    whitelistedTokens.forEach((token) => {
      const tokenIndex = getTokenIndex(token);
      const gaugePoint = gaugePointsPerBdv[tokenIndex];
      const wlTokenData = tokenData.get(token);
      if (!wlTokenData) {
        console.log("no token data");
        return;
      }

      const { totalDeposited, tokenBDV: bdvOne, tokenSettings } = wlTokenData;

      const optimalPctDepositedBdv = tokenSettings.optimalPercentDepositedBdv;
      const allocatedGP = optimalPctDepositedBdv.gt(0);
      const totalBDV = bdvOne.mul(totalDeposited);

      if (allocatedGP) {
        totalRelevantBDV = totalRelevantBDV.add(totalBDV);
        if (token.isLP) {
          totalRelevantLPBDV = totalRelevantLPBDV.add(totalBDV);
        }
      }

      const tokenGaugePointsPerBdv = TV.fromBlockchain(gaugePoint, 18);
      const tokenGaugePoints = TV.fromBlockchain(tokenSettings.gaugePoints, 18);

      const maxLPEntry = map[getTokenIndex(maxLP)];

      if (token.isLP && (!maxLP.isLP || maxLPEntry?.gaugePointsPerBdv.lt(tokenGaugePointsPerBdv))) {
        maxLP = token;
      }

      map[tokenIndex] = {
        token,
        optimalPctDepositedBdv,
        totalBdv: totalBDV,
        gaugePointsPerBdv: tokenGaugePointsPerBdv,
        gaugePoints: tokenGaugePoints,
        isAllocatedGP: allocatedGP,
      };
    });

    const entries = Object.fromEntries(
      Object.entries(map).map(([tokenIndex, data]) => {
        const info: TokenSeedGaugeInfo = {
          ...data,
          currentDepositedLPBDVRatio: TV.ZERO,
          currentDepositedBdvRatio: TV.ZERO,
        };

        if (data.isAllocatedGP && totalRelevantBDV.gt(0) && totalRelevantLPBDV.gt(0)) {
          const gpRatio = data.totalBdv.div(totalRelevantBDV);
          info.currentDepositedBdvRatio = gpRatio;

          if (data.token.isLP) {
            const lpRatio = data.totalBdv.div(totalRelevantLPBDV);
            info.currentDepositedLPBDVRatio = lpRatio;
          }
        }

        return [tokenIndex, info] as const;
      }),
    );

    return {
      gaugeData: entries,
      maxLPToken: maxLP,
    };
  }, [bean2MaxLpRatioScaled, tokenData, whitelistedTokens, gaugePointsPerBdv]);

  const isLoading = bean2MaxLpRatioScaledQuery.isLoading || gaugePointsQuery.isLoading;

  return useMemo(() => {
    return {
      data: {
        main2MaxLPRatio: bean2MaxLpRatioScaled,
        gaugeData,
        maxLPToken,
      },
      queryKeys,
      isLoading,
    };
  }, [isLoading, bean2MaxLpRatioScaled, gaugeData, queryKeys, maxLPToken]);
};

// ---------------------------------------------------------------------------------------------------------------------

// Defined separately here to avoid infinite type error
const gaugePointsPerBdvABI = [
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "getGaugePointsPerBdvForToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Defined separately here to avoid infinite type error
const getBeanToMaxLpGpPerBdvRatioScaledABI = [
  {
    inputs: [],
    name: "getBeanToMaxLpGpPerBdvRatioScaled",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
