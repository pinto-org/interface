import { encodeFunctionData } from "viem";
import { TokenValue } from "@/classes/TokenValue";
import { FarmFromMode, Token } from "@/utils/types";
import { beanstalkAbi } from "@/generated/contractHooks";
import { Clipboard } from "@/classes/Clipboard";

export default function deposit(
    siloToken?: Token, 
    amount?: TokenValue, 
    balanceFrom?: FarmFromMode, 
    clipboard?: `0x${string}`
) {
    if (!siloToken || !amount || !balanceFrom) {
        return ({
            callData: '0x' as `0x${string}`,
            clipboard: Clipboard.encode([])
        });
    };

    const data = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "deposit",
        args: [
            siloToken.address,
            amount.toBigInt(),
            Number(balanceFrom)
        ]
    });

    return ({
        callData: data,
        clipboard: clipboard || Clipboard.encode([])
    });
};