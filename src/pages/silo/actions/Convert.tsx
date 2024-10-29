import { useEffect, useState } from "react";
import {
  beanstalkAbi,
  beanstalkAddress,
  useReadBeanstalk_GetAmountOut,
  useReadSilo_GetAmountOut,
} from "@/generated/contractHooks";
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
import { Token } from "@/utils/types";
import TokenSelectWithBalances from "@/components/TokenSelectWithBalances";

function Convert({ siloToken }: { siloToken: Token }) {
  const chainId = useChainId();

  const tokenData = useTokenData();
  const convertDestinations = [tokenData.mainToken, ...tokenData.lpTokens].filter(
    (token) => token.address.toLowerCase() !== siloToken.address.toLowerCase(),
  );

  const [fromToken, setFromToken] = useState(siloToken);
  const [toToken, setToToken] = useState(convertDestinations[0]);
  const [amountIn, setAmountIn] = useState(0);
  const [slippage, setSlippage] = useState(0.1);

  const queryClient = useQueryClient();
  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();

  const farmerDepositData = farmerDeposits.get(fromToken);
  const deposits = farmerDepositData?.deposits;
  const convertData = new Map<Token, TokenValue>();
  for (const convertDestination of convertDestinations) {
    const _depositData = farmerDeposits.get(convertDestination);
    convertData.set(convertDestination, _depositData ? _depositData.convertibleAmount : TokenValue.ZERO);
  }

  const estimatedAmountOut =
    useReadSilo_GetAmountOut({
      args: [fromToken.address, toToken.address, TokenValue.fromHuman(amountIn || 0, fromToken.decimals).toBigInt()],
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
    }
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
      minAmountOut,
    );

    if (convertData && stems && stems.length > 0 && amounts && amounts.length > 0) {
      const tx = () =>
        writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "convert",
          args: [convertData, stems, amounts],
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
    }
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
          tokenAndBalanceMap={convertData}
          disableButton
        />
      </div>
      <div className="flex flex-row justify-between">
        <Label className="content-center">Convert to</Label>
        <TokenSelectWithBalances
          setToken={setToToken}
          selectedToken={toToken}
          tokenAndBalanceMap={convertData}
          size="small"
        />
      </div>
      <div className="flex flex-row gap-2">
        <Button
          type="button"
          className="w-full flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem]"
          onClick={onSubmit}
          disabled={fromToken.address === toToken.address}
        >
          Convert
        </Button>
      </div>
    </div>
  );
}

export default Convert;
