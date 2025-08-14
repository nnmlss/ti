import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs/promises';
import { Site } from '../models/sites.js';
import type { FlyingSite, CustomError, GalleryImage } from '../models/sites.js';

// Function to get the next numeric ID
async function getNextId(): Promise<number> {
  const lastSite = await Site.findOne().sort({ _id: -1 });
  return lastSite ? (lastSite._id as number) + 1 : 1;
}

// Function to delete all images associated with a site
async function deleteSiteImages(galleryImages: GalleryImage[]): Promise<{ deletedFiles: number; errors: string[] }> {
  if (!galleryImages || galleryImages.length === 0) {
    return { deletedFiles: 0, errors: [] };
  }

  let deletedFiles = 0;
  const errors: string[] = [];

  for (const image of galleryImages) {
    if (!image.path) continue;

    try {
      // Extract the base filename without extension for thumbnail deletion
      const baseName = path.basename(image.path, path.extname(image.path));
      
      const filesToDelete = [
        path.join(process.cwd(), 'gallery', image.path), // Original image
        path.join(process.cwd(), 'gallery', 'thmb', `${baseName}.jpg`), // Thumbnail
        path.join(process.cwd(), 'gallery', 'small', `${baseName}.jpg`), // Small version
        path.join(process.cwd(), 'gallery', 'large', `${baseName}.jpg`) // Large version
      ];

      for (const filePath of filesToDelete) {
        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
          deletedFiles++;
        } catch (fileError: unknown) {
          if (fileError instanceof Error && 'code' in fileError && fileError.code !== 'ENOENT') {
            errors.push(`Failed to delete ${path.basename(filePath)}: ${fileError instanceof Error ? fileError.message : String(fileError)}`);
          }
        }
      }
    } catch (error: unknown) {
      errors.push(`Failed to process image ${image.path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { deletedFiles, errors };
}

// GET /api/sites - List all sites
export const getAllSites = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sites = await Site.find();
    res.status(200).json(sites as FlyingSite[]);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

// POST /api/site - Create a new site
export const createSite = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationError: CustomError = new Error('Validation failed');
    validationError.isValidationError = true;
    validationError.errors = errors.array();
    return next(validationError);
  }

  try {
    const nextId = await getNextId();

    // Only include fields that are actually provided in the request body
    const siteData = {
      _id: nextId,
      ...req.body,
    };

    // Use insertOne directly to avoid Mongoose schema defaults
    await Site.collection.insertOne(siteData);

    // Fetch the inserted document to return it with proper formatting
    const savedSite = await Site.findOne({ _id: nextId });

    res.status(201).json(savedSite as FlyingSite);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

// GET /api/site/:id - Get a single site
export const getSiteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error: CustomError = new Error('Site ID is required');
      error.status = 400;
      return next(error);
    }
    const site = await Site.findOne({ _id: parseInt(id) });
    if (!site) {
      const error: CustomError = new Error('Site not found');
      error.status = 404;
      return next(error);
    }
    res.status(200).json(site as FlyingSite);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

// PUT /api/site/:id - Update an existing site
export const updateSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { $unset, ...updateData } = req.body;

    // Build the update operation
    interface UpdateOperation {
      $set?: Record<string, unknown>;
      $unset?: Record<string, number>;
    }
    const updateOperation: UpdateOperation = {};

    // Add regular update data if present
    if (Object.keys(updateData).length > 0) {
      updateOperation.$set = updateData;
    }

    // Add unset operations if present
    if ($unset && Object.keys($unset).length > 0) {
      updateOperation.$unset = $unset;
    }

    // If no operations, fall back to simple update
    const finalUpdate = Object.keys(updateOperation).length > 0 ? updateOperation : req.body;

    const id = req.params.id;
    if (!id) {
      const error: CustomError = new Error('Site ID is required');
      error.status = 400;
      return next(error);
    }

    const updatedSite = await Site.findOneAndUpdate({ _id: parseInt(id) }, finalUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updatedSite) {
      const error: CustomError = new Error('Site not found');
      error.status = 404;
      return next(error);
    }

    res.status(200).json(updatedSite as FlyingSite);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

// DELETE /api/site/:id - Delete a site
export const deleteSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error: CustomError = new Error('Site ID is required');
      error.status = 400;
      return next(error);
    }

    // First, find the site to get its gallery images
    const siteToDelete = await Site.findOne({ _id: parseInt(id) });
    if (!siteToDelete) {
      const error: CustomError = new Error('Site not found');
      error.status = 404;
      return next(error);
    }

    // Delete all gallery images from filesystem
    let imageDeleteResult = { deletedFiles: 0, errors: [] as string[] };
    if (siteToDelete.galleryImages && siteToDelete.galleryImages.length > 0) {
      imageDeleteResult = await deleteSiteImages(siteToDelete.galleryImages);
    }

    // Delete the site from database
    const deletedSite = await Site.findOneAndDelete({ _id: parseInt(id) });

    if (!deletedSite) {
      const error: CustomError = new Error('Site not found during deletion');
      error.status = 404;
      return next(error);
    }

    // Return success response with image deletion details
    res.status(200).json({
      message: 'Site deleted successfully',
      deletedImages: imageDeleteResult.deletedFiles,
      imageErrors: imageDeleteResult.errors.length > 0 ? imageDeleteResult.errors : undefined
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};
