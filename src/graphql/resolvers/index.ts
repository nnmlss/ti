import { Site } from '@models/sites.js';
// import { User } from '@models/user.js';
import { customScalars } from '@gql-app/scalars/index.js';
import type { GraphQLContext } from '@gql-app/types/context.js';
import type { CreateSiteData, FlyingSite, GalleryImage } from '@models/sites.js';
import path from 'path';
import fs from 'fs/promises';

// Resolver argument types
interface SiteByIdArgs {
  id: string;
}

interface SitesByWindDirectionArgs {
  directions: string[];
}

interface CreateSiteArgs {
  input: CreateSiteData;
}

interface UpdateSiteArgs {
  id: string;
  input: Partial<CreateSiteData>;
}

interface DeleteSiteArgs {
  id: string;
}

interface UnsetSiteFieldsArgs {
  id: string;
  fields: string[];
}

interface LoginArgs {
  username: string;
  password: string;
}

interface RequestActivationArgs {
  email: string;
}

interface ActivateAccountArgs {
  token: string;
  username: string;
  password: string;
}

interface ValidateTokenArgs {
  token: string;
}

interface CreateUserAccountsArgs {
  emails: string[];
}

// Function to delete all images associated with a site
async function deleteSiteImages(
  galleryImages: GalleryImage[]
): Promise<{ deletedFiles: number; errors: string[] }> {
  if (!galleryImages || galleryImages.length === 0) {
    return { deletedFiles: 0, errors: [] };
  }

  let deletedFiles = 0;
  const errors: string[] = [];

  for (const image of galleryImages) {
    if (!image.path) continue;

    try {
      // Extract the base filename without extension for thumbnail deletion
      const baseName = path.basename(image.path, path.extname(image.path));

      const filesToDelete = [
        path.join(process.cwd(), 'gallery', image.path), // Original image
        path.join(process.cwd(), 'gallery', 'thmb', `${baseName}.jpg`), // Thumbnail
        path.join(process.cwd(), 'gallery', 'small', `${baseName}.jpg`), // Small version
        path.join(process.cwd(), 'gallery', 'large', `${baseName}.jpg`), // Large version
      ];

      for (const filePath of filesToDelete) {
        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
          deletedFiles++;
        } catch (fileError: unknown) {
          if (
            fileError instanceof Error &&
            'code' in fileError &&
            fileError.code !== 'ENOENT'
          ) {
            errors.push(
              `Failed to delete ${path.basename(filePath)}: ${
                fileError instanceof Error ? fileError.message : String(fileError)
              }`
            );
          }
        }
      }
    } catch (error: unknown) {
      errors.push(
        `Failed to process image ${image.path}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return { deletedFiles, errors };
}

export const resolvers = {
  // Custom scalars
  ...customScalars,

  // Query resolvers
  Query: {
    sites: async (_parent: unknown): Promise<FlyingSite[]> => {
      try {
        const sites = await Site.find();
        return sites;
      } catch (error) {
        throw new Error(`Failed to fetch sites: ${error}`);
      }
    },

    site: async (_parent: unknown, { id }: SiteByIdArgs): Promise<FlyingSite | null> => {
      try {
        const site = await Site.findById(Number(id));
        return site; // Returns null if not found, no error
      } catch (error) {
        throw new Error(`Failed to fetch site: ${error}`);
      }
    },

    sitesByWindDirection: async (
      _parent: unknown,
      { directions }: SitesByWindDirectionArgs
    ): Promise<FlyingSite[]> => {
      try {
        const sites = await Site.find({
          windDirection: { $in: directions },
        });
        return sites;
      } catch (error) {
        throw new Error(`Failed to fetch sites by wind direction: ${error}`);
      }
    },

    validateToken: async (_parent: unknown, { token }: ValidateTokenArgs) => {
      // TODO: Implement token validation logic
      return {
        valid: false,
        message: 'Token validation not implemented yet',
      };
    },
  },

  // Mutation resolvers
  Mutation: {
    createSite: async (
      _parent: unknown,
      { input }: CreateSiteArgs,
      context: GraphQLContext
    ): Promise<FlyingSite> => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      try {
        // Get next ID for your numeric _id system
        const lastSite = await Site.findOne().sort({ _id: -1 });
        const nextId = lastSite ? lastSite._id + 1 : 1;

        const newSite = new Site({
          _id: nextId,
          ...input,
        });

        const savedSite = await newSite.save();
        return savedSite;
      } catch (error) {
        throw new Error(`Failed to create site: ${error}`);
      }
    },

    updateSite: async (
      _parent: unknown,
      { id, input }: UpdateSiteArgs,
      context: GraphQLContext
    ): Promise<FlyingSite> => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      try {
        const updatedSite = await Site.findByIdAndUpdate(Number(id), input, {
          new: true,
          runValidators: true,
        });

        if (!updatedSite) {
          throw new Error('Site not found');
        }

        return updatedSite;
      } catch (error) {
        throw new Error(`Failed to update site: ${error}`);
      }
    },

    unsetSiteFields: async (
      _parent: unknown,
      { id, fields }: UnsetSiteFieldsArgs,
      context: GraphQLContext
    ): Promise<FlyingSite> => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      try {
        // Create unset operation for MongoDB
        const unsetFields: Record<string, 1> = {};
        fields.forEach((field) => {
          unsetFields[field] = 1;
        });

        const updatedSite = await Site.findByIdAndUpdate(
          Number(id),
          { $unset: unsetFields },
          { new: true, runValidators: true }
        );

        if (!updatedSite) {
          throw new Error('Site not found');
        }

        return updatedSite;
      } catch (error) {
        throw new Error(`Failed to unset site fields: ${error}`);
      }
    },

    deleteSite: async (
      _parent: unknown,
      { id }: DeleteSiteArgs,
      context: GraphQLContext
    ): Promise<boolean> => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      try {
        // First, find the site to get its gallery images
        const siteToDelete = await Site.findOne({ _id: Number(id) });
        if (!siteToDelete) {
          throw new Error('Site not found');
        }

        // Delete all gallery images from filesystem
        if (siteToDelete.galleryImages && siteToDelete.galleryImages.length > 0) {
          await deleteSiteImages(siteToDelete.galleryImages);
        }

        // Delete the site from database
        const deletedSite = await Site.findOneAndDelete({ _id: Number(id) });
        return !!deletedSite;
      } catch (error) {
        throw new Error(`Failed to delete site: ${error}`);
      }
    },

    // Auth mutations - TODO: Implement these
    login: async (_parent: unknown, { username, password }: LoginArgs) => {
      throw new Error('Login mutation not implemented yet');
    },

    requestActivation: async (_parent: unknown, { email }: RequestActivationArgs) => {
      throw new Error('Request activation mutation not implemented yet');
    },

    activateAccount: async (
      _parent: unknown,
      { token, username, password }: ActivateAccountArgs
    ) => {
      throw new Error('Activate account mutation not implemented yet');
    },

    createUserAccounts: async (
      _parent: unknown,
      { emails }: CreateUserAccountsArgs,
      context: GraphQLContext
    ) => {
      if (!context.user?.isSuperAdmin) {
        throw new Error('Super admin access required');
      }

      throw new Error('Create user accounts mutation not implemented yet');
    },
  },

  // Field resolvers
  FlyingSite: {
    id: (site: FlyingSite): string => site._id.toString(),
  },

  User: {
    id: (user: { _id: string | number }): string => user._id.toString(),
  },
};
