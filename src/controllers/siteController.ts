import type { Request, Response, NextFunction } from 'express';
import { Site } from '../models/sites.js';
import type { FlyingSite } from '../models/sites.js';

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
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
};

// POST /api/site - Create a new site
export const createSite = async (req: Request, res: Response, next: NextFunction) => {
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
    next();
  } catch (error: any) {
    console.error('POST /site error:', error);
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      error: 'Failed to create site',
      message: error.message,
      name: error.name,
    });
  }
};

// GET /api/site/:id - Get a single site
export const getSiteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Site ID is required' });
    }
    const site = await Site.findOne({ _id: parseInt(id) });
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.status(200).json(site as FlyingSite);
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site' });
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
      return res.status(400).json({ error: 'Site ID is required' });
    }

    const updatedSite = await Site.findOneAndUpdate({ _id: parseInt(id) }, finalUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updatedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.status(200).json(updatedSite as FlyingSite);
    next();
  } catch (error: any) {
    console.error('PUT /site/:id error:', error);
    res.status(500).json({
      error: 'Failed to update site',
      message: error.message,
    });
  }
};

// DELETE /api/site/:id - Delete a site
export const deleteSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Site ID is required' });
    }
    const deletedSite = await Site.findOneAndDelete({ _id: parseInt(id) });

    if (!deletedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.status(200).json({ message: 'Site deleted successfully' });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
};
