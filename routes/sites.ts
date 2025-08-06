import { Router } from 'express';

import { type FlyingSite } from '../models/sites.js';

const router = Router();
const sites: FlyingSite[] = [
  {
    _id: 1,
    title: { bg: 'София', en: 'Sofia' },
    windDirection: ['N'],
    location: { type: 'Point', coordinates: [23.324, 42.697] },
    accessOptions: [],
  },
];
router.get('/', (req, res, next) => {
  res.status(200).json(sites);
  next();
});

// Serve the form page
router.get('/add', (req, res) => {
  res.render('site-form');
});

router.get('/site/:id', (req, res, next) => {
  const site = sites.find((site: FlyingSite) => site._id === parseInt(req.params.id));
  if (!site) {
    return res.status(404).json({ error: 'Site not found' });
  }
  res.status(200).json(site);
  next();
});

router.post('/site', (req, res, next) => {
  const site = req.body;
  sites.push(site);
  res.status(201).json(site);
  next();
});

router.put('/site/:id', (req, res, next) => {
  const site = req.body;
  sites.push(site);
  res.status(201).json(site);
  next();
});

// Handle form submission
router.post('/add-site', (req, res) => {
  try {
    const newSite: FlyingSite = {
      _id: sites.length + 1,
      ...req.body,
    };

    sites.push(newSite);
    res.status(201).json({ message: 'Site added successfully', site: newSite });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add site' });
  }
});

export default router;
