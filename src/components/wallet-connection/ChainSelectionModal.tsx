import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { useChainId, useSwitchChain } from "wagmi";

interface ChainSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Chain Selection Modal Component
 * Shown after wallet connection in dev mode to allow chain switching
 */
export function ChainSelectionModal({ open, onOpenChange }: ChainSelectionModalProps) {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  const handleChainSelect = async (selectedChainId: number) => {
    try {
      await switchChain({ chainId: selectedChainId });
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[300px] w-auto">
        <DialogHeader>
          <DialogTitle>Select Chain</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2 mt-4">
              {chains.map((chain) => (
                <Button
                  key={`selectChain${chain.id}`}
                  onClick={() => handleChainSelect(chain.id)}
                  type="button"
                  variant="outline"
                  className={`font-[400] text-[1.5rem] p-8 w-full text-pinto-gray-5 hover:text-pinto-gray-5 rounded-[1rem] flex flex-row gap-2 items-center ${
                    chainId === chain.id ? "border-pinto-green bg-pinto-green-4 text-white" : ""
                  }`}
                >
                  {chain.name}
                </Button>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
