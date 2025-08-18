import express, { Router } from 'express';
import multer from 'multer';
// import path from 'path';
import { uploadImage, deleteImage, generateThumbnails } from '@controllers/image.js';
import { generateSitemap } from '@controllers/sitemap.js';
import authRoutes from './auth.js';

const router = Router();

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

export default router;
