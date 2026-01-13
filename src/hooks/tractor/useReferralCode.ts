import { isValidReferralCode } from "@/utils/referral";
import { useCallback, useMemo, useSyncExternalStore } from "react";

const REFERRAL_CODE_STORAGE_KEY = "pinto-referral";
const DEBOUNCE_DELAY = 100;

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

// Storage state for valid codes (from localStorage)
let storageReferralCode: string = "";
const storageListeners = new Set<() => void>();

const notifyStorageListeners = () => {
  storageListeners.forEach((listener) => listener());
};

const subscribeStorage = (listener: () => void) => {
  storageListeners.add(listener);
  return () => storageListeners.delete(listener);
};

const getStorageSnapshot = () => storageReferralCode;

// Initialize storage state from localStorage
if (typeof window !== "undefined") {
  try {
    storageReferralCode = localStorage.getItem(REFERRAL_CODE_STORAGE_KEY) ?? "";
  } catch {
    storageReferralCode = "";
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
      // Update storage state and notify listeners
      storageReferralCode = value;
      notifyStorageListeners();
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

  // Get valid referral code from localStorage (for conditional rendering)
  const validReferralCodeFromStorage = useSyncExternalStore(subscribeStorage, getStorageSnapshot, getStorageSnapshot);

  const setReferralCode = useCallback((value: string) => {
    const trimmed = value.trim();

    // Always update global state for immediate UI feedback (so user can type)
    globalReferralCode = trimmed;
    notifyListeners();

    // Only save to localStorage if the code is valid or empty
    if (!trimmed || isValidReferralCode(trimmed)) {
      saveToLocalStorage(trimmed);
    }
    // Invalid codes are not saved to localStorage, but are kept in global state for typing
  }, []);

  // Validate referral code for real-time validation
  const isReferralCodeValid = useMemo(() => {
    if (!referralCode) return false;
    return isValidReferralCode(referralCode);
  }, [referralCode]);

  return {
    referralCode, // For input field (can be invalid during typing)
    validReferralCodeFromStorage, // For conditional rendering (only valid codes from localStorage)
    isReferralCodeValid, // For real-time validation (true if referralCode is valid)
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
