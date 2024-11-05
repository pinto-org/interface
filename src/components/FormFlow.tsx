import { ChevronDownIcon, RightArrowIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";

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

export default function FlowForm({
  children,
  stepNumber,
  stepDescription,
  totalSteps,
  enableNextStep,
  onSubmit,
  setStep,
  customBackStepFunction,
  customNextStepFunction,
  disableTopSeparator,
}: FlowFormProps) {
  const isFirstStep = stepNumber === 1;
  const isFinalStep = stepNumber === totalSteps;
  const [direction, setDirection] = useState(1);

  const handleNextStep = () => {
    setDirection(1);
    if (isFinalStep) {
      onSubmit();
    } else if (customNextStepFunction) {
      customNextStepFunction();
    } else {
      setStep(stepNumber + 1);
    }
  };

  const handlePreviousStep = () => {
    setDirection(-1);
    if (customBackStepFunction) {
      customBackStepFunction();
    } else {
      setStep(stepNumber - 1);
    }
  };

  const slideVariants = {
    enter: {
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    },
  };

  const bottomVariants = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  return (
    <>
      <div className="font-[400] text-[1.25rem] leading-[110%] text-pinto-gray-5 flex flex-row items-center">
        <span className="pr-1">{stepNumber}</span>
        <RightArrowIcon color="currentColor" />
        <span className="pl-4">{stepDescription}</span>
      </div>
      <div className="flex flex-col gap-12">
        <div className="relative overflow-y-visible">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={stepNumber}
              custom={stepNumber}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col gap-12 justify-start"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepNumber}
            variants={bottomVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.2,
              height: {
                type: "spring",
                damping: 25,
                stiffness: 200,
              },
            }}
          >
            {!disableTopSeparator && <Separator className="mb-12" />}
            <div className="flex flex-row justify-between">
              <Button
                onClick={handleNextStep}
                variant={!isFinalStep ? "defaultAlt" : "default"}
                disabled={!enableNextStep}
                className="rounded-full font-[400] text-[1.5rem] md:px-6 md:py-4 h-[3.625rem]"
              >
                {isFinalStep ? "Send" : "Continue"}
              </Button>
              <div className="flex flex-row items-center">
                <Button
                  disabled={isFirstStep}
                  onClick={handlePreviousStep}
                  variant={!isFinalStep ? "defaultAlt" : "default"}
                  className="rounded-l-full rounded-r-none h-[3.25rem] px-6 w-[3.25rem] disabled:bg-pinto-green-1"
                >
                  <div className="rotate-90 scale-[1.65]">
                    <ChevronDownIcon color="currentColor" />
                  </div>
                </Button>
                <Button
                  disabled={isFinalStep || !enableNextStep}
                  onClick={handleNextStep}
                  variant={!isFinalStep ? "defaultAlt" : "default"}
                  className={`rounded-l-none rounded-r-full border-l h-[3.25rem] px-6 w-[3.25rem] disabled:bg-pinto-green-1 ${!isFinalStep ? "border-l-pinto-green-3" : "border-l-white  disabled:bg-pinto"}`}
                >
                  <div className="-rotate-90 scale-[1.65]">
                    <ChevronDownIcon color="currentColor" />
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
