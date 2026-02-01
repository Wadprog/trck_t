import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';
import { SourceType } from '@/types/wallet';

// Source type configurations
const SOURCE_CONFIGS = {
  'debit-card': {
    name: 'Debit Card',
    icon: '💳',
    color: '#4F46E5',
    fields: ['cardNumber', 'bank', 'accountType']
  },
  'credit-card': {
    name: 'Credit Card',
    icon: '💎',
    color: '#DC2626',
    fields: ['cardNumber', 'bank', 'creditLimit']
  },
  'bank-account': {
    name: 'Bank Account',
    icon: '🏦',
    color: '#059669',
    fields: ['accountNumber', 'bank', 'accountType']
  },
  'cash': {
    name: 'Cash',
    icon: '💵',
    color: '#F59E0B',
    fields: ['location']
  },
  'digital-wallet': {
    name: 'Digital Wallet',
    icon: '📱',
    color: '#7C3AED',
    fields: ['platform', 'accountId']
  },
  'investment': {
    name: 'Investment',
    icon: '📈',
    color: '#0EA5E9',
    fields: ['platform', 'accountType']
  },
  'crypto': {
    name: 'Cryptocurrency',
    icon: '₿',
    color: '#F97316',
    fields: ['platform', 'walletAddress']
  },
  'other': {
    name: 'Other',
    icon: '💼',
    color: '#6B7280',
    fields: ['description']
  }
};

const ACCOUNT_TYPES = [
  'Checking', 'Savings', 'Business', 'Joint Account', 'Student Account'
];

const POPULAR_BANKS = [
  'Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One',
  'TD Bank', 'PNC Bank', 'US Bank', 'Truist', 'Fifth Third Bank'
];

export default function CreateSourceScreen() {
  const { t } = useTranslation();
  const { walletId } = useLocalSearchParams();
  
  const [sourceName, setSourceName] = useState('');
  const [selectedType, setSelectedType] = useState<SourceType>('debit-card');
  const [initialBalance, setInitialBalance] = useState('0');
  const [isEnabled, setIsEnabled] = useState(true);
  
  // Dynamic fields based on source type
  const [cardNumber, setCardNumber] = useState('');
  const [bank, setBank] = useState('');
  const [accountType, setAccountType] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('');
  const [accountId, setAccountId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [description, setDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const currentConfig = SOURCE_CONFIGS[selectedType];

  const validateForm = (): boolean => {
    if (!sourceName.trim()) {
      Alert.alert(t('common.error'), 'Please enter a source name');
      return false;
    }
    
    if (sourceName.trim().length < 2) {
      Alert.alert(t('common.error'), 'Source name must be at least 2 characters long');
      return false;
    }

    const balance = parseFloat(initialBalance);
    if (isNaN(balance) || balance < 0) {
      Alert.alert(t('common.error'), 'Please enter a valid initial balance');
      return false;
    }

    // Validate type-specific fields
    const requiredFields = currentConfig.fields;
    
    if (requiredFields.includes('cardNumber') && !cardNumber.trim()) {
      Alert.alert(t('common.error'), 'Please enter card number');
      return false;
    }
    
    if (requiredFields.includes('bank') && !bank.trim()) {
      Alert.alert(t('common.error'), 'Please select or enter bank name');
      return false;
    }
    
    if (requiredFields.includes('accountNumber') && !accountNumber.trim()) {
      Alert.alert(t('common.error'), 'Please enter account number');
      return false;
    }

    return true;
  };

  const handleSaveSource = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSource = {
        id: Date.now(),
        name: sourceName.trim(),
        type: selectedType,
        balance: parseFloat(initialBalance),
        walletId: walletId ? parseInt(walletId as string) : 1,
        isEnabled: isEnabled,
        metadata: {
          ...(cardNumber && { cardNumber: `****${cardNumber.slice(-4)}` }),
          ...(bank && { bank }),
          ...(accountType && { accountType }),
          ...(creditLimit && { creditLimit: parseFloat(creditLimit) }),
          ...(accountNumber && { accountNumber: `****${accountNumber.slice(-4)}` }),
          ...(location && { location }),
          ...(platform && { platform }),
          ...(accountId && { accountId }),
          ...(walletAddress && { walletAddress }),
          ...(description && { description }),
        },
        createdAt: new Date().toISOString(),
      };

      // TODO: Save to actual data store/API
      console.log('New source created:', newSource);
      
      Alert.alert(
        t('common.success'), 
        `Source "${sourceName}" has been created successfully!`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form
              setSourceName('');
              setInitialBalance('0');
              setCardNumber('');
              setBank('');
              setAccountType('');
              setCreditLimit('');
              setAccountNumber('');
              setLocation('');
              setPlatform('');
              setAccountId('');
              setWalletAddress('');
              setDescription('');
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to create source. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const renderDynamicFields = () => {
    const fields = currentConfig.fields;
    
    return (
      <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-3">{currentConfig.name} Details</Text>
        
        {fields.includes('cardNumber') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Card Number</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
              placeholderTextColor="#999"
            />
          </View>
        )}
        
        {fields.includes('bank') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Bank</Text>
            <View className="border border-gray-200 rounded-lg">
              <TextInput
                className="px-4 py-3 text-gray-800 text-base"
                placeholder="Select or enter bank name"
                value={bank}
                onChangeText={setBank}
                placeholderTextColor="#999"
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
              <View className="flex-row gap-2">
                {POPULAR_BANKS.map((bankName) => (
                  <TouchableOpacity
                    key={bankName}
                    className="bg-gray-100 px-3 py-2 rounded-lg"
                    onPress={() => setBank(bankName)}
                  >
                    <Text className="text-gray-700 text-sm">{bankName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        
        {fields.includes('accountType') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Account Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {ACCOUNT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-4 py-3 rounded-lg border-2 ${
                      accountType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onPress={() => setAccountType(type)}
                  >
                    <Text
                      className={`font-medium ${
                        accountType === type ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        
        {fields.includes('creditLimit') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Credit Limit</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="0.00"
              value={creditLimit}
              onChangeText={setCreditLimit}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        )}
        
        {fields.includes('accountNumber') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Account Number</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        )}
        
        {fields.includes('location') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="e.g., Wallet, Safe, Drawer"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
          </View>
        )}
        
        {fields.includes('platform') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Platform</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="e.g., PayPal, Venmo, Coinbase"
              value={platform}
              onChangeText={setPlatform}
              placeholderTextColor="#999"
            />
          </View>
        )}
        
        {fields.includes('accountId') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Account ID</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Account ID or username"
              value={accountId}
              onChangeText={setAccountId}
              placeholderTextColor="#999"
            />
          </View>
        )}
        
        {fields.includes('walletAddress') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Wallet Address</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Wallet address (optional)"
              value={walletAddress}
              onChangeText={setWalletAddress}
              placeholderTextColor="#999"
              multiline
            />
          </View>
        )}
        
        {fields.includes('description') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Describe this source"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create Source',
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
          {/* Source Preview */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Preview</Text>
            <View 
              className="p-4 rounded-xl"
              style={{ backgroundColor: currentConfig.color }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-3">{currentConfig.icon}</Text>
                  <View>
                    <Text className="text-xl font-bold text-white">
                      {sourceName || currentConfig.name}
                    </Text>
                    <Text className="text-white opacity-80 text-sm">
                      {currentConfig.name}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-white">
                    ${parseFloat(initialBalance || '0').toFixed(2)}
                  </Text>
                  {!isEnabled && (
                    <Text className="text-white opacity-80 text-xs">Disabled</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Source Name */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Source Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Enter source name..."
              value={sourceName}
              onChangeText={setSourceName}
              maxLength={30}
              placeholderTextColor="#999"
            />
            <Text className="text-sm text-gray-500 mt-2 text-right">
              {sourceName.length}/30
            </Text>
          </View>

          {/* Source Type Selection */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Source Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {Object.entries(SOURCE_CONFIGS).map(([type, config]) => (
                  <TouchableOpacity
                    key={type}
                    className={`p-3 rounded-lg border-2 min-w-20 ${
                      selectedType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onPress={() => setSelectedType(type as SourceType)}
                  >
                    <Text className="text-2xl text-center mb-1">{config.icon}</Text>
                    <Text
                      className={`text-xs text-center font-medium ${
                        selectedType === type ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {config.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Initial Balance */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Initial Balance</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="0.00"
              value={initialBalance}
              onChangeText={setInitialBalance}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Dynamic Fields */}
          {renderDynamicFields()}

          {/* Source Status Toggle */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => setIsEnabled(!isEnabled)}
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">Enable Source</Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Allow this source to be used for transactions
                </Text>
              </View>
              <View
                className={`w-12 h-6 rounded-full ${
                  isEnabled ? 'bg-green-500' : 'bg-gray-300'
                } relative`}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    isEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity 
              className={`rounded-xl p-4 shadow-sm ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleSaveSource}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Icon name="spinner" size={18} color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? t('common.loading') : 'Create Source'}
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

          {/* Security Notice */}
          <View className="bg-amber-50 rounded-xl p-4 mt-6 border border-amber-200">
            <View className="flex-row items-start">
              <Icon name="shield" size={20} color="#F59E0B" />
              <View className="flex-1 ml-3">
                <Text className="text-amber-800 font-medium mb-2">Security Notice</Text>
                <Text className="text-amber-700 text-sm">
                  Your financial information is encrypted and stored securely. Only the last 4 digits of card/account numbers are displayed for security.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
