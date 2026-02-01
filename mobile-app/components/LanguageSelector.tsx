import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    onLanguageChange?.(languageCode);
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Language / Idioma / Langue</Text>
      <View className="space-y-2">
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            className={`flex-row items-center p-3 rounded-lg border ${
              i18n.language === language.code
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
            onPress={() => changeLanguage(language.code)}
          >
            <Text className="text-2xl mr-3">{language.flag}</Text>
            <Text
              className={`text-base font-medium ${
                i18n.language === language.code ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {language.name}
            </Text>
            {i18n.language === language.code && (
              <View className="ml-auto w-5 h-5 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LanguageSelector;
