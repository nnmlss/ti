import express, { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
// import path from 'path';
import { uploadImage, deleteImage, generateThumbnails } from '@controllers/image.js';
import { generateSitemap } from '@controllers/sitemap.js';
import { generateBuildGuidePDF } from '@controllers/pdfGenerator.js';
import authRoutes from './auth.js';

const router = Router();

// GET /api/health - liveness + DB connectivity, for uptime monitoring.
// Point UptimeRobot here (a PROXIED backend route): when Node is down, the
// LiteSpeed proxy returns 502/503 and the monitor alerts — unlike `/`, which
// the static SPA fallback always serves with 200. Dependency-light: only reads
// the mongoose connection state, no model queries, so it's cheap at frequent
// intervals (GET skips CSRF; won't trip the rate limit at normal cadence).
router.get('/health', (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    db: dbConnected ? 'connected' : 'disconnected',
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Configure multer for image uploads - use memory storage for processing
const fileFilter = (
  _req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});


// POST /api/image/upload - Upload single image
router.post('/image/upload', upload.single('image'), uploadImage);

// DELETE /api/image/:filename - Delete image file
router.delete('/image/:filename', deleteImage);

// POST /api/image/generate-thumbnails/:filename - Generate missing thumbnails
router.post('/image/generate-thumbnails/:filename', generateThumbnails);

// GET /api/sitemap.xml - Generate XML sitemap
router.get('/sitemap.xml', generateSitemap);

// GET /api/robots.txt - Generate robots.txt
router.get('/robots.txt', (_req, res) => {
  const baseUrl = process.env['FRONTEND_URL'] || 'https://paragliding.borislav.space';
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/api/sitemap.xml`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// GET /api/build-guide.pdf - Generate production build guide PDF
router.get('/build-guide.pdf', generateBuildGuidePDF);

export default router;
