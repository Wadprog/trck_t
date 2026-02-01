import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import CategoryBreakdownScreen from '@/components/CategoryBreakdownScreen';
import { mockTransactions, mockCategoryBudgets } from '@/seed/mockData';
import { 
  filterTransactionsByType, 
  calculateTotal, 
  getCategoryTotals, 
  preparePieChartData 
} from '@/utils/expenseUtils';

export default function ExpenseBreakdownPage() {
  const params = useLocalSearchParams();
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  // Get expense data
  const expenseTransactions = filterTransactionsByType(mockTransactions, 'expense');
  const categoryTotals = getCategoryTotals(expenseTransactions);
  const expenseCategories = preparePieChartData(categoryTotals);
  const totalExpenses = calculateTotal(expenseTransactions);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'chart' ? 'list' : 'chart');
  };

  return (
    <CategoryBreakdownScreen
      type="expense"
      pieChartData={expenseCategories}
      total={totalExpenses}
      viewMode={viewMode}
      onToggleViewMode={toggleViewMode}
      budgets={mockCategoryBudgets}
    />
  );
}
