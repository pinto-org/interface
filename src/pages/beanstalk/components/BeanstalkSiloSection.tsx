import { TokenValue } from "@/classes/TokenValue";
import BeanstalkStatField from "@/components/BeanstalkStatField";
import TextSkeleton from "@/components/TextSkeleton";
import { formatter } from "@/utils/format";

interface BeanstalkSiloSectionProps {
  balance: TokenValue;
  earned: TokenValue;
  isLoading: boolean;
  disabled?: boolean;
  onClaim?: () => void;
  onSend?: () => void;
}

/**
 * Section component displaying urBDV token balance for Silo Payback
 * Shows earned (claimable) as primary value, total urBDV balance as secondary
 */
const BeanstalkSiloSection: React.FC<BeanstalkSiloSectionProps> = ({
  balance,
  earned,
  isLoading,
  disabled = false,
  onClaim,
  onSend,
}) => {
  const hasBalance = !balance.isZero;
  const hasEarned = !earned.isZero;

  return (
    <BeanstalkStatField
      title="My Beanstalk Silo"
      value=""
      isLoading={isLoading}
      disabled={disabled}
      actions={[
        { label: "Claim", onClick: onClaim, disabled: !hasEarned },
        { label: "Send", onClick: onSend, disabled: !hasBalance },
      ]}
    >
      <TextSkeleton loading={isLoading} height="body" className="w-24">
        {disabled ? (
          <span className="text-pinto-light pinto-body-light">N/A</span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <div className="pinto-body-light">
              {formatter.number(earned, { minDecimals: 2, maxDecimals: 2 })}
              <span className="text-pinto-light pinto-sm ml-1">earned</span>
            </div>
            <div className="pinto-sm text-pinto-light">
              {formatter.number(balance, { minDecimals: 2, maxDecimals: 2 })} urBDV total
            </div>
          </div>
        )}
      </TextSkeleton>
    </BeanstalkStatField>
  );
};

export default BeanstalkSiloSection;
