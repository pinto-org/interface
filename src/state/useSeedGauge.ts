import { exists } from "@/utils/utils";
import { useMemo } from "react";

import { DecimalBigNumber } from "@/classes/DecimalBigNumber";
import { TokenValue } from "@/classes/TokenValue";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { LibCases } from "@/lib/LibCases";
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
  currentPctDepositedBdv: TokenValue;
}

const EMPTY_TOKEN_SEED_GAUGE_INFO: AddressMap<TokenSeedGaugeInfo> = {};

const MAX_BEAN_MAX_LP = LibCases.MAX_BEAN_MAX_LP_GP_PER_BDV_RATIO * BigInt(1e18);

const MIN_BEAN_MAX_LP = LibCases.MIN_BEAN_MAX_LP_GP_PER_BDV_RATIO * BigInt(1e18);

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

  const gaugeData = useMemo(() => {
    if (!exists(bean2MaxLpRatioScaled) || !exists(gaugePointsPerBdv)) {
      return EMPTY_TOKEN_SEED_GAUGE_INFO;
    }

    const map: AddressMap<BaseTokenSeedGaugeInfo> = {};
    let totalRelevantBDV = 0n;

    whitelistedTokens.forEach((token) => {
      const tokenIndex = getTokenIndex(token);
      const gaugePoint = gaugePointsPerBdv[tokenIndex];
      const wlTokenData = tokenData.get(token);
      if (!wlTokenData) return;

      const { totalDeposited, tokenBDV: bdvOne, tokenSettings } = wlTokenData;

      const optimalPctDepositedBdv = tokenSettings.optimalPercentDepositedBdv;
      const allocatedGP = optimalPctDepositedBdv.gt(0);
      const totalDepositedBDV = bdvOne.mul(totalDeposited);

      if (allocatedGP) {
        totalRelevantBDV += totalDepositedBDV.toBigInt();
      }

      map[tokenIndex] = {
        token,
        optimalPctDepositedBdv,
        totalBdv: totalDepositedBDV,
        gaugePointsPerBdv: TokenValue.fromBlockchain(gaugePoint, 18),
        gaugePoints: TokenValue.fromBlockchain(tokenSettings.gaugePoints, 18),
        isAllocatedGP: allocatedGP,
      };
    });

    return Object.fromEntries(
      Object.entries(map).map(([tokenIndex, data]) => {
        const tokenDatas: TokenSeedGaugeInfo = {
          ...data,
          currentPctDepositedBdv: TokenValue.ZERO,
        };

        if (data.isAllocatedGP) {
          if (data.totalBdv.eq(0) || totalRelevantBDV === 0n) {
            tokenDatas.currentPctDepositedBdv = TokenValue.ZERO;
          } else {
            const pct = data.totalBdv.div(totalRelevantBDV).div(100);
            tokenDatas.currentPctDepositedBdv = pct;
          }
        }

        return [tokenIndex, tokenDatas] as const;
      }),
    );
  }, [bean2MaxLpRatioScaled, tokenData, whitelistedTokens, gaugePointsPerBdv]);

  const isLoading = bean2MaxLpRatioScaledQuery.isLoading || gaugePointsQuery.isLoading;

  return useMemo(() => {
    return {
      data: {
        main2MaxLPRatio: {
          max: MAX_BEAN_MAX_LP,
          value: bean2MaxLpRatioScaled,
          min: MIN_BEAN_MAX_LP,
        },
        gaugeData,
      },
      queryKeys,
      isLoading,
    };
  }, [isLoading, bean2MaxLpRatioScaled, gaugeData, queryKeys]);
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
