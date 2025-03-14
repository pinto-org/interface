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
        <Button
          variant="outline"
          className={`font-[400] text-[1.25rem] h-10 text-pinto-gray-5 hover:text-pinto-gray-5 rounded-full flex flex-row gap-2 items-center`}
        >
          {chainName ? chainName : "Select Chain"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[300px] w-auto">
        <DialogHeader>
          <DialogTitle>Select Chain</DialogTitle>
          <DialogDescription>
            {chains.map((chain) => (
              <DialogClose asChild key={`selectChain${chain.id}`}>
                <Button
                  key={`selectChain${chain.id}`}
                  onClick={() => {
                    switchChain({ chainId: chain.id });
                    location.reload();
                  }}
                  type="button"
                  variant="outline"
                  className={`font-[400] text-[1.5rem] p-8 mt-4 w-full text-pinto-gray-5 hover:text-pinto-gray-5 rounded-[1rem] flex flex-row gap-2 items-center ${chainId === chain.id ? "border-pinto-green bg-pinto-green-4 text-white" : ""}`}
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
