import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import DestinationBalanceSelect from "@/components/DestinationBalanceSelect";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import encoders from "@/encoders";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import { AdvancedFarmWorkflow } from "@/lib/farm/workflow";
import useFarmerBalances from "@/state/useFarmerBalances";
import useFarmerSilo from "@/state/useFarmerSilo";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import { usePriceData } from "@/state/usePriceData";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useInvalidateSun } from "@/state/useSunData";
import { sortAndPickCrates } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { stringToNumber, stringToStringNum } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { AddressLookup } from "@/utils/types.generic";
import { noop } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfig } from "wagmi";
import { useAccount, useChainId } from "wagmi";

const getInitialWithdrawToken = (siloToken: Token, tokenMap: AddressLookup<Token>) => {
  if (siloToken.isLP && siloToken.tokens?.length) {
    const pairToken = siloToken.tokens.find((t) => !tokenMap[getTokenIndex(t)]?.isMain);
    if (!pairToken) {
      throw new Error("Silo token has LP pair tokens but non-main token not found.");
    }

    return tokenMap[getTokenIndex(pairToken)];
  } else if (siloToken.isMain) {
    return siloToken;
  }

  throw new Error("Invalid silo token");
};

function Withdraw({ siloToken }: { siloToken: Token }) {
  const config = useConfig();
  const account = useAccount();
  const chainId = useChainId();
  const farmerSilo = useFarmerSilo();
  const fieldSnapshots = useFieldSnapshots();
  const siloSnapshots = useSiloSnapshots();
  const invalidateSun = useInvalidateSun();
  const farmerBalances = useFarmerBalances();
  const farmerDeposits = farmerSilo.deposits;
  const tokenMap = useTokenMap();
  const prices = usePriceData();

  const [destination, setDestination] = useState(FarmToMode.EXTERNAL);
  const [amount, setAmount] = useState("0");

  const [tokenOut, setTokenOut] = useState(getInitialWithdrawToken(siloToken, tokenMap));
  const [slippage, setSlippage] = useState(0.5);
  const [inputError, setInputError] = useState(false);

  const queryClient = useQueryClient();

  const farmerDepositData = farmerDeposits.get(siloToken);
  const deposits = farmerDepositData?.deposits;

  const tokenList = useMemo(() => {
    if (siloToken.isMain) return [siloToken];
    if (siloToken.isLP && siloToken.tokens?.length) {
      return [...siloToken.tokens.map((t) => tokenMap[getTokenIndex(t)]), siloToken].reverse();
    }
    return [];
  }, [tokenMap, siloToken]);

  const convertData = useMemo(() => {
    const data = new Map<Token, TokenValue>();
    data.set(siloToken, farmerDepositData ? farmerDepositData.amount : TokenValue.ZERO);
    return data;
  }, [siloToken, farmerDepositData]);

  const exceedsBalance = farmerDepositData?.amount.lt(TokenValue.fromHuman(stringToStringNum(amount), siloToken.decimals));

  const shouldSwap = !tokensEqual(siloToken, tokenOut) && !siloToken.isMain;

  const swapDisabled = stringToNumber(amount) <= 0 || !account.address || !shouldSwap || inputError;

  const { data: swapData, resetSwap } = useSwap({
    tokenIn: siloToken,
    tokenOut,
    amountIn: TokenValue.fromHuman(amount, siloToken.decimals),
    slippage,
    disabled: swapDisabled,
  });

  const swapBuild = useBuildSwapQuote(swapData, FarmFromMode.INTERNAL, destination);
  const swapSummary = useSwapSummary(swapData);

  // have to do the withdraw step first
  const withdrawFarm = useMemo(() => {
    if (!shouldSwap || !swapBuild?.advFarm?.length || inputError || exceedsBalance) return undefined;
    const amountTV = TokenValue.fromHuman(amount || 0, siloToken.decimals);
    if (!deposits || amountTV.lte(0)) return undefined;

    const transferData = sortAndPickCrates("withdraw", amountTV, deposits);

    const stems = transferData.crates.map((crate) => crate.stem);
    const amounts = transferData.crates.map((crate) => crate.amount);
    const advFarm = new AdvancedFarmWorkflow(chainId, config, "silo-withdraw");
    advFarm.add(encoders.silo.withdraw(siloToken, stems, amounts, FarmToMode.INTERNAL));

    swapBuild.advFarm.getSteps().forEach((node) => {
      advFarm.add(node);
    });
    return advFarm;
  }, [shouldSwap, amount, siloToken, deposits, chainId, config, swapBuild, exceedsBalance, inputError]);

  const priceImpactQuery = usePriceImpactSummary(withdrawFarm, undefined, undefined, swapDisabled);
  const priceImpactSummary = priceImpactQuery?.get(siloToken);

  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Withdraw",
  });

  const onSuccess = useCallback(() => {
    setAmount("0");
    const allQueryKeys = [
      ...farmerSilo.queryKeys,
      fieldSnapshots.queryKey,
      siloSnapshots.queryKey,
      ...farmerBalances.queryKeys,
    ];
    allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query, refetchType: "active" }));
    invalidateSun("all", { refetchType: "active" });
    resetSwap();
    priceImpactQuery.clear();
  }, [
    farmerBalances.queryKeys,
    farmerSilo.queryKeys,
    fieldSnapshots.queryKey,
    siloSnapshots.queryKey,
    invalidateSun,
    queryClient.invalidateQueries,
    resetSwap,
    priceImpactQuery.clear,
  ]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Withdraw successful",
    errorMessage: "Withdraw failed",
    successCallback: onSuccess,
  });

  const onSubmit = async () => {
    if (!amount || Number(amount) <= 0 || !destination || !account.address || !deposits || inputError) return;

    try {
      setSubmitting(true);
      const amountTV = TokenValue.fromHuman(amount || 0, siloToken.decimals);
      toast.loading(`Withdrawing...`);
      const transferData = sortAndPickCrates("withdraw", amountTV, deposits);

      const stems = transferData.crates.map((crate) => crate.stem);
      const amounts = transferData.crates.map((crate) => crate.amount);

      if (!stems.length || !amounts.length) throw new Error("No crates to withdraw");

      if (!shouldSwap) {
        if (transferData.crates.length === 1) {
          return writeWithEstimateGas({
            address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
            abi: beanstalkAbi,
            functionName: "withdrawDeposit",
            args: [siloToken.address, stems[0].toBigInt(), amounts[0].toBigInt(), Number(destination)],
          });
        }
        return writeWithEstimateGas({
          address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
          abi: beanstalkAbi,
          functionName: "withdrawDeposits",
          args: [
            siloToken.address,
            stems.map((s) => s.toBigInt()),
            amounts.map((a) => a.toBigInt()),
            Number(destination),
          ],
        });
      }

      if (!swapData || !swapBuild || !withdrawFarm) throw new Error("No swap data");

      return writeWithEstimateGas({
        address: beanstalkAddress[chainId as keyof typeof beanstalkAddress],
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [withdrawFarm?.getSteps()],
      });
    } catch (e) {
      console.error(e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Withdraw failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  const withdrawOutput = useMemo(() => {
    if (!amount || stringToNumber(amount) <= 0 || !deposits || inputError || exceedsBalance || (shouldSwap && !swapData?.buyAmount?.gt(0))) return undefined;

    const siloTokenToRemove = TokenValue.fromHuman(amount, siloToken.decimals);

    const amountTV = shouldSwap
      ? swapData?.buyAmount?.gt(0)
        ? swapData.buyAmount
        : undefined
      : TokenValue.fromHuman(amount, siloToken.decimals);

    if (!amountTV) return undefined;
    const transferData = sortAndPickCrates("withdraw", siloTokenToRemove, deposits);

    return {
      amount: amountTV,
      stalkLost: transferData.stalk,
      seedsLost: transferData.seeds,
    };
  }, [amount, deposits, siloToken.decimals, shouldSwap, swapData, inputError, exceedsBalance]);

  const tokenOutUSD = prices.tokenPrices.get(tokenOut);
  const amountOutUSD = tokenOutUSD ? withdrawOutput?.amount.mul(tokenOutUSD.instant) : undefined;

  const swapReady = swapBuild && swapData?.buyAmount?.gt(0);
  const disabled =
    !stringToNumber(amount) || !account.address || submitting || isConfirming || (shouldSwap && !swapReady) || exceedsBalance;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="h-10 flex flex-row justify-between items-center">
          <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
            Amount and Deposited Token to Withdraw
          </div>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amount}
          error={inputError}
          disableInput={isConfirming}
          setAmount={setAmount}
          setToken={noop}
          setError={setInputError}
          selectedToken={siloToken}
          tokenAndBalanceMap={convertData}
          disableClamping={true}
          disableButton
        />
      </div>
      <div className="flex flex-col">
        <Label className="flex h-10 items-center">Destination</Label>
        <DestinationBalanceSelect setBalanceTo={setDestination} balanceTo={destination} />
      </div>
      {siloToken.isLP && (
        <div className="flex flex-col w-full py-4 gap-2">
          <div className="pinto-body-light text-pinto-light">Withdraw as</div>
          <div className="flex flex-col w-full gap-1">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <div className="pinto-h3">{formatter.token(withdrawOutput?.amount, tokenOut)}</div>
              </div>
              <WithdrawTokenSelect selected={tokenOut} tokens={tokenList} selectToken={setTokenOut} />
            </div>
            <div className="pinto-sm-light text-pinto-light">{formatter.usd(amountOutUSD)}</div>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        {withdrawOutput && (
          <SiloOutputDisplay
            amount={withdrawOutput.amount}
            token={tokenOut}
            stalk={withdrawOutput.stalkLost}
            seeds={withdrawOutput.seedsLost}
            showNegativeDeltas
          />
        )}
        {shouldSwap && withdrawOutput && (
          <RoutingAndSlippageInfo
            title="Total Withdraw Slippage"
            swapSummary={swapSummary}
            priceImpactSummary={priceImpactSummary}
            preferredSummary={"priceImpact"}
            txnType="Withdraw"
            tokenIn={siloToken}
            tokenOut={tokenOut}
            wellToken={siloToken}
          />
        )}
      </div>
      {slippageWarning}
      <div className="hidden sm:flex">
        <Button
          onClick={onSubmit}
          disabled={disabled || !canProceed}
          {...sharedButtonProps}
        >
          {exceedsBalance ? "Insufficient Balance" : "Withdraw"}
        </Button>
      </div>
      <MobileActionBar>
        <Button
          onClick={onSubmit}
          disabled={disabled || !canProceed}
          {...sharedButtonProps}
          className="h-full"
        >
          {exceedsBalance ? "Insufficient Balance" : "Withdraw"}
        </Button>
      </MobileActionBar>
    </div>
  );
}

const sharedButtonProps = {
  variant: "gradient",
  type: "button",
  rounded: "full",
  width: "full",
  size: "xxl",
} as const;

export default Withdraw;

const WithdrawTokenSelectRow = ({ token, onClick }: { token: Token; onClick: () => void }) => {
  return (
    <div
      className="flex flex-row w-full items-center gap-4 p-4 cursor-pointer hover:bg-pinto-gray-1 rounded-sm"
      onClick={onClick}
    >
      <IconImage src={token.logoURI} size={12} />
      <div className="flex flex-col gap-1 items-start">
        <div className="pinto-body text-pinto-secondary">{token.symbol}</div>
        <div className="pinto-sm-light text-pinto-light">{token.name}</div>
      </div>
    </div>
  );
};

const WithdrawTokenSelect = ({
  selected,
  tokens,
  selectToken,
}: { selected: Token; tokens: Token[]; selectToken: (t: Token) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline-gray-shadow" size="xl" rounded="full">
          <div className="flex flex-row items-center gap-1">
            <IconImage src={selected.logoURI} size={6} />
            <div className="pinto-body-light">{selected.symbol}</div>
            <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md flex flex-col gap-3 overflow-x-clip">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3">
            <DialogTitle>
              <DialogHeader>
                <div className="pinto-body">Select a token</div>
              </DialogHeader>
            </DialogTitle>
          </div>
          <Separator className="w-[120%] -ml-6 mt-4 sm:mt-6" />
          <div className="flex flex-col -m-2 sm:-m-4 mt-2 sm:mt-3">
            {tokens.map((token) => (
              <WithdrawTokenSelectRow
                key={`withdraw-token-select${token.symbol}`}
                token={token}
                onClick={() => {
                  selectToken(token);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
