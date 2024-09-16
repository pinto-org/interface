import { FarmFromMode, Token } from "@/utils/types";
import TokenSelectWithBalances from "./TokenSelectWithBalances";
import { Button } from "./ui/Button";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { TokenValue } from "@/classes/TokenValue";
import useDebounce from "@/utils/useDebounce";
import { Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import { Skeleton } from "./ui/Skeleton";
import TokenSelectDepositedBalances from "./TokenSelectDepositedBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";

export interface ComboInputProps extends InputHTMLAttributes<HTMLInputElement> {
    setToken: Dispatch<SetStateAction<any>>, 
    selectedToken: Token, 
    setBalanceFrom?: Dispatch<SetStateAction<any>>, 
    balanceFrom?: FarmFromMode,
    amount: any,
    setAmount: Dispatch<SetStateAction<any>>,
    useSiloTokens?: boolean,
    isLoading?: boolean,
    setMaxAmount?: any,
    hideMax?: boolean,
    disableInput?: boolean
}

function ComboInputField({setToken, selectedToken, setBalanceFrom, balanceFrom, amount, setAmount, useSiloTokens, isLoading, setMaxAmount, hideMax, disableInput}: ComboInputProps) {

    let maxAmount;
    const { balances } = useFarmerBalances();
    const depositTokenBalance = balances.get(selectedToken);
    const [internalAmount, setInternalAmount] = useState(amount);

    const farmerDeposits = useFarmerDepositedBalances().data;

    if (useSiloTokens) {
        maxAmount = farmerDeposits.get(selectedToken).convertibleAmount;
    } else {
        switch (balanceFrom) {
        case FarmFromMode.EXTERNAL:
            maxAmount = depositTokenBalance?.external || TokenValue.ZERO;
            break;
        case FarmFromMode.INTERNAL:
            maxAmount = depositTokenBalance?.internal || TokenValue.ZERO;
            break;
        default:
            maxAmount = depositTokenBalance?.total || TokenValue.ZERO;
        }
    }

    useDebounce(() => { setAmount(internalAmount) }, [internalAmount], 500);

    return (
        <>
            <div className="border border-input content-center bg-transparent shadow-sm transition-colors p-2 rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                        {isLoading 
                            ? <Skeleton className="flex w-full h-8 rounded-md" />
                            : <input 
                                min={0} 
                                type="number"
                                disabled={disableInput} 
                                className="flex w-full px-1 text-2xl align-middle focus-visible:outline-none placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                value={internalAmount || amount}
                                onChange={(e) => setInternalAmount(e.target.value)}
                            />
                        }
                        {useSiloTokens 
                            ? <TokenSelectDepositedBalances setToken={setToken} selectedToken={selectedToken} />
                            : (setBalanceFrom && balanceFrom)
                                ? <TokenSelectWithBalances setToken={setToken} selectedToken={selectedToken} setBalanceFrom={setBalanceFrom} balanceFrom={balanceFrom} />
                                : <TokenSelectWithBalances setToken={setToken} selectedToken={selectedToken} />
                        }
                    </div>
                    <div className="flex flex-row gap-2 justify-end items-center">
                        <div className="text-sm">{`Balance: ${maxAmount?.toHuman("short")}`}</div>
                        {!hideMax && 
                            <Button type={"button"} variant={"outline"} size={"sm"} onClick={setMaxAmount ? () => setMaxAmount(maxAmount.humanString) : undefined}>Max</Button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

ComboInputField.displayName = "ComboInput";

export { ComboInputField }