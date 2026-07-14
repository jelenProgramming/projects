import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes the build work on any static host (Vercel, Netlify, GitHub Pages subpath)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Split KaTeX (parser + fonts CSS) into its own chunk so it doesn't bloat
    // the main bundle; it's only needed on pages that render formulas.
    rollupOptions: {
      output: {
        manualChunks: {
          katex: ['katex'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
