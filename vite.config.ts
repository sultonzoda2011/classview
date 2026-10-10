import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/react-router|\/react\/|\/react-dom\//.test(id)) return 'vendor-react'
          if (/@reduxjs|react-redux/.test(id)) return 'vendor-redux'
          if (/@radix-ui/.test(id)) return 'vendor-radix'
          if (/react-hook-form|@hookform|\/zod\//.test(id)) return 'vendor-forms'
          if (/hls\.js/.test(id)) return 'vendor-hls'
          return undefined
        },
      },
    },
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/Streams': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
