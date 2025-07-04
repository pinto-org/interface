import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export interface UnifiedAuthState {
  // Authentication status
  isAuthenticated: boolean;
  isLoading: boolean;

  // User information
  user: {
    email?: string;
    wallet?: {
      address: `0x${string}`;
    };
    authMethod: "email" | "wallet" | "none";
  };

  // Actions
  login: () => void;
  logout: () => void;

  // Display helpers
  displayName: string;
  displayAddress?: `0x${string}`;
}

export const useUnifiedAuth = (): UnifiedAuthState => {
  // Privy state
  const {
    ready: privyReady,
    authenticated: privyAuthenticated,
    user: privyUser,
    login: privyLogin,
    logout: privyLogout,
  } = usePrivy();

  // Wagmi state
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();

  // Determine authentication method and state
  const authState = useMemo(() => {
    // If Privy is not ready, we're loading
    if (!privyReady) {
      return {
        isAuthenticated: false,
        isLoading: true,
        authMethod: "none" as const,
        user: { authMethod: "none" as const },
      };
    }

    // If user is authenticated with Privy (email + embedded wallet)
    if (privyAuthenticated && privyUser) {
      const email = privyUser.email?.address;
      const embeddedWallet = privyUser.wallet;

      return {
        isAuthenticated: true,
        isLoading: false,
        authMethod: "email" as const,
        user: {
          email,
          wallet: embeddedWallet
            ? {
                address: embeddedWallet.address as `0x${string}`,
              }
            : undefined,
          authMethod: "email" as const,
        },
      };
    }

    // If user is connected with traditional wallet (Wagmi)
    if (wagmiConnected && wagmiAddress) {
      return {
        isAuthenticated: true,
        isLoading: false,
        authMethod: "wallet" as const,
        user: {
          wallet: {
            address: wagmiAddress,
          },
          authMethod: "wallet" as const,
        },
      };
    }

    // Not authenticated
    return {
      isAuthenticated: false,
      isLoading: false,
      authMethod: "none" as const,
      user: { authMethod: "none" as const },
    };
  }, [privyReady, privyAuthenticated, privyUser, wagmiConnected, wagmiAddress]);

  // Display helpers
  const displayName = useMemo(() => {
    if (authState.user.email) {
      return authState.user.email;
    }

    if (authState.user.wallet?.address) {
      const address = authState.user.wallet.address;
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    return "Connect";
  }, [authState.user]);

  const displayAddress = authState.user.wallet?.address;

  // Actions
  const login = () => {
    if (authState.authMethod === "none") {
      privyLogin();
    }
  };

  const logout = () => {
    if (authState.authMethod === "email") {
      privyLogout();
    }
    // For wallet connections, we'll handle this in the component
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    displayName,
    displayAddress,
    login,
    logout,
  };
};
