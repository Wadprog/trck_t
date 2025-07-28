import React from 'react';
import { Modal, View, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@/components/Themed';
import Icon from '@expo/vector-icons/Ionicons';
import SimplePieChart from '@/components/SimplePieChart';
import { formatCurrency } from '@/utils/expenseUtils';

interface CategoryBreakdownModalProps {
  visible: boolean;
  onClose: () => void;
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
}

const CategoryBreakdownModal = ({
  visible,
  onClose,
  type,
  pieChartData,
  total,
  viewMode,
  onToggleViewMode,
}: CategoryBreakdownModalProps) => {
  const isIncome = type === 'income';
  const title = isIncome ? 'Income by Category' : 'Expenses by Category';
  const totalLabel = isIncome ? 'Total Income' : 'Total Expenses';
  const colorClass = isIncome ? 'text-green-600' : 'text-red-600';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-16 pb-5 bg-white border-b border-gray-200">
          <TouchableOpacity 
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            onPress={onClose}
          >
            <Icon name="close-outline" size={20} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          <TouchableOpacity 
            className="bg-gray-100 px-3 py-2 rounded-full border border-gray-200"
            onPress={onToggleViewMode}
          >
            <Text className="text-sm font-medium text-gray-700">
              {viewMode === 'chart' ? '📊 List' : '📈 Chart'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 p-5">
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
          <View className="bg-white rounded-xl p-4 flex-1 shadow-sm">
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
        </View>
      </View>
    </Modal>
  );
};

export default CategoryBreakdownModal;
