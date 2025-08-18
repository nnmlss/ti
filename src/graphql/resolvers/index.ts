import { Site } from '@models/sites.js';
import { User } from '@models/user.js';
import { customScalars } from '../scalars/index.js';
import { TokenService } from '@services/tokenService.js';
import { EmailService } from '@services/emailService.js';
import { generateToken } from '@middleware/auth.js';
import { ACTIVATION_TOKEN_EXPIRY_MINUTES } from '@config/constants.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs/promises';

import type {
  GraphQLContext,
  FlyingSite,
  GalleryImage,
  User as UserType,
  SiteByIdArgs,
  SitesByWindDirectionArgs,
  CreateSiteArgs,
  UpdateSiteArgs,
  DeleteSiteArgs,
  UnsetSiteFieldsArgs,
  LoginArgs,
  RequestActivationArgs,
  ActivateAccountArgs,
  ValidateTokenArgs,
  CreateUserAccountsArgs,
  UpdateProfileArgs,
} from '@types';

// Generate URL slug from Bulgarian site title
function generateUrlSlug(title: { bg?: string; en?: string }): string {
  const siteTitle = title.bg || title.en || '';
  const slug = siteTitle
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();

  return slug || 'site';
}

// Function to delete all images associated with a site
async function deleteSiteImages(
  galleryImages: GalleryImage[]
): Promise<{ deletedFiles: number; errors: string[] }> {
  if (!galleryImages || galleryImages.length === 0) {
    return { deletedFiles: 0, errors: [] };
  }

  console.log(`🗂️ Current working directory: ${process.cwd()}`);
  console.log(`🖼️ Deleting ${galleryImages.length} images from site`);

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
          console.log(`🗑️ Attempting to delete: ${filePath}`);
          await fs.access(filePath);
          console.log(`✅ File exists, deleting: ${filePath}`);
          await fs.unlink(filePath);
          deletedFiles++;
          console.log(`✅ Successfully deleted: ${filePath}`);
        } catch (fileError: unknown) {
          if (
            fileError instanceof Error &&
            'code' in fileError &&
            fileError.code !== 'ENOENT'
          ) {
            console.log(`❌ Error deleting ${filePath}:`, fileError.message);
            errors.push(
              `Failed to delete ${path.basename(filePath)}: ${
                fileError instanceof Error ? fileError.message : String(fileError)
              }`
            );
          } else {
            console.log(`⚠️ File not found (expected): ${filePath}`);
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
        const sites = await Site.find().sort({ _id: 1 });
        return sites;
      } catch (error) {
        throw new Error(`Failed to fetch sites: ${error}`);
      }
    },

    site: async (_parent: unknown, { id }: SiteByIdArgs): Promise<FlyingSite | null> => {
      try {
        // First try to find by URL (clean approach)
        let site = await Site.findOne({ url: id });
        if (site) return site;

        // Fallback: try to find by numeric ID (for backward compatibility)
        if (/^\d+$/.test(id)) {
          site = await Site.findOne({ _id: Number(id) });
          if (site) return site;
        }

        return null; // Not found
      } catch (error) {
        console.error('Site lookup error:', error);
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
        }).sort({ _id: 1 });
        return sites;
      } catch (error) {
        throw new Error(`Failed to fetch sites by wind direction: ${error}`);
      }
    },

    constants: async (): Promise<{ activationTokenExpiryMinutes: number }> => {
      return {
        activationTokenExpiryMinutes: ACTIVATION_TOKEN_EXPIRY_MINUTES,
      };
    },

    validateToken: async (_parent: unknown, { token }: ValidateTokenArgs) => {
      if (!token) {
        return {
          valid: false,
          message: 'Token is required',
        };
      }

      try {
        const user = await TokenService.validateToken(token);

        if (!user) {
          return {
            valid: false,
            message: 'Invalid or expired token',
          };
        }

        return {
          valid: true,
          message: 'Token is valid',
        };
      } catch (error) {
        return {
          valid: false,
          message: `Token validation failed: ${error}`,
        };
      }
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

        // Generate URL slug if not provided
        const url = input.url || generateUrlSlug(input.title);

        // Check if URL already exists
        const existingUrl = await Site.findOne({ url });
        if (existingUrl) {
          throw new Error(`URL "${url}" already exists`);
        }

        const newSite = new Site({
          _id: nextId,
          ...input,
          url,
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
        // Handle URL generation if title changed
        const updateData = { ...input };
        if (input.title && !input.url) {
          const newUrl = generateUrlSlug(input.title);
          // Check if new URL conflicts with existing sites (excluding current site)
          const existingUrl = await Site.findOne({ url: newUrl, _id: { $ne: Number(id) } });
          if (existingUrl) {
            throw new Error(`URL "${newUrl}" already exists`);
          }
          updateData.url = newUrl;
        }

        const updatedSite = await Site.findOneAndUpdate({ _id: Number(id) }, updateData, {
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

    // Auth mutations
    login: async (_parent: unknown, { username, password }: LoginArgs) => {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      try {
        // Find user by username
        const user = await User.findOne({ username, isActive: true });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = generateToken(user);

        return {
          token,
          user: {
            _id: user._id, // Use _id so the field resolver can convert it to id
            email: user.email,
            username: user.username || '',
            isActive: user.isActive,
            isSuperAdmin: user.isSuperAdmin || false,
          },
          message: 'Login successful',
        };
      } catch (error) {
        throw new Error(`Login failed: ${error}`);
      }
    },

    requestActivation: async (_parent: unknown, { email }: RequestActivationArgs) => {
      if (!email) {
        throw new Error('Email is required');
      }

      try {
        // Generate token (returns null if user doesn't exist)
        const token = await TokenService.generateActivationToken(email);

        if (token) {
          // Send activation email
          await EmailService.sendActivationEmail(email, token);
        }

        // Always return the same message to prevent email enumeration
        return {
          success: true,
          message: 'If your email is registered, you will receive an activation link.',
        };
      } catch (error) {
        throw new Error(`Request activation failed: ${error}`);
      }
    },

    activateAccount: async (
      _parent: unknown,
      { token, username, password }: ActivateAccountArgs
    ) => {
      if (!token || !username || !password) {
        throw new Error('Token, username, and password are required');
      }

      if (username.trim().length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      if (password.trim().length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      try {
        // Validate token first
        const user = await TokenService.validateToken(token);

        if (!user) {
          throw new Error('Invalid or expired token');
        }

        // Hash password
        const passEnc = await bcrypt.hash(password, 15);

        // Update user with username, password and activate account
        await User.updateOne(
          { _id: user._id },
          {
            username: username.trim(),
            password: passEnc,
            isActive: true,
          }
        );

        // Clear the token
        await TokenService.clearToken(token);

        // Generate JWT token for immediate login
        const jwtToken = generateToken({
          _id: user._id,
          email: user.email,
          username: username.trim(),
          isActive: true,
          isSuperAdmin: user.isSuperAdmin || false,
        });

        // Send activation success email
        try {
          await EmailService.sendActivationSuccessEmail(user.email, username.trim());
        } catch (emailError) {
          // Log error but don't fail the activation
          console.error('Failed to send activation success email:', emailError);
        }

        const response = {
          token: jwtToken,
          user: {
            _id: user._id, // Use _id for field resolver
            email: user.email,
            username: username.trim(),
            isActive: true,
            isSuperAdmin: user.isSuperAdmin || false,
          },
          message: 'Account activated successfully',
        };

        return response;
      } catch (error) {
        throw new Error(`Account activation failed: ${error}`);
      }
    },

    createUserAccounts: async (
      _parent: unknown,
      { emails }: CreateUserAccountsArgs,
      context: GraphQLContext
    ) => {
      if (!context.user?.isSuperAdmin) {
        throw new Error('Super admin access required');
      }

      if (!Array.isArray(emails) || emails.length === 0) {
        throw new Error('Emails array is required with at least one email');
      }

      const results = [];

      for (const email of emails) {
        try {
          // Validate email format (basic validation)
          if (!email || !email.includes('@')) {
            results.push({
              email: email || 'invalid',
              success: false,
              message: 'Invalid email format',
            });
            continue;
          }

          // Check if user already exists
          const existingUser = await User.findOne({ email });

          if (existingUser) {
            results.push({
              email,
              success: false,
              message: 'User already exists',
            });
            continue;
          }

          // Create user with email only
          const newUser = new User({
            email,
            isActive: false,
          });

          await newUser.save();

          results.push({
            email,
            success: true,
            message: 'Account created successfully',
            id: newUser._id.toString(),
          });
        } catch (userError) {
          console.error('Error creating user:', userError);
          results.push({
            email,
            success: false,
            message: 'Failed to create account',
          });
        }
      }

      return results;
    },

    // Super admin migration
    migrateAddUrls: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user?.isSuperAdmin) {
        throw new Error('Super admin access required');
      }

      try {
        // Get all sites that don't have a url field
        const sites = await Site.find({ url: { $exists: false } });

        let updated = 0;
        const errors: string[] = [];

        for (const site of sites) {
          try {
            const url = generateUrlSlug(site.title);

            // Check if URL already exists
            const existingUrl = await Site.findOne({ url, _id: { $ne: site._id } });
            if (existingUrl) {
              errors.push(`URL conflict for site ${site._id}: ${url} already exists`);
              continue;
            }

            // Update the site with the URL
            await Site.updateOne({ _id: site._id }, { url });
            updated++;
          } catch (error) {
            errors.push(`Site ${site._id}: ${error}`);
          }
        }

        return {
          success: errors.length === 0,
          message: `Migration completed: ${updated} sites updated, ${errors.length} errors`,
          sitesUpdated: updated,
          errors,
        };
      } catch (error) {
        throw new Error(`Migration failed: ${error}`);
      }
    },

    updateProfile: async (
      _parent: unknown,
      { input }: UpdateProfileArgs,
      context: GraphQLContext
    ): Promise<UserType> => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const { email, username, password, currentPassword } = input;

      try {
        // Get current user from database
        const currentUser = await User.findById(context.user.id);
        if (!currentUser) {
          throw new Error('User not found');
        }

        // Verify current password
        if (!currentUser.password) {
          throw new Error('Current password not set');
        }

        const isCurrentPasswordValid = await bcrypt.compare(
          currentPassword,
          currentUser.password
        );
        if (!isCurrentPasswordValid) {
          throw new Error('Current password is incorrect');
        }

        // Prepare update data
        const updateData: Partial<UserType> = {};
        const oldData = {
          email: currentUser.email,
          username: currentUser.username || '',
        };
        const newData = {
          email: email || currentUser.email,
          username: username || currentUser.username || '',
        };

        // Check if email is changing and if it already exists
        if (email && email !== currentUser.email) {
          const existingUser = await User.findOne({ email, _id: { $ne: context.user.id } });
          if (existingUser) {
            throw new Error('Email already exists');
          }
          updateData.email = email;
        }

        // Check if username is changing and if it already exists
        if (username && username !== currentUser.username) {
          if (username.trim().length < 3) {
            throw new Error('Username must be at least 3 characters long');
          }
          const existingUser = await User.findOne({ username, _id: { $ne: context.user.id } });
          if (existingUser) {
            throw new Error('Username already exists');
          }
          updateData.username = username.trim();
        }

        // Update password if provided
        if (password) {
          if (password.trim().length < 6) {
            throw new Error('Password must be at least 6 characters long');
          }
          updateData.password = await bcrypt.hash(password, 15);
        }

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(context.user.id, updateData, {
          new: true,
          runValidators: true,
        });

        if (!updatedUser) {
          throw new Error('Failed to update user');
        }

        // Send email notification if email or username changed
        if (email !== currentUser.email || username !== currentUser.username) {
          try {
            await EmailService.sendProfileChangeNotification(oldData, newData, context.user.id);
          } catch (emailError) {
            // Log error but don't fail the profile update
            console.error('Failed to send profile change notification:', emailError);
          }
        }

        return {
          _id: updatedUser._id,
          email: updatedUser.email,
          username: updatedUser.username || '',
          isActive: updatedUser.isActive,
          isSuperAdmin: updatedUser.isSuperAdmin || false,
        } as UserType;
      } catch (error) {
        throw new Error(`Profile update failed: ${error}`);
      }
    },
  },

  // Field resolvers
  FlyingSite: {
    id: (site: FlyingSite): string => site._id.toString(),
  },

  User: {
    id: (user: UserType): string => user._id.toString(),
  },
};
