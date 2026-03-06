# Changelog

All notable changes to **pinto.money** are documented in this file.

- Website: https://pinto.money/
- Repository: https://github.com/pinto-org/interface/
- Documentation: https://docs.pinto.money/

The project follows a **Pinto Improvement (PI-XX)** based release process.
Each PI represents a reviewed, approved, and deployed improvement set
covering protocol, interface, and supporting infrastructure.

---

## [PI-15] - 2026-03-07

### Added

- **Beanstalk obligations dashboard**
  - New /beanstalk page for legacy Beanstalk holders to view and manage obligations
    - Global statistics card showing protocol-wide Beanstalk repayment data
    - Silo, Pods, and Fertilizer breakdown sections with detailed stats
    - Obligations card with direct pod harvesting and claim/repayment actions
    - useFarmerBeanstalkRepayment hook for fetching and calculating farmer-level repayment data
    - useBeanstalkGlobalStats hook for protocol-wide Beanstalk statistics
    - BeanstalkStatField reusable stat display component
    - FertilizerCard component for fertilizer asset display
    - Navigation links to Beanstalk page in desktop and mobile nav
  - Beanstalk asset transfer flows
    - Dedicated Silo deposit transfer flow (TransferBeanstalkSilo) with step-by-step wizard
    - Dedicated Pod transfer flow (TransferBeanstalkPods) with range selection and summary view
    - Dedicated Fertilizer transfer flow (TransferBeanstalkFertilizer) with multi-select support
    - useAllFertilizerIds hook for fetching all fertilizer token IDs
    - podTransferUtils helper functions for pod transfer calculations
  - Batch marketplace operations
    - Batch create pod listings (batchCreatePodListing encoder)
    - Batch create pod orders (batchCreatePodOrder encoder)
    - Batch fill pod listings (batchFillPodListing encoder)
    - Batch fill pod orders (batchFillPodOrder encoder)
    - Batch cancel pod listings (batchCancelPodListing encoder)
    - Batch cancel pod orders (batchCancelPodOrder encoder)
    - Batch deposit conversion (batchConvert encoder)
    - Unit tests for batchCreatePodListing and batchFillPodListing
  - My Listings and My Orders tables
    - MyListingsTable component for viewing and managing user's own pod listings
    - MyOrdersTable component for viewing and managing user's own pod orders
    - useMyPodListings and useMyPodOrders state hooks
    - MyPodListings and MyPodOrders GraphQL queries
  - Cache subgraph integration
    - Pintostalk cache subgraph with automatic fallback to primary subgraph
    - useCacheQuery hook for cache-first data fetching with fallback mechanism
    - Cache-backed seasonal data hooks: useSeasonalBeanstalkFieldCache, useSeasonalBeanstalkSiloCache, useSeasonalFarmerCache, useSeasonalFarmerSiloAssetTokenCache
    - New cache GraphQL queries for AdvancedChart, SeasonsTable, and seasonal field/silo/farmer data
    - Generated types for pintostalk-cache subgraph

- **Contract integration**
  - Extended Diamond ABI with new Beanstalk-related contract calls
  - Generated contract hooks for new ABI functions
  - Internal token definitions for urBDV and Sprouts
  - Beanstalk contract address constant
  - Fertilizer SVG asset

- **SEO improvements**
  - Meta tags for Beanstalk page in src/constants/meta.ts

### Changed

- **Marketplace filtering and display**
  - Beanstalk marketplace toggle for field-specific listing/order filtering
  - Updated MarketModeSelect to support Beanstalk context
  - Enhanced plot metadata display in pod listings and orders
  - Improved CreateListing, FillListing, CreateOrder, and FillOrder actions to support Beanstalk field

- **Pod transfer flow**
  - Consolidated pod range selection into a single-step picker
  - Improved StepOne with better range selection UX and validation
  - Simplified StepTwo by removing redundant logic
  - Enhanced FinalStep with batch transfer support
  - Optimized log scanning for transfer receipts

- **Seasonal data handling**
  - Optimized query stability across seasonal data hooks
  - Unified timestamp parsing logic
  - Extended seasonal data hooks with cache support

- **Explorer pages**
  - Updated FarmerExplorer, FieldExplorer, and SiloExplorer to use new seasonal cache hooks
  - Updated Temperature component with improved field data display

- **Deposit utilities**
  - Enhanced depositUtils with additional claim and repayment helper functions

### Fixed

- **Marketplace submit handling**
  - Fixed setSubmitting calls in MyListingsTable and MyOrdersTable to properly reset form state on success/failure

- **Transfer UI**
  - Fixed "My Pods In Line" label color to black in pod transfer steps
  - Removed unnecessary action buttons from Beanstalk pods send page

- **Beanstalk dashboard**
  - Fixed text color hierarchy for consistent visual weight
  - Fixed transaction hook callback and rinse logic for claim operations

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
