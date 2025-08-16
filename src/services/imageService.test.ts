import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import sharp from 'sharp';
import {
  IMAGE_SIZES,
  RESIZE_OPTIONS,
  getImageQuality,
  generateFilename,
  getImagePaths,
  processImage,
  generateThumbnailsForImage,
  deleteImageFiles,
} from './imageService.js';

// Mock dependencies
vi.mock('fs/promises');
vi.mock('sharp');
vi.mock('@utils/fileUtils.js', () => ({
  getGalleryPath: vi.fn((...segments: string[]) => `/mock/gallery/${segments.join('/')}`),
}));

const mockSharp = vi.mocked(sharp);
const mockFs = vi.mocked(fs);

describe('imageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default sharp mock chain
    const mockSharpInstance = {
      metadata: vi.fn(),
      resize: vi.fn(),
      jpeg: vi.fn(),
      toFile: vi.fn(),
    };

    mockSharpInstance.resize.mockReturnValue(mockSharpInstance);
    mockSharpInstance.jpeg.mockReturnValue(mockSharpInstance);
    mockSharpInstance.toFile.mockResolvedValue(undefined);
    mockSharpInstance.metadata.mockResolvedValue({
      width: 1920,
      height: 1080,
      format: 'jpeg',
    });

    mockSharp.mockReturnValue(mockSharpInstance as any);
  });

  describe('constants', () => {
    it('should export correct IMAGE_SIZES', () => {
      expect(IMAGE_SIZES).toEqual([
        { width: 300, folder: 'thmb' },
        { width: 960, folder: 'small' },
        { width: 1960, folder: 'large' },
      ]);
    });

    it('should export correct RESIZE_OPTIONS', () => {
      expect(RESIZE_OPTIONS).toEqual({
        withoutEnlargement: true,
        fit: 'inside',
      });
    });
  });

  describe('getImageQuality', () => {
    it('should return 92 for thumbnail folder', () => {
      expect(getImageQuality('thmb')).toBe(92);
    });

    it('should return 96 for other folders', () => {
      expect(getImageQuality('small')).toBe(96);
      expect(getImageQuality('large')).toBe(96);
      expect(getImageQuality('custom')).toBe(96);
    });
  });

  describe('generateFilename', () => {
    it('should generate filename with timestamp and original basename', () => {
      const originalName = 'test-image.jpg';
      const result = generateFilename(originalName);

      // Should match pattern: timestamp-basename
      expect(result).toMatch(/^\d+-test-image$/);
    });

    it('should handle different file extensions', () => {
      const testCases = [
        { input: 'photo.PNG', basename: 'photo' },
        { input: 'image.jpeg', basename: 'image' },
        { input: 'file.webp', basename: 'file' },
      ];

      testCases.forEach(({ input, basename }) => {
        const result = generateFilename(input);
        expect(result).toMatch(new RegExp(`^\\d+-${basename}$`));
      });
    });

    it('should handle filenames without extensions', () => {
      const result = generateFilename('filename');
      expect(result).toMatch(/^\d+-filename$/);
    });

    it('should handle complex filenames', () => {
      const result = generateFilename('my-complex_file (1).jpg');
      expect(result).toMatch(/^\d+-my-complex_file \(1\)$/);
    });
  });

  describe('getImagePaths', () => {
    it('should generate correct paths for all image sizes', () => {
      const filename = 'test-image.jpg';
      const result = getImagePaths(filename);

      expect(result.original).toBe('/mock/gallery/test-image.jpg');
      expect(result.versions).toHaveLength(3);

      expect(result.versions[0]).toEqual({
        width: 300,
        folder: 'thmb',
        path: '/mock/gallery/thmb/test-image.jpg',
        relativePath: 'thmb/test-image.jpg',
      });

      expect(result.versions[1]).toEqual({
        width: 960,
        folder: 'small',
        path: '/mock/gallery/small/test-image.jpg',
        relativePath: 'small/test-image.jpg',
      });

      expect(result.versions[2]).toEqual({
        width: 1960,
        folder: 'large',
        path: '/mock/gallery/large/test-image.jpg',
        relativePath: 'large/test-image.jpg',
      });
    });

    it('should handle different file extensions correctly', () => {
      const filename = 'image.png';
      const result = getImagePaths(filename);

      // Should strip extension and use .jpg for versions
      expect(result.versions[0].path).toBe('/mock/gallery/thmb/image.jpg');
      expect(result.versions[0].relativePath).toBe('thmb/image.jpg');
    });
  });

  describe('processImage', () => {
    it('should process image and create all versions', async () => {
      const buffer = Buffer.from('fake-image-data');
      const originalFilename = 'test.jpg';

      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await processImage(buffer, originalFilename);

      // Should call sharp for metadata
      expect(mockSharp).toHaveBeenCalledWith(buffer);

      // Should write original file
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/mock/gallery/'),
        buffer
      );

      // Should create all image versions
      expect(result.versions).toHaveLength(3);
      expect(result.versions.map((v) => v.size)).toEqual(['thmb', 'small', 'large']);

      // Should return original metadata
      expect(result.original).toEqual({
        path: expect.stringMatching(/^\d+-test\.jpg$/),
        width: 1920,
        height: 1080,
        format: 'jpeg',
      });
    });

    it('should handle sharp processing errors', async () => {
      const buffer = Buffer.from('fake-image-data');
      const originalFilename = 'test.jpg';

      mockSharp().metadata.mockRejectedValue(new Error('Invalid image'));

      await expect(processImage(buffer, originalFilename)).rejects.toThrow('Invalid image');
    });
  });

  describe('generateThumbnailsForImage', () => {
    it('should generate missing thumbnails', async () => {
      const filename = 'test-image.jpg';

      mockFs.access
        .mockResolvedValueOnce(undefined) // Original exists
        .mockRejectedValue(new Error('ENOENT')) // Thumbnails don't exist
        .mockRejectedValue(new Error('ENOENT'))
        .mockRejectedValue(new Error('ENOENT'));

      mockFs.readFile.mockResolvedValue(Buffer.from('fake-image-data'));

      const result = await generateThumbnailsForImage(filename);

      expect(result).toHaveLength(3);
      expect(result.every((v) => v.status === 'generated')).toBe(true);
    });

    it('should skip existing thumbnails', async () => {
      const filename = 'test-image.jpg';

      mockFs.access.mockResolvedValue(undefined); // All files exist
      mockFs.readFile.mockResolvedValue(Buffer.from('fake-image-data'));

      const result = await generateThumbnailsForImage(filename);

      expect(result).toHaveLength(3);
      expect(result.every((v) => v.status === 'already_exists')).toBe(true);

      // Should not call sharp for existing files
      expect(mockSharp).not.toHaveBeenCalled();
    });

    it('should throw error if original file not found', async () => {
      const filename = 'missing-image.jpg';

      const error = new Error('File not found') as any;
      error.code = 'ENOENT';
      mockFs.access.mockRejectedValue(error);

      await expect(generateThumbnailsForImage(filename)).rejects.toThrow(
        'Original image file not found'
      );
    });

    it('should handle mixed existing and missing thumbnails', async () => {
      const filename = 'test-image.jpg';

      mockFs.access
        .mockResolvedValueOnce(undefined) // Original exists
        .mockResolvedValueOnce(undefined) // thmb exists
        .mockRejectedValueOnce(new Error('ENOENT')) // small missing
        .mockRejectedValueOnce(new Error('ENOENT')); // large missing

      mockFs.readFile.mockResolvedValue(Buffer.from('fake-image-data'));

      const result = await generateThumbnailsForImage(filename);

      expect(result).toHaveLength(3);
      expect(result[0].status).toBe('already_exists'); // thmb
      expect(result[1].status).toBe('generated'); // small
      expect(result[2].status).toBe('generated'); // large
    });
  });

  describe('deleteImageFiles', () => {
    it('should delete all image files successfully', async () => {
      const filename = 'test-image.jpg';

      mockFs.access.mockResolvedValue(undefined); // All files exist
      mockFs.unlink.mockResolvedValue(undefined);

      const result = await deleteImageFiles(filename);

      expect(result.deletedFiles).toBe(4); // original + 3 versions
      expect(result.errors).toHaveLength(0);
      expect(mockFs.unlink).toHaveBeenCalledTimes(4);
    });

    it('should handle missing files gracefully', async () => {
      const filename = 'test-image.jpg';

      const enoentError = new Error('File not found') as any;
      enoentError.code = 'ENOENT';

      mockFs.access.mockRejectedValue(enoentError);

      const result = await deleteImageFiles(filename);

      expect(result.deletedFiles).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(mockFs.unlink).not.toHaveBeenCalled();
    });

    it('should handle partial deletion failures', async () => {
      const filename = 'test-image.jpg';

      const enoentError = new Error('File not found') as any;
      enoentError.code = 'ENOENT';

      mockFs.access
        .mockResolvedValueOnce(undefined) // original exists
        .mockResolvedValueOnce(undefined) // thmb exists
        .mockRejectedValueOnce(enoentError) // small missing (skip)
        .mockResolvedValueOnce(undefined); // large exists

      mockFs.unlink
        .mockResolvedValueOnce(undefined) // original deleted successfully
        .mockRejectedValueOnce(new Error('Permission denied')) // thmb deletion failed
        .mockResolvedValueOnce(undefined); // large deleted successfully

      const result = await deleteImageFiles(filename);

      expect(result.deletedFiles).toBe(2); // original + large
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Permission denied');
    });

    it('should collect all deletion errors', async () => {
      const filename = 'test-image.jpg';

      mockFs.access.mockResolvedValue(undefined);
      mockFs.unlink.mockRejectedValue(new Error('Disk full'));

      const result = await deleteImageFiles(filename);

      expect(result.deletedFiles).toBe(0);
      expect(result.errors).toHaveLength(4); // All 4 files failed
      expect(result.errors.every((err) => err.includes('Disk full'))).toBe(true);
    });
  });
});
