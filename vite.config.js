import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Relative asset paths keep production bundles portable (including GitHub Pages).
  base: mode === 'production' ? './' : '/',
  plugins: [react(), tailwindcss()],
}))
