import { Col, Row } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  useSimulateBeanstalk_DelegateReferralRewards,
  useWriteBeanstalk_DelegateReferralRewards,
} from "@/generated/contractHooks";
import { getExplorerLink } from "@/utils/chain";
import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons";
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

  if (!isOpen) return null;

  return (
    <Col className="h-auto w-full">
      <div className="flex flex-col gap-6">
        {/* Title and separator */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="pinto-body font-medium text-pinto-secondary mb-4">📍 Change Pod Destination Address</div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-pinto-light hover:text-pinto-dark transition-colors p-1 -mt-1 -mr-1"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[1px] w-full bg-pinto-gray-2" />
        </div>

        {/* Form Section */}
        <Col className="gap-6 pinto-sm-light text-pinto-light">
          <div className="flex flex-col gap-2">
            <Label variant="form">Delegate Address</Label>
            <Input
              value={delegateAddress}
              onChange={(e) => {
                setDelegateAddress(e.target.value);
                setError("");
              }}
              placeholder="0x..."
              outlined
            />
            {error && <span className="pinto-sm text-pinto-red-2">{error}</span>}
          </div>

          <div className="pinto-sm-light text-pinto-light">
            Enter the address where you want your referral reward Pods to be sent.
          </div>
        </Col>

        {/* Action Buttons */}
        <Row className="gap-4 w-full">
          <Button
            onClick={handleReset}
            variant="outline"
            size="xlargest"
            rounded="full"
            disabled={isPending || isConfirming}
            className="w-full flex-1 text-pinto-light bg-pinto-gray-1"
          >
            Reset Delegate
          </Button>

          <Button
            onClick={handleSubmit}
            size="xlargest"
            rounded="full"
            disabled={isPending || isConfirming || !isValidAddress}
            className={`w-full flex-1 ${
              isPending || isConfirming ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"
            }`}
          >
            {isPending || isConfirming ? "Confirming..." : "Update Delegate"}
          </Button>
        </Row>
      </div>
    </Col>
  );
}
