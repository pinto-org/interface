import { Col, Row } from "@/components/Container";
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
    successMessage: "Delegate address updated successfully",
    errorMessage: "Failed to update delegate address",
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
      console.error("Failed to update delegate address:", e);
      toast.dismiss();
      toast.error("Failed to update delegate address");
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
            disabled={isConfirming}
            className="w-full flex-1 text-pinto-light bg-pinto-gray-1"
          >
            Reset Delegate
          </Button>

          <Button
            onClick={handleSubmit}
            size="xlargest"
            rounded="full"
            disabled={isConfirming || !isValidAddress}
            className={`w-full flex-1 ${
              isConfirming ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"
            }`}
          >
            {isConfirming ? "Confirming..." : "Update Delegate"}
          </Button>
        </Row>
      </div>
    </Col>
  );
}
