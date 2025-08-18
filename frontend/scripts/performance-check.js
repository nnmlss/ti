#!/usr/bin/env node

/**
 * Performance Budget Checker
 * Analyzes bundle sizes and reports performance metrics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance budgets (gzipped sizes)
const BUDGETS = {
  main: 150, // Main app chunk
  vendor: 200, // Vendor libraries
  route: 50, // Individual route chunks
  total: 400, // Total initial load
};

function analyzeBundle() {
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ Build not found. Run npm run build first.');
    process.exit(1);
  }

  console.log('📊 Performance Budget Analysis\n');

  // Read all JS files in dist/assets
  const assetsPath = path.join(distPath, 'assets');
  const files = fs.readdirSync(assetsPath)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      
      // Categorize chunks
      let category = 'other';
      let budget = BUDGETS.route;
      
      if (file.includes('vendor')) {
        category = 'vendor';
        budget = BUDGETS.vendor;
      } else if (file.includes('index')) {
        category = 'main';
        budget = BUDGETS.main;
      } else if (file.includes('mui') || file.includes('leaflet')) {
        category = 'vendor';
        budget = BUDGETS.vendor;
      }
      
      return {
        name: file,
        size: sizeKB,
        category,
        budget,
        withinBudget: sizeKB <= budget
      };
    })
    .sort((a, b) => b.size - a.size);

  // Display results
  let totalSize = 0;
  let budgetViolations = 0;

  files.forEach(file => {
    totalSize += file.size;
    const status = file.withinBudget ? '✅' : '⚠️';
    const budgetText = file.withinBudget ? '' : ` (budget: ${file.budget}KB)`;
    
    console.log(`${status} ${file.name}: ${file.size}KB${budgetText}`);
    
    if (!file.withinBudget) {
      budgetViolations++;
    }
  });

  console.log('\n📈 Summary:');
  console.log(`Total bundle size: ${totalSize}KB`);
  console.log(`Budget violations: ${budgetViolations}`);
  console.log(`Total within budget: ${totalSize <= BUDGETS.total ? '✅' : '⚠️'} (${BUDGETS.total}KB)`);

  // Performance recommendations
  if (budgetViolations > 0) {
    console.log('\n💡 Recommendations:');
    console.log('- Consider lazy loading for large route chunks');
    console.log('- Split vendor libraries further');
    console.log('- Remove unused dependencies');
    console.log('- Use tree shaking optimizations');
  }

  console.log(`\n📊 Detailed analysis: file://${path.join(distPath, 'stats.html')}`);
  
  return budgetViolations === 0;
}

// Run analysis
const success = analyzeBundle();
process.exit(success ? 0 : 1);