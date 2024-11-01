import { TokenValue } from "@/classes/TokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { usePriceData } from "@/state/usePriceData";
import { FarmFromMode, Token } from "@/utils/types";
import useDebounce from "@/utils/useDebounce";
import { Dispatch, InputHTMLAttributes, SetStateAction, useEffect, useState } from "react";
import TokenSelectWithBalances from "./TokenSelectWithBalances";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/Skeleton";
import depositIcon from "@/assets/protocol/Deposit.svg";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";

export interface ComboInputProps extends InputHTMLAttributes<HTMLInputElement> {
  setToken: Dispatch<SetStateAction<any>>;
  selectedToken: Token;
  tokenAndBalanceMap?: Map<Token, TokenValue> | undefined;
  setBalanceFrom?: Dispatch<SetStateAction<FarmFromMode>> | undefined;
  balanceFrom?: FarmFromMode | undefined;
  amount: any;
  setAmount: Dispatch<SetStateAction<any>>;
  isLoading?: boolean;
  hideMax?: boolean;
  disableInput?: boolean;
  disableClamping?: boolean;
  disableButton?: boolean;
  disableDebounce?: boolean;
  disableInlineBalance?: boolean;
  balancesToShow?: FarmFromMode[] | undefined;
  mode?: "deposits";
  altText?: string;
  customMaxAmount?: TokenValue;
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
  customMaxAmount
}: ComboInputProps) {
  let maxAmount: TokenValue;
  const tokenData = useTokenData();
  const { balances } = useFarmerBalances();
  const farmerTokenBalance = balances.get(selectedToken);

  const depositedBalances = useFarmerDepositedBalances();
  const farmerDepositedTokenBalance = depositedBalances.data.get(selectedToken);

  const [internalAmount, setInternalAmount] = useState(amount);
  const [isUserInput, setIsUserInput] = useState(false);

  const tokenPrices = usePriceData();
  const selectedTokenPrice = tokenPrices.tokenPrices.get(selectedToken)?.instant || TokenValue.ZERO;
  const protocolTokenPrice = tokenPrices.tokenPrices.get(tokenData.mainToken)?.instant || TokenValue.ZERO;

  const pct = (() => {
    if (!farmerDepositedTokenBalance || !farmerDepositedTokenBalance.amount.gt(0)) {
      return TokenValue.ZERO;
    }
    const currentAmount = TokenValue.fromHuman(
      (disableInput ? amount : internalAmount) || "0",
      selectedToken.decimals
    );
    if (currentAmount.eq(0)) {
      return TokenValue.ZERO;
    }
    return currentAmount.div(farmerDepositedTokenBalance.amount);
  })();
  
  const depositedTokenValue = farmerDepositedTokenBalance ? farmerDepositedTokenBalance.currentBDV.mul(pct).mul(protocolTokenPrice) : TokenValue.ZERO;

  const inputValue = (disableInput ? amount : internalAmount)
    ? mode === "deposits" ? depositedTokenValue : selectedTokenPrice.mul(disableInput ? amount : internalAmount)
    : undefined;

  if (customMaxAmount) {
    maxAmount = customMaxAmount;
  } else if (tokenAndBalanceMap) {
    maxAmount = tokenAndBalanceMap.get(selectedToken) ?? TokenValue.ZERO;
  } else {
    switch (balanceFrom) {
      case FarmFromMode.EXTERNAL:
        maxAmount = farmerTokenBalance?.external || TokenValue.ZERO;
        break;
      case FarmFromMode.INTERNAL:
        maxAmount = farmerTokenBalance?.internal || TokenValue.ZERO;
        break;
      default:
        maxAmount = farmerTokenBalance?.total || TokenValue.ZERO;
    }
  }

  useEffect(() => {
    if (Number(amount) > Number(maxAmount.toHuman())) {
      setInternalAmount(maxAmount.humanString);
    }
  }, [selectedToken]);

  useEffect(() => {
    if (customMaxAmount && !isUserInput) {
      const currentAmount = internalAmount ? 
        TokenValue.fromHuman(internalAmount.toString(), selectedToken.decimals) : 
        TokenValue.ZERO;

      // Only update if the current amount is greater than max
      if (currentAmount.gt(customMaxAmount)) {
        setInternalAmount(customMaxAmount.toHuman());
      }
    }
  }, [customMaxAmount, selectedToken.decimals]);

  useDebounce(
    () => {
      if (isUserInput) {
        setAmount(internalAmount);
        setIsUserInput(false);
      }
    },
    [internalAmount, isUserInput],
    disableDebounce ? 0 : 500,
  );

  function changeValue(value: string) {
    setIsUserInput(true);
    if (disableClamping) {
      setInternalAmount(value);
      return;
    }

    // Handle empty input
    if (!value || value === "") {
      setInternalAmount(undefined);
      return;
    }

    const inputTV = value ? TokenValue.fromHuman(value, selectedToken.decimals) : TokenValue.ZERO;
    if (inputTV.gt(maxAmount)) {
      setInternalAmount(maxAmount.toHuman());
    } else {
      if (!value) {
        setInternalAmount(undefined);
      } else {
        if (Number(internalAmount) === Number(inputTV.toHuman())) {
          setInternalAmount(value);
        } else {
          setInternalAmount(inputTV.toHuman());
        };
      }
    }
  }

  const shouldShowAdditionalInfo = () => {
    const currentAmount = disableInput ? amount : internalAmount;
    return currentAmount && Number(currentAmount) > 0;
  };

  return (
    <>
      <div className="border border-pinto-gray-blue content-center bg-white transition-colors py-4 px-6 rounded-[0.75rem] focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            {isLoading ? (
              <Skeleton className="flex w-full h-8 rounded-[0.75rem]" />
            ) : (
              <input
                min={0}
                type="number"
                disabled={disableInput}
                className="flex w-full pr-1 text-2xl text-black font-[400] align-middle focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={disableInput ? amount : internalAmount}
                onChange={(e) => changeValue(e.target.value)}
              />
            )}
            <TokenSelectWithBalances
              setToken={setToken}
              selectedToken={selectedToken}
              setBalanceFrom={setBalanceFrom}
              balanceFrom={balanceFrom}
              balancesToShow={balancesToShow}
              tokenAndBalanceMap={tokenAndBalanceMap}
              disabled={disableButton}
            />
          </div>
          {!disableInlineBalance && (
            <div className="flex flex-row gap-2 justify-between items-center">
              <div className="font-[340] text-[1rem] text-pinto-gray-4 flex flex-row gap-2 items-center">
                {shouldShowAdditionalInfo() && formatter.usd(inputValue)}
                {mode === "deposits" && shouldShowAdditionalInfo() && (
                  <>
                    <span className="flex flex-row gap-1 items-center">
                      <img src={stalkIcon} alt={"Stalk"} className="w-6 h-6" />
                      {formatter.number(farmerDepositedTokenBalance?.stalk.total.mul(pct))}
                    </span>
                    <span className="flex flex-row gap-1 items-center">
                      <img src={seedIcon} alt={"Seeds"} className="w-6 h-6" />
                      {formatter.number(farmerDepositedTokenBalance?.seeds.mul(pct))}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="text-[1rem] text-black font-[340] leading-[1.11rem] -tracking-[0.02em] flex flex-row gap-2">
                  {altText && <img src={depositIcon} alt={"Deposit"} />}
                  {`${altText ? altText : 
                    balanceFrom === FarmFromMode.EXTERNAL
                      ? "Wallet Balance:"
                      : balanceFrom === FarmFromMode.INTERNAL
                        ? "Farm Balance:"
                        : "Total Balance:"
                  }
                  ${maxAmount?.toHuman("short")}`}
                </div>

                {!hideMax && (
                  <Button
                    type={"button"}
                    size={"sm"}
                    variant={"defaultAlt"}
                    className={"rounded-[0.75rem] text-[1rem] px-1.5 py-1 h-auto"}
                    onClick={() => setInternalAmount(maxAmount.humanString)}
                  >
                    Max
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
