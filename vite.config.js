import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/thiruk/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true
  }
})
