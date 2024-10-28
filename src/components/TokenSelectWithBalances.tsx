import { useState } from "react";
import { useAccount } from "wagmi";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { FarmFromMode, Token } from "@/utils/types";
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
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";
import arrowDown from "@/assets/misc/ChevronDown.svg";
import { usePriceData } from "@/state/usePriceData";
import { TokenValue } from "@/classes/TokenValue";
import { Separator } from "./ui/Separator";
import SourceBalanceSelect from "./SourceBalanceSelect";

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
        value={token}
        aria-label={`Select ${token.name}`}
        className="flex flex-row w-[105%] py-2 h-auto justify-between"
      >
        <div className="flex flex-row items-center gap-4">
          <img src={token.logoURI} className="w-12 h-12" />
          <div className="flex flex-col gap-1">
            <div className="flex justify-start font-[400] text-[1.25rem] text-pinto-gray-5">{token.symbol}</div>
            <div className="flex justify-start font-[340] text-[1rem] text-pinto-gray-4">{token.name}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-end font-[340] text-[1.5rem] text-black">
            {balanceAmount?.gt(0) ? Number(balanceAmount.toHuman()).toFixed(4) : 0}
          </div>
          <div className="flex justify-end font-[340] text-[1rem] text-pinto-gray-4">
            ${balanceAmount?.gt(0) ? Number(price.mul(balanceAmount).toHuman()).toFixed(2) : 0.0}
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
}: {
  setToken: React.Dispatch<React.SetStateAction<any>>;
  selectedToken: Token;
  tokenAndBalanceMap?: Map<Token, TokenValue> | undefined;
  setBalanceFrom?: React.Dispatch<React.SetStateAction<any>> | undefined;
  balanceFrom?: FarmFromMode | undefined;
  balancesToShow?: FarmFromMode[] | undefined;
  size?: "small" | undefined;
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
  function selectToken(value: any) {
    setToken(value);
    setInternalToken(value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={`inline-flex items-center ${size === "small" ? "p-4" : "h-12 px-8"} gap-1.5 border border-pinto-gray-blue bg-white hover:bg-pinto-green-1 drop-shadow-pinto-token-select rounded-full text-black text-[1.25rem] font-[400] leading-[1.3875rem] -tracking-[0.02em]`}
        >
          <img src={selectedToken.logoURI} className={`${size === "small" ? "w-5 h-5" : "w-6 h-6"}`} />
          <div>{selectedToken.symbol}</div>
          <img src={arrowDown} className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto overflow-x-clip">
        <DialogHeader>
          <DialogTitle>
            <span>Select Token</span>
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
            {account.address ? (
              <div className="mt-6">
                <ToggleGroup
                  type="single"
                  value={_token as any}
                  onValueChange={(value) => {
                    if (value) selectToken(value);
                  }}
                  className="flex flex-col w-full h-auto justify-between gap-2"
                >
                  {tokenAndBalanceMap
                    ? [...tokenAndBalanceMap.keys()].map((token) => {
                        const balance = tokenAndBalanceMap.get(token);
                        if (!balance) return;
                        const price = TokenValue.ZERO;
                        return <TokenSelectItem token={token} balanceAmount={balance} price={price} />;
                      })
                    : [...balances.keys()].map((token) => {
                        const balance = balances.get(token);
                        if (!balance) return;
                        const tokenPrice = priceData.tokenPrices.get(token);
                        const price = tokenPrice?.instant ?? TokenValue.ZERO;
                        let balanceAmount;
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
                        return <TokenSelectItem token={token} balanceAmount={balanceAmount} price={price} />;
                      })}
                </ToggleGroup>
              </div>
            ) : (
              "Connect your wallet to see your Balances"
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
