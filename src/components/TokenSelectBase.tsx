import arrowDown from "@/assets/misc/ChevronDown.svg";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Separator } from "@/components/ui/Separator";

import { Token } from "@/utils/types";
import { useState } from "react";


const SelectionRow = ({ token, onClick }: { token: Token; onClick: () => void }) => {
  return (
    <div
      className="flex flex-row w-full items-center gap-4 p-4 cursor-pointer hover:bg-pinto-gray-1 rounded-sm"
      onClick={onClick}
    >
      <IconImage src={token.logoURI} size={12} />
      <div className="flex flex-col gap-1 items-start">
        <div className="pinto-body text-pinto-secondary">{token.symbol}</div>
        <div className="pinto-sm-light text-pinto-light">{token.name}</div>
      </div>
    </div>
  );
};

interface ITokenSelectBaseDialogProps {
  selected: Token;
  tokens: Token[];
  selectToken: (t: Token) => void;
  onTokenSelect?: (t: Token) => void;
  onOpenChange?: (open: boolean) => void;
}

const TokenSelectBase = ({
  selected,
  tokens,
  selectToken,
  onTokenSelect,
  onOpenChange
}: ITokenSelectBaseDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSelectToken = (token: Token) => {
    selectToken(token);
    onTokenSelect?.(token);
    setOpen(false);
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    onOpenChange?.(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline-gray-shadow" size="xl" rounded="full">
          <div className="flex flex-row items-center gap-1">
            <IconImage src={selected.logoURI} size={6} />
            <div className="pinto-body-light">{selected.symbol}</div>
            <IconImage src={arrowDown} size={3} alt={"open token select dialog"} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md flex flex-col gap-3 overflow-x-clip">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3">
            <DialogTitle>
              <DialogHeader>
                <div className="pinto-body">Select a token</div>
              </DialogHeader>
            </DialogTitle>
          </div>
          <Separator className="w-[120%] -ml-6 mt-4 sm:mt-6" />
          <div className="flex flex-col -m-2 sm:-m-4 mt-2 sm:mt-3">
            {tokens.map((token) => (
              <SelectionRow
                key={`withdraw-token-select${token.symbol}`}
                token={token}
                onClick={() => handleSelectToken(token)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default TokenSelectBase;