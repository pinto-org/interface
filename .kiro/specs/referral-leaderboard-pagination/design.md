# Design Document

## Overview

This design implements robust pagination for the referral leaderboard by replacing the current simple skip/first pagination with the proven `paginateSubgraph` utility pattern. The implementation will ensure data consistency during pagination sessions using block height snapshots and provide a seamless user experience with familiar pagination controls.

## Architecture

The solution consists of three main components:

1. **GraphQL Query Enhancement**: Update the existing query to support optional block height parameters
2. **Hook Refactoring**: Replace the current `useReferralLeaderboard` hook to use `paginateSubgraph` utility
3. **UI Component Updates**: Enhance the `ReferralLeaderboard` component with improved pagination controls and loading states

### Data Flow

```
User Request → ReferralLeaderboard Component → useReferralLeaderboard Hook → paginateSubgraph Utility → GraphQL Subgraph → Aggregated Results → UI Display
```

## Components and Interfaces

### 1. Enhanced GraphQL Query

```typescript
const FarmersLeaderboardPageDocument = gql`
  query FarmersLeaderboardPage($first: Int!, $skip: Int!, $block: Block_height) {
    farmers(
      first: $first
      skip: $skip
      orderBy: totalReferralRewardPodsReceived
      orderDirection: desc
      where: { refereeCount_gte: 0 }
      block: $block
    ) {
      id
      refereeCount
      totalReferralRewardPodsReceived
    }
  }
`;
```

### 2. Pagination Settings Configuration

```typescript
interface FarmersLeaderboardPaginationSettings extends PaginationSettings<Farmer, FarmersLeaderboardResponse, keyof FarmersLeaderboardResponse, FarmersLeaderboardVariables> {
  primaryPropertyName: "farmers";
  idField: "id";
  nextVars: (lastFarmer: Farmer, prevVars: FarmersLeaderboardVariables) => FarmersLeaderboardVariables | undefined;
}
```

### 3. Updated Hook Interface

```typescript
export interface UseReferralLeaderboardReturn {
  data: LeaderboardEntry[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useReferralLeaderboard(): UseReferralLeaderboardReturn;
```

### 4. Component State Management

```typescript
interface ReferralLeaderboardState {
  currentPage: number;
  blockHeight: bigint | null;
  isInitialLoad: boolean;
  paginationError: Error | null;
}
```

## Data Models

### Farmer Entity
```typescript
interface Farmer {
  id: string; // Wallet address
  refereeCount: number;
  totalReferralRewardPodsReceived: string; // BigInt as string
}
```

### Leaderboard Entry
```typescript
interface LeaderboardEntry {
  address: string;
  podsEarned: TokenValue;
  totalSuccessfulReferrals: number;
  rank: number;
}
```

### Query Variables
```typescript
interface FarmersLeaderboardVariables {
  first: number;
  skip: number;
  block?: {
    number: number;
  } | null;
}
```

## Correctness Properties
*A pr
operty is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all properties identified in the prework, several can be consolidated to eliminate redundancy:

- Properties 1.1 and 1.2 both test data consistency during pagination and can be combined into a comprehensive consistency property
- Properties 1.4 and 4.1 both test block height usage and can be combined
- Properties 3.4, 6.2, and 6.4 all test loading state management and can be combined
- Properties 5.2 and 5.5 both test pagination control states and can be combined

### Correctness Properties

**Property 1: Pagination data consistency**
*For any* leaderboard pagination session with a fixed block height, the union of all paginated results should contain no duplicate entries and maintain proper ordering by totalReferralRewardPodsReceived
**Validates: Requirements 1.1, 1.2**

**Property 2: Block height consistency across pages**
*For any* pagination session, when a block height is established on the first page request, all subsequent page requests should use the same block height
**Validates: Requirements 1.4, 4.1**

**Property 3: Pagination termination**
*For any* pagination request, when the subgraph returns fewer results than the requested page size (1000), pagination should terminate and not request additional pages
**Validates: Requirements 1.5, 2.5**

**Property 4: Query variable construction**
*For any* query variable construction, block height should only be included in the variables when it has a valid non-null value
**Validates: Requirements 4.4**

**Property 5: Result aggregation completeness**
*For any* successful pagination operation, the final aggregated results should contain all entries from all requested pages without loss or duplication
**Validates: Requirements 3.5**

**Property 6: Loading state management**
*For any* pagination operation in progress, the system should maintain appropriate loading states while preserving existing data and disabling controls to prevent concurrent requests
**Validates: Requirements 3.4, 6.2, 6.4**

**Property 7: Pagination control states**
*For any* pagination UI state, Previous/Next buttons should be enabled/disabled based on current page position and data availability, and the current page number should be accurately displayed
**Validates: Requirements 5.2, 5.5**

## Error Handling

### Network Error Recovery
- Implement exponential backoff for failed requests
- Provide user-friendly error messages for network issues
- Allow manual retry functionality

### Block Height Fallback
- When block height cannot be determined, gracefully fall back to real-time queries
- Log warnings for debugging purposes
- Maintain functionality without block height constraints

### Invalid Data Handling
- Validate farmer data structure before processing
- Handle missing or malformed fields gracefully
- Provide default values where appropriate

## Testing Strategy

### Unit Testing
The implementation will include unit tests for:
- Query variable construction logic
- Pagination settings configuration
- Error handling scenarios
- Loading state management
- UI component interactions

### Property-Based Testing
Property-based tests will be implemented using a suitable testing library (such as fast-check for TypeScript) to verify:
- Data consistency across pagination sessions
- Block height usage patterns
- Result aggregation correctness
- UI state management properties

**Testing Configuration:**
- Minimum 100 iterations per property test
- Custom generators for farmer data, block heights, and pagination scenarios
- Edge case coverage for empty data, single page, and error conditions

### Integration Testing
- Test the complete pagination flow from UI interaction to data display
- Verify compatibility with existing subgraph infrastructure
- Test error scenarios with mock GraphQL responses

## Implementation Considerations

### Performance Optimization
- Implement result caching to avoid redundant requests
- Use React Query's built-in caching mechanisms
- Optimize re-renders during pagination state changes

### Backward Compatibility
- Maintain existing hook interface where possible
- Ensure smooth migration from current implementation
- Preserve existing UI behavior and styling

### Monitoring and Observability
- Add logging for pagination operations
- Track pagination performance metrics
- Monitor error rates and retry patterns

## Migration Strategy

1. **Phase 1**: Implement new hook alongside existing implementation
2. **Phase 2**: Update UI component to use new hook with feature flag
3. **Phase 3**: Remove old implementation after validation
4. **Phase 4**: Monitor production performance and optimize as needed