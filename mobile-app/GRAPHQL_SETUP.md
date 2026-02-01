# GraphQL & Apollo Client Setup

This project uses Apollo Client for GraphQL data management and automatic TypeScript code generation.

## Setup

### 1. Dependencies Installed
- `@apollo/client` - Apollo Client for React
- `graphql` - GraphQL JavaScript reference implementation
- `@graphql-codegen/*` - GraphQL Code Generator for TypeScript types

### 2. Configuration Files
- `codegen.yml` - GraphQL Code Generator configuration
- `src/lib/apollo.ts` - Apollo Client configuration
- `src/lib/GraphQLProvider.tsx` - React context provider

### 3. Directory Structure
```
src/
├── generated/          # Auto-generated TypeScript types
├── graphql/           # GraphQL operations and schema
│   ├── operations.ts  # GraphQL queries/mutations
│   ├── wallets.graphql
│   ├── transactions.graphql
│   └── categories-sources.graphql
├── hooks/             # Custom GraphQL hooks
│   └── useWallets.ts
├── lib/               # Apollo Client setup
│   ├── apollo.ts
│   └── GraphQLProvider.tsx
└── types/             # TypeScript type definitions
    └── graphql.ts
```

## Usage

### 1. Configure AWS AppSync Authentication
The project is configured to work with AWS AppSync. You need to set up authentication:

#### Option A: API Key Authentication (Recommended for development)
1. Get your API Key from AWS AppSync console
2. Add it to your `.env` file:
```bash
EXPO_PUBLIC_AWS_APPSYNC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_APPSYNC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxxxxxxxx  # For codegen
```
3. Uncomment the API key line in `codegen.yml`:
```yaml
schema: 
  "${GRAPHQL_ENDPOINT}":
    headers:
      x-api-key: "${AWS_APPSYNC_API_KEY}"  # Uncomment this line
```
4. Uncomment the API key line in `src/lib/apollo.ts`:
```typescript
'x-api-key': apiKey,  // Uncomment this line
```

#### Option B: AWS Cognito User Pools
1. Configure Cognito User Pool settings in `.env`
2. Implement Cognito authentication in your app
3. Update the auth link to use Cognito tokens

#### Option C: AWS IAM Authentication
1. Configure AWS credentials
2. Use AWS Signature Version 4 for requests

### 2. Update GraphQL Endpoint
The endpoint is already configured for your AppSync API:
```
https://hsr7bf27wjf2bjb6t2klwuwp44.appsync-api.us-east-1.amazonaws.com/graphql
```

### 2. Wrap Your App with GraphQL Provider
In your main app file (`app/_layout.tsx`):
```typescript
import { GraphQLProvider } from '../src/lib/GraphQLProvider';

export default function RootLayout() {
  return (
    <GraphQLProvider>
      {/* Your app components */}
    </GraphQLProvider>
  );
}
```

### 3. Generate TypeScript Types
⚠️ **Important**: You need to configure authentication first before generating types.

Once authentication is set up:
```bash
npm run generate-types
```

If you get authentication errors, make sure:
1. Your API key is correct and active
2. The API key is uncommented in both `.env` and `codegen.yml`
3. The AppSync API allows your authentication method

### 4. Use Custom Hooks
```typescript
import { useWallets, useCreateWallet } from '../src/hooks/useWallets';

function WalletsScreen() {
  const { data, loading, error } = useWallets();
  const [createWallet] = useCreateWallet();

  const handleCreateWallet = async () => {
    try {
      const result = await createWallet({
        variables: {
          input: {
            name: 'My Wallet',
            icon: '💰',
            color: '#3B82F6'
          }
        }
      });
      console.log('Created wallet:', result.data?.createWallet);
    } catch (err) {
      console.error('Error creating wallet:', err);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data?.wallets.map(wallet => (
        <Text key={wallet.id}>{wallet.name}</Text>
      ))}
    </View>
  );
}
```

## Available Scripts

- `npm run codegen` - Generate TypeScript types from GraphQL schema
- `npm run codegen:watch` - Watch mode for continuous type generation
- `npm run generate-types` - Alias for codegen

## GraphQL Operations

### Queries
- `GetWallets` - Fetch all wallets
- `GetWallet($id)` - Fetch wallet by ID
- `GetTransactions(...)` - Fetch transactions with filters
- `GetCategories(...)` - Fetch categories

### Mutations
- `CreateWallet($input)` - Create new wallet
- `UpdateWallet($id, $input)` - Update wallet
- `DeleteWallet($id)` - Delete wallet
- `CreateTransaction($input)` - Create transaction
- `CreateCategory($input)` - Create category

## Features

### Automatic Cache Management
Apollo Client automatically caches queries and updates the cache when mutations are performed.

### Error Handling
Built-in error handling for both GraphQL and network errors.

### Type Safety
Full TypeScript support with auto-generated types from your GraphQL schema.

### Optimistic Updates
Support for optimistic UI updates for better user experience.

### Offline Support
Apollo Client provides built-in offline capabilities and cache persistence.

## Next Steps

1. **Backend Integration**: Update the GraphQL endpoint URL when your backend is ready
2. **Authentication**: Implement token-based authentication in the auth link
3. **Error Handling**: Customize error handling for your specific needs
4. **Cache Policies**: Configure cache policies for optimal performance
5. **Subscriptions**: Add real-time subscriptions if needed
6. **Offline Support**: Configure cache persistence for offline usage

## Example Backend Schema

Your GraphQL backend should implement types similar to:
```graphql
type Wallet {
  id: ID!
  name: String!
  description: String
  icon: String!
  color: String!
  isDefault: Boolean!
  balance: Float!
  sources: [TransactionSource!]!
  transactions: [Transaction!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateWalletInput {
  name: String!
  description: String
  icon: String!
  color: String!
  isDefault: Boolean = false
}
```
