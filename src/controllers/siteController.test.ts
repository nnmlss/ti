import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// Mock the Site model before importing controller
vi.mock('../models/sites.js', () => ({
  Site: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
    collection: {
      insertOne: vi.fn(),
    },
  },
}));

import {
  getAllSites,
  createSite,
  getSiteById,
  updateSite,
  deleteSite,
} from './siteController.js';
import { Site } from '../models/sites.js';

// Helper to create mock request/response objects
const createMockReq = (params = {}, body = {}) => ({
  params,
  body,
}) as Request;

const createMockRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn() as NextFunction;

describe('Site Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset all mock implementations
    vi.mocked(Site.find).mockClear();
    vi.mocked(Site.findOne).mockClear();
    vi.mocked(Site.findOneAndUpdate).mockClear();
    vi.mocked(Site.findOneAndDelete).mockClear();
    vi.mocked(Site.collection.insertOne).mockClear();
  });

  describe('getAllSites', () => {
    it('should return all sites successfully', async () => {
      const mockSites = [
        { _id: 1, title: { en: 'Site 1', bg: 'Място 1' } },
        { _id: 2, title: { en: 'Site 2', bg: 'Място 2' } },
      ];
      vi.mocked(Site.find).mockResolvedValue(mockSites as any);

      const req = createMockReq();
      const res = createMockRes();

      await getAllSites(req, res, mockNext);

      expect(Site.find).toHaveBeenCalledOnce();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSites);
      expect(mockNext).toHaveBeenCalledOnce();
    });

    it('should handle database errors', async () => {
      vi.mocked(Site.find).mockRejectedValue(new Error('Database error'));

      const req = createMockReq();
      const res = createMockRes();

      await getAllSites(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch sites' });
    });
  });

  describe('createSite', () => {
    it('should handle creation errors', async () => {
      vi.mocked(Site.findOne).mockRejectedValue(new Error('Database error'));

      const req = createMockReq({}, {});
      const res = createMockRes();

      await createSite(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Failed to create site',
        })
      );
    });
  });

  describe('getSiteById', () => {
    beforeEach(() => {
      // Ensure clean state for getSiteById tests
      vi.mocked(Site.findOne).mockReset();
    });

    it('should return a site by ID successfully', async () => {
      const siteId = '1';
      const mockSiteData = {
        _id: 1,
        title: { en: 'Test Site', bg: 'Тест място' },
      };

      vi.mocked(Site.findOne).mockResolvedValue(mockSiteData as any);

      const req = createMockReq({ id: siteId });
      const res = createMockRes();

      await getSiteById(req, res, mockNext);

      expect(Site.findOne).toHaveBeenCalledWith({ _id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSiteData);
      expect(mockNext).toHaveBeenCalledOnce();
    });

    it('should return 400 when ID is missing', async () => {
      const req = createMockReq({}); // No ID parameter
      const res = createMockRes();

      await getSiteById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Site ID is required' });
      expect(Site.findOne).not.toHaveBeenCalled();
    });

    it('should return 404 when site not found', async () => {
      vi.mocked(Site.findOne).mockResolvedValue(null);

      const req = createMockReq({ id: '999' });
      const res = createMockRes();

      await getSiteById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Site not found' });
    });

    it('should handle database errors', async () => {
      vi.mocked(Site.findOne).mockRejectedValue(new Error('Database error'));

      const req = createMockReq({ id: '1' });
      const res = createMockRes();

      await getSiteById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch site' });
    });
  });

  describe('updateSite', () => {
    it('should update a site successfully', async () => {
      const siteId = '1';
      const updateData = {
        title: { en: 'Updated Site', bg: 'Обновено място' },
        altitude: 1500,
      };
      const updatedSite = { _id: 1, ...updateData };

      vi.mocked(Site.findOneAndUpdate).mockResolvedValue(updatedSite as any);

      const req = createMockReq({ id: siteId }, updateData);
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(Site.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 1 },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedSite);
      expect(mockNext).toHaveBeenCalledOnce();
    });

    it('should return 400 when ID is missing', async () => {
      const req = createMockReq({}, { title: { en: 'Update' } }); // No ID parameter
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Site ID is required' });
      expect(Site.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should handle $unset operations', async () => {
      const siteId = '1';
      const updateData = {
        title: { en: 'Updated Site' },
        $unset: { altitude: 1 },
      };
      const updatedSite = { _id: 1, title: { en: 'Updated Site' } };

      vi.mocked(Site.findOneAndUpdate).mockResolvedValue(updatedSite as any);

      const req = createMockReq({ id: siteId }, updateData);
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(Site.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 1 },
        {
          $set: { title: { en: 'Updated Site' } },
          $unset: { altitude: 1 },
        },
        { new: true, runValidators: true }
      );
    });

    it('should return 404 when site not found', async () => {
      vi.mocked(Site.findOneAndUpdate).mockResolvedValue(null);

      const req = createMockReq({ id: '999' }, {});
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Site not found' });
    });

    it('should handle update errors', async () => {
      vi.mocked(Site.findOneAndUpdate).mockRejectedValue(new Error('Update failed'));

      const req = createMockReq({ id: '1' }, {});
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Failed to update site',
        })
      );
    });
  });

  describe('deleteSite', () => {
    it('should delete a site successfully', async () => {
      const siteId = '1';
      const deletedSite = {
        _id: 1,
        title: { en: 'Deleted Site', bg: 'Изтрито място' },
      };

      vi.mocked(Site.findOneAndDelete).mockResolvedValue(deletedSite as any);

      const req = createMockReq({ id: siteId });
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(Site.findOneAndDelete).toHaveBeenCalledWith({ _id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Site deleted successfully',
      });
      expect(mockNext).toHaveBeenCalledOnce();
    });

    it('should return 400 when ID is missing', async () => {
      const req = createMockReq({}); // No ID parameter
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Site ID is required' });
      expect(Site.findOneAndDelete).not.toHaveBeenCalled();
    });

    it('should return 404 when site not found', async () => {
      vi.mocked(Site.findOneAndDelete).mockResolvedValue(null);

      const req = createMockReq({ id: '999' });
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Site not found' });
    });

    it('should handle deletion errors', async () => {
      vi.mocked(Site.findOneAndDelete).mockRejectedValue(new Error('Delete failed'));

      const req = createMockReq({ id: '1' });
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete site' });
    });
  });
});