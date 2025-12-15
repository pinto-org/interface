# Requirements Document

## Introduction

This feature implements robust pagination for the referral leaderboard using the existing `paginateSubgraph` utility pattern. The current implementation uses simple skip/first pagination which can miss or duplicate entries when new data is added during pagination. The new implementation will use the proven pagination pattern already used throughout the application for seasonal data queries.

## Glossary

- **Referral_Leaderboard**: A ranked list of farmers ordered by total referral reward pods received
- **PaginateSubgraph_Utility**: The existing utility function that handles robust pagination for GraphQL subgraph queries
- **Block_Height**: A specific blockchain block number used to ensure consistent data snapshots during pagination
- **Farmer**: A user account that can earn referral rewards by referring other users
- **Pods**: The reward tokens earned through referrals
- **RefereeCount**: The number of successful referrals made by a farmer

## Requirements

### Requirement 1

**User Story:** As a user viewing the referral leaderboard, I want to see consistent data when navigating between pages, so that I don't see duplicate or missing entries due to new referrals being added during my browsing session.

#### Acceptance Criteria

1. WHEN a user navigates through leaderboard pages THEN the system SHALL maintain data consistency using block height snapshots
2. WHEN new referral data is added to the subgraph during pagination THEN the system SHALL prevent duplicate or missing entries in the paginated results
3. WHEN a user requests the first page THEN the system SHALL capture the current block height for the entire pagination session
4. WHEN a user requests subsequent pages THEN the system SHALL use the same block height from the first page request
5. WHEN the pagination reaches the end of available data THEN the system SHALL stop requesting additional pages

### Requirement 2

**User Story:** As a developer, I want to use the existing `paginateSubgraph` utility for referral leaderboard pagination, so that the implementation follows established patterns and benefits from proven reliability.

#### Acceptance Criteria

1. WHEN implementing referral leaderboard pagination THEN the system SHALL use the existing `paginateSubgraph` utility function
2. WHEN configuring pagination settings THEN the system SHALL specify the primary property name as "farmers"
3. WHEN configuring pagination settings THEN the system SHALL specify the id field as "id" for farmer identification
4. WHEN determining the next page variables THEN the system SHALL implement the nextVars callback to handle farmer-based pagination
5. WHEN the subgraph returns fewer than 1000 results THEN the system SHALL terminate pagination

### Requirement 3

**User Story:** As a user, I want the leaderboard to load efficiently with proper error handling, so that I can reliably view referral rankings even when there are network issues.

#### Acceptance Criteria

1. WHEN the pagination utility encounters network errors THEN the system SHALL handle errors gracefully and provide meaningful feedback
2. WHEN the block height cannot be determined THEN the system SHALL fall back to pagination without block height constraints
3. WHEN the GraphQL query fails THEN the system SHALL retry according to the existing query configuration
4. WHEN pagination is in progress THEN the system SHALL show appropriate loading states
5. WHEN pagination completes successfully THEN the system SHALL return the complete aggregated results

### Requirement 4

**User Story:** As a user, I want the leaderboard query to support optional block height specification, so that the system can provide consistent snapshots when needed while remaining flexible for real-time data when block height is not specified.

#### Acceptance Criteria

1. WHEN a block height is provided in the query variables THEN the system SHALL use that specific block for data consistency
2. WHEN no block height is provided in the query variables THEN the system SHALL query the latest available data
3. WHEN the GraphQL query includes block height parameter THEN the system SHALL accept null values for real-time queries
4. WHEN constructing query variables THEN the system SHALL conditionally include block height only when available
5. WHEN the block height is invalid or too old THEN the system SHALL handle the error appropriately

### Requirement 5

**User Story:** As a user viewing the referral leaderboard UI, I want intuitive pagination controls that follow the application's design patterns, so that I can easily navigate through all referral data with a familiar interface.

#### Acceptance Criteria

1. WHEN the leaderboard component loads THEN the system SHALL display pagination controls consistent with other paginated tables in the application
2. WHEN there are multiple pages of data THEN the system SHALL show Previous/Next buttons with appropriate enabled/disabled states
3. WHEN the user clicks the Next button THEN the system SHALL load the next page of results using the robust pagination system
4. WHEN the user clicks the Previous button THEN the system SHALL load the previous page of results
5. WHEN displaying pagination controls THEN the system SHALL show the current page number and total navigation context

### Requirement 6

**User Story:** As a user, I want the leaderboard to handle loading states and empty data gracefully, so that I have clear feedback about the data loading process and understand when no referral activity exists.

#### Acceptance Criteria

1. WHEN the leaderboard is loading the first page THEN the system SHALL display a loading spinner in the center of the table area
2. WHEN the leaderboard is loading subsequent pages THEN the system SHALL show loading indicators while maintaining the current page data
3. WHEN no referral data exists THEN the system SHALL display an appropriate empty state message
4. WHEN pagination is loading THEN the system SHALL disable pagination controls to prevent multiple simultaneous requests
5. WHEN an error occurs during pagination THEN the system SHALL display error feedback and allow retry options