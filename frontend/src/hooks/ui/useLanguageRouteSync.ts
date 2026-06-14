import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resolveLanguageForPath, setSessionLanguage } from '@utils/language';

// Resolves the active language on every navigation. Detail pages are
// URL-authoritative (`/en` → English, otherwise Bulgarian) so toggling there is
// deterministic; other pages follow the persisted session `ti_lang`, so an English
// choice survives navigation — including the front page — until the session ends.
// Runs inside <Router>; the single authority that flips i18n, sessionStorage and
// <html lang>.
export function useLanguageRouteSync(): void {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const lang = resolveLanguageForPath(pathname);
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }
    setSessionLanguage(lang);
    document.documentElement.lang = lang;
  }, [pathname, i18n]);
}
