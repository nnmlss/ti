import { Router } from 'express';
import {
  getAllSites,
  createSite,
  getSiteById,
  updateSite,
  deleteSite,
} from '../controllers/siteController.js';

const router = Router();

// GET /api/sites - List all sites
router.get('/sites', getAllSites);

// POST /api/site - Create a new site
router.post('/site', createSite);

// GET /api/site/:id - Get a single site
router.get('/site/:id', getSiteById);

// PUT /api/site/:id - Update an existing site
router.put('/site/:id', updateSite);

// DELETE /api/site/:id - Delete a site
router.delete('/site/:id', deleteSite);

export default router;
