import React from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '@/components/Themed';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/expenseUtils';
import { CategoryBudget } from '@/seed/mockData';

interface BudgetComparisonData {
  name: string;
  amount: number;
  icon: string;
  color: string;
  shortName: string;
  budgetAmount: number;
  period: string;
}

interface BudgetComparisonTableProps {
  data: BudgetComparisonData[];
  isIncome: boolean;
  colorClass: string;
}

const BudgetComparisonTable = ({ data, isIncome, colorClass }: BudgetComparisonTableProps) => {
  const { t } = useTranslation();
  
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        {t('budgets.budgetVsActual', { type: isIncome ? t('budgets.actualIncome') : t('budgets.actualSpending') })}
      </Text>
      
      {/* Table Header */}
      <View className="flex-row justify-between items-center py-3 border-b-2 border-gray-200">
        <Text className="text-sm font-semibold text-gray-600 flex-1">{t('budgets.category')}</Text>
        <Text className="text-sm font-semibold text-gray-600 w-20 text-right">
          {isIncome ? t('budgets.earned') : t('budgets.spent')}
        </Text>
        <Text className="text-sm font-semibold text-gray-600 w-20 text-right">{t('budgets.budget')}</Text>
        <Text className="text-sm font-semibold text-gray-600 w-16 text-right">{t('budgets.status')}</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          const budgetAmount = item.budgetAmount;
          const actualAmount = item.amount;
          const percentage = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;
          // For expenses: green if actual <= budget, red if over budget
          // For income: green if actual >= budget, red if under budget
          const isWithinBudget = isIncome ? actualAmount >= budgetAmount : actualAmount <= budgetAmount;
          const statusColor = isWithinBudget ? 'text-green-500' : 'text-red-500';
          
          return (
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View className="flex-1 flex-row items-center">
                <Text className="text-base mr-2">{item.icon}</Text>
                <Text className="text-sm font-medium text-gray-800">{item.name}</Text>
              </View>
              <Text className={`text-sm font-semibold w-20 text-right ${colorClass}`}>
                {formatCurrency(actualAmount)}
              </Text>
              <Text className="text-sm text-gray-600 w-20 text-right">
                {budgetAmount > 0 ? formatCurrency(budgetAmount) : 'N/A'}
              </Text>
              <View className="w-16 items-end">
                {budgetAmount > 0 ? (
                  <Text className={`text-xs font-semibold ${statusColor}`}>
                    {percentage.toFixed(0)}%
                  </Text>
                ) : (
                  <Text className="text-xs text-gray-400">-</Text>
                )}
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BudgetComparisonTable;
