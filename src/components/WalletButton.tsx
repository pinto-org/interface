import chevronDown from "@/assets/misc/ChevronDown.svg";
import useIsTablet from "@/hooks/display/useIsTablet";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { truncateAddress } from "@/utils/string";
import { useModal } from "connectkit";
import { Avatar } from "connectkit";
import { ComponentPropsWithoutRef, forwardRef, useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import WalletButtonPanel from "./WalletButtonPanel";
import { Button } from "./ui/Button";
import IconImage from "./ui/IconImage";
import Panel from "./ui/Panel";

// Helper function to truncate email addresses
const truncateEmail = (email: string, isTablet: boolean = false): string => {
  if (!email) return email;

  const maxLength = isTablet ? 15 : 20; // Shorter on tablet/mobile

  if (email.length <= maxLength) return email;

  const [localPart, domain] = email.split("@");
  if (!domain) return email;

  // If email is too long, truncate the local part
  const truncatedLocal = localPart.length > 8 ? `${localPart.substring(0, 6)}...` : localPart;

  const result = `${truncatedLocal}@${domain}`;

  // If still too long, truncate domain as well
  if (result.length > maxLength) {
    return `${truncatedLocal}@${domain.substring(0, 6)}...`;
  }

  return result;
};

interface WalletButtonProps extends ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  togglePanel: () => void;
  className?: string;
}

const WalletButton = forwardRef<HTMLButtonElement, WalletButtonProps>(
  ({ isOpen = false, togglePanel, className }, ref) => {
    const account = useAccount();
    const modal = useModal();
    const isTablet = useIsTablet();
    const unifiedAuth = useUnifiedAuth();

    const { address } = account;

    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName as string });

    useSyncAccountConnecting(modal.open, account);

    // Use unified auth state for display
    const displayAddress = unifiedAuth.displayAddress || address;
    const displayName = unifiedAuth.user.email
      ? truncateEmail(unifiedAuth.user.email, isTablet)
      : ensName
        ? ensName
        : displayAddress
          ? `${truncateAddress(displayAddress, { suffix: !isTablet, letters: isTablet ? 3 : undefined })}`
          : "Connect";

    // If not authenticated, show Privy's native modal
    if (!unifiedAuth.isAuthenticated) {
      return (
        <Button
          onClick={() => unifiedAuth.login()}
          variant="outline-secondary"
          rounded="full"
          className={`flex flex-row gap-0.5 sm:gap-2 items-center ${className}`}
          ref={ref}
        >
          Connect
          <IconImage src={chevronDown} size={4} mobileSize={2.5} alt="chevron down" />
        </Button>
      );
    }

    return (
      <Panel
        isOpen={isOpen}
        toggle={unifiedAuth.isAuthenticated ? togglePanel : () => {}}
        side="right"
        panelProps={{
          className: `max-w-panel-price w-panel-price mt-4 ${isOpen ? `translate-x-12 mr-0 lg:translate-x-12 lg:mr-12` : `translate-x-full -mr-20 lg:-mr-12`}`,
        }}
        screenReaderTitle="Wallet Panel"
        trigger={
          <Button
            onClick={() => (unifiedAuth.isAuthenticated ? togglePanel() : unifiedAuth.login())}
            variant="outline-secondary"
            noShrink
            rounded="full"
            className={`flex flex-row gap-0.5 sm:gap-2 items-center ${isOpen && "border-pinto-green"} ${className}`}
            ref={ref}
          >
            {(ensAvatar || unifiedAuth.user.email) && <Avatar address={displayAddress} size={28} />}
            {unifiedAuth.user.email ? (
              <span className="text-pinto-green-4 font-medium">{displayName}</span>
            ) : (
              <>{displayName}</>
            )}
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

/**
 * If the connectkit modal opens, wagmi sets status to 'connecting' but doesn't set it to 'disconnected' when the modal is closed w/o connecting an account.
 *
 * Uses cascading effects to ensure that the account is disconnected if it has not connected after some time after the modal is closed.
 */
const useSyncAccountConnecting = (modalOpen: boolean, { address, status }: ReturnType<typeof useAccount>) => {
  const { disconnect } = useDisconnect();

  // Whether the connect kit modal has been opened.
  const [didOpen, setDidOpen] = useState<boolean>(false);
  // Whether the account may need to be disconnected.
  const [mayNeedDisconnect, setMayNeedDisconnect] = useState(false);

  /**
   * Effect 1
   *
   * Triggers 'didOpen'
   *
   * If the modal opens, set the didOpen state to true.
   */
  useEffect(() => {
    if (didOpen === true) return;
    setDidOpen(modalOpen);
  }, [modalOpen, didOpen]);

  /**
   * Effect 2
   *
   * Triggers 'setMayNeedDisconnect'
   *
   * If triggered, set 'mayNeedDisconnect' after 1500ms & resets 'didOpen' state only if
   * - the account is in the 'connecting' state (status === "connecting")
   * - the modal has been closed (modalOpen === false)
   */
  useEffect(() => {
    // if the modal is open or the modal has never been opened, do nothing.
    if (!didOpen || modalOpen) return;

    if (status === "connecting") {
      // Give ample time to see if the account is connected.
      setTimeout(() => {
        setDidOpen(false);
        setMayNeedDisconnect(true);
      }, 1500);
    }
  }, [didOpen, modalOpen, status]);

  /**
   * Effect 3
   *
   * Triggers 'disconnect'
   *
   * Resets 'mayNeedDisconnect' state & resets the wagmi status to 'disconnected'
   */
  useEffect(() => {
    if (!mayNeedDisconnect) return;

    // If the account has not connected after 1.5 seconds of being in the 'connecting' state, disconnect.
    if (mayNeedDisconnect && !address) {
      // Keep this log here for debugging purposes.
      console.log("No wallet connected after 1500ms of modal close. Disconnecting...");
      disconnect();
      setMayNeedDisconnect(false);
    }
  }, [mayNeedDisconnect]);

  /**
   * Effect 4
   *
   * If an address is connected & 'mayNeedDisconnect' is true, reset the states.
   */
  useEffect(() => {
    if (!!address && mayNeedDisconnect) {
      setMayNeedDisconnect(false);
      setDidOpen(false);
    }
  }, [address, mayNeedDisconnect]);
};
