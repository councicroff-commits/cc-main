import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Turn off sourcemaps for production to reduce bundle size and protect source code
    outDir: 'dist',
  },
});
