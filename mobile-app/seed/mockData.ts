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
