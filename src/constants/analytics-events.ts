/**
 * Google Analytics Event Names
 *
 * Following naming pattern: [section]_[component]_[action]
 * All lowercase with underscores
 * Self-descriptive names that need no additional documentation
 */

// Navigation Events
const NAVIGATION_EVENTS = {
  // Header Navigation
  HEADER_HOME_CLICK: "navigation_header_home_click",
  HEADER_LEARN_CLICK: "navigation_header_learn_click",
  HEADER_DATA_CLICK: "navigation_header_data_click",

  // Main Navigation Links
  MAIN_OVERVIEW_CLICK: "navigation_main_overview_click",
  MAIN_SILO_CLICK: "navigation_main_silo_click",
  MAIN_FIELD_CLICK: "navigation_main_field_click",
  MAIN_SWAP_CLICK: "navigation_main_swap_click",
  MAIN_PODMARKET_CLICK: "navigation_main_podmarket_click",
  MAIN_SPINTO_CLICK: "navigation_main_spinto_click",
  MAIN_COLLECTION_CLICK: "navigation_main_collection_click",

  // Explorer Sub-navigation
  EXPLORER_PINTO_CLICK: "navigation_explorer_pinto_click",
  EXPLORER_SILO_CLICK: "navigation_explorer_silo_click",
  EXPLORER_FIELD_CLICK: "navigation_explorer_field_click",
  EXPLORER_FARMER_CLICK: "navigation_explorer_farmer_click",
  EXPLORER_SEASONS_CLICK: "navigation_explorer_seasons_click",
  EXPLORER_TRACTOR_CLICK: "navigation_explorer_tractor_click",
  EXPLORER_ALL_CLICK: "navigation_explorer_all_click",

  // Learn Sub-navigation
  LEARN_DOCS_CLICK: "navigation_learn_docs_click",
  LEARN_BLOG_CLICK: "navigation_learn_blog_click",
  LEARN_COMMUNITY_BLOG_CLICK: "navigation_learn_community_blog_click",
  LEARN_WHITEPAPER_CLICK: "navigation_learn_whitepaper_click",

  // Header Buttons
  PRICE_BUTTON_TOGGLE: "navigation_price_button_toggle",
  TOKEN_PRICES_TOGGLE: "navigation_token_prices_toggle",
  SEASONS_BUTTON_TOGGLE: "navigation_seasons_button_toggle",

  // Mobile Navigation
  MOBILE_MENU_TOGGLE: "navigation_mobile_menu_toggle",
} as const;

const PRICE_PANEL_EVENTS = {
  PRICE_BUTTON_TOGGLE: "price_panel_price_button_toggle",
  TOKEN_PRICES_TOGGLE: "price_panel_token_prices_toggle",
  EXCHANGE_NAVIGATE: "price_panel_exchange_navigate",
} as const;

// Wallet Events
const WALLET_EVENTS = {
  // Connection
  CONNECT_BUTTON_CLICK: "wallet_connect_button_click",
  CONNECT_MODAL_OPEN: "wallet_connect_modal_open",
  CONNECT_SUCCESS: "wallet_connect_success",
  DISCONNECT_CLICK: "wallet_disconnect_click",

  // Wallet Panel
  PANEL_OPEN: "wallet_panel_open",
  PANEL_CLOSE: "wallet_panel_close",
  BALANCE_TAB_SWITCH: "wallet_balance_tab_switch",

  // Navigation Actions
  PANEL_SWAP_NAVIGATE: "wallet_panel_swap_navigate",
  PANEL_SEND_NAVIGATE: "wallet_panel_send_navigate",
  PANEL_NFT_COLLECTION_NAVIGATE: "wallet_panel_nft_collection_navigate",

  // Wallet Management
  DISCONNECT_BUTTON_CLICK: "wallet_disconnect_button_click",
  FARM_BALANCE_MANAGE_CLICK: "wallet_farm_balance_manage_click",

  // Actions
  CLAIM_FLOOD_SUBMIT: "wallet_claim_flood_submit",
  CLAIM_FLOOD_TOGGLE: "wallet_claim_flood_toggle",
  CLAIM_DESTINATION_SELECT: "wallet_claim_destination_select",
  TRANSFER_BUTTON_CLICK: "wallet_transfer_button_click",
  TRANSFER_MODE_ENTER: "wallet_transfer_mode_enter",
  TRANSFER_MODE_EXIT: "wallet_transfer_mode_exit",
  TRANSFER_SUBMIT: "wallet_transfer_submit",
} as const;

// Silo Events
const SILO_EVENTS = {
  // Tabs
  DEPOSIT_TAB_CLICK: "silo_deposit_tab_click",
  WITHDRAW_TAB_CLICK: "silo_withdraw_tab_click",
  CONVERT_TAB_CLICK: "silo_convert_tab_click",
  WRAP_TAB_CLICK: "silo_wrap_tab_click",
  UNWRAP_TAB_CLICK: "silo_unwrap_tab_click",

  // Main Page Navigation
  EXPLORER_LINK_CLICK: "silo_explorer_link_click",
  TOKEN_ROW_CLICK: "silo_token_row_click",

  // Token Selection
  DEPOSIT_TOKEN_SELECT_OPEN: "silo_deposit_token_select_open",
  DEPOSIT_TOKEN_SELECTED: "silo_deposit_token_selected",
  WITHDRAW_TOKEN_SELECT_OPEN: "silo_withdraw_token_select_open",
  WITHDRAW_TOKEN_SELECTED: "silo_withdraw_token_selected",
  CONVERT_TOKEN_SELECT_OPEN: "silo_convert_token_select_open",
  CONVERT_TOKEN_SELECTED: "silo_convert_token_selected",

  // Actions
  DEPOSIT_SUBMIT: "silo_deposit_submit",
  WITHDRAW_SUBMIT: "silo_withdraw_submit",
  CONVERT_SUBMIT: "silo_convert_submit",

  // Amount Inputs
  DEPOSIT_AMOUNT_INPUT: "silo_deposit_amount_input",
  DEPOSIT_AMOUNT_MAX_CLICK: "silo_deposit_amount_max_click",
  WITHDRAW_AMOUNT_INPUT: "silo_withdraw_amount_input",
  CONVERT_AMOUNT_INPUT: "silo_convert_amount_input",

  // Settings & Configuration
  DEPOSIT_SLIPPAGE_CHANGE: "silo_deposit_slippage_change",
  WITHDRAW_SLIPPAGE_CHANGE: "silo_withdraw_slippage_change",
  CONVERT_SLIPPAGE_CHANGE: "silo_convert_slippage_change",
  WITHDRAW_DESTINATION_SELECT: "silo_withdraw_destination_select",

  // Convert Specific
  CONVERT_ROUTE_SELECT: "silo_convert_route_select",
  CONVERT_PENALTY_ACCEPT: "silo_convert_penalty_accept",

  // Claims & Rewards
  CLAIM_REWARDS_SUBMIT: "silo_claim_rewards_submit",

  // Wrap/Unwrap Actions
  WRAP_SUBMIT: "silo_wrap_submit",
  WRAP_TOKEN_SELECTED: "silo_wrap_token_selected",
  WRAP_SOURCE_TOGGLE: "silo_wrap_source_toggle",
  WRAP_DESTINATION_SELECT: "silo_wrap_destination_select",
  UNWRAP_SUBMIT: "silo_unwrap_submit",
  UNWRAP_TOKEN_SELECTED: "silo_unwrap_token_selected",
  UNWRAP_MODE_TOGGLE: "silo_unwrap_mode_toggle",
  UNWRAP_DESTINATION_SELECT: "silo_unwrap_destination_select",

  // Protocol Integration Events (Wrapped Silo Token Page)
  WRAPPED_TOKEN_PROTOCOL_INTEGRATION_CLICK: "silo_wrapped_token_protocol_integration_click",
  WRAPPED_TOKEN_CREAM_FINANCE_CLICK: "silo_wrapped_token_cream_finance_click",
  WRAPPED_TOKEN_SPECTRA_POOL_CLICK: "silo_wrapped_token_spectra_pool_click",
  WRAPPED_TOKEN_SPECTRA_FIXED_RATE_CLICK: "silo_wrapped_token_spectra_fixed_rate_click",
  WRAPPED_TOKEN_SPECTRA_YIELD_TRADING_CLICK: "silo_wrapped_token_spectra_yield_trading_click",
} as const;

// Field Events
const FIELD_EVENTS = {
  // Field Page Navigation
  TAB_CLICK: "field_tab_click",
  EXPLORER_LINK_CLICK: "field_explorer_link_click",
  SEND_PODS_CLICK: "field_send_pods_click",
  MARKET_PODS_CLICK: "field_market_pods_click",
  MOBILE_HARVEST_CLICK: "field_mobile_harvest_click",
  MOBILE_SOW_CLICK: "field_mobile_sow_click",

  // FieldActions
  ACTION_TAB_CLICK: "field_action_tab_click",

  // Sow Actions
  SOW_TOKEN_SELECTED: "field_sow_token_selected",
  SOW_DEPOSITS_TOGGLE: "field_sow_deposits_toggle",
  SOW_SETTINGS_OPEN: "field_sow_settings_open",
  SOW_SUBMIT: "field_sow_submit",

  // Harvest Actions
  HARVEST_SUBMIT: "field_harvest_submit",

  // Tractor Actions
  TRACTOR_BUTTON_CLICK: "field_tractor_button_click",
  TRACTOR_PANEL_CREATE_ORDER: "field_tractor_panel_create_order",

  // Legacy Events (keeping for backwards compatibility)
  SOW_AMOUNT_INPUT: "field_sow_amount_input",
  TRACTOR_ORDER_CREATE: "field_tractor_order_create",
  TRACTOR_ORDER_CANCEL: "field_tractor_order_cancel",
} as const;

// Swap Events
const SWAP_EVENTS = {
  // Token Selection
  TOKEN_FROM_SELECT_OPEN: "swap_token_from_select_open",
  TOKEN_FROM_SELECTED: "swap_token_from_selected",
  TOKEN_TO_SELECT_OPEN: "swap_token_to_select_open",
  TOKEN_TO_SELECTED: "swap_token_to_selected",
  TOKEN_PAIR_FLIP: "swap_token_pair_flip",

  // Settings
  SLIPPAGE_SETTING_CHANGE: "swap_slippage_setting_change",
  ROUTING_INFO_OPEN: "swap_routing_info_open",

  // Actions
  SWAP_SUBMIT: "swap_submit",
  AMOUNT_INPUT: "swap_amount_input",
} as const;

// Market Events (Pod Market)
const MARKET_EVENTS = {
  // Navigation & UI Events
  ACTIVITY_TAB_CLICK: "market_activity_tab_click",
  BUY_SELL_TAB_CLICK: "market_buy_sell_tab_click",
  CREATE_FILL_TAB_CLICK: "market_create_fill_tab_click",
  CHART_POINT_CLICK: "market_chart_point_click",

  // Pod Order Events
  POD_ORDER_CREATE: "market_pod_order_create",
  ORDER_TOKEN_SELECTED: "market_order_token_selected",
  ORDER_PRICE_INPUT: "market_order_price_input",
  ORDER_PLACE_INPUT: "market_order_place_input",
  POD_ORDER_FILL: "market_pod_order_fill",
  POD_ORDER_CANCEL: "market_pod_order_cancel",

  // Pod Listing Events
  POD_LIST_CREATE: "market_pod_list_create",
  LISTING_PLOT_SELECTED: "market_listing_plot_selected",
  LISTING_PRICE_INPUT: "market_listing_price_input",
  LISTING_AMOUNT_INPUT: "market_listing_amount_input",
  POD_LIST_FILL: "market_pod_list_fill",
  POD_LIST_CANCEL: "market_pod_list_cancel",
} as const;

// Collection Events (NFT Gallery)
const COLLECTION_EVENTS = {
  // View Mode & Display
  VIEW_MODE_TOGGLE: "collection_view_mode_toggle",
  GRID_MODE_TOGGLE: "collection_grid_mode_toggle",

  // NFT Interactions
  NFT_CARD_CLICK: "collection_nft_card_click",
  NFT_DETAIL_MODAL_OPEN: "collection_nft_detail_modal_open",
  NFT_MODAL_NAVIGATE: "collection_nft_modal_navigate",
  NFT_MODAL_CLOSE: "collection_nft_modal_close",

  // External Links
  OPENSEA_CLICK: "collection_opensea_click",

  // Pagination
  PAGE_NEXT_CLICK: "collection_page_next_click",
  PAGE_PREVIOUS_CLICK: "collection_page_previous_click",
  PAGE_NUMBER_CLICK: "collection_page_number_click",
} as const;

// Explorer Events (Analytics Dashboard)
const EXPLORER_EVENTS = {
  // Main Tab Navigation
  MAIN_TAB_CLICK: "explorer_main_tab_click",

  // Global Time Filter (affects all charts)
  GLOBAL_TIME_FILTER_CLICK: "explorer_global_time_filter_click",

  // Individual Chart Time Filters
  CHART_TIME_FILTER_CLICK: "explorer_chart_time_filter_click",

  // Chart Interactions (future enhancement)
  CHART_TOOLTIP_OPEN: "explorer_chart_tooltip_open",
  CHART_DATA_POINT_CLICK: "explorer_chart_data_point_click",
} as const;

// Farmer Overview Events (Dashboard)
const OVERVIEW_EVENTS = {
  // Tab Navigation
  TAB_DEPOSITS_CLICK: "overview_tab_deposits_click",
  TAB_PODS_CLICK: "overview_tab_pods_click",
  TAB_TRACTOR_CLICK: "overview_tab_tractor_click",

  // Helper Link Navigation
  HELPER_SOW_NAVIGATE: "overview_helper_sow_navigate",
  HELPER_HARVEST_NAVIGATE: "overview_helper_harvest_navigate",
  HELPER_HARVEST_CLICK: "overview_helper_harvest_click",
  HELPER_SILO_EXPLORER_NAVIGATE: "overview_helper_silo_explorer_navigate",

  // Stat Panel Interactions
  STAT_PANEL_HOVER_START: "overview_stat_panel_hover_start",
  STAT_PANEL_HOVER_END: "overview_stat_panel_hover_end",
  STAT_ACTION_BUTTON_HOVER: "overview_stat_action_button_hover",

  // Deposits Table Events
  DEPOSITS_TOKEN_ROW_CLICK: "overview_deposits_token_row_click",
  DEPOSITS_CLAIM_REWARDS_CLICK: "overview_deposits_claim_rewards_click",
  DEPOSITS_CLAIM_HOVER_START: "overview_deposits_claim_hover_start",
  DEPOSITS_CLAIM_HOVER_END: "overview_deposits_claim_hover_end",

  // New User View Events
  NEWUSER_CONNECT_WALLET_CLICK: "overview_newuser_connect_wallet_click",
  NEWUSER_UNDEPOSITED_BANNER_DEPOSIT_CLICK: "overview_newuser_undeposited_banner_deposit_click",
  NEWUSER_PEG_TOGGLE_CLICK: "overview_newuser_peg_toggle_click",
  NEWUSER_SILO_INFO_DEPOSIT_CLICK: "overview_newuser_silo_info_deposit_click",
  NEWUSER_FIELD_INFO_SOW_CLICK: "overview_newuser_field_info_sow_click",
  NEWUSER_FLOW_CARD_INTERACTION: "overview_newuser_flow_card_interaction",
  NEWUSER_YIELD_STATS_VIEW: "overview_newuser_yield_stats_view",
  NEWUSER_FIELD_CONDITIONS_VIEW: "overview_newuser_field_conditions_view",
} as const;

// Footer Events
const FOOTER_EVENTS = {
  // Internal Links
  ABOUT_CLICK: "footer_about_click",
  TERMS_PRIVACY_CLICK: "footer_terms_privacy_click",
  PINTO_EXCHANGE_CLICK: "footer_pinto_exchange_click",

  // Social Links
  DISCORD_CLICK: "footer_social_discord_click",
  TWITTER_CLICK: "footer_social_twitter_click",
  GITHUB_CLICK: "footer_social_github_click",
} as const;

// UI Component Events
const UI_EVENTS = {
  // Modals & Dialogs
  MODAL_OPEN: "ui_modal_open",
  MODAL_CLOSE: "ui_modal_close",
  DIALOG_CONFIRM: "ui_dialog_confirm",
  DIALOG_CANCEL: "ui_dialog_cancel",

  // Tables & Lists
  TABLE_SORT: "ui_table_sort",
  TABLE_FILTER: "ui_table_filter",
  PAGINATION_CLICK: "ui_pagination_click",

  // Charts
  CHART_TIMEFRAME_SELECT: "ui_chart_timeframe_select",
  CHART_TYPE_SELECT: "ui_chart_type_select",
} as const;

// Transaction Events
const TRANSACTION_EVENTS = {
  // Transaction Flow
  TRANSACTION_INITIATED: "transaction_initiated",
  TRANSACTION_CONFIRMED: "transaction_confirmed",
  TRANSACTION_FAILED: "transaction_failed",
  TRANSACTION_CANCELLED: "transaction_cancelled",

  // Gas & Fees
  GAS_ESTIMATION_REQUEST: "transaction_gas_estimation_request",
  TRANSACTION_SPEED_SELECT: "transaction_speed_select",
} as const;

const LANDING_EVENTS = {
  // Main Landing Actions
  MAIN_CTA_CLICK: "landing_main_cta_click", // "Come Seed the Leviathan Free Economy"
  SCROLL_ARROW_CLICK: "landing_scroll_arrow_click", // Bottom scroll arrow

  // Secondary CTA Section
  SECONDARY_CTA_ARTICLE_CLICK: "landing_secondary_cta_article_click", // "Why is Pinto the best alternative..."

  // Values Cards (Purple cards - Ethereum values)
  VALUES_CARD_CLICK: "landing_values_card_click", // Any purple values card
  VALUES_CENSORSHIP_RESISTANCE_CLICK: "landing_values_censorship_resistance_click",
  VALUES_TRUSTLESSNESS_CLICK: "landing_values_trustlessness_click",
  VALUES_PERMISSIONLESSNESS_CLICK: "landing_values_permissionlessness_click",
  VALUES_FAIRNESS_CLICK: "landing_values_fairness_click",
  VALUES_OPEN_SOURCE_CLICK: "landing_values_open_source_click",

  // Properties Cards (Green cards - USD properties)
  PROPERTIES_CARD_CLICK: "landing_properties_card_click", // Any green properties card
  PROPERTIES_SCALABLE_CLICK: "landing_properties_scalable_click",
  PROPERTIES_LOW_VOLATILITY_CLICK: "landing_properties_low_volatility_click",
  PROPERTIES_MEDIUM_OF_EXCHANGE_CLICK: "landing_properties_medium_of_exchange_click",
  PROPERTIES_UNIT_OF_ACCOUNT_CLICK: "landing_properties_unit_of_account_click",

  // Card Modal Interactions
  CARD_MODAL_OPEN: "landing_card_modal_open",
  CARD_MODAL_CLOSE: "landing_card_modal_close",
  CARD_MODAL_BACKGROUND_CLICK: "landing_card_modal_background_click",

  // Project Stats Section
  STATS_UPGRADES_BUTTON_CLICK: "landing_stats_upgrades_button_click",
  STATS_CONTRIBUTORS_BUTTON_CLICK: "landing_stats_contributors_button_click",
  STATS_YEARS_BUTTON_CLICK: "landing_stats_years_button_click",
  STATS_VOLUME_BUTTON_CLICK: "landing_stats_volume_button_click",

  // Project Stats Section - Protocol Upgrades
  STATS_PROTOCOL_UPGRADE_CLICK: "landing_stats_protocol_upgrade_click", // Specific upgrade link clicked

  // Project Stats Section - Contributors
  STATS_CONTRIBUTOR_PROFILE_LOAD: "landing_stats_contributor_profile_loaded", // Specific contributor clicked
  STATS_CONTRIBUTOR_ARTICLE_CLICK: "landing_stats_contributor_article_click", // Contributor article link clicked

  // Project Stats Section - Whitepapers
  STATS_YEARS_WHITEPAPER_CLICK: "landing_stats_years_whitepaper_click", // Whitepaper link clicked in years carousel

  // Bug Bounty Section
  BUG_BOUNTY_AUDITS_CLICK: "landing_bug_bounty_audits_click", // Learn More - Audits
  BUG_BOUNTY_IMMUNEFI_CLICK: "landing_bug_bounty_immunefi_click", // Learn More - Bug Bounty
  BUG_BOUNTY_HYPERNATIVE_CLICK: "landing_bug_bounty_hypernative_click", // Learn More - Off-chain Monitoring

  // Resources Section
  RESOURCES_DOCS_CLICK: "landing_resources_docs_click", // GitBook docs button
  RESOURCES_BLOG_CLICK: "landing_resources_blog_click", // Mirror blog button
  RESOURCES_TWITTER_CLICK: "landing_resources_twitter_click", // Twitter/X button
  RESOURCES_DISCORD_CLICK: "landing_resources_discord_click", // Discord button
  RESOURCES_FARM_CTA_CLICK: "landing_resources_cta_click", // "Take me to the Farm"

  // Navigation & Scroll Behavior
  CHART_SECTION_VIEW: "landing_chart_section_view",
  SECONDARY_CTA_SECTION_VIEW: "landing_secondary_cta_section_view",
  STATS_SECTION_VIEW: "landing_stats_section_view",
  BUG_BOUNTY_SECTION_VIEW: "landing_bug_bounty_section_view",
  RESOURCES_SECTION_VIEW: "landing_resources_section_view",

  // User Journey & Engagement
  PAGE_LOAD: "landing_page_load", // Landing page loads
  PAGE_SCROLL_START: "landing_page_scroll_start", // First scroll action
  PAGE_SCROLL_DEPTH_25: "landing_page_scroll_depth_25", // 25% scroll depth
  PAGE_SCROLL_DEPTH_50: "landing_page_scroll_depth_50", // 50% scroll depth
  PAGE_SCROLL_DEPTH_75: "landing_page_scroll_depth_75", // 75% scroll depth
  PAGE_SCROLL_DEPTH_100: "landing_page_scroll_depth_100", // 100% scroll depth
  SESSION_TIME_30S: "landing_session_time_30s", // 30 seconds on page
  SESSION_TIME_60S: "landing_session_time_60s", // 1 minute on page
  SESSION_TIME_120S: "landing_session_time_120s", // 2 minutes on page
} as const;

// All events combined for easy access
export const ANALYTICS_EVENTS = {
  NAVIGATION: NAVIGATION_EVENTS,
  WALLET: WALLET_EVENTS,
  SILO: SILO_EVENTS,
  FIELD: FIELD_EVENTS,
  SWAP: SWAP_EVENTS,
  MARKET: MARKET_EVENTS,
  COLLECTION: COLLECTION_EVENTS,
  EXPLORER: EXPLORER_EVENTS,
  OVERVIEW: OVERVIEW_EVENTS,
  FOOTER: FOOTER_EVENTS,
  UI: UI_EVENTS,
  TRANSACTION: TRANSACTION_EVENTS,
  PRICE_PANEL: PRICE_PANEL_EVENTS,
  LANDING: LANDING_EVENTS,
} as const;

// Type for all possible event names
export type AnalyticsEventName =
  | (typeof NAVIGATION_EVENTS)[keyof typeof NAVIGATION_EVENTS]
  | (typeof WALLET_EVENTS)[keyof typeof WALLET_EVENTS]
  | (typeof SILO_EVENTS)[keyof typeof SILO_EVENTS]
  | (typeof FIELD_EVENTS)[keyof typeof FIELD_EVENTS]
  | (typeof SWAP_EVENTS)[keyof typeof SWAP_EVENTS]
  | (typeof MARKET_EVENTS)[keyof typeof MARKET_EVENTS]
  | (typeof COLLECTION_EVENTS)[keyof typeof COLLECTION_EVENTS]
  | (typeof EXPLORER_EVENTS)[keyof typeof EXPLORER_EVENTS]
  | (typeof OVERVIEW_EVENTS)[keyof typeof OVERVIEW_EVENTS]
  | (typeof FOOTER_EVENTS)[keyof typeof FOOTER_EVENTS]
  | (typeof UI_EVENTS)[keyof typeof UI_EVENTS]
  | (typeof TRANSACTION_EVENTS)[keyof typeof TRANSACTION_EVENTS]
  | (typeof PRICE_PANEL_EVENTS)[keyof typeof PRICE_PANEL_EVENTS]
  | (typeof LANDING_EVENTS)[keyof typeof LANDING_EVENTS];
