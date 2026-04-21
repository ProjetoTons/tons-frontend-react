import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Adicione esta linha

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // Isso diz que toda vez que você usar "@", ele deve olhar para a pasta "src" inicialmente
      '@': path.resolve(__dirname, './src'),
    },
  },
})