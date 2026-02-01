import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';
import { mockCategories } from '@/seed/mockData';

// Predefined color palette for categories
const CATEGORY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F',
  '#AED6F1', '#A9DFBF', '#F9E79F', '#D7BDE2', '#A3E4D7',
];

// Predefined icons for categories
const CATEGORY_ICONS = [
  '🍽️', '🚗', '🛒', '🎬', '🏥', '📱', '⚡', '🏠', '✈️', '🎓',
  '💰', '💻', '📈', '🏪', '🎁', '🔧', '🎵', '⚽', '📚', '🌟',
  '☕', '🛍️', '🎨', '🏋️', '🧘', '🍕', '🎯', '💡', '🔒', '🌍',
];

export default function AddCategoryScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(CATEGORY_ICONS[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial category type from params
  useEffect(() => {
    if (params.type && (params.type === 'income' || params.type === 'expense')) {
      setCategoryType(params.type as 'income' | 'expense');
      // Set default color based on type
      if (params.type === 'income') {
        setSelectedColor('#27AE60'); // Green for income
      } else {
        setSelectedColor('#FF6B6B'); // Red for expense
      }
    }
  }, [params.type]);

  const generateShortName = (name: string): string => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }
    return words.map(word => word.charAt(0)).join('').substring(0, 3).toUpperCase();
  };

  const validateForm = (): boolean => {
    if (!categoryName.trim()) {
      Alert.alert(t('common.error'), 'Please enter a category name');
      return false;
    }
    if (categoryName.trim().length < 2) {
      Alert.alert(t('common.error'), 'Category name must be at least 2 characters long');
      return false;
    }
    if (categoryName.trim().length > 20) {
      Alert.alert(t('common.error'), 'Category name must be less than 20 characters');
      return false;
    }
    
    // Check for duplicate category names
    const existingCategory = mockCategories.find(
      cat => cat.name.toLowerCase() === categoryName.trim().toLowerCase()
    );
    if (existingCategory) {
      Alert.alert(t('common.error'), `A category named "${categoryName}" already exists. Please choose a different name.`);
      return false;
    }
    
    return true;
  };

  const handleSaveCategory = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCategory = {
        name: categoryName.trim(),
        color: selectedColor,
        icon: selectedIcon,
        shortName: generateShortName(categoryName),
        type: categoryType,
        createdAt: new Date().toISOString(),
      };

      // TODO: Save to actual data store/API
      console.log('New category created:', newCategory);
      
      Alert.alert(
        t('common.success'), 
        `${categoryType === 'income' ? 'Income' : 'Expense'} category "${categoryName}" has been created successfully!`,
        [
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form for creating another category
              setCategoryName('');
              setSelectedIcon(CATEGORY_ICONS[0]);
              // Keep the same type and color for convenience
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to create category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const shortName = generateShortName(categoryName);

  return (
    <>
      <Stack.Screen 
        options={{
          title: t('categories.addNewCategory'),
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
          {/* Category Preview */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Preview</Text>
            <View className="flex-row items-center">
              <View 
                className="w-16 h-16 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: selectedColor + '20' }}
              >
                <Text className="text-2xl">{selectedIcon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-800">
                  {categoryName || 'Category Name'}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {shortName || 'SHT'} • {categoryType === 'income' ? 'Income' : 'Expense'}
                </Text>
              </View>
            </View>
          </View>

          {/* Category Name Input */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">{t('categories.categoryName')}</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Enter category name..."
              value={categoryName}
              onChangeText={setCategoryName}
              maxLength={20}
              placeholderTextColor="#999"
            />
            <View className="flex-row justify-between mt-2">
              <Text className="text-sm text-gray-500">
                Short name: {shortName || 'Generated automatically'}
              </Text>
              <Text className="text-sm text-gray-500">
                {categoryName.length}/20
              </Text>
            </View>
          </View>

          {/* Category Type */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">{t('categories.categoryType')}</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                  categoryType === 'expense' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                onPress={() => setCategoryType('expense')}
              >
                <Text
                  className={`text-center font-medium ${
                    categoryType === 'expense' ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  💸 Expense
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                  categoryType === 'income' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                onPress={() => setCategoryType('income')}
              >
                <Text
                  className={`text-center font-medium ${
                    categoryType === 'income' ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  💰 Income
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Icon Selection */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">{t('categories.categoryIcon')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORY_ICONS.map((icon, index) => (
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
            <Text className="text-lg font-semibold text-gray-800 mb-3">{t('categories.categoryColor')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORY_COLORS.map((color, index) => (
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

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity 
              className={`rounded-xl p-4 shadow-sm ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleSaveCategory}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Icon name="spinner" size={18} color="white" className="mr-2" />
                )}
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? t('common.loading') : t('common.save') + ' Category'}
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
                <Text className="text-blue-800 font-medium mb-2">Tips for creating categories:</Text>
                <Text className="text-blue-700 text-sm mb-1">• Use clear, descriptive names</Text>
                <Text className="text-blue-700 text-sm mb-1">• Choose appropriate icons and colors</Text>
                <Text className="text-blue-700 text-sm mb-1">• Consider grouping similar expenses</Text>
                <Text className="text-blue-700 text-sm">• Keep the name short but meaningful</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
