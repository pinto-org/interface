import { TokenValue } from "@/classes/TokenValue";
import { usePriceData } from "@/state/usePriceData";
import { Token } from "@/utils/types";
import { Address } from "viem";
import { useAccount } from "wagmi";
import CheckmarkCircle from "./CheckmarkCircle";
import { CheckmarkIcon, PlusIcon } from "./Icons";
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
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";
import { PrivateModeWrapper } from "./PrivateModeWrapper";

function TokenSelectItem({
  token,
  balanceAmount,
  price,
  isSelected,
}: {
  token: Token;
  balanceAmount: TokenValue;
  price: TokenValue;
  isSelected: boolean;
}) {
  return (
    <ToggleGroupItem
      value={token.address}
      aria-label={`Select ${token.name}`}
      className="flex flex-row w-[105%] py-4 h-auto justify-between data-[state=on]:bg-transparent hover:bg-pinto-gray-1 data-[state=on]:hover:bg-pinto-gray-1"
    >
      <div className="flex flex-row items-center gap-4">
        <CheckmarkCircle isSelected={isSelected} />
        <img src={token.logoURI} alt={token.name} className="w-12 h-12" />
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
          <PrivateModeWrapper>
            ${balanceAmount?.gt(0) ? Number(price.mul(balanceAmount).toHuman()).toFixed(2) : 0.0}
          </PrivateModeWrapper>
        </div>
      </div>
    </ToggleGroupItem>
  );
}

export default function MultiTokenSelectWithBalances({
  setTokens,
  selectedTokens,
  tokenAndBalanceMap,
  customTitle,
}: {
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  selectedTokens: Token[];
  tokenAndBalanceMap: Map<Token, TokenValue>;
  customTitle?: string;
}) {
  const account = useAccount();
  const priceData = usePriceData();

  const availableTokens = [...tokenAndBalanceMap.keys()];
  const selectedTokenAddresses: string[] = selectedTokens.map((token) => token.address);

  function selectToken(value: string[]) {
    // Create a map for quick token lookup by address
    const tokenByAddress = new Map(availableTokens.map((token) => [token.address, token]));

    // Map selected addresses back to tokens
    const newSelectedTokens = value
      .map((address) => tokenByAddress.get(address as Address))
      .filter((token): token is Token => token !== undefined);

    // Update tokens state
    setTokens(newSelectedTokens);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`font-[340] text-[1.25rem] bg-white leading-[1.375rem] h-12 px-4 rounded-full text-black w-auto gap-2`}
        >
          <PlusIcon color={"currentColor"} /> Add more tokens
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto overflow-x-clip">
        <DialogHeader>
          <DialogTitle>
            <span className="font-[400] text-[1.25rem]">{customTitle || "Select Token"}</span>
            <Separator className="w-[120%] -ml-6 mt-6" />
          </DialogTitle>
          <DialogDescription>
            <ScrollArea className="h-[600px] -mx-4 mt-2">
              <div className="mx-4">
                <ToggleGroup
                  type="multiple"
                  value={selectedTokenAddresses}
                  onValueChange={(value) => {
                    if (value) selectToken(value);
                  }}
                  className="flex flex-col w-full h-auto justify-between gap-2"
                >
                  {[...tokenAndBalanceMap.keys()].map((token) => {
                    const balance = tokenAndBalanceMap.get(token);
                    const tokenPrice = priceData.tokenPrices.get(token);
                    if (!balance) return;
                    const price = tokenPrice ? tokenPrice.instant : TokenValue.ZERO;
                    const isSelected = selectedTokens.includes(token);
                    return (
                      <TokenSelectItem
                        key={token.address}
                        token={token}
                        balanceAmount={balance}
                        price={price}
                        isSelected={isSelected}
                      />
                    );
                  })}
                </ToggleGroup>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="w-[calc(100%+16px)] -mx-2 -mb-2 mt-4 rounded-[1rem] font-[400] text-[1.25rem] text-black hover:text-black leading-[110%] h-14"
                  >{`Select ${selectedTokens.length} token${selectedTokens.length > 1 ? "s" : ""} from my Farm Balance`}</Button>
                </DialogClose>
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
