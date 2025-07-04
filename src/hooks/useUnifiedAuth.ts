import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useMemo, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

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

  // Privy wallets
  const { wallets } = useWallets();

  // Wagmi state
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Get embedded wallet from Privy
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  // Connect Privy embedded wallet to Wagmi when authenticated
  useEffect(() => {
    if (privyAuthenticated && embeddedWallet && !wagmiConnected) {
      // Connect the embedded wallet to Wagmi using injected connector
      connect({ connector: injected() });
    }
  }, [privyAuthenticated, embeddedWallet, wagmiConnected, connect]);

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
      // Use the embedded wallet from useWallets hook
      const walletAddress = embeddedWallet?.address || privyUser.wallet?.address;

      return {
        isAuthenticated: true,
        isLoading: false,
        authMethod: "email" as const,
        user: {
          email,
          wallet: walletAddress
            ? {
                address: walletAddress as `0x${string}`,
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
  }, [privyReady, privyAuthenticated, privyUser, wagmiConnected, wagmiAddress, embeddedWallet]);

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
      // Disconnect Wagmi first if connected
      if (wagmiConnected) {
        disconnect();
      }
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
