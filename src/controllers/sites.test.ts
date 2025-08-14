import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// Mock express-validator
vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
}));

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
} from './sites.js';
import { Site } from '../models/sites.js';
import { validationResult } from 'express-validator';

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
    vi.mocked(validationResult).mockClear();
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
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle database errors via global error handler', async () => {
      const dbError = new Error('Database error');
      vi.mocked(Site.find).mockRejectedValue(dbError);

      const req = createMockReq();
      const res = createMockRes();

      await getAllSites(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('createSite', () => {
    it('should handle validation errors via global error handler', async () => {
      const validationErrors = [
        { msg: 'Title is required', param: 'title', location: 'body' }
      ];
      vi.mocked(validationResult).mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors,
      } as any);

      const req = createMockReq({}, {});
      const res = createMockRes();

      await createSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          isValidationError: true,
          errors: validationErrors,
        })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle creation errors via global error handler', async () => {
      vi.mocked(validationResult).mockReturnValue({
        isEmpty: () => true,
      } as any);
      
      const dbError = new Error('Database error');
      // Mock the findOne().sort() chain for getNextId()
      vi.mocked(Site.findOne).mockReturnValue({
        sort: vi.fn().mockRejectedValue(dbError)
      } as any);

      const req = createMockReq({}, {});
      const res = createMockRes();

      await createSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
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
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing ID via global error handler', async () => {
      const req = createMockReq({}); // No ID parameter
      const res = createMockRes();

      await getSiteById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Site ID is required',
          status: 400,
        })
      );
      expect(Site.findOne).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle site not found via global error handler', async () => {
      vi.mocked(Site.findOne).mockResolvedValue(null);

      const req = createMockReq({ id: '999' });
      const res = createMockRes();

      await getSiteById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Site not found',
          status: 404,
        })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle database errors via global error handler', async () => {
      const dbError = new Error('Database error');
      vi.mocked(Site.findOne).mockRejectedValue(dbError);

      const req = createMockReq({ id: '1' });
      const res = createMockRes();

      await getSiteById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
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
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing ID via global error handler', async () => {
      const req = createMockReq({}, { title: { en: 'Update' } }); // No ID parameter
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Site ID is required',
          status: 400,
        })
      );
      expect(Site.findOneAndUpdate).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
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

    it('should handle site not found via global error handler', async () => {
      vi.mocked(Site.findOneAndUpdate).mockResolvedValue(null);

      const req = createMockReq({ id: '999' }, {});
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Site not found',
          status: 404,
        })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle update errors via global error handler', async () => {
      const dbError = new Error('Update failed');
      vi.mocked(Site.findOneAndUpdate).mockRejectedValue(dbError);

      const req = createMockReq({ id: '1' }, {});
      const res = createMockRes();

      await updateSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteSite', () => {
    it('should delete a site successfully', async () => {
      const siteId = '1';
      const siteToDelete = {
        _id: 1,
        title: { en: 'Site to Delete', bg: 'Място за изтриване' },
        galleryImages: []
      };
      const deletedSite = {
        _id: 1,
        title: { en: 'Deleted Site', bg: 'Изтрито място' },
      };

      vi.mocked(Site.findOne).mockResolvedValue(siteToDelete as any);
      vi.mocked(Site.findOneAndDelete).mockResolvedValue(deletedSite as any);

      const req = createMockReq({ id: siteId });
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(Site.findOne).toHaveBeenCalledWith({ _id: 1 });
      expect(Site.findOneAndDelete).toHaveBeenCalledWith({ _id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Site deleted successfully',
        deletedImages: 0,
        imageErrors: undefined
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should delete a site with gallery images successfully', async () => {
      const siteId = '1';
      const siteToDelete = {
        _id: 1,
        title: { en: 'Site with Images', bg: 'Място с изображения' },
        galleryImages: [
          { path: 'test1.jpg', author: 'Test Author 1' },
          { path: 'test2.jpg', author: 'Test Author 2' }
        ]
      };
      const deletedSite = {
        _id: 1,
        title: { en: 'Deleted Site', bg: 'Изтрито място' },
      };

      vi.mocked(Site.findOne).mockResolvedValue(siteToDelete as any);
      vi.mocked(Site.findOneAndDelete).mockResolvedValue(deletedSite as any);

      const req = createMockReq({ id: siteId });
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(Site.findOne).toHaveBeenCalledWith({ _id: 1 });
      expect(Site.findOneAndDelete).toHaveBeenCalledWith({ _id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Site deleted successfully',
          deletedImages: expect.any(Number)
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing ID via global error handler', async () => {
      const req = createMockReq({}); // No ID parameter
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Site ID is required',
          status: 400,
        })
      );
      expect(Site.findOneAndDelete).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle site not found via global error handler', async () => {
      vi.mocked(Site.findOne).mockResolvedValue(null);

      const req = createMockReq({ id: '999' });
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Site not found',
          status: 404,
        })
      );
      expect(Site.findOneAndDelete).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle deletion errors via global error handler', async () => {
      const dbError = new Error('Delete failed');
      vi.mocked(Site.findOne).mockRejectedValue(dbError);

      const req = createMockReq({ id: '1' });
      const res = createMockRes();

      await deleteSite(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});