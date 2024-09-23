import { useState } from "react";
import { useAccount } from "wagmi";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
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
import { Token } from "@/utils/types";
import arrowDown from "@/assets/misc/ChevronDown.svg";

export default function TokenSelectDepositedBalances({
  setToken,
  selectedToken
}: {
  setToken: React.Dispatch<React.SetStateAction<any>>;
  selectedToken: Token
}) {
  const account = useAccount();
  const farmerDeposits = useFarmerDepositedBalances().data;
  const [_token, setInternalToken] = useState(selectedToken);

  function selectToken(value: any) {
    setToken(value);
    setInternalToken(value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="inline-flex items-center p-4 gap-1.5 border border-pinto-gray-blue bg-white hover:bg-pinto-green-2/10 drop-shadow-pinto-token-select rounded-full text-black text-[1.25rem]">
          <img src={_token.logoURI} className="w-5 h-5" />
          <div>{_token.symbol}</div>
          <img src={arrowDown} className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription>
            {account.address ? (
              <>
                <ToggleGroup
                  type="single"
                  value={_token as any}
                  onValueChange={(value) => {
                    if (value) selectToken(value);
                  }}
                  className="flex flex-col w-full h-auto justify-between"
                >
                  {[...farmerDeposits.keys()].map((token) => {
                    const balance = farmerDeposits.get(token).convertibleAmount;
                    return (
                      <DialogClose className="flex flex-row w-full">
                        <ToggleGroupItem
                          value={token}
                          aria-label={`Select ${token.name}`}
                          className="flex flex-row w-full py-2 h-auto justify-between"
                        >
                          <div className="flex flex-col">
                            <div className="flex justify-start text-xl">{token.symbol}</div>
                            <div className="flex justify-start text-xs">{token.name}</div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex justify-end text-xl">
                              {balance?.gt(0) ? Number(balance.toHuman()).toFixed(4) : 0}
                            </div>
                          </div>
                        </ToggleGroupItem>
                      </DialogClose>
                    );
                  })}
                </ToggleGroup>
              </>
            ) : (
              "Connect your wallet to see your Balances"
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
