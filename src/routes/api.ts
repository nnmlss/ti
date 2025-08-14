import express, { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
// import path from 'path';
import {
  getAllSites,
  createSite,
  getSiteById,
  updateSite,
  deleteSite,
} from '../controllers/sites.js';
import { uploadImage, deleteImage, generateThumbnails } from '../controllers/image.js';
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

// GET /api/sites - List all sites
router.get('/sites', getAllSites);

// POST /api/site - Create a new site
router.post(
  '/site',
  [
    body('title.bg')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Bulgarian title must be at least 3 characters'),
    body('location').notEmpty().withMessage('Location is required'),
    // body('windDirection').notEmpty().withMessage('Wind direction is required'),
    // body('accessOptions').notEmpty().withMessage('Access options are required')
  ],
  createSite
);

// GET /api/site/:id - Get a single site
router.get('/site/:id', getSiteById);

// PUT /api/site/:id - Update an existing site
router.put('/site/:id', updateSite);

// DELETE /api/site/:id - Delete a site
router.delete('/site/:id', deleteSite);

// POST /api/image/upload - Upload single image
router.post('/image/upload', upload.single('image'), uploadImage);

// DELETE /api/image/:filename - Delete image file
router.delete('/image/:filename', deleteImage);

// POST /api/image/generate-thumbnails/:filename - Generate missing thumbnails
router.post('/image/generate-thumbnails/:filename', generateThumbnails);

export default router;
