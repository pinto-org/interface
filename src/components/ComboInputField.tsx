import depositIcon from "@/assets/protocol/Deposit.svg";
import plotIcon from "@/assets/protocol/Plot.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter, truncateHex } from "@/utils/format";
import { sanitizeNumericInputValue, stringEq, stringToNumber, toValidStringNumInput } from "@/utils/string";
import { FarmFromMode, Plot, Token } from "@/utils/types";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { cn } from "@/utils/utils";
import {
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PlotSelect from "./PlotSelect";
import TextSkeleton from "./TextSkeleton";
import TokenSelectWithBalances, { TransformTokenLabelsFunction } from "./TokenSelectWithBalances";
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

  // Token select props
  transformTokenLabels?: TransformTokenLabelsFunction;
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
  transformTokenLabels,
  placeholder,
}: ComboInputProps) {
  const tokenData = useTokenData();
  const { balances } = useFarmerBalances();
  const farmerTokenBalance = selectedToken ? balances.get(selectedToken) : undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  const depositedBalances = useFarmerSilo().deposits;
  const farmerDepositedTokenBalance = selectedToken ? depositedBalances.get(selectedToken) : undefined;

  // Convert input string amount to TokenValue
  const getDecimals = useCallback(() => {
    if (mode === "plots") return PODS.decimals;

    return selectedToken?.decimals ?? 18;
  }, [mode, selectedToken]);

  const amountAsTokenValue = useSafeTokenValue(amount, getDecimals());

  // Internal state uses TokenValue
  const [internalAmount, setInternalAmount] = useState<TokenValue>(amountAsTokenValue);
  const [displayValue, setDisplayValue] = useState(amount);
  const [isUserInput, setIsUserInput] = useState(false);

  // Track the last amount we set internally to detect external changes
  const lastInternalAmountRef = useRef<string>(amount);

  const tokenPrices = usePriceData();
  const selectedTokenPrice = selectedToken
    ? tokenPrices.tokenPrices.get(selectedToken)?.instant || TokenValue.ZERO
    : TokenValue.ZERO;
  const protocolTokenPrice = tokenPrices.tokenPrices.get(tokenData.mainToken)?.instant || TokenValue.ZERO;

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

  /**
   * Clamp the input amount to the max amount ONLY IF clamping is enabled
   * @returns
   * - the clamped amount
   * - whether it was clamped
   * - whether it exceeds the max amount
   */
  const getClamped = useCallback(
    (
      inputAmount: TokenValue,
      maxInputAmount: TokenValue,
    ): {
      amount: TokenValue;
      didClamp: boolean;
      exceedsMax: boolean;
    } => {
      const obj = {
        amount: inputAmount,
        didClamp: false,
        exceedsMax: inputAmount.gt(maxInputAmount),
      };

      if (!disableClamping && obj.exceedsMax) {
        obj.amount = maxInputAmount;
        obj.didClamp = true;
      }

      return obj;
    },
    [disableClamping],
  );

  /**
   * Set the error state
   * - ONLY when the condition & connectedAccount are truthy
   */
  const handleSetError = useCallback(
    (condition: boolean) => {
      if (!connectedAccount) return;
      setError?.(Boolean(condition && connectedAccount));
    },
    [connectedAccount, setError],
  );

  /**
   * Clamp the internal amount to the max amount
   * - ONLY when the selected token changes
   * - ONLY when the max amount changes
   * - ONLY when the amount has been changed by the user
   *
   * Input clamping is handled in changeValue()
   */
  useEffect(() => {
    const clamped = getClamped(internalAmount, maxAmount);
    if (!clamped.didClamp) return;

    setInternalAmount(clamped.amount);
    setDisplayValue(clamped.amount.toHuman());
  }, [selectedToken, maxAmount, getClamped]);

  /**
   * Handle changes to the amount from outside the component
   *
   * - If the amount is changed from outside the component, sync the internal and display states
   * - Set the error state if the amount exceeds the max amount
   */
  useEffect(() => {
    // Only react to external changes (not changes we made internally)
    if (isUserInput || amount === lastInternalAmountRef.current) return;

    setInternalAmount((prev) => (prev.eq(amountAsTokenValue) ? prev : amountAsTokenValue));
    setDisplayValue((prev) => (stringEq(prev, amount) ? prev : amount));
    handleSetError(amountAsTokenValue.gt(maxAmount));
  }, [amount, amountAsTokenValue, handleSetError]);

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
      const newAmount = plotAmount.toHuman();
      setInternalAmount(plotAmount);
      setDisplayValue(newAmount);
      if (setAmount) {
        setAmount(newAmount);
        lastInternalAmountRef.current = newAmount;
      }
    }
  }, [mode, selectedPlots, setAmount]);

  /**
   * Handle setting the amount from the internal amount
   *
   * - If the amount is changed from inside the component, set the amount to the internal amount
   * - Set the isUserInput state to false
   */
  useDebouncedEffect(
    () => {
      if (isUserInput) {
        if (setAmount) {
          const newAmount = internalAmount.toHuman();
          setAmount(newAmount);
          lastInternalAmountRef.current = newAmount;
        }
        setIsUserInput(false);
      }
    },
    [internalAmount, isUserInput],
    disableDebounce ? 0 : 500,
  );

  const [shouldRefocus, setShouldRefocus] = useState(false);

  useEffect(() => {
    if (shouldRefocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 0);
      setShouldRefocus(false);
    }
  }, [shouldRefocus]);

  /**
   * Handle user input
   *
   * - If the input is disabled, return
   * - Set the isUserInput state to true
   * - Sanitize the input value
   * - Clamp the input value to the max amount if clamping is enabled
   * - Set the internal amount to the clamped amount
   * - Set the error state for immediate feedback on insufficient balance
   */
  const changeValue = useCallback(
    (value: string) => {
      // If the input is disabled, early return
      if (disableInput) {
        return;
      }

      // Toggle isUserInput to true
      setIsUserInput(true);

      // Sanitize the input value
      const cleaned = sanitizeNumericInputValue(value, getDecimals());
      const clamped = getClamped(cleaned.tv, maxAmount);

      // Set the display value to the sanitized string value
      setDisplayValue(clamped.didClamp ? clamped.amount.toHuman() : cleaned.str);

      // Set the internal amount returned from getClamped()
      setInternalAmount(clamped.didClamp ? clamped.amount : cleaned.tv);

      // If the input was clamped, set the shouldRefocus state to true
      if (clamped.didClamp) {
        setShouldRefocus(true);
      }

      // Set error state for immediate feedback on insufficient balance
      handleSetError(clamped.exceedsMax);
    },
    [disableInput, getDecimals, maxAmount, handleSetError],
  );

  const shouldShowAdditionalInfo = () => {
    const currentAmount = disableInput ? amountAsTokenValue : internalAmount;
    return currentAmount.gt(0);
  };

  const handleSetMax = () => {
    if (disableInput) return;
    if (selectedToken?.isNative) {
      // For ETH, subtract gas reserve from max amount
      const maxWithGasReserve = maxAmount.gt(ETH_GAS_RESERVE) ? maxAmount.sub(ETH_GAS_RESERVE) : TokenValue.ZERO;
      const newAmount = maxWithGasReserve.toHuman();
      setInternalAmount(maxWithGasReserve);
      setDisplayValue(newAmount);
      setAmount?.(newAmount);
      lastInternalAmountRef.current = newAmount;
    } else {
      const newAmount = maxAmount.toHuman();
      setInternalAmount(maxAmount);
      setDisplayValue(newAmount);
      setAmount?.(newAmount);
      lastInternalAmountRef.current = newAmount;
    }

    setShouldRefocus(true);
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
          error ? "focus-within:ring-errorRing" : disableInput ? "focus-within:ring-0" : "focus-within:ring-ring",
          inputFrameColor === "off-white" ? "bg-pinto-off-white" : "bg-white",
        )}
      >
        <div className="flex flex-col gap-2">
          <div className={cn("flex flex-row items-center", isLoading && "justify-between gap-2")}>
            <TextSkeleton loading={isLoading} className="flex flex-col w-full h-8">
              <input
                ref={inputRef}
                min={0}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                disabled={disableInput}
                placeholder={placeholder || "0"}
                className={
                  "flex w-full pr-1 text-[2rem] h-[2.2rem] leading-[2.2rem] text-black font-[400] align-middle focus-visible:outline-none placeholder:text-pinto-light disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:bg-transparent cursor-text"
                }
                value={disableInput ? amount : displayValue}
                onChange={(e) => changeValue(e.target.value)}
              />
            </TextSkeleton>
            {mode === "plots"
              ? setPlots && (
                  <PlotSelect type={plotSelectionType || "single"} selectedPlots={selectedPlots} setPlots={setPlots} />
                )
              : setToken &&
                selectedToken && (
                  <TokenSelectWithBalances
                    selectedToken={selectedToken}
                    tokenNameOverride={tokenNameOverride}
                    balanceFrom={balanceFrom}
                    balancesToShow={balancesToShow}
                    tokenAndBalanceMap={tokenAndBalanceMap}
                    disabled={disableButton}
                    isLoading={tokenSelectLoading}
                    filterTokens={filterTokens}
                    selectKey={selectKey}
                    setToken={setToken}
                    setBalanceFrom={setBalanceFrom}
                    transformTokenLabels={transformTokenLabels}
                  />
                )}
          </div>
          {!disableInlineBalance && (
            <div className="flex flex-row gap-2 justify-between items-center">
              <div className="font-[340] text-[1rem] text-pinto-gray-4 flex flex-row gap-2 items-center">
                {shouldShowAdditionalInfo() && mode !== "plots" ? (
                  <TextSkeleton loading={isLoading} className="flex w-8 h-4 rounded-lg">
                    {formatter.usd(inputValue)}
                  </TextSkeleton>
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
                            <span className="hidden sm:inline">ExternalWallet:</span>
                            {` ${balance.toHuman("short")}`}
                          </>
                        ) : balanceFrom === FarmFromMode.INTERNAL ? (
                          <>
                            <span className="sm:hidden">Farm:</span>
                            <span className="hidden sm:inline">Farm Wallet:</span>
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
