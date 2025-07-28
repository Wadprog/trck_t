import { Expense } from '../seed/mockData';

export interface CategoryTotal {
  amount: number;
  category: {
    name: string;
    color: string;
    icon: string;
    shortName: string;
  };
}

export interface PieChartData {
  name: string;
  amount: number;
  color: string;
  icon: string;
  shortName: string;
}

// Calculate category totals for the chart
export const getCategoryTotals = (expenses: Expense[]): { [key: string]: CategoryTotal } => {
  const totals: { [key: string]: CategoryTotal } = {};
  expenses.forEach(expense => {
    const categoryName = expense.category.name;
    if (!totals[categoryName]) {
      totals[categoryName] = { amount: 0, category: expense.category };
    }
    totals[categoryName].amount += expense.amount;
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
  }));
};

// Filter expenses by date range
export const filterExpensesByDateRange = (expenses: Expense[], startDate: Date, endDate: Date): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

// Calculate total expenses
export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
