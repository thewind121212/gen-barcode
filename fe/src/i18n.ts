import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLoading from '@Jade/locales/en/loading.json';
import viLoading from '@Jade/locales/vi/loading.json';
import enAuth from '@Jade/locales/en/auth.json';
import viAuth from '@Jade/locales/vi/auth.json';
import enCategory from '@Jade/locales/en/category.json';
import viCategory from '@Jade/locales/vi/category.json';

const resources = {
  en: {
    loading: enLoading,
    auth: enAuth,
    category: enCategory,
  },
  vi: {
    loading: viLoading,
    auth: viAuth,
    category: viCategory,
  },
} as const;

const STORAGE_KEY = 'app.language';
const fallbackLng = 'en';
const initialLng =
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY) || fallbackLng
    : fallbackLng;

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng,
  supportedLngs: ['en', 'vi'],
  ns: ['loading', 'auth', 'category'],
  defaultNS: 'loading',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, lng);
});

export const handleChangeLanguage = () => {
  const next = i18n.language === 'en' ? 'vi' : 'en';
  i18n.changeLanguage(next);
  localStorage.setItem('app.language', next);
}

export default i18n;

