import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';
import { mockWallets, mockTransactionSources } from '@/types/wallet';
import { formatCurrency } from '@/utils/expenseUtils';

export default function WalletsScreen() {
  const { t } = useTranslation();
  const [selectedWallet, setSelectedWallet] = useState(mockWallets[0]);

  // Get sources for selected wallet
  const walletSources = mockTransactionSources.filter(source => source.walletId === selectedWallet.id);

  // Calculate wallet total balance
  const calculateWalletBalance = (walletId: number) => {
    return mockTransactionSources
      .filter(source => source.walletId === walletId)
      .reduce((total, source) => total + source.balance, 0);
  };

  const handleCreateWallet = () => {
    router.push('/create-wallet');
  };

  const handleCreateSource = () => {
    router.push(`/create-source?walletId=${selectedWallet.id}`);
  };

  const handleEditSource = (sourceId: number) => {
    router.push(`/create-source?walletId=${selectedWallet.id}&sourceId=${sourceId}`);
  };

  const handleTransfer = () => {
    router.push(`/transfer?walletId=${selectedWallet.id}`);
  };

  const getSourceTypeDisplay = (type: string) => {
    switch (type) {
      case 'bank_account': return 'Bank Account';
      case 'debit_card': return 'Debit Card';
      case 'credit_card': return 'Credit Card';
      case 'cash': return 'Cash';
      case 'digital_wallet': return 'Digital Wallet';
      case 'investment_account': return 'Investment';
      default: return type;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Wallets & Sources',
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
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Manage Wallets</Text>
            <Text className="text-gray-600">Organize your accounts and payment methods</Text>
          </View>

          {/* Wallet Selector */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Select Wallet</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-3">
                {mockWallets.map((wallet) => (
                  <TouchableOpacity
                    key={wallet.id}
                    className={`p-4 rounded-xl min-w-[200px] ${
                      selectedWallet.id === wallet.id
                        ? 'bg-blue-500 border-2 border-blue-600'
                        : 'bg-white border border-gray-200'
                    }`}
                    onPress={() => setSelectedWallet(wallet)}
                    style={{ elevation: 2, shadowOpacity: 0.1 }}
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-2xl mr-2">{wallet.icon}</Text>
                      <Text className={`text-lg font-semibold ${
                        selectedWallet.id === wallet.id ? 'text-white' : 'text-gray-800'
                      }`}>
                        {wallet.name}
                      </Text>
                      {wallet.isDefault && (
                        <View className="ml-2 bg-yellow-100 px-2 py-1 rounded-full">
                          <Text className="text-xs text-yellow-800 font-medium">Default</Text>
                        </View>
                      )}
                    </View>
                    <Text className={`text-xl font-bold ${
                      selectedWallet.id === wallet.id ? 'text-white' : 'text-gray-700'
                    }`}>
                      {formatCurrency(calculateWalletBalance(wallet.id))}
                    </Text>
                    <Text className={`text-sm ${
                      selectedWallet.id === wallet.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {wallet.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity 
              className="flex-1 bg-blue-500 rounded-xl p-3 shadow-sm"
              onPress={handleCreateWallet}
            >
              <View className="flex-row items-center justify-center">
                <Icon name="plus" size={16} color="white" />
                <Text className="text-white font-semibold ml-2">New Wallet</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-green-500 rounded-xl p-3 shadow-sm"
              onPress={handleCreateSource}
            >
              <View className="flex-row items-center justify-center">
                <Icon name="credit-card" size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Add Source</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-purple-500 rounded-xl p-3 shadow-sm"
              onPress={handleTransfer}
            >
              <View className="flex-row items-center justify-center">
                <Icon name="exchange" size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Transfer</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sources List */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Sources in {selectedWallet.name}
            </Text>
            
            {walletSources.length === 0 ? (
              <View className="bg-white rounded-xl p-8 shadow-sm">
                <Text className="text-center text-gray-500 text-lg mb-2">No sources yet</Text>
                <Text className="text-center text-gray-400">Add your first payment method or account</Text>
              </View>
            ) : (
              <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                {walletSources.map((source, index) => (
                  <TouchableOpacity
                    key={source.id}
                    className={`p-4 ${
                      index < walletSources.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    onPress={() => handleEditSource(source.id)}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View 
                          className="w-12 h-12 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: source.color + '20' }}
                        >
                          <Text className="text-xl">{source.icon}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-medium text-gray-800">{source.name}</Text>
                          <Text className="text-sm text-gray-500">{getSourceTypeDisplay(source.type)}</Text>
                          {source.description && (
                            <Text className="text-xs text-gray-400 mt-1">{source.description}</Text>
                          )}
                        </View>
                      </View>
                      
                      <View className="items-end">
                        <Text className={`text-lg font-bold ${
                          source.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(source.balance)}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {source.lastUsed ? `Used ${source.lastUsed}` : 'Never used'}
                        </Text>
                        {!source.isActive && (
                          <View className="bg-gray-100 px-2 py-1 rounded-full mt-1">
                            <Text className="text-xs text-gray-600">Inactive</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Wallet Summary */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Wallet Summary</Text>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Total Sources:</Text>
              <Text className="font-semibold text-gray-800">{walletSources.length}</Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Active Sources:</Text>
              <Text className="font-semibold text-gray-800">
                {walletSources.filter(s => s.isActive).length}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Balance:</Text>
              <Text className={`text-lg font-bold ${
                calculateWalletBalance(selectedWallet.id) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(calculateWalletBalance(selectedWallet.id))}
              </Text>
            </View>
          </View>

          {/* Tips */}
          <View className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200">
            <View className="flex-row items-start">
              <Icon name="lightbulb-o" size={20} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-800 font-medium mb-2">Tips for managing wallets:</Text>
                <Text className="text-blue-700 text-sm mb-1">• Create separate wallets for different purposes</Text>
                <Text className="text-blue-700 text-sm mb-1">• Add all your payment methods as sources</Text>
                <Text className="text-blue-700 text-sm mb-1">• Use transfers to move money between accounts</Text>
                <Text className="text-blue-700 text-sm">• Keep track of credit card balances</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
