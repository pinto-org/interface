# ConvertUp Orderbook Dialog Specification

## Context

This document serves as the source of truth for implementing the ConvertUpOrderbook dialog component in the Pinto Interface. The dialog will display a table-based view of ConvertUp orders, similar to the SoilOrderbook implementation but adapted for ConvertUp-specific data and functionality.

## Implementation Details

### File Location
All changes will be made in: `/Users/calvin/repos/Pinto/interface/src/components/Tractor/ConvertUpOrderbook.tsx`

### Dialog Component Structure

**Title**: Convert Up Orders

**Tabs**:
1. View Convert Up Orders
2. Execute Convert Up Orders

## View Convert Up Orders Tab

### Table Columns
The table will display the following columns in order:

1. **Grown Stalk Bonus Per BDV**
   - Source: `decodedData.convertUpParams.minGrownStalkPerBdvBonus`
   - Format: 4 decimal places
   - Display: "≥ X" (minimum bonus required)

2. **Min Capacity**
   - Source: `decodedData.convertUpParams.minConvertBonusCapacity`
   - Format: Number with commas
   - Display: "≥ X BDV"

3. **Min Price**
   - Source: `decodedData.convertUpParams.minPriceToConvertUp`
   - Format: Currency with $ prefix
   - Display: "$X.XX"

4. **Max Price**
   - Source: `decodedData.convertUpParams.maxPriceToConvertUp`
   - Format: Currency with $ prefix
   - Display: "$X.XX"

5. **Total Convert BDV**
   - Source: `decodedData.convertUpParams.totalConvertBdv`
   - Format: Number with 2 decimal places
   - Display with PINTO icon

6. **Available Pinto (or BDV)**
   - Source: `currentlyConvertible` (from enriched orderbook data)
   - Format: Number with 2 decimal places
   - Display with PINTO icon

7. **Max Per Execution**
   - Source: `decodedData.convertUpParams.maxConvertBdvPerExecution`
   - Format: Number with 2 decimal places
   - Display with PINTO icon

8. **Min Per Execution**
   - Source: `decodedData.convertUpParams.minConvertBdvPerExecution`
   - Format: Number with 2 decimal places
   - Display with PINTO icon

9. **Operator Tip**
   - Source: `decodedData.opParams.operatorTipAmount`
   - Format: Number with 2 decimal places
   - Display with PINTO icon

10. **Blueprint Hash**
    - Source: `requisition.blueprintHash`
    - Format: Shortened (0x12345...6789)
    - Display: Monospace font

11. **Publisher**
    - Source: `requisition.blueprint.publisher`
    - Format: Shortened (0x12345...6789)
    - Display: Clickable link to Basescan
    - URL: `https://basescan.org/address/{address}`

12. **Created At**
    - Source: `timestamp` (calculated from block number)
    - Format: "MM/DD/YY hh:mmAM/PM"

### Filtering Options

Settings popover (gear icon) in the top-right corner with:

1. **Show Zero Available Pinto**
   - Type: Toggle switch
   - Default: false
   - Behavior: When false, hide orders where `currentlyConvertible` is zero

2. **Show Orders Above Current Bonus**
   - Type: Toggle switch
   - Default: true
   - Behavior: When false, hide orders where order bonus > current market bonus

### Current Bonus Indicator Row

A special row that displays current market conditions:
- **Position**: Dynamically placed based on bonus values
- **Style**: Different background color (bg-white with borders)
- **Content**:
  - "Current Bonus: X.XXXX" (left side)
  - "Orders at Current Bonus:" (center)
  - Summary statistics (right side):
    - Total Available Pinto
    - Total at minBDVPerExecution
    - Total at maxBDVPerExecution

### Sorting Logic

Default sort order (applied in sequence):
1. **Primary**: By bonus (descending) - Higher bonus orders appear first
2. **Secondary**: Price condition check - Orders where current price is within min/max range
3. **Tertiary**: By min capacity (ascending) - Lower capacity requirements appear first

Additional sort option via settings:
- Sort by "Bonus" or "Tip"

### Data Source and Enrichment

The component will use the `useTractorConvertUpOrderbook` hook which returns `ConvertUpOrderbookEntry[]` with:

```typescript
interface ConvertUpOrderbookEntry {
  // Original requisition data
  requisition: TractorRequisitionData;
  decodedData?: ConvertUpBlueprintStruct<TV>;
  
  // Enriched order info
  orderInfo: {
    lastExecutedTimestamp: string | undefined;
    bdvLeftToConvert: TV;
  };
  
  // Market condition checks
  meetsConditions: {
    price: boolean;    // Current price within min/max range
    bonus: boolean;    // Current bonus >= order minimum
    capacity: boolean; // Current capacity >= order minimum
  };
  
  // Execution availability
  totalAvailableBdv: TV;
  currentlyConvertible: TV;
  amountConvertibleNextExecution: TV;
  
  // Additional fields
  withdrawalPlan?: WithdrawalPlan;
  isComplete?: boolean;
}
```

### UI States

1. **Loading State**
   - Show LoadingSpinner with "Loading convert orders..." message
   - Display in center of table area

2. **Empty State**
   - Show "No active convert orders found" message
   - Suggest adjusting filters if applicable

3. **Row Hover State**
   - Background color change to pinto-green-1
   - Cursor: pointer
   - Smooth transition

## Execute Convert Up Orders Tab

**TODO**: Implementation details to be defined in a future iteration. This tab will contain functionality for executing existing ConvertUp orders.

## Component Architecture

### ConvertUpOrderbookContent
A presentational component that:
- Accepts filter props
- Renders the table with all columns
- Handles sorting and filtering logic
- Manages current bonus indicator placement

### ConvertUpOrderbookDialog
The main dialog wrapper that:
- Manages dialog state
- Contains tab navigation
- Houses the settings popover
- Wraps ConvertUpOrderbookContent

## Integration Points

1. **ReviewTractorOrderDialog Integration** (TODO)
   - On row click, open ReviewTractorOrderDialog
   - Pass order data and blueprint information
   - Set isViewOnly=true

2. **Market Data Integration**
   - Current bonus from market data
   - Current price for condition checks
   - Current capacity for filtering

## Performance Considerations

1. **Data Fetching**
   - Use appropriate refetch intervals (30 seconds recommended)
   - Implement proper caching strategies
   - Handle large orderbook gracefully

2. **Rendering Optimization**
   - Memoize expensive calculations (sorting, filtering)
   - Use React.memo for row components if needed
   - Implement virtualization for very large lists (future enhancement)

## Key Differences from SoilOrderbook

1. **Data Structure**: Uses ConvertUp-specific fields (bonus, capacity) instead of Sow fields (temperature, soil)
2. **Sorting**: Based on bonus values instead of temperature
3. **Conditions**: Checks price, bonus, and capacity instead of just temperature
4. **Values**: Displays BDV amounts instead of Bean amounts
5. **Market Indicator**: Shows current bonus instead of current temperature

## Future Enhancements

1. **Execute Orders Tab**
   - Form or interface for executing orders
   - Batch execution capabilities
   - Gas estimation

2. **Advanced Filtering**
   - Filter by token strategy
   - Filter by publisher address
   - Date range filtering

3. **Export Functionality**
   - Export table data to CSV
   - Copy order details to clipboard

4. **Real-time Updates**
   - WebSocket integration for live updates
   - Notification system for order changes

## Testing Considerations

1. **Unit Tests**
   - Filter logic testing
   - Sort algorithm testing
   - Data transformation testing

2. **Integration Tests**
   - Hook integration
   - Dialog interaction
   - Tab switching

3. **Visual Testing**
   - Responsive design
   - Dark mode compatibility
   - Loading/empty states