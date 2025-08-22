// Script to create CommonJS wrapper for ES module deployment
import fs from 'fs';
import path from 'path';

const wrapperContent = `// CommonJS wrapper for ES module backend
// This file provides compatibility with LiteSpeed's Node.js runner

async function startServer() {
  try {
    // Dynamic import of ES module
    const { default: app } = await import('./app.js');
    
    // The app should already be listening, but if not, start it
    if (app && typeof app.listen === 'function') {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(\`Server started on port \${port}\`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();`;

const distPath = path.join(process.cwd(), 'dist');
const wrapperPath = path.join(distPath, 'server.cjs');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Write the wrapper file
fs.writeFileSync(wrapperPath, wrapperContent);

console.log('CommonJS wrapper created at dist/server.cjs');