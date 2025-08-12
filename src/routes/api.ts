import { Router } from 'express';
import { Site } from '../models/sites.js';

const router = Router();

// Function to get the next numeric ID
async function getNextId(): Promise<number> {
  const lastSite = await Site.findOne().sort({ _id: -1 });
  return lastSite ? (lastSite._id as number) + 1 : 1;
}

// GET /api/sites - List all sites
router.get('/sites', async (req, res, next) => {
  try {
    const sites = await Site.find();
    res.status(200).json(sites);
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

// POST /api/new-site - Create a new site
router.post('/new-site', async (req, res, next) => {
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
    
    res.status(201).json(savedSite);
    next();
  } catch (error: any) {
    console.error('POST /new-site error:', error);
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
});

// GET /api/site/:id - Get a single site
router.get('/site/:id', async (req, res, next) => {
  try {
    const site = await Site.findOne({ _id: parseInt(req.params.id) });
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.status(200).json(site);
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site' });
  }
});

// PUT /api/site/:id - Update an existing site
router.put('/site/:id', async (req, res, next) => {
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
    
    const updatedSite = await Site.findOneAndUpdate(
      { _id: parseInt(req.params.id) },
      finalUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.status(200).json(updatedSite);
    next();
  } catch (error: any) {
    console.error('PUT /site/:id error:', error);
    res.status(500).json({ 
      error: 'Failed to update site',
      message: error.message 
    });
  }
});

// DELETE /api/site/:id - Delete a site
router.delete('/site/:id', async (req, res, next) => {
  try {
    const deletedSite = await Site.findOneAndDelete({ _id: parseInt(req.params.id) });

    if (!deletedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.status(200).json({ message: 'Site deleted successfully' });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

export default router;
