import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TV, TokenValue } from "@/classes/TokenValue";
import { ComboInputField } from "@/components/ComboInputField";
import { Row } from "@/components/Container";
import FrameAnimator from "@/components/LoadingSpinner";
import MobileActionBar from "@/components/MobileActionBar";
import RoutingAndSlippageInfo, { useRoutingAndSlippageWarning } from "@/components/RoutingAndSlippageInfo";
import SiloOutputDisplay from "@/components/SiloOutputDisplay";
import SlippageButton from "@/components/SlippageButton";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import SourceBalanceSelect from "@/components/SourceBalanceSelect";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Separator } from "@/components/ui/Separator";
import { Skeleton } from "@/components/ui/Skeleton";
import VerticalAccordion from "@/components/ui/VerticalAccordion";
import { diamondABI } from "@/constants/abi/diamondABI";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { MAIN_TOKEN } from "@/constants/tokens";
import deposit from "@/encoders/deposit";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useLPTokenToNonPintoUnderlyingMap, useTokenMap } from "@/hooks/pinto/useTokenMap";
import useSiloConvert, { useSiloConvertQuote } from "@/hooks/silo/useSiloConvert";
import { useSiloConvertResult } from "@/hooks/silo/useSiloConvertResult";
import useBuildSwapQuote from "@/hooks/swap/useBuildSwapQuote";
import useSwap from "@/hooks/swap/useSwap";
import useSwapSummary from "@/hooks/swap/useSwapSummary";
import { usePreferredInputToken } from "@/hooks/usePreferredInputToken";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import useTransaction from "@/hooks/useTransaction";
import usePriceImpactSummary from "@/hooks/wells/usePriceImpactSummary";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import { useInvalidateSun } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { trackSimpleEvent } from "@/utils/analytics";
import { getChainConstant, useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { getSiloLabels } from "@/utils/silo";
import { stringEq, stringToNumber } from "@/utils/string";
import { getTokenIndex, tokensEqual } from "@/utils/token";
import { FarmFromMode, FarmToMode, Token } from "@/utils/types";
import { cn, exists, getBalanceFromMode, noop } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const useFilterTokens = (siloToken: Token, balances: ReturnType<typeof useFarmerBalances>["balances"]) => {
  return useMemo(() => {
    const set = new Set<Token>();

    [...balances.keys()].forEach((token) => {
      if (
        (token.isLP && !tokensEqual(token, siloToken)) ||
        token.isSiloWrapped ||
        token.is3PSiloWrapped ||
        token.symbol.includes("WSOL")
      ) {
        set.add(token);
      }
    });

    return {
      filterSet: set,
      filterPreferred: Array.from(set),
    };
  }, [siloToken, balances]);
};

function Deposit({ siloToken }: { siloToken: Token }) {
  const diamondAddress = useProtocolAddress();
  const farmerBalances = useFarmerBalances();
  const farmerSilo = useFarmerSilo();
  const invalidateSun = useInvalidateSun();
  const { filterSet, filterPreferred } = useFilterTokens(siloToken, farmerBalances.balances);
  const { queryKeys: priceQueryKeys, pools } = usePriceData();
  const account = useAccount();
  const tokenMap = useTokenMap();
  const underlyingMap = useLPTokenToNonPintoUnderlyingMap();
  const mainToken = useChainConstant(MAIN_TOKEN);
  const siloConvert = useSiloConvert();

  const { preferredToken, loading: preferredLoading } = usePreferredInputToken({
    filterLP: true,
    filter: filterPreferred,
    token: siloToken,
  });

  const siloData = useSiloData();

  const [didSetPreferred, setDidSetPreferred] = useState(false);
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState(preferredToken);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.5);
  const [shouldConvertDeposit, setShouldConvertDeposit] = useState(false);
  const qc = useQueryClient();

  // Get underlying pair token for LP tokens
  const underlyingPairToken = siloToken.isLP ? underlyingMap[getTokenIndex(siloToken)] : undefined;

  useEffect(() => {
    // If we are still calculating the preferred token, set the token to the preferred token once it's been set.
    if (preferredLoading) return;
    if (preferredToken && !didSetPreferred) {
      setTokenIn(preferredToken);
      setDidSetPreferred(true);
    }
  }, [preferredToken, preferredLoading, didSetPreferred]);

  const shouldSwap = !tokensEqual(tokenIn, siloToken) && !shouldConvertDeposit;

  const amountInTV = useSafeTokenValue(amountIn, tokenIn);

  const tokenInBalance = farmerBalances.balances.get(tokenIn);
  const balanceFromMode = getBalanceFromMode(tokenInBalance, balanceFrom);
  const exceedsBalance = balanceFromMode.lt(amountInTV);

  // Get farmer deposits for main token (for convert deposit)
  const farmerDepositData = shouldConvertDeposit ? farmerSilo.deposits.get(mainToken) : undefined;
  const convertibleDeposits = farmerDepositData?.convertibleDeposits;
  const convertibleAmount = farmerDepositData?.convertibleAmount;

  const pintosPerUnderlying = useMemo(() => {
    const poolData = pools.find((pool) => stringEq(pool.pool.address, siloToken.address));

    if (!poolData) return undefined;

    const mainIndex = poolData.tokens[0].isMain ? 0 : 1;
    const underlyingIndex = poolData.tokens[0].isMain ? 1 : 0;

    const mainTokenBalance = poolData.balances[mainIndex];
    const underlyingTokenBalance = poolData.balances[underlyingIndex];

    const ratio = mainTokenBalance.div(underlyingTokenBalance);
    return ratio;
  }, [pools, siloToken]);

  const secondaryAmountInTV = pintosPerUnderlying?.gt(0) ? amountInTV.mul(pintosPerUnderlying) : TokenValue.ZERO;

  const maxes = useMemo(() => {
    if (!shouldConvertDeposit)
      return {
        in: balanceFromMode,
        other: TV.ZERO,
      };

    if (!convertibleAmount || !balanceFromMode || !pintosPerUnderlying) {
      return {
        in: TV.ZERO,
        other: TV.ZERO,
      };
    }

    // Gives max underlying given we are not limited by deposited PINTO
    const uncappedMaxUnderlying = convertibleAmount.div(pintosPerUnderlying);

    // Gives max main token given we are not limited by deposited underlying
    const uncappedMaxMainToken = uncappedMaxUnderlying.mul(pintosPerUnderlying);

    return {
      in: TV.min(uncappedMaxUnderlying, balanceFromMode),
      other: TV.min(uncappedMaxMainToken, convertibleAmount),
    };
  }, [shouldConvertDeposit, convertibleAmount, balanceFromMode, pintosPerUnderlying]);

  // Convert deposit quote
  const convertQuoteEnabled =
    shouldConvertDeposit &&
    convertibleAmount?.gt(0) &&
    amountInTV.gt(0) &&
    secondaryAmountInTV.gt(0) &&
    !!account.address;

  const { data: convertQuote, ...convertQuery } = useSiloConvertQuote(
    siloConvert,
    mainToken,
    siloToken,
    secondaryAmountInTV.toHuman(),
    convertibleDeposits,
    slippage,
    {
      secondaryAmount: amountInTV,
      fromMode: balanceFrom,
    },
    convertQuoteEnabled,
  );

  const { results: convertResults, sortedIndexes } = useSiloConvertResult(mainToken, siloToken, convertQuote);
  const [convertRouteIndex, setConvertRouteIndex] = useState<number | undefined>(undefined);

  const convertResult =
    exists(convertRouteIndex) && exists(convertResults) ? convertResults?.[convertRouteIndex] : undefined;

  // Initialize the route index to the first sorted index
  useEffect(() => {
    if (!sortedIndexes?.length || convertRouteIndex !== undefined) {
      return;
    }
    setConvertRouteIndex(sortedIndexes[0]);
  }, [sortedIndexes, convertRouteIndex]);

  const {
    data: swapData,
    resetSwap,
    ...swapQuery
  } = useSwap({
    tokenIn,
    tokenOut: siloToken,
    slippage,
    amountIn: amountInTV,
    disabled: !shouldSwap,
  });

  const value = tokenIn.isNative ? amountInTV : undefined;

  const swapBuild = useBuildSwapQuote(swapData, balanceFrom, FarmToMode.INTERNAL);
  const swapSummary = useSwapSummary(swapData);
  const priceImpactQuery = usePriceImpactSummary(swapBuild?.advFarm, tokenIn, value);
  const priceImpactSummary = priceImpactQuery?.get(siloToken);

  const depositingSiloToken = tokensEqual(siloToken, tokenIn);

  const { slippageWarning, canProceed } = useRoutingAndSlippageWarning({
    totalSlippage: swapSummary?.swap.totalSlippage,
    priceImpact: priceImpactSummary?.priceImpact,
    txnType: "Deposit",
    noMarginTop: depositingSiloToken || !amountInTV.gt(0),
  });

  const onSuccess = useCallback(() => {
    setAmountIn("");
    const allQueryKeys = [...farmerSilo.queryKeys, ...farmerBalances.queryKeys, ...priceQueryKeys];
    allQueryKeys.forEach((query) => qc.invalidateQueries({ queryKey: query }));
    invalidateSun("all", { refetchType: "active" });
    resetSwap();
    priceImpactQuery.clear();
    siloConvert.clear();
  }, [
    farmerSilo.queryKeys,
    farmerBalances.queryKeys,
    priceQueryKeys,
    invalidateSun,
    qc.invalidateQueries,
    resetSwap,
    priceImpactQuery.clear,
    siloConvert,
  ]);

  const { isConfirming, writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Deposit successful",
    errorMessage: "Deposit failed",
    successCallback: onSuccess,
  });

  const handleSetTokenIn = useCallback(
    (newToken: Token) => {
      if (tokensEqual(newToken, tokenIn)) return;

      // Track token selection
      trackSimpleEvent(ANALYTICS_EVENTS.SILO.DEPOSIT_TOKEN_SELECTED, {
        previous_token: tokenIn.symbol,
        new_token: newToken.symbol,
        target_token: siloToken.symbol,
      });

      setAmountIn("");
      setTokenIn(newToken);
      setShouldConvertDeposit(false);
    },
    [tokenIn, siloToken],
  );

  const handleConvertDepositSelect = useCallback(() => {
    if (underlyingPairToken) {
      setShouldConvertDeposit(true);
      setTokenIn(underlyingPairToken);
      setAmountIn("");
    }
  }, [underlyingPairToken, mainToken]);

  const depositOutput = useMemo(() => {
    if (shouldConvertDeposit) {
      // For convert deposits, use convert result
      if (convertResult) {
        const sData = siloData.tokenData.get(siloToken);
        if (!sData) return undefined;
        return {
          amount: convertResult.totalAmountOut,
          stalkGain: convertResult.totalAmountOut.mul(sData.rewards.stalk).mul(sData.tokenBDV),
          seedGain: convertResult.totalAmountOut.mul(sData.rewards.seeds).mul(sData.tokenBDV),
        };
      }
      return undefined;
    }

    const sData = siloData.tokenData.get(siloToken);
    if (amountInTV.lte(0) || !sData) return undefined;
    if (tokensEqual(siloToken, tokenIn)) {
      return {
        amount: amountInTV,
        stalkGain: amountInTV.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: amountInTV.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    } else if (swapData?.buyAmount.gt(0)) {
      return {
        amount: swapData.buyAmount,
        stalkGain: swapData.buyAmount.mul(sData.rewards.stalk).mul(sData.tokenBDV),
        seedGain: swapData.buyAmount.mul(sData.rewards.seeds).mul(sData.tokenBDV),
      };
    }

    return undefined;
  }, [siloData, swapData, siloToken, tokenIn, amountInTV, shouldConvertDeposit, convertResult]);

  const handleDepositConvert = async (convQuote: ReturnType<typeof useSiloConvertQuote>["data"]) => {
    if (!convQuote) {
      throw new Error("Quote required");
    }

    try {
      const selectedQuote = exists(convertRouteIndex) ? convQuote[convertRouteIndex] : undefined;

      if (!selectedQuote) {
        throw new Error("No quote found");
      }

      // Extract the advancedFarm workflow from the quote
      const advFarmCalls = selectedQuote.workflow.getSteps();

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: beanstalkAbi,
        functionName: "advancedFarm",
        args: [advFarmCalls],
      });
    } catch (e) {
      console.error("Error in handleDepositConvert: ", e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Convert deposit failed");
      throw e;
    }
  };

  const onSubmit = useCallback(async () => {
    try {
      if (!account.address) {
        throw new Error("No account connected");
      }

      // Track deposit submission
      trackSimpleEvent(ANALYTICS_EVENTS.SILO.DEPOSIT_SUBMIT, {
        input_token: tokenIn.symbol,
        output_token: siloToken.symbol,
        convert_deposit: shouldConvertDeposit,
      });

      if (shouldConvertDeposit) {
        return handleDepositConvert(convertQuote);
      }

      const buyAmount = shouldSwap ? swapData?.buyAmount : amountInTV;

      if (!shouldSwap && buyAmount) {
        setSubmitting(true);
        toast.loading(`Depositing...`);

        return writeWithEstimateGas({
          address: diamondAddress,
          abi: diamondABI,
          functionName: "deposit" as const,
          args: [siloToken.address, buyAmount.blockchainString, Number(balanceFrom)],
        });
      }

      if (!swapData || !swapBuild?.advancedFarm?.length) {
        throw new Error("No quote");
      }
      const value = tokenIn.isNative ? amountInTV : undefined;

      const advFarm = [...swapBuild.advFarm.getSteps()];
      const { clipboard } = await swapBuild.deriveClipboardWithOutputToken(siloToken, 1, account.address, {
        value: value ?? TokenValue.ZERO,
      });

      const depositCallStruct = deposit(siloToken, buyAmount, FarmFromMode.INTERNAL, clipboard);
      advFarm.push(depositCallStruct);

      toast.loading(`Depositing...`);

      return writeWithEstimateGas({
        address: diamondAddress,
        abi: advFarmABI,
        functionName: "advancedFarm",
        args: [advFarm],
        value: value?.toBigInt(),
      });
    } catch (e: unknown) {
      console.error(e);
      setSubmitting(false);
      toast.dismiss();
      toast.error("Deposit failed");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [
    writeWithEstimateGas,
    setSubmitting,
    account.address,
    diamondAddress,
    swapBuild,
    siloToken,
    tokenIn,
    amountInTV,
    balanceFrom,
    swapData,
    shouldSwap,
    shouldConvertDeposit,
    convertQuote,
    convertRouteIndex,
  ]);

  const isWellUnderlying = siloToken.tokens?.some((tk) => stringEq(tk, tokenIn.address));

  const swapDataNotReady = (shouldSwap && (!swapData || !swapBuild)) || !!swapQuery.error;
  const convertDataNotReady = shouldConvertDeposit && (!convertQuote || !convertResult);

  // Check pair token balance for convert deposits
  const pairTokenBalance = underlyingPairToken ? farmerBalances.balances.get(underlyingPairToken) : undefined;
  const pairTokenBalanceFromMode = pairTokenBalance
    ? getBalanceFromMode(pairTokenBalance, balanceFrom)
    : TokenValue.ZERO;
  const exceedsPairTokenBalance = shouldConvertDeposit && pairTokenBalanceFromMode.lt(secondaryAmountInTV);

  // Check main token balance in silo for convert deposits
  const exceedsConvertibleAmount = shouldConvertDeposit && convertibleAmount && convertibleAmount.lt(amountInTV);

  const disabled =
    !stringToNumber(amountIn) ||
    !account.address ||
    submitting ||
    isConfirming ||
    swapDataNotReady ||
    convertDataNotReady ||
    exceedsBalance ||
    exceedsPairTokenBalance ||
    exceedsConvertibleAmount;

  const buttonText =
    exceedsBalance || exceedsPairTokenBalance || exceedsConvertibleAmount ? "Insufficient Funds" : "Deposit";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row justify-between items-center">
          <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
            Amount and token to use
          </div>
          <SlippageButton slippage={slippage} setSlippage={setSlippage} />
        </div>
        <ComboInputField
          amount={amountIn}
          setAmount={setAmountIn}
          setToken={handleSetTokenIn}
          setBalanceFrom={setBalanceFrom}
          selectedToken={shouldConvertDeposit && underlyingPairToken ? underlyingPairToken : tokenIn}
          balanceFrom={balanceFrom}
          tokenSelectLoading={!didSetPreferred || preferredLoading}
          filterTokens={filterSet}
          disableClamping={true}
          customTokenSelector={
            siloToken.isLP && underlyingPairToken ? (
              <DepositTokenSelect
                farmerBalances={farmerBalances.balances}
                shouldConvertDeposit={shouldConvertDeposit}
                setShouldConvertDeposit={setShouldConvertDeposit}
                selected={shouldConvertDeposit && underlyingPairToken ? underlyingPairToken : tokenIn}
                filterTokens={filterSet}
                selectToken={handleSetTokenIn}
                onConvertSelect={handleConvertDepositSelect}
                underlyingPairToken={underlyingPairToken}
                siloToken={siloToken}
                balanceFrom={balanceFrom}
                setBalanceFrom={setBalanceFrom}
                disableOpen={false}
              />
            ) : undefined
          }
          tokenAndBalanceMap={
            shouldConvertDeposit && farmerDepositData ? new Map([[mainToken, farmerDepositData.amount]]) : undefined
          }
          customMaxAmount={maxes.in}
        />
        {shouldConvertDeposit && underlyingPairToken && (
          <div className="pt-4">
            <Row className="gap-1">
              <Label className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light mb-2 block">
                Amount of Pinto to Convert
              </Label>
              <TooltipSimple
                triggerClassName="mb-2"
                variant="outlined"
                content={`Farmers can combine their existing Pinto Deposited in the Silo with ${underlyingPairToken.symbol} to Deposit into ${siloToken.symbol} without affecting price`}
              />
            </Row>
            <ComboInputField
              disabled
              disableInput
              amount={secondaryAmountInTV.toHuman()}
              setAmount={setAmountIn}
              setToken={noop}
              setBalanceFrom={noop}
              selectedToken={mainToken}
              balanceFrom={balanceFrom}
              tokenSelectLoading={false}
              filterTokens={filterSet}
              disableClamping={true}
              disableButton={true}
              tokenAndBalanceMap={farmerDepositData ? new Map([[mainToken, farmerDepositData.amount]]) : undefined}
              customMaxAmount={maxes.other}
              hideMax
              altText="Deposited Amount"
            />
          </div>
        )}
        <AnimatePresence mode="wait">
          {((!depositOutput && amountInTV.gt(0)) ||
            swapQuery.isLoading ||
            (shouldConvertDeposit && convertQuery.isLoading) ||
            depositOutput) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1 }}
              className="relative overflow-hidden mt-6"
            >
              {(!depositOutput && amountInTV.gt(0)) ||
              swapQuery.isLoading ||
              (shouldConvertDeposit && convertQuery.isLoading) ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FrameAnimator size={64} />
                </div>
              ) : depositOutput ? (
                (() => {
                  const { stalkLabel, seedsLabel } = getSiloLabels(depositOutput.stalkGain, depositOutput.seedGain);
                  return (
                    <SiloOutputDisplay
                      amount={depositOutput.amount}
                      token={siloToken}
                      stalk={depositOutput.stalkGain}
                      seeds={depositOutput.seedGain}
                      stalkLabel={stalkLabel}
                      seedsLabel={seedsLabel}
                    />
                  );
                })()
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
        {!depositingSiloToken && amountInTV.gt(0) && !shouldConvertDeposit && (
          <RoutingAndSlippageInfo
            title="Total Deposit Slippage"
            swapSummary={swapSummary}
            priceImpactSummary={priceImpactSummary}
            preferredSummary={isWellUnderlying ? "priceImpact" : "swap"}
            txnType="Deposit"
            tokenIn={tokenIn}
            tokenOut={siloToken}
          />
        )}
        {slippageWarning}
      </div>
      <div className="flex-row gap-2 hidden sm:flex">
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={tokenIn}
          disabled={disabled || !canProceed}
          amount={amountIn}
          balanceFrom={balanceFrom}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
        />
      </div>
      <MobileActionBar>
        <SmartSubmitButton
          variant="gradient"
          size="xxl"
          token={tokenIn}
          disabled={disabled || !canProceed}
          amount={amountIn}
          balanceFrom={balanceFrom}
          submitFunction={onSubmit}
          submitButtonText={buttonText}
          className="h-full"
        />
      </MobileActionBar>
    </div>
  );
}

export default Deposit;

const advFarmABI = [
  {
    type: "function",
    inputs: [
      {
        name: "data",
        internalType: "struct AdvancedFarmCall[]",
        type: "tuple[]",
        components: [
          { name: "callData", internalType: "bytes", type: "bytes" },
          { name: "clipboard", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "advancedFarm",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
    stateMutability: "payable",
  },
] as const;

const DepositTokenSelectRow = ({
  token,
  balanceAmount,
  price,
  onClick,
}: {
  token: Token;
  balanceAmount: TokenValue;
  price: TokenValue;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex flex-row w-full items-center justify-between gap-4 p-4 cursor-pointer hover:bg-pinto-gray-1 rounded-sm"
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-2 sm:gap-4">
        <img src={token.logoURI} alt={token.name} className="w-10 h-10 sm:w-12 sm:h-12 flex flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="flex justify-start font-[400] text-[1rem] sm:text-[1.25rem] text-pinto-gray-5">
            {token.symbol}
          </div>
          <div className="flex justify-start font-[340] text-[0.875rem] sm:text-[1rem] text-pinto-gray-4 text-left">
            {token.name}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-end font-[340] text-[1.5rem] text-black">
          {formatter.token(balanceAmount, token)}
        </div>
        <div className="flex justify-end font-[340] text-[1rem] text-pinto-gray-4">
          {formatter.usd(price.mul(balanceAmount))}
        </div>
      </div>
    </div>
  );
};

const DepositTokenSelect = ({
  selected,
  filterTokens,
  selectToken,
  setShouldConvertDeposit,
  onConvertSelect,
  underlyingPairToken,
  siloToken,
  disableOpen = false,
  farmerBalances,
  balanceFrom,
  setBalanceFrom,
  balancesToShow,
  isLoading,
  disabled,
}: {
  selected: Token | undefined;
  filterTokens: Set<Token>;
  selectToken: (t: Token) => void;
  shouldConvertDeposit: boolean;
  setShouldConvertDeposit: (value: boolean) => void;
  onConvertSelect: () => void;
  underlyingPairToken?: Token;
  siloToken: Token;
  disableOpen?: boolean;
  farmerBalances: ReturnType<typeof useFarmerBalances>["balances"];
  balanceFrom?: FarmFromMode;
  setBalanceFrom?: Dispatch<SetStateAction<FarmFromMode>>;
  balancesToShow?: FarmFromMode[];
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const priceData = usePriceData();

  const handleOpenChange = (open: boolean) => {
    if (disableOpen) return;
    setOpen(open);
    if (!open) {
      setShowOtherOptions(false);
    }
  };

  const { mainToken } = useTokenData();

  const handleConvertDepositSelect = () => {
    onConvertSelect();
    setOpen(false);
    setShowOtherOptions(false);
  };

  const handleStandardTokenSelect = (token: Token) => {
    setShouldConvertDeposit(false);
    selectToken(token);
    setOpen(false);
    setShowOtherOptions(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} key={`deposit-token-select`}>
      <DialogTrigger asChild>
        <Button
          variant="outline-gray-shadow"
          size="xl"
          rounded="full"
          className={cn(
            disabled || isLoading ? "pointer-events-none" : "pointer-events-auto",
            "flex-none items-center h-12 gap-1",
          )}
          onClick={(e) => {
            if (disabled || isLoading) e.preventDefault();
          }}
        >
          <div className="flex flex-row items-center gap-1">
            {isLoading ? (
              <>
                <Skeleton className={"w-6 h-6 rounded-full"} />
                <Skeleton className={cn("h-5 rounded-sm", !disabled ? "sm:w-20" : "sm:w-14")} />
              </>
            ) : selected ? (
              <>
                <IconImage src={selected.logoURI} size={6} />
                <div className="pinto-body-light">{selected.symbol}</div>
              </>
            ) : (
              <div className="pinto-body-light">Select Token</div>
            )}
            <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xl flex flex-col gap-3 overflow-x-clip pb-2">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3">
            <DialogHeader>
              <DialogTitle>
                <span className="font-[400] text-[1.25rem]">Select Token</span>
                {balanceFrom && setBalanceFrom && (
                  <div className="mt-6">
                    <SourceBalanceSelect
                      balanceFrom={balanceFrom}
                      setBalanceFrom={setBalanceFrom}
                      balancesToShow={balancesToShow}
                    />
                  </div>
                )}
              </DialogTitle>
            </DialogHeader>
          </div>
          <Separator className="w-[120%] -ml-6 mt-4 sm:mt-6 mb-2" />
          <ScrollArea className="-mx-4 sm:mt-2">
            <div className="mx-0 max-h-[60dvh]">
              {[...farmerBalances.keys()].map((token) => {
                const balance = farmerBalances.get(token);
                if (!balance || filterTokens.has(token)) return null;
                if (token.isNative && balanceFrom === FarmFromMode.INTERNAL) {
                  return null;
                }
                const tokenPrice = priceData.tokenPrices.get(token);
                const price = tokenPrice?.instant ?? TokenValue.ZERO;
                let balanceAmount: TokenValue;
                switch (balanceFrom) {
                  case FarmFromMode.EXTERNAL:
                    balanceAmount = balance.external;
                    break;
                  case FarmFromMode.INTERNAL:
                    balanceAmount = balance.internal;
                    break;
                  default:
                    balanceAmount = balance.total;
                }
                return (
                  <DepositTokenSelectRow
                    key={`deposit-token-select-${token.address}`}
                    token={token}
                    balanceAmount={balanceAmount}
                    price={price}
                    onClick={() => handleStandardTokenSelect(token)}
                  />
                );
              })}
              {underlyingPairToken && (
                <div className="mt-2 mx-0">
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
                        onClick={handleConvertDepositSelect}
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
                            Deposit {underlyingPairToken.symbol} from wallet and convert Pinto from Silo to{" "}
                            {siloToken.symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                  </VerticalAccordion>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
