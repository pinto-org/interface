import plotIcon from "@/assets/protocol/Plot.svg";
import seedsIcon from "@/assets/protocol/Seed-default.png";
import stalkIcon from "@/assets/protocol/Stalk-default.png";
import { TokenValue } from "@/classes/TokenValue";
import AddressInputField from "@/components/AddressInputField";
import AddressLink from "@/components/AddressLink";
import { ChevronDownIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { useFarmerField } from "@/state/useFarmerField";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { type Address, type BaseError, encodeFunctionData } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";

export default function TransferAll() {
  const account = useAccount();
  const chainId = useChainId();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | undefined>();

  const farmerBalances = useFarmerBalances();
  const balancesToSend = [...farmerBalances.balances].map(([token, balance]) => ({ token, balance }));

  const farmerSilo = useFarmerSilo();
  const farmerField = useFarmerField();
  const farmerDeposits = useFarmerDepositedBalances();
  const depositsToSend = [...farmerDeposits.data].map(([token, deposit]) => ({ token, deposit }));

  const priceData = usePriceData();

  const isFirstStep = step === 1;
  const isFinalStep = step === 2;

  const hasBalance = balancesToSend
    .reduce((total, balanceToSend) => total.add(balanceToSend.balance.internal), TokenValue.ZERO)
    .gt(0);
  const hasPlots = farmerField.plots.length > 0;
  const hasDeposits =
    depositsToSend.reduce((total, depositToSend) => total + depositToSend.deposit.deposits.length, 0) > 0;

  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      for (const queryKey of farmerSilo.queryKeys) {
        queryClient.invalidateQueries({ queryKey });
      }
      farmerBalances.refetch();
      farmerField.refetch();
      farmerDeposits.refetch();
      navigate("/transfer");
    }
  }, [isSuccess, queryClient, farmerSilo, farmerBalances, farmerField, farmerDeposits, navigate]);

  function FinalStep() {
    return (
      <div className="flex flex-col gap-8">
        <Label className="font-[340] text-[1.25rem] -mb-4">I'm sending</Label>
        {hasBalance && (
          <div className="flex flex-col">
            <Label className="font-[340] text-[1.25rem]">Value in my Farm Balance:</Label>
            <div className="flex flex-wrap gap-x-4">
              {balancesToSend.map((tokenData) => {
                if (tokenData.balance.internal.eq(0)) return;
                return (
                  <div
                    key={`farmBalance_value_${tokenData.address}`}
                    className={"flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5"}
                  >
                    <img src={tokenData.token.logoURI} className="h-8 w-8" alt={tokenData.token.name} />
                    <span>{tokenData.balance.internal.reDecimal(2).toHuman()}</span>
                    <span>{tokenData.token.symbol}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {hasPlots && (
          <div className="flex flex-col">
            <Label className="font-[340] text-[1.25rem]">My Plots:</Label>
            {farmerField.plots.map((plot) => (
              <div
                key={`farmerField_plots_${plot.index.toHuman()}`}
                className={"flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5"}
              >
                <span>{plot.pods.reDecimal(2).toHuman()}</span>
                <img src={plotIcon} className="h-8 w-8" alt="Plot" />
                <span>Pods</span>
                <span className={"text-pinto-gray-3"}>@</span>
                <span className="font-[340] text-[2rem] text-pinto-gray-5">
                  {plot.index.reDecimal(2).toHuman()} in Line
                </span>
              </div>
            ))}
          </div>
        )}
        {hasDeposits && (
          <div>
            <Label className="font-[340] text-[1.25rem]">My Deposits:</Label>
            <div className="flex flex-row justify-between items-center py-1">
              <Label className="font-[340] text-[1.25rem]">Amount</Label>
              <div className="flex flex-col">
                {depositsToSend.map((tokenDeposit) => {
                  if (tokenDeposit.deposit.amount.eq(0)) return;
                  return (
                    <div key={`tokenDepositsToSend_${tokenDeposit.token.address}`} className="flex flex-col">
                      <div className="flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5 justify-end">
                        <img src={tokenDeposit.token.logoURI} className="h-8 w-8" alt={tokenDeposit.token.name} />
                        <span>{tokenDeposit.deposit.amount.reDecimal(3).toHuman()}</span>
                        <span>{tokenDeposit.token.symbol}</span>
                      </div>
                      <span className="text-right font-[340] text-[1rem] text-pinto-gray-4 -mt-2">{`$${Number(tokenDeposit.deposit.depositBDV.mul(priceData.price).toHuman()).toFixed(2)}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-row justify-between items-center py-1">
              <Label className="font-[340] text-[1.25rem]">Stalk</Label>
              <div className="flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5 justify-end">
                <img src={stalkIcon} className="h-8 w-8" alt="Stalk" />
                <span>{farmerSilo.activeStalkBalance.reDecimal(3).toHuman()}</span>
                <span>Stalk</span>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center py-1">
              <Label className="font-[340] text-[1.25rem]">Seeds</Label>
              <div className="flex flex-row gap-1.5 items-center font-[340] text-[2rem] text-pinto-gray-5 justify-end">
                <img src={seedsIcon} className="h-8 w-8" alt="Seeds" />
                <span>{farmerSilo.activeSeedsBalance.reDecimal(3).toHuman()}</span>
                <span>Seeds</span>
              </div>
            </div>
          </div>
        )}
        <div>
          <Label>To the following address</Label>
          <AddressLink address={destination} />
        </div>
      </div>
    );
  }

  function onSubmit() {
    if (!account.address || !destination) return;

    const farmData: `0x${string}`[] = [];

    // Farm Balance Transfers
    for (const balanceData of balancesToSend) {
      if (balanceData.balance.internal.eq(0)) continue;
      const balanceTransferCall = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "transferToken",
        args: [
          balanceData.token.address,
          destination as Address,
          balanceData.balance.internal.toBigInt(),
          Number(FarmFromMode.INTERNAL),
          Number(FarmToMode.INTERNAL),
        ],
      });
      farmData.push(balanceTransferCall);
    }

    // Deposit Transfers
    for (const depositData of depositsToSend) {
      if (depositData.deposit.amount.eq(0)) continue;
      const stems = depositData.deposit.deposits.map((crate) => crate.stem.toBigInt());
      const amounts = depositData.deposit.deposits.map((crate) => crate.amount.toBigInt());
      const depositTransferCall = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "transferDeposits",
        args: [account.address, destination as Address, depositData.token.address, stems, amounts],
      });
      farmData.push(depositTransferCall);
    }

    // Plot Transfers
    if (hasPlots) {
      // todo: add support for more than one plot line
      const fieldId = BigInt(0);
      const ids: bigint[] = [];
      const starts: bigint[] = [];
      const ends: bigint[] = [];
      for (const plotData of farmerField.plots) {
        ids.push(plotData.index.toBigInt());
        starts.push(BigInt(0));
        ends.push(plotData.pods.toBigInt());
      }
      const plotTransferCall = encodeFunctionData({
        abi: beanstalkAbi,
        functionName: "transferPlots",
        args: [
          account.address,
          destination as Address,
          fieldId,
          ids, //plot ids
          starts, // starts
          ends, // ends
        ],
      });
      farmData.push(plotTransferCall);
    }

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "farm",
        args: [farmData],
      });

    toast.promise(tx, {
      loading: "Transferring everything...",
      success: (data) => {
        return "Transfer complete!";
      },
      error: (error) => {
        return (error as BaseError).shortMessage || "Transfer failed.";
      },
    });
  }

  return (
    <div>
      <div className="font-[400] text-[1.25rem] text-pinto-gray-5 mb-6">
        {step <= 1 ? "1 → Send everything, specify address" : "2 → Confirm transfer"}
      </div>
      {step <= 1 ? (
        <>
          <Label>Send everything to</Label>
          <AddressInputField value={destination} setValue={setDestination} />
        </>
      ) : (
        <FinalStep />
      )}
      {destination && (
        <div className="mt-6 flex flex-col gap-6">
          <Separator />
          <div className="flex flex-row justify-between">
            <Button
              onClick={() => (isFirstStep ? setStep(2) : onSubmit())}
              className="rounded-full font-[340] text-[2rem] px-6 h-16"
            >
              {isFirstStep ? "Continue" : "Send"}
            </Button>
            <div className="flex flex-row items-center gap-[1px]">
              <Button
                disabled={isFirstStep}
                onClick={() => setStep(1)}
                className="rounded-l-full rounded-r-none h-16 px-6 disabled:text-white/10 disabled:grayscale-0"
              >
                <div className="scale-[2]">
                  <ChevronDownIcon color={"currentColor"} />
                </div>
              </Button>
              <Button
                disabled={isFinalStep}
                onClick={() => setStep(2)}
                className="rounded-l-none rounded-r-full h-16 px-6 disabled:text-white/10 disabled:grayscale-0"
              >
                <div className="rotate-180 scale-[2] mt-1.5">
                  <ChevronDownIcon color={"currentColor"} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
