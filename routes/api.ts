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

// POST /api/sites - Create a new site
router.post('/sites', async (req, res, next) => {
  try {
    const nextId = await getNextId();
    const newSite = new Site({
      ...req.body,
      _id: nextId,
    });
    const savedSite = await newSite.save();
    res.status(201).json(savedSite);
    next();
  } catch (error: any) {
    console.error('POST /sites error:', error);
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
    const updatedSite = await Site.findOneAndUpdate(
      { _id: parseInt(req.params.id) },
      req.body,
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site' });
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
