import { useState } from "react";
import { FarmToMode } from "@/utils/types";
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

export default function DestinationBalanceSelect({
  setBalanceTo,
}: {
  setBalanceTo: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [_balanceTo, setInternalBalanceTo] = useState(FarmToMode.EXTERNAL);

  function selectBalanceTo(value: FarmToMode) {
    setBalanceTo(value);
    setInternalBalanceTo(value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          {_balanceTo === FarmToMode.EXTERNAL ? "External Balance" : "Internal Balance"}
        </Button>
      </DialogTrigger>
      <DialogContent className="font-nacelle">
        <DialogHeader>
          <DialogTitle>Select Destination</DialogTitle>
          <DialogDescription>
            <>
              <ToggleGroup
                type="single"
                variant="outline"
                value={_balanceTo}
                onValueChange={(value) => {
                  if (value) selectBalanceTo(value as FarmToMode);
                }}
                className="flex flex-col my-2"
              >
                <DialogClose className="w-full">
                  <ToggleGroupItem
                    value={FarmToMode.EXTERNAL}
                    aria-label="Select External Balance"
                    className="flex flex-col w-full py-2 h-auto"
                  >
                    <div className="text-2xl self-start">External Balance</div>
                    <div className="self-start">Send assets to your wallet</div>
                  </ToggleGroupItem>
                </DialogClose>
                <DialogClose className="w-full">
                  <ToggleGroupItem
                    value={FarmToMode.INTERNAL}
                    aria-label="Select Internal Balance"
                    className="flex flex-col w-full py-2 h-auto"
                  >
                    <div className="text-2xl self-start">Internal Balance</div>
                    <div className="self-start">Send assets to your balance within the protocol</div>
                  </ToggleGroupItem>
                </DialogClose>
              </ToggleGroup>
            </>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
