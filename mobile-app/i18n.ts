import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  fr: {
    translation: frTranslation,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v4', // For React Native compatibility
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    
    keySeparator: '.', // we use keys in form messages.welcome
    
    interpolation: {
      escapeValue: false, // react already does escaping
    },
    
    // React i18next options
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18n;
