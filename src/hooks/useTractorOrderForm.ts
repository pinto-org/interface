import { useCallback, useRef, useState, useEffect } from "react";
import { TokenValue } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import { SowOrderTokenStrategy } from "@/lib/Tractor/types";
import {
  TractorOrderFormState,
  TractorOrderFormHandlers,
  TractorOrderFormValidation,
  UseTractorOrderFormReturn,
  UseTractorOrderFormProps,
  TipLevel,
} from "@/lib/Tractor/tractorOrderTypes";
import {
  sanitizeNumericInputValue,
  validateRequiredFields,
  validateMinMaxAmounts,
  getTipValue,
  calculatePodLineValue,
} from "@/lib/Tractor/tractorOrderUtils";
import { formatter } from "@/utils/format";

export function useTractorOrderForm({ averageTipValue }: UseTractorOrderFormProps): UseTractorOrderFormReturn {
  const temperatureInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formState, setFormState] = useState<TractorOrderFormState>({
    totalAmount: "",
    minSoil: "",
    maxPerSeason: "",
    temperature: "",
    displayTemperature: "",
    podLineLength: "",
    operatorTip: averageTipValue.toString(),
    morningAuction: true,
    selectedTokenStrategy: { type: "LOWEST_SEEDS" },
    showTokenSelectionDialog: false,
    error: null,
    activeTipButton: "average",
  });

  // Validation logic
  const validation: TractorOrderFormValidation = {
    areRequiredFieldsFilled: () => {
      const { isValid } = validateRequiredFields(formState);
      return isValid;
    },
    getMissingFields: () => {
      const { missingFields } = validateRequiredFields(formState);
      return missingFields;
    },
  };

  // Validation effect for min/max amounts
  useEffect(() => {
    const error = validateMinMaxAmounts(formState.minSoil, formState.maxPerSeason, PINTO.decimals);
    setFormState(prev => ({ ...prev, error }));
  }, [formState.minSoil, formState.maxPerSeason]);

  // Form handlers
  const handlers: TractorOrderFormHandlers = {
    handleSetTotalAmount: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const sanitized = sanitizeNumericInputValue(value, PINTO.decimals);
      setFormState(prev => ({ ...prev, totalAmount: sanitized.str }));
    }, []),

    handleSetMinSoil: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const sanitized = sanitizeNumericInputValue(value, PINTO.decimals);
      setFormState(prev => ({ ...prev, minSoil: sanitized.str }));
    }, []),

    handleSetMaxPerSeason: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const sanitized = sanitizeNumericInputValue(value, PINTO.decimals);
      setFormState(prev => ({ ...prev, maxPerSeason: sanitized.str }));
    }, []),

    handleTemperatureChange: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Remove any existing % signs
      value = value.replace(/%/g, "");
      
      // Allow digits and decimal points
      if (!/^\d*\.?\d*$/.test(value) && value !== "") return;
      
      setFormState(prev => ({
        ...prev,
        displayTemperature: value,
        temperature: value,
      }));
    }, []),

    handleTemperatureBlur: useCallback(() => {
      if (formState.displayTemperature && !formState.displayTemperature.endsWith("%")) {
        const valueWithPercent = `${formState.displayTemperature}%`;
        setFormState(prev => ({
          ...prev,
          displayTemperature: valueWithPercent,
        }));
      }
    }, [formState.displayTemperature]),

    handleTemperatureFocus: useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      // Remove % sign when focusing for easier editing
      const valueWithoutPercent = formState.displayTemperature.replace(/%/g, "");
      setFormState(prev => ({
        ...prev,
        displayTemperature: valueWithoutPercent,
      }));
      // Select all text for easy replacement
      e.target.select();
    }, [formState.displayTemperature]),

    handleTemperatureKeyDown: useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
          // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode !== 190) {
        e.preventDefault();
      }
    }, []),

    handlePodLineLengthChange: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const sanitized = sanitizeNumericInputValue(value, PINTO.decimals);
      setFormState(prev => ({ ...prev, podLineLength: sanitized.str }));
    }, []),

    handlePodLineSelect: useCallback((increment: number) => {
      // This will be handled by the component with calculations
      // For now, just update the state
      setFormState(prev => ({ ...prev, podLineLength: `${increment}%` }));
    }, []),

    handleOperatorTipChange: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const sanitized = sanitizeNumericInputValue(value, PINTO.decimals);
      setFormState(prev => ({ 
        ...prev, 
        operatorTip: sanitized.str,
        activeTipButton: null, // Reset active button when typing manually
      }));
    }, []),

    handleTipButtonClick: useCallback((level: TipLevel) => {
      const tipValue = getTipValue(level, averageTipValue);
      setFormState(prev => ({
        ...prev,
        operatorTip: tipValue,
        activeTipButton: level,
      }));
    }, [averageTipValue]),

    setMorningAuction: useCallback((value: boolean) => {
      setFormState(prev => ({ ...prev, morningAuction: value }));
    }, []),

    setSelectedTokenStrategy: useCallback((strategy: SowOrderTokenStrategy) => {
      setFormState(prev => ({ ...prev, selectedTokenStrategy: strategy }));
    }, []),

    setShowTokenSelectionDialog: useCallback((open: boolean) => {
      setFormState(prev => ({ ...prev, showTokenSelectionDialog: open }));
    }, []),
  };

  // Prefill form function for editing existing orders
  const prefillForm = useCallback((data: Partial<TractorOrderFormState>) => {
    setFormState(prev => ({ ...prev, ...data }));
  }, []);

  return {
    formState,
    handlers,
    validation,
    temperatureInputRef,
    prefillForm,
  };
}