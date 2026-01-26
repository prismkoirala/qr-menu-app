// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← Add this

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← Add this line
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // REMOVE or COMMENT OUT this line:
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
})