import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from the root of the custom domain taltools.site, so base is '/'.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
