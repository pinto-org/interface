import { TokenValue } from "@/classes/TokenValue";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { stringToNumber } from "@/utils/string";
import { FarmFromMode, Token } from "@/utils/types";
import { getBalanceFromMode } from "@/utils/utils";
import { useCallback, useState } from "react";

export interface SiloActionFormState {
  amountIn: string;
  tokenIn: Token | null;
  tokenOut: Token | null;
  balanceFrom: FarmFromMode;
  slippage: number;
  inputError: boolean;
}

export interface SiloActionFormActions {
  setAmountIn: (amount: string) => void;
  setTokenIn: (token: Token) => void;
  setTokenOut: (token: Token) => void;
  setBalanceFrom: (mode: FarmFromMode) => void;
  setSlippage: (slippage: number) => void;
  setInputError: (error: boolean) => void;
  resetForm: () => void;
}

export function useSiloActionForm(initialTokenIn?: Token, initialTokenOut?: Token) {
  const [amountIn, setAmountIn] = useState("");
  const [tokenIn, setTokenIn] = useState<Token | null>(initialTokenIn || null);
  const [tokenOut, setTokenOut] = useState<Token | null>(initialTokenOut || null);
  const [balanceFrom, setBalanceFrom] = useState(FarmFromMode.INTERNAL_EXTERNAL);
  const [slippage, setSlippage] = useState(0.5);
  const [inputError, setInputError] = useState(false);

  const { balances } = useFarmerBalances();

  const amountInTV = useSafeTokenValue(amountIn, tokenIn);

  const resetForm = useCallback(() => {
    setAmountIn("");
    setInputError(false);
  }, []);

  const handleSetTokenIn = useCallback(
    (newToken: Token) => {
      if (tokenIn && newToken.address === tokenIn.address) return;
      setAmountIn("");
      setTokenIn(newToken);
    },
    [tokenIn],
  );

  const handleSetTokenOut = useCallback((newToken: Token) => {
    setTokenOut(newToken);
  }, []);

  // Validation logic
  const tokenInBalance = tokenIn ? balances.get(tokenIn) : undefined;
  const balanceFromMode = tokenInBalance ? getBalanceFromMode(tokenInBalance, balanceFrom) : TokenValue.ZERO;
  const exceedsBalance = balanceFromMode.lt(amountInTV);
  const hasValidAmount = !!stringToNumber(amountIn);

  return {
    // State
    state: {
      amountIn,
      tokenIn,
      tokenOut,
      balanceFrom,
      slippage,
      inputError,
    } as SiloActionFormState,

    // Actions
    actions: {
      setAmountIn,
      setTokenIn: handleSetTokenIn,
      setTokenOut: handleSetTokenOut,
      setBalanceFrom,
      setSlippage,
      setInputError,
      resetForm,
    } as SiloActionFormActions,

    // Computed values
    computed: {
      amountInTV,
      exceedsBalance,
      hasValidAmount,
      tokenInBalance,
      balanceFromMode,
    },
  };
}
