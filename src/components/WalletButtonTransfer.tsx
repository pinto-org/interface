import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useTransaction from "@/hooks/useTransaction";
import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useTokenData from "@/state/useTokenData";
import { trackClick, withTracking } from "@/utils/analytics";
import { toSafeTVFromHuman } from "@/utils/number";
import { stringToNumber } from "@/utils/string";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount, useChainId } from "wagmi";
import { ComboInputField } from "./ComboInputField";
import { LeftArrowIcon, UpDownArrowsIcon } from "./Icons";
import SmartSubmitButton from "./SmartSubmitButton";
import { Button } from "./ui/Button";
import { CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Separator } from "./ui/Separator";

const useFilterTokens = (balances: ReturnType<typeof useFarmerBalances>["balances"]) => {
  return useMemo(() => {
    const set = new Set<Token>();

    [...balances.keys()].forEach((token) => {
      if (token.isNative) {
        set.add(token);
      }
    });

    return set;
  }, [balances]);
};

export default function WalletButtonTransfer() {
  const chainId = useChainId();
  const account = useAccount();
  const [panelState, setPanelState] = useAtom(navbarPanelAtom);

  const { balances: balances, queryKeys: queryKeys } = useFarmerBalances();

  const mainToken = useTokenData().mainToken;
  const filteredTokens = useFilterTokens(balances);
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState(mainToken);
  const [balanceFrom, setBalanceFrom] = useState<FarmFromMode>(FarmFromMode.EXTERNAL);

  const queryClient = useQueryClient();
  const { writeWithEstimateGas, setSubmitting, submitting, isConfirming } = useTransaction({
    successCallback: () => {
      queryKeys.forEach((query) =>
        queryClient.invalidateQueries({
          queryKey: query,
        }),
      );
      setAmountIn("");
    },
    successMessage: "Transfer success",
    errorMessage: "Transfer failed",
  });

  async function onSubmit() {
    // Track transfer submission
    trackClick(ANALYTICS_EVENTS.WALLET.TRANSFER_SUBMIT)();

    setSubmitting(true);
    toast.loading("Transferring...");
    try {
      if (!account.address) {
        throw new Error("Signer required");
      }
      const amount = toSafeTVFromHuman(amountIn, tokenIn.decimals);
      if (amount.lte(0)) {
        throw new Error("Invalid amount");
      }
      if (!chainId) {
        throw new Error("Chain ID required");
      }

      const fromMode = balanceFrom;
      const toMode = balanceFrom === FarmFromMode.EXTERNAL ? FarmToMode.INTERNAL : FarmToMode.EXTERNAL;

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress] as Address,
        abi: beanstalkAbi,
        functionName: "transferToken",
        args: [tokenIn.address, account.address as Address, amount.toBigInt(), Number(fromMode), Number(toMode)],
      });
    } catch (e) {
      console.error("Error submitting transfer: ", e);
      toast.dismiss();
      toast.error("Transfer failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = !account.address || !stringToNumber(amountIn) || submitting || isConfirming;

  return (
    <>
      <CardHeader className="flex flex-col gap-4 p-4 pt-0 pb-8 sm:pt-4 2xl:p-6 2xl:pb-10">
        <div className="flex flex-col gap-4">
          <Button
            variant={"outline"}
            className="rounded-full h-9 w-9 sm:h-12 sm:w-12 p-0 hover:cursor-pointer rotate-180"
            onClick={withTracking(ANALYTICS_EVENTS.WALLET.TRANSFER_MODE_EXIT, () => {
              setPanelState({
                ...panelState,
                walletPanel: {
                  ...panelState.walletPanel,
                  showTransfer: false,
                },
              });
            })}
          >
            <LeftArrowIcon />
          </Button>
          <div className="flex flex-col gap-2 2xl:gap-4">
            <div className="text-black text-[1rem] sm:text-[1.25rem] font-[400]">Transfer Tokens</div>
            <div className="text-[0.875rem] sm:text-[1.25rem] text-pinto-gray-4 font-[340]">
              Move tokens between your Wallet and your Farm Balance.
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 -mt-4 pb-0 px-3 2xl:px-6 flex flex-col">
        <Separator className="w-[120%] -ml-6 sm:w-full sm:ml-0 mb-4 2xl:mb-6" />
        <div className="flex flex-col gap-2 mb-3 2xl:gap-8 2xl:my-8">
          <div className="flex flex-row justify-between">
            <span className="text-pinto-gray-4 font-[340] text-[1rem] sm:text-[1.25rem]">From:</span>
            <span className="text-black font-[400] text-[1rem] sm:text-[1.25rem]">
              {balanceFrom === FarmFromMode.EXTERNAL ? "Wallet Balance" : "Farm Balance"}
            </span>
          </div>
          <Button
            variant={"outline"}
            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0 border-none self-center hover:cursor-pointer"
            onClick={() => {
              const newDirection =
                balanceFrom === FarmFromMode.EXTERNAL ? FarmFromMode.INTERNAL : FarmFromMode.EXTERNAL;
              setBalanceFrom(newDirection);
            }}
          >
            <UpDownArrowsIcon />
          </Button>
          <div className="flex flex-row justify-between">
            <span className="text-pinto-gray-4 font-[340] text-[1rem] sm:text-[1.25rem]">To:</span>
            <span className="text-black font-[400] text-[1rem] sm:text-[1.25rem]">
              {balanceFrom === FarmFromMode.EXTERNAL ? "Farm Balance" : "Wallet Balance"}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:mt-6 2xl:mt-16 gap-y-2 self-end mb-4 w-full">
          <div className="pinto-sm-light sm:pinto-body text-pinto-light sm:text-pinto-light">
            Amount and Token to Transfer
          </div>
          <ComboInputField
            amount={amountIn}
            setAmount={setAmountIn}
            setToken={setTokenIn}
            setBalanceFrom={setBalanceFrom}
            selectedToken={tokenIn}
            balanceFrom={balanceFrom}
            balancesToShow={[FarmFromMode.EXTERNAL, FarmFromMode.INTERNAL]}
            inputFrameColor="white"
            filterTokens={filteredTokens}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col flex-grow justify-end gap-4">
        <Separator className="w-full" />
        <div className="font-[340] text-[0.875rem] sm:text-[1.25rem] text-center">
          {`Transfer ${Number(amountIn)} ${tokenIn.symbol} from your ${balanceFrom === FarmFromMode.EXTERNAL ? "Wallet" : "Farm Balance"} to your ${balanceFrom === FarmFromMode.EXTERNAL ? "Farm Balance" : "Wallet"}.`}
        </div>
        <SmartSubmitButton
          variant={"gradient"}
          token={tokenIn}
          balanceFrom={balanceFrom}
          amount={amountIn}
          disabled={disabled}
          submitFunction={onSubmit}
          submitButtonText="Transfer"
          className={"w-full text-[1.25rem] sm:text-[1.5rem] h-[3.125rem] sm:h-[3.625rem] grow-0"}
        />
      </CardFooter>
    </>
  );
}
