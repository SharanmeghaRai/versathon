import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This file tells Vite (our build tool) to use React.
// You will not need to edit this file.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
