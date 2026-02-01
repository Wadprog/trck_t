import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';
import { mockCategories } from '@/seed/mockData';
import { formatCurrency } from '@/utils/expenseUtils';
import { mockTransactionSources, mockWallets, TransactionSource } from '@/types/wallet';

export default function CreateTransactionScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof mockCategories[0] | null>(null);
  const [selectedSource, setSelectedSource] = useState<TransactionSource | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
  const [isLoading, setIsLoading] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);

  // Get available sources
  const availableSources = mockTransactionSources.filter(source => source.isActive);

  const getWalletName = (walletId: number) => {
    const wallet = mockWallets.find(w => w.id === walletId);
    return wallet?.name || 'Unknown Wallet';
  };

  // Set initial transaction type from params
  useEffect(() => {
    if (params.type && (params.type === 'income' || params.type === 'expense')) {
      setTransactionType(params.type as 'income' | 'expense');
    }
  }, [params.type]);

  // Filter categories based on transaction type
  const availableCategories = mockCategories.filter(category => {
    if (transactionType === 'income') {
      return ['Salary', 'Freelance', 'Investment', 'Side Business', 'Gift'].includes(category.name);
    } else {
      return ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Health'].includes(category.name);
    }
  });

  // Set default category when type changes
  useEffect(() => {
    if (availableCategories.length > 0) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [transactionType]);

  // Set default source when component loads
  useEffect(() => {
    if (availableSources.length > 0 && !selectedSource) {
      // Try to find default wallet's first source, otherwise use first available
      const defaultWallet = mockWallets.find(w => w.isDefault);
      const defaultSource = defaultWallet 
        ? availableSources.find(s => s.walletId === defaultWallet.id)
        : availableSources[0];
      
      setSelectedSource(defaultSource || availableSources[0]);
    }
  }, []);

  const validateForm = (): boolean => {
    if (!amount.trim()) {
      Alert.alert(t('common.error'), 'Please enter an amount');
      return false;
    }
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert(t('common.error'), 'Please enter a valid amount greater than 0');
      return false;
    }
    
    if (numericAmount > 999999.99) {
      Alert.alert(t('common.error'), 'Amount cannot exceed $999,999.99');
      return false;
    }

    if (!description.trim()) {
      Alert.alert(t('common.error'), 'Please enter a description');
      return false;
    }

    if (description.trim().length < 3) {
      Alert.alert(t('common.error'), 'Description must be at least 3 characters long');
      return false;
    }

    if (!selectedSource) {
      Alert.alert(t('common.error'), 'Please select a transaction source');
      return false;
    }

    // For expenses, check if source has sufficient balance
    if (transactionType === 'expense' && selectedSource.balance < numericAmount) {
      Alert.alert(
        t('common.error'), 
        `Insufficient balance in ${selectedSource.name}. Available: $${selectedSource.balance.toFixed(2)}`
      );
      return false;
    }

    if (!selectedCategory) {
      Alert.alert(t('common.error'), 'Please select a category');
      return false;
    }

    return true;
  };

  const handleSaveTransaction = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction = {
        id: Date.now(), // Simple ID generation
        amount: parseFloat(amount),
        description: description.trim(),
        category: selectedCategory,
        date: date,
        type: transactionType,
        sourceId: selectedSource?.id,
        sourceName: selectedSource?.name,
        sourceType: selectedSource?.type,
        walletId: selectedSource?.walletId,
        createdAt: new Date().toISOString(),
      };

      // TODO: Save to actual data store/API
      console.log('New transaction created:', newTransaction);
      
      Alert.alert(
        t('common.success'), 
        `${transactionType === 'income' ? 'Income' : 'Expense'} of ${formatCurrency(parseFloat(amount))} has been recorded successfully!`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form for creating another transaction
              setAmount('');
              setDescription('');
              setDate(new Date().toISOString().split('T')[0]);
              // Keep the same type and category for convenience
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to create transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmountInput = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericText.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return numericText;
  };

  const formatDisplayAmount = () => {
    if (!amount) return '$0.00';
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '$0.00';
    return formatCurrency(numericAmount);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Transaction',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => (
            <TouchableOpacity
              className="ml-4"
              onPress={() => router.back()}
            >
              <Icon name="arrow-left" size={20} color="#333" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-5">
          {/* Amount Preview */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Amount</Text>
            <View className="items-center">
              <Text className={`text-4xl font-bold ${
                transactionType === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transactionType === 'expense' ? '-' : '+'}{formatDisplayAmount()}
              </Text>
              <Text className="text-gray-500 mt-2">
                {transactionType === 'income' ? 'Income' : 'Expense'} • {selectedCategory?.name || 'No category'}
                {selectedSource && ` • ${selectedSource.name}`}
              </Text>
            </View>
          </View>

          {/* Transaction Type */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Transaction Type</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                  transactionType === 'expense' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                onPress={() => setTransactionType('expense')}
              >
                <Text
                  className={`text-center font-medium ${
                    transactionType === 'expense' ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  💸 Expense
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                  transactionType === 'income' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                onPress={() => setTransactionType('income')}
              >
                <Text
                  className={`text-center font-medium ${
                    transactionType === 'income' ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  💰 Income
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount Input */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Amount</Text>
            <View className="flex-row items-center border border-gray-200 rounded-lg px-4 py-3">
              <Text className="text-gray-500 text-lg mr-2">$</Text>
              <TextInput
                className="flex-1 text-gray-800 text-lg"
                placeholder="0.00"
                value={amount}
                onChangeText={(text) => setAmount(formatAmountInput(text))}
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Category Selection */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
              <View className="flex-row gap-3">
                {availableCategories.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    className={`px-4 py-3 rounded-lg border-2 min-w-[100px] ${
                      selectedCategory?.name === category.name
                        ? `border-blue-500 bg-blue-50`
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <View className="items-center">
                      <Text className="text-xl mb-1">{category.icon}</Text>
                      <Text
                        className={`text-sm font-medium text-center ${
                          selectedCategory?.name === category.name
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Source Selection */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              {transactionType === 'income' ? 'Deposit To' : 'Pay From'}
            </Text>
            
            {selectedSource ? (
              <TouchableOpacity
                className="flex-row items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                onPress={() => setShowSourcePicker(true)}
              >
                <Text className="text-2xl mr-3">{selectedSource.icon}</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">{selectedSource.name}</Text>
                  <Text className="text-sm text-gray-600">
                    {getWalletName(selectedSource.walletId)} • ${selectedSource.balance.toFixed(2)}
                  </Text>
                </View>
                <Icon name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="flex-row items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg"
                onPress={() => setShowSourcePicker(true)}
              >
                <Icon name="plus" size={16} color="#666" className="mr-2" />
                <Text className="text-gray-600 font-medium">Select Source</Text>
              </TouchableOpacity>
            )}

            {/* Source Selection Modal */}
            {showSourcePicker && (
              <View className="absolute top-0 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
                <View className="p-4 border-b border-gray-200">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-gray-800">
                      {transactionType === 'income' ? 'Deposit To' : 'Pay From'}
                    </Text>
                    <TouchableOpacity onPress={() => setShowSourcePicker(false)}>
                      <Icon name="times" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <ScrollView className="max-h-80">
                  {Object.entries(
                    availableSources.reduce((grouped, source) => {
                      const walletId = source.walletId;
                      if (!grouped[walletId]) grouped[walletId] = [];
                      grouped[walletId].push(source);
                      return grouped;
                    }, {} as { [walletId: number]: TransactionSource[] })
                  ).map(([walletId, sources]) => (
                    <View key={walletId} className="p-4">
                      <Text className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                        {getWalletName(parseInt(walletId))}
                      </Text>
                      
                      {sources.map((source) => (
                        <TouchableOpacity
                          key={source.id}
                          className="flex-row items-center p-3 mb-2 bg-gray-50 rounded-lg"
                          onPress={() => {
                            setSelectedSource(source);
                            setShowSourcePicker(false);
                          }}
                        >
                          <Text className="text-2xl mr-3">{source.icon}</Text>
                          <View className="flex-1">
                            <Text className="font-semibold text-gray-800">{source.name}</Text>
                            <Text className="text-sm text-gray-600">
                              Balance: ${source.balance.toFixed(2)}
                            </Text>
                          </View>
                          {selectedSource?.id === source.id && (
                            <Icon name="check" size={16} color="#059669" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Description Input */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Description</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Enter transaction description..."
              value={description}
              onChangeText={setDescription}
              maxLength={100}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text className="text-sm text-gray-500 mt-2 text-right">
              {description.length}/100
            </Text>
          </View>

          {/* Date Input */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Date</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              placeholderTextColor="#999"
            />
            <Text className="text-sm text-gray-500 mt-2">
              Format: YYYY-MM-DD (e.g., {new Date().toISOString().split('T')[0]})
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity 
              className={`rounded-xl p-4 shadow-sm ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleSaveTransaction}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Icon name="spinner" size={18} color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? t('common.loading') : 'Save Transaction'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200"
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text className="text-gray-700 text-center font-semibold text-lg">
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Amount Buttons */}
          <View className="bg-white rounded-xl p-4 mt-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Amounts</Text>
            <View className="flex-row flex-wrap gap-2">
              {['5', '10', '20', '50', '100', '200'].map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  className="bg-gray-100 px-4 py-2 rounded-lg"
                  onPress={() => setAmount(quickAmount)}
                >
                  <Text className="text-gray-700 font-medium">${quickAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tips */}
          <View className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200">
            <View className="flex-row items-start">
              <Icon name="lightbulb-o" size={20} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-800 font-medium mb-2">Tips for tracking transactions:</Text>
                <Text className="text-blue-700 text-sm mb-1">• Be specific in your descriptions</Text>
                <Text className="text-blue-700 text-sm mb-1">• Choose the most appropriate category</Text>
                <Text className="text-blue-700 text-sm mb-1">• Enter transactions as soon as possible</Text>
                <Text className="text-blue-700 text-sm">• Review your spending regularly</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
