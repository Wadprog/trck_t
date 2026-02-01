// This file contains example service implementations for reference
// Your frontend application will implement similar logic using GraphQL clients

import { CategoryType, SourceType } from '../generated/graphql';

/**
 * DEPRECATED: Example usage patterns for the Finance Tracker API
 * This demonstrates how your frontend might structure API calls
 * The actual implementation will be in your frontend GraphQL client
 */

export class FinanceTrackerService {
  /**
   * Example: How your frontend might structure category creation
   */
  async createCategory(input: {
    name: string;
    icon: string;
    type: CategoryType;
    color: string;
    shortName: string;
  }) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  /**
   * Example: How your frontend might structure category retrieval
   */
  async getCategories() {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  /**
   * Example: How your frontend might filter categories by type
   */
  async getCategoriesByType(type: CategoryType) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  /**
   * Example: How your frontend might get a single category
   */
  async getCategory(id: string) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  /**
   * Pre-defined categories for easy setup in your frontend
   */
  getDefaultCategories() {
    return [
      // INCOME Categories
      {
        name: 'Salary',
        icon: '💰',
        type: CategoryType.Income,
        color: '#4CAF50',
        shortName: 'SALARY',
      },
      {
        name: 'Freelance',
        icon: '💻',
        type: CategoryType.Income,
        color: '#2196F3',
        shortName: 'FREELANCE',
      },
      {
        name: 'Investment',
        icon: '📈',
        type: CategoryType.Income,
        color: '#FF9800',
        shortName: 'INVEST',
      },
      {
        name: 'Business',
        icon: '🏢',
        type: CategoryType.Income,
        color: '#9C27B0',
        shortName: 'BUSINESS',
      },
      {
        name: 'Other Income',
        icon: '💸',
        type: CategoryType.Income,
        color: '#607D8B',
        shortName: 'OTHER_IN',
      },

      // EXPENSE Categories
      {
        name: 'Food & Dining',
        icon: '🍽️',
        type: CategoryType.Expense,
        color: '#FF6B6B',
        shortName: 'FOOD',
      },
      {
        name: 'Transportation',
        icon: '🚗',
        type: CategoryType.Expense,
        color: '#4ECDC4',
        shortName: 'TRANSPORT',
      },
      {
        name: 'Shopping',
        icon: '🛍️',
        type: CategoryType.Expense,
        color: '#45B7D1',
        shortName: 'SHOPPING',
      },
      {
        name: 'Entertainment',
        icon: '🎬',
        type: CategoryType.Expense,
        color: '#96CEB4',
        shortName: 'ENTERTAIN',
      },
      {
        name: 'Bills & Utilities',
        icon: '⚡',
        type: CategoryType.Expense,
        color: '#FFEAA7',
        shortName: 'BILLS',
      },
      {
        name: 'Healthcare',
        icon: '🏥',
        type: CategoryType.Expense,
        color: '#DDA0DD',
        shortName: 'HEALTH',
      },
      {
        name: 'Education',
        icon: '📚',
        type: CategoryType.Expense,
        color: '#98D8C8',
        shortName: 'EDUCATION',
      },
      {
        name: 'Travel',
        icon: '✈️',
        type: CategoryType.Expense,
        color: '#F7DC6F',
        shortName: 'TRAVEL',
      },
      {
        name: 'Insurance',
        icon: '🛡️',
        type: CategoryType.Expense,
        color: '#BB8FCE',
        shortName: 'INSURANCE',
      },
      {
        name: 'Other Expenses',
        icon: '💳',
        type: CategoryType.Expense,
        color: '#85929E',
        shortName: 'OTHER_EX',
      },
    ];
  }
}

/**
 * DEPRECATED: Example wallet management
 */
export class WalletService {
  async createWallet(input: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    isDefault?: boolean;
    balance?: number;
  }) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  async getWallets() {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  async getDefaultWallet() {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  async setDefaultWallet(id: string) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  /**
   * Pre-defined wallets for easy setup
   */
  getDefaultWallets() {
    return [
      {
        name: 'Personal Wallet',
        description: 'Primary personal finances',
        icon: '💼',
        color: '#4CAF50',
        isDefault: true,
        balance: 0,
      },
      {
        name: 'Business Wallet',
        description: 'Business expenses and income',
        icon: '🏢',
        color: '#2196F3',
        isDefault: false,
        balance: 0,
      },
      {
        name: 'Emergency Fund',
        description: 'Emergency savings',
        icon: '🚨',
        color: '#FF5722',
        isDefault: false,
        balance: 0,
      },
    ];
  }
}

/**
 * DEPRECATED: Example source management
 */
export class SourceService {
  async createSource(input: {
    name: string;
    type: SourceType;
    balance?: number;
    isActive?: boolean;
    walletId: string;
  }) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  async getSources() {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  async getSourcesByWallet(walletId: string) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  async getActiveSourcesByWallet(walletId: string) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  async toggleSourceActive(id: string) {
    throw new Error('This is reference code. Implement in your frontend using GraphQL client.');
  }

  /**
   * Pre-defined sources for easy setup
   */
  getDefaultSources() {
    return [
      {
        name: 'Primary Checking',
        type: SourceType.Checking,
        balance: 0,
        isActive: true,
      },
      {
        name: 'Savings Account',
        type: SourceType.Savings,
        balance: 0,
        isActive: true,
      },
      {
        name: 'Credit Card',
        type: SourceType.CreditCard,
        balance: 0,
        isActive: true,
      },
      {
        name: 'Cash',
        type: SourceType.Cash,
        balance: 0,
        isActive: true,
      },
      {
        name: 'Investment Account',
        type: SourceType.Investment,
        balance: 0,
        isActive: false,
      },
    ];
  }
}

/**
 * DEPRECATED: Example authentication service
 */
export class AuthService {
  async registerUser(email: string, password: string, name: string) {
    throw new Error('This is reference code. Implement authentication in your frontend.');
  }

  async confirmEmail(email: string, code: string) {
    throw new Error('This is reference code. Implement authentication in your frontend.');
  }

  async signIn(email: string, password: string) {
    throw new Error('This is reference code. Implement authentication in your frontend.');
  }

  async signOut() {
    throw new Error('This is reference code. Implement authentication in your frontend.');
  }

  async getCurrentUser() {
    throw new Error('This is reference code. Implement authentication in your frontend.');
  }
}

// Export the types for use in frontend
export { CategoryType, SourceType };
