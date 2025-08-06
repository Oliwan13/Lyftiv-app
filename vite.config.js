import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Project root directory (where index.html is)
  root: 'src',
  // Base public path when served in development or production
  base: './',
  // Directory to serve as plain static assets
  publicDir: '../public',
  build: {
    // Directory to output build files
    outDir: '../dist',
    // Empty the output directory before building
    emptyOutDir: true,
  },
});
