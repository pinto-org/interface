import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { useChainId } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { AdvancedFarmCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import useTokenData from "@/state/useTokenData";
import TokenSelectDepositedBalances from "@/components/TokenSelectDepositedBalances";
import { Label } from "@/components/ui/Label";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import SlippageButton from "@/components/SlippageButton";
import { ComboInputField } from "@/components/ComboInputField";
import { PoolData, usePriceData } from "@/state/usePriceData";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import deposit from "@/encoders/deposit";
import { toast } from "sonner";
import { BaseError } from "viem";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";

function Deposit() {
  // silo - deposit
  const chainId = useChainId();
  const depositedBalances = useFarmerDepositedBalances();
  const queryKey = depositedBalances.queryKey;
  
  const mainToken = useTokenData().mainToken;
  const ETH = useTokenData().nativeToken;
  const [amountIn, setAmountIn] = useState(0);
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [intToken, setIntToken] = useState<Token | undefined>(undefined);
  const [pool, setPool] = useState<PoolData | undefined>(undefined);
  const [siloToken, setSiloToken] = useState(mainToken);
  const [slippage, setSlippage] = useState(0.5);
  
  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  const pools = usePriceData().pools;

  const useSwap = !(tokenIn.address === mainToken.address || tokenIn.isLP);
  
  useEffect(() => {
    if (siloToken.address === mainToken.address) {
      const intermediateToken = pools[0]?.tokens.find((token) => token.address !== mainToken.address);
      setIntToken(intermediateToken);
      setPool(undefined);
    } else {
      for (const pool of pools) {
        if (pool.pool?.address && pool.pool?.address === siloToken.address) {
          const intermediateToken = pool.tokens.find((token) => token.address !== mainToken.address);
          setIntToken(intermediateToken);
          setPool(pool);
          break;
        };
      };
    };
  }, [tokenIn, siloToken]);

  function changeAmountIn(value: number) {
    setAmountIn(value)
  };

  const swapData = useSwapEstimate(
    tokenIn,
    siloToken.address === mainToken.address ? mainToken : intToken || ETH,
    amountIn,
    slippage,
    "exactInput",
    balanceFrom,
    FarmToMode.INTERNAL,
    useSwap ? pool : undefined,
    (!useSwap && !intToken)
  );

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    };
  }, [isSuccess, queryKey]);

    function onSubmit() {
    const depositData = deposit(
      siloToken,
      useSwap ? swapData?.output : TokenValue.fromHuman(amountIn, tokenIn.decimals),
      useSwap ? FarmFromMode.INTERNAL : balanceFrom
    ) as AdvancedFarmCall;

    if (useSwap && swapData?.callData) {
      swapData?.callData.push(depositData);
    };

    const callData = useSwap && swapData?.callData ? swapData.callData : [depositData]
    
    const tx = () => writeContractAsync({
      address: beanstalkAddress[chainId],
      abi: beanstalkAbi,
      functionName: "advancedFarm",
      args: [callData],
      value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n
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

  return (
    <Card className="max-w-96 h-fit">
      <CardHeader>
        <CardTitle>Deposit</CardTitle>
        <CardDescription>Deposit a token into the Silo</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label>Amount</Label>
          <ComboInputField
            amount={amountIn}
            setAmount={setAmountIn}
            setToken={setTokenIn}
            setBalanceFrom={setBalanceFrom} 
            selectedToken={tokenIn}
            balanceFrom={balanceFrom}
            setMaxAmount={changeAmountIn}
          />
        </div>
        <div className="flex flex-row justify-between">
          <Label className="content-center">Deposit to</Label>
          <TokenSelectDepositedBalances 
            setToken={setSiloToken}
            selectedToken={siloToken}
          />
        </div>
        <div className="flex flex-row gap-2">
          <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit}/>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
      </CardContent>
    </Card>
  );
}

export default Deposit;
