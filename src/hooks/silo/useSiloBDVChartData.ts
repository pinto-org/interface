import { TokenValue } from "@/classes/TokenValue";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useTokenData from "@/state/useTokenData";
import { Token } from "@/utils/types";
import { useMemo } from "react";

interface SiloBDVChartData {
  tokenBDVData: Map<Token, TokenValue>;
  whitelistedTokens: Token[];
  isLoading: boolean;
  hasDeposits: boolean;
}

export const useSiloBDVChartData = (): SiloBDVChartData => {
  const farmerSilo = useFarmerSilo();
  const { whitelistedTokens } = useTokenData();

  const tokenBDVData = useMemo(() => {
    const bdvMap = new Map<Token, TokenValue>();

    // Process deposits from farmer silo data - include all whitelisted tokens
    for (const token of whitelistedTokens) {
      const depositData = farmerSilo.deposits.get(token);
      if (depositData && depositData.currentBDV.gt(0)) {
        bdvMap.set(token, depositData.currentBDV);
      } else {
        // Set zero for tokens with no deposits
        bdvMap.set(token, TokenValue.ZERO);
      }
    }

    return bdvMap;
  }, [farmerSilo.deposits, whitelistedTokens]);

  const hasDeposits = useMemo(() => {
    return Array.from(tokenBDVData.values()).some((bdv) => bdv.gt(0));
  }, [tokenBDVData]);

  return {
    tokenBDVData,
    whitelistedTokens,
    isLoading: farmerSilo.loading,
    hasDeposits,
  };
};
