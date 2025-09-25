#!/usr/bin/env node
import 'dotenv/config';
import mongoose from 'mongoose';
import { program } from 'commander';
import { connectDB } from '../config/database.js';
import { logger } from '../config/logger.js';
import { Site } from '../models/sites.js';
import { EmailService } from '../services/emailService.js';

// Version from package.json
const version = '1.0.0';

program
  .name('takeoff-admin')
  .description('TakeOff Info Admin CLI - Administrative commands for the paragliding sites application')
  .version(version);

// Database commands
program
  .command('db:status')
  .description('Check database connection status')
  .action(async () => {
    try {
      await connectDB();
      const stats = await mongoose.connection.db?.stats();
      const siteCount = await Site.countDocuments();

      logger.info('Database status check completed', {
        status: 'connected',
        database: mongoose.connection.name,
        collections: stats?.['collections'] || 0,
        dataSize: `${((stats?.['dataSize'] || 0) / 1024 / 1024).toFixed(2)} MB`,
        siteCount
      });

      console.log('✅ Database Status:');
      console.log(`   Connection: Connected to ${mongoose.connection.name}`);
      console.log(`   Collections: ${stats?.['collections'] || 0}`);
      console.log(`   Data Size: ${((stats?.['dataSize'] || 0) / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Flying Sites: ${siteCount}`);

      process.exit(0);
    } catch (error) {
      logger.error('Database status check failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  });

program
  .command('db:backup')
  .description('Create a backup of the database')
  .option('-o, --output <path>', 'Output file path', `backup-${new Date().toISOString().split('T')[0]}.json`)
  .action(async (options) => {
    try {
      await connectDB();

      const sites = await Site.find({}).lean();
      const backup = {
        timestamp: new Date().toISOString(),
        version: version,
        sites: sites
      };

      const fs = await import('fs/promises');
      await fs.writeFile(options.output, JSON.stringify(backup, null, 2), 'utf8');

      logger.info('Database backup created', {
        outputFile: options.output,
        siteCount: sites.length
      });

      console.log(`✅ Backup created: ${options.output}`);
      console.log(`   Sites backed up: ${sites.length}`);

      process.exit(0);
    } catch (error) {
      logger.error('Database backup failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      console.error('❌ Backup failed:', error);
      process.exit(1);
    }
  });

// Site management commands
program
  .command('sites:list')
  .description('List all flying sites')
  .option('-l, --limit <number>', 'Limit number of results', '10')
  .option('-f, --format <format>', 'Output format (table|json)', 'table')
  .action(async (options) => {
    try {
      await connectDB();

      const limit = parseInt(options.limit);
      const sites = await Site.find({})
        .select('_id title location altitude')
        .limit(limit)
        .lean();

      if (options.format === 'json') {
        console.log(JSON.stringify(sites, null, 2));
      } else {
        console.log('\n📍 Flying Sites:');
        console.log('─'.repeat(80));
        sites.forEach(site => {
          const title = typeof site.title === 'object' ? (site.title.bg || site.title.en || 'Untitled') : 'Untitled';
          const coords = site.location?.coordinates ?
            `${site.location.coordinates[1]?.toFixed(4)}, ${site.location.coordinates[0]?.toFixed(4)}` :
            'No coordinates';
          console.log(`${site._id.toString().padEnd(6)} | ${title.padEnd(25)} | ${coords.padEnd(20)} | ${site.altitude || 'N/A'}m`);
        });
        console.log('─'.repeat(80));
        console.log(`Showing ${sites.length} of total sites (use --limit to see more)`);
      }

      logger.info('Sites list command executed', {
        limit,
        format: options.format,
        resultCount: sites.length
      });

      process.exit(0);
    } catch (error) {
      logger.error('Sites list command failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      console.error('❌ Failed to list sites:', error);
      process.exit(1);
    }
  });

program
  .command('sites:validate')
  .description('Validate all sites for data integrity')
  .action(async () => {
    try {
      await connectDB();

      const sites = await Site.find({}).lean();
      const issues: string[] = [];

      sites.forEach(site => {
        // Check required fields
        if (!site.title || (typeof site.title === 'object' && !site.title.bg && !site.title.en)) {
          issues.push(`Site ${site._id}: Missing or empty title`);
        }

        if (!site.location || !site.location.coordinates || site.location.coordinates.length !== 2) {
          issues.push(`Site ${site._id}: Invalid location coordinates`);
        }

        if (!site.windDirection || !Array.isArray(site.windDirection) || site.windDirection.length === 0) {
          issues.push(`Site ${site._id}: Missing wind directions`);
        }

        // Check coordinate bounds for Bulgaria
        if (site.location?.coordinates) {
          const [lng, lat] = site.location.coordinates;
          if (lng < 22 || lng > 29 || lat < 41 || lat > 45) {
            issues.push(`Site ${site._id}: Coordinates outside Bulgaria bounds`);
          }
        }
      });

      logger.info('Site validation completed', {
        totalSites: sites.length,
        issuesFound: issues.length
      });

      if (issues.length === 0) {
        console.log('✅ All sites are valid!');
        console.log(`   Validated ${sites.length} sites with no issues found.`);
      } else {
        console.log(`⚠️  Found ${issues.length} validation issues:`);
        issues.forEach(issue => console.log(`   - ${issue}`));
      }

      process.exit(issues.length > 0 ? 1 : 0);
    } catch (error) {
      logger.error('Site validation failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      console.error('❌ Validation failed:', error);
      process.exit(1);
    }
  });

// Email service commands
program
  .command('email:test')
  .description('Test email service configuration')
  .option('-t, --to <email>', 'Test recipient email', 'test@example.com')
  .action(async (options) => {
    try {
      await EmailService.initialize();

      // Send test email using activation email method with dummy token
      const testToken = 'test-token-' + Date.now();
      const result = await EmailService.sendActivationEmail(options.to, testToken);

      logger.info('Test email sent', {
        recipient: options.to,
        success: result
      });

      if (result) {
        console.log('✅ Test email sent successfully!');
        console.log(`   Recipient: ${options.to}`);
        console.log('   Note: This was sent as an activation email for testing purposes');
      } else {
        throw new Error('Email sending failed');
      }

      process.exit(0);
    } catch (error) {
      logger.error('Email test failed', {
        error: error instanceof Error ? error.message : String(error),
        recipient: options.to
      });
      console.error('❌ Email test failed:', error);
      process.exit(1);
    }
  });

// System commands
program
  .command('system:health')
  .description('Comprehensive system health check')
  .action(async () => {
    console.log('🔍 System Health Check');
    console.log('═'.repeat(50));

    let allHealthy = true;

    // Database check
    try {
      await connectDB();
      const siteCount = await Site.countDocuments();
      console.log('✅ Database: Connected');
      console.log(`   Sites in database: ${siteCount}`);
      logger.info('Health check - Database OK', { siteCount });
    } catch (error) {
      console.log('❌ Database: Connection failed');
      console.log(`   Error: ${error}`);
      logger.error('Health check - Database failed', { error: String(error) });
      allHealthy = false;
    }

    // Email service check
    try {
      await EmailService.initialize();
      console.log('✅ Email Service: Available');
      logger.info('Health check - Email service OK');
    } catch (error) {
      console.log('❌ Email Service: Unavailable');
      console.log(`   Error: ${error}`);
      logger.warn('Health check - Email service failed', { error: String(error) });
      // Email failure doesn't make system unhealthy
    }

    // Environment check
    const requiredEnvVars = ['MONGO_URI', 'NODE_ENV'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingEnvVars.length === 0) {
      console.log('✅ Environment: Configuration complete');
      logger.info('Health check - Environment OK');
    } else {
      console.log('⚠️  Environment: Missing variables');
      console.log(`   Missing: ${missingEnvVars.join(', ')}`);
      logger.warn('Health check - Environment issues', { missingEnvVars });
    }

    console.log('═'.repeat(50));

    if (allHealthy) {
      console.log('✅ Overall System Status: Healthy');
      logger.info('Health check completed - System healthy');
      process.exit(0);
    } else {
      console.log('❌ Overall System Status: Issues detected');
      logger.warn('Health check completed - System issues detected');
      process.exit(1);
    }
  });

// Logs commands
program
  .command('logs:tail')
  .description('Tail application logs')
  .option('-f, --file <file>', 'Log file to tail (error|combined|http)', 'combined')
  .option('-n, --lines <number>', 'Number of lines to show', '50')
  .action(async (options) => {
    try {
      const fs = await import('fs');
      const path = await import('path');

      const logFile = path.join(process.cwd(), 'logs', `${options.file}.log`);

      if (!fs.existsSync(logFile)) {
        console.log(`❌ Log file does not exist: ${logFile}`);
        process.exit(1);
      }

      const { spawn } = await import('child_process');
      const tail = spawn('tail', ['-f', '-n', options.lines, logFile], {
        stdio: 'inherit'
      });

      console.log(`📋 Tailing ${options.file}.log (${options.lines} lines):`);
      console.log('─'.repeat(80));

      process.on('SIGINT', () => {
        tail.kill();
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ Failed to tail logs:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Handle no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}