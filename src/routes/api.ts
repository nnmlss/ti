import express, { Router } from 'express';
import multer from 'multer';
// import path from 'path';
import { uploadImage, deleteImage, generateThumbnails } from '@controllers/image.js';
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

export default router;
