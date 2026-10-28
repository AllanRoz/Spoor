import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // relative base ensures zero-config GitHub Pages compatibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react', 'canvas-confetti'],
          'animal-data': [
            './src/data/animals.js',
            './src/data/animals_mammals.js',
            './src/data/animals_birds.js',
            './src/data/animals_reptiles.js',
            './src/data/animals_aquatic_inverts.js',
            './src/data/animals_extra.js',
            './src/data/animal_images.js'
          ]
        }
      }
    }
  }
});
