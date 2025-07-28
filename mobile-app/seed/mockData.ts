export interface Expense {
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
}

export const mockExpenses: Expense[] = [
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
    description: 'Lunch at cafe' 
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
    description: 'Bus ticket' 
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
    description: 'Groceries' 
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
    description: 'Dinner' 
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
    description: 'Movie ticket' 
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
    description: 'Doctor visit'
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
    description: 'Clothing'
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
    description: 'Parking fee'
  }
];

export const mockCategories = [
  { name: 'Food', color: '#FF6B6B', icon: '🍽️', shortName: 'FOD' },
  { name: 'Transportation', color: '#4ECDC4', icon: '🚗', shortName: 'TRN' },
  { name: 'Shopping', color: '#45B7D1', icon: '🛒', shortName: 'SHP' },
  { name: 'Entertainment', color: '#96CEB4', icon: '🎬', shortName: 'ENT' },
  { name: 'Health', color: '#E74C3C', icon: '🏥', shortName: 'HTH' },
  { name: 'Bills', color: '#F39C12', icon: '📄', shortName: 'BLL' },
  { name: 'Education', color: '#9B59B6', icon: '📚', shortName: 'EDU' },
  { name: 'Travel', color: '#1ABC9C', icon: '✈️', shortName: 'TRV' },
];
