import type { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/errorUtils.js';
import { validateFilename } from '../utils/fileUtils.js';
import { 
  processImage, 
  generateThumbnailsForImage, 
  deleteImageFiles 
} from '../services/imageService.js';

// POST /api/image/upload - Upload single image
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(createError('No image file provided', 400));
    }

    const { buffer, originalname, mimetype, size } = req.file;

    const processedImage = await processImage(buffer, originalname);

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
      return next(createError('Image filename is required', 400));
    }

    const decodedFilename = validateFilename(filename);
    const { deletedFiles, errors } = await deleteImageFiles(decodedFilename);

    if (deletedFiles === 0) {
      return next(createError('No image files found to delete', 404));
    }

    res.status(200).json({
      message: 'Image deleted successfully',
      filename: decodedFilename,
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
      return next(createError('Image filename is required', 400));
    }

    const decodedFilename = validateFilename(filename);
    
    try {
      const generatedVersions = await generateThumbnailsForImage(decodedFilename);
      
      res.status(200).json({
        message: 'Thumbnails processed successfully',
        filename: decodedFilename,
        versions: generatedVersions
      });
    } catch (serviceError: unknown) {
      if (serviceError instanceof Error && serviceError.message === 'Original image file not found') {
        return next(createError('Original image file not found', 404));
      }
      throw serviceError;
    }
  } catch (error) {
    next(error);
  }
};