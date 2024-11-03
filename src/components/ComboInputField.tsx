import { TokenValue } from "@/classes/TokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { usePriceData } from "@/state/usePriceData";
import { FarmFromMode, Token } from "@/utils/types";
import useDebounce from "@/utils/useDebounce";
import { Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import TokenSelectWithBalances from "./TokenSelectWithBalances";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/Skeleton";

export interface ComboInputProps extends InputHTMLAttributes<HTMLInputElement> {
  setToken: Dispatch<SetStateAction<Token>>;
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
  disableInlineBalance?: boolean;
  balancesToShow?: FarmFromMode[] | undefined;
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
  disableButton,
  disableInlineBalance,
  balancesToShow,
}: ComboInputProps) {
  let maxAmount: TokenValue;
  const { balances } = useFarmerBalances();
  const depositTokenBalance = balances.get(selectedToken);
  const [internalAmount, setInternalAmount] = useState(amount);
  const tokenPrices = usePriceData();
  const selectedTokenPrice = tokenPrices.tokenPrices.get(selectedToken)?.instant || TokenValue.ZERO;
  const inputValue = (disableInput ? amount : internalAmount)
    ? selectedTokenPrice.mul(disableInput ? amount : internalAmount)
    : undefined;
  const usdValue = inputValue && inputValue.gt(0) ? `$${Number(inputValue.toHuman()).toFixed(2)}` : undefined;

  if (tokenAndBalanceMap) {
    maxAmount = tokenAndBalanceMap.get(selectedToken) ?? TokenValue.ZERO;
  } else {
    switch (balanceFrom) {
      case FarmFromMode.EXTERNAL:
        maxAmount = depositTokenBalance?.external || TokenValue.ZERO;
        break;
      case FarmFromMode.INTERNAL:
        maxAmount = depositTokenBalance?.internal || TokenValue.ZERO;
        break;
      default:
        maxAmount = depositTokenBalance?.total || TokenValue.ZERO;
    }
  }

  useDebounce(
    () => {
      setAmount(internalAmount);
    },
    [internalAmount],
    500,
  );

  function changeValue(value: string) {
    if (disableClamping) {
      setInternalAmount(value);
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
        }
      }
    }
  }

  return (
    <>
      <div className="border border-pinto-gray-blue content-center bg-white transition-colors p-4 rounded-[0.75rem] focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            {isLoading ? (
              <Skeleton className="flex w-full h-8 rounded-[0.75rem]" />
            ) : (
              <input
                min={0}
                type="number"
                disabled={disableInput}
                className="flex w-full px-1 text-2xl text-black font-[400] align-middle focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              <div className="font-[340] text-[1rem] text-pinto-gray-4">{usdValue}</div>
              <div className="flex flex-row gap-2 items-center">
                <div className="text-[1rem] text-black font-[340] leading-[1.11rem] -tracking-[0.02em]">
                  {`${
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
