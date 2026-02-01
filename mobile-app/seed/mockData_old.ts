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
  description?: string;
}

export const mockTransactions: Transaction[] = [
  // Expenses
  { 
    id: 1, 
    category: { 
      name: 'Food', 
      color: '#FF6B6B', 
      icon: '🍽️', 
      shortName: 'FOD' 
    }, 
    amount: 25.50, 
    date: '2025-07-28', 
    description: 'Lunch at cafe',
    type: 'expense'
  },
  { 
    id: 2, 
    category: { 
      name: 'Transportation', 
      color: '#4ECDC4', 
      icon: '🚗', 
      shortName: 'TRN' 
    }, 
    amount: 12.00, 
    date: '2025-07-28', 
    description: 'Bus ticket',
    type: 'expense'
  },
  { 
    id: 3, 
    category: { 
      name: 'Shopping', 
      color: '#45B7D1', 
      icon: '🛒', 
      shortName: 'SHP' 
    }, 
    amount: 89.99, 
    date: '2025-07-27', 
    description: 'Groceries',
    type: 'expense'
  },
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
    description: 'Clothing',
    type: 'expense'
  },
  {
    id: 8,
    category: {
      name: 'Transportation',
      color: '#4ECDC4',
      icon: '🚗',
      shortName: 'TRN'
    },
    amount: 8.50,
    date: '2025-07-24',
    description: 'Parking fee',
    type: 'expense'
  },
  // Incomes
  {
    id: 9,
    category: {
      name: 'Salary',
      color: '#27AE60',
      icon: '💼',
      shortName: 'SAL'
    },
    amount: 3500.00,
    date: '2025-07-25',
    description: 'Monthly salary',
    type: 'income'
  },
  {
    id: 10,
    category: {
      name: 'Freelance',
      color: '#2ECC71',
      icon: '💻',
      shortName: 'FRL'
    },
    amount: 450.00,
    date: '2025-07-23',
    description: 'Web development project',
    type: 'income'
  },
  {
    id: 11,
    category: {
      name: 'Investment',
      color: '#16A085',
      icon: '📈',
      shortName: 'INV'
    },
    amount: 125.50,
    date: '2025-07-22',
    description: 'Stock dividend',
    type: 'income'
  },
  {
    id: 12,
    category: {
      name: 'Side Business',
      color: '#1ABC9C',
      icon: '🏪',
      shortName: 'SBZ'
    },
    amount: 280.00,
    date: '2025-07-21',
    description: 'Online store sales',
    type: 'income'
  },
  {
    id: 13,
    category: {
      name: 'Gift',
      color: '#58D68D',
      shortName: 'GFT',
      icon: '🎁'
    },
    amount: 100.00,
    date: '2025-07-20',
    description: 'Birthday gift money',
    type: 'income'
  }
];

// Legacy export for backward compatibility
export const mockExpenses = mockTransactions.filter(t => t.type === 'expense');
export type Expense = Transaction;

export const expenseCategories = [
  { name: 'Food', color: '#FF6B6B', icon: '🍽️', shortName: 'FOD', type: 'expense' },
  { name: 'Transportation', color: '#4ECDC4', icon: '🚗', shortName: 'TRN', type: 'expense' },
  { name: 'Shopping', color: '#45B7D1', icon: '🛒', shortName: 'SHP', type: 'expense' },
  { name: 'Entertainment', color: '#96CEB4', icon: '🎬', shortName: 'ENT', type: 'expense' },
  { name: 'Health', color: '#E74C3C', icon: '🏥', shortName: 'HTH', type: 'expense' },
  { name: 'Bills', color: '#F39C12', icon: '📄', shortName: 'BLL', type: 'expense' },
  { name: 'Education', color: '#9B59B6', icon: '📚', shortName: 'EDU', type: 'expense' },
  { name: 'Travel', color: '#1ABC9C', icon: '✈️', shortName: 'TRV', type: 'expense' },
];

export const incomeCategories = [
  { name: 'Salary', color: '#27AE60', icon: '💼', shortName: 'SAL', type: 'income' },
  { name: 'Freelance', color: '#2ECC71', icon: '💻', shortName: 'FRL', type: 'income' },
  { name: 'Investment', color: '#16A085', icon: '📈', shortName: 'INV', type: 'income' },
  { name: 'Side Business', color: '#1ABC9C', icon: '🏪', shortName: 'SBZ', type: 'income' },
  { name: 'Gift', color: '#58D68D', icon: '🎁', shortName: 'GFT', type: 'income' },
  { name: 'Rental', color: '#52C41A', icon: '🏠', shortName: 'RNT', type: 'income' },
  { name: 'Bonus', color: '#73D13D', icon: '🎯', shortName: 'BNS', type: 'income' },
  { name: 'Other', color: '#95DE64', icon: '💰', shortName: 'OTH', type: 'income' },
];

export const allCategories = [...expenseCategories, ...incomeCategories];

export const mockCategoryBudgets: CategoryBudget[] = [
  // Income Budgets (Expected Income by Category)
  {
    id: 1,
    category: {
      name: 'Salary',
      color: '#27AE60',
      icon: '💼',
      shortName: 'SAL'
    },
    budgetAmount: 5000.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Expected monthly salary income'
  },
  {
    id: 2,
    category: {
      name: 'Freelance',
      color: '#2ECC71',
      icon: '�',
      shortName: 'FRL'
    },
    budgetAmount: 800.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Target freelance income per month'
  },
  {
    id: 3,
    category: {
      name: 'Investment',
      color: '#16A085',
      icon: '�',
      shortName: 'INV'
    },
    budgetAmount: 200.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Expected investment returns'
  },

  // Expense Budgets (Spending Limits by Category)
  {
    id: 4,
    category: {
      name: 'Food',
      color: '#FF6B6B',
      icon: '🍽️',
      shortName: 'FOD'
    },
    budgetAmount: 600.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Monthly food and dining budget'
  },
  {
    id: 5,
    category: {
      name: 'Transportation',
      color: '#4ECDC4',
      icon: '🚗',
      shortName: 'TRN'
    },
    budgetAmount: 200.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Gas, public transport, and parking'
  },
  {
    id: 6,
    category: {
      name: 'Shopping',
      color: '#45B7D1',
      icon: '�',
      shortName: 'SHP'
    },
    budgetAmount: 300.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Clothing, household items, and miscellaneous'
  },
  {
    id: 7,
    category: {
      name: 'Entertainment',
      color: '#96CEB4',
      icon: '�',
      shortName: 'ENT'
    },
    budgetAmount: 150.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Movies, subscriptions, and leisure activities'
  },
  {
    id: 8,
    category: {
      name: 'Health',
      color: '#E74C3C',
      icon: '�',
      shortName: 'HTH'
    },
    budgetAmount: 200.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Medical expenses and health insurance'
  },
  {
    id: 9,
    category: {
      name: 'Bills',
      color: '#F39C12',
      icon: '📄',
      shortName: 'BLL'
    },
    budgetAmount: 1800.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Rent, utilities, insurance, and subscriptions'
  },
  {
    id: 10,
    category: {
      name: 'Travel',
      color: '#1ABC9C',
      icon: '✈️',
      shortName: 'TRV'
    },
    budgetAmount: 500.00,
    period: 'quarterly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Vacation and travel expenses'
  },
  {
    id: 11,
    category: {
      name: 'Education',
      color: '#9B59B6',
      icon: '📚',
      shortName: 'EDU'
    },
    budgetAmount: 100.00,
    period: 'monthly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Online courses, books, and learning materials'
  },
  {
    id: 12,
    category: {
      name: 'Side Business',
      color: '#1ABC9C',
      icon: '🏪',
      shortName: 'SBZ'
    },
    budgetAmount: 300.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Expected income from side business activities'
  },
  {
    id: 13,
    category: {
      name: 'Bonus',
      color: '#73D13D',
      icon: '🎯',
      shortName: 'BNS'
    },
    budgetAmount: 1000.00,
    period: 'quarterly',
    type: 'income',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Quarterly performance bonus target'
  },
  {
    id: 14,
    category: {
      name: 'Rental',
      color: '#52C41A',
      icon: '🏠',
      shortName: 'RNT'
    },
    budgetAmount: 1200.00,
    period: 'monthly',
    type: 'income',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Rental income from investment property'
  },
  {
    id: 15,
    category: {
      name: 'Gift',
      color: '#58D68D',
      icon: '🎁',
      shortName: 'GFT'
    },
    budgetAmount: 200.00,
    period: 'yearly',
    type: 'expense',
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    description: 'Birthday and holiday gifts for family and friends'
  }
];
