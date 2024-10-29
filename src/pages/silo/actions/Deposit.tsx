import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { useChainId } from "wagmi";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";
import { AdvancedFarmCall, FarmFromMode, FarmToMode, Token } from "@/utils/types";
import useTokenData from "@/state/useTokenData";
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

function Deposit({ siloToken }: { siloToken: Token }) {
  // silo - deposit
  const chainId = useChainId();
  const depositedBalances = useFarmerDepositedBalances();
  const queryKey = depositedBalances.queryKey;

  const mainToken = useTokenData().mainToken;
  const [amountIn, setAmountIn] = useState(0);
  const [tokenIn, setTokenIn] = useState(siloToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [pool, setPool] = useState<PoolData | undefined>(undefined);
  const [slippage, setSlippage] = useState(0.5);

  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  const pools = usePriceData().pools;

  const useSwap = !(tokenIn.address.toLowerCase() === siloToken.address.toLowerCase());

  useEffect(() => {
    if (siloToken.address === mainToken.address) {
      setPool(undefined);
    } else {
      for (const pool of pools) {
        if (pool.pool?.address && pool.pool?.address === siloToken.address) {
          setPool(pool);
          break;
        }
      }
    }
  }, [mainToken, pools, siloToken]);

  const swapData = useSwapEstimate(
    tokenIn,
    siloToken,
    amountIn,
    slippage,
    "exactInput",
    balanceFrom,
    FarmToMode.INTERNAL,
    useSwap ? pool : undefined,
    !useSwap,
  );

  console.log("swapdata: ", swapData)

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess, queryKey, queryClient.invalidateQueries]);

  function onSubmit() {
    console.log("USESWAP: ", useSwap, swapData?.output)
    const depositData = deposit(
      siloToken,
      useSwap ? swapData?.output : TokenValue.fromHuman(amountIn, tokenIn.decimals),
      useSwap ? FarmFromMode.INTERNAL : balanceFrom,
    ) as AdvancedFarmCall;

    if (useSwap && swapData?.callData) {
      swapData?.callData.push(depositData);
    }

    const callData = useSwap && swapData?.callData ? swapData.callData : [depositData];

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [callData],
        value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n,
      });

    toast.promise(tx, {
      loading: "Submitting transaction...",
      success: (data) => {
        return `Transaction complete!`;
      },
      error: (error) => {
        return (error as BaseError).shortMessage || `Transaction failed.`;
      },
    });

    depositedBalances.refetch();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <Label>Amount and Token to use</Label>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={setTokenIn}
          setBalanceFrom={setBalanceFrom}
          selectedToken={tokenIn}
          balanceFrom={balanceFrom}
        />
      </div>
      <div className="flex flex-row gap-2">
        <SmartSubmitButton token={tokenIn} amount={amountIn} submitFunction={onSubmit} submitButtonText="Deposit" />
      </div>
    </div>
  );
}

export default Deposit;
