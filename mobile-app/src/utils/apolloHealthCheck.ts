// Apollo Client health check and schema introspection helper
import { gql } from '@apollo/client';

// Simple health check query that should work with any GraphQL endpoint
export const HEALTH_CHECK = gql`
  query HealthCheck {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      subscriptionType {
        name
      }
    }
  }
`;

// Get all available queries
export const GET_AVAILABLE_QUERIES = gql`
  query GetAvailableQueries {
    __schema {
      queryType {
        fields {
          name
          description
          args {
            name
            type {
              name
            }
          }
        }
      }
    }
  }
`;

// Get all available mutations
export const GET_AVAILABLE_MUTATIONS = gql`
  query GetAvailableMutations {
    __schema {
      mutationType {
        fields {
          name
          description
          args {
            name
            type {
              name
            }
          }
        }
      }
    }
  }
`;

// Get all available types
export const GET_AVAILABLE_TYPES = gql`
  query GetAvailableTypes {
    __schema {
      types {
        name
        kind
        description
        fields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  }
`;

// Test connection and log available schema
export const testApolloConnection = async (client: any) => {
  try {
    console.log('🔍 Testing Apollo Client connection...');
    
    const { data } = await client.query({
      query: HEALTH_CHECK,
    });
    
    console.log('✅ Apollo Client connected successfully');
    console.log('📊 Schema info:', data.__schema);
    
    return true;
  } catch (error) {
    console.error('❌ Apollo Client connection failed:', error);
    return false;
  }
};

// Log all available queries and mutations
export const logAvailableOperations = async (client: any) => {
  try {
    const [queries, mutations] = await Promise.all([
      client.query({ query: GET_AVAILABLE_QUERIES }),
      client.query({ query: GET_AVAILABLE_MUTATIONS }),
    ]);
    
    console.log('📋 Available Queries:');
    queries.data.__schema.queryType.fields.forEach((field: any) => {
      console.log(`  - ${field.name}`);
    });
    
    console.log('📋 Available Mutations:');
    mutations.data.__schema.mutationType?.fields?.forEach((field: any) => {
      console.log(`  - ${field.name}`);
    });
    
    return { queries: queries.data, mutations: mutations.data };
  } catch (error) {
    console.error('❌ Failed to fetch available operations:', error);
    return null;
  }
};
