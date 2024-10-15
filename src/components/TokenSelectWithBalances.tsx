import { useState } from "react";
import { useAccount } from "wagmi";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { FarmFromMode, Token } from "@/utils/types";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";
import arrowDown from "@/assets/misc/ChevronDown.svg";
import { usePriceData } from "@/state/usePriceData";
import { TokenValue } from "@/classes/TokenValue";
import { Separator } from "./ui/Separator";

export default function TokenSelectWithBalances({
  setToken,
  selectedToken,
  setBalanceFrom,
  balanceFrom,
  balancesToShow
}: {
  setToken: React.Dispatch<React.SetStateAction<any>>;
  selectedToken: Token;
  setBalanceFrom?: React.Dispatch<React.SetStateAction<any>>;
  balanceFrom?: FarmFromMode;
  balancesToShow?: FarmFromMode[] | undefined;
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
        <Button variant={"outline"} className={"inline-flex items-center p-6 gap-1.5 border border-pinto-gray-blue bg-white hover:bg-pinto-green-2/10 drop-shadow-pinto-token-select rounded-full text-black text-[1.25rem] font-[400] leading-[1.3875rem] -tracking-[0.02em]"}>
          <img src={selectedToken.logoURI} className="w-6 h-6" />
          <div>{selectedToken.symbol}</div>
          <img src={arrowDown} className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription>
            <Separator className="w-[31.875rem] -ml-6 top-[4.5rem] absolute"/>
            {account.address ? (
              <div className="mt-8">
              {(balanceFrom && setBalanceFrom) &&
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={_balanceFrom || FarmFromMode.INTERNAL_EXTERNAL}
                  onValueChange={(value) => {
                    if (value) selectBalanceFrom(value as FarmFromMode);
                  }}
                  className="my-2"
                >
                  {(!balancesToShow || balancesToShow.includes(FarmFromMode.INTERNAL_EXTERNAL)) && 
                    <ToggleGroupItem
                      value={FarmFromMode.INTERNAL_EXTERNAL}
                      aria-label="Select Combined Balance"
                      className="w-full"
                    >
                      Combined Balance
                    </ToggleGroupItem>
                  }
                  {(!balancesToShow || balancesToShow.includes(FarmFromMode.EXTERNAL)) && 
                    <ToggleGroupItem
                      value={FarmFromMode.EXTERNAL}
                      aria-label="Select External Balance"
                      className="w-full"
                    >
                      External Balance
                    </ToggleGroupItem>
                  }
                  {(!balancesToShow || balancesToShow.includes(FarmFromMode.INTERNAL)) && 
                    <ToggleGroupItem
                      value={FarmFromMode.INTERNAL}
                      aria-label="Select Internal Balance"
                      className="w-full"
                    >
                      Internal Balance
                    </ToggleGroupItem>
                  }
                </ToggleGroup>
              }
                <ToggleGroup
                  type="single"
                  value={_token as any}
                  onValueChange={(value) => {
                    if (value) selectToken(value);
                  }}
                  className="flex flex-col w-full h-auto justify-between gap-2"
                >
                  {[...balances.keys()].map((token) => {
                    const balance = balances.get(token);
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
                    return (
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
                            ${balanceAmount?.gt(0) ? Number(price.mul(balanceAmount).toHuman()).toFixed(2) : 0.00}
                          </div>
                        </div>
                      </ToggleGroupItem>
                    );
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
