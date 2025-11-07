import chevronDown from "@/assets/misc/ChevronDown.svg";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import useIsExtraSmall from "@/hooks/display/useIsExtraSmall";
import useIsTablet from "@/hooks/display/useIsTablet";
import { useWalletImage } from "@/hooks/useWalletImage";
import { useWalletNFTProfile } from "@/hooks/useWalletNFTProfile";
import { withTracking } from "@/utils/analytics";
import { truncateAddress } from "@/utils/string";
import { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import WalletButtonPanel from "./WalletButtonPanel";
import WalletConnectionModal from "./WalletConnectionModal";
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
    const isTablet = useIsTablet();
    const isExtraSmall = useIsExtraSmall();

    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName as string });
    const { hasNFT, profileImageUrl } = useWalletNFTProfile();
    const { imageError, retryAttempt, handleImageError } = useWalletImage(profileImageUrl);
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

    const hideNFTProfile = false;

    const handleTogglePanel = () => {
      return withTracking(
        address ? ANALYTICS_EVENTS.WALLET.PANEL_OPEN : ANALYTICS_EVENTS.WALLET.CONNECT_BUTTON_CLICK,
        () => {
          if (address) {
            togglePanel();
          } else {
            // Open custom wallet connection modal instead of ConnectKit modal
            setIsConnectionModalOpen(true);
          }
        },
        {
          wallet_connected: !!address,
          panel_state: isOpen ? "open" : "closed",
          has_ens: !!ensName,
          has_nft: hasNFT,
        },
      );
    };

    return (
      <>
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
              onClick={handleTogglePanel()}
              variant="outline-secondary"
              noShrink
              rounded="full"
              className={`flex flex-row gap-0.5 sm:gap-2 items-center ${isOpen && "border-pinto-green"} ${className}`}
              ref={ref}
            >
              {/* NFT Circle Pic */}
              {address && hasNFT && (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-white flex-shrink-0 flex items-center justify-center">
                  {hideNFTProfile || imageError ? (
                    <span className="text-gray-500 font-semibold text-sm">?</span>
                  ) : (
                    <img
                      key={`${profileImageUrl}-${retryAttempt}`}
                      src={profileImageUrl || ensAvatar || ""}
                      alt="Profile"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  )}
                </div>
              )}

              <>
                {ensName
                  ? ensName
                  : address
                    ? `${truncateAddress(address, { suffix: !isTablet, letters: isTablet ? 2 : undefined })}`
                    : "Connect"}
              </>
              {!isExtraSmall && <IconImage src={chevronDown} size={4} mobileSize={2.5} alt="chevron down" />}
            </Button>
          }
        >
          <WalletButtonPanel togglePanel={handleTogglePanel()} />
        </Panel>
        {/* Custom Wallet Connection Modal */}
        <WalletConnectionModal open={isConnectionModalOpen} onOpenChange={setIsConnectionModalOpen} />
      </>
    );
  },
);

export default WalletButton;
