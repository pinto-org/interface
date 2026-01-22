/**
 * Privy configuration for email/social login and embedded wallets
 * This config is separate from wagmi connectors - Privy handles email/social auth,
 * while wagmi handles external EOA wallets (MetaMask, Rabby, WalletConnect, etc.)
 */

import { base } from "viem/chains";

export const privyConfig = {
  // Login methods: email and social providers
  loginMethods: ["email"] as Array<"email" | "google" | "twitter" | "github">,

  // Appearance configuration
  appearance: {
    theme: "light" as const,
    accentColor: "#246645" as `#${string}`, // pinto-green-4
    logo: "https://pinto.money/pinto-logo.png",
  },

  // Default chain - skip chain selection modal
  defaultChain: base,
  supportedChains: [base],

  // Embedded wallets configuration (for email/social users)
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets" as const,
    },
  },

  // Legal and privacy
  legal: {
    termsAndConditionsUrl: "https://docs.pinto.money/appendix/disclosures",
  },
};
