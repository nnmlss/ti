import { useTranslation } from 'react-i18next';
import { setSessionLanguage } from '@utils/language';
import type { AppLanguage, UseLanguageReturn } from '@app-types';

// Reads the active language and changes it in place (session + i18n + <html lang>).
// On site-detail pages the LanguageSwitcher navigates to the other-language URL
// instead, and the route-sync hook then applies the change — but `change` is the
// fallback for any surface without a dedicated URL form.
export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();
  const current: AppLanguage = i18n.language === 'en' ? 'en' : 'bg';

  const change = (target: AppLanguage): void => {
    setSessionLanguage(target);
    void i18n.changeLanguage(target);
    document.documentElement.lang = target;
  };

  return { current, change };
}
