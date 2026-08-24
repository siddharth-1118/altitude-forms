import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { app } from './server';

export default defineConfig(() => {
  const formsDir = __dirname;
  const rootDir = path.resolve(formsDir, '..');

  return {
    root: formsDir,
    cacheDir: path.join(rootDir, 'node_modules/.vite-forms'),
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
      outDir: path.join(rootDir, 'dist'),
      emptyOutDir: false,
      rollupOptions: {
        input: path.resolve(formsDir, 'index.html'),
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
