import type { Request, Response } from 'express';
import { Site } from '@models/sites.js';
import { enSlug } from '@utils/slug.js';
import { logger } from '@config/logger.js';
import type { CustomError } from '@types';

export const generateSitemap = async (_req: Request, res: Response) => {
  try {
    const sites = await Site.find({}, 'id title url').lean<Array<{ id?: number; title?: { bg?: string; en?: string }; url?: string }>>();
    
    const baseUrl = process.env['FRONTEND_URL'] || 'https://paragliding.borislav.space';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${sites
  .map(site => {
    const url = site.url || site.id;
    const lastmod = new Date().toISOString();
    const bgUrl = `${baseUrl}/парапланер-старт/${url}`;
    const enUrl = `${baseUrl}/en/paragliding-site/${enSlug(site)}`;
    // Each language variant lists all alternates (incl. itself) per Google's
    // hreflang sitemap spec. BG is x-default. The Latin /paragliding-site/ URL is
    // omitted on purpose — it 301-redirects to the BG canonical.
    const alternates = `    <xhtml:link rel="alternate" hreflang="bg" href="${bgUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${bgUrl}"/>`;

    return `  <url>
    <loc>${bgUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternates}
  </url>
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternates}
  </url>`;
  })
  .join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    logger.error('Sitemap generation error:', error);
    const customError: CustomError = {
      message: 'Failed to generate sitemap',
      status: 500,
      name: 'SitemapError',
    };
    throw customError;
  }
};