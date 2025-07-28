import { Transaction } from '../seed/mockData';

export interface CategoryTotal {
  amount: number;
  category: {
    name: string;
    color: string;
    icon: string;
    shortName: string;
  };
  type: 'income' | 'expense';
}

export interface PieChartData {
  name: string;
  amount: number;
  color: string;
  icon: string;
  shortName: string;
  type: 'income' | 'expense';
}

// Calculate category totals for the chart
export const getCategoryTotals = (transactions: Transaction[]): { [key: string]: CategoryTotal } => {
  const totals: { [key: string]: CategoryTotal } = {};
  transactions.forEach(transaction => {
    const categoryName = transaction.category.name;
    if (!totals[categoryName]) {
      totals[categoryName] = { amount: 0, category: transaction.category, type: transaction.type };
    }
    totals[categoryName].amount += transaction.amount;
  });
  return totals;
};

// Prepare data for pie chart
export const preparePieChartData = (categoryTotals: { [key: string]: CategoryTotal }): PieChartData[] => {
  return Object.entries(categoryTotals).map(([name, data]) => ({
    name: data.category.name,
    amount: data.amount,
    color: data.category.color,
    icon: data.category.icon,
    shortName: data.category.shortName,
    type: data.type,
  }));
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (transactions: Transaction[], startDate: Date, endDate: Date): Transaction[] => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Filter transactions by type
export const filterTransactionsByType = (transactions: Transaction[], type: 'income' | 'expense'): Transaction[] => {
  return transactions.filter(transaction => transaction.type === type);
};

// Calculate total for transactions
export const calculateTotal = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return calculateTotal(filterTransactionsByType(transactions, 'expense'));
};

// Calculate total income
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return calculateTotal(filterTransactionsByType(transactions, 'income'));
};

// Calculate net balance (income - expenses)
export const calculateNetBalance = (transactions: Transaction[]): number => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  return totalIncome - totalExpenses;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Format date range
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} - ${endStr}`;
};

// Legacy exports for backward compatibility
export const filterExpensesByDateRange = filterTransactionsByDateRange;
