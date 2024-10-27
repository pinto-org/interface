import { FarmFromMode, Token } from "@/utils/types";
import TokenSelectWithBalances from "./TokenSelectWithBalances";
import { Button } from "./ui/Button";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { TokenValue } from "@/classes/TokenValue";
import useDebounce from "@/utils/useDebounce";
import { Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import { Skeleton } from "./ui/Skeleton";

export interface ComboInputProps extends InputHTMLAttributes<HTMLInputElement> {
    setToken: Dispatch<SetStateAction<any>>, 
    selectedToken: Token,
    tokenAndBalanceMap?: Map<Token, TokenValue>| undefined,
    setBalanceFrom?: Dispatch<SetStateAction<any>> | undefined, 
    balanceFrom?: FarmFromMode | undefined,
    amount: any,
    setAmount: Dispatch<SetStateAction<any>>,
    isLoading?: boolean,
    hideMax?: boolean,
    disableInput?: boolean,
    disableInlineBalance?: boolean,
    balancesToShow?: FarmFromMode[] | undefined
}

function ComboInputField({setToken, selectedToken, tokenAndBalanceMap, setBalanceFrom, balanceFrom, amount, setAmount, isLoading, hideMax, disableInput, disableInlineBalance, balancesToShow}: ComboInputProps) {

    let maxAmount;
    const { balances } = useFarmerBalances();
    const depositTokenBalance = balances.get(selectedToken);
    const [internalAmount, setInternalAmount] = useState(amount);

    if (tokenAndBalanceMap) {
        maxAmount = tokenAndBalanceMap.get(selectedToken) ?? TokenValue.ZERO;
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
            <div className="border border-pinto-gray-blue content-center bg-white transition-colors py-4 px-6 rounded-[0.75rem] focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                        {isLoading 
                            ? <Skeleton className="flex w-full h-8 rounded-[0.75rem]" />
                            : <input 
                                min={0} 
                                type="number"
                                disabled={disableInput} 
                                className="flex w-full px-1 text-2xl text-black align-middle focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                value={disableInput ? amount : internalAmount}
                                onChange={(e) => setInternalAmount(e.target.value)}
                            />
                        }
                        <TokenSelectWithBalances setToken={setToken} selectedToken={selectedToken} setBalanceFrom={setBalanceFrom} balanceFrom={balanceFrom} balancesToShow={balancesToShow} tokenAndBalanceMap={tokenAndBalanceMap} />
                    </div>
                    {!disableInlineBalance && 
                    <div className="flex flex-row gap-2 justify-end items-center">
                        <div className="text-[1rem] text-black font-[340] leading-[1.11rem] -tracking-[0.02em]">
                            {`${balanceFrom === FarmFromMode.EXTERNAL 
                                    ? 'Wallet Balance:' 
                                : balanceFrom === FarmFromMode.INTERNAL 
                                    ? 'Farm Balance:' 
                                    : 'Total Balance:'} 
                            ${maxAmount?.toHuman("short")}`}
                        </div>
                        {!hideMax && 
                            <Button type={"button"} size={"sm"} variant={"defaultAlt"} className={"rounded-[0.75rem] text-[1rem] px-1.5 py-1"} onClick={() => setInternalAmount(maxAmount.humanString)}>Max</Button>
                        }
                    </div>
                    }
                </div>
            </div>
        </>
    )
}

ComboInputField.displayName = "ComboInput";

export { ComboInputField }