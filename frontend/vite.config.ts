import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@features': '/src/features',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@store': '/src/store',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@mocks': '/src/mocks',
      '@types': '/src/types'
    }
  },
  server: {
    port: 3001,
    host: 'localhost',
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3001
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify('0.1.0')
  }
});
