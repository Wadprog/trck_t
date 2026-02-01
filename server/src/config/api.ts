/**
 * API Configuration for Finance Tracker
 * This file contains all the necessary configuration for accessing your GraphQL API
 * 
 * IMPORTANT: This file contains deployment-specific values that should not be hardcoded.
 * Use the configure script to populate actual values: npm run configure dev --fetch-aws
 */

// Environment-specific configuration
const STAGE = process.env.STAGE || 'dev';

// Get these values from your AWS CloudFormation stack outputs
// Run: npm run configure:fetch to populate with actual deployment values
export const API_CONFIG = {
  // GraphQL API Endpoint - This will be populated after deployment
  graphqlEndpoint: process.env.AWS_GRAPHQL_ENDPOINT || 'YOUR_APPSYNC_ENDPOINT_HERE',
  
  // AWS Region
  region: 'us-east-1',
  
  // Current Stage
  stage: STAGE,
  
  // Cognito Configuration - These will be populated after deployment
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID || 'YOUR_USER_POOL_ID_HERE',
    userPoolWebClientId: process.env.COGNITO_USER_POOL_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
    region: 'us-east-1',
  },
  
  // AppSync API ID - This will be populated after deployment
  apiId: process.env.API_ID || 'YOUR_API_ID_HERE',
} as const;

// Type-safe environment configuration
export type ApiConfig = typeof API_CONFIG;

// Helper function to get the GraphQL endpoint
export function getGraphQLEndpoint(): string {
  return process.env.AWS_GRAPHQL_ENDPOINT || API_CONFIG.graphqlEndpoint;
}

// Validation function to check if configuration is properly set up
export function validateConfiguration(): { isValid: boolean; missingValues: string[] } {
  const missingValues: string[] = [];
  
  if (API_CONFIG.graphqlEndpoint.includes('YOUR_')) {
    missingValues.push('graphqlEndpoint');
  }
  
  if (API_CONFIG.cognito.userPoolId.includes('YOUR_')) {
    missingValues.push('cognito.userPoolId');
  }
  
  if (API_CONFIG.cognito.userPoolWebClientId.includes('YOUR_')) {
    missingValues.push('cognito.userPoolWebClientId');
  }
  
  if (API_CONFIG.apiId.includes('YOUR_')) {
    missingValues.push('apiId');
  }
  
  return {
    isValid: missingValues.length === 0,
    missingValues,
  };
}
