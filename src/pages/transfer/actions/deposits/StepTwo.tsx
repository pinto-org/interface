import { ComboInputField } from "@/components/ComboInputField";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { DepositTransferData } from "../TransferDeposits";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Token } from "@/utils/types";
import { TokenValue } from "@/classes/TokenValue";
import DepositSelect from "@/components/DepositSelect";
import { Label } from "@/components/ui/Label";

interface StepTwoProps {
    transferData: DepositTransferData[];
    setTransferData: Dispatch<SetStateAction<DepositTransferData[]>>;
}

export default function StepTwo({ transferData, setTransferData }: StepTwoProps) {

    const depositedBalances = useFarmerDepositedBalances();
    const depositedData = [...depositedBalances.data.entries()]
        .map(([token, depositData]) => ({ token, depositData }));

    const tokenAndBalanceMap = new Map<Token, TokenValue>();
    for (const deposit of depositedData) {
        if (deposit.depositData.amount.gt(0)) {
            tokenAndBalanceMap.set(deposit.token, deposit.depositData.amount);
        }
    }

    // Handle amount change for a specific transfer data entry
    const handleAmountChange = useCallback((index: number) => (newAmount: string) => {
        setTransferData(prev => {
            const updatedData = [...prev];
            if (updatedData[index]) {
                updatedData[index] = {
                    ...updatedData[index],
                    amount: newAmount,
                    // Preserve existing deposits when only amount changes
                    deposits: updatedData[index].deposits
                };
            }
            return updatedData;
        });
    }, [setTransferData]);

        // Calculate new transfer data when token changes
        const calculateNewTransferData = useCallback((
            currentTransferData: DepositTransferData[],
            newToken: Token,
            index: number
        ): DepositTransferData[] => {
            // Check for duplicate tokens
            const existingIndex = currentTransferData.findIndex(
                (item, i) => i !== index && item.token.address.toLowerCase() === newToken.address.toLowerCase()
            );
    
            if (existingIndex !== -1) {
                // Remove duplicate entry
                return currentTransferData.filter((_, i) => i !== index);
            }
    
            // Get deposit data for the new token
            const newTokenDeposits = depositedBalances.data.get(newToken);
            if (!newTokenDeposits) {
                return currentTransferData; // Return unchanged if no deposits found
            }
    
            // Calculate total amount from all deposits
            const totalAmount = newTokenDeposits.deposits.reduce(
                (sum, deposit) => deposit.amount.add(sum),
                TokenValue.ZERO
              ).toHuman();
    
            // Create new transfer data array
            return currentTransferData.map((item, i) => 
                i === index 
                    ? {
                        token: newToken,
                        amount: totalAmount,
                        deposits: newTokenDeposits.deposits
                    }
                    : item
            );
        }, [depositedBalances.data]);

    // Handle token change for a specific transfer data entry
    const handleTokenChange = useCallback((index: number) => (newToken: Token) => {
        const newTransferData = calculateNewTransferData(transferData, newToken, index);
        setTransferData(newTransferData);
    }, [transferData, calculateNewTransferData, setTransferData]);

    return (
        <div>
            {transferData.map((data, index) => (
                <div 
                    className="flex flex-col gap-2" 
                    key={`depositSelect_${data.token.address}_${index}`}
                >
                    <div className="flex flex-row items-center justify-between">
                        <Label className="font-[400]">
                            Amount of Deposited {data.token.name} to send
                        </Label>
                        <DepositSelect 
                            setTransferData={setTransferData}
                            token={data.token}
                        />
                    </div>
                    <ComboInputField 
                        key={`depositInput_${data.token.address}_${index}`}
                        setToken={(token) => handleTokenChange(index)(token)}
                        selectedToken={data.token}
                        amount={data.amount}
                        setAmount={(amount) => handleAmountChange(index)(amount)}
                        tokenAndBalanceMap={tokenAndBalanceMap}
                        altText={`Deposited ${data.token.name} Balance:`}
                    />
                </div>
            ))}
        </div>
    )
}