# AppSync Schema Mismatch Analysis

Based on the GraphQL validation errors, here are the discrepancies between your frontend operations and the actual AppSync backend schema:

## Query Field Mismatches

### Current Frontend → Required Backend
- `categories` → `getCategories`
- `category` → `getCategory` 
- `sources` → `getSources`
- `wallets` → `getWallets`
- `wallet` → `getWallet`
- `transactions` → `getTransactions`
- `transaction` → `getTransaction`

## Type Mismatches

### Current Frontend → Required Backend
- `DateTime` → `AWSDateTime` (AppSync standard)
- `Int` → `ID` (for IDs)

## Field Mismatches

### Category Type
**Missing fields that frontend expects:**
- `description` - not available in backend
- `isDefault` - not available in backend

### Source Type  
**Missing fields that frontend expects:**
- `description` - not available in backend
- `icon` - not available in backend
- `color` - not available in backend

### Transaction Type
**Field name changes:**
- `source` → `sourceId` (backend suggests this)
- `category` is a String, not an object (no subfields)

## Missing Features
- `transactionAnalytics` query - not implemented in backend
- `AnalyticsGroupBy` type - not implemented in backend
- `me` query - not implemented in backend
- `updateUserProfile` mutation - not implemented in backend
- `createTransfer` mutation - not implemented in backend

## Available Input Types (from error suggestions)
✅ `CreateTransactionInput`
✅ `CreateWalletInput` 
✅ `CreateCategoryInput`
✅ `CreateSourceInput`
✅ `UpdateSourceInput`
✅ `UpdateWalletInput`
✅ `UpdateCategoryInput`

## Next Steps
1. Update frontend GraphQL operations to match backend schema
2. Remove non-existent fields from queries
3. Use correct query names with `get` prefix
4. Update type definitions to use `AWSDateTime` and `ID`
5. Backend team may need to implement missing features if required
