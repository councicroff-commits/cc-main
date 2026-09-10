import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Allows external access (e.g., from your phone browser)
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Ensures HMR (Hot Module Replacement) works consistently in Termux/mobile
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
    },
    // 🔥 ADDED PROXY TO ROUTE API REQUESTS TO PYTHON 🔥
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Added for better build performance and clean paths
  build: {
    sourcemap: true,
  },
});
