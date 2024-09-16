import { useSwitchChain } from "wagmi";
import { useChainId } from "wagmi";
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

export default function ChainButton() {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const chainName = chains.find((chain) => chain.id === chainId)?.name;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{chainName ? chainName : "Select Chain"}</Button>
      </DialogTrigger>
      <DialogContent className="w-[240px]">
        <DialogHeader>
          <DialogTitle>Select Chain</DialogTitle>
          <DialogDescription>
            {chains.map((chain) => (
              <DialogClose asChild>
                <Button
                  key={`selectChain${chain.id}`}
                  onClick={() => switchChain({ chainId: chain.id })}
                  type="button"
                  className="flex flex-col w-full my-2"
                >
                  {chain.name}
                </Button>
              </DialogClose>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
