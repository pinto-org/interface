import settingsIcon from "@/assets/misc/Settings.svg";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useReferralCode } from "@/hooks/tractor/useReferralCode";

interface ReferralCodePopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ReferralCodePopover({ children, open, onOpenChange }: ReferralCodePopoverProps) {
  const { referralCode, setReferralCode } = useReferralCode();

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children ?? (
          <Button variant="ghost" noPadding className="rounded-full w-10 h-10">
            <img src={settingsIcon} className="w-4 h-4 transition-all" alt="settings" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-52 flex flex-col shadow-none">
        <div className="flex flex-col gap-4">
          <div className="pinto-md">Referral Code</div>
          <Input
            type="text"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
