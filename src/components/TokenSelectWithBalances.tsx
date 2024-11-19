import arrowDown from "@/assets/misc/ChevronDown.svg";
import { TokenValue } from "@/classes/TokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { usePriceData } from "@/state/usePriceData";
import { formatter } from "@/utils/format";
import { FarmFromMode, Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import SourceBalanceSelect from "./SourceBalanceSelect";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { ScrollArea } from "./ui/ScrollArea";
import { Separator } from "./ui/Separator";
import { Skeleton } from "./ui/Skeleton";
import Text from "./ui/Text";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";

function TokenSelectItem({
  token,
  balanceAmount,
  price,
}: {
  token: Token;
  balanceAmount: TokenValue;
  price: TokenValue;
}) {
  return (
    <DialogClose className="flex flex-row w-[105%]">
      <ToggleGroupItem
        value={token.address}
        aria-label={`Select ${token.name}`}
        className="flex flex-row w-[105%] py-4 h-auto justify-between data-[state=on]:bg-transparent hover:bg-pinto-gray-1 data-[state=on]:hover:bg-pinto-gray-1 focus:outline-none"
      >
        <div className="flex flex-row items-center gap-4">
          <img src={token.logoURI} alt={token.name} className="w-12 h-12" />
          <div className="flex flex-col gap-1">
            <div className="flex justify-start font-[400] text-[1.25rem] text-pinto-gray-5">{token.symbol}</div>
            <div className="flex justify-start font-[340] text-[1rem] text-pinto-gray-4">{token.name}</div>
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
      </ToggleGroupItem>
    </DialogClose>
  );
}

export default function TokenSelectWithBalances({
  setToken,
  selectedToken,
  tokenAndBalanceMap,
  setBalanceFrom,
  balanceFrom,
  balancesToShow,
  size,
  disabled,
  isLoading,
  filterTokens,
}: {
  setToken: React.Dispatch<React.SetStateAction<Token>> | ((token: Token) => void);
  selectedToken: Token;
  tokenAndBalanceMap?: Map<Token, TokenValue> | undefined;
  setBalanceFrom?: React.Dispatch<React.SetStateAction<FarmFromMode>> | undefined;
  balanceFrom?: FarmFromMode | undefined;
  balancesToShow?: FarmFromMode[] | undefined;
  size?: "small" | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
  filterTokens?: Set<Token> | undefined;
}) {
  const account = useAccount();
  const { balances } = useFarmerBalances();
  const [_token, setInternalToken] = useState(selectedToken);
  const [_balanceFrom, setInternalBalanceFrom] = useState(balanceFrom);
  const priceData = usePriceData();

  function selectBalanceFrom(value: FarmFromMode) {
    if (!setBalanceFrom) return;
    setBalanceFrom(value);
    setInternalBalanceFrom(value);
  }
  function selectToken(value: Address) {
    const tokenList = tokenAndBalanceMap ? tokenAndBalanceMap.keys() : balances.keys();
    for (const token of tokenList) {
      if (token.address.toLowerCase() === value.toLowerCase()) {
        setToken(token);
        setInternalToken(token);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline-gray-shadow"
          size="xl"
          rounded="full"
          className={`${disabled ? "pointer-events-none" : "pointer-events-auto"} flex-none items-center ${size === "small" ? "" : "h-12"} gap-1`}
        >
          {isLoading ? (
            <>
              <Skeleton className={size === "small" ? "w-5 h-5 rounded-full" : "w-6 h-6 rounded-full"} />
              <Skeleton className={cn("h-5 rounded-sm", !disabled ? "sm:w-20" : "sm:w-14")} />
            </>
          ) : (
            <>
              <img
                src={selectedToken.logoURI}
                alt={selectedToken.name}
                className={`${size === "small" ? "w-5 h-5" : "w-6 h-6"}`}
              />
              <Text variant="body-light">{selectedToken.symbol}</Text>
              {!disabled && <img src={arrowDown} className="w-4 h-4" alt={"open token select dialog"} />}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto overflow-x-clip">
        <DialogHeader>
          <DialogTitle>
            <span className="font-[400] text-[1.25rem]">Select Token</span>
            {balanceFrom && setBalanceFrom && (
              <div className="mt-6">
                <SourceBalanceSelect
                  balanceFrom={balanceFrom}
                  setBalanceFrom={selectBalanceFrom}
                  balancesToShow={balancesToShow}
                />
              </div>
            )}
            <Separator className="w-[120%] -ml-6 mt-6" />
          </DialogTitle>
          <DialogDescription>
            <ScrollArea className="-mx-4 mt-2">
              <div className="mx-4 max-h-[600px] ">
                <ToggleGroup
                  type="single"
                  value={_token.address}
                  onValueChange={(value) => {
                    if (value) selectToken(value as Address);
                  }}
                  className="flex flex-col w-full h-auto justify-between gap-2"
                >
                  {tokenAndBalanceMap
                    ? [...tokenAndBalanceMap.keys()].map((token) => {
                        const balance = tokenAndBalanceMap.get(token);
                        if (!balance || filterTokens?.has(token)) return;
                        const price = TokenValue.ZERO;
                        if (token.isNative && balanceFrom === FarmFromMode.INTERNAL) {
                          return;
                        }

                        return (
                          <TokenSelectItem key={token.address} token={token} balanceAmount={balance} price={price} />
                        );
                      })
                    : [...balances.keys()].map((token) => {
                        const balance = balances.get(token);
                        if (!balance || filterTokens?.has(token)) return;
                        if (token.isNative && balanceFrom === FarmFromMode.INTERNAL) {
                          return;
                        }
                        const tokenPrice = priceData.tokenPrices.get(token);
                        const price = tokenPrice?.instant ?? TokenValue.ZERO;
                        let balanceAmount: TokenValue;
                        switch (_balanceFrom) {
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
                          <TokenSelectItem
                            key={token.address}
                            token={token}
                            balanceAmount={balanceAmount}
                            price={price}
                          />
                        );
                      })}
                </ToggleGroup>
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
