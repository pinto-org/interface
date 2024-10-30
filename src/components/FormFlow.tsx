import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { ChevronDownIcon } from "@/components/Icons";
import { ReactNode } from "react";

interface FlowFormProps {
    children: ReactNode;
    stepNumber: number;
    totalSteps: number;
    enableNextStep: boolean;
    stepDescription: string;
    onSubmit: () => void;
    setStep: (step: number) => void;
}

export default function FlowForm({ children, stepNumber, stepDescription, totalSteps, enableNextStep, onSubmit, setStep }: FlowFormProps) {

    const isFirstStep = stepNumber === 1;
    const isFinalStep = stepNumber === totalSteps;

  return (
    <>
      <div className="font-[400] text-[1.25rem] leading-[110%] text-pinto-gray-5">
        {`${stepNumber} → ${stepDescription}`}
      </div>
      <div className="flex flex-col gap-12">
        {children}
        {enableNextStep &&
        <> 
        <Separator />
        <div className="flex flex-row justify-between">
          <Button
            onClick={() => (!isFinalStep ? setStep(stepNumber + 1) : onSubmit())}
            variant={!isFinalStep ? 'defaultAlt' : 'default'}
            className="rounded-full font-[400] text-[1.5rem] px-6 h-[3.625rem]"
          >
            {isFirstStep ? "Continue" : "Send"}
          </Button>
          <div className="flex flex-row items-center">
            <Button
              disabled={isFirstStep}
              onClick={() => setStep(stepNumber - 1)}
              variant={!isFinalStep ? 'defaultAlt' : 'default'}
              className="rounded-l-full rounded-r-none h-[3.625rem] px-6"
            >
              <div className="scale-[2]">
                <ChevronDownIcon color={"currentColor"} />
              </div>
            </Button>
            <Button
              disabled={isFinalStep}
              onClick={() => setStep(stepNumber + 1)}
              variant={!isFinalStep ? 'defaultAlt' : 'default'}
              className={`rounded-l-none rounded-r-full border-l h-[3.625rem] px-6 ${!isFinalStep ? "border-l-pinto-green-3" : "border-l-white"}`}
            >
              <div className="rotate-180 scale-[2] mt-1.5">
                <ChevronDownIcon color={"currentColor"} />
              </div>
            </Button>
          </div>
        </div>
        </>
        }
      </div>
    </>
  );
};