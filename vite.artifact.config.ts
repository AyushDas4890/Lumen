import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Single-bundle build for publishing as an Artifact (fixed file names, no code splitting).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: process.env.ARTIFACT_OUT ?? 'dist-artifact',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
      },
    },
  },
});
