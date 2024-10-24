import { BaseError, erc20Abi } from "viem";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { beanstalkAddress } from "@/generated/contractHooks";
import { Button } from "./ui/Button";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TokenValue } from "@/classes/TokenValue";
import { Token } from "@/utils/types";
import useTokenData from "@/state/useTokenData";
import { toast } from "sonner";

interface SmartSubmitButton {
    token: Token, 
    amount: any, 
    submitFunction: () => void,
    submitButtonText?: string,
    className?: string 
}

export default function SmartSubmitButton({ token, amount, submitFunction, submitButtonText, className }: SmartSubmitButton) {

    const account = useAccount();
    const chainId = useChainId();
    const queryClient = useQueryClient();
    const ETH = useTokenData().nativeToken;

    const { data: hash, isPending, writeContractAsync } = useWriteContract();
    const { data: allowance, queryKey } = useReadContract({
        abi: erc20Abi,
        address: token.address,
        functionName: "allowance",
        args: [account.address!, beanstalkAddress[chainId as keyof typeof beanstalkAddress]],
        query: {
          enabled: !!account.address && !!token && token !== ETH,
        },
    });
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed) {
          // invalidating query results to trigger a refetch
          queryClient.invalidateQueries({ queryKey });
        }
    }, [isConfirmed, queryKey]);

    const needsApproval = token.isNative ? false : allowance === 0n ? true : Number(amount) > Number(TokenValue.fromBlockchain(allowance || 0, token.decimals).toHuman());
    
    function approveOrRun() {
        if (needsApproval) {
            const tx = () => writeContractAsync({
                abi: erc20Abi,
                address: token.address,
                functionName: "approve",
                args: [beanstalkAddress[chainId as keyof typeof beanstalkAddress], TokenValue.fromHuman(amount, token.decimals).toBigInt()],
            });

            toast.promise(tx, {
                loading: "Submitting transaction...",
                success: (data) => {
                  return `Transaction complete!`
                },
                error: (error) => {
                  return ((error as BaseError).shortMessage || `Transaction failed.`)
                }
              });
        } else {
            submitFunction()
        };
    };

    return (
        <Button type={"button"} disabled={isConfirming} className={`flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem] ${className}`} onClick={() => approveOrRun()}>
            {isConfirming ? "Sending Transaction" : account.address && needsApproval ? "Approve Spending" : (submitButtonText || "Submit")}
        </Button>
    )
}