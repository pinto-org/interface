# Changelog

All notable changes to **pinto.money** are documented in this file.

- Website: https://pinto.money/
- Repository: https://github.com/pinto-org/interface/
- Documentation: https://docs.pinto.money/

The project follows a **Pinto Improvement (PI-XX)** based release process.
Each PI represents a reviewed, approved, and deployed improvement set
covering protocol, interface, and supporting infrastructure.

---

## [PI-14] - 2026-01-18

### Added

- **New referral program system**
  - Referral page (`/referral`) with leaderboard and statistics
  - Referral code generation and validation system
  - Referral rewards tracking and delegation
  - `sowWithReferral` function for referral-enabled Sow transactions
  - SowBlueprintReferralV0 contract integration
  - 5% bonus pods for referrals, 10% for referrers
  - Referral link sharing via Twitter and Telegram
  - Minimum 1,000 PINTO sown requirement for farmers to be eligible as referrers
  - Privacy-friendly name generation for leaderboard addresses
  - Persistent referral code storage in localStorage
  - Referral code prompts in Field and Sow dialogs
  - Referral code popover in settings
  - "How It Works" instructional cards

- **wstETH token support**
  - wstETH token constant and PINTO/wstETH LP pair
  - Token logo assets for wstETH and PINTO_wstETH LP
  - Market price tracking for wstETH
  - Updated token lists and underlying tokens configuration

- **Advanced Sow Order features**
  - Multi-step review process (Main Form → Review → Advanced)
  - Advanced parameter editing view with validation
  - Temperature slider for easier order configuration
  - Amount slider with max deposit tracking
  - Operator tip preset system (Low, Normal, High, Custom)
  - Estimated total tip calculation using arithmetic series
  - Real-time pod calculation with referral bonuses
  - Default value auto-population for min/max per season
  - Pod destination address display with delegation option

- **Developer tools**
  - SiloToken Gauge Data viewer in DevPage
  - "Call Sunrise N Times" testing utility
  - Improved deposit optimization call generation

- **SEO improvements**
  - Meta tags for referral page in `src/constants/meta.ts`
  - Title:  "Referral | Pinto"
  - Description: "Share Pinto and earn rewards through referrals."
  - URL: "https://pinto.money/referral"

- **Contract integration**
  - New read functions:  `getBeansSownForReferral`, `isValidReferrer`, `getDelegate`
  - New write function: `delegateReferralRewards`
  - Updated diamondABI with referral events and functions
  - Generated contract hooks for referral operations
  - SowBlueprintReferralV0 ABI constant

- **GraphQL queries**
  - Referral leaderboard data query
  - Farmer referral data query

### Changed

- **Sow Order Dialog workflow**
  - Redesigned to three-step process:  Entry → Review → Advanced (optional)
  - Accordion-based advanced settings display
  - Separated operator tip configuration from main form
  - Improved parameter summary views
  - Enhanced mobile responsiveness

- **Price and market data handling**
  - Optimized price cache using multicall for better performance
  - Improved error handling for invalid wells
  - Enhanced swap summary calculations with zero-value guards
  - Better handling of missing token price data

- **Form handling**
  - Numeric input validation now supports configurable max values
  - Improved shared form field handlers with max value parameter
  - Enhanced numeric input sanitization

- **Tractor/Blueprint system**
  - Updated to handle both v0 and referralV0 blueprint formats
  - Improved blueprint decoding with referral data extraction
  - Better error messages for unknown blueprint selectors
  - Enhanced orderbook data loading with referral address tracking

- **Navigation**
  - Added "Referral" link to main navigation (desktop and mobile)
  - Updated analytics events for referral tracking

### Fixed

- **Market Performance Chart datapoint handling**
  - Fixed chart rendering when tokens have different data availability
  - Added null value support in line chart data arrays
  - Improved data alignment across multiple token series

- **Deposit management optimization**
  - Smarter sorting logic to avoid unnecessary transactions
  - Only add `sortDeposits` call when deposits are actually unsorted
  - Improved group combining to exclude single-deposit groups
  - Better validation for germinating vs non-germinating deposits

- **SiloConvert error handling**
  - Added retry mechanism for simulations without price data
  - Improved error handling with fallback strategies
  - Better well availability checking to prevent errors
  - Fixed type issues in strategy token approval handling

- **Field events filtering**
  - Skip Sow events where 0 beans were sown
  - Improved event filtering and validation

- **Swap calculations**
  - Added zero-value guards to prevent division errors
  - Fixed slippage calculations when values are zero
  - Improved fee calculation error handling
