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

export default function ConnectButton() {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{account.address ? `${account.address.substring(0, 7)}...` : "Connect"}</Button>
      </DialogTrigger>
      <DialogContent className="w-[240px]">
        <DialogHeader>
          <DialogTitle>Select Wallet</DialogTitle>
          <DialogDescription>
            {connectors.map((connector) => (
              <DialogClose asChild>
                <Button
                  key={connector.uid}
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
