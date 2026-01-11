import { Col } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import { isAddress } from "viem";
import { useChainId } from "wagmi";

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

  // Transaction handling
  const { writeWithEstimateGas, setSubmitting, isConfirming } = useTransaction({
    successCallback: () => {
      setDelegateAddress("");
      onOpenChange(false);
    },
    successMessage: "Delegation updated successfully",
    errorMessage: "Failed to update delegation",
  });

  const handleSubmit = async () => {
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

    try {
      setSubmitting(true);
      toast.loading("Updating delegate address");

      await writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "delegateReferralRewards",
        args: [delegateAddress as `0x${string}`],
      });
    } catch (e) {
      console.error("Failed to update delegation:", e);
      toast.dismiss();
      toast.error("Failed to update delegation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    setError("");

    try {
      setSubmitting(true);
      toast.loading("Resetting delegate address...");

      await writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "delegateReferralRewards",
        args: ["0x0000000000000000000000000000000000000000" as `0x${string}`],
      });
    } catch (e) {
      console.error("Failed to reset delegate address:", e);
      toast.dismiss();
      toast.error("Failed to reset delegate address");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Col className="h-auto w-full">
      <div className="flex flex-col gap-6">
        {/* Title and separator */}

        {/* Form Section */}
        <Col className="gap-6 pinto-sm-light text-pinto-light">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label variant="form">Delegate To:</Label>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-pinto-light hover:text-pinto-dark transition-colors p-1 -mt-1 -mr-1"
              >
                <Cross2Icon className="w-4 h-4" />
              </button>
            </div>
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
            <button
              type="button"
              onClick={handleReset}
              disabled={isConfirming}
              className="pinto-sm text-pinto-green-4 hover:text-pinto-green-3 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Delegation
            </button>
          </div>

          <div className="pinto-sm-light text-pinto-light">
            Farmers are able to delegate their referral to a different address. Pods will be sent to the delegated
            address. Your referral code will change to reflect the new delegated address.
          </div>
        </Col>

        {/* Action Button */}
        <Button
          onClick={handleSubmit}
          size="xlargest"
          rounded="full"
          disabled={isConfirming || !isValidAddress}
          className={`w-full ${isConfirming ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"}`}
        >
          {isConfirming ? "Confirming..." : "Delegate"}
        </Button>
      </div>
    </Col>
  );
}
