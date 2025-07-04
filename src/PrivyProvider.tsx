import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { mainnet } from "viem/chains";
import { arbitrumNetwork, baseNetwork } from "./utils/wagmi/chains";

interface PrivyProviderProps {
  children: ReactNode;
}

export const PrivyProvider = ({ children }: PrivyProviderProps) => {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

  if (!privyAppId) {
    console.warn("VITE_PRIVY_APP_ID is not set. Privy features will be disabled.");
    return <>{children}</>;
  }

  return (
    <BasePrivyProvider
      appId={privyAppId}
      config={{
        // Configure login methods - email is primary for onboarding
        loginMethods: ["email", "wallet"],

        // Configure appearance to match Pinto theme
        appearance: {
          theme: "light",
          accentColor: "#246645", // Pinto green
          logo: "https://pinto.money/favicon.ico",
          landingHeader: "Welcome to Pinto",
          showWalletLoginFirst: false, // Email first for easier onboarding
          walletChainType: "ethereum-only",
        },

        // Configure embedded wallet creation
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
        },

        // Configure supported chains
        defaultChain: baseNetwork,
        supportedChains: [baseNetwork, arbitrumNetwork, mainnet],

        // Configure legal and compliance
        legal: {
          termsAndConditionsUrl: "https://pinto.money/terms",
          privacyPolicyUrl: "https://pinto.money/privacy",
        },

        // Additional customizations
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
};
