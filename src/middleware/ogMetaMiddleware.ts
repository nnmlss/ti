import { readFile } from 'fs/promises';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';
import { Site } from '@models/sites.js';
import { logger } from '@config/logger.js';
import type { FlyingSite } from '@types';

// Narrow projection of the fields needed to build social meta tags
type SiteMetaFields = Pick<
  FlyingSite,
  'title' | 'url' | 'altitude' | 'windDirection' | 'galleryImages'
>;

// Site-detail URL prefixes whose HTML should receive per-site OG/Twitter tags.
// Covers the Latin keyword route, the canonical Cyrillic route and the legacy route.
const SITE_DETAIL_PREFIXES = ['/paragliding-site/', '/парапланер-старт/', '/site/'];

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

const buildMetaTags = (site: SiteMetaFields): string => {
  const baseUrl = process.env['FRONTEND_URL'] || 'https://paragliding.borislav.space';
  const name = site.title?.bg || site.title?.en || '';

  const pageTitle = `Подробна информация за ${name} като място за летене с парапланер в България - TakeOff Info paragliding.borislav.space`;

  const altitudePart = site.altitude ? ` на ${site.altitude}м височина` : '';
  const windPart = site.windDirection?.length
    ? `Подходящи ветрове: ${site.windDirection.join(', ')}.`
    : '';
  const description = `Място за летене с парапланер ${name}${altitudePart}. ${windPart} Посоки на вятъра, подходящи за излитане, височина на старта, методи на достъп до София, старт за летене с парапланер.`;

  const original = site.galleryImages?.[0]?.path;
  const imageUrl = original
    ? `${baseUrl}/gallery/small/${original.replace(/^.*\//, '').replace(/\.[^/.]+$/, '')}.jpg`
    : `${baseUrl}/assets/paragliding-bulgaria-og.jpg`;

  // og:url points at the canonical Bulgarian URL (matches the SPA rel=canonical)
  const pageUrl = `${baseUrl}/парапланер-старт/${site.url ?? ''}`;
  const imageAlt = `Място за летене с парапланер ${name}`;

  const e = escapeHtml;
  return [
    `<meta property="og:title" content="${e(pageTitle)}" />`,
    `<meta property="og:description" content="${e(description)}" />`,
    `<meta property="og:url" content="${e(pageUrl)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="TakeOff Info - Paragliding Bulgaria" />`,
    `<meta property="og:image" content="${e(imageUrl)}" />`,
    `<meta property="og:image:width" content="960" />`,
    `<meta property="og:image:height" content="540" />`,
    `<meta property="og:image:alt" content="${e(imageAlt)}" />`,
    `<meta property="og:locale" content="bg_BG" />`,
    `<meta property="og:locale:alternate" content="en_US" />`,
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

    const identifier = decodedPath.slice(prefix.length).split('/')[0];
    if (!identifier) {
      return next();
    }

    const query = /^\d+$/.test(identifier) ? { _id: Number(identifier) } : { url: identifier };

    const site = await Site.findOne(
      query,
      'title url altitude windDirection galleryImages'
    ).lean<SiteMetaFields>();

    if (!site) {
      return next();
    }

    const template = await getTemplate();
    if (!template.includes(OG_PLACEHOLDER)) {
      return next();
    }

    res.type('html').send(template.replace(OG_PLACEHOLDER, buildMetaTags(site)));
  } catch (error) {
    logger.error('OG meta injection failed', {
      path: req.path,
      error: error instanceof Error ? error.message : String(error),
    });
    next();
  }
};
