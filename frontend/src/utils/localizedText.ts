import type { AppLanguage, LocalizedText } from '@app-types';

// Pick the field for the active language, falling back to the other language so a
// missing translation never renders empty. Bulgarian is the ultimate fallback.
export function getLocalized(
  text: LocalizedText | undefined,
  language: AppLanguage
): string {
  if (!text) return '';
  if (language === 'en') return text.en || text.bg || '';
  return text.bg || text.en || '';
}
