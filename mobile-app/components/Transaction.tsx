
import React from 'react';
import { TouchableOpacity, View, Modal, Text } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

interface TransactionProps {
  transaction: {
    id: number;
    category: {
      name: string;
      color: string;
      icon: string;
      shortName: string;
    };
    amount: number;
    date: string;
    description: string;
    type: 'income' | 'expense';
  };
  mode: 'list' | 'detail';
  onPress?: () => void;
  onClose?: () => void;
}

const Transaction = ({ transaction, mode, onPress, onClose }: TransactionProps) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isIncome ? '+' : '-';
  const typeLabel = isIncome ? 'Income' : 'Expense';
  const typeIcon = isIncome ? '💰' : '💸';
  
  if (mode === 'list') {
    return (
      <TouchableOpacity 
        className="flex-row justify-between items-center py-4"
        onPress={onPress}
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View 
              className={`w-2 h-2 rounded-full mr-3 ${isIncome ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <Text className="text-base font-medium text-gray-800">{transaction.description}</Text>
          </View>
          <Text className="text-sm text-gray-600">
            {transaction.category.icon} {transaction.category.name}
          </Text>
        </View>
        <View className="items-end">
          <Text className={`text-base font-semibold ${amountColor}`}>
            {amountPrefix}${transaction.amount.toFixed(2)}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">{transaction.date}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Detail mode - full page view
  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-16 pb-5 bg-white border-b border-gray-200">
          <TouchableOpacity 
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            onPress={onClose}
          >
            <Icon name="close-outline" size={20} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">Transaction Details</Text>
          <View className="w-8" />
        </View>

        {/* Transaction Info */}
        <View className="flex-1 p-5">
          {/* Type & Category Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-gray-500">Type</Text>
              <View className={`px-3 py-1 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                <Text className={`text-sm font-semibold ${isIncome ? 'text-green-700' : 'text-red-700'}`}>
                  {typeIcon} {typeLabel}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: transaction.category.color }}
              />
              <Text className="text-2xl mr-3">{transaction.category.icon}</Text>
              <Text className="text-xl font-semibold text-gray-800">{transaction.category.name}</Text>
            </View>
          </View>

          {/* Amount Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-500 mb-2">Amount</Text>
            <Text className={`text-3xl font-bold ${amountColor}`}>
              {amountPrefix}${transaction.amount.toFixed(2)}
            </Text>
          </View>

          {/* Description Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-500 mb-2">Description</Text>
            <Text className="text-lg text-gray-800">{transaction.description}</Text>
          </View>

          {/* Date Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-500 mb-2">Date</Text>
            <Text className="text-base text-gray-800">
              {new Date(transaction.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          {/* Additional Info */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-500 mb-2">Transaction ID</Text>
            <Text className="text-base text-gray-600 font-mono">#{transaction.id.toString().padStart(6, '0')}</Text>
          </View>

          {/* Action Buttons */}
          <View className="mt-5 space-y-3">
            <TouchableOpacity className="bg-blue-500 rounded-xl py-4 items-center">
              <Text className="text-base font-semibold text-white">✏️ Edit Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 rounded-xl py-4 items-center">
              <Text className="text-base font-semibold text-white">🗑️ Delete Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Transaction;
