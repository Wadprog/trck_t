import React from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack } from 'expo-router';
import SimplePieChart from '@/components/SimplePieChart';
import BudgetComparisonTable from '@/components/BudgetComparisonTable';
import { formatCurrency } from '@/utils/expenseUtils';
import { CategoryBudget } from '@/seed/mockData';

interface CategoryBreakdownScreenProps {
  type: 'income' | 'expense';
  pieChartData: Array<{
    name: string;
    amount: number;
    icon: string;
    color: string;
    shortName: string;
  }>;
  total: number;
  viewMode: 'chart' | 'list';
  onToggleViewMode: () => void;
  budgets?: CategoryBudget[];
}

const CategoryBreakdownScreen = ({
  type,
  pieChartData,
  total,
  viewMode,
  onToggleViewMode,
  budgets = [],
}: CategoryBreakdownScreenProps) => {
  const isIncome = type === 'income';
  const title = isIncome ? 'Income by Category' : 'Expenses by Category';
  const totalLabel = isIncome ? 'Total Income' : 'Total Expenses';
  const colorClass = isIncome ? 'text-green-600' : 'text-red-600';

  // Create budget comparison data
  const budgetComparison = pieChartData.map(item => {
    const budget = budgets.find(b => b.category.name === item.name && b.type === type);
    return {
      ...item,
      budgetAmount: budget?.budgetAmount || 0,
      period: budget?.period || 'monthly',
    };
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <View className="bg-gray-100 px-3 py-2 rounded-full border border-gray-200 mr-4">
              <Text 
                className="text-sm font-medium text-gray-700"
                onPress={onToggleViewMode}
              >
                {viewMode === 'chart' ? '📊 List' : '📈 Chart'}
              </Text>
            </View>
          ),
        }} 
      />
      
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-5">
          {/* Summary Card */}
          <View className={`rounded-xl p-4 mb-4 shadow-sm ${isIncome ? 'bg-green-50' : 'bg-red-50'}`}>
            <Text className={`text-sm font-medium ${isIncome ? 'text-green-700' : 'text-red-700'}`}>
              {totalLabel}
            </Text>
            <Text className={`text-2xl font-bold ${colorClass}`}>
              {formatCurrency(total)}
            </Text>
          </View>

          {/* Chart or List View */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            {viewMode === 'chart' ? (
              <SimplePieChart data={pieChartData} />
            ) : (
              <FlatList
                data={pieChartData}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                  const percentage = ((item.amount / total) * 100);
                  return (
                    <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                      <View className="flex-row items-center flex-1">
                        <Text className="text-lg mr-3 w-6 text-center">{item.icon}</Text>
                        <Text className="text-base font-medium text-gray-800">{item.name}</Text>
                      </View>
                      <View className="items-end">
                        <Text className={`text-base font-semibold ${colorClass}`}>
                          {formatCurrency(item.amount)}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</Text>
                      </View>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListFooterComponent={() => (
                  <View className="flex-row justify-between items-center pt-4 mt-3 border-t-2 border-gray-200">
                    <Text className="text-lg font-bold text-gray-800">{totalLabel}</Text>
                    <Text className={`text-lg font-bold ${colorClass}`}>
                      {formatCurrency(total)}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>

          {/* Budget Comparison Table */}
          <BudgetComparisonTable 
            data={budgetComparison}
            isIncome={isIncome}
            colorClass={colorClass}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default CategoryBreakdownScreen;
