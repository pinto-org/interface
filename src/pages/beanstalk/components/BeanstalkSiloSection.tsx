import { TokenValue } from "@/classes/TokenValue";
import BeanstalkStatField from "@/components/BeanstalkStatField";
import { formatter } from "@/utils/format";

interface BeanstalkSiloSectionProps {
  balance: TokenValue;
  isLoading: boolean;
  disabled?: boolean;
  onClaim?: () => void;
  onSend?: () => void;
}

/**
 * Section component displaying urBDV token balance for Silo Payback
 */
const BeanstalkSiloSection: React.FC<BeanstalkSiloSectionProps> = ({
  balance,
  isLoading,
  disabled = false,
  onClaim,
  onSend,
}) => {
  const hasBalance = !balance.isZero;

  return (
    <BeanstalkStatField
      title="My Beanstalk Silo"
      value={formatter.number(balance, { minDecimals: 2, maxDecimals: 2 })}
      isLoading={isLoading}
      disabled={disabled}
      actions={[
        { label: "Claim", onClick: onClaim, disabled: !hasBalance },
        { label: "Send", onClick: onSend, disabled: !hasBalance },
      ]}
    />
  );
};

export default BeanstalkSiloSection;
