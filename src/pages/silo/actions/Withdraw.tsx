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
import VerticalAccordion from "@/components/ui/VerticalAccordion";
import { MAIN_TOKEN } from "@/constants/tokens";
import encoders from "@/encoders";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useLPTokenToNonPintoUnderlyingMap, useTokenMap } from "@/hooks/pinto/useTokenMap";
import useSiloConvert, { useSiloConvertQuote } from "@/hooks/silo/useSiloConvert";
import { useSiloConvertResult } from "@/hooks/silo/useSiloConvertResult";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import { AdvancedFarmWorkflow } from "@/lib/farm/workflow";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useInvalidateSun } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { getChainConstant, useChainConstant } from "@/utils/chain";
import { sortAndPickCrates } from "@/utils/convert";
import { formatter } from "@/utils/format";
import { stringToNumber } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { AddressLookup } from "@/utils/types.generic";
import { cn, exists, noop } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const siloData = useSiloData();
  const fieldSnapshots = useFieldSnapshots();
  const siloSnapshots = useSiloSnapshots();
  const invalidateSun = useInvalidateSun();
  const farmerBalances = useFarmerBalances();
  const farmerDeposits = farmerSilo.deposits;
  const tokenMap = useTokenMap();
  const prices = usePriceData();
  const underlyingMap = useLPTokenToNonPintoUnderlyingMap();
  const mainToken = useChainConstant(MAIN_TOKEN);
  const queryClient = useQueryClient();

  const diamondAddress = useProtocolAddress();

  const [destination, setDestination] = useState(FarmToMode.EXTERNAL);
  const [amount, setAmount] = useState("");

  const [shouldConvertWithdraw, setShouldConvertWithdraw] = useState(false);

  const [tokenOut, setTokenOut] = useState(getInitialWithdrawToken(siloToken, tokenMap));
  const [slippage, setSlippage] = useState(0.1);
  const [inputError, setInputError] = useState(false);

  const underlyingPairToken = siloToken.isLP ? underlyingMap[getTokenIndex(siloToken)] : undefined;
  const amountTV = useSafeTokenValue(amount, siloToken);

  const farmerDepositData = farmerDeposits.get(siloToken);
  const deposits = farmerDepositData?.deposits;

  const convertibleAmount = farmerDepositData?.convertibleAmount;
  const convertibleDeposits = farmerDepositData?.convertibleDeposits;

  const convertQuoteEnabled = shouldConvertWithdraw && convertibleAmount?.gt(0) && amountTV.gt(0) && !!account.address;

  const siloConvert = useSiloConvert();
  const { data: convertQuote, rebuildConvertWithdrawal } = useSiloConvertQuote(
    siloConvert,
    siloToken,
    mainToken,
    amount,
    convertibleDeposits,
    slippage,
    { isPairWithdrawal: true },
    convertQuoteEnabled,
  );
  const { results: convertResults, sortedIndexes } = useSiloConvertResult(siloToken, mainToken, convertQuote);

  const [convertRouteIndex, setConvertRouteIndex] = useState<number | undefined>(undefined);

  const convertResult =
    exists(convertRouteIndex) && exists(convertResults) ? convertResults?.[convertRouteIndex] : undefined;

  useEffect(() => {
    console.log("convertQuote: ", convertQuote);
  }, [convertQuote]);

  useEffect(() => {
    console.log("convertResults: ", convertResults);
  }, [convertResults]);

  // initialize the route index to the first sorted index
  useEffect(() => {
    if (!sortedIndexes?.length || convertRouteIndex !== undefined) {
      return;
    }

    setConvertRouteIndex(sortedIndexes[0]);
  }, [sortedIndexes, convertRouteIndex]);

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

  const hasBalance = farmerDepositData?.amount.gt(0);

  const exceedsBalance = farmerDepositData?.amount.lt(amountTV);

  const shouldSwap = !tokensEqual(siloToken, tokenOut) && !siloToken.isMain;

  const swapDisabled = amountTV.lte(0) || !account.address || !shouldSwap || inputError;

  const { data: swapData, resetSwap } = useSwap({
    tokenIn: siloToken,
    tokenOut,
    amountIn: amountTV,
    slippage,
    disabled: swapDisabled || shouldConvertWithdraw,
  });

  const swapBuild = useBuildSwapQuote(swapData, FarmFromMode.INTERNAL, destination);
  const swapSummary = useSwapSummary(swapData);

  // have to do the withdraw step first
  const withdrawFarm = useMemo(() => {
    if (!shouldSwap || !swapBuild?.advFarm?.length || inputError || exceedsBalance) return undefined;
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
  }, [shouldSwap, amountTV, siloToken, deposits, chainId, config, swapBuild, exceedsBalance, inputError]);

  const priceImpactQuery = usePriceImpactSummary(withdrawFarm, undefined, undefined, swapDisabled);
  const priceImpactSummary = priceImpactQuery?.get(siloToken);

  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Withdraw",
  });

  const onSuccess = useCallback(() => {
    setAmount("");
    const allQueryKeys = [
      ...farmerSilo.queryKeys,
      fieldSnapshots.queryKey,
      siloSnapshots.queryKey,
      ...farmerBalances.queryKeys,
    ];
    allQueryKeys.forEach((query) => queryClient.invalidateQueries({ queryKey: query, refetchType: "active" }));
    siloConvert.clear();
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

  const handleWithdrawConvert = async (convQuote: ReturnType<typeof useSiloConvertQuote>["data"]) => {
    if (!convQuote) {
      throw new Error("Quote required");
    }

    try {
      const argsAndStrategies = rebuildConvertWithdrawal(convQuote, destination);

      if (!argsAndStrategies || !argsAndStrategies.length) {
        throw new Error("No quote found");
      }

      const advFarmCalls = argsAndStrategies.flatMap(({ farmStructs }) => farmStructs);

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [advFarmCalls],
      });
    } catch (e) {
      console.error("Error in handleWithdrawConvert: ", e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Convert withdraw failed");
      throw e;
    }
  };

  const onSubmit = async () => {
    if (amountTV.lte(0) || !destination || !account.address || !deposits || inputError) return;

    try {
      setSubmitting(true);
      toast.loading(`Withdrawing...`);
      const transferData = sortAndPickCrates("withdraw", amountTV, deposits);

      if (shouldConvertWithdraw) {
        return handleWithdrawConvert(convertQuote);
      }

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
    if (shouldConvertWithdraw) {
      return undefined;
    }

    if (
      !amount ||
      stringToNumber(amount) <= 0 ||
      !deposits ||
      inputError ||
      exceedsBalance ||
      (shouldSwap && !swapData?.buyAmount?.gt(0))
    )
      return undefined;

    const siloTokenToRemove = TokenValue.fromHuman(amount, siloToken.decimals);

    const amountAsTV = shouldSwap ? (swapData?.buyAmount?.gt(0) ? swapData.buyAmount : undefined) : amountTV;

    if (!amountAsTV) return undefined;
    const transferData = sortAndPickCrates("withdraw", siloTokenToRemove, deposits);

    return {
      amount: amountAsTV,
      stalkLost: transferData.stalk,
      seedsLost: transferData.seeds,
      bdvLost: transferData.bdv,
    };
  }, [
    amount,
    deposits,
    siloToken.decimals,
    shouldSwap,
    swapData,
    inputError,
    exceedsBalance,
    shouldConvertWithdraw,
    amountTV,
  ]);

  // Calculate seasons of grown stalk being withdrawn
  const seasonsOfGrownStalkWithdrawn = useMemo(() => {
    const averageGrownStalkPerBdvPerSeason = siloData.averageGrownStalkPerBdvPerSeason;

    // Grown stalk = total stalk - base stalk (1 stalk per BDV)
    const grownStalkLost = withdrawOutput ? withdrawOutput.stalkLost.sub(withdrawOutput.bdvLost) : TokenValue.ZERO;

    // Average grown stalk this BDV would generate per season
    const expectedGrownStalkPerSeason =
      withdrawOutput && grownStalkLost.gt(0)
        ? withdrawOutput.bdvLost.mul(averageGrownStalkPerBdvPerSeason)
        : TokenValue.ZERO;

    // Calculate how many seasons worth of grown stalk is being lost
    const seasonsOfGrownStalkWithdrawn = expectedGrownStalkPerSeason.gt(0)
      ? Math.ceil(grownStalkLost.div(expectedGrownStalkPerSeason).toNumber())
      : 0;

    return seasonsOfGrownStalkWithdrawn;
  }, [withdrawOutput, siloData.averageGrownStalkPerBdvPerSeason]);

  const tokenOutAmount =
    shouldConvertWithdraw && exists(convertRouteIndex)
      ? convertQuote?.[convertRouteIndex]?.quotes?.reduce(
          (prev, curr) => prev.add(curr.summary?.target?.amountOut),
          TokenValue.ZERO,
        )
      : undefined;

  const outputAmount = shouldConvertWithdraw ? convertResult?.withdrawalAmount : withdrawOutput?.amount;
  const outputStalk = shouldConvertWithdraw ? convertResult?.deltaStalk : withdrawOutput?.stalkLost;
  const outputSeeds = shouldConvertWithdraw ? convertResult?.deltaSeed : withdrawOutput?.seedsLost;

  const tokenOutUSD = prices.tokenPrices.get(tokenOut);
  const amountOutUSD = tokenOutUSD ? withdrawOutput?.amount.mul(tokenOutUSD.instant) : undefined;
  const swapReady = swapBuild && swapData?.buyAmount?.gt(0);

  const convertWithdrawalReady = shouldConvertWithdraw ? convertResults && convertQuote && amountTV.gt(0) : true;
  const defaultWithdrawReady = !shouldConvertWithdraw
    ? withdrawOutput && amountTV.gt(0) && (shouldSwap ? swapReady : true)
    : true;

  const disabled =
    !account.address ||
    submitting ||
    isConfirming ||
    !convertWithdrawalReady ||
    !defaultWithdrawReady ||
    exceedsBalance;

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
          disableInput={isConfirming || !hasBalance}
          setAmount={setAmount}
          setToken={noop}
          setError={setInputError}
          selectedToken={siloToken}
          tokenAndBalanceMap={convertData}
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
                <div className="pinto-h3">{formatter.token(outputAmount, tokenOut)}</div>
              </div>
              <WithdrawTokenSelect
                shouldConvertWithdraw={shouldConvertWithdraw}
                setShouldConvertWithdraw={setShouldConvertWithdraw}
                selected={tokenOut}
                tokens={tokenList}
                selectToken={setTokenOut}
                underlyingPairToken={underlyingPairToken}
                disableOpen={false}
              />
            </div>
            <div className="pinto-sm-light text-pinto-light">{formatter.usd(amountOutUSD)}</div>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        {withdrawOutput && (
          <SiloOutputDisplay
            amount={withdrawOutput?.amount}
            token={tokenOut}
            stalk={withdrawOutput?.stalkLost}
            seeds={withdrawOutput?.seedsLost}
            showNegativeDeltas
            showGrownStalkSeasonsNotice
            grownStalkSeasons={seasonsOfGrownStalkWithdrawn}
          />
        )}
        {convertResult && shouldConvertWithdraw && (
          <SiloOutputDisplay
            before={{
              label: "Withdraw amount",
              valueProps: {
                value: formatter.token(outputAmount, tokenOut),
                token: tokenOut,
                suffix: tokenOut.symbol,
              },
            }}
            title="I receive"
            amount={convertResult.totalAmountOut.abs()}
            token={mainToken}
            stalk={convertResult.deltaStalk.abs()}
            seeds={convertResult.deltaSeed.abs()}
            showNegativeDeltas
            showGrownStalkSeasonsNotice
            grownStalkSeasons={seasonsOfGrownStalkWithdrawn}
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
        <Button onClick={onSubmit} disabled={disabled || !canProceed} {...sharedButtonProps}>
          {exceedsBalance ? "Insufficient Balance" : "Withdraw"}
        </Button>
      </div>
      <MobileActionBar>
        <Button onClick={onSubmit} disabled={disabled || !canProceed} {...sharedButtonProps} className="h-full">
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
  shouldConvertWithdraw,
  setShouldConvertWithdraw,
  underlyingPairToken,
  disableOpen = false,
}: {
  selected: Token;
  tokens: Token[];
  selectToken: (t: Token) => void;
  shouldConvertWithdraw: boolean;
  setShouldConvertWithdraw: (value: boolean) => void;
  underlyingPairToken?: Token;
  disableOpen?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (disableOpen) return;
    setOpen(open);
    if (!open) {
      setShowOtherOptions(false);
    }
  };

  const { mainToken } = useTokenData();

  const handleConvertWithdrawalSelect = () => {
    if (underlyingPairToken) {
      setShouldConvertWithdraw(true);
      selectToken(underlyingPairToken);
      setOpen(false);
      setShowOtherOptions(false);
    }
  };

  const handleStandardTokenSelect = (token: Token) => {
    setShouldConvertWithdraw(false);
    selectToken(token);
    setOpen(false);
    setShowOtherOptions(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {shouldConvertWithdraw ? (
          <Button variant="outline-gray-shadow" size="xl" rounded="full">
            <div className="flex flex-row items-center gap-1">
              <IconImage src={selected.logoURI} size={6} />
              <div className="pinto-body-light">{selected.symbol}</div>
              <div className="pinto-body-light">+</div>
              <IconImage src={mainToken.logoURI} size={6} />
              <div className="pinto-body-light">DEP.{mainToken.symbol}</div>
              <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
            </div>
          </Button>
        ) : (
          <Button variant="outline-gray-shadow" size="xl" rounded="full">
            <div className="flex flex-row items-center gap-1">
              <IconImage src={selected.logoURI} size={6} />
              <div className="pinto-body-light">{selected.symbol}</div>
              <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-xl flex flex-col gap-3 overflow-x-clip">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3">
            <DialogTitle>
              <DialogHeader>
                <div className="pinto-body">Select withdrawal option</div>
              </DialogHeader>
            </DialogTitle>
          </div>
          <Separator className="w-[120%] -ml-6 mt-4 sm:mt-6" />
          <div className="flex flex-col -m-2 sm:-m-4 mt-2 sm:mt-3">
            {tokens.map((token) => (
              <WithdrawTokenSelectRow
                key={`withdraw-token-select${token.symbol}`}
                token={token}
                onClick={() => handleStandardTokenSelect(token)}
              />
            ))}
            {underlyingPairToken && (
              <div className="mt-2 mx-2 sm:mx-4">
                <VerticalAccordion
                  title="Show other options"
                  open={showOtherOptions}
                  onOpenChange={setShowOtherOptions}
                  marginOnOpen={true}
                >
                  <div className="flex flex-col w-full gap-2">
                    <div className="pinto-sm text-pinto-light px-4 py-2">Other</div>
                    <div
                      className="flex flex-row w-full items-start gap-4 p-4 cursor-pointer hover:bg-pinto-gray-1 rounded-sm"
                      onClick={handleConvertWithdrawalSelect}
                    >
                      <div className="flex flex-row items-center gap-2 flex-shrink-0">
                        <IconImage src={underlyingPairToken.logoURI} size={12} />
                        <div className="pinto-body-light">+</div>
                        <IconImage src={mainToken.logoURI} size={12} />
                      </div>
                      <div className="flex flex-col gap-1 items-start flex-1 min-w-0">
                        <div className="pinto-body text-pinto-secondary">
                          {underlyingPairToken.symbol} + DEP.{mainToken.symbol}
                        </div>
                        <div className="pinto-sm-light text-pinto-light">
                          Withdraw half your LP as {underlyingPairToken.symbol} and keep the remaining Pinto deposited
                          in the Silo
                        </div>
                      </div>
                    </div>
                  </div>
                </VerticalAccordion>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
