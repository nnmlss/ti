// i18n / language-switching types — single source of truth (see types/index.ts barrel)

export type AppLanguage = 'bg' | 'en';

export interface UseLanguageReturn {
  current: AppLanguage;
  change: (target: AppLanguage) => void;
}

export interface LanguageSwitcherProps {
  align?: 'center' | 'start' | 'end';
  // Per-language URLs for site-detail pages. When provided, clicking a language
  // navigates there (the route then drives the language). When omitted, the
  // language changes in place via useLanguage().change.
  bgUrl?: string;
  enUrl?: string;
  // Compact mode: render only the language to switch TO, as a single text link
  // sized like a subtitle (used inside the wind-filter title).
  compact?: boolean;
}
