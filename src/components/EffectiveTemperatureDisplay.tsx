import TooltipSimple from "@/components/TooltipSimple";
import { formatter } from "@/utils/format";

interface EffectiveTemperatureDisplayProps {
  temperature: number;
  className?: string;
}

export default function EffectiveTemperatureDisplay({ temperature, className = "" }: EffectiveTemperatureDisplayProps) {
  return (
    <div className={`flex justify-end mr-1 items-center gap-1 ${className}`}>
      <p className="pinto-sm text-pinto-light">
        Effective Temperature:{" "}
        <span className="text-gray-600 font-semibold">
          {formatter.number(temperature, { minDecimals: 0, maxDecimals: 0 })}%
        </span>
      </p>
      <TooltipSimple
        variant="gray"
        content={
          <span>
            The Temperature in which Sowing in the Field would return the same number of Pods at this price.{" "}
            <a
              href="https://docs.pinto.money/pinto-mechanics/toolshed/pod-market#effective-temperature"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pinto underline hover:text-pinto-dark transition-colors"
            >
              Learn More
            </a>
          </span>
        }
        side="top"
      />
    </div>
  );
}
