/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src/"),
      services: resolve(__dirname, "./src/Services/"),
      components: resolve(__dirname, "./src/Components/")
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./tests.setup.ts"
  },
})
