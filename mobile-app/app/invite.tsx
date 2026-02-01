import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert, Share, Linking } from 'react-native';
import { Text } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Icon from '@expo/vector-icons/FontAwesome';

const APP_NAME = "TrackIt";
const APP_STORE_URL = "https://apps.apple.com/app/trackit"; // Replace with actual URL
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.trackit"; // Replace with actual URL
const WEB_URL = "https://trackit.app"; // Replace with actual URL

export default function InviteScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invitesSent, setInvitesSent] = useState(0);

  const defaultMessage = `Hey! I'd like to invite you to collaborate on my financial tracking in ${APP_NAME}! 💰

🤝 What you'll be able to do:
• View my transactions and financial data
• Add new transactions on my behalf
• Create and manage wallets and accounts
• Help with budgeting and financial planning
• Full collaborative access to my finances

This will help us stay on the same page with our money management. You'll have your own secure access!`;

  const shareMessage = customMessage || defaultMessage;
  const fullShareMessage = `${shareMessage}\n\nJoin my ${APP_NAME} workspace:\n� Invitation Link: ${WEB_URL}/invite/abc123\n📱 Download ${APP_NAME}: ${APP_STORE_URL}\n\nAccept this invitation to start collaborating on our finances together!`;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailInvite = async () => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), 'Please enter an email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert(t('common.error'), 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for sending invite email
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would call your backend API here to create a collaboration invite
      const inviteData = {
        email: email.trim(),
        message: shareMessage,
        inviterName: 'User', // Get from user profile
        permissions: ['view_transactions', 'create_transactions', 'manage_wallets', 'manage_categories'],
        inviteType: 'collaboration',
        expiresIn: '7 days'
      };

      console.log('Sending email invite:', inviteData);
      
      // Update invite counter
      setInvitesSent(prev => prev + 1);

      Alert.alert(
        t('common.success'),
        `Collaboration invite sent to ${email} successfully! 🎉\n\nThey'll receive an email with secure access to your financial workspace.`,
        [
          {
            text: 'Invite Another',
            onPress: () => setEmail('')
          },
          {
            text: 'Manage Access',
            onPress: () => {
              // TODO: Navigate to collaboration management page
              Alert.alert('Coming Soon', 'Collaboration management page will be available soon!');
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform?: string) => {
    try {
      const shareOptions = {
        message: fullShareMessage,
        title: `Join me on ${APP_NAME}!`,
      };

      if (platform) {
        // Platform-specific sharing
        let url = '';
        switch (platform) {
          case 'whatsapp':
            url = `whatsapp://send?text=${encodeURIComponent(fullShareMessage)}`;
            break;
          case 'telegram':
            url = `tg://msg?text=${encodeURIComponent(fullShareMessage)}`;
            break;
          case 'sms':
            url = `sms:?body=${encodeURIComponent(fullShareMessage)}`;
            break;
          case 'email':
            url = `mailto:?subject=${encodeURIComponent(`Join me on ${APP_NAME}!`)}&body=${encodeURIComponent(fullShareMessage)}`;
            break;
        }

        if (url) {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
          } else {
            throw new Error(`${platform} is not available on this device`);
          }
        }
      } else {
        // Native share dialog
        await Share.share(shareOptions);
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert(t('common.error'), 'Unable to share. Please try another method.');
    }
  };

  const handleCopyLink = async () => {
    try {
      // For now, we'll show a simple alert with the message
      // In a real app, you would install expo-clipboard or use a clipboard library
      Alert.alert(
        'Copy Message',
        fullShareMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Share Instead', 
            onPress: () => handleShare() 
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to copy to clipboard');
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      platform: 'whatsapp'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088CC',
      platform: 'telegram'
    },
    {
      name: 'SMS',
      icon: '💬',
      color: '#007AFF',
      platform: 'sms'
    },
    {
      name: 'Email',
      icon: '📧',
      color: '#FF6B35',
      platform: 'email'
    },
    {
      name: 'More',
      icon: '⋯',
      color: '#666',
      platform: null
    }
  ];

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Invite Collaborators',
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
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6">
            <Text className="text-white text-2xl font-bold mb-2">Invite Collaborator</Text>
            <Text className="text-white opacity-90 text-base">
              Share access to your financial workspace. Invite trusted people to help manage your finances together.
            </Text>
          </View>

          {/* Collaboration Info */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">🤝</Text>
              <Text className="text-blue-800 font-semibold text-lg">Collaborative Access</Text>
            </View>
            <Text className="text-blue-700 text-sm mb-3">
              Invited collaborators will be able to:
            </Text>
            <View className="space-y-1">
              <Text className="text-blue-700 text-sm">• View all transactions and balances</Text>
              <Text className="text-blue-700 text-sm">• Add new transactions and transfers</Text>
              <Text className="text-blue-700 text-sm">• Create and manage wallets & sources</Text>
              <Text className="text-blue-700 text-sm">• Manage categories and budgets</Text>
              <Text className="text-blue-700 text-sm">• Export reports and data</Text>
            </View>
          </View>

          {/* Invitation Stats */}
          {invitesSent > 0 && (
            <View className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-green-800 font-semibold text-lg">Invites Sent! 📤</Text>
                  <Text className="text-green-700 text-sm">
                    You've sent {invitesSent} collaboration invite{invitesSent > 1 ? 's' : ''} this session
                  </Text>
                </View>
                <View className="bg-white px-4 py-2 rounded-lg border border-green-300">
                  <Text className="text-green-800 font-bold text-2xl">{invitesSent}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Email Invite */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Send Collaboration Invite</Text>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Collaborator's Email</Text>
              <TextInput
                className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
                placeholder="partner@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <Text className="text-xs text-gray-500 mt-1">
                They'll receive a secure invitation link via email
              </Text>
            </View>

            <TouchableOpacity 
              className={`rounded-lg p-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
              onPress={handleEmailInvite}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Icon name="spinner" size={16} color="white" className="mr-2" />
                )}
                <Text className="text-white font-semibold">
                  {isLoading ? 'Sending Invite...' : 'Send Collaboration Invite'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Share Options */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Share Invitation Link</Text>
            
            <View className="flex-row flex-wrap gap-3">
              {shareOptions.map((option) => (
                <TouchableOpacity
                  key={option.name}
                  className="flex-1 min-w-[90px] items-center p-3 bg-gray-50 rounded-lg"
                  onPress={() => handleShare(option.platform || undefined)}
                >
                  <Text className="text-3xl mb-2">{option.icon}</Text>
                  <Text className="text-sm font-medium text-gray-700">{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Message */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Personal Message (Optional)</Text>
            
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
              placeholder="Add a personal note about why you're inviting them..."
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
            
            <Text className="text-sm text-gray-500 mt-2">
              This will be included in the invitation message
            </Text>
          </View>

          {/* Message Preview */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-800">Invitation Preview</Text>
              <TouchableOpacity
                className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
                onPress={handleCopyLink}
              >
                <Icon name="copy" size={14} color="#3B82F6" className="mr-1" />
                <Text className="text-blue-600 text-sm font-medium">Copy</Text>
              </TouchableOpacity>
            </View>
            
            <View className="bg-gray-50 rounded-lg p-3">
              <Text className="text-gray-700 text-sm leading-5">
                {shareMessage}
              </Text>
              <View className="mt-3 pt-3 border-t border-gray-200">
                <Text className="text-gray-600 text-xs">
                  Join my {APP_NAME} workspace:
                </Text>
                <Text className="text-blue-600 text-xs mt-1">
                  � Invitation Link: {WEB_URL}/invite/abc123
                </Text>
                <Text className="text-blue-600 text-xs">
                  📱 Download {APP_NAME}: {APP_STORE_URL}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <TouchableOpacity 
              className="bg-green-500 rounded-xl p-4 shadow-sm"
              onPress={() => handleShare('whatsapp')}
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-2xl mr-3">💬</Text>
                <Text className="text-white text-center font-semibold text-lg">
                  Send via WhatsApp
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-500 rounded-xl p-4 shadow-sm"
              onPress={() => handleShare()}
            >
              <View className="flex-row items-center justify-center">
                <Icon name="share" size={18} color="white" className="mr-3" />
                <Text className="text-white text-center font-semibold text-lg">
                  More Sharing Options
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Current Collaborators */}
          <View className="bg-white rounded-xl p-4 mt-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-800">Current Collaborators</Text>
              <TouchableOpacity className="bg-blue-50 px-3 py-2 rounded-lg">
                <Text className="text-blue-600 text-sm font-medium">Manage</Text>
              </TouchableOpacity>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">You</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">You (Owner)</Text>
                  <Text className="text-sm text-gray-600">Full access to all features</Text>
                </View>
                <View className="bg-green-100 px-2 py-1 rounded">
                  <Text className="text-green-700 text-xs font-medium">Owner</Text>
                </View>
              </View>
              
              <View className="flex-row items-center p-3 bg-gray-50 rounded-lg opacity-50">
                <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center mr-3">
                  <Icon name="plus" size={16} color="#666" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-600">Invite collaborators</Text>
                  <Text className="text-sm text-gray-500">Send invites to start collaborating</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Invitation Code */}
          <View className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-blue-800 font-semibold mb-1">Quick Invite Code</Text>
                <Text className="text-blue-700 text-sm">Share this code for instant access</Text>
              </View>
              <View className="bg-white px-4 py-2 rounded-lg border border-blue-300">
                <Text className="text-blue-800 font-mono font-bold">COLLAB2025</Text>
              </View>
            </View>
          </View>

          {/* Security Notice */}
          <View className="bg-amber-50 rounded-xl p-4 mt-6 border border-amber-200">
            <View className="flex-row items-start">
              <Icon name="shield" size={20} color="#F59E0B" />
              <View className="flex-1 ml-3">
                <Text className="text-amber-800 font-medium mb-2">Security & Privacy</Text>
                <Text className="text-amber-700 text-sm mb-2">
                  Collaborators will have access to your financial data. Only invite people you trust completely.
                </Text>
                <Text className="text-amber-700 text-sm">
                  • You can revoke access at any time
                  • All actions are logged and tracked
                  • Invitations expire after 7 days
                </Text>
              </View>
            </View>
          </View>

          {/* Footer Note */}
          <View className="mt-6 p-4">
            <Text className="text-center text-gray-500 text-sm">
              By inviting collaborators, you agree to our Terms of Service and Privacy Policy.
              Collaborator access can be revoked at any time from your account settings.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
