import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Plugin,
  Title,
  Tooltip,
} from "chart.js";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Col } from "../Container";
import LoadingSpinner from "../LoadingSpinner";
import { ReactChart } from "../ReactChart";
import { Card } from "../ui/Card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SiloTokenBDVChartProps {
  tokenBDVData: Map<Token, TokenValue>;
  whitelistedTokens: Token[];
  isLoading?: boolean;
  // Preview data for deposit simulation
  previewToken?: Token;
  previewBDVGain?: TokenValue;
}

const SiloTokenBDVChart = React.memo(
  ({ tokenBDVData, whitelistedTokens, isLoading, previewToken, previewBDVGain }: SiloTokenBDVChartProps) => {
    const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
    const [imagesLoading, setImagesLoading] = useState(true);

    // Memoize chart data calculation with stable references
    const { chartData, tokenDataArray, hasAnyDeposits } = useMemo(() => {
      const hasAnyDeposits = Array.from(tokenBDVData.values()).some((bdv) => bdv.gt(0));

      if (!hasAnyDeposits) {
        return {
          chartData: { labels: [], datasets: [] } as ChartData<"bar">,
          tokenDataArray: [],
          hasAnyDeposits: false,
        };
      }

      // Create stable token data array
      const tokenDataArray = whitelistedTokens.map((token) => {
        const bdv = tokenBDVData.get(token) || TokenValue.ZERO;
        return { token, bdv: Number(bdv.toHuman()) };
      });

      tokenDataArray.sort((a, b) => b.bdv - a.bdv);

      const labels = tokenDataArray.map(({ token }) => token.symbol);
      const data = tokenDataArray.map(({ bdv }) => bdv);

      // Stable dataset configuration
      const baseDataset = {
        label: "Current BDV",
        data,
        backgroundColor: "rgba(56, 127, 92, 0.7)",
        borderColor: "rgba(56, 127, 92, 0.9)",
        hoverBackgroundColor: "rgba(56, 127, 92, 0.9)",
        hoverBorderColor: "rgba(56, 127, 92, 1)",
        borderWidth: 1,
        borderRadius: 6,
        hoverBorderWidth: 2,
        order: 1,
      };

      const datasets = [baseDataset];

      // Add preview dataset if we have valid preview data (positive for deposits, negative for withdrawals)
      if (previewToken && previewBDVGain && !previewBDVGain.eq(0)) {
        const previewValue = Number(previewBDVGain.toHuman());
        const isWithdrawal = previewValue < 0;
        const absoluteValue = Math.abs(previewValue);

        if (isWithdrawal) {
          // For withdrawals, we replace the current BDV data to show the withdrawal overlay
          const currentTokenIndex = tokenDataArray.findIndex(({ token }) => token.symbol === previewToken.symbol);
          if (currentTokenIndex >= 0) {
            const currentBDV = tokenDataArray[currentTokenIndex].bdv;
            const withdrawAmount = Math.min(absoluteValue, currentBDV); // Can't withdraw more than available

            // Update the base dataset to show only the remaining amount
            const remainingBDV = currentBDV - withdrawAmount;
            baseDataset.data[currentTokenIndex] = remainingBDV;

            // Add the withdrawal overlay that covers the full original amount
            const lossData = tokenDataArray.map(({ token }) => {
              if (token.symbol === previewToken.symbol) {
                return withdrawAmount;
              }
              return 0;
            });

            datasets.push({
              label: "BDV Loss",
              data: lossData,
              backgroundColor: "rgba(239, 68, 68, 0.6)",
              borderColor: "transparent", // No outline so green shows through
              hoverBackgroundColor: "rgba(239, 68, 68, 0.7)",
              hoverBorderColor: "transparent",
              borderWidth: 0,
              borderRadius: 6,
              hoverBorderWidth: 0,
              order: 2,
            });
          }
        } else {
          // For deposits, show the gain stacked on top
          const gainData = tokenDataArray.map(({ token }) => {
            if (token.symbol === previewToken.symbol) {
              return absoluteValue;
            }
            return 0;
          });

          datasets.push({
            label: "BDV Gain",
            data: gainData,
            backgroundColor: "rgba(56, 127, 92, 0.4)",
            borderColor: "rgba(56, 127, 92, 0.7)",
            hoverBackgroundColor: "rgba(56, 127, 92, 0.5)",
            hoverBorderColor: "rgba(56, 127, 92, 0.9)",
            borderWidth: 2,
            borderRadius: 6,
            hoverBorderWidth: 2,
            order: 2,
          });
        }
      }

      return {
        chartData: { labels, datasets },
        tokenDataArray,
        hasAnyDeposits: true,
      };
    }, [tokenBDVData, whitelistedTokens, previewToken, previewBDVGain]);

    // Memoize image loading with useCallback to prevent recreating on each render
    const loadImages = useCallback(async () => {
      if (tokenDataArray.length === 0) {
        setImagesLoading(false);
        return;
      }

      setImagesLoading(true);

      try {
        const imagePromises = tokenDataArray.map((tokenData) => {
          return new Promise<{ token: string; image: HTMLImageElement }>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ token: tokenData.token.symbol, image: img });
            img.onerror = () => reject(new Error(`Failed to load ${tokenData.token.symbol} icon`));
            img.src = tokenData.token.logoURI;
          });
        });

        const results = await Promise.allSettled(imagePromises);
        const newLoadedImages = new Map<string, HTMLImageElement>();

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            newLoadedImages.set(result.value.token, result.value.image);
          }
        });

        setLoadedImages(newLoadedImages);
      } finally {
        setImagesLoading(false);
      }
    }, [tokenDataArray]);

    // Load images when tokenDataArray changes
    useEffect(() => {
      loadImages();
    }, [loadImages]);

    // Memoize token icon plugin with stable reference
    const tokenIconPlugin = useMemo<Plugin<"bar">>(
      () => ({
        id: "tokenIcons",
        afterDatasetsDraw(chart) {
          if (imagesLoading || loadedImages.size === 0) return;

          const { ctx, scales } = chart;
          const xScale = scales.x;
          const yScale = scales.y;

          tokenDataArray.forEach((tokenData, index) => {
            const img = loadedImages.get(tokenData.token.symbol);
            if (!img) return;

            const x = xScale.getPixelForTick(index);
            const y = yScale.bottom + 30;
            const iconSize = 24;

            ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
          });
        },
      }),
      [tokenDataArray, loadedImages, imagesLoading],
    );

    // Memoize chart options with stable reference
    const chartOptions = useMemo<ChartOptions<"bar">>(() => {
      // Calculate max value considering stacked bars
      let maxValue = 0;
      if (chartData.datasets.length > 0) {
        const numPoints = chartData.datasets[0].data.length;
        for (let i = 0; i < numPoints; i++) {
          let stackedValue = 0;
          chartData.datasets.forEach((dataset) => {
            stackedValue += Number(dataset.data[i]) || 0;
          });
          maxValue = Math.max(maxValue, stackedValue);
        }
      }
      const scaledMax = maxValue * 1.15;

      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "rgba(56, 127, 92, 0.8)",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            padding: 12,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const value = Number(context.parsed.y).toFixed(4);
                return `${label}: ${value} BDV`;
              },
              title: (tooltipItems) => tooltipItems[0]?.label || "",
              afterBody: (tooltipItems) => {
                if (tooltipItems.length > 1) {
                  const current = Number(
                    tooltipItems.find((item) => item.dataset.label === "Current BDV")?.parsed.y || 0,
                  );
                  const gainItem = tooltipItems.find((item) => item.dataset.label === "BDV Gain");
                  const lossItem = tooltipItems.find((item) => item.dataset.label === "BDV Loss");

                  if (gainItem) {
                    const gain = Number(gainItem.parsed.y || 0);
                    const total = current + gain;
                    return [``, `Total After Deposit: ${total.toFixed(4)} BDV`];
                  } else if (lossItem) {
                    const loss = Number(lossItem.parsed.y || 0);
                    const total = current - loss; // Subtract the loss amount
                    return [``, `Total After Withdrawal: ${total.toFixed(4)} BDV`];
                  }
                }
                return [];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: scaledMax > 0 ? scaledMax : undefined,
            stacked: true, // Enable stacking
            ticks: {
              maxTicksLimit: 3,
              callback: (value) => Number(value).toFixed(2),
              font: { size: 12, family: "Pinto" },
              color: "rgba(0, 0, 0, 0.7)",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
              drawBorder: false,
            },
          },
          x: {
            stacked: true, // Enable stacking on x-axis too
            ticks: {
              display: true,
              font: { size: 14, family: "Pinto", weight: 500 },
              color: "rgba(0, 0, 0, 0.8)",
              maxRotation: 0,
              minRotation: 0,
              padding: 40,
            },
            grid: { display: false },
          },
        },
        layout: {
          padding: { left: 15, right: 15, top: 15, bottom: 50 },
        },
        interaction: { mode: "index", intersect: false },
      };
    }, [chartData]);

    if (isLoading || imagesLoading) {
      return (
        <Card className="p-6">
          <div className="h-[500px] w-full">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-pinto-gray-5">Your Silo Position</h3>
            </div>
            <Col className="flex items-center justify-center h-[450px]">
              <LoadingSpinner size={50} />
            </Col>
          </div>
        </Card>
      );
    }

    if (!hasAnyDeposits) {
      return null; // Don't show card if no deposits
    }

    return (
      <Card className="p-6">
        <div className="h-[500px] w-full">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-pinto-gray-5">Your Silo Position</h3>
          </div>
          <div className="h-[450px] w-full">
            <ReactChart type="bar" data={chartData} options={chartOptions} plugins={[tokenIconPlugin]} />
          </div>
        </div>
      </Card>
    );
  },
);

SiloTokenBDVChart.displayName = "SiloTokenBDVChart";

export default SiloTokenBDVChart;
