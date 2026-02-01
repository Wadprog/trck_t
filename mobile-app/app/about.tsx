import React from 'react';
import { ScrollView, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';

export default function AboutScreen() {
  const { t } = useTranslation();

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const handleContactSupport = () => {
    const email = 'support@trackit-app.com';
    const subject = 'TrackIt Support Request';
    const body = 'Hello TrackIt team,\n\nI need help with:\n\n';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    handleOpenLink(mailtoUrl);
  };

  const handleRateApp = () => {
    // Replace with actual app store URLs
    const iosUrl = 'https://apps.apple.com/app/trackit';
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.trackit';
    
    Alert.alert(
      'Rate TrackIt',
      'Would you like to rate our app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rate on App Store', onPress: () => handleOpenLink(iosUrl) },
        { text: 'Rate on Play Store', onPress: () => handleOpenLink(androidUrl) },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'About TrackIt',
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
          {/* App Header */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm items-center">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
              <Icon name="line-chart" size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">TrackIt</Text>
            <Text className="text-lg text-gray-600 mb-2">Personal Finance Manager</Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-800 font-medium">Version 1.0.0</Text>
            </View>
          </View>

          {/* App Description */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">About This App</Text>
            <Text className="text-gray-600 leading-6 mb-4">
              TrackIt is a comprehensive personal finance management app designed to help you take control of your money. 
              Track expenses, manage budgets, organize multiple wallets, and gain insights into your spending patterns.
            </Text>
            <Text className="text-gray-600 leading-6">
              With features like multi-wallet support, transaction sources, collaboration tools, and detailed analytics, 
              TrackIt makes managing your finances simple and effective.
            </Text>
          </View>

          {/* Key Features */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Key Features</Text>
            
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Icon name="money" size={20} color="#4F46E5" />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-800">Multi-Wallet Management</Text>
                  <Text className="text-sm text-gray-600">Organize accounts across multiple wallets</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Icon name="credit-card-alt" size={20} color="#059669" />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-800">Transaction Sources</Text>
                  <Text className="text-sm text-gray-600">Track spending across different payment methods</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Icon name="bar-chart" size={20} color="#DC2626" />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-800">Budget Analytics</Text>
                  <Text className="text-sm text-gray-600">Detailed insights and spending breakdowns</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Icon name="users" size={20} color="#7C3AED" />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-800">Collaboration</Text>
                  <Text className="text-sm text-gray-600">Invite others to collaborate on finances</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <Icon name="shield" size={20} color="#059669" />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-800">Secure & Private</Text>
                  <Text className="text-sm text-gray-600">Your financial data stays secure</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact & Support */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Contact & Support</Text>
            
            <TouchableOpacity 
              className="flex-row items-center justify-between p-3 border border-gray-200 rounded-lg mb-3"
              onPress={handleContactSupport}
            >
              <View className="flex-row items-center">
                <Icon name="envelope" size={20} color="#4F46E5" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Contact Support</Text>
                  <Text className="text-sm text-gray-600">Get help with any issues</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-between p-3 border border-gray-200 rounded-lg mb-3"
              onPress={handleRateApp}
            >
              <View className="flex-row items-center">
                <Icon name="star" size={20} color="#F59E0B" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Rate This App</Text>
                  <Text className="text-sm text-gray-600">Help us improve TrackIt</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-between p-3 border border-gray-200 rounded-lg"
              onPress={() => handleOpenLink('https://trackit-app.com/privacy')}
            >
              <View className="flex-row items-center">
                <Icon name="file-text" size={20} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Privacy Policy</Text>
                  <Text className="text-sm text-gray-600">How we protect your data</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Developer Info */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Developer</Text>
            <Text className="text-gray-600 mb-2">TrackIt Team</Text>
            <Text className="text-sm text-gray-500 mb-4">
              Passionate about helping people manage their finances better
            </Text>
            
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
                onPress={() => handleOpenLink('https://trackit-app.com')}
              >
                <Icon name="external-link" size={16} color="#4F46E5" />
                <Text className="text-blue-600 font-medium ml-2">Website</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg"
                onPress={() => handleOpenLink('https://twitter.com/trackit')}
              >
                <Icon name="twitter" size={16} color="#1DA1F2" />
                <Text className="text-gray-600 font-medium ml-2">Twitter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Technical Info */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Technical Information</Text>
            
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Version:</Text>
                <Text className="font-medium text-gray-800">1.0.0</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Build:</Text>
                <Text className="font-medium text-gray-800">2025.01.001</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Platform:</Text>
                <Text className="font-medium text-gray-800">React Native</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Last Updated:</Text>
                <Text className="font-medium text-gray-800">January 2025</Text>
              </View>
            </View>
          </View>

          {/* Copyright */}
          <View className="bg-gray-100 rounded-xl p-4 items-center">
            <Text className="text-sm text-gray-500 text-center">
              © 2025 TrackIt Team. All rights reserved.
            </Text>
            <Text className="text-xs text-gray-400 text-center mt-2">
              Made with ❤️ for better financial management
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
