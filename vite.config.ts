import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mirrorDistToBuildPlugin(): Plugin {
  return {
    name: 'mirror-dist-to-build',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const buildDir = path.resolve(__dirname, 'build');
        if (fs.existsSync(distDir)) {
          fs.cpSync(distDir, buildDir, { recursive: true, force: true });
        }
      } catch (err) {
        console.warn('Could not mirror dist to build directory:', err);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mirrorDistToBuildPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
    },
  };
});
