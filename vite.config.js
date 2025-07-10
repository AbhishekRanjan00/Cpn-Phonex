import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ✔ Required for Netlify

  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 👉 LOCAL BACKEND
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
