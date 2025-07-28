import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, FlatList, View } from 'react-native';
import { Text } from '@/components/Themed';
import Transaction from '@/components/Transaction';
import SimplePieChart from '@/components/SimplePieChart';
import DateRangePicker from '@/components/DateRangePicker';
import { useExpenseData } from '@/hooks/useExpenseData';
import { formatCurrency } from '@/utils/expenseUtils';
import { Expense } from '@/seed/mockData';

export default function TabOneScreen() {
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);
  
  const expenseData = useExpenseData();
  const {
    expenses,
    pieChartData,
    totalExpenses,
    dateRangeText,
    setTodayRange,
    setLastWeekRange,
    setLastMonthRange,
    setDateRange,
    startDate,
    endDate,
  } = expenseData;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'list' : 'chart');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Fixed Header and Chart Section */}
      <ScrollView className="max-h-[60%]" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white rounded-xl mx-4 mt-4 shadow-sm p-5 pt-16">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Expenses Tracker</Text>
          <Text className="text-base text-gray-600 mb-4">{currentDate}</Text>
          
          {/* Date Range Selector */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={setDateRange}
            onTodayPress={setTodayRange}
            onLastWeekPress={setLastWeekRange}
            onLastMonthPress={setLastMonthRange}
            dateRangeText={dateRangeText}
          />
        </View>

        {/* Chart Section */}
        <View className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-800">Expenses by Category</Text>
            <TouchableOpacity 
              className="bg-gray-100 px-3 py-2 rounded-full border border-gray-200"
              onPress={toggleViewMode}
            >
              <Text className="text-sm font-medium text-gray-700">
                {viewMode === 'chart' ? '📊 List' : '📈 Chart'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Conditional rendering based on view mode */}
          {viewMode === 'chart' ? (
            <SimplePieChart data={pieChartData} />
          ) : (
            <View className="mt-1">
              {pieChartData.map((item) => {
                const percentage = ((item.amount / totalExpenses) * 100);
                return (
                  <View key={item.name} className="flex-row justify-between items-center py-2 border-b border-gray-100">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-base mr-3 w-5 text-center">{item.icon}</Text>
                      <Text className="text-base font-medium text-gray-800">{item.name}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-base font-semibold text-red-600">{formatCurrency(item.amount)}</Text>
                      <Text className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                );
              })}
              <View className="flex-row justify-between items-center pt-3 mt-2 border-t-2 border-gray-200">
                <Text className="text-lg font-bold text-gray-800">Total Expenses</Text>
                <Text className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Transactions List - Now with guaranteed visibility */}
      <View className="flex-1 bg-white mx-4 mb-4 rounded-xl shadow-sm">
        <Text className="text-xl font-semibold text-gray-800 p-5 pb-3">Recent Transactions</Text>
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Transaction
              expense={item}
              mode="list"
              onPress={() => setSelectedTransaction(item)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        />
      </View>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <Transaction
          expense={selectedTransaction}
          mode="detail"
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </View>
  );
}


