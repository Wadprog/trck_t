import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';

// Predefined wallet icons and colors
const WALLET_ICONS = [
  '💳', '💼', '🏦', '🏛️', '💰', '💵', '🎯', '📊', '💎', '🌟',
  '🔥', '⚡', '🚀', '💪', '🎨', '🎪', '🎭', '🎪', '🏆', '🌈',
];

const WALLET_COLORS = [
  '#4F46E5', '#059669', '#DC2626', '#7C3AED', '#EA580C',
  '#0EA5E9', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6',
  '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export default function CreateWalletScreen() {
  const { t } = useTranslation();
  const [walletName, setWalletName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(WALLET_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(WALLET_COLORS[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!walletName.trim()) {
      Alert.alert(t('common.error'), 'Please enter a wallet name');
      return false;
    }
    if (walletName.trim().length < 2) {
      Alert.alert(t('common.error'), 'Wallet name must be at least 2 characters long');
      return false;
    }
    if (walletName.trim().length > 30) {
      Alert.alert(t('common.error'), 'Wallet name must be less than 30 characters');
      return false;
    }
    return true;
  };

  const handleSaveWallet = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newWallet = {
        id: Date.now(),
        name: walletName.trim(),
        description: description.trim(),
        icon: selectedIcon,
        color: selectedColor,
        currency: selectedCurrency.code,
        isDefault: isDefault,
        totalBalance: 0,
        sources: [],
        createdAt: new Date().toISOString(),
      };

      // TODO: Save to actual data store/API
      console.log('New wallet created:', newWallet);
      
      Alert.alert(
        t('common.success'), 
        `Wallet "${walletName}" has been created successfully!`,
        [
          {
            text: 'Add Sources',
            onPress: () => {
              // Navigate to add sources for this wallet
              router.push('/create-source');
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to create wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create Wallet',
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
          {/* Wallet Preview */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Preview</Text>
            <View 
              className="p-4 rounded-xl"
              style={{ backgroundColor: selectedColor }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-3">{selectedIcon}</Text>
                  <View>
                    <Text className="text-xl font-bold text-white">
                      {walletName || 'Wallet Name'}
                    </Text>
                    <Text className="text-white opacity-80 text-sm">
                      {description || 'Description'}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-white">
                    {selectedCurrency.symbol}0.00
                  </Text>
                  <Text className="text-white opacity-80 text-sm">
                    {selectedCurrency.code}
                  </Text>
                </View>
              </View>
              {isDefault && (
                <View className="mt-3 bg-white bg-opacity-20 px-3 py-1 rounded-full self-start">
                  <Text className="text-white text-xs font-medium">Default Wallet</Text>
                </View>
              )}
            </View>
          </View>

          {/* Wallet Name */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Wallet Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Enter wallet name..."
              value={walletName}
              onChangeText={setWalletName}
              maxLength={30}
              placeholderTextColor="#999"
            />
            <Text className="text-sm text-gray-500 mt-2 text-right">
              {walletName.length}/30
            </Text>
          </View>

          {/* Description */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Description (Optional)</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Enter description..."
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

          {/* Currency Selection */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Currency</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {CURRENCIES.map((currency) => (
                  <TouchableOpacity
                    key={currency.code}
                    className={`px-4 py-3 rounded-lg border-2 ${
                      selectedCurrency.code === currency.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onPress={() => setSelectedCurrency(currency)}
                  >
                    <Text
                      className={`font-medium ${
                        selectedCurrency.code === currency.code
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {currency.symbol} {currency.code}
                    </Text>
                    <Text className="text-xs text-gray-500 text-center mt-1">
                      {currency.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Icon Selection */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Icon</Text>
            <View className="flex-row flex-wrap gap-2">
              {WALLET_ICONS.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-12 h-12 rounded-lg items-center justify-center ${
                    selectedIcon === icon ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'
                  }`}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text className="text-xl">{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Selection */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Color</Text>
            <View className="flex-row flex-wrap gap-2">
              {WALLET_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-12 h-12 rounded-lg ${
                    selectedColor === color ? 'border-4 border-gray-800' : 'border border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <View className="flex-1 items-center justify-center">
                      <Icon name="check" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Default Wallet Toggle */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => setIsDefault(!isDefault)}
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">Default Wallet</Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Use this wallet as the default for new transactions
                </Text>
              </View>
              <View
                className={`w-12 h-6 rounded-full ${
                  isDefault ? 'bg-blue-500' : 'bg-gray-300'
                } relative`}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    isDefault ? 'right-0.5' : 'left-0.5'
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
              onPress={handleSaveWallet}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Icon name="spinner" size={18} color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? t('common.loading') : 'Create Wallet'}
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

          {/* Tips */}
          <View className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200">
            <View className="flex-row items-start">
              <Icon name="lightbulb-o" size={20} color="#3B82F6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-800 font-medium mb-2">Tips for creating wallets:</Text>
                <Text className="text-blue-700 text-sm mb-1">• Create separate wallets for different purposes</Text>
                <Text className="text-blue-700 text-sm mb-1">• Use descriptive names like "Personal" or "Business"</Text>
                <Text className="text-blue-700 text-sm mb-1">• Choose colors that help you identify them quickly</Text>
                <Text className="text-blue-700 text-sm">• Set one wallet as default for convenience</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
