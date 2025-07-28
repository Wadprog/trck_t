
import React from 'react';
import { TouchableOpacity, View, Modal, Text } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

interface TransactionProps {
  expense: {
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
  };
  mode: 'list' | 'detail';
  onPress?: () => void;
  onClose?: () => void;
}

const Transaction = ({ expense, mode, onPress, onClose }: TransactionProps) => {
  if (mode === 'list') {
    return (
      <TouchableOpacity 
        className="flex-row justify-between items-center py-4"
        onPress={onPress}
      >
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800 mb-1">{expense.description}</Text>
          <Text className="text-sm text-gray-600">
            {expense.category.icon} {expense.category.name}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-base font-semibold text-red-600">-${expense.amount.toFixed(2)}</Text>
          <Text className="text-xs text-gray-400 mt-1">{expense.date}</Text>
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
          {/* Category Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center">
              <View 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: expense.category.color }}
              />
              <Text className="text-2xl mr-3">{expense.category.icon}</Text>
              <Text className="text-xl font-semibold text-gray-800">{expense.category.name}</Text>
            </View>
          </View>

          {/* Amount Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-500 mb-2">Amount</Text>
            <Text className="text-3xl font-bold text-red-600">-${expense.amount.toFixed(2)}</Text>
          </View>

          {/* Description Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-500 mb-2">Description</Text>
            <Text className="text-lg text-gray-800">{expense.description}</Text>
          </View>

          {/* Date Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm font-semibold text-gray-500 mb-2">Date</Text>
            <Text className="text-base text-gray-800">
              {new Date(expense.date).toLocaleDateString('en-US', {
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
            <Text className="text-base text-gray-600 font-mono">#{expense.id.toString().padStart(6, '0')}</Text>
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
