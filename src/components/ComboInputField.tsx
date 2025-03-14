import depositIcon from "@/assets/protocol/Deposit.svg";
import plotIcon from "@/assets/protocol/Plot.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter, truncateHex } from "@/utils/format";
import { stringToNumber, toValidStringNumInput } from "@/utils/string";
import { FarmFromMode, Plot, Token } from "@/utils/types";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { cn } from "@/utils/utils";
import { Dispatch, InputHTMLAttributes, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import PlotSelect from "./PlotSelect";
import TokenSelectWithBalances from "./TokenSelectWithBalances";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/Skeleton";

const ETH_GAS_RESERVE = TokenValue.fromHuman("0.0003333333333", 18); // Reserve $1 of gas if eth is $3k

export interface ComboInputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Token mode props
  setToken?: Dispatch<SetStateAction<Token>> | ((token: Token) => void);
  selectedToken?: Token;
  tokenNameOverride?: string;
  tokenAndBalanceMap?: Map<Token, TokenValue>;
  setBalanceFrom?: Dispatch<SetStateAction<FarmFromMode>>;
  balanceFrom?: FarmFromMode;
  setError?: Dispatch<SetStateAction<boolean>>;
  error?: boolean;
  balancesToShow?: FarmFromMode[];
  tokenSelectLoading?: boolean;
  filterTokens?: Set<Token> | undefined;

  // Amount props
  amount: string;
  setAmount?: Dispatch<SetStateAction<string>> | ((value: string) => void);

  // Common optional props
  connectedAccount?: boolean;
  isLoading?: boolean;
  hideMax?: boolean;
  disableInput?: boolean;
  disableClamping?: boolean;
  disableButton?: boolean;
  disableDebounce?: boolean;
  disableInlineBalance?: boolean;
  mode?: "deposits" | "plots" | "balance";
  inputFrameColor?: "white" | "off-white";
  altText?: string;
  altTextMobile?: string;
  customMaxAmount?: TokenValue;
  customMinAmount?: TokenValue;
  disableClampMinOn0?: boolean; // disables clamping to minimum amount when amount == 0
  selectKey?: string;

  // Plot mode props (required when mode is "plots")
  selectedPlots?: Plot[];
  setPlots?: Dispatch<SetStateAction<Plot[]>>;
  plotSelectionType?: "single" | "multiple";
}

function ComboInputField({
  setToken,
  selectedToken,
  tokenNameOverride,
  tokenAndBalanceMap,
  setBalanceFrom,
  balanceFrom,
  amount,
  setAmount,
  setError,
  error,
  connectedAccount,
  isLoading,
  hideMax,
  disableInput,
  disableClampMinOn0,
  disableClamping,
  disableDebounce,
  disableButton,
  disableInlineBalance,
  balancesToShow,
  mode,
  altText,
  altTextMobile,
  customMaxAmount,
  customMinAmount,
  selectedPlots,
  setPlots,
  plotSelectionType,
  inputFrameColor,
  tokenSelectLoading,
  filterTokens,
  selectKey,
}: ComboInputProps) {
  const tokenData = useTokenData();
  const { balances } = useFarmerBalances();
  const farmerTokenBalance = selectedToken ? balances.get(selectedToken) : undefined;

  const depositedBalances = useFarmerSiloNew().deposits;
  const farmerDepositedTokenBalance = selectedToken ? depositedBalances.get(selectedToken) : undefined;

  // Convert input string amount to TokenValue
  const getDecimals = useCallback(() => {
    if (mode === "plots") return PODS.decimals;
    return selectedToken?.decimals ?? 18;
  }, [mode, selectedToken]);

  const amountAsTokenValue = useMemo(() => {
    return TokenValue.fromHuman(amount || "0", getDecimals());
  }, [amount, getDecimals]);

  // Internal state uses TokenValue
  const [internalAmount, setInternalAmount] = useState<TokenValue>(amountAsTokenValue);
  const [displayValue, setDisplayValue] = useState(amount);
  const [isUserInput, setIsUserInput] = useState(false);

  const tokenPrices = usePriceData();
  const selectedTokenPrice = selectedToken
    ? tokenPrices.tokenPrices.get(selectedToken)?.instant || TokenValue.ZERO
    : TokenValue.ZERO;
  const protocolTokenPrice = tokenPrices.tokenPrices.get(tokenData.mainToken)?.instant || TokenValue.ZERO;

  useEffect(() => {
    if (!isUserInput) {
      setInternalAmount(amountAsTokenValue);
      setDisplayValue(amount);
    }

    if (connectedAccount && amountAsTokenValue.gt(maxAmount)) {
      setError?.(true);
    } else {
      setError?.(false);
    }
  }, [amount, amountAsTokenValue, connectedAccount]);

  const pct = useMemo(() => {
    if (mode === "plots") return TokenValue.ONE;
    if (!farmerDepositedTokenBalance || !farmerDepositedTokenBalance.amount.gt(0)) {
      return TokenValue.ZERO;
    }
    const currentAmount = disableInput ? amountAsTokenValue : internalAmount;
    if (currentAmount.eq(0)) {
      return TokenValue.ZERO;
    }
    return currentAmount.div(farmerDepositedTokenBalance.amount);
  }, [mode, farmerDepositedTokenBalance, disableInput, amountAsTokenValue, internalAmount]);

  const depositedTokenValue = farmerDepositedTokenBalance
    ? farmerDepositedTokenBalance.currentBDV.mul(pct).mul(protocolTokenPrice)
    : TokenValue.ZERO;

  const inputValue = (disableInput ? amountAsTokenValue : internalAmount).gt(0)
    ? mode === "deposits"
      ? depositedTokenValue
      : selectedTokenPrice.mul(disableInput ? amountAsTokenValue : internalAmount)
    : undefined;

  const maxAmount = useMemo(() => {
    if (mode === "plots" && selectedPlots) {
      return selectedPlots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO);
    }

    if (customMaxAmount) {
      return customMaxAmount;
    }

    if (tokenAndBalanceMap && selectedToken) {
      return tokenAndBalanceMap.get(selectedToken) ?? TokenValue.ZERO;
    }

    if (!farmerTokenBalance) return TokenValue.ZERO;

    switch (balanceFrom) {
      case FarmFromMode.EXTERNAL:
        return farmerTokenBalance.external || TokenValue.ZERO;
      case FarmFromMode.INTERNAL:
        return farmerTokenBalance.internal || TokenValue.ZERO;
      default:
        return farmerTokenBalance.total || TokenValue.ZERO;
    }
  }, [mode, selectedPlots, customMaxAmount, tokenAndBalanceMap, selectedToken, balanceFrom, farmerTokenBalance]);

  const balance = useMemo(() => {
    if (mode === "plots" && selectedPlots) {
      return selectedPlots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO);
    }
    if (mode === "balance") {
      if (tokenAndBalanceMap && selectedToken) {
        return tokenAndBalanceMap.get(selectedToken) ?? TokenValue.ZERO;
      }
    }
    return maxAmount;
  }, [mode, selectedPlots, tokenAndBalanceMap, selectedToken, maxAmount]);

  // clamp the internal amount to the max amount
  useEffect(() => {
    if (internalAmount.gt(maxAmount) && !disableClamping) {
      setInternalAmount(maxAmount);
      setDisplayValue(maxAmount.toHuman());
    }
  }, [selectedToken, maxAmount, disableClamping]);

  /**
   * If the amount is < customMinAmount, set the internal amount to customMinAmount
   * We use 'amount' instead of internal amount to allow input < customMinAmount for a brief period of time. 'amount' is debounced.
   * Ex: minAmount = 2, maxAmount = 30
   * If the user wants to input 10, they should be able to do that w/o this effect clamping the value to 2.
   */
  useDebouncedEffect(() => {
    if (!customMinAmount || customMinAmount.eq(0)) return;

    const amountTV = TokenValue.fromHuman(stringToNumber(amount), customMinAmount.decimals);

    if (amountTV.eq(0) && disableClampMinOn0) return;
    if (amountTV.lt(customMinAmount)) {
      setInternalAmount(customMinAmount);
      setDisplayValue(customMinAmount.toHuman());
    }
  }, [amount, customMinAmount, disableClampMinOn0]);

  useEffect(() => {
    if (mode === "plots" && selectedPlots?.length) {
      const plotAmount = selectedPlots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO);
      setInternalAmount(plotAmount);
      setDisplayValue(plotAmount.toHuman());
      if (setAmount) {
        setAmount(plotAmount.toHuman());
      }
    }
  }, [mode, selectedPlots, setAmount]);

  useDebouncedEffect(
    () => {
      if (isUserInput) {
        if (setAmount) {
          setAmount(internalAmount.toHuman());
        }
        setIsUserInput(false);
      }
    },
    [internalAmount, isUserInput],
    disableDebounce ? 0 : 500,
  );

  function changeValue(_value: string) {
    const value = toValidStringNumInput(_value);
    setIsUserInput(true);
    setDisplayValue(value);

    if (disableClamping) {
      const tokenValue = TokenValue.fromHuman(value || "0", getDecimals());
      setInternalAmount(tokenValue);
      return;
    }

    if (!value || value === "") {
      setInternalAmount(TokenValue.ZERO);
      return;
    }

    const inputTV = TokenValue.fromHuman(value, getDecimals());
    if (inputTV.gt(maxAmount)) {
      setInternalAmount(maxAmount);
      setDisplayValue(maxAmount.toHuman());
    } else {
      setInternalAmount(inputTV);
    }
  }

  const shouldShowAdditionalInfo = () => {
    const currentAmount = disableInput ? amountAsTokenValue : internalAmount;
    return currentAmount.gt(0);
  };

  const handleSetMax = () => {
    if (disableInput) return;
    if (selectedToken?.isNative) {
      // For ETH, subtract gas reserve from max amount
      const maxWithGasReserve = maxAmount.gt(ETH_GAS_RESERVE) ? maxAmount.sub(ETH_GAS_RESERVE) : TokenValue.ZERO;
      setInternalAmount(maxWithGasReserve);
      setDisplayValue(maxWithGasReserve.toHuman());
      setAmount?.(maxWithGasReserve.toHuman());
    } else {
      setInternalAmount(maxAmount);
      setDisplayValue(maxAmount.toHuman());
      setAmount?.(maxAmount.toHuman());
    }
  };

  const plotIdsToShow = useMemo(() => {
    if (!selectedPlots?.length) return "";
    const sortedPlots = [...selectedPlots].sort((a, b) => Number(a.index.sub(b.index).toHuman()));
    return sortedPlots.map((plot) => truncateHex(plot.idHex)).join(", ");
  }, [selectedPlots]);

  return (
    <>
      <div
        className={cn(
          // border-pinto-error
          "border",
          error ? "border-pinto-error" : "border-pinto-gray-blue",
          "content-center transition-colors p-3 sm:p-4 rounded-[0.75rem] focus-within:outline-none focus-within:ring-1",
          error ? "focus-within:ring-errorRing" : "focus-within:ring-ring",
          inputFrameColor === "off-white" ? "bg-pinto-off-white" : "bg-white",
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            {isLoading ? (
              <Skeleton className="flex w-full h-8 rounded-[0.75rem]" />
            ) : (
              <input
                min={0}
                type="number"
                disabled={disableInput}
                className={
                  "flex w-full pr-1 text-[2rem] h-[2.2rem] leading-[2.2rem] text-black font-[400] align-middle focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:bg-transparent"
                }
                value={disableInput ? amount : displayValue}
                onChange={(e) => changeValue(e.target.value)}
              />
            )}
            {mode === "plots"
              ? setPlots && (
                  <PlotSelect type={plotSelectionType || "single"} selectedPlots={selectedPlots} setPlots={setPlots} />
                )
              : setToken &&
                selectedToken && (
                  <TokenSelectWithBalances
                    setToken={setToken}
                    selectedToken={selectedToken}
                    tokenNameOverride={tokenNameOverride}
                    setBalanceFrom={setBalanceFrom}
                    balanceFrom={balanceFrom}
                    balancesToShow={balancesToShow}
                    tokenAndBalanceMap={tokenAndBalanceMap}
                    disabled={disableButton}
                    isLoading={tokenSelectLoading}
                    filterTokens={filterTokens}
                    selectKey={selectKey}
                  />
                )}
          </div>
          {!disableInlineBalance && (
            <div className="flex flex-row gap-2 justify-between items-center">
              <div className="font-[340] text-[1rem] text-pinto-gray-4 flex flex-row gap-2 items-center">
                {shouldShowAdditionalInfo() && mode !== "plots" ? (
                  isLoading ? (
                    <Skeleton className="flex w-8 h-4 rounded-lg" />
                  ) : (
                    formatter.usd(inputValue)
                  )
                ) : null}
                {mode === "deposits" && shouldShowAdditionalInfo() && (
                  <>
                    <span className="hidden sm:flex flex-row gap-1 items-center">
                      <img src={stalkIcon} alt="Stalk" className="w-6 h-6" />
                      {formatter.number(farmerDepositedTokenBalance?.stalk.total.mul(pct))}
                    </span>
                    <span className="hidden sm:flex flex-row gap-1 items-center">
                      <img src={seedIcon} alt="Seeds" className="w-6 h-6" />
                      {formatter.number(farmerDepositedTokenBalance?.seeds.mul(pct))}
                    </span>
                  </>
                )}
                {mode === "plots" && selectedPlots && selectedPlots?.length > 1 && (
                  <span className="hidden sm:flex flex-row gap-1 items-center">
                    {`Plot${selectedPlots.length > 1 ? "s" : ""}: ${plotIdsToShow}`}
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-2 items-center">
                {isLoading ? (
                  <Skeleton className="flex w-20 h-5 rounded-lg" />
                ) : (
                  <div className="text-[1rem] text-black font-[340] leading-[1.11rem] -tracking-[0.02em] flex flex-row gap-2 items-center">
                    {altText && mode === "deposits" && <img src={depositIcon} alt="Deposit" />}
                    {altText && mode === "plots" && <img src={plotIcon} alt="Plots" />}
                    {altText ? (
                      <>
                        <span className="sm:hidden">{altTextMobile ?? altText}</span>
                        <span className="hidden sm:inline">{altText}</span>
                        {` ${balance.toHuman("short")}`}
                      </>
                    ) : (
                      <span>
                        {balanceFrom === FarmFromMode.EXTERNAL ? (
                          <>
                            <span className="sm:hidden">Wallet:</span>
                            <span className="hidden sm:inline">Wallet Balance:</span>
                            {` ${balance.toHuman("short")}`}
                          </>
                        ) : balanceFrom === FarmFromMode.INTERNAL ? (
                          <>
                            <span className="sm:hidden">Farm:</span>
                            <span className="hidden sm:inline">Farm Balance:</span>
                            {` ${balance.toHuman("short")}`}
                          </>
                        ) : (
                          <>
                            <span className="sm:hidden">Total:</span>
                            <span className="hidden sm:inline">Total Balance:</span>
                            {` ${balance.toHuman("short")}`}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                )}
                {!hideMax && (
                  <Button
                    type="button"
                    size="sm"
                    variant="defaultAlt"
                    noPadding
                    rounded="some"
                    className="h-auto"
                    onClick={handleSetMax}
                  >
                    <div className="pinto-sm px-1.5 py-1 text-pinto-green-3">Max</div>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

ComboInputField.displayName = "ComboInput";

export { ComboInputField };
