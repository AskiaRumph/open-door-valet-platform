import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/main.jsx',
        valet: 'valet_dashboard_ultimate.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
