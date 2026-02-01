import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@/components/Themed';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import BudgetComparisonTable from '@/components/BudgetComparisonTable';
import { mockTransactions, mockCategoryBudgets } from '@/seed/mockData';
import { 
  filterTransactionsByType, 
  calculateTotal, 
  getCategoryTotals, 
  preparePieChartData,
  formatCurrency 
} from '@/utils/expenseUtils';

export default function BudgetsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const { t } = useTranslation();

  // Get current period budgets
  const currentBudgets = mockCategoryBudgets.filter(budget => budget.period === selectedPeriod);
  
  // Calculate totals for current period
  const expenseTransactions = filterTransactionsByType(mockTransactions, 'expense');
  const incomeTransactions = filterTransactionsByType(mockTransactions, 'income');
  
  const expenseCategoryTotals = getCategoryTotals(expenseTransactions);
  const incomeCategoryTotals = getCategoryTotals(incomeTransactions);
  
  const expenseCategories = preparePieChartData(expenseCategoryTotals);
  const incomeCategories = preparePieChartData(incomeCategoryTotals);
  
  const totalBudgetedIncome = currentBudgets
    .filter(b => b.type === 'income')
    .reduce((sum, b) => sum + b.budgetAmount, 0);
    
  const totalBudgetedExpenses = currentBudgets
    .filter(b => b.type === 'expense')
    .reduce((sum, b) => sum + b.budgetAmount, 0);
    
  const totalActualIncome = calculateTotal(incomeTransactions);
  const totalActualExpenses = calculateTotal(expenseTransactions);

  // Create budget comparison data
  const expenseBudgetComparison = expenseCategories.map(item => {
    const budget = currentBudgets.find(b => b.category.name === item.name && b.type === 'expense');
    return {
      ...item,
      budgetAmount: budget?.budgetAmount || 0,
      period: budget?.period || selectedPeriod,
    };
  });

  const incomeBudgetComparison = incomeCategories.map(item => {
    const budget = currentBudgets.find(b => b.category.name === item.name && b.type === 'income');
    return {
      ...item,
      budgetAmount: budget?.budgetAmount || 0,
      period: budget?.period || selectedPeriod,
    };
  });

  const periods = [
    { key: 'weekly', label: t('budgets.weekly') },
    { key: 'monthly', label: t('budgets.monthly') },
    { key: 'quarterly', label: t('budgets.quarterly') },
    { key: 'yearly', label: t('budgets.yearly') },
  ] as const;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-800 mb-6">{t('budgets.title')}</Text>

        {/* Period Selector */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">{t('budgets.budgetPeriod')}</Text>
          <View className="flex-row bg-white rounded-xl p-2 shadow-sm">
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                className={`flex-1 py-3 px-4 rounded-lg ${
                  selectedPeriod === period.key ? 'bg-blue-500' : 'bg-transparent'
                }`}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text
                  className={`text-center font-medium ${
                    selectedPeriod === period.key ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget Summary Cards */}
        <View className="flex-row gap-4 mb-6">
          {/* Income Budget Summary */}
          <View className="flex-1 bg-green-50 rounded-xl p-4 shadow-sm">
            <Text className="text-sm font-medium text-green-700 mb-1">{t('budgets.budgetedIncome')}</Text>
            <Text className="text-xl font-bold text-green-600 mb-2">
              {formatCurrency(totalBudgetedIncome)}
            </Text>
            <Text className="text-xs text-green-600">
              {t('budgets.actual')}: {formatCurrency(totalActualIncome)}
            </Text>
            <Text className="text-xs text-green-600">
              {totalBudgetedIncome > 0 
                ? `${((totalActualIncome / totalBudgetedIncome) * 100).toFixed(0)}% ${t('budgets.ofTarget')}`
                : t('budgets.noBudgetSet')
              }
            </Text>
          </View>

          {/* Expense Budget Summary */}
          <View className="flex-1 bg-red-50 rounded-xl p-4 shadow-sm">
            <Text className="text-sm font-medium text-red-700 mb-1">{t('budgets.budgetedExpenses')}</Text>
            <Text className="text-xl font-bold text-red-600 mb-2">
              {formatCurrency(totalBudgetedExpenses)}
            </Text>
            <Text className="text-xs text-red-600">
              {t('budgets.actual')}: {formatCurrency(totalActualExpenses)}
            </Text>
            <Text className="text-xs text-red-600">
              {totalBudgetedExpenses > 0 
                ? `${((totalActualExpenses / totalBudgetedExpenses) * 100).toFixed(0)}% ${t('budgets.used')}`
                : t('budgets.noBudgetSet')
              }
            </Text>
          </View>
        </View>

        {/* Income Budget Breakdown */}
        {incomeBudgetComparison.length > 0 && (
          <View className="mb-6">
            <BudgetComparisonTable 
              data={incomeBudgetComparison}
              isIncome={true}
              colorClass="text-green-600"
            />
          </View>
        )}

        {/* Expense Budget Breakdown */}
        {expenseBudgetComparison.length > 0 && (
          <View className="mb-6">
            <BudgetComparisonTable 
              data={expenseBudgetComparison}
              isIncome={false}
              colorClass="text-red-600"
            />
          </View>
        )}

        {/* Action Buttons */}
        <View className="mt-4 gap-3">
          <TouchableOpacity 
            className="bg-blue-500 rounded-xl p-4 shadow-sm"
            onPress={() => {
              // TODO: Navigate to create/edit budget screen
              console.log('Create new budget');
            }}
          >
            <Text className="text-white text-center font-semibold text-lg">{t('budgets.createNewBudget')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200"
            onPress={() => {
              // TODO: Navigate to budget analytics screen
              console.log('View budget analytics');
            }}
          >
            <Text className="text-gray-700 text-center font-semibold text-lg">{t('budgets.budgetAnalytics')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
