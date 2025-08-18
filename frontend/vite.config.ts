import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Performance budgets
    chunkSizeWarningLimit: 300, // Warn if chunk > 300KB (before gzip)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries - highest priority chunks
          if (id.includes('node_modules')) {
            // Separate MUI into its own chunk for better caching
            if (id.includes('@mui/material') || id.includes('@mui/icons-material')) {
              return 'mui';
            }
            // Keep Leaflet with vendor chunk to avoid React context issues
            // if (id.includes('leaflet') || id.includes('react-leaflet')) {
            //   return 'leaflet';
            // }
            // Redux and related state management
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'redux';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // Other vendor dependencies
            return 'vendor';
          }
          
          // Application code chunking
          // Admin pages - separate chunk for super admins only
          if (id.includes('AdminCreateAccounts') || id.includes('Profile')) {
            return 'admin';
          }
          // Authentication flows - separate chunk
          if (id.includes('Login') || id.includes('Activation')) {
            return 'auth';
          }
          // Site management - authenticated users
          if (id.includes('AddSitePage') || id.includes('EditSitePage') || id.includes('EditSite')) {
            return 'site-management';
          }
          // Public pages - default chunk
          if (id.includes('HomePage') || id.includes('SiteDetail')) {
            return 'public';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@containers': path.resolve(__dirname, './src/containers'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@hooks/pages': path.resolve(__dirname, './src/hooks/pages'),
      '@hooks/ui': path.resolve(__dirname, './src/hooks/ui'),
      '@hooks/business': path.resolve(__dirname, './src/hooks/business'),
      '@hooks/utils': path.resolve(__dirname, './src/hooks/utils'),
      '@hooks/auth': path.resolve(__dirname, './src/hooks/auth'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@constants': path.resolve(__dirname, './src/constants.ts'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@app-types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/gallery': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/gallery': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
