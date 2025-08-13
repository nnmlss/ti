import { Router } from 'express';
import { body } from 'express-validator';
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
router.post(
  '/site',
  [
    body('title.bg')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Bulgarian title must be at least 3 characters'),
    body('location').notEmpty().withMessage('Location is required'),
    // body('windDirection').notEmpty().withMessage('Wind direction is required'),
    // body('accessOptions').notEmpty().withMessage('Access options are required')
  ],
  createSite
);

// GET /api/site/:id - Get a single site
router.get('/site/:id', getSiteById);

// PUT /api/site/:id - Update an existing site
router.put('/site/:id', updateSite);

// DELETE /api/site/:id - Delete a site
router.delete('/site/:id', deleteSite);

export default router;
