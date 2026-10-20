import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  build:{
    assetsInlineLimit: 0
  },
  server: {
    port: 4173,
    allowedHosts: true
  }
})
