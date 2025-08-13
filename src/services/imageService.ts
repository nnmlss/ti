import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { getGalleryPath } from '../utils/fileUtils.js';
import type { ImageSize, ImagePaths, ProcessedImage } from '../models/image.js';

export const IMAGE_SIZES: ImageSize[] = [
  { width: 300, folder: 'thmb' },
  { width: 960, folder: 'small' },
  { width: 1960, folder: 'large' }
];

export const RESIZE_OPTIONS = {
  withoutEnlargement: true,
  fit: 'inside' as const
};

export const getImageQuality = (folder: string): number => folder === 'thmb' ? 92 : 96;

export const generateFilename = (originalname: string): string => {
  const timestamp = Date.now();
  const ext = path.extname(originalname).toLowerCase();
  const basename = path.basename(originalname, ext);
  return `${timestamp}-${basename}`;
};

export const getImagePaths = (filename: string): ImagePaths => {
  const baseName = path.basename(filename, path.extname(filename));
  return {
    original: getGalleryPath(filename),
    versions: IMAGE_SIZES.map(size => ({
      ...size,
      path: getGalleryPath(size.folder, `${baseName}.jpg`),
      relativePath: `${size.folder}/${baseName}.jpg`
    }))
  };
};

export const processImage = async (buffer: Buffer, originalFilename: string): Promise<ProcessedImage> => {
  const filename = generateFilename(originalFilename);
  const originalExt = path.extname(originalFilename).toLowerCase();
  
  const metadata = await sharp(buffer).metadata();
  
  const paths = getImagePaths(`${filename}${originalExt}`);
  await fs.writeFile(paths.original, buffer);
  
  const processedVersions = [];
  
  for (const versionPath of paths.versions) {
    await sharp(buffer)
      .resize(versionPath.width, null, RESIZE_OPTIONS)
      .jpeg({ quality: getImageQuality(versionPath.folder) })
      .toFile(versionPath.path);
      
    processedVersions.push({
      size: versionPath.folder,
      path: versionPath.relativePath
    });
  }
  
  return {
    original: {
      path: `${filename}${originalExt}`,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    },
    versions: processedVersions
  };
};

export const generateThumbnailsForImage = async (filename: string) => {
  const paths = getImagePaths(filename);
  
  try {
    await fs.access(paths.original);
  } catch (fileError: any) {
    if (fileError.code === 'ENOENT') {
      throw new Error('Original image file not found');
    }
    throw fileError;
  }

  const buffer = await fs.readFile(paths.original);
  const generatedVersions = [];
  
  for (const versionPath of paths.versions) {
    try {
      await fs.access(versionPath.path);
      generatedVersions.push({
        size: versionPath.folder,
        path: versionPath.relativePath,
        status: 'already_exists'
      });
    } catch {
      await sharp(buffer)
        .resize(versionPath.width, null, RESIZE_OPTIONS)
        .jpeg({ quality: getImageQuality(versionPath.folder) })
        .toFile(versionPath.path);
        
      generatedVersions.push({
        size: versionPath.folder,
        path: versionPath.relativePath,
        status: 'generated'
      });
    }
  }
  
  return generatedVersions;
};

export const deleteImageFiles = async (filename: string) => {
  const paths = getImagePaths(filename);
  const filesToDelete = [paths.original, ...paths.versions.map(v => v.path)];

  let deletedFiles = 0;
  const errors: string[] = [];

  for (const filePath of filesToDelete) {
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      deletedFiles++;
    } catch (fileError: any) {
      if (fileError.code !== 'ENOENT') {
        errors.push(`Failed to delete ${path.basename(filePath)}: ${fileError.message}`);
      }
    }
  }

  return { deletedFiles, errors };
};