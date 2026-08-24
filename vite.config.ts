import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { app } from './forms/server';

export default defineConfig(() => {
  const rootDir = __dirname;

  return {
    root: rootDir,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'express-forms-api',
        configureServer(server) {
          server.middlewares.use(app);
        },
      },
    ],
    optimizeDeps: {
      force: true,
    },
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(rootDir, 'forms/index.html'),
      },
    },
    server: {
      port: 3003,
      strictPort: true,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
