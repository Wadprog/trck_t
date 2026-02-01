import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Themed';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';

export default function MoreScreen() {
  const { t } = useTranslation();
  
  const menuItems = [
    {
      title: t('more.accountSettings'),
      subtitle: t('more.accountSettingsDesc'),
      icon: 'user',
      onPress: () => console.log('Navigate to account settings'),
      disabled: true,
    },
    {
      title: t('more.categories'),
      subtitle: t('more.categoriesDesc'),
      icon: 'tags',
      onPress: () => router.push('/categories'),
      disabled: false,
    },
    {
      title: 'Wallets & Sources',
      subtitle: 'Manage your accounts and payment methods',
      icon: 'wallet',
      onPress: () => router.push('/wallets'),
      disabled: false,
    },
    {
      title: 'Invite Collaborators',
      subtitle: 'Share financial workspace access with trusted people',
      icon: 'user-plus',
      onPress: () => router.push('/invite'),
      disabled: false,
    },
    {
      title: 'Apollo GraphQL Test',
      subtitle: 'Test backend connection and view schema',
      icon: 'database',
      onPress: () => router.push('/apollo-test'),
      disabled: false,
    },
    {
      title: t('more.reports'),
      subtitle: t('more.reportsDesc'),
      icon: 'bar-chart',
      onPress: () => console.log('Navigate to reports'),
      disabled: true,
    },
    {
      title: t('more.exportData'),
      subtitle: t('more.exportDataDesc'),
      icon: 'download',
      onPress: () => console.log('Export data'),
      disabled: true,
    },
    {
      title: t('more.backupSync'),
      subtitle: t('more.backupSyncDesc'),
      icon: 'cloud',
      onPress: () => console.log('Navigate to backup'),
      disabled: true,
    },
    {
      title: t('more.notifications'),
      subtitle: t('more.notificationsDesc'),
      icon: 'bell',
      onPress: () => console.log('Navigate to notifications'),
      disabled: true,
    },
    {
      title: t('more.helpSupport'),
      subtitle: t('more.helpSupportDesc'),
      icon: 'question-circle',
      onPress: () => console.log('Navigate to help'),
      disabled: true,
    },
    {
      title: t('more.about'),
      subtitle: t('more.aboutDesc'),
      icon: 'info-circle',
      onPress: () => router.push('/about'),
      disabled: false,
    },
  ];


  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-800 mb-6">{t('more.title')}</Text>

        {/* Menu Items */}
        <View className="bg-white rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              className={`flex-row items-center p-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              } ${item.disabled ? 'opacity-40' : ''}`}
              onPress={item.disabled ? undefined : item.onPress}
              disabled={item.disabled}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                item.disabled ? 'bg-gray-50' : 'bg-gray-100'
              }`}>
                <Icon 
                  name={item.icon as any} 
                  size={18} 
                  color={item.disabled ? "#999" : "#666"} 
                />
              </View>
              <View className="flex-1">
                <Text className={`text-base font-medium mb-1 ${
                  item.disabled ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  {item.title}
                </Text>
                <Text className={`text-sm ${
                  item.disabled ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {item.subtitle}
                </Text>
              </View>
              <Icon 
                name="chevron-right" 
                size={16} 
                color={item.disabled ? "#ccc" : "#999"} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-center text-gray-500 text-sm mb-2">{t('more.appName')}</Text>
          <Text className="text-center text-gray-400 text-xs">{t('more.version')} 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}
