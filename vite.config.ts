import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    open: true,
  },
  optimizeDeps: {
    include: [
      // Third-party deps
      'react',
      'react-dom',
      'react-router-dom',
      'react-tabs',
      'formik',
      'react-helmet-async',
      'react-modal',
      'usehooks-ts',
      'clsx',
      'react-icons/gi',
      'react-icons/lu',
      'react-icons/lia',
      'react-icons/gr',
      'react-icons/ti',
      'react-icons/tb',
      'react-icons/si',
      'react-icons/cg',
      'i18next',
      'react-i18next',
      'react-window',
      'react-transition-group',
      'react-tooltip',
      '@tanstack/react-query',
      'dayjs',
      'dayjs/plugin/relativeTime',
      'dayjs/plugin/duration',
    ],
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      interfaces: path.resolve(__dirname, 'src/interfaces'),
      'test-utils': path.resolve(__dirname, 'src/test-utils'),
    },
  },
  worker: {
    format: 'es',
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.ts',
  },
}) satisfies UserConfig;
