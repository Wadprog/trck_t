export interface Transaction {
  id: number;
  category: {
    name: string;
    color: string;
    icon: string;
    shortName: string;
  };
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

export interface CategoryBudget {
  id: number;
  category: {
    name: string;
    color: string;
    icon: string;
    shortName: string;
  };
  budgetAmount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  type: 'income' | 'expense';
  startDate: string;
  endDate: string;
  description: string;
}

export const mockTransactions: Transaction[] = [
  // Income transactions
  { 
    id: 1, 
    category: { 
      name: 'Salary', 
      color: '#27AE60', 
      icon: '💰', 
      shortName: 'SAL' 
    }, 
    amount: 4000.00, 
    date: '2025-07-29', 
    description: 'Monthly salary',
    type: 'income'
  },
  { 
    id: 2, 
    category: { 
      name: 'Freelance', 
      color: '#2ECC71', 
      icon: '💻', 
      shortName: 'FRL' 
    }, 
    amount: 500.00, 
    date: '2025-07-25', 
    description: 'Web development project',
    type: 'income'
  },
  { 
    id: 3, 
    category: { 
      name: 'Investment', 
      color: '#16A085', 
      icon: '📈', 
      shortName: 'INV' 
    }, 
    amount: 125.00, 
    date: '2025-07-20', 
    description: 'Dividend payment',
    type: 'income'
  },
  { 
    id: 8, 
    category: { 
      name: 'Side Business', 
      color: '#1ABC9C', 
      icon: '🏪', 
      shortName: 'SBZ' 
    }, 
    amount: 300.00, 
    date: '2025-07-15', 
    description: 'Online store sales',
    type: 'income'
  },
  { 
    id: 13, 
    category: { 
      name: 'Gift', 
      color: '#58D68D', 
      icon: '🎁', 
      shortName: 'GFT' 
    }, 
    amount: 50.00, 
    date: '2025-07-10', 
    description: 'Birthday gift from family',
    type: 'income'
  },

  // Expense transactions
  { 
    id: 4, 
    category: { 
      name: 'Food', 
      color: '#FF6B6B', 
      icon: '🍽️', 
      shortName: 'FOD' 
    }, 
    amount: 35.20, 
    date: '2025-07-27', 
    description: 'Dinner',
    type: 'expense'
  },
  { 
    id: 5, 
    category: { 
      name: 'Entertainment', 
      color: '#96CEB4', 
      icon: '🎬', 
      shortName: 'ENT' 
    }, 
    amount: 15.00, 
    date: '2025-07-26', 
    description: 'Movie ticket',
    type: 'expense'
  },
  {
    id: 6,
    category: {
      name: 'Health',
      color: '#E74C3C',
      icon: '🏥',
      shortName: 'HTH'
    },
    amount: 120.00,
    date: '2025-07-25',
    description: 'Doctor visit',
    type: 'expense'
  },
  {
    id: 7,
    category: {
      name: 'Shopping',
      color: '#45B7D1',
      icon: '🛒',
      shortName: 'SHP'
    },
    amount: 45.99,
    date: '2025-07-24',
    description: 'Groceries',
    type: 'expense'
  },
  {
    id: 9,
    category: {
      name: 'Transportation',
      color: '#4ECDC4',
      icon: '🚗',
      shortName: 'TRN'
    },
    amount: 25.00,
    date: '2025-07-23',
    description: 'Gas for car',
    type: 'expense'
  },
  {
    id: 10,
    category: {
      name: 'Food',
      color: '#FF6B6B',
      icon: '🍽️',
      shortName: 'FOD'
    },
    amount: 22.50,
    date: '2025-07-22',
    description: 'Lunch',
    type: 'expense'
  },
  {
    id: 11,
    category: {
      name: 'Shopping',
      color: '#45B7D1',
      icon: '🛒',
      shortName: 'SHP'
    },
    amount: 89.99,
    date: '2025-07-21',
    description: 'Clothing',
    type: 'expense'
  },
  {
    id: 12,
    category: {
      name: 'Transportation',
      color: '#4ECDC4',
      icon: '🚗',
      shortName: 'TRN'
    },
    amount: 15.00,
    date: '2025-07-20',
    description: 'Bus fare',
    type: 'expense'
  }
];

export const mockCategories = [
  // Expense categories
  { name: 'Food', color: '#FF6B6B', icon: '🍽️', shortName: 'FOD' },
  { name: 'Transportation', color: '#4ECDC4', icon: '🚗', shortName: 'TRN' },
  { name: 'Shopping', color: '#45B7D1', icon: '🛒', shortName: 'SHP' },
  { name: 'Entertainment', color: '#96CEB4', icon: '🎬', shortName: 'ENT' },
  { name: 'Health', color: '#E74C3C', icon: '🏥', shortName: 'HTH' },
  
  // Income categories
  { name: 'Salary', color: '#27AE60', icon: '💰', shortName: 'SAL' },
  { name: 'Freelance', color: '#2ECC71', icon: '💻', shortName: 'FRL' },
  { name: 'Investment', color: '#16A085', icon: '📈', shortName: 'INV' },
  { name: 'Side Business', color: '#1ABC9C', icon: '🏪', shortName: 'SBZ' },
  { name: 'Gift', color: '#58D68D', icon: '🎁', shortName: 'GFT' },
];

// Budget data that matches actual transaction categories
export const mockCategoryBudgets: CategoryBudget[] = [
  // Income Budgets (Expected Income by Category) - Match actual transaction categories
  {
    id: 1,
    category: {
      name: 'Salary',
      color: '#27AE60',
      icon: '💰',
      shortName: 'SAL'
    },
    budgetAmount: 4000.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Expected monthly salary income'
  },
  {
    id: 2,
    category: {
      name: 'Freelance',
      color: '#2ECC71',
      icon: '💻',
      shortName: 'FRL'
    },
    budgetAmount: 600.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Target freelance income per month'
  },
  {
    id: 3,
    category: {
      name: 'Investment',
      color: '#16A085',
      icon: '📈',
      shortName: 'INV'
    },
    budgetAmount: 150.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Expected investment returns'
  },
  {
    id: 4,
    category: {
      name: 'Side Business',
      color: '#1ABC9C',
      icon: '🏪',
      shortName: 'SBZ'
    },
    budgetAmount: 400.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Expected income from side business activities'
  },
  {
    id: 5,
    category: {
      name: 'Gift',
      color: '#58D68D',
      icon: '🎁',
      shortName: 'GFT'
    },
    budgetAmount: 50.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Expected gift income'
  },

  // Expense Budgets (Spending Limits by Category) - Match actual transaction categories
  {
    id: 6,
    category: {
      name: 'Food',
      color: '#FF6B6B',
      icon: '🍽️',
      shortName: 'FOD'
    },
    budgetAmount: 400.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Monthly food and dining budget'
  },
  {
    id: 7,
    category: {
      name: 'Transportation',
      color: '#4ECDC4',
      icon: '🚗',
      shortName: 'TRN'
    },
    budgetAmount: 150.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Gas, public transport, and parking'
  },
  {
    id: 8,
    category: {
      name: 'Shopping',
      color: '#45B7D1',
      icon: '🛒',
      shortName: 'SHP'
    },
    budgetAmount: 200.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Clothing, household items, and miscellaneous'
  },
  {
    id: 9,
    category: {
      name: 'Entertainment',
      color: '#96CEB4',
      icon: '🎬',
      shortName: 'ENT'
    },
    budgetAmount: 100.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Movies, subscriptions, and leisure activities'
  },
  {
    id: 10,
    category: {
      name: 'Health',
      color: '#E74C3C',
      icon: '🏥',
      shortName: 'HTH'
    },
    budgetAmount: 250.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Medical expenses and health insurance'
  }
];
