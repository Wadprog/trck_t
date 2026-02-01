import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, FlatList, View } from 'react-native';
import { Text } from '@/components/Themed';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';
import Transaction from '@/components/Transaction';
import DateRangePicker from '@/components/DateRangePicker';
import { useTransactionData } from '@/hooks/useTransactionData';
import { formatCurrency } from '@/utils/expenseUtils';
import { Transaction as TransactionType } from '@/seed/mockData';

export default function TabOneScreen() {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const { t } = useTranslation();
  
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

  const navigateToCategoryBreakdown = (type: 'income' | 'expense') => {
    if (type === 'income') {
      router.push('/income-breakdown');
    } else {
      router.push('/expense-breakdown');
    }
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
              onPress={() => navigateToCategoryBreakdown('income')}
            >
              <Text className="text-sm font-medium text-green-700">{t('transactions.totalIncome')}</Text>
              <Text className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</Text>
              <Text className="text-xs text-green-600 mt-1">Tap for details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-red-50 rounded-lg p-3 mx-1"
              onPress={() => navigateToCategoryBreakdown('expense')}
            >
              <Text className="text-sm font-medium text-red-700">{t('transactions.totalExpenses')}</Text>
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
              onPress={() => navigateToCategoryBreakdown(filterType)}
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

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg items-center justify-center"
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
        onPress={() => router.push('/create-transaction')}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}


