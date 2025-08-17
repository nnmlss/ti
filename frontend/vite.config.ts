import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate MUI into its own chunk for better caching
          mui: ['@mui/material', '@mui/icons-material'],
          // Separate Leaflet into its own chunk
          leaflet: ['leaflet', 'react-leaflet'],
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
