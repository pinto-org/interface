import chevronDown from "@/assets/misc/ChevronDown.svg";
import useIsTablet from "@/hooks/display/useIsTablet";
import { truncateAddress } from "@/utils/string";
import { useModal } from "connectkit";
import { Avatar } from "connectkit";
import { ComponentPropsWithoutRef, forwardRef, useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
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
    const account = useAccount();
    const modal = useModal();
    const isTablet = useIsTablet();

    const { address } = account;

    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName as string });

    useSyncAccountConnecting(modal.open, account);

    return (
      <Panel
        isOpen={isOpen}
        toggle={address ? togglePanel : () => {}}
        side="right"
        panelProps={{
          className: `max-w-panel-price w-panel-price ${isOpen ? `translate-x-12 mr-0 lg:translate-x-12 lg:mr-12` : `translate-x-full -mr-20 lg:-mr-12`}`,
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
