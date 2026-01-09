import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const REFERRAL_CODE_STORAGE_KEY = "tractor-referral-code";
const DEBOUNCE_DELAY = 500;

// Global state for cross-component sync
let globalReferralCode: string = "";
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => globalReferralCode;

// Initialize from localStorage
if (typeof window !== "undefined") {
  try {
    globalReferralCode = localStorage.getItem(REFERRAL_CODE_STORAGE_KEY) ?? "";
  } catch {
    globalReferralCode = "";
  }
}

// Debounced localStorage save
let saveTimeoutId: ReturnType<typeof setTimeout> | null = null;

const saveToLocalStorage = (value: string) => {
  if (saveTimeoutId) {
    clearTimeout(saveTimeoutId);
  }

  saveTimeoutId = setTimeout(() => {
    try {
      if (value) {
        localStorage.setItem(REFERRAL_CODE_STORAGE_KEY, value);
      } else {
        localStorage.removeItem(REFERRAL_CODE_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save referral code to localStorage:", e);
    }
  }, DEBOUNCE_DELAY);
};

/**
 * Hook for managing referral code with localStorage persistence and debounced saving.
 * Uses global state for cross-component synchronization.
 */
export function useReferralCode() {
  const referralCode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setReferralCode = useCallback((value: string) => {
    const trimmed = value.trim();
    globalReferralCode = trimmed;
    notifyListeners();
    saveToLocalStorage(trimmed);
  }, []);

  return {
    referralCode,
    setReferralCode,
  };
}

/**
 * Get the current referral code from localStorage (for use outside React components)
 */
export function getReferralCode(): string {
  try {
    return localStorage.getItem(REFERRAL_CODE_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}
