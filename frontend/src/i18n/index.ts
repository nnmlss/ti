import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resolveInitialLanguage } from '@utils/language';
import bg from './locales/bg.json';
import en from './locales/en.json';

// Single `translation` namespace; resources bundled statically (no async backend).
// Initial language is URL-driven (see resolveInitialLanguage). Bulgarian is the
// fallback so any not-yet-translated key renders Bulgarian rather than the raw key.
void i18n.use(initReactI18next).init({
  resources: {
    bg: { translation: bg },
    en: { translation: en },
  },
  lng: resolveInitialLanguage(window.location.pathname),
  fallbackLng: 'bg',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
