import { TokenValue } from "@/classes/TokenValue";
import { SowOrderTokenStrategy } from "./types";

// Re-export types from utils for isolated modules compatibility  
export type { SanitizedNumericStrInput, TipLevel } from "./tractorOrderUtils";

// Base interfaces for form state management
export interface TractorOrderFormState {
  totalAmount: string;
  minSoil: string;
  maxPerSeason: string;
  temperature: string;
  displayTemperature: string;
  podLineLength: string;
  operatorTip: string;
  morningAuction: boolean;
  selectedTokenStrategy: SowOrderTokenStrategy;
  showTokenSelectionDialog: boolean;
  error: string | null;
  activeTipButton: "low" | "average" | "high" | null;
}

// Handler interfaces for form actions
export interface TractorOrderFormHandlers {
  handleSetTotalAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetMinSoil: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetMaxPerSeason: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTemperatureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTemperatureBlur: () => void;
  handleTemperatureFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleTemperatureKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePodLineLengthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePodLineSelect: (increment: number) => void;
  handleOperatorTipChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTipButtonClick: (level: "low" | "average" | "high") => void;
  setMorningAuction: (value: boolean) => void;
  setSelectedTokenStrategy: (strategy: SowOrderTokenStrategy) => void;
  setShowTokenSelectionDialog: (open: boolean) => void;
}

// Validation interface
export interface TractorOrderFormValidation {
  areRequiredFieldsFilled: () => boolean;
  getMissingFields: () => string[];
}

// Calculations interface
export interface TractorOrderCalculations {
  calculateEstimatedExecutions: () => string;
  calculateEstimatedTotalTip: () => string;
  calculatePodLineValue: (increment: number) => string;
  isButtonActive: (increment: number) => boolean;
  getSelectedTokenDisplay: () => string;
  getSelectedTokenDollarValue: () => TokenValue;
}

// Cleaned values for calculations
export interface CleanedFormValues {
  min: TokenValue;
  max: TokenValue;
  total: TokenValue;
  podLine: TokenValue;
  temperature: TokenValue;
}

// Component prop interfaces
export interface TractorOrderFormFieldsProps {
  formState: TractorOrderFormState;
  handlers: TractorOrderFormHandlers;
  validation: TractorOrderFormValidation;
  calculations: TractorOrderCalculations;
  currentTemperature: TokenValue;
  podLine: TokenValue;
  temperatureInputRef: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}

export interface TokenSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTokenStrategy: SowOrderTokenStrategy;
  onTokenStrategyChange: (strategy: SowOrderTokenStrategy) => void;
}

export interface TractorOrderSummaryProps {
  orderData: {
    totalAmount: string;
    minSoil: string;
    maxPerSeason: string;
    temperature: string;
    podLineLength: string;
    operatorTip: string;
    tokenStrategy: SowOrderTokenStrategy;
    morningAuction: boolean;
  };
  calculations: TractorOrderCalculations;
  showExecutionEstimates?: boolean;
}

// Hook return types
export interface UseTractorOrderFormReturn {
  formState: TractorOrderFormState;
  handlers: TractorOrderFormHandlers;
  validation: TractorOrderFormValidation;
  temperatureInputRef: React.RefObject<HTMLInputElement>;
  prefillForm: (data: Partial<TractorOrderFormState>) => void;
}

export interface UseTractorOrderFormProps {
  averageTipValue: number;
}

// Token and deposit information interfaces
export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  isLP?: boolean;
}

export interface FarmerDepositInfo {
  amount: TokenValue;
  stalk?: {
    total: number;
  };
  seeds?: number;
}