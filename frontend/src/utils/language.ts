import type { AppLanguage } from '@app-types';

// UI language is kept in sessionStorage (NOT localStorage): it resets to the
// Bulgarian default on every new browser session. See CLAUDE.md Phase 9 rules.
const SESSION_KEY = 'ti_lang';

export function getSessionLanguage(): AppLanguage {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'en' ? 'en' : 'bg';
  } catch {
    return 'bg';
  }
}

export function setSessionLanguage(language: AppLanguage): void {
  try {
    sessionStorage.setItem(SESSION_KEY, language);
  } catch {
    /* sessionStorage unavailable (e.g. private mode) — ignore */
  }
}

// Language is URL-driven: a leading `/en` segment means English, anything else
// is the Bulgarian default. Crawlers (no session) resolve language from the URL alone.
export function languageFromPath(pathname: string): AppLanguage {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'bg';
}

// Bulgarian-canonical / Latin / legacy detail-page prefixes (a non-/en detail
// page is authoritatively Bulgarian — its URL decides, not the session).
const BG_DETAIL_PREFIXES = ['/парапланер-старт/', '/paragliding-site/', '/site/'];

function decodePath(pathname: string): string {
  if (!pathname.includes('%')) return pathname;
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

// Resolve the language for a given path. Detail pages are URL-authoritative
// (`/en` → English, otherwise Bulgarian) so toggling there is deterministic and
// race-free. Every other page (home, filter, …) follows the persisted session
// language, so an English choice survives navigation until the session ends.
export function resolveLanguageForPath(pathname: string): AppLanguage {
  if (languageFromPath(pathname) === 'en') return 'en';
  if (BG_DETAIL_PREFIXES.some((p) => decodePath(pathname).startsWith(p))) return 'bg';
  return getSessionLanguage();
}

// Initial language for i18n init (runs before React mounts). The URL wins;
// an /en entry also persists the choice to the session.
export function resolveInitialLanguage(pathname: string): AppLanguage {
  const fromPath = languageFromPath(pathname);
  if (fromPath === 'en') {
    setSessionLanguage('en');
  }
  return fromPath;
}
