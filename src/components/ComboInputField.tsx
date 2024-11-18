import depositIcon from "@/assets/protocol/Deposit.svg";
import plotIcon from "@/assets/protocol/Plot.svg";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter, truncateHex } from "@/utils/format";
import { FarmFromMode, Plot, Token } from "@/utils/types";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { cn } from "@/utils/utils";
import { Dispatch, InputHTMLAttributes, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import PlotSelect from "./PlotSelect";
import TokenSelectWithBalances from "./TokenSelectWithBalances";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/Skeleton";
import Text from "./ui/Text";

export interface ComboInputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Token mode props
  setToken?: Dispatch<SetStateAction<Token>> | ((token: Token) => void);
  selectedToken?: Token;
  tokenAndBalanceMap?: Map<Token, TokenValue>;
  setBalanceFrom?: Dispatch<SetStateAction<FarmFromMode>>;
  balanceFrom?: FarmFromMode;
  balancesToShow?: FarmFromMode[];
  tokenSelectLoading?: boolean;
  filterTokens?: Set<Token> | undefined;

  // Amount props
  amount: string;
  setAmount?: Dispatch<SetStateAction<string>> | ((value: string) => void);

  // Common optional props
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
  customMaxAmount?: TokenValue;

  // Plot mode props (required when mode is "plots")
  selectedPlots?: Plot[];
  setPlots?: Dispatch<SetStateAction<Plot[]>>;
  plotSelectionType?: "single" | "multiple";
}

function ComboInputField({
  setToken,
  selectedToken,
  tokenAndBalanceMap,
  setBalanceFrom,
  balanceFrom,
  amount,
  setAmount,
  isLoading,
  hideMax,
  disableInput,
  disableClamping,
  disableDebounce,
  disableButton,
  disableInlineBalance,
  balancesToShow,
  mode,
  altText,
  customMaxAmount,
  selectedPlots,
  setPlots,
  plotSelectionType,
  inputFrameColor,
  tokenSelectLoading,
  filterTokens,
}: ComboInputProps) {
  const tokenData = useTokenData();
  const { balances } = useFarmerBalances();
  const farmerTokenBalance = selectedToken ? balances.get(selectedToken) : undefined;

  const depositedBalances = useFarmerDepositedBalances();
  const farmerDepositedTokenBalance = selectedToken ? depositedBalances.data.get(selectedToken) : undefined;

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
  }, [amount, amountAsTokenValue]);

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

  useEffect(() => {
    if (internalAmount.gt(maxAmount)) {
      setInternalAmount(maxAmount);
      setDisplayValue(maxAmount.toHuman());
    }
  }, [selectedToken, maxAmount]);

  useEffect(() => {
    if (customMaxAmount && !isUserInput && internalAmount.gt(customMaxAmount)) {
      setInternalAmount(customMaxAmount);
      setDisplayValue(customMaxAmount.toHuman());
    }
  }, [customMaxAmount]);

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

  function changeValue(value: string) {
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
    setInternalAmount(maxAmount);
    setDisplayValue(maxAmount.toHuman());
    setAmount?.(maxAmount.toHuman());
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
          "border border-pinto-gray-blue content-center transition-colors p-4 rounded-[0.75rem] focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
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
                    setBalanceFrom={setBalanceFrom}
                    balanceFrom={balanceFrom}
                    balancesToShow={balancesToShow}
                    tokenAndBalanceMap={tokenAndBalanceMap}
                    disabled={disableButton}
                    isLoading={tokenSelectLoading}
                    filterTokens={filterTokens}
                  />
                )}
          </div>
          {!disableInlineBalance && (
            <div className="flex flex-row gap-2 justify-between items-center">
              <div className="font-[340] text-[1rem] text-pinto-gray-4 flex flex-row gap-2 items-center">
                {shouldShowAdditionalInfo() && mode !== "plots" && formatter.usd(inputValue)}
                {mode === "deposits" && shouldShowAdditionalInfo() && (
                  <>
                    <span className="flex flex-row gap-1 items-center">
                      <img src={stalkIcon} alt="Stalk" className="w-6 h-6" />
                      {formatter.number(farmerDepositedTokenBalance?.stalk.total.mul(pct))}
                    </span>
                    <span className="flex flex-row gap-1 items-center">
                      <img src={seedIcon} alt="Seeds" className="w-6 h-6" />
                      {formatter.number(farmerDepositedTokenBalance?.seeds.mul(pct))}
                    </span>
                  </>
                )}
                {mode === "plots" && selectedPlots && selectedPlots?.length > 1 && (
                  <span className="flex flex-row gap-1 items-center">
                    {`Plot${selectedPlots.length > 1 ? "s" : ""}: ${plotIdsToShow}`}
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="text-[1rem] text-black font-[340] leading-[1.11rem] -tracking-[0.02em] flex flex-row gap-2 items-center">
                  {altText && mode === "deposits" && <img src={depositIcon} alt="Deposit" />}
                  {altText && mode === "plots" && <img src={plotIcon} alt="Plots" />}
                  {`${
                    altText
                      ? altText
                      : balanceFrom === FarmFromMode.EXTERNAL
                        ? "Wallet Balance:"
                        : balanceFrom === FarmFromMode.INTERNAL
                          ? "Farm Balance:"
                          : "Total Balance:"
                  } ${balance.toHuman("short")}`}
                </div>
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
                    <Text variant="sm" className="px-1.5 py-1" color="green3">
                      Max
                    </Text>
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
