import type { AppLanguage, FlyingSite, LocalizedText } from '@app-types';

// Slugify a raw title string (Cyrillic + Latin kept).
function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\u0400-\u04FF\w-]/g, '') // Keep only Cyrillic letters, Latin letters, numbers, and hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();

  return slug || 'site';
}

// Bulgarian slug (the stored `url` is generated from this).
export function generateSiteSlug(title: LocalizedText): string {
  return slugify(title.bg || title.en || '');
}

// English slug for the /en route \u2014 derived from the English title so the URL reads
// in English. Falls back to the stored Bulgarian `url` slug when a site has no
// English title (so the link is still resolvable). Kept in sync with the server
// resolver in src/middleware/ogMetaMiddleware.ts.
export function getEnSlug(site: FlyingSite): string {
  return site.title.en ? slugify(site.title.en) : site.url || generateSiteSlug(site.title);
}

// Check if slug is numeric (old ID-based URL)
export function isNumericSlug(slug: string): boolean {
  return /^\d+$/.test(slug);
}

// Extract ID from numeric slug
export function extractIdFromSlug(slug: string): number | null {
  return isNumericSlug(slug) ? parseInt(slug, 10) : null;
}

// Generate SEO-friendly site URL using database url field. Bulgarian is the
// default/canonical (Cyrillic keyword route); English uses the /en/ Latin route.
export function getSiteUrl(site: FlyingSite, language: AppLanguage = 'bg'): string {
  if (language === 'en') {
    return `/en/paragliding-site/${getEnSlug(site)}`;
  }
  // Use the url field from database, fallback to generated slug
  const slug = site.url || generateSiteSlug(site.title);
  return `/парапланер-старт/${slug}`;
}

// Self-referencing canonical URL for the given language (EN→EN, BG→BG).
export function getCanonicalSiteUrl(site: FlyingSite, language: AppLanguage = 'bg'): string {
  return getSiteUrl(site, language);
}

// Extract site name from URL slug for SEO (before data loads)
export function extractSiteNameFromSlug(slug: string): string {
  if (!slug || isNumericSlug(slug)) {
    return 'Място за летене';
  }
  
  // Convert kebab-case slug back to title case
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
