import TextSkeleton from "@/components/TextSkeleton";
import { Button } from "@/components/ui/Button";
import { ReactNode } from "react";

interface BeanstalkStatFieldAction {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface BeanstalkStatFieldProps {
  title: string;
  value: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  actions?: BeanstalkStatFieldAction[];
  children?: ReactNode;
}

/**
 * Reusable stat field component with title, value, and optional action buttons
 * Used in Beanstalk obligations and global stats cards
 */
const BeanstalkStatField: React.FC<BeanstalkStatFieldProps> = ({
  title,
  value,
  isLoading = false,
  disabled = false,
  actions,
  children,
}) => {
  return (
    <div className={`flex flex-col gap-1 ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="pinto-sm text-pinto-light">{title}</div>
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-3">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant="hoverTextPrimary"
                size="sm"
                noPadding
                onClick={action.onClick}
                disabled={disabled || action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {children ? (
        children
      ) : (
        <TextSkeleton loading={isLoading} height="body" className="w-24">
          <div className="pinto-body-light">{disabled ? <span className="text-pinto-light">N/A</span> : value}</div>
        </TextSkeleton>
      )}
    </div>
  );
};

export default BeanstalkStatField;
