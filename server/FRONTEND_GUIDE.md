# Frontend Integration Guide

This document explains how to integrate your frontend application with the Finance Tracker Backend API.

## What This Backend Provides

✅ **GraphQL API**: Fully deployed AppSync API with authentication  
✅ **Generated Types**: TypeScript definitions for all API operations  
✅ **Schema Definition**: Complete GraphQL schema  
✅ **Configuration Templates**: Environment setup for different stages  
✅ **Authentication Setup**: Cognito configuration  

## What Your Frontend Needs to Implement

🔧 **GraphQL Client**: Apollo Client, GraphQL Request, Urql, or similar  
🔧 **Authentication**: Cognito integration (AWS Amplify or custom)  
🔧 **State Management**: React Context, Redux, Zustand, etc.  
🔧 **UI Components**: Forms, lists, authentication flows  

## Quick Start for Frontend

### 1. Get Backend Configuration
```bash
# In the backend repository
npm run deploy:dev
npm run configure dev
```

This gives you:
- API endpoint URL
- Cognito User Pool ID  
- Cognito Client ID
- Region information

### 2. Copy Generated Types
```bash
# Copy these files to your frontend project
cp backend/src/generated/graphql.ts ./src/types/
cp backend/src/generated/sdk.ts ./src/types/
```

### 3. Setup GraphQL Client (Example with Apollo)
```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'YOUR_GRAPHQL_ENDPOINT_HERE', // From backend configuration
});

const authLink = setContext((_, { headers }) => {
  // Get JWT token from Cognito
  const token = localStorage.getItem('jwt-token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

### 4. Use Generated Types
```typescript
import { CategoryType, CreateCategoryInput } from './types/graphql';

// Fully typed category creation
const createCategory = async (input: CreateCategoryInput) => {
  const result = await client.mutate({
    mutation: CREATE_CATEGORY,
    variables: { input }
  });
  return result.data?.createCategory;
};
```

## Available Operations

### Categories
- `createCategory(input: CreateCategoryInput)`
- `getCategories()`
- `getCategoriesByType(type: CategoryType)`
- `getCategory(id: ID!)`

### Authentication (via Cognito)
- User registration
- Email confirmation  
- Sign in/out
- JWT token management

## Example Implementations

The backend includes reference implementations in `src/services/financeTracker.ts` that show:
- How to structure API calls
- Default category data
- Authentication patterns
- Error handling approaches

These are **reference only** - your frontend will implement its own version using your chosen GraphQL client.

## Next Steps

1. **Setup Authentication**: Integrate AWS Cognito in your frontend
2. **Implement GraphQL Client**: Choose and configure Apollo, Urql, or GraphQL Request
3. **Build UI Components**: Create forms and lists for categories
4. **Add State Management**: Handle loading states, errors, and data caching
5. **Test Integration**: Use the deployed backend API endpoints

## Support

- 📖 **GraphQL Schema**: Check `schema.graphql` for complete API definition
- 🔧 **Configuration**: Use `npm run configure dev` for environment setup  
- 🚀 **Deployment**: Backend handles all infrastructure automatically
- 📊 **Types**: Generated TypeScript types ensure type safety
