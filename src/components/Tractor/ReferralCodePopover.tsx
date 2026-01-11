import settingsIcon from "@/assets/misc/Settings.svg";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useReferralCode } from "@/hooks/tractor/useReferralCode";
import { decodeReferralAddress } from "@/utils/referral";
import { useMemo } from "react";

interface ReferralCodePopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ReferralCodePopover({ children, open, onOpenChange }: ReferralCodePopoverProps) {
  const { referralCode, validReferralCodeFromStorage, setReferralCode } = useReferralCode();

  // Decode referral code to address for validation (use validReferralCodeFromStorage for conditional rendering)
  const referralAddress = useMemo(() => {
    if (!validReferralCodeFromStorage) return null;
    return decodeReferralAddress(validReferralCodeFromStorage);
  }, [validReferralCodeFromStorage]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children ?? (
          <Button variant="ghost" noPadding className="rounded-full w-10 h-10">
            <img src={settingsIcon} className="w-4 h-4 transition-all" alt="settings" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-64 flex flex-col shadow-none">
        <div className="flex flex-col gap-4">
          <div className="pinto-md">Referral Code</div>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className={referralAddress ? "border-green-500" : ""}
            />
            {referralAddress && (
              <div className="pinto-sm text-green-600 flex items-center gap-1">
                <span>✓</span>
                <span>Valid referral code</span>
              </div>
            )}
            {referralCode && !referralAddress && <div className="pinto-sm text-red-600">Invalid referral code</div>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
