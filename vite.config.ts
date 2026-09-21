import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      {
        name: 'serve-murrplastik-static-html',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const rawUrl = req.url || '';
            const urlPath = rawUrl.split('?')[0];
            if (urlPath === '/murrplastik' || urlPath === '/murrplastik/') {
              req.url = '/murrplastik/index.html' + (rawUrl.includes('?') ? '?' + rawUrl.split('?')[1] : '');
            } else if (urlPath.startsWith('/murrplastik/') && !path.extname(urlPath)) {
              const cleanPath = urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath;
              const diskPath = path.join(__dirname, 'public', cleanPath, 'index.html');
              if (fs.existsSync(diskPath)) {
                req.url = cleanPath + '/index.html' + (rawUrl.includes('?') ? '?' + rawUrl.split('?')[1] : '');
              }
            }
            next();
          });
        },
      },
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
  };
});

