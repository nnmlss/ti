import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Site } from '../models/sites.js';
import type { FlyingSite, CustomError } from '../models/sites.js';

// Function to get the next numeric ID
async function getNextId(): Promise<number> {
  const lastSite = await Site.findOne().sort({ _id: -1 });
  return lastSite ? (lastSite._id as number) + 1 : 1;
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
    const updateOperation: any = {};

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
    const deletedSite = await Site.findOneAndDelete({ _id: parseInt(id) });

    if (!deletedSite) {
      const error: CustomError = new Error('Site not found');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: 'Site deleted successfully' });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};
