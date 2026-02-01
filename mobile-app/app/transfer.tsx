import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';
import { mockWallets, mockTransactionSources, TransactionSource } from '@/types/wallet';

export default function TransferScreen() {
  const { t } = useTranslation();
  
  const [amount, setAmount] = useState('');
  const [fromSource, setFromSource] = useState<TransactionSource | null>(null);
  const [toSource, setToSource] = useState<TransactionSource | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Get all available sources grouped by wallet
  const availableSources = mockTransactionSources.filter(source => 
    source.isActive && source.balance > 0
  );

  const getWalletName = (walletId: number) => {
    const wallet = mockWallets.find(w => w.id === walletId);
    return wallet?.name || 'Unknown Wallet';
  };

  const getSourcesByWallet = () => {
    const grouped: { [walletId: number]: TransactionSource[] } = {};
    availableSources.forEach(source => {
      if (!grouped[source.walletId]) {
        grouped[source.walletId] = [];
      }
      grouped[source.walletId].push(source);
    });
    return grouped;
  };

  const validateTransfer = (): boolean => {
    const transferAmount = parseFloat(amount);
    
    if (!amount.trim() || isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert(t('common.error'), 'Please enter a valid transfer amount');
      return false;
    }

    if (!fromSource) {
      Alert.alert(t('common.error'), 'Please select a source to transfer from');
      return false;
    }

    if (!toSource) {
      Alert.alert(t('common.error'), 'Please select a destination for the transfer');
      return false;
    }

    if (fromSource.id === toSource.id) {
      Alert.alert(t('common.error'), 'Cannot transfer to the same source');
      return false;
    }

    if (transferAmount > fromSource.balance) {
      Alert.alert(
        t('common.error'), 
        `Insufficient balance. Available: $${fromSource.balance.toFixed(2)}`
      );
      return false;
    }

    return true;
  };

  const handleTransfer = async () => {
    if (!validateTransfer()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const transferAmount = parseFloat(amount);
      const transfer = {
        id: Date.now(),
        amount: transferAmount,
        fromSourceId: fromSource!.id,
        fromSourceName: fromSource!.name,
        toSourceId: toSource!.id,
        toSourceName: toSource!.name,
        description: description.trim() || `Transfer from ${fromSource!.name} to ${toSource!.name}`,
        createdAt: new Date().toISOString(),
        type: 'transfer'
      };

      // TODO: Save transfer to actual data store/API
      console.log('Transfer created:', transfer);
      
      Alert.alert(
        t('common.success'), 
        `Transfer of $${transferAmount.toFixed(2)} completed successfully!`,
        [
          {
            text: 'Transfer Again',
            onPress: () => {
              setAmount('');
              setDescription('');
              // Keep the same sources for convenience
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to process transfer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const SourcePicker = ({ 
    title, 
    selectedSource, 
    onSelect, 
    excludeSourceId 
  }: { 
    title: string;
    selectedSource: TransactionSource | null;
    onSelect: (source: TransactionSource) => void;
    excludeSourceId?: number;
  }) => {
    const groupedSources = getSourcesByWallet();
    
    return (
      <View className="bg-white rounded-xl p-4 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-3">{title}</Text>
        
        {selectedSource ? (
          <TouchableOpacity
            className="flex-row items-center p-4 bg-blue-50 rounded-lg border border-blue-200"
            onPress={() => selectedSource === fromSource ? setShowFromPicker(true) : setShowToPicker(true)}
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
            onPress={() => selectedSource === fromSource ? setShowFromPicker(true) : setShowToPicker(true)}
          >
            <Icon name="plus" size={16} color="#666" className="mr-2" />
            <Text className="text-gray-600 font-medium">Select Source</Text>
          </TouchableOpacity>
        )}

        {/* Source Selection Modal */}
        {((selectedSource === fromSource && showFromPicker) || 
          (selectedSource === toSource && showToPicker)) && (
          <View className="absolute top-0 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-800">{title}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowFromPicker(false);
                    setShowToPicker(false);
                  }}
                >
                  <Icon name="times" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="max-h-80">
              {Object.entries(groupedSources).map(([walletId, sources]) => (
                <View key={walletId} className="p-4">
                  <Text className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                    {getWalletName(parseInt(walletId))}
                  </Text>
                  
                  {sources
                    .filter(source => source.id !== excludeSourceId)
                    .map((source) => (
                    <TouchableOpacity
                      key={source.id}
                      className="flex-row items-center p-3 mb-2 bg-gray-50 rounded-lg"
                      onPress={() => {
                        onSelect(source);
                        setShowFromPicker(false);
                        setShowToPicker(false);
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
    );
  };

  const quickAmounts = ['10', '25', '50', '100', '250', '500'];

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Transfer Money',
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
          {/* Transfer Summary */}
          {fromSource && toSource && amount && (
            <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 shadow-lg">
              <Text className="text-white text-lg font-semibold mb-4">Transfer Summary</Text>
              
              <View className="flex-row items-center justify-between">
                <View className="items-center flex-1">
                  <Text className="text-3xl mb-2">{fromSource.icon}</Text>
                  <Text className="text-white font-medium text-center">{fromSource.name}</Text>
                  <Text className="text-white opacity-80 text-sm">From</Text>
                </View>
                
                <View className="mx-4">
                  <View className="flex-row items-center">
                    <View className="h-0.5 w-8 bg-white opacity-60" />
                    <Icon name="arrow-right" size={20} color="white" className="mx-2" />
                    <View className="h-0.5 w-8 bg-white opacity-60" />
                  </View>
                  <Text className="text-white text-center font-bold text-xl mt-2">
                    ${parseFloat(amount || '0').toFixed(2)}
                  </Text>
                </View>
                
                <View className="items-center flex-1">
                  <Text className="text-3xl mb-2">{toSource.icon}</Text>
                  <Text className="text-white font-medium text-center">{toSource.name}</Text>
                  <Text className="text-white opacity-80 text-sm">To</Text>
                </View>
              </View>
            </View>
          )}

          {/* Amount Input */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Transfer Amount</Text>
            
            <View className="flex-row items-center border border-gray-200 rounded-lg">
              <Text className="text-2xl text-gray-600 pl-4">$</Text>
              <TextInput
                className="flex-1 px-2 py-4 text-2xl text-gray-800 font-semibold"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* Quick Amount Buttons */}
            <Text className="text-sm font-medium text-gray-700 mt-4 mb-2">Quick Amounts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {quickAmounts.map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    className="bg-gray-100 px-4 py-2 rounded-lg"
                    onPress={() => setAmount(quickAmount)}
                  >
                    <Text className="text-gray-700 font-medium">${quickAmount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* From Source */}
          <View className="mb-6">
            <SourcePicker
              title="Transfer From"
              selectedSource={fromSource}
              onSelect={setFromSource}
              excludeSourceId={toSource?.id}
            />
          </View>

          {/* To Source */}
          <View className="mb-6">
            <SourcePicker
              title="Transfer To"
              selectedSource={toSource}
              onSelect={setToSource}
              excludeSourceId={fromSource?.id}
            />
          </View>

          {/* Description */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Description (Optional)</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Add a note for this transfer..."
              value={description}
              onChangeText={setDescription}
              maxLength={100}
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
            <Text className="text-sm text-gray-500 mt-2 text-right">
              {description.length}/100
            </Text>
          </View>

          {/* Transfer Fees Info */}
          <View className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <View className="flex-row items-start">
              <Icon name="info-circle" size={20} color="#059669" />
              <View className="flex-1 ml-3">
                <Text className="text-green-800 font-medium mb-1">No Transfer Fees</Text>
                <Text className="text-green-700 text-sm">
                  Transfers between your sources are always free and instant.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity 
              className={`rounded-xl p-4 shadow-sm ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleTransfer}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Icon name="spinner" size={18} color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? 'Processing...' : 'Complete Transfer'}
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

          {/* Transfer History Link */}
          <TouchableOpacity 
            className="flex-row items-center justify-center mt-6 p-4"
            onPress={() => {
              // TODO: Navigate to transfer history
              Alert.alert('Transfer History', 'Coming soon!');
            }}
          >
            <Icon name="history" size={16} color="#666" className="mr-2" />
            <Text className="text-gray-600 font-medium">View Transfer History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
