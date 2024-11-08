import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { Button } from "./ui/Button";
import chevronDown from "@/assets/misc/ChevronDown.svg";
import { useModal } from "connectkit";
import { Avatar } from "connectkit";
import WalletButtonPanel from "./WalletButtonPanel";
import { truncateAddress } from "@/utils/string";
import useIsTablet from "@/hooks/display/useIsTablet";
import IconImage from "./ui/IconImage";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface WalletButtonProps extends ComponentPropsWithoutRef<'div'> {
  isOpen: boolean; 
  togglePanel: () => void;
  className?: string;
}

const WalletButton = forwardRef<HTMLButtonElement, WalletButtonProps>(({ isOpen = false, togglePanel, className }, ref) => {
  const { address } = useAccount();
  const modal = useModal();
  const isTablet = useIsTablet();

  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName as string });

  return (
    <>
      <Button
        onClick={() => (address ? togglePanel() : modal.setOpen(true))}
        variant="outline-secondary"
        noShrink
        rounded="full"
        className={`flex flex-row gap-2 items-center ${isOpen && "border-pinto-green"} ${className}`}
        ref={ref}
      >
        {ensAvatar && <Avatar address={address} size={28} />}
        <>{ensName ? ensName : address ? `${truncateAddress(address, { suffix: !isTablet })}` : "Connect"}</>
        <IconImage src={chevronDown} size={4} alt="chevron down" />
      </Button>
      <WalletButtonPanel isOpen={isOpen} togglePanel={togglePanel} />
    </>
  );
})

export default WalletButton
