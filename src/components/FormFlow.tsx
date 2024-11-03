import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { ChevronDownIcon, RightArrowIcon } from "@/components/Icons";

import { ReactNode } from "react";

interface FlowFormProps {
    children: ReactNode;
    stepNumber: number;
    totalSteps: number;
    enableNextStep: boolean;
    stepDescription: string;
    onSubmit: () => void;
    setStep: (step: number) => void;
    customBackStepFunction?: (() => void) | undefined;
    customNextStepFunction?: (() => void) | undefined;
    disableTopSeparator?: boolean;
}

export default function FlowForm({ children, stepNumber, stepDescription, totalSteps, enableNextStep, onSubmit, setStep, customBackStepFunction, customNextStepFunction, disableTopSeparator }: FlowFormProps) {

    const isFirstStep = stepNumber === 1;
    const isFinalStep = stepNumber === totalSteps;

    const handleNextStep = () => {
      if (isFinalStep) {
          onSubmit();
      } else if (customNextStepFunction) {
          customNextStepFunction();
      } else {
          setStep(stepNumber + 1);
      }
  };

  const handlePreviousStep = () => {
      if (customBackStepFunction) {
          customBackStepFunction();
      } else {
          setStep(stepNumber - 1);
      }
  };


  return (
    <>
      <div className="font-[400] text-[1.25rem] leading-[110%] text-pinto-gray-5 flex flex-row items-center">
        <span className="pr-1">{stepNumber}</span>
        <RightArrowIcon color="currentColor" />
        <span className="pl-4">{stepDescription}</span>
      </div>
      <div className="flex flex-col gap-12">
        {children}
        <> 
        {!disableTopSeparator && <Separator />}
        <div className="flex flex-row justify-between">
          <Button
            onClick={handleNextStep}
            variant={!isFinalStep ? 'defaultAlt' : 'default'}
            disabled={!enableNextStep}
            className="rounded-full font-[400] text-[1.5rem] md:px-6 md:py-4 h-[3.625rem]"
          >
            {isFinalStep ? "Send" : "Continue"}
          </Button>
          <div className="flex flex-row items-center">
            <Button
              disabled={isFirstStep}
              onClick={handlePreviousStep}
              variant={!isFinalStep ? 'defaultAlt' : 'default'}
              className="rounded-l-full rounded-r-none h-[3.25rem] px-6 w-[3.25rem] disabled:bg-pinto-green-1"
            >
              <div className="scale-[1.65] -mt-0.5">
                <ChevronDownIcon color={"currentColor"} />
              </div>
            </Button>
            <Button
              disabled={isFinalStep || !enableNextStep}
              onClick={handleNextStep}
              variant={!isFinalStep ? 'defaultAlt' : 'default'}
              className={`rounded-l-none rounded-r-full border-l h-[3.25rem] px-6 w-[3.25rem] disabled:bg-pinto-green-1 ${!isFinalStep ? "border-l-pinto-green-3" : "border-l-white"}`}
            >
              <div className="rotate-180 scale-[1.65] mt-1">
                <ChevronDownIcon color={"currentColor"} />
              </div>
            </Button>
          </div>
        </div>
        </>
      </div>
    </>
  );
};