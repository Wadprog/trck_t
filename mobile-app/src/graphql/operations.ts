import { gql } from '@apollo/client';

// Wallet operations
export const GET_WALLETS = gql`
  query GetWallets {
    wallets {
      id
      name
      description
      icon
      color
      isDefault
      balance
      createdAt
      updatedAt
    }
  }
`;

export const GET_WALLET = gql`
  query GetWallet($id: ID!) {
    wallet(id: $id) {
      id
      name
      description
      icon
      color
      isDefault
      balance
      sources {
        id
        name
        type
        balance
        isActive
      }
      transactions(limit: 50) {
        id
        amount
        description
        type
        category {
          id
          name
          icon
        }
        source {
          id
          name
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_WALLET = gql`
  mutation CreateWallet($input: CreateWalletInput!) {
    createWallet(input: $input) {
      id
      name
      description
      icon
      color
      isDefault
      balance
    }
  }
`;

export const UPDATE_WALLET = gql`
  mutation UpdateWallet($id: ID!, $input: UpdateWalletInput!) {
    updateWallet(id: $id, input: $input) {
      id
      name
      description
      icon
      color
      isDefault
      balance
    }
  }
`;

export const DELETE_WALLET = gql`
  mutation DeleteWallet($id: ID!) {
    deleteWallet(id: $id)
  }
`;

// Transaction operations
export const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $walletId: ID
    $limit: Int = 50
    $offset: Int = 0
    $startDate: DateTime
    $endDate: DateTime
    $type: TransactionType
    $categoryId: ID
  ) {
    transactions(
      walletId: $walletId
      limit: $limit
      offset: $offset
      startDate: $startDate
      endDate: $endDate
      type: $type
      categoryId: $categoryId
    ) {
      id
      amount
      description
      type
      date
      category {
        id
        name
        icon
        color
        type
      }
      source {
        id
        name
        type
        icon
      }
      wallet {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      amount
      description
      type
      date
      category {
        id
        name
        icon
        color
      }
      source {
        id
        name
      }
      wallet {
        id
        name
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories($type: CategoryType) {
    categories(type: $type) {
      id
      name
      icon
      color
      type
      description
      isDefault
      transactionCount
      totalAmount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      icon
      color
      type
      description
      isDefault
    }
  }
`;
