# Finance Tracker Backend

A serverless finance tracking application built with AWS AppSync, DynamoDB, and Cognito.

## 🚀 API Endpoints

### AppSync Generated URLs
After deployment, your API endpoints will be:
- **Development**: `https://[generated-id].appsync-api.us-east-1.amazonaws.com/graphql`
- **Staging**: `https://[generated-id].appsync-api.us-east-1.amazonaws.com/graphql`
- **Production**: `https://[generated-id].appsync-api.us-east-1.amazonaws.com/graphql`

### Getting Your Endpoint URLs
After deployment, get your actual endpoints by running:
```bash
# Get deployment info for your stage
npm run info:dev
npm run info:staging
npm run info:prod
```

**AWS AppSync Console**: Check the AWS Console > AppSync > Your API > Settings

## 🏗 Architecture

- **GraphQL API**: AWS AppSync
- **Database**: DynamoDB
- **Authentication**: Amazon Cognito
- **Infrastructure**: Serverless Framework

## 📊 Features

### Categories
- Create, read, update, delete categories
- Filter categories by type (INCOME/EXPENSE)
- Pre-defined category templates
- Support for icons, colors, and short names

### Transactions (Schema Ready)
- Transaction management with categories
- Income and expense tracking
- Date-based filtering

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Serverless Framework

### Installation

```bash
npm install
```

### Available Scripts

```bash
# Configure environment for specific stage
npm run configure dev
npm run configure staging
npm run configure prod

# Generate TypeScript types from GraphQL schema
npm run generate-types

# Deploy to specific stages
npm run deploy:dev
npm run deploy:staging
npm run deploy:prod

# Get deployment info for specific stages
npm run info:dev
npm run info:staging
npm run info:prod

# Build TypeScript
npm run build

# Development mode (watch)
npm run dev

# Remove deployment from specific stages
npm run remove:dev
npm run remove:staging
npm run remove:prod
```

## 🔧 Configuration

The API configuration is dynamically generated based on your deployment stage. 

### Environment Configuration
```bash
# Configure environment for a specific stage
npm run configure dev
npm run configure staging
npm run configure prod
```

This creates stage-specific configuration files with your actual deployment values.

### Configuration Structure
```typescript
// Example configuration structure (actual values populated from deployment)
export const API_CONFIG = {
  stage: 'dev', // or 'staging', 'prod'
  graphqlEndpoint: 'https://[generated-id].appsync-api.us-east-1.amazonaws.com/graphql',
  region: 'us-east-1',
  cognito: {
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-client-id',
    region: 'us-east-1',
  },
  apiId: 'your-api-id',
};
```

### Getting Your Configuration Values
After deployment, retrieve your configuration values:
```bash
# Get stack outputs with all configuration values
aws cloudformation describe-stacks \
  --stack-name finance-tracker-backend-dev \
  --query 'Stacks[0].Outputs'
```

## 📝 API Integration Guide

### For Frontend Developers

This backend provides a GraphQL API that your frontend application can consume. After deployment, you'll get:

1. **GraphQL Endpoint**: Your AppSync API URL
2. **Authentication Config**: Cognito User Pool details
3. **Generated Types**: TypeScript definitions for your frontend

### Using Generated Types in Your Frontend

```bash
# In your frontend project, copy the generated types
cp path/to/backend/src/generated/* ./src/types/

# Install GraphQL client of your choice
npm install @apollo/client graphql
# OR
npm install graphql-request
# OR  
npm install urql graphql
```

### Frontend Integration Example

```typescript
// Using the generated types in your frontend
import { CreateCategoryInput, CategoryType } from './types/graphql';

const createCategoryMutation = `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      icon
      type
      color
      shortName
      createdAt
      updatedAt
    }
  }
`;

// Your frontend GraphQL client setup will use:
// - Endpoint: from deployment outputs
// - Auth: Cognito JWT tokens  
// - Types: from generated files
```

## 📊 GraphQL Schema

### Category Operations

```graphql
# Create a category
mutation CreateCategory {
  createCategory(input: {
    name: "Food & Dining"
    icon: "🍽️"
    type: EXPENSE
    color: "#FF6B6B"
    shortName: "FOOD"
  }) {
    id
    name
    icon
    type
    color
    shortName
    createdAt
    updatedAt
  }
}

# Get all categories
query GetCategories {
  getCategories {
    id
    name
    icon
    type
    color
    shortName
  }
}

# Get categories by type
query GetExpenseCategories {
  getCategoriesByType(type: EXPENSE) {
    id
    name
    icon
    type
    color
    shortName
  }
}
```

## 🗂 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── api.ts              # API configuration
│   ├── services/
│   │   └── financeTracker.ts   # Business logic (deprecated - for reference)
│   └── generated/
│       ├── graphql.ts          # Generated types
│       └── sdk.ts              # Generated SDK
├── mapping-templates/          # VTL templates for AppSync
├── schema.graphql             # GraphQL schema definition
├── serverless.yml             # Infrastructure config
├── codegen.yml                # Type generation config
├── scripts/
│   └── configure-env.js       # Environment configuration script
└── package.json
```

**Note**: The `services/` folder contains deprecated example business logic that was used during development. These are reference implementations showing how your frontend might structure API calls. Your frontend application will interact directly with the GraphQL API using your preferred GraphQL client, not these service classes.

## 🔒 Authentication

The API uses Amazon Cognito for authentication. All GraphQL operations require a valid JWT token in the Authorization header.

### Cognito Configuration
Your Cognito configuration is automatically set up during deployment. To get your specific values:

```bash
# Get Cognito configuration from deployment outputs
aws cloudformation describe-stacks \
  --stack-name finance-tracker-backend-{stage} \
  --query 'Stacks[0].Outputs[?contains(OutputKey, `Cognito`)]'
```

The configuration includes:
- **User Pool ID**: Auto-generated during deployment
- **Client ID**: Auto-generated during deployment  
- **Region**: Based on your deployment region

## 🚀 Deployment

```bash
# Deploy to development
npm run deploy:dev

# Deploy to production
npm run deploy:prod
```

## 📈 Frontend Integration Steps

1. **Deploy the Backend**: Use `npm run deploy:dev` to get your API endpoints
2. **Get Configuration**: Run `npm run configure dev` to get connection details
3. **Copy Generated Types**: Use the files in `src/generated/` for TypeScript support
4. **Setup Frontend Client**: Configure your GraphQL client with the endpoints and auth
5. **Implement Authentication**: Use Cognito for user management in your frontend

## 🛠 Backend Development

This repository focuses purely on backend infrastructure and API definition. For frontend development, create a separate repository that consumes this API.

## 🐛 Troubleshooting

### Type Generation Issues
```bash
npm run generate-types
```

### Authentication Issues
- Ensure AWS CLI is configured
- Check Cognito user pool settings
- Verify JWT token format

### Deployment Issues
- Check AWS permissions
- Verify region settings
- Review CloudFormation logs
