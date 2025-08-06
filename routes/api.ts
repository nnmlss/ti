import { Router } from 'express';
import { Site } from '../models/sites.js';

const router = Router();

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
    const newSite = new Site(req.body);
    const savedSite = await newSite.save();
    res.status(201).json(savedSite);
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to create site' });
  }
});

// GET /api/sites/:id - Get a single site
router.get('/sites/:id', async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.status(200).json(site);
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site' });
  }
});

// PUT /api/sites/:id - Update an existing site
router.put('/sites/:id', async (req, res, next) => {
  try {
    const updatedSite = await Site.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.status(200).json(updatedSite);
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site' });
  }
});

// DELETE /api/sites/:id - Delete a site
router.delete('/sites/:id', async (req, res, next) => {
  try {
    const deletedSite = await Site.findByIdAndDelete(req.params.id);

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
