import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    detection: { order: ['localStorage', 'navigator'] },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
  });

export default i18n;
