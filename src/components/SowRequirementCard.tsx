import { TokenValue } from "@/classes/TokenValue";
import { Progress } from "@/components/ui/Progress";
import { formatter } from "@/utils/format";

interface SowRequirementCardProps {
  totalBeansSown: TokenValue;
  amountNeeded: TokenValue;
  progressPercentage: number;
  disabled?: boolean;
}

export function SowRequirementCard({
  totalBeansSown,
  amountNeeded,
  progressPercentage,
  disabled = false,
}: SowRequirementCardProps) {
  return (
    <div className={`flex flex-col gap-4 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="pinto-body text-pinto-dark">
            {disabled
              ? "Connect your wallet to access referral features"
              : "You currently do not meet the criteria to refer farmers"}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="pinto-sm text-pinto-light">Progress</span>
            <span className="pinto-sm-bold text-pinto-dark">
              {disabled ? "- / 1000 Pinto sown" : `${formatter.number(totalBeansSown)} / 1000 Pinto sown`}
            </span>
          </div>
          <Progress
            value={disabled ? 0 : progressPercentage}
            className={`h-2 ${disabled ? "pointer-events-none" : ""}`}
          />
          {!disabled && !amountNeeded.isZero && (
            <div className="pinto-sm text-pinto-light">{formatter.number(amountNeeded)} more Pinto needed</div>
          )}
          {disabled && <div className="pinto-sm text-pinto-light">Connect wallet to view progress</div>}
        </div>
      </div>
    </div>
  );
}
