/**
 * Privy configuration for email/social login and embedded wallets
 * This config is separate from wagmi connectors - Privy handles email/social auth,
 * while wagmi handles external EOA wallets (MetaMask, Rabby, WalletConnect, etc.)
 */

export const privyConfig = {
  // Login methods: email and social providers
  loginMethods: ["email"] as Array<"email" | "google" | "twitter" | "github">,

  // Appearance configuration
  appearance: {
    theme: "light" as const,
    accentColor: "#246645" as `#${string}`, // pinto-green-4
    logo: "https://pinto.money/pinto-logo.png", // Update with actual logo URL if needed
  },

  // Embedded wallets configuration (for email/social users)
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets" as const,
    },
    // Optional: configure embedded wallet behavior
    // noPromptOnSignature: false,
  },

  // Legal and privacy
  legal: {
    termsAndConditionsUrl: "https://docs.pinto.money/appendix/disclosures", // Update if needed
  },
};
