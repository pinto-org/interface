import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { Button } from "./ui/Button";
import chevronDown from "@/assets/misc/ChevronDown.svg";
import { useModal } from "connectkit";
import { Avatar } from "connectkit";
import WalletButtonPanel from "./WalletButtonPanel";

export default function WalletButton({isOpen = false, togglePanel}: {isOpen: boolean, togglePanel: () => void}) {
  const { address } = useAccount();
  const modal = useModal();
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName as string })

  return (
    <>
      <Button 
        onClick={() => address ? togglePanel() : modal.setOpen(true)} 
        variant="outline" 
        className={`font-[400] text-[1.25rem] h-10 text-pinto-gray-5 hover:text-pinto-gray-5 rounded-full flex flex-row gap-2 items-center ${isOpen && 'border-pinto-green'}`}
      >
        {ensAvatar && <Avatar address={address} size={28} />}
        <span>{ensName ? ensName : address ? `${address.substring(0, 7)}...${address.substring(38, 42)}` : "Connect"}</span>
        <img src={chevronDown} className="h-4 w-4" />
      </Button>
      <WalletButtonPanel isOpen={isOpen} />
    </>
  );
}
