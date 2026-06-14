import type { AppLanguage } from '@app-types';

// Compass letters → Bulgarian (С/И/Ю/З). Wind-direction codes (N, NNE, …) are
// stored in Latin everywhere; this localizes only the DISPLAY label.
const BG_LETTER: Record<string, string> = { N: 'С', E: 'И', S: 'Ю', W: 'З' };

export function localizeWindDirection(direction: string, language: AppLanguage): string {
  if (language === 'en') return direction;
  return direction.replace(/[NESW]/g, (ch) => BG_LETTER[ch] ?? ch);
}
