import type { FlyingSite, LocalizedText } from '@types';

// Generate clean slug from Bulgarian site title (no ID)
export function generateSiteSlug(title: LocalizedText): string {
  const siteTitle = title.bg || title.en || '';
  const slug = siteTitle
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .trim();
  
  return slug || 'site';
}

// Check if slug is numeric (old ID-based URL)
export function isNumericSlug(slug: string): boolean {
  return /^\d+$/.test(slug);
}

// Extract ID from numeric slug
export function extractIdFromSlug(slug: string): number | null {
  return isNumericSlug(slug) ? parseInt(slug, 10) : null;
}

// Generate SEO-friendly site URL using database url field
export function getSiteUrl(site: FlyingSite): string {
  // Use the url field from database, fallback to generated slug
  const slug = site.url || generateSiteSlug(site.title);
  return `/sites/${slug}`;
}

// Generate canonical URL for redirects
export function getCanonicalSiteUrl(site: FlyingSite): string {
  return getSiteUrl(site);
}