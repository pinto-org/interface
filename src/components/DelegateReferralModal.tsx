import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import {
  useSimulateBeanstalk_DelegateReferralRewards,
  useWriteBeanstalk_DelegateReferralRewards,
} from "@/generated/contractHooks";
import { getExplorerLink } from "@/utils/chain";
import { CopyIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAddress } from "viem";
import { useChainId, useWaitForTransactionReceipt } from "wagmi";

interface DelegateReferralModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DelegateReferralModal({ isOpen, onOpenChange }: DelegateReferralModalProps) {
  const [delegateAddress, setDelegateAddress] = useState("");
  const [error, setError] = useState("");
  const chainId = useChainId();

  // Check if address is valid
  const isValidAddress = delegateAddress.trim() && isAddress(delegateAddress);

  // Simulate the transaction
  const { data: simulateData } = useSimulateBeanstalk_DelegateReferralRewards({
    args: isValidAddress ? [delegateAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!isValidAddress,
    },
  });

  // Write contract
  const { writeContract, data: hash, isPending } = useWriteBeanstalk_DelegateReferralRewards();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle success
  useEffect(() => {
    if (isSuccess && hash) {
      setDelegateAddress("");
      onOpenChange(false);
      toast.dismiss();
      const explorerLink = getExplorerLink(hash, chainId);
      toast.success(
        <div className="flex flex-row items-center gap-4">
          <span className="text-pinto-sm">Delegate address updated successfully</span>
          <div className="flex flex-row items-center gap-2">
            <div className="h-auto text-s text-pinto-green-4 hover:underline">
              <a href={explorerLink} target="_blank" rel="noopener noreferrer">
                View on Basescan
              </a>
            </div>
            <div
              className="h-auto text-s text-pinto-green-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(explorerLink);
                toast.success("Link copied to clipboard");
              }}
            >
              <CopyIcon className="w-4 h-4" />
            </div>
          </div>
        </div>,
      );
    }
  }, [isSuccess, hash, chainId, onOpenChange]);

  const handleSubmit = () => {
    // Validate address
    if (!delegateAddress.trim()) {
      setError("Please enter an address");
      return;
    }

    if (!isAddress(delegateAddress)) {
      setError("Invalid Ethereum address");
      return;
    }

    setError("");

    // Try with simulate data first, fallback to direct call
    if (simulateData?.request) {
      writeContract(simulateData.request);
    } else {
      // Fallback: call directly without simulation
      writeContract({
        args: [delegateAddress as `0x${string}`],
      });
    }
  };

  const handleReset = () => {
    setError("");
    writeContract({
      args: ["0x0000000000000000000000000000000000000000" as `0x${string}`],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Pod Destination Address</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="pinto-sm text-pinto-light">Delegate Address</label>
            <Input
              value={delegateAddress}
              onChange={(e) => {
                setDelegateAddress(e.target.value);
                setError("");
              }}
              placeholder="0x..."
              outlined
              className="text-sm"
              containerClassName="border-pinto-green"
            />
            {error && <span className="pinto-sm text-red-500">{error}</span>}
          </div>

          <div className="pinto-sm text-pinto-light">
            Enter the address where you want your referral reward Pods to be sent. You can reset to your own address by
            clicking "Reset to My Address".
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleSubmit} disabled={isPending || isConfirming || !isValidAddress} className="w-full">
              {isPending || isConfirming ? "Confirming..." : "Update Delegate"}
            </Button>

            <Button onClick={handleReset} variant="outline" disabled={isPending || isConfirming} className="w-full">
              Reset to My Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
