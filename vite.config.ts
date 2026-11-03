import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [],
  build: {
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        projectTemplate: fileURLToPath(new URL('./src/projects/projectTemplate.html', import.meta.url)),
        vex2024: fileURLToPath(new URL('./src/projects/vex-2024.html', import.meta.url)),
      }
    }
  },
  server: {
    port: 4173,
    allowedHosts: true
  }
})
