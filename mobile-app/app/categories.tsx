import React, { useState, useMemo } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';
import { mockTransactions, mockCategories } from '@/seed/mockData';
import { 
  filterTransactionsByType, 
  getCategoryTotals, 
  formatCurrency 
} from '@/utils/expenseUtils';

interface CategoryStats {
  name: string;
  icon: string;
  color: string;
  shortName: string;
  type: 'income' | 'expense';
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  lastUsed: string;
}

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<'income' | 'expense'>('expense');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    const incomeTransactions = filterTransactionsByType(mockTransactions, 'income');
    const expenseTransactions = filterTransactionsByType(mockTransactions, 'expense');
    
    const incomeTotals = getCategoryTotals(incomeTransactions);
    const expenseTotals = getCategoryTotals(expenseTransactions);
    
    const stats: CategoryStats[] = [];
    
    // Process expense categories
    mockCategories
      .filter(cat => expenseTotals[cat.name])
      .forEach(cat => {
        const categoryTransactions = expenseTransactions.filter(t => t.category.name === cat.name);
        const total = expenseTotals[cat.name];
        const lastTransaction = categoryTransactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        stats.push({
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          shortName: cat.shortName,
          type: 'expense',
          totalTransactions: categoryTransactions.length,
          totalAmount: total.amount,
          averageAmount: total.amount / categoryTransactions.length,
          lastUsed: lastTransaction?.date || 'Never',
        });
      });
    
    // Process income categories
    mockCategories
      .filter(cat => incomeTotals[cat.name])
      .forEach(cat => {
        const categoryTransactions = incomeTransactions.filter(t => t.category.name === cat.name);
        const total = incomeTotals[cat.name];
        const lastTransaction = categoryTransactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        stats.push({
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          shortName: cat.shortName,
          type: 'income',
          totalTransactions: categoryTransactions.length,
          totalAmount: total.amount,
          averageAmount: total.amount / categoryTransactions.length,
          lastUsed: lastTransaction?.date || 'Never',
        });
      });
    
    return stats;
  }, [mockTransactions, mockCategories]);

  // Filter categories based on selected tab and search
  const filteredCategories = useMemo(() => {
    return categoryStats
      .filter(cat => cat.type === selectedTab)
      .filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.shortName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [categoryStats, selectedTab, searchQuery]);

  const handleEditCategory = (category: CategoryStats) => {
    // TODO: Navigate to category edit screen
    Alert.alert('Edit Category', `Edit ${category.name} category (Coming Soon)`);
  };

  const handleDeleteCategory = (category: CategoryStats) => {
    Alert.alert(
      t('categories.deleteCategory'),
      `Are you sure you want to delete "${category.name}" category?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement category deletion
            Alert.alert('Coming Soon', 'Category deletion will be implemented soon');
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'Never') return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: t('categories.title'),
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
            <Text className="text-2xl font-bold text-gray-800 mb-2">{t('categories.manageCategories')}</Text>
            <Text className="text-gray-600">Organize and track your transaction categories</Text>
          </View>

          {/* Search Bar */}
          <View className="mb-6">
            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
              <Icon name="search" size={20} color="#999" />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="Search categories..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Tab Selector */}
          <View className="mb-6">
            <View className="flex-row bg-white rounded-xl p-2 shadow-sm">
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg ${
                  selectedTab === 'expense' ? 'bg-red-500' : 'bg-transparent'
                }`}
                onPress={() => setSelectedTab('expense')}
              >
                <Text
                  className={`text-center font-medium ${
                    selectedTab === 'expense' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {t('categories.expenseCategories')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg ${
                  selectedTab === 'income' ? 'bg-green-500' : 'bg-transparent'
                }`}
                onPress={() => setSelectedTab('income')}
              >
                <Text
                  className={`text-center font-medium ${
                    selectedTab === 'income' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {t('categories.incomeCategories')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category List */}
          <View className="mb-6">
            {filteredCategories.length === 0 ? (
              <View className="bg-white rounded-xl p-8 shadow-sm">
                <Text className="text-center text-gray-500 text-lg mb-2">No categories found</Text>
                <Text className="text-center text-gray-400">Try adjusting your search or add new categories</Text>
              </View>
            ) : (
              <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredCategories.map((category, index) => (
                  <View
                    key={category.name}
                    className={`p-4 ${
                      index < filteredCategories.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    {/* Category Header */}
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1">
                        <View 
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          <Text className="text-lg">{category.icon}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-medium text-gray-800">{category.name}</Text>
                          <Text className="text-sm text-gray-500">{category.shortName}</Text>
                        </View>
                      </View>
                      
                      {/* Action Buttons */}
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center"
                          onPress={() => handleEditCategory(category)}
                        >
                          <Icon name="edit" size={14} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                          onPress={() => handleDeleteCategory(category)}
                        >
                          <Icon name="trash" size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Category Stats */}
                    <View className="flex-row justify-between">
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">{t('categories.totalAmount')}</Text>
                        <Text className={`text-sm font-semibold ${
                          selectedTab === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(category.totalAmount)}
                        </Text>
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">{t('categories.totalTransactions')}</Text>
                        <Text className="text-sm font-semibold text-gray-700">
                          {category.totalTransactions}
                        </Text>
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">{t('categories.averageAmount')}</Text>
                        <Text className="text-sm font-semibold text-gray-700">
                          {formatCurrency(category.averageAmount)}
                        </Text>
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">{t('categories.lastUsed')}</Text>
                        <Text className="text-sm font-semibold text-gray-700">
                          {formatDate(category.lastUsed)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Add Category Button */}
          <TouchableOpacity 
            className="bg-blue-500 rounded-xl p-4 shadow-sm mb-4"
            onPress={() => router.push(`/add-category?type=${selectedTab}`)}
          >
            <View className="flex-row items-center justify-center">
              <Icon name="plus" size={18} color="white" />
              <Text className="text-white text-center font-semibold text-lg ml-2">
                {t('categories.addNewCategory')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Summary Stats */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">{t('categories.usageStats')}</Text>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">
                {selectedTab === 'income' ? t('categories.incomeCategories') : t('categories.expenseCategories')}:
              </Text>
              <Text className="font-semibold text-gray-800">{filteredCategories.length}</Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">{t('categories.totalTransactions')}:</Text>
              <Text className="font-semibold text-gray-800">
                {filteredCategories.reduce((sum, cat) => sum + cat.totalTransactions, 0)}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">{t('categories.totalAmount')}:</Text>
              <Text className={`font-semibold ${
                selectedTab === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(filteredCategories.reduce((sum, cat) => sum + cat.totalAmount, 0))}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
