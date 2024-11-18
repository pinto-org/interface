import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import { UpDownArrowsIcon } from "@/components/Icons";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import PageContainer from "@/components/ui/PageContainer";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import useSwapEstimate from "@/hooks/useSwapEstimate";
import useTransaction from "@/hooks/useTransaction";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useTokenData from "@/state/useTokenData";
import { stringToNumber } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount, useChainId } from "wagmi";

const useFilterTokens = (balances: ReturnType<typeof useFarmerBalances>["balances"], otherToken: Token) => {
  return useMemo(() => {
    const set = new Set<Token>();

    [...balances.keys()].forEach((token) => {
      if (token.isLP) {
        set.add(token);
      }
      if (tokensEqual(token, otherToken)) {
        set.add(token);
      }
    });

    return set;
  }, [balances, otherToken]);
};

export default function Swap() {
  const BEAN = useTokenData().mainToken;
  const OUTPUT_TOKEN = useTokenData().preferredTokens[1];

  const [amountIn, setAmountIn] = useState("0");
  const [tokenIn, setTokenIn] = useState(BEAN);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.EXTERNAL);
  const [amountOut, setAmountOut] = useState("0");
  const [tokenOut, setTokenOut] = useState(OUTPUT_TOKEN);
  const [balanceTo, setBalanceTo] = useState(FarmToMode.EXTERNAL);
  const [slippage, setSlippage] = useState(0.1);
  const account = useAccount();
  const chainId = useChainId();

  const queryClient = useQueryClient();
  const { balances, queryKeys } = useFarmerBalances();
  const filterTokensIn = useFilterTokens(balances, tokenOut);
  const filterTokensOut = useFilterTokens(balances, tokenIn);

  const swapData = useSwapEstimate(tokenIn, tokenOut, Number(amountIn), slippage, "exactInput", balanceFrom, balanceTo);

  const destinationIsEth = tokenOut.isNative;

  useEffect(() => {
    if (swapData?.mode === "exactInput") {
      setAmountOut(swapData?.output.toHuman());
    } else if (swapData?.mode === "exactOutput") {
      setAmountIn(swapData?.output.toHuman());
    }
  }, [swapData?.output, swapData?.mode]);

  function changeAmountIn(value: string) {
    setAmountIn(value);
  }

  const { writeWithEstimateGas, setSubmitting, submitting, isConfirming } = useTransaction({
    successCallback: () => {
      queryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query }));
      setAmountIn("0");
    },
    successMessage: "Swap success",
  });

  function invertTokens() {
    const newTokenIn = tokenOut;
    const newTokenOut = tokenIn;
    setTokenIn(newTokenIn);
    setTokenOut(newTokenOut);
  }

  async function onSubmit() {
    setSubmitting(true);
    toast.loading("Swapping...");
    try {
      if (!account.address) throw new Error("Signer required");

      const swapCallData = swapData?.callData;
      if (!swapData || !swapCallData) {
        throw new Error("No swap data");
      }

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [swapCallData],
        value: tokenIn.isNative ? TokenValue.fromHuman(amountIn, tokenIn.decimals).toBigInt() : 0n,
      });
    } catch (e) {
      console.error("Error submitting swap: ", e);
      toast.dismiss();
      toast.error("Swap failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting || isConfirming || !stringToNumber(amountIn) || !account.address || !swapData;

  return (
    <PageContainer>
      <div className="flex flex-col w-full">
        <div className="flex flex-col self-center w-[700px]">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-y-3">
              <div className="text-pinto-h1 text-black inline-flex gap-2 items-center">Market</div>
              <div className="font-[340] text-[1.25rem] text-pinto-gray-4">Buy and sell Pinto-native assets.</div>
            </div>
            <div className="flex flex-row items-center">
              <Button
                asChild
                variant={"outline"}
                className="rounded-[0.75rem] text-[1rem] text-black font-[500] -tracking-[0.02em] inline-flex gap-2"
              >
                {/* <Link to="/podmarket">
                Buy and sell Pods
                <UpRightArrowIcon color={"currentColor"} />
              </Link> */}
              </Button>
            </div>
          </div>
          <div className="flex flex-col mt-9 gap-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row justify-between">
                <Label>Sell</Label>
                <SlippageButton slippage={slippage} setSlippage={setSlippage} />
              </div>
              <ComboInputField
                amount={amountIn}
                setAmount={setAmountIn}
                setToken={setTokenIn}
                setBalanceFrom={setBalanceFrom}
                selectedToken={tokenIn}
                balanceFrom={balanceFrom}
                disableClamping={!account.address}
                filterTokens={filterTokensIn}
              />
            </div>
            <div className="flex flex-row justify-center">
              <Button
                onClick={invertTokens}
                variant={"outline"}
                className="rounded-full h-10 w-10 !p-0 self-center hover:cursor-pointer"
              >
                <UpDownArrowsIcon className="w-8 h-8" />
              </Button>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Buy</Label>
              <ComboInputField
                amount={amountOut}
                setAmount={setAmountOut}
                setToken={setTokenOut}
                selectedToken={tokenOut}
                isLoading={swapData?.isLoading || false}
                disableInput
                disableInlineBalance
                filterTokens={filterTokensOut}
              />
            </div>
            <div>
              {destinationIsEth ? (
                <></>
              ) : (
                <div className="flex flex-col gap-y-2">
                  <Label className="content-center">Send output to:</Label>
                  <DestinationBalanceSelect setBalanceTo={setBalanceTo} balanceTo={balanceTo} />
                </div>
              )}
            </div>
            <div className="mt-6 flex">
              <SmartSubmitButton
                token={tokenIn}
                amount={amountIn}
                disabled={disabled}
                submitFunction={onSubmit}
                submitButtonText="Swap"
                className="h-[5.25rem]"
                variant="gradient"
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
