import type { Request, Response } from 'express';
import { Site } from '@models/sites.js';
import type { CustomError } from '@types';

export const generateSitemap = async (_req: Request, res: Response) => {
  try {
    const sites = await Site.find({}, 'id title url').lean();
    
    const baseUrl = process.env['FRONTEND_URL'] || 'https://paragliding.borislav.space';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
    
    return `  <url>
    <loc>${baseUrl}/sites/${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/парапланер-старт/${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    const customError: CustomError = {
      message: 'Failed to generate sitemap',
      status: 500,
      name: 'SitemapError',
    };
    throw customError;
  }
};