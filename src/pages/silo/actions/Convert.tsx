import { useEffect, useState } from "react";
import TokenSelectDepositedBalances from "@/components/TokenSelectDepositedBalances";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { beanstalkAbi, beanstalkAddress, useReadBeanstalk_GetAmountOut } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "@/state/useTokenData";
import { Label } from "@/components/ui/Label";
import { ComboInputField } from "@/components/ComboInputField";
import SlippageButton from "@/components/SlippageButton";
import { Button } from "@/components/ui/Button";
import { useWriteContract } from "wagmi";
import { calculateConvertData, sortAndPickCrates } from "@/utils/convert";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useChainId } from "wagmi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { BaseError } from "viem";

function Convert() {

  const chainId = useChainId();

  const BEAN = useTokenData().mainToken;
  const WELL = useTokenData().lpTokens[0];
  const [fromToken, setFromToken] = useState(WELL);
  const [toToken, setToToken] = useState(BEAN);
  const [amountIn, setAmountIn] = useState(0);
  const [slippage, setSlippage] = useState(0.1);

  function changeAmountIn(value: number) {
    setAmountIn(value)
  };

  const queryClient = useQueryClient();
  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();
  const deposits = farmerDeposits.get(fromToken).deposits;
  
  //@ts-ignore
  const estimatedAmountOut =
    useReadBeanstalk_GetAmountOut({
      args: [
        fromToken.address,
        toToken.address,
        TokenValue.fromHuman(amountIn || 0, fromToken.decimals).toBigInt(),
      ],
      query: {
        enabled: !!amountIn && amountIn > 0,
      },
    }).data || 0n;

  const minAmountOut = TokenValue.fromBlockchain(estimatedAmountOut, toToken.decimals).subSlippage(slippage);

  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    };
  }, [isSuccess, queryKey]);

  async function onSubmit() {

    const depositCrates = sortAndPickCrates(
      "convert",
      TokenValue.fromHuman(amountIn, fromToken.decimals),
      deposits,
      toToken,
    );

    const stems = depositCrates.crates.map((crate) => crate.stem.toBlockchain());
    const amounts = depositCrates.crates.map((crate) => crate.amount.toBlockchain());

    const convertData = calculateConvertData(
      fromToken,
      toToken,
      TokenValue.fromHuman(amountIn, fromToken.decimals),
      minAmountOut
    );
    
    if (convertData && stems && stems.length > 0 && amounts && amounts.length > 0) {
      const tx = () => writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "convert",
        args: [convertData, stems, amounts],
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
    };
    // const output = calculateConvert(fromToken, toToken, TokenValue.fromHuman(amountIn || 0, fromToken.decimals), deposits.deposits, season);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Label>Amount</Label>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField 
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={setFromToken} 
          selectedToken={fromToken}
          setMaxAmount={changeAmountIn}
          useSiloTokens
        />                        
      </div>
      <div className="flex flex-row justify-between">
        <Label className="content-center">Convert to</Label>
        <TokenSelectDepositedBalances 
          setToken={setToToken} 
          selectedToken={toToken}
        />
      </div>
      <div className="flex flex-row gap-2">
        <Button type="button" className="w-full flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem]" onClick={onSubmit} disabled={fromToken.address === toToken.address}>
          Convert
        </Button>
      </div>
    </div>
  );
}

export default Convert;
