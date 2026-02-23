import { createContext, useCallback, useContext, useMemo, useState } from "react";

// ────────────────────────────────────────────────────────────────────────────────
// Context shape
// ────────────────────────────────────────────────────────────────────────────────

interface AutomateClaimContextValue {
  /** Whether the SpecifyConditionsDialog is open. */
  isOpen: boolean;
  /** Toggle or set the dialog open state. */
  setIsOpen: (open: boolean) => void;
}

const AutomateClaimContext = createContext<AutomateClaimContextValue | null>(null);

// ────────────────────────────────────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────────────────────────────────────

export function AutomateClaimProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpenRaw] = useState(false);

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenRaw(open);
  }, []);

  const value = useMemo<AutomateClaimContextValue>(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

  return <AutomateClaimContext.Provider value={value}>{children}</AutomateClaimContext.Provider>;
}

// ────────────────────────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────────────────────────

export function useAutomateClaimContext(): AutomateClaimContextValue {
  const ctx = useContext(AutomateClaimContext);
  if (!ctx) {
    throw new Error("useAutomateClaimContext must be used within an AutomateClaimProvider");
  }
  return ctx;
}
