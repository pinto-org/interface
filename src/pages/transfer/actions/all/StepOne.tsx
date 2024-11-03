import AddressInputField from "@/components/AddressInputField";
import { Label } from "@/components/ui/Label";
import { Dispatch, SetStateAction } from "react";

interface StepOneProps {
  destination?: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
}

export default function StepOne({ destination, setDestination }: StepOneProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Send to</Label>
      <AddressInputField value={destination} setValue={setDestination} />
    </div>
  );
}
