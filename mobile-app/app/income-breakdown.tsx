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

export default function IncomeBreakdownPage() {
  const params = useLocalSearchParams();
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  // Get income data
  const incomeTransactions = filterTransactionsByType(mockTransactions, 'income');
  const categoryTotals = getCategoryTotals(incomeTransactions);
  const incomeCategories = preparePieChartData(categoryTotals);
  const totalIncome = calculateTotal(incomeTransactions);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'chart' ? 'list' : 'chart');
  };

  return (
    <CategoryBreakdownScreen
      type="income"
      pieChartData={incomeCategories}
      total={totalIncome}
      viewMode={viewMode}
      onToggleViewMode={toggleViewMode}
      budgets={mockCategoryBudgets}
    />
  );
}
