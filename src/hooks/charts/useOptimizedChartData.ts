import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import { ChartData } from "chart.js";
import { useCallback, useMemo, useRef } from "react";

interface TokenDataEntry {
  token: Token;
  bdv: number;
}

interface UseOptimizedChartDataProps {
  tokenBDVData: Map<Token, TokenValue>;
  whitelistedTokens: Token[];
  previewToken?: Token;
  previewBDVGain?: TokenValue;
}

// Deep comparison function for Map<Token, TokenValue>
const compareBDVMaps = (map1: Map<Token, TokenValue>, map2: Map<Token, TokenValue>): boolean => {
  if (map1.size !== map2.size) return false;

  for (const [token, value] of map1) {
    const otherValue = map2.get(token);
    if (!otherValue || !value.eq(otherValue)) {
      return false;
    }
  }
  return true;
};

// Deep comparison for whitelisted tokens array
const compareTokenArrays = (arr1: Token[], arr2: Token[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((token, index) => token.address === arr2[index].address && token.symbol === arr2[index].symbol);
};

export const useOptimizedChartData = ({
  tokenBDVData,
  whitelistedTokens,
  previewToken,
  previewBDVGain,
}: UseOptimizedChartDataProps) => {
  // Cache previous values for deep comparison
  const previousBDVData = useRef<Map<Token, TokenValue>>(new Map());
  const previousWhitelistedTokens = useRef<Token[]>([]);
  const previousTokenDataArray = useRef<TokenDataEntry[]>([]);

  // Check if we have any deposits to show the chart
  const hasAnyDeposits = useMemo(() => {
    return Array.from(tokenBDVData.values()).some((bdv) => bdv.gt(0));
  }, [tokenBDVData]);

  // Stable token data array calculation with deep comparison
  const tokenDataArray = useMemo(() => {
    // Check if we need to recalculate
    const bdvDataChanged = !compareBDVMaps(tokenBDVData, previousBDVData.current);
    const tokensChanged = !compareTokenArrays(whitelistedTokens, previousWhitelistedTokens.current);

    if (!bdvDataChanged && !tokensChanged) {
      return previousTokenDataArray.current;
    }

    // Recalculate only if data actually changed
    const newTokenDataArray = whitelistedTokens.map((token) => {
      const bdv = tokenBDVData.get(token) || TokenValue.ZERO;
      return { token, bdv: Number(bdv.toHuman()) };
    });

    // Sort by BDV descending, but keep all tokens
    newTokenDataArray.sort((a, b) => b.bdv - a.bdv);

    // Update refs
    previousBDVData.current = new Map(tokenBDVData);
    previousWhitelistedTokens.current = [...whitelistedTokens];
    previousTokenDataArray.current = newTokenDataArray;

    return newTokenDataArray;
  }, [tokenBDVData, whitelistedTokens]);

  // Stable preview data calculation
  const previewData = useMemo(() => {
    if (!previewToken || !previewBDVGain || previewBDVGain.lte(0)) {
      return null;
    }

    return tokenDataArray.map(({ token, bdv }) => {
      if (token.symbol === previewToken.symbol) {
        return bdv + Number(previewBDVGain.toHuman());
      }
      return bdv;
    });
  }, [tokenDataArray, previewToken, previewBDVGain]);

  // Chart data with stable memoization
  const chartData: ChartData<"bar"> = useMemo(() => {
    if (!hasAnyDeposits) {
      return { labels: [], datasets: [] };
    }

    const labels = tokenDataArray.map(({ token }) => token.symbol);
    const data = tokenDataArray.map(({ bdv }) => bdv);

    const datasets: any[] = [
      {
        label: "Current BDV",
        data,
        backgroundColor: "rgba(56, 127, 92, 0.7)",
        borderColor: "rgba(56, 127, 92, 0.9)",
        hoverBackgroundColor: "rgba(56, 127, 92, 0.9)",
        hoverBorderColor: "rgba(56, 127, 92, 1)",
        borderWidth: 1,
        borderRadius: 6,
        hoverBorderWidth: 2,
        order: 2,
      },
    ];

    // Add preview dataset if we have preview data
    if (previewData) {
      datasets.push({
        label: "After Deposit",
        data: previewData,
        backgroundColor: "rgba(56, 127, 92, 0.3)",
        borderColor: "rgba(56, 127, 92, 0.6)",
        hoverBackgroundColor: "rgba(56, 127, 92, 0.4)",
        hoverBorderColor: "rgba(56, 127, 92, 0.8)",
        borderWidth: 2,
        borderDash: [5, 5], // Dotted line
        borderRadius: 6,
        hoverBorderWidth: 2,
        order: 1,
      });
    }

    return { labels, datasets };
  }, [hasAnyDeposits, tokenDataArray, previewData]);

  // Calculate max value for scaling
  const maxValue = useMemo(() => {
    const allValues = chartData.datasets.flatMap((dataset) => dataset.data as number[]);
    return Math.max(...(allValues.length ? allValues : [0]));
  }, [chartData]);

  return {
    chartData,
    tokenDataArray,
    maxValue,
    hasAnyDeposits,
    hasPreview: !!previewData,
  };
};
