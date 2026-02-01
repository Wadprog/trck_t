import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Platform } from 'react-native';

// Create HTTP link to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || 
       'https://hsr7bf27wjf2bjb6t2klwuwp44.appsync-api.us-east-1.amazonaws.com/graphql',
});

// Auth link to add authentication headers
const authLink = setContext(async (_, { headers }) => {
  // For AWS AppSync, you might need different authentication methods:
  // 1. API Key authentication
  // 2. AWS Cognito User Pools
  // 3. AWS IAM
  // 4. OIDC
  
  // Example for API Key authentication (most common for AppSync)
  const apiKey = process.env.EXPO_PUBLIC_AWS_APPSYNC_API_KEY;
  
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      // Uncomment and configure based on your AppSync auth method:
      // For API Key auth:
      // 'x-api-key': apiKey,
      // For Cognito User Pools:
      // 'Authorization': `Bearer ${cognitoToken}`,
      // For IAM:
      // 'Authorization': awsSignedHeaders,
    }
  };
});

// Error link to handle GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle specific network errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Token expired, redirect to login
      console.log('Token expired, redirecting to login');
      // You can dispatch a logout action here
    }
  }
});

// Combine all links
const link = from([
  errorLink,
  authLink,
  httpLink,
]);

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Transaction: {
        fields: {
          createdAt: {
            // Transform string dates to Date objects
            read(existing) {
              return existing ? new Date(existing) : null;
            }
          },
          updatedAt: {
            read(existing) {
              return existing ? new Date(existing) : null;
            }
          }
        }
      },
      Wallet: {
        fields: {
          transactions: {
            // Merge strategy for paginated transactions
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  // Enable DevTools in development
  connectToDevTools: __DEV__,
});

// Helper function to clear cache (useful for logout)
export const clearApolloCache = () => {
  apolloClient.clearStore();
};

// Helper function to reset cache (useful for user switching)
export const resetApolloCache = () => {
  apolloClient.resetStore();
};
