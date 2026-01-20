import { decodeReferralAddress, isValidReferralCode } from "@/utils/referral";
import { stringEq } from "@/utils/string";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";

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
  const { address } = useAccount();
  const referralCode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Get valid referral code from localStorage (for conditional rendering)
  const validReferralCodeFromStorage = useSyncExternalStore(subscribeStorage, getStorageSnapshot, getStorageSnapshot);

  const setReferralCode = useCallback(
    (value: string) => {
      const trimmed = value.trim();

      // Always update global state for immediate UI feedback (so user can type)
      globalReferralCode = trimmed;
      notifyListeners();

      // Save to localStorage only if valid, otherwise clear it
      if (!trimmed) {
        // Empty value: clear localStorage
        saveToLocalStorage("");
      } else {
        // Check if referral code is valid and doesn't belong to connected wallet
        const decodedAddress = decodeReferralAddress(trimmed);
        const isValid = isValidReferralCode(trimmed);
        const isOwnCode = address && decodedAddress && stringEq(decodedAddress, address);

        if (isValid && !isOwnCode) {
          // Valid code and not own code: save to localStorage
          saveToLocalStorage(trimmed);
        } else {
          // Invalid code or own code: clear localStorage
          saveToLocalStorage("");
        }
      }
      // Invalid codes are kept in global state for typing feedback, but localStorage is cleared
    },
    [address],
  );

  // Validate referral code for real-time validation
  const isReferralCodeValid = useMemo(() => {
    if (!referralCode) return false;

    // Check if referral code is valid
    if (!isValidReferralCode(referralCode)) return false;

    // Check if referral code belongs to connected wallet
    // If wallet is not connected (address is undefined), we can't check, so allow it
    if (!address) return true;

    const decodedAddress = decodeReferralAddress(referralCode);
    if (decodedAddress && stringEq(decodedAddress, address)) {
      return false; // Invalid if it's the user's own code
    }

    return true;
  }, [referralCode, address]);

  // Clean up localStorage if wallet connects and stored code is user's own code
  useEffect(() => {
    if (!address || !validReferralCodeFromStorage) return;

    const decodedAddress = decodeReferralAddress(validReferralCodeFromStorage);
    if (decodedAddress && stringEq(decodedAddress, address)) {
      // Clear localStorage if stored code belongs to connected wallet
      saveToLocalStorage("");
    }
  }, [address, validReferralCodeFromStorage]);

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
