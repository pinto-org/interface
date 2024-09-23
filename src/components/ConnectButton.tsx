import { useAccount } from "wagmi";
import { useConnect } from "wagmi";
import { useDisconnect } from "wagmi";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import chevronDown from "@/assets/misc/ChevronDown.svg";

export default function ConnectButton() {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-[400] text-[1.25rem] h-10 text-pinto-gray-5 hover:text-pinto-gray-5 rounded-full flex flex-row gap-2">
          <span>{account.address ? `${account.address.substring(0, 7)}...${account.address.substring(38, 42)}` : "Connect"}</span>
          <img src={chevronDown} className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[240px]">
        <DialogHeader>
          <DialogTitle>Select Wallet</DialogTitle>
          <DialogDescription>
            {connectors.map((connector, i) => (
              <DialogClose asChild>
                <Button
                  key={`${connector.uid}_${i}`}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="flex flex-col w-full my-2"
                >
                  {connector.name}
                </Button>
              </DialogClose>
            ))}
            {account.address && (
              <DialogClose asChild>
                <Button
                  key={"disconnect"}
                  onClick={() => disconnect()}
                  type="button"
                  className="flex flex-col w-full my-2"
                >
                  Disconnect
                </Button>
              </DialogClose>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
