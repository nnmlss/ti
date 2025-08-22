import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware that serves gate.ejs template with showGate=true to show password form
 * When authentication is successful, can serve with showGate=false to show React app
 */
export const gateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip gate if disabled via environment variable
  if (process.env['SITE_ACCESS_PASSWORD'] === 'false') {
    return next();
  }

  console.log('🚪 Gate middleware triggered!');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('URL:', req.url);
  
  // Only handle GET requests that are not API/asset requests
  if (
    req.method === 'GET' && 
    !req.path.startsWith('/api') && 
    !req.path.startsWith('/graphql') && 
    !req.path.startsWith('/gallery') && 
    !req.path.startsWith('/frontend/dist') && 
    !req.path.startsWith('/src') && 
    !req.path.startsWith('/@') &&
    !req.path.endsWith('.woff') &&
    !req.path.endsWith('.woff2')
  ) {
    console.log('✅ Conditions met - serving gate template');
    
    try {
      // For now, always show the gate - later this can be conditional based on authentication
      res.render('gate', { 
        showGate: true, 
        error: null 
      });
      console.log('🎯 Gate template rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering gate template:', error);
      next();
    }
  } else {
    console.log('⏭️ Skipping gate - calling next()');
    next();
  }
};