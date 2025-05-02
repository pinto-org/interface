import chevronDown from "@/assets/misc/ChevronDown.svg";
import useIsTablet from "@/hooks/display/useIsTablet";
import { truncateAddress } from "@/utils/string";
import { useModal } from "connectkit";
import { Avatar } from "connectkit";
import { ComponentPropsWithoutRef, Dispatch, SetStateAction, forwardRef } from "react";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import WalletButtonPanel from "./WalletButtonPanel";
import { Button } from "./ui/Button";
import IconImage from "./ui/IconImage";
import Panel from "./ui/Panel";

interface WalletButtonProps extends ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  togglePanel: () => void;
  className?: string;
}

const WalletButton = forwardRef<HTMLButtonElement, WalletButtonProps>(
  ({ isOpen = false, togglePanel, className }, ref) => {
    const { address } = useAccount();
    const modal = useModal();
    const isTablet = useIsTablet();

    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName as string });

    return (
      <Panel
        isOpen={isOpen}
        toggle={address ? togglePanel : () => {}}
        side="right"
        panelProps={{
          className: `max-w-panel-price w-panel-price mt-4 ${isOpen ? `translate-x-12 mr-0 lg:translate-x-12 lg:mr-12` : `translate-x-full -mr-20 lg:-mr-12`}`,
        }}
        screenReaderTitle="Wallet Panel"
        trigger={
          <Button
            onClick={() => (address ? togglePanel() : modal.setOpen(true))}
            variant="outline-secondary"
            noShrink
            rounded="full"
            className={`flex flex-row gap-0.5 sm:gap-2 items-center ${isOpen && "border-pinto-green"} ${className}`}
            ref={ref}
          >
            {ensAvatar && <Avatar address={address} size={28} />}
            <>
              {ensName
                ? ensName
                : address
                  ? `${truncateAddress(address, { suffix: !isTablet, letters: isTablet ? 3 : undefined })}`
                  : "Connect"}
            </>
            <IconImage src={chevronDown} size={4} mobileSize={2.5} alt="chevron down" />
          </Button>
        }
      >
        <WalletButtonPanel togglePanel={togglePanel} />
      </Panel>
    );
  },
);

export default WalletButton;
