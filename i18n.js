import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationENG from "./public/locales/en/common.json";
import translationTR from "./public/locales/tr/common.json";
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: translationENG,
      },
      tr: {
        common: translationTR,
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;
