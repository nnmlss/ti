import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import type { CustomError } from '../models/sites.js';

// Generate filename with timestamp
const generateFilename = (originalname: string): string => {
  const timestamp = Date.now();
  const ext = path.extname(originalname).toLowerCase();
  const basename = path.basename(originalname, ext);
  return `${timestamp}-${basename}`;
};

// Create multiple image sizes and save them
const processImage = async (buffer: Buffer, originalFilename: string) => {
  const filename = generateFilename(originalFilename);
  const originalExt = path.extname(originalFilename).toLowerCase();
  
  // Get original image metadata
  const metadata = await sharp(buffer).metadata();
  
  // Save original image unchanged
  const originalPath = path.join(process.cwd(), 'gallery', `${filename}${originalExt}`);
  await fs.writeFile(originalPath, buffer);
  
  // Create resized JPG versions
  const sizes = [
    { width: 300, folder: 'thmb' },
    { width: 960, folder: 'small' },
    { width: 1960, folder: 'large' }
  ];
  
  const processedVersions = [];
  
  for (const size of sizes) {
    const resizedPath = path.join(process.cwd(), 'gallery', size.folder, `${filename}.jpg`);
    
    const quality = size.folder === 'thmb' ? 92 : 96;
    
    await sharp(buffer)
      .resize(size.width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality })
      .toFile(resizedPath);
      
    processedVersions.push({
      size: size.folder,
      path: `${size.folder}/${filename}.jpg`
    });
  }
  
  return {
    original: {
      path: `${filename}${originalExt}`,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    },
    versions: processedVersions
  };
};

// POST /api/image/upload - Upload single image
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      const error: CustomError = new Error('No image file provided');
      error.status = 400;
      return next(error);
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // Process image and create multiple sizes
    const processedImage = await processImage(buffer, originalname);

    // Create response with image metadata
    const imageData = {
      path: processedImage.original.path,
      originalName: originalname,
      mimetype,
      size,
      width: processedImage.original.width,
      height: processedImage.original.height,
      format: processedImage.original.format,
      thumbnail: processedImage.versions.find(v => v.size === 'thmb')?.path,
      small: processedImage.versions.find(v => v.size === 'small')?.path,
      large: processedImage.versions.find(v => v.size === 'large')?.path
    };

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: imageData,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/image/:filename - Delete image file and all versions
export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      const error: CustomError = new Error('Image filename is required');
      error.status = 400;
      return next(error);
    }

    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      const error: CustomError = new Error('Invalid filename');
      error.status = 400;
      return next(error);
    }

    // Delete original image
    const originalPath = path.join(process.cwd(), 'gallery', filename);
    const baseName = path.basename(filename, path.extname(filename));
    
    const filesToDelete = [
      originalPath,
      path.join(process.cwd(), 'gallery', 'thmb', `${baseName}.jpg`),
      path.join(process.cwd(), 'gallery', 'small', `${baseName}.jpg`),
      path.join(process.cwd(), 'gallery', 'large', `${baseName}.jpg`)
    ];

    let deletedFiles = 0;
    let errors = [];

    for (const filePath of filesToDelete) {
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        deletedFiles++;
      } catch (fileError: any) {
        if (fileError.code !== 'ENOENT') {
          errors.push(`Failed to delete ${path.basename(filePath)}: ${fileError.message}`);
        }
      }
    }

    if (deletedFiles === 0) {
      const error: CustomError = new Error('No image files found to delete');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      message: 'Image deleted successfully',
      filename,
      deletedFiles,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/image/generate-thumbnails/:filename - Generate missing thumbnails from original
export const generateThumbnails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      const error: CustomError = new Error('Image filename is required');
      error.status = 400;
      return next(error);
    }

    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      const error: CustomError = new Error('Invalid filename');
      error.status = 400;
      return next(error);
    }

    const originalPath = path.join(process.cwd(), 'gallery', filename);
    
    // Check if original file exists
    try {
      await fs.access(originalPath);
    } catch (fileError: any) {
      if (fileError.code === 'ENOENT') {
        const error: CustomError = new Error('Original image file not found');
        error.status = 404;
        return next(error);
      }
      throw fileError;
    }

    // Read original image
    const buffer = await fs.readFile(originalPath);
    const baseName = path.basename(filename, path.extname(filename));
    
    // Create resized JPG versions
    const sizes = [
      { width: 300, folder: 'thmb' },
      { width: 960, folder: 'small' },
      { width: 1960, folder: 'large' }
    ];
    
    const generatedVersions = [];
    
    for (const size of sizes) {
      const resizedPath = path.join(process.cwd(), 'gallery', size.folder, `${baseName}.jpg`);
      
      // Check if this version already exists
      try {
        await fs.access(resizedPath);
        generatedVersions.push({
          size: size.folder,
          path: `${size.folder}/${baseName}.jpg`,
          status: 'already_exists'
        });
      } catch {
        // Generate the missing version
        const quality = size.folder === 'thmb' ? 92 : 96;
        
        await sharp(buffer)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality })
          .toFile(resizedPath);
          
        generatedVersions.push({
          size: size.folder,
          path: `${size.folder}/${baseName}.jpg`,
          status: 'generated'
        });
      }
    }
    
    res.status(200).json({
      message: 'Thumbnails processed successfully',
      filename,
      versions: generatedVersions
    });
  } catch (error) {
    next(error);
  }
};