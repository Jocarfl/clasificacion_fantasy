import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative assets paths for GitHub Pages compatibility
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
