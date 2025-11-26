import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
    routesDirectory: './src/routes',
    generatedRouteTree: './src/routeTree.gen.ts',
  }),
    react()],
  server: {
    port: 5173,
    proxy: {
      // localhost:8081/api/xxx -> localhost:8081/api/xxx
      '/api': {
        target: 'https://localhost:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log("Proxying:",path);
          return path;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url, "=>", proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', req.url, "=>", proxyRes.statusCode);
          });
        }
      }
    },
  }
})