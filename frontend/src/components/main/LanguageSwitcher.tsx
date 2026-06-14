import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@hooks/ui/useLanguage';
import type { AppLanguage, LanguageSwitcherProps } from '@app-types';

const JUSTIFY = { center: 'center', start: 'flex-start', end: 'flex-end' } as const;

// Plain text toggle `български : english` (no flags/icons). The inactive language
// is the clickable link; the active one is shown bold. See CLAUDE.md Phase 9 rule 6.
// On site-detail pages it navigates to the other-language URL (the route then
// drives the language); elsewhere it switches in place.
const LABEL: Record<AppLanguage, string> = { bg: 'български', en: 'english' };

export function LanguageSwitcher({ align = 'center', bgUrl, enUrl, compact }: LanguageSwitcherProps) {
  const { current, change } = useLanguage();
  const navigate = useNavigate();

  const select = (target: AppLanguage): void => {
    const url = target === 'en' ? enUrl : bgUrl;
    if (url) {
      // Detail page: just navigate. The route-sync hook is the single authority
      // that applies the language for the destination URL — calling change() here
      // too would cause an intermediate (old-URL) session write / flicker.
      navigate(url);
      return;
    }
    // Non-detail surface (e.g. the wind filter): switch in place.
    change(target);
  };

  // Compact: a single link to the OTHER language, sized like a subtitle.
  if (compact) {
    const target: AppLanguage = current === 'en' ? 'bg' : 'en';
    return (
      <Link
        component='button'
        type='button'
        variant='subtitle2'
        onClick={() => select(target)}
        sx={{ color: 'primary.main', textDecoration: 'underline' }}
      >
        {LABEL[target]}
      </Link>
    );
  }

  const renderWord = (lang: AppLanguage, label: string) =>
    current === lang ? (
      <Typography component='span' sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary' }}>
        {label}
      </Typography>
    ) : (
      <Link
        component='button'
        type='button'
        onClick={() => select(lang)}
        sx={{ color: 'primary.main', fontSize: 13, textDecoration: 'underline' }}
      >
        {label}
      </Link>
    );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: JUSTIFY[align],
        alignItems: 'baseline',
        gap: 1,
        pt: 0,
        pb: 1,
      }}
    >
      {renderWord('bg', 'български')}
      <Typography component='span' sx={{ color: 'text.secondary', fontSize: 13 }}>
        :
      </Typography>
      {renderWord('en', 'english')}
    </Box>
  );
}
