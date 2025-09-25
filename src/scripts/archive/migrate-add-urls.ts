import { connectDB } from '@config/database.js';
import { Site } from '@models/sites.js';

// Generate URL slug from Bulgarian site title
function generateUrlSlug(title: { bg?: string; en?: string }): string {
  const siteTitle = title.bg || title.en || '';
  const slug = siteTitle
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\u0400-\u04FF\w-]/g, '') // Keep only Cyrillic letters, Latin letters, numbers, and hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();
  
  return slug || 'site';
}

async function migrateAddUrls() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get all sites to rebuild ALL URLs
    const sites = await Site.find({});
    console.log(`Found ${sites.length} sites to rebuild URLs`);

    let updated = 0;
    const errors: string[] = [];

    for (const site of sites) {
      try {
        const url = generateUrlSlug(site.title);
        
        // Check if URL already exists
        const existingUrl = await Site.findOne({ url, _id: { $ne: site._id } });
        if (existingUrl) {
          console.warn(`URL conflict: ${url} already exists for site ${existingUrl._id}, skipping site ${site._id}`);
          errors.push(`URL conflict for site ${site._id}: ${url}`);
          continue;
        }

        // Update the site with the URL
        await Site.updateOne({ _id: site._id }, { url });
        console.log(`Updated site ${site._id} (${site.title.bg || site.title.en}) with URL: ${url}`);
        updated++;

      } catch (error) {
        console.error(`Error updating site ${site._id}:`, error);
        errors.push(`Site ${site._id}: ${error}`);
      }
    }

    console.log(`\nMigration completed:`);
    console.log(`- Sites updated: ${updated}`);
    console.log(`- Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(error => console.log(`  - ${error}`));
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run migration
migrateAddUrls();