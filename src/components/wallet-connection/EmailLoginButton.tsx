import mailIcon from "@/assets/misc/mail.png";
import { Button } from "@/components/ui/Button";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { withTracking } from "@/utils/analytics";
import { useLogin, usePrivy } from "@privy-io/react-auth";

interface EmailLoginButtonProps {
  onConnect?: () => void;
}

/**
 * Email/Social Login Button Component
 * Triggers Privy authentication modal for email and social login
 */
export function EmailLoginButton({ onConnect }: EmailLoginButtonProps) {
  const { login } = useLogin();
  const { ready, authenticated } = usePrivy();

  const handleClick = () => {
    if (!ready) {
      console.warn("Privy is not ready yet");
      return;
    }

    if (authenticated) {
      return;
    }

    withTracking(
      ANALYTICS_EVENTS.WALLET.CONNECT_BUTTON_CLICK,
      () => {
        // Close modal before opening Privy modal
        onConnect?.();

        // Small delay to ensure modal closes before Privy modal opens
        setTimeout(() => {
          login();
        }, 100);
      },
      {
        wallet_type: "email",
        source: "wallet_connection_modal",
      },
    )();
  };

  return (
    <Button
      variant="outline"
      size="xl"
      width="full"
      className="flex flex-row items-center gap-3 h-14 text-pinto-gray-5 hover:text-pinto-gray-5 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleClick}
      disabled={!ready}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <img src={mailIcon} alt="Email" className="w-6 h-6" />
      </div>
      <span className="font-medium flex-1">Continue with Email</span>
    </Button>
  );
}
