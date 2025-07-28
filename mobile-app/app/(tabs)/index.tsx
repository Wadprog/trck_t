import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, FlatList, View } from 'react-native';
import { Text } from '@/components/Themed';
import Transaction from '@/components/Transaction';
import CategoryBreakdownModal from '@/components/CategoryBreakdownModal';
import DateRangePicker from '@/components/DateRangePicker';
import { useTransactionData } from '@/hooks/useTransactionData';
import { formatCurrency } from '@/utils/expenseUtils';
import { Transaction as TransactionType } from '@/seed/mockData';

export default function TabOneScreen() {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState<'income' | 'expense'>('expense');
  const [categoryViewMode, setCategoryViewMode] = useState<'chart' | 'list'>('chart');
  
  const transactionData = useTransactionData();
  const {
    transactions,
    pieChartData,
    totalExpenses,
    totalIncome,
    netBalance,
    filterType,
    setFilterType,
    dateRangeText,
    setTodayRange,
    setLastWeekRange,
    setLastMonthRange,
    setDateRange,
    startDate,
    endDate,
  } = transactionData;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const openCategoryModal = (type: 'income' | 'expense') => {
    setCategoryModalType(type);
    setCategoryModalVisible(true);
  };

  const toggleCategoryViewMode = () => {
    setCategoryViewMode(categoryViewMode === 'chart' ? 'list' : 'chart');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Fixed Header and Chart Section */}
      <ScrollView className="max-h-[60%]" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white rounded-xl mx-4 mt-4 shadow-sm p-5 pt-16">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Financial Tracker</Text>
          <Text className="text-base text-gray-600 mb-4">{currentDate}</Text>
          
          {/* Summary Cards */}
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity 
              className="flex-1 bg-green-50 rounded-lg p-3 mr-2"
              onPress={() => openCategoryModal('income')}
            >
              <Text className="text-sm font-medium text-green-700">Total Income</Text>
              <Text className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</Text>
              <Text className="text-xs text-green-600 mt-1">Tap for details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-red-50 rounded-lg p-3 mx-1"
              onPress={() => openCategoryModal('expense')}
            >
              <Text className="text-sm font-medium text-red-700">Total Expenses</Text>
              <Text className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</Text>
              <Text className="text-xs text-red-600 mt-1">Tap for details</Text>
            </TouchableOpacity>
            <View className="flex-1 bg-blue-50 rounded-lg p-3 ml-2">
              <Text className="text-sm font-medium text-blue-700">Net Balance</Text>
              <Text className={`text-lg font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(netBalance))}
              </Text>
            </View>
          </View>

          {/* Filter Buttons */}
          <View className="flex-row justify-center mb-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-l-lg border ${filterType === 'all' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
              onPress={() => setFilterType('all')}
            >
              <Text className={`text-sm font-medium ${filterType === 'all' ? 'text-white' : 'text-gray-700'}`}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 border-t border-b ${filterType === 'income' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}
              onPress={() => setFilterType('income')}
            >
              <Text className={`text-sm font-medium ${filterType === 'income' ? 'text-white' : 'text-gray-700'}`}>
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-r-lg border ${filterType === 'expense' ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'}`}
              onPress={() => setFilterType('expense')}
            >
              <Text className={`text-sm font-medium ${filterType === 'expense' ? 'text-white' : 'text-gray-700'}`}>
                Expenses
              </Text>
            </TouchableOpacity>
          </View>
          
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
      </ScrollView>

      {/* Transactions List - Now with guaranteed visibility */}
      <View className="flex-1 bg-white mx-4 mb-4 rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center p-5 pb-3">
          <Text className="text-xl font-semibold text-gray-800">
            Recent {filterType === 'all' ? 'Transactions' : 
                     filterType === 'income' ? 'Income' : 
                     'Expenses'}
          </Text>
          {filterType !== 'all' && (
            <TouchableOpacity 
              onPress={() => openCategoryModal(filterType)}
              className="bg-gray-100 px-3 py-2 rounded-full"
            >
              <Text className="text-sm font-medium text-green-700">See by category</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Transaction
              transaction={item}
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
          transaction={selectedTransaction}
          mode="detail"
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Category Breakdown Modal */}
      <CategoryBreakdownModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        type={categoryModalType}
        pieChartData={pieChartData}
        total={categoryModalType === 'income' ? totalIncome : totalExpenses}
        viewMode={categoryViewMode}
        onToggleViewMode={toggleCategoryViewMode}
      />
    </View>
  );
}


