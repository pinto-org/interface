import { TokenValue } from "@/classes/TokenValue";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useTokenData from "@/state/useTokenData";
import { FarmFromMode, FarmToMode } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Address, BaseError } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { ComboInputField } from "./ComboInputField";
import { LeftArrowIcon, UpDownArrowsIcon } from "./Icons";
import SmartSubmitButton from "./SmartSubmitButton";
import { Button } from "./ui/Button";
import { CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Label } from "./ui/Label";
import { Separator } from "./ui/Separator";

export default function WalletButtonTransfer({
  setShowTransfer,
}: { setShowTransfer: React.Dispatch<React.SetStateAction<boolean>> }) {
  const chainId = useChainId();
  const account = useAccount();

  const { queryKeys } = useFarmerBalances();

  const mainToken = useTokenData().mainToken;
  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState<FarmFromMode>(FarmFromMode.EXTERNAL);

  const queryClient = useQueryClient();
  const { data: hash, writeContractAsync, isSuccess } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      // invalidating query results to trigger a refetch
      queryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
    }
  }, [isSuccess, queryKeys]);

  async function onSubmit() {
    if (!chainId || !account.address || !amountIn || Number(amountIn) <= 0) return;

    const fromMode = balanceFrom;
    const toMode = balanceFrom === FarmFromMode.EXTERNAL ? FarmToMode.INTERNAL : FarmToMode.EXTERNAL;
    const amount = TokenValue.fromHuman(amountIn, tokenIn.decimals);

    const tx = () =>
      writeContractAsync({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress] as Address,
        abi: beanstalkAbi,
        functionName: "transferToken",
        args: [tokenIn.address, account.address as Address, amount.toBigInt(), Number(fromMode), Number(toMode)],
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

  return (
    <>
      <CardHeader className="flex flex-col gap-4 p-6 pb-10">
        <div className="flex flex-col gap-4">
          <Button
            variant={"outline"}
            className="rounded-full h-12 w-12 p-0 hover:cursor-pointer rotate-180"
            onClick={() => setShowTransfer(false)}
          >
            <LeftArrowIcon />
          </Button>
          <div className="text-black text-[1.25rem] font-[400]">Transfer Tokens</div>
          <div className="text-[1.25rem] text-pinto-gray-4 font-[340]">
            Move tokens between your Wallet and your Farm Balance.
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 -mt-4 pb-0 px-6">
        <Separator className="w-full mb-6" />
        <div className="flex flex-col gap-6 my-6">
          <div className="flex flex-row justify-between">
            <span className="text-pinto-gray-4 font-[340] text-[1.25rem]">From:</span>
            <span className="text-black font-[400] text-[1.25rem]">
              {balanceFrom === FarmFromMode.EXTERNAL ? "Wallet Balance" : "Farm Balance"}
            </span>
          </div>
          <Button
            variant={"outline"}
            className="rounded-full h-12 w-12 p-0 border-none self-center hover:cursor-pointer"
            onClick={
              balanceFrom === FarmFromMode.EXTERNAL
                ? () => setBalanceFrom(FarmFromMode.INTERNAL)
                : () => setBalanceFrom(FarmFromMode.EXTERNAL)
            }
          >
            <UpDownArrowsIcon />
          </Button>
          <div className="flex flex-row justify-between">
            <span className="text-pinto-gray-4 font-[340] text-[1.25rem]">To:</span>
            <span className="text-black font-[400] text-[1.25rem]">
              {balanceFrom === FarmFromMode.EXTERNAL ? "Farm Balance" : "Wallet Balance"}
            </span>
          </div>
        </div>
        <div className="mt-8">
          <Label className="font-[340]">Amount and Token to Transfer</Label>
          <ComboInputField
            amount={amountIn}
            setAmount={setAmountIn}
            setToken={setTokenIn}
            setBalanceFrom={setBalanceFrom}
            selectedToken={tokenIn}
            balanceFrom={balanceFrom}
            balancesToShow={[FarmFromMode.EXTERNAL, FarmFromMode.INTERNAL]}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col flex-grow justify-end gap-4">
        <Separator className="w-full" />
        <div className="font-[340] text-[1.25rem] text-center">
          {`Transfer ${Number(amountIn)} ${tokenIn.symbol} from your ${balanceFrom === FarmFromMode.EXTERNAL ? "Wallet" : "Farm Balance"} to your ${balanceFrom === FarmFromMode.EXTERNAL ? "Farm Balance" : "Wallet"}.`}
        </div>
        <SmartSubmitButton
          token={tokenIn}
          amount={amountIn}
          submitFunction={onSubmit}
          submitButtonText="Transfer"
          className={"w-full h-[3.625rem] grow-0"}
        />
      </CardFooter>
    </>
  );
}
