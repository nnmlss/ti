import type { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import type { CustomError } from '@types';

export const generateBuildGuidePDF = async (_req: Request, res: Response) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="production-build-guide.pdf"');

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add title
    doc.fontSize(24)
       .text('TakeOff Info - Production Build Guide', { align: 'center' });

    doc.moveDown(2);

    // Add subtitle
    doc.fontSize(16)
       .text('🏗️ Production Build Process', { underline: true });

    doc.moveDown(1);

    // Quick Commands section
    doc.fontSize(14)
       .text('Quick Commands:', { continued: false });

    doc.moveDown(0.5);

    doc.fontSize(11)
       .font('Courier')
       .text('# Full production build (backend + frontend)')
       .text('npm run build')
       .text('')
       .text('# Individual builds')
       .text('npm run build:backend    # TypeScript compilation to dist/')
       .text('npm run build:frontend   # Vite production build');

    doc.moveDown(1);

    // Step-by-Step Process
    doc.fontSize(14)
       .font('Helvetica')
       .text('Step-by-Step Process:');

    doc.fontSize(12)
       .text('1. Pre-build Checks:', { continued: false });

    doc.fontSize(11)
       .font('Courier')
       .text('   npm run typecheck  # Check for TypeScript errors')
       .text('   npm run test:run   # Run tests (optional)');

    doc.moveDown(0.5);

    doc.fontSize(12)
       .font('Helvetica')
       .text('2. Build Everything:');

    doc.fontSize(11)
       .font('Courier')
       .text('   npm run build  # Runs both backend and frontend builds');

    doc.moveDown(0.5);

    doc.fontSize(12)
       .font('Helvetica')
       .text('3. Verify Build Output:');

    doc.fontSize(11)
       .font('Courier')
       .text('   ls dist/              # Check backend build')
       .text('   ls frontend/dist/     # Check frontend build')
       .text('   cd frontend && npm run preview  # Test locally (optional)');

    doc.moveDown(1);

    // What Gets Built section
    doc.fontSize(14)
       .font('Helvetica')
       .text('What Gets Built:');

    doc.fontSize(12)
       .text('Backend (dist/):')
       .fontSize(11)
       .text('  • Compiled TypeScript → JavaScript')
       .text('  • Path aliases resolved via tsc-alias')
       .text('  • GraphQL import fixes applied')
       .text('  • Ready for node dist/app.js');

    doc.moveDown(0.5);

    doc.fontSize(12)
       .text('Frontend (frontend/dist/):')
       .fontSize(11)
       .text('  • Optimized React bundle (~557KB vendor chunk)')
       .text('  • Compressed assets (gzip)')
       .text('  • Static HTML with SEO meta tags')
       .text('  • Font files and images');

    doc.moveDown(1);

    // Files to Deploy section
    doc.fontSize(14)
       .font('Helvetica')
       .text('Files to Deploy:');

    doc.fontSize(11)
       .font('Courier')
       .text('dist/                    # Backend (Node.js)')
       .text('frontend/dist/           # Frontend (static files)')
       .text('package.json            # Dependencies')
       .text('package-lock.json       # Version locks')
       .text('.env                    # Environment variables')
       .text('gallery/                # Create empty folder for uploads');

    doc.moveDown(1);

    // Server Setup section
    doc.fontSize(14)
       .font('Helvetica')
       .text('Server Setup Commands:');

    doc.fontSize(11)
       .font('Courier')
       .text('# Install only production dependencies')
       .text('npm install --production')
       .text('')
       .text('# Create gallery directory if not exists')
       .text('mkdir -p gallery')
       .text('chmod 755 gallery')
       .text('')
       .text('# Start the application')
       .text('NODE_ENV=production node dist/app.js');

    doc.moveDown(1);

    // Environment Variables section
    doc.fontSize(14)
       .font('Helvetica')
       .text('Required Environment Variables:');

    doc.fontSize(11)
       .font('Courier')
       .text('NODE_ENV=production')
       .text('SESSION_SECRET=<64-character-random-string>')
       .text('JWT_SECRET=<64-character-random-string>')
       .text('MONGO_URI=mongodb://username:password@host:port/database')
       .text('SMTP_HOST=mail.borislav.space')
       .text('SMTP_PORT=465')
       .text('SMTP_USER=fly@borislav.space')
       .text('SMTP_PASS=<your-email-password>')
       .text('FRONTEND_URL=https://your-subdomain.borislav.space');

    doc.moveDown(1);

    // Footer
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    const customError: CustomError = {
      message: 'Failed to generate PDF',
      status: 500,
      name: 'PDFGenerationError',
    };
    throw customError;
  }
};