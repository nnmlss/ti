// Slug helpers — MUST stay in sync with frontend/src/utils/slugUtils.ts.

type SlugSite = { title?: { bg?: string; en?: string }; url?: string };

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^Ѐ-ӿ\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim() || 'site';

// English slug for the /en route: slugified English title, falling back to the
// stored Bulgarian `url` when a site has no English title.
export const enSlug = (site: SlugSite): string =>
  site.title?.en ? slugify(site.title.en) : site.url || slugify(site.title?.bg || '');
