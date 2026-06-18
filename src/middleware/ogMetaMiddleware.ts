import { readFile } from 'fs/promises';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';
import { Site } from '@models/sites.js';
import { logger } from '@config/logger.js';
import { enSlug } from '@utils/slug.js';
import type { FlyingSite } from '@types';

// Narrow projection of the fields needed to build social meta tags
type SiteMetaFields = Pick<
  FlyingSite,
  'title' | 'url' | 'altitude' | 'windDirection' | 'galleryImages'
>;

// Site-detail URL prefixes whose HTML should receive per-site OG/Twitter tags.
// `/en/paragliding-site/` MUST come first (the others are substrings of the path
// after the `/en` segment is stripped). Covers the English route, the Latin keyword
// route, the canonical Cyrillic route and the legacy numeric route.
const EN_PREFIX = '/en/paragliding-site/';
const SITE_DETAIL_PREFIXES = [EN_PREFIX, '/paragliding-site/', '/парапланер-старт/', '/site/'];

const OG_PLACEHOLDER = '<!-- __OG_META__ -->';
const INDEX_HTML_PATH = path.join(process.cwd(), 'frontend/dist/index.html');

// The built index.html is immutable at runtime — read once and reuse.
let cachedTemplate: string | null = null;

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string
  );

const getTemplate = async (): Promise<string> => {
  if (cachedTemplate === null) {
    cachedTemplate = await readFile(INDEX_HTML_PATH, 'utf-8');
  }
  return cachedTemplate;
};

// Active-language site name (mirrors the client `getLocalized` fallback).
const siteName = (site: SiteMetaFields, lang: 'bg' | 'en'): string =>
  (lang === 'en' ? site.title?.en || site.title?.bg : site.title?.bg || site.title?.en) || '';

// Agreed title — the same string used for the browser tab, Google and every
// social crawler. Kept short on purpose (long titles get rewritten by Google).
//
// ⚠️ DUPLICATED ON THE FRONTEND — keep in sync with `buildDetailTitle` in
// `frontend/src/utils/pageTitle.ts` (the client renders the same title via
// Helmet/useDocumentTitle). Frontend and backend are separate TS builds
// (`rootDir` per tree) so they can't share a module — if you change a title
// string here, change it there too.
const buildTitle = (name: string, lang: 'bg' | 'en'): string =>
  lang === 'en'
    ? `Paragliding from ${name} | Flying takeoffs in Bulgaria`
    : `Летене с парапланер от ${name} | Информация за стартове за парапланеризъм в България`;

const buildMetaTags = (site: SiteMetaFields, lang: 'bg' | 'en'): string => {
  const baseUrl = process.env['FRONTEND_URL'] || 'https://paragliding.borislav.space';
  const isEn = lang === 'en';
  const name = siteName(site, lang);

  const altitudePart = site.altitude ? (isEn ? ` at ${site.altitude}m` : ` на ${site.altitude}м височина`) : '';
  const windPart = site.windDirection?.length
    ? isEn
      ? ` Suitable winds: ${site.windDirection.join(', ')}.`
      : `Подходящи ветрове: ${site.windDirection.join(', ')}.`
    : '';

  const pageTitle = buildTitle(name, lang);

  const description = isEn
    ? `Paragliding takeoff ${name}${altitudePart}.${windPart} Wind directions, takeoff altitude and access methods for paragliding in Bulgaria.`
    : `Място за летене с парапланер ${name}${altitudePart}. ${windPart} Посоки на вятъра, подходящи за излитане, височина на старта, методи на достъп до София, старт за летене с парапланер.`;

  const original = site.galleryImages?.[0]?.path;
  const imageUrl = original
    ? `${baseUrl}/gallery/small/${original.replace(/^.*\//, '').replace(/\.[^/.]+$/, '')}.jpg`
    : `${baseUrl}/assets/paragliding-bulgaria-og.jpg`;

  const bgUrl = `${baseUrl}/парапланер-старт/${site.url ?? ''}`;
  const enUrl = `${baseUrl}/en/paragliding-site/${enSlug(site)}`;
  // Self-referencing canonical + og:url for the page's own language.
  const pageUrl = isEn ? enUrl : bgUrl;
  const imageAlt = isEn ? `Paragliding site ${name} in Bulgaria` : `Място за летене с парапланер ${name}`;

  const e = escapeHtml;
  return [
    `<link rel="canonical" href="${e(pageUrl)}" />`,
    `<link rel="alternate" hreflang="bg" href="${e(bgUrl)}" />`,
    `<link rel="alternate" hreflang="en" href="${e(enUrl)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${e(bgUrl)}" />`,
    `<meta property="og:title" content="${e(pageTitle)}" />`,
    `<meta property="og:description" content="${e(description)}" />`,
    `<meta property="og:url" content="${e(pageUrl)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="TakeOff Info - Paragliding Bulgaria" />`,
    `<meta property="og:image" content="${e(imageUrl)}" />`,
    `<meta property="og:image:width" content="960" />`,
    `<meta property="og:image:height" content="540" />`,
    `<meta property="og:image:alt" content="${e(imageAlt)}" />`,
    `<meta property="og:locale" content="${isEn ? 'en_US' : 'bg_BG'}" />`,
    `<meta property="og:locale:alternate" content="${isEn ? 'bg_BG' : 'en_US'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(pageTitle)}" />`,
    `<meta name="twitter:description" content="${e(description)}" />`,
    `<meta name="twitter:image" content="${e(imageUrl)}" />`,
  ].join('\n  ');
};

/**
 * Intercepts site-detail page requests from social crawlers (which do not run JS)
 * and injects per-site Open Graph / Twitter meta tags into the static index.html.
 * On any miss or error it falls through to the normal static file serving.
 * MUST be registered before the frontend static middleware in app.ts.
 */
export const ogMetaMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // No Accept-header gate: social crawlers (facebookexternalhit, WhatsApp,
    // Viber) frequently send `Accept: */*`. The site-detail prefix check below
    // is the real guard — asset/API requests never match those prefixes.
    if (req.method !== 'GET') {
      return next();
    }

    // Cyrillic paths may still be percent-encoded depending on the client
    let decodedPath = req.path;
    if (decodedPath.includes('%')) {
      decodedPath = decodeURIComponent(decodedPath);
    }

    const prefix = SITE_DETAIL_PREFIXES.find((p) => decodedPath.startsWith(p));
    if (!prefix) {
      return next();
    }

    const lang: 'bg' | 'en' = prefix === EN_PREFIX ? 'en' : 'bg';

    const identifier = decodedPath.slice(prefix.length).split('/')[0];
    if (!identifier) {
      return next();
    }

    const projection = 'title url altitude windDirection galleryImages';

    let site: SiteMetaFields | null;
    if (lang === 'en') {
      // English slug isn't stored — match the slugified English title across sites
      // (small dataset; crawler traffic is low). Falls through if nothing matches.
      const candidates = await Site.find({}, projection).lean<SiteMetaFields[]>();
      site = candidates.find((s) => enSlug(s) === identifier) ?? null;
    } else {
      const query = /^\d+$/.test(identifier) ? { _id: Number(identifier) } : { url: identifier };
      site = await Site.findOne(query, projection).lean<SiteMetaFields>();
    }

    if (!site) {
      return next();
    }

    const template = await getTemplate();
    if (!template.includes(OG_PLACEHOLDER)) {
      return next();
    }

    // index.html carries the static Home <title>; swap it for the per-site title
    // so crawlers (and the raw HTML) get the agreed copy, then inject OG/Twitter.
    const pageTitle = escapeHtml(buildTitle(siteName(site, lang), lang));
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${pageTitle}</title>`)
      .replace(OG_PLACEHOLDER, buildMetaTags(site, lang));
    res.type('html').send(html);
  } catch (error) {
    logger.error('OG meta injection failed', {
      path: req.path,
      error: error instanceof Error ? error.message : String(error),
    });
    next();
  }
};
