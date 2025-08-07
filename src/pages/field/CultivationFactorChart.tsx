import { TokenValue } from "@/classes/TokenValue";
import { Col } from "@/components/Container";
import TextSkeleton from "@/components/TextSkeleton";
import { diamondABI } from "@/constants/abi/diamondABI";
import { PINTO } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { formatter } from "@/utils/format";
import { cn } from "@/utils/utils";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { decodeAbiParameters } from "viem";
import { useReadContract } from "wagmi";

type CultivationFactorChartProps = {
  className?: string;
};

const CultivationFactorChart = React.memo(({ className }: CultivationFactorChartProps) => {
  const protocolAddress = useProtocolAddress();
  const navigate = useNavigate();

  // Fast RPC call to get current cultivation factor using getGaugeValue(0)
  const { data: cultivationFactorBytes, isLoading } = useReadContract({
    address: protocolAddress,
    abi: diamondABI,
    functionName: "getGaugeValue",
    args: [0], // GaugeId 0 for cultivation factor
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // RPC call to get current initial soil for min/max calculations
  const { data: initialSoilBytes, isLoading: initialSoilLoading } = useReadContract({
    address: protocolAddress,
    abi: diamondABI,
    functionName: "initialSoil",
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Decode the bytes response to uint256 and convert to cultivation factor
  const currentCultivationFactor = useMemo(() => {
    console.log("🌱 CultivationFactor Debug - Raw bytes:", cultivationFactorBytes);

    if (!cultivationFactorBytes) return 0;
    try {
      // Decode bytes as uint256
      const [decodedValue] = decodeAbiParameters([{ type: "uint256" }], cultivationFactorBytes);
      console.log("🌱 CultivationFactor Debug - Decoded uint256:", decodedValue.toString());

      // Convert from 6 decimals to percentage value (the result is already a percentage)
      const percentageValue = Number(decodedValue) / 1e6;
      console.log("🌱 CultivationFactor Debug - Percentage (÷1e6):", percentageValue);

      return percentageValue;
    } catch (error) {
      console.error("🌱 Error decoding cultivation factor:", error);
      return 0;
    }
  }, [cultivationFactorBytes]);

  // Calculate the percentage for marker position (0-100%)
  // Cultivation factor is already a percentage value, so use directly
  const targetMarkerPosition = Math.min(Math.max(currentCultivationFactor, 0), 100);

  // Animation state for thermometer effect
  const [animatedMarkerPosition, setAnimatedMarkerPosition] = useState(0);

  // Display value is already a percentage
  const displayValue = currentCultivationFactor;

  // Calculate soil values for hover display
  const soilValues = useMemo(() => {
    if (!initialSoilBytes || currentCultivationFactor === 0) return { maxSoil: 0, minSoil: 0 };

    try {
      // initialSoil() returns uint256 in soil decimals (6 decimals like PINTO)
      const initialSoil = TokenValue.fromBlockchain(initialSoilBytes as bigint, PINTO.decimals).toNumber();

      // Calculate maximum theoretical soil that could be issued
      // maxSoil = initialSoil ÷ (cultivationFactor ÷ 100)
      const maxSoil = initialSoil / (currentCultivationFactor / 100);

      // Calculate minimum soil (1% of max soil)
      const minSoil = maxSoil / 100;

      console.log("🌱 Soil Debug - initialSoil:", initialSoil, "maxSoil:", maxSoil, "minSoil:", minSoil);

      return { maxSoil, minSoil };
    } catch (error) {
      console.error("🌱 Error calculating soil values:", error);
      return { maxSoil: 0, minSoil: 0 };
    }
  }, [initialSoilBytes, currentCultivationFactor]);

  // Hover state
  const [isHovered, setIsHovered] = useState(false);

  // Handle click to navigate to field explorer
  const handleClick = () => {
    navigate("/explorer/field");
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const cultivationElement = document.querySelector('[data-section="cultivation-factor"]');
      if (cultivationElement) {
        cultivationElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  // Counter roll animation states
  const [animatedMaxSoil, setAnimatedMaxSoil] = useState(100);
  const [animatedMinSoil, setAnimatedMinSoil] = useState(0);

  // Create a counter roll animation hook
  const useCounterRoll = (targetValue: number, isActive: boolean, decimals = 0) => {
    const [current, setCurrent] = useState(isActive ? targetValue : decimals > 0 ? 0 : 100);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const startValue = current;
      const endValue = targetValue;
      const duration = 300; // ms
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - (1 - progress) ** 2;
        const currentValue = startValue + (endValue - startValue) * easeOut;

        setCurrent(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [targetValue, isActive]);

    return current;
  };

  // Calculate initial soil for display
  const initialSoilValue = useMemo(() => {
    if (!initialSoilBytes) return 0;
    try {
      return TokenValue.fromBlockchain(initialSoilBytes as bigint, PINTO.decimals).toNumber();
    } catch (error) {
      console.error("🌱 Error calculating initial soil display:", error);
      return 0;
    }
  }, [initialSoilBytes]);

  // Use counter roll for all values
  const rollMaxSoil = useCounterRoll(isHovered ? soilValues.maxSoil : 100, isHovered, 0);
  const rollMinSoil = useCounterRoll(isHovered ? soilValues.minSoil : 0, isHovered, 2);
  const rollCurrentValue = useCounterRoll(isHovered ? initialSoilValue : displayValue, isHovered, 2);

  // Animate marker position on mount or when target changes
  useEffect(() => {
    if (!isLoading && targetMarkerPosition > 0) {
      // Start from 0 and animate to target position
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();
      const startPosition = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation (ease-out)
        const easeOut = 1 - (1 - progress) ** 3;
        const currentPosition = startPosition + (targetMarkerPosition - startPosition) * easeOut;

        setAnimatedMarkerPosition(currentPosition);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [targetMarkerPosition, isLoading]);

  return (
    <Col
      className={cn(
        "gap-8 items-center min-h-[423px] lg:min-h-[435px] cursor-pointer transition-transform hover:scale-[1.01]",
        className,
      )}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="pinto-sm sm:pinto-body text-center text-pinto-green-3 transition-opacity duration-200">
        {isHovered ? (
          <>
            Soil Issuance
            <br />
            Range
          </>
        ) : (
          <>
            Cultivation
            <br />
            Factor
          </>
        )}
      </div>

      {/* Chart Container */}
      <div
        className="relative flex-1 w-[120px] flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <TextSkeleton loading={isLoading} height="full" className="w-full h-full absolute">
          {/* Bottom section - thicker line */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-[4px] bg-pinto-gray-3 bottom-0"
            style={{
              height: `${animatedMarkerPosition}%`,
            }}
          />

          {/* Top section - thin gold line */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-[1px] bg-yellow-500 top-0"
            style={{
              height: `${100 - animatedMarkerPosition}%`,
            }}
          />

          {/* Top label - 100% or Max Soil */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 pinto-sm text-pinto-green-3 text-center">
            <span className="whitespace-nowrap">
              {isHovered
                ? `Max: ${formatter.number(rollMaxSoil, { minDecimals: 0, maxDecimals: 0 })}`
                : `${Math.round(rollMaxSoil)}%`}
            </span>
          </div>

          {/* Bottom label - 0% or Min Soil */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 pinto-sm text-pinto-green-3 text-center">
            <span className="whitespace-nowrap">
              {isHovered
                ? `Min: ${formatter.number(rollMinSoil, { minDecimals: 2, maxDecimals: 2 })}`
                : `${Math.round(rollMinSoil)}%`}
            </span>
          </div>

          {/* Marker and value label */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              bottom: `${animatedMarkerPosition}%`,
            }}
          >
            {/* Value label with arrow pointing to marker */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center">
              <span className="pinto-body text-pinto-green-3 font-medium mr-2 whitespace-nowrap">
                {isHovered
                  ? `${formatter.number(rollCurrentValue, { minDecimals: 0, maxDecimals: 0 })}`
                  : `${formatter.number(rollCurrentValue, { minDecimals: 2, maxDecimals: 2 })}%`}
              </span>
              {/* Arrow pointing to marker */}
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-pinto-green-3" />
            </div>

            {/* Circular marker */}
            <div className="w-5 h-5 bg-pinto-green-3 rounded-full border-2 border-white shadow-lg" />
          </div>
        </TextSkeleton>
      </div>
    </Col>
  );
});

CultivationFactorChart.displayName = "CultivationFactorChart";

export default CultivationFactorChart;
