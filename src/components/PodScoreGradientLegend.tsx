import TooltipSimple from "./TooltipSimple";
import { cn } from "@/utils/utils";

interface PodScoreGradientLegendProps {
  learnMoreUrl?: string;
  className?: string;
}

/**
 * Displays a gradient legend showing the Pod Score color scale.
 * Shows a horizontal gradient bar from brown (poor) to gold (average) to green (good),
 * with an info icon tooltip explaining the Pod Score metric.
 */
export default function PodScoreGradientLegend({
  learnMoreUrl = "https://docs.pinto.money/",
  className,
}: PodScoreGradientLegendProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 py-2 px-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-pinto-gray-2", className)}
    >
      {/* Row 1: Title and info icon */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-pinto-gray-5">Pod Score</span>
        <TooltipSimple
          variant="outlined"
          side="left"
          align="start"
          showOnMobile
          content={
            <div className="flex flex-col max-w-xs">
              <p className="text-pinto-gray-5">
                Pod Score measures listing quality based on Return/Place in Line ratio. Higher scores (green) indicate
                better value opportunities.
              </p>
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pinto underline hover:text-pinto-dark transition-colors"
              >
                Learn more
              </a>
            </div>
          }
        />
      </div>

      {/* Row 2: Gradient bar */}
      <div
        className="h-8 w-48 border-2 border-black rounded-none mx-1"
        style={{
          background: "linear-gradient(90deg, #91580D 0%, #E8C15F 50%, #A8E868 100%)",
        }}
      />

      {/* Row 3: Labels (Low, Avg, High) */}
      <div className="flex justify-between text-[0.625rem] text-pinto-gray-5">
        <span>Low</span>
        <span>Avg</span>
        <span>High</span>
      </div>
    </div>
  );
}
