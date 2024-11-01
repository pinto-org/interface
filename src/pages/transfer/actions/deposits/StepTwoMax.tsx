import { Label } from "@/components/ui/Label";
import DepositsList from "../../DepositsList";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/Button";
import AddressInputField from "@/components/AddressInputField";

interface StepTwoMaxProps {
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  usingMax: boolean;
  setUsingMax: Dispatch<SetStateAction<boolean>>;
}

export default function StepTwoMax({ destination, setDestination, usingMax, setUsingMax }: StepTwoMaxProps) {
  return (
    <>
    <div className="flex flex-row justify-end -mt-[4.75rem]">
          <Button
            className={`font-[340] text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent`}
            onClick={() => setUsingMax(!usingMax)}
            >
            {!usingMax ? "Send all Deposits" : "Send only some of my Deposits"}
        </Button>
        </div>
        <DepositsList />
        <div className="flex flex-col gap-2">
        <Label>Send deposits to</Label>
        <AddressInputField 
          value={destination}
          setValue={setDestination}
        />
      </div>
    </>
  );
};