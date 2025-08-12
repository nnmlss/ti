var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Router } from 'express';
import { Site } from '../models/sites.js';
const router = Router();
// Function to get the next numeric ID
function getNextId() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastSite = yield Site.findOne().sort({ _id: -1 });
        return lastSite ? lastSite._id + 1 : 1;
    });
}
// GET /api/sites - List all sites
router.get('/sites', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sites = yield Site.find();
        res.status(200).json(sites);
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sites' });
    }
}));
// POST /api/sites - Create a new site
router.post('/sites', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nextId = yield getNextId();
        const newSite = new Site(Object.assign(Object.assign({}, req.body), { _id: nextId }));
        const savedSite = yield newSite.save();
        res.status(201).json(savedSite);
        next();
    }
    catch (error) {
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
}));
// GET /api/site/:id - Get a single site
router.get('/site/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const site = yield Site.findOne({ _id: parseInt(req.params.id) });
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.status(200).json(site);
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch site' });
    }
}));
// PUT /api/site/:id - Update an existing site
router.put('/site/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { $unset } = _a, updateData = __rest(_a, ["$unset"]);
        // Build the update operation
        const updateOperation = {};
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
        const updatedSite = yield Site.findOneAndUpdate({ _id: parseInt(req.params.id) }, finalUpdate, {
            new: true,
            runValidators: true,
        });
        if (!updatedSite) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.status(200).json(updatedSite);
        next();
    }
    catch (error) {
        console.error('PUT /site/:id error:', error);
        res.status(500).json({
            error: 'Failed to update site',
            message: error.message
        });
    }
}));
// DELETE /api/site/:id - Delete a site
router.delete('/site/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSite = yield Site.findOneAndDelete({ _id: parseInt(req.params.id) });
        if (!deletedSite) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.status(200).json({ message: 'Site deleted successfully' });
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete site' });
    }
}));
export default router;
//# sourceMappingURL=api.js.map