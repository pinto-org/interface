# Implementation Plan

- [x] 1. Update GraphQL query and types
  - Create the new FarmersLeaderboardPage query with block height support
  - Update TypeScript interfaces to match the actual API response structure
  - Remove totalPintoSown field from LeaderboardEntry interface since it's not available in the API
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2. Implement pagination utility integration
  - [x] 2.1 Create pagination settings configuration for farmers leaderboard
    - Define PaginationSettings with primaryPropertyName as "farmers"
    - Implement nextVars callback for farmer-based pagination logic
    - Configure idField as "id" for farmer identification
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 2.2 Write property test for pagination data consistency
    - **Property 1: Pagination data consistency**
    - **Validates: Requirements 1.1, 1.2**

  - [ ]* 2.3 Write property test for block height consistency
    - **Property 2: Block height consistency across pages**
    - **Validates: Requirements 1.4, 4.1**

- [x] 3. Refactor useReferralLeaderboard hook
  - [x] 3.1 Replace current pagination logic with paginateSubgraph utility
    - Remove existing skip/first pagination implementation
    - Integrate paginateSubgraph utility with proper configuration
    - Add block height capture and management logic
    - _Requirements: 2.1, 1.3, 1.4_

  - [x] 3.2 Add block height management
    - Implement current block height fetching using useLatestBlock hook
    - Add block height state management for pagination sessions
    - Implement fallback logic when block height is unavailable
    - _Requirements: 1.3, 3.2, 4.2_

  - [ ]* 3.3 Write property test for pagination termination
    - **Property 3: Pagination termination**
    - **Validates: Requirements 1.5, 2.5**

  - [ ]* 3.4 Write property test for query variable construction
    - **Property 4: Query variable construction**
    - **Validates: Requirements 4.4**

- [x] 4. Update ReferralLeaderboard component
  - [x] 4.1 Remove totalPintoSown column from the table
    - Update table headers to remove "Total Pinto Sown" column
    - Remove totalPintoSown display logic from table rows
    - Adjust table column widths and responsive design
    - _Requirements: Data model alignment_

  - [x] 4.2 Enhance error handling and loading states
    - Add comprehensive error state handling for pagination failures
    - Implement loading state management during pagination operations
    - Add retry functionality for failed requests
    - _Requirements: 3.1, 6.1, 6.2, 6.5_

  - [ ]* 4.3 Write property test for result aggregation completeness
    - **Property 5: Result aggregation completeness**
    - **Validates: Requirements 3.5**

  - [ ]* 4.4 Write property test for loading state management
    - **Property 6: Loading state management**
    - **Validates: Requirements 3.4, 6.2, 6.4**

- [x] 5. Improve pagination UI controls
  - [x] 5.1 Update pagination control logic
    - Remove page-based state management in favor of data-driven pagination
    - Update button enable/disable logic based on data availability
    - Improve pagination control styling and accessibility
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ]* 5.2 Write property test for pagination control states
    - **Property 7: Pagination control states**
    - **Validates: Requirements 5.2, 5.5**

  - [ ]* 5.3 Write unit tests for UI interactions
    - Test Next/Previous button click handlers
    - Test loading state display during pagination
    - Test empty state handling when no data exists
    - _Requirements: 5.3, 5.4, 6.3_

- [ ] 6. Add comprehensive error handling
  - [x] 6.1 Implement network error recovery
    - Add exponential backoff for failed pagination requests
    - Implement user-friendly error messages for network issues
    - Add manual retry functionality for failed operations
    - _Requirements: 3.1, 6.5_

  - [x] 6.2 Add block height error handling
    - Handle invalid or too old block height errors gracefully
    - Implement fallback to real-time queries when block height fails
    - Add appropriate logging for debugging block height issues
    - _Requirements: 4.5, 3.2_

  - [ ]* 6.3 Write unit tests for error scenarios
    - Test network error handling and retry logic
    - Test invalid block height error handling
    - Test empty data state handling
    - _Requirements: 3.1, 4.5, 6.3_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Performance optimization and cleanup
  - [x] 8.1 Implement result caching optimization
    - Add appropriate caching strategies for pagination results
    - Optimize React Query configuration for leaderboard data
    - Minimize unnecessary re-renders during pagination state changes
    - _Requirements: Performance considerations_

  - [x] 8.2 Remove deprecated code and update documentation
    - Remove old pagination implementation code
    - Update component documentation and prop interfaces
    - Add JSDoc comments for new pagination functionality
    - _Requirements: Code maintenance_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.