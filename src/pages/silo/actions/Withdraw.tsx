import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { sortAndPickCrates } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { stringToNumber } from "@/utils/string";
import { FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { estimateGas } from "@wagmi/core";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useConfig } from "wagmi";
import { useAccount, useChainId } from "wagmi";
import OutputDisplay from "@/components/OutputDisplay";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { useSiloData } from "@/state/useSiloData";

function Withdraw({ siloToken }: { siloToken: Token }) {
  const config = useConfig();
  const account = useAccount();
  const chainId = useChainId();
  const { data: farmerDeposits, queryKey: queryKey } = useFarmerDepositedBalances();
  const [fromToken, setFromToken] = useState(siloToken);
  const [destination, setDestination] = useState(FarmToMode.EXTERNAL);
  const [amount, setAmount] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tokenData: siloTokenData } = useSiloData();

  const farmerDepositData = farmerDeposits.get(fromToken);
  const deposits = farmerDepositData?.deposits;

  const convertData = new Map<Token, TokenValue>();
  convertData.set(fromToken, farmerDepositData ? farmerDepositData.convertibleAmount : TokenValue.ZERO);

  const queryClient = useQueryClient();

  const onSuccess = useCallback(() => {
    setAmount("0");
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const { isConfirming, writeContractAsync } = useTransaction({
    successMessage: "Withdraw successful",
    successCallback: onSuccess,
  });

  const onSubmit = async () => {
    if (!amount || Number(amount) <= 0 || !destination || !account.address || !deposits) return;

    try {
      setIsSubmitting(true);
      const amountTV = TokenValue.fromHuman(amount || 0, fromToken.decimals);
      toast.loading(`Withdrawing ${formatter.number(amountTV)} ${fromToken.symbol}...`);
      const transferData = sortAndPickCrates("withdraw", amountTV, deposits);

      const stems = transferData.crates.map((crate) => crate.stem.toBlockchain());
      const amounts = transferData.crates.map((crate) => crate.amount.toBlockchain());

      if (transferData.crates.length === 1) {
        const _gas = await estimateGas(config, {
          to: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          data: encodeFunctionData({
            abi: beanstalkAbi,
            functionName: "withdrawDeposit",
            args: [fromToken.address, BigInt(stems[0]), BigInt(amounts[0]), Number(destination)],
          }),
        });
        setIsSubmitting(false);
        return writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "withdrawDeposit",
          args: [fromToken.address, BigInt(stems[0]), BigInt(amounts[0]), Number(destination)],
          gas: _gas ? (_gas * 120n) / 100n : undefined,
        });
      } else if (transferData.crates.length > 1) {
        const _gas = await estimateGas(config, {
          to: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          data: encodeFunctionData({
            abi: beanstalkAbi,
            functionName: "withdrawDeposits",
            args: [fromToken.address, stems.map((s) => BigInt(s)), amounts.map((a) => BigInt(a)), Number(destination)],
          }),
        });
        setIsSubmitting(false);
        return writeContractAsync({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "withdrawDeposits",
          args: [fromToken.address, stems.map((s) => BigInt(s)), amounts.map((a) => BigInt(a)), Number(destination)],
          gas: _gas ? (_gas * 120n) / 100n : undefined,
        });
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      toast.dismiss();
      toast.error(e instanceof Error ? e.message : "Transaction failed.");
      throw e;
    }
  };

  const disabled = !stringToNumber(amount) || !account.address || isSubmitting || isConfirming;

  const getWithdrawOutput = useCallback(() => {
    if (!amount || Number(amount) <= 0 || !deposits) return null;

    const amountTV = TokenValue.fromHuman(amount, fromToken.decimals);
    const transferData = sortAndPickCrates("withdraw", amountTV, deposits);

    return {
      amount: amountTV,
      stalkLost: transferData.stalk,
      seedsLost: transferData.seeds,
    };
  }, [amount, deposits, fromToken, siloTokenData]);

  const withdrawOutput = getWithdrawOutput();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="h-10 flex items-center">
          <Label>Amount</Label>
        </div>
        <ComboInputField
          amount={amount}
          setAmount={setAmount}
          setToken={setFromToken}
          selectedToken={fromToken}
          tokenAndBalanceMap={convertData}
          disableButton
        />
      </div>
      <div className="flex flex-col">
        <Label className="flex h-10 items-center">Destination</Label>
        <DestinationBalanceSelect setBalanceTo={setDestination} balanceTo={destination} />
      </div>
      {withdrawOutput && (
        <OutputDisplay title="I receive">
          <OutputDisplay.Item label="Amount">
            <OutputDisplay.Value
              value={formatter.token(withdrawOutput.amount, fromToken)}
              token={fromToken}
              suffix={fromToken.symbol}
            />
          </OutputDisplay.Item>
          <OutputDisplay.Item label="Stalk">
            <OutputDisplay.Value
              value={formatter.twoDec(withdrawOutput.stalkLost)}
              suffix="Stalk"
              delta={-withdrawOutput.stalkLost.toNumber()}
              token={STALK}
              showArrow
            />
          </OutputDisplay.Item>
          <OutputDisplay.Item label="Seed">
            <OutputDisplay.Value
              value={formatter.twoDec(withdrawOutput.seedsLost)}
              suffix="Seed"
              delta={-withdrawOutput.seedsLost.toNumber()}
              token={SEEDS}
              showArrow
            />
          </OutputDisplay.Item>
        </OutputDisplay>
      )}
      <div>
        <Button
          className="w-full flex grow h-[3.75rem] rounded-[0.75rem] text-[1.5rem]"
          onClick={onSubmit}
          disabled={disabled}
        >
          {"Withdraw"}
        </Button>
      </div>
    </div>
  );
}

export default Withdraw;
