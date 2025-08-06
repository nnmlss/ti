import { Router } from 'express';
import { sitesState } from '../models/sites.js';

const router = Router();

// GET /api/sites - List all sites
router.get('/sites', (req, res, next) => {
  res.status(200).json(sitesState.sites);
  next();
});

// POST /api/sites - Create a new site
router.post('/sites', (req, res, next) => {
  try {
    const newSiteData = req.body;
    const newId = sitesState.getNextId();
    const newSite = { ...newSiteData, _id: newId.toString() };
    sitesState.sites.push(newSite);
    res.status(201).json(newSite);
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to create site' });
  }
});

// GET /api/sites/:id - Get a single site
router.get('/sites/:id', (req, res, next) => {
  const site = sitesState.sites.find((site) => site._id === req.params.id);
  if (!site) {
    return res.status(404).json({ error: 'Site not found' });
  }
  res.status(200).json(site);
  next();
});

// PUT /api/sites/:id - Update an existing site
router.put('/sites/:id', (req, res, next) => {
  const siteId = req.params.id;
  const updatedSiteData = req.body;
  const siteIndex = sitesState.sites.findIndex((site) => site._id === siteId);

  if (siteIndex === -1) {
    return res.status(404).json({ error: 'Site not found' });
  }

  sitesState.sites[siteIndex] = { ...updatedSiteData, _id: siteId };
  res.status(200).json(sitesState.sites[siteIndex]);
  next();
});

// DELETE /api/sites/:id - Delete a site
router.delete('/sites/:id', (req, res, next) => {
  const siteIndex = sitesState.sites.findIndex((site) => site._id === req.params.id);

  if (siteIndex === -1) {
    return res.status(404).json({ error: 'Site not found' });
  }

  sitesState.sites.splice(siteIndex, 1);
  res.status(200).json({ message: 'Site deleted successfully' });
  next();
});

export default router;
