# Backend Schema Requirements for Mobile App

## Required Schema Updates

### 1. Query Names
Current backend uses `get` prefix, but frontend expects direct names:
- `getCategories` → should also support `categories` 
- `getWallet` → should also support `wallet`
- `getTransactions` → should also support `transactions`
- `getTransaction` → should also support `transaction`
- `getSources` → should also support `sources`

### 2. Missing Fields

#### Category Type
```graphql
type Category {
  id: ID!
  name: String!
  description: String  # Missing - needed for category details
  isDefault: Boolean   # Missing - needed to identify default categories
  # ... existing fields
}
```

#### Source Type
```graphql
type Source {
  id: ID!
  name: String!
  description: String  # Missing - needed for source details
  icon: String         # Missing - needed for UI icons
  color: String        # Missing - needed for UI theming
  # ... existing fields
}
```

#### Transaction Type
```graphql
type Transaction {
  id: ID!
  amount: Float!
  description: String
  date: AWSDateTime!
  category: Category   # Currently String, should be Category object
  source: Source       # Currently sourceId, should be Source object
  wallet: Wallet       # Missing - needed for wallet relationship
  # ... existing fields
}
```

### 3. Missing Queries
```graphql
type Query {
  # User profile
  me: User
  
  # Analytics
  transactionAnalytics(
    startDate: AWSDateTime
    endDate: AWSDateTime
    groupBy: AnalyticsGroupBy
  ): AnalyticsResult
}

enum AnalyticsGroupBy {
  DAY
  WEEK
  MONTH
  CATEGORY
  SOURCE
}

type AnalyticsResult {
  totalAmount: Float!
  transactionCount: Int!
  averageAmount: Float!
  groupedData: [AnalyticsGroup!]!
}

type AnalyticsGroup {
  label: String!
  amount: Float!
  count: Int!
}
```

### 4. Missing Mutations
```graphql
type Mutation {
  # User profile updates
  updateUserProfile(input: UpdateUserInput!): User
  
  # Transfer between wallets/sources
  createTransfer(input: CreateTransferInput!): Transaction
}

input UpdateUserInput {
  name: String
  email: String
  preferences: String
}

input CreateTransferInput {
  fromWalletId: ID!
  toWalletId: ID!
  amount: Float!
  description: String
  date: AWSDateTime
}
```

### 5. Type Updates
- Use `AWSDateTime` instead of `DateTime` (already correct)
- Use `ID` for all ID fields instead of `Int`
- Ensure all relationships return full objects, not just IDs

## Priority Order
1. **High Priority**: Fix relationship fields (category, source, wallet as objects)
2. **High Priority**: Add missing fields to existing types
3. **Medium Priority**: Add analytics queries
4. **Medium Priority**: Add user profile queries/mutations
5. **Low Priority**: Add transfer functionality

## Testing Checklist
Once backend is updated, test these queries:
- [ ] `getWallets` returns wallets with all fields
- [ ] `getTransactions` returns transactions with category/source/wallet objects
- [ ] `getCategories` includes description and isDefault fields
- [ ] `getSources` includes description, icon, and color fields
- [ ] All mutations work with proper input validation
